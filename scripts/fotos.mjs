/* ==========================================================================
   npm run fotos              descarga la foto oficial de las fragancias que no la tienen
   npm run fotos -- --todas   vuelve a descargarlas todas
   npm run fotos -- creed-aventus pdm-kalan   solo esas

   Para cada fragancia de TODAS busca la foto en la web oficial de su casa
   (scripts/fotos-fuentes.js), quita el fondo blanco, la encaja como las demás
   (frasco centrado y apoyado en la misma línea, fondo transparente) y guarda
   public/img/productos/<id>-400.webp y -800.webp. Al final rehace
   src/data/fotos.js, que decide qué fragancias se publican, y escribe en
   scripts/fotos-informe.txt de dónde salió cada foto y cuáles faltan.

   Revisa siempre el resultado: una coincidencia por nombre puede traer un set
   de regalo o el tamaño de viaje. Si pasa, fija la página buena en fotos-fuentes.js.
   ========================================================================== */

import { readdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import sharp from 'sharp';
import { TODAS, casaById } from '../src/data/catalogo.js';
import { CASAS, FRAGANCIAS } from './fotos-fuentes.js';

const ROOT = resolve(import.meta.dirname, '..');
const OUT = resolve(ROOT, 'public/img/productos');
const UA = { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36' };

// Lienzo de las fotos actuales: 800 × 1000, frasco de hasta 600 × 754 apoyado en y = 937
const W = 800, H = 1000, BOX_W = 600, BOX_H = 754, FLOOR = 937;
// Títulos de Shopify que no son el perfume (sets, muestras, cuerpo, pelo…)
const NO_PERFUME = /\b(set|kit|coffret|duo|trio|sample|discovery|calendar|candle|body|hair|lotion|cream|shower|soap|deo|deodorant|refill|travel|mini|gift|wrapping|bag|postcard)\b|\d+\s?ml/i;

const args = process.argv.slice(2);
const todas = args.includes('--todas');
const solo = args.filter((a) => !a.startsWith('--'));
const conFoto = new Set(readdirSync(OUT).filter((f) => f.endsWith('-800.webp')).map((f) => f.slice(0, -9)));

const norm = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, ' ').trim();
const get = async (url, as = 'text') => {
  const res = await fetch(url, { headers: UA, redirect: 'follow' });
  if (!res.ok) throw new Error(`${res.status} en ${url}`);
  return as === 'buffer' ? Buffer.from(await res.arrayBuffer()) : as === 'json' ? res.json() : res.text();
};
const ogImage = (html, base) => {
  const m = html.match(/<meta[^>]+property=["']og:image(?::secure_url)?["'][^>]+content=["']([^"']+)["']/i)
    || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
  return m && new URL(m[1].replace(/&amp;/g, '&'), base).href;
};
const isImage = (url) => /\.(png|jpe?g|webp|avif)(\?|$)/i.test(url);

/* Catálogo completo de cada tienda Shopify (se pide una vez por casa) */
const shopify = new Map();
async function shopifyProducts(base) {
  if (!shopify.has(base)) {
    shopify.set(base, (async () => {
      const all = [];
      for (let page = 1; page <= 20; page++) {
        const { products } = await get(`${base}/products.json?limit=250&page=${page}`, 'json');
        all.push(...products);
        if (products.length < 250) break;
      }
      return all;
    })());
  }
  return shopify.get(base);
}

/* URL de la foto oficial de una fragancia, o null */
async function fuente(p) {
  const fija = FRAGANCIAS[p.id];
  if (fija) {
    if (isImage(fija)) return { img: fija, desde: fija };
    // Página de Shopify: su .json da la primera foto del producto; si no, og:image
    if (/\/products\/[^/?#]+$/.test(fija)) {
      try { const { product } = await get(`${fija}.json`, 'json'); if (product.images?.[0]) return { img: product.images[0].src, desde: fija }; } catch { /* no es Shopify */ }
    }
    return { img: ogImage(await get(fija), fija), desde: fija };
  }
  const casa = CASAS[p.casa];
  if (!casa) return null;
  if (casa.shopify) {
    const products = await shopifyProducts(casa.shopify);
    const want = norm(p.name);
    const cands = products.filter((x) => x.images?.length && !NO_PERFUME.test(x.title) && !NO_PERFUME.test(x.product_type || ''));
    const hit = cands.find((x) => norm(x.title) === want)
      || cands.find((x) => norm(x.title).replace(/\b(eau de parfum|eau de toilette|extrait de parfum|parfum|edp)\b/g, '').trim() === want);
    return hit && { img: hit.images[0].src, desde: `${casa.shopify}/products/${hit.handle}` };
  }
  if (casa.buscar) {
    const html = await get(casa.buscar.replace('{q}', encodeURIComponent(p.name)));
    const link = html.match(casa.enlace)?.[0];
    if (!link || !norm(link).includes(norm(p.name).split(' ')[0])) return null;
    return { img: ogImage(await get(link), link), desde: link };
  }
  return null;
}

/* Quita el fondo blanco unido a los bordes (relleno desde fuera, para no agujerear el frasco) */
async function sinFondo(buf) {
  const { data, info } = await sharp(buf).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  const at = (i) => i * 4;
  const corners = [0, w - 1, (h - 1) * w, h * w - 1];
  // Si las esquinas ya son transparentes, la foto viene recortada
  if (corners.every((i) => data[at(i) + 3] < 16)) return sharp(data, { raw: info });
  const isBg = (i) => { const o = at(i); return data[o] > 238 && data[o + 1] > 238 && data[o + 2] > 238; };
  const seen = new Uint8Array(w * h), stack = [];
  for (let x = 0; x < w; x++) stack.push(x, (h - 1) * w + x);
  for (let y = 0; y < h; y++) stack.push(y * w, y * w + w - 1);
  while (stack.length) {
    const i = stack.pop();
    if (seen[i] || !isBg(i)) continue;
    seen[i] = 1; data[at(i) + 3] = 0;
    const x = i % w;
    if (x > 0) stack.push(i - 1);
    if (x < w - 1) stack.push(i + 1);
    if (i >= w) stack.push(i - w);
    if (i < w * (h - 1)) stack.push(i + w);
  }
  return sharp(data, { raw: info });
}

async function procesa(p, url) {
  const img = await sinFondo(await get(url, 'buffer'));
  const frasco = await img.trim({ threshold: 1 }).resize(BOX_W, BOX_H, { fit: 'inside', withoutEnlargement: false }).png().toBuffer({ resolveWithObject: true });
  const { width: fw, height: fh } = frasco.info;
  const canvas = sharp({ create: { width: W, height: H, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([{ input: frasco.data, left: Math.round((W - fw) / 2), top: FLOOR - fh }]).png();
  const full = await canvas.toBuffer();
  await sharp(full).webp({ quality: 82, alphaQuality: 90 }).toFile(resolve(OUT, `${p.id}-800.webp`));
  await sharp(full).resize(400).webp({ quality: 80, alphaQuality: 90 }).toFile(resolve(OUT, `${p.id}-400.webp`));
}

const lista = TODAS.filter((p) => (solo.length ? solo.includes(p.id) : todas || !conFoto.has(p.id)));
const informe = [], faltan = [];
for (const p of lista) {
  const label = `${casaById(p.casa).name} ${p.name}`;
  try {
    const f = await fuente(p);
    if (!f?.img) { faltan.push(`${p.id}  (${label}): no se encontró en la web oficial`); console.log(`·  ${label}: sin foto`); continue; }
    await procesa(p, f.img);
    informe.push(`${p.id}  ${f.desde}  ${f.img}`);
    console.log(`✓  ${label}`);
  } catch (e) {
    faltan.push(`${p.id}  (${label}): ${e.message}`);
    console.log(`✗  ${label}: ${e.message}`);
  }
}

// fotos.js: las fragancias que tienen las dos medidas
const ids = TODAS.map((p) => p.id);
const files = new Set(readdirSync(OUT));
const fotos = ids.filter((id) => files.has(`${id}-400.webp`) && files.has(`${id}-800.webp`)).sort();
writeFileSync(resolve(ROOT, 'src/data/fotos.js'),
  `// Generado por \`npm run fotos\`: fragancias con foto en public/img/productos (-400 y -800.webp). No editar a mano.\nexport const FOTOS = [\n${fotos.map((id) => `  '${id}'`).join(',\n')}\n];\n`);
writeFileSync(resolve(ROOT, 'scripts/fotos-informe.txt'),
  `Fotos descargadas (${informe.length})\nid  página  imagen\n${informe.join('\n')}\n\nSin foto (${faltan.length}): no se publican hasta tenerla\n${faltan.join('\n')}\n`);
console.log(`\n${fotos.length} de ${ids.length} fragancias con foto. Informe en scripts/fotos-informe.txt`);
