# 🐱 Copy's Place

Sitio personal (HTML + CSS + JS, sin dependencias ni paso de compilación) alojado en **Cloudflare Pages**, con unas pocas funciones de servidor (buzón y caricias de la mascota).
Tiene dos versiones del mismo sitio: **moderna** (Material Design) y **clásica** (pixel art naranja/violeta de 2025, cuando la página nació en Neocities), ambas con modo claro y oscuro.

## Estructura

```
public/                  ← lo que se publica
  index.html             ← cascarón de la página (no suele tocarse)
  404.html · links.html · admin.html
  _headers · _redirects  ← seguridad, caché y enlaces cortos de Cloudflare
  manifest.webmanifest · sw.js · robots.txt
  data/calendar.js       ← fechas y textos de las temporadas (se carga en el <head>)
  data/content.js        ← ★ AQUÍ EDITAS TODO: secciones, textos, novedades, redes, libros, avances...
  css/                   ← theme (colores), style (componentes), classic (pixel art), seasons, palettes (paletas Material), pet, hero (inicio y gato), dock
  js/                    ← core, cat, hero, dock, carousel, sections, library, boot, guestbook, skin, seasons, pet, extras
  assets/                ← fuentes, iconos, fondos pixel art; tú creas books/, gallery/, avances/
functions/               ← Pages Functions (servidor): api/guestbook, api/pet, api/admin/guestbook
schema.sql               ← tablas de la base de datos D1
wrangler.toml            ← configuración de Cloudflare
.github/workflows/ci.yml ← revisa los scripts en cada push
CHANGELOG.md             ← historial de cambios
```

## Añadir cosas

Todo en `public/data/content.js`:

| Quiero… | Qué hago |
|---|---|
| Una novedad | Añado un objeto arriba del mes actual en `updates` (o creo el mes) |
| Un avance suelto | Añado un objeto arriba en `feed` |
| Un proyecto | Añado un objeto en `projects` |
| Un libro en PDF | Subo el PDF a `public/assets/books/` y añado un objeto en `books` con `file` |
| Una imagen | La subo a `public/assets/gallery/` y añado `{ src, alt, caption }` en `gallery` |
| **Una sección nueva** | Añado un bloque en `sections` (ver el comentario al inicio de `content.js`). El menú se actualiza solo |

Tipos de sección: `updates`, `feed`, `projects`, `books`, `gallery`, `about`, `mailbox`, `cards`.
¿Necesitas algo distinto? Crea un tipo con `CP.registerType("mi-tipo", function (sec, body) { ... })` en un script nuevo.

## Versión clásica (easter egg)

Se descubre con el código Konami (↑ ↑ ↓ ↓ ← → ← → B A), con 5 toques rápidos al gato grande del inicio, o añadiendo `?classic` a la dirección. Al descubrirla aparece un switch en el pie de página (se recuerda en el navegador).
Si prefieres que el switch se vea siempre, pon `classic: { secret: false }` en `content.js`.

## Temporadas (solo versión moderna)

| Temporada | Cuándo |
|---|---|
| 🎂 Cumpleaños | 29 de octubre (tiene prioridad) |
| 🎃 Halloween | todo octubre |
| 🕯 Recuerdo | 30 de agosto (día tranquilo: paleta apagada, luciérnagas, sin confeti; la mascota duerme) |
| 🎄 Navidad | noviembre y diciembre |
| 💘 San Valentín | todo febrero |
| 🏳️‍🌈 Orgullo | todo junio |
| ✨ Año Nuevo | del 1 al 7 de enero |
| 👑 Día del Gato | 8 de agosto |

- Se decide por la **fecha local del visitante**, antes de pintar la página (`public/data/calendar.js`).
- Cada una cambia la paleta, pone un gorrito al gato y añade efectos (murciélagos, nieve y lucecitas, globos y confeti) y un aviso.
- La versión clásica nunca se disfraza.
- Quien visita puede apagarla con el interruptor del pie de página (se recuerda en su navegador).
- Para probar: `?season=` con `halloween`, `birthday`, `xmas`, `valentine`, `pride`, `newyear`, `catday` o `none`.
- Para añadir otra: regla en `seasons` y textos en `copy` de `public/data/calendar.js`, paleta en `public/css/seasons.css` y efectos en `public/js/seasons.js`.
- Para cambiar fechas o textos, edita `public/data/calendar.js`.

## Mascota

Un gatito pasea por el borde inferior: se sienta, camina, mira al cursor y se duerme. Clic o toque = caricia; arrastrarlo = cogerlo (al soltarlo cae y rebota). Se guarda el número de caricias en el navegador. Se apaga con el interruptor "Mascota" del pie de página. Desde otro script puedes usar `CP.pet.say("Hola")`.

## Publicar en Cloudflare Pages

1. En el panel de Cloudflare: **Workers & Pages → Create → Pages → Connect to Git** y elige este repositorio.
2. Configuración de compilación: **sin comando de compilación** y **directorio de salida: `public`**.
3. Cada push a `main` se publica solo, y cada rama o pull request genera una vista previa con su propia dirección.
4. Dominio propio (opcional): **Custom domains** dentro del proyecto. Con dominio propio conviene añadir `og:url`/`canonical` en `index.html` y un `sitemap.xml`.

Para probarlo en local sin las funciones: `cd public && python3 -m http.server` y abre `http://localhost:8000` (el buzón funciona en modo local). Con las funciones y la base de datos: `npx wrangler pages dev public`.

## Buzón real y caricias globales (funciones + D1)

Una sola vez:

```
npx wrangler d1 create copys-place                                  # copia el database_id en wrangler.toml
npx wrangler d1 execute copys-place --remote --file=schema.sql      # crea las tablas
```

Luego, en el proyecto de Pages: **Settings → Bindings → D1** → variable `DB` apuntando a la base `copys-place` (producción y vista previa). En **Settings → Variables and Secrets** crea:

| Nombre | Para qué | Obligatorio |
|---|---|---|
| `ADMIN_TOKEN` | contraseña del panel `/admin` | sí, para moderar |
| `TURNSTILE_SECRET` | clave secreta de Cloudflare Turnstile (anti-spam) | no |
| `HASH_SALT` | texto cualquiera para anonimizar las IP | no |
| `AUTO_APPROVE` = `1` | publicar los mensajes sin revisarlos | no |

- **Moderar:** entra a `/admin`, escribe tu `ADMIN_TOKEN` y aprueba, oculta o borra. Los mensajes nuevos quedan pendientes hasta que los apruebes.
- **Turnstile:** crea un widget en Cloudflare (Turnstile), pon la clave pública en `guestbook.turnstileSiteKey` de `content.js` y la secreta en `TURNSTILE_SECRET`.
- **Privacidad:** no se guarda la IP, solo una huella anónima para limitar el spam (un mensaje cada 30 s por persona).
- **Si algo falla** (sin base de datos, en local…), el buzón vuelve solo al modo local y la mascota simplemente no cuenta las caricias globales.

## Enlaces cortos, redes e instalación

- `public/_redirects`: `/discord`, `/github`, `/youtube`, `/tiktok`, `/instagram`, `/facebook`, `/x`, `/steam` y `/redes`.
- `/links`: página con todas las redes (sale de `social` en `content.js`, así que se actualiza sola).
- La página se puede **instalar** como app (manifest + service worker) y abre sin conexión con lo último que viste. Para desactivar el service worker al probar, añade `?nosw`.
- Analítica sin cookies: activa **Web Analytics** en Cloudflare y, si quieres, pon el token en `analyticsToken` de `content.js`.

## Seguridad y caché

`public/_headers` define una política de seguridad de contenido (CSP), `nosniff`, `Referrer-Policy`, etc. Si algún día añades un servicio externo (por ejemplo, otro script o iframe), tendrás que permitirlo ahí. El código se revalida siempre y las fuentes se guardan un año.

## Lector de PDF

En escritorio se abre dentro de la página. En móvil el PDF incrustado funciona mal, así que se abre en una pestaña nueva.
