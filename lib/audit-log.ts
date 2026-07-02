import { getDatabase } from './database';
import { logger } from './logger';

type AuditEvent = {
  actor: string;
  organisationId?: string | null;
  action: string;
  resourceType: string;
  resourceId?: string | null;
  metadata?: Record<string, unknown>;
  requestId?: string;
  approved?: boolean;
};

export async function recordAuditEvent(event: AuditEvent) {
  logger.info('audit_event', {
    actor: event.actor,
    organisationId: event.organisationId || null,
    action: event.action,
    resourceType: event.resourceType,
    resourceId: event.resourceId || null,
    requestId: event.requestId || null,
    approved: event.approved ?? false
  });

  try {
    const sql = getDatabase();
    await sql`
      insert into audit_events (organisation_id, actor_id, action, resource_type, resource_id, metadata)
      values (
        ${event.organisationId || null},
        ${event.actor || null},
        ${event.action},
        ${event.resourceType},
        ${event.resourceId || null},
        ${sql.json({ ...(event.metadata || {}), requestId: event.requestId || null, approved: event.approved ?? false })}
      )
    `;
  } catch (error) {
    logger.error('audit_event_persist_failed', {
      action: event.action,
      resourceType: event.resourceType,
      requestId: event.requestId || null
    });
  }
}

export function assertHumanApproval(action: string, approved: boolean) {
  if (!approved) {
    throw new Error(`Human approval is required before ${action}.`);
  }
}
