import { NextResponse } from 'next/server';
import { AuthError, requireRole, requireUser } from '@/lib/auth';
import { listAuditEvents } from '@/lib/database';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  try {
    const user = await requireUser(request);
    requireRole(user, 'admin');
    const events = await listAuditEvents(user.organisationId);
    return NextResponse.json({ events });
  } catch (error) {
    if (error instanceof AuthError) return NextResponse.json({ error: error.message }, { status: error.status });
    return NextResponse.json({ error: 'Unable to load audit events.' }, { status: 500 });
  }
}
