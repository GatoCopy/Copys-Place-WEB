// Utilidades compartidas por las funciones de Cloudflare Pages.

export function json(data, status = 200, extra = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", ...extra }
  });
}

export function clean(text, max) {
  return String(text == null ? "" : text)
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")   // sin caracteres de control
    .replace(/[ \t]+/g, " ")
    .trim()
    .slice(0, max);
}

// Huella anónima de la IP (nunca se guarda la IP en claro)
export async function ipHash(request, env) {
  const ip = request.headers.get("CF-Connecting-IP") || "0.0.0.0";
  const data = new TextEncoder().encode(ip + "|" + (env.HASH_SALT || "copys-place"));
  const buf = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(buf)].slice(0, 12).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function verifyTurnstile(token, request, env) {
  if (!env.TURNSTILE_SECRET) return true;            // sin secreto configurado: no se exige (desarrollo)
  if (!token) return false;
  const body = new URLSearchParams({
    secret: env.TURNSTILE_SECRET,
    response: token,
    remoteip: request.headers.get("CF-Connecting-IP") || ""
  });
  try {
    const r = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body });
    const d = await r.json();
    return !!d.success;
  } catch (e) {
    return false;
  }
}

export function isAdmin(request, env) {
  const want = env.ADMIN_TOKEN;
  if (!want) return null;                             // sin token configurado: el panel está desactivado
  const got = (request.headers.get("Authorization") || "").replace(/^Bearer\s+/i, "");
  if (got.length !== want.length) return false;
  let diff = 0;
  for (let i = 0; i < want.length; i++) diff |= got.charCodeAt(i) ^ want.charCodeAt(i);
  return diff === 0;
}
