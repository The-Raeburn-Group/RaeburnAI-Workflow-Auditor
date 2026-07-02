import Link from 'next/link';
import { AuditorForm } from '@/components/auditor-form';
import { BadgeCheck, FileText, Gauge, Route, ShieldCheck, Sparkles } from 'lucide-react';

const features = [
  ['Upload messy process docs', 'SOPs, org charts, policies, notes and process descriptions.', FileText],
  ['Find AI opportunities', 'Score automation ideas by impact, feasibility, risk and confidence.', Sparkles],
  ['Estimate savings', 'Turn repetitive work into hours, cost and ROI calculations.', Gauge],
  ['Generate roadmap', 'Create a phased implementation plan for quick wins and strategic work.', Route],
  ['Keep humans in control', 'Flag approvals, governance, data sensitivity and operational risks.', ShieldCheck],
  ['Built for consultants', 'Exportable audit language for SME transformation conversations.', BadgeCheck]
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto flex max-w-7xl flex-col gap-12 px-6 py-12 lg:flex-row lg:items-start lg:py-20">
        <div className="max-w-2xl flex-1">
          <div className="mb-6 inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-100">
            Open-source AI adoption audit engine
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            RaeburnAI Workflow Auditor
          </h1>
          <p className="mt-6 text-xl leading-8 text-slate-300">
            The Lighthouse for AI adoption. Upload process documents and receive a practical audit showing what to automate, what it could save, what risks to manage, and what to implement first.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/auth" className="rounded-xl bg-cyan-300 px-6 py-3 text-center font-semibold text-slate-950 transition hover:bg-cyan-200">
              Login or create workspace
            </Link>
            <a href="#workflow" className="rounded-xl bg-white/10 px-6 py-3 text-center font-semibold text-white transition hover:bg-white/20">
              Run stateless audit
            </a>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {features.map(([title, description, Icon]) => (
              <div key={title as string} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-cyan-950/20">
                <Icon className="mb-4 h-6 w-6 text-cyan-300" />
                <h2 className="font-semibold text-white">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
              </div>
            ))}
          </div>
        </div>
        <AuditorForm />
      </section>
    </main>
  );
}
