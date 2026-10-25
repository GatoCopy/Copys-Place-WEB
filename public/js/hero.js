/* ==========================================================
   Copy's Place — Inicio. Aquí NO se repite nada de las secciones de abajo:
   - tarjeta/paneles «Hoy»: hora, cumpleaños y cifras del sitio (con enlaces)
   - fila «Explora»: atajos a cada sección
   - clásica: paleta de colores y botón de ver al gato en grande
   Todo sale de data/content.js, no hay que tocar nada aquí.
   ========================================================== */
(function () {
  "use strict";
  var CP = window.CP, S = window.SITE;
  if (!CP || !S) return;
  var $ = CP.$, esc = CP.esc, icon = CP.icon, root = document.documentElement;
  var hero = $("#inicio");
  if (!hero) return;

  function classic() { return root.getAttribute("data-skin") === "classic"; }
  var heroVisible = true;
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (en) { heroVisible = en[0].isIntersecting; }).observe(hero);
  }
  function active(forClassic) { return heroVisible && !document.hidden && classic() === forClassic; }
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) {} return null; }

  /* ---------- Datos ---------- */
  function monthLabel(key) { var s = String(key).replace(/-/g, " "); return s.charAt(0).toUpperCase() + s.slice(1); }
  var news = [];
  var ud = S.updates || {};
  Object.keys(ud).forEach(function (m) { (ud[m] || []).forEach(function (u) { news.push({ month: monthLabel(m), u: u }); }); });
  var projects = S.projects || [];

  /* ---------- Datos del día ---------- */
  var days = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"], mons = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  var now0 = (window.CALENDAR && window.CALENDAR.now) || new Date();
  var t0 = new Date(now0.getFullYear(), now0.getMonth(), now0.getDate());
  var cn = window.CALENDAR && window.CALENDAR.counter && window.CALENDAR.counter();
  var cap = cn ? cn.text : "";
  var mine = parseInt(store("cp-pet-count"), 10) || 0;
  var rows = [
    ["favorite", "Caricias", '<span class="t-pets">…</span>', "#inicio"],
    ["apps", "Proyectos", String(projects.length), "#proyectos"],
    ["campaign", "Novedades", String(news.length), "#novedades"]
  ];
  if ((S.books || []).length) rows.push(["auto_stories", "Libros", String(S.books.length), "#libros"]);
  var statsHtml = '<ul class="st-list">' + rows.map(function (r) {
    return '<li><a href="' + r[3] + '">' + icon(r[0]) + "<span>" + r[1] + "</span><b>" + r[2] + "</b></a></li>";
  }).join("") + "</ul>";
  var clockHtml = '<div class="clk-screen" role="timer" aria-label="Hora local"><span class="clk-t"><span class="t-h">--</span><i class="clk-c">:</i><span class="t-m">--</span></span>' +
    '<span class="clk-d t-d"></span></div>' + (cap ? '<p class="clk-cap">' + icon(cn.n === 0 || /Cumple|cumple/.test(cn.label + cn.today) ? "cake" : "celebration") + esc(cap) + "</p>" : "");

  /* Moderna: tarjeta «Hoy» · Clásica: paneles «Reloj» y «Stats» (mismos datos) */
  var card = $("#hero-card");
  if (card) card.innerHTML = '<div class="hc-top"><span class="hc-ico">' + icon("schedule") + '</span><span class="hc-meta"><b>Hoy</b><small>En Copy\'s Place</small></span></div>' + clockHtml + statsHtml;

  /* Paletas (se eligen desde el panel lateral; aquí viven los ajustes y se comparten con CP.pal) */
  var MPALS = [
    { id: "naranja", name: "Naranja", c: "#f0994a" }, { id: "violeta", name: "Violeta", c: "#9a82db" },
    { id: "menta", name: "Menta", c: "#3fbf8f" }, { id: "rosa", name: "Rosa", c: "#e8749a" }, { id: "cielo", name: "Cielo", c: "#4aa8e0" }
  ];
  var PALS = [
    { id: "naranja", name: "Naranja", c: "#ff8a2b" }, { id: "violeta", name: "Violeta", c: "#b98cff" },
    { id: "menta", name: "Menta", c: "#4fe0a6" }, { id: "rosa", name: "Rosa", c: "#ff6fb1" }, { id: "cielo", name: "Cielo", c: "#5fc8ff" }
  ];
  function paintDots() {
    var cm = root.getAttribute("data-mpal") || (store("cp-mpal") === "auto" || !store("cp-mpal") ? (root.hasAttribute("data-season-auto") ? "auto" : "naranja") : store("cp-mpal"));
    CP.$$(".mp-dot").forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.p === cm)); });
  }
  function setMpal(id) {
    if (id === "auto") root.removeAttribute("data-mpal"); else root.setAttribute("data-mpal", id);
    store("cp-mpal", id);
    if (CP.paintMeta) CP.paintMeta();
    paintDots();
    if (CP.ach) CP.ach.unlock("palette");
  }
  CP.pal = { M: MPALS, C: PALS, setM: setMpal, paintM: paintDots };

  var clock = $("#px-clock");
  if (clock) clock.innerHTML = '<div class="px-head">Reloj</div><div class="px-body">' + clockHtml + "</div>";
  var stt = $("#px-stats");
  if (stt) stt.innerHTML = '<div class="px-head">Stats</div><div class="px-body">' + statsHtml + "</div>";

  var tH = CP.$$(".t-h"), tM = CP.$$(".t-m"), tD = CP.$$(".t-d"), last = "";
  function tick() {
    var d = new Date(), h = String(d.getHours()).padStart(2, "0"), m = String(d.getMinutes()).padStart(2, "0");
    if (h + m === last) return;
    last = h + m;
    tH.forEach(function (e) { e.textContent = h; });
    tM.forEach(function (e) { e.textContent = m; });
    tD.forEach(function (e) { e.textContent = days[d.getDay()] + " " + d.getDate() + " " + mons[d.getMonth()]; });
  }
  tick();
  setInterval(function () { if (heroVisible && !document.hidden) tick(); }, 10000);

  function ownCount() { CP.$$(".t-pets").forEach(function (el) { if (el.textContent === "…") el.textContent = mine; }); }
  fetch("/api/pet").then(function (r) { return r.ok ? r.json() : null; }).then(function (d) {
    if (d && d.ok && typeof d.total === "number") {
      CP.$$(".t-pets").forEach(function (el) { el.textContent = d.total.toLocaleString("es"); el.parentNode.title = "Caricias de todos los visitantes"; });
    } else ownCount();
  }).catch(ownCount);

  /* ==========================================================
     Fila «Explora»: atajos a las secciones (no repite su contenido)
     ========================================================== */
  var strip = $("#hero-strip");
  if (strip) {
    var cnt = function (n, one, many, none) { return n ? n + " " + (n === 1 ? one : many) : none; };
    var info = {
      novedades: cnt(news.length, "novedad", "novedades", "Pronto"),
      avances: cnt((S.feed || []).length, "nota", "notas", "Pronto"),
      proyectos: cnt(projects.length, "proyecto", "proyectos", "Pronto"),
      libros: cnt((S.books || []).length, "libro", "libros", "Pronto"),
      galeria: cnt((S.gallery || []).length, "dibujo", "dibujos", "Pronto"),
      acerca: "Quién soy"
    };
    var tiles = (S.sections || []).filter(function (s) { return info[s.id]; });
    strip.innerHTML =
      '<div class="strip-head"><h2 class="title-lg">Explora</h2></div><div class="strip-row">' +
      tiles.map(function (s, i) {
        return '<a class="strip-card rip tone-' + (i % 4) + '" data-t="' + ["p", "t", "s"][i % 3] + '" data-v="' + (i % 2 ? "tonal" : "solid") + '" href="#' + esc(s.id) + '">' +
          '<span class="sc-ico">' + icon(s.icon || "pets") + "</span>" +
          '<span class="sc-body"><b>' + esc(s.nav || s.overline) + "</b><small>" + esc(info[s.id]) + "</small></span>" +
          '<span class="sc-go">' + icon("arrow_forward") + "</span></a>";
      }).join("") + "</div>";
  }

  /* ==========================================================
     CLÁSICA · paneles pixel art
     ========================================================== */

  /* --- Paleta (cambia el color principal de la versión clásica) --- */
  var pal = $("#px-pal");
  function setPal(id) {
    if (id === "naranja") root.removeAttribute("data-pal"); else root.setAttribute("data-pal", id);
    store("cp-pal", id);
    CP.$$(".swatch").forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.pal === id)); });
    if (CP.ach) CP.ach.unlock("palette");
  }
  CP.pal.setC = setPal;
  if (pal) {
    pal.innerHTML = '<span class="px-lab">Paleta</span><div class="swatches" role="group" aria-label="Paleta de colores de la versión clásica">' +
      PALS.map(function (p) {
        return '<button class="swatch" type="button" data-pal="' + p.id + '" style="--c:' + p.c + '" aria-pressed="false" aria-label="' + p.name + '" title="' + p.name + '"></button>';
      }).join("") + "</div>";
    pal.addEventListener("click", function (e) {
      var b = e.target.closest(".swatch");
      if (b) setPal(b.dataset.pal);
    });
    var saved = store("cp-pal");
    setPal(PALS.some(function (p) { return p.id === saved; }) ? saved : "naranja");
  }


  /* --- Gato en grande --- */
  var zb = $("#px-zoom"), stage = zb && zb.closest(".hero-stage");
  if (zb && stage) {
    var setZoom = function (on) {
      stage.classList.toggle("is-zoom", on);
      root.classList.toggle("px-zoomed", on);
      zb.setAttribute("aria-pressed", String(on));
      zb.setAttribute("aria-label", on ? "Cerrar la vista grande" : "Ver el gato en grande");
      zb.firstElementChild.firstElementChild.setAttribute("href", on ? "#i-fullscreen_exit" : "#i-fullscreen");
    };
    zb.addEventListener("click", function () { setZoom(!stage.classList.contains("is-zoom")); });
    stage.addEventListener("click", function (e) {
      if (stage.classList.contains("is-zoom") && e.target === stage) setZoom(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && stage.classList.contains("is-zoom")) { setZoom(false); zb.focus(); }
    });
  }
})();
