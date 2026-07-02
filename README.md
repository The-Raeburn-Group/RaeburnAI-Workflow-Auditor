# RaeburnAI Workflow Auditor ⭐⭐⭐⭐⭐

[![CI](https://github.com/The-Raeburn-Group/RaeburnAI-Workflow-Auditor/actions/workflows/ci.yml/badge.svg)](https://github.com/The-Raeburn-Group/RaeburnAI-Workflow-Auditor/actions/workflows/ci.yml)
[![Licence: Apache-2.0](https://img.shields.io/badge/Licence-Apache--2.0-blue.svg)](LICENSE)
[![RaeburnAI Platform](https://img.shields.io/badge/RaeburnAI-Platform-0f172a.svg)](https://github.com/The-Raeburn-Group)

## 1. Project name

RaeburnAI Workflow Auditor

## 2. One-line positioning statement

The open-source Lighthouse for AI adoption across SMEs, consultancies and operational teams.

## 3. Short product description

RaeburnAI Workflow Auditor turns SOPs, org charts, process notes and operational documents into a structured AI adoption audit. It identifies automation opportunities, estimates hours and cost saved, scores feasibility and risk, and generates a practical implementation roadmap without changing the core human-led operating model.

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
- AI automation opportunity detection
- Opportunity scoring by impact, feasibility, urgency, confidence and risk
- Hours-saved and cost-saving estimates
- Three-phase implementation roadmap
- Executive-ready dashboard output
- OpenAI-compatible audit provider
- Deterministic local fallback auditor for demos and tests
- Input validation with Zod
- Rate limiting for the audit endpoint
- Structured redacted logging
- Health and readiness endpoints
- Unit, integration and E2E-style tests
- CI, CodeQL, dependency audit and Docker build checks

## 6. Architecture

```text
User workflow text / demo data
        ↓
Next.js UI
        ↓
/api/audit
        ↓
Zod validation + rate limiting + request ID
        ↓
AI audit provider ── fallback auditor
        ↓
Schema-validated AuditResult
        ↓
Dashboard: readiness, savings, opportunities, roadmap
```

Core modules:

- `app/page.tsx` — product landing page and dashboard shell
- `components/auditor-form.tsx` — user input and audit result rendering
- `app/api/audit/route.ts` — validated audit API
- `app/api/health/route.ts` — liveness check
- `app/api/ready/route.ts` — readiness check
- `lib/ai-auditor.ts` — AI provider and output validation
- `lib/fallback-auditor.ts` — deterministic fallback engine
- `lib/scoring.ts` — scoring and savings calculations
- `lib/logger.ts` — structured redacted logs
- `lib/rate-limit.ts` — in-memory API rate limit
- `lib/audit-log.ts` — audit event and human approval helpers

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
npm run format:check
npm run lint
npm run typecheck
npm run test
npm run build
```

Docker:

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

## 9. Usage examples

Paste content from `examples/customer-support-sop.txt` into the app and run an audit.

Example workflow:

```text
The team checks a shared inbox, copies customer details into CRM, searches order data manually, sends templated responses, escalates refund approvals and updates weekly reports.
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
- AI output is schema-validated before rendering.
- Audit API has in-memory rate limiting.
- Logs are structured and redact sensitive field names.
- Request IDs are returned for supportability.
- Containers run as a non-root user.
- Human approval helpers are available for future risky write actions.
- CodeQL and dependency audit run in CI.

Known security TODOs are tracked in `SECURITY.md` and `docs/DEPLOYMENT.md`.

## 11. Production readiness

Current readiness: **82/100**.

Implemented:

- production Next.js build path
- CI quality gate
- CodeQL security scanning
- dependency audit command
- Docker build workflow
- Dockerfile and Compose configuration
- health and readiness endpoints
- structured logging
- rate limiting
- validation and safe error handling
- unit, integration and E2E-style tests
- open-source governance docs

Not yet complete:

- full browser E2E with Playwright
- persistent database for saved audits
- authentication and RBAC
- durable audit event storage
- real file upload parsing for PDF/DOCX/CSV

These are not faked; they are explicit roadmap/TODO items.

## 12. Roadmap

See [ROADMAP.md](ROADMAP.md).

Near-term priorities:

- PDF, DOCX, CSV and Markdown upload parsing
- export to PDF and Markdown
- saved audits
- authentication and organisation workspaces
- database persistence
- full browser E2E tests

## 13. Contributing

Contributions are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md).

Before opening a PR, run:

```bash
npm run ci
```

## 14. Licence

Apache-2.0. See [LICENSE](LICENSE).
