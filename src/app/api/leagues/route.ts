import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, logAudit } from '@/lib/security';
import { createLeagueSchema } from '@/lib/validations';

export async function GET(request: NextRequest) {
  const { error, user } = await requireAuth();
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const sportType = searchParams.get('sportType');
  const publicOnly = searchParams.get('public') === 'true';

  const leagues = await prisma.league.findMany({
    where: {
      ...(sportType && { sportType: sportType as any }),
      ...(publicOnly
        ? { isPublic: true }
        : { members: { some: { userId: user!.id } } }),
    },
    include: {
      _count: { select: { members: true, teams: true, seasons: true } },
    },
    orderBy: { name: 'asc' },
  });

  return NextResponse.json({ leagues });
}

export async function POST(request: NextRequest) {
  const { error, user } = await requireAuth();
  if (error) return error;

  try {
    const body = await request.json();
    const validated = createLeagueSchema.parse(body);

    const league = await prisma.league.create({
      data: {
        ...validated,
        members: {
          create: {
            userId: user!.id,
            role: 'COMMISSIONER',
          },
        },
      },
    });

    await logAudit(user!.id, 'CREATE', 'league', league.id);

    return NextResponse.json({ league }, { status: 201 });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
