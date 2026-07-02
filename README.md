# RaeburnAI Workflow Auditor ⭐⭐⭐⭐⭐

[![CI](https://github.com/The-Raeburn-Group/RaeburnAI-Workflow-Auditor/actions/workflows/ci.yml/badge.svg)](https://github.com/The-Raeburn-Group/RaeburnAI-Workflow-Auditor/actions/workflows/ci.yml)
[![Licence: Apache-2.0](https://img.shields.io/badge/Licence-Apache--2.0-blue.svg)](LICENSE)
[![RaeburnAI Platform](https://img.shields.io/badge/RaeburnAI-Platform-0f172a.svg)](https://github.com/The-Raeburn-Group)

## 1. Project name

RaeburnAI Workflow Auditor

## 2. One-line positioning statement

The open-source Lighthouse for AI adoption across SMEs, consultancies and operational teams.

## 3. Short product description

RaeburnAI Workflow Auditor turns SOPs, org charts, process notes and operational documents into a structured AI adoption audit. It identifies automation opportunities, estimates hours and cost saved, scores feasibility and risk, saves audit evidence, and generates a practical implementation roadmap.

## 4. Part of the RaeburnAI Platform

RaeburnAI Workflow Auditor is one module in the wider **RaeburnAI Platform**: an open-source enterprise AI operating layer for governance, knowledge, workflow automation, executive intelligence and measurable business transformation.

The platform is designed as a connected ecosystem rather than a set of unrelated tools. Each module can run independently, but together they support the full AI adoption lifecycle: discover opportunities, govern risk, connect knowledge, brief leaders, automate work and measure outcomes.

### Ecosystem map

| Platform area | Project | Purpose |
| --- | --- | --- |
| AI adoption discovery | [RaeburnAI Workflow Auditor](https://github.com/The-Raeburn-Group/RaeburnAI-Workflow-Auditor) | Finds automation opportunities, savings and implementation priorities. |
| Governance and compliance | [RaeburnAI Compliance Engine](https://github.com/The-Raeburn-Group/RaeburnAI-Compliance-Engine) | Tracks AI governance, GDPR, ISO 42001, ISO 27001, EU AI Act and enterprise risk. |
| Knowledge layer | [Universal AI Knowledge Graph](https://github.com/The-Raeburn-Group/Universal-AI-Knowledge-Graph) | Connects organisational knowledge, entities, relationships and retrieval. |
| Business simulation | [RaeburnAI Business Twin](https://github.com/The-Raeburn-Group/RaeburnAI-Business-Twin) | Models business operations, scenarios, capacity and decision impact. |
| Leadership intelligence | [RaeburnAI Executive Briefing](https://github.com/The-Raeburn-Group/RaeburnAI-Executive-Briefing) | Produces board-level briefings, actions, risks and strategic summaries. |
| Platform orchestration | [RaeburnAI-Chain](https://github.com/The-Raeburn-Group/RaeburnAI-Chain) | Connects RaeburnAI modules into one LangChain-powered operating layer. |
| Operations visibility | [OpenAI Operations Dashboard](https://github.com/The-Raeburn-Group/OpenAI-Operations-Dashboard) | Monitors prompts, usage, spend, latency, safety and audit logs. |
| Commercial delivery | [RaeburnAI Proposal Generator](https://github.com/The-Raeburn-Group/RaeburnAI-Proposal-Generator) | Generates client proposals, roadmaps, pricing and ROI cases. |

## 5. Core features

- Workflow, SOP and process-text audit
- PDF, DOCX, CSV, TXT and Markdown upload parsing
- First-party login and registration UI
- Signed JWT sessions in HTTP-only cookies
- Password hashing with bcrypt
- Auth/RBAC with owner, admin, auditor and viewer roles
- Account invite and role-management UI
- Durable audit-event writes to Postgres
- Formal migration runner with tracked SQL migrations
- Saved audits through Postgres persistence
- Tenant-scoped audit list/get/create APIs
- AI automation opportunity scoring and savings estimates
- Three-phase implementation roadmap
- Playwright browser E2E tests
- CI, CodeQL, dependency audit and Docker build checks

## 6. Architecture

```text
Document upload or pasted workflow text
        ↓
Next.js UI + /auth + /account
        ↓
/api/audit or authenticated /api/audits
        ↓
Validation + rate limiting + request ID
        ↓
JWT session verification + RBAC
        ↓
AI provider or fallback auditor
        ↓
Dashboard + Postgres saved audits + durable audit events
```

Core modules include `app/auth/page.tsx`, `app/account/page.tsx`, `components/auth-panel.tsx`, `components/account-management-panel.tsx`, `app/api/auth/*`, `app/api/account/*`, `app/api/audits/route.ts`, `lib/auth.ts`, `lib/audit-log.ts`, `lib/database.ts`, `scripts/migrate.ts`, and `db/migrations`.

## 7. Quick start

```bash
git clone https://github.com/The-Raeburn-Group/RaeburnAI-Workflow-Auditor.git
cd RaeburnAI-Workflow-Auditor
cp .env.example .env.local
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

Open `http://localhost:3000` for audits, `http://localhost:3000/auth` for login, or `http://localhost:3000/account` for role management.

## 8. Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `OPENAI_API_KEY` | No | Enables AI-powered audits. |
| `OPENAI_MODEL` | No | Defaults to `gpt-4o-mini`. |
| `NEXT_PUBLIC_APP_URL` | No | Public application URL. |
| `DEFAULT_HOURLY_RATE` | No | Default hourly cost assumption. |
| `DATABASE_URL` | Yes for auth/saved audits | Postgres connection string. |
| `AUTH_SECRET` | Yes for auth | Long random value used to sign session JWTs. |

## 9. Usage examples

Paste content from `examples/customer-support-sop.txt`, upload PDF/DOCX/CSV/TXT/Markdown through the UI, create a workspace at `/auth`, manage roles at `/account`, and save audits through `/api/audits`.

## 10. Security model

- No secrets are committed.
- Passwords are hashed with bcrypt.
- Sessions are signed JWTs in HTTP-only cookies.
- Raw process documents are not logged by default.
- Payloads are validated and length-limited.
- Uploads are parsed in memory and size-limited.
- Saved audit APIs require authenticated user context and RBAC.
- Saved audits are tenant-scoped by organisation ID.
- Source text is stored as a hash, not raw document text, in audit metadata.
- Security-sensitive account and audit actions write durable audit events.
- CodeQL and dependency audit run in CI.

## 11. Production readiness

Current readiness: **97/100**.

Implemented:

- first-party login/register UI
- signed JWT cookie sessions
- bcrypt password hashing
- account invite and role-management UI
- durable audit-event writes
- Playwright browser E2E tests
- formal migration runner
- Postgres database schema and persistence layer
- saved audit APIs
- real PDF, DOCX, CSV and text upload parsing
- CI quality gate, CodeQL, dependency audit and Docker build workflow

Remaining improvements:

- invite acceptance email delivery provider
- advanced account lifecycle controls such as suspend/delete user
- optional enterprise SSO

## 12. Roadmap

See [ROADMAP.md](ROADMAP.md).

## 13. Contributing

Contributions are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md).

Before opening a PR, run:

```bash
npm run ci
npm run test:browser
```

## 14. Licence

Apache-2.0. See [LICENSE](LICENSE).
