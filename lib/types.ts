export type Opportunity = {
  id: string;
  title: string;
  description: string;
  processArea: string;
  impact: number;
  feasibility: number;
  risk: 'Low' | 'Medium' | 'High';
  urgency: number;
  confidence: number;
  score: number;
  annualHoursSaved: number;
  annualCostSaving: number;
  implementationPattern: string;
  humanInTheLoop: string;
};

export type RoadmapPhase = {
  phase: '0–30 days' | '31–90 days' | '90+ days';
  actions: string[];
};

export type AuditResult = {
  summary: {
    readinessScore: number;
    annualHoursSaved: number;
    annualCostSaving: number;
    opportunityCount: number;
    executiveSummary: string;
  };
  opportunities: Opportunity[];
  roadmap: RoadmapPhase[];
  assumptions: string[];
  risks: string[];
};
