/* ==========================================================================
   npm run catalogo      pasa la hoja del catálogo a la web

   La hoja es catalogo/fragancias.csv: una fila por fragancia, que el negocio puede abrir y
   rellenar en Excel, Numbers o Google Sheets (guía en docs/CATALOGO.md). Este script:
   1. La lee (separada por ; o por comas, con o sin comillas) y comprueba cada fila: que la
      casa, la familia y la concentración existan, que los tamaños y precios se entiendan y
      que no haya dos fragancias con el mismo id. Si algo falla, dice la fila y no cambia nada.
   2. Escribe src/data/fragancias.js, que es lo que lee la web (no se edita a mano).
   3. Hace un informe en reports/catalogo-informe.txt: cuántas hay por casa, cuántas se publican
      y, de las marcadas para publicar, a cuáles les falta la foto original o las notas oficiales
      (esas no salen en la web hasta tenerlas).

   Se ejecuta solo antes de `npm run dev` y de `npm run build`, así que basta con guardar la hoja.
   Con --comprobar solo revisa la hoja, sin escribir nada.
   ========================================================================== */

import { reportPath } from './lib/reports.mjs';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { CASAS, FAMILIAS, CONCENTRACIONES, slug } from '../src/data/casas.js';
import { ORIGINALES } from '../src/data/originales.js';
import { PROPIAS } from '../src/data/fotos.js';
import { NOTAS_OFICIALES } from '../src/data/notas-oficiales.js';

const ROOT = resolve(import.meta.dirname, '..');
const HOJA = resolve(ROOT, 'catalogo/fragancias.csv');
const SALIDA = resolve(ROOT, 'src/data/fragancias.js');
const INFORME = reportPath('catalogo-informe.txt');
const comprobar = process.argv.includes('--comprobar');

/** Texto comparable: sin tildes, en minúsculas y sin espacios de sobra */
const norm = (s) => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/\s+/g, ' ').trim();

/** CSV → filas. Detecta el separador en la cabecera; admite comillas, "" y saltos de línea dentro de comillas */
function leeCsv(texto) {
  texto = texto.replace(/^﻿/, '');
  const primera = texto.slice(0, texto.indexOf('\n') + 1 || undefined);
  const sep = (primera.match(/;/g) || []).length >= (primera.match(/,/g) || []).length ? ';' : ',';
  const filas = [];
  let fila = [], campo = '', comillas = false;
  for (let i = 0; i < texto.length; i++) {
    const ch = texto[i];
    if (comillas) {
      if (ch === '"' && texto[i + 1] === '"') { campo += '"'; i++; }
      else if (ch === '"') comillas = false;
      else campo += ch;
    } else if (ch === '"') comillas = true;
    else if (ch === sep) { fila.push(campo); campo = ''; }
    else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && texto[i + 1] === '\n') i++;
      fila.push(campo); filas.push(fila); fila = []; campo = '';
    } else campo += ch;
  }
  if (campo || fila.length) { fila.push(campo); filas.push(fila); }
  return filas;
}

/* Columnas de la hoja: el nombre de la cabecera (sin tildes ni mayúsculas) y si es obligatoria */
const COLUMNAS = {
  id: ['id', false], casa: ['casa', true], nombre: ['nombre', true], conc: ['concentracion', true], year: ['ano', false],
  familia: ['familia', true], sizes: ['tamanos y precios', true], desc: ['descripcion', false],
  featured: ['destacada', false], publicar: ['publicar', true]
};

const casaDe = (v) => CASAS.find((c) => norm(c.id) === norm(v) || norm(c.name) === norm(v));
// La familia por su id, su nombre completo o su primera palabra («Ámbar», «Frescas»)
const familiaDe = (v) => FAMILIAS.find((f) => [f.id, f.name, f.name.split(' ')[0]].some((x) => norm(x) === norm(v)));
const concDe = (v) => Object.keys(CONCENTRACIONES).find((k) => norm(k) === norm(v) || norm(CONCENTRACIONES[k]) === norm(v));
const SI = ['si', 'x', '1', 'true'], NO = ['', 'no', '0', 'false'];
// «50 ml = 255 € / 100 ml = 365 €»: cada pareja de mililitros y precio, con o sin «ml», «=» y «€»
const TAMANO = /(\d+(?:[.,]\d+)?)\s*ml\s*[=:]?\s*(\d+(?:[.,]\d{1,2})?)\s*€?/gi;
const num = (s) => Number(s.replace(',', '.'));

const filas = leeCsv(readFileSync(HOJA, 'utf8'));
const cabecera = filas.shift().map(norm);
const errores = [];
const col = Object.fromEntries(Object.entries(COLUMNAS).map(([k, [nombre, obligatoria]]) => {
  const i = cabecera.indexOf(nombre);
  if (i < 0 && obligatoria) errores.push(`Falta la columna «${nombre}» en la primera fila de la hoja`);
  return [k, i];
}));
if (errores.length) { console.error(`✗  ${errores.join('\n✗  ')}`); process.exit(1); }

const fragancias = [], ids = new Map(), generados = [];
filas.forEach((celdas, i) => {
  const n = i + 2; // número de fila tal como se ve en la hoja (la 1 es la cabecera)
  const v = (k) => (col[k] >= 0 ? String(celdas[col[k]] ?? '').trim() : '');
  if (celdas.every((c) => !c.trim())) return;
  const mal = (msg) => errores.push(`Fila ${n} (${v('nombre') || 'sin nombre'}): ${msg}`);

  const casa = casaDe(v('casa')), familia = familiaDe(v('familia')), conc = concDe(v('conc'));
  if (!casa) mal(`la casa «${v('casa')}» no existe. Las casas son: ${CASAS.map((c) => c.name).join(', ')} (una casa nueva se da de alta en src/data/casas.js)`);
  if (!v('nombre')) mal('falta el nombre');
  if (!familia) mal(`la familia «${v('familia')}» no existe. Son: ${FAMILIAS.map((f) => f.name).join(', ')}`);
  if (!conc) mal(`la concentración «${v('conc')}» no existe. Son: ${Object.keys(CONCENTRACIONES).join(', ')}`);

  let year = null;
  if (v('year')) {
    year = Number(v('year'));
    if (!Number.isInteger(year) || year < 1700 || year > new Date().getFullYear() + 1) mal(`el año «${v('year')}» no es válido (déjalo vacío si no se sabe)`);
  }

  const sizes = [...v('sizes').matchAll(TAMANO)].map(([, ml, pr]) => [num(ml), num(pr)]);
  if (!sizes.length) mal(`no se entienden los tamaños y precios «${v('sizes')}». Ejemplo: 50 ml = 255 € / 100 ml = 365 €`);
  else if (sizes.some(([ml, pr]) => !(ml > 0 && pr > 0))) mal('hay un tamaño o un precio a cero');
  else if (new Set(sizes.map((s) => s[0])).size < sizes.length) mal('hay un tamaño repetido');

  const flag = (k, nombre) => {
    const x = norm(v(k));
    if (SI.includes(x)) return true;
    if (!NO.includes(x)) mal(`en «${nombre}» pon «sí» o «no» (pone «${v(k)}»)`);
    return false;
  };
  const featured = flag('featured', 'destacada'), publicar = flag('publicar', 'publicar');

  // El id es la dirección de su ficha (/fragancias/<id>/) y el nombre de sus fotos: si está vacío, se crea
  let id = v('id').toLowerCase();
  if (!id && casa && v('nombre')) { id = `${casa.id}-${slug(v('nombre'))}`; generados.push(`fila ${n}: ${id}`); }
  if (id && !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(id)) mal(`el id «${id}» solo puede llevar letras sin tilde, números y guiones`);
  if (ids.has(id)) mal(`el id «${id}» ya está en la fila ${ids.get(id)}`);
  ids.set(id, n);

  fragancias.push({ id, casa: casa?.id, name: v('nombre'), conc, year, familia: familia?.id, desc: v('desc'), sizes,
    ...(featured && { featured }), ...(publicar && { publicar }) });
});

if (errores.length) {
  console.error(`La hoja tiene ${errores.length} ${errores.length === 1 ? 'error' : 'errores'} y no se ha cambiado nada:\n✗  ${errores.join('\n✗  ')}`);
  process.exit(1);
}

/* Qué le falta a cada fragancia para salir en la web (la misma regla que FRAGANCIAS en catalogo.js) */
const falta = (p) => [
  !(ORIGINALES[p.id] || PROPIAS.includes(p.id)) && 'foto original (npm run originales) o propia (npm run fotos -- --carpeta)',
  !NOTAS_OFICIALES[p.id] && 'notas oficiales (src/data/notas-oficiales.js)',
  !p.desc && 'descripción'
].filter(Boolean);
const marcadas = fragancias.filter((p) => p.publicar);
const pendientes = marcadas.filter((p) => falta(p).length);
const publicadas = marcadas.filter((p) => !falta(p).length);
const destacadas = publicadas.filter((p) => p.featured);

const porCasa = CASAS.map((c) => {
  const de = (l) => l.filter((p) => p.casa === c.id).length;
  return `  ${c.name.padEnd(18)} ${String(de(fragancias)).padStart(3)} en la hoja · ${String(de(marcadas)).padStart(3)} marcadas · ${String(de(publicadas)).padStart(3)} en la web`;
});
const informe = [
  `Catálogo (catalogo/fragancias.csv): ${fragancias.length} fragancias en la hoja, ${marcadas.length} marcadas para publicar, ${publicadas.length} en la web`,
  '', ...porCasa, '',
  `Destacadas en la web: ${destacadas.length} (la portada enseña las 8 primeras)${destacadas.length < 4 ? '. Marca alguna más en la columna «destacada»' : ''}`,
  '', `Marcadas para publicar que aún no salen (${pendientes.length})`,
  ...(pendientes.length ? pendientes.map((p) => `  ${p.id}: falta ${falta(p).join(', ')}`) : ['  Ninguna']),
  ...(generados.length ? ['', `Ids creados a partir de la casa y el nombre (${generados.length}). Cópialos a la hoja para que no cambien si se corrige el nombre:`, ...generados.map((x) => `  ${x}`)] : [])
].join('\n');

if (!comprobar) {
  writeFileSync(SALIDA, '// Generado por `npm run catalogo` desde catalogo/fragancias.csv. No editar a mano: se cambia la hoja.\n' +
    `export const FILAS = [\n${fragancias.map((p) => `  ${JSON.stringify(p)}`).join(',\n')}\n];\n`);
  writeFileSync(INFORME, `${informe}\n`);
}
console.log(`✓  ${fragancias.length} fragancias en la hoja, ${publicadas.length} en la web` +
  (pendientes.length ? ` (${pendientes.length} marcadas esperan foto o notas: reports/catalogo-informe.txt)` : ''));
