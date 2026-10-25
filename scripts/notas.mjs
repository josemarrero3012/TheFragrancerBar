/* ==========================================================================
   npm run notas              descarga la foto de las notas que no la tienen
   npm run notas -- --todas   vuelve a descargarlas todas
   npm run notas -- rosa vetiver   solo esas

   Para cada nota de src/data/notas.js toma la foto principal de su artículo de
   la Wikipedia en inglés (`wiki`), o el archivo de Wikimedia Commons fijado en
   `file`. Solo acepta fotos con licencia libre. La recorta en cuadrado y guarda
   public/img/notas/<clave>-160.webp y -320.webp. Al final rehace
   src/data/notas-fotos.js con el autor y la licencia de cada foto (salen en
   /legal/#creditos) y escribe en scripts/notas-informe.txt cuáles faltan.

   Revisa siempre el resultado: la foto principal de un artículo puede ser un
   mapa, un dibujo o la planta entera en vez del ingrediente. Si pasa, fija un
   archivo concreto de Commons en `file` y vuelve a lanzarlo con esa nota.
   ========================================================================== */

import { readdirSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import sharp from 'sharp';
import { NOTAS } from '../src/data/notas.js';
import { NOTAS_FOTOS } from '../src/data/notas-fotos.js';

const ROOT = resolve(import.meta.dirname, '..');
const OUT = resolve(ROOT, 'public/img/notas');
// Wikimedia pide un User-Agent que identifique al cliente
const UA = { 'User-Agent': 'TheFragranceBarPrototype/1.0 (https://aternastudio.com; descarga puntual de fotos de notas)' };
const SIZES = [160, 320];

const args = process.argv.slice(2);
const todas = args.includes('--todas');
const solo = args.filter((a) => !a.startsWith('--'));
mkdirSync(OUT, { recursive: true });
const conFoto = new Set(readdirSync(OUT).filter((f) => f.endsWith('-320.webp')).map((f) => f.slice(0, -9)));

const api = async (host, params) => {
  const url = `https://${host}/w/api.php?${new URLSearchParams({ format: 'json', formatversion: 2, origin: '*', ...params })}`;
  const res = await fetch(url, { headers: UA });
  if (!res.ok) throw new Error(`${res.status} en ${url}`);
  return res.json();
};
const sinHtml = (s = '') => s.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

/** Nombre del archivo de Commons: el fijado en `file` o la foto principal libre del artículo */
async function archivo(n) {
  if (n.file) return n.file.replace(/^File:/, '');
  const d = await api('en.wikipedia.org', { action: 'query', prop: 'pageimages', piprop: 'name', pilicense: 'free', redirects: 1, titles: n.wiki });
  const page = d.query.pages[0];
  if (!page || page.missing) throw new Error(`no existe el artículo «${n.wiki}»`);
  if (!page.pageimage) throw new Error(`«${n.wiki}» no tiene foto principal libre`);
  return page.pageimage;
}

/** Miniatura, autor y licencia del archivo en Commons */
async function info(file) {
  const d = await api('commons.wikimedia.org', { action: 'query', prop: 'imageinfo', titles: `File:${file}`, iiprop: 'url|extmetadata|mime', iiurlwidth: 640 });
  const ii = d.query.pages[0].imageinfo?.[0];
  if (!ii) throw new Error(`no está en Commons: ${file}`);
  if (!/^image\/(jpeg|png|webp)$/.test(ii.mime)) throw new Error(`no es una foto (${ii.mime}): ${file}`);
  const m = ii.extmetadata || {};
  const licencia = sinHtml(m.LicenseShortName?.value);
  if (!licencia || /fair use|non-free/i.test(licencia)) throw new Error(`licencia no libre (${licencia || 'desconocida'}): ${file}`);
  return {
    thumb: ii.thumburl || ii.url,
    datos: {
      titulo: file.replace(/\.[a-z]+$/i, '').replace(/_/g, ' '),
      url: ii.descriptionurl,
      autor: sinHtml(m.Artist?.value) || 'autor desconocido',
      licencia,
      licenciaUrl: m.LicenseUrl?.value || ii.descriptionurl,
      cambios: true // se recorta en cuadrado
    }
  };
}

const fotos = { ...NOTAS_FOTOS };
const fallos = [];
const pendientes = Object.entries(NOTAS).filter(([k]) => (solo.length ? solo.includes(k) : todas || !conFoto.has(k)));
console.log(`${pendientes.length} notas por descargar`);

for (const [k, n] of pendientes) {
  try {
    const file = await archivo(n);
    const { thumb, datos } = await info(file);
    const res = await fetch(thumb, { headers: UA });
    if (!res.ok) throw new Error(`${res.status} al bajar ${thumb}`);
    const buf = Buffer.from(await res.arrayBuffer());
    for (const s of SIZES) {
      await sharp(buf).rotate().resize(s, s, { fit: 'cover', position: n.recorte || sharp.strategy.attention }).webp({ quality: 82 }).toFile(resolve(OUT, `${k}-${s}.webp`));
    }
    fotos[k] = datos;
    console.log(`✓ ${k}  ${file}`);
  } catch (e) {
    fallos.push([k, e.message]);
    console.log(`✗ ${k}  ${e.message}`);
  }
  await new Promise((r) => setTimeout(r, 300)); // sin prisas con la API de Wikimedia
}

// Solo quedan las notas que siguen en el diccionario y tienen su foto en disco
const enDisco = new Set(readdirSync(OUT).filter((f) => f.endsWith('-320.webp')).map((f) => f.slice(0, -9)));
const final = Object.fromEntries(Object.keys(NOTAS).filter((k) => fotos[k] && enDisco.has(k)).map((k) => [k, fotos[k]]));
writeFileSync(resolve(ROOT, 'src/data/notas-fotos.js'), `/* Lo rehace \`npm run notas\`: notas con foto descargada en public/img/notas/,
   con el archivo de Wikimedia Commons, su autor y su licencia. */
export const NOTAS_FOTOS = ${JSON.stringify(final, null, 2)};
`);
writeFileSync(resolve(import.meta.dirname, 'notas-informe.txt'),
  `Notas con foto: ${Object.keys(final).length} de ${Object.keys(NOTAS).length}\n\nSin foto:\n${
    Object.keys(NOTAS).filter((k) => !final[k]).map((k) => `${k}  ${(fallos.find(([f]) => f === k) || [])[1] || ''}`).join('\n') || '(ninguna)'}\n`);
console.log(`\n${Object.keys(final).length} de ${Object.keys(NOTAS).length} notas con foto. Informe en scripts/notas-informe.txt`);
