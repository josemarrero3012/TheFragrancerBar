/* Cabecera: sombra al hacer scroll y menú móvil.
   La sección activa ya viene marcada en el HTML (aria-current="page"). */
import { $, $$, reduceMotion, EASE } from './utils.js';

export function initHeader() {
  const header = $('[data-header]');
  const onScroll = () => header.classList.toggle('is-scrolled', scrollY > 8);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  const btn = $('.burger'), menu = $('#menu-movil'), label = $('.burger__label');
  let t;
  const setOpen = (open) => {
    clearTimeout(t);
    btn.setAttribute('aria-expanded', String(open));
    label.textContent = open ? 'Cerrar' : 'Menú';
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) {
      // El menú empieza bajo la cabecera, esté o no a la vista la franja de avisos
      menu.style.top = `${header.getBoundingClientRect().bottom}px`;
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
  // Al volver con «Atrás» (bfcache) el menú no debe quedar abierto
  addEventListener('pageshow', () => { if (btn.getAttribute('aria-expanded') === 'true') setOpen(false); });
}
