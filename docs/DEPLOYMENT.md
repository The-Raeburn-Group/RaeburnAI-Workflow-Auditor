# Production Deployment

## Required checks

Run before deployment:

```bash
npm install
npm run lint
npm run typecheck
npm run test
npm run build
docker build -t raeburnai-workflow-auditor .
```

## Database

Saved audits require Postgres. Apply the schema before using `/api/audits`:

```bash
psql "$DATABASE_URL" -f db/schema.sql
```

Docker Compose starts Postgres and applies `db/schema.sql` automatically on first initialisation.

## Authentication and RBAC

The saved-audit API expects an upstream-authenticated `x-raeburn-user` header containing a base64url JSON session user with:

- `id`
- `email`
- `organisationId`
- `role`

Supported roles:

- `owner`
- `admin`
- `auditor`
- `viewer`

This allows production deployments to connect Clerk, Auth.js, enterprise SSO, API gateway auth or an internal identity provider without shipping an insecure demo password system.

## Vercel

1. Import the repository into Vercel.
2. Provision Postgres and set `DATABASE_URL`.
3. Set environment variables from `.env.example`.
4. Deploy from `main` after CI passes.
5. Confirm `/api/health` and `/api/ready` respond successfully.

## Docker

```bash
docker build -t raeburnai-workflow-auditor .
docker run -p 3000:3000 --env-file .env.local raeburnai-workflow-auditor
```

## Docker Compose

```bash
docker compose up --build
```

## Operational controls

- Store API keys in the platform secret manager.
- Do not log raw customer documents.
- Put public deployments behind TLS, WAF and platform-level rate limits.
- Review audit outputs before making staffing, compliance or financial decisions.
- Use human approval for any action that changes external systems.
- Use durable audit-event writes for enterprise deployments.

## TODO

- Add first-party login UI once a preferred identity provider is chosen.
- Add full browser E2E with Playwright once browser installation is configured in CI.
- Add formal migration tooling for schema versioning.
