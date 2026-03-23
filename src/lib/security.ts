import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth';
import { prisma } from './prisma';

// Rate limiting using in-memory store (use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(
  key: string,
  maxRequests: number = 60,
  windowMs: number = 60_000
): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (entry.count >= maxRequests) {
    return false;
  }

  entry.count++;
  return true;
}

// Get authenticated user from session
export async function getAuthUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;
  return session.user as { id: string; email: string; name: string; role: string };
}

// Require authentication middleware for API routes
export async function requireAuth() {
  const user = await getAuthUser();
  if (!user) {
    return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }), user: null };
  }
  return { error: null, user };
}

// Audit logging helper
export async function logAudit(
  userId: string,
  action: string,
  resource: string,
  resourceId?: string,
  details?: Record<string, unknown>
) {
  await prisma.auditLog.create({
    data: {
      userId,
      action,
      resource,
      resourceId,
      details: details as any,
    },
  });
}

// Input sanitization
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '')
    .trim();
}

// CSRF token validation (for non-GET requests)
export function validateOrigin(request: NextRequest): boolean {
  const origin = request.headers.get('origin');
  const host = request.headers.get('host');

  if (!origin || !host) return true; // Allow server-side requests

  const originHost = new URL(origin).host;
  return originHost === host;
}
