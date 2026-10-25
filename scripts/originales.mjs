/* ==========================================================================
   npm run originales                       descarga las fotos originales de ORIGINALES
   npm run originales -- creed-aventus      solo esa (o varias)

   Prueba con las fragancias más populares de Creed: su foto tal cual sale en la web de
   la casa, sin recortar el fondo, y la segunda foto que Creed enseña al pasar el ratón.

   Para cada fragancia:
   1. Busca en el listado de Creed la ficha del perfume y en su página de producto todas
      las fotos (static.thcdn.com/productimg/original/…, la mayor resolución que publican).
   2. Guarda cada candidata sin tocar en fotos-originales/<id>/ (no se sube al repo).
   3. Elige la foto principal y la del ratón: por defecto las dos primeras de la ficha del
      listado, que es lo que enseña la web de Creed; ELEGIDAS las fija si sale otra cosa.
   4. Las pasa a WebP de alta calidad (q 92, sin recortar ni cambiar la proporción) en
      public/img/originales/<id>-a|b-160|800|1600.webp (160: miniatura de la ficha) y rehace src/data/originales.js.
   5. Hace una hoja de contacto con todas las candidatas numeradas en
      scripts/originales-revision.jpg y un informe en scripts/originales-informe.txt.
   Sube la hoja y el informe con las fotos para revisarlas.
   ========================================================================== */

import { mkdirSync, readdirSync, writeFileSync, existsSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';
import sharp from 'sharp';

const ROOT = resolve(import.meta.dirname, '..');
const OUT = resolve(ROOT, 'public/img/originales');
const CACHE = resolve(ROOT, 'fotos-originales');
const UA = { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36', 'Accept-Language': 'es-ES,es;q=0.9' };
const LISTADO = [1, 2, 3].map((n) => `https://www.creedfragrance.com/c/fragrances/?pageNumber=${n}`);

/* Las populares de Creed y su página de producto */
export const ORIGINALES = {
  'creed-aventus': 'https://www.creedfragrance.com/p/aventus/12870029/',
  'creed-absolu-aventus': 'https://www.creedfragrance.com/p/absolu-aventus/14926231/',
  'creed-aventus-for-her': 'https://www.creedfragrance.com/p/aventus-for-her/12870031/',
  'creed-green-irish-tweed': 'https://www.creedfragrance.com/p/green-irish-tweed/12870035/',
  'creed-silver-mountain-water': 'https://www.creedfragrance.com/p/silver-mountain-water/12870049/',
  'creed-millesime-imperial': 'https://www.creedfragrance.com/p/millesime-imperial/12870041/',
  'creed-viking': 'https://www.creedfragrance.com/p/viking/12870053/',
  'creed-royal-oud': 'https://www.creedfragrance.com/p/royal-oud/12870045/',
  'creed-original-santal': 'https://www.creedfragrance.com/p/original-santal/12870043/',
  'creed-himalaya': 'https://www.creedfragrance.com/p/himalaya/12870036/'
};

/* Tras revisar la hoja de contacto: [principal, ratón] con los números de la hoja (null: sin foto de ratón).
   La ficha del listado no trae la foto de ratón, así que se fija aquí: el frasco de 100 ml sobre fondo
   gris y la composición con sus ingredientes, como en la web de Creed. */
const ELEGIDAS = {
  'creed-aventus': [2, 7], // Aventus no tiene composición sobre gris: la de piña y bergamota
  'creed-absolu-aventus': [1, 2],
  'creed-aventus-for-her': [2, 6],
  'creed-green-irish-tweed': [1, 6],
  'creed-silver-mountain-water': [2, 6],
  'creed-millesime-imperial': [2, 6],
  'creed-viking': [2, 5],
  'creed-royal-oud': [2, 6],
  'creed-original-santal': [2, 6],
  'creed-himalaya': [1, 6]
};
/* Fotos con una línea de marco en el borde: píxeles que se quitan por cada lado antes de pasarlas a WebP */
const MARCO = { 'creed-original-santal-b': 8 };

const args = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const ids = Object.keys(ORIGINALES).filter((id) => !args.length || args.includes(id));

const get = async (url, as = 'text') => {
  const res = await fetch(url, { headers: UA, redirect: 'follow' });
  if (!res.ok) throw new Error(`${res.status} en ${url}`);
  return as === 'buffer' ? Buffer.from(await res.arrayBuffer()) : res.text();
};
// Las URLs pueden venir escapadas en JSON (/) o dentro de /images?url=https%3A%2F%2F…
const limpia = (html) => html.replace(/\\u002F/gi, '/').replace(/\\\//g, '/').replace(/%3A/gi, ':').replace(/%2F/gi, '/').replace(/&amp;/g, '&');
const FOTO = /https:\/\/static\.thcdn\.com\/productimg\/original\/\d+-\d+\.(?:jpe?g|png|webp)/gi;
const fotosEn = (texto) => [...new Set(texto.match(FOTO) || [])];
const ruta = (url) => new URL(url).pathname.replace(/\/?$/, '/');

/* Fotos de la ficha de cada producto en el listado. Si antes del primer enlace ya hay fotos, en cada
   ficha van delante del enlace (desde el producto anterior hasta él); si no, detrás (hasta el siguiente) */
async function fichasDelListado() {
  const fichas = new Map();
  for (const url of LISTADO) {
    let html;
    try { html = limpia(await get(url)); } catch (e) { console.log(`·  listado ${url}: ${e.message}`); continue; }
    const enlaces = [...html.matchAll(/(?:https:\/\/www\.creedfragrance\.com)?(\/p\/[a-z0-9-]+\/\d+\/?)/g)]
      .map((m) => ({ ruta: m[1].replace(/\/?$/, '/'), i: m.index, fin: m.index + m[0].length }));
    // Tramos seguidos del mismo producto: desde el final del anterior hasta el comienzo del siguiente
    const tramos = [];
    for (const e of enlaces) {
      const t = tramos.at(-1);
      if (t && t.ruta === e.ruta) t.fin = e.fin; else tramos.push({ ...e });
    }
    const delante = tramos.length && fotosEn(html.slice(0, tramos[0].i)).length > 0;
    tramos.forEach((t, k) => {
      const [desde, hasta] = delante ? [k ? tramos[k - 1].fin : 0, t.fin] : [t.i, tramos[k + 1]?.i ?? html.length];
      const fotos = fotosEn(html.slice(desde, hasta));
      if (fotos.length && !fichas.has(t.ruta)) fichas.set(t.ruta, fotos);
    });
  }
  return fichas;
}

/* Hoja de contacto: cada fragancia en una fila, con sus candidatas numeradas y la elegida marcada */
async function hojaDeContacto(filas) {
  const T = 220, PAD = 10, LABEL = 260, cols = Math.max(1, ...filas.map((f) => f.fotos.length));
  const W = LABEL + cols * (T + PAD) + PAD, H = filas.length * (T + 40) + PAD;
  const capas = [], textos = [];
  for (const [r, f] of filas.entries()) {
    const y = PAD + r * (T + 40);
    textos.push(`<text x="${PAD}" y="${y + 24}" font-size="18" font-family="sans-serif">${f.id}</text>`);
    for (const [c, foto] of f.fotos.entries()) {
      const x = LABEL + PAD + c * (T + PAD);
      capas.push({ input: await sharp(foto.file).resize(T, T, { fit: 'contain', background: '#fff' }).toBuffer(), left: x, top: y });
      const marca = c === f.a ? ' · PRINCIPAL' : c === f.b ? ' · RATÓN' : '';
      textos.push(`<text x="${x}" y="${y + T + 22}" font-size="15" font-family="sans-serif" font-weight="${marca ? 700 : 400}">${c + 1}${marca}  ${foto.w}×${foto.h}</text>`);
    }
  }
  const svg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">${textos.join('')}</svg>`);
  await sharp({ create: { width: W, height: H, channels: 3, background: '#ffffff' } })
    .composite([...capas, { input: svg, left: 0, top: 0 }]).jpeg({ quality: 80 }).toFile(resolve(ROOT, 'scripts/originales-revision.jpg'));
}

/* WebP de alta calidad, sin recortar ni ampliar (salvo la línea de MARCO) */
async function aWeb(file, id, letra) {
  const m = MARCO[`${id}-${letra}`] || 0, meta = await sharp(file).metadata();
  const width = meta.width - 2 * m, height = meta.height - 2 * m;
  for (const w of [160, 800, 1600]) {
    await sharp(file).extract({ left: m, top: m, width, height }).resize({ width: Math.min(w, width), withoutEnlargement: true })
      .webp({ quality: 92, smartSubsample: true }).toFile(resolve(OUT, `${id}-${letra}-${w}.webp`));
  }
  return { width, height };
}

mkdirSync(OUT, { recursive: true });
const fichas = await fichasDelListado();
console.log(`Listado de Creed: ${fichas.size} fichas con foto\n`);
const informe = [], filas = [];
for (const id of ids) {
  const pagina = ORIGINALES[id];
  try {
    const html = limpia(await get(pagina));
    const og = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)/i)?.[1];
    const deFicha = fichas.get(ruta(pagina)) || [];
    const urls = [...new Set([...deFicha, ...fotosEn(html), og].filter(Boolean))];
    if (!urls.length) throw new Error('la página no tiene fotos');
    const dir = resolve(CACHE, id);
    mkdirSync(dir, { recursive: true });
    const fotos = [];
    for (const [k, url] of urls.entries()) {
      const file = resolve(dir, `${String(k + 1).padStart(2, '0')}${url.slice(url.lastIndexOf('.'))}`);
      if (!existsSync(file)) writeFileSync(file, await get(url, 'buffer'));
      const { width: w, height: h } = await sharp(file).metadata();
      fotos.push({ url, file, w, h });
    }
    writeFileSync(resolve(dir, 'fuentes.txt'), `${pagina}\n${fotos.map((f, k) => `${k + 1}  ${f.url}  ${f.w}×${f.h}${deFicha.includes(f.url) ? '  (ficha del listado)' : ''}`).join('\n')}\n`);
    // Por defecto, las dos primeras fotos de la ficha del listado (o de la página si no aparece en él)
    const [ea, eb] = ELEGIDAS[id] ? [ELEGIDAS[id][0] - 1, ELEGIDAS[id][1] == null ? -1 : ELEGIDAS[id][1] - 1] : [0, fotos.length > 1 ? 1 : -1];
    const a = await aWeb(fotos[ea].file, id, 'a');
    let b = null;
    if (eb >= 0) b = await aWeb(fotos[eb].file, id, 'b');
    else for (const w of [160, 800, 1600]) rmSync(resolve(OUT, `${id}-b-${w}.webp`), { force: true });
    filas.push({ id, fotos: fotos.slice(0, Math.max(16, ea + 1, eb + 1)), a: ea, b: eb }); // más allá salen productos recomendados
    informe.push(`${id}  ${pagina}\n  principal: ${fotos[ea].url}  ${a.width}×${a.height}\n  ratón:     ${b ? `${fotos[eb].url}  ${b.width}×${b.height}` : '—'}\n  candidatas: ${fotos.length} (${deFicha.length} de la ficha del listado)`);
    console.log(`✓  ${id}: ${fotos.length} fotos, ${b ? 'con' : 'sin'} foto de ratón`);
  } catch (e) {
    informe.push(`${id}  ${pagina}\n  ERROR: ${e.message}`);
    console.log(`✗  ${id}: ${e.message}`);
  }
}
if (filas.length) await hojaDeContacto(filas);

// originales.js: medidas de cada foto principal y si hay foto de ratón (de lo que haya en public/img/originales)
const files = new Set(readdirSync(OUT));
const datos = {};
for (const id of Object.keys(ORIGINALES)) {
  if (!files.has(`${id}-a-800.webp`)) continue;
  const { width, height } = await sharp(resolve(OUT, `${id}-a-800.webp`)).metadata();
  datos[id] = { w: width, h: height, hover: files.has(`${id}-b-800.webp`) };
}
writeFileSync(resolve(ROOT, 'src/data/originales.js'),
  `// Generado por \`npm run originales\`: fotos originales de la casa en public/img/originales (a = principal, b = al pasar el ratón). No editar a mano.\nexport const ORIGINALES = {\n${Object.entries(datos).map(([id, d]) => `  '${id}': { w: ${d.w}, h: ${d.h}, hover: ${d.hover} }`).join(',\n')}\n};\n`);
writeFileSync(resolve(ROOT, 'scripts/originales-informe.txt'), `${informe.join('\n\n')}\n`);
console.log(`\n${Object.keys(datos).length} de ${Object.keys(ORIGINALES).length} con foto original. Revisa scripts/originales-revision.jpg`);
