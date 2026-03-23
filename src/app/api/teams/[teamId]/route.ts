import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, logAudit } from '@/lib/security';
import { updateTeamSchema } from '@/lib/validations';

export async function GET(
  request: NextRequest,
  { params }: { params: { teamId: string } }
) {
  const { error, user } = await requireAuth();
  if (error) return error;

  const team = await prisma.team.findUnique({
    where: { id: params.teamId },
    include: {
      league: { select: { id: true, name: true } },
      members: {
        include: {
          user: { select: { id: true, firstName: true, lastName: true, email: true, avatarUrl: true } },
        },
      },
      rosters: {
        include: {
          players: true,
          season: { select: { id: true, name: true } },
        },
      },
      _count: { select: { homeGames: true, awayGames: true, media: true } },
    },
  });

  if (!team) {
    return NextResponse.json({ error: 'Team not found' }, { status: 404 });
  }

  return NextResponse.json({ team });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { teamId: string } }
) {
  const { error, user } = await requireAuth();
  if (error) return error;

  const membership = await prisma.teamMember.findUnique({
    where: { teamId_userId: { teamId: params.teamId, userId: user!.id } },
  });

  if (!membership || !['OWNER', 'COACH'].includes(membership.role)) {
    return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const validated = updateTeamSchema.parse(body);

    const team = await prisma.team.update({
      where: { id: params.teamId },
      data: validated,
    });

    await logAudit(user!.id, 'UPDATE', 'team', team.id);

    return NextResponse.json({ team });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { teamId: string } }
) {
  const { error, user } = await requireAuth();
  if (error) return error;

  const membership = await prisma.teamMember.findUnique({
    where: { teamId_userId: { teamId: params.teamId, userId: user!.id } },
  });

  if (!membership || membership.role !== 'OWNER') {
    return NextResponse.json({ error: 'Only team owner can delete the team' }, { status: 403 });
  }

  await prisma.team.delete({ where: { id: params.teamId } });
  await logAudit(user!.id, 'DELETE', 'team', params.teamId);

  return NextResponse.json({ success: true });
}
