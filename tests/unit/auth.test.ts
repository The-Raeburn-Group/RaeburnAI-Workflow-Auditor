import { describe, expect, it, beforeEach } from 'vitest';
import { AuthError, createSessionToken, requireRole, requireUser } from '@/lib/auth';

function makeRequest(token?: string) {
  const headers = new Headers();
  if (token) headers.set('authorization', `Bearer ${token}`);
  return new Request('http://localhost', { headers });
}

describe('auth and RBAC', () => {
  beforeEach(() => {
    process.env.AUTH_SECRET = 'test-secret-that-is-long-enough-for-jwt-signing';
  });

  it('requires an authenticated session token', async () => {
    await expect(requireUser(makeRequest())).rejects.toThrow(AuthError);
  });

  it('parses a valid signed session token', async () => {
    const token = await createSessionToken({
      id: 'user-1',
      email: 'owner@example.com',
      organisationId: 'org-1',
      role: 'owner'
    });

    const user = await requireUser(makeRequest(token));
    expect(user.role).toBe('owner');
  });

  it('blocks insufficient roles', () => {
    expect(() =>
      requireRole({ id: 'user-1', email: 'viewer@example.com', organisationId: 'org-1', role: 'viewer' }, 'admin')
    ).toThrow(AuthError);
  });
});
