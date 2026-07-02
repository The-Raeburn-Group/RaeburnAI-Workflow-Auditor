import { NextResponse } from 'next/server';
import { z } from 'zod';
import { auditWorkflow } from '@/lib/ai-auditor';
import { getClientKey, checkRateLimit } from '@/lib/rate-limit';
import { logger } from '@/lib/logger';

export const runtime = 'nodejs';

const requestSchema = z.object({
  text: z.string().trim().min(50).max(120_000),
  hourlyRate: z.number().positive().max(500).default(35),
  humanApprovalConfirmed: z.boolean().optional().default(false)
});

export async function POST(request: Request) {
  const requestId = crypto.randomUUID();
  const clientKey = getClientKey(request);
  const rateLimit = checkRateLimit(clientKey, { limit: 20, windowMs: 60_000 });

  if (!rateLimit.allowed) {
    logger.warn('audit_rate_limited', { requestId, clientKey });
    return NextResponse.json(
      { error: 'Too many audit requests. Please wait and retry.', requestId },
      { status: 429, headers: { 'X-Request-Id': requestId } }
    );
  }

  try {
    const body = requestSchema.parse(await request.json());

    logger.info('audit_requested', {
      requestId,
      clientKey,
      hourlyRate: body.hourlyRate,
      textLength: body.text.length,
      humanApprovalConfirmed: body.humanApprovalConfirmed
    });

    const result = await auditWorkflow(body.text, body.hourlyRate);

    logger.info('audit_completed', {
      requestId,
      opportunityCount: result.summary.opportunityCount,
      annualHoursSaved: result.summary.annualHoursSaved
    });

    return NextResponse.json(result, { headers: { 'X-Request-Id': requestId } });
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.warn('audit_validation_failed', { requestId, issue: error.issues[0]?.message });
      return NextResponse.json(
        { error: error.issues[0]?.message || 'Invalid audit request', requestId },
        { status: 400, headers: { 'X-Request-Id': requestId } }
      );
    }

    logger.error('audit_failed', { requestId });
    return NextResponse.json(
      { error: 'Unable to complete audit', requestId },
      { status: 500, headers: { 'X-Request-Id': requestId } }
    );
  }
}
