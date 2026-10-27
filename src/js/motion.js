/* Movimiento · Web Animations API + IntersectionObserver.
   Con prefers-reduced-motion no se crea ninguna animación. */
import { MOTION } from '../data/site.js';
import { $, $$, reduceMotion, fullMotion, EASE, clamp01 } from './utils.js';

/* Entrada de la portada: el nombre sale palabra a palabra de su ranura, la foto de la fachada se descubre
   de abajo arriba, como al subir la persiana de la tienda, y los datos y la franja de casas llegan después
   (en escritorio la franja también está en la primera pantalla) */
function introHero() {
  const hero = $('.hero');
  if (!hero) return;
  const soft = !fullMotion || matchMedia('(max-width: 959px)').matches;
  const up = soft ? [{ opacity: 0 }, { opacity: 1 }] : [{ opacity: 0, transform: 'translateY(16px)' }, { opacity: 1, transform: 'none' }];
  $$('.hero__w > *', hero).forEach((el, i) => el.animate([{ transform: 'translateY(180%)' }, { transform: 'none' }],
    { duration: soft ? 1000 : 1400, delay: 150 + i * 130, easing: 'cubic-bezier(.2,.7,.1,1)', fill: 'backwards' }));
  $('.hero__rotulo .logo__sub', hero).animate(up, { duration: 1000, delay: 650, easing: EASE, fill: 'backwards' });
  const photo = $('.hero__photo', hero);
  photo.animate([{ clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0)' }], { duration: soft ? 1100 : 1500, delay: 300, easing: 'cubic-bezier(.77,0,.18,1)', fill: 'backwards' });
  if (!soft) $('img', photo).animate([{ transform: 'scale(1.12)' }, { transform: 'none' }], { duration: 2400, delay: 300, easing: 'cubic-bezier(.2,.7,.1,1)', fill: 'backwards' });
  // Los datos uno a uno (en móvil las columnas no tienen caja propia: van sus hijos)
  [...$$('.hero__col > *', hero), $('.hero__also', hero), ...$$('[data-brandline] > li')].filter(Boolean).forEach((el, i) => el.animate(up, { duration: 1000, delay: 900 + i * 70, easing: EASE, fill: 'backwards' }));
  document.documentElement.classList.remove('is-intro');
}

/* Revelado al hacer scroll: data-reveal="up|fade|clip" y data-stagger (hijos directos en cascada).
   Cada animación se crea en pausa (fill: backwards mantiene el estado inicial) y se lanza una sola vez. */
const REVEAL = {
  up: { kf: [{ opacity: 0, transform: 'translateY(28px)' }, { opacity: 1, transform: 'none' }], duration: 1000 },
  fade: { kf: [{ opacity: 0 }, { opacity: 1 }], duration: 1000 },
  clip: { kf: [{ clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0)' }], duration: 1400 }
};
const pendingReveal = new Map();
let revealIO = null;

function revealTargets(el) {
  if (!el.hasAttribute('data-stagger')) return [[el, Number(el.dataset.revealDelay) || 0]];
  return [...el.children].filter((c) => !c.hasAttribute('data-reveal')).map((c, i) => [c, i * 90]);
}
function playReveal(el) {
  const anims = pendingReveal.get(el); if (!anims) return;
  pendingReveal.delete(el); revealIO.unobserve(el);
  anims.forEach((a) => a.play());
}
/** Quita el revelado pendiente sin animarlo (p. ej. cuando el filtro toma el control) */
export function settleReveal(el) {
  const anims = pendingReveal.get(el); if (!anims) return;
  pendingReveal.delete(el); revealIO.unobserve(el);
  anims.forEach((a) => a.cancel());
}

function initReveal() {
  revealIO = new IntersectionObserver((es) => es.forEach((e) => {
    // También lo que ya quedó por encima (recarga a mitad de página)
    if (e.isIntersecting || e.boundingClientRect.bottom < 0) playReveal(e.target);
  }), { rootMargin: '0px 0px -8% 0px' });
  // Lo que ya está a la vista al cargar no se anima: la transición entre páginas hace de entrada
  const fold = innerHeight * .9;
  $$('[data-reveal]').forEach((el) => {
    if (scrollY === 0 && el.getBoundingClientRect().top < fold) return;
    const r = REVEAL[el.dataset.reveal] || REVEAL.up;
    const anims = revealTargets(el).map(([t, delay]) => {
      const a = t.animate(r.kf, { duration: r.duration, delay, easing: EASE, fill: 'backwards' });
      a.pause();
      return a;
    });
    pendingReveal.set(el, anims);
    revealIO.observe(el);
  });
  // Si se llega con el teclado a algo aún oculto, se muestra
  document.addEventListener('focusin', (e) => {
    for (let el = e.target.closest('[data-reveal]'); el; el = el.parentElement && el.parentElement.closest('[data-reveal]')) playReveal(el);
  });
}

/* Progreso de la historia, en un único rAF por scroll */
function initScrollFx() {
  const tl = $('.timeline'), steps = tl ? $$('li', tl) : [];
  if (!tl) return;

  let ticking = false;
  const update = () => {
    ticking = false;
    const vh = innerHeight;
    const r = tl.getBoundingClientRect(), mark = vh * .62;
    tl.style.setProperty('--tl', clamp01((mark - r.top) / r.height).toFixed(4));
    steps.forEach((li) => li.classList.toggle('is-reached', li.getBoundingClientRect().top + 10 <= mark));
  };
  const request = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  addEventListener('scroll', request, { passive: true });
  addEventListener('resize', request);
  update();
}

/* Opcional: franja de marcas en marquesina continua (lista duplicada, -50%) */
function initMarquee() {
  const list = $('[data-brandline]'); if (!list) return;
  const clones = [...list.children].map((li) => {
    const c = li.cloneNode(true);
    c.setAttribute('aria-hidden', 'true'); $('a', c).tabIndex = -1;
    return c;
  });
  list.append(...clones);
  list.closest('.brandline').classList.add('brandline--marquee');
  list.removeAttribute('data-stagger'); list.dataset.reveal = 'fade';
}

export function initMotion() {
  if (reduceMotion) return;
  if (MOTION.marquee) initMarquee();
  introHero();
  initReveal();
  initScrollFx();
}
