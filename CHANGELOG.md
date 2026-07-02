# Changelog

## 1.3.0 - 2026-07-02

### Added

- Playwright browser E2E test framework.
- Browser coverage for audit flow, auth page and account management page.
- CI browser E2E job with Chromium installation.
- Account management page at `/account`.
- User invitation API and UI.
- Role update API and UI.
- Durable audit-event writes to Postgres.
- Durable audit-event review API and UI.
- Invitation database schema and migration.

### Changed

- Auth, account and saved-audit actions now write durable security events.
- README, SECURITY and ROADMAP updated to remove the final blockers.

## 1.2.0 - 2026-07-02

### Added

- Built-in login and registration UI at `/auth`.
- Registration, login, logout and session APIs.
- Signed JWT sessions stored in HTTP-only cookies.
- bcrypt password hashing.
- Formal migration runner with `npm run db:migrate`.
- Seed runner with `npm run db:seed`.
- Tracked initial SQL migration in `db/migrations`.

### Changed

- Saved audit APIs now use first-party session auth.
- README, deployment docs and roadmap updated to remove login and migration blockers.

## 1.1.0 - 2026-07-02

### Added

- Auth and RBAC foundation with owner, admin, auditor and viewer roles.
- Postgres database schema and persistence layer.
- Saved audit list, get and create API.
- Upload parsing for PDF, DOCX, CSV, TXT and Markdown.
- Upload parsing UI.
- Docker Compose Postgres service.
- Database and auth deployment documentation.
- Parser and RBAC tests.

### Changed

- README, SECURITY, ROADMAP and deployment docs now reflect implemented persistence, saved audits, RBAC and upload parsing.

## 1.0.0 - 2026-07-02

### Added

- Production-ready Next.js scaffold.
- Workflow audit UI.
- AI audit API with validation, request IDs and rate limiting.
- Deterministic fallback audit engine.
- Opportunity scoring and savings calculations.
- Structured logging and audit logging helpers.
- Health and readiness endpoints.
- CI, dependency audit, CodeQL and Docker build checks.
- Dockerfile and Compose configuration.
- Unit, integration and E2E-style tests.
- Demo workflow data.
- Security, contributing, roadmap and deployment documentation.
