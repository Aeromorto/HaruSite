/** Aplica SQL versionado em transação. Não altera schema automaticamente ao iniciar a API. */
const { Pool } = require('pg');
const fs = require('node:fs');
const path = require('node:path');
async function migrate() {
  if (!process.env.DATABASE_URL) throw new Error('Configure DATABASE_URL no .env da raiz.');
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    // Serializa processos concorrentes de deploy antes de criar a tabela de controle.
    await client.query('SELECT pg_advisory_xact_lock(714209)');
    await client.query('CREATE TABLE IF NOT EXISTS schema_migrations (name text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now())');
    const dir = path.join(__dirname, '../migrations');
    for (const name of fs.readdirSync(dir).filter(n => n.endsWith('.sql')).sort()) {
      if ((await client.query('SELECT 1 FROM schema_migrations WHERE name=$1', [name])).rowCount) continue;
      await client.query(fs.readFileSync(path.join(dir, name), 'utf8'));
      await client.query('INSERT INTO schema_migrations(name) VALUES($1)', [name]);
      console.log('Aplicada:', name);
    }
    await client.query('COMMIT');
  } catch (error) { await client.query('ROLLBACK'); throw error; }
  finally { client.release(); await pool.end(); }
}
migrate().catch(() => { console.error('Falha na migração. Confira conexão e SQL; transação revertida.'); process.exitCode = 1; });
