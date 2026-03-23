import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, logAudit } from '@/lib/security';

export async function POST(
  request: NextRequest,
  { params }: { params: { inviteId: string } }
) {
  const { error, user } = await requireAuth();
  if (error) return error;

  try {
    const invite = await prisma.invite.findUnique({
      where: { id: params.inviteId },
    });

    if (!invite) {
      return NextResponse.json({ error: 'Invite not found' }, { status: 404 });
    }

    if (invite.status !== 'PENDING') {
      return NextResponse.json({ error: 'Invite already processed' }, { status: 400 });
    }

    if (new Date() > invite.expiresAt) {
      await prisma.invite.update({
        where: { id: invite.id },
        data: { status: 'EXPIRED' },
      });
      return NextResponse.json({ error: 'Invite expired' }, { status: 410 });
    }

    // Add user to league or team
    if (invite.type === 'LEAGUE' && invite.leagueId) {
      await prisma.leagueMember.create({
        data: {
          leagueId: invite.leagueId,
          userId: user!.id,
          role: (invite.role as any) || 'MEMBER',
        },
      });
    } else if (invite.type === 'TEAM' && invite.teamId) {
      await prisma.teamMember.create({
        data: {
          teamId: invite.teamId,
          userId: user!.id,
          role: (invite.role as any) || 'PLAYER',
        },
      });
    }

    await prisma.invite.update({
      where: { id: invite.id },
      data: { status: 'ACCEPTED', recipientId: user!.id },
    });

    // Notify the sender
    await prisma.notification.create({
      data: {
        userId: invite.senderId,
        type: 'INVITE',
        title: 'Invite accepted',
        message: `${user!.name} accepted your invitation`,
        data: { inviteId: invite.id } as any,
      },
    });

    await logAudit(user!.id, 'ACCEPT_INVITE', 'invite', invite.id);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
