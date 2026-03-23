import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from '@/lib/prisma';
import { requireAuth, logAudit } from '@/lib/security';
import { sendEmail, familyInviteEmail } from '@/lib/email';

export async function POST(
  request: NextRequest,
  { params }: { params: { familyId: string } }
) {
  const { error, user } = await requireAuth();
  if (error) return error;

  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const membership = await prisma.familyMember.findUnique({
      where: { familyId_userId: { familyId: params.familyId, userId: user!.id } },
    });

    if (!membership || !['OWNER', 'ADMIN'].includes(membership.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const family = await prisma.family.findUnique({
      where: { id: params.familyId },
    });

    if (!family) {
      return NextResponse.json({ error: 'Family not found' }, { status: 404 });
    }

    const token = uuidv4();
    const invite = await prisma.familyInvite.create({
      data: {
        familyId: params.familyId,
        invitedBy: user!.id,
        email: email.toLowerCase().trim(),
        token,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    // Send invite email
    try {
      const emailContent = familyInviteEmail(user!.name!, family.name, token);
      await sendEmail({ to: email, ...emailContent });
    } catch {
      // Email sending is non-blocking
    }

    await logAudit(user!.id, 'INVITE_FAMILY_MEMBER', 'family', params.familyId, { email });

    return NextResponse.json({ invite }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
