/* ==========================================================
   Copy's Place — Secciones
   Registro de tipos de sección + los tipos básicos:
   updates (slider), projects, gallery, about, mailbox.
   Los tipos libros / avances / tarjetas están en library.js.

   Para inventar un tipo nuevo:
     CP.registerType("mi-tipo", function (sec, body) { body.innerHTML = "..."; });
   y úsalo en data/content.js:  { id: "x", type: "mi-tipo", ... }
   ========================================================== */
(function () {
  "use strict";
  var CP = window.CP, S = window.SITE;
  var $ = CP.$, esc = CP.esc, icon = CP.icon;

  CP.types = {};
  CP.registerType = function (name, builder) { CP.types[name] = builder; };

  /* Datos de una sección: sus propios "items", o la lista del mismo nombre que el tipo */
  CP.dataOf = function (sec) {
    if (sec.items) return sec.items;
    return S[sec.source || sec.type] || (sec.type === "updates" ? {} : []);
  };

  /* Estado vacío con el gatito dormido */
  CP.empty = function (title, text) {
    var f = $("#tpl-empty").content.cloneNode(true);
    f.querySelector('[data-e="title"]').textContent = title;
    f.querySelector('[data-e="text"]').textContent = text;
    return f;
  };

  /* Crea el cascarón de cada sección y llama a su constructor */
  CP.buildSections = function () {
    var host = $("#sections");
    var TONES = ["p", "t", "s"];   // primario · terciario · secundario (colores de la paleta Material)
    (S.sections || []).forEach(function (sec, idx) {
      var build = CP.types[sec.type];
      if (!build) { console.warn("Tipo de sección desconocido:", sec.type); return; }
      var el = document.createElement("section");
      el.className = "section" + (sec.band ? " band" : "");
      el.id = sec.id;
      el.setAttribute("data-tone", TONES[idx % 3]);
      el.setAttribute("aria-labelledby", "h-" + sec.id);
      el.innerHTML =
        '<div class="container" data-win="' + esc(sec.id) + '.exe"><div class="section-head reveal">' +
        '<span class="overline">' + icon(sec.icon || "pets") + esc(sec.overline || sec.nav || "") + "</span>" +
        '<h2 class="headline" id="h-' + esc(sec.id) + '">' + esc(sec.title || "") + "</h2>" +
        (sec.lead ? "<p>" + esc(sec.lead) + "</p>" : "") +
        '</div><div class="sec-body"></div></div>';
      host.appendChild(el);
      build(sec, el.querySelector(".sec-body"), el);
    });
  };

  /* ---------- updates: slider de novedades ---------- */
  function monthLabel(key) {
    var s = String(key).replace(/-/g, " ");
    return s.charAt(0).toUpperCase() + s.slice(1);
  }
  CP.registerType("updates", function (sec, body) {
    var data = CP.dataOf(sec), flat = [];
    Object.keys(data).forEach(function (m) {
      (data[m] || []).forEach(function (u) { flat.push({ month: monthLabel(m), u: u }); });
    });
    if (!flat.length) { body.appendChild(CP.empty("Todo tranquilo por aquí", "Todavía no hay novedades.")); return; }
    var total = flat.length, MAX = 5;           // en la portada solo las últimas; el resto, en /novedades
    flat = flat.slice(0, MAX);

    body.innerHTML =
      '<div class="carousel reveal" role="region" aria-roledescription="carrusel" aria-label="' + esc(sec.title || "Novedades") + '">' +
      '<div class="c-track" tabindex="0">' +
      flat.map(function (it, i) {
        var u = it.u;
        return '<article class="slide" role="group" aria-roledescription="diapositiva" aria-label="' + (i + 1) + " de " + flat.length + '">' +
          '<div class="slide-top"><div class="slide-ico">' + icon(u.icon || "campaign") + "</div>" +
          '<span class="chip static">' + esc(u.category || "Novedad") + "</span></div>" +
          '<span class="month">' + esc(it.month) + "</span>" +
          "<h3>" + esc(u.title) + "</h3><p>" + esc(u.description) + "</p></article>";
      }).join("") +
      (total > MAX ? '<article class="slide slide-all" role="group" aria-roledescription="diapositiva" aria-label="Ver todas"><div class="slide-top"><div class="slide-ico">' + icon("schedule") + '</div></div><h3>Más novedades</h3><p>Hay ' + (total - MAX) + ' más guardadas en el archivo.</p><a class="btn btn-tonal rip" href="/novedades">' + icon("arrow_forward") + 'Ver todas</a></article>' : "") +
      "</div>" +
      '<div class="c-controls">' +
      '<button class="icon-btn tonal rip" type="button" data-c="prev" aria-label="Novedad anterior">' + icon("chevron_left") + "</button>" +
      '<div class="c-dots" role="tablist" aria-label="Elegir novedad"></div>' +
      '<button class="icon-btn tonal rip c-toggle" type="button" data-c="toggle" aria-pressed="true" aria-label="Pausar reproducción automática">' +
      icon("pause", "i-pause") + icon("play_arrow", "i-play") + "</button>" +
      '<button class="icon-btn tonal rip" type="button" data-c="next" aria-label="Novedad siguiente">' + icon("chevron_right") + "</button>" +
      "</div></div>";
    CP.initCarousel(body.querySelector(".carousel"));
  });

  /* ---------- projects: tarjetas + filtros + detalle ---------- */
  var pd = $("#pd"), pdBody = $("#pd-body"), projects = [];

  CP.openProject = function (id) {
    var p = projects.filter(function (x) { return x.id === id; })[0];
    if (!p) return;
    var links = (p.links || []).filter(function (l) { return l.url && l.url !== "#"; });
    pdBody.innerHTML =
      '<div class="dialog-head"><div class="p-ico">' + icon(p.icon || "pets") + "</div>" +
      '<div><h3 id="pd-title">' + esc(p.title) + "</h3>" +
      (p.lastUpdated ? '<p class="muted label" style="margin-top:4px">Actualizado: ' + esc(p.lastUpdated) + "</p>" : "") + "</div>" +
      '<button class="icon-btn rip" type="button" data-close aria-label="Cerrar">' + icon("close") + "</button></div>" +
      '<div class="chip-row"><span class="chip tonal static"><span class="dot"></span>' + esc(p.status || "") + "</span>" +
      (p.category ? '<span class="chip plain static">' + esc(p.category) + "</span>" : "") + "</div>" +
      '<p class="muted">' + esc(p.longDescription || p.description) + "</p>" +
      (typeof p.progress === "number" ? '<div><div class="linear" style="--value:' + p.progress + '%"><i></i></div><p class="label muted" style="margin-top:8px">' + p.progress + "% completado</p></div>" : "") +
      ((p.tags || []).length ? '<div class="chip-row">' + p.tags.map(function (t) { return '<span class="chip plain static">' + esc(t) + "</span>"; }).join("") + "</div>" : "") +
      '<div class="dialog-actions">' +
      links.map(function (l) {
        var internal = l.url.charAt(0) === "#";
        return '<a class="btn btn-tonal rip" href="' + esc(l.url) + '"' + (internal ? " data-internal" : ' target="_blank" rel="noopener noreferrer"') + ">" +
          icon(l.icon || "link") + esc(l.label) + "</a>";
      }).join("") +
      '<button class="btn btn-text rip" type="button" data-close>Cerrar</button></div>';
    CP.openDialog(pd);
    setTimeout(function () { var bar = pdBody.querySelector(".linear"); if (bar) bar.classList.add("in"); }, 350);
  };
  pd.addEventListener("click", function (e) {
    if (e.target.closest("[data-close]")) { CP.closeDialog(pd); return; }
    var a = e.target.closest("a[data-internal]");
    if (a) {
      e.preventDefault();
      var target = a.getAttribute("href");
      CP.closeDialog(pd, function () { location.hash = target; });
    }
  });

  CP.registerType("projects", function (sec, body) {
    projects = CP.dataOf(sec);
    if (!projects.length) { body.appendChild(CP.empty("Aquí todavía duerme un gatito", "Pronto habrá proyectos para mostrar.")); return; }

    body.innerHTML = '<div class="filters chip-row reveal" role="group" aria-label="Filtrar proyectos por categoría"></div><div class="grid-projects"></div>';
    var filters = body.querySelector(".filters"), grid = body.querySelector(".grid-projects");

    grid.innerHTML = projects.map(function (p, i) {
      return '<div class="p-wrap reveal" style="--d:' + i + '" data-cat="' + esc(p.category || "") + '">' +
        '<div class="card project lift rip" role="button" tabindex="0" aria-haspopup="dialog" data-id="' + esc(p.id) + '" aria-label="' + esc(p.title) + ': ver detalles">' +
        '<div class="p-ico">' + icon(p.icon || "pets") + "</div>" +
        '<h3 class="title-lg">' + esc(p.title) + "</h3>" +
        "<p>" + esc(p.description) + "</p>" +
        (typeof p.progress === "number" ? '<div class="linear" style="--value:' + p.progress + '%" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + p.progress + '" aria-label="Progreso"><i></i></div>' : "") +
        '<div class="p-foot"><span class="chip tonal static"><span class="dot"></span>' + esc(p.status || "") + "</span>" +
        '<span class="p-more">Detalles' + icon("arrow_forward") + "</span></div></div></div>";
    }).join("");

    var cats = ["Todos"];
    projects.forEach(function (p) { if (p.category && cats.indexOf(p.category) < 0) cats.push(p.category); });
    if (cats.length > 2) {
      filters.innerHTML = cats.map(function (c, i) {
        return '<button class="chip rip" type="button" data-cat="' + esc(c) + '" aria-pressed="' + (i === 0) + '">' + icon("check", "tick") + esc(c) + "</button>";
      }).join("");
      filters.addEventListener("click", function (e) {
        var b = e.target.closest(".chip");
        if (!b) return;
        CP.$$(".chip", filters).forEach(function (c) { c.setAttribute("aria-pressed", String(c === b)); });
        filterBy(b.dataset.cat);
      });
    } else filters.hidden = true;

    function filterBy(cat) {
      CP.$$(".p-wrap", grid).forEach(function (w) {
        var show = cat === "Todos" || w.dataset.cat === cat;
        var card = w.firstElementChild;
        if (show && w.hidden) {
          w.hidden = false;
          card.classList.remove("leaving");
          card.classList.add("entering");
          setTimeout(function () { card.classList.remove("entering"); }, 600);
        } else if (show) {
          card.classList.remove("leaving");
        } else if (!w.hidden) {
          card.classList.add("leaving");
          setTimeout(function () { if (card.classList.contains("leaving")) w.hidden = true; }, 260);
        }
      });
    }
    grid.addEventListener("click", function (e) {
      var c = e.target.closest(".project");
      if (c) CP.openProject(c.dataset.id);
    });
    grid.addEventListener("keydown", function (e) {
      if ((e.key === "Enter" || e.key === " ") && e.target.classList.contains("project")) {
        e.preventDefault();
        CP.openProject(e.target.dataset.id);
      }
    });
  });

  /* ---------- gallery: galería + visor ---------- */
  var lb = $("#lb"), lbImg = $("#lb-img"), lbCap = $("#lb-cap"), li = 0, images = [];
  function showImage(i) {
    li = (i + images.length) % images.length;
    var im = images[li];
    lbImg.style.opacity = "0";
    lbImg.onload = function () { requestAnimationFrame(function () { lbImg.style.opacity = ""; }); };
    lbImg.src = im.src;
    lbImg.alt = im.alt || im.caption || "";
    lbCap.textContent = im.caption || "";
  }
  lb.addEventListener("click", function (e) {
    var b = e.target.closest("[data-lb]");
    if (!b) return;
    if (b.dataset.lb === "close") CP.closeDialog(lb);
    if (b.dataset.lb === "prev") showImage(li - 1);
    if (b.dataset.lb === "next") showImage(li + 1);
  });
  lb.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") showImage(li - 1);
    if (e.key === "ArrowRight") showImage(li + 1);
  });
  var sx = null;
  lb.addEventListener("pointerdown", function (e) { sx = e.clientX; });
  lb.addEventListener("pointerup", function (e) {
    if (sx === null) return;
    var dx = e.clientX - sx; sx = null;
    if (Math.abs(dx) > 60 && images.length > 1) showImage(li + (dx < 0 ? 1 : -1));
  });

  CP.registerType("gallery", function (sec, body) {
    images = CP.dataOf(sec);
    if (!images.length) {
      body.appendChild(CP.empty("Aquí todavía duerme un gatito", "La galería está vacía por ahora. Pronto habrá dibujos, pixel art y otras cositas."));
      return;
    }
    body.innerHTML = '<div class="gallery reveal">' + images.map(function (im, i) {
      return '<button class="g-item rip" type="button" data-i="' + i + '" aria-label="Abrir imagen ' + (i + 1) + (im.caption ? ": " + esc(im.caption) : "") + '">' +
        '<img src="' + esc(im.src) + '" alt="' + esc(im.alt || im.caption || "") + '" loading="lazy" decoding="async">' +
        (im.caption ? '<span class="g-cap">' + esc(im.caption) + "</span>" : "") + "</button>";
    }).join("") + "</div>";
    body.addEventListener("click", function (e) {
      var b = e.target.closest(".g-item");
      if (!b) return;
      showImage(+b.dataset.i);
      CP.$$(".lb-prev, .lb-next", lb).forEach(function (x) { x.hidden = images.length < 2; });
      CP.openDialog(lb);
    });
  });

  /* ---------- about: acerca de mí ---------- */
  CP.registerType("about", function (sec, body) {
    var social = S.social || [];
    body.innerHTML =
      '<div class="about-grid"><div class="card reveal">' +
      '<div class="about-id"><div class="avatar"><svg aria-hidden="true"><use href="#cat-mark"/></svg></div><div>' +
      '<h3 class="title-lg">' + esc(S.fullName) + '</h3><p class="muted">' + esc(S.role) + "</p></div></div>" +
      '<div class="about-text">' + (S.bio || []).map(function (t) { return "<p>" + esc(t) + "</p>"; }).join("") + "</div>" +
      '<div class="skills chip-row">' + (S.skills || []).map(function (t) { return '<span class="chip plain static">' + esc(t) + "</span>"; }).join("") + "</div>" +
      '</div><div class="card reveal" style="--d:1"><h3 class="title-md">Encuéntrame</h3><div class="links">' +
      social.map(function (s) {
        var live = s.url && s.url !== "#";
        var inner = '<span class="lead-ico">' + icon(s.icon || "link") + "</span><span>" + esc(s.name) +
          (s.note ? "<small>" + esc(s.note) + "</small>" : "") + "</span>";
        return live
          ? '<a class="tile rip" href="' + esc(s.url) + '" target="_blank" rel="noopener noreferrer">' + inner + icon("open_in_new", "tail") + "</a>"
          : '<div class="tile" style="opacity:.6">' + inner + '<span class="chip static" style="margin-left:auto">Pronto</span></div>';
      }).join("") +
      "</div></div></div>";
  });

  /* ---------- mailbox: buzón (la lógica está en guestbook.js) ---------- */
  CP.registerType("mailbox", function (sec, body) {
    body.innerHTML =
      '<div class="mail-grid"><div class="card reveal">' +
      '<form class="mail-form" id="gb-form" novalidate autocomplete="off">' +
      '<div class="field" id="f-name"><input id="gb-name" name="name" placeholder=" " maxlength="40" required autocomplete="nickname">' +
      '<label for="gb-name">Nombre o alias</label><p class="support"><span class="msg" id="gb-name-msg"></span></p></div>' +
      '<div class="field" id="f-text"><textarea id="gb-text" name="message" placeholder=" " required></textarea>' +
      '<label for="gb-text">Tu mensaje</label><p class="support"><span class="msg" id="gb-text-msg"></span><span id="gb-count">0</span></p></div>' +
      '<input class="hp" type="text" name="website" id="gb-hp" tabindex="-1" autocomplete="off" aria-hidden="true">' +
      '<div id="gb-ts" class="ts-box"></div>' +
      '<p class="note">' + icon("pets") + '<span id="gb-note"></span></p>' +
      '<button class="btn btn-filled btn-lg rip" type="submit" id="gb-send"><span class="btn-label">Enviar mensaje</span>' + icon("send") + "</button>" +
      '</form></div><div class="card reveal" style="--d:1"><h3 class="title-md" id="gb-title">Mensajes en este navegador</h3>' +
      '<div class="msgs" id="gb-list" aria-live="polite"></div></div></div>';
  });
})();
