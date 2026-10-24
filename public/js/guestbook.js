/* ==========================================================
   Copy's Place — Buzón de mensajes
   1) Con Cloudflare (Pages Functions + D1, ver README): los mensajes se guardan
      en el servidor, se revisan antes de publicarse y los aprobados se ven aquí.
      Es el modo normal en producción (SITE.guestbook.api = "/api/guestbook").
   2) Si SITE.guestbook.endpoint tiene una URL (p. ej. Formspree), el mensaje
      se envía ahí y te llega a ti.
   3) Si no hay nada de lo anterior (por ejemplo, probando en local), los
      mensajes se guardan solo en el navegador de quien los escribe.
   ========================================================== */
(function () {
  "use strict";
  var CP = window.CP, $ = CP.$, esc = CP.esc;
  var cfg = (window.SITE && window.SITE.guestbook) || {};
  var MAX = cfg.maxLength || 280;
  var KEY = "cp-buzon";
  var endpoint = (cfg.endpoint || "").trim();
  var api = cfg.api === undefined ? "/api/guestbook" : (cfg.api || "");
  var serverMode = false, token = "", tsId = null;

  var form = $("#gb-form"), nameIn = $("#gb-name"), textIn = $("#gb-text");
  var count = $("#gb-count"), list = $("#gb-list"), send = $("#gb-send"), hp = $("#gb-hp");
  var fName = $("#f-name"), fText = $("#f-text");
  var rtf = window.Intl && Intl.RelativeTimeFormat ? new Intl.RelativeTimeFormat("es", { numeric: "auto" }) : null;

  textIn.maxLength = MAX;
  count.textContent = "0/" + MAX;
  $("#gb-note").textContent = endpoint
    ? "Tu mensaje me llegará directamente. Gracias por escribir."
    : "Por ahora los mensajes se guardan solo en este navegador: yo no los recibo.";
  $("#gb-title").textContent = endpoint ? "Lo que has enviado desde aquí" : "Mensajes en este navegador";

  /* ---------- Modo servidor (Cloudflare) ---------- */
  function serverItem(m) {
    return '<div class="msg-item"><div class="msg-avatar" aria-hidden="true">' + esc((m.name || "?").charAt(0).toUpperCase()) + "</div>" +
      '<div><div class="msg-meta"><b>' + esc(m.name) + "</b><time>" + esc(ago(m.t)) + "</time></div>" +
      '<p class="msg-text">' + esc(m.text) + "</p></div></div>";
  }
  function renderServer(items) {
    list.innerHTML = items.length ? items.map(serverItem).join("") : emptyHTML();
  }
  function loadTurnstile() {
    var key = cfg.turnstileSiteKey;
    if (!key) return;
    var box = $("#gb-ts");
    if (!box) return;
    var s = document.createElement("script");
    s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    s.async = true;
    s.onload = function () {
      if (!window.turnstile) return;
      tsId = window.turnstile.render(box, { sitekey: key, theme: "auto", callback: function (t) { token = t; } });
    };
    document.head.appendChild(s);
  }
  if (api) {
    fetch(api, { headers: { Accept: "application/json" } })
      .then(function (r) { return r.ok ? r.json() : Promise.reject(); })
      .then(function (d) {
        if (!d || d.ok !== true) return;
        serverMode = true;
        $("#gb-note").textContent = "Todos los mensajes se revisan antes de publicarse. Gracias por escribir.";
        $("#gb-title").textContent = "Lo que han escrito";
        renderServer(d.items || []);
        loadTurnstile();
      }).catch(function () {});
  }

  /* ---------- Almacenamiento local ---------- */
  function load() {
    try { return JSON.parse(CP.store.get(KEY) || "[]"); } catch (e) { return []; }
  }
  function save(arr) { CP.store.set(KEY, JSON.stringify(arr.slice(-30))); }

  function ago(ts) {
    var s = Math.round((ts - Date.now()) / 1000), a = Math.abs(s);
    if (!rtf) return new Date(ts).toLocaleString("es");
    if (a < 45) return "ahora mismo";
    if (a < 3600) return rtf.format(Math.round(s / 60), "minute");
    if (a < 86400) return rtf.format(Math.round(s / 3600), "hour");
    return rtf.format(Math.round(s / 86400), "day");
  }
  function itemHTML(m) {
    return '<div class="msg-item" data-id="' + m.id + '">' +
      '<div class="msg-avatar" aria-hidden="true">' + esc((m.name || "?").charAt(0).toUpperCase()) + "</div>" +
      '<div><div class="msg-meta"><b>' + esc(m.name) + "</b><time>" + esc(ago(m.t)) + "</time></div>" +
      '<p class="msg-text">' + esc(m.text) + "</p></div>" +
      '<button class="icon-btn rip" type="button" data-del aria-label="Borrar este mensaje">' + CP.icon("delete") + "</button></div>";
  }
  function emptyHTML() {
    return '<div class="msgs-empty" id="gb-empty">' + CP.icon("forum") + "<p>Todavía no hay mensajes. ¡Sé el primero en dejar uno!</p></div>";
  }
  function render() {
    var arr = load();
    list.innerHTML = arr.length ? arr.slice().reverse().map(itemHTML).join("") : emptyHTML();
  }
  render();

  list.addEventListener("click", function (e) {
    var b = e.target.closest("[data-del]");
    if (!b) return;
    var item = b.closest(".msg-item"), id = item.dataset.id;
    item.classList.add("removing");
    setTimeout(function () {
      save(load().filter(function (m) { return String(m.id) !== id; }));
      item.remove();
      if (!list.children.length) list.innerHTML = emptyHTML();
    }, CP.reduceMotion ? 0 : 380);
  });

  /* ---------- Formulario ---------- */
  textIn.addEventListener("input", function () {
    count.textContent = textIn.value.length + "/" + MAX;
    clearError(fText);
  });
  nameIn.addEventListener("input", function () { clearError(fName); });

  function setError(field, msg) {
    field.classList.add("invalid");
    field.querySelector(".msg").textContent = msg;
    field.classList.remove("shake");
    void field.offsetWidth;
    field.classList.add("shake");
  }
  function clearError(field) {
    field.classList.remove("invalid", "shake");
    field.querySelector(".msg").textContent = "";
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var name = nameIn.value.trim(), text = textIn.value.trim();
    var ok = true;
    if (!name) { setError(fName, "Dime cómo te llamas"); ok = false; }
    if (!text) { setError(fText, "Escribe un mensaje"); ok = false; }
    if (!ok) { (name ? textIn : nameIn).focus(); return; }
    if (hp.value) { form.reset(); return; } // bots

    var label = send.querySelector(".btn-label");
    var oldLabel = label.textContent;
    send.disabled = true;
    label.textContent = "Enviando…";
    var sp = document.createElement("span");
    sp.className = "spinner";
    send.querySelector(".icon").replaceWith(sp);

    var done = function (ok2) {
      send.disabled = false;
      label.textContent = oldLabel;
      sp.replaceWith(Object.assign(document.createElement("span"), { innerHTML: CP.icon("send") }).firstChild);
      if (ok2 === 429) { CP.toast("Espera un momentito antes de enviar otro mensaje 🐾"); return; }
      if (!ok2) { CP.toast("No se pudo enviar. Inténtalo de nuevo en un momento."); return; }
      if (serverMode) {
        form.reset();
        count.textContent = "0/" + MAX;
        token = "";
        if (tsId !== null && window.turnstile) window.turnstile.reset(tsId);
        CP.toast("¡Mensaje enviado! Lo leeré pronto y aparecerá aquí 🐾", 4200);
        return;
      }

      var arr = load();
      arr.push({ id: Date.now(), t: Date.now(), name: name, text: text });
      save(arr);
      var empty = $("#gb-empty");
      if (empty) empty.remove();
      list.insertAdjacentHTML("afterbegin", itemHTML(arr[arr.length - 1]));
      form.reset();
      count.textContent = "0/" + MAX;
      CP.toast(endpoint ? "¡Mensaje enviado! Gracias 🐾" : "¡Guardado en este navegador! 🐾");
    };

    if (serverMode) {
      if (cfg.turnstileSiteKey && !token) { done(false); CP.toast("Confirma primero que no eres un robot 🤖"); return; }
      fetch(api, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ name: name, message: text, token: token, website: hp.value })
      }).then(function (r) { done(r.ok ? true : (r.status === 429 ? 429 : false)); }).catch(function () { done(false); });
      return;
    }
    if (!endpoint) { setTimeout(function () { done(true); }, CP.reduceMotion ? 0 : 450); return; }
    fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ name: name, message: text })
    }).then(function (r) { done(r.ok); }).catch(function () { done(false); });
  });
})();
