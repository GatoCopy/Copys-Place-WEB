// Moderación del buzón (la usa /admin). Protegida con el secreto ADMIN_TOKEN.
//   GET  /api/admin/guestbook                    → todos los mensajes (pendientes primero)
//   POST /api/admin/guestbook {id, action}       → action: "approve" | "hide" | "delete"
import { json, isAdmin } from "../../_lib/util.js";

function guard(request, env) {
  const ok = isAdmin(request, env);
  if (ok === null) return json({ ok: false, error: "admin-disabled" }, 503);
  if (!ok) return json({ ok: false, error: "unauthorized" }, 401);
  return null;
}

export async function onRequestGet({ request, env }) {
  const denied = guard(request, env);
  if (denied) return denied;
  if (!env.DB) return json({ ok: false, error: "no-db" }, 503);
  const { results } = await env.DB
    .prepare("SELECT id, name, message, created_at, approved FROM guestbook ORDER BY approved ASC, created_at DESC LIMIT 200")
    .all();
  return json({ ok: true, items: results });
}

export async function onRequestPost({ request, env }) {
  const denied = guard(request, env);
  if (denied) return denied;
  if (!env.DB) return json({ ok: false, error: "no-db" }, 503);
  let body;
  try { body = await request.json(); } catch (e) { return json({ ok: false, error: "bad-json" }, 400); }
  const id = Number(body.id);
  if (!Number.isInteger(id)) return json({ ok: false, error: "bad-id" }, 400);
  if (body.action === "approve") await env.DB.prepare("UPDATE guestbook SET approved = 1 WHERE id = ?").bind(id).run();
  else if (body.action === "hide") await env.DB.prepare("UPDATE guestbook SET approved = 0 WHERE id = ?").bind(id).run();
  else if (body.action === "delete") await env.DB.prepare("DELETE FROM guestbook WHERE id = ?").bind(id).run();
  else return json({ ok: false, error: "bad-action" }, 400);
  return json({ ok: true });
}
