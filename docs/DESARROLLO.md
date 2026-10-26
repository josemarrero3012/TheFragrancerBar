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

Cada sección es una página con su propia URL. Todas se generan desde los datos al compilar (unas 65 con la muestra del catálogo):

| Ruta | Página |
|---|---|
| `/` | Portada: escaparate de campañas que van pasando (películas y fotos de las casas y la tienda, `SITE.escaparate`), selección, la barra, tiendas |
| `/casas/` · `/casas/<casa>/` | Las 8 casas y una página por casa con todas sus fragancias |
| `/comprar/` | Catálogo con buscador, filtros por casa, familia y precio (con el número de resultados de cada opción), orden y «Ver más» de 24 en 24 (los filtros van en la URL: `?casa=xerjoff&familia=ambar&precio=150-250`) |
| `/fragancias/<id>/` | Ficha de cada fragancia: tamaños, precio, notas de salida, corazón y fondo, relacionadas |
| `/cesta/` | Cesta y pedido (recogida en tienda o envío) |
| `/la-barra/` · `/historia/` | El concepto de la barra y la historia de la marca |
| `/tiendas/` · `/tiendas/<tienda>/` | Triana, Plaza del Duque y Américas Plaza, con horario, mapa y datos estructurados |
| `/guias/` · `/guias/<guía>/` | Guías para quien busca antes de venir: qué es el nicho, perfumes para el calor, concentraciones, cómo elegir y regalos (`src/data/guias.js`) |
| `/contacto/` | Formulario, «Tu lista» y preguntas frecuentes |
| `/legal/` · `404.html` | Información legal y página no encontrada |

Al pasar de una página a otra hay una transición suave (View Transitions) en los navegadores que la admiten; en el resto la página carga sin más.

## Estructura

```
├── vite.config.js          Genera las páginas (en desarrollo y al compilar), robots.txt, sitemap.xml y virtual:tienda
├── catalogo/fragancias.csv ★ La hoja del catálogo: una fila por fragancia (ver docs/CATALOGO.md)
├── public/                 Archivos que se copian tal cual a dist/
│   ├── img/casas/          Imágenes editoriales de cada casa (560 y 1000 px)
│   ├── img/productos/      Frascos con foto (400 y 800 px)
│   └── img/tienda/         Fotos de la tienda
└── src/
    ├── main.js             Punto de entrada común a todas las páginas
    ├── data/
    │   ├── site.js         ★ Negocio: tiendas, horarios, festivos, contacto, envíos, FAQ, menú
    │   ├── casas.js        ★ Casas, familias olfativas y concentraciones
    │   ├── guias.js        ★ Textos de las guías
    │   ├── catalogo.js     Fragancias de la hoja con sus fotos y notas, y qué se publica
    │   ├── fragancias.js   La hoja catalogo/fragancias.csv pasada a datos (lo genera npm run catalogo)
    │   └── schema.js       Datos estructurados schema.org
    ├── templates/          Marcado de las páginas (se ejecuta al compilar, no en el navegador)
    │   ├── layout.js       <head>, cabecera, menú, pie, barra de contacto y cesta lateral
    │   ├── pages.js        Una función por página y la lista de rutas
    │   └── ui.js           Piezas compartidas: ficha de producto, galería de la ficha, migas de pan…
    ├── js/                 Comportamiento en el navegador, un módulo por funcionalidad
    │   ├── header.js       Cabecera y menú móvil
    │   ├── clock.js        «Abierto ahora / Cerrado», con festivos
    │   ├── cart.js         Cesta, cesta lateral, ficha de producto y pedido
    │   ├── shop.js         Buscador, filtros, orden y «Ver más» del catálogo
    │   ├── tienda.js       Lo que la cesta y «Tu lista» necesitan de las fragancias publicadas
    │   ├── lista.js        «Tu lista» (favoritos que se envían por WhatsApp o con el formulario)
    │   ├── galeria.js      Miniaturas de la ficha de producto
    │   ├── contacto.js     Mapas bajo demanda, formulario y boletín
    │   └── motion.js       Animaciones (respetan «reducir movimiento»)
    └── styles/             base/, components/, layout/, sections/ y pages/ (main.css los importa en orden)
```

No hay archivos `.html` en el proyecto: las páginas salen de `src/templates` y Vite las sirve o las escribe en `dist/`.

## Diseño

- El producto manda: en las rejillas, una foto cuadrada por fragancia, la original de su casa (y la segunda al pasar el ratón). Pocas fragancias y bien fotografiadas antes que muchas a medias.
- La tienda se enseña con fotos reales (`public/img/tienda/`), nunca dibujada con CSS: nada de texturas de azulejo, madera o cadenas, ni planos de mapa.
- Paleta corta (`src/styles/base/tokens.css`): papel, tinta y un acento cobre para detalles pequeños.
- Una tienda sin foto (de momento las de Tenerife) se muestra con su isla y ciudad en tipografía sobre el fondo de piedra, hasta que haya foto: basta con añadir `img` (y `imgAlt`) en `SITE.stores`.

## Editar el contenido

- **Fragancias**: en la hoja `catalogo/fragancias.csv`, una fila por fragancia, con sus precios y una columna «publicar» que dice cuáles salen en la web (ahora, cinco por casa). Guía para rellenarla y comprobarla: [CATALOGO.md](CATALOGO.md). `npm run catalogo` la pasa a `src/data/fragancias.js` (se ejecuta solo antes de `dev` y `build`). Marcar una crea su página y la añade al catálogo, a su casa y al sitemap. Solo se publican las que tienen foto original o propia, notas oficiales y descripción. La foto puede ser de dos tipos: las originales de la casa (`npm run originales`: `img/originales/<id>-a|b|c…-160|800|1600.webp`, cuadradas; la `a` se ve en las rejillas, la `b` al pasar el ratón y todas en la ficha) o una foto propia de la tienda, que se recorta como frasco (`npm run fotos -- --carpeta <carpeta>`: `img/productos/<id>-400.webp` y `-800.webp`, 4:5 sobre fondo transparente, con la base siempre a la misma altura; ver [FOTOS.md](FOTOS.md)). Los frascos recortados de las webs de las marcas no bastan para publicar. «destacada» la pone en la portada (se ven las 8 primeras).
- **Casas**: `CASAS` en `src/data/casas.js`. Cada casa necesita `img/casas/<img>-560.webp` y `-1000.webp` (4:5). Una casa sin fragancias publicadas no sale en el filtro de `/comprar/` y su página invita a probarlas en tienda.
- **Tiendas, horarios y festivos**: `SITE.stores` y `SITE.calendar` en `src/data/site.js` (índice 0 = domingo, `null` = cerrado).
- **Envíos y preguntas frecuentes**: `SITE.shipping` y `SITE.faq`.
- **Precios de demostración**: con `SITE.demoPrices = true` se avisa en el catálogo, las fichas y la cesta de que los precios son inventados, y no se publican en los datos estructurados. Con los precios reales, ponerlo en `false`.
- **Avisos de prototipo**: `SITE.prototype = false` oculta «Prototipo: el mensaje no se envía», «Capítulo en desarrollo», el aviso de las reseñas y el de las respuestas de ejemplo.
- **Animaciones**: `MOTION.mode = 'sutil'` deja solo fundidos; `MOTION.marquee = true` activa la franja de casas en movimiento.

## SEO

`SITE.url` es la dirección pública. Al compilar se usa para la URL canónica, Open Graph, `robots.txt`, `sitemap.xml` (con `lastmod`) y los datos estructurados:
una `Organization` con un `Store` por tienda (`parentOrganization`, `hasMap`, `brand`, horario, `areaServed`, su foto y, cuando exista, su ficha de Google en `sameAs`), `Product` y `BreadcrumbList` en cada ficha, `CollectionPage` en cada casa, `Article` en cada guía y `FAQPage` en contacto.
Todo el contenido (casas, fragancias, notas, guías) está en el HTML que entrega el servidor, sin depender de JavaScript.

**SEO local.** Lo que se busca es «perfumería nicho Las Palmas», «perfumería Costa Adeje» o «Creed Tenerife». Por eso:

- La portada, cada casa y cada tienda llevan la ciudad en el título y la descripción («Creed en Las Palmas y Tenerife»).
- `/tiendas/` agrupa las tiendas por isla, y cada tienda tiene un bloque «Perfumería nicho en <ciudad>» con las zonas de alrededor (`near` en `SITE.stores`) y enlaces a todas las casas.
- Cada casa y cada guía terminan con las tres tiendas («Prueba Creed en Las Palmas y Tenerife»).
- Nombre, dirección y teléfono salen de `SITE.stores` en todas partes: tienen que ser exactamente los de la ficha de Google Business Profile de cada tienda.

**Vista previa sin indexar.** Si `SITE_URL` es de `*.github.io`, todas las páginas llevan `<meta name="robots" content="noindex">` para que la vista previa no compita en Google con la web real del negocio. Con el dominio definitivo desaparece sola.

**Al publicar con el dominio definitivo:**

1. Poner el dominio en `SITE.url` y comprobar que el sitemap apunta a él.
2. Dar de alta la web en [Google Search Console](https://search.google.com/search-console) con la verificación por etiqueta HTML: el código va en `SITE.seo.googleVerification`. Después, enviar `sitemap.xml`.
3. En cada ficha de Google Business Profile: la web de la tienda (`/tiendas/<tienda>/`, no la portada), categoría «Perfumería», horario igual que en `SITE.stores` y fotos de la tienda. Copiar el enlace de la ficha en `gbp` de su tienda.
4. Pedir reseñas en tienda con el enlace de la ficha; el bloque «Opiniones en Google» de cada tienda ya enlaza a ella.

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
- [ ] Acceso a las fichas de Google Business Profile, su enlace en `gbp` de cada tienda y las reseñas; enlace a Facebook si lo hay
- [ ] Alta en Google Search Console (`SITE.seo.googleVerification`) y envío del sitemap
- [ ] El catálogo real con el negocio en `catalogo/fragancias.csv` (ahora se publica una muestra de cinco fragancias por casa) y permiso para usar las imágenes oficiales de las marcas, o fotos propias (guía y estado en [FOTOS.md](FOTOS.md))
- [ ] Fotos de las tiendas de Tenerife (`npm run foto-tienda`, ver [FOTOS.md](FOTOS.md))
- [ ] Confirmar las respuestas de las preguntas frecuentes (muestras, tarjeta regalo, envíos)
- [ ] Dominio definitivo (`SITE.url`)
- [ ] Datos del titular para el aviso legal y revisión profesional de los textos legales
- [ ] Fotos de archivo y fechas para «Nuestra historia»
- [ ] Poner `SITE.prototype = false`
