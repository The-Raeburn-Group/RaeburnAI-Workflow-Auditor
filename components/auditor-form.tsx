'use client';

import { useState } from 'react';
import type { ChangeEvent } from 'react';
import type { AuditResult } from '@/lib/types';
import { formatCurrency, formatHours } from '@/lib/format';

const sample = `Customer support SOP
1. Agent checks shared inbox every 30 minutes.
2. Copies customer details into CRM.
3. Searches order system manually.
4. Sends templated update email.
5. Escalates refund requests to manager.
6. Updates spreadsheet for weekly reporting.
Frequency: 120 tickets per week. Average handling time: 12 minutes. Hourly fully loaded cost: £28.`;

export function AuditorForm() {
  const [text, setText] = useState(sample);
  const [hourlyRate, setHourlyRate] = useState(35);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [sourceName, setSourceName] = useState<string | null>(null);
  const [result, setResult] = useState<AuditResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch('/api/upload', { method: 'POST', body: formData });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error || 'Upload failed');
      }

      const parsed = await response.json();
      setText(parsed.text);
      setSourceName(parsed.filename);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown upload error');
    } finally {
      setIsUploading(false);
      event.target.value = '';
    }
  }

  async function runAudit() {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, hourlyRate, humanApprovalConfirmed: true })
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error || 'Audit failed');
      }

      setResult(await response.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full flex-1 rounded-3xl border border-white/10 bg-white/[0.06] p-6 shadow-2xl shadow-cyan-950/30 backdrop-blur">
      <div className="mb-4 rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-4">
        <label className="block text-sm font-medium text-cyan-100" htmlFor="upload">
          Upload PDF, DOCX, CSV, TXT or Markdown
        </label>
        <input
          id="upload"
          type="file"
          accept=".pdf,.docx,.csv,.txt,.md,text/plain,text/csv,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={handleUpload}
          disabled={isUploading}
          className="mt-3 block w-full text-sm text-slate-300 file:mr-4 file:rounded-xl file:border-0 file:bg-cyan-300 file:px-4 file:py-2 file:font-semibold file:text-slate-950 hover:file:bg-cyan-200 disabled:opacity-50"
        />
        <p className="mt-2 text-xs text-slate-400">
          {isUploading ? 'Parsing document…' : sourceName ? `Loaded: ${sourceName}` : 'Files are parsed in memory and copied into the audit text box.'}
        </p>
      </div>

      <label className="text-sm font-medium text-slate-200" htmlFor="workflow">
        Paste workflow, SOP, org chart notes or process document text
      </label>
      <textarea
        id="workflow"
        className="mt-3 min-h-72 w-full rounded-2xl border border-white/10 bg-slate-950/80 p-4 text-sm leading-6 text-slate-100 outline-none ring-cyan-400/40 transition focus:ring-4"
        value={text}
        onChange={(event) => setText(event.target.value)}
      />

      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label className="text-sm font-medium text-slate-200" htmlFor="rate">
            Fully loaded hourly cost (£)
          </label>
          <input
            id="rate"
            type="number"
            min="1"
            className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none ring-cyan-400/40 focus:ring-4"
            value={hourlyRate}
            onChange={(event) => setHourlyRate(Number(event.target.value))}
          />
        </div>
        <button
          onClick={runAudit}
          disabled={isLoading || text.trim().length < 50}
          className="rounded-xl bg-cyan-300 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? 'Auditing…' : 'Run AI workflow audit'}
        </button>
      </div>

      {error && <p className="mt-4 rounded-xl border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-100">{error}</p>}

      {result && (
        <section className="mt-8 space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <Metric title="AI readiness" value={`${result.summary.readinessScore}/100`} />
            <Metric title="Annual hours saved" value={formatHours(result.summary.annualHoursSaved)} />
            <Metric title="Annual saving" value={formatCurrency(result.summary.annualCostSaving)} />
          </div>

          <div>
            <h2 className="text-xl font-bold">Top automation opportunities</h2>
            <div className="mt-4 space-y-3">
              {result.opportunities.map((item) => (
                <article key={item.id} className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-white">{item.title}</h3>
                      <p className="mt-1 text-sm text-slate-400">{item.description}</p>
                    </div>
                    <span className="rounded-full bg-cyan-300/10 px-3 py-1 text-sm font-semibold text-cyan-200">{item.score}/100</span>
                  </div>
                  <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-4">
                    <SmallMetric title="Impact" value={item.impact} />
                    <SmallMetric title="Feasibility" value={item.feasibility} />
                    <SmallMetric title="Risk" value={item.risk} />
                    <SmallMetric title="Hours/year" value={formatHours(item.annualHoursSaved)} />
                  </dl>
                </article>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold">Implementation roadmap</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {result.roadmap.map((phase) => (
                <article key={phase.phase} className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                  <h3 className="font-semibold text-cyan-200">{phase.phase}</h3>
                  <ul className="mt-3 space-y-2 text-sm text-slate-300">
                    {phase.actions.map((action) => <li key={action}>• {action}</li>)}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

function Metric({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-4">
      <p className="text-sm text-cyan-100">{title}</p>
      <p className="mt-2 text-2xl font-bold text-white">{value}</p>
    </div>
  );
}

function SmallMetric({ title, value }: { title: string | number; value: string | number }) {
  return (
    <div>
      <dt className="text-slate-500">{title}</dt>
      <dd className="font-semibold text-slate-100">{value}</dd>
    </div>
  );
}
