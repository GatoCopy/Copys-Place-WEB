/* ==========================================================
   Copy's Place — CALENDARIO DE TEMPORADAS
   Se ejecuta ANTES de que la página se pinte (por eso va en el <head>)
   y decide qué temporada está activa según la fecha de HOY del visitante.
   Solo afecta a la versión MODERNA: la clásica nunca se disfraza.

   Cómo editarlo:
   - "seasons": reglas por orden de prioridad (gana la primera que coincida).
     Fechas en formato "MM-DD". Si "from" es mayor que "to", la regla cruza el año
     (por ejemplo from "12-20" to "01-05").
   - "copy": los textos de cada temporada.
   - Para probar una temporada sin esperar a su fecha, añade a la dirección
       ?season=memorial  halloween  birthday  xmas  valentine  pride  newyear  catday  dogday  anniversary  launch  none
   - Quien visita puede apagar la decoración desde el pie de página
     (se recuerda en su navegador).
   ========================================================== */
(function () {
  "use strict";

  var C = (window.CALENDAR = {
    seasons: [
      { id: "launch",    from: "10-16", to: "10-18", year: 2026 },   // 🚀 lanzamiento público de la V3 (solo este año)
      { id: "anniversary", from: "06-23", to: "06-23" },   // 🎈 aniversario de la página (23 de junio de 2025)
      { id: "dogday",    from: "08-26", to: "08-26" },   // 🐕 Día Internacional del Perro
      { id: "memorial",  from: "08-30", to: "08-30" },   // 🕯 un día tranquilo para recordar
      { id: "birthday",  from: "10-29", to: "10-29" },   // 🎂 cumpleaños de CopyCat
      { id: "catday",    from: "08-08", to: "08-08" },   // 👑 Día Internacional del Gato
      { id: "newyear",   from: "01-01", to: "01-07" },   // ✨ Año Nuevo (primera semana)
      { id: "valentine", from: "02-01", to: "02-29" },   // 💘 todo febrero
      { id: "pride",     from: "06-01", to: "06-30" },   // 🏳️‍🌈 todo junio
      { id: "halloween", from: "10-01", to: "10-31" },   // 🎃 todo octubre
      { id: "xmas",      from: "11-01", to: "12-31" }    // 🎄 noviembre y diciembre
    ],

    /* Textos. "banner" es una función para poder calcular cuentas regresivas.
       d = fecha de hoy; daysTo(mes, día) = días que faltan para esa fecha. */
    copy: {
      launch: {
        chip: "Lanzamiento de la V3", chipIcon: "i-celebration", bannerIcon: "i-celebration",
        colors: ["#ffd24a", "#ffe9a3", "#ffffff", "#9ec1ff", "#c9a7ff"],
        clickConfetti: true,
        banner: function () {
          return {
            title: "¡Copy's Place V3 ya es pública!",
            text: "Del 16 al 18 de octubre celebro el lanzamiento oficial de la página. Gracias por ser de los primeros en pasar.",
            confetti: true
          };
        }
      },
      anniversary: {
        chip: "Aniversario", chipIcon: "i-cake", bannerIcon: "i-cake",
        clickConfetti: true,
        banner: function (d) {
          var y = d.getFullYear() - 2025;
          return {
            title: "¡Copy's Place cumple " + y + (y === 1 ? " año!" : " años!"),
            text: "El 23 de junio de 2025 nació esta página en Neocities. Gracias por acompañarla desde entonces.",
            confetti: true
          };
        }
      },
      dogday: {
        chip: "Día del Perro", chipIcon: "i-pets", bannerIcon: "i-pets",
        colors: ["#e3a63f", "#f6d28a", "#7cc4f0", "#ffffff"],
        clickConfetti: true,
        banner: function () {
          return {
            title: "¡Hoy es el Día Internacional del Perro!",
            text: "Por un día, el gato le cede el puesto a un buen chico. Acarícialo: mueve la cola.",
            confetti: true
          };
        }
      },
      halloween: {
        chip: "Octubre embrujado", chipIcon: "s-pumpkin", bannerIcon: "s-pumpkin",
        banner: function (d, daysTo) {
          var n = daysTo(10, 31);
          return {
            title: n === 0 ? "¡Hoy es Halloween!" : n === 1 ? "¡Mañana es Halloween!" : "Faltan " + n + " días para Halloween",
            text: d.getDate() < 29
              ? "Copy's Place se disfrazó para octubre. Y el 29 hay fiesta: vuelve ese día."
              : "Copy's Place se disfrazó para octubre. ¡Cuidado con los murciélagos!"
          };
        }
      },
      birthday: {
        chip: "¡Hoy es mi cumpleaños!", chipIcon: "i-cake", bannerIcon: "i-cake",
        banner: function () {
          return {
            title: "¡Hoy es el cumpleaños de CopyCat!",
            text: "Gracias por pasar por aquí. ¿Me dejas un mensaje de felicitación en el buzón?",
            confetti: true,           // botón de confeti
            link: { label: "Felicitar", url: "#buzon" }
          };
        }
      },
      xmas: {
        chip: "Felices fiestas", chipIcon: "s-tree", bannerIcon: "s-tree",
        banner: function (d, daysTo) {
          var m = d.getMonth() + 1, day = d.getDate(), n = daysTo(12, 25);
          if (m === 12 && day === 25) return { title: "¡Feliz Navidad!", text: "Que tengas un día lleno de gatitos, chocolate caliente y buena compañía." };
          if (m === 12 && day === 31) return { title: "¡Feliz año nuevo!", text: "Gracias por acompañarme este año. ¡Nos vemos en el siguiente!" };
          if (m === 12 && day > 25) return { title: "¡Felices fiestas!", text: "Copy's Place sigue con la nieve puesta hasta fin de año." };
          if (m === 11) return { title: "Ya huele a Navidad", text: "Copy's Place se llenó de nieve y lucecitas. En diciembre empieza la cuenta regresiva." };
          return {
            title: n === 1 ? "¡Mañana es Navidad!" : "Faltan " + n + " días para Navidad",
            text: "Copy's Place se llenó de nieve y lucecitas para las fiestas."
          };
        }
      },
      memorial: {
        chip: "Un día para recordar", chipIcon: "i-nightlight", bannerIcon: "i-nightlight",
        colors: ["#aebfe8", "#e8d9a8", "#ffffff"],
        banner: function () {
          return {
            title: "30 de agosto",
            text: "Hoy Copy's Place baja la voz para recordar a alguien especial. Gracias por acompañarme en un día así.",
            stay: 22000
          };
        }
      },
      valentine: {
        chip: "Mes del amor", chipIcon: "s-heart", bannerIcon: "s-heart",
        colors: ["#ff4d79", "#ff8fb1", "#ffd1dc", "#ffffff", "#ffc58a"],
        clickConfetti: true,
        banner: function (d, daysTo) {
          var n = daysTo(2, 14);
          if (n === 0) return { title: "¡Feliz San Valentín!", text: "Hoy mandan el amor y la amistad: el gato y el perro lo celebran juntos. Gracias por estar por aquí." };
          if (n < 0) return { title: "Febrero sigue lleno de amor", text: "Copy's Place se quedó de rosa todo el mes." };
          return {
            title: n === 1 ? "¡Mañana es San Valentín!" : "Faltan " + n + " días para San Valentín",
            text: "Copy's Place se llenó de corazones. Febrero es del amor y de la amistad: mira al gato y al perro."
          };
        }
      },
      pride: {
        chip: "Mes del Orgullo", chipIcon: "s-rainbow", bannerIcon: "s-rainbow",
        colors: ["#e40303", "#ff8c00", "#ffed00", "#008026", "#24a0ff", "#a742c9"],
        clickConfetti: true,
        banner: function (d) {
          if (d.getDate() === 28) return {
            title: "Hoy es el Día Internacional del Orgullo LGBT+",
            text: "Aquí todo el mundo es bienvenido, tal cual es.", confetti: true
          };
          return {
            title: "Junio es el mes del Orgullo",
            text: "Copy's Place se llenó de color: aquí todo el mundo es bienvenido.", confetti: true
          };
        }
      },
      newyear: {
        chip: "Año nuevo", chipIcon: "s-sparkle", bannerIcon: "s-sparkle",
        colors: ["#ffd24a", "#ffe9a3", "#ffffff", "#9ec1ff", "#c9a7ff"],
        banner: function (d) {
          return {
            title: "¡Feliz " + d.getFullYear() + "!",
            text: "Gracias por acompañarme. Que este año venga cargado de cosas buenas (y de gatitos).",
            confetti: true
          };
        }
      },
      catday: {
        chip: "Día del Gato", chipIcon: "s-crown", bannerIcon: "s-crown",
        colors: ["#ffa24c", "#ffd27a", "#4fd1c5", "#ffffff"],
        clickConfetti: true,
        banner: function () {
          return {
            title: "¡Hoy es el Día Internacional del Gato!",
            text: "Hoy los gatos mandan en Copy's Place. Acaricia a la mascota que pasea por la página.",
            confetti: true
          };
        }
      }
    }
  });

  /* ---------- Resolución (no hace falta tocar esto) ---------- */
  var root = document.documentElement;
  var now = new Date();
  C.now = now;
  C.daysTo = function (month, day) {          // días enteros hasta el próximo "mes/día"
    var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    var target = new Date(now.getFullYear(), month - 1, day);
    return Math.round((target - today) / 864e5);
  };

  /* Cuenta regresiva del momento (o null):
       octubre → mi cumpleaños (29) · diciembre → Navidad y luego Año Nuevo · junio → aniversario de la página (23 de junio de 2025) */
  C.counter = function () {
    var m = now.getMonth() + 1, d = now.getDate(), n, y = now.getFullYear();
    if (m === 10 && d <= 29) { n = C.daysTo(10, 29); return { n: n, label: "Días para mi cumple", today: "Es mi cumple", text: n === 0 ? "¡Hoy es mi cumple!" : n === 1 ? "¡Mañana es mi cumple!" : "Faltan " + n + " días para mi cumple" }; }
    if (m === 12 && d <= 25) { n = C.daysTo(12, 25); return { n: n, label: "Días para Navidad", today: "Es Navidad", text: n === 0 ? "¡Feliz Navidad!" : n === 1 ? "¡Mañana es Navidad!" : "Faltan " + n + " días para Navidad" }; }
    if (m === 12 && d > 25) { n = C.daysTo(12, 31) + 1; return { n: n, label: "Días para Año Nuevo", today: "Año Nuevo", text: n === 1 ? "¡Mañana es Año Nuevo!" : "Faltan " + n + " días para Año Nuevo" }; }
    if (m === 6 && d <= 23) { n = C.daysTo(6, 23); var yrs = y - 2025; return { n: n, label: "Días para el aniversario", today: "Cumple " + yrs + (yrs === 1 ? " año" : " años") + " la página", text: n === 0 ? "¡Hoy la página cumple " + yrs + (yrs === 1 ? " año!" : " años!") : n === 1 ? "¡Mañana es el aniversario de la página!" : "Faltan " + n + " días para el aniversario de la página" }; }
    return null;
  };

  function pad(n) { return (n < 10 ? "0" : "") + n; }
  var md = pad(now.getMonth() + 1) + "-" + pad(now.getDate());

  var id = null, preview = false;
  var q = location.search.match(/[?&]season=([a-z]+)/);
  if (q) {
    preview = true;
    id = C.copy[q[1]] ? q[1] : null;
  } else {
    for (var i = 0; i < C.seasons.length; i++) {
      var r = C.seasons[i];
      if (r.year && r.year !== now.getFullYear()) continue;
      var hit = r.from <= r.to ? (md >= r.from && md <= r.to) : (md >= r.from || md <= r.to);
      if (hit) { id = r.id; break; }
    }
  }

  var off = false;
  try { off = localStorage.getItem("cp-season-off") === "1"; } catch (e) {}

  C.active = id;
  C.preview = preview;
  if (id) {
    root.setAttribute("data-season-auto", id);                  // la que corresponde por fecha
    if (!off || preview) root.setAttribute("data-season", id);  // la que se está mostrando
  }
})();
