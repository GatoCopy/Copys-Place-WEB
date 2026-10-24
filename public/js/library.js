/* ==========================================================
   Copy's Place — Biblioteca de secciones
   - books: libros con lector de PDF integrado
   - feed:  avances en línea de tiempo
   - cards: tarjetas genéricas (para lo que vaya saliendo)
   ========================================================== */
(function () {
  "use strict";
  var CP = window.CP, S = window.SITE;
  var $ = CP.$, esc = CP.esc, icon = CP.icon;

  /* ---------- Lector de PDF ---------- */
  var pdf = $("#pdf"), frame = $("#pdf-frame");
  var coarse = window.matchMedia("(pointer: coarse)").matches;

  CP.openPdf = function (book) {
    var url = book.file;
    // En móviles el PDF incrustado funciona mal: se abre en una pestaña nueva
    if (coarse || navigator.pdfViewerEnabled === false) {
      window.open(url, "_blank", "noopener");
      return;
    }
    $("#pdf-title").textContent = book.title;
    $("#pdf-open").href = url;
    $("#pdf-dl").href = url;
    frame.src = url + "#view=FitH";
    CP.openDialog(pdf);
  };
  pdf.addEventListener("click", function (e) {
    if (e.target.closest("[data-close]")) CP.closeDialog(pdf);
  });
  pdf.addEventListener("close", function () { frame.src = "about:blank"; });

  /* ---------- books ---------- */
  CP.registerType("books", function (sec, body) {
    var books = CP.dataOf(sec);
    if (!books.length) {
      body.appendChild(CP.empty("La biblioteca está en silencio", "Pronto habrá historias en PDF para leer o descargar."));
      return;
    }
    body.innerHTML = '<div class="books">' + books.map(function (b, i) {
      var cover = b.cover
        ? '<img src="' + esc(b.cover) + '" alt="Portada de ' + esc(b.title) + '" loading="lazy" decoding="async">'
        : '<span class="bc-mark" aria-hidden="true"><svg><use href="#cat-mark"/></svg></span><span class="bc-title">' + esc(b.title) + "</span>";
      return '<div class="book-wrap reveal" style="--d:' + i + '"><article class="card book">' +
        '<div class="book-cover' + (b.cover ? "" : " gen v" + (i % 3)) + '">' + cover + "</div>" +
        '<div class="book-info"><div class="chip-row">' +
        (b.status ? '<span class="chip tonal static"><span class="dot"></span>' + esc(b.status) + "</span>" : "") +
        (b.year ? '<span class="chip plain static">' + esc(b.year) + "</span>" : "") +
        (b.pages ? '<span class="chip plain static">' + esc(b.pages) + " págs.</span>" : "") + "</div>" +
        '<h3 class="title-lg">' + esc(b.title) + "</h3>" +
        (b.subtitle ? '<p class="muted label">' + esc(b.subtitle) + "</p>" : "") +
        "<p class=\"muted\">" + esc(b.description || "") + "</p>" +
        ((b.tags || []).length ? '<div class="chip-row">' + b.tags.map(function (t) { return '<span class="chip plain static">' + esc(t) + "</span>"; }).join("") + "</div>" : "") +
        '<div class="book-actions">' +
        (b.file
          ? '<button class="btn btn-filled rip" type="button" data-read="' + i + '">' + icon("auto_stories") + "Leer</button>" +
            '<a class="btn btn-tonal rip" href="' + esc(b.file) + '" download>' + icon("download") + "Descargar</a>"
          : '<span class="chip static">Próximamente</span>') +
        "</div></div></article></div>";
    }).join("") + "</div>";

    body.addEventListener("click", function (e) {
      var r = e.target.closest("[data-read]");
      if (r) CP.openPdf(books[+r.dataset.read]);
    });
  });

  /* ---------- feed: avances ---------- */
  var VISIBLE = 6;
  function fmtDate(d) {
    if (!d) return "";
    if (/^\d{4}-\d{2}-\d{2}$/.test(d)) {
      try {
        return new Intl.DateTimeFormat("es", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" })
          .format(new Date(d + "T00:00:00Z")).replace(/\./g, "");
      } catch (e) { return d; }
    }
    return d;
  }
  CP.registerType("feed", function (sec, body) {
    var items = CP.dataOf(sec);
    if (!items.length) {
      body.appendChild(CP.empty("Aún no hay avances", "Cuando tenga algo que enseñar (un boceto, un fragmento, una idea), aparecerá aquí."));
      return;
    }
    var projects = S.projects || [];
    body.innerHTML = '<ol class="timeline">' + items.map(function (it, i) {
      var proj = it.project && projects.filter(function (p) { return p.id === it.project; })[0];
      return '<li class="tl-item reveal" style="--d:' + Math.min(i, 4) + '"' + (i >= VISIBLE ? " hidden data-more" : "") + ">" +
        '<span class="tl-dot" aria-hidden="true"></span><article class="card tl-card">' +
        '<div class="tl-meta">' + (it.date ? "<time>" + esc(fmtDate(it.date)) + "</time>" : "") +
        (it.tag ? '<span class="chip plain static">' + esc(it.tag) + "</span>" : "") +
        (proj ? '<button class="chip tonal rip" type="button" data-project="' + esc(proj.id) + '">' + icon(proj.icon || "apps") + esc(proj.title) + "</button>" : "") + "</div>" +
        (it.title ? '<h3 class="title-md">' + esc(it.title) + "</h3>" : "") +
        '<p class="muted">' + esc(it.text || "") + "</p>" +
        (it.image ? '<img class="tl-img" src="' + esc(it.image) + '" alt="' + esc(it.imageAlt || it.title || "") + '" loading="lazy" decoding="async">' : "") +
        (it.link && it.link.url ? '<div><a class="btn btn-text rip" href="' + esc(it.link.url) + '"' +
          (it.link.url.charAt(0) === "#" ? "" : ' target="_blank" rel="noopener noreferrer"') + ">" + esc(it.link.label || "Ver más") + icon("arrow_forward") + "</a></div>" : "") +
        "</article></li>";
    }).join("") + "</ol>" +
      (items.length > VISIBLE ? '<div class="more-row"><button class="btn btn-tonal rip" type="button" id="feed-more">Mostrar anteriores' + icon("keyboard_arrow_down") + "</button></div>" : "");

    body.addEventListener("click", function (e) {
      var p = e.target.closest("[data-project]");
      if (p) { CP.openProject(p.dataset.project); return; }
      if (e.target.closest("#feed-more")) {
        CP.$$("[data-more]", body).forEach(function (li, i) {
          li.hidden = false;
          li.classList.add("in", "entering");
          li.style.animationDelay = Math.min(i, 6) * 60 + "ms";
        });
        e.target.closest(".more-row").remove();
      }
    });
  });

  /* ---------- cards: tarjetas genéricas ---------- */
  CP.registerType("cards", function (sec, body) {
    var items = CP.dataOf(sec);
    if (!items.length) { body.appendChild(CP.empty("Aquí todavía duerme un gatito", "Pronto habrá algo por aquí.")); return; }
    body.innerHTML = '<div class="grid-projects">' + items.map(function (it, i) {
      var tag = it.url ? "a" : "div";
      var attrs = it.url ? ' href="' + esc(it.url) + '"' + (it.url.charAt(0) === "#" ? "" : ' target="_blank" rel="noopener noreferrer"') : "";
      return '<div class="p-wrap reveal" style="--d:' + i + '"><' + tag + ' class="card project lift rip"' + attrs + ' style="text-decoration:none;color:inherit">' +
        '<div class="p-ico">' + icon(it.icon || "pets") + "</div>" +
        '<h3 class="title-lg">' + esc(it.title) + "</h3><p>" + esc(it.description || "") + "</p>" +
        (it.url ? '<div class="p-foot"><span></span><span class="p-more">' + esc(it.label || "Abrir") + icon("arrow_forward") + "</span></div>" : "") +
        "</" + tag + "></div>";
    }).join("") + "</div>";
  });
})();
