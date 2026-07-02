import { Opportunity } from './types';

const riskPenalty = {
  Low: 0,
  Medium: 8,
  High: 18
} as const;

export function calculateOpportunityScore(input: Pick<Opportunity, 'impact' | 'feasibility' | 'risk' | 'urgency' | 'confidence'>) {
  const weighted = input.impact * 0.34 + input.feasibility * 0.28 + input.urgency * 0.18 + input.confidence * 0.2;
  return clamp(Math.round(weighted - riskPenalty[input.risk]), 1, 100);
}

export function estimateAnnualSavings({
  tasksPerWeek,
  minutesSavedPerTask,
  hourlyRate
}: {
  tasksPerWeek: number;
  minutesSavedPerTask: number;
  hourlyRate: number;
}) {
  const annualHoursSaved = (tasksPerWeek * minutesSavedPerTask * 52) / 60;
  return {
    annualHoursSaved: Math.round(annualHoursSaved),
    annualCostSaving: Math.round(annualHoursSaved * hourlyRate)
  };
}

export function calculateReadinessScore(opportunities: Opportunity[]) {
  if (!opportunities.length) return 35;
  const avgFeasibility = average(opportunities.map((item) => item.feasibility));
  const avgConfidence = average(opportunities.map((item) => item.confidence));
  const lowRiskRatio = opportunities.filter((item) => item.risk === 'Low').length / opportunities.length;
  return clamp(Math.round(avgFeasibility * 0.45 + avgConfidence * 0.35 + lowRiskRatio * 20), 1, 100);
}

function average(values: number[]) {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}
