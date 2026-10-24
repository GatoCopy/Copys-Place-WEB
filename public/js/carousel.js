/* ==========================================================
   Copy's Place — Slider (carrusel)
   - Desliza con el dedo, arrastra con el ratón o usa flechas/puntos
   - Reproducción automática con pausa (al pasar el cursor, tocar o con el botón)
   - Teclado: ← → en el slider
   ========================================================== */
(function () {
  "use strict";
  var CP = window.CP;
  var INTERVAL = 6000;

  CP.initCarousel = function (root) {
    var track = root.querySelector(".c-track");
    var slides = Array.prototype.slice.call(track.children);
    if (!slides.length) { root.hidden = true; return; }

    var dotsBox = root.querySelector(".c-dots");
    var prev = root.querySelector('[data-c="prev"]');
    var next = root.querySelector('[data-c="next"]');
    var toggle = root.querySelector('[data-c="toggle"]');

    var index = 0, lastIndex = -1;
    var autoplay = !CP.reduceMotion;   // elección de la persona (botón)
    var hold = false;                  // pausa temporal (hover, foco, toque)
    var timer = null;

    root.style.setProperty("--interval", INTERVAL + "ms");
    dotsBox.innerHTML = slides.map(function (_, i) {
      return '<button class="c-dot" type="button" role="tab" data-i="' + i + '" aria-label="Ir a la novedad ' + (i + 1) + ' de ' + slides.length + '"></button>';
    }).join("");
    var dots = Array.prototype.slice.call(dotsBox.children);
    toggle.setAttribute("aria-pressed", String(autoplay));
    toggle.setAttribute("aria-label", autoplay ? "Pausar reproducción automática" : "Activar reproducción automática");

    function left(i) {
      var s = slides[i];
      return s.offsetLeft - (track.clientWidth - s.offsetWidth) / 2;
    }
    function go(i) {
      index = (i + slides.length) % slides.length;
      track.scrollTo({ left: left(index), behavior: CP.reduceMotion ? "auto" : "smooth" });
    }

    function schedule() {
      clearTimeout(timer);
      dots.forEach(function (d) { d.classList.remove("run"); });
      if (!autoplay || hold || document.hidden) return;
      // fuerza reinicio de la barra de progreso en el punto activo
      void dotsBox.offsetWidth;
      dots[index].classList.add("run");
      timer = setTimeout(function () { go(index + 1); }, INTERVAL);
    }

    function nearest() {
      var c = track.scrollLeft + track.clientWidth / 2, best = 0, bd = Infinity;
      slides.forEach(function (s, i) {
        var d = Math.abs(s.offsetLeft + s.offsetWidth / 2 - c);
        if (d < bd) { bd = d; best = i; }
      });
      return best;
    }

    function update() {
      index = nearest();
      slides.forEach(function (s, i) {
        s.classList.toggle("is-active", i === index);
        s.setAttribute("aria-hidden", i === index ? "false" : "true");
      });
      dots.forEach(function (d, i) {
        d.classList.toggle("active", i === index);
        d.setAttribute("aria-selected", String(i === index));
      });
      if (index !== lastIndex) { lastIndex = index; schedule(); }
    }

    var raf = 0;
    track.addEventListener("scroll", function () {
      if (!raf) raf = requestAnimationFrame(function () { raf = 0; update(); });
    }, { passive: true });

    /* Botones y puntos */
    prev.addEventListener("click", function () { go(index - 1); });
    next.addEventListener("click", function () { go(index + 1); });
    dotsBox.addEventListener("click", function (e) {
      var b = e.target.closest(".c-dot");
      if (b) go(+b.dataset.i);
    });
    toggle.addEventListener("click", function () {
      autoplay = !autoplay;
      toggle.setAttribute("aria-pressed", String(autoplay));
      toggle.setAttribute("aria-label", autoplay ? "Pausar reproducción automática" : "Activar reproducción automática");
      schedule();
    });

    /* Teclado */
    track.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") { e.preventDefault(); go(index + 1); }
      if (e.key === "ArrowLeft") { e.preventDefault(); go(index - 1); }
    });

    /* Pausas temporales */
    function setHold(v) { if (hold !== v) { hold = v; schedule(); } }
    root.addEventListener("pointerenter", function (e) { if (e.pointerType === "mouse") setHold(true); });
    root.addEventListener("pointerleave", function (e) { if (e.pointerType === "mouse") setHold(false); });
    root.addEventListener("focusin", function () { setHold(true); });
    root.addEventListener("focusout", function () { setHold(false); });
    document.addEventListener("visibilitychange", schedule);
    track.addEventListener("touchstart", function () { setHold(true); }, { passive: true });
    track.addEventListener("touchend", function () { setTimeout(function () { setHold(false); }, 3000); }, { passive: true });

    /* Arrastrar con el ratón */
    var down = false, startX = 0, startLeft = 0;
    track.addEventListener("pointerdown", function (e) {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      down = true; startX = e.clientX; startLeft = track.scrollLeft;
      track.classList.add("dragging");
    });
    window.addEventListener("pointermove", function (e) {
      if (down) track.scrollLeft = startLeft - (e.clientX - startX);
    });
    window.addEventListener("pointerup", function () {
      if (!down) return;
      down = false;
      track.classList.remove("dragging");
      go(nearest());
    });

    /* Recalcular al cambiar el tamaño */
    window.addEventListener("resize", function () {
      track.scrollTo({ left: left(index), behavior: "auto" });
    });

    // Posición inicial (sin animar) y arranque
    track.scrollTo({ left: left(0), behavior: "auto" });
    update();
  };
})();
