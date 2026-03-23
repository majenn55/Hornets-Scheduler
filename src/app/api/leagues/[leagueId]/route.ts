import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, logAudit } from '@/lib/security';

export async function GET(
  request: NextRequest,
  { params }: { params: { leagueId: string } }
) {
  const { error, user } = await requireAuth();
  if (error) return error;

  const league = await prisma.league.findUnique({
    where: { id: params.leagueId },
    include: {
      members: {
        include: {
          user: { select: { id: true, firstName: true, lastName: true, email: true, avatarUrl: true } },
        },
      },
      teams: {
        include: { _count: { select: { members: true } } },
      },
      seasons: { orderBy: { startDate: 'desc' } },
      _count: { select: { members: true, teams: true, seasons: true } },
    },
  });

  if (!league) {
    return NextResponse.json({ error: 'League not found' }, { status: 404 });
  }

  return NextResponse.json({ league });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { leagueId: string } }
) {
  const { error, user } = await requireAuth();
  if (error) return error;

  const membership = await prisma.leagueMember.findUnique({
    where: { leagueId_userId: { leagueId: params.leagueId, userId: user!.id } },
  });

  if (!membership || membership.role !== 'COMMISSIONER') {
    return NextResponse.json({ error: 'Only commissioner can delete league' }, { status: 403 });
  }

  await prisma.league.delete({ where: { id: params.leagueId } });
  await logAudit(user!.id, 'DELETE', 'league', params.leagueId);

  return NextResponse.json({ success: true });
}
