/* Catálogo (/comprar/): búsqueda, filtros por casa, familia y precio, orden y «Ver más».
   Las fichas ya vienen todas en el HTML (las lee Google y se ven sin JavaScript); aquí solo se
   muestran, ocultan y reordenan, y se enseñan de PAGE en PAGE para que la página no se haga eterna.
   Los filtros se reflejan en la URL (?casa=xerjoff&familia=ambar&precio=150-250&q=…&orden=…) para
   poder compartirlos, y lo que se lleva visto se recuerda al volver a la página con «Atrás».
   En las páginas de casa, initMore() pagina igual su lista de fragancias. */
import { $, $$ } from './utils.js';

const PAGE = 24;
const norm = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
const SORTS = {
  destacadas: (a, b) => a.i - b.i,
  'precio-asc': (a, b) => a.price - b.price || a.i - b.i,
  'precio-desc': (a, b) => b.price - a.price || a.i - b.i,
  nombre: (a, b) => a.name.localeCompare(b.name, 'es'),
  nuevas: (a, b) => b.year - a.year || a.i - b.i
};
const fr = (k) => (k === 1 ? 'fragancia' : 'fragancias');

/** «Ver más» de una rejilla: enseña las fichas de `items` de PAGE en PAGE.
    show(items) las coloca; more() enseña la tanda siguiente y lleva el foco a la primera nueva */
function pager(root, onChange = () => {}) {
  const box = $('[data-more]', root), btn = $('[data-more-btn]', root), status = $('[data-more-status]', root);
  let list = [], shown = PAGE;
  const render = () => {
    list.forEach((li, i) => li.classList.toggle('is-later', i >= shown));
    const rest = list.length - Math.min(shown, list.length);
    box.hidden = rest <= 0;
    status.textContent = `Viendo ${Math.min(shown, list.length)} de ${list.length} ${fr(list.length)}`;
    btn.textContent = `Ver ${Math.min(PAGE, rest)} más`;
    onChange(shown);
  };
  btn.addEventListener('click', () => {
    const first = list[shown];
    shown += PAGE; render();
    if (first) $('.product__name a', first).focus({ preventScroll: true });
  });
  return {
    show(items, keep = PAGE) { list = items; shown = Math.max(PAGE, keep); render(); }
  };
}

/** Páginas de casa: la lista de fragancias, con «Ver más» si tiene más de PAGE */
export function initMore() {
  $$('[data-paged]').forEach((root) => {
    if (root.closest('[data-shop]')) return;
    pager(root).show($$('.product', root));
  });
}

export function initShop() {
  const root = $('[data-shop]'); if (!root) return;
  const grid = $('[data-products]', root), q = $('[data-q]', root), casa = $('[data-casa-filter]', root);
  const precio = $('[data-precio-filter]', root), sort = $('[data-sort]', root);
  const chips = $$('[data-familia-filter]', root), count = $('[data-count]', root), empty = $('[data-empty]', root);
  // Texto buscable de cada ficha: nombre, casa, familia y notas
  const items = $$('.product', grid).map((li, i) => ({
    li, i, price: Number(li.dataset.price), year: Number(li.dataset.year), name: li.dataset.name,
    casa: li.dataset.casa, familia: li.dataset.familia,
    text: norm(`${li.dataset.name} ${li.dataset.notes} ${li.textContent}`)
  }));
  // Tramos de precio: los da cada <option> (data-min y data-max)
  const RANGOS = Object.fromEntries([...precio.options].filter((o) => o.value)
    .map((o) => [o.value, [Number(o.dataset.min || 0), Number(o.dataset.max || Infinity)]]));
  const valid = (sel, v) => ([...sel.options].some((o) => o.value === v && v) ? v : '');

  const params = new URLSearchParams(location.search);
  const state = {
    q: params.get('q') || '',
    casa: valid(casa, params.get('casa')),
    familia: chips.some((c) => c.dataset.familiaFilter === params.get('familia')) ? params.get('familia') : '',
    precio: valid(precio, params.get('precio')),
    orden: SORTS[params.get('orden')] ? params.get('orden') : 'destacadas'
  };
  q.value = state.q; casa.value = state.casa; precio.value = state.precio; sort.value = state.orden;

  const pages = pager(root, (shown) => history.replaceState({ ...history.state, mostrar: shown }, ''));

  /* Cada filtro, comprobado por separado para poder contar las opciones de los demás */
  const TESTS = {
    casa: (it) => !state.casa || it.casa === state.casa,
    familia: (it) => !state.familia || it.familia === state.familia,
    precio: (it) => { if (!state.precio) return true; const [min, max] = RANGOS[state.precio]; return it.price >= min && it.price < max; }
  };
  let words = [];
  const passes = (it, except) => Object.entries(TESTS).every(([k, t]) => k === except || t(it)) && words.every((w) => it.text.includes(w));

  /* Junto a cada opción, cuántas fragancias saldrían al elegirla (con el resto de filtros como están) */
  function facetCounts() {
    const cuenta = (k, match) => items.filter((it) => passes(it, k) && match(it)).length;
    chips.forEach((c) => {
      const v = c.dataset.familiaFilter, n = cuenta('familia', (it) => !v || it.familia === v);
      $('[data-n]', c).textContent = n;
      c.disabled = !n && v !== state.familia;
    });
    [...casa.options].forEach((o) => {
      const n = cuenta('casa', (it) => !o.value || it.casa === o.value);
      o.textContent = `${o.dataset.label} (${n})`;
      o.disabled = !n && o.value !== state.casa;
    });
    [...precio.options].forEach((o) => {
      const [min, max] = RANGOS[o.value] || [0, Infinity];
      const n = cuenta('precio', (it) => it.price >= min && it.price < max);
      o.textContent = `${o.dataset.label} (${n})`;
      o.disabled = !n && o.value !== state.precio;
    });
  }

  function apply({ keep = PAGE } = {}) {
    words = norm(state.q).split(/\s+/).filter(Boolean);
    const visibles = new Set(items.filter((it) => passes(it)));
    items.forEach((it) => it.li.classList.toggle('is-hidden', !visibles.has(it)));
    const ordered = [...items].sort(SORTS[state.orden]);
    grid.append(...ordered.map((it) => it.li));
    pages.show(ordered.filter((it) => visibles.has(it)).map((it) => it.li), keep);

    chips.forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.familiaFilter === state.familia)));
    facetCounts();
    const n = visibles.size;
    count.textContent = n === items.length ? `${n} ${fr(n)}` : `${n} de ${items.length} ${fr(items.length)}`;
    empty.hidden = n > 0;

    const p = new URLSearchParams();
    if (state.casa) p.set('casa', state.casa);
    if (state.familia) p.set('familia', state.familia);
    if (state.precio) p.set('precio', state.precio);
    if (state.q) p.set('q', state.q);
    if (state.orden !== 'destacadas') p.set('orden', state.orden);
    history.replaceState(history.state, '', `${location.pathname}${p.size ? `?${p}` : ''}`);
  }

  let t;
  q.addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => { state.q = q.value; apply(); }, 120); });
  casa.addEventListener('change', () => { state.casa = casa.value; apply(); });
  precio.addEventListener('change', () => { state.precio = precio.value; apply(); });
  sort.addEventListener('change', () => { state.orden = sort.value; apply(); });
  chips.forEach((c) => c.addEventListener('click', () => { state.familia = c.dataset.familiaFilter; apply(); }));
  $('[data-reset-filters]', root).addEventListener('click', () => {
    Object.assign(state, { q: '', casa: '', familia: '', precio: '' }); q.value = ''; casa.value = ''; precio.value = ''; apply(); q.focus();
  });
  // Al volver con «Atrás», las mismas fichas que se llevaban vistas
  apply({ keep: history.state?.mostrar || PAGE });
}
