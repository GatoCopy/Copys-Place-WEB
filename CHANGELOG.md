# Historial de cambios — Copy's Place

## v3.4.1 — 24 de octubre de 2026 · Caricias bien contadas
- El contador global de caricias ya no pierde las caricias rápidas: se juntan y se mandan en lote (máximo 25 por envío) y la tarjeta «Hoy» se actualiza al instante. Antes solo contaba una cada 4 segundos.
- La tarjeta «Hoy» ya no parpadea entre tu cifra y la del mundo (muestra «…» hasta tener el total).

## v3.4 — 16 de octubre de 2026 · Lanzamiento público de la V3
- **Título «Copy's Place V3»** (pestaña, PWA, vista previa) y una insignia V3 en el panel.
- **Panel lateral:** buscador fijo arriba; pestañas *Más* (juego, instalar, compartir, ajustes y redes al final), *Para ti* (sigue donde lo dejaste —historial local—, últimas novedades, recién actualizado, atajos) y *Tú*. Se quitó la encuesta «Tú decides» y el enlace RSS.
- **Novedades:** en la portada solo las 5 últimas; el resto, en la subpágina `/novedades` (con buscador).
- **Ruta:** versiones en islas V3 (actual), V2 y V1.
- **Proyectos:** «El Príncipe de Berlín» (en edición y corrección, pronto a publicar; también en Libros) y «Copy's Place V3» (pronto en GitHub).
- **Cat Runner** idéntico al dino de Chrome: sin botones; salta tocando o con Espacio/↑ y se agacha con ↓.
- **Cuentas regresivas solo en su época:** octubre → mi cumpleaños; diciembre → Navidad y luego Año Nuevo; junio → aniversario de la página (23 de junio de 2025). El resto del año no aparece ninguna.
- **Temporadas nuevas** (`data/calendar.js`): *Lanzamiento* (16–18 oct de 2026, con fuegos artificiales), *Aniversario* (23 de junio), *Día del Perro* (26 de agosto: el gato del inicio y la mascota pasan a ser golden retrievers, `js/dog.js`) y *San Valentín* con el gato y el perro juntos.
- **Dock** sin el botón «Inicio» (queda el botón de subir). **Explora** en móvil: dos columnas, más compacto. **Versión clásica:** animaciones al doble de velocidad.
- Caché de la PWA `cp-v7`. Se quitó `functions/api/poll.js`.

## v3.3 — 15 de octubre de 2026 · Panel lateral, Cat Runner, Ruta y mejor navegación
- **Panel lateral con 4 pestañas** (`js/panel.js`, `css/panel.css`): *Ajustes* (decoración de temporada, mascota, reducir animaciones, tamaño del texto, paleta, versión clásica/moderna), *Explorar* (buscador de todo el sitio, secciones, atajos de teclado), *Tú* (logros, tus cifras, instalar la app, compartir) y *Más* (juego, estado actual). El botón de tema claro/oscuro sigue arriba. Los interruptores salieron del pie de página.
- **Cat Runner** (`js/game.js`, `css/game.css`): el «dino» sin conexión con el gato. Salta con Espacio/↑/toque, agáchate con ↓ o el botón. Moderna: dibujo suave con la paleta activa; clásica: pixel art real. Récord guardado y logros. Tecla **G**, desde el panel y también en la página **404**.
- **Sección «Ruta»** (`js/ruta.js`, `css/ruta.css`): ahora/después/hecho con barras, versiones y la encuesta «Tú decides» (`functions/api/poll.js`, tabla `poll_votes` en `schema.sql`; un voto por persona). Datos en `S.ruta`.
- **Navegación** (`js/nav.js`): la URL y el título de la pestaña siguen a la sección actual; el botón «atrás» cierra el panel; deslizar desde el borde izquierdo lo abre; botón «copiar enlace» en los títulos y en cada proyecto (`?p=id`); los saltos se reajustan si la página cambia de altura; avisos de conexión.
- **Compartir:** imagen `og.png` y `functions/_middleware.js` para que la URL sea absoluta.
- Caché de la PWA `cp-v6`. Para el encuesta y el middleware hace falta Pages conectado a Git (la subida directa no ejecuta Functions).

## v3.2 — 15 de octubre de 2026 · Dock, paletas y color por sección
- **Ajustes (misma versión):** el menú de arriba se queda siempre visible (logo y botón de tema) y, mientras el dock está puesto, muestra el nombre de la sección actual. El dock es una píldora centrada solo con atajos. La mascota pequeña camina por encima del dock y ya no se tapa. El gato grande dormido ahora cierra los ojos con una curva suave (también en pixel art) en vez de aplastarlos.
- **Dock de secciones** (`public/js/dock.js`, `public/css/dock.css`), en las dos versiones: al bajar del inicio aparece fijo en la ventana, resalta la sección actual (scroll-spy) y salta a la sección al tocar. En escritorio es una píldora flotante y el menú de arriba se queda igual (logo, enlaces y tema). En móvil el menú de arriba y el dock se **fusionan** en una barra inferior (logo · secciones · tema); se aparta cuando se abre el teclado. En la clásica es una barra de tareas pixel art.
- **Paletas Material de la versión moderna** (`public/css/palettes.css`): Naranja, Violeta, Menta, Rosa y Cielo, cada una en claro y oscuro con sus tonos de superficie. Se eligen en la tarjeta «Hoy» (se guarda en `cp-mpal`). «Automática» deja la paleta de la temporada. El gato mantiene sus colores.
- **Color por sección:** cada sección usa un tono de la paleta (primario, terciario o secundario): chip, subrayado, mancha de fondo, tarjetas y botones. Los proyectos alternan tonos. «Explora» y el dock usan el mismo reparto.
- La clásica no cambia de paleta de colores propia (sigue con la suya).
- Caché de la PWA `cp-v4`.

## v3.1 — 14 de octubre de 2026 · Un inicio nuevo y un gato más vivo
- **Sin secciones duplicadas:** la portada ya no repite las novedades ni los proyectos. Ahora tiene una tarjeta/panel «Hoy» (hora, cumpleaños, cifras con enlace) y una fila «Explora» con atajos a cada sección. Se quitaron de la clásica el ticker, las habilidades y el proyecto destacado (ya están en sus secciones).
- **Clásica coherente en toda la página:** cada sección es una ventana pixel art con barra de título (`novedades.exe`, `proyectos.exe`…), igual que la ventana del inicio.
- **Gato nuevo, con el diseño de tu imagen de referencia:** contorno oscuro, orejas altas, mechones en las mejillas, ojos grandes y brillantes, collar rojo con cascabel dorado, patas largas, pecho claro y cola esponjosa. Mantiene los colores naranjas de siempre. La versión clásica es el mismo gato en pixel art (se genera a partir de las mismas formas).
- **Inicio rediseñado** (`public/css/hero.css`, `public/js/hero.js`), en las dos versiones y también en móvil:
  - **Moderna:** texto a la izquierda, gato en el centro y una tarjeta de novedades a la derecha (se desliza sola, con flechas y con el dedo en el móvil), más una fila de proyectos de colores debajo. En pantallas pequeñas todo se apila y la fila de proyectos se desliza de lado.
  - **Clásica:** una ventana pixel art («copys-place.exe») con tres columnas: presentación, paleta de colores y un «reproductor» de habilidades a la izquierda; el gato en su pantalla en medio (con botón para verlo en grande); y reloj con cuenta atrás al cumpleaños, proyecto destacado y estadísticas a la derecha. Debajo, un ticker de novedades y la fila de proyectos.
  - Paleta de la versión clásica: naranja, violeta, menta, rosa y cielo (se recuerda la elegida).
- **Gato nuevo:** ahora está sentado y es el mismo en las dos versiones: estilizado en la moderna (conserva los gorros de todas las temporadas) y en pixel art en la clásica. Sustituye al gato dentro de la caja.
- **Más reacciones del gato** (`js/cat.js`): los ojos siguen al cursor y las pupilas se dilatan si te acercas, la cabeza se inclina hacia ti, mueve las orejas solo, mueve la cola más rápido al pasar el cursor, se ríe y suelta corazoncitos al tocarlo, ronronea y vibra si lo mantienes pulsado, bosteza si te quedas quieto y se duerme después (se despierta al moverte), se sorprende al cambiar de tema claro/oscuro y se pone melancólico el 30 de agosto. Se maneja con teclado (Enter o Espacio). Cada toque suma al contador de caricias.
- **Rendimiento:** las animaciones de pseudoelementos también se pausan cuando no se ven, y la versión clásica anima menos huellas decorativas y sin capas extra.
- **Arreglo en móvil:** los puntos del carrusel de novedades ya no hacen que la página se desplace de lado.

## v3.0 — 13 de octubre de 2026 · Cloudflare Pages
- El sitio pasa a **Cloudflare Pages**: el sitio vive en `public/`, con `wrangler.toml` y revisión automática en GitHub (`.github/workflows/ci.yml`).
- **Buzón real** (`functions/api/guestbook.js` + base de datos D1): los mensajes llegan al servidor, se revisan en `/admin` y solo los aprobados se publican. Con anti-spam (campo trampa, límite por persona y Cloudflare Turnstile opcional). Si el servidor no está disponible, el buzón sigue funcionando en modo local.
- **Caricias de todo el mundo** (`functions/api/pet.js`): la mascota cuenta cuántas caricias lleva entre todos los visitantes.
- **Seguridad y velocidad** (`public/_headers`): política de seguridad de contenido, cabeceras modernas y caché afinada (fuentes un año, código siempre revalidado).
- **Enlaces cortos** (`public/_redirects`): `/discord`, `/github`, `/youtube`, `/tiktok`, `/instagram`, `/facebook`, `/x`, `/steam`; y una página `/links` con todas las redes.
- **App instalable** (`manifest.webmanifest`, `sw.js`, iconos): se puede instalar en el móvil o el escritorio y abre sin conexión.
- **Analítica opcional** de Cloudflare sin cookies (`analyticsToken` en `data/content.js`).
- **Redes actualizadas:** Discord (servidor «Copy's Place», perfil `_copygato`), GitHub, YouTube, TikTok, Instagram, Facebook, X y Steam. Se retiran Stoat y WhatsApp.
- **KAT Bot** pasa a Discord (el repositorio sigue siendo el mismo).
- **Rendimiento de la versión clásica:** las animaciones se pausan cuando no se ven, las secciones fuera de pantalla no se dibujan hasta acercarse, el gato dejó de consultar su posición cada 0,4 s y las decoraciones pesadas se simplifican.
- La versión clásica recuerda que la página nació en **Neocities** (nota en el pie de página, solo en la clásica).
- Easter egg: los 5 toques rápidos van en el gato grande del inicio (Konami y `?classic` siguen igual).
- Videojuego: el nombre clave es **«Copy's Treasure»**.
- Acerca de mí: especialidad en composición para instrumentos de cuerda (violín, viola, violonchelo y contrabajo).
- Nueva fecha conmemorativa: 30 de agosto (decoración tranquila; la mascota duerme).
- Novedades de octubre: nuevo hogar en Cloudflare Pages y servidor de Discord.

## v2.3 — 8 de octubre de 2026 · Más temporadas y mascota
- Temporadas nuevas (solo versión moderna, con paleta clara/oscura, accesorio para el gato, efectos y aviso propios):
  - 💘 San Valentín: todo febrero (corazones que suben, diadema de corazones).
  - 🏳️‍🌈 Orgullo: todo junio (franja de arcoíris, título arcoíris, confeti de colores; el 28 de junio, aviso especial).
  - ✨ Año Nuevo: del 1 al 7 de enero (fuegos artificiales, destellos, sombrero de copa).
  - 👑 Día del Gato: 8 de agosto (peces, huellitas, corona).
- Orden de prioridad: cumpleaños, Día del Gato, Año Nuevo, San Valentín, Orgullo, Halloween, Navidad.
- Mascota interactiva (`js/pet.js`, `css/pet.css`): un gatito que pasea por el borde inferior, mira al cursor, se duerme si estás quieto, se deja acariciar (corazones, maullidos y contador de caricias), se puede coger y soltar (cae y rebota) y lleva el accesorio de la temporada. Se dibuja en vector en la versión moderna y en pixel art en la clásica. Interruptor "Mascota" en el pie de página.
- Extras: cuenta regresiva al cumpleaños en el pie de página (`js/extras.js`) y un título de pestaña que te llama cuando te vas.
- Novedad de octubre sobre todo lo anterior.

## v2.2 — 7 de octubre de 2026 · Temporadas
- Nuevo: temporadas solo en la versión moderna, automáticas según la fecha del visitante.
  - 🎃 Halloween: todo octubre (murciélagos, arañas, telarañas, niebla, gorro de bruja).
  - 🎂 Cumpleaños: 29 de octubre (globos, confeti, gorrito de fiesta, aviso con enlace al buzón).
  - 🎄 Navidad: noviembre y diciembre (nieve, lucecitas, gorro de Santa).
- Cada temporada tiene paleta propia en modo claro y oscuro.
- Interruptor en el pie de página para apagar la decoración; `?season=` para probarlas.
- Nuevos archivos: `data/calendar.js`, `css/seasons.css`, `js/seasons.js`.
- Novedades: proyecto de videojuego personal («Copy's Treasure», nombre clave) con primera alpha próxima en la página y GitHub; nueva tarjeta en Proyectos.
- Documentación: README y este historial.

## v2.1 — 6 de octubre de 2026 · Secciones por datos y versión clásica
- Las secciones y el menú se generan desde `data/content.js`: añadir una sección no requiere tocar `index.html`.
- Nueva sección Libros, con lector de PDF integrado.
- Nueva sección Avances, en formato de línea de tiempo.
- Versión clásica (pixel art naranja/violeta de 2025) como easter egg: código Konami, 5 toques al gatito del logo (desde v2.4, al gato grande) o `?classic`. Compatible con modo claro/oscuro.
- Novedades de octubre 2026 en el sitio.

## v2.0 — 5 de octubre de 2026 · Rediseño moderno
- Rediseño completo inspirado en Material Design 3, conservando la estética de gatos.
- Slider de novedades, animaciones fluidas, modo claro/oscuro con transición circular, gato que sigue el cursor.
- Sin dependencias ni build; fuentes propias.

## Historial anterior
- Agosto 2026: rediseño modular con datos en JSON y modo noche.
- 2025: primera versión, pixel art naranja y violeta.
