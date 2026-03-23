import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from '@/lib/prisma';
import { requireAuth, logAudit } from '@/lib/security';
import { createFamilySchema, inviteFamilyMemberSchema } from '@/lib/validations';
import { sendEmail, familyInviteEmail } from '@/lib/email';

export async function GET(request: NextRequest) {
  const { error, user } = await requireAuth();
  if (error) return error;

  const families = await prisma.family.findMany({
    where: { members: { some: { userId: user!.id } } },
    include: {
      members: {
        include: {
          user: { select: { id: true, firstName: true, lastName: true, email: true, avatarUrl: true } },
        },
      },
    },
  });

  return NextResponse.json({ families });
}

export async function POST(request: NextRequest) {
  const { error, user } = await requireAuth();
  if (error) return error;

  try {
    const body = await request.json();
    const validated = createFamilySchema.parse(body);

    const family = await prisma.family.create({
      data: {
        name: validated.name,
        members: {
          create: {
            userId: user!.id,
            role: 'OWNER',
          },
        },
      },
      include: {
        members: {
          include: { user: { select: { id: true, firstName: true, lastName: true } } },
        },
      },
    });

    await logAudit(user!.id, 'CREATE', 'family', family.id);

    return NextResponse.json({ family }, { status: 201 });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
