import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/security';

export async function GET(request: NextRequest) {
  const { error, user } = await requireAuth();
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const unreadOnly = searchParams.get('unread') === 'true';

  const notifications = await prisma.notification.findMany({
    where: {
      userId: user!.id,
      ...(unreadOnly && { read: false }),
    },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  const unreadCount = await prisma.notification.count({
    where: { userId: user!.id, read: false },
  });

  return NextResponse.json({ notifications, unreadCount });
}

export async function PATCH(request: NextRequest) {
  const { error, user } = await requireAuth();
  if (error) return error;

  const { ids } = await request.json();

  if (ids && Array.isArray(ids)) {
    await prisma.notification.updateMany({
      where: { id: { in: ids }, userId: user!.id },
      data: { read: true },
    });
  } else {
    // Mark all as read
    await prisma.notification.updateMany({
      where: { userId: user!.id, read: false },
      data: { read: true },
    });
  }

  return NextResponse.json({ success: true });
}
