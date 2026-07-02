import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import postgres from 'postgres';

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error('DATABASE_URL is required to run migrations.');

  const sql = postgres(databaseUrl, { max: 1, prepare: false });
  const migrationsDir = path.join(process.cwd(), 'db', 'migrations');
  const files = (await readdir(migrationsDir)).filter((file) => file.endsWith('.sql')).sort();

  await sql`create table if not exists schema_migrations (version text primary key, applied_at timestamptz not null default now())`;

  for (const file of files) {
    const existing = await sql`select version from schema_migrations where version = ${file} limit 1`;
    if (existing.length) {
      console.info(`Skipping ${file}`);
      continue;
    }

    const content = await readFile(path.join(migrationsDir, file), 'utf8');
    await sql.begin(async (tx) => {
      await tx.unsafe(content);
      await tx`insert into schema_migrations (version) values (${file})`;
    });
    console.info(`Applied ${file}`);
  }

  await sql.end();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
