/* ==========================================================
   Copy's Place — Extras pequeños
   - Cuenta regresiva al cumpleaños de CopyCat (29 de octubre), en el pie
   - El título de la pestaña te llama cuando te vas
   - Pausa las animaciones de lo que no se ve (rendimiento)
   - Analítica de Cloudflare (opcional) y app instalable (service worker)
   ========================================================== */
(function () {
  "use strict";
  var CP = window.CP;
  if (!CP) return;

  /* ---------- Cuenta regresiva al cumpleaños ---------- */
  var MONTH = 10, DAY = 29;                     // cámbialo aquí si hace falta
  var box = CP.$("#bday");
  if (box) {
    var now = (window.CALENDAR && window.CALENDAR.now) || new Date();
    var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    var next = new Date(now.getFullYear(), MONTH - 1, DAY);
    if (next < today) next = new Date(now.getFullYear() + 1, MONTH - 1, DAY);
    var n = Math.round((next - today) / 864e5);
    var text = n === 0 ? "¡Hoy es el cumpleaños de CopyCat!" :
      n === 1 ? "¡Mañana es el cumpleaños de CopyCat!" :
      "Faltan " + n + " días para el cumpleaños de CopyCat (29 de octubre)";
    box.innerHTML = CP.icon("cake") + CP.esc(text);
    box.hidden = false;
  }

  /* ---------- Título de la pestaña ---------- */
  var original = document.title, away = "¡Vuelve pronto! 🐾 · Copy's Place";
  document.addEventListener("visibilitychange", function () {
    document.title = document.hidden ? away : (CP && CP.pageTitle) || original;
  });

  /* ---------- Animaciones solo donde se ven ---------- */
  if ("IntersectionObserver" in window) {
    var offIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { en.target.classList.toggle("is-off", !en.isIntersecting); });
    }, { rootMargin: "120px 0px" });
    CP.$$("#sections > *, .hero, .footer").forEach(function (n) { offIO.observe(n); });
  }

  /* ---------- Analítica de Cloudflare (opcional) ----------
     Pon tu token en SITE.analyticsToken (data/content.js). También puedes activarla
     con un clic en el panel de Cloudflare Pages y dejar esto vacío. */
  var token = window.SITE && window.SITE.analyticsToken;
  if (token) {
    var sc = document.createElement("script");
    sc.defer = true;
    sc.src = "https://static.cloudflareinsights.com/beacon.min.js";
    sc.setAttribute("data-cf-beacon", JSON.stringify({ token: token }));
    document.head.appendChild(sc);
  }

  /* ---------- App instalable y modo sin conexión ---------- */
  var secure = location.protocol === "https:" || location.hostname === "localhost";
  if ("serviceWorker" in navigator && secure && !/[?&]nosw\b/.test(location.search)) {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("/sw.js").catch(function () {});
    });
  }
})();
