# RaeburnAI Workflow Auditor

> Maintained by **Raeburn Technologies**, part of **The Raeburn Group**.
>
> Group: https://theraeburngroup.com · Technology: https://technology.theraeburngroup.com · Trust: https://trust.theraeburngroup.com

## Overview

RaeburnAI Workflow Auditor is an open-source workflow-analysis application for identifying automation opportunities, estimating potential time and cost savings, recording audit evidence and producing implementation roadmaps from process documentation.

The project is part of the RaeburnAI technology initiative within the wider Raeburn Technologies portfolio.

## Current maturity

**Status: advanced foundation / active development.**

Implemented capabilities include first-party authentication, role management, durable audit events, Postgres persistence, document parsing, CI, CodeQL, dependency review and browser tests. Remaining work includes production email delivery for invitations, broader account-lifecycle controls and optional enterprise SSO.

No numerical maturity score or independent production certification is claimed by this repository.

## Core capabilities

- Workflow, SOP and process-text analysis
- PDF, DOCX, CSV, TXT and Markdown upload parsing
- Login and registration UI
- Signed JWT sessions in HTTP-only cookies
- Password hashing with bcrypt
- Role-based access control
- Account invite and role-management UI
- Durable audit-event writes to Postgres
- Saved, tenant-scoped audits
- Automation opportunity scoring and savings estimates
- Three-phase implementation roadmaps
- Playwright browser tests
- CI, CodeQL, dependency audit and Docker build checks

## Architecture

```text
Document upload or pasted workflow text
        ↓
Next.js UI + authentication/account controls
        ↓
Audit APIs
        ↓
Validation + rate limiting + request ID
        ↓
Session verification + RBAC
        ↓
AI provider or fallback auditor
        ↓
Dashboard + Postgres persistence + audit events
```

## Quick start

```bash
git clone https://github.com/The-Raeburn-Group/RaeburnAI-Workflow-Auditor.git
cd RaeburnAI-Workflow-Auditor
cp .env.example .env.local
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

Open `http://localhost:3000` for audits, `http://localhost:3000/auth` for authentication, or `http://localhost:3000/account` for role management.

## Validation before deployment

```bash
npm install
npm run lint
npm run typecheck
npm run test
npm run build
npx playwright install chromium
npm run test:browser
docker build -t raeburnai-workflow-auditor .
```

Production deployment guidance is maintained in [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md).

## Configuration

| Variable | Required | Description |
|---|---|---|
| `OPENAI_API_KEY` | No | Enables AI-assisted audits |
| `OPENAI_MODEL` | No | Model configuration |
| `NEXT_PUBLIC_APP_URL` | No | Public application URL |
| `DEFAULT_HOURLY_RATE` | No | Default cost assumption |
| `DATABASE_URL` | Yes for auth/saved audits | Postgres connection string |
| `AUTH_SECRET` | Yes for auth | Session-signing secret |

## Security model

Current controls include bcrypt password hashing, signed HTTP-only sessions, bounded payload validation, in-memory upload processing, tenant-scoped saved audits, durable audit events and CI security checks.

Source process text is stored as a hash rather than raw document content in audit metadata. Production deployments should follow the repository security and deployment documentation and use environment-appropriate secret management and access controls.

Repository controls do not constitute independent security certification or assurance.

## Related published projects

- [RaeburnAI AgentOS](https://github.com/The-Raeburn-Group/RaeburnAI-AgentOS)
- [RaeburnAI Enterprise MCP Server](https://github.com/The-Raeburn-Group/RaeburnAI-Enterprise-MCP-Server)
- [Universal AI Knowledge Graph](https://github.com/The-Raeburn-Group/Universal-AI-Knowledge-Graph)
- [RaeburnAI Business Twin](https://github.com/The-Raeburn-Group/RaeburnAI-Business-Twin)

Only currently published repositories are listed here.

## Roadmap

See [ROADMAP.md](ROADMAP.md).

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Before opening a pull request, run the repository's documented CI commands.

## Licence

Apache-2.0. See [LICENSE](LICENSE).

---

**Raeburn Technologies · The Raeburn Group**
