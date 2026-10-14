/* Casas: pestañas con el nombre de cada casa + imagen editorial y descripción.
   En escritorio es una lista vertical; en móvil, una tira horizontal sobre la imagen. */
import { SITE } from '../data/site.js';
import { $, $$, reduceMotion, EASE, casaById, asset } from './utils.js';

export function initCasas() {
  const list = $('[data-brands]');
  list.innerHTML = SITE.casas.map((c) => `
    <li role="presentation"><button class="casa" type="button" role="tab" id="tab-${c.id}" data-brand="${c.id}" aria-selected="false" aria-controls="casa-panel">
      <span class="casa__name">${c.name}</span><span class="casa__city">${c.city}</span>
    </button></li>`).join('');

  // Precarga ligera de las imágenes editoriales
  const wide = matchMedia('(min-width: 960px)').matches;
  const src = (c) => asset(`img/casas/${c.img}-${wide ? 1000 : 560}.webp`);
  SITE.casas.forEach((c) => { const i = new Image(); i.src = src(c); });

  const box = $('[data-brand-img]');
  let current = null;
  const select = (id, focus = false) => {
    if (id === current) return;
    const first = current === null;
    current = id;
    const c = casaById(id);
    $$('.casa', list).forEach((b) => {
      const on = b.dataset.brand === id;
      b.setAttribute('aria-selected', String(on)); b.tabIndex = on ? 0 : -1;
      if (on && focus) b.focus({ preventScroll: true });
      // En la tira horizontal (móvil) se centra la casa activa sin mover la página
      if (on && list.scrollWidth > list.clientWidth) {
        list.scrollTo({ left: b.offsetLeft - (list.clientWidth - b.offsetWidth) / 2, behavior: reduceMotion || first ? 'auto' : 'smooth' });
      }
    });
    $('.casas__panel').setAttribute('aria-labelledby', `tab-${id}`);
    const img = new Image();
    img.src = src(c); img.alt = c.alt; img.width = 1000; img.height = 1250;
    const old = $$('img', box);
    img.classList.add('fade');
    box.appendChild(img);
    const show = () => { img.getBoundingClientRect(); img.classList.add('is-loaded'); old.forEach((o) => { o.classList.add('is-leaving'); setTimeout(() => o.remove(), 600); }); };
    img.decode ? img.decode().then(show, show) : img.addEventListener('load', show, { once: true });

    $('[data-brand-origin]').textContent = c.city;
    $('[data-brand-desc]').textContent = c.desc;
    const has = SITE.seleccion.some((p) => p.casa === id);
    $('[data-brand-icons]').innerHTML = `Emblemáticas: ${c.icons.join(', ')}.` +
      (has ? ` <a class="link" href="#seleccion" data-filter-link="${id}">Ver en la selección</a>` : '');
    if (!reduceMotion && !first) $$('.casas__caption > p').forEach((p, i) => {
      p.getAnimations().forEach((a) => a.cancel());
      p.animate([{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }], { duration: 550, delay: i * 60, easing: EASE, fill: 'backwards' });
    });
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
  select(SITE.casas[0].id);
}
