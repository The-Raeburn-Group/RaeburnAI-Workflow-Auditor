import postgres from 'postgres';
import type { AuditResult } from './types';

let client: postgres.Sql | null = null;

export function getDatabase() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL is required for persistence operations.');
  }

  if (!client) {
    client = postgres(connectionString, {
      max: 5,
      idle_timeout: 20,
      connect_timeout: 10,
      prepare: false
    });
  }

  return client;
}

export type SavedAuditInput = {
  organisationId: string;
  createdBy: string;
  title: string;
  sourceType: string;
  sourceName?: string | null;
  sourceTextHash: string;
  result: AuditResult;
};

export async function saveAudit(input: SavedAuditInput) {
  const sql = getDatabase();
  const rows = await sql<{ id: string }[]>`
    insert into audits (
      organisation_id,
      created_by,
      title,
      source_type,
      source_name,
      source_text_hash,
      result
    ) values (
      ${input.organisationId},
      ${input.createdBy},
      ${input.title},
      ${input.sourceType},
      ${input.sourceName || null},
      ${input.sourceTextHash},
      ${sql.json(input.result)}
    )
    returning id
  `;

  return rows[0];
}

export async function listAudits(organisationId: string) {
  const sql = getDatabase();
  return sql`
    select id, title, source_type, source_name, created_at, result->'summary' as summary
    from audits
    where organisation_id = ${organisationId}
    order by created_at desc
    limit 100
  `;
}

export async function getAudit(organisationId: string, auditId: string) {
  const sql = getDatabase();
  const rows = await sql`
    select id, title, source_type, source_name, created_at, result
    from audits
    where organisation_id = ${organisationId} and id = ${auditId}
    limit 1
  `;

  return rows[0] || null;
}
