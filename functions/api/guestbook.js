// Buzón de mensajes — GET /api/guestbook (aprobados) · POST /api/guestbook (nuevo mensaje)
// Necesita el enlace (binding) D1 llamado DB. Ver README y schema.sql.
import { json, clean, ipHash, verifyTurnstile } from "../_lib/util.js";

const MAX_NAME = 40, MAX_TEXT = 280, COOLDOWN_MS = 30000;

export async function onRequestGet({ env }) {
  if (!env.DB) return json({ ok: false, error: "no-db" }, 503);
  const { results } = await env.DB
    .prepare("SELECT id, name, message, created_at FROM guestbook WHERE approved = 1 ORDER BY created_at DESC LIMIT 60")
    .all();
  return json(
    { ok: true, items: results.map((r) => ({ id: r.id, name: r.name, text: r.message, t: r.created_at })) },
    200,
    { "Cache-Control": "public, max-age=30" }
  );
}

export async function onRequestPost({ request, env }) {
  if (!env.DB) return json({ ok: false, error: "no-db" }, 503);
  let body;
  try { body = await request.json(); } catch (e) { return json({ ok: false, error: "bad-json" }, 400); }

  if (body.website) return json({ ok: true, pending: true });          // trampa para bots (campo oculto)
  const name = clean(body.name, MAX_NAME), message = clean(body.message, MAX_TEXT);
  if (!name || !message) return json({ ok: false, error: "empty" }, 400);
  if (!(await verifyTurnstile(body.token, request, env))) return json({ ok: false, error: "turnstile" }, 403);

  const hash = await ipHash(request, env), now = Date.now();
  const recent = await env.DB
    .prepare("SELECT COUNT(*) AS n FROM guestbook WHERE ip_hash = ? AND created_at > ?")
    .bind(hash, now - COOLDOWN_MS).first();
  if (recent && recent.n > 0) return json({ ok: false, error: "slow-down" }, 429);

  const approved = env.AUTO_APPROVE === "1" ? 1 : 0;                   // por defecto, tú los apruebas
  await env.DB
    .prepare("INSERT INTO guestbook (name, message, created_at, approved, ip_hash) VALUES (?, ?, ?, ?, ?)")
    .bind(name, message, now, approved, hash).run();
  return json({ ok: true, pending: !approved }, 201);
}
