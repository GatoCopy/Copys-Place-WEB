/* Copy's Place — sección «Ruta»: ahora / próximo / hecho, versiones y encuesta «Tú decides» (D1) */
(function () {
  "use strict";
  var CP = window.CP, S = window.SITE; if (!CP || !S) return;
  var esc = CP.esc, icon = CP.icon;
  CP.registerType("ruta", function (sec, body) {
    var R = S.ruta || {}, P = R.poll;
    function bars(a) { return (a || []).map(function (x) { return '<li><span>' + esc(x.t) + '</span><div class="rt-bar" role="progressbar" aria-valuenow="' + x.p + '" aria-valuemin="0" aria-valuemax="100"><i style="--w:' + x.p + '%"></i></div><b>' + x.p + '%</b></li>'; }).join(""); }
    body.innerHTML =
      '<div class="rt-grid reveal">' +
      '<article class="card rt-card"><h3>' + icon("bolt") + 'Ahora</h3><ul class="rt-list">' + bars(R.now) + '</ul></article>' +
      '<article class="card rt-card"><h3>' + icon("flag") + 'Después</h3><ul class="rt-list">' + bars(R.next) + '</ul></article>' +
      '<article class="card rt-card"><h3>' + icon("check_circle") + 'Hecho</h3><ul class="rt-done">' + (R.done || []).map(function (d) { return "<li>" + esc(d) + "</li>"; }).join("") + '</ul></article>' +
      "</div>" +
      '<h3 class="rt-sub reveal">' + icon("schedule") + 'Versiones de Copy\'s Place</h3>' +
      '<div class="rt-vers reveal">' + (R.versions || []).map(function (v) {
        return '<article class="card rt-ver-card' + (v.now ? " is-now" : "") + '"><header><span class="rt-vbadge">' + esc(v.v) + '</span><div><b>' + esc(v.name) + '</b><small>' + esc(v.when || "") + (v.now ? " · actual" : "") + '</small></div></header><ul class="rt-ver">' +
          v.items.map(function (x) { return "<li><b>" + esc(x[0]) + "</b><span>" + esc(x[1]) + "</span></li>"; }).join("") + "</ul></article>";
      }).join("") + "</div>";
  });
})();
