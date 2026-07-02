import { NextResponse } from 'next/server';
import { z } from 'zod';
import { auditWorkflow } from '@/lib/ai-auditor';

export const runtime = 'nodejs';

const requestSchema = z.object({
  text: z.string().trim().min(50).max(120_000),
  hourlyRate: z.number().positive().max(500).default(35)
});

export async function POST(request: Request) {
  try {
    const body = requestSchema.parse(await request.json());
    const result = await auditWorkflow(body.text, body.hourlyRate);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message || 'Invalid audit request' }, { status: 400 });
    }

    console.error(error);
    return NextResponse.json({ error: 'Unable to complete audit' }, { status: 500 });
  }
}
