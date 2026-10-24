/* ==========================================================
   Copy's Place — Cat Runner (el «dino» sin conexión, pero con el gato)
   Salta cajas (Espacio / ↑ / toque) y agáchate bajo los pájaros (↓ / botón).
   - Moderna: dibujo suave con los colores de la paleta activa (Material).
   - Clásica: el mismo juego en píxeles de verdad (sprites a pocos píxeles, sin suavizado).
   Se abre desde el panel lateral, con la tecla G, y se muestra también en la página 404.
   El juego va por su cuenta (window.CatRunner); si existe CP, guarda el récord y da logros.
   ========================================================== */
(function () {
  "use strict";
  var W = 300, H = 100, GROUND = 82;
  var root = document.documentElement;

  function cs(name, fb) { var v = getComputedStyle(root).getPropertyValue(name).trim(); return v || fb; }
  function isClassic() { return root.dataset.skin === "classic"; }
  function palette() {
    var c = isClassic();
    return {
      bg: c ? cs("--px-screen", "#fbeedd") : cs("--surface-container-low", "#fff1e9"),
      ink: c ? cs("--px-ink", "#2a1a38") : cs("--on-surface", "#221a15"),
      soft: cs("--outline-variant", "#d8c2b8"),
      fur: cs("--cat-fur", "#f0994a"), stripe: cs("--cat-stripe", "#c26a22"), line: cs("--cat-line", "#3a2112"),
      ear: cs("--cat-ear", "#f7bfa0"), muz: cs("--cat-muzzle", "#ffe8d0"), nose: cs("--cat-nose", "#c2566b"),
      collar: cs("--cat-collar", "#d9473f"), bell: cs("--cat-bell", "#f4c542"),
      a: cs("--primary", "#9a4500"), b: cs("--tertiary", "#646029"), c: cs("--secondary", "#765746"),
      box: cs("--box", "#c9955c"), boxl: cs("--box-light", "#dcae78"), boxd: cs("--box-dark", "#8a5b33")
    };
  }

  function mount(host, opt) {
    opt = opt || {};
    var canvas = document.createElement("canvas");
    canvas.className = "cr-canvas";
    canvas.setAttribute("aria-label", "Cat Runner: salta con Espacio o ↑, agáchate con ↓");
    canvas.setAttribute("role", "img");
    host.appendChild(canvas);
    var ctx = canvas.getContext("2d");
    var P = palette(), classic = isClassic(), K = 1, running = false, raf = 0, last = 0, acc = 0, dead = false, started = false, destroyed = false;
    var score = 0, hi = opt.hi || 0, speed = 2.3, frame = 0, night = false, nightT = 0;
    var cat = { x: 28, y: GROUND, vy: 0, duck: false, air: false, tilt: 0 };
    var obs = [], clouds = [], stars = [], pebbles = [], gapLeft = 80;

    function size() {
      classic = isClassic();
      var w = Math.max(240, Math.min(host.clientWidth || 600, 900));
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      K = classic ? 1 : (w / W) * dpr;
      canvas.width = Math.round(W * K); canvas.height = Math.round(H * K);
      canvas.style.width = w + "px"; canvas.style.height = Math.round(w * H / W) + "px";
      canvas.style.imageRendering = classic ? "pixelated" : "auto";
      ctx.imageSmoothingEnabled = !classic;
      P = palette();
    }
    function reset() {
      obs = []; score = 0; speed = 2.3; frame = 0; gapLeft = 90; dead = false; night = false; nightT = 0;
      cat.y = GROUND; cat.vy = 0; cat.duck = false; cat.air = false;
      clouds = []; for (var i = 0; i < 4; i++) clouds.push({ x: Math.random() * W, y: 10 + Math.random() * 28, s: 0.25 + Math.random() * 0.2 });
      stars = []; for (var j = 0; j < 22; j++) stars.push({ x: Math.random() * W, y: 6 + Math.random() * 50, t: Math.random() * 6 });
      pebbles = []; for (var k = 0; k < 18; k++) pebbles.push({ x: Math.random() * W, y: GROUND + 4 + Math.random() * 12, w: 1 + Math.floor(Math.random() * 3) });
    }

    /* ---------- Entrada ---------- */
    function jump() {
      if (dead) { if (performance.now() - deadAt > 450) { reset(); begin(); } return; }
      if (!started) begin();
      if (!cat.air) { cat.vy = -5.9; cat.air = true; cat.duck = false; }
    }
    function duck(on) { if (running && !dead) { cat.duck = on; if (on && cat.air) cat.vy = Math.max(cat.vy, 3.4); } }
    var deadAt = 0;
    function onKey(e) {
      if (!opt.isOpen || !opt.isOpen()) return;
      var k = e.key;
      if (k === " " || k === "ArrowUp" || k === "w" || k === "W") { e.preventDefault(); if (!e.repeat) jump(); }
      else if (k === "ArrowDown" || k === "s" || k === "S") { e.preventDefault(); duck(true); }
    }
    function onKeyUp(e) { if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") duck(false); }
    document.addEventListener("keydown", onKey);
    document.addEventListener("keyup", onKeyUp);
    canvas.addEventListener("pointerdown", function (e) { e.preventDefault(); jump(); });

    function begin() { started = true; running = true; last = performance.now(); acc = 0; if (!raf) raf = requestAnimationFrame(loop); }
    function end() {
      dead = true; deadAt = performance.now();
      var s = Math.floor(score);
      if (s > hi) { hi = s; if (opt.onHi) opt.onHi(hi); }
      if (opt.onScore) opt.onScore(s);
    }

    /* ---------- Lógica ---------- */
    function spawn() {
      var r = Math.random();
      if (score > 120 && r < 0.3) {
        var low = Math.random() < 0.4;
        obs.push({ t: "bird", x: W + 10, y: low ? 70 : 56, w: 15, h: 9, f: 0 });
      } else {
        var n = score > 200 && Math.random() < 0.35 ? 2 : 1, h = 13 + Math.floor(Math.random() * 8);
        obs.push({ t: "box", x: W + 10, y: GROUND - h, w: 11 * n + (n > 1 ? 2 : 0), h: h, n: n });
      }
      gapLeft = 70 + Math.random() * 90 + speed * 22;
    }
    function hit(o) {
      var ch = cat.duck ? 8 : 15, cx = cat.x + 2, cw = 14, cy = cat.y - ch + 1;
      return cx < o.x + o.w - 1 && cx + cw > o.x + 1 && cy < o.y + o.h - 1 && cy + ch - 2 > o.y + 1;
    }
    function step() {
      frame++;
      cat.vy += 0.42; cat.y += cat.vy;
      if (cat.y >= GROUND) { cat.y = GROUND; cat.vy = 0; cat.air = false; }
      speed = Math.min(6.4, speed + 0.0009);
      score += speed * 0.075;
      gapLeft -= speed;
      if (gapLeft <= 0) spawn();
      obs.forEach(function (o) { o.x -= speed; if (o.t === "bird") o.f = (frame >> 3) & 1; });
      obs = obs.filter(function (o) { return o.x + o.w > -4; });
      clouds.forEach(function (c) { c.x -= c.s + speed * 0.05; if (c.x < -30) { c.x = W + 20; c.y = 10 + Math.random() * 28; } });
      pebbles.forEach(function (p) { p.x -= speed; if (p.x < -4) p.x = W + 4; });
      var nt = Math.floor(score / 600) % 2 === 1;
      if (nt !== night) night = nt;
      nightT += (night ? 0.03 : -0.03); nightT = Math.max(0, Math.min(1, nightT));
      if (opt.onTick) opt.onTick(Math.floor(score));
      for (var i = 0; i < obs.length; i++) if (hit(obs[i])) { end(); break; }
    }
    function loop(t) {
      raf = 0;
      if (destroyed) return;
      if (running && !document.hidden) {
        acc += Math.min(64, t - last); last = t;
        while (acc >= 1000 / 60) { acc -= 1000 / 60; if (!dead) step(); }
      } else last = t;
      draw();
      if (running || dead) raf = requestAnimationFrame(loop);
    }

    /* ---------- Dibujo ---------- */
    function mix(c1, c2, t) {
      function p(c) { var m = /^#?([0-9a-f]{6})$/i.exec(c.trim()); if (!m) return null; var n = parseInt(m[1], 16); return [n >> 16, (n >> 8) & 255, n & 255]; }
      var a = p(c1), b = p(c2); if (!a || !b) return t > 0.5 ? c2 : c1;
      return "rgb(" + a.map(function (v, i) { return Math.round(v + (b[i] - v) * t); }).join(",") + ")";
    }
    function R(x, y, w, h, c) { ctx.fillStyle = c; ctx.fillRect(Math.round(x), Math.round(y), w, h); }
    function rr(x, y, w, h, r, fill, stroke, lw) {
      ctx.beginPath(); ctx.roundRect ? ctx.roundRect(x, y, w, h, r) : ctx.rect(x, y, w, h);
      if (fill) { ctx.fillStyle = fill; ctx.fill(); }
      if (stroke) { ctx.lineWidth = lw || 1.4; ctx.strokeStyle = stroke; ctx.stroke(); }
    }

    function drawCatPixel(x, y, f, pose) {
      // (x, y) = esquina inferior izquierda de las patas; 20×16 píxeles
      x = Math.round(x); y = Math.round(y);
      var L = P.line, F = P.fur, S = P.stripe;
      var top = y - 16;
      if (pose === "duck") {
        R(x + 1, top + 8, 17, 8, L); R(x + 2, top + 9, 15, 6, F);                    // cuerpo agachado
        R(x + 15, top + 6, 6, 7, L); R(x + 16, top + 7, 4, 5, F);                    // cabeza
        R(x + 15, top + 4, 2, 2, L); R(x + 19, top + 4, 2, 2, L); R(x + 16, top + 5, 1, 1, P.ear);
        R(x + 18, top + 8, 1, 1, L); R(x + 20, top + 10, 1, 1, P.nose);
        R(x + 5, top + 10, 2, 1, S); R(x + 10, top + 10, 2, 1, S);
        R(x + 13, top + 11, 2, 2, P.collar);
        R(x - 2 + ((f >> 2) & 1), top + 9, 4, 3, L); R(x - 1 + ((f >> 2) & 1), top + 10, 3, 1, F);
        R(x + 3 + ((f >> 2) & 1) * 2, top + 15, 3, 1, L); R(x + 12 - ((f >> 2) & 1) * 2, top + 15, 3, 1, L);
        return;
      }
      var w = (f >> 2) & 1;
      // cola
      R(x - 1, top + 4 - w, 2, 7 + w, L); R(x, top + 3 - w, 2, 2, L); R(x, top + 5 - w, 1, 5 + w, F);
      // cuerpo
      R(x + 2, top + 5, 13, 8, L); R(x + 3, top + 6, 11, 6, F);
      R(x + 5, top + 6, 1, 3, S); R(x + 8, top + 6, 1, 4, S); R(x + 11, top + 6, 1, 3, S);
      // cabeza + orejas
      R(x + 12, top + 2, 8, 8, L); R(x + 13, top + 3, 6, 6, F);
      R(x + 12, top, 3, 3, L); R(x + 17, top, 3, 3, L); R(x + 13, top + 1, 1, 1, P.ear); R(x + 18, top + 1, 1, 1, P.ear);
      R(x + 17, top + 5, 1, 2, L); R(x + 19, top + 7, 2, 1, L); R(x + 19, top + 6, 1, 1, P.nose);
      R(x + 16, top + 8, 4, 2, P.muz);
      // collar con cascabel
      R(x + 12, top + 9, 4, 2, P.collar); R(x + 13, top + 11, 2, 2, P.bell);
      // patas
      var air = cat.air;
      if (air) { R(x + 12, top + 13, 3, 3, L); R(x + 13, top + 13, 1, 2, F); R(x + 15, top + 12, 3, 2, L); R(x + 2, top + 13, 3, 3, L); R(x + 0, top + 12, 3, 2, L); }
      else if (w) { R(x + 12, top + 13, 3, 3, L); R(x + 13, top + 13, 1, 2, F); R(x + 3, top + 13, 3, 2, L); R(x + 4, top + 13, 1, 1, F); }
      else { R(x + 3, top + 13, 3, 3, L); R(x + 4, top + 13, 1, 2, F); R(x + 11, top + 13, 3, 2, L); R(x + 12, top + 13, 1, 1, F); }
    }
    function drawCatSoft(x, y, f, pose) {
      var w = (f >> 3) & 1, L = P.line, lw = 1.5;
      ctx.lineJoin = "round"; ctx.lineCap = "round";
      var top = y - 16;
      if (pose === "duck") {
        ctx.beginPath(); ctx.moveTo(x + 1, top + 12); ctx.quadraticCurveTo(x - 4, top + 5 + w * 2, x + 1, top + 4); ctx.lineWidth = 3.4; ctx.strokeStyle = L; ctx.stroke();
        ctx.lineWidth = 2; ctx.strokeStyle = P.fur; ctx.stroke();
        rr(x + 1, top + 8, 17, 8, 4, P.fur, L, lw);
        ctx.beginPath(); ctx.ellipse(x + 17, top + 11, 4.6, 4.2, 0, 0, 6.3); ctx.fillStyle = P.fur; ctx.fill(); ctx.strokeStyle = L; ctx.stroke();
        ctx.beginPath(); ctx.moveTo(x + 14.5, top + 8.5); ctx.lineTo(x + 15.5, top + 5.5); ctx.lineTo(x + 18, top + 7.5); ctx.fillStyle = P.fur; ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.arc(x + 18.5, top + 10.5, 0.9, 0, 6.3); ctx.fillStyle = L; ctx.fill();
        ctx.beginPath(); ctx.arc(x + 21, top + 12, 0.8, 0, 6.3); ctx.fillStyle = P.nose; ctx.fill();
        rr(x + 12.5, top + 12, 3, 2, 1, P.collar);
        return;
      }
      // cola
      ctx.beginPath(); ctx.moveTo(x + 2, top + 10); ctx.quadraticCurveTo(x - 6, top + 8, x - 3, top + 1 + w * 3); ctx.lineWidth = 4; ctx.strokeStyle = L; ctx.stroke();
      ctx.lineWidth = 2.4; ctx.strokeStyle = P.fur; ctx.stroke();
      // patas
      ctx.lineWidth = 3.6; ctx.strokeStyle = L;
      var air = cat.air, a = air ? 5 : (w ? 4 : -2), b = air ? -5 : (w ? -3 : 3);
      ctx.beginPath(); ctx.moveTo(x + 13, top + 11); ctx.lineTo(x + 13 + a, y - 1); ctx.moveTo(x + 5, top + 11); ctx.lineTo(x + 5 + b, y - 1); ctx.stroke();
      ctx.lineWidth = 2; ctx.strokeStyle = P.muz;
      ctx.beginPath(); ctx.moveTo(x + 13, top + 11); ctx.lineTo(x + 13 + a, y - 1); ctx.moveTo(x + 5, top + 11); ctx.lineTo(x + 5 + b, y - 1); ctx.stroke();
      // cuerpo
      ctx.beginPath(); ctx.ellipse(x + 9, top + 9, 8, 5.4, 0, 0, 6.3); ctx.fillStyle = P.fur; ctx.fill(); ctx.lineWidth = lw; ctx.strokeStyle = L; ctx.stroke();
      ctx.strokeStyle = P.stripe; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(x + 5, top + 5); ctx.lineTo(x + 6, top + 8); ctx.moveTo(x + 9, top + 4.4); ctx.lineTo(x + 9.5, top + 8); ctx.stroke();
      // cabeza
      ctx.beginPath(); ctx.moveTo(x + 13, top + 4.5); ctx.lineTo(x + 13.8, top - 1); ctx.lineTo(x + 17, top + 2); ctx.moveTo(x + 18, top + 2); ctx.lineTo(x + 21, top - 1); ctx.lineTo(x + 21.5, top + 4.5);
      ctx.fillStyle = P.fur; ctx.fill(); ctx.lineWidth = lw; ctx.strokeStyle = L; ctx.stroke();
      ctx.beginPath(); ctx.ellipse(x + 17.2, top + 6, 5.4, 4.8, 0, 0, 6.3); ctx.fillStyle = P.fur; ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(x + 19, top + 7.8, 2.6, 1.9, 0, 0, 6.3); ctx.fillStyle = P.muz; ctx.fill();
      ctx.beginPath(); ctx.arc(x + 17.6, top + 5, 1.2, 0, 6.3); ctx.fillStyle = L; ctx.fill();
      ctx.beginPath(); ctx.arc(x + 17.9, top + 4.6, 0.4, 0, 6.3); ctx.fillStyle = "#fff"; ctx.fill();
      ctx.beginPath(); ctx.arc(x + 20.3, top + 6.8, 0.8, 0, 6.3); ctx.fillStyle = P.nose; ctx.fill();
      // collar y cascabel
      ctx.beginPath(); ctx.moveTo(x + 12.4, top + 9); ctx.quadraticCurveTo(x + 15, top + 11.4, x + 17.6, top + 9.6); ctx.lineWidth = 2.2; ctx.strokeStyle = P.collar; ctx.stroke();
      ctx.beginPath(); ctx.arc(x + 15, top + 11.7, 1.5, 0, 6.3); ctx.fillStyle = P.bell; ctx.fill(); ctx.lineWidth = 0.7; ctx.strokeStyle = L; ctx.stroke();
    }
    function drawBox(o) {
      if (classic) {
        for (var i = 0; i < o.n; i++) {
          var bx = Math.round(o.x) + i * 13;
          R(bx, o.y, 11, o.h, P.boxd); R(bx + 1, o.y + 1, 9, o.h - 2, P.box); R(bx + 1, o.y + 1, 9, 2, P.boxl); R(bx + 5, o.y, 1, o.h, P.boxd); R(bx + 4, o.y + 3, 3, 1, P.boxl);
        }
      } else {
        for (var j = 0; j < o.n; j++) {
          var x = o.x + j * 13;
          rr(x, o.y, 11, o.h, 2, P.box, P.line, 1.2);
          ctx.fillStyle = P.boxl; ctx.fillRect(x + 4, o.y + 1, 3, o.h - 2);
          ctx.strokeStyle = P.boxd; ctx.lineWidth = 0.8; ctx.beginPath(); ctx.moveTo(x + 1.5, o.y + 4); ctx.lineTo(x + 9.5, o.y + 4); ctx.stroke();
        }
      }
    }
    function drawBird(o) {
      var x = Math.round(o.x), y = Math.round(o.y);
      if (classic) {
        R(x + 3, y + 3, 9, 4, P.line); R(x + 4, y + 4, 7, 2, P.b); R(x + 11, y + 2, 4, 4, P.line); R(x + 12, y + 3, 2, 2, P.b);
        R(x + 15, y + 4, 2, 1, P.bell); R(x + 13, y + 3, 1, 1, P.line); R(x, y + 4, 4, 2, P.line);
        if (o.f) { R(x + 5, y, 4, 4, P.line); R(x + 6, y + 1, 2, 3, P.b); } else { R(x + 5, y + 6, 4, 3, P.line); R(x + 6, y + 6, 2, 2, P.b); }
      } else {
        ctx.beginPath(); ctx.ellipse(x + 8, y + 5, 6.5, 3.4, 0, 0, 6.3); ctx.fillStyle = P.b; ctx.fill(); ctx.lineWidth = 1.2; ctx.strokeStyle = P.line; ctx.stroke();
        ctx.beginPath(); ctx.arc(x + 14, y + 4, 2.8, 0, 6.3); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(x + 16.5, y + 4); ctx.lineTo(x + 19, y + 4.8); ctx.lineTo(x + 16.5, y + 5.6); ctx.fillStyle = P.bell; ctx.fill();
        ctx.beginPath(); ctx.arc(x + 14.6, y + 3.3, 0.6, 0, 6.3); ctx.fillStyle = P.line; ctx.fill();
        ctx.beginPath(); ctx.moveTo(x + 6, y + 4); ctx.quadraticCurveTo(x + 8, o.f ? y - 5 : y + 12, x + 11, y + 4); ctx.fillStyle = mix(P.b, P.bg, 0.25); ctx.fill(); ctx.stroke();
      }
    }
    function draw() {
      ctx.setTransform(K, 0, 0, K, 0, 0);
      var bg = night ? mix(P.bg, P.ink, 0.78 * nightT + 0.0) : P.bg;
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
      var fg = night ? mix(P.ink, P.bg, 0.0 + nightT) : P.ink;
      // estrellas (de noche)
      if (nightT > 0.05) stars.forEach(function (s) {
        ctx.globalAlpha = nightT * (0.4 + 0.6 * Math.abs(Math.sin(s.t + frame / 40)));
        ctx.fillStyle = P.bell; ctx.fillRect(Math.round(s.x), Math.round(s.y), classic ? 1 : 0.9, classic ? 1 : 0.9);
      });
      ctx.globalAlpha = 1;
      // nubes
      ctx.globalAlpha = night ? 0.35 : 0.55;
      clouds.forEach(function (c) {
        if (classic) { R(c.x, c.y, 16, 3, P.soft); R(c.x + 3, c.y - 2, 9, 2, P.soft); }
        else { ctx.fillStyle = P.soft; ctx.beginPath(); ctx.ellipse(c.x + 8, c.y, 9, 2.6, 0, 0, 6.3); ctx.ellipse(c.x + 6, c.y - 2, 5, 3, 0, 0, 6.3); ctx.fill(); }
      });
      ctx.globalAlpha = 1;
      // suelo
      var gl = night ? mix(P.soft, P.bg, 0.5) : P.ink;
      if (classic) { R(0, GROUND + 1, W, 1, gl); } else { ctx.strokeStyle = gl; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(0, GROUND + 1.5); ctx.lineTo(W, GROUND + 1.5); ctx.stroke(); }
      pebbles.forEach(function (p) { R(p.x, p.y, p.w, 1, night ? P.soft : P.soft); });
      // obstáculos y gato
      obs.forEach(function (o) { if (o.t === "box") drawBox(o); else drawBird(o); });
      var pose = cat.duck && !cat.air ? "duck" : "run";
      var f = dead ? 0 : (started ? frame : 0);
      var cy = cat.y;
      if (classic) drawCatPixel(cat.x, cy, f, pose); else drawCatSoft(cat.x, cy, f, pose);
      if (dead) { ctx.fillStyle = P.collar; ctx.globalAlpha = 0.9; if (classic) { R(cat.x + 17, cy - 13, 1, 1, P.collar); } else { ctx.beginPath(); ctx.arc(cat.x + 17.6, cy - 11, 1.6, 0, 6.3); ctx.fill(); } ctx.globalAlpha = 1; }
      // marcador
      var s = String(Math.floor(score)).padStart(5, "0"), h = String(hi).padStart(5, "0");
      ctx.fillStyle = fg; ctx.textBaseline = "top";
      ctx.font = classic ? '6px "Press Start 2P", monospace' : '700 8px "Outfit", system-ui, sans-serif';
      ctx.textAlign = "right"; ctx.fillText((hi ? "HI " + h + "   " : "") + s, W - 10, 7);
      ctx.textAlign = "center";
      if (!started) { ctx.fillText(classic ? "PULSA ESPACIO" : "Pulsa Espacio o toca para empezar", W / 2, 38); }
      else if (dead) {
        ctx.font = classic ? '10px "Press Start 2P", monospace' : '700 13px "Outfit", system-ui, sans-serif';
        ctx.fillText(classic ? "GAME OVER" : "¡Oh no, tropezó!", W / 2, 34);
        ctx.font = classic ? '7px "Press Start 2P", monospace' : '500 7px "Outfit", system-ui, sans-serif';
        ctx.fillText(classic ? "ESPACIO: OTRA VEZ" : "Espacio o toque para intentarlo otra vez", W / 2, 52);
      }
    }

    size(); reset(); draw();
    var ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(function () { size(); draw(); }) : null;
    if (ro) ro.observe(host);
    var mo = new MutationObserver(function () { size(); draw(); });
    mo.observe(root, { attributes: true, attributeFilter: ["data-skin", "data-theme", "data-mpal", "data-pal", "data-season"] });
    function onVis() { if (document.hidden) { /* en pausa sola */ } else last = performance.now(); }
    document.addEventListener("visibilitychange", onVis);

    return {
      start: function () { size(); draw(); },
      pause: function () { running = false; },
      resume: function () { if (started && !dead) { running = true; last = performance.now(); if (!raf) raf = requestAnimationFrame(loop); } },
      hardReset: function () { running = false; started = false; reset(); size(); draw(); },
      jump: jump,
      getHi: function () { return hi; },
      destroy: function () {
        destroyed = true; running = false; cancelAnimationFrame(raf);
        document.removeEventListener("keydown", onKey); document.removeEventListener("keyup", onKeyUp); document.removeEventListener("visibilitychange", onVis);
        if (ro) ro.disconnect(); mo.disconnect(); canvas.remove();
      }
    };
  }
  window.CatRunner = { mount: mount };

  /* ---------- Integración con la página principal ---------- */
  var CP = window.CP;
  if (!CP || !CP.$) return;
  var dlg = null, inst = null;
  function build() {
    dlg = document.createElement("dialog");
    dlg.id = "game"; dlg.className = "dialog game-dialog"; dlg.setAttribute("aria-labelledby", "game-title");
    dlg.innerHTML =
      '<div class="game-bar"><h3 id="game-title">Cat Runner</h3>' +
      '<span class="game-keys" aria-hidden="true"><kbd>Espacio</kbd> saltar · <kbd>↓</kbd> agacharse</span>' +
      '<button class="icon-btn rip" type="button" data-gclose aria-label="Cerrar el juego">' + CP.icon("close") + "</button></div>" +
      '<div class="game-stage" id="game-stage"></div>';
    document.body.appendChild(dlg);
    dlg.addEventListener("click", function (e) { if (e.target === dlg || e.target.closest("[data-gclose]")) close(); });
    dlg.addEventListener("cancel", function (e) { e.preventDefault(); close(); });
    inst = mount($("#game-stage"), {
      hi: parseInt(CP.store.get("cp-runner-hi"), 10) || 0,
      isOpen: function () { return dlg.open; },
      onHi: function (h) { CP.store.set("cp-runner-hi", String(h)); if (CP.refreshHi) CP.refreshHi(); },
      onScore: function (s) { if (CP.ach) CP.ach.score(s); },
      onTick: function (s) { if (CP.ach && (s === 100 || s === 500)) CP.ach.score(s); }
    });
    function $(s) { return dlg.querySelector(s); }
  }
  function open() {
    if (!dlg) build();
    if (dlg.open) return;
    if (CP.panel) CP.panel.close();
    CP.openDialog(dlg);
    setTimeout(function () { inst.start(); inst.resume(); }, 60);
  }
  function close() {
    if (!dlg || !dlg.open) return;
    inst.pause(); inst.hardReset();
    CP.closeDialog(dlg);
  }
  CP.game = { open: open, close: close };
})();
