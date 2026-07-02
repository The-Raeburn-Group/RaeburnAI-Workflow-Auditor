import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import { parse } from 'csv-parse/sync';

const maxFileBytes = 8 * 1024 * 1024;

export type ParsedDocument = {
  filename: string;
  mimeType: string;
  text: string;
  sourceType: 'pdf' | 'docx' | 'csv' | 'text';
};

export async function parseUploadedFile(file: File): Promise<ParsedDocument> {
  if (file.size > maxFileBytes) {
    throw new Error('File is too large. Maximum supported upload is 8MB.');
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = file.name || 'upload';
  const mimeType = file.type || inferMimeType(filename);

  if (mimeType === 'application/pdf' || filename.toLowerCase().endsWith('.pdf')) {
    const parsed = await pdfParse(buffer);
    return normalise({ filename, mimeType, text: parsed.text, sourceType: 'pdf' });
  }

  if (
    mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    filename.toLowerCase().endsWith('.docx')
  ) {
    const parsed = await mammoth.extractRawText({ buffer });
    return normalise({ filename, mimeType, text: parsed.value, sourceType: 'docx' });
  }

  if (mimeType === 'text/csv' || filename.toLowerCase().endsWith('.csv')) {
    const records = parse(buffer.toString('utf8'), { relax_column_count: true, skip_empty_lines: true });
    const text = records.map((row: unknown[]) => row.join(' | ')).join('\n');
    return normalise({ filename, mimeType, text, sourceType: 'csv' });
  }

  if (mimeType.startsWith('text/') || filename.toLowerCase().endsWith('.txt') || filename.toLowerCase().endsWith('.md')) {
    return normalise({ filename, mimeType, text: buffer.toString('utf8'), sourceType: 'text' });
  }

  throw new Error('Unsupported file type. Supported formats: PDF, DOCX, CSV, TXT and Markdown.');
}

function normalise(document: ParsedDocument): ParsedDocument {
  const text = document.text.replace(/\s+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
  if (text.length < 50) {
    throw new Error('The uploaded document does not contain enough readable text to audit.');
  }
  return { ...document, text };
}

function inferMimeType(filename: string) {
  const lower = filename.toLowerCase();
  if (lower.endsWith('.pdf')) return 'application/pdf';
  if (lower.endsWith('.docx')) return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  if (lower.endsWith('.csv')) return 'text/csv';
  return 'text/plain';
}
