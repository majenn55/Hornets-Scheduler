import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, logAudit } from '@/lib/security';
import {
  soccerStatSchema,
  softballStatSchema,
  basketballStatSchema,
} from '@/lib/validations';

function getStatSchema(sportType: string) {
  switch (sportType) {
    case 'SOCCER': return soccerStatSchema;
    case 'SOFTBALL': return softballStatSchema;
    case 'BASKETBALL': return basketballStatSchema;
    default: return null;
  }
}

export async function GET(request: NextRequest) {
  const { error, user } = await requireAuth();
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const gameId = searchParams.get('gameId');
  const rosterPlayerId = searchParams.get('rosterPlayerId');

  const stats = await prisma.playerStat.findMany({
    where: {
      ...(gameId && { gameId }),
      ...(rosterPlayerId && { rosterPlayerId }),
    },
    include: {
      rosterPlayer: {
        select: { id: true, firstName: true, lastName: true, jerseyNumber: true, position: true },
      },
      game: {
        select: {
          id: true,
          scheduledAt: true,
          homeTeam: { select: { id: true, name: true } },
          awayTeam: { select: { id: true, name: true } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ stats });
}

export async function POST(request: NextRequest) {
  const { error, user } = await requireAuth();
  if (error) return error;

  try {
    const body = await request.json();
    const { gameId, rosterPlayerId, sportType, statData } = body;

    if (!gameId || !rosterPlayerId || !sportType || !statData) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const schema = getStatSchema(sportType);
    if (!schema) {
      return NextResponse.json({ error: 'Invalid sport type' }, { status: 400 });
    }

    const validatedStats = schema.parse(statData);

    const stat = await prisma.playerStat.upsert({
      where: {
        gameId_rosterPlayerId: { gameId, rosterPlayerId },
      },
      update: {
        statData: validatedStats as any,
      },
      create: {
        gameId,
        rosterPlayerId,
        sportType,
        statData: validatedStats as any,
      },
      include: {
        rosterPlayer: { select: { firstName: true, lastName: true } },
      },
    });

    await logAudit(user!.id, 'RECORD_STAT', 'playerStat', stat.id, { gameId, rosterPlayerId });

    return NextResponse.json({ stat }, { status: 201 });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
