/* ==========================================================================
   Catálogo: las fragancias de la hoja catalogo/fragancias.csv, con sus fotos y notas.
   Cada fragancia publicada genera su página /fragancias/<id>/ al compilar.

   LA HOJA: el negocio rellena catalogo/fragancias.csv (una fila por fragancia; guía en
   docs/CATALOGO.md) y `npm run catalogo` la comprueba y la pasa a fragancias.js. Se ejecuta
   solo antes de `npm run dev` y `npm run build`. Cada fila de FILAS trae:
     id       ruta de su página y nombre de sus fotos (casa-nombre)
     casa     id de la casa (casas.js)
     name     nombre
     conc     concentración: EDT, EDP, Extrait o Parfum
     year     año de lanzamiento, o null si no está confirmado (entonces no se muestra)
     familia  id de familia olfativa
     desc     descripción corta
     sizes    [[ml, precio en euros], …] — el primero es el tamaño por defecto
     featured (opcional) aparece en la selección de la portada
     publicar (opcional) el negocio la quiere en la web

   PRECIOS DE DEMOSTRACIÓN: los de la hoja son inventados mientras SITE.demoPrices sea true;
   se avisa en la web y no se publican en los datos estructurados.

   QUÉ SE PUBLICA (FRAGANCIAS): las marcadas en «publicar» que tienen foto original y notas
   oficiales. Nada sale en la web con una foto de baja calidad o sin notas:
   ORIGINALES  las fotos de la casa tal cual las publica en su web, en alta resolución
               (`npm run originales`, en originales.js).
   PROPIAS     fotos hechas en la tienda (`npm run fotos -- --carpeta`, en fotos.js).
   El resto de FOTOS (frascos recortados de las webs de las marcas) solo sirven de apoyo.
   Como site.js, no debe usar nada del navegador (lo lee también vite.config.js).
   ========================================================================== */

import { CASAS, FAMILIAS } from './casas.js';
import { FILAS } from './fragancias.js';
import { FOTOS, PROPIAS } from './fotos.js';
import { ORIGINALES } from './originales.js';
import { NOTAS_OFICIALES } from './notas-oficiales.js';

export { CASAS, FAMILIAS, CONCENTRACIONES, euros } from './casas.js';

/** Todas las fragancias de la hoja, se publiquen o no (las usan los scripts de fotos) */
export const TODAS = FILAS.map((p) => ({ ...p, notes: NOTAS_OFICIALES[p.id],
  ...(FOTOS.includes(p.id) && { img: p.id }), ...(ORIGINALES[p.id] && { orig: ORIGINALES[p.id] }) }));

/** Las que el negocio quiere en la web, tengan ya foto y notas o no (las busca `npm run originales`) */
export const A_PUBLICAR = TODAS.filter((p) => p.publicar);

/** Las que se publican, en el orden de la hoja: marcadas, con foto original o propia, notas oficiales y descripción */
export const FRAGANCIAS = A_PUBLICAR.filter((p) => (p.orig || PROPIAS.includes(p.id)) && p.notes && p.desc);

/** Tramos del filtro de precio de /comprar/ (por el precio «desde»). Ajustarlos con los precios reales */
export const PRECIOS = [
  { id: 'hasta-150', name: 'Hasta 150 €', max: 150 },
  { id: '150-250', name: '150 a 250 €', min: 150, max: 250 },
  { id: '250-300', name: '250 a 300 €', min: 250, max: 300 },
  { id: 'mas-300', name: 'Más de 300 €', min: 300 }
];

/* Utilidades de datos (al compilar; el navegador usa virtual:tienda, ver vite.config.js) */
export const casaById = (id) => CASAS.find((c) => c.id === id);
export const fragById = (id) => FRAGANCIAS.find((p) => p.id === id);
export const familiaName = (id) => FAMILIAS.find((x) => x.id === id).name;
export const fragsDeCasa = (id) => FRAGANCIAS.filter((p) => p.casa === id);
export const priceFrom = (p) => Math.min(...p.sizes.map((s) => s[1]));
