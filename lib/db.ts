import postgres from "postgres";

// Direct PostgreSQL connection — bypasses PostgREST and its schema cache entirely.
// Use this for any table that was recently created (schema cache lag) or for
// operations where RLS is not needed (server-side only).

let _sql: ReturnType<typeof postgres> | null = null;

export function getDb() {
  if (!_sql) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error("DATABASE_URL env var is not set");
    _sql = postgres(url, { ssl: "require", max: 5 });
  }
  return _sql;
}
