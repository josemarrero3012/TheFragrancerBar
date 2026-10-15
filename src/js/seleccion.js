/* Selección: rejilla de fragancias, filtros por familia o por casa y «Tu lista» (guardada en el navegador) */
import { SITE } from '../data/site.js';
import { $, $$, reduceMotion, EASE, casaById, productById, asset, store, fadeIn } from './utils.js';
import { settleReveal } from './motion.js';

const state = { picks: store.get('tfb-picks', []).filter(productById), filter: { type: 'familia', value: 'todas' } };

/** Fragancias guardadas, para el formulario de contacto */
export const pickedProducts = () => state.picks.map(productById);

function renderProducts() {
  const items = SITE.seleccion.map((p, i) => {
    const c = casaById(p.casa);
    const fam = SITE.familias.find((f) => f.id === p.familia).name;
    const media = p.editorial
      ? `<figure class="product__media product__media--editorial"><img src="${asset(p.editorial)}" width="560" height="700" loading="lazy" alt="${c.name} ${p.name}, imagen de campaña"></figure>`
      : `<figure class="product__media"><img src="${asset(`img/productos/${p.img}-400.webp`)}" srcset="${asset(`img/productos/${p.img}-400.webp`)} 400w, ${asset(`img/productos/${p.img}-800.webp`)} 800w" sizes="(min-width: 1100px) 22vw, (min-width: 760px) 30vw, 46vw" width="800" height="1000" loading="lazy" alt="Frasco de ${c.name} ${p.name}"></figure>`;
    return `<li class="product" data-id="${p.id}" data-familia="${p.familia}" data-casa="${p.casa}" data-reveal="up" data-reveal-delay="${(i % 4) * 90}">
      ${media}
      <div class="product__body">
        <p class="product__brand">${c.name}</p>
        <h3 class="product__name" id="name-${p.id}">${p.name}</h3>
        <p class="product__notes">${p.notes}</p>
        <p class="product__family">${fam}</p>
        <button class="product__try" type="button" data-pick="${p.id}" aria-pressed="false" aria-describedby="name-${p.id}">Guardar en mi lista</button>
      </div>
    </li>`;
  }).join('');
  const more = `<li class="product product--more" data-always data-reveal="up" data-reveal-delay="${(SITE.seleccion.length % 4) * 90}">
      <div class="product__media"><p>Y muchas más casas y fragancias en tienda.</p><a class="link" href="#contacto">Pregúntanos por la tuya</a></div>
    </li>`;
  $('[data-products]').innerHTML = items + more;
  $$('[data-products] img').forEach(fadeIn);
}

function renderFilters() {
  const f = state.filter;
  const brandChip = f.type === 'casa' ? `<button class="chip" type="button" data-filter-casa="${f.value}" aria-pressed="true" aria-label="${casaById(f.value).name}, quitar filtro">${casaById(f.value).name} <span aria-hidden="true">✕</span></button>` : '';
  $('[data-filters]').innerHTML = brandChip + [{ id: 'todas', name: 'Todas' }, ...SITE.familias].map((x) =>
    `<button class="chip" type="button" data-filter="${x.id}" aria-pressed="${f.type === 'familia' && f.value === x.id}">${x.name}</button>`).join('');
}

function applyFilter(type, value) {
  state.filter = { type, value };
  renderFilters();
  const match = (li) => li.hasAttribute('data-always') || value === 'todas' || li.dataset[type] === value;
  const items = $$('.product');
  if (!reduceMotion) return animateFilter(items, match);
  items.forEach((li) => li.classList.toggle('is-hidden', !match(li)));
}

/* Los que salen se funden; después se filtra y los visibles entran en cascada */
let filterRun = 0;
function animateFilter(items, match) {
  const run = ++filterRun;
  items.forEach((li) => { settleReveal(li); li.getAnimations().forEach((a) => a.cancel()); });
  const leaving = items.filter((li) => !li.classList.contains('is-hidden') && !match(li));
  leaving.forEach((li) => li.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 280, easing: EASE, fill: 'forwards' }));
  setTimeout(() => {
    if (run !== filterRun) return;
    let n = 0;
    items.forEach((li) => {
      const ok = match(li);
      li.getAnimations().forEach((a) => a.cancel());
      li.classList.toggle('is-hidden', !ok);
      if (ok) li.animate([{ opacity: 0, transform: 'translateY(16px)' }, { opacity: 1, transform: 'none' }],
        { duration: 650, delay: n++ * 45, easing: EASE, fill: 'backwards' });
    });
  }, leaving.length ? 280 : 0);
}

export function togglePick(id) {
  const i = state.picks.indexOf(id);
  if (i > -1) state.picks.splice(i, 1); else state.picks.push(id);
  store.set('tfb-picks', state.picks);
  syncPicks();
  const added = i === -1 && !reduceMotion && $('[data-picks] li:last-child');
  if (added) added.animate([{ opacity: 0, transform: 'translateX(-10px)' }, { opacity: 1, transform: 'none' }], { duration: 450, easing: EASE, fill: 'backwards' });
  // El contador de la cabecera confirma que se ha guardado
  if (i === -1 && !reduceMotion) $$('[data-picks-count]:not([hidden])').forEach((b) =>
    b.animate([{ transform: 'scale(1.6)' }, { transform: 'scale(1)' }], { duration: 450, easing: EASE }));
}

function syncPicks() {
  $$('[data-pick]').forEach((b) => {
    const on = state.picks.includes(b.dataset.pick);
    b.setAttribute('aria-pressed', String(on));
    b.textContent = on ? 'En tu lista' : 'Guardar en mi lista';
  });
  $('[data-picks]').innerHTML = pickedProducts().map((p) =>
    `<li><span><span class="n">${p.name}</span><span class="b">${casaById(p.casa).name}</span></span><button type="button" data-unpick="${p.id}" aria-label="Quitar ${p.name}">Quitar</button></li>`).join('');
  $('[data-picks-empty]').hidden = state.picks.length > 0;
  $$('[data-picks-count]').forEach((b) => {
    b.hidden = !state.picks.length;
    $('[data-n]', b).textContent = state.picks.length;
  });
}

export function initSeleccion() {
  renderProducts(); renderFilters();
  $('[data-filters]').addEventListener('click', (e) => {
    const b = e.target.closest('[data-filter]'); if (b) return applyFilter('familia', b.dataset.filter);
    if (e.target.closest('[data-filter-casa]')) applyFilter('familia', 'todas');
  });
  document.addEventListener('click', (e) => {
    const l = e.target.closest('[data-filter-link]'); if (l) applyFilter('casa', l.dataset.filterLink);
  });
  $('[data-products]').addEventListener('click', (e) => { const b = e.target.closest('[data-pick]'); if (b) togglePick(b.dataset.pick); });
  $('[data-picks]').addEventListener('click', (e) => { const b = e.target.closest('[data-unpick]'); if (b) togglePick(b.dataset.unpick); });
  syncPicks();
}
