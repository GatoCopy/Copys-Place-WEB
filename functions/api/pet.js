// Caricias de la mascota — GET /api/pet (total) · POST /api/pet (suma una)
// Necesita el enlace (binding) D1 llamado DB. Ver schema.sql.
import { json } from "../_lib/util.js";

export async function onRequestGet({ env }) {
  if (!env.DB) return json({ ok: false, error: "no-db" }, 503);
  const row = await env.DB.prepare("SELECT value FROM counters WHERE key = 'pets'").first();
  return json({ ok: true, total: row ? row.value : 0 }, 200, { "Cache-Control": "public, max-age=20" });
}

export async function onRequestPost({ env }) {
  if (!env.DB) return json({ ok: false, error: "no-db" }, 503);
  const row = await env.DB
    .prepare("INSERT INTO counters (key, value) VALUES ('pets', 1) ON CONFLICT(key) DO UPDATE SET value = value + 1 RETURNING value")
    .first();
  return json({ ok: true, total: row ? row.value : 1 });
}
