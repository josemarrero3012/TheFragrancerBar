# The Fragrance Bar

Prototipo de web que hice para Aterna Studio. Es para The Fragrance Bar, una perfumería nicho con tienda en la calle Mayor de Triana (Las Palmas de Gran Canaria) y dos más en Tenerife.

Se puede ver aquí: https://josemarrero3012.github.io/TheFragrancerBar/

Es un prototipo: los precios son de ejemplo, la tienda online no cobra y los formularios no se envían. La propia web lo avisa en cada sitio donde pasa.

## Qué tiene

- Una portada con la tienda de Triana, una selección de fragancias y las casas de perfumes.
- Una página para cada casa (Creed, Xerjoff, Amouage, Tom Ford, Parfums de Marly…) con todas sus fragancias.
- Un catálogo con buscador y filtros por casa y por familia olfativa.
- Una ficha para cada fragancia, con sus tamaños, el precio y sus notas oficiales (las que publica cada casa), cada una con su foto.
- Una cesta y un pedido de prueba, con recogida en tienda o envío.
- «Tu lista», para guardar favoritos y mandarlos por WhatsApp.
- Las tres tiendas con su horario y un aviso de si están abiertas o cerradas en ese momento, que tiene en cuenta los festivos.

## Cómo la hice

No usé ningún framework: es HTML, CSS y JavaScript, con Vite para el servidor de desarrollo y para generar la web final.

Separé el contenido del diseño. Las casas y las fragancias están en un archivo de datos (`src/data/catalogo.js`) y la información de las tiendas en otro (`src/data/site.js`). Al compilar, de ahí salen unas 110 páginas. Si añado una fragancia nueva, se crea su página y aparece en el catálogo, en su casa y en el sitemap sin tocar nada más.

Todo el contenido va en el HTML que llega al navegador, así que se puede leer aunque falle el JavaScript y los buscadores lo ven entero.

## Probarla en local

```bash
npm install
npm run dev
```

Se abre en http://localhost:8765.

Solo se publican las fragancias que tienen foto oficial. Para descargar las que faltan desde la web de cada casa:

```bash
npm run fotos
```

Quita el fondo, encaja el frasco como en el resto de fotos y deja en `scripts/fotos-informe.txt` de dónde salió cada una y cuáles no encontró. Las fuentes (tiendas Shopify, búsqueda de Montale y páginas concretas) están en `scripts/fotos-fuentes.js`.

Prueba con las fragancias más populares de Creed: sus fotos originales, tal cual las publica la casa (sin quitar el fondo). Se ven en la ficha de cada fragancia, detrás de la foto de producto; en las rejillas todas usan la foto recortada para que se vean iguales:

```bash
npm run originales
```

Deja las fotos en `public/img/originales/`, una hoja con todas las candidatas en `scripts/originales-revision.jpg` y el informe en `scripts/originales-informe.txt`. Si la foto elegida no es la buena, se fija en `ELEGIDAS` dentro de `scripts/originales.mjs`.

Las notas de cada fragancia están en `src/data/notas-oficiales.js`, copiadas de la web de su casa. Las fotos de las notas salen de Wikimedia Commons, con licencia libre:

```bash
npm run notas
```

Descarga la foto de cada nota de `src/data/notas.js` a `public/img/notas/`, apunta autor y licencia (salen en /legal/#creditos) y deja en `scripts/notas-informe.txt` las que no encontró.

La parte técnica (estructura de carpetas, cómo editar el contenido, SEO y publicación) está en [docs/DESARROLLO.md](docs/DESARROLLO.md).

## Lo que falta

Para que fuera la web real harían falta los datos definitivos de las tiendas (dirección exacta, teléfonos y horarios), los precios reales, una pasarela de pago y conectar los formularios a un servicio de verdad. La lista completa está al final de [docs/DESARROLLO.md](docs/DESARROLLO.md).
