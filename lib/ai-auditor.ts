import OpenAI from 'openai';
import { z } from 'zod';
import { runFallbackAudit } from './fallback-auditor';
import { AuditResult } from './types';

const opportunitySchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  processArea: z.string(),
  impact: z.number().min(1).max(100),
  feasibility: z.number().min(1).max(100),
  risk: z.enum(['Low', 'Medium', 'High']),
  urgency: z.number().min(1).max(100),
  confidence: z.number().min(1).max(100),
  score: z.number().min(1).max(100),
  annualHoursSaved: z.number().nonnegative(),
  annualCostSaving: z.number().nonnegative(),
  implementationPattern: z.string(),
  humanInTheLoop: z.string()
});

const auditResultSchema = z.object({
  summary: z.object({
    readinessScore: z.number().min(1).max(100),
    annualHoursSaved: z.number().nonnegative(),
    annualCostSaving: z.number().nonnegative(),
    opportunityCount: z.number().int().nonnegative(),
    executiveSummary: z.string()
  }),
  opportunities: z.array(opportunitySchema).min(1).max(8),
  roadmap: z.array(z.object({
    phase: z.enum(['0–30 days', '31–90 days', '90+ days']),
    actions: z.array(z.string()).min(2).max(6)
  })).length(3),
  assumptions: z.array(z.string()).min(1).max(8),
  risks: z.array(z.string()).min(1).max(8)
});

export async function auditWorkflow(text: string, hourlyRate: number): Promise<AuditResult> {
  if (!process.env.OPENAI_API_KEY) {
    return runFallbackAudit(text, hourlyRate);
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';

  try {
    const completion = await client.chat.completions.create({
      model,
      temperature: 0.2,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: `You are RaeburnAI Workflow Auditor, a senior AI transformation consultant. Return strict JSON only. Identify automation opportunities from SME workflows. Be commercially useful, realistic, and safety-aware. Use GBP. Phases must be exactly: 0–30 days, 31–90 days, 90+ days.`
        },
        {
          role: 'user',
          content: `Hourly fully loaded cost: £${hourlyRate}\n\nWorkflow text:\n${text}\n\nReturn JSON matching this shape: {summary:{readinessScore,annualHoursSaved,annualCostSaving,opportunityCount,executiveSummary},opportunities:[{id,title,description,processArea,impact,feasibility,risk,urgency,confidence,score,annualHoursSaved,annualCostSaving,implementationPattern,humanInTheLoop}],roadmap:[{phase,actions}],assumptions:[],risks:[]}`
        }
      ]
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) throw new Error('Empty model response');
    return auditResultSchema.parse(JSON.parse(raw));
  } catch (error) {
    console.error('AI audit failed, using fallback auditor', error);
    return runFallbackAudit(text, hourlyRate);
  }
}
