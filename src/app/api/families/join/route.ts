import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, logAudit } from '@/lib/security';

export async function POST(request: NextRequest) {
  const { error, user } = await requireAuth();
  if (error) return error;

  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 });
    }

    const invite = await prisma.familyInvite.findUnique({
      where: { token },
    });

    if (!invite) {
      return NextResponse.json({ error: 'Invalid invite' }, { status: 404 });
    }

    if (invite.status !== 'PENDING') {
      return NextResponse.json({ error: 'Invite already used' }, { status: 400 });
    }

    if (new Date() > invite.expiresAt) {
      await prisma.familyInvite.update({
        where: { id: invite.id },
        data: { status: 'EXPIRED' },
      });
      return NextResponse.json({ error: 'Invite expired' }, { status: 410 });
    }

    // Check if already a member
    const existing = await prisma.familyMember.findUnique({
      where: { familyId_userId: { familyId: invite.familyId, userId: user!.id } },
    });

    if (existing) {
      return NextResponse.json({ error: 'Already a member of this family' }, { status: 409 });
    }

    // Add member and update invite in a transaction
    await prisma.$transaction([
      prisma.familyMember.create({
        data: {
          familyId: invite.familyId,
          userId: user!.id,
          role: 'MEMBER',
        },
      }),
      prisma.familyInvite.update({
        where: { id: invite.id },
        data: { status: 'ACCEPTED' },
      }),
    ]);

    await logAudit(user!.id, 'JOIN_FAMILY', 'family', invite.familyId);

    return NextResponse.json({ success: true, familyId: invite.familyId });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
