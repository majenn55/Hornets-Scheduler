import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from '@/lib/prisma';
import { requireAuth, logAudit } from '@/lib/security';
import { createInviteSchema } from '@/lib/validations';
import { sendEmail, inviteEmail } from '@/lib/email';

export async function GET(request: NextRequest) {
  const { error, user } = await requireAuth();
  if (error) return error;

  const invites = await prisma.invite.findMany({
    where: {
      OR: [
        { senderId: user!.id },
        { email: (user as any).email },
        { recipientId: user!.id },
      ],
    },
    include: {
      league: { select: { id: true, name: true } },
      team: { select: { id: true, name: true } },
      sender: { select: { id: true, firstName: true, lastName: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ invites });
}

export async function POST(request: NextRequest) {
  const { error, user } = await requireAuth();
  if (error) return error;

  try {
    const body = await request.json();
    const validated = createInviteSchema.parse(body);

    // Validate invite target exists
    let entityName = '';
    if (validated.type === 'LEAGUE' && validated.leagueId) {
      const league = await prisma.league.findUnique({ where: { id: validated.leagueId } });
      if (!league) return NextResponse.json({ error: 'League not found' }, { status: 404 });
      entityName = league.name;
    } else if (validated.type === 'TEAM' && validated.teamId) {
      const team = await prisma.team.findUnique({ where: { id: validated.teamId } });
      if (!team) return NextResponse.json({ error: 'Team not found' }, { status: 404 });
      entityName = team.name;
    } else {
      return NextResponse.json({ error: 'Invalid invite target' }, { status: 400 });
    }

    // Check if recipient user exists
    const recipientUser = await prisma.user.findUnique({
      where: { email: validated.email.toLowerCase().trim() },
    });

    const token = uuidv4();
    const invite = await prisma.invite.create({
      data: {
        type: validated.type,
        leagueId: validated.leagueId,
        teamId: validated.teamId,
        senderId: user!.id,
        recipientId: recipientUser?.id,
        email: validated.email.toLowerCase().trim(),
        token,
        role: validated.role,
        message: validated.message,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    // Send invite email
    try {
      const emailContent = inviteEmail(user!.name!, entityName, validated.type.toLowerCase(), token);
      await sendEmail({ to: validated.email, ...emailContent });
    } catch {
      // Email is non-blocking
    }

    // Create notification for recipient if they exist
    if (recipientUser) {
      await prisma.notification.create({
        data: {
          userId: recipientUser.id,
          type: 'INVITE',
          title: `Invitation to join ${entityName}`,
          message: `${user!.name} invited you to join the ${validated.type.toLowerCase()} ${entityName}`,
          data: { inviteId: invite.id, type: validated.type } as any,
        },
      });
    }

    await logAudit(user!.id, 'SEND_INVITE', 'invite', invite.id, {
      type: validated.type,
      email: validated.email,
    });

    return NextResponse.json({ invite }, { status: 201 });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
