import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, logAudit } from '@/lib/security';
import { addPlayerSchema } from '@/lib/validations';

export async function POST(
  request: NextRequest,
  { params }: { params: { rosterId: string } }
) {
  const { error, user } = await requireAuth();
  if (error) return error;

  try {
    const body = await request.json();
    const validated = addPlayerSchema.parse(body);

    const roster = await prisma.roster.findUnique({
      where: { id: params.rosterId },
      select: { teamId: true },
    });

    if (!roster) {
      return NextResponse.json({ error: 'Roster not found' }, { status: 404 });
    }

    const membership = await prisma.teamMember.findUnique({
      where: { teamId_userId: { teamId: roster.teamId, userId: user!.id } },
    });

    if (!membership || !['OWNER', 'COACH', 'ASSISTANT_COACH'].includes(membership.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const player = await prisma.rosterPlayer.create({
      data: {
        rosterId: params.rosterId,
        ...validated,
        dateOfBirth: validated.dateOfBirth ? new Date(validated.dateOfBirth) : undefined,
      },
    });

    await logAudit(user!.id, 'ADD_PLAYER', 'roster', params.rosterId, { playerId: player.id });

    return NextResponse.json({ player }, { status: 201 });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { rosterId: string } }
) {
  const { error, user } = await requireAuth();
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const playerId = searchParams.get('playerId');

  if (!playerId) {
    return NextResponse.json({ error: 'playerId is required' }, { status: 400 });
  }

  const roster = await prisma.roster.findUnique({
    where: { id: params.rosterId },
    select: { teamId: true },
  });

  if (!roster) {
    return NextResponse.json({ error: 'Roster not found' }, { status: 404 });
  }

  const membership = await prisma.teamMember.findUnique({
    where: { teamId_userId: { teamId: roster.teamId, userId: user!.id } },
  });

  if (!membership || !['OWNER', 'COACH'].includes(membership.role)) {
    return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
  }

  await prisma.rosterPlayer.delete({ where: { id: playerId } });
  await logAudit(user!.id, 'REMOVE_PLAYER', 'roster', params.rosterId, { playerId });

  return NextResponse.json({ success: true });
}
