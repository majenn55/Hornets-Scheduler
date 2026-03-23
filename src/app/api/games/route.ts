import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, logAudit } from '@/lib/security';
import { createGameSchema } from '@/lib/validations';

export async function GET(request: NextRequest) {
  const { error, user } = await requireAuth();
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const seasonId = searchParams.get('seasonId');
  const teamId = searchParams.get('teamId');
  const status = searchParams.get('status');
  const upcoming = searchParams.get('upcoming') === 'true';

  const games = await prisma.game.findMany({
    where: {
      ...(seasonId && { seasonId }),
      ...(teamId && {
        OR: [{ homeTeamId: teamId }, { awayTeamId: teamId }],
      }),
      ...(status && { status: status as any }),
      ...(upcoming && { scheduledAt: { gte: new Date() }, status: 'SCHEDULED' }),
    },
    include: {
      homeTeam: { select: { id: true, name: true, logoUrl: true, primaryColor: true } },
      awayTeam: { select: { id: true, name: true, logoUrl: true, primaryColor: true } },
      season: { select: { id: true, name: true } },
      _count: { select: { stats: true, media: true, streams: true } },
    },
    orderBy: { scheduledAt: 'asc' },
  });

  return NextResponse.json({ games });
}

export async function POST(request: NextRequest) {
  const { error, user } = await requireAuth();
  if (error) return error;

  try {
    const body = await request.json();
    const validated = createGameSchema.parse(body);

    if (validated.homeTeamId === validated.awayTeamId) {
      return NextResponse.json({ error: 'Home and away teams must be different' }, { status: 400 });
    }

    const season = await prisma.season.findUnique({
      where: { id: validated.seasonId },
      select: { leagueId: true },
    });

    if (!season) {
      return NextResponse.json({ error: 'Season not found' }, { status: 404 });
    }

    const membership = await prisma.leagueMember.findUnique({
      where: { leagueId_userId: { leagueId: season.leagueId, userId: user!.id } },
    });

    if (!membership || !['COMMISSIONER', 'ADMIN', 'MANAGER'].includes(membership.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const game = await prisma.game.create({
      data: {
        ...validated,
        scheduledAt: new Date(validated.scheduledAt),
      },
      include: {
        homeTeam: { select: { id: true, name: true } },
        awayTeam: { select: { id: true, name: true } },
      },
    });

    await logAudit(user!.id, 'CREATE', 'game', game.id);

    return NextResponse.json({ game }, { status: 201 });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
