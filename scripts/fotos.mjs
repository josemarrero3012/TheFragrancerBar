/* ==========================================================================
   npm run fotos              descarga la foto oficial de las fragancias que no la tienen
   npm run fotos -- --todas   vuelve a descargarlas todas
   npm run fotos -- creed-aventus pdm-kalan   solo esas (también vale una casa: creed)
   npm run fotos -- --carpeta fotos-tienda/   fotos propias hechas en la tienda (ver docs/FOTOS.md):
                              cada archivo se llama como la fragancia (creed-aventus.jpg)

   Para cada fragancia de TODAS busca la foto en la web oficial de su casa
   (scripts/fotos-fuentes.js), quita el fondo blanco, la encaja como las demás
   (frasco centrado y apoyado en la misma línea, fondo transparente) y guarda
   public/img/productos/<id>-400.webp y -800.webp. Al final rehace
   src/data/fotos.js, que decide qué fragancias se publican, y escribe en
   scripts/fotos-informe.txt de dónde salió cada foto y cuáles faltan.

   Revisa siempre el resultado: una coincidencia por nombre puede traer un set
   de regalo o el tamaño de viaje. Si pasa, fija la página buena en fotos-fuentes.js.

   Las fotos propias pasan por el mismo recorte y encaje, así que quedan igual que
   las demás. Se apuntan en scripts/fotos-propias.json y las descargas no las vuelven
   a pisar (salvo que se pida esa fragancia por su id). El informe dice al final cuántas
   fotos son propias, cuántas siguen siendo de la web de la marca (provisionales hasta
   tener permiso) y cuáles faltan.
   ========================================================================== */

import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { extname, resolve } from 'node:path';
import sharp from 'sharp';
import { TODAS, casaById } from '../src/data/catalogo.js';
import { CASAS, FRAGANCIAS } from './fotos-fuentes.js';
import { get, ogImage, isImage, nombra, norm, shopifyProducts, eligeShopify, enlacesDe } from './marcas.mjs';

const ROOT = resolve(import.meta.dirname, '..');
const OUT = resolve(ROOT, 'public/img/productos');

// Lienzo de las fotos actuales: 800 × 1000, frasco de hasta 600 × 754 apoyado en y = 937
const W = 800, H = 1000, BOX_W = 600, BOX_H = 754, FLOOR = 937;

const args = process.argv.slice(2);
const todas = args.includes('--todas');
const carpeta = args.includes('--carpeta') ? args[args.indexOf('--carpeta') + 1] : null;
const solo = args.filter((a, i) => !a.startsWith('--') && args[i - 1] !== '--carpeta');
const conFoto = new Set(readdirSync(OUT).filter((f) => f.endsWith('-800.webp')).map((f) => f.slice(0, -9)));
// Fragancias con foto propia (hecha en la tienda): las descargas no las pisan
const PROPIAS_FILE = resolve(ROOT, 'scripts/fotos-propias.json');
const propias = new Set(existsSync(PROPIAS_FILE) ? JSON.parse(readFileSync(PROPIAS_FILE, 'utf8')) : []);

/* Imágenes candidatas de una fragancia (la primera con fondo limpio será la buena) */
async function fuente(p) {
  const fija = FRAGANCIAS[p.id];
  if (fija === null) return null;
  if (fija) {
    if (isImage(fija)) return { imgs: [fija], desde: fija };
    // Página de Shopify: su .json trae todas las fotos del producto; si no, og:image
    if (/\/products\/[^/?#]+$/.test(fija)) {
      try { const { product } = await get(`${fija}.json`, 'json'); if (product.images?.length) return { imgs: product.images.map((i) => i.src), desde: fija }; } catch { /* no es Shopify */ }
    }
    return { imgs: [ogImage(await get(fija), fija)].filter(Boolean), desde: fija };
  }
  const casa = CASAS[p.casa];
  if (!casa) return null;
  if (casa.shopify) {
    const hit = eligeShopify(await shopifyProducts(casa.shopify), p);
    return hit && { imgs: hit.images.map((i) => i.src), desde: `${casa.shopify}/products/${hit.handle}` };
  }
  let link;
  if (casa.listado) {
    const want = norm(p.name);
    link = (await enlacesDe(casa)).find((u) => norm(new URL(u).pathname.split('/')[2] || '').replace(/^creed /, '') === want);
  } else if (casa.buscar) {
    link = (await get(casa.buscar.replace('{q}', encodeURIComponent(p.name)))).match(casa.enlace)?.[0];
  }
  if (!link) return null;
  const html = await get(link);
  if (!nombra(html, p)) return null;
  return { imgs: [ogImage(html, link)].filter(Boolean), desde: link };
}

/* ¿El borde de la foto es liso (blanco, un color claro o transparente)? Si no, es una foto de ambiente */
function bordeLiso(data, w, h) {
  const px = [];
  for (let x = 0; x < w; x += 4) px.push(x, (h - 1) * w + x);
  for (let y = 0; y < h; y += 4) px.push(y * w, y * w + w - 1);
  const solid = px.filter((i) => data[i * 4 + 3] > 16);
  if (solid.length < px.length * 0.1) return { ok: true };
  const mean = [0, 1, 2].map((c) => solid.reduce((a, i) => a + data[i * 4 + c], 0) / solid.length);
  const dev = Math.sqrt(solid.reduce((a, i) => a + [0, 1, 2].reduce((b, c) => b + (data[i * 4 + c] - mean[c]) ** 2, 0), 0) / solid.length / 3);
  return { ok: dev < 14 && Math.min(...mean) > 170, mean };
}

/* Quita el fondo unido a los bordes y se queda con el frasco (la mancha más grande y lo que la toca).
   apilar: también lo que está justo encima o debajo, en la misma vertical. En las fotos propias sobre
   fondo blanco el cuello de cristal transparente desaparece con el fondo y deja el tapón suelto */
async function recorta(buf, { apilar = false } = {}) {
  const { data, info } = await sharp(buf).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  const borde = bordeLiso(data, w, h);
  if (!borde.ok) return null;
  if (borde.mean) {
    // Relleno desde los bordes: avanza mientras el color cambia poco de un píxel al vecino.
    // Así sigue los degradados y las sombras suaves del fondo y se para en el contorno del frasco
    const bg = borde.mean;
    const d = (i, j) => Math.abs(data[i * 4] - data[j * 4]) + Math.abs(data[i * 4 + 1] - data[j * 4 + 1]) + Math.abs(data[i * 4 + 2] - data[j * 4 + 2]);
    const lejos = (i) => Math.abs(data[i * 4] - bg[0]) + Math.abs(data[i * 4 + 1] - bg[1]) + Math.abs(data[i * 4 + 2] - bg[2]);
    const seen = new Uint8Array(w * h), stack = [];
    for (let x = 0; x < w; x++) stack.push(x, (h - 1) * w + x);
    for (let y = 0; y < h; y++) stack.push(y * w, y * w + w - 1);
    for (const i of stack) seen[i] = lejos(i) < 60 ? 1 : 2;
    const fondo = stack.filter((i) => seen[i] === 1);
    while (fondo.length) {
      const i = fondo.pop(), x = i % w;
      for (const j of [x > 0 && i - 1, x < w - 1 && i + 1, i >= w && i - w, i < w * (h - 1) && i + w]) {
        if (j === false || seen[j]) continue;
        if (d(i, j) < 14 && lejos(j) < 120) { seen[j] = 1; fondo.push(j); }
      }
    }
    // En esa zona el color del fondo pasa a transparencia (como «color a alfa»): el fondo
    // desaparece y las sombras y el cristal quedan semitransparentes, sin halos blancos
    for (let i = 0; i < w * h; i++) {
      if (seen[i] !== 1) continue;
      const o = i * 4;
      let al = 0;
      // Solo cuenta lo que es más oscuro que el fondo (sombras, contornos); lo más claro son brillos del propio fondo
      for (let c = 0; c < 3; c++) al = Math.max(al, Math.max(0, bg[c] - data[o + c]) / (bg[c] || 1));
      if (al < 0.03) { data[o + 3] = 0; continue; }
      for (let c = 0; c < 3; c++) data[o + c] = Math.max(0, Math.min(255, Math.round(bg[c] + (data[o + c] - bg[c]) / al)));
      data[o + 3] = Math.round(al * data[o + 3]);
    }
  }
  // Manchas opacas: se queda la mayor y las que se cruzan con ella (tapón, borla…)
  const label = new Int32Array(w * h), boxes = [];
  for (let s0 = 0; s0 < w * h; s0++) {
    if (label[s0] || data[s0 * 4 + 3] < 24) continue;
    const id = boxes.length + 1, box = { id, n: 0, x0: w, y0: h, x1: 0, y1: 0 }, stack = [s0];
    label[s0] = id;
    while (stack.length) {
      const i = stack.pop(), x = i % w, y = (i - x) / w;
      box.n++; box.x0 = Math.min(box.x0, x); box.x1 = Math.max(box.x1, x); box.y0 = Math.min(box.y0, y); box.y1 = Math.max(box.y1, y);
      for (const j of [x > 0 && i - 1, x < w - 1 && i + 1, y > 0 && i - w, y < h - 1 && i + w]) {
        if (j !== false && !label[j] && data[j * 4 + 3] >= 24) { label[j] = id; stack.push(j); }
      }
    }
    boxes.push(box);
  }
  if (!boxes.length) return null;
  const big = boxes.reduce((a, b) => (b.n > a.n ? b : a));
  const toca = (b) => b.x0 <= big.x1 && b.x1 >= big.x0 && b.y0 <= big.y1 && b.y1 >= big.y0;
  const gap = h * 0.06, cx = (big.x0 + big.x1) / 2;
  const encima = (b) => b.n > big.n * 0.01 && b.x0 <= cx && b.x1 >= cx && b.y1 >= big.y0 - gap && b.y0 <= big.y1 + gap;
  const keep = new Set(boxes.filter((b) => toca(b) || (apilar && encima(b))).map((b) => b.id));
  let x0 = w, y0 = h, x1 = 0, y1 = 0;
  for (let i = 0; i < w * h; i++) {
    if (!keep.has(label[i])) { data[i * 4 + 3] = 0; continue; }
    const x = i % w, y = (i - x) / w;
    if (data[i * 4 + 3] >= 60) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
  }
  if (x1 <= x0 || y1 <= y0) return null;
  const png = await sharp(data, { raw: info }).png().toBuffer();
  return sharp(png).extract({ left: x0, top: y0, width: x1 - x0 + 1, height: y1 - y0 + 1 });
}

async function procesa(p, urls, leer = (url) => get(url, 'buffer'), opciones) {
  let img, url;
  for (url of urls.slice(0, 8)) if ((img = await recorta(await leer(url), opciones))) break;
  if (!img) return null;
  const frasco = await img.resize(BOX_W, BOX_H, { fit: 'inside', withoutEnlargement: false }).png().toBuffer({ resolveWithObject: true });
  const { width: fw, height: fh } = frasco.info;
  const canvas = sharp({ create: { width: W, height: H, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([{ input: frasco.data, left: Math.round((W - fw) / 2), top: FLOOR - fh }]).png();
  const full = await canvas.toBuffer();
  await sharp(full).webp({ quality: 82, alphaQuality: 90 }).toFile(resolve(OUT, `${p.id}-800.webp`));
  await sharp(full).resize(400).webp({ quality: 80, alphaQuality: 90 }).toFile(resolve(OUT, `${p.id}-400.webp`));
  return url;
}

const informe = [], faltan = [];
if (carpeta) {
  /* Fotos propias: <id>.jpg|png|webp en la carpeta. Se gira según el EXIF (fotos de móvil) y se reduce antes de recortar */
  const dir = resolve(process.cwd(), carpeta);
  const leer = (file) => sharp(file).rotate().resize({ width: 2000, height: 2000, fit: 'inside', withoutEnlargement: true }).png().toBuffer();
  for (const f of readdirSync(dir).filter((x) => /\.(jpe?g|png|webp)$/i.test(x)).sort()) {
    const id = f.slice(0, -extname(f).length).toLowerCase(), p = TODAS.find((x) => x.id === id);
    if (!p) { faltan.push(`${f}: no hay ninguna fragancia con el id «${id}» (míralo en la dirección de su ficha, /fragancias/<id>/)`); console.log(`✗  ${f}: id desconocido`); continue; }
    const label = `${casaById(p.casa).name} ${p.name}`;
    if (!(await procesa(p, [resolve(dir, f)], leer, { apilar: true }))) { faltan.push(`${f}  (${label}): el fondo no es liso, repítela sobre fondo blanco`); console.log(`·  ${label}: fondo no liso`); continue; }
    propias.add(id);
    informe.push(`${id}  foto propia  ${f}`);
    console.log(`✓  ${label} (foto propia)`);
  }
  writeFileSync(PROPIAS_FILE, `${JSON.stringify([...propias].sort(), null, 2)}\n`);
} else {
  // Una foto propia solo se sustituye si se pide esa fragancia por su id (no al pedir toda su casa ni con --todas)
  const lista = TODAS.filter((p) => solo.includes(p.id) || (!propias.has(p.id) && (solo.length ? solo.includes(p.casa) : todas || !conFoto.has(p.id))));
  for (const p of lista) {
    const label = `${casaById(p.casa).name} ${p.name}`;
    try {
      const f = await fuente(p);
      if (!f?.imgs.length) { faltan.push(`${p.id}  (${label}): no se encontró en la web oficial`); console.log(`·  ${label}: sin foto`); continue; }
      const usada = await procesa(p, f.imgs);
      if (!usada) { faltan.push(`${p.id}  (${label}): solo hay fotos de ambiente en ${f.desde}`); console.log(`·  ${label}: solo fotos de ambiente`); continue; }
      propias.delete(p.id);
      informe.push(`${p.id}  ${f.desde}  ${usada}`);
      console.log(`✓  ${label}`);
    } catch (e) {
      faltan.push(`${p.id}  (${label}): ${e.message}`);
      console.log(`✗  ${label}: ${e.message}`);
    }
  }
  if (informe.length) writeFileSync(PROPIAS_FILE, `${JSON.stringify([...propias].sort(), null, 2)}\n`);
}

// fotos.js: las fragancias que tienen las dos medidas
const ids = TODAS.map((p) => p.id);
const files = new Set(readdirSync(OUT));
const fotos = ids.filter((id) => files.has(`${id}-400.webp`) && files.has(`${id}-800.webp`)).sort();
writeFileSync(resolve(ROOT, 'src/data/fotos.js'),
  `// Generado por \`npm run fotos\`: fragancias con foto en public/img/productos (-400 y -800.webp). No editar a mano.\nexport const FOTOS = [\n${fotos.map((id) => `  '${id}'`).join(',\n')}\n];\n`);
// Estado de todo el catálogo, no solo de esta pasada: qué fotos son propias, cuáles siguen siendo de la marca y cuáles faltan
const conMarca = fotos.filter((id) => !propias.has(id)), sinFoto = ids.filter((id) => !fotos.includes(id));
writeFileSync(resolve(ROOT, 'scripts/fotos-informe.txt'),
  `Esta pasada: ${informe.length} fotos nuevas\nid  origen\n${informe.join('\n')}\n\nNo se pudo (${faltan.length})\n${faltan.join('\n')}\n\n` +
  `Estado del catálogo (${ids.length} fragancias)\n` +
  `- Con foto propia: ${fotos.length - conMarca.length}\n` +
  `- Con foto de la web de la marca, provisional hasta tener permiso o foto propia: ${conMarca.length}\n` +
  `- Sin foto, no se publican: ${sinFoto.length}${sinFoto.length ? `\n  ${sinFoto.join('\n  ')}` : ''}\n`);
console.log(`\n${fotos.length} de ${ids.length} fragancias con foto. Informe en scripts/fotos-informe.txt`);
