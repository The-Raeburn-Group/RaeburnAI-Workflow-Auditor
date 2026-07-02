import { AuthPanel } from '@/components/auth-panel';

export default function AuthPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 max-w-3xl">
          <p className="mb-4 inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-100">
            First-party workspace login
          </p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Access RaeburnAI Workflow Auditor</h1>
          <p className="mt-4 text-lg leading-8 text-slate-300">
            Create an organisation workspace or sign in to save audits, review previous reports and enforce RBAC across owner, admin, auditor and viewer roles.
          </p>
        </div>
        <AuthPanel />
      </div>
    </main>
  );
}
