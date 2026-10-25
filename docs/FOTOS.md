# Fotos de la web

La web solo enseña fotos reales: una foto de producto por fragancia, todas con el mismo encuadre y el mismo fondo, y fotos de las tiendas. No hay nada dibujado.

## Estado hoy

| | Fragancias |
|---|---|
| Con foto propia, hecha en la tienda | 0 |
| Con foto descargada de la web de la marca (provisional) | 122 |
| Sin foto, no se publican todavía | 19 |

Las 122 fotos descargadas valen para el prototipo, pero antes de publicar la web hace falta una de dos cosas por cada una: permiso por escrito de la marca o del distribuidor, o una foto propia. El estado al día lo da `scripts/fotos-informe.txt` cada vez que se ejecuta `npm run fotos`.

Faltan estas 19, porque no se encontró su foto en la web de la marca (y a casi todas les faltan también las notas oficiales para la ficha):

- **Creed:** Love in White, Spice and Wood, Wild Vetiver, Fleurissimo
- **Amouage:** Jubilation XXV
- **Initio:** Paragon
- **Montale:** Black Aoud, Amandes Orientales, Red Aoud, Roses Elixir
- **Memo Paris:** African Leather, Irish Leather, Inlé, French Leather, Italian Leather, Lalibela, Tiger's Nest, Russian Leather
- **Tom Ford:** Tobacco Oud

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

1. **La fachada o la entrada** con el rótulo, de frente. Es la que sale en la portada y en la tarjeta de la tienda.
2. **El interior completo**, desde la puerta.
3. **La barra**, con los frascos para probar.
4. **Un detalle**: una vitrina bien iluminada, el mostrador o las lámparas.

La web las recorta a 4:3 desde el centro, así que lo importante tiene que ir en el medio.

## Para quien mantiene la web

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
