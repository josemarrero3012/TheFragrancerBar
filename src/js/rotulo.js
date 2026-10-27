/* Portada: el nombre grande del hero (el rótulo) encoge al bajar hasta quedarse en el logo de la cabecera.
   Se mide dónde están los dos y, entre medias, el rótulo se desplaza y se escala con transform, sin mover nada más.
   Su borde de abajo sube al ritmo de la página, así que nunca pisa la foto. Al llegar se queda transparente
   y el logo de la cabecera, que es idéntico y está justo debajo, toma el relevo (y al subir, al revés).
   Con prefers-reduced-motion no encoge: el logo aparece cuando el rótulo ha pasado bajo la cabecera.
   Sin JavaScript se ven los dos. */
import { $, reduceMotion, clamp01 } from './utils.js';

export function initRotulo() {
  const rotulo = $('[data-rotulo]'), header = $('[data-header]');
  if (!rotulo || !header) return;
  const lockup = rotulo.firstElementChild, mark = $('.logo__mark', lockup), logo = $('.logo__mark', header);
  let g = null, ticking = false;

  // Posiciones en reposo: arriba del todo de la página y sin transformar
  function measure() {
    lockup.style.transform = '';
    const a = mark.getBoundingClientRect(), b = logo.getBoundingClientRect(), box = lockup.getBoundingClientRect();
    const top = a.top + scrollY, h = box.bottom - a.top, s = b.width / a.width, d = top - b.top;
    lockup.style.transformOrigin = `${a.left - box.left}px ${a.top - box.top}px`;
    // end: lo que hay que bajar para que el rótulo llegue al logo con su borde de abajo pegado a la foto
    g = { s, d, dx: b.left - a.left, end: reduceMotion ? top + h - header.offsetHeight : d + h * (1 - s) };
  }

  function update() {
    ticking = false;
    const y = Math.max(0, scrollY), p = clamp01(y / g.end), docked = p >= 1;
    header.classList.toggle('is-docked', docked);
    rotulo.classList.toggle('is-docked', docked);
    if (!reduceMotion) lockup.style.transform = p > 0 && !docked ? `translate(${g.dx * p}px, ${y - p * g.d}px) scale(${1 + (g.s - 1) * p})` : '';
  }

  const request = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  const refresh = () => { measure(); update(); };
  if (!reduceMotion) rotulo.classList.add('is-morph');
  refresh();
  addEventListener('scroll', request, { passive: true });
  addEventListener('resize', refresh);
  // La letra definitiva cambia las medidas
  document.fonts.ready.then(refresh);
}
