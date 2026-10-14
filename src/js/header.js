/* Cabecera: sombra al hacer scroll, sección activa en el menú y menú móvil */
import { $, $$, reduceMotion, EASE } from './utils.js';

export function initHeader() {
  const header = $('[data-header]');
  const onScroll = () => header.classList.toggle('is-scrolled', scrollY > 8);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  const links = $$('.nav a');
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) links.forEach((a) => a.setAttribute('aria-current', String(a.hash === `#${e.target.id}`)));
  }), { rootMargin: '-45% 0px -50% 0px' });
  $$('main section[id]').forEach((s) => io.observe(s));

  const btn = $('.burger'), menu = $('#menu-movil'), label = $('.burger__label');
  let t;
  const setOpen = (open) => {
    clearTimeout(t);
    btn.setAttribute('aria-expanded', String(open));
    label.textContent = open ? 'Cerrar' : 'Menú';
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) {
      menu.hidden = false; menu.getBoundingClientRect(); // fuerza el estilo inicial para que el fundido se vea
      requestAnimationFrame(() => menu.classList.add('is-open')); $('a', menu).focus({ preventScroll: true });
      if (!reduceMotion) $$('a', menu).forEach((a, i) => a.animate([{ opacity: 0, transform: 'translateY(14px)' }, { opacity: 1, transform: 'none' }],
        { duration: 500, delay: i * 50, easing: EASE, fill: 'backwards' }));
    }
    else { menu.classList.remove('is-open'); t = setTimeout(() => { menu.hidden = true; }, 350); }
  };
  btn.addEventListener('click', () => setOpen(btn.getAttribute('aria-expanded') !== 'true'));
  $$('a', menu).forEach((a) => a.addEventListener('click', () => setOpen(false)));
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && btn.getAttribute('aria-expanded') === 'true') { setOpen(false); btn.focus(); } });
  // Si se agranda la ventana con el menú abierto, se cierra para no dejar el scroll bloqueado
  matchMedia('(min-width: 960px)').addEventListener('change', (e) => { if (e.matches && btn.getAttribute('aria-expanded') === 'true') setOpen(false); });
}
