import { describe, expect, it } from 'vitest';
import { runFallbackAudit } from '@/lib/fallback-auditor';

describe('basic audit flow', () => {
  it('accepts demo workflow text and produces dashboard-ready output', () => {
    const audit = runFallbackAudit(
      'Customer support team checks inbox, copies data into CRM, sends template emails, escalates refund approval and updates weekly reports.',
      40
    );

    expect(audit.summary.readinessScore).toBeGreaterThan(0);
    expect(audit.opportunities.length).toBeGreaterThan(0);
    expect(audit.roadmap.map((phase) => phase.phase)).toEqual(['0–30 days', '31–90 days', '90+ days']);
  });
});
