# Changelog

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

### Known limitations

- Browser E2E is represented by an E2E-style business-flow test until Playwright is added.
