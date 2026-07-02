import { describe, expect, it } from 'vitest';
import { AuthError, requireRole } from '@/lib/auth';

describe('account RBAC', () => {
  it('allows admin-level access for owners and admins', () => {
    expect(() => requireRole({ id: '1', email: 'owner@example.com', organisationId: 'org', role: 'owner' }, 'admin')).not.toThrow();
    expect(() => requireRole({ id: '2', email: 'admin@example.com', organisationId: 'org', role: 'admin' }, 'admin')).not.toThrow();
  });

  it('blocks auditors from account administration', () => {
    expect(() => requireRole({ id: '3', email: 'auditor@example.com', organisationId: 'org', role: 'auditor' }, 'admin')).toThrow(AuthError);
  });
});
