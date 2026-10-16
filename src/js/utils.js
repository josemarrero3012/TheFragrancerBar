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
export const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Ruta dentro de la web, respetando la base del despliegue (p. ej. GitHub Pages) */
export const asset = (path) => `${import.meta.env.BASE_URL}${path}`;

export const store = {
  get(k, f) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : f; } catch { return f; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* sin almacenamiento */ } }
};

export const whatsappHref = (text) => `https://wa.me/${SITE.contact.whatsapp}?text=${encodeURIComponent(text)}`;

/** Fecha y hora en Canarias, sea cual sea la zona del visitante */
export function canaryNow(date = new Date()) {
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-GB', {
    timeZone: SITE.timezone, year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hour12: false, weekday: 'short'
  }).formatToParts(date).map((x) => [x.type, x.value]));
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
