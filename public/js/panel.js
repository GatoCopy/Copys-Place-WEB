/* ==========================================================
   Copy's Place — Panel lateral (botón de las tres líneas)
   Tres pestañas: Más (juego, app, ajustes y redes) · Explorar (buscador + lo último) · Tú (caricias y logros)
   (juego, instalar la app, compartir, RSS y redes). También los atajos de teclado.
   Todo sale de data/content.js.
   ========================================================== */
(function () {
  "use strict";
  var CP = window.CP, S = window.SITE, root = document.documentElement;
  if (!CP || !S) return;
  var $ = CP.$, $$ = CP.$$, esc = CP.esc, icon = CP.icon;
  var drawer = $("#drawer"), menuBtn = $("#menu-btn");
  if (!drawer || !menuBtn) return;
  function get(k) { return CP.store.get(k); }
  function set(k, v) { CP.store.set(k, v); }
  function classic() { return root.dataset.skin === "classic"; }

  /* ---------- Datos ---------- */
  var sections = S.sections || [];
  var news = [];
  Object.keys(S.updates || {}).forEach(function (m) {
    (S.updates[m] || []).forEach(function (u) { news.push({ month: m.replace(/-/g, " "), u: u }); });
  });
  var projects = S.projects || [];

  /* ---------- Saltar a una sección (cierra el panel primero) ---------- */
  CP.jump = function (id) {
    var go = function () {
      var el = document.getElementById(id);
      if (!el) return;
      el.scrollIntoView({ behavior: CP.reduceMotion ? "auto" : "smooth", block: "start" });
    };
    if (document.body.classList.contains("drawer-open")) { closePanel(); setTimeout(go, 380); } else go();
  };
  function openPanel(tab) {
    if (!document.body.classList.contains("drawer-open")) menuBtn.click();
    if (tab) showTab(tab);
  }
  function closePanel() {
    if (document.body.classList.contains("drawer-open")) $("#drawer-close").click();
  }
  CP.panel = { open: openPanel, close: closePanel };

  /* ==========================================================
     Logros
     ========================================================== */
  var ACH = [
    { id: "pet1", ic: "favorite", t: "Primera caricia", d: "Acaricia a la mascota o al gato grande" },
    { id: "pet50", ic: "pets", t: "Cariñoso", d: "Llega a 50 caricias" },
    { id: "pet200", ic: "stars", t: "Dueño de gato", d: "Llega a 200 caricias" },
    { id: "sleep", ic: "nightlight", t: "Dulces sueños", d: "Quédate quieto hasta que el gato grande se duerma" },
    { id: "palette", ic: "palette", t: "Pintor", d: "Cambia la paleta de colores" },
    { id: "explorer", ic: "hub", t: "Explorador", d: "Visita todas las secciones" },
    { id: "classic", ic: "history_edu", t: "Viajero en el tiempo", d: "Descubre la versión clásica" },
    { id: "owl", ic: "dark_mode", t: "Búho nocturno", d: "Visita la página de madrugada" },
    { id: "search", ic: "search", t: "Curioso", d: "Usa el buscador" },
    { id: "run100", ic: "bolt", t: "Corredor", d: "100 puntos en Cat Runner" },
    { id: "run500", ic: "rocket_launch", t: "Maratón", d: "500 puntos en Cat Runner" },
    { id: "app", ic: "install_mobile", t: "De casa", d: "Instala la app" }
  ];
  var got = [];
  try { got = JSON.parse(get("cp-ach") || "[]"); } catch (e) { got = []; }
  function renderAch() {
    var box = $("#pn-ach"); if (!box) return;
    box.innerHTML = ACH.map(function (a) {
      var on = got.indexOf(a.id) >= 0;
      return '<li class="' + (on ? "got" : "") + '"><span class="ic">' + icon(on ? a.ic : "star") + "</span><span><b>" + esc(a.t) + "</b><small>" + esc(a.d) + "</small></span></li>";
    }).join("");
    var n = $("#pn-ach-n"); if (n) n.textContent = got.length + " / " + ACH.length;
  }
  CP.ach = {
    unlock: function (id) {
      if (got.indexOf(id) >= 0) return;
      var a = ACH.filter(function (x) { return x.id === id; })[0];
      if (!a) return;
      got.push(id); set("cp-ach", JSON.stringify(got));
      CP.toast("🏆 Logro desbloqueado: " + a.t, 3800);
      renderAch();
    },
    check: function () {
      var n = parseInt(get("cp-pet-count"), 10) || 0;
      if (n >= 1) CP.ach.unlock("pet1");
      if (n >= 50) CP.ach.unlock("pet50");
      if (n >= 200) CP.ach.unlock("pet200");
    },
    score: function (n) { if (n >= 100) CP.ach.unlock("run100"); if (n >= 500) CP.ach.unlock("run500"); }
  };
  CP.ach.check();
  var hr = new Date().getHours();
  if (hr >= 0 && hr < 5) setTimeout(function () { CP.ach.unlock("owl"); }, 2500);
  if (classic()) CP.ach.unlock("classic");
  new MutationObserver(function () { if (classic()) CP.ach.unlock("classic"); }).observe(root, { attributes: true, attributeFilter: ["data-skin"] });
  var heroArt = $("#hero-art");
  if (heroArt) new MutationObserver(function () { if (heroArt.classList.contains("is-sleep")) CP.ach.unlock("sleep"); }).observe(heroArt, { attributes: true, attributeFilter: ["class"] });

  /* Secciones visitadas */
  var visited = [];
  try { visited = JSON.parse(get("cp-visited") || "[]"); } catch (e) { visited = []; }
  var allIds = ["inicio"].concat(sections.map(function (s) { return s.id; }));
  if ("IntersectionObserver" in window) {
    var vio = new IntersectionObserver(function (en) {
      var ch = false;
      en.forEach(function (e) { if (e.isIntersecting && visited.indexOf(e.target.id) < 0) { visited.push(e.target.id); ch = true; } });
      if (ch) {
        set("cp-visited", JSON.stringify(visited));
        if (allIds.every(function (i) { return visited.indexOf(i) >= 0; })) CP.ach.unlock("explorer");
      }
    }, { rootMargin: "-40% 0px -40% 0px" });
    allIds.forEach(function (i) { var el = document.getElementById(i); if (el) vio.observe(el); });
  }

  /* ==========================================================
     Perfil
     ========================================================== */
  var st = S.status || {};
  $("#pn-profile").innerHTML =
    '<span class="pn-av"><svg aria-hidden="true"><use href="#cat-mark"/></svg></span>' +
    '<span class="pn-who"><b>' + esc((S.fullName || S.name) + (S.alias ? " · " + S.alias : "")) + "</b>" +
    "<small>" + esc(S.role || "") + "</small>" +
    (st.text ? '<span class="pn-status">' + icon(st.icon || "code") + esc(st.text) + "</span>" : "") + "</span>";

  /* ==========================================================
     Pestañas
     ========================================================== */
  var tabs = $$(".pn-tab"), panes = $$(".pn-pane");
  function showTab(id) {
    tabs.forEach(function (t) {
      var on = t.dataset.tab === id;
      t.setAttribute("aria-selected", String(on)); t.tabIndex = on ? 0 : -1;
    });
    panes.forEach(function (p) { p.hidden = p.id !== "pn-" + id; });
    if (id === "tu") renderStats();
    var b = $(".pn-body"); if (b) b.scrollTop = 0;
  }
  tabs.forEach(function (t, i) {
    t.addEventListener("click", function () { showTab(t.dataset.tab); });
    t.addEventListener("keydown", function (e) {
      var d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
      if (!d) return;
      var n = tabs[(i + d + tabs.length) % tabs.length]; n.focus(); showTab(n.dataset.tab); e.preventDefault();
    });
  });
  showTab("ajustes");

  /* ==========================================================
     Ajustes
     ========================================================== */
  var calmTog = $("#calm-toggle");
  function setCalm(on) {
    root.classList.toggle("calm", on);
    CP.reduceMotion = on || CP.reduceMotion;
    calmTog.setAttribute("aria-checked", String(on));
    set("cp-calm", on ? "1" : "0");
  }
  calmTog.setAttribute("aria-checked", String(root.classList.contains("calm")));
  calmTog.addEventListener("click", function () { setCalm(!root.classList.contains("calm")); });

  function setFs(v) {
    if (v === "0") root.removeAttribute("data-fs"); else root.dataset.fs = v;
    set("cp-fs", v);
    $$("#pn-fs button").forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.fs === v)); });
    if (CP.movePill) setTimeout(CP.movePill, 80);
  }
  $("#pn-fs").addEventListener("click", function (e) { var b = e.target.closest("button"); if (b) setFs(b.dataset.fs); });
  setFs(root.dataset.fs || "0");

  /* Paleta: puntos Material en la moderna, cuadritos en la clásica */
  var pn = $("#pn-pal");
  if (pn && CP.pal) {
    var hasSeason = root.hasAttribute("data-season-auto");
    pn.innerHTML =
      '<div class="modern-only"><div class="mp-dots" role="group" aria-label="Paleta de colores de la versión moderna">' +
      (hasSeason ? '<button class="mp-dot auto" type="button" data-p="auto" aria-pressed="false" aria-label="Automática (la de la temporada)" title="Automática (la de la temporada)"></button>' : "") +
      CP.pal.M.map(function (p) { return '<button class="mp-dot" type="button" data-p="' + p.id + '" style="--c:' + p.c + '" aria-pressed="false" aria-label="' + p.name + '" title="' + p.name + '"></button>'; }).join("") +
      '</div></div><div class="classic-only"><div class="swatches" role="group" aria-label="Paleta de colores de la versión clásica">' +
      CP.pal.C.map(function (p) { return '<button class="swatch" type="button" data-pal="' + p.id + '" style="--c:' + p.c + '" aria-pressed="false" aria-label="' + p.name + '" title="' + p.name + '"></button>'; }).join("") +
      "</div></div>";
    pn.addEventListener("click", function (e) {
      var m = e.target.closest(".mp-dot"), c = e.target.closest(".swatch");
      if (m) CP.pal.setM(m.dataset.p); else if (c) CP.pal.setC(c.dataset.pal);
    });
    CP.pal.paintM();
    var sp = get("cp-pal") || "naranja";
    $$(".swatch").forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.pal === sp)); });
  }

  /* ==========================================================
     Explorar: buscador
     ========================================================== */
  function norm(t) { return String(t || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, ""); }
  var index = [];
  sections.forEach(function (s) {
    index.push({ t: s.nav || s.title, d: (s.title || "") + " " + (s.lead || ""), ic: s.icon, tag: "Sección", go: function () { CP.jump(s.id); } });
  });
  news.forEach(function (n) { index.push({ t: n.u.title, d: n.u.description, ic: n.u.icon || "campaign", tag: "Novedad · " + n.month, go: function () { CP.jump("novedades"); } }); });
  projects.forEach(function (p) {
    index.push({ t: p.title, d: (p.description || "") + " " + (p.category || ""), ic: p.icon || "apps", tag: "Proyecto", go: function () { closePanel(); setTimeout(function () { if (CP.openProject) CP.openProject(p.id); }, 380); } });
  });
  (S.books || []).forEach(function (b) { index.push({ t: b.title, d: b.subtitle || b.description || "", ic: "auto_stories", tag: "Libro", go: function () { CP.jump("libros"); } }); });
  (S.skills || []).forEach(function (k) { index.push({ t: k, d: "habilidad", ic: "star", tag: "Habilidad", go: function () { CP.jump("acerca"); } }); });
  (S.social || []).forEach(function (r) { if (r.url && r.url !== "#") index.push({ t: r.name, d: (r.note || "") + " red social", ic: r.icon || "link", tag: "Enlace externo", go: function () { window.open(r.url, "_blank", "noopener"); } }); });
  [
    { t: "Cambiar tema claro / oscuro", d: "modo oscuro claro noche día", ic: "dark_mode", tag: "Acción", go: function () { closePanel(); $("#theme-btn").click(); } },
    { t: "Todas las novedades", d: "archivo historial novedades anteriores", ic: "campaign", tag: "Página", go: function () { location.href = "/novedades"; } },
    { t: "Jugar a Cat Runner", d: "juego dino chrome saltar", ic: "pets", tag: "Acción", go: function () { closePanel(); setTimeout(function () { CP.game && CP.game.open(); }, 380); } },
    { t: "Compartir la página", d: "enlace copiar compartir", ic: "share", tag: "Acción", go: function () { doShare(); } },
    { t: "Instalar la app", d: "pwa instalar aplicación", ic: "install_mobile", tag: "Acción", go: function () { showTab("ajustes"); } }
  ].forEach(function (a) { index.push(a); });
  index.forEach(function (it) { it.nt = norm(it.t); it.nb = norm(it.t + " " + it.d + " " + it.tag); });

  var q = $("#pn-q"), res = $("#pn-results"), box = $("#pn-tabs"), pbody = $(".pn-body"), sel = -1, shown = [];
  function search(text) {
    var toks = norm(text).split(/\s+/).filter(Boolean);
    if (!toks.length) return [];
    return index.map(function (it) {
      var sc = 0;
      for (var i = 0; i < toks.length; i++) {
        if (it.nb.indexOf(toks[i]) < 0) return null;
        sc += it.nt.indexOf(toks[i]) === 0 ? 4 : it.nt.indexOf(toks[i]) > 0 ? 3 : 1;
      }
      return { it: it, sc: sc };
    }).filter(Boolean).sort(function (a, b) { return b.sc - a.sc; }).slice(0, 8).map(function (r) { return r.it; });
  }
  function paintRes() {
    res.innerHTML = shown.length
      ? shown.map(function (it, i) {
        return '<li role="presentation"><button class="pn-res" type="button" role="option" id="pn-r' + i + '" data-i="' + i + '" aria-selected="' + (i === sel) + '"><span class="ic">' + icon(it.ic || "pets") +
          '</span><span class="tx"><b>' + esc(it.t) + "</b><small>" + esc(it.tag) + "</small></span></button></li>";
      }).join("")
      : (q.value.trim() ? '<li class="pn-empty">Nada por aquí… ¿probamos con otra palabra? 🐾</li>' : "");
    box.hidden = pbody.hidden = !!q.value.trim();
    q.setAttribute("aria-activedescendant", sel >= 0 ? "pn-r" + sel : "");
  }
  q.addEventListener("input", function () { shown = search(q.value); sel = shown.length ? 0 : -1; paintRes(); if (q.value.trim()) CP.ach.unlock("search"); });
  q.addEventListener("keydown", function (e) {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      if (!shown.length) return;
      sel = (sel + (e.key === "ArrowDown" ? 1 : -1) + shown.length) % shown.length; paintRes(); e.preventDefault();
    } else if (e.key === "Enter" && shown[sel]) { shown[sel].go(); e.preventDefault(); }
    else if (e.key === "Escape" && q.value) { q.value = ""; shown = []; paintRes(); e.stopPropagation(); }
  });
  res.addEventListener("click", function (e) { var b = e.target.closest(".pn-res"); if (b && shown[b.dataset.i]) shown[b.dataset.i].go(); });

  /* ==========================================================
     Para ti: historial local, lo último y lo recién actualizado
     ========================================================== */
  var hist = [];
  try { hist = JSON.parse(get("cp-hist") || "[]"); } catch (e) { hist = []; }
  CP.hist = {
    add: function (kind, id, title, ic) {
      hist = hist.filter(function (h) { return !(h.k === kind && h.id === id); });
      hist.unshift({ k: kind, id: id, t: title, ic: ic || "pets", at: Date.now() });
      hist = hist.slice(0, 12); set("cp-hist", JSON.stringify(hist));
      renderHist();
    }
  };
  var KIND = { project: "Proyecto", book: "Libro", section: "Sección" };
  function goHist(h) {
    if (h.k === "section") CP.jump(h.id);
    else if (h.k === "book") CP.jump("libros");
    else { closePanel(); setTimeout(function () { if (CP.openProject) CP.openProject(h.id); }, 380); }
  }
  function renderHist() {
    var box = $("#pn-hist-box"), ul = $("#pn-hist");
    var rows = hist.slice(0, 4);
    box.hidden = !rows.length;
    ul.innerHTML = rows.map(function (h, i) {
      return '<li><button class="pn-item" type="button" data-h="' + i + '"><span class="ic">' + icon(h.ic) + '</span><span class="tx"><b>' + esc(h.t) + "</b><small>" + KIND[h.k] + "</small></span></button></li>";
    }).join("");
  }
  $("#pn-hist").addEventListener("click", function (e) { var b = e.target.closest(".pn-item"); if (b) goHist(hist[+b.dataset.h]); });
  renderHist();
  var oOpen = CP.openProject;
  if (oOpen) CP.openProject = function (id) {
    oOpen(id);
    var p = projects.filter(function (x) { return x.id === id; })[0]; if (p) CP.hist.add("project", id, p.title, p.icon || "apps");
  };
  var oPdf = CP.openPdf;
  if (oPdf) CP.openPdf = function (b) { oPdf(b); if (b && b.title) CP.hist.add("book", b.id || b.title, b.title, "auto_stories"); };

  $("#pn-latest").innerHTML = news.slice(0, 4).map(function (n, i) {
    return '<li><button class="pn-item" type="button" data-i="' + i + '"><span class="ic">' + icon(n.u.icon || "campaign") + '</span><span class="tx"><b>' + esc(n.u.title) + "</b><small>" + esc(n.month) + " · " + esc(n.u.category || "Novedad") + "</small></span></button></li>";
  }).join("") || '<li class="pn-empty">Aún no hay novedades.</li>';
  $("#pn-latest").addEventListener("click", function (e) { if (e.target.closest(".pn-item")) CP.jump("novedades"); });

  /* Recién actualizado: proyectos por fecha de «lastUpdated» («Octubre 2026») */
  var MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
  function when(t) {
    var m = /([a-záéíóú]+)\s+(\d{4})/i.exec(String(t || "")); if (!m) return 0;
    var i = MESES.indexOf(m[1].toLowerCase()); return i < 0 ? 0 : +m[2] * 12 + i;
  }
  var fresh = projects.filter(function (p) { return when(p.lastUpdated); }).sort(function (a, b) { return when(b.lastUpdated) - when(a.lastUpdated); }).slice(0, 3);
  $("#pn-fresh").innerHTML = fresh.map(function (p, i) {
    return '<li><button class="pn-item" type="button" data-i="' + i + '"><span class="ic">' + icon(p.icon || "apps") + '</span><span class="tx"><b>' + esc(p.title) + "</b><small>" + esc(p.lastUpdated) + " · " + esc(p.status || "") + "</small></span></button></li>";
  }).join("") || '<li class="pn-empty">Nada reciente.</li>';
  $("#pn-fresh").addEventListener("click", function (e) {
    var b = e.target.closest(".pn-item"); if (!b) return;
    var p = fresh[+b.dataset.i]; closePanel(); setTimeout(function () { CP.openProject(p.id); }, 380);
  });

  /* ==========================================================
     Tú: estadísticas y logros
     ========================================================== */
  var globalPets = null;
  function renderStats() {
    var mine = parseInt(get("cp-pet-count"), 10) || 0;
    var cn = window.CALENDAR && window.CALENDAR.counter && window.CALENDAR.counter();
    var rows = [
      [String(mine), "Tus caricias"],
      [globalPets == null ? "…" : globalPets.toLocaleString("es"), "Caricias de todos"],
      [visited.filter(function (v) { return allIds.indexOf(v) >= 0; }).length + "/" + allIds.length, "Secciones visitadas"],
      [String(parseInt(get("cp-runner-hi"), 10) || 0), "Récord Cat Runner"],
      [got.length + "/" + ACH.length, "Logros"]
    ];
    if (cn) rows.splice(4, 0, [cn.n === 0 ? "¡Hoy!" : String(cn.n), cn.n === 0 ? cn.today : cn.label]);
    $("#pn-stats").innerHTML = rows.map(function (r) { return "<li><b>" + r[0] + "</b><span>" + r[1] + "</span></li>"; }).join("");
    renderAch();
  }
  fetch("/api/pet").then(function (r) { return r.ok ? r.json() : null; }).then(function (d) {
    if (d && d.ok && typeof d.total === "number") { globalPets = d.total; if (!$("#pn-tu").hidden) renderStats(); }
  }).catch(function () {});
  renderAch();

  /* ==========================================================
     Más: juego, app, compartir, redes
     ========================================================== */
  function hi() { var h = parseInt(get("cp-runner-hi"), 10) || 0; $("#pn-game-hi").textContent = h ? "Tu récord: " + h + " puntos" : "Salta, agáchate y no te caigas"; }
  hi();
  $("#pn-game").addEventListener("click", function () { closePanel(); setTimeout(function () { if (CP.game) CP.game.open(); }, 380); });
  CP.refreshHi = hi;

  function doShare() {
    var data = { title: S.name || "Copy's Place", text: "Mira Copy's Place, el rincón de " + (S.alias || "CopyCat") + " 🐾", url: location.origin + location.pathname };
    if (navigator.share) { navigator.share(data).catch(function () {}); return; }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(data.url).then(function () { CP.toast("Enlace copiado 🐾"); }, function () { CP.toast(data.url); });
    else CP.toast(data.url);
  }
  $("#pn-share").addEventListener("click", doShare);

  var deferred = null, inst = $("#pn-install"), instS = $("#pn-install-s");
  var standalone = (window.matchMedia && matchMedia("(display-mode: standalone)").matches) || navigator.standalone;
  var ios = /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.MSStream;
  function instState() {
    if (standalone) { instS.textContent = "Ya la tienes instalada ✓"; inst.disabled = true; CP.ach.unlock("app"); }
    else if (deferred) instS.textContent = "Ábrela como una app, también sin conexión";
    else if (ios) instS.textContent = "En Safari: Compartir → «Añadir a pantalla de inicio»";
    else instS.textContent = "Desde el menú de tu navegador: «Instalar app»";
  }
  window.addEventListener("beforeinstallprompt", function (e) { e.preventDefault(); deferred = e; instState(); });
  window.addEventListener("appinstalled", function () { standalone = true; deferred = null; instState(); CP.toast("¡App instalada! 🐾"); });
  inst.addEventListener("click", function () {
    if (deferred) { deferred.prompt(); deferred.userChoice.then(function () { deferred = null; instState(); }); }
    else CP.toast(ios ? "En Safari: Compartir → Añadir a pantalla de inicio" : "Busca «Instalar app» en el menú de tu navegador", 4200);
  });
  instState();

  $("#pn-social").innerHTML = (S.social || []).filter(function (s) { return s.url && s.url !== "#"; }).map(function (s) {
    return '<a class="icon-btn tonal rip" href="' + esc(s.url) + '" target="_blank" rel="noopener noreferrer" aria-label="' + esc(s.name) + '" title="' + esc(s.name) + '">' + icon(s.icon || "link") + "</a>";
  }).join("");

  /* Cerrar el panel al tocar un enlace interno */
  drawer.addEventListener("click", function (e) { if (e.target.closest("[data-pn-close]")) closePanel(); });

  /* ==========================================================
     Atajos de teclado
     ========================================================== */
  var entries = [{ id: "inicio" }].concat(sections.map(function (s) { return { id: s.id }; }));
  function typing(t) { return t && (/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) || t.isContentEditable); }
  function curIdx() { var a = $(".dock-item[aria-current=true]"); var id = a ? a.dataset.id : "inicio"; for (var i = 0; i < entries.length; i++) if (entries[i].id === id) return i; return 0; }
  document.addEventListener("keydown", function (e) {
    if (e.ctrlKey || e.metaKey || e.altKey || typing(e.target)) return;
    if (document.querySelector("dialog[open]")) return;
    var k = e.key;
    if (k === "/") { e.preventDefault(); openPanel(); setTimeout(function () { q.focus(); q.select(); }, 120); }
    else if (k === "m" || k === "M") { document.body.classList.contains("drawer-open") ? closePanel() : openPanel(); }
    else if (k === "g" || k === "G") { if (CP.game) CP.game.open(); }
    else if (k === "t" || k === "T") { $("#theme-btn").click(); }
    else if (/^[1-9]$/.test(k) && !document.body.classList.contains("drawer-open")) { var en = entries[+k - 1]; if (en) CP.jump(en.id); }
    else if ((k === "j" || k === "k") && !document.body.classList.contains("drawer-open")) {
      var n = entries[Math.max(0, Math.min(entries.length - 1, curIdx() + (k === "j" ? 1 : -1)))]; CP.jump(n.id);
    }
  });
})();
