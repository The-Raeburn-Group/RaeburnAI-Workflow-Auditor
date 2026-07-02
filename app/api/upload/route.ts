import { NextResponse } from 'next/server';
import { parseUploadedFile } from '@/lib/document-parser';
import { checkRateLimit, getClientKey } from '@/lib/rate-limit';
import { logger } from '@/lib/logger';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const requestId = crypto.randomUUID();
  const clientKey = getClientKey(request);
  const rateLimit = checkRateLimit(`upload:${clientKey}`, { limit: 10, windowMs: 60_000 });

  if (!rateLimit.allowed) {
    return NextResponse.json({ error: 'Too many upload requests.', requestId }, { status: 429 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'File is required.', requestId }, { status: 400 });
    }

    const parsed = await parseUploadedFile(file);
    logger.info('document_parsed', {
      requestId,
      filename: parsed.filename,
      mimeType: parsed.mimeType,
      sourceType: parsed.sourceType,
      textLength: parsed.text.length
    });

    return NextResponse.json({ ...parsed, requestId });
  } catch (error) {
    logger.warn('document_parse_failed', {
      requestId,
      message: error instanceof Error ? error.message : 'Unknown parse error'
    });
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to parse document.', requestId },
      { status: 400 }
    );
  }
}
