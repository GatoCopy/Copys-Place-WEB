/* Copy's Place — service worker
   Hace la página instalable y le deja abrir sin conexión.
   - Archivos propios (HTML, CSS, JS, datos): primero la red (así siempre ves lo último) y,
     si no hay conexión, la copia guardada.
   - Fuentes e imágenes: primero la copia guardada.
   - Nunca toca /api/, PDFs ni peticiones que no sean GET. */
const VERSION = "cp-v7";
const SHELL = [
  "/", "/css/theme.css", "/css/style.css", "/css/classic.css", "/css/seasons.css", "/css/pet.css", "/css/palettes.css", "/css/hero.css", "/css/dock.css", "/css/panel.css", "/css/game.css", "/css/ruta.css",
  "/data/calendar.js", "/data/content.js",
  "/js/core.js", "/js/cat.js", "/js/carousel.js", "/js/sections.js", "/js/library.js", "/js/boot.js", "/js/hero.js", "/js/dock.js", "/js/dog.js", "/js/panel.js", "/js/game.js", "/js/ruta.js", "/js/nav.js",
  "/js/guestbook.js", "/js/skin.js", "/js/seasons.js", "/js/pet.js", "/js/extras.js",
  "/assets/favicon.svg", "/404.html", "/novedades.html"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== "GET" || url.origin !== location.origin) return;
  if (url.pathname.startsWith("/api/") || url.pathname.endsWith(".pdf") || req.headers.has("range")) return;

  const staticAsset = /\.(woff2?|png|jpe?g|webp|avif|gif|svg|ico)$/i.test(url.pathname);
  if (staticAsset) {                                    // copia guardada primero
    e.respondWith(
      caches.match(req).then((hit) => hit || fetch(req).then((res) => {
        if (res.ok) { const copy = res.clone(); caches.open(VERSION).then((c) => c.put(req, copy)); }
        return res;
      }))
    );
    return;
  }
  e.respondWith(                                        // red primero, copia como respaldo
    fetch(req).then((res) => {
      if (res.ok) { const copy = res.clone(); caches.open(VERSION).then((c) => c.put(req, copy)); }
      return res;
    }).catch(() => caches.match(req).then((hit) => hit || (req.mode === "navigate" ? caches.match("/") : Response.error())))
  );
});
