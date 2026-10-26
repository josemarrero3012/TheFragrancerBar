/* ==========================================================================
   npm run foto-tienda -- <foto.jpg> <nombre>
   p. ej.: npm run foto-tienda -- ~/Descargas/duque.jpg plaza-del-duque-fachada

   Prepara una foto de una tienda para la web: la gira según el EXIF (fotos de móvil),
   la recorta a 4:3 desde el centro y guarda public/img/tienda/<nombre>-800.webp
   y -1448.webp, las dos medidas que usan las tarjetas y la página de la tienda.
   Después, en src/data/site.js, ponle a la tienda img: 'img/tienda/<nombre>' e imgAlt.
   Cómo hacer las fotos: docs/FOTOS.md
   ========================================================================== */

import { resolve } from 'node:path';
import sharp from 'sharp';

const [foto, nombre] = process.argv.slice(2);
if (!foto || !/^[a-z0-9-]+$/.test(nombre || '')) {
  console.error('Uso: npm run foto-tienda -- <foto.jpg> <nombre-en-minúsculas-con-guiones>');
  process.exit(1);
}

const OUT = resolve(import.meta.dirname, '../public/img/tienda');
const girada = await sharp(resolve(process.cwd(), foto)).rotate().toBuffer();
const { width } = await sharp(girada).metadata();
if (width < 1448) console.warn(`Aviso: la foto mide ${width} px de ancho; para que se vea nítida conviene que tenga al menos 1448.`);
for (const w of [800, 1448]) {
  await sharp(girada).resize(w, Math.round(w * 3 / 4), { fit: 'cover', position: 'centre' })
    .webp({ quality: 82 }).toFile(resolve(OUT, `${nombre}-${w}.webp`));
}
console.log(`Hecho: public/img/tienda/${nombre}-800.webp y -1448.webp\nEn src/data/site.js: img: 'img/tienda/${nombre}', imgAlt: 'Qué se ve en la foto'`);
