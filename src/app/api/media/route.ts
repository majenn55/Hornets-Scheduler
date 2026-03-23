import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, logAudit } from '@/lib/security';

export async function GET(request: NextRequest) {
  const { error, user } = await requireAuth();
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const teamId = searchParams.get('teamId');
  const gameId = searchParams.get('gameId');
  const type = searchParams.get('type');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50);

  const media = await prisma.media.findMany({
    where: {
      ...(teamId && { teamId }),
      ...(gameId && { gameId }),
      ...(type && { type: type as any }),
    },
    include: {
      uploader: { select: { id: true, firstName: true, lastName: true } },
      team: { select: { id: true, name: true } },
      game: {
        select: {
          id: true,
          scheduledAt: true,
          homeTeam: { select: { name: true } },
          awayTeam: { select: { name: true } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    skip: (page - 1) * limit,
    take: limit,
  });

  const total = await prisma.media.count({
    where: {
      ...(teamId && { teamId }),
      ...(gameId && { gameId }),
      ...(type && { type: type as any }),
    },
  });

  return NextResponse.json({ media, total, page, limit });
}

export async function POST(request: NextRequest) {
  const { error, user } = await requireAuth();
  if (error) return error;

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const teamId = formData.get('teamId') as string | null;
    const gameId = formData.get('gameId') as string | null;
    const caption = formData.get('caption') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'File is required' }, { status: 400 });
    }

    // Validate file type
    const isPhoto = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');

    if (!isPhoto && !isVideo) {
      return NextResponse.json({ error: 'Only image and video files are allowed' }, { status: 400 });
    }

    // File size limits: 50MB for photos, 500MB for videos
    const maxSize = isPhoto ? 50 * 1024 * 1024 : 500 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `File too large. Max: ${isPhoto ? '50MB' : '500MB'}` },
        { status: 400 }
      );
    }

    // In production, upload to S3. For now, save metadata.
    // The actual file would be streamed to cloud storage.
    const fileUrl = `/uploads/${Date.now()}-${file.name}`;

    const media = await prisma.media.create({
      data: {
        uploaderId: user!.id,
        teamId,
        gameId,
        type: isPhoto ? 'PHOTO' : 'VIDEO',
        url: fileUrl,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        caption,
      },
    });

    await logAudit(user!.id, 'UPLOAD_MEDIA', 'media', media.id, { type: media.type });

    return NextResponse.json({ media }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
