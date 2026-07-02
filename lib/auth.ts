import { cookies } from 'next/headers';
import { jwtVerify, SignJWT } from 'jose';
import { z } from 'zod';

export type Role = 'owner' | 'admin' | 'auditor' | 'viewer';

export type SessionUser = {
  id: string;
  email: string;
  organisationId: string;
  role: Role;
};

const sessionCookieName = 'raeburnai_session';

const roleRank: Record<Role, number> = {
  viewer: 1,
  auditor: 2,
  admin: 3,
  owner: 4
};

const sessionSchema = z.object({
  id: z.string().min(1),
  email: z.string().email(),
  organisationId: z.string().min(1),
  role: z.enum(['owner', 'admin', 'auditor', 'viewer'])
});

function getJwtSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) {
    throw new AuthError('AUTH_SECRET must be set to at least 32 characters.', 500);
  }
  return new TextEncoder().encode(secret);
}

export async function createSessionToken(user: SessionUser) {
  return new SignJWT(user)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('8h')
    .sign(getJwtSecret());
}

export async function verifySessionToken(token: string): Promise<SessionUser> {
  const verified = await jwtVerify(token, getJwtSecret());
  return sessionSchema.parse(verified.payload);
}

export async function requireUser(request: Request): Promise<SessionUser> {
  const bearer = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  const cookieHeader = request.headers.get('cookie') || '';
  const cookieToken = cookieHeader
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${sessionCookieName}=`))
    ?.split('=')[1];
  const token = bearer || cookieToken;

  if (!token) {
    throw new AuthError('Authentication required', 401);
  }

  try {
    return await verifySessionToken(token);
  } catch {
    throw new AuthError('Invalid or expired session', 401);
  }
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  const token = cookies().get(sessionCookieName)?.value;
  if (!token) return null;

  try {
    return await verifySessionToken(token);
  } catch {
    return null;
  }
}

export function setSessionCookie(token: string) {
  cookies().set(sessionCookieName, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 8
  });
}

export function clearSessionCookie() {
  cookies().delete(sessionCookieName);
}

export function requireRole(user: SessionUser, minimumRole: Role) {
  if (roleRank[user.role] < roleRank[minimumRole]) {
    throw new AuthError('Insufficient permissions', 403);
  }
}

export async function getOptionalUser(request: Request): Promise<SessionUser | null> {
  try {
    return await requireUser(request);
  } catch {
    return null;
  }
}

export class AuthError extends Error {
  constructor(message: string, public status = 401) {
    super(message);
    this.name = 'AuthError';
  }
}

export { sessionCookieName };
