import { describe, expect, it } from 'vitest';
import { runFallbackAudit } from '@/lib/fallback-auditor';

describe('fallback auditor', () => {
  it('returns a commercially useful audit result', () => {
    const result = runFallbackAudit(
      'The team copies customer emails into CRM, updates spreadsheets and prepares weekly management reports for refund approvals.',
      35
    );

    expect(result.summary.opportunityCount).toBeGreaterThan(0);
    expect(result.summary.annualHoursSaved).toBeGreaterThan(0);
    expect(result.opportunities[0]?.score).toBeGreaterThan(0);
    expect(result.roadmap).toHaveLength(3);
  });
});
