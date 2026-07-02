import { describe, expect, it, vi } from 'vitest';
import { recordAuditEvent } from '@/lib/audit-log';

vi.mock('@/lib/database', () => ({
  getDatabase: () => {
    const sql = vi.fn();
    Object.assign(sql, {
      json: (value: unknown) => value
    });
    return sql;
  }
}));

describe('durable audit logging', () => {
  it('does not throw when recording an audit event', async () => {
    await expect(
      recordAuditEvent({
        actor: '00000000-0000-4000-8000-000000000101',
        organisationId: '00000000-0000-4000-8000-000000000001',
        action: 'test.event',
        resourceType: 'test',
        resourceId: 'resource-1',
        requestId: 'request-1'
      })
    ).resolves.toBeUndefined();
  });
});
