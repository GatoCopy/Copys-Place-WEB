/* ==========================================================
   Copy's Place — El gato del inicio
   - Versión moderna: gato estilizado (SVG, ya está en index.html)
   - Versión clásica: el MISMO gato en pixel art (se dibuja aquí con código)
   Reacciones: los ojos siguen al cursor, la cabeza se inclina, las orejas se mueven,
   se dilatan las pupilas si te acercas, ronronea al mantener pulsado, se ríe al tocarlo,
   bosteza si te quedas quieto y se duerme si te vas. Todo con clases CSS (css/hero.css).
   ========================================================== */
(function () {
  "use strict";
  var CP = window.CP;
  var art = CP.$("#hero-art");
  var svgVec = CP.$("#hero-cat");
  var svgPx = CP.$("#hero-cat-px");
  if (!art || !svgVec) return;
  var root = document.documentElement;

  /* ---------- Gato pixel art: el MISMO dibujo, convertido a cuadritos ----------
     Las formas son las mismas rutas que el SVG vectorial del index.html (con su contorno);
     aquí se "rasterizan" sobre una cuadrícula: 1 píxel = 6 unidades del dibujo grande. */
  function buildPixelCat(svg) {
    var W = 67, H = 64, S = 6, OY = 78, K = 0.62;

    /* Coordenadas: la celda (x, y) -> espacio del dibujo grande (V) o de la cabeza (Hs) */
    function toV(x, y) { return [x * S, y * S + OY]; }
    function V(fn) { return function (x, y) { var v = toV(x, y); return fn(v[0], v[1]); }; }
    function Hs(fn) { return function (x, y) { var v = toV(x, y); return fn(200 + (v[0] - 200) / K, 178 + (v[1] - 190) / K); }; }
    function mirror(fn) { return function (x, y) { return fn(400 - x, y); }; }

    function grid() { var g = []; for (var y = 0; y < H; y++) g.push(new Array(W)); return g; }

    /* Rutas SVG absolutas (M L C Q H V Z) -> polígono */
    function pathPoly(d) {
      var tk = d.match(/[MLCQHVZ]|-?\d*\.?\d+/g), i = 0, pts = [], cx = 0, cy = 0, cmd;
      function num() { return parseFloat(tk[i++]); }
      function isNum() { return i < tk.length && !/[A-Z]/.test(tk[i]); }
      while (i < tk.length) {
        cmd = tk[i++];
        do {
          if (cmd === "M" || cmd === "L") { cx = num(); cy = num(); pts.push([cx, cy]); }
          else if (cmd === "H") { cx = num(); pts.push([cx, cy]); }
          else if (cmd === "V") { cy = num(); pts.push([cx, cy]); }
          else if (cmd === "C") {
            var x1 = num(), y1 = num(), x2 = num(), y2 = num(), x3 = num(), y3 = num();
            for (var t = 1; t <= 12; t++) { var u = t / 12, v = 1 - u;
              pts.push([v * v * v * cx + 3 * v * v * u * x1 + 3 * v * u * u * x2 + u * u * u * x3,
                        v * v * v * cy + 3 * v * v * u * y1 + 3 * v * u * u * y2 + u * u * u * y3]); }
            cx = x3; cy = y3;
          } else if (cmd === "Q") {
            var qx = num(), qy = num(), ex = num(), ey = num();
            for (var q = 1; q <= 10; q++) { var uu = q / 10, vv = 1 - uu;
              pts.push([vv * vv * cx + 2 * vv * uu * qx + uu * uu * ex, vv * vv * cy + 2 * vv * uu * qy + uu * uu * ey]); }
            cx = ex; cy = ey;
          }
        } while (isNum() && cmd !== "Z" && cmd !== "M");
      }
      return pts;
    }
    function polyT(d) {
      var p = pathPoly(d);
      return function (x, y) {
        var inside = false;
        for (var i = 0, j = p.length - 1; i < p.length; j = i++) {
          if ((p[i][1] > y) !== (p[j][1] > y) && x < (p[j][0] - p[i][0]) * (y - p[i][1]) / (p[j][1] - p[i][1]) + p[i][0]) inside = !inside;
        }
        return inside;
      };
    }
    function ellT(cx, cy, rx, ry) { return function (x, y) { var dx = (x - cx) / rx, dy = (y - cy) / ry; return dx * dx + dy * dy <= 1; }; }
    function rrT(x0, y0, w, h, r) {
      return function (x, y) {
        if (x < x0 || x > x0 + w || y < y0 || y > y0 + h) return false;
        var cx = Math.min(Math.max(x, x0 + r), x0 + w - r), cy = Math.min(Math.max(y, y0 + r), y0 + h - r);
        return (x - cx) * (x - cx) + (y - cy) * (y - cy) <= r * r;
      };
    }
    function lineT(x1, y1, x2, y2, w) {
      return function (x, y) {
        var dx = x2 - x1, dy = y2 - y1, l2 = dx * dx + dy * dy || 1;
        var t = Math.max(0, Math.min(1, ((x - x1) * dx + (y - y1) * dy) / l2));
        return Math.hypot(x - (x1 + t * dx), y - (y1 + t * dy)) <= w / 2;
      };
    }
    function anyT(list) { return function (x, y) { for (var i = 0; i < list.length; i++) if (list[i](x, y)) return true; return false; }; }

    /* Pintores: relleno simple, o relleno con contorno de 1 píxel (como el trazo del vector) */
    function fill(g, t, c) {
      for (var y = 0; y < H; y++) for (var x = 0; x < W; x++) if (t(x + 0.5, y + 0.5)) g[y][x] = c;
    }
    function outlined(g, t, c) {
      var m = [], y, x;
      for (y = 0; y < H; y++) { m.push(new Array(W)); for (x = 0; x < W; x++) m[y][x] = !!t(x + 0.5, y + 0.5); }
      for (y = 0; y < H; y++) for (x = 0; x < W; x++) {
        if (m[y][x]) continue;
        if ((y > 0 && m[y - 1][x]) || (y < H - 1 && m[y + 1][x]) || (x > 0 && m[y][x - 1]) || (x < W - 1 && m[y][x + 1])) g[y][x] = "line";
      }
      for (y = 0; y < H; y++) for (x = 0; x < W; x++) if (m[y][x]) g[y][x] = c;
    }
    function emit(g) {
      var s = "";
      for (var y = 0; y < H; y++) {
        var x = 0;
        while (x < W) {
          var c = g[y][x];
          if (!c) { x++; continue; }
          var x0 = x;
          while (x < W && g[y][x] === c) x++;
          s += '<rect class="c-' + c + '" x="' + x0 + '" y="' + y + '" width="' + (x - x0) + '" height="1"/>';
        }
      }
      return s;
    }
    function cellOf(hx, hy) {            // celda que contiene un punto de la cabeza
      var gx = 200 + (hx - 200) * K, gy = 190 + (hy - 178) * K;
      return [Math.floor(gx / S), Math.floor((gy - OY) / S)];
    }

    /* ----- Sombra ----- */
    var gs = grid(); fill(gs, V(ellT(200, 437, 128, 12)), "sh");

    /* ----- Cola larga con rayas ----- */
    var gt = grid(), curve = [[262, 414], [332, 424], [374, 392], [368, 330], [364, 294], [342, 272], [322, 262]], samples = [], len = 0;
    function bz(p0, p1, p2, p3, t) {
      var u = 1 - t;
      return [u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0],
              u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1]];
    }
    for (var seg = 0; seg < 2; seg++) for (var k = 0; k <= 50; k++) {
      var pt = bz(curve[seg * 3], curve[seg * 3 + 1], curve[seg * 3 + 2], curve[seg * 3 + 3], k / 50);
      if (samples.length) len += Math.hypot(pt[0] - samples[samples.length - 1][0], pt[1] - samples[samples.length - 1][1]);
      samples.push([pt[0], pt[1], len]);
    }
    [0, 1].forEach(function (pi) {
      samples.forEach(function (sp) {
        var r = pi === 0 ? 12 + S : 12, col = pi === 0 ? "line" : (((sp[2] + 4) % 36) < 10 ? "stripe" : "fur");
        fill(gt, V(ellT(sp[0], sp[1], r, r)), col);
      });
    });

    /* ----- Cuerpo ----- */
    var gb = grid();
    outlined(gb, V(polyT("M112 352L92 358L108 368L90 380L110 388Z")), "fur");
    outlined(gb, V(polyT("M288 352L308 358L292 368L310 380L290 388Z")), "fur");
    outlined(gb, V(polyT("M150 250C146 296 128 330 116 384C110 410 124 428 146 430L254 430C276 428 290 410 284 384C272 330 254 296 250 250Z")), "fur");
    outlined(gb, V(ellT(140, 388, 36, 43)), "fur");
    outlined(gb, V(ellT(260, 388, 36, 43)), "fur");
    fill(gb, V(polyT("M166 256L234 256C236 292 232 304 226 312L220 306L214 332L206 322L200 346L194 322L186 332L180 306L174 312C168 304 164 292 166 256Z")), "muz");
    fill(gb, V(anyT([lineT(122, 366, 136, 372, 10), lineT(118, 392, 134, 396, 10), lineT(278, 366, 264, 372, 10), lineT(282, 392, 266, 396, 10)])), "stripe");
    outlined(gb, V(rrT(160, 326, 38, 104, 19)), "fur");
    outlined(gb, V(rrT(202, 326, 38, 104, 19)), "fur");
    fill(gb, V(anyT([lineT(167, 356, 182, 356, 10), lineT(167, 380, 183, 380, 10), lineT(233, 356, 218, 356, 10), lineT(233, 380, 217, 380, 10)])), "stripe");
    [[179, 426, 25, 14], [221, 426, 25, 14], [112, 428, 28, 13], [288, 428, 28, 13]].forEach(function (e) { outlined(gb, V(ellT(e[0], e[1], e[2], e[3])), "muz"); });
    fill(gb, V(anyT([lineT(172, 421, 172, 431, 9), lineT(186, 421, 186, 431, 9), lineT(214, 421, 214, 431, 9), lineT(228, 421, 228, 431, 9),
                     lineT(100, 423, 100, 433, 9), lineT(114, 423, 114, 433, 9), lineT(286, 423, 286, 433, 9), lineT(300, 423, 300, 433, 9)])), "line");
    fill(gb, V(polyT("M150 258Q200 288 250 258L247 284Q200 314 153 284Z")), "line");
    fill(gb, V(polyT("M152 262Q200 292 248 262L246 281Q200 311 154 281Z")), "collar");
    outlined(gb, V(ellT(200, 308, 15, 15)), "bell");
    fill(gb, V(lineT(200, 305, 200, 314, 8)), "line");
    fill(gb, V(ellT(195, 299, 5, 5)), "eye");

    /* ----- Cabeza (con orejas, ojos y boca) ----- */
    var gh = grid();
    var earOuter = "M78 150C72 100 76 58 86 18C122 32 156 58 182 96Z", earInner = "M98 124C96 92 98 64 104 44C126 56 142 74 156 98Z";
    outlined(gh, Hs(polyT(earOuter)), "fur"); outlined(gh, Hs(mirror(polyT(earOuter))), "fur");
    fill(gh, Hs(polyT(earInner)), "ear"); fill(gh, Hs(mirror(polyT(earInner))), "ear");
    outlined(gh, Hs(polyT("M200 64C264 64 318 98 336 150L354 160L336 172L352 186L332 198L346 216L320 220C300 264 254 292 200 292C146 292 100 264 80 220L54 216L68 198L48 186L64 172L46 160L64 150C82 98 136 64 200 64Z")), "fur");
    fill(gh, Hs(anyT([lineT(200, 72, 200, 112, 22), lineT(166, 80, 176, 112, 20), lineT(234, 80, 224, 112, 20),
                      lineT(76, 178, 104, 178, 20), lineT(80, 198, 106, 198, 20), lineT(324, 178, 296, 178, 20), lineT(320, 198, 294, 198, 20)])), "stripe");
    fill(gh, Hs(ellT(200, 238, 42, 27)), "muz");
    fill(gh, Hs(anyT([ellT(100, 234, 21, 11), ellT(300, 234, 21, 11)])), "blush");
    fill(gh, Hs(polyT("M188 227Q200 220 212 227Q208 239 200 242Q192 239 188 227Z")), "nose");

    function eye(cx, side) {
      var ge = grid(), gp = grid(), gx = grid(), gz = grid();
      outlined(ge, Hs(ellT(cx, 178, 34, 38)), "eye");
      fill(gp, Hs(ellT(cx, 182, 23, 28)), "pupil");
      var h1 = cellOf(cx - 10, 168); if (gp[h1[1]] && gp[h1[1]][h1[0]]) gp[h1[1]][h1[0]] = "eye";
      var arc = []; for (var i = 0; i <= 16; i++) { var u = i / 16, v = 1 - u; arc.push([v * v * (cx - 27) + 2 * v * u * cx + u * u * (cx + 27), v * v * 188 + 2 * v * u * 152 + u * u * 188]); }
      fill(gx, Hs(function (x, y) { for (var j = 0; j < arc.length; j++) if (Math.hypot(x - arc[j][0], y - arc[j][1]) <= 9) return true; return false; }), "line");
      var arc2 = []; for (var i2 = 0; i2 <= 16; i2++) { var u2 = i2 / 16, v2 = 1 - u2; arc2.push([v2 * v2 * (cx - 27) + 2 * v2 * u2 * cx + u2 * u2 * (cx + 27), v2 * v2 * 174 + 2 * v2 * u2 * 204 + u2 * u2 * 174]); }
      fill(gz, Hs(function (x, y) { for (var j = 0; j < arc2.length; j++) if (Math.hypot(x - arc2[j][0], y - arc2[j][1]) <= 8) return true; return false; }), "line");
      return '<g class="eye ' + side + '"><g class="open"><g class="sclera">' + emit(ge) + '</g><g class="pupil">' + emit(gp) + '</g></g><g class="happy">' + emit(gx) + '</g><g class="sleepy">' + emit(gz) + "</g></g>";
    }
    var gm = grid(), go = grid();
    fill(gm, Hs(anyT([lineT(200, 242, 200, 249, 13), lineT(200, 249, 190, 259, 13), lineT(190, 259, 178, 254, 13), lineT(200, 249, 210, 259, 13), lineT(210, 259, 222, 254, 13)])), "line");
    outlined(go, Hs(polyT("M184 245Q200 284 216 245Z")), "pupil");
    fill(go, Hs(ellT(200, 268, 9, 6)), "nose");

    svg.setAttribute("viewBox", "0 0 " + W + " " + H);
    svg.setAttribute("shape-rendering", "crispEdges");
    svg.innerHTML =
      '<g class="hc-shadow">' + emit(gs) + "</g>" +
      '<g class="hc-tail">' + emit(gt) + "</g>" +
      '<g class="hc-body">' + emit(gb) + "</g>" +
      '<g class="hc-head">' + emit(gh) + eye(140, "l") + eye(260, "r") +
      '<g class="mouth-smile">' + emit(gm) + '</g><g class="mouth-open">' + emit(go) + "</g></g>";
  }
  if (svgPx) buildPixelCat(svgPx);

  /* ---------- Ojos que siguen al cursor ---------- */
  var eyes = [];
  [svgVec, svgPx].forEach(function (svg) {
    if (!svg) return;
    var isPx = svg === svgPx;
    var max = parseFloat(svg.getAttribute("data-max")) || 6;
    CP.$$(".eye", svg).forEach(function (el) {
      eyes.push({ sclera: el.querySelector(".sclera"), pupil: el.querySelector(".pupil"), x: 0, y: 0, max: max, snap: isPx });
    });
  });

  var mouse = null, lastMove = 0, visible = true, running = false, glanceT = 0;
  var tilt = 0, near = false;

  function activeSvg() { return svgPx && svgPx.getBoundingClientRect().width > 0 ? svgPx : svgVec; }
  function glanceAround() {
    var r = activeSvg().getBoundingClientRect();
    mouse = { x: r.left + r.width / 2 + (Math.random() - 0.5) * 560, y: r.top + r.height / 2 + (Math.random() - 0.5) * 380 };
  }

  window.addEventListener("pointermove", function (e) {
    mouse = { x: e.clientX, y: e.clientY };
    lastMove = performance.now();
    wake();
    start();
  }, { passive: true });

  function frame() {
    running = false;
    if (!visible) return;
    var moving = false;

    eyes.forEach(function (eye) {
      var r = eye.sclera.getBoundingClientRect();
      if (!r.width) return;                   // ese gato está oculto (otra versión)
      var tx = 0, ty = 0;
      if (mouse && !art.classList.contains("is-sleep")) {
        var dx = mouse.x - (r.left + r.width / 2), dy = mouse.y - (r.top + r.height / 2);
        var d = Math.hypot(dx, dy) || 1, k = Math.min(d / 140, 1) * eye.max;
        tx = (dx / d) * k; ty = (dy / d) * k;
      }
      if (eye.snap) { eye.x = Math.round(tx); eye.y = Math.round(ty); }
      else {
        var ease = CP.reduceMotion ? 1 : 0.16;
        eye.x += (tx - eye.x) * ease; eye.y += (ty - eye.y) * ease;
        if (Math.abs(tx - eye.x) > 0.02 || Math.abs(ty - eye.y) > 0.02) moving = true;
      }
      eye.pupil.setAttribute("transform", "translate(" + eye.x.toFixed(2) + " " + eye.y.toFixed(2) + ")");
    });

    /* Cabeza inclinada hacia el cursor y pupilas dilatadas si está cerca */
    if (mouse) {
      var a = art.getBoundingClientRect();
      if (a.width) {
        var cx = a.left + a.width / 2, cy = a.top + a.height * 0.4;
        var nt = Math.max(-1, Math.min(1, (mouse.x - cx) / 420)) * 6;
        if (Math.abs(nt - tilt) > 0.15) { tilt = nt; art.style.setProperty("--tilt", tilt.toFixed(1) + "deg"); }
        var n = Math.hypot(mouse.x - cx, mouse.y - cy) < Math.max(150, a.width * 0.55);
        if (n !== near) { near = n; art.classList.toggle("is-near", n); }
      }
    }

    if (moving) start();
    else if (!CP.reduceMotion) {
      clearTimeout(glanceT);
      glanceT = setTimeout(function () {
        if (performance.now() - lastMove > 3000 && !art.classList.contains("is-sleep")) glanceAround();
        start();
      }, 2600 + Math.random() * 1800);
    }
  }
  function start() {
    if (running) return;
    running = true;
    requestAnimationFrame(frame);
  }
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (en) {
      visible = en[0].isIntersecting;
      if (visible) { start(); idle(); twitch(); }
    }).observe(art);
  }
  start();

  /* ---------- Estados con clases ---------- */
  var timers = {};
  function flag(cls, ms) {
    art.classList.add(cls);
    clearTimeout(timers[cls]);
    timers[cls] = setTimeout(function () { art.classList.remove(cls); }, ms);
  }
  function quiet() { return root.getAttribute("data-season") === "memorial"; }
  function syncQuiet() { art.classList.toggle("is-quiet", quiet()); }
  syncQuiet();

  /* Cambios de tema/temporada: se sorprende un momento */
  if ("MutationObserver" in window) {
    new MutationObserver(function (list) {
      syncQuiet();
      if (list.some(function (m) { return m.attributeName === "data-theme"; })) flag("is-wow", 900);
    }).observe(root, { attributes: true, attributeFilter: ["data-season", "data-theme"] });
  }

  /* Corazoncitos (vectoriales o pixel, según la versión) */
  var HEART = '<svg class="hv" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21C5 15 2 11.500 2 8a5 5 0 0 1 10-1 5 5 0 0 1 10 1c0 3.500-3 7-10 13z"/></svg>' +
    '<svg class="hp" viewBox="0 0 7 6" shape-rendering="crispEdges" aria-hidden="true"><rect x="1" width="2" height="1"/><rect x="4" width="2" height="1"/><rect y="1" width="7" height="2"/><rect x="1" y="3" width="5" height="1"/><rect x="2" y="4" width="3" height="1"/><rect x="3" y="5" width="1" height="1"/></svg>';
  function hearts(n) {
    if (quiet() || CP.reduceMotion) return;
    var live = art.querySelectorAll(".hc-heart").length;
    for (var i = 0; i < n && live + i < 8; i++) {
      var h = document.createElement("i");
      h.className = "hc-heart";
      h.style.setProperty("--x", 34 + Math.random() * 32 + "%");
      h.style.setProperty("--dx", Math.round(Math.random() * 90 - 45) + "px");
      h.style.animationDelay = i * 110 + "ms";
      h.innerHTML = HEART;
      h.addEventListener("animationend", function (e) { e.currentTarget.remove(); });
      art.appendChild(h);
    }
  }

  /* Orejas que se mueven solas de vez en cuando */
  var twT = 0;
  function twitch() {
    clearTimeout(twT);
    if (CP.reduceMotion) return;
    twT = setTimeout(function () {
      if (visible && !art.classList.contains("is-sleep")) {
        var ear = art.querySelector(".hc-ear." + (Math.random() < 0.5 ? "l" : "r"));
        if (ear) {
          ear.classList.remove("twitch"); void ear.getBoundingClientRect();
          ear.classList.add("twitch");
          setTimeout(function () { ear.classList.remove("twitch"); }, 600);
        }
      }
      twitch();
    }, 3500 + Math.random() * 5000);
  }
  twitch();

  /* Si te quedas quieto: bosteza, y después se duerme. Cualquier movimiento lo despierta. */
  var idleT = 0, sleepT = 0, lastAct = performance.now();
  function idle() {
    clearTimeout(idleT); clearTimeout(sleepT);
    if (CP.reduceMotion) return;
    idleT = setTimeout(function () {
      if (!visible || art.classList.contains("is-purr")) { idle(); return; }
      flag("is-yawn", 2600);
      sleepT = setTimeout(function () {
        if (visible) art.classList.add("is-sleep");
      }, 14000);
    }, quiet() ? 9000 : 16000);
  }
  function wake() {
    lastAct = performance.now();
    if (art.classList.contains("is-sleep")) { art.classList.remove("is-sleep"); flag("is-wow", 700); }
    if (art.classList.contains("is-yawn")) art.classList.remove("is-yawn");
    idle();
  }
  ["keydown", "scroll", "touchstart"].forEach(function (ev) { window.addEventListener(ev, wake, { passive: true }); });
  idle();

  /* ---------- Clic, toque y mantener pulsado ---------- */
  var DOG = art.dataset.species === "dog";
  var HELLO = DOG ? ["¡Guau! 🐾", "¡Guau, guau!", "¡Hola, humano! 🐶", "Jeje, ¡otra vez!", "¿Jugamos?", "¡Buen día! 💛", "¡Eso, ahí!"] : ["¡Miau! 🐾", "¡Prrr…! 💛", "¡Miiiau!", "Mrrp?", "¡Hola, humano! 🐱", "Más, por favor.", "¿Violín o chelo? Mrrp.", "Prrrrr…", "¡Eso, ahí!"];
  var SOFT = ["Prrr… aquí estoy.", "Hoy me quedo a tu lado.", "Mrrp. Tranquilo.", "Prrr… 💛"];
  var n = 0, hopT, held = false, holdT = 0, heartT = 0;

  function endHold() {
    clearTimeout(holdT); clearInterval(heartT);
    if (art.classList.contains("is-purr")) { art.classList.remove("is-purr"); setTimeout(function () { held = false; }, 60); }
  }
  art.addEventListener("pointerdown", function (e) {
    if (e.button > 0) return;
    held = false;
    clearTimeout(holdT);
    holdT = setTimeout(function () {
      held = true;
      art.classList.add("is-purr");
      hearts(2);
      heartT = setInterval(function () { hearts(1); }, 420);
      if (navigator.vibrate && !CP.reduceMotion) { try { navigator.vibrate(18); } catch (er) {} }
    }, 450);
  });
  ["pointerup", "pointercancel", "pointerleave"].forEach(function (ev) { art.addEventListener(ev, endHold); });

  function reaction(e) {
    wake();
    if (held) return;                        // el ronroneo ya fue la reacción
    art.classList.remove("hop"); void art.offsetWidth; art.classList.add("hop");
    clearTimeout(hopT);
    hopT = setTimeout(function () { art.classList.remove("hop"); }, 700);
    flag("is-happy", quiet() ? 1100 : 1500);
    hearts(quiet() ? 0 : 3);
    var list = quiet() ? SOFT : HELLO;
    CP.toast(list[n++ % list.length], 1800);
    if (CP.pet && CP.pet.tick) CP.pet.tick();       // suma al contador global de caricias
  }
  art.addEventListener("click", reaction);
  art.addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); art.click(); }
  });
})();
