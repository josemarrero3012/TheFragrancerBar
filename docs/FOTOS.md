# Fotos de la web

La web solo enseña fotos reales: las fotos originales de cada casa, tal cual las publica en su web, y fotos de las tiendas. No hay nada dibujado.

## Estado hoy

La web enseña un catálogo de muestra: las cinco fragancias más conocidas de cada casa, 40 en total (las marcadas en «publicar» en la hoja `catalogo/fragancias.csv`, ver [CATALOGO.md](CATALOGO.md)). Para publicar más basta con marcarlas en la hoja y conseguir sus fotos como se explica aquí.

| Catálogo de muestra | Fragancias |
|---|---|
| Con las fotos originales de la casa | 40 de 40 |
| …con foto al pasar el ratón | 35 (Montale solo publica una foto por fragancia) |
| …con la foto principal por debajo de 1200 px | 5 (Parfums de Marly no publica el frasco a más de 1080 px; se enseña sin ampliar) |
| Con foto propia, hecha en la tienda | 0 |

Las fotos de las marcas valen para el prototipo, pero antes de publicar la web hace falta una de dos cosas por cada una: permiso por escrito de la marca o del distribuidor, o una foto propia. El estado al día lo dan `scripts/originales-informe.txt` (`npm run originales`) y `scripts/fotos-informe.txt` (`npm run fotos`).

Tienda sin foto: **C. C. Plaza del Duque** y **C. C. Américas Plaza** (Tenerife). Mientras no la tengan, su tarjeta enseña la isla y la ciudad en letra.

## Para la tienda: cómo hacer las fotos de producto

Con un móvil y una mesa junto a una ventana basta.

1. **Fondo blanco y liso** detrás y debajo del frasco: una cartulina blanca doblada en curva, sin pliegues. Nada más en la foto (ni caja, ni flores, ni otros frascos).
2. **Luz suave**: de día, junto a una ventana sin sol directo, o con la luz del techo apagada para evitar brillos. Sin flash.
3. **El frasco de frente**, entero, con el tapón puesto y la etiqueta mirando a cámara. Sin precinto ni etiquetas de precio.
4. **El móvil a la altura del frasco**, no desde arriba, y algo alejado (con el zoom 2× si lo tiene) para que el frasco no se deforme.
5. **Que el frasco no toque los bordes**: deja aire alrededor. La web lo recorta y lo coloca sola.
6. Sin filtros ni retoques.

**Cómo mandarlas:** cada foto con el nombre de la fragancia tal como aparece al final de la dirección de su ficha en la web. Por ejemplo, la ficha de Aventus es `/fragancias/creed-aventus/`, así que su foto se llama `creed-aventus.jpg`. Todas en una carpeta, por WeTransfer o Google Drive, sin comprimir (no por WhatsApp, que les baja la calidad).

## Para la tienda: cómo hacer las fotos de las tiendas

Por cada tienda, en horizontal y de día, con la tienda recogida y sin clientes (o con su permiso):

1. **La fachada o la entrada** con el rótulo, de frente. Es la que sale en la página de la tienda y, la de Triana, en la portada, recortada en cuadrado desde el centro (el rótulo tiene que quedar entero en el medio).
2. **El interior completo**, desde la puerta.
3. **La barra**, con los frascos para probar.
4. **Un detalle**: una vitrina bien iluminada, el mostrador o las lámparas.

La web las recorta a 4:3 desde el centro, así que lo importante tiene que ir en el medio.

## Para quien mantiene la web

**Fotos originales de las casas:**

```bash
npm run originales              # todas las marcadas para publicar en la hoja
npm run originales -- amouage   # una casa, o una fragancia por su id
```

Por cada fragancia guarda en `public/img/originales/` la foto principal (`a`, la de las rejillas), la que sale al pasar el ratón (`b`) y, si se eligen más en `ELEGIDAS`, otras que solo se ven en la ficha (`c`, `d`…). Todas quedan cuadradas sin cortar el frasco: si la foto de la casa no es cuadrada y tiene fondo de estudio, se alarga ese fondo; si es una foto de ambiente, se recorta desde el centro. Revisa `scripts/originales-revision.jpg` y fija en `ELEGIDAS` las buenas si las dos primeras no lo son.

**Fotos de producto propias:**

```bash
npm run fotos -- --carpeta ~/Descargas/fotos-tienda
```

Cada archivo `<id>.jpg` (también `.png` o `.webp`) pasa por el mismo recorte que las fotos de las marcas: se gira según el móvil, se quita el fondo y se coloca el frasco centrado y apoyado en la misma línea, en `public/img/productos/<id>-400.webp` y `-800.webp`. Las que no tienen el fondo liso o tienen un nombre que no es de ninguna fragancia salen en `scripts/fotos-informe.txt` para repetirlas o renombrarlas.

Las fotos propias se apuntan en `scripts/fotos-propias.json`, y `npm run fotos` (también con `--todas` o con el nombre de una casa) no las vuelve a sustituir por la de la marca. Solo se sustituye una si se pide por su id: `npm run fotos -- creed-aventus`.

Si queda sombra o un halo, `scripts/recortar.py` (BiRefNet) las limpia; las instrucciones están en el propio archivo.

**Fotos de tienda:**

```bash
npm run foto-tienda -- ~/Descargas/duque-fachada.jpg plaza-del-duque-fachada
```

Deja `public/img/tienda/plaza-del-duque-fachada-800.webp` y `-1448.webp`. Después, en `SITE.stores` (`src/data/site.js`), se añade a la tienda `img: 'img/tienda/plaza-del-duque-fachada'` y un `imgAlt` que describa la foto. Con eso la tarjeta y la página de la tienda pasan a usarla; `cardImg` sirve para poner en la tarjeta otra foto distinta de la principal, como en Triana.

## Escaparate de la portada

Bajo el hero, la portada pasa varias campañas a pantalla completa (`SITE.escaparate` en `src/data/site.js`), con el nombre de la casa en grande. Cada una es una foto horizontal o una película de la casa. Van en `public/escaparate/`.

**Foto:** horizontal, de 2400 px de ancho como mínimo, en `<nombre>-1200.webp` y `<nombre>-2400.webp`.

**Película:** de 8 a 12 segundos sin sonido, que se vea bien en bucle. Se recorta y comprime con ffmpeg en dos tamaños, y su primer fotograma se guarda como foto (se ve mientras carga y con «reducir movimiento»):

```bash
ffmpeg -ss 8.5 -t 8 -i campaña.mp4 -an -vf "scale=1600:-2,fps=25" -c:v libx264 -pix_fmt yuv420p -crf 27 -preset slow -movflags +faststart public/escaparate/creed-1600.mp4
ffmpeg -ss 8.5 -t 8 -i campaña.mp4 -an -vf "scale=960:-2,fps=25" -c:v libx264 -pix_fmt yuv420p -crf 28 -preset slow -movflags +faststart public/escaparate/creed-960.mp4
ffmpeg -ss 8.5 -i campaña.mp4 -frames:v 1 primer-fotograma.png   # y de ahí creed-1200.webp y creed-1920.webp
```

Así cada película pesa entre 1 y 2 MB (unos 0,6 MB en móvil). Las películas y fotos de campaña son de las casas, y necesitan el mismo permiso que el resto de fotos de marca.

