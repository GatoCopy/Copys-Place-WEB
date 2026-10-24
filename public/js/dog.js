/* ==========================================================
   Copy's Place — El perro (temporadas «Día del Perro» y «San Valentín»)
   - Día del Perro (26 de agosto): el gato grande del inicio se convierte en un golden retriever.
     Usa las MISMAS clases que el gato (ojos, orejas, cola, cabeza), así que reacciona igual.
   - San Valentín (febrero): el perro se sienta junto al gato (amigos, no solo pareja).
   Solo versión moderna. Va ANTES de cat.js para que este tome los nodos ya cambiados.
   ========================================================== */
(function () {
  "use strict";
  var root = document.documentElement;
  var season = root.getAttribute("data-season");
  if ((season !== "dogday" && season !== "valentine") || root.dataset.skin === "classic") return;
  var art = document.getElementById("hero-art"), svg = document.getElementById("hero-cat");
  if (!art || !svg) return;

  function eye(x, y) {
    return '<g transform="translate(' + x + ' ' + y + ')"><g class="eye ' + (x < 200 ? "l" : "r") + '">' +
      '<g class="open"><ellipse class="sclera" rx="17" ry="19" fill="var(--dog-eye)" stroke="var(--dog-line)" stroke-width="4"/>' +
      '<g class="pupil"><ellipse class="iris" cy="1" rx="12" ry="14" fill="#1d110a"/><circle cx="-4.500" cy="-5" r="4.800" fill="#fff"/><circle cx="4.500" cy="6" r="2.200" fill="#fff" opacity=".8"/></g></g>' +
      '<path class="happy" d="M-14 6Q0 -16 14 6" fill="none" stroke="var(--dog-line)" stroke-width="6" stroke-linecap="round"/>' +
      '<path class="sleepy" d="M-14 -2Q0 13 14 -2" fill="none" stroke="var(--dog-line)" stroke-width="6" stroke-linecap="round"/>' +
      "</g></g>";
  }
  function ear() {
    return '<path d="M138 122C106 118 88 154 94 212C98 244 114 256 130 246C140 214 142 168 152 134Z" fill="var(--dog-dark)" stroke="var(--dog-line)" stroke-width="5" stroke-linejoin="round"/>' +
      '<path d="M112 160C108 196 112 222 122 236" fill="none" stroke="var(--dog-line)" stroke-opacity=".28" stroke-width="4" stroke-linecap="round"/>';
  }
  var L = "var(--dog-line)";
  var ART =
    '<ellipse class="hc-shadow" cx="200" cy="437" rx="128" ry="12" fill="var(--on-surface)" opacity=".13"/>' +
    '<g class="hc-tail"><path d="M262 414C338 430 386 394 374 326C368 290 348 268 330 256" fill="none" stroke="' + L + '" stroke-width="40" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<path d="M262 414C338 430 386 394 374 326C368 290 348 268 330 256" fill="none" stroke="var(--dog-dark)" stroke-width="29" stroke-linecap="round"/>' +
    '<path d="M262 414C338 430 386 394 374 326C368 290 348 268 330 256" fill="none" stroke="var(--dog-fur)" stroke-width="14" stroke-linecap="round" stroke-dasharray="40 14"/></g>' +
    '<g class="hc-body"><g stroke="' + L + '" stroke-width="6" stroke-linejoin="round" fill="var(--dog-fur)">' +
    '<path d="M150 250C146 296 124 330 112 384C106 412 122 430 146 430L254 430C278 430 294 412 288 384C276 330 254 296 250 250Z"/>' +
    '<ellipse cx="136" cy="390" rx="38" ry="44"/><ellipse cx="264" cy="390" rx="38" ry="44"/></g>' +
    '<path d="M162 258L238 258C242 296 236 316 228 330C220 322 214 338 206 330C200 346 192 330 186 336C178 322 170 330 172 318C164 306 160 290 162 258Z" fill="var(--dog-light)"/>' +
    '<g stroke="' + L + '" stroke-width="6" stroke-linejoin="round" fill="var(--dog-fur)"><rect x="160" y="326" width="38" height="104" rx="19"/><rect x="202" y="326" width="38" height="104" rx="19"/></g>' +
    '<g stroke="' + L + '" stroke-width="6" stroke-linejoin="round" fill="var(--dog-light)"><ellipse cx="179" cy="426" rx="25" ry="14"/><ellipse cx="221" cy="426" rx="25" ry="14"/><ellipse cx="112" cy="428" rx="29" ry="13"/><ellipse cx="288" cy="428" rx="29" ry="13"/></g>' +
    '<g stroke="' + L + '" stroke-width="4" stroke-linecap="round" fill="none" opacity=".7"><path d="M172 421V431M186 421V431M214 421V431M228 421V431"/></g>' +
    '<path d="M148 262Q200 294 252 262L248 282Q200 314 152 282Z" fill="var(--dog-collar)" stroke="' + L + '" stroke-width="5" stroke-linejoin="round"/>' +
    '<g class="hc-bell"><path d="M184 302h32a6 6 0 0 1 0 14h-32a6 6 0 0 1 0-14Z" fill="#f4c542" stroke="' + L + '" stroke-width="4"/><circle cx="182" cy="299" r="6" fill="#f4c542" stroke="' + L + '" stroke-width="4"/><circle cx="218" cy="299" r="6" fill="#f4c542" stroke="' + L + '" stroke-width="4"/></g></g>' +
    '<g class="hc-head">' +
    '<g class="hc-ear l"><g>' + ear() + "</g></g>" +
    '<g class="hc-ear r"><g transform="matrix(-1 0 0 1 400 0)">' + ear() + "</g></g>" +
    '<path d="M200 106C252 106 288 138 288 184C288 226 252 252 200 252C148 252 112 226 112 184C112 138 148 106 200 106Z" fill="var(--dog-fur)" stroke="' + L + '" stroke-width="6" stroke-linejoin="round"/>' +
    '<path d="M168 112Q184 132 200 118Q216 132 232 112" fill="none" stroke="var(--dog-dark)" stroke-width="6" stroke-linecap="round" opacity=".55"/>' +
    '<path d="M200 128C214 150 214 176 204 200L196 200C186 176 186 150 200 128Z" fill="var(--dog-light)" opacity=".85"/>' +
    '<ellipse cx="200" cy="222" rx="50" ry="34" fill="var(--dog-light)" stroke="' + L + '" stroke-width="4"/>' +
    '<path d="M142 150Q156 142 172 148M258 150Q244 142 228 148" fill="none" stroke="var(--dog-dark)" stroke-width="6" stroke-linecap="round"/>' +
    eye(160, 178) + eye(240, 178) +
    '<path d="M180 202Q200 192 220 202Q216 220 200 224Q184 220 180 202Z" fill="var(--dog-nose)" stroke="' + L + '" stroke-width="4" stroke-linejoin="round"/>' +
    '<ellipse cx="193" cy="203" rx="6" ry="3" fill="#fff" opacity=".35"/>' +
    '<path class="mouth-smile" d="M200 223V236M200 236Q188 250 170 240M200 236Q212 250 230 240" fill="none" stroke="' + L + '" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<g class="mouth-open"><path d="M176 232Q200 280 224 232Z" fill="#6b1f2a" stroke="' + L + '" stroke-width="4" stroke-linejoin="round"/><path d="M188 246Q200 282 212 246Q200 238 188 246Z" fill="#ff7a93" stroke="' + L + '" stroke-width="3"/></g>' +
    "</g>";

  if (season === "dogday") {
    svg.innerHTML = ART;
    art.dataset.species = "dog";
    art.setAttribute("aria-label", "Acariciar al perro del inicio. Sus ojos siguen al cursor; si lo tocas, mueve la cola.");
  } else {
    /* San Valentín: el perro se sienta junto al gato */
    var buddy = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    buddy.setAttribute("class", "hc dog-buddy"); buddy.setAttribute("viewBox", "0 0 400 460"); buddy.setAttribute("aria-hidden", "true");
    buddy.innerHTML = ART;
    svg.after(buddy);
    art.classList.add("has-buddy");
  }
})();
