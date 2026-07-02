import { NextResponse } from 'next/server';
import { clearSessionCookie, getCurrentUser } from '@/lib/auth';
import { recordAuditEvent } from '@/lib/audit-log';

export const runtime = 'nodejs';

export async function POST() {
  const requestId = crypto.randomUUID();
  const user = await getCurrentUser();

  if (user) {
    await recordAuditEvent({
      actor: user.id,
      organisationId: user.organisationId,
      action: 'auth.logout',
      resourceType: 'user',
      resourceId: user.id,
      requestId
    });
  }

  clearSessionCookie();
  return NextResponse.json({ ok: true, requestId });
}
