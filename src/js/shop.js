/* Catálogo (/comprar/): búsqueda, filtro por casa y familia, y orden.
   Las fichas ya vienen en el HTML; aquí solo se muestran, ocultan y reordenan.
   Los filtros se reflejan en la URL (?casa=xerjoff&familia=ambar&q=…&orden=…) para poder compartirlos. */
import { CASAS, FAMILIAS } from '../data/catalogo.js';
import { $, $$ } from './utils.js';

const norm = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
const SORTS = {
  destacadas: (a, b) => a.i - b.i,
  'precio-asc': (a, b) => a.price - b.price || a.i - b.i,
  'precio-desc': (a, b) => b.price - a.price || a.i - b.i,
  nombre: (a, b) => a.name.localeCompare(b.name, 'es'),
  nuevas: (a, b) => b.year - a.year || a.i - b.i
};

export function initShop() {
  const root = $('[data-shop]'); if (!root) return;
  const grid = $('[data-products]', root), q = $('[data-q]', root), casa = $('[data-casa-filter]', root), sort = $('[data-sort]', root);
  const chips = $$('[data-familia-filter]', root), count = $('[data-count]', root), empty = $('[data-empty]', root);
  // Texto buscable de cada ficha: nombre, casa, familia y notas
  const items = $$('.product', grid).map((li, i) => ({
    li, i, price: Number(li.dataset.price), year: Number(li.dataset.year), name: li.dataset.name,
    text: norm(`${li.dataset.name} ${li.dataset.notes} ${li.textContent}`)
  }));

  const params = new URLSearchParams(location.search);
  const state = {
    q: params.get('q') || '',
    casa: CASAS.some((c) => c.id === params.get('casa')) ? params.get('casa') : '',
    familia: FAMILIAS.some((f) => f.id === params.get('familia')) ? params.get('familia') : '',
    orden: SORTS[params.get('orden')] ? params.get('orden') : 'destacadas'
  };
  q.value = state.q; casa.value = state.casa; sort.value = state.orden;

  function apply() {
    const words = norm(state.q).split(/\s+/).filter(Boolean);
    let n = 0;
    items.forEach((it) => {
      const ok = (!state.casa || it.li.dataset.casa === state.casa) && (!state.familia || it.li.dataset.familia === state.familia) &&
        words.every((w) => it.text.includes(w));
      it.li.classList.toggle('is-hidden', !ok);
      if (ok) n++;
    });
    grid.append(...[...items].sort(SORTS[state.orden]).map((it) => it.li));
    chips.forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.familiaFilter === state.familia)));
    count.textContent = n === items.length ? `${n} fragancias` : `${n} de ${items.length} fragancias`;
    empty.hidden = n > 0;

    const p = new URLSearchParams();
    if (state.casa) p.set('casa', state.casa);
    if (state.familia) p.set('familia', state.familia);
    if (state.q) p.set('q', state.q);
    if (state.orden !== 'destacadas') p.set('orden', state.orden);
    history.replaceState(null, '', `${location.pathname}${p.size ? `?${p}` : ''}`);
  }

  let t;
  q.addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => { state.q = q.value; apply(); }, 120); });
  casa.addEventListener('change', () => { state.casa = casa.value; apply(); });
  sort.addEventListener('change', () => { state.orden = sort.value; apply(); });
  chips.forEach((c) => c.addEventListener('click', () => { state.familia = c.dataset.familiaFilter; apply(); }));
  $('[data-reset-filters]', root).addEventListener('click', () => {
    Object.assign(state, { q: '', casa: '', familia: '' }); q.value = ''; casa.value = ''; apply(); q.focus();
  });
  apply();
}
