/* Copy's Place — navegación: enlace vivo a la sección, título de pestaña, botón atrás cierra el panel,
   gesto desde el borde, «copiar enlace» en los títulos, ?p=proyecto y avisos de conexión. */
(function () {
  "use strict";
  var CP = window.CP, S = window.SITE; if (!CP || !S) return;
  var $ = CP.$, $$ = CP.$$, base = "Copy's Place V3", secs = S.sections || [];
  var body = document.body, cur = "";

  /* ---------- Sección actual → hash y título ---------- */
  function title(id) {
    var s = secs.filter(function (x) { return x.id === id; })[0];
    return s ? (s.nav || s.overline) + " · " + base : base;
  }
  CP.pageTitle = base;
  function setCur(id) {
    if (id === cur) return; cur = id;
    CP.pageTitle = title(id); remember(id);
    if (!document.hidden) document.title = CP.pageTitle;
    try { history.replaceState(history.state, "", id === "inicio" ? location.pathname + location.search : "#" + id); } catch (e) {}
  }
  var ids = ["inicio"].concat(secs.map(function (s) { return s.id; }));
  if ("IntersectionObserver" in window) {
    var vis = {};
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (e) { vis[e.target.id] = e.isIntersecting ? e.intersectionRatio : 0; });
      var best = "", r = 0.01; ids.forEach(function (i) { if ((vis[i] || 0) > r) { r = vis[i]; best = i; } });
      if (best) setCur(best);
    }, { rootMargin: "-30% 0px -45% 0px", threshold: [0, 0.01, 0.25, 0.5, 0.75, 1] });
    ids.forEach(function (i) { var el = document.getElementById(i); if (el) io.observe(el); });
  }
  document.addEventListener("visibilitychange", function () {
    document.title = document.hidden ? "¡Vuelve pronto! 🐾 · " + base : CP.pageTitle;
  });

  /* ---------- Panel: el botón «atrás» lo cierra ---------- */
  var wasOpen = false;
  new MutationObserver(function () {
    var open = body.classList.contains("drawer-open");
    if (open && !wasOpen) { try { history.pushState({ cpPanel: 1 }, ""); } catch (e) {} }
    else if (!open && wasOpen && history.state && history.state.cpPanel) { wasOpen = open; try { history.back(); } catch (e) {} }
    wasOpen = open;
  }).observe(body, { attributes: true, attributeFilter: ["class"] });
  window.addEventListener("popstate", function () {
    if (body.classList.contains("drawer-open") && !(history.state && history.state.cpPanel) && CP.panel) CP.panel.close();
  });

  /* ---------- Gesto: deslizar desde el borde izquierdo abre, hacia la izquierda cierra ---------- */
  var sx = 0, sy = 0, tracking = false;
  document.addEventListener("touchstart", function (e) {
    var t = e.touches[0]; sx = t.clientX; sy = t.clientY;
    tracking = body.classList.contains("drawer-open") || sx < 18;
  }, { passive: true });
  document.addEventListener("touchend", function (e) {
    if (!tracking || !CP.panel) return; tracking = false;
    var t = e.changedTouches[0], dx = t.clientX - sx, dy = Math.abs(t.clientY - sy);
    if (dy > 60 || Math.abs(dx) < 70) return;
    if (dx > 0 && !body.classList.contains("drawer-open") && sx < 18) CP.panel.open();
    else if (dx < 0 && body.classList.contains("drawer-open")) CP.panel.close();
  }, { passive: true });

  /* ---------- «Copiar enlace» en el título de cada sección ---------- */
  function copy(text) {
    var ok = function () { CP.toast("Enlace copiado ✓"); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(ok, function () { CP.toast("No pude copiar el enlace."); });
    else CP.toast(text);
  }
  CP.copyLink = function (hash) { copy(location.origin + location.pathname + hash); };
  secs.forEach(function (s) {
    var h = $("#" + s.id + " h2");
    if (!h || h.querySelector(".h-link")) return;
    var b = document.createElement("button");
    b.type = "button"; b.className = "h-link"; b.setAttribute("aria-label", "Copiar enlace a " + (s.nav || s.title));
    b.innerHTML = CP.icon("link"); b.addEventListener("click", function () { CP.copyLink("#" + s.id); });
    h.appendChild(b);
  });

  /* ---------- Proyecto por enlace: ?p=id (y botón «copiar enlace» en su ventana) ---------- */
  var pid = new URLSearchParams(location.search).get("p");
  if (pid && CP.openProject) setTimeout(function () { CP.openProject(pid); }, 700);
  var oldOpen = CP.openProject;
  if (oldOpen) CP.openProject = function (id) {
    oldOpen(id);
    var head = $("#pd-title") && $("#pd-title").parentNode;
    if (head && !head.querySelector(".h-link")) {
      var b = document.createElement("button");
      b.type = "button"; b.className = "h-link"; b.setAttribute("aria-label", "Copiar enlace al proyecto"); b.innerHTML = CP.icon("link");
      b.addEventListener("click", function () { copy(location.origin + location.pathname + "?p=" + encodeURIComponent(id) + "#proyectos"); });
      head.appendChild(b);
    }
  };

  /* ---------- Versión clásica: todas las animaciones CSS al doble de velocidad ---------- */
  function fast(e) {
    if (document.documentElement.dataset.skin !== "classic" || !e.target.getAnimations) return;
    e.target.getAnimations().forEach(function (a) { if (a.playbackRate !== 2) a.playbackRate = 2; });
  }
  document.addEventListener("animationstart", fast, true);
  document.addEventListener("transitionrun", fast, true);

  /* ---------- Historial: secciones donde te quedaste un rato ---------- */
  var histT = 0;
  function remember(id) {
    clearTimeout(histT);
    var s = secs.filter(function (x) { return x.id === id; })[0];
    if (!s || !CP.hist) return;
    histT = setTimeout(function () { if (cur === id) CP.hist.add("section", id, s.nav || s.title, s.icon || "pets"); }, 4000);
  }

  /* ---------- Conexión ---------- */
  window.addEventListener("offline", function () { CP.toast("Sin conexión. Mientras vuelve, el gato te invita a jugar (tecla G)."); });
  window.addEventListener("online", function () { CP.toast("¡Conexión de vuelta!"); });

  /* ---------- Saltos exactos: tras un salto, si las secciones perezosas cambiaron de altura, se reajusta ---------- */
  function settle(id) {
    var el = document.getElementById(id); if (!el) return;
    var tries = 0, t = setInterval(function () {
      tries++;
      var off = Math.abs(el.getBoundingClientRect().top - (parseFloat(getComputedStyle(el).scrollMarginTop) || 0));
      if (off > 40 && !window.__cpUser) el.scrollIntoView({ behavior: "auto", block: "start" });
      if (tries > 3) clearInterval(t);
    }, 600);
  }
  ["wheel", "touchmove", "keydown"].forEach(function (ev) { window.addEventListener(ev, function () { window.__cpUser = true; }, { passive: true }); });
  document.addEventListener("click", function (e) {
    var a = e.target.closest('a[href^="#"]'); if (!a || a.getAttribute("href").length < 2) return;
    window.__cpUser = false; settle(a.getAttribute("href").slice(1));
  });
  var jump0 = CP.jump;
  if (jump0) CP.jump = function (id) { window.__cpUser = false; jump0(id); settle(id); };

  /* ---------- Con el hash al cargar: enfocar el título de la sección ---------- */
  function focusHash() {
    var id = location.hash.slice(1), el = id && document.getElementById(id);
    if (!el) return;
    var h = el.querySelector("h2"); if (h) { h.setAttribute("tabindex", "-1"); h.focus({ preventScroll: true }); }
  }
  window.addEventListener("hashchange", focusHash);
})();
