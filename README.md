# The Fragrance Bar

Prototipo de web que hice para Aterna Studio. Es para The Fragrance Bar, una perfumería nicho con tienda en la calle Mayor de Triana (Las Palmas de Gran Canaria) y dos más en Tenerife.

Se puede ver aquí: https://josemarrero3012.github.io/TheFragrancerBar/

Es un prototipo: los precios son de ejemplo, la tienda online no cobra y los formularios no se envían. La propia web lo avisa en cada sitio donde pasa.

## Qué tiene

- Una portada con la tienda de Triana, una selección de fragancias y las casas de perfumes.
- Una página para cada casa (Creed, Xerjoff, Amouage, Tom Ford, Parfums de Marly…) con sus fragancias.
- Un catálogo con buscador, filtros por casa, familia olfativa y precio, y un botón «Ver más», preparado para cientos de fragancias. De momento enseña una muestra: las cinco fragancias más conocidas de cada casa, con las fotos originales de la marca.
- Una ficha para cada fragancia, con sus tamaños, el precio y sus notas oficiales (las que publica cada casa), cada una con su foto.
- Una cesta y un pedido de prueba, con recogida en tienda o envío.
- «Tu lista», para guardar favoritos y mandarlos por WhatsApp.
- Las tres tiendas con su horario y un aviso de si están abiertas o cerradas en ese momento, que tiene en cuenta los festivos.
- Cinco guías (qué es la perfumería nicho, perfumes para el calor de Canarias, concentraciones, cómo elegir y regalos) para atraer a quien busca en Google antes de venir.
- SEO local para las tres tiendas: la ciudad en los títulos de la portada, las casas y las tiendas, las tiendas agrupadas por isla, «dónde probarla» al pie de cada casa y datos estructurados de cada tienda. La vista previa de GitHub Pages no se indexa, para no competir con la web real del negocio.

## Cómo la hice

No usé ningún framework: es HTML, CSS y JavaScript, con Vite para el servidor de desarrollo y para generar la web final.

Separé el contenido del diseño. Las fragancias están en una hoja de cálculo (`catalogo/fragancias.csv`) que el negocio puede abrir y rellenar en Excel o Google Sheets, las casas en `src/data/casas.js` y la información de las tiendas en `src/data/site.js`. La hoja guarda 141 fragancias y una columna «publicar» dice cuáles salen en la web (ahora, cinco por casa). Si marco una más, se crea su página y aparece en el catálogo, en su casa y en el sitemap sin tocar nada más, siempre que tenga sus fotos originales y sus notas oficiales. Cómo rellenar la hoja: [docs/CATALOGO.md](docs/CATALOGO.md).

Todo el contenido va en el HTML que llega al navegador, así que se puede leer aunque falle el JavaScript y los buscadores lo ven entero.

## Probarla en local

```bash
npm install
npm run dev
```

Se abre en http://localhost:8765.

Solo se publican las fragancias que tienen foto. Cómo hacer fotos propias en la tienda y cómo meterlas en la web: [docs/FOTOS.md](docs/FOTOS.md). Las fotos originales de cada casa, tal cual las publica en su web y en la mayor resolución que ofrece, se descargan con:

```bash
npm run originales
```

Busca cada fragancia de la muestra en la web de su casa (Creed, las tiendas Shopify de las demás y Montale), guarda la principal, la que sale al pasar el ratón y, si se eligen, más fotos para la ficha, todas cuadradas, en `public/img/originales/`. Deja una hoja con todas las candidatas en `scripts/originales-revision.jpg` y el informe en `scripts/originales-informe.txt`, que avisa de las fotos de menos de 1200 px. Si la foto elegida no es la buena, se fija en `ELEGIDAS` dentro de `scripts/originales.mjs`.

Las que no tienen originales usan el frasco recortado sobre el fondo de la web:

```bash
npm run fotos
```

Quita el fondo, encaja el frasco como en el resto de fotos y deja en `scripts/fotos-informe.txt` de dónde salió cada una y cuáles no encontró. Las fuentes (tiendas Shopify, búsqueda de Montale y páginas concretas) están en `scripts/fotos-fuentes.js`, y lo que comparten los dos scripts para buscar en las webs de las casas, en `scripts/marcas.mjs`.

Las notas de cada fragancia están en `src/data/notas-oficiales.js`, copiadas de la web de su casa. Las fotos de las notas salen de Wikimedia Commons, con licencia libre:

```bash
npm run notas
```

Descarga la foto de cada nota de `src/data/notas.js` a `public/img/notas/`, apunta autor y licencia (salen en /legal/#creditos) y deja en `scripts/notas-informe.txt` las que no encontró.

La parte técnica (estructura de carpetas, cómo editar el contenido, SEO y publicación) está en [docs/DESARROLLO.md](docs/DESARROLLO.md).

## Lo que falta

Para que fuera la web real harían falta los datos definitivos de las tiendas (dirección exacta, teléfonos y horarios), los precios reales, una pasarela de pago y conectar los formularios a un servicio de verdad. La lista completa está al final de [docs/DESARROLLO.md](docs/DESARROLLO.md).
