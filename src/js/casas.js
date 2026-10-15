/* Casas: pestañas con el nombre de cada casa + imagen editorial y descripción.
   Pestañas, paneles y la primera imagen ya vienen en el HTML (src/data/html.js);
   aquí se cambia de casa y se carga su imagen.
   En escritorio es una lista vertical; en móvil, una tira horizontal sobre la imagen. */
import { SITE } from '../data/site.js';
import { $, $$, reduceMotion, EASE, casaById, asset, fadeIn } from './utils.js';

export function initCasas() {
  const list = $('[data-brands]'), box = $('[data-brand-img]');

  // Precarga ligera de las imágenes editoriales
  const wide = matchMedia('(min-width: 960px)').matches;
  const src = (c) => asset(`img/casas/${c.img}-${wide ? 1000 : 560}.webp`);
  SITE.casas.slice(1).forEach((c) => { const i = new Image(); i.src = src(c); });
  $$('img', box).forEach(fadeIn);

  let current = $('[aria-selected="true"]', list).dataset.brand;
  const select = (id, focus = false) => {
    if (id === current) return;
    current = id;
    const c = casaById(id);
    $$('.casa', list).forEach((b) => {
      const on = b.dataset.brand === id;
      b.setAttribute('aria-selected', String(on)); b.tabIndex = on ? 0 : -1;
      if (on && focus) b.focus({ preventScroll: true });
      // En la tira horizontal (móvil) se centra la casa activa sin mover la página
      if (on && list.scrollWidth > list.clientWidth) {
        list.scrollTo({ left: b.offsetLeft - (list.clientWidth - b.offsetWidth) / 2, behavior: reduceMotion ? 'auto' : 'smooth' });
      }
    });

    const img = new Image();
    img.src = src(c); img.alt = c.alt; img.width = 1000; img.height = 1250;
    const old = $$('img', box);
    img.classList.add('fade');
    box.appendChild(img);
    const show = () => { img.getBoundingClientRect(); img.classList.add('is-loaded'); old.forEach((o) => { o.classList.add('is-leaving'); setTimeout(() => o.remove(), 600); }); };
    img.decode ? img.decode().then(show, show) : img.addEventListener('load', show, { once: true });

    const panel = $(`#casa-${id}`);
    $$('[role="tabpanel"]', list.closest('.casas__grid')).forEach((p) => { p.hidden = p !== panel; });
    if (!reduceMotion) $$('p', panel).forEach((p, i) =>
      p.animate([{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }], { duration: 550, delay: i * 60, easing: EASE, fill: 'backwards' }));
  };

  list.addEventListener('click', (e) => { const b = e.target.closest('[data-brand]'); if (b) select(b.dataset.brand); });
  list.addEventListener('mouseover', (e) => { const b = e.target.closest('[data-brand]'); if (b && matchMedia('(hover: hover)').matches) select(b.dataset.brand); });
  list.addEventListener('keydown', (e) => {
    const i = SITE.casas.findIndex((c) => c.id === current);
    const k = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
    if (k) { e.preventDefault(); select(SITE.casas[(i + k + SITE.casas.length) % SITE.casas.length].id, true); }
  });
  document.addEventListener('click', (e) => {
    const j = e.target.closest('[data-brand-jump]'); if (j) select(j.dataset.brandJump);
  });
}
