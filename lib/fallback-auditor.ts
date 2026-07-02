import { AuditResult, Opportunity } from './types';
import { calculateOpportunityScore, calculateReadinessScore, estimateAnnualSavings } from './scoring';

const patterns = [
  {
    keyword: /email|inbox|follow[- ]?up|template/i,
    title: 'Automated email triage and response drafting',
    area: 'Customer operations',
    description: 'Use AI to classify inbound messages, draft replies, suggest next actions and route exceptions to humans.',
    implementationPattern: 'Shared inbox classifier + draft response assistant + escalation rules',
    minutes: 8,
    tasks: 80,
    impact: 82,
    feasibility: 88,
    risk: 'Low' as const
  },
  {
    keyword: /crm|copy|paste|data entry|spreadsheet|excel/i,
    title: 'CRM and spreadsheet data-entry automation',
    area: 'Revenue operations',
    description: 'Remove manual rekeying by extracting structured fields and syncing them into CRM or operational trackers.',
    implementationPattern: 'Document/email parser + validation queue + CRM integration',
    minutes: 10,
    tasks: 100,
    impact: 86,
    feasibility: 82,
    risk: 'Medium' as const
  },
  {
    keyword: /report|weekly|monthly|dashboard|status/i,
    title: 'Automated reporting and executive summaries',
    area: 'Management reporting',
    description: 'Generate recurring dashboards, narrative summaries and exception reports from source systems.',
    implementationPattern: 'Scheduled data pull + metrics layer + AI narrative generator',
    minutes: 45,
    tasks: 5,
    impact: 78,
    feasibility: 80,
    risk: 'Low' as const
  },
  {
    keyword: /approval|manager|sign[- ]?off|escalat/i,
    title: 'Human-in-the-loop approval workflow',
    area: 'Governance',
    description: 'Standardise approval thresholds and let AI prepare decision packs while humans approve sensitive actions.',
    implementationPattern: 'Rules engine + approval queue + audit log',
    minutes: 20,
    tasks: 20,
    impact: 72,
    feasibility: 74,
    risk: 'Medium' as const
  },
  {
    keyword: /order|refund|ticket|case|customer/i,
    title: 'Case handling copilot',
    area: 'Service delivery',
    description: 'Summarise cases, retrieve customer history, recommend next best action and generate follow-up prompts.',
    implementationPattern: 'RAG knowledge base + customer timeline + next-action assistant',
    minutes: 12,
    tasks: 120,
    impact: 90,
    feasibility: 76,
    risk: 'Medium' as const
  }
];

export function runFallbackAudit(text: string, hourlyRate: number): AuditResult {
  const matches = patterns.filter((pattern) => pattern.keyword.test(text));
  const selected = matches.length ? matches : patterns.slice(0, 3);

  const opportunities: Opportunity[] = selected.map((pattern, index) => {
    const savings = estimateAnnualSavings({
      tasksPerWeek: pattern.tasks,
      minutesSavedPerTask: pattern.minutes,
      hourlyRate
    });

    const opportunity: Opportunity = {
      id: `opp-${index + 1}`,
      title: pattern.title,
      description: pattern.description,
      processArea: pattern.area,
      impact: pattern.impact,
      feasibility: pattern.feasibility,
      risk: pattern.risk,
      urgency: 76,
      confidence: 72,
      score: 0,
      annualHoursSaved: savings.annualHoursSaved,
      annualCostSaving: savings.annualCostSaving,
      implementationPattern: pattern.implementationPattern,
      humanInTheLoop: pattern.risk === 'Low' ? 'Review exceptions and sampled outputs weekly.' : 'Require approval before external action or data changes.'
    };
    opportunity.score = calculateOpportunityScore(opportunity);
    return opportunity;
  }).sort((a, b) => b.score - a.score);

  const annualHoursSaved = opportunities.reduce((sum, item) => sum + item.annualHoursSaved, 0);
  const annualCostSaving = opportunities.reduce((sum, item) => sum + item.annualCostSaving, 0);

  return {
    summary: {
      readinessScore: calculateReadinessScore(opportunities),
      annualHoursSaved,
      annualCostSaving,
      opportunityCount: opportunities.length,
      executiveSummary: 'The submitted workflow contains multiple repeatable, rules-based activities suitable for AI-assisted automation. Start with low-risk internal copilots and human-reviewed automations before moving to customer-facing workflows.'
    },
    opportunities,
    roadmap: [
      {
        phase: '0–30 days',
        actions: [
          'Confirm process owner, baseline volumes and current handling times.',
          'Pilot the highest-score internal automation with human review.',
          'Create data handling rules and approval thresholds.'
        ]
      },
      {
        phase: '31–90 days',
        actions: [
          'Connect source systems and add audit logging.',
          'Measure realised time saving against the baseline.',
          'Train staff on exception handling and prompt-safe usage.'
        ]
      },
      {
        phase: '90+ days',
        actions: [
          'Expand to adjacent workflows with similar patterns.',
          'Introduce executive dashboards and automated management reporting.',
          'Review governance, security and ROI quarterly.'
        ]
      }
    ],
    assumptions: [
      `Hourly cost assumed at £${hourlyRate}.`,
      'Savings estimates are directional and should be validated with live workflow data.',
      'Default implementation keeps humans responsible for approvals and exceptions.'
    ],
    risks: [
      'Poor source data quality can reduce automation accuracy.',
      'Customer-facing actions should not be fully autonomous until validated.',
      'Sensitive documents require access controls, retention rules and audit logs.'
    ]
  };
}
