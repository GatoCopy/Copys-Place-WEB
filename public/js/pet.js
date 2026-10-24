/* ==========================================================
   Copy's Place — La mascota
   Un gatito que pasea por el borde inferior de la página:
   se sienta, camina, se duerme y se deja acariciar.
   - Clic / toque / Enter: acariciarlo (corazones y maullidos)
   - Arrastrar: cogerlo en el aire; al soltarlo, cae y rebota
   - Si estás quieto, se duerme (tócalo para despertarlo)
   - Con una temporada activa, se pone el accesorio de la fecha
   - Versión moderna: vectorial. Versión clásica: pixel art.
   - Se apaga desde el interruptor del pie de página.
   Ambos dibujos salen de la MISMA lista de formas (abajo): el vector
   las pinta tal cual y el pixel art las convierte en cuadritos.
   ========================================================== */
(function () {
  "use strict";
  var CP = window.CP, root = document.documentElement;
  if (!CP) return;
  var NS = "http://www.w3.org/2000/svg";
  var VW = 72, VH = 56, CELL = 2;          // lienzo de dibujo y tamaño del "píxel"

  /* ---------- 1. Formas (x e y en el lienzo de 72×56) ----------
     Clases de color: f pelaje · d pelaje oscuro · s rayas · e oreja interior
     m hocico · w ojo · p pupila · n nariz. g = grupo. k = etiqueta (eye) */
  function E(cx, cy, rx, ry, c, g, k) { return { t: "e", cx: cx, cy: cy, rx: rx, ry: ry, c: c, g: g, k: k }; }
  function T(a, b, d, c, g) { return { t: "t", p: [a, b, d], c: c, g: g }; }
  function L(a, b, w, c, g) { return { t: "l", a: a, b: b, w: w, c: c, g: g }; }
  function LEG(x, y, len, r, c, ph) { return { t: "leg", hip: [x, y], len: len, r: r, c: c, ph: ph }; }
  function bez(p, n) {
    var out = [];
    for (var i = 0; i <= n; i++) {
      var t = i / n, u = 1 - t;
      out.push([
        u * u * u * p[0][0] + 3 * u * u * t * p[1][0] + 3 * u * t * t * p[2][0] + t * t * t * p[3][0],
        u * u * u * p[0][1] + 3 * u * u * t * p[1][1] + 3 * u * t * t * p[2][1] + t * t * t * p[3][1]
      ]);
    }
    return out;
  }
  function tail(pts, w, c) {
    var out = [];
    for (var i = 0; i < pts.length - 1; i++) out.push(L(pts[i], pts[i + 1], w, c, "tail"));
    return out;
  }
  function flat(a) { return Array.prototype.concat.apply([], a); }

  var POSES_CAT = {
    sit: {
      head: [43, 19, 11, 10.5], tailPivot: [17, 50],
      shapes: flat([
        tail(bez([[17, 50], [3, 50], [2, 34], [11, 30]], 10), 5.5, "f"),
        [E(27, 40, 15, 13, "f"), E(38, 34, 10, 17, "f"), E(22, 52, 7.5, 2.8, "d"),
         L([41, 36], [41, 50], 6, "f"), E(41, 52, 4.8, 2.6, "m"),
         L([15, 34], [20, 37], 2.2, "s"), L([14, 40], [19, 42], 2.2, "s"),
         E(43, 19, 11, 10.5, "f", "head"),
         T([33, 13], [34, 0], [42, 8], "f", "head"), T([45, 8], [52, 0], [53, 14], "f", "head"),
         T([35, 11], [35.5, 4], [40, 8], "e", "head"), T([47, 8], [50.5, 4], [51, 12], "e", "head"),
         L([39, 9.5], [40, 12], 2.2, "s", "head"), L([43, 8.5], [43, 11.5], 2.2, "s", "head"), L([47, 9.5], [46, 12], 2.2, "s", "head"),
         E(48.5, 23.5, 5.2, 3.6, "m", "head"),
         E(39.5, 18, 3, 3.4, "w", "head", "eye"), E(40.6, 18.6, 1.6, 2.1, "p", "head", "eye"),
         E(47.5, 17.5, 3, 3.4, "w", "head", "eye"), E(48.6, 18.1, 1.6, 2.1, "p", "head", "eye"),
         E(52.8, 21.8, 1.8, 1.3, "n", "head")]
      ])
    },
    walk: {
      head: [52, 25, 9, 8.6], tailPivot: [13, 31],
      shapes: flat([
        [LEG(44, 39, 12.5, 2.6, "d", 1), LEG(18, 39, 12.5, 2.6, "d", 0)],
        tail(bez([[13, 31], [3, 30], [2, 17], [9, 11]], 10), 4.5, "f"),
        [E(30, 33, 19, 9.5, "f"),
         L([22, 25], [24, 29], 2.2, "s"), L([30, 24], [31, 28], 2.2, "s"), L([38, 25], [38, 29], 2.2, "s"),
         LEG(40, 39, 12.5, 2.6, "f", 0), LEG(22, 39, 12.5, 2.6, "f", 1),
         E(52, 25, 9, 8.6, "f", "head"),
         T([45, 19], [46, 8], [53, 17], "f", "head"), T([55, 17], [61, 8], [61.5, 21], "f", "head"),
         T([47, 17], [47.5, 11], [51, 16], "e", "head"), T([57, 16], [59.5, 11], [60, 19], "e", "head"),
         E(58.2, 28.5, 4.4, 3, "m", "head"),
         E(50, 24, 2.6, 3, "w", "head", "eye"), E(51, 24.6, 1.4, 1.9, "p", "head", "eye"),
         E(56.5, 23.5, 2.6, 3, "w", "head", "eye"), E(57.5, 24.1, 1.4, 1.9, "p", "head", "eye"),
         E(61.6, 27.4, 1.6, 1.2, "n", "head")]
      ])
    },
    sleep: {
      head: [52, 45, 9, 8], tailPivot: null,
      shapes: flat([
        [E(34, 43, 25, 11, "f"),
         L([20, 34], [23, 38], 2.2, "s"), L([30, 32], [31, 36], 2.2, "s"), L([40, 33], [40, 37], 2.2, "s")],
        tail(bez([[9, 46], [7, 52], [30, 53], [48, 51]], 10), 5, "f"),
        [E(52, 45, 9, 8, "f", "head"),
         T([45, 40], [47, 30], [53, 38], "f", "head"), T([54, 38], [59, 30], [60, 41], "f", "head"),
         E(57.5, 48.5, 4, 2.4, "m", "head"),
         L([47, 45], [51, 46], 2, "p", "head"), L([54, 45], [58, 46], 2, "p", "head"),
         E(59.6, 47, 1.5, 1.1, "n", "head")]
      ])
    }
  };

  /* Perro (Día del Perro): mismas piezas, con orejas caídas, hocico largo y lengua */
  var POSES_DOG = {
    sit: {
      head: [43, 19, 11, 10.5], tailPivot: [17, 50],
      shapes: flat([
        tail(bez([[17, 50], [4, 50], [2, 38], [8, 30]], 10), 6.5, "f"),
        [E(27, 40, 15, 13, "f"), E(38, 34, 10, 17, "f"), E(22, 52, 7.5, 2.8, "d"),
         L([41, 36], [41, 50], 6, "f"), E(41, 52, 4.8, 2.6, "m"), E(40.5, 38, 4.5, 8, "m"),
         E(43, 19, 11, 10.5, "f", "head"),
         E(33.5, 20, 4, 9, "d", "head"), E(52.5, 20, 4, 9, "d", "head"),
         E(49.5, 23.8, 6.4, 4.6, "m", "head"),
         E(39.8, 17.5, 2.3, 2.7, "w", "head", "eye"), E(40.2, 17.8, 1.2, 1.5, "p", "head", "eye"),
         E(47, 17, 2.3, 2.7, "w", "head", "eye"), E(47.4, 17.3, 1.2, 1.5, "p", "head", "eye"),
         E(54, 21.4, 2.3, 1.7, "n", "head"), E(51.5, 28.2, 1.8, 2.4, "t", "head")]
      ])
    },
    walk: {
      head: [52, 25, 9, 8.6], tailPivot: [13, 31],
      shapes: flat([
        [LEG(44, 39, 12.5, 2.6, "d", 1), LEG(18, 39, 12.5, 2.6, "d", 0)],
        tail(bez([[13, 31], [4, 31], [3, 20], [8, 14]], 10), 5.4, "f"),
        [E(30, 33, 19, 9.5, "f"),
         LEG(40, 39, 12.5, 2.6, "f", 0), LEG(22, 39, 12.5, 2.6, "f", 1),
         E(52, 25, 9, 8.6, "f", "head"),
         E(46, 27, 3.2, 7, "d", "head"), E(58.5, 27, 3.2, 7, "d", "head"),
         E(58.6, 28.6, 5.2, 3.5, "m", "head"),
         E(50, 23.5, 2, 2.4, "w", "head", "eye"), E(50.4, 23.8, 1, 1.3, "p", "head", "eye"),
         E(56, 23, 2, 2.4, "w", "head", "eye"), E(56.4, 23.3, 1, 1.3, "p", "head", "eye"),
         E(62.6, 27.2, 1.9, 1.4, "n", "head"), E(60, 32.4, 1.5, 2, "t", "head")]
      ])
    },
    sleep: {
      head: [52, 45, 9, 8], tailPivot: null,
      shapes: flat([
        [E(34, 43, 25, 11, "f")],
        tail(bez([[9, 46], [6, 52], [30, 53], [48, 51]], 10), 5.4, "f"),
        [E(52, 45, 9, 8, "f", "head"),
         E(46, 48, 3, 6, "d", "head"), E(58.5, 48, 3, 6, "d", "head"),
         E(57.8, 48.6, 4.6, 2.8, "m", "head"),
         L([47, 44.5], [51, 45.5], 2, "p", "head"), L([54, 44.5], [58, 45.5], 2, "p", "head"),
         E(60.8, 47, 1.7, 1.2, "n", "head")]
      ])
    }
  };
  var _rt = document.documentElement;
  var POSES = _rt.getAttribute("data-season") === "dogday" && _rt.dataset.skin !== "classic" ? POSES_DOG : POSES_CAT;

  /* ---------- 2. Dibujo vectorial (versión moderna) ---------- */
  function svgEl(tag, attrs) {
    var e = document.createElementNS(NS, tag);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    return e;
  }
  function fmt(n) { return +n.toFixed(2); }

  /* Accesorios de temporada (pequeños, en el origen = lo alto de la cabeza) */
  var ACC = {
    halloween: '<ellipse rx="13" ry="3" fill="var(--hat-a)"/><path d="M-8 -.5C-6 -8-3 -12 1 -17C3 -12 6 -8 8 -.5Z" fill="var(--hat-a)"/><rect x="-7" y="-4" width="14" height="2.6" fill="var(--hat-b)"/>',
    xmas: '<path d="M-9 0C-9 -9 0 -15 8 -9L10 0Z" fill="var(--hat-a)"/><rect x="-10.5" y="-1.5" width="21" height="4" rx="2" fill="var(--hat-b)"/><circle cx="9" cy="-9" r="2.6" fill="var(--hat-b)"/>',
    birthday: '<path d="M-6 0H6L0 -16Z" fill="var(--hat-a)"/><path d="M-3.600 -7.500H3.600M-5 -3H5" stroke="var(--hat-b)" stroke-width="1.800"/><circle cy="-16" r="2.200" fill="var(--hat-c)"/>',
    valentine: '<path d="M-9 1Q0 -8 9 1" fill="none" stroke="var(--hat-b)" stroke-width="2" stroke-linecap="round"/><path class="acc-bob" transform="translate(0 -10) scale(.9)" d="M0 4C-9 -2-7 -8 0 -3C7 -8 9 -2 0 4Z" fill="var(--hat-a)"/>',
    pride: '<g fill="none" stroke-width="1.800"><path d="M-10 1Q0 -7 10 1" stroke="#e40303"/><path d="M-10 2.600Q0 -5.400 10 2.600" stroke="#ff8c00"/><path d="M-10 4.200Q0 -3.800 10 4.200" stroke="#ffed00"/><path d="M-10 5.800Q0 -2.200 10 5.800" stroke="#008026"/><path d="M-10 7.400Q0 -.6 10 7.400" stroke="#24a0ff"/></g>',
    newyear: '<ellipse rx="11" ry="2.200" fill="var(--hat-a)"/><rect x="-7" y="-14" width="14" height="14" rx="1" fill="var(--hat-a)"/><rect x="-7" y="-5" width="14" height="3" fill="var(--hat-b)"/><path class="acc-bob" transform="translate(11 -14) scale(3)" d="M0-1.500L.4-.4 1.500 0 .4.4 0 1.500-.4.4-1.500 0-.4-.4Z" fill="var(--hat-b)"/>',
    catday: '<path d="M-9 1L-10 -10L-5 -5L0 -13L5 -5L10 -10L9 1Z" fill="var(--hat-b)" stroke="var(--hat-b)" stroke-width="1" stroke-linejoin="round"/><circle cy="-6.500" r="1.400" fill="var(--hat-a)"/><circle cx="-5" cy="-2" r="1.100" fill="var(--hat-c)"/><circle cx="5" cy="-2" r="1.100" fill="var(--hat-c)"/>'
  };

  function buildVector() {
    var svg = svgEl("svg", { "class": "vec", viewBox: "0 0 " + VW + " " + VH, "aria-hidden": "true" });
    Object.keys(POSES).forEach(function (name) {
      var pose = POSES[name];
      var g = svgEl("g", { "class": "v-" + name });
      var tailG = null, headG = null;
      pose.shapes.forEach(function (s) {
        var node, parent = g;
        if (s.g === "tail") {
          if (!tailG) { tailG = svgEl("g", { "class": "tail" }); if (pose.tailPivot) tailG.style.transformOrigin = pose.tailPivot[0] + "px " + pose.tailPivot[1] + "px"; g.appendChild(tailG); }
          parent = tailG;
        } else if (s.g === "head") {
          if (!headG) { headG = svgEl("g", { "class": "head" }); g.appendChild(headG); }
          parent = headG;
        }
        if (s.t === "e") node = svgEl("ellipse", { cx: s.cx, cy: s.cy, rx: s.rx, ry: s.ry });
        else if (s.t === "t") node = svgEl("polygon", { points: s.p.map(function (p) { return p.join(","); }).join(" ") });
        else if (s.t === "l") node = svgEl("line", { x1: fmt(s.a[0]), y1: fmt(s.a[1]), x2: fmt(s.b[0]), y2: fmt(s.b[1]), "stroke-width": s.w, "stroke-linecap": "round" });
        else {                                           // pata: gira desde la cadera
          var lg = svgEl("g", { transform: "translate(" + s.hip[0] + " " + s.hip[1] + ")" });
          node = svgEl("line", { x1: 0, y1: 0, x2: 0, y2: s.len, "stroke-width": s.r * 2, "stroke-linecap": "round" });
          node.setAttribute("class", s.c + " leg p" + s.ph);
          lg.appendChild(node);
          parent.appendChild(lg);
          return;
        }
        node.setAttribute("class", s.c + (s.k ? " " + s.k : ""));
        parent.appendChild(node);
      });
      // accesorios de temporada, uno por temporada (se muestra el que toca)
      if (headG) {
        var h = pose.head;
        Object.keys(ACC).forEach(function (season) {
          var a = svgEl("g", { "class": "acc acc-" + season, transform: "translate(" + h[0] + " " + fmt(h[1] - h[3] + 1.5) + ")" });
          a.innerHTML = ACC[season];
          headG.appendChild(a);
        });
      }
      svg.appendChild(g);
    });
    return svg;
  }

  /* ---------- 3. Dibujo pixel art (versión clásica) ---------- */
  function segDist(px, py, a, b) {
    var dx = b[0] - a[0], dy = b[1] - a[1], l2 = dx * dx + dy * dy;
    var t = l2 ? Math.max(0, Math.min(1, ((px - a[0]) * dx + (py - a[1]) * dy) / l2)) : 0;
    return Math.hypot(px - (a[0] + t * dx), py - (a[1] + t * dy));
  }
  function inTri(px, py, p) {
    function sg(a, b, c) { return (a[0] - c[0]) * (b[1] - c[1]) - (b[0] - c[0]) * (a[1] - c[1]); }
    var q = [px, py], d1 = sg(q, p[0], p[1]), d2 = sg(q, p[1], p[2]), d3 = sg(q, p[2], p[0]);
    return !((d1 < 0 || d2 < 0 || d3 < 0) && (d1 > 0 || d2 > 0 || d3 > 0));
  }
  function hit(s, x, y, frame) {
    if (s.t === "e") { var dx = (x - s.cx) / s.rx, dy = (y - s.cy) / s.ry; return dx * dx + dy * dy <= 1; }
    if (s.t === "t") return inTri(x, y, s.p);
    if (s.t === "l") return segDist(x, y, s.a, s.b) <= s.w / 2;
    var ang = (frame ? (s.ph ? 1 : -1) : (s.ph ? -1 : 1)) * 0.48;      // pata: dos fotogramas
    var end = [s.hip[0] + Math.sin(ang) * s.len, s.hip[1] + Math.cos(ang) * s.len];
    return segDist(x, y, s.hip, end) <= s.r;
  }
  function pixelGroup(cls, shapes, frame) {
    var g = svgEl("g", { "class": cls }), cols = Math.round(VW / CELL), rows = Math.round(VH / CELL);
    for (var cy = 0; cy < rows; cy++) {
      var run = null;
      for (var cx = 0; cx <= cols; cx++) {
        var c = null;
        if (cx < cols) {
          var x = cx * CELL + CELL / 2, y = cy * CELL + CELL / 2;
          for (var i = shapes.length - 1; i >= 0; i--) {
            var s = shapes[i];
            if (hit(s, x, y, frame)) { c = s.c; break; }
          }
        }
        if (run && run.c !== c) {
          g.appendChild(svgEl("rect", { "class": run.c, x: run.x * CELL, y: cy * CELL, width: (cx - run.x) * CELL, height: CELL }));
          run = null;
        }
        if (c && !run) run = { c: c, x: cx };
      }
    }
    return g;
  }
  function buildPixel() {
    var svg = svgEl("svg", { "class": "px", viewBox: "0 0 " + VW + " " + VH, "shape-rendering": "crispEdges", "aria-hidden": "true" });
    svg.appendChild(pixelGroup("v-sit", POSES.sit.shapes, 0));
    svg.appendChild(pixelGroup("v-walk wa", POSES.walk.shapes, 0));
    svg.appendChild(pixelGroup("v-walk wb", POSES.walk.shapes, 1));
    svg.appendChild(pixelGroup("v-sleep", POSES.sleep.shapes, 0));
    return svg;
  }

  /* ---------- 4. Elemento de la mascota ---------- */
  var el = null, flip = null, bubble = null, bubbleTimer = 0;
  var x = 0, y = 0, vy = 0, face = 1, state = "sit";
  var target = 0, last = 0, raf = 0, idleTimer = 0, lastTouch = 0, mouseX = -1, lookAt = 0;
  var drag = null, count = parseInt(CP.store.get("cp-pet-count"), 10) || 0, purrTimer = 0;
  var still = CP.reduceMotion;

  function W() { return innerWidth <= 640 ? 72 : 108; }
  function H() { return W() * VH / VW; }
  function rnd(a, b) { return a + Math.random() * (b - a); }

  function place() { el.style.transform = "translate3d(" + x.toFixed(1) + "px," + (-y).toFixed(1) + "px,0)"; }
  function setState(s) { state = s; el.setAttribute("data-s", s); }
  function setFace(f) { face = f; flip.style.transform = f < 0 ? "scaleX(-1)" : ""; }
  function clampX(v) { return Math.max(4, Math.min(innerWidth - W() - 4, v)); }

  function say(text, ms) {
    bubble.textContent = text;
    bubble.classList.add("show");
    bubble.style.setProperty("--bx", "0px");
    var r = bubble.getBoundingClientRect();             // que no se salga de la pantalla
    var shift = 0;
    if (r.left < 8) shift = 8 - r.left; else if (r.right > innerWidth - 8) shift = innerWidth - 8 - r.right;
    bubble.style.setProperty("--bx", shift + "px");
    clearTimeout(bubbleTimer);
    bubbleTimer = setTimeout(function () { bubble.classList.remove("show"); }, ms || 1900);
  }

  function hearts(n) {
    for (var i = 0; i < n; i++) {
      (function (i) {
        setTimeout(function () {
          if (!el) return;
          var h = document.createElement("span");
          h.className = "pet-heart";
          h.innerHTML = '<svg aria-hidden="true"><use href="#s-heart"/></svg>';
          h.style.setProperty("--hx", rnd(-26, 26).toFixed(0) + "px");
          h.style.setProperty("--hs", rnd(14, 22).toFixed(0) + "px");
          el.appendChild(h);
          setTimeout(function () { h.remove(); }, 1400);
        }, i * 110);
      })(i);
    }
  }

  /* Contador global de caricias (Cloudflare Pages Function + D1). Si no existe, no pasa nada. */
  var globalTotal = null, lastSync = 0;
  function pets(method) {
    return fetch("/api/pet", { method: method }).then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) { return d && d.ok ? d.total : null; }).catch(function () { return null; });
  }
  function setTotal(t) {
    if (t == null) return;
    globalTotal = t;
    if (el) el.title = "Tus caricias: " + count + " · Del mundo: " + t;
  }
  var QUIET = ["Prrr… aquí estoy.", "Hoy me quedo a tu lado.", "Mrrp. Tranquilo, aquí estoy.", "Prrr… 💛"];
  function quiet() { return root.getAttribute("data-season") === "memorial"; }   // 30 de agosto: día tranquilo
  var DOGM = POSES === POSES_DOG;
  var PURRS = DOGM ? ["¡Guau!", "¡Jeje!", "¿Jugamos?", "¡Buen chico!", "Más, por favor.", "¡Hola, humano!", "¡Qué día tan bueno!"] : ["¿Violín o chelo? Mrrp.", "♪ Mrr-mrr-mrrr ♪", "¡Prrr…! 💛", "Mrrp.", "¡Miau!", "Más, por favor.", "Prrrrr…", "Ahí, ahí.", "¡Hola, humano!", "Esto es vida."];
  function petIt() {
    lastTouch = performance.now();
    count++;
    CP.store.set("cp-pet-count", String(count)); if (CP.ach) CP.ach.check();
    el.title = "Tus caricias: " + count + (globalTotal != null ? " · Del mundo: " + globalTotal : "");
    if (Date.now() - lastSync > 4000) { lastSync = Date.now(); pets("POST").then(setTotal); }
    var msg;
    if (quiet()) { setState("sit"); msg = QUIET[Math.floor(Math.random() * QUIET.length)]; }
    else if (state === "sleep") { setState("sit"); msg = "¡Mrrp! Estaba soñando…"; }
    else if (count === 1) msg = "¡Primera caricia! 🐾";
    else if (count % 10 === 0 && globalTotal != null) msg = "Entre todos llevamos " + globalTotal.toLocaleString("es") + " caricias 🐾";
    else if (count % 25 === 0) msg = "¡" + count + " caricias! Eres mi favorito.";
    else msg = PURRS[Math.floor(Math.random() * PURRS.length)];
    say(msg);
    hearts(quiet() ? 2 : state === "walk" ? 2 : 4);
    el.classList.add("purr");
    clearTimeout(purrTimer);
    purrTimer = setTimeout(function () { el.classList.remove("purr"); }, 1500);
    var cur = root.getAttribute("data-season"), C = window.CALENDAR;
    if (!quiet() && CP.confetti && cur && root.dataset.skin !== "classic" &&
        (cur === "birthday" || (C && C.copy[cur] && C.copy[cur].clickConfetti))) {
      var r = el.getBoundingClientRect();
      CP.confetti(r.left + r.width / 2, r.top + r.height / 3, 36, 1.6);
    }
    if (state === "walk") { stopMotion(); setState("sit"); }
    scheduleIdle(quiet() ? 7000 : 2500);
  }

  /* ---------- Movimiento ---------- */
  function startLoop() { if (!raf) { last = performance.now(); raf = requestAnimationFrame(loop); } }
  function stopMotion() { cancelAnimationFrame(raf); raf = 0; }

  function loop(now) {
    raf = 0;
    var dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    if (state === "walk") {
      var speed = innerWidth <= 640 ? 46 : 62, dir = target > x ? 1 : -1;
      x += dir * speed * dt;
      if ((dir > 0 && x >= target) || (dir < 0 && x <= target)) { x = target; setState("sit"); place(); scheduleIdle(); return; }
    } else if (state === "fall") {
      vy -= 2100 * dt;
      y += vy * dt;
      if (y <= 0) {
        y = 0;
        if (Math.abs(vy) > 280) vy = -vy * 0.32;
        else { vy = 0; setState("sit"); place(); el.classList.add("land"); setTimeout(function () { el && el.classList.remove("land"); }, 450); scheduleIdle(1500); return; }
      }
    } else if (state !== "held") { return; }
    place();
    raf = requestAnimationFrame(loop);
  }

  function walkTo(tx) {
    tx = clampX(tx);
    if (Math.abs(tx - x) < 40) return false;
    target = tx;
    setFace(tx > x ? 1 : -1);
    setState("walk");
    startLoop();
    return true;
  }

  function scheduleIdle(ms) {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(decide, ms || rnd(2800, 6500));
  }
  function decide() {
    if (!el || state === "held" || state === "fall") return;
    if (document.hidden) { scheduleIdle(4000); return; }
    if (quiet()) {                                       // día tranquilo: se acurruca y duerme
      if (state !== "sleep") { stopMotion(); setState("sleep"); }
      scheduleIdle(9000);
      return;
    }
    var idleFor = performance.now() - lastTouch, r = Math.random();
    if (state === "sleep") {
      if (idleFor > 70000) { setState("sit"); say("*se estira* ¡Mrrrp!", 1600); }
      scheduleIdle(9000);
      return;
    }
    if (idleFor > 22000 && r < 0.45) {                  // lleva rato solo: se duerme
      setState("sleep");
      scheduleIdle(9000);
      return;
    }
    if (!still && r < 0.62) { if (walkTo(rnd(8, innerWidth - W() - 8))) return; }
    else if (r < 0.8) setFace(-face);
    scheduleIdle();
  }

  /* El gato mira hacia donde está el cursor (cuando está quieto) */
  window.addEventListener("pointermove", function (e) {
    mouseX = e.clientX;
    var now = performance.now();
    if (!el || state !== "sit" || now - lookAt < 350 || drag) return;
    var cx = x + W() / 2;
    if (Math.abs(mouseX - cx) < 260 && Math.abs(mouseX - cx) > 24) {
      lookAt = now;
      var f = mouseX > cx ? 1 : -1;
      if (f !== face) setFace(f);
    }
  }, { passive: true });

  /* ---------- Arrastrar y soltar ---------- */
  function onDown(e) {
    if (e.button > 0) return;
    drag = { sx: e.clientX, sy: e.clientY, moved: false, id: e.pointerId };
    try { el.setPointerCapture(e.pointerId); } catch (err) {}
  }
  function onMove(e) {
    if (!drag) return;
    if (!drag.moved) {
      if (Math.hypot(e.clientX - drag.sx, e.clientY - drag.sy) < 7) return;
      drag.moved = true;
      stopMotion();
      clearTimeout(idleTimer);
      setState("held");
      el.classList.add("dragging");
      say(DOGM ? "¡Guau!" : "¡Miau!", 1200);
    }
    x = clampX(e.clientX - W() / 2);
    y = Math.max(0, innerHeight - (parseFloat(getComputedStyle(el).bottom) || 4) - H() - e.clientY + H() * 0.2);
    place();
  }
  function onUp(e) {
    if (!drag) return;
    var moved = drag.moved;
    try { el.releasePointerCapture(drag.id); } catch (err) {}
    drag = null;
    el.classList.remove("dragging");
    lastTouch = performance.now();
    if (!moved) { petIt(); return; }
    if (still || y < 1) { y = 0; setState("sit"); place(); scheduleIdle(1500); return; }
    vy = 0; setState("fall"); startLoop();
  }
  function onKey(e) {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); petIt(); }
  }

  /* ---------- Crear / quitar ---------- */
  function create() {
    if (el) return;
    el = document.createElement("div");
    el.id = "pet"; el.className = "pet";
    el.setAttribute("role", "button"); el.tabIndex = 0;
    el.setAttribute("aria-label", POSES === POSES_DOG ? "Mascota: toca al perrito para acariciarlo" : "Mascota: toca al gatito para acariciarlo");
    el.title = count ? "Tus caricias: " + count : "Acarícialo";
    pets("GET").then(setTotal);
    flip = document.createElement("div"); flip.className = "flip";
    flip.appendChild(buildVector()); flip.appendChild(buildPixel());
    bubble = document.createElement("div"); bubble.className = "pet-bubble";
    bubble.setAttribute("aria-live", "polite");
    var z = document.createElement("div"); z.className = "pet-zzz";
    z.innerHTML = "<i>z</i><i>z</i><i>z</i>";
    el.append(bubble, z, flip);
    document.body.appendChild(el);
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
    el.addEventListener("keydown", onKey);
    el.addEventListener("dragstart", function (e) { e.preventDefault(); });

    lastTouch = performance.now();
    x = clampX(rnd(0.15, 0.85) * innerWidth);
    setFace(Math.random() < 0.5 ? 1 : -1);
    if (quiet()) { y = 0; setState("sleep"); place(); scheduleIdle(9000); return; }
    if (still) { y = 0; setState("sit"); place(); scheduleIdle(5000); return; }
    y = innerHeight;                                     // entra cayendo desde arriba
    vy = 0; setState("fall"); place();
    setTimeout(startLoop, 2200);
  }
  function destroy() {
    clearTimeout(idleTimer); clearTimeout(bubbleTimer); stopMotion();
    if (el) el.remove();
    el = flip = bubble = null; drag = null;
  }

  window.addEventListener("resize", function () {
    if (!el) return;
    x = clampX(x);
    if (state === "walk") target = clampX(target);
    place();
  });

  /* ---------- Interruptor del pie de página ---------- */
  var sw = CP.$("#pet-switch"), tog = CP.$("#pet-toggle");
  var enabled = CP.store.get("cp-pet-off") !== "1";
  if (sw && tog) {
    sw.hidden = false;
    tog.setAttribute("aria-checked", String(enabled));
    tog.addEventListener("click", function () {
      enabled = !enabled;
      tog.setAttribute("aria-checked", String(enabled));
      CP.store.set("cp-pet-off", enabled ? "0" : "1");
      if (enabled) create(); else destroy();
    });
  }
  CP.pet = {
    say: say, pet: petIt, walkTo: walkTo,
    /* El gato grande del inicio también cuenta: suma a tus caricias y al contador global */
    tick: function () {
      count++;
      CP.store.set("cp-pet-count", String(count)); if (CP.ach) CP.ach.check();
      if (Date.now() - lastSync > 4000) { lastSync = Date.now(); pets("POST").then(setTotal); }
    },
    total: function () { return globalTotal; }
  };       // por si quieres controlarlo desde otro script
  if (enabled) create();
})();
