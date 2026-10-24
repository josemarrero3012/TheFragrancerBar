/* ==========================================================================
   Páginas de la web. pages(url) devuelve { 'ruta/index.html': html, … }
   y vite.config.js las sirve en desarrollo y las escribe en dist/ al compilar.
   Añadir una casa o una fragancia en src/data/catalogo.js crea su página sola.
   ========================================================================== */
import { SITE, mainStore } from '../data/site.js';
import { CASAS, FRAGANCIAS, FAMILIAS, CONCENTRACIONES, casaById, familiaName, fragsDeCasa, euros } from '../data/catalogo.js';
import * as schema from '../data/schema.js';
import { layout, whatsappHref } from './layout.js';
import { esc, u, ICON, NEW_TAB, fragUrl, casaUrl, storeUrl, telHref, productMedia, productCard, crumbs, pageHead, demoNote, brandStrip, clock } from './ui.js';

const DAYS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const cap = (s) => s[0].toUpperCase() + s.slice(1);
const featured = FRAGANCIAS.filter((p) => p.featured);
const nFrag = (n) => `${n} ${n === 1 ? 'fragancia' : 'fragancias'}`;
/** Meta description de 160 caracteres como máximo: añade el primer complemento que quepa */
const fit = (base, ...extras) => base + (extras.find((x) => (base + x).length <= 160) || '');

/** Agrupa los días consecutivos con el mismo horario: «Lunes a sábado 10:00–21:00» */
function hourGroups(hours) {
  const groups = [];
  [1, 2, 3, 4, 5, 6, 0].forEach((d) => {
    const key = hours[d] ? hours[d].join('–') : 'Cerrado';
    const last = groups[groups.length - 1];
    if (last && last.key === key) last.days.push(d); else groups.push({ key, days: [d] });
  });
  return groups.map((g) => ({
    days: g.days, value: g.key,
    label: g.days.length === 7 ? 'Todos los días' : g.days.length > 1 ? `${cap(DAYS[g.days[0]])} a ${DAYS[g.days[g.days.length - 1]]}` : cap(DAYS[g.days[0]])
  }));
}
/** Tabla de horario; src/js/clock.js marca el día de hoy */
const hoursTable = (s) => `<span class="hours">${hourGroups(s.hours).map((g) =>
  `<span data-days="${g.days.join(',')}"><span>${g.label}</span><span>${g.value}</span></span>`).join('')}</span>`;
const hoursShort = (s) => hourGroups(s.hours).map((g) => `${g.label}: <span class="nowrap">${g.value === 'Cerrado' ? 'cerrado' : g.value}</span>`).join('<br>');

/** Ficha de datos de una tienda */
const storeFicha = (s) => `
          <dl class="ficha">
            <div><dt>Dirección</dt><dd>${esc(s.address)}</dd></div>
            <div><dt>Horario</dt><dd>${hoursTable(s)}</dd></div>
            <div><dt>Teléfono</dt><dd><a href="${telHref(s.phone)}">${esc(s.phone)}</a></dd></div>
            <div><dt>Llegar</dt><dd>${esc(s.howTo)} <a class="link" href="${s.mapsUrl}" target="_blank" rel="noopener">Abrir en Google Maps${NEW_TAB}</a></dd></div>
          </dl>`;

/** Mapa bajo demanda: un plano dibujado hasta que el visitante lo pide (privacidad) */
const mapBox = (s) => `
        <div class="map" data-map="${esc(s.mapQuery)}">
          <div class="map__plan" aria-hidden="true"></div>
          <div class="map__overlay">
            <span class="map__pin">${ICON.pin}</span>
            <p>El mapa se carga desde Google Maps.</p>
            <button class="btn btn--light" type="button" data-map-load>Ver en el mapa</button>
          </div>
        </div>`;

/* ---------------------------------------------------------------- Portada */
function home(url) {
  const s = mainStore(), d = casaById(SITE.destacada.casa);
  const main = `
    <section class="hero" aria-labelledby="hero-title">
      <div class="hero__copy">
        <p class="eyebrow">Calle Mayor de Triana · Las Palmas de Gran Canaria</p>
        <h1 class="hero__title" id="hero-title">Perfumería nicho, <em>sin prisa.</em></h1>
        <p class="hero__lede">Las grandes casas de autor, de Creed a Xerjoff, en una tienda pensada para oler con calma y probar sobre la piel antes de elegir.</p>
        <div class="hero__ctas">
          <a class="btn btn--dark" href="${u('comprar/')}">Comprar fragancias</a>
          <a class="btn btn--tienda" href="${storeUrl(s)}">Visitar la tienda</a>
        </div>
        ${clock(s)}
      </div>
      <figure class="hero__media">
        <img src="/${s.img}-1448.webp" srcset="/${s.img}-800.webp 800w, /${s.img}-1448.webp 1448w"
             sizes="(min-width: 960px) 80vw, 100vw" width="1448" height="1086" alt="${esc(s.imgAlt)}" fetchpriority="high">
      </figure>
    </section>

    <div class="brandline">
      <ul class="brandline__list wrap" aria-label="Casas que trabajamos" data-brandline data-reveal="up" data-stagger>${brandStrip()}</ul>
    </div>

    <section class="seleccion section" aria-labelledby="seleccion-title">
      <div class="wrap">
        <header class="section__head section__head--row">
          <div data-reveal="up" data-stagger>
            <h2 class="section__title" id="seleccion-title">Selección de la casa</h2>
            <p class="section__intro">Algunas de las fragancias más pedidas en nuestras tiendas. Cómpralas online o guárdalas en tu lista y pruébalas antes en la barra.</p>
          </div>
          <a class="link section__more" href="${u('comprar/')}" data-reveal="up">Ver las ${FRAGANCIAS.length} fragancias</a>
        </header>
        <ul class="products">${featured.map((p, i) => productCard(p, { notes: true, i })).join('')}
          <li class="product product--more" data-reveal="up">
            <div class="product__media"><p>Y muchas más en el catálogo y en tienda.</p><a class="link" href="${u('comprar/')}">Ver todo el catálogo</a></div>
          </li>
        </ul>
        ${SITE.demoPrices ? '<p class="products__note">Los precios de esta demo son inventados. En la tienda online verás cómo funcionaría la compra.</p>' : ''}
      </div>
    </section>

    <section class="invitada" aria-labelledby="invitada-title">
      <figure class="invitada__media">
        <img src="/img/casas/xerjoff-banner-1200.webp" srcset="/img/casas/xerjoff-banner-1200.webp 1200w, /img/casas/xerjoff-banner-2400.webp 2400w"
             sizes="100vw" width="2400" height="1350" loading="lazy" alt="Frasco de Xerjoff Naxos sobre un mapa antiguo, envuelto por una cinta verde">
      </figure>
      <div class="invitada__copy wrap" data-reveal="up" data-stagger>
        <h2 class="invitada__title" id="invitada-title">Casa destacada: <em>${esc(d.name)}</em></h2>
        <p>${esc(SITE.destacada.text)}</p>
        <a class="link" href="${casaUrl(d)}">Conocer ${esc(d.name)}</a>
      </div>
    </section>

    <section class="barra section section--dark" aria-labelledby="barra-title">
      <div class="wrap barra__grid">
        <figure class="barra__media" data-reveal="clip">
          <img src="/img/casas/initio-barra-888.webp" width="888" height="1110" loading="lazy" alt="Frascos de Initio Oud for Greatness alineados en penumbra, con detalles dorados">
        </figure>
        <div class="barra__copy" data-reveal="up" data-stagger>
          <p class="eyebrow eyebrow--light">El nombre de la casa</p>
          <h2 class="section__title" id="barra-title">Una barra <em>para oler</em></h2>
          <p class="section__intro">En el centro de cada tienda hay una barra donde se prueba con calma, sin cita y sin compromiso. Primero en tira, después en piel.</p>
          <a class="btn btn--line" href="${u('la-barra/')}">Cómo es una visita</a>
        </div>
      </div>
    </section>

    <section class="section" aria-labelledby="tiendas-title">
      <div class="wrap">
        <header class="section__head section__head--row">
          <div data-reveal="up" data-stagger>
            <h2 class="section__title" id="tiendas-title">Tres tiendas, <em>dos islas</em></h2>
            <p class="section__intro">Triana, en Las Palmas de Gran Canaria, y dos tiendas en el sur de Tenerife.</p>
          </div>
          <a class="link section__more" href="${u('tiendas/')}" data-reveal="up">Todas las tiendas</a>
        </header>
        <ul class="storecards" data-reveal="up" data-stagger>${SITE.stores.map((st) => storeCard(st, { photo: false })).join('')}</ul>
      </div>
    </section>

    <section class="quoteband section section--stone" aria-labelledby="quote-title">
      <div class="wrap quoteband__inner" data-reveal="up" data-stagger>
        <p class="eyebrow">Nuestra historia</p>
        <h2 class="visually-hidden" id="quote-title">Nuestra historia</h2>
        <blockquote class="quoteband__quote"><p>«El lujo no está en el precio, sino en cómo te hace sentir.»</p><footer>Sharan Harpalani, fundador</footer></blockquote>
        <a class="link" href="${u('historia/')}">De Evergreen Perfumes a Triana</a>
      </div>
    </section>`;
  return {
    path: '', section: 'home', intro: true, main,
    title: 'Perfumería nicho en Triana, Las Palmas | The Fragrance Bar',
    ogTitle: 'The Fragrance Bar · Triana, Las Palmas de Gran Canaria',
    description: 'Perfumería nicho en la Calle Mayor de Triana, Las Palmas de Gran Canaria. Creed, Amouage, Xerjoff, Parfums de Marly, Initio, Montale, Memo Paris y Tom Ford.',
    preload: `<link rel="preload" as="image" href="/${s.img}-1448.webp" imagesrcset="/${s.img}-800.webp 800w, /${s.img}-1448.webp 1448w" imagesizes="(min-width: 960px) 80vw, 100vw">`,
    schema: schema.graph([
      { '@type': 'WebSite', '@id': `${url}/#web`, name: SITE.brand, url: `${url}/`, inLanguage: 'es' },
      schema.organization(SITE, url),
      ...SITE.stores.map((st) => schema.store(SITE, url, st))
    ])
  };
}

/* photo: false en la portada, donde la fachada ya sale arriba (no repetir la misma foto) */
function storeCard(s, { photo = true } = {}) {
  return `
          <li class="storecard">
            ${s.img && photo ? `<figure class="storecard__media"><img src="/${s.img}-800.webp" width="800" height="600" loading="lazy" alt=""></figure>` : '<div class="storecard__media storecard__media--plan" aria-hidden="true"></div>'}
            <div class="storecard__body">
              <p class="eyebrow">${esc(s.islandName)}${s.isNew ? ' · Nueva tienda' : ''}</p>
              <h3 class="storecard__title"><a href="${storeUrl(s)}">${esc(s.title)}</a></h3>
              <p class="storecard__addr">${esc(s.addressShort)}</p>
              ${clock(s)}
            </div>
          </li>`;
}

/* ---------------------------------------------------------------- Casas */
function casas(url) {
  const main = `${pageHead({
    crumbs: [['Inicio', ''], ['Casas']],
    eyebrow: `${CASAS.length} casas de autor`,
    title: 'Las <em>casas</em>',
    intro: 'Trabajamos con perfumistas y maisons independientes. Cada una tiene un carácter muy distinto: te ayudamos a encontrar la tuya.'
  })}
    <section class="section section--tight">
      <ul class="wrap casagrid">${CASAS.map((c, i) => `
        <li class="casacard" data-reveal="up" data-reveal-delay="${(i % 4) * 80}">
          <a class="casacard__link" href="${casaUrl(c)}">
            <figure class="casacard__media" style="view-transition-name: casa-${c.id}"><img src="/img/casas/${c.img}-560.webp" srcset="/img/casas/${c.img}-560.webp 560w, /img/casas/${c.img}-1000.webp 1000w" sizes="(min-width: 1100px) 24vw, (min-width: 640px) 46vw, 100vw" width="1000" height="1250" loading="${i < 4 ? 'eager' : 'lazy'}" alt="${esc(c.alt)}"></figure>
            <span class="casacard__body">
              <span class="casacard__city">${esc(c.city)}</span>
              <span class="casacard__name">${esc(c.name)}</span>
              <span class="casacard__desc">${esc(c.desc)}</span>
              <span class="casacard__count">${nFrag(fragsDeCasa(c.id).length)} ${ICON.arrow}</span>
            </span>
          </a>
        </li>`).join('')}
      </ul>
    </section>`;
  return {
    path: 'casas/', section: 'casas', main,
    title: 'Casas de perfumería nicho | The Fragrance Bar',
    description: `Las casas de The Fragrance Bar: ${CASAS.map((c) => c.name).join(', ')}. Perfumería de autor en Las Palmas y Tenerife.`,
    schema: schema.graph([schema.breadcrumbs(url, [['Inicio', ''], ['Casas', 'casas/']])])
  };
}

function casa(url, c) {
  const items = fragsDeCasa(c.id);
  const main = `
    <article class="casa-page">
      <header class="casahero wrap">
        <figure class="casahero__media" style="view-transition-name: casa-${c.id}">
          <img src="/img/casas/${c.img}-1000.webp" srcset="/img/casas/${c.img}-560.webp 560w, /img/casas/${c.img}-1000.webp 1000w" sizes="(min-width: 960px) 45vw, 100vw" width="1000" height="1250" fetchpriority="high" alt="${esc(c.alt)}">
        </figure>
        <div class="casahero__copy" data-reveal="up" data-stagger>
          ${crumbs([['Inicio', ''], ['Casas', 'casas/'], [c.name]])}
          <p class="eyebrow">${esc(c.city)} · ${esc(c.founded)}</p>
          <h1 class="casahero__title">${esc(c.name)}</h1>
          <p class="casahero__lede">${esc(c.desc)}</p>
          ${c.story.map((t) => `<p class="casahero__story">${esc(t)}</p>`).join('')}
          <p class="casahero__icons"><span>Emblemáticas</span> ${c.icons.map(esc).join(' · ')}</p>
          <div class="hero__ctas">
            <a class="btn btn--dark" href="#fragancias">Ver ${items.length === 1 ? 'su fragancia' : `sus ${items.length} fragancias`}</a>
            <a class="btn btn--tienda" href="${u('tiendas/')}">Probarlas en tienda</a>
          </div>
        </div>
      </header>

      <section class="section" id="fragancias" aria-labelledby="frag-title">
        <div class="wrap">
          <header class="section__head section__head--row">
            <h2 class="section__title" id="frag-title" data-reveal="up">Fragancias de <em>${esc(c.name)}</em></h2>
            <a class="link section__more" href="${u(`comprar/?casa=${c.id}`)}" data-reveal="up">Filtrar en la tienda</a>
          </header>
          <ul class="products">${items.map((p, i) => productCard(p, { notes: true, i })).join('')}</ul>
          ${demoNote(SITE)}
        </div>
      </section>

      <nav class="brandline brandline--foot" aria-label="Otras casas">
        <ul class="brandline__list wrap">${brandStrip(c.id)}</ul>
      </nav>
    </article>`;
  const bc = [['Inicio', ''], ['Casas', 'casas/'], [c.name, `casas/${c.id}/`]];
  return {
    path: `casas/${c.id}/`, section: 'casas', main,
    title: `${c.name} en Las Palmas y Tenerife | The Fragrance Bar`,
    description: fit(`${c.desc}`, ` ${nFrag(items.length)} de ${c.name} para probar en The Fragrance Bar Triana.`, ` ${nFrag(items.length)} en The Fragrance Bar.`),
    ogImage: `${url}/img/casas/${c.img}-1000.webp`,
    preload: `<link rel="preload" as="image" href="/img/casas/${c.img}-1000.webp" imagesrcset="/img/casas/${c.img}-560.webp 560w, /img/casas/${c.img}-1000.webp 1000w" imagesizes="(min-width: 960px) 45vw, 100vw">`,
    schema: schema.graph([schema.breadcrumbs(url, bc), { '@type': 'CollectionPage', name: `${c.name} · The Fragrance Bar`, url: `${url}/casas/${c.id}/`, mainEntity: schema.itemList(url, items) }])
  };
}

/* ---------------------------------------------------------------- Comprar */
function comprar(url) {
  const main = `${pageHead({
    crumbs: [['Inicio', ''], ['Comprar']],
    eyebrow: 'Tienda online',
    title: 'Comprar <em>fragancias</em>',
    intro: `${FRAGANCIAS.length} fragancias de ${CASAS.length} casas de autor. Envío en ${SITE.shipping.days}, gratis desde ${euros(SITE.shipping.freeFrom)}, o recogida en tienda.`,
    extra: demoNote(SITE)
  })}
    <section class="shop section section--tight" data-shop>
      <div class="wrap">
        <div class="toolbar" role="search" aria-label="Buscar y filtrar fragancias">
          <div class="toolbar__search">
            <label class="visually-hidden" for="q">Buscar fragancia o casa</label>
            ${ICON.search}<input id="q" type="search" placeholder="Buscar: Aventus, vainilla, Xerjoff…" autocomplete="off" data-q>
          </div>
          <div class="toolbar__selects">
            <label class="select"><span>Casa</span><select data-casa-filter><option value="">Todas</option>${CASAS.map((c) => `<option value="${c.id}">${esc(c.name)}</option>`).join('')}</select></label>
            <label class="select"><span>Ordenar</span><select data-sort>
              <option value="destacadas">Destacadas</option><option value="precio-asc">Precio: de menor a mayor</option><option value="precio-desc">Precio: de mayor a menor</option><option value="nombre">Nombre</option><option value="nuevas">Más recientes</option>
            </select></label>
          </div>
        </div>
        <div class="filters scroller" role="group" aria-label="Filtrar por familia olfativa" data-filters>
          ${[{ id: '', name: 'Todas' }, ...FAMILIAS].map((x) => `<button class="chip" type="button" data-familia-filter="${x.id}" aria-pressed="${x.id === ''}">${x.name}</button>`).join('')}
        </div>
        <p class="shop__count" data-count aria-live="polite">${FRAGANCIAS.length} fragancias</p>
        <ul class="products products--shop" data-products>${FRAGANCIAS.map((p, i) => productCard(p, { i })).join('')}</ul>
        <div class="shop__empty" data-empty hidden>
          <p>No hay fragancias con estos filtros.</p>
          <button class="link" type="button" data-reset-filters>Quitar los filtros</button>
        </div>
      </div>
    </section>`;
  return {
    path: 'comprar/', section: 'comprar', main,
    title: 'Comprar perfumes nicho online | The Fragrance Bar',
    description: `Compra online ${FRAGANCIAS.length} fragancias nicho de Creed, Xerjoff, Parfums de Marly, Initio y más. Envío en Canarias o recogida en Triana y Tenerife.`,
    schema: schema.graph([schema.breadcrumbs(url, [['Inicio', ''], ['Comprar', 'comprar/']]), schema.itemList(url, FRAGANCIAS)])
  };
}

function fragancia(url, p) {
  const c = casaById(p.casa), label = `${c.name} ${p.name}`;
  const related = [...fragsDeCasa(c.id).filter((x) => x.id !== p.id),
    ...FRAGANCIAS.filter((x) => x.casa !== c.id && x.familia === p.familia)].slice(0, 4);
  const PHASES = [['Salida', 'Los primeros minutos'], ['Corazón', 'Durante las primeras horas'], ['Fondo', 'Lo que queda en la piel']];
  const main = `
    <div class="wrap pdp__crumbs">${crumbs([['Inicio', ''], ['Comprar', 'comprar/'], [c.name, `casas/${c.id}/`], [p.name]])}</div>
    <article class="pdp wrap" data-pdp="${p.id}">
      <div class="pdp__media">${productMedia(p, { sizes: '(min-width: 960px) 50vw, 100vw', eager: true })}</div>
      <div class="pdp__info">
        <p class="product__brand"><a href="${casaUrl(c)}">${esc(c.name)}</a></p>
        <h1 class="pdp__title">${esc(p.name)}</h1>
        <p class="pdp__meta">${[CONCENTRACIONES[p.conc], p.year, esc(familiaName(p.familia))].filter(Boolean).join(' · ')}</p>
        <p class="pdp__desc">${esc(p.desc)}</p>

        <form class="buy" data-buy="${p.id}">
          <fieldset class="sizes">
            <legend>Tamaño</legend>
            ${p.sizes.map(([ml, price], i) => `<label class="size"><input type="radio" name="size" value="${ml}" data-price="${price}"${i === 0 ? ' checked' : ''}><span class="size__ml">${ml} ml</span><span class="size__price">${euros(price)}</span></label>`).join('')}
          </fieldset>
          <p class="buy__price"><span data-buy-price>${euros(p.sizes[0][1])}</span> <span class="buy__tax">IGIC incluido</span></p>
          <div class="buy__row">
            <button class="btn btn--dark btn--lg buy__add" type="submit">${ICON.bag}Añadir a la cesta</button>
            <button class="pick pick--lg" type="button" data-pick="${p.id}" aria-pressed="false" aria-label="Guardar ${esc(label)} en mi lista">${ICON.heart}</button>
          </div>
          ${demoNote(SITE, { compact: true })}
        </form>

        <ul class="perks">
          <li>${ICON.drop}<span><strong>Pruébala antes en la barra.</strong> En cualquiera de nuestras tiendas, sin compromiso.</span></li>
          <li>${ICON.truck}<span><strong>Envío en ${SITE.shipping.days}.</strong> Gratis a partir de ${euros(SITE.shipping.freeFrom)}.</span></li>
          <li>${ICON.store}<span><strong>Recogida gratis</strong> en Triana, Plaza del Duque o Américas Plaza.</span></li>
          <li>${ICON.gift}<span><strong>Envoltorio de regalo</strong> sin coste.</span></li>
        </ul>
        <a class="pdp__ask" href="${whatsappHref(`Hola, me interesa ${label}. ¿Me podéis dar más información?`)}" target="_blank" rel="noopener">${ICON.whatsapp}<span>¿Dudas? Pregúntanos por WhatsApp</span>${NEW_TAB}</a>
      </div>
    </article>

    <section class="notes section section--stone" aria-labelledby="notes-title">
      <div class="wrap">
        <h2 class="section__title" id="notes-title" data-reveal="up">Cómo <em>evoluciona</em></h2>
        <ol class="pyramid" data-reveal="up" data-stagger>
          ${PHASES.map(([t, when], i) => `<li><p class="pyramid__when">${when}</p><h3>${t}</h3><p>${esc(p.notes[i])}</p></li>`).join('')}
        </ol>
      </div>
    </section>

    ${related.length ? `<section class="section" aria-labelledby="rel-title">
      <div class="wrap">
        <header class="section__head section__head--row">
          <h2 class="section__title" id="rel-title" data-reveal="up">También te puede <em>gustar</em></h2>
          <a class="link section__more" href="${casaUrl(c)}" data-reveal="up">Todo ${esc(c.name)}</a>
        </header>
        <ul class="products">${related.map((x, i) => productCard(x, { i })).join('')}</ul>
      </div>
    </section>` : ''}

    <div class="buybar" data-buybar aria-hidden="true">
      <div class="buybar__name"><span>${esc(c.name)}</span><strong>${esc(p.name)}</strong></div>
      <button class="btn btn--dark" type="button" data-buybar-add tabindex="-1"><span data-buybar-price>${euros(p.sizes[0][1])}</span><span>&nbsp;·&nbsp;Añadir</span></button>
    </div>`;
  const bc = [['Inicio', ''], ['Comprar', 'comprar/'], [c.name, `casas/${c.id}/`], [p.name, `fragancias/${p.id}/`]];
  return {
    path: `fragancias/${p.id}/`, section: 'comprar', main, quickbar: false,
    title: `${label} · ${CONCENTRACIONES[p.conc]} | The Fragrance Bar`,
    description: fit(`${label}, ${CONCENTRACIONES[p.conc].toLowerCase()}${p.year ? ` de ${p.year}` : ''}. ${p.desc}`, ` Notas: ${p.notes.join(', ').toLowerCase()}.`, ' En The Fragrance Bar.'),
    ogImage: p.img ? `${url}/img/productos/${p.img}-800.webp` : undefined,
    schema: schema.graph([schema.breadcrumbs(url, bc), schema.product(SITE, url, p)])
  };
}

/* ---------------------------------------------------------------- Cesta */
function cesta() {
  const field = (id, label, type = 'text', attrs = '', wide = false) => `
              <div class="field${wide ? ' field--wide' : ''}">
                <label for="o-${id}">${label}</label>
                <input id="o-${id}" name="${id}" type="${type}" ${attrs} aria-describedby="e-o-${id}">
                <p class="field__error" id="e-o-${id}"></p>
              </div>`;
  const ISLAS = ['Gran Canaria', 'Tenerife', 'Lanzarote', 'Fuerteventura', 'La Palma', 'La Gomera', 'El Hierro', 'La Graciosa'];
  const main = `${pageHead({ crumbs: [['Inicio', ''], ['Comprar', 'comprar/'], ['Cesta']], title: 'Tu <em>cesta</em>', extra: demoNote(SITE) })}
    <section class="checkout section section--tight" data-checkout>
      <div class="wrap">
        <div class="checkout__empty" data-cart-empty>
          <p>Tu cesta está vacía.</p>
          <a class="btn btn--dark" href="${u('comprar/')}">Ver las fragancias</a>
        </div>

        <div class="checkout__grid" data-cart-full>
          <div class="checkout__main">
            <ul class="cartlines" data-cart-lines="full"></ul>

            <form class="order" id="order-form" data-order novalidate>
              <fieldset class="order__group">
                <legend><span>1</span> Tus datos</legend>
                <div class="form">
                  ${field('name', 'Nombre y apellidos', 'text', 'autocomplete="name" required')}
                  ${field('email', 'Correo electrónico', 'email', 'autocomplete="email" required')}
                  ${field('phone', 'Teléfono', 'tel', 'autocomplete="tel" required', true)}
                </div>
              </fieldset>

              <fieldset class="order__group">
                <legend><span>2</span> Entrega</legend>
                <div class="options" role="radiogroup">
                  <label class="option"><input type="radio" name="delivery" value="pickup" checked><span class="option__title">${ICON.store}Recogida en tienda</span><span class="option__note">Gratis · lista en 24 h</span></label>
                  <label class="option"><input type="radio" name="delivery" value="ship"><span class="option__title">${ICON.truck}Envío a domicilio</span><span class="option__note">${euros(SITE.shipping.canarias)} · gratis desde ${euros(SITE.shipping.freeFrom)}</span></label>
                </div>
                <div class="form" data-when="pickup">
                  <div class="field field--wide">
                    <label for="o-store">Tienda de recogida</label>
                    <select id="o-store" name="store">${SITE.stores.map((s) => `<option value="${s.id}">${esc(s.title)} · ${esc(s.islandName)}</option>`).join('')}</select>
                  </div>
                </div>
                <div class="form" data-when="ship" hidden>
                  ${field('address', 'Dirección', 'text', 'autocomplete="street-address"', true)}
                  ${field('cp', 'Código postal', 'text', 'autocomplete="postal-code" inputmode="numeric" maxlength="5"')}
                  ${field('city', 'Municipio', 'text', 'autocomplete="address-level2"')}
                  <div class="field field--wide">
                    <label for="o-island">Isla</label>
                    <select id="o-island" name="island">${ISLAS.map((i) => `<option>${i}</option>`).join('')}</select>
                  </div>
                </div>
              </fieldset>

              <fieldset class="order__group">
                <legend><span>3</span> Detalles</legend>
                <div class="form">
                  <div class="field field--wide field--check"><label class="check"><input type="checkbox" name="gift"><span>Envolver para regalo (sin coste)</span></label></div>
                  <div class="field field--wide"><label for="o-notes">Notas para la tienda <span class="field__opt">(opcional)</span></label><textarea id="o-notes" name="notes" rows="3"></textarea></div>
                </div>
              </fieldset>

              <fieldset class="order__group">
                <legend><span>4</span> Pago</legend>
                <div class="paybox">
                  <p><strong>Pasarela de pago pendiente de conectar.</strong> En la web real aquí iría el pago con tarjeta, Bizum o Apple Pay a través de un proveedor seguro (Redsys, Stripe…).</p>
                  ${SITE.demoPrices ? '<p>En esta demo no se pide ningún dato de pago ni se realiza ningún cargo.</p>' : ''}
                </div>
              </fieldset>

              <div class="field field--check order__privacy">
                <label class="check"><input id="o-privacy" name="privacy" type="checkbox" required aria-describedby="e-o-privacy"><span>He leído y acepto la <a href="${u('legal/#privacidad')}" target="_blank">política de privacidad${NEW_TAB}</a></span></label>
                <p class="field__error" id="e-o-privacy"></p>
              </div>
            </form>
          </div>

          <aside class="summary" aria-labelledby="sum-title">
            <h2 class="summary__title" id="sum-title">Resumen</h2>
            <dl class="summary__rows">
              <div><dt>Subtotal</dt><dd data-cart-subtotal>0 €</dd></div>
              <div><dt>Entrega</dt><dd data-sum-ship>Gratis</dd></div>
              <div class="summary__total"><dt>Total</dt><dd data-sum-total>0 €</dd></div>
            </dl>
            <p class="summary__tax">IGIC incluido</p>
            <p class="summary__free" data-cart-ship></p>
            <button class="btn btn--dark btn--lg summary__submit" type="submit" form="order-form" data-order-submit>Confirmar pedido</button>
            ${demoNote(SITE, { compact: true })}
          </aside>
        </div>

        <div class="success" data-order-done hidden tabindex="-1">
          <p class="eyebrow">Pedido <span data-order-id></span></p>
          <h2 class="success__title">Gracias, <em data-order-name></em></h2>
          <p data-order-text></p>
          <ul class="cartlines cartlines--mini" data-order-lines></ul>
          ${SITE.demoPrices ? '<p class="demo-note demo-note--inline">Demo: este pedido no se ha cobrado ni enviado.</p>' : ''}
          <a class="btn btn--line" href="${u('comprar/')}">Seguir comprando</a>
        </div>
      </div>
    </section>`;
  return {
    path: 'cesta/', section: 'comprar', main, quickbar: false, noindex: true,
    title: 'Tu cesta | The Fragrance Bar',
    description: 'Revisa tu cesta y elige envío a domicilio o recogida en tienda.'
  };
}

/* ---------------------------------------------------------------- La barra */
function barra(url) {
  const main = `
    <header class="barrahero section--dark">
      <div class="wrap barrahero__grid">
        <div class="barrahero__copy" data-reveal="up" data-stagger>
          ${crumbs([['Inicio', ''], ['La barra']])}
          <p class="eyebrow eyebrow--light">De ahí viene el nombre</p>
          <h1 class="pagehead__title">Una barra <em>para oler</em></h1>
          <p class="pagehead__intro">En el centro de cada tienda hay una barra de madera donde se prueba con calma, sin cita y sin compromiso. Es lo que nos diferencia de una perfumería al uso.</p>
        </div>
        <figure class="barrahero__media" data-reveal="clip">
          <img src="/img/casas/initio-barra-888.webp" width="888" height="1110" fetchpriority="high" alt="Frascos de Initio Oud for Greatness alineados en penumbra, con detalles dorados">
        </figure>
      </div>
    </header>

    <section class="section" aria-labelledby="ritual-title">
      <div class="wrap">
        <header class="section__head" data-reveal="up" data-stagger>
          <h2 class="section__title" id="ritual-title">Cómo es una <em>visita</em></h2>
          <p class="section__intro">No hay prisa ni guion. Pero si es tu primera vez, así suele ir.</p>
        </header>
        <ol class="steps" data-reveal="up" data-stagger>
          <li><span class="steps__n">01</span><h3>Tú eliges</h3><p>Todo lo que ves en las vitrinas se puede oler. Coge el frasco que te llame la atención, aunque no conozcas la casa.</p></li>
          <li><span class="steps__n">02</span><h3>Primero en tira</h3><p>Probamos varias en tiras de papel para descartar rápido y quedarnos con dos o tres candidatas.</p></li>
          <li><span class="steps__n">03</span><h3>Después en piel</h3><p>Un perfume cambia con el calor de la piel. Te ponemos la favorita y te recomendamos dejarle unos minutos, o volver otro día.</p></li>
          <li><span class="steps__n">04</span><h3>Te orientamos</h3><p>Cuéntanos qué te gusta y te proponemos alternativas de otras casas que quizá no conocías.</p></li>
        </ol>
      </div>
    </section>

    <section class="section section--stone" aria-labelledby="servicios-title">
      <div class="wrap">
        <h2 class="section__title" id="servicios-title" data-reveal="up">Además, <em>en la barra</em></h2>
        <ul class="services" data-reveal="up" data-stagger>
          <li>${ICON.drop}<h3>Muestras para casa</h3><p>Llévate muestras de tus candidatas y decide con calma.</p></li>
          <li>${ICON.gift}<h3>Regalos</h3><p>Te ayudamos a acertar y lo envolvemos sin coste. También hay tarjeta regalo.</p></li>
          <li>${ICON.heart}<h3>Tu lista</h3><p>Guarda en la web lo que te interese y enséñanoslo al llegar, o envíanoslo por WhatsApp.</p></li>
        </ul>
        <div class="hero__ctas" data-reveal="up">
          <a class="btn btn--tienda" href="${u('tiendas/')}">Encontrar una tienda</a>
          <a class="btn btn--line" href="${u('comprar/')}">Ver el catálogo</a>
        </div>
      </div>
    </section>`;
  return {
    path: 'la-barra/', section: 'barra', main,
    title: 'La barra: prueba perfumes nicho sin cita | The Fragrance Bar',
    description: 'En el centro de cada tienda de The Fragrance Bar hay una barra para oler y probar perfumes nicho con calma, sin cita y sin compromiso.',
    schema: schema.graph([schema.breadcrumbs(url, [['Inicio', ''], ['La barra', 'la-barra/']])])
  };
}

/* ---------------------------------------------------------------- Historia */
function historia(url) {
  const main = `${pageHead({ crumbs: [['Inicio', ''], ['Historia']], eyebrow: 'Desde 2022', title: 'Nuestra <em>historia</em>',
    intro: 'The Fragrance Bar nace de un negocio familiar de perfumería y de una idea sencilla: en Canarias faltaba una tienda dedicada solo a la perfumería nicho.' })}
    <section class="historia section section--tight">
      <div class="wrap historia__grid">
        <div class="historia__intro" data-reveal="up" data-stagger>
          <blockquote class="historia__quote">
            <p>«El lujo no está en el precio, sino en cómo te hace sentir.»</p>
            <footer>Sharan Harpalani, fundador</footer>
          </blockquote>
        </div>
        <!-- Fuente: thefragrancebar.es («Nuestra historia»). PENDIENTE: fechas exactas y fotos de archivo -->
        <ol class="timeline">
          <li><p class="timeline__when">El origen</p><h3>Evergreen Perfumes</h3><p>La perfumería de la familia, con dos puntos de venta. Es la base sobre la que se construye todo lo demás.</p></li>
          <li><p class="timeline__when">Durante la pandemia</p><h3>Descubrir el nicho</h3><p>Sharan Harpalani, amante de la perfumería de lujo, se sumerge en el mundo nicho y empieza a abrir espacios dedicados dentro de las tiendas familiares, que pasan a un modelo mixto.</p></li>
          <li><p class="timeline__when">Julio de 2022</p><h3>Nace The Fragrance Bar</h3><p>El grupo da el paso definitivo y abre en Tenerife una tienda exclusivamente nicho. Hoy está presente en CC Plaza del Duque y CC Américas Plaza.</p></li>
          <li class="is-now"><p class="timeline__when">Ahora</p><h3>Llegamos a Triana</h3><p>La primera tienda en Gran Canaria, en plena Calle Mayor de Triana, Las Palmas.</p></li>
        </ol>
        <p class="historia__note" data-proto>Capítulo en desarrollo. Lo completaremos con The Fragrance Bar: fotos de archivo, las primeras tiendas y el equipo.</p>
      </div>
    </section>`;
  return {
    path: 'historia/', section: 'historia', main,
    title: 'Nuestra historia | The Fragrance Bar',
    description: 'De Evergreen Perfumes a The Fragrance Bar: la historia de la primera cadena de perfumería nicho de Canarias, hoy en Tenerife y en Triana.',
    schema: schema.graph([schema.breadcrumbs(url, [['Inicio', ''], ['Historia', 'historia/']])])
  };
}

/* ---------------------------------------------------------------- Tiendas */
function tiendas(url) {
  const main = `${pageHead({ crumbs: [['Inicio', ''], ['Tiendas']], eyebrow: 'Gran Canaria y Tenerife', title: 'Nuestras <em>tiendas</em>',
    intro: 'Tres tiendas con barra para oler y probar con calma. Ven sin cita.' })}
    <section class="section section--tight">
      <div class="wrap"><ul class="storecards storecards--big" data-reveal="up" data-stagger>${SITE.stores.map((x) => storeCard(x)).join('')}</ul></div>
    </section>`;
  return {
    path: 'tiendas/', section: 'tiendas', main,
    title: 'Tiendas en Las Palmas y Tenerife | The Fragrance Bar',
    description: 'The Fragrance Bar en la Calle Mayor de Triana (Las Palmas de Gran Canaria), C. C. Plaza del Duque y C. C. Américas Plaza (Tenerife). Horarios y cómo llegar.',
    schema: schema.graph([schema.breadcrumbs(url, [['Inicio', ''], ['Tiendas', 'tiendas/']]), ...SITE.stores.map((s) => schema.store(SITE, url, s))])
  };
}

function tienda(url, s) {
  const others = SITE.stores.filter((x) => x.id !== s.id);
  const main = `
    <article class="storepage">
      <header class="storehero wrap">
        <div class="storehero__copy" data-reveal="up" data-stagger>
          ${crumbs([['Inicio', ''], ['Tiendas', 'tiendas/'], [s.name]])}
          <p class="eyebrow">${esc(s.islandName)}${s.isNew ? ' · Nueva tienda' : ''}</p>
          <h1 class="pagehead__title">${esc(s.title.split(',')[0])}${s.title.includes(',') ? `, <em>${esc(s.title.split(',')[1].trim())}</em>` : ''}</h1>
          <p class="pagehead__intro">${esc(s.intro)}</p>
          ${clock(s)}
          ${storeFicha(s)}
          <div class="hero__ctas">
            <a class="btn btn--tienda" href="${s.mapsUrl}" target="_blank" rel="noopener">Cómo llegar${NEW_TAB}</a>
            <a class="btn btn--line" href="${telHref(s.phone)}">Llamar</a>
          </div>
        </div>
        ${s.img
          ? `<figure class="storehero__media"><img src="/${s.img}-1448.webp" srcset="/${s.img}-800.webp 800w, /${s.img}-1448.webp 1448w" sizes="(min-width: 960px) 50vw, 100vw" width="1448" height="1086" fetchpriority="high" alt="${esc(s.imgAlt)}"></figure>`
          : `<div class="storehero__media storehero__media--map">${mapBox(s)}</div>`}
      </header>

      ${s.img ? `<section class="section section--tight" aria-label="Mapa"><div class="wrap">${mapBox(s)}</div></section>` : ''}

      <section class="section section--stone" aria-labelledby="opiniones-title">
        <div class="wrap reviews">
          <div data-reveal="up" data-stagger>
            <h2 class="section__title" id="opiniones-title">Opiniones en <em>Google</em></h2>
            <p class="section__intro">Lo que dicen quienes ya han pasado por la barra.</p>
            <a class="link" href="${s.mapsUrl}" target="_blank" rel="noopener">Ver las reseñas y dejar la tuya${NEW_TAB}</a>
          </div>
          <p class="reviews__proto" data-proto>Prototipo: aquí se mostrarán las reseñas reales de la ficha de Google Business Profile de la tienda, con su valoración media.</p>
        </div>
      </section>

      <section class="section" aria-labelledby="otras-title">
        <div class="wrap">
          <h2 class="section__title" id="otras-title" data-reveal="up">Otras <em>tiendas</em></h2>
          <ul class="storecards" data-reveal="up" data-stagger>${others.map((x) => storeCard(x)).join('')}</ul>
        </div>
      </section>
    </article>`;
  return {
    path: `tiendas/${s.id}/`, section: 'tiendas', main, store: s,
    title: `Perfumería nicho en ${s.name}, ${s.islandName} | The Fragrance Bar`.replace('Triana, Gran Canaria', 'Triana, Las Palmas'),
    description: fit(`The Fragrance Bar ${s.name}: ${s.addressShort}. Horario, teléfono y cómo llegar.`, ' Creed, Xerjoff, Initio, Parfums de Marly y más.', ' Creed, Xerjoff, Initio y más.'),
    schema: schema.graph([schema.breadcrumbs(url, [['Inicio', ''], ['Tiendas', 'tiendas/'], [s.name, `tiendas/${s.id}/`]]), schema.store(SITE, url, s)])
  };
}

/* ---------------------------------------------------------------- Contacto */
function contacto(url) {
  const s = mainStore();
  const main = `${pageHead({ crumbs: [['Inicio', ''], ['Contacto']], title: 'Escríbenos',
    intro: '¿Buscas una fragancia concreta o quieres saber si la tenemos en tienda? Te respondemos lo antes posible.' })}
    <section class="contacto section section--tight">
      <div class="wrap contacto__grid">
        <div data-reveal="up" data-stagger>
          <dl class="ficha">
            <div><dt>Teléfono</dt><dd><a href="${telHref(s.phone)}">${esc(s.phone)}</a></dd></div>
            <div><dt>WhatsApp</dt><dd><a href="${whatsappHref()}" target="_blank" rel="noopener">Escríbenos por WhatsApp${NEW_TAB}</a></dd></div>
            <div><dt>Correo</dt><dd><a href="mailto:${SITE.contact.email}">${esc(SITE.contact.email)}</a></dd></div>
            <div><dt>Tienda</dt><dd>${esc(s.addressShort)} · <a href="${storeUrl(s)}">Horario</a></dd></div>
          </dl>
          <div class="picks" id="lista">
            <p class="picks__label">Tu lista</p>
            <ul class="picks__list" data-picks></ul>
            <p class="picks__empty" data-picks-empty>Aún está vacía. En el <a href="${u('comprar/')}">catálogo</a> puedes guardar con el corazón las fragancias que te interesen; se añadirán a tu mensaje.</p>
            <a class="picks__wa link" data-picks-wa hidden target="_blank" rel="noopener">Enviar mi lista por WhatsApp${NEW_TAB}</a>
          </div>
        </div>

        <div class="contacto__body" data-reveal="up">
          <form class="form" data-form novalidate>
            <div class="field"><label for="f-name">Nombre</label><input id="f-name" name="name" type="text" autocomplete="name" required aria-describedby="e-name"><p class="field__error" id="e-name"></p></div>
            <div class="field"><label for="f-email">Correo electrónico</label><input id="f-email" name="email" type="email" autocomplete="email" required aria-describedby="e-email"><p class="field__error" id="e-email"></p></div>
            <div class="field field--wide"><label for="f-store">Tienda</label><select id="f-store" name="store" aria-describedby="e-store">${SITE.stores.map((x) => `<option>${esc(x.title)}</option>`).join('')}</select><p class="field__error" id="e-store"></p></div>
            <div class="field field--wide"><label for="f-message">Mensaje</label><textarea id="f-message" name="message" rows="5" required aria-describedby="e-message"></textarea><p class="field__error" id="e-message"></p></div>
            <div class="field field--wide field--check">
              <label class="check"><input id="f-privacy" name="privacy" type="checkbox" required aria-describedby="e-privacy"><span>He leído y acepto la <a href="${u('legal/#privacidad')}" target="_blank">política de privacidad${NEW_TAB}</a></span></label>
              <p class="field__error" id="e-privacy"></p>
            </div>
            <div class="form__actions field--wide">
              <button class="btn btn--dark btn--lg" type="submit" data-submit>Enviar mensaje</button>
              <p class="form__note" data-proto>Prototipo: el mensaje no se envía.</p>
            </div>
          </form>
          <div class="success" data-success hidden tabindex="-1">
            <h3 class="success__title">Mensaje enviado</h3>
            <p data-success-text></p>
            <button class="btn btn--line" type="button" data-reset>Escribir otro mensaje</button>
          </div>
        </div>
      </div>
    </section>

    <section class="faq section section--stone" id="preguntas" aria-labelledby="faq-title">
      <div class="wrap faq__grid">
        <div data-reveal="up" data-stagger>
          <h2 class="section__title" id="faq-title">Preguntas <em>frecuentes</em></h2>
          <p class="section__intro">Lo que más nos preguntan en la barra.</p>
          <p class="historia__note" data-proto>Respuestas de ejemplo, a confirmar con The Fragrance Bar.</p>
        </div>
        <div class="faq__list" data-reveal="up" data-stagger>
          ${SITE.faq.map((x) => `<details class="faq__item"><summary>${esc(x.q)}</summary><p>${esc(x.a)}</p></details>`).join('\n          ')}
        </div>
      </div>
    </section>`;
  return {
    path: 'contacto/', section: 'contacto', main,
    title: 'Contacto y preguntas frecuentes | The Fragrance Bar',
    description: 'Escribe a The Fragrance Bar por WhatsApp, teléfono o correo. Muestras, tarjeta regalo, envíos y todo lo que nos preguntan en la barra.',
    schema: schema.graph([schema.breadcrumbs(url, [['Inicio', ''], ['Contacto', 'contacto/']]), schema.faqPage(SITE)])
  };
}

/* ---------------------------------------------------------------- Legal y 404 */
function legal() {
  const pending = (s) => `<span class="pending">[${s}]</span>`;
  const main = `
    <div class="legal wrap">
      <header class="legal__head">
        ${crumbs([['Inicio', ''], ['Información legal']])}
        <h1 class="legal__title">Información legal</h1>
        <p class="legal__meta">Última actualización: ${pending('fecha de publicación')}</p>
        <p class="legal__draft" data-proto>Borrador. Los datos entre corchetes los tiene que facilitar el negocio, y el texto debe revisarlo un profesional antes de publicar la web. Faltan también las condiciones de venta de la tienda online.</p>
      </header>
      <nav class="legal__toc" aria-label="Secciones">
        <a href="#aviso-legal">Aviso legal</a><a href="#privacidad">Privacidad</a><a href="#cookies">Cookies</a>
      </nav>
      <div class="legal__body">
        <section id="aviso-legal" aria-labelledby="t-aviso">
          <h2 id="t-aviso">Aviso legal</h2>
          <p>En cumplimiento de la Ley 34/2002, de servicios de la sociedad de la información y de comercio electrónico (LSSI-CE), estos son los datos del titular de esta web:</p>
          <dl class="legal__data">
            <div><dt>Titular</dt><dd>${pending('Razón social')}</dd></div>
            <div><dt>NIF</dt><dd>${pending('NIF')}</dd></div>
            <div><dt>Domicilio</dt><dd>${pending('Domicilio social')}</dd></div>
            <div><dt>Registro</dt><dd>${pending('Datos de inscripción en el Registro Mercantil')}</dd></div>
            <div><dt>Correo</dt><dd><a href="mailto:${SITE.contact.email}">${esc(SITE.contact.email)}</a></dd></div>
            <div><dt>Teléfono</dt><dd><a href="${telHref(mainStore().phone)}">${esc(mainStore().phone)}</a></dd></div>
          </dl>
          <h3>Objeto</h3>
          <p>Esta web informa sobre las tiendas de The Fragrance Bar, las casas de perfumería que trabajamos y sus fragancias, y permite comprarlas online. ${pending('Condiciones de venta: precios, envíos, devoluciones y desistimiento')}</p>
          <h3>Propiedad intelectual</h3>
          <p>Los textos, el diseño y las fotografías de las tiendas pertenecen al titular. Los nombres, marcas e imágenes de producto pertenecen a sus respectivas casas y se muestran solo con fines informativos.</p>
          <h3>Responsabilidad</h3>
          <p>Procuramos que la información esté actualizada, pero las notas olfativas, los horarios y el surtido pueden cambiar. Si necesitas confirmar algo antes de venir, escríbenos.</p>
          <h3>Legislación aplicable</h3>
          <p>Esta web se rige por la legislación española.</p>
        </section>
        <section id="privacidad" aria-labelledby="t-privacidad">
          <h2 id="t-privacidad">Política de privacidad</h2>
          <h3>Quién trata tus datos</h3>
          <p>${pending('Razón social')}, con NIF ${pending('NIF')}. Puedes escribirnos a <a href="mailto:${SITE.contact.email}">${esc(SITE.contact.email)}</a> para cualquier cuestión sobre tus datos.</p>
          <h3>Qué datos recogemos y para qué</h3>
          <ul>
            <li><strong>Pedidos:</strong> nombre, correo, teléfono y, si eliges envío, la dirección. Los usamos para preparar, entregar y facturar tu pedido.</li>
            <li><strong>Formulario de contacto:</strong> nombre, correo, tienda, mensaje y, si la has creado, tu lista de fragancias. Los usamos solo para responder a tu consulta.</li>
            <li><strong>Boletín:</strong> tu correo, para enviarte una vez al mes novedades y nuevas casas. Puedes darte de baja en cualquier momento desde el propio correo.</li>
          </ul>
          <h3>Base legal</h3>
          <p>La ejecución del contrato de compraventa en los pedidos (artículo 6.1.b del Reglamento General de Protección de Datos) y tu consentimiento en el formulario y el boletín (artículo 6.1.a).</p>
          <h3>Cuánto tiempo los guardamos</h3>
          <p>Los datos de los pedidos, el tiempo que exige la normativa fiscal. Los de contacto, el necesario para atender tu consulta. El correo del boletín, hasta que te des de baja.</p>
          <h3>A quién se comunican</h3>
          <p>No cedemos tus datos a terceros. Los proveedores que nos prestan servicios técnicos (${pending('alojamiento web, pasarela de pago, transporte, correo, envío del boletín')}) solo acceden a ellos para prestar ese servicio.</p>
          <h3>Tus derechos</h3>
          <p>Puedes pedir el acceso, la rectificación o la supresión de tus datos, oponerte a su tratamiento, limitarlo o solicitar su portabilidad escribiendo a <a href="mailto:${SITE.contact.email}">${esc(SITE.contact.email)}</a>. Si no quedas conforme, puedes reclamar ante la <a href="https://www.aepd.es" rel="noopener" target="_blank">Agencia Española de Protección de Datos${NEW_TAB}</a>.</p>
        </section>
        <section id="cookies" aria-labelledby="t-cookies">
          <h2 id="t-cookies">Política de cookies</h2>
          <p>Esta web no usa cookies propias ni herramientas de analítica o publicidad. Las fuentes tipográficas se sirven desde nuestro propio servidor.</p>
          <h3>Tu cesta y tu lista de fragancias</h3>
          <p>La cesta y «Tu lista» se guardan en el almacenamiento local de tu navegador para que no se pierdan al cambiar de página. Ese dato no sale de tu dispositivo hasta que haces un pedido o nos escribes, y desaparece al vaciarlas o al borrar los datos de navegación.</p>
          <h3>Mapa de Google</h3>
          <p>El mapa de cada tienda solo se carga si pulsas «Ver en el mapa». En ese momento Google puede instalar sus propias cookies, según su <a href="https://policies.google.com/technologies/cookies?hl=es" rel="noopener" target="_blank">política de cookies${NEW_TAB}</a>.</p>
        </section>
      </div>
    </div>`;
  return { path: 'legal/', section: 'legal', main, title: 'Información legal | The Fragrance Bar',
    description: 'Aviso legal, política de privacidad y política de cookies de The Fragrance Bar.' };
}

function notFound() {
  const main = `
    <div class="notfound wrap">
      <h1 class="notfound__title">Esta página no existe</h1>
      <p>Puede que el enlace esté mal escrito o que la página se haya movido. Desde aquí encontrarás las casas, el catálogo y cómo llegar a la tienda.</p>
      <div class="notfound__ctas">
        <a class="btn btn--dark" href="${u()}">Ir a la portada</a>
        <a class="btn btn--line" href="${u('comprar/')}">Ver el catálogo</a>
      </div>
    </div>`;
  return { path: '404.html', section: '404', main, noindex: true, title: 'Página no encontrada | The Fragrance Bar',
    description: 'La página que buscas no existe.' };
}

/** Todas las páginas: { 'casas/creed/index.html': html, … } */
export function pages(url) {
  const list = [
    home(url), casas(url), ...CASAS.map((c) => casa(url, c)),
    comprar(url), ...FRAGANCIAS.map((p) => fragancia(url, p)), cesta(),
    barra(url), historia(url), tiendas(url), ...SITE.stores.map((s) => tienda(url, s)),
    contacto(url), legal(), notFound()
  ];
  return Object.fromEntries(list.map((p) => [p.path.endsWith('.html') ? p.path : `${p.path}index.html`, layout(p, url)]));
}
