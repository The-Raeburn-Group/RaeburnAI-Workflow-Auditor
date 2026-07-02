# Production Deployment

## Required checks

Run before deployment:

```bash
npm install
npm run format:check
npm run lint
npm run typecheck
npm run test
npm run build
docker build -t raeburnai-workflow-auditor .
```

## Vercel

1. Import the repository into Vercel.
2. Set environment variables from `.env.example`.
3. Deploy from `main` after CI passes.
4. Confirm `/api/health` and `/api/ready` respond successfully.

## Docker

```bash
docker build -t raeburnai-workflow-auditor .
docker run -p 3000:3000 raeburnai-workflow-auditor
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

## TODO

- Add persistent database once saved audits are introduced.
- Add auth/RBAC once organisation workspaces are introduced.
- Add full browser E2E with Playwright once browser installation is configured in CI.
