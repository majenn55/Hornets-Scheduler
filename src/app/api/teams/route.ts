import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, logAudit } from '@/lib/security';
import { createTeamSchema } from '@/lib/validations';

export async function GET(request: NextRequest) {
  const { error, user } = await requireAuth();
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const sportType = searchParams.get('sportType');
  const leagueId = searchParams.get('leagueId');

  const teams = await prisma.team.findMany({
    where: {
      ...(sportType && { sportType: sportType as any }),
      ...(leagueId && { leagueId }),
      members: { some: { userId: user!.id } },
    },
    include: {
      league: { select: { id: true, name: true } },
      _count: { select: { members: true, rosters: true } },
    },
    orderBy: { name: 'asc' },
  });

  return NextResponse.json({ teams });
}

export async function POST(request: NextRequest) {
  const { error, user } = await requireAuth();
  if (error) return error;

  try {
    const body = await request.json();
    const validated = createTeamSchema.parse(body);

    const team = await prisma.team.create({
      data: {
        ...validated,
        members: {
          create: {
            userId: user!.id,
            role: 'OWNER',
          },
        },
      },
      include: {
        members: { include: { user: { select: { id: true, firstName: true, lastName: true } } } },
      },
    });

    await logAudit(user!.id, 'CREATE', 'team', team.id);

    return NextResponse.json({ team }, { status: 201 });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
