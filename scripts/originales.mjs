/* ==========================================================================
   npm run originales                       descarga las fotos originales de las fragancias a publicar
   npm run originales -- creed-aventus      solo esa (o varias; también vale una casa: amouage)

   Las fotos de cada fragancia tal cual las publica su casa, en la mayor resolución que
   ofrece: la principal (a), la que sale al pasar el ratón por la rejilla (b) y, si se
   eligen más, otras que solo se ven en la ficha (c, d…).

   Para cada fragancia marcada en «publicar» en la hoja catalogo/fragancias.csv (A_PUBLICAR en src/data/catalogo.js):
   1. Busca su página de producto en la web de la casa (PAGINAS, scripts/fotos-fuentes.js o
      por su nombre, como `npm run fotos`) y saca todas sus fotos:
        Creed     las de su ficha en el listado y las de la página (static.thcdn.com/productimg/original/…)
        Shopify   las del producto en <página>.json, que son los archivos originales
        Montale   las de la página con el nombre del producto, en su tamaño original (/img/p/…)
   2. Guarda cada candidata sin tocar en fotos-originales/<id>/ (no se sube al repo).
   3. Elige las fotos: por defecto las dos primeras; ELEGIDAS las fija tras revisar la hoja.
   4. Las deja cuadradas sin recortar el frasco: si la foto no es cuadrada y su borde es liso
      (un fondo de estudio), amplía el fondo con su mismo color; si no, recorta desde el centro.
      Las pasa a WebP de alta calidad (q 92) en public/img/originales/<id>-<a|b|c…>-160|800|1600.webp
      (160: miniatura de la ficha) y rehace src/data/originales.js.
   5. Hace una hoja de contacto con todas las candidatas numeradas en
      scripts/originales-revision.jpg y un informe en scripts/originales-informe.txt, que avisa
      de las fotos de menos de 1200 px.
   Sube la hoja y el informe con las fotos para revisarlas.
   ========================================================================== */

import { mkdirSync, readdirSync, writeFileSync, existsSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';
import sharp from 'sharp';
import { TODAS, A_PUBLICAR, casaById } from '../src/data/catalogo.js';
import { CASAS, FRAGANCIAS as FUENTES } from './fotos-fuentes.js';
import { get, norm, nombra, ogImage, isImage, shopifyProducts, eligeShopify, enlacesDe } from './marcas.mjs';

const ROOT = resolve(import.meta.dirname, '..');
const OUT = resolve(ROOT, 'public/img/originales');
const CACHE = resolve(ROOT, 'fotos-originales');
const LETRAS = 'abcdef';
const ES = { 'Accept-Language': 'es-ES,es;q=0.9' };
const MIN_LADO = 1200;

/* Páginas de producto fijadas a mano (las demás se buscan como en `npm run fotos`) */
const PAGINAS = {
  'creed-aventus': 'https://www.creedfragrance.com/p/aventus/12870029/',
  'creed-absolu-aventus': 'https://www.creedfragrance.com/p/absolu-aventus/14926231/',
  'creed-aventus-for-her': 'https://www.creedfragrance.com/p/aventus-for-her/12870031/',
  'creed-green-irish-tweed': 'https://www.creedfragrance.com/p/green-irish-tweed/12870035/',
  'creed-silver-mountain-water': 'https://www.creedfragrance.com/p/silver-mountain-water/12870049/',
  'creed-millesime-imperial': 'https://www.creedfragrance.com/p/millesime-imperial/12870041/',
  'creed-viking': 'https://www.creedfragrance.com/p/viking/12870053/',
  'creed-royal-oud': 'https://www.creedfragrance.com/p/royal-oud/12870045/',
  'creed-original-santal': 'https://www.creedfragrance.com/p/original-santal/12870043/',
  'creed-himalaya': 'https://www.creedfragrance.com/p/himalaya/12870036/',
  'amouage-interlude-man': 'https://amouage.com/products/interlude-man-100ml',
  'amouage-reflection-man': 'https://amouage.com/products/reflection-man-100ml',
  'amouage-guidance-46': 'https://amouage.com/products/new-guidance-46',
  'amouage-epic-woman': 'https://amouage.com/products/epic-woman',
  'amouage-memoir-man': 'https://amouage.com/products/memoir-man',
  'xerjoff-torino21': 'https://www.xerjoff.com/products/torino21-eau-de-parfum',
  'pdm-pegasus': 'https://parfums-de-marly.com/products/pegasus',
  'pdm-herod': 'https://parfums-de-marly.com/products/herod',
  'pdm-greenley': 'https://parfums-de-marly.com/products/greenley',
  'initio-side-effect': 'https://initioparfums.com/products/side-effect',
  'initio-rehab': 'https://initioparfums.com/products/rehab',
  'initio-atomic-rose': 'https://initioparfums.com/products/atomic-rose',
  'initio-psychedelic-love': 'https://initioparfums.com/products/psychedelic-love',
  'montale-arabians-tonka': 'https://www.montaleparfums.com/en/oriental/282-arabians-tonka.html',
  'montale-intense-cafe': 'https://www.montaleparfums.com/en/gourmand/176-intense-cafe.html',
  'montale-roses-musk': 'https://www.montaleparfums.com/en/floral/68-roses-musk-rose.html',
  'montale-chocolate-greedy': 'https://www.montaleparfums.com/en/gourmand/35-chocolate-greedy-argent.html',
  'montale-wild-pears': 'https://www.montaleparfums.com/en/fruity/87-wild-pears-argent.html',
  'tomford-oud-wood': 'https://www.tomfordbeauty.com/products/oud-wood-eau-de-parfum',
  'tomford-lost-cherry': 'https://www.tomfordbeauty.com/products/lost-cherry-eau-de-parfum',
  'tomford-tuscan-leather': 'https://www.tomfordbeauty.com/products/tuscan-leather-eau-de-parfum',
  'tomford-neroli-portofino': 'https://www.tomfordbeauty.com/products/neroli-portofino-eau-de-parfum'
};

/* Tras revisar la hoja de contacto: [principal, ratón, …solo en la ficha] con los números de la hoja
   (null en el ratón: sin segunda foto). En Creed, el frasco de 100 ml sobre fondo gris y la
   composición con sus ingredientes, como en su web (la ficha del listado no trae la del ratón). */
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
  'creed-himalaya': [1, 6],
  // Amouage: frasco y estuche; en las que lo tienen, el bodegón de la colección al pasar el ratón
  'amouage-reflection-man': [1, 3],
  'amouage-guidance-46': [1, 3],
  // Xerjoff: el frasco recortado delante y su campaña o su composición de notas detrás
  'xerjoff-naxos': [2, 1],
  'xerjoff-erba-pura': [2, 4],
  'xerjoff-alexandria-ii': [2, 4],
  'xerjoff-torino21': [2, 1],
  'xerjoff-accento': [2, 4],
  // Parfums de Marly: el frasco y su composición con ingredientes (la casa no publica nada mayor de 1080 px del frasco)
  'pdm-layton': [1, 5],
  'pdm-delina': [1, 3],
  'pdm-pegasus': [1, 5],
  'pdm-herod': [1, 4],
  'pdm-greenley': [1, 4]
  // Initio, Memo Paris y Tom Ford: las dos primeras (frasco y foto de campaña); Montale solo publica una
};
/* Fotos con una línea de marco en el borde: píxeles que se quitan por cada lado antes de pasarlas a WebP */
const MARCO = { 'creed-original-santal-b': 8 };

const args = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const lista = A_PUBLICAR
  .filter((p) => !args.length || args.includes(p.id) || args.includes(p.casa));

// Las URLs pueden venir escapadas en JSON (/) o dentro de /images?url=https%3A%2F%2F…
const limpia = (html) => html.replace(/\\u002F/gi, '/').replace(/\\\//g, '/').replace(/%3A/gi, ':').replace(/%2F/gi, '/').replace(/&amp;/g, '&');
const ruta = (url) => new URL(url).pathname.replace(/\/?$/, '/');

/* ---------------------------------------------------------------- Creed */
const FOTO_CREED = /https:\/\/static\.thcdn\.com\/productimg\/original\/\d+-\d+\.(?:jpe?g|png|webp)/gi;
const fotosCreed = (texto) => [...new Set(texto.match(FOTO_CREED) || [])];

/* Fotos de la ficha de cada producto en el listado. Si antes del primer enlace ya hay fotos, en cada
   ficha van delante del enlace (desde el producto anterior hasta él); si no, detrás (hasta el siguiente) */
let fichasCreed;
async function fichasDelListado() {
  const fichas = new Map();
  for (const url of CASAS.creed.listado) {
    let html;
    try { html = limpia(await get(url, 'text', ES)); } catch (e) { console.log(`·  listado ${url}: ${e.message}`); continue; }
    const enlaces = [...html.matchAll(/(?:https:\/\/www\.creedfragrance\.com)?(\/p\/[a-z0-9-]+\/\d+\/?)/g)]
      .map((m) => ({ ruta: m[1].replace(/\/?$/, '/'), i: m.index, fin: m.index + m[0].length }));
    // Tramos seguidos del mismo producto: desde el final del anterior hasta el comienzo del siguiente
    const tramos = [];
    for (const e of enlaces) {
      const t = tramos.at(-1);
      if (t && t.ruta === e.ruta) t.fin = e.fin; else tramos.push({ ...e });
    }
    const delante = tramos.length && fotosCreed(html.slice(0, tramos[0].i)).length > 0;
    tramos.forEach((t, k) => {
      const [desde, hasta] = delante ? [k ? tramos[k - 1].fin : 0, t.fin] : [t.i, tramos[k + 1]?.i ?? html.length];
      const fotos = fotosCreed(html.slice(desde, hasta));
      if (fotos.length && !fichas.has(t.ruta)) fichas.set(t.ruta, fotos);
    });
  }
  return fichas;
}

async function creed(p) {
  const want = norm(p.name);
  const pagina = PAGINAS[p.id] || FUENTES[p.id]
    || (await enlacesDe(CASAS.creed)).find((u) => norm(new URL(u).pathname.split('/')[2] || '').replace(/^creed /, '') === want);
  if (!pagina) return null;
  fichasCreed ??= await fichasDelListado();
  const html = limpia(await get(pagina, 'text', ES));
  const og = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)/i)?.[1];
  const deFicha = fichasCreed.get(ruta(pagina)) || [];
  // Más allá de las 16 primeras salen productos recomendados
  return { pagina, urls: [...new Set([...deFicha, ...fotosCreed(html), og].filter(Boolean))].slice(0, 16), nota: `${deFicha.length} de la ficha del listado` };
}

/* ---------------------------------------------------------------- Shopify */
async function tiendaShopify(p, base) {
  const fija = PAGINAS[p.id] || FUENTES[p.id];
  if (fija === null) return null;
  let pagina = fija && /\/products\/[^/?#]+$/.test(fija) ? fija : null;
  if (!pagina) {
    const hit = eligeShopify(await shopifyProducts(base), p);
    if (!hit) return null;
    pagina = `${base}/products/${hit.handle}`;
  }
  const { product } = await get(`${pagina}.json`, 'json');
  // src es el archivo que subió la casa; sin el ?v= de la caché
  const urls = (product.images || []).map((i) => i.src.split('?')[0]);
  if (p.casa !== 'xerjoff') return { pagina, urls };
  // Xerjoff sube al producto las fotos del listado (590×774); las grandes (1604 px) son las gallery-… de la página
  const html = limpia(await get(pagina, 'text', ES));
  const slug = norm(p.name).replace(/[^a-z0-9]/g, '');
  const dePagina = [...new Set([...html.matchAll(/\/cdn\/shop\/files\/([^"'?\s]+?\.(?:jpe?g|png))/gi)].map((m) => m[1]))]
    .filter((f) => !/_small\.|^listing-/.test(f) && f.toLowerCase().replace(/[^a-z0-9]/g, '').includes(slug))
    .sort((a, b) => /^gallery-/.test(b) - /^gallery-/.test(a))
    .map((f) => `https://www.xerjoff.com/cdn/shop/files/${f}`);
  return { pagina, urls: [...dePagina, ...urls] };
}

/* ---------------------------------------------------------------- Montale (PrestaShop) */
async function montale(p) {
  let pagina = PAGINAS[p.id] || FUENTES[p.id];
  if (pagina === null || (pagina && isImage(pagina))) return pagina ? { pagina, urls: [pagina] } : null;
  if (!pagina) {
    const casa = CASAS.montale;
    pagina = (await get(casa.buscar.replace('{q}', encodeURIComponent(p.name)))).match(casa.enlace)?.[0];
    if (!pagina) return null;
  }
  const html = await get(pagina);
  if (!nombra(html, p)) return null;
  // Las fotos del producto se llaman como su página (282-arabians-tonka.html → <n>-<tamaño>/arabians-tonka.jpg)
  const slug = pagina.match(/\/\d+-([a-z0-9-]+)\.html/)[1];
  const ids = [...new Set([...html.matchAll(new RegExp(`/(\\d+)-[a-z_]+/${slug}\\.jpg`, 'g'))].map((m) => m[1]))];
  if (!ids.length) return { pagina, urls: [ogImage(html, pagina)].filter(Boolean) };
  // La original está en /img/p/1/0/8/1/1081.jpg; si no se puede, la grande de la página
  return { pagina, urls: ids.map((n) => [`https://www.montaleparfums.com/img/p/${[...n].join('/')}/${n}.jpg`, `https://www.montaleparfums.com/${n}-large_default/${slug}.jpg`]) };
}

const fotosDe = (p) => p.casa === 'creed' ? creed(p) : p.casa === 'montale' ? montale(p)
  : CASAS[p.casa]?.shopify ? tiendaShopify(p, CASAS[p.casa].shopify) : null;

/* ---------------------------------------------------------------- Imágenes */

/* Descarga una candidata (o la primera que funcione de varias) a la caché */
async function descarga(urls, file) {
  for (const url of [urls].flat()) {
    const dest = `${file}${new URL(url).pathname.match(/\.(jpe?g|png|webp|avif)$/i)?.[0] || '.img'}`;
    try {
      if (!existsSync(dest)) writeFileSync(dest, await get(url, 'buffer'));
      const { width: w, height: h } = await sharp(dest).metadata();
      return { url, file: dest, w, h };
    } catch { rmSync(dest, { force: true }); }
  }
  return null;
}

/* Color del borde si es liso (fondo de estudio o transparente); null si es una foto de ambiente */
async function bordeLiso(buf) {
  const { data, info } = await sharp(buf).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info, px = [];
  for (let x = 0; x < w; x += 3) px.push(x, (h - 1) * w + x);
  for (let y = 0; y < h; y += 3) px.push(y * w, y * w + w - 1);
  if (px.filter((i) => data[i * 4 + 3] < 16).length > px.length * 0.9) return { r: 0, g: 0, b: 0, alpha: 0 };
  const media = [0, 1, 2].map((c) => px.reduce((a, i) => a + data[i * 4 + c], 0) / px.length);
  const dev = Math.sqrt(px.reduce((a, i) => a + [0, 1, 2].reduce((b, c) => b + (data[i * 4 + c] - media[c]) ** 2, 0), 0) / px.length / 3);
  return dev < 6 ? { r: Math.round(media[0]), g: Math.round(media[1]), b: Math.round(media[2]), alpha: 1 } : null;
}

/* Cuadrada y en WebP de alta calidad, sin ampliar: el fondo liso se alarga; una foto de ambiente se recorta al centro */
async function aWeb(file, id, letra) {
  const m = MARCO[`${id}-${letra}`] || 0, meta = await sharp(file).metadata();
  const w = meta.width - 2 * m, h = meta.height - 2 * m;
  let buf = await sharp(file).extract({ left: m, top: m, width: w, height: h }).png().toBuffer(), lado = w;
  if (w !== h) {
    const fondo = await bordeLiso(buf);
    lado = fondo ? Math.max(w, h) : Math.min(w, h);
    const x = (lado - w) / 2, y = (lado - h) / 2;
    buf = await (fondo
      ? sharp(buf).extend({ top: Math.floor(y), bottom: Math.ceil(y), left: Math.floor(x), right: Math.ceil(x), background: fondo })
      : sharp(buf).resize(lado, lado, { fit: 'cover' })).png().toBuffer();
  }
  for (const px of [160, 800, 1600]) {
    await sharp(buf).resize({ width: px, withoutEnlargement: true }).webp({ quality: 92, alphaQuality: 92, smartSubsample: true })
      .toFile(resolve(OUT, `${id}-${letra}-${px}.webp`));
  }
  return lado;
}

/* Hoja de contacto: cada fragancia en una fila, con sus candidatas numeradas y las elegidas marcadas */
async function hojaDeContacto(filas) {
  const T = 220, PAD = 10, LABEL = 260, cols = Math.max(1, ...filas.map((f) => f.fotos.length));
  const W = LABEL + cols * (T + PAD) + PAD, H = filas.length * (T + 40) + PAD;
  const capas = [], textos = [];
  for (const [r, f] of filas.entries()) {
    const y = PAD + r * (T + 40);
    textos.push(`<text x="${PAD}" y="${y + 24}" font-size="18" font-family="sans-serif">${f.id}</text>`);
    for (const [c, foto] of f.fotos.entries()) {
      const x = LABEL + PAD + c * (T + PAD);
      capas.push({ input: await sharp(foto.file).resize(T, T, { fit: 'contain', background: '#fff' }).flatten({ background: '#fff' }).toBuffer(), left: x, top: y });
      const k = f.elegidas.indexOf(c), marca = k === 0 ? ' · PRINCIPAL' : k === 1 ? ' · RATÓN' : k > 1 ? ` · ${LETRAS[k].toUpperCase()}` : '';
      textos.push(`<text x="${x}" y="${y + T + 22}" font-size="15" font-family="sans-serif" font-weight="${marca ? 700 : 400}">${c + 1}${marca}  ${foto.w}×${foto.h}</text>`);
    }
  }
  const svg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">${textos.join('')}</svg>`);
  await sharp({ create: { width: W, height: H, channels: 3, background: '#ffffff' } })
    .composite([...capas, { input: svg, left: 0, top: 0 }]).jpeg({ quality: 80 }).toFile(resolve(ROOT, 'scripts/originales-revision.jpg'));
}

/* ---------------------------------------------------------------- Descarga */
mkdirSync(OUT, { recursive: true });
const informe = [], filas = [];
for (const p of lista) {
  const label = `${casaById(p.casa).name} ${p.name}`;
  try {
    const f = await fotosDe(p);
    if (!f?.urls.length) throw new Error('no se encontró en la web oficial');
    const dir = resolve(CACHE, p.id);
    mkdirSync(dir, { recursive: true });
    const fotos = [];
    for (const [k, urls] of f.urls.entries()) {
      const foto = await descarga(urls, resolve(dir, String(k + 1).padStart(2, '0')));
      if (foto) fotos.push(foto);
    }
    if (!fotos.length) throw new Error(`no se pudo descargar ninguna foto de ${f.pagina}`);
    writeFileSync(resolve(dir, 'fuentes.txt'), `${f.pagina}\n${fotos.map((x, k) => `${k + 1}  ${x.url}  ${x.w}×${x.h}`).join('\n')}\n`);
    // Por defecto, las dos primeras (o solo una si no hay más)
    const pedidas = ELEGIDAS[p.id] || [1, 2];
    if (pedidas[0] > fotos.length) throw new Error(`la foto ${pedidas[0]} de ELEGIDAS no existe: hay ${fotos.length} (revisa la hoja)`);
    const elegidas = pedidas.filter((n) => n != null && n <= fotos.length).map((n) => n - 1);
    const lados = [];
    for (const [k, n] of elegidas.entries()) lados.push(await aWeb(fotos[n].file, p.id, LETRAS[k]));
    // Fuera las letras que sobran de una pasada anterior
    for (const l of LETRAS.slice(elegidas.length)) for (const px of [160, 800, 1600]) rmSync(resolve(OUT, `${p.id}-${l}-${px}.webp`), { force: true });
    filas.push({ id: p.id, fotos, elegidas });
    const bajas = lados.filter((x) => x < MIN_LADO).length;
    informe.push(`${p.id}  ${f.pagina}\n${elegidas.map((n, k) => `  ${LETRAS[k]}: ${fotos[n].url}  ${fotos[n].w}×${fotos[n].h}${lados[k] < MIN_LADO ? '  BAJA RESOLUCIÓN' : ''}`).join('\n')}\n  candidatas: ${fotos.length}${f.nota ? ` (${f.nota})` : ''}`);
    console.log(`✓  ${label}: ${fotos.length} candidatas, ${elegidas.length} elegidas${bajas ? `, ${bajas} de menos de ${MIN_LADO} px` : ''}`);
  } catch (e) {
    informe.push(`${p.id}\n  ERROR: ${e.message}`);
    console.log(`✗  ${label}: ${e.message}`);
  }
}
if (filas.length) await hojaDeContacto(filas);

// originales.js: cuántas fotos seguidas (a, b, c…) tiene cada fragancia en public/img/originales
const files = new Set(readdirSync(OUT));
const cuantas = (id) => { const n = [...LETRAS].findIndex((l) => !files.has(`${id}-${l}-800.webp`)); return n < 0 ? LETRAS.length : n; };
const datos = TODAS.map((p) => [p.id, cuantas(p.id)]).filter(([, n]) => n > 0);
writeFileSync(resolve(ROOT, 'src/data/originales.js'),
  `// Generado por \`npm run originales\`: fotos originales de la casa en public/img/originales, cuadradas (n fotos: a = principal, b = al pasar el ratón, c… solo en la ficha). No editar a mano.\nexport const ORIGINALES = {\n${datos.map(([id, n]) => `  '${id}': { n: ${n} }`).join(',\n')}\n};\n`);
writeFileSync(resolve(ROOT, 'scripts/originales-informe.txt'), `${informe.join('\n\n')}\n`);
const sin = A_PUBLICAR.map((p) => p.id).filter((id) => !datos.some(([x]) => x === id));
console.log(`\n${A_PUBLICAR.length - sin.length} de ${A_PUBLICAR.length} fragancias a publicar con foto original${sin.length ? ` (faltan: ${sin.join(', ')})` : ''}. Revisa scripts/originales-revision.jpg`);
