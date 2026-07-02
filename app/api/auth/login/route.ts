import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createSessionToken, setSessionCookie } from '@/lib/auth';
import { findUserByEmail } from '@/lib/database';
import { logger } from '@/lib/logger';
import { recordAuditEvent } from '@/lib/audit-log';

export const runtime = 'nodejs';

const loginSchema = z.object({
  email: z.string().trim().email().max(200),
  password: z.string().min(1).max(200)
});

export async function POST(request: Request) {
  const requestId = crypto.randomUUID();

  try {
    const body = loginSchema.parse(await request.json());
    const user = await findUserByEmail(body.email);

    if (!user?.password_hash) {
      return NextResponse.json({ error: 'Invalid credentials.', requestId }, { status: 401 });
    }

    const valid = await bcrypt.compare(body.password, user.password_hash);
    if (!valid) {
      return NextResponse.json({ error: 'Invalid credentials.', requestId }, { status: 401 });
    }

    const token = await createSessionToken({
      id: user.id,
      email: user.email,
      organisationId: user.organisation_id,
      role: user.role
    });
    setSessionCookie(token);

    logger.info('user_logged_in', { requestId, userId: user.id, organisationId: user.organisation_id });
    await recordAuditEvent({
      actor: user.id,
      organisationId: user.organisation_id,
      action: 'auth.login',
      resourceType: 'user',
      resourceId: user.id,
      requestId
    });

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        organisationId: user.organisation_id,
        role: user.role
      },
      requestId
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message || 'Invalid request', requestId }, { status: 400 });
    }

    logger.error('login_failed', { requestId });
    return NextResponse.json({ error: 'Unable to login.', requestId }, { status: 500 });
  }
}
