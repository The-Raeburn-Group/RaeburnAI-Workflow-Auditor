# RaeburnAI Workflow Auditor ⭐⭐⭐⭐⭐

[![CI](https://github.com/The-Raeburn-Group/RaeburnAI-Workflow-Auditor/actions/workflows/ci.yml/badge.svg)](https://github.com/The-Raeburn-Group/RaeburnAI-Workflow-Auditor/actions/workflows/ci.yml)
[![Licence: Apache-2.0](https://img.shields.io/badge/Licence-Apache--2.0-blue.svg)](LICENSE)
[![RaeburnAI Platform](https://img.shields.io/badge/RaeburnAI-Platform-0f172a.svg)](https://github.com/The-Raeburn-Group)

## 1. Project name

RaeburnAI Workflow Auditor

## 2. One-line positioning statement

The open-source Lighthouse for AI adoption across SMEs, consultancies and operational teams.

## 3. Short product description

RaeburnAI Workflow Auditor turns SOPs, org charts, process notes and operational documents into a structured AI adoption audit. It identifies automation opportunities, estimates hours and cost saved, scores feasibility and risk, saves audit evidence, and generates a practical implementation roadmap without changing the core human-led operating model.

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
- Real PDF, DOCX, CSV, TXT and Markdown upload parsing
- AI automation opportunity detection
- Opportunity scoring by impact, feasibility, urgency, confidence and risk
- Hours-saved and cost-saving estimates
- Three-phase implementation roadmap
- Saved audits through Postgres persistence
- Tenant-scoped audit list/get/create APIs
- Auth/RBAC foundation with owner, admin, auditor and viewer roles
- Executive-ready dashboard output
- OpenAI-compatible audit provider
- Deterministic local fallback auditor for demos and tests
- Input validation with Zod
- Rate limiting for audit and upload endpoints
- Structured redacted logging
- Health and readiness endpoints
- Unit, integration and E2E-style tests
- CI, CodeQL, dependency audit and Docker build checks

## 6. Architecture

```text
PDF / DOCX / CSV / TXT / Markdown / pasted workflow text
        ↓
Next.js UI + /api/upload parser
        ↓
/api/audit or authenticated /api/audits
        ↓
Zod validation + rate limiting + request ID
        ↓
RBAC check for saved audit APIs
        ↓
AI audit provider ── fallback auditor
        ↓
Schema-validated AuditResult
        ↓
Dashboard + optional Postgres saved audit record
```

Core modules:

- `app/page.tsx` — product landing page and dashboard shell
- `components/auditor-form.tsx` — file upload, user input and audit result rendering
- `app/api/audit/route.ts` — validated stateless audit API
- `app/api/upload/route.ts` — in-memory upload parser API
- `app/api/audits/route.ts` — authenticated saved-audit API
- `app/api/health/route.ts` — liveness check
- `app/api/ready/route.ts` — readiness check
- `lib/auth.ts` — auth session parsing and RBAC checks
- `lib/database.ts` — Postgres persistence layer
- `lib/document-parser.ts` — PDF, DOCX, CSV and text extraction
- `lib/ai-auditor.ts` — AI provider and output validation
- `lib/fallback-auditor.ts` — deterministic fallback engine
- `lib/scoring.ts` — scoring and savings calculations
- `lib/logger.ts` — structured redacted logs
- `lib/rate-limit.ts` — in-memory API rate limit
- `lib/audit-log.ts` — audit event and human approval helpers
- `db/schema.sql` — production database schema

## 7. Quick start

```bash
git clone https://github.com/The-Raeburn-Group/RaeburnAI-Workflow-Auditor.git
cd RaeburnAI-Workflow-Auditor
cp .env.example .env.local
npm install
npm run dev
```

Open `http://localhost:3000`.

Run all local checks:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

Docker with Postgres:

```bash
docker build -t raeburnai-workflow-auditor .
docker compose up --build
```

## 8. Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `OPENAI_API_KEY` | No | Enables AI-powered audits. Without it, the deterministic fallback auditor runs. |
| `OPENAI_MODEL` | No | Defaults to `gpt-4o-mini`. |
| `NEXT_PUBLIC_APP_URL` | No | Public application URL. Defaults to local development URL. |
| `DEFAULT_HOURLY_RATE` | No | Default hourly cost assumption for savings estimates. |
| `DATABASE_URL` | Yes for saved audits | Postgres connection string used by `/api/audits`. Stateless `/api/audit` works without it. |

Authenticated saved-audit APIs currently expect an upstream-authenticated `x-raeburn-user` header containing a base64url JSON user payload. This is a production integration seam for Clerk/Auth.js/enterprise SSO rather than a fake password system.

## 9. Usage examples

Paste content from `examples/customer-support-sop.txt`, or upload PDF, DOCX, CSV, TXT or Markdown through the UI.

Example workflow:

```text
The team checks a shared inbox, copies customer details into CRM, searches order data manually, sends templated responses, escalates refund approvals and updates weekly reports.
```

Example saved audit request:

```bash
curl -X POST http://localhost:3000/api/audits \
  -H 'content-type: application/json' \
  -H 'x-raeburn-user: <base64url-session-user>' \
  -d '{"title":"Customer Support Audit","text":"The team checks inbox, updates CRM and prepares weekly reports.","hourlyRate":35}'
```

Example output includes:

- automated email triage and response drafting
- CRM and spreadsheet data-entry automation
- automated reporting and executive summaries
- human-in-the-loop approval workflow
- case handling copilot

## 10. Security model

- No secrets are committed.
- `.env.example` documents configuration without credentials.
- Raw process documents are not logged by default.
- Payloads are validated and length-limited.
- Uploads are parsed in memory and size-limited.
- AI output is schema-validated before rendering.
- Audit and upload APIs have in-memory rate limiting.
- Saved audit APIs require authenticated user context and RBAC.
- Saved audits are tenant-scoped by organisation ID.
- Source text is stored as a hash, not raw document text, in the audit metadata.
- Logs are structured and redact sensitive field names.
- Request IDs are returned for supportability.
- Containers run as a non-root user.
- Human approval helpers are available for risky write actions.
- CodeQL and dependency audit run in CI.

Known security TODOs are tracked in `SECURITY.md` and `docs/DEPLOYMENT.md`.

## 11. Production readiness

Current readiness: **90/100**.

Implemented:

- production Next.js build path
- CI quality gate
- CodeQL security scanning
- dependency audit command
- Docker build workflow
- Dockerfile and Compose configuration with Postgres
- health and readiness endpoints
- structured logging
- rate limiting
- validation and safe error handling
- auth/RBAC foundation
- Postgres database schema and persistence layer
- saved audit APIs
- real PDF, DOCX, CSV and text upload parsing
- unit, integration and E2E-style tests
- open-source governance docs

Not yet complete:

- full browser E2E with Playwright
- first-party login UI/session provider
- database migrations runner beyond `db/schema.sql`
- durable audit-event table writes for every security-sensitive operation

These are explicit production hardening items, not hidden gaps.

## 12. Roadmap

See [ROADMAP.md](ROADMAP.md).

Near-term priorities:

- first-party auth provider integration
- browser E2E with Playwright
- export to PDF and Markdown
- saved audit management UI
- formal migration tooling
- durable audit-event writes

## 13. Contributing

Contributions are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md).

Before opening a PR, run:

```bash
npm run ci
```

## 14. Licence

Apache-2.0. See [LICENSE](LICENSE).
