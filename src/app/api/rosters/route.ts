import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, logAudit } from '@/lib/security';
import { createRosterSchema, addPlayerSchema } from '@/lib/validations';

export async function GET(request: NextRequest) {
  const { error, user } = await requireAuth();
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const teamId = searchParams.get('teamId');

  if (!teamId) {
    return NextResponse.json({ error: 'teamId is required' }, { status: 400 });
  }

  const rosters = await prisma.roster.findMany({
    where: { teamId },
    include: {
      players: { orderBy: { lastName: 'asc' } },
      season: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ rosters });
}

export async function POST(request: NextRequest) {
  const { error, user } = await requireAuth();
  if (error) return error;

  try {
    const body = await request.json();
    const validated = createRosterSchema.parse(body);

    // Verify user has permission on the team
    const membership = await prisma.teamMember.findUnique({
      where: { teamId_userId: { teamId: validated.teamId, userId: user!.id } },
    });

    if (!membership || !['OWNER', 'COACH', 'ASSISTANT_COACH'].includes(membership.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const roster = await prisma.roster.create({
      data: validated,
      include: { players: true },
    });

    await logAudit(user!.id, 'CREATE', 'roster', roster.id, { teamId: validated.teamId });

    return NextResponse.json({ roster }, { status: 201 });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
