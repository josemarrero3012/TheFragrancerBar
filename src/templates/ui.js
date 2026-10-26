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

/** El nombre y el lema como en el rótulo de la tienda: logo de la cabecera y del pie */
export const LOGO = `<span class="logo__mark"><span class="logo__caps">The</span> <em>fragrance</em> <span class="logo__caps">Bar</span></span>
        <span class="logo__sub" lang="en">Luxury perfumes</span>`;

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
  pause: svg('<path fill="currentColor" d="M7 5h3v14H7zM14 5h3v14h-3z"/>'),
  play: svg('<path fill="currentColor" d="M8 5v14l11-7z"/>'),
  drop: svg(`<path ${stroke} d="M12 3s6 6.4 6 11a6 6 0 0 1-12 0c0-4.6 6-11 6-11Z"/>`),
  truck: svg(`<path ${stroke} d="M3 6h11v10H3zM14 10h4l3 3v3h-7"/><circle ${stroke} cx="7" cy="17.5" r="1.5"/><circle ${stroke} cx="17" cy="17.5" r="1.5"/>`),
  store: svg(`<path ${stroke} d="M4 10v10h16V10M3 10l2-6h14l2 6H3ZM10 20v-5h4v5"/>`),
  gift: svg(`<path ${stroke} d="M4 11h16v9H4zM3 7h18v4H3zM12 7v13M12 7s-1.5-4-4-4a2 2 0 0 0 0 4h4Zm0 0s1.5-4 4-4a2 2 0 0 1 0 4h-4Z"/>`),
  whatsapp: svg('<path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3c-.2.3-1 1-1 2.3s1 2.7 1.1 2.9c.1.2 2 3.1 4.9 4.3 1.8.8 2.5.8 3.4.7.6-.1 1.5-.6 1.8-1.2.2-.6.2-1.1.1-1.2l-.5-.3Z"/>')
};

/** Foto de producto en la rejilla. Con fotos originales de la casa (p.orig), la primera llena el
    cuadrado y la segunda aparece encima al pasar el ratón, como en las webs de las casas. Sin ellas,
    el frasco recortado (4:5 dentro del cuadrado) sobre el fondo de piedra.
    Solo se publican las fragancias con foto (FRAGANCIAS en catalogo.js): si no hay p.orig, hay p.img */
export function productMedia(p, { sizes = '(min-width: 1100px) 22vw, (min-width: 760px) 30vw, 46vw', eager = false, vt = true, hover = true, attrs = '' } = {}) {
  const c = casaById(p.casa), label = `${c.name} ${p.name}`;
  const name = vt ? ` style="view-transition-name: f-${p.id}"` : '';
  const load = eager ? ' fetchpriority="high"' : ' loading="lazy"';
  if (p.orig) {
    const segunda = hover && p.orig.n > 1 ? origImg(p, 1, sizes, ' class="product__hover" loading="lazy" alt=""') : '';
    return `<figure class="product__media product__media--orig"${name}${attrs}>${origImg(p, 0, sizes, `${load} alt="${esc(label)}"`)}${segunda}</figure>`;
  }
  return `<figure class="product__media"${name}${attrs}><img src="/img/productos/${p.img}-400.webp" srcset="/img/productos/${p.img}-400.webp 400w, /img/productos/${p.img}-800.webp 800w" sizes="${sizes}" width="800" height="1000"${load} alt="Frasco de ${esc(label)}"></figure>`;
}

/* Foto original número i (0 = a, 1 = b…): cuadrada, en 160, 800 y 1600 px */
const ORIG_LETRAS = 'abcdef';
export const origSrc = (p, i, w) => `/img/originales/${p.id}-${ORIG_LETRAS[i]}-${w}.webp`;
const origImg = (p, i, sizes, attrs) =>
  `<img src="${origSrc(p, i, 800)}" srcset="${origSrc(p, i, 800)} 800w, ${origSrc(p, i, 1600)} 1600w" sizes="${sizes}" width="1600" height="1600"${attrs}>`;

/** Fotos de la ficha: todas las originales de la casa, con miniaturas debajo (las activa
    src/js/galeria.js). Sin originales, la foto recortada como en la rejilla */
export function productGallery(p, { sizes = '(min-width: 960px) 50vw, 100vw' } = {}) {
  if (!p.orig) return productMedia(p, { sizes, eager: true });
  const c = casaById(p.casa), label = `${c.name} ${p.name}`, n = p.orig.n;
  if (n === 1) return productMedia(p, { sizes, eager: true });
  const slide = (i) => i === 0
    ? productMedia(p, { sizes, eager: true, hover: false, attrs: ' data-slide' })
    : `<figure class="product__media product__media--orig" data-slide hidden>${origImg(p, i, sizes, ` loading="lazy" alt="${esc(label)}, foto ${i + 1}"`)}</figure>`;
  const thumb = (i) => `<li><button class="gallery__thumb" type="button" data-thumb="${i}" aria-pressed="${i === 0}" aria-label="Ver la foto ${i + 1} de ${n}"><img src="${origSrc(p, i, 160)}" width="80" height="80" loading="lazy" alt=""></button></li>`;
  const idx = [...Array(n).keys()];
  return `<div class="gallery" data-gallery>
        <div class="gallery__main">${idx.map(slide).join('')}</div>
        <ul class="gallery__thumbs" data-thumbs hidden>${idx.map(thumb).join('')}</ul>
      </div>`;
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
export function productCard(p, { notes = false, i = 0 } = {}) {
  const c = casaById(p.casa), from = priceFrom(p), label = `${p.name} de ${c.name}`;
  const multi = p.sizes.length > 1;
  return `
          <li class="product" data-id="${p.id}" data-familia="${p.familia}" data-casa="${p.casa}" data-price="${from}" data-year="${p.year || 0}" data-name="${esc(`${p.name} ${c.name}`.toLowerCase())}" data-notes="${esc(notasPlanas(p.notes).join(', ').toLowerCase())}" data-reveal="up" data-reveal-delay="${(i % 4) * 80}">
            <a class="product__link" href="${fragUrl(p)}" tabindex="-1" aria-hidden="true">${productMedia(p)}</a>
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

/** «Ver más» bajo una rejilla larga (lo activa src/js/shop.js; sin JavaScript se ven todas) */
export const moreButton = () => `<div class="more" data-more hidden>
          <p class="more__status" data-more-status></p>
          <button class="btn btn--line" type="button" data-more-btn>Ver más</button>
        </div>`;

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

/** Estado de apertura de una tienda (lo rellena src/js/clock.js; text es lo que se ve hasta entonces o sin JavaScript) */
export const clock = (store, text = 'Consultando horario…') => `<p class="status" data-clock="${store.id}" aria-live="polite"><span class="status__dot" aria-hidden="true"></span><span class="status__text">${text}</span></p>`;
