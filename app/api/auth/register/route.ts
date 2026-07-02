import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createOrganisationWithOwner, findUserByEmail } from '@/lib/database';
import { createSessionToken, setSessionCookie } from '@/lib/auth';
import { logger } from '@/lib/logger';
import { recordAuditEvent } from '@/lib/audit-log';

export const runtime = 'nodejs';

const registerSchema = z.object({
  organisationName: z.string().trim().min(2).max(120),
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  password: z.string().min(12).max(200)
});

export async function POST(request: Request) {
  const requestId = crypto.randomUUID();

  try {
    const body = registerSchema.parse(await request.json());
    const existing = await findUserByEmail(body.email);

    if (existing) {
      return NextResponse.json({ error: 'An account already exists for this email.', requestId }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(body.password, 12);
    const user = await createOrganisationWithOwner({
      organisationName: body.organisationName,
      ownerName: body.name,
      ownerEmail: body.email,
      passwordHash
    });

    const token = await createSessionToken({
      id: user.id,
      email: user.email,
      organisationId: user.organisation_id,
      role: user.role
    });
    setSessionCookie(token);

    logger.info('user_registered', { requestId, userId: user.id, organisationId: user.organisation_id });
    await recordAuditEvent({
      actor: user.id,
      organisationId: user.organisation_id,
      action: 'auth.registered',
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
    }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message || 'Invalid registration', requestId }, { status: 400 });
    }

    logger.error('registration_failed', { requestId });
    return NextResponse.json({ error: 'Unable to register account.', requestId }, { status: 500 });
  }
}
