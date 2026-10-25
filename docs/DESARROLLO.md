# The Fragrance Bar · notas de desarrollo

Web de **The Fragrance Bar**, perfumería nicho con tienda en la Calle Mayor de Triana (Las Palmas de Gran Canaria) y dos tiendas en Tenerife.
Sitio estático de varias páginas, con catálogo y tienda online de demostración, construido con HTML, CSS y JavaScript sin frameworks, y [Vite](https://vite.dev) como servidor de desarrollo y empaquetador.

## Puesta en marcha

Requisitos: Node.js 20.19 o superior.

```bash
npm install       # instala Vite y las fuentes
npm run dev       # servidor de desarrollo en http://localhost:8765
npm run build     # genera la web lista para publicar en dist/
npm run preview   # sirve dist/ para revisarla antes de publicar
```

## Páginas

Cada sección es una página con su propia URL. Todas se generan desde los datos al compilar (unas 110):

| Ruta | Página |
|---|---|
| `/` | Portada: tienda de Triana, selección, casa destacada, la barra, tiendas |
| `/casas/` · `/casas/<casa>/` | Las 8 casas y una página por casa con todas sus fragancias |
| `/comprar/` | Catálogo con buscador, filtros por casa y familia, y orden (los filtros van en la URL: `?casa=xerjoff&familia=ambar`) |
| `/fragancias/<id>/` | Ficha de cada fragancia: tamaños, precio, notas de salida, corazón y fondo, relacionadas |
| `/cesta/` | Cesta y pedido (recogida en tienda o envío) |
| `/la-barra/` · `/historia/` | El concepto de la barra y la historia de la marca |
| `/tiendas/` · `/tiendas/<tienda>/` | Triana, Plaza del Duque y Américas Plaza, con horario, mapa y datos estructurados |
| `/contacto/` | Formulario, «Tu lista» y preguntas frecuentes |
| `/legal/` · `404.html` | Información legal y página no encontrada |

Al pasar de una página a otra hay una transición suave (View Transitions) en los navegadores que la admiten; en el resto la página carga sin más.

## Estructura

```
├── vite.config.js          Genera las páginas (en desarrollo y al compilar), robots.txt y sitemap.xml
├── public/                 Archivos que se copian tal cual a dist/
│   ├── img/casas/          Imágenes editoriales de cada casa (560 y 1000 px)
│   ├── img/productos/      Frascos con foto (400 y 800 px)
│   └── img/tienda/         Fotos de la tienda
└── src/
    ├── main.js             Punto de entrada común a todas las páginas
    ├── data/
    │   ├── site.js         ★ Negocio: tiendas, horarios, festivos, contacto, envíos, FAQ, menú
    │   ├── catalogo.js     ★ Casas, familias y fragancias (con precios de demostración)
    │   └── schema.js       Datos estructurados schema.org
    ├── templates/          Marcado de las páginas (se ejecuta al compilar, no en el navegador)
    │   ├── layout.js       <head>, cabecera, menú, pie, barra de contacto y cesta lateral
    │   ├── pages.js        Una función por página y la lista de rutas
    │   └── ui.js           Piezas compartidas: ficha de producto, galería de la ficha, migas de pan…
    ├── js/                 Comportamiento en el navegador, un módulo por funcionalidad
    │   ├── header.js       Cabecera y menú móvil
    │   ├── clock.js        «Abierto ahora / Cerrado», con festivos
    │   ├── cart.js         Cesta, cesta lateral, ficha de producto y pedido
    │   ├── shop.js         Buscador, filtros y orden del catálogo
    │   ├── lista.js        «Tu lista» (favoritos que se envían por WhatsApp o con el formulario)
    │   ├── galeria.js      Miniaturas de la ficha de producto
    │   ├── contacto.js     Mapas bajo demanda, formulario y boletín
    │   └── motion.js       Animaciones (respetan «reducir movimiento»)
    └── styles/             base/, components/, layout/, sections/ y pages/ (main.css los importa en orden)
```

No hay archivos `.html` en el proyecto: las páginas salen de `src/templates` y Vite las sirve o las escribe en `dist/`.

## Diseño

- El producto manda: una foto por fragancia, mismo encuadre y mismo fondo en todas las rejillas.
- La tienda se enseña con fotos reales (`public/img/tienda/`), nunca dibujada con CSS: nada de texturas de azulejo, madera o cadenas, ni planos de mapa.
- Paleta corta (`src/styles/base/tokens.css`): papel, tinta y un acento cobre para detalles pequeños.
- Una tienda sin foto (de momento las de Tenerife) se muestra con su isla y ciudad en tipografía sobre el fondo de piedra, hasta que haya foto: basta con añadir `img` (y `imgAlt`) en `SITE.stores`.

## Editar el contenido

- **Fragancias**: `FRAGANCIAS` en `src/data/catalogo.js`. Añadir una crea su página, la añade al catálogo, a su casa y al sitemap. Solo se publican las que tienen foto: `img/productos/<id>-400.webp` y `-800.webp` (4:5, frasco recortado sobre fondo transparente, con la base siempre a la misma altura; las genera `npm run fotos`). Todas las rejillas usan esa foto sobre el mismo fondo, para que el catálogo se vea homogéneo aunque tenga cientos de referencias. Las fotos originales de la casa (`npm run originales`) solo se ven en la ficha, como fotos adicionales. Las fotos propias de la tienda entran con `npm run fotos -- --carpeta <carpeta>` ([FOTOS.md](FOTOS.md)). `featured: true` la pone en la portada (se ven las 8 primeras).
- **Casas**: `CASAS` en `src/data/catalogo.js`. Cada casa necesita `img/casas/<img>-560.webp` y `-1000.webp` (4:5).
- **Tiendas, horarios y festivos**: `SITE.stores` y `SITE.calendar` en `src/data/site.js` (índice 0 = domingo, `null` = cerrado).
- **Envíos y preguntas frecuentes**: `SITE.shipping` y `SITE.faq`.
- **Precios de demostración**: con `SITE.demoPrices = true` se avisa en el catálogo, las fichas y la cesta de que los precios son inventados, y no se publican en los datos estructurados. Con los precios reales, ponerlo en `false`.
- **Avisos de prototipo**: `SITE.prototype = false` oculta «Prototipo: el mensaje no se envía», «Capítulo en desarrollo», el aviso de las reseñas y el de las respuestas de ejemplo.
- **Animaciones**: `MOTION.mode = 'sutil'` deja solo fundidos; `MOTION.marquee = true` activa la franja de casas en movimiento.

## SEO

`SITE.url` es la dirección pública. Al compilar se usa para la URL canónica, Open Graph, `robots.txt`, `sitemap.xml` (con `lastmod`) y los datos estructurados:
una `Organization` con un `Store` por tienda (`parentOrganization`, `hasMap`, `brand`, horario), `Product` y `BreadcrumbList` en cada ficha, `CollectionPage` en cada casa y `FAQPage` en contacto.
Todo el contenido (casas, fragancias, notas) está en el HTML que entrega el servidor, sin depender de JavaScript.

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

Todo lo marcado `PROVISIONAL` en `src/data/site.js` y los datos entre corchetes de la página legal (`legal()` en `src/templates/pages.js`):

- [ ] Número exacto de la Calle Mayor de Triana, coordenadas y enlace a la ficha de Google Maps de cada tienda
- [ ] Horarios definitivos (los de Tenerife son los del centro comercial) y festivos de cada año
- [ ] Teléfono propio de Triana y número de WhatsApp
- [ ] Precios reales, tamaños, gastos de envío y condiciones de venta; después, `SITE.demoPrices = false`
- [ ] Conectar la pasarela de pago y los pedidos (ver `initCheckout()` en `src/js/cart.js`)
- [ ] Conectar el formulario de contacto y el boletín a un servicio real (ver `src/js/contacto.js`)
- [ ] Reseñas de Google Business Profile, enlace a Facebook si lo hay
- [ ] Fotos de producto del resto del catálogo y permiso para usar las imágenes oficiales de las marcas, o fotos propias (guía y estado en [FOTOS.md](FOTOS.md))
- [ ] Fotos de las tiendas de Tenerife (`npm run foto-tienda`, ver [FOTOS.md](FOTOS.md))
- [ ] Confirmar las respuestas de las preguntas frecuentes (muestras, tarjeta regalo, envíos)
- [ ] Dominio definitivo (`SITE.url`)
- [ ] Datos del titular para el aviso legal y revisión profesional de los textos legales
- [ ] Fotos de archivo y fechas para «Nuestra historia»
- [ ] Poner `SITE.prototype = false`
