/* ==========================================================================
   Piezas de marcado compartidas por las plantillas de página.
   Se ejecutan al compilar (y en el servidor de desarrollo), nunca en el navegador.
   Enlaces: u('casas/') → %BASE_URL%casas/ (Vite pone la base del despliegue).
   Imágenes de /public: empiezan por / y Vite les añade la base al compilar.
   ========================================================================== */
import { CASAS, CONCENTRACIONES, casaById, familiaName, priceFrom, euros } from '../data/catalogo.js';
import { notaFoto, notasPlanas } from '../data/notas.js';

export const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
export const u = (path = '') => `%BASE_URL%${path}`;
export const NEW_TAB = '<span class="visually-hidden"> (se abre en una pestaña nueva)</span>';

export const fragUrl = (p) => u(`fragancias/${p.id}/`);
export const casaUrl = (c) => u(`casas/${c.id}/`);
export const storeUrl = (s) => u(`tiendas/${s.id}/`);
export const telHref = (phone) => `tel:${phone.replace(/\s/g, '')}`;

/* Iconos de trazo fino (heredan el color del texto) */
const svg = (d, extra = '') => `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"${extra}>${d}</svg>`;
const stroke = 'fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"';
export const ICON = {
  bag: svg(`<path ${stroke} d="M5 8h14l-1 12H6L5 8Z"/><path ${stroke} d="M9 8V6a3 3 0 0 1 6 0v2"/>`),
  heart: svg(`<path ${stroke} d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z"/>`),
  close: svg(`<path ${stroke} d="M6 6l12 12M18 6 6 18"/>`),
  arrow: svg(`<path ${stroke} d="M5 12h14M13 6l6 6-6 6"/>`),
  search: svg(`<circle ${stroke} cx="11" cy="11" r="6.5"/><path ${stroke} d="m16 16 4 4"/>`),
  phone: svg(`<path ${stroke} d="M5 3h3.5l1.8 4.5-2.3 1.4a11 11 0 0 0 7.1 7.1l1.4-2.3L21 15.5V19a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2Z"/>`),
  pin: svg(`<path ${stroke} d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z"/><circle ${stroke} cx="12" cy="9.5" r="2.5"/>`),
  drop: svg(`<path ${stroke} d="M12 3s6 6.4 6 11a6 6 0 0 1-12 0c0-4.6 6-11 6-11Z"/>`),
  truck: svg(`<path ${stroke} d="M3 6h11v10H3zM14 10h4l3 3v3h-7"/><circle ${stroke} cx="7" cy="17.5" r="1.5"/><circle ${stroke} cx="17" cy="17.5" r="1.5"/>`),
  store: svg(`<path ${stroke} d="M4 10v10h16V10M3 10l2-6h14l2 6H3ZM10 20v-5h4v5"/>`),
  gift: svg(`<path ${stroke} d="M4 11h16v9H4zM3 7h18v4H3zM12 7v13M12 7s-1.5-4-4-4a2 2 0 0 0 0 4h4Zm0 0s1.5-4 4-4a2 2 0 0 1 0 4h-4Z"/>`),
  whatsapp: svg('<path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3c-.2.3-1 1-1 2.3s1 2.7 1.1 2.9c.1.2 2 3.1 4.9 4.3 1.8.8 2.5.8 3.4.7.6-.1 1.5-.6 1.8-1.2.2-.6.2-1.1.1-1.2l-.5-.3Z"/>')
};

/* Frasco dibujado para las fragancias sin foto: una silueta por casa,
   con el «líquido» teñido según la familia olfativa (ver .bottle en products.css) */
const BOTTLES = {
  creed: '<rect x="84" y="28" width="32" height="40" rx="2"/><rect x="92" y="68" width="16" height="10"/><rect x="58" y="78" width="84" height="142" rx="10"/>',
  amouage: '<path d="M100 18c-12 0-20 10-20 22s8 26 20 26 20-14 20-26-8-22-20-22Z"/><rect x="92" y="66" width="16" height="12"/><path d="M60 98c0-12 18-20 40-20s40 8 40 20v112a10 10 0 0 1-10 10H70a10 10 0 0 1-10-10Z"/>',
  xerjoff: '<circle cx="100" cy="46" r="22"/><rect x="92" y="68" width="16" height="12"/><path d="M74 80h52l22 26v88l-22 26H74l-22-26v-88Z"/>',
  pdm: '<rect x="76" y="40" width="48" height="30" rx="3"/><rect x="92" y="70" width="16" height="10"/><rect x="54" y="80" width="92" height="140" rx="16"/><circle cx="100" cy="130" r="14"/>',
  initio: '<rect x="84" y="20" width="32" height="52" rx="16"/><rect x="92" y="72" width="16" height="10"/><rect x="66" y="82" width="68" height="138" rx="30"/>',
  montale: '<rect x="80" y="34" width="40" height="38" rx="4"/><rect x="74" y="72" width="52" height="148" rx="6"/><path d="M74 92h52"/>',
  memo: '<rect x="78" y="30" width="44" height="46" rx="6"/><rect x="92" y="76" width="16" height="8"/><ellipse cx="100" cy="152" rx="46" ry="68"/>',
  tomford: '<rect x="80" y="40" width="40" height="34" rx="2"/><rect x="92" y="74" width="16" height="8"/><rect x="56" y="82" width="88" height="138" rx="4"/><path d="M56 200h88"/>'
};
export function bottle(p) {
  return `<svg class="bottle" viewBox="0 0 200 240" aria-hidden="true"><g class="bottle__glass">${BOTTLES[p.casa]}</g><rect class="bottle__shine" x="80" y="104" width="5" height="84" rx="2.5"/></svg>`;
}

/** Foto original de la casa (y la de al pasar el ratón), el frasco recortado o, si no hay foto, el frasco dibujado.
    vitrina: el frasco recortado aunque haya foto original, para ponerlo en su vitrina (rejilla de /comprar/) */
export function productMedia(p, { sizes = '(min-width: 1100px) 22vw, (min-width: 760px) 30vw, 46vw', eager = false, vt = true, vitrina = false } = {}) {
  const c = casaById(p.casa);
  const name = vt ? ` style="view-transition-name: f-${p.id}"` : '';
  if (vitrina && p.vitrinaFoto) {
    const { w, h } = p.vitrinaFoto;
    return `<figure class="product__media product__media--vitrinafoto"${name}><img src="/img/vitrina/${p.id}-800.webp" srcset="/img/vitrina/${p.id}-800.webp 800w, /img/vitrina/${p.id}-${w}.webp ${w}w" sizes="${sizes}" width="${w}" height="${h}"${eager ? ' fetchpriority="high"' : ' loading="lazy"'} alt="${esc(`${c.name} ${p.name}`)} en su vitrina"></figure>`;
  }
  if (p.orig && !(vitrina && p.img)) {
    const { w, h, hover } = p.orig;
    const img = (k, attrs) => `<img src="/img/originales/${p.id}-${k}-800.webp" srcset="/img/originales/${p.id}-${k}-800.webp 800w, /img/originales/${p.id}-${k}-1600.webp 1600w" sizes="${sizes}" width="${w}" height="${h}"${attrs}>`;
    return `<figure class="product__media product__media--orig${hover ? ' has-hover' : ''}"${name}>${img('a', `${eager ? ' fetchpriority="high"' : ' loading="lazy"'} alt="${esc(`${c.name} ${p.name}`)}"`)}${hover ? img('b', ' class="product__hover" loading="lazy" alt=""') : ''}</figure>`;
  }
  if (p.img) {
    return `<figure class="product__media"${name}><img src="/img/productos/${p.img}-400.webp" srcset="/img/productos/${p.img}-400.webp 400w, /img/productos/${p.img}-800.webp 800w" sizes="${sizes}" width="800" height="1000"${eager ? ' fetchpriority="high"' : ' loading="lazy"'} alt="Frasco de ${esc(`${c.name} ${p.name}`)}"></figure>`;
  }
  return `<figure class="product__media product__media--drawn" data-familia="${p.familia}"${name}>${bottle(p)}<figcaption class="bottle__label"><span>${esc(c.name)}</span><em>${esc(p.name)}</em></figcaption></figure>`;
}

/** Una nota olfativa con su foto, como en Fragrantica. Sin foto todavía, su inicial */
export function nota(texto) {
  const k = notaFoto(texto);
  const img = k
    ? `<img src="/img/notas/${k}-160.webp" srcset="/img/notas/${k}-160.webp 1x, /img/notas/${k}-320.webp 2x" width="160" height="160" loading="lazy" alt="">`
    : `<span class="nota__inicial" aria-hidden="true">${esc(texto[0])}</span>`;
  return `<li class="nota"><span class="nota__img">${img}</span><span class="nota__name">${esc(texto)}</span></li>`;
}

/** Ficha de producto en una rejilla. Los data-* los usa el filtro de /comprar/ */
export function productCard(p, { notes = false, i = 0, vitrina = false } = {}) {
  const c = casaById(p.casa), from = priceFrom(p), label = `${p.name} de ${c.name}`;
  const multi = p.sizes.length > 1;
  return `
          <li class="product" data-id="${p.id}" data-familia="${p.familia}" data-casa="${p.casa}" data-price="${from}" data-year="${p.year || 0}" data-name="${esc(`${p.name} ${c.name}`.toLowerCase())}" data-notes="${esc(notasPlanas(p.notes).join(', ').toLowerCase())}" data-reveal="up" data-reveal-delay="${(i % 4) * 80}">
            <a class="product__link" href="${fragUrl(p)}" tabindex="-1" aria-hidden="true">${productMedia(p, { vitrina })}</a>
            <div class="product__body">
              <p class="product__brand">${esc(c.name)}</p>
              <h3 class="product__name"><a href="${fragUrl(p)}">${esc(p.name)}</a></h3>
              <p class="product__meta">${CONCENTRACIONES[p.conc]} · ${esc(familiaName(p.familia))}</p>
              ${notes && notasPlanas(p.notes).length ? `<p class="product__notes">${esc(notasPlanas(p.notes).slice(0, 3).join(', '))}</p>` : ''}
              <p class="product__price">${multi ? '<span>desde</span> ' : ''}${euros(from)}</p>
              <div class="product__actions">
                <button class="btn btn--line btn--sm product__add" type="button" data-add="${p.id}" aria-label="Añadir ${esc(label)} a la cesta, ${p.sizes[0][0]} ml">Añadir</button>
                <button class="pick" type="button" data-pick="${p.id}" aria-pressed="false" aria-label="Guardar ${esc(label)} en mi lista">${ICON.heart}</button>
              </div>
            </div>
          </li>`;
}

/** Migas de pan: [['Inicio', ''], ['Casas', 'casas/'], ['Creed']] (la última es la página actual) */
export function crumbs(items) {
  return `<nav class="crumbs" aria-label="Estás en"><ol>${items.map(([name, path], i) =>
    i === items.length - 1 ? `<li><span aria-current="page">${esc(name)}</span></li>` : `<li><a href="${u(path)}">${esc(name)}</a></li>`).join('')}</ol></nav>`;
}

/** Cabecera editorial de las páginas interiores */
export function pageHead({ crumbs: c, eyebrow, title, intro, extra = '', dark = false, cls = '', attrs = '' }) {
  return `
    <header class="pagehead${dark ? ' section--dark' : ''}${cls ? ` ${cls}` : ''}"${attrs ? ` ${attrs}` : ''}>
      <div class="wrap pagehead__inner" data-reveal="up" data-stagger>
        ${c ? crumbs(c) : ''}
        ${eyebrow ? `<p class="eyebrow">${eyebrow}</p>` : ''}
        <h1 class="pagehead__title">${title}</h1>
        ${intro ? `<p class="pagehead__intro">${intro}</p>` : ''}
        ${extra}
      </div>
    </header>`;
}

/** El rótulo cuadrado negro de la tienda, tal como cuelga sobre la pared de chevron */
export const rotulo = () => `<p class="rotulo" aria-hidden="true"><span class="rotulo__caps">The</span><em>fragrance</em><span class="rotulo__caps rotulo__caps--end">Bar</span><span class="rotulo__sub">Luxury perfumes</span></p>`;

/** Aviso de precios inventados (solo con SITE.demoPrices) */
export function demoNote(site, { compact = false } = {}) {
  if (!site.demoPrices) return '';
  return compact
    ? '<p class="demo-note demo-note--inline">Precio de demostración</p>'
    : `<aside class="demo-note" role="note"><p><strong>Precios de demostración.</strong> Son inventados para enseñar cómo funcionaría la tienda online: los precios reales los fija The Fragrance Bar. Ningún pedido se cobra ni se envía.</p></aside>`;
}

/** Franja con todas las casas (portada y páginas de casa) */
export function brandStrip(current) {
  return CASAS.map((c) => c.id === current
    ? `<li><span aria-current="page">${esc(c.name)}</span></li>`
    : `<li><a href="${casaUrl(c)}">${esc(c.name)}</a></li>`).join('');
}

/** Estado de apertura de una tienda (lo rellena src/js/clock.js) */
export const clock = (store) => `<p class="status" data-clock="${store.id}" aria-live="polite"><span class="status__dot" aria-hidden="true"></span><span class="status__text">Consultando horario…</span></p>`;
