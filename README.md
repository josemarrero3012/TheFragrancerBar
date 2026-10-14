# The Fragrance Bar · Triana

Web de **The Fragrance Bar Triana**, perfumería nicho en la Calle Mayor de Triana (Las Palmas de Gran Canaria).
Sitio estático de una página con información legal y página 404, construido con HTML, CSS y JavaScript sin frameworks, y [Vite](https://vite.dev) como servidor de desarrollo y empaquetador.

## Puesta en marcha

Requisitos: Node.js 20.19 o superior.

```bash
npm install       # instala Vite y las fuentes
npm run dev       # servidor de desarrollo en http://localhost:8765
npm run build     # genera la web lista para publicar en dist/
npm run preview   # sirve dist/ para revisarla antes de publicar
```

## Estructura

```
├── index.html              Portada (todas las secciones)
├── legal.html              Aviso legal, privacidad y cookies
├── 404.html                Página no encontrada
├── vite.config.js          Configuración de Vite y datos generados al compilar
├── public/                 Archivos que se copian tal cual a dist/
│   ├── img/
│   │   ├── casas/          Imágenes editoriales de cada casa (560 y 1000 px)
│   │   ├── productos/      Frascos de la selección (400 y 800 px)
│   │   └── tienda/         Fotos de la tienda
│   ├── favicon.svg, apple-touch-icon.png, icon-*.png, site.webmanifest
│   └── og-tienda.jpg       Imagen al compartir en redes (1200 × 630)
└── src/
    ├── main.js             Punto de entrada de la portada
    ├── legal.js            Punto de entrada de las páginas interiores
    ├── data/
    │   ├── site.js         ★ Contenido editable: casas, selección, horario, contacto
    │   └── schema.js       Datos estructurados schema.org (se generan al compilar)
    ├── js/                 Un módulo por funcionalidad
    │   ├── utils.js        Utilidades compartidas
    │   ├── render.js       Vuelca los datos de site.js en el HTML
    │   ├── header.js       Cabecera y menú móvil
    │   ├── clock.js        «Abierto ahora / Cerrado»
    │   ├── casas.js        Pestañas de las casas
    │   ├── seleccion.js    Rejilla, filtros y «Tu lista»
    │   ├── contacto.js     Mapa, formulario y boletín
    │   └── motion.js       Animaciones (respetan «reducir movimiento»)
    └── styles/
        ├── main.css        Importa el resto en orden
        ├── base/           Tokens de diseño, base y movimiento
        ├── components/     Botones, logo, formularios
        ├── layout/         Cabecera y pie
        ├── sections/       Un archivo por sección de la portada
        └── pages/          Páginas interiores
```

## Editar el contenido

Casi todo el contenido se cambia en **`src/data/site.js`**, sin tocar el HTML:

- **Contacto, dirección y horario**: `SITE.contact` y `SITE.hours` (índice 0 = domingo, `null` = cerrado). El estado «Abierto ahora» y el horario de la ficha y del pie se calculan solos.
- **Casas**: `SITE.casas`. Cada casa necesita `img/casas/<img>-560.webp` y `<img>-1000.webp` (proporción 4:5).
- **Selección**: `SITE.seleccion`. Cada fragancia necesita `img/productos/<img>-400.webp` y `<img>-800.webp` (4:5, fondo `#ECE6DC`).
- **Avisos de prototipo**: `SITE.prototype = false` oculta las notas «Prototipo: el mensaje no se envía», «Capítulo en desarrollo» y el aviso de borrador de la página legal.
- **Animaciones**: `MOTION.mode = 'sutil'` deja solo fundidos; `MOTION.marquee = true` activa la franja de casas en movimiento.

Los textos fijos de cada sección (titulares, la historia, la casa del mes) están en `index.html`.

## SEO

`SITE.url` es la dirección pública de la web. Al compilar se usa para la URL canónica, las etiquetas Open Graph, los datos estructurados de la tienda (`Store` de schema.org), `robots.txt` y `sitemap.xml`.

## Publicar

**Vista previa en línea:** https://josemarrero3012.github.io/TheFragrancerBar/

Cada push a `main` compila y publica la web en GitHub Pages con `.github/workflows/deploy.yml`.
Para activarlo (una sola vez): en el repositorio, **Settings → Pages → Build and deployment → Source: GitHub Actions**.
El workflow ajusta solo la subcarpeta (`--base`) y la URL pública (`SITE_URL`), así que canonical, Open Graph y sitemap apuntan a la vista previa.

`npm run build` genera `dist/`, que también se puede subir a cualquier otro alojamiento estático (Netlify, Vercel, Cloudflare Pages, un hosting tradicional…).
Para compilar a mano en una subcarpeta y con otra URL pública:

```bash
SITE_URL=https://usuario.github.io/TheFragrancerBar npm run build -- --base=/TheFragrancerBar/
```

## Pendiente antes de publicar

Todo lo marcado `PROVISIONAL` en `src/data/site.js` y los datos entre corchetes de `legal.html`:

- [ ] Número exacto de la Calle Mayor de Triana y coordenadas
- [ ] Horario definitivo de Triana
- [ ] Teléfono propio de Triana, si lo tendrá
- [ ] Enlaces a Instagram, Facebook y WhatsApp
- [ ] Dominio definitivo (`SITE.url`)
- [ ] Datos del titular para el aviso legal y revisión profesional de los textos legales
- [ ] Conectar el formulario de contacto y el boletín a un servicio real (ver `src/js/contacto.js`)
- [ ] Fotos de archivo y fechas para «Nuestra historia»
- [ ] Poner `SITE.prototype = false`
