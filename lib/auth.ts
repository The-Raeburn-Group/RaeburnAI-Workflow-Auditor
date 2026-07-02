import { z } from 'zod';

export type Role = 'owner' | 'admin' | 'auditor' | 'viewer';

export type SessionUser = {
  id: string;
  email: string;
  organisationId: string;
  role: Role;
};

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

export function requireUser(request: Request): SessionUser {
  const encoded = request.headers.get('x-raeburn-user');

  if (!encoded) {
    throw new AuthError('Authentication required', 401);
  }

  try {
    const parsed = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8'));
    return sessionSchema.parse(parsed);
  } catch {
    throw new AuthError('Invalid session user header', 401);
  }
}

export function requireRole(user: SessionUser, minimumRole: Role) {
  if (roleRank[user.role] < roleRank[minimumRole]) {
    throw new AuthError('Insufficient permissions', 403);
  }
}

export function getOptionalUser(request: Request): SessionUser | null {
  try {
    return requireUser(request);
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
