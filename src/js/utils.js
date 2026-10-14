/* Utilidades compartidas: selección del DOM, tiempo en Canarias, almacenamiento local */
import { SITE, MOTION } from '../data/site.js';

export const $ = (s, el = document) => el.querySelector(s);
export const $$ = (s, el = document) => [...el.querySelectorAll(s)];
export const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
export const fullMotion = !reduceMotion && MOTION.mode !== 'sutil';
export const EASE = 'cubic-bezier(.25,.6,.2,1)';
export const clamp01 = (n) => Math.min(1, Math.max(0, n));
export const DAYS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
export const toMin = (t) => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
export const casaById = (id) => SITE.casas.find((c) => c.id === id);
export const productById = (id) => SITE.seleccion.find((p) => p.id === id);

/** Ruta a un archivo de /public, respetando la base del despliegue (p. ej. GitHub Pages) */
export const asset = (path) => `${import.meta.env.BASE_URL}${path}`;

export const store = {
  get(k, f) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : f; } catch { return f; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* sin almacenamiento */ } }
};

/** Hora actual en Canarias, sea cual sea la zona del visitante */
export function canaryNow() {
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-GB', {
    timeZone: SITE.timezone, year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hour12: false, weekday: 'short'
  }).formatToParts(new Date()).map((x) => [x.type, x.value]));
  const hour = Number(p.hour) % 24;
  return { day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(p.weekday), hour, minute: Number(p.minute),
    mins: hour * 60 + Number(p.minute), iso: `${p.year}-${p.month}-${p.day}` };
}

/** Marca las imágenes como cargadas para el fundido suave */
export function fadeIn(img) {
  img.classList.add('fade');
  if (img.complete && img.naturalWidth) img.classList.add('is-loaded');
  else img.addEventListener('load', () => img.classList.add('is-loaded'), { once: true });
}
