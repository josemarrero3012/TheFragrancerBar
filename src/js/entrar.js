/* «Entra en la tienda» (portada): mientras se recorre la sección, el escenario se queda fijo y la cámara
   cruza la puerta de la fachada de Triana. Dos copias de la misma foto se acercan a distinto ritmo:
   el marco (piedra, rótulo y persiana, con el hueco de la puerta recortado) va mucho más deprisa que el
   interior, y eso da la profundidad. Al final se funde con la foto del interior y aparecen los textos.
   Un único rAF por scroll y solo transform y opacity. Con prefers-reduced-motion no se activa. */
import { $, $$, reduceMotion, clamp01 } from './utils.js';

const ease = (t) => t * t * (3 - 2 * t);               // suave al empezar y al acabar
const seg = (p, a, b) => clamp01((p - a) / (b - a));   // progreso dentro de un tramo

export function initEntrar() {
  const sec = $('[data-entrar]');
  if (!sec || reduceMotion) return;
  const stage = $('.entrar__stage', sec), fondo = $('.entrar__fondo', sec), marco = $('.entrar__marco', sec);
  const dentro = $('.entrar__dentro', sec), pasos = $$('[data-paso]', sec);
  sec.classList.add('is-live');

  const textos = $('.entrar__textos', sec), cab = $('[data-header]');
  let base = 1, fin = 2.6, dy = 0, ticking = false, paso = -1;
  // Al empezar, la fachada se ve entera, como desde la acera, encima del primer texto;
  // dy la sube a su sitio y se va a 0 a medida que la cámara se acerca a la puerta
  function measure() {
    const W = stage.clientWidth, H = stage.clientHeight, top = (cab ? cab.offsetHeight : 72) + 20;
    const free = H - top - textos.offsetHeight - 8;
    base = Math.min(W * .92 / fondo.offsetWidth, free / fondo.offsetHeight);
    dy = top + free / 2 - H / 2;
    // El interior (recortado al hueco de la puerta) tiene que llenar la pantalla cuando el marco desaparece;
    // en un móvil vertical eso pide acercarse más que en escritorio
    // (el punto de fuga está a 35 % del ancho de cada lado de la puerta y a 23,5 % del alto de su borde de arriba)
    fin = Math.max(2.6, 1.06 * Math.max(W / 2 / (.35 * fondo.offsetWidth), H / 2 / (.235 * fondo.offsetHeight)) / base);
  }

  function update() {
    ticking = false;
    const r = sec.getBoundingClientRect(), span = r.height - innerHeight;
    const p = clamp01(-r.top / span);
    const a = ease(seg(p, .06, .6));                    // acercamiento por la puerta
    const y = dy * (1 - ease(seg(p, .06, .3)));
    const sm = base * (1 + 9 * a * a);
    marco.style.transform = `translateY(${y}px) scale(${sm})`;
    marco.style.opacity = String(1 - seg(p, .46, .56));
    const f = ease(seg(p, .06, .48));                   // el interior llena la pantalla antes de que se vaya el marco
    fondo.style.transform = `translateY(${y}px) scale(${Math.min(sm, base * (1 + (fin - 1) * (.5 * f + .5 * f * f)))})`; // nunca por delante del marco
    const d = ease(seg(p, .565, .615));                 // ya dentro: la foto del interior
    dentro.style.opacity = String(d);
    dentro.style.transform = `scale(${1.18 - .14 * ease(seg(p, .56, 1))})`;
    // Un golpe de luz cálida, como al cruzar el umbral, tapa el cambio de foto
    stage.style.setProperty('--luz', Math.sin(Math.PI * seg(p, .5, .68)).toFixed(3));
    stage.style.setProperty('--velo', seg(p, .2, .34).toFixed(3));
    stage.style.setProperty('--p', p.toFixed(4));
    const n = p < .1 ? 0 : p < .3 ? -1 : p < .6 ? 1 : 2;
    if (n !== paso) { paso = n; pasos.forEach((el, i) => el.classList.toggle('is-on', i === n)); }
  }

  const request = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  const refresh = () => { measure(); update(); };
  refresh();
  addEventListener('scroll', request, { passive: true });
  addEventListener('resize', refresh);
  fondo.addEventListener('load', refresh, { once: true });
}
