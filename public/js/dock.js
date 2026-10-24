/* ==========================================================
   Copy's Place — Dock de secciones (las dos versiones)
   - Aparece al bajar del inicio y se queda fijo en la ventana.
   - Píldora flotante centrada abajo (solo atajos). El menú de arriba se queda
     siempre visible con el logo, el botón de tema y —mientras el dock está
     puesto— el nombre de la sección en la que estás.
   - La sección actual se resalta sola; tocar un icono salta a ella.
   - La mascota pequeña camina POR ENCIMA del dock (variable --pet-lift).
   Todo sale de data/content.js (las mismas secciones que el menú).
   ========================================================== */
(function () {
  "use strict";
  var CP = window.CP, S = window.SITE;
  if (!CP || !S || !(S.sections || []).length) return;
  var $ = CP.$, esc = CP.esc, icon = CP.icon, root = document.documentElement;
  var hero = $("#inicio");
  if (!hero) return;

  var TONES = ["p", "t", "s"];
  var items = S.sections.map(function (s, i) {
    return { id: s.id, nav: s.nav || s.title || s.id, icon: s.icon || "pets", tone: TONES[i % 3] };
  });

  var dock = document.createElement("nav");
  dock.className = "dock"; dock.id = "dock";
  dock.setAttribute("aria-label", "Atajos a las secciones");
  dock.setAttribute("inert", "");
  dock.innerHTML =
    '<div class="dock-track" id="dock-track">' +
    items.map(function (it) {
      return '<a class="dock-item" href="#' + esc(it.id) + '" data-id="' + esc(it.id) + '" data-tone="' + it.tone + '" aria-label="' + esc(it.nav) + '">' +
        icon(it.icon) + "<span>" + esc(it.nav) + "</span></a>";
    }).join("") + "</div>";
  document.body.appendChild(dock);
  root.classList.add("has-dock");

  var track = $("#dock-track"), links = CP.$$(".dock-item", dock), on = false, cur = "";
  var secEl = $("#brand-sec");
  function label(txt) {
    if (!secEl || secEl.textContent === txt) return;
    secEl.classList.remove("swap"); void secEl.offsetWidth;
    secEl.textContent = txt; secEl.classList.add("swap");
  }

  /* aparece cuando el inicio ya casi quedó atrás */
  function check() {
    var show = window.scrollY > hero.offsetHeight * 0.55;
    if (show === on) return;
    on = show;
    root.classList.toggle("dock-on", on);
    if (on) dock.removeAttribute("inert"); else dock.setAttribute("inert", "");
    if (on) center(cur);
    if (secEl) secEl.classList.toggle("on", on);
  }
  var ticking = false;
  window.addEventListener("scroll", function () {
    if (ticking) return; ticking = true;
    requestAnimationFrame(function () { ticking = false; check(); });
  }, { passive: true });
  window.addEventListener("resize", check);

  /* centra el icono activo en la barra (solo mueve la barra, no la página) */
  function center(id) {
    var a = links.filter(function (l) { return l.dataset.id === id; })[0];
    if (!a || track.scrollWidth <= track.clientWidth) return;
    var left = a.offsetLeft - (track.clientWidth - a.offsetWidth) / 2;
    track.scrollTo({ left: Math.max(0, left), behavior: CP.reduceMotion || !on ? "auto" : "smooth" });
  }
  function setCurrent(id) {
    if (id === cur) return;
    cur = id;
    if (id === "inicio") { links.forEach(function (l) { l.removeAttribute("aria-current"); }); label("Inicio"); return; }
    links.forEach(function (l) {
      if (l.dataset.id === id) { l.setAttribute("aria-current", "true"); dock.dataset.tone = l.dataset.tone; label(l.getAttribute("aria-label")); }
      else l.removeAttribute("aria-current");
    });
    center(id);
  }
  setCurrent("inicio");

  if ("IntersectionObserver" in window) {
    var spy = new IntersectionObserver(function (en) {
      en.forEach(function (e) { if (e.isIntersecting) setCurrent(e.target.id); });
    }, { rootMargin: "-45% 0px -50% 0px" });
    items.forEach(function (it) { var s = document.getElementById(it.id); if (s) spy.observe(s); });
  }

  /* con el teclado del móvil abierto, el dock se aparta */
  var hideT = 0;
  document.addEventListener("focusin", function (e) {
    if (e.target.matches && e.target.matches("input, textarea, select")) { clearTimeout(hideT); root.classList.add("dock-hide"); }
  });
  document.addEventListener("focusout", function () {
    clearTimeout(hideT); hideT = setTimeout(function () { root.classList.remove("dock-hide"); }, 150);
  });
  check();
})();
