import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, logAudit } from '@/lib/security';
import { createSeasonSchema } from '@/lib/validations';

export async function GET(request: NextRequest) {
  const { error, user } = await requireAuth();
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const leagueId = searchParams.get('leagueId');

  if (!leagueId) {
    return NextResponse.json({ error: 'leagueId is required' }, { status: 400 });
  }

  const seasons = await prisma.season.findMany({
    where: { leagueId },
    include: {
      _count: { select: { games: true } },
    },
    orderBy: { startDate: 'desc' },
  });

  return NextResponse.json({ seasons });
}

export async function POST(request: NextRequest) {
  const { error, user } = await requireAuth();
  if (error) return error;

  try {
    const body = await request.json();
    const validated = createSeasonSchema.parse(body);

    const membership = await prisma.leagueMember.findUnique({
      where: { leagueId_userId: { leagueId: validated.leagueId, userId: user!.id } },
    });

    if (!membership || !['COMMISSIONER', 'ADMIN'].includes(membership.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const season = await prisma.season.create({
      data: {
        ...validated,
        startDate: new Date(validated.startDate),
        endDate: new Date(validated.endDate),
      },
    });

    await logAudit(user!.id, 'CREATE', 'season', season.id, { leagueId: validated.leagueId });

    return NextResponse.json({ season }, { status: 201 });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
