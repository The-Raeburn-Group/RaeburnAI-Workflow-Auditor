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

- Documents are processed in-memory by default.
- Raw customer documents must not be logged.
- Request payloads are validated with Zod.
- AI output is schema-validated before use.
- Rate limiting is applied to the audit endpoint.
- Structured logs redact keys, secrets, tokens, passwords and document-like fields.
- Human approval is required for external actions and high-risk workflow changes.
- Secrets must be managed through environment variables or deployment secret stores.
- Runtime containers use a non-root user.

## Responsible AI notes

The auditor provides directional operational analysis. Users must validate savings estimates, data sensitivity, regulatory requirements, employment impact and operational risk before implementation.

## Known security TODOs

- Add authentication and RBAC before saving audits or supporting teams.
- Add tenant-isolated persistence before multi-user SaaS deployment.
- Add durable audit event storage once sensitive write actions are introduced.
