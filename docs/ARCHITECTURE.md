# Architecture

RaeburnAI Workflow Auditor is a lightweight AI audit product that can evolve into a multi-tenant SaaS.

## Request flow

1. User provides workflow material.
2. Client sends normalised text and hourly cost assumptions to `/api/audit`.
3. API validates the payload.
4. AI provider attempts structured audit generation.
5. Output is schema-validated.
6. If provider fails or no key exists, deterministic fallback generates a local audit.
7. UI renders readiness, savings, opportunities and roadmap.

## Core modules

- `app/page.tsx` — landing page and product shell
- `components/auditor-form.tsx` — audit input and output experience
- `app/api/audit/route.ts` — audit API
- `lib/ai-auditor.ts` — AI provider and schema validation
- `lib/fallback-auditor.ts` — local deterministic audit engine
- `lib/scoring.ts` — savings, scoring and readiness formulas
- `lib/types.ts` — domain types

## Production extension points

Recommended future modules:

- Postgres or Supabase persistence
- PDF and document extraction
- PDF, Markdown, CSV and JSON exports
- Google Drive and SharePoint imports
- CRM workflow mapping
- Jira or Linear implementation project creation

## Security posture

- No raw document logs by default
- Input length limits
- Schema-validated AI output
- Security headers in `next.config.mjs`
- Human-in-the-loop design
- Apache-2.0 open-source licence
