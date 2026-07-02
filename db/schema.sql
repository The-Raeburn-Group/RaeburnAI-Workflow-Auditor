create extension if not exists pgcrypto;

create table if not exists schema_migrations (
  version text primary key,
  applied_at timestamptz not null default now()
);

create table if not exists organisations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references organisations(id) on delete cascade,
  email text not null,
  name text,
  password_hash text,
  role text not null check (role in ('owner', 'admin', 'auditor', 'viewer')),
  created_at timestamptz not null default now(),
  unique (organisation_id, email)
);

create unique index if not exists users_email_global_idx on users (lower(email));

create table if not exists audits (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references organisations(id) on delete cascade,
  created_by uuid not null references users(id) on delete restrict,
  title text not null,
  source_type text not null,
  source_name text,
  source_text_hash text not null,
  result jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists audits_organisation_created_idx on audits (organisation_id, created_at desc);
create index if not exists audits_result_gin_idx on audits using gin (result);

create table if not exists audit_events (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid references organisations(id) on delete cascade,
  actor_id uuid references users(id) on delete set null,
  action text not null,
  resource_type text not null,
  resource_id text,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create index if not exists audit_events_organisation_created_idx on audit_events (organisation_id, created_at desc);
