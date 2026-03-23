import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, logAudit } from '@/lib/security';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { streamId: string } }
) {
  const { error, user } = await requireAuth();
  if (error) return error;

  try {
    const body = await request.json();
    const { action } = body;

    const stream = await prisma.liveStream.findUnique({
      where: { id: params.streamId },
    });

    if (!stream) {
      return NextResponse.json({ error: 'Stream not found' }, { status: 404 });
    }

    if (stream.startedBy !== user!.id) {
      return NextResponse.json({ error: 'Only stream creator can modify' }, { status: 403 });
    }

    let updateData: any = {};

    switch (action) {
      case 'start':
        updateData = { status: 'LIVE', startedAt: new Date() };
        // Notify team members about the live stream
        const game = await prisma.game.findUnique({
          where: { id: stream.gameId },
          include: {
            homeTeam: { include: { members: true } },
            awayTeam: { include: { members: true } },
          },
        });
        if (game) {
          const memberIds = [
            ...game.homeTeam.members.map((m) => m.userId),
            ...game.awayTeam.members.map((m) => m.userId),
          ];
          await prisma.notification.createMany({
            data: memberIds.map((userId) => ({
              userId,
              type: 'STREAM_STARTED' as const,
              title: 'Game is now live!',
              message: `${stream.title} has started streaming`,
              data: { streamId: stream.id, gameId: stream.gameId },
            })),
          });
        }
        break;
      case 'end':
        updateData = { status: 'ENDED', endedAt: new Date() };
        break;
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    const updated = await prisma.liveStream.update({
      where: { id: params.streamId },
      data: updateData,
    });

    await logAudit(user!.id, `STREAM_${action.toUpperCase()}`, 'liveStream', params.streamId);

    return NextResponse.json({ stream: updated });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
