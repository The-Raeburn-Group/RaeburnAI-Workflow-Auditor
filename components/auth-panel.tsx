'use client';

import { useState } from 'react';

type Mode = 'login' | 'register';

export function AuthPanel() {
  const [mode, setMode] = useState<Mode>('login');
  const [organisationName, setOrganisationName] = useState('Demo Organisation');
  const [name, setName] = useState('Owner User');
  const [email, setEmail] = useState('owner@example.com');
  const [password, setPassword] = useState('ChangeMeSecurely123!');
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit() {
    setIsSubmitting(true);
    setError(null);
    setStatus(null);

    try {
      const response = await fetch(mode === 'login' ? '/api/auth/login' : '/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mode === 'login' ? { email, password } : { organisationName, name, email, password })
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || 'Authentication failed');

      setStatus(`Signed in as ${payload.user.email} (${payload.user.role}).`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown authentication error');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    setStatus('Signed out.');
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
      <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 shadow-2xl shadow-cyan-950/30">
        <div className="mb-6 flex gap-3">
          <button className={`rounded-xl px-4 py-2 font-semibold ${mode === 'login' ? 'bg-cyan-300 text-slate-950' : 'bg-white/10 text-slate-200'}`} onClick={() => setMode('login')}>
            Login
          </button>
          <button className={`rounded-xl px-4 py-2 font-semibold ${mode === 'register' ? 'bg-cyan-300 text-slate-950' : 'bg-white/10 text-slate-200'}`} onClick={() => setMode('register')}>
            Register workspace
          </button>
        </div>

        {mode === 'register' && (
          <>
            <Field label="Organisation name" value={organisationName} onChange={setOrganisationName} />
            <Field label="Your name" value={name} onChange={setName} />
          </>
        )}

        <Field label="Email" value={email} onChange={setEmail} type="email" />
        <Field label="Password" value={password} onChange={setPassword} type="password" />

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button onClick={submit} disabled={isSubmitting} className="rounded-xl bg-cyan-300 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-200 disabled:opacity-50">
            {isSubmitting ? 'Working…' : mode === 'login' ? 'Login' : 'Create workspace'}
          </button>
          <button onClick={logout} className="rounded-xl bg-white/10 px-6 py-3 font-semibold text-white transition hover:bg-white/20">
            Logout
          </button>
        </div>

        {status && <p className="mt-4 rounded-xl border border-emerald-400/30 bg-emerald-500/10 p-3 text-sm text-emerald-100">{status}</p>}
        {error && <p className="mt-4 rounded-xl border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-100">{error}</p>}
      </div>

      <aside className="rounded-3xl border border-white/10 bg-slate-900/70 p-6">
        <h2 className="text-xl font-bold">RBAC model</h2>
        <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
          <li>Owner: full organisation-level access.</li>
          <li>Admin: administrative access except ownership transfer.</li>
          <li>Auditor: create and read audits.</li>
          <li>Viewer: read audits only.</li>
        </ul>
        <p className="mt-6 text-sm leading-6 text-slate-400">Sessions use signed JWTs stored in HTTP-only cookies. Saved audit APIs enforce tenant scope and minimum roles server-side.</p>
      </aside>
    </section>
  );
}

function Field({ label, value, onChange, type = 'text' }: { label: string; value: string; onChange: (value: string) => void; type?: string }) {
  return (
    <label className="mb-4 block text-sm font-medium text-slate-200">
      {label}
      <input type={type} value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none ring-cyan-400/40 focus:ring-4" />
    </label>
  );
}
