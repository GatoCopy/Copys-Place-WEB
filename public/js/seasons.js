/* ==========================================================
   Copy's Place — Efectos de temporada (solo versión moderna)
   La temporada la decide data/calendar.js (atributo data-season en <html>).
   Aquí se construyen los efectos: murciélagos y arañas (Halloween), nieve
   y lucecitas (Navidad), globos y confeti (cumpleaños), corazones
   (San Valentín), arcoíris (Orgullo), fuegos artificiales (Año Nuevo),
   peces y huellitas (Día del Gato), el aviso y el switch para apagarlo. Los colores y animaciones están en
   css/seasons.css.
   ========================================================== */
(function () {
  "use strict";
  var CP = window.CP, C = window.CALENDAR, root = document.documentElement;
  if (!C || !root.getAttribute("data-season-auto")) return;   // hoy no hay temporada

  var season = root.getAttribute("data-season-auto");
  var copy = C.copy[season];
  var $ = CP.$;
  var built = null, fwTimer = 0;

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html) e.innerHTML = html;
    return e;
  }
  function sym(id, cls) {
    return '<svg class="' + (cls || "icon") + '" aria-hidden="true"><use href="#' + id + '"/></svg>';
  }
  function rnd(a, b) { return a + Math.random() * (b - a); }
  function isClassic() { return root.dataset.skin === "classic"; }

  /* ---------- Confeti (canvas ligero) ---------- */
  var cvs = null, ctx = null, parts = [], raf = 0;
  function sizeCanvas() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    cvs.width = innerWidth * dpr; cvs.height = innerHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function loop() {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    parts = parts.filter(function (p) { return p.life < p.max && p.y < innerHeight + 30; });
    parts.forEach(function (p) {
      p.vy += p.g === undefined ? 0.26 : p.g; p.vx *= p.drag || 0.99; p.vy *= p.drag || 0.992;
      p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.life++;
      ctx.globalAlpha = p.life > p.max - 40 ? Math.max((p.max - p.life) / 40, 0) : 1;
      ctx.fillStyle = p.c;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
      if (p.round) { ctx.beginPath(); ctx.arc(0, 0, p.w / 2, 0, 6.283); ctx.fill(); }
      else ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    });
    if (parts.length) raf = requestAnimationFrame(loop);
    else { raf = 0; cvs.remove(); cvs = null; window.removeEventListener("resize", sizeCanvas); }
  }
  function ensureCanvas() {
    if (cvs) return;
    cvs = el("canvas", "confetti-canvas");
    cvs.setAttribute("aria-hidden", "true");
    document.body.appendChild(cvs);
    ctx = cvs.getContext("2d");
    sizeCanvas();
    window.addEventListener("resize", sizeCanvas);
  }
  function palette() {
    if (copy && copy.colors) return copy.colors;
    var cs = getComputedStyle(root);
    return ["--primary", "--secondary", "--tertiary"].map(function (v) { return cs.getPropertyValue(v).trim(); }).concat(["#ffffff", "#ffd24a"]);
  }
  /* Fuego artificial: una explosión redonda de chispas */
  CP.firework = function (x, y) {
    if (CP.reduceMotion || isClassic()) return;
    ensureCanvas();
    var cols = palette(), c = cols[Math.floor(Math.random() * cols.length)], n = 46, i;
    for (i = 0; i < n; i++) {
      var a = (i / n) * 6.283 + rnd(-0.08, 0.08), sp = rnd(2.2, 6.2);
      parts.push({ x: x, y: y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, w: rnd(2.5, 4), h: 3, rot: 0, vr: 0,
        c: i % 7 === 0 ? "#ffffff" : c, life: 0, max: rnd(70, 105), round: true, g: 0.07, drag: 0.965 });
    }
    if (!raf) raf = requestAnimationFrame(loop);
  };
  CP.confetti = function (x, y, n, spread) {
    if (CP.reduceMotion || isClassic()) return;
    ensureCanvas();
    var cols = palette();
    for (var i = 0; i < n; i++) {
      var a = -Math.PI / 2 + (Math.random() - 0.5) * (spread || 1.3) * Math.PI;
      var sp = rnd(7, 15);
      parts.push({
        x: x, y: y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
        w: rnd(6, 11), h: rnd(4, 7), rot: rnd(0, 6.28), vr: rnd(-0.35, 0.35),
        c: cols[i % cols.length], life: 0, max: rnd(150, 250), round: Math.random() < 0.3
      });
    }
    if (!raf) raf = requestAnimationFrame(loop);
  };

  /* ---------- Construcción por temporada ---------- */
  function buildHero(layer) {
    var hero = $(".hero");
    if (!hero) return;
    // huellitas → iconos de la temporada
    var icons = {
      halloween: ["s-bat", "s-ghost", "s-pumpkin", "s-spider", "s-bat", "s-pumpkin"],
      xmas: ["i-ac_unit", "s-tree", "i-star", "s-gift", "i-ac_unit", "i-stars"],
      birthday: ["s-balloon", "i-cake", "i-celebration", "s-balloon", "i-star", "i-stars"],
      valentine: ["s-heart", "i-star", "s-heart", "s-gift", "s-heart", "i-stars"],
      pride: ["s-heart", "s-rainbow", "i-star", "s-heart", "s-rainbow", "i-stars"],
      newyear: ["s-sparkle", "i-celebration", "i-stars", "s-sparkle", "i-star", "s-gift"],
      memorial: ["i-nightlight", "i-star", "s-heart", "i-nightlight", "i-stars", "i-star"],
      catday: ["s-fish", "s-crown", "i-pets", "s-fish", "i-pets", "i-star"],
      dogday: ["i-pets", "i-star", "i-pets", "s-heart", "i-pets", "i-stars"],
      anniversary: ["s-balloon", "i-cake", "i-celebration", "s-balloon", "i-star", "i-stars"],
      launch: ["s-sparkle", "i-celebration", "i-stars", "s-sparkle", "i-star", "s-gift"]
    }[season];
    var paws = $(".paws", hero);
    if (paws && icons) {
      var sp = paws.cloneNode(true);
      sp.classList.add("season-paws");
      CP.$$("svg use", sp).forEach(function (u, i) { u.setAttribute("href", "#" + icons[i % icons.length]); });
      paws.after(sp);
      layer.push(sp);
    }
    // chip de temporada
    var chip = $(".hero-copy > .chip", hero);
    if (chip) {
      var sc = el("span", "chip tonal static rise season-chip", sym(copy.chipIcon) + copy.chip);
      sc.style.setProperty("--d", 0);
      chip.before(sc);
      layer.push(sc);
    }
    // telarañas y niebla
    if (season === "halloween") {
      var h = el("div", "season-hero",
        '<div class="web l">' + sym("s-web", "") + '</div><div class="web r">' + sym("s-web", "") + '</div>' +
        '<div class="fog"></div><div class="fog b"></div>');
      hero.prepend(h);
      layer.push(h);
    }
  }

  function build() {
    if (built) return;
    built = [];
    var fx = el("div"); fx.id = "season-fx"; fx.setAttribute("aria-hidden", "true");
    var top = el("div"); top.id = "season-top"; top.setAttribute("aria-hidden", "true");
    document.body.append(fx, top);
    built.push(fx, top);
    var motion = !CP.reduceMotion, i;

    if (season === "halloween") {
      if (motion) {
        [[14, 34, 22, -4], [32, 26, 28, -13], [22, 40, 19, -9]].forEach(function (b) {
          var d = el("div", "bat", sym("s-bat", ""));
          d.style.cssText = "--y:" + b[0] + "%;--s:" + b[1] + "px;--t:" + b[2] + "s;--d:" + b[3] + "s";
          fx.appendChild(d);
        });
      }
      [[7, 110, 4.6], [90, 150, 5.4]].forEach(function (s) {
        var d = el("div", "spider", sym("s-spider", ""));
        d.style.cssText = "--x:" + s[0] + "%;--len:" + s[1] + "px;--t:" + s[2] + "s";
        top.appendChild(d);
      });
    }

    if (season === "xmas") {
      if (motion) {
        var n = innerWidth < 600 ? 26 : 46;
        for (i = 0; i < n; i++) {
          var f = el("i", "flake"), t = rnd(9, 18), s = rnd(3, 7);
          f.style.cssText = "--x:" + rnd(0, 100).toFixed(1) + "%;--s:" + s.toFixed(1) + "px;--o:" + rnd(0.4, 0.9).toFixed(2) +
            ";--t:" + t.toFixed(1) + "s;--d:-" + (Math.random() * t).toFixed(1) + "s;--dx:" + rnd(-80, 80).toFixed(0) + "px";
          fx.appendChild(f);
        }
      }
      var lights = el("div", "lights");
      var cols = ["#ff4d4d", "#ffd24a", "#4fe08a", "#4da6ff"];
      var count = Math.ceil(innerWidth / 42);
      for (i = 0; i < count; i++) {
        var b = el("i");
        b.style.cssText = "--c:" + cols[i % cols.length] + ";--d:" + ((i % 5) * 0.45).toFixed(2) + "s";
        lights.appendChild(b);
      }
      $("#appbar").appendChild(lights);
      built.push(lights);
    }

    if ((season === "birthday" || season === "anniversary") && motion) {
      var cv = ["var(--primary)", "var(--secondary)", "var(--tertiary)"];
      [6, 22, 40, 58, 76, 90].forEach(function (x, k) {
        var bl = el("div", "balloon", sym("s-balloon", ""));
        var t = rnd(16, 26);
        bl.style.cssText = "--x:" + x + "%;--s:" + rnd(54, 74).toFixed(0) + "px;--c:" + cv[k % 3] + ";--t:" + t.toFixed(1) + "s;--d:-" + (Math.random() * t).toFixed(1) + "s";
        fx.appendChild(bl);
      });
    }

    if (season === "valentine" || season === "pride") {
      var hc = season === "pride" ? ["#e40303", "#ff8c00", "#ffed00", "#008026", "#24a0ff", "#a742c9"] : ["var(--primary)", "var(--secondary)", "var(--tertiary)"];
      if (motion) for (i = 0; i < 18; i++) {
        var hf = el("div", "heartfly", sym("s-heart", "")), ht = rnd(11, 22);
        hf.style.cssText = "--x:" + rnd(2, 96).toFixed(1) + "%;--s:" + rnd(14, 34).toFixed(0) + "px;--c:" + hc[i % hc.length] +
          ";--t:" + ht.toFixed(1) + "s;--d:-" + (Math.random() * ht).toFixed(1) + "s";
        fx.appendChild(hf);
      }
    }

    if (season === "newyear" || season === "launch") {
      var sc = ["var(--primary)", "var(--secondary)", "var(--tertiary)", "#ffffff"];
      for (i = 0; i < 16; i++) {
        var sp = el("i", "spark");
        sp.style.cssText = "--x:" + rnd(2, 96).toFixed(1) + "%;--y:" + rnd(8, 88).toFixed(1) + "%;--s:" + rnd(8, 20).toFixed(0) + "px;--c:" + sc[i % sc.length] + ";--d:" + rnd(0, 2.6).toFixed(2) + "s";
        fx.appendChild(sp);
      }
      if (motion) {
        var go = function () {
          if (!document.hidden) CP.firework(rnd(0.12, 0.88) * innerWidth, rnd(0.14, 0.5) * innerHeight);
          fwTimer = setTimeout(go, rnd(1800, 3600));
        };
        fwTimer = setTimeout(go, 1800);
      }
    }

    if (season === "memorial" && motion) {          // luciérnagas: luces pequeñas y lentas
      for (i = 0; i < 22; i++) {
        var ff = el("i", "firefly"), fT = rnd(9, 17);
        ff.style.cssText = "--x:" + rnd(3, 97).toFixed(1) + "%;--y:" + rnd(25, 95).toFixed(1) + "%;--s:" + rnd(3, 6).toFixed(1) +
          "px;--t:" + fT.toFixed(1) + "s;--d:-" + (Math.random() * fT).toFixed(1) + "s;--dx:" + rnd(-60, 60).toFixed(0) + "px";
        fx.appendChild(ff);
      }
    }

    if (season === "dogday" && motion) {
      var dc = ["var(--primary)", "var(--secondary)", "var(--tertiary)"];
      for (i = 0; i < 12; i++) {
        var dp = el("div", "heartfly", sym(i % 4 === 3 ? "s-heart" : "i-pets", "")), dt = rnd(13, 24);
        dp.style.cssText = "--x:" + rnd(2, 96).toFixed(1) + "%;--s:" + rnd(18, 36).toFixed(0) + "px;--c:" + dc[i % 3] +
          ";--t:" + dt.toFixed(1) + "s;--d:-" + (Math.random() * dt).toFixed(1) + "s";
        fx.appendChild(dp);
      }
    }

    if (season === "catday" && motion) {
      [[18, 30, 24, -2], [42, 24, 30, -12], [64, 34, 21, -7]].forEach(function (b) {
        var d = el("div", "fish", sym("s-fish", ""));
        d.style.cssText = "--y:" + b[0] + "%;--s:" + b[1] + "px;--t:" + b[2] + "s;--d:" + b[3] + "s";
        fx.appendChild(d);
      });
      var pc = ["var(--primary)", "var(--secondary)", "var(--tertiary)"];
      for (i = 0; i < 9; i++) {
        var pw = el("div", "heartfly", sym("i-pets", "")), pt = rnd(14, 24);
        pw.style.cssText = "--x:" + rnd(2, 96).toFixed(1) + "%;--s:" + rnd(18, 34).toFixed(0) + "px;--c:" + pc[i % 3] +
          ";--t:" + pt.toFixed(1) + "s;--d:-" + (Math.random() * pt).toFixed(1) + "s";
        fx.appendChild(pw);
      }
    }

    buildHero(built);
    showBanner();
  }

  function teardown() {
    clearTimeout(fwTimer);
    (built || []).forEach(function (n) { n.remove(); });
    built = null;
    var b = $(".season-banner"); if (b) b.remove();
  }

  /* ---------- Aviso de temporada ---------- */
  function showBanner() {
    var key = "cp-banner-" + season;
    try { if (sessionStorage.getItem(key) === "1" && !C.preview) return; } catch (e) {}
    var info = copy.banner(C.now, C.daysTo);
    var b = el("div", "season-banner");
    b.setAttribute("role", "status");
    b.innerHTML = '<span class="sb-ico">' + sym(copy.bannerIcon, "") + '</span>' +
      '<div class="sb-body"><strong></strong><p></p><div class="sb-actions"></div></div>' +
      '<button class="icon-btn rip" type="button" aria-label="Cerrar aviso">' + CP.icon("close") + "</button>";
    b.querySelector("strong").textContent = info.title;
    b.querySelector("p").textContent = info.text;
    var acts = b.querySelector(".sb-actions");
    if (info.confetti) {
      var cb = el("button", "btn btn-filled rip", CP.icon("celebration") + "¡Confeti!");
      cb.type = "button";
      cb.addEventListener("click", function () {
        CP.confetti(innerWidth * 0.2, innerHeight, 90, 1.1);
        CP.confetti(innerWidth * 0.8, innerHeight, 90, 1.1);
        if (CP.reduceMotion) CP.toast("¡Gracias por pasar! 🎂");
      });
      acts.appendChild(cb);
    }
    if (info.link) {
      var a = el("a", "btn btn-tonal rip", CP.icon("forum") + info.link.label);
      a.href = info.link.url;
      a.addEventListener("click", function () { close(); });
      acts.appendChild(a);
    }
    if (!acts.children.length) acts.remove();
    document.body.appendChild(b);

    var timer;
    function close() {
      clearTimeout(timer);
      b.classList.remove("show");
      try { sessionStorage.setItem(key, "1"); } catch (e) {}
      setTimeout(function () { b.remove(); }, 700);
    }
    b.querySelector(".icon-btn").addEventListener("click", close);
    function arm() { clearTimeout(timer); timer = setTimeout(close, info.stay || (info.confetti ? 18000 : 11000)); }
    b.addEventListener("pointerenter", function () { clearTimeout(timer); });
    b.addEventListener("pointerleave", arm);
    b.addEventListener("focusin", function () { clearTimeout(timer); });
    setTimeout(function () { b.classList.add("show"); arm(); }, 1400);

    if (info.confetti) {
      setTimeout(function () {
        CP.confetti(innerWidth * 0.12, innerHeight, 80, 1.0);
        CP.confetti(innerWidth * 0.88, innerHeight, 80, 1.0);
      }, 1500);
    }
  }

  /* ---------- Clic en el gato el día del cumpleaños: ¡confeti! ---------- */
  var art = $("#hero-art");
  if (art) art.addEventListener("click", function (e) {
    var cur = root.getAttribute("data-season");
    if (cur === "birthday" || (cur && C.copy[cur] && C.copy[cur].clickConfetti)) CP.confetti(e.clientX, e.clientY, 70, 2);
  });

  /* ---------- Switch para apagar la decoración ---------- */
  var sw = $("#season-switch"), tog = $("#season-toggle"), lbl = $("#season-label");
  function showing() { return !!root.getAttribute("data-season"); }
  function reflect() { tog.setAttribute("aria-checked", String(showing())); }
  if (sw && tog) {
    sw.hidden = false;
    var names = { halloween: "Halloween", xmas: "Navidad", birthday: "cumpleaños", valentine: "San Valentín", pride: "Orgullo", newyear: "Año Nuevo", catday: "Día del Gato", dogday: "Día del Perro", anniversary: "aniversario", launch: "lanzamiento", memorial: "Día de recuerdo" };
    lbl.textContent = "Decoración de " + names[season];
    reflect();
    tog.addEventListener("click", function () {
      if (showing()) {
        root.removeAttribute("data-season");
        teardown();
        CP.store.set("cp-season-off", "1");
      } else {
        root.setAttribute("data-season", season);
        CP.store.set("cp-season-off", "0");
        build();
      }
      reflect();
      if (season === "dogday") setTimeout(function () { location.reload(); }, 250);   // el perro reemplaza al gato al cargar
    });
  }

  if (showing()) build();

  /* Las lucecitas se recalculan al cambiar el ancho de la ventana */
  var rt;
  window.addEventListener("resize", function () {
    if (season !== "xmas" || !showing()) return;
    clearTimeout(rt);
    rt = setTimeout(function () { teardown(); build(); }, 300);
  });
})();
