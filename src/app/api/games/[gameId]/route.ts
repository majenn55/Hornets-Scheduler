import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, logAudit } from '@/lib/security';
import { updateGameScoreSchema } from '@/lib/validations';

export async function GET(
  request: NextRequest,
  { params }: { params: { gameId: string } }
) {
  const { error, user } = await requireAuth();
  if (error) return error;

  const game = await prisma.game.findUnique({
    where: { id: params.gameId },
    include: {
      homeTeam: {
        select: { id: true, name: true, logoUrl: true, primaryColor: true },
      },
      awayTeam: {
        select: { id: true, name: true, logoUrl: true, primaryColor: true },
      },
      season: { select: { id: true, name: true, leagueId: true } },
      stats: {
        include: {
          rosterPlayer: { select: { id: true, firstName: true, lastName: true, jerseyNumber: true } },
        },
      },
      media: { orderBy: { createdAt: 'desc' }, take: 20 },
      streams: { where: { status: 'LIVE' } },
    },
  });

  if (!game) {
    return NextResponse.json({ error: 'Game not found' }, { status: 404 });
  }

  return NextResponse.json({ game });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { gameId: string } }
) {
  const { error, user } = await requireAuth();
  if (error) return error;

  try {
    const body = await request.json();
    const validated = updateGameScoreSchema.parse(body);

    const game = await prisma.game.update({
      where: { id: params.gameId },
      data: validated,
      include: {
        homeTeam: { select: { id: true, name: true } },
        awayTeam: { select: { id: true, name: true } },
      },
    });

    await logAudit(user!.id, 'UPDATE_SCORE', 'game', game.id, {
      homeScore: validated.homeScore,
      awayScore: validated.awayScore,
    });

    return NextResponse.json({ game });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
