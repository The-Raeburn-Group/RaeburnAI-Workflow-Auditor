# Security Policy

## Supported versions

Security fixes target the latest `main` branch until formal releases are introduced.

## Reporting a vulnerability

Please do not open public issues for vulnerabilities. Use GitHub private vulnerability reporting where available, or contact the maintainers through the organisation security contact.

Include:

- affected version or commit
- reproduction steps
- impact
- suggested fix, if known

## Security design principles

- Built-in login and registration are implemented.
- Credentials are stored as bcrypt hashes.
- Sessions are signed and stored in HTTP-only cookies.
- Documents are processed in-memory by default during parsing.
- Raw customer documents must not be logged.
- Request payloads are validated with Zod.
- AI output is schema-validated before use.
- Rate limiting is applied to audit and upload endpoints.
- Saved audit APIs require authenticated user context.
- RBAC supports owner, admin, auditor and viewer roles.
- Account invite and role-management APIs require admin access.
- Saved audit reads and writes are tenant-scoped by organisation ID.
- Source text is hashed before being persisted as metadata.
- Security-sensitive auth, account and audit actions write durable audit events.
- Structured logs redact sensitive field names.
- Secrets must be managed through environment variables or deployment secret stores.
- Runtime containers use a non-root user.

## Responsible AI notes

The auditor provides directional operational analysis. Users must validate savings estimates, data sensitivity, regulatory requirements, employment impact and operational risk before implementation.

## Known security TODOs

- Add row-level security policies if deploying on Supabase or shared Postgres infrastructure.
- Add advanced account lifecycle actions such as suspend and delete user.
- Add enterprise SSO as an optional deployment mode.
