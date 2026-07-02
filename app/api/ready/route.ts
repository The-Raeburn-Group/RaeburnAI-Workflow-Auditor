import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET() {
  const hasProvider = Boolean(process.env.OPENAI_API_KEY);
  const hasDatabase = Boolean(process.env.DATABASE_URL);

  return NextResponse.json({
    status: 'ready',
    checks: {
      aiProviderConfigured: hasProvider,
      fallbackAuditorAvailable: true,
      persistenceConfigured: hasDatabase,
      uploadParsingAvailable: true
    },
    timestamp: new Date().toISOString()
  });
}
