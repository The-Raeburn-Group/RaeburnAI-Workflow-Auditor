import { NextResponse } from 'next/server';
import { z } from 'zod';
import { auditWorkflow } from '@/lib/ai-auditor';
import { AuthError, requireRole, requireUser } from '@/lib/auth';
import { createTextDigest } from '@/lib/hash';
import { getAudit, listAudits, saveAudit } from '@/lib/database';
import { logger } from '@/lib/logger';
import { recordAuditEvent } from '@/lib/audit-log';

export const runtime = 'nodejs';

const createAuditSchema = z.object({
  title: z.string().trim().min(3).max(120),
  text: z.string().trim().min(50).max(120_000),
  hourlyRate: z.number().positive().max(500).default(35),
  sourceType: z.string().trim().min(1).max(40).default('text'),
  sourceName: z.string().trim().max(200).optional()
});

export async function GET(request: Request) {
  try {
    const user = await requireUser(request);
    requireRole(user, 'viewer');

    const url = new URL(request.url);
    const auditId = url.searchParams.get('id');

    if (auditId) {
      const audit = await getAudit(user.organisationId, auditId);
      if (!audit) return NextResponse.json({ error: 'Audit not found' }, { status: 404 });
      await recordAuditEvent({
        actor: user.id,
        organisationId: user.organisationId,
        action: 'audit.read',
        resourceType: 'audit',
        resourceId: auditId
      });
      return NextResponse.json({ audit });
    }

    const audits = await listAudits(user.organisationId);
    await recordAuditEvent({
      actor: user.id,
      organisationId: user.organisationId,
      action: 'audit.list',
      resourceType: 'audit'
    });
    return NextResponse.json({ audits });
  } catch (error) {
    return handleAuditApiError(error);
  }
}

export async function POST(request: Request) {
  const requestId = crypto.randomUUID();

  try {
    const user = await requireUser(request);
    requireRole(user, 'auditor');
    const body = createAuditSchema.parse(await request.json());
    const result = await auditWorkflow(body.text, body.hourlyRate);
    const saved = await saveAudit({
      organisationId: user.organisationId,
      createdBy: user.id,
      title: body.title,
      sourceType: body.sourceType,
      sourceName: body.sourceName,
      sourceTextHash: createTextDigest(body.text),
      result
    });

    logger.info('audit_saved', {
      requestId,
      auditId: saved?.id || null,
      organisationId: user.organisationId,
      actor: user.id
    });

    await recordAuditEvent({
      actor: user.id,
      organisationId: user.organisationId,
      action: 'audit.created',
      resourceType: 'audit',
      resourceId: saved?.id || null,
      requestId,
      metadata: { title: body.title, sourceType: body.sourceType }
    });

    return NextResponse.json({ id: saved?.id, result, requestId }, { status: 201 });
  } catch (error) {
    return handleAuditApiError(error, requestId);
  }
}

function handleAuditApiError(error: unknown, requestId?: string) {
  if (error instanceof AuthError) {
    return NextResponse.json({ error: error.message, requestId }, { status: error.status });
  }

  if (error instanceof z.ZodError) {
    return NextResponse.json({ error: error.issues[0]?.message || 'Invalid request', requestId }, { status: 400 });
  }

  logger.error('saved_audit_api_failed', { requestId: requestId || null });
  return NextResponse.json({ error: 'Unable to process request', requestId }, { status: 500 });
}
