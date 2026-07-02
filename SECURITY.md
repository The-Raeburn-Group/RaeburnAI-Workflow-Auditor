# Security Policy

## Supported versions

Security fixes target the latest `main` branch until formal releases are introduced.

## Reporting a vulnerability

Please do not open public issues for vulnerabilities. Email the maintainers or use GitHub private vulnerability reporting where available.

Include:

- affected version or commit
- reproduction steps
- impact
- suggested fix, if known

## Security design principles

- Documents are processed in-memory by default.
- Do not log raw uploaded process documents in production.
- Validate all request payloads with Zod.
- Keep AI output behind schema validation.
- Use human approval for external actions and high-risk workflow changes.
- Avoid storing secrets in the repository.

## Responsible AI notes

The auditor provides directional operational analysis. Users must validate savings estimates, data sensitivity, regulatory requirements and employment impacts before implementation.
