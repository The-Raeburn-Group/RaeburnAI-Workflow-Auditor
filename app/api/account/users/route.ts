import { randomBytes, createHash } from 'node:crypto';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { AuthError, requireRole, requireUser } from '@/lib/auth';
import { createInvitation, listInvitations, listOrganisationUsers, updateOrganisationUserRole } from '@/lib/database';
import { recordAuditEvent } from '@/lib/audit-log';

export const runtime = 'nodejs';

const inviteSchema = z.object({
  email: z.string().trim().email().max(200),
  role: z.enum(['admin', 'auditor', 'viewer'])
});

const roleUpdateSchema = z.object({
  userId: z.string().min(1),
  role: z.enum(['admin', 'auditor', 'viewer'])
});

export async function GET(request: Request) {
  try {
    const user = await requireUser(request);
    requireRole(user, 'admin');
    const [users, invitations] = await Promise.all([
      listOrganisationUsers(user.organisationId),
      listInvitations(user.organisationId)
    ]);
    return NextResponse.json({ users, invitations });
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: Request) {
  const requestId = crypto.randomUUID();

  try {
    const user = await requireUser(request);
    requireRole(user, 'admin');
    const body = inviteSchema.parse(await request.json());
    const token = randomBytes(32).toString('base64url');
    const tokenHash = createHash('sha256').update(token).digest('hex');
    const invitation = await createInvitation({
      organisationId: user.organisationId,
      email: body.email,
      role: body.role,
      invitedBy: user.id,
      tokenHash,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
    });

    await recordAuditEvent({
      actor: user.id,
      organisationId: user.organisationId,
      action: 'user.invited',
      resourceType: 'invitation',
      resourceId: invitation?.id || null,
      requestId,
      metadata: { email: body.email, role: body.role }
    });

    return NextResponse.json({ invitation, invitationToken: token, requestId }, { status: 201 });
  } catch (error) {
    return handleError(error, requestId);
  }
}

export async function PATCH(request: Request) {
  const requestId = crypto.randomUUID();

  try {
    const user = await requireUser(request);
    requireRole(user, 'admin');
    const body = roleUpdateSchema.parse(await request.json());
    const updated = await updateOrganisationUserRole({
      organisationId: user.organisationId,
      userId: body.userId,
      role: body.role
    });

    if (!updated) return NextResponse.json({ error: 'User not found or owner role cannot be changed.', requestId }, { status: 404 });

    await recordAuditEvent({
      actor: user.id,
      organisationId: user.organisationId,
      action: 'user.role_updated',
      resourceType: 'user',
      resourceId: body.userId,
      requestId,
      metadata: { role: body.role }
    });

    return NextResponse.json({ user: updated, requestId });
  } catch (error) {
    return handleError(error, requestId);
  }
}

function handleError(error: unknown, requestId?: string) {
  if (error instanceof AuthError) return NextResponse.json({ error: error.message, requestId }, { status: error.status });
  if (error instanceof z.ZodError) return NextResponse.json({ error: error.issues[0]?.message || 'Invalid request', requestId }, { status: 400 });
  return NextResponse.json({ error: 'Unable to manage account users.', requestId }, { status: 500 });
}
