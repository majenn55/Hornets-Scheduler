import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from '@/lib/prisma';
import { requireAuth, logAudit } from '@/lib/security';
import { createStreamSchema } from '@/lib/validations';

export async function GET(request: NextRequest) {
  const { error, user } = await requireAuth();
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const gameId = searchParams.get('gameId');
  const liveOnly = searchParams.get('live') === 'true';

  const streams = await prisma.liveStream.findMany({
    where: {
      ...(gameId && { gameId }),
      ...(liveOnly && { status: 'LIVE' }),
    },
    include: {
      game: {
        select: {
          id: true,
          scheduledAt: true,
          homeTeam: { select: { id: true, name: true } },
          awayTeam: { select: { id: true, name: true } },
        },
      },
      starter: { select: { id: true, firstName: true, lastName: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ streams });
}

export async function POST(request: NextRequest) {
  const { error, user } = await requireAuth();
  if (error) return error;

  try {
    const body = await request.json();
    const validated = createStreamSchema.parse(body);

    const game = await prisma.game.findUnique({
      where: { id: validated.gameId },
    });

    if (!game) {
      return NextResponse.json({ error: 'Game not found' }, { status: 404 });
    }

    const streamKey = uuidv4();
    const stream = await prisma.liveStream.create({
      data: {
        gameId: validated.gameId,
        startedBy: user!.id,
        streamKey,
        title: validated.title,
        rtmpUrl: `${process.env.STREAM_SERVER_URL || 'rtmp://localhost:1935/live'}/${streamKey}`,
        hlsUrl: `${process.env.STREAM_HLS_URL || '/streams'}/${streamKey}/index.m3u8`,
      },
    });

    await logAudit(user!.id, 'CREATE_STREAM', 'liveStream', stream.id, { gameId: validated.gameId });

    return NextResponse.json({ stream }, { status: 201 });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
