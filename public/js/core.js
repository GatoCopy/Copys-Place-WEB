/* ==========================================================
   Copy's Place — Núcleo
   Utilidades, tema claro/oscuro, menú lateral, navegación con
   indicador deslizante, ripple, aparición al hacer scroll, FAB
   y snackbar.
   ========================================================== */
(function () {
  "use strict";

  var CP = (window.CP = {});
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  CP.$ = $;
  CP.$$ = $$;
  CP.reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Almacenamiento seguro (puede fallar en modo privado) */
  CP.store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };

  CP.esc = function (s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };
  CP.icon = function (name, cls) {
    return '<svg class="icon ' + (cls || "") + '" aria-hidden="true"><use href="#i-' + name + '"/></svg>';
  };

  /* ---------- Snackbar ---------- */
  var snack = $("#snackbar"), snackTimer;
  CP.toast = function (msg, ms) {
    snack.textContent = msg;
    snack.classList.add("show");
    clearTimeout(snackTimer);
    snackTimer = setTimeout(function () { snack.classList.remove("show"); }, ms || 3200);
  };

  /* ---------- Tema claro / oscuro (con transición circular) ---------- */
  var root = document.documentElement;
  var themeBtn = $("#theme-btn");
  var metaTheme = $('meta[name="theme-color"]');
  function paintMeta() {
    var classic = root.dataset.skin === "classic", dark = root.dataset.theme === "dark";
    var surf = "";
    if (!classic) { try { surf = getComputedStyle(root).getPropertyValue("--surface").trim(); } catch (e) {} }
    if (metaTheme) metaTheme.setAttribute("content", classic ? (dark ? "#1a1024" : "#fff3e6") : (surf || (dark ? "#19120d" : "#fff8f5")));
  }
  paintMeta();
  CP.paintMeta = paintMeta;

  /* Cambio con revelado circular desde un elemento (tema y versión) */
  CP.transition = function (apply, originEl) {
    if (!document.startViewTransition || CP.reduceMotion || !originEl) { apply(); return; }
    var r0 = originEl.getBoundingClientRect();
    var x = r0.left + r0.width / 2, y = r0.top + r0.height / 2;
    var radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    var vt = document.startViewTransition(apply);
    vt.ready.then(function () {
      root.animate(
        { clipPath: ["circle(0px at " + x + "px " + y + "px)", "circle(" + radius + "px at " + x + "px " + y + "px)"] },
        { duration: 650, easing: "cubic-bezier(.2,0,0,1)", pseudoElement: "::view-transition-new(root)" }
      );
    }).catch(function () {});
  };

  themeBtn.addEventListener("click", function () {
    var next = root.dataset.theme === "dark" ? "light" : "dark";
    CP.transition(function () {
      root.dataset.theme = next;
      CP.store.set("cp-theme", next);
      paintMeta();
    }, themeBtn);
  });

  /* ---------- Menú lateral ---------- */
  var drawer = $("#drawer"), menuBtn = $("#menu-btn");
  function setDrawer(open) {
    document.body.classList.toggle("drawer-open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
    if (open) { drawer.removeAttribute("inert"); setTimeout(function () { var a = $("#drawer-close"); if (a) a.focus(); }, 60); }
    else { drawer.setAttribute("inert", ""); }
  }
  menuBtn.addEventListener("click", function () { setDrawer(true); });
  $("#drawer-close").addEventListener("click", function () { setDrawer(false); menuBtn.focus(); });
  $("#scrim").addEventListener("click", function () { setDrawer(false); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && document.body.classList.contains("drawer-open")) { setDrawer(false); menuBtn.focus(); }
  });
  window.addEventListener("resize", function () {
    if (innerWidth >= 1040 && document.body.classList.contains("drawer-open")) setDrawer(false);
  });

  /* ---------- Navegación: sección activa + indicador deslizante ----------
     Los enlaces los crea boot.js a partir de SITE.sections; después llama a CP.initNav(). */
  CP.initNav = function () {
    var navLinks = $$("#nav a");
    var drawerLinks = $$("#drawer a[data-nav]");
    var pill = $("#nav-pill");
    var sections = navLinks.map(function (a) { return $(a.getAttribute("href")); });

    drawerLinks.forEach(function (a) { a.addEventListener("click", function () { setDrawer(false); }); });

    function movePill() {
      var active = navLinks.filter(function (a) { return a.getAttribute("aria-current") === "true"; })[0];
      if (!active || !pill) { if (pill) pill.style.opacity = 0; return; }
      pill.style.opacity = 1;
      pill.style.width = active.offsetWidth + "px";
      pill.style.transform = "translateX(" + active.offsetLeft + "px)";
    }
    function setCurrent(id) {
      [navLinks, drawerLinks].forEach(function (list) {
        list.forEach(function (a) {
          if (a.getAttribute("href") === "#" + id) a.setAttribute("aria-current", "true");
          else a.removeAttribute("aria-current");
        });
      });
      movePill();
    }
    if ("IntersectionObserver" in window) {
      var spy = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (en.isIntersecting) setCurrent(en.target.id); });
      }, { rootMargin: "-45% 0px -50% 0px" });
      sections.forEach(function (s) { if (s) spy.observe(s); });
    }
    setCurrent("inicio");
    window.addEventListener("resize", movePill);
    CP.movePill = movePill;
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(movePill);
  };

  /* ---------- Scroll: barra superior, progreso y FAB ---------- */
  var appbar = $("#appbar"), prog = $("#progress"), fab = $("#fab"), ticking = false;
  function onScroll() {
    ticking = false;
    var y = window.scrollY || 0;
    appbar.classList.toggle("scrolled", y > 8);
    fab.classList.toggle("show", y > 600);
    var max = document.documentElement.scrollHeight - innerHeight;
    prog.style.setProperty("--p", max > 0 ? Math.min(y / max, 1).toFixed(4) : 0);
  }
  window.addEventListener("scroll", function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();
  fab.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: CP.reduceMotion ? "auto" : "smooth" }); });

  /* ---------- Ripple (onda al tocar) ---------- */
  document.addEventListener("pointerdown", function (e) {
    var host = e.target.closest && e.target.closest(".rip");
    if (!host || host.disabled) return;
    var r = host.getBoundingClientRect();
    var size = Math.max(r.width, r.height) * 2.2;
    var span = document.createElement("span");
    span.className = "ripple";
    span.style.width = span.style.height = size + "px";
    span.style.left = (e.clientX - r.left - size / 2) + "px";
    span.style.top = (e.clientY - r.top - size / 2) + "px";
    host.appendChild(span);
    span.addEventListener("animationend", function () { span.remove(); });
  });

  /* ---------- Aparición al hacer scroll ---------- */
  var io = "IntersectionObserver" in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }) : null;
  CP.reveal = function (scope) {
    $$(".reveal:not(.in)", scope).forEach(function (el) {
      if (io) io.observe(el); else el.classList.add("in");
    });
  };
  CP.reveal();

  /* ---------- Diálogos con animación ---------- */
  CP.openDialog = function (dlg) {
    if (dlg.open) return;
    dlg.showModal();
    requestAnimationFrame(function () { requestAnimationFrame(function () { dlg.classList.add("open"); }); });
  };
  CP.closeDialog = function (dlg, after) {
    if (!dlg.open) return;
    dlg.classList.remove("open");
    var done = function () { dlg.close(); if (after) after(); };
    if (CP.reduceMotion) done(); else setTimeout(done, 320);
  };
  $$("dialog").forEach(function (dlg) {
    dlg.addEventListener("cancel", function (e) { e.preventDefault(); CP.closeDialog(dlg); });
    dlg.addEventListener("click", function (e) { if (e.target === dlg) CP.closeDialog(dlg); });
  });

  /* ---------- Varios ---------- */
  var y = $("#year");
  if (y) y.textContent = new Date().getFullYear();
})();
