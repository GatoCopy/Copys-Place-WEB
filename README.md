# 🐱 Manual de Copy's Place

Guía rápida para actualizar tu sitio sin tener que tocar HTML ni CSS.
Casi todo el contenido vive en archivos `.json` dentro de la carpeta `data/` —
edita el texto, guarda, sube el archivo a Neocities y listo.

> ⚠️ **Regla de oro con los JSON:** son muy sensibles a la sintaxis.
> - Todo texto va entre comillas dobles `" "` (no comillas simples).
> - Cada elemento de una lista lleva una coma `,` al final, **excepto el último**.
> - Si algo deja de funcionar después de editar un JSON, casi siempre es una coma de más, de menos, o una comilla que falta.
> - Puedes pegar el contenido en [jsonlint.com](https://jsonlint.com/) para revisar que esté bien escrito antes de subirlo.

---

## 📁 ¿Dónde está cada cosa?

```
copys-place/
├── index.html              → Página de inicio
├── proyectos.html           galeria.html           acerca.html
├── actualizaciones.html     colaboraciones.html     contacto.html
├── recursos.html            timeline.html
│
├── data/                   ← 🌟 AQUÍ EDITAS CASI TODO
│   ├── bio.json             (tu info personal + redes sociales)
│   ├── site-intro.json      (la intro que aparece en el inicio)
│   ├── updates.json         (novedades / actualizaciones)
│   ├── projects.json        (lista de proyectos)
│   ├── project-*.json       (detalle de cada proyecto)
│   ├── galeria.json         (imágenes de la galería)
│   └── menu.json            (enlaces del menú ☰)
│
├── assets/
│   ├── fondo.gif            (fondo del sitio)
│   └── gallery/             ← sube aquí las imágenes de la galería
│
├── css/                    (estilos — no hace falta tocarlos)
├── js/                     (funcionalidad — no hace falta tocarla)
└── partials/                (header/footer/menú compartidos — no tocar)
```

---

## 📰 Publicar una novedad / actualización

Edita **`data/updates.json`**. La entrada que pongas primero en el mes más reciente
es la que aparece destacada en el inicio.

```json
{
  "agosto-2026": [
    {
      "id": 6,
      "title": "🎉 Nueva actualización",
      "description": "Aquí describes qué cambió o qué hiciste.",
      "category": "Sitio"
    }
  ],
  "julio-2026": [
    ...
  ]
}
```

**Para agregar una nueva:**
1. Si el mes actual ya existe (ej. `"agosto-2026"`), agrega tu entrada **al principio** de esa lista (así queda como la más reciente).
2. Si es un mes nuevo, crea un bloque nuevo arriba de todo, con el nombre en minúsculas y sin tildes: `"septiembre-2026"`.
3. `id` solo tiene que ser un número que no repitas.
4. `category` es libre (Sitio, Proyectos, Desarrollo, etc.), es solo una etiqueta visual.

---

## 📁 Agregar un proyecto nuevo

Dos pasos:

**1.** Crea un archivo nuevo `data/project-nombre.json` (copia uno existente como plantilla, ej. `project-kat.json`):

```json
{
  "id": "nombre",
  "title": "🎨 Nombre del Proyecto",
  "description": "Descripción corta.",
  "longDescription": "Descripción más larga para el detalle.",
  "tags": ["Tag1", "Tag2"],
  "images": [],
  "status": "Activo",
  "lastUpdated": "Agosto 2026",
  "links": {
    "github": "https://..."
  }
}
```

**2.** Agrégalo a la lista en `data/projects.json`:

```json
{
  "id": "nombre",
  "name": "Nombre del Proyecto",
  "icon": "🎨",
  "shortDescription": "Descripción corta.",
  "dataFile": "data/project-nombre.json"
}
```

El `id` y el `dataFile` deben coincidir con el archivo que creaste en el paso 1.

---

## 📸 Subir imágenes a la galería

**1.** Sube el archivo de imagen a la carpeta `assets/gallery/` en Neocities
(usa el botón de subir archivos de tu panel de Neocities, dentro de esa carpeta).

**2.** Agrega una entrada en `data/galeria.json`:

```json
{
  "images": [
    {
      "src": "assets/gallery/mi-dibujo.png",
      "caption": "Un dibujito que hice"
    }
  ]
}
```

- `src` es la ruta al archivo que subiste (respeta mayúsculas/minúsculas exactas).
- `caption` es opcional — si no quieres texto debajo de la imagen, pon `""`.
- Cada imagen nueva es un bloque `{ ... }` más en la lista, separado por coma.

---

## 🐾 Editar "Acerca de Mí"

Edita **`data/bio.json`**:
- `name`, `alias`: tu nombre/alias.
- `longBio`: tu biografía larga. El primer párrafo va antes de un salto de línea (`\n`), el segundo después.
- `skills`: lista de habilidades, aparecen como tarjetitas.
- `socialMedia`: tus redes — también alimenta el ☰ menú y el footer de todas las páginas.

---

## 🏠 Editar la introducción del inicio

Edita **`data/site-intro.json`** — es el texto sobre "qué es Copy's Place" que aparece
debajo del título en la página principal:

```json
{
  "title": "¿Qué es Copy's Place?",
  "text": "Tu texto aquí."
}
```

---

## 🧭 Editar el menú ☰

Edita **`data/menu.json`** para agregar, quitar o reordenar los enlaces del menú.
Cada elemento necesita apuntar a un archivo `.html` real que exista en el sitio:

```json
{ "label": "Nombre en el menú", "url": "archivo.html", "icon": "🐱" }
```

---

## 🎨 Cambiar colores del tema

En **`css/theme.css`** están todas las variables de color, tanto para modo claro (`:root`)
como para modo oscuro (`body.dark-mode`). Por ejemplo, para hacer el rosa más intenso:

```css
--hot-pink: #ff1493;   /* cambia este valor por el tono que quieras */
```

No hace falta tocar nada más — todo el sitio usa estas variables, así que un cambio aquí
se aplica en todas las páginas automáticamente.

---

## 🚀 Cómo subir los cambios a Neocities

1. Entra a tu panel de Neocities → **"Edit code"** o el gestor de archivos.
2. Ubica el archivo que editaste (por ejemplo `data/updates.json`).
3. Ábrelo, pega el contenido nuevo, guarda.
4. Si es un archivo *nuevo* (como una imagen o un `project-nuevo.json`), asegúrate de subirlo
   **dentro de la carpeta correcta** (`data/`, `assets/gallery/`, etc.) para que las rutas coincidan.
5. Refresca tu sitio en el navegador (a veces con `Ctrl + Shift + R` para forzar que cargue todo de nuevo).

---

## 🆘 Algo se rompió, ¿ahora qué?

- **Una sección no carga / aparece vacía:** abre la consola del navegador (`F12` → pestaña "Console")
  y busca errores en rojo. Casi siempre dicen qué archivo JSON está mal.
- **Edité un JSON y todo desapareció:** revisa comas y comillas con [jsonlint.com](https://jsonlint.com/).
- **Subí una imagen y no aparece:** revisa que la ruta en `src` sea exactamente igual
  (mayúsculas, espacios, extensión `.png`/`.jpg`/`.gif`) a donde la subiste.
- **El menú ☰ no muestra la página nueva:** falta agregarla a `data/menu.json`.

¡Eso es todo! El sistema está pensado para que casi nunca tengas que tocar HTML, CSS o JS —
solo los archivos dentro de `data/` y tus imágenes en `assets/`. 🐱✨
