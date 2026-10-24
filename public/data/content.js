/* ==========================================================
   Copy's Place — CONTENIDO
   Este es el ÚNICO archivo que necesitas editar para cambiar
   textos, secciones, novedades, proyectos, libros, avances y redes.

   Reglas rápidas (es JavaScript, igual de sensible que un JSON):
   - Los textos van entre comillas dobles " ".
   - Cada elemento de una lista lleva coma al final.
   - Los iconos son nombres de Material Symbols: smart_toy, menu_book, mic, code,
     palette, rocket_launch, inventory_2, pets, campaign, favorite, auto_stories ...
   ========================================================== */

window.SITE = {
  /* ---------- Identidad ---------- */
  name: "Copy's Place",
  fullName: "Alexander Jerrard",
  alias: "CopyCat",
  role: "Creador de contenido · Desarrollador · Escritor · Compositor de cuerdas",
  status: { text: "Puliendo el sitio y escribiendo un capítulo nuevo", icon: "code" },
  tagline: "Un rincón personal en internet, hecho a mano con mucho cariño (y algo de caos ordenado).",

  /* ==========================================================
     SECCIONES — el menú y la página se arman a partir de esta lista.
     El ORDEN de aquí es el orden en la página.
     Para añadir una sección nueva basta con añadir un bloque:

       { id: "mi-seccion", type: "cards", nav: "Mi sección", icon: "star",
         overline: "Etiqueta pequeña", title: "Título grande", lead: "Subtítulo opcional",
         band: true,                       // fondo con esquinas redondeadas (opcional)
         items: [ { title: "...", description: "...", icon: "pets", url: "..." } ] }

     Tipos disponibles:
       updates   → slider de novedades            (datos: updates)
       feed      → línea de tiempo de avances     (datos: feed)
       projects  → tarjetas con filtros y detalle (datos: projects)
       books     → libros con lector de PDF       (datos: books)
       gallery   → galería con visor              (datos: gallery)
       about     → bio, habilidades y redes       (datos: bio, skills, social)
       mailbox   → buzón de mensajes              (datos: guestbook)
       cards     → tarjetas genéricas             (datos: los "items" del propio bloque)
     Si quieres otra lista de datos para un tipo, añade  source: "otraLista".
     ========================================================== */
  /* ---------- Ruta ----------
     now / next: { t: texto, p: 0-100 }.  done: lista de textos.
     versions: una «isla» por versión del sitio (la primera es la actual). */
  ruta: {
    now:  [{ t: "Subir los PDF de los libros", p: 20 }, { t: "El Príncipe de Berlín: edición y corrección", p: 85 }],
    next: [{ t: "Primera alpha de Copy's Treasure", p: 10 }, { t: "Más dibujos en la galería", p: 10 }],
    done: ["Dock flotante y paletas Material", "Panel lateral con ajustes y logros", "Cat Runner", "Lanzamiento público de la V3"],
    versions: [
      { v: "V3", name: "Cloudflare · lanzamiento público", when: "2026", now: true, items: [
        ["v3.4", "Lanzamiento público: más temporadas y archivo de novedades"], ["v3.3", "Panel, juego, ruta y mejor navegación"], ["v3.2", "Dock, paletas y secciones con color"], ["v3.1", "Inicio rediseñado y gato más vivo"], ["v3.0", "Rediseño Material y mudanza a Cloudflare"] ] },
      { v: "V2", name: "La que actualicé antes de Cloudflare", when: "2025", items: [
        ["v2", "Página renovada, con más secciones y contenido"] ] },
      { v: "V1", name: "La clásica en pixel art", when: "2025", items: [
        ["v1", "Donde todo empezó, en Neocities (hoy es la versión clásica oculta)"] ] }
    ]
  },
  sections: [
    { id: "novedades", type: "updates", nav: "Novedades", icon: "campaign",
      overline: "Novedades", title: "Lo más reciente",
      lead: "Desliza, arrastra o usa las flechas para ver qué he estado haciendo." },

    { id: "avances", type: "feed", nav: "Avances", icon: "edit_note", band: true,
      overline: "Avances", title: "Cositas en proceso",
      lead: "Notas rápidas, bocetos y fragmentos de lo que voy haciendo, sin esperar a una actualización formal." },

    { id: "proyectos", type: "projects", nav: "Proyectos", icon: "apps",
      overline: "Proyectos", title: "Lo que estoy creando",
      lead: "Toca cualquier tarjeta para ver los detalles." },

    { id: "ruta", type: "ruta", nav: "Ruta", icon: "flag", band: true,
      overline: "Ruta", title: "Ahora mismo y lo que viene",
      lead: "En qué estoy, qué sigue y cómo ha ido creciendo el sitio." },

    { id: "libros", type: "books", nav: "Libros", icon: "auto_stories", band: true,
      overline: "Libros", title: "Para leer sin prisa",
      lead: "Mis historias en PDF: léelas aquí mismo o descárgalas." },

    { id: "galeria", type: "gallery", nav: "Galería", icon: "photo_library",
      overline: "Galería", title: "Dibujitos y cosas bonitas" },

    { id: "acerca", type: "about", nav: "Acerca", icon: "person", band: true,
      overline: "Acerca de mí", title: "Hola, soy CopyCat" },

    { id: "buzon", type: "mailbox", nav: "Buzón", icon: "forum",
      overline: "Buzón", title: "Déjame un mensaje",
      lead: "Un saludo, una idea o una pregunta: todo es bienvenido." }
  ],

  /* ---------- Acerca de mí ---------- */
  bio: [
    "¡Hola! Soy Alexander Jerrard, conocido en internet como CopyCat. Soy un creador de contenido multidisciplinario apasionado por la tecnología, la escritura y el desarrollo de comunidades.",
    "Por formación profesional me dedico al mundo de la educación, pero en mi tiempo libre me sumerjo en proyectos creativos: desarrollo de bots con IA, escritura de ficción con derechos propios y participación activa en comunidades creativas como la de fandubs.",
    "En la música mi especialidad es la composición para instrumentos de cuerda, no la música en general. Aunque sé un poco de todo, lo que mejor conozco es el violín, la viola, el violonchelo y el contrabajo.",
    "Creo que internet es un espacio para experimentar, conectar y compartir. Este sitio es mi rincón personal donde documento mis avances y proyecto mi creatividad de forma integral."
  ],
  skills: [
    "Desarrollo Python/IA",
    "Escritura creativa",
    "Diseño web",
    "Composición para cuerdas",
    "Violín · Viola · Chelo · Contrabajo",
    "Dirección de audio",
    "Community management",
    "Pixel art"
  ],

  /* ---------- Redes (aparecen en Acerca y en el pie de página) ---------- */
  social: [
    { name: "Discord",   url: "https://discord.gg/8v8NRPVcVD",              icon: "headset_mic", note: "Servidor «Copy's Place» · perfil: _copygato" },
    { name: "GitHub",    url: "https://github.com/GatoCopy",                 icon: "code" },
    { name: "YouTube",   url: "https://www.youtube.com/@gatocopy/",          icon: "smart_display" },
    { name: "TikTok",    url: "https://www.tiktok.com/@gatocopy/",           icon: "music_note" },
    { name: "Instagram", url: "https://www.instagram.com/alexander_jerrard/", icon: "photo_camera" },
    { name: "Facebook",  url: "https://www.facebook.com/GatoCopy/",          icon: "groups" },
    { name: "X",         url: "https://x.com/_copygato/",                    icon: "alternate_email" },
    { name: "Steam",     url: "https://steamcommunity.com/id/gatocopy/",     icon: "sports_esports" }
  ],


  /* ---------- Novedades (slider) ----------
     La clave es el mes ("octubre-2026"). Lo más nuevo va ARRIBA.
     Dentro de cada mes, también lo más nuevo primero. */
  updates: {
    "octubre-2026": [
      {
        title: "Lanzamiento público de Copy's Place V3",
        description: "La página estrena su versión 3 como lanzamiento oficial (16–18 de octubre). Panel lateral con búsqueda, historial y logros; el juego Cat Runner; la sección Ruta con las versiones V1, V2 y V3; más temporadas (aniversario, Día del Perro y un San Valentín con gato y perro) y un archivo de novedades.",
        category: "Sitio",
        icon: "rocket_launch"
      },
      {
        title: "Dock fijo, paletas y secciones con color",
        description: "Al bajar aparece un dock con atajos a cada sección: se queda en la ventana, te marca dónde estás y salta al tocarlo (en el móvil se fusiona con el menú de arriba). La versión moderna estrena paletas Material en claro y oscuro (Naranja, Violeta, Menta, Rosa y Cielo, además de la de cada temporada) y cada sección usa un tono de la paleta. La clásica tiene su dock como barra de tareas pixel art.",
        category: "Sitio",
        icon: "palette"
      },
      {
        title: "Un inicio nuevo y un gato más vivo",
        description: "La portada estrena distribución en las dos versiones: una tarjeta «Hoy» con hora, cumpleaños y cifras, y una fila «Explora» con atajos a cada sección, sin repetir lo que ya está más abajo. En la clásica, todas las secciones son ventanas pixel art. El gato ahora tiene un diseño nuevo, te mira, ronronea si lo acaricias y se duerme si te vas.",
        category: "Sitio",
        icon: "pets"
      },
      {
        title: "Nuevo hogar: Cloudflare Pages",
        description: "Copy's Place pasa a un alojamiento más profesional: más rápido, con buzón de mensajes de verdad, contador de caricias para la mascota y todo listo para crecer. La versión clásica guarda el recuerdo de sus inicios en Neocities.",
        category: "Sitio",
        icon: "rocket_launch"
      },
      {
        title: "Copy's Place también es un servidor de Discord",
        description: "El servidor, que se llama igual que la página, está en desarrollo. KAT Bot se muda a Discord para quedarse con nosotros; el repositorio sigue siendo el mismo. Ya puedes entrar desde el botón de Discord.",
        category: "Comunidad",
        icon: "forum"
      },

      {
        title: "Más temporadas y una mascota",
        description: "Ahora el sitio también se viste en febrero (San Valentín), junio (Orgullo), la primera semana de enero (Año Nuevo) y el 8 de agosto (Día del Gato). Además, un gatito pasea por la página: puedes acariciarlo, cogerlo en brazos o dejarlo dormir.",
        category: "Sitio",
        icon: "pets"
      },
      {
        title: "Nuevo proyecto: un videojuego personal",
        description: "Empecé a trabajar en un videojuego propio, por ahora con el nombre clave «Copy's Treasure». Pronto subiré una primera alpha aquí en la página y en GitHub.",
        category: "Proyectos",
        icon: "sports_esports"
      },
      {
        title: "El sitio celebra las temporadas",
        description: "Halloween durante todo octubre, una fiesta de cumpleaños el 29 de octubre y ambiente navideño en noviembre y diciembre. Cambia sola según la fecha y puedes apagarla desde el pie de página. Solo en la versión moderna.",
        category: "Sitio",
        icon: "celebration"
      },
      {
        title: "Rediseño moderno (Material Design)",
        description: "Estreno la versión moderna del sitio, inspirada en Material Design: slider de novedades, animaciones fluidas, modo claro y oscuro con transición circular y un gatito que sigue tu cursor.",
        category: "Sitio",
        icon: "palette"
      },
      {
        title: "Nuevas secciones: Libros y Avances",
        description: "Ahora puedes leer mis libros en PDF directamente en el sitio y seguir mis avances sin esperar a una actualización formal de cada proyecto.",
        category: "Sitio",
        icon: "auto_stories"
      },
      {
        title: "Un secreto del pasado",
        description: "En algún rincón se esconde la versión clásica de Copy's Place, la pixel art naranja y violeta de 2025. Nació en Neocities, y todavía guarda ese recuerdo. Pista: los gatos veteranos conocen el código Konami, y el gato grande del inicio nunca se cansa de que lo toquen.",
        category: "Sitio",
        icon: "stars"
      },
      {
        title: "Más fácil de actualizar",
        description: "Las secciones y el menú se arman desde un solo archivo: añadir una sección nueva ya no obliga a tocar el código del sitio.",
        category: "Desarrollo",
        icon: "inventory_2"
      }
    ],
    "agosto-2026": [
      {
        title: "Rediseño del sitio",
        description: "¡Nuevo diseño con modo noche, chat de comentarios mejorado y muchas más características! El sitio ahora se ve mucho mejor en móvil y es completamente modular.",
        category: "Sitio",
        icon: "palette"
      },
      {
        title: "Modularización completada",
        description: "El sitio ahora está completamente modularizado. Todos los datos en JSON, estilos separados y scripts independientes. Mucho más fácil de mantener.",
        category: "Desarrollo",
        icon: "inventory_2"
      }
    ],
    "julio-2026": [
      {
        title: "Actualización de KAT Bot",
        description: "Se agregaron nuevas funciones de moderación y mejoras de rendimiento. El bot ahora responde 30% más rápido.",
        category: "Proyectos",
        icon: "smart_toy"
      }
    ],
    "junio-2026": [
      {
        title: "Avance en la novela",
        description: "He completado los primeros 3 capítulos. La historia está tomando forma y estoy muy emocionado con el progreso.",
        category: "Proyectos",
        icon: "menu_book"
      },
      {
        title: "Nueva colaboración en fandubs",
        description: "Nos unimos a un nuevo proyecto de fandubs. ¡Mantente atento para más anuncios!",
        category: "Proyectos",
        icon: "mic"
      }
    ]
  },

  /* ---------- Avances (línea de tiempo) ----------
     Lo más nuevo va ARRIBA. Todo es opcional salvo "text".
       date:    "2026-10-05" (se muestra como "5 oct 2026") o cualquier texto
       title:   título corto
       text:    el avance en sí
       tag:     etiqueta (Escritura, Código, Arte, Audio ...)
       project: id de un proyecto (muestra un chip que abre su detalle)
       image:   "assets/avances/boceto.png"  (+ imageAlt)
       link:    { label: "Leer más", url: "..." }
     Ejemplo:
       { date: "2026-10-05", title: "Capítulo 4 en borrador", text: "Ya tengo la escena del puerto.",
         tag: "Escritura", project: "novela" },
  */
  feed: [],

  /* ---------- Proyectos ----------
     category: se usa para los filtros (se crean solos).
     progress: número 0–100 (opcional) para mostrar una barra.
     links: botones del detalle. Usa url "#buzon" para ir a una sección. */
  projects: [
    {
      id: "treasure",
      title: "Copy's Treasure",
      icon: "sports_esports",
      category: "Videojuegos",
      description: "Mi videojuego personal. Nombre clave provisional; pronto, una primera alpha.",
      longDescription: "Un proyecto de videojuego personal que acabo de empezar. Nombre clave de momento: «Copy's Treasure». La primera alpha se publicará pronto en esta página y en GitHub.",
      tags: ["Videojuego", "Alpha", "Personal"],
      status: "En desarrollo",
      lastUpdated: "Octubre 2026",
      links: [
        // Cuando exista el repositorio: { label: "Ver en GitHub", url: "https://github.com/...", icon: "code" },
        { label: "Escríbeme", url: "#buzon", icon: "forum" }
      ]
    },
    {
      id: "copys-place",
      title: "Copy's Place V3",
      icon: "pets",
      category: "Código",
      description: "Esta misma página: HTML, CSS y JavaScript a mano, en Cloudflare, con versión moderna y clásica.",
      longDescription: "El desarrollo de esta web: una versión moderna (Material Design, temporadas, paletas y mascota) y una clásica en pixel art que nació en Neocities. Es una app instalable (PWA), con juego incluido. El código se publicará pronto en GitHub.",
      tags: ["Web", "PWA", "Cloudflare", "Material Design", "Pixel art"],
      status: "Pronto en GitHub",
      lastUpdated: "Octubre 2026",
      links: [
        // Cuando exista el repositorio: { label: "Ver en GitHub", url: "https://github.com/GatoCopy/Copys-Place-WEB", icon: "code" },
        { label: "Cómo ha cambiado", url: "#ruta", icon: "schedule" }
      ]
    },
    {
      id: "kat",
      title: "KAT Bot",
      icon: "smart_toy",
      category: "Código",
      description: "Bot automatizado con IA para Discord. Un asistente inteligente para la comunidad de Copy's Place.",
      longDescription: "KAT es un proyecto personal que combina programación, inteligencia artificial y las APIs de Discord. Está pensado para mejorar la experiencia de la comunidad con moderación automática, análisis de mensajes, estadísticas y mucho más.",
      tags: ["IA", "Bot", "GitHub", "Python", "Discord"],
      status: "En desarrollo activo",
      lastUpdated: "Julio 2026",
      links: [
        // Pon aquí el enlace exacto del repositorio si es distinto:
        { label: "Ver en GitHub", url: "https://github.com/GatoCopy", icon: "code" },
        { label: "Servidor de Discord", url: "https://discord.gg/8v8NRPVcVD", icon: "headset_mic" }
      ]
    },
    {
      id: "novela",
      title: "El Príncipe de Berlín",
      icon: "menu_book",
      category: "Escritura",
      description: "Mi segunda novela, y la primera con derechos propios. Ya escrita: en edición y corrección, pronto a publicar.",
      longDescription: "Un proyecto literario que mezcla aventura, drama y reflexión personal. Ya está terminado de escribir y se encuentra en edición y corrección. Pronto lo podrás leer en la sección de Libros, en PDF.",
      tags: ["Escritura", "Novela", "Original", "Ficción"],
      status: "En edición y corrección · pronto a publicar",
      lastUpdated: "Octubre 2026",
      progress: 85,
      links: [
        { label: "Ir a Libros", url: "#libros", icon: "auto_stories" }
      ]
    },
    {
      id: "fandubs",
      title: "Comunidad de Fandubs",
      icon: "mic",
      category: "Audio",
      description: "Parte de una comunidad de fandubs con raíces furry y planes de expansión. Un hobby sin límites.",
      longDescription: "Colaboro con otros creadores en la producción de doblajes de fans. Empezó como un hobby dentro de la comunidad furry, pero tiene potencial para crecer mucho más. Trabajamos en dirección de audio, casting, postproducción y mucho más.",
      tags: ["Audio", "Comunidad", "Hobby", "Colaboración", "Doblaje"],
      status: "Activo",
      lastUpdated: "Junio 2026",
      links: [
        { label: "Escríbeme", url: "#buzon", icon: "forum" }
      ]
    }
  ],

  /* ---------- Libros (con lector de PDF) ----------
     1) Sube el PDF a assets/books/   (y, si quieres, la portada a assets/books/)
     2) Añade un bloque aquí.
       title, subtitle (autor/serie), description, status ("Disponible", "En escritura"...),
       year, tags, cover ("assets/books/portada.jpg", opcional: si falta se genera una),
       file ("assets/books/mi-libro.pdf"; si falta aparece "Próximamente"), pages (opcional)
     Ejemplo:
       { id: "mi-libro", title: "Mi libro", subtitle: "Novela", description: "De qué trata.",
         status: "Disponible", year: 2026, tags: ["Ficción"], file: "assets/books/mi-libro.pdf" },
  */
  books: [
    { id: "principe-de-berlin", title: "El Príncipe de Berlín", subtitle: "Novela", description: "Mi segunda novela, en edición y corrección. Pronto el PDF.",
      status: "Próximamente", year: 2026, tags: ["Ficción", "Novela"] }
  ],

  /* ---------- Galería ----------
     1) Sube la imagen a assets/gallery/
     2) Añade una línea aquí. "alt" describe la imagen (accesibilidad), "caption" es opcional.
     Ejemplo:
       { src: "assets/gallery/mi-dibujo.png", alt: "Un gato pixel art", caption: "Un dibujito que hice" },
  */
  gallery: [],

  /* ---------- Buzón de mensajes ----------
     api: el buzón real de Cloudflare (funciones + base de datos D1; ver README).
          Si no está disponible (por ejemplo probando en local), la página lo detecta sola.
     turnstileSiteKey: clave pública de Cloudflare Turnstile para frenar el spam (opcional).
     endpoint: alternativa sin Cloudflare: un servicio de formularios (p. ej. Formspree).
     Si no hay ninguna de las tres, los mensajes solo se guardan en el navegador de quien los escribe. */
  guestbook: {
    api: "/api/guestbook",          // buzón real con Cloudflare (ver README). "" para desactivarlo
    turnstileSiteKey: "",           // clave pública de Cloudflare Turnstile (anti-spam). Vacía = sin Turnstile
    endpoint: "",
    maxLength: 280
  },

  /* ---------- Analítica ----------
     Token de Cloudflare Web Analytics (opcional, sin cookies). Vacío = desactivada. */
  analyticsToken: "",

  /* ---------- Versión clásica (easter egg) ----------
     secret: true  → el switch aparece solo después de descubrirlo
                     (código Konami, 5 toques rápidos al gato grande del inicio, o añadiendo ?classic a la dirección).
     secret: false → el switch se ve siempre en el pie de página. */
  classic: {
    secret: true
  }
};
