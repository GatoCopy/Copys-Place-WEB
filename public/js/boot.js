/* ==========================================================
   Copy's Place — Arranque
   Construye el menú, el drawer, las secciones y el pie de página
   a partir de data/content.js. No necesitas tocar este archivo.
   ========================================================== */
(function () {
  "use strict";
  var CP = window.CP, S = window.SITE;
  var $ = CP.$, esc = CP.esc;
  if (!S) { console.error("Falta data/content.js"); return; }

  /* Textos sueltos del inicio */
  CP.$$("[data-bind]").forEach(function (el) {
    var v = S[el.dataset.bind];
    if (v) el.textContent = v;
  });

  /* Menú (barra y drawer): "Inicio" + una entrada por sección */
  var entries = [{ id: "inicio", nav: "Inicio", icon: "home" }].concat((S.sections || []).map(function (s) {
    return { id: s.id, nav: s.nav || s.title || s.id, icon: s.icon || "pets" };
  }));
  var nav = $("#nav"), drawer = $("#drawer");
  entries.forEach(function (e, i) {
    var a = document.createElement("a");
    a.href = "#" + e.id;
    a.textContent = e.nav;
    nav.appendChild(a);

  });

  /* Secciones */
  CP.buildSections();

  /* Redes en el pie de página */
  $("#footer-social").innerHTML = (S.social || []).filter(function (s) { return s.url && s.url !== "#"; }).map(function (s) {
    return '<a class="icon-btn tonal rip" href="' + esc(s.url) + '" target="_blank" rel="noopener noreferrer" aria-label="' + esc(s.name) + '" title="' + esc(s.name) + '">' + CP.icon(s.icon || "link") + "</a>";
  }).join("");

  CP.initNav();
  CP.reveal(document);
})();
