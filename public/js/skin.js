/* ==========================================================
   Copy's Place — Versión moderna / clásica (easter egg)
   La versión clásica es la misma página con el estilo pixel art
   naranja y violeta de 2025 (cuando la página nació en Neocities). Se descubre con:
     · el código Konami  (↑ ↑ ↓ ↓ ← → ← → B A)
     · 5 toques rápidos al gato grande del inicio
     · añadiendo ?classic a la dirección
   Una vez descubierta, aparece un switch en el pie de página.
   ========================================================== */
(function () {
  "use strict";
  var CP = window.CP, S = window.SITE, root = document.documentElement;
  var cfg = S.classic || {};
  var KEY = "cp-skin", UKEY = "cp-unlocked";
  var sw = CP.$("#skin-switch"), tog = CP.$("#skin-toggle");
  var fromUrl = /[?&](classic|v=classic)(&|$)/.test(location.search);

  var unlocked = cfg.secret === false || CP.store.get(UKEY) === "1" || root.dataset.skin === "classic" || fromUrl;
  if (fromUrl) { CP.store.set(UKEY, "1"); CP.store.set(KEY, "classic"); }

  function isClassic() { return root.dataset.skin === "classic"; }
  function reflect() {
    tog.setAttribute("aria-checked", String(isClassic()));
    sw.hidden = !unlocked;
    CP.$("#skin-l-modern").classList.toggle("on", !isClassic());
    CP.$("#skin-l-classic").classList.toggle("on", isClassic());
  }
  function refit() {
    // las tipografías cambian el ancho de los enlaces: recoloca el indicador del menú
    var fonts = document.fonts;
    if (fonts && fonts.load) {
      Promise.all([fonts.load('400 16px "Pixelify Sans"'), fonts.load('16px "Press Start 2P"')])
        .then(function () { if (CP.movePill) CP.movePill(); }).catch(function () {});
    }
    setTimeout(function () { if (CP.movePill) CP.movePill(); }, 150);
  }
  function apply(skin, origin) {
    CP.transition(function () {
      root.dataset.skin = skin;
      CP.store.set(KEY, skin);
      CP.paintMeta();
      reflect();
    }, origin);
    refit();
  }
  function unlock(origin) {
    var first = !unlocked;
    unlocked = true;
    CP.store.set(UKEY, "1");
    apply(isClassic() ? "modern" : "classic", origin);
    CP.toast(isClassic()
      ? "¡Versión clásica desbloqueada! 🐾 Puedes cambiar cuando quieras desde el pie de página."
      : (first ? "¡Encontraste el secreto! 🐾" : "De vuelta a la versión moderna."), 4200);
  }

  reflect();
  if (isClassic()) refit();
  tog.addEventListener("click", function () { apply(isClassic() ? "modern" : "classic", tog); });

  /* Código Konami */
  var code = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"], pos = 0;
  document.addEventListener("keydown", function (e) {
    var t = e.target && e.target.tagName;
    if (t === "INPUT" || t === "TEXTAREA") return;
    var k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    pos = k === code[pos] ? pos + 1 : (k === code[0] ? 1 : 0);
    if (pos === code.length) { pos = 0; unlock(CP.$("#theme-btn")); }
  });

  /* 5 toques rápidos al gato grande del inicio (el que sigue al cursor) */
  var taps = [];
  document.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest("#hero-art");
    if (!b) return;
    var now = Date.now();
    taps = taps.filter(function (t) { return now - t < 2500; });
    taps.push(now);
    if (taps.length >= 5) { taps = []; unlock(b); }
  });
})();
