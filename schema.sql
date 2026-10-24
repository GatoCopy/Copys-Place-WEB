-- Base de datos D1 de Copy's Place.
-- Créala y aplica este archivo (una sola vez):
--   npx wrangler d1 create copys-place
--   npx wrangler d1 execute copys-place --remote --file=schema.sql
CREATE TABLE IF NOT EXISTS guestbook (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT    NOT NULL,
  message     TEXT    NOT NULL,
  created_at  INTEGER NOT NULL,           -- milisegundos
  approved    INTEGER NOT NULL DEFAULT 0, -- 0 = pendiente, 1 = publicado
  ip_hash     TEXT                         -- huella anónima, solo para limitar el spam
);
CREATE INDEX IF NOT EXISTS idx_guestbook_approved ON guestbook (approved, created_at);
CREATE INDEX IF NOT EXISTS idx_guestbook_ip ON guestbook (ip_hash, created_at);

CREATE TABLE IF NOT EXISTS counters (
  key   TEXT PRIMARY KEY,
  value INTEGER NOT NULL DEFAULT 0
);

