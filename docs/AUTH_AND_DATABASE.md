# Auth, RBAC and Database

## Auth model

RaeburnAI Workflow Auditor now includes first-party workspace authentication:

- `POST /api/auth/register` creates an organisation and owner account.
- `POST /api/auth/login` verifies email and password credentials.
- `POST /api/auth/logout` clears the session cookie.
- `GET /api/auth/session` returns the current signed-in user.
- `/auth` provides the login and registration UI.

Passwords are hashed with bcrypt. Sessions are signed JWTs stored in HTTP-only cookies using `AUTH_SECRET`.

## Roles

| Role | Access |
| --- | --- |
| `owner` | Full organisation-level access. |
| `admin` | Administrative access except ownership transfer. |
| `auditor` | Create and read audits. |
| `viewer` | Read audits only. |

Saved audit APIs enforce role checks server-side and scope all reads/writes to the signed-in user's organisation.

## Database setup

```bash
createdb raeburnai_workflow_auditor
npm run db:migrate
npm run db:seed
```

Docker Compose applies `db/schema.sql` automatically on first database initialisation. For repeatable production upgrades, use `npm run db:migrate`.

## Demo users

After `npm run db:seed`, these demo users are available with password `ChangeMeSecurely123!`:

- `owner@example.com`
- `auditor@example.com`
- `viewer@example.com`

Change or remove demo users before production deployment.

## Saved audit endpoints

```bash
GET /api/audits
GET /api/audits?id=<audit-id>
POST /api/audits
```

`POST /api/audits` requires at least the `auditor` role. `GET /api/audits` requires at least the `viewer` role.
