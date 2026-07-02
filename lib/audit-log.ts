import { logger } from './logger';

type AuditEvent = {
  actor: string;
  action: string;
  resource: string;
  requestId?: string;
  approved?: boolean;
};

export function recordAuditEvent(event: AuditEvent) {
  logger.info('audit_event', {
    actor: event.actor,
    action: event.action,
    resource: event.resource,
    requestId: event.requestId || null,
    approved: event.approved ?? false
  });
}

export function assertHumanApproval(action: string, approved: boolean) {
  if (!approved) {
    throw new Error(`Human approval is required before ${action}.`);
  }
}
