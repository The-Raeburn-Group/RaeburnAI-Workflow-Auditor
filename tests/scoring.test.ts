import { describe, expect, it } from 'vitest';
import { calculateOpportunityScore, calculateReadinessScore, estimateAnnualSavings } from '@/lib/scoring';
import { Opportunity } from '@/lib/types';

describe('scoring', () => {
  it('calculates annual savings from weekly task volume', () => {
    expect(estimateAnnualSavings({ tasksPerWeek: 120, minutesSavedPerTask: 10, hourlyRate: 30 })).toEqual({
      annualHoursSaved: 1040,
      annualCostSaving: 31200
    });
  });

  it('penalises high-risk opportunities', () => {
    const low = calculateOpportunityScore({ impact: 90, feasibility: 90, risk: 'Low', urgency: 90, confidence: 90 });
    const high = calculateOpportunityScore({ impact: 90, feasibility: 90, risk: 'High', urgency: 90, confidence: 90 });
    expect(low).toBeGreaterThan(high);
  });

  it('calculates readiness from opportunity profile', () => {
    const opportunities: Opportunity[] = [
      {
        id: '1', title: 'A', description: 'A', processArea: 'Ops', impact: 80, feasibility: 90, risk: 'Low', urgency: 70, confidence: 85, score: 88, annualHoursSaved: 100, annualCostSaving: 3500, implementationPattern: 'Copilot', humanInTheLoop: 'Review'
      }
    ];
    expect(calculateReadinessScore(opportunities)).toBeGreaterThan(70);
  });
});
