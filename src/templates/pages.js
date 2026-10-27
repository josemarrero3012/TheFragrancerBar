/* ==========================================================================
   Páginas de la web. pages(url) devuelve { 'ruta/index.html': html, … }
   y vite.config.js las sirve en desarrollo y las escribe en dist/ al compilar.
   Una casa nueva en src/data/casas.js o una fragancia publicada en catalogo/fragancias.csv crea su página sola.
   ========================================================================== */
import { SITE, mainStore } from '../data/site.js';
import { CASAS, FRAGANCIAS, FAMILIAS, CONCENTRACIONES, PRECIOS, casaById, fragById, familiaName, fragsDeCasa, euros, priceFrom } from '../data/catalogo.js';
import { NOTAS, NOTAS_FOTOS, gruposDeNotas, notasPlanas } from '../data/notas.js';
import { GUIAS, GUIAS_PORTADA } from '../data/guias.js';
import * as schema from '../data/schema.js';
import { layout, whatsappHref } from './layout.js';
import { esc, u, ICON, NEW_TAB, fragUrl, casaUrl, storeUrl, telHref, productGallery, productMedia, productCard, origSrc, moreButton, crumbs, pageHead, demoNote, brandStrip, clock, nota } from './ui.js';

const DAYS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const cap = (s) => s[0].toUpperCase() + s.slice(1);
// Selección de la portada: las destacadas y, si no llegan a 8, las primeras del catálogo
const featured = [...FRAGANCIAS.filter((p) => p.featured), ...FRAGANCIAS.filter((p) => !p.featured)];
const nFrag = (n) => `${n} ${n === 1 ? 'fragancia' : 'fragancias'}`;
/** Meta description de 160 caracteres como máximo: añade el primer complemento que quepa */
const fit = (base, ...extras) => base + (extras.find((x) => (base + x).length <= 160) || '');
/** «Triana, Plaza del Duque o Américas Plaza» */
const oLista = (a) => (a.length > 1 ? `${a.slice(0, -1).join(', ')} o ${a[a.length - 1]}` : a[0]);

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

/** Mapa bajo demanda: Google Maps solo se carga cuando el visitante lo pide (privacidad) */
const mapBox = (s) => `
        <div class="map" data-map="${esc(s.mapQuery)}">
          <div class="map__overlay">
            <span class="map__pin">${ICON.pin}</span>
            <p>El mapa se carga desde Google Maps.</p>
            <button class="btn btn--light" type="button" data-map-load>Ver en el mapa</button>
          </div>
        </div>`;

/* ---------------------------------------------------------------- Portada */
/* Hero: el nombre de la tienda como en su rótulo, la foto de la fachada de Triana y sus datos.
   Al bajar, src/js/rotulo.js encoge el nombre hasta dejarlo en el logo de la cabecera.
   Cada palabra va en su propia ranura para la entrada (src/js/motion.js) */
const ROTULO = `<span class="logo__mark"><span class="hero__w"><span class="logo__caps">The</span></span> <span class="hero__w"><em>fragrance</em></span> <span class="hero__w"><span class="logo__caps">Bar</span></span></span>
        <span class="logo__sub" lang="en">Luxury perfumes</span>`;
// La foto (4:3) llena un marco cuadrado: se ve 1,33 veces más ancha que el marco (como mucho 600 px en escritorio)
const HERO_SIZES = '(min-width: 960px) 800px, 134vw';
/** «Lunes a sábado, 10:00–21:00»: el horario en una línea, sin los días que cierra */
const hoursLine = (s) => hourGroups(s.hours).filter((g) => g.value !== 'Cerrado').map((g) => `${g.label}, ${g.value}`).join(' · ');

/* Escaparate: las campañas de las casas (SITE.escaparate), una tras otra a pantalla completa.
   Sin JavaScript se ve la primera, con su foto. src/js/escaparate.js las pasa, reproduce la película
   de la que está delante y mueve las pestañas */
// En móvil la foto 16:9 llena un marco 4:5: se ve 2,2 veces más ancha que la pantalla
const SLIDE_SIZES = '(min-width: 960px) 100vw, 222vw';
const slideSrcset = (e) => e.widths.map((w) => `/${e.media}-${w}.webp ${w}w`).join(', ');

function escSlide(e, i) {
  const first = i === 0, pos = ` style="object-position: ${e.focus}"`;
  const img = `<img src="/${e.media}-${e.widths[e.widths.length - 1]}.webp" srcset="${slideSrcset(e)}" sizes="${SLIDE_SIZES}" width="${e.w}" height="${e.h}"${pos} alt="${esc(e.alt)}" loading="lazy"${first ? '' : ' fetchpriority="low"'}>`;
  // La película se carga solo cuando le toca (preload="none"); hasta entonces se ve la foto de debajo
  const video = e.video ? `<video muted playsinline loop preload="none" aria-hidden="true" tabindex="-1"${pos}>
          <source src="/${e.media}-960.mp4" type="video/mp4" media="(max-width: 959px)">
          <source src="/${e.media}-1600.mp4" type="video/mp4">
        </video>` : '';
  return `<figure class="esc__slide${first ? ' is-active' : ''}" data-slide data-tone="${e.tone}" data-dur="${e.dur}" data-credit="${esc(e.credit)}"${first ? '' : ' aria-hidden="true"'}>
        ${img}${video}
      </figure>`;
}

/** Nombre, ciudad y año de la casa de cada campaña, en grande sobre la foto */
function escCasa(e, i) {
  const c = casaById(e.casa);
  return `<div class="esc__casa${i === 0 ? ' is-active' : ''}" data-esc-casa${i === 0 ? '' : ' hidden'}>
            <p class="esc__name"><span>${esc(c.name)}</span></p>
            <p class="esc__meta">${esc(c.city)} · ${esc(c.founded)}</p>
            <a class="link esc__link" href="${casaUrl(c)}">Ver las fragancias de ${esc(c.name)}</a>
          </div>`;
}

/** Tarjeta de compra de la fragancia de la campaña, si la tiene */
function escCard(e, i) {
  const f = e.frag && fragById(e.frag);
  if (!f) return '';
  return `<a class="esc__card${i === 0 ? ' is-active' : ''}" data-card="${i}"${i === 0 ? '' : ' hidden'} href="${fragUrl(f)}">
        <img src="${f.orig ? origSrc(f, 0, 160) : `/img/productos/${f.img}-400.webp`}" width="160" height="160" loading="lazy" alt="">
        <span class="esc__card-brand">${esc(casaById(e.casa).name)}</span>
        <span class="esc__card-name">${esc(f.name)}</span>
        <span class="esc__card-price">${f.sizes.length > 1 ? 'desde ' : ''}${euros(priceFrom(f))}</span>
        <span class="esc__card-go">Ver fragancia</span>
      </a>`;
}

function home(url) {
  const t = mainStore(), otras = SITE.stores.filter((s) => s !== t);
  const E = SITE.escaparate, n = String(E.length).padStart(2, '0'), first = E[0];
  const main = `
    <section class="hero" aria-labelledby="hero-title">
      <h1 class="hero__rotulo" id="hero-title" data-rotulo><span class="hero__lockup">${ROTULO}</span></h1>
      <div class="hero__row wrap">
        <figure class="hero__photo">
          <img src="/${t.img}-1448.webp" srcset="/${t.img}-800.webp 800w, /${t.img}-1448.webp 1448w" sizes="${HERO_SIZES}" width="1448" height="1086" fetchpriority="high" alt="${esc(t.imgAlt)}">
        </figure>
        <div class="hero__col hero__col--tienda">
          <p class="eyebrow hero__cat">Perfumería nicho</p>
          <p class="hero__big hero__addr">${esc(t.street).replace(/ (\S+)$/, '&nbsp;$1')}</p>
          <p class="hero__city">${esc(t.city)}</p>
          <a class="link hero__go" href="${storeUrl(t)}">Ver la tienda</a>
        </div>
        <div class="hero__col hero__col--hoy">
          <p class="eyebrow hero__when">Horario y teléfono</p>
          ${clock(t, hoursLine(t))}
          <p class="hero__big hero__tel"><a href="${telHref(t.phone)}">${esc(t.phone.replace(/^\+34\s*/, ''))}</a></p>
          <a class="btn btn--dark hero__btn" href="${u('comprar/')}">Comprar online</a>
        </div>
      </div>
      ${otras.length ? `<p class="hero__also">También en ${esc([...new Set(otras.map((s) => s.islandName))].join(' y '))}: ${otras.map((s) => `<a href="${storeUrl(s)}">${esc(s.name)}</a>`).join(' · ')}</p>` : ''}
    </section>

    <div class="brandline">
      <ul class="brandline__list wrap" aria-label="Casas que trabajamos" data-brandline>${brandStrip()}</ul>
    </div>

    <section class="esc" data-esc data-tone="${first.tone}" aria-labelledby="esc-title" aria-roledescription="escaparate">
      <div class="esc__stage">
      ${E.map(escSlide).join('\n      ')}
      </div>
      <p class="esc__credit" data-credit aria-live="polite"><span data-count>01</span> / ${n} · <span data-credit-text>${esc(first.credit)}</span></p>
      <div class="esc__copy">
        <h2 class="eyebrow esc__eyebrow" id="esc-title">En el escaparate</h2>
        <div class="esc__casas">
          ${E.map(escCasa).join('\n          ')}
        </div>
      </div>
      ${E.map(escCard).filter(Boolean).join('\n      ')}
      <div class="esc__nav" data-esc-nav hidden>
        <div class="esc__tabs" role="tablist" aria-label="Casas del escaparate">
          ${E.map((e, i) => `<button class="esc__tab" type="button" role="tab" data-tab aria-selected="${i === 0}"><span class="esc__bar"><i></i></span><span class="esc__tab-n">${String(i + 1).padStart(2, '0')}</span> ${esc(casaById(e.casa).name)}</button>`).join('\n          ')}
        </div>
        <button class="esc__pause" type="button" data-pause aria-pressed="false">${ICON.pause}${ICON.play}<span class="visually-hidden">Pausar el escaparate</span></button>
      </div>
    </section>

    <section class="seleccion section" aria-labelledby="seleccion-title">
      <div class="wrap">
        <header class="section__head section__head--row">
          <div data-reveal="up" data-stagger>
            <h2 class="section__title" id="seleccion-title">Las más pedidas</h2>
            <p class="section__intro">Las que más se llevan en nuestras tiendas. Cómpralas aquí o ven a olerlas antes.</p>
          </div>
          <a class="link section__more" href="${u('comprar/')}" data-reveal="up">Ver todo el catálogo</a>
        </header>
        <ul class="products products--carrusel">${featured.slice(0, 8).map((p, i) => productCard(p, { notes: true, i })).join('')}</ul>
        <p class="seleccion__more"><a class="btn btn--line" href="${u('comprar/')}">Ver todo el catálogo</a></p>
        <ul class="garantias" data-reveal="up" data-stagger>
          <li>${ICON.truck}<p><strong>Envío en ${SITE.shipping.days}</strong> Gratis a partir de ${euros(SITE.shipping.freeFrom)}.</p></li>
          <li>${ICON.store}<p><strong>Recogida gratis en tienda</strong> En ${oLista(SITE.stores.map((s) => s.name))}.</p></li>
          <li>${ICON.gift}<p><strong>Envoltorio de regalo</strong> Sin coste, en tienda y en los pedidos online.</p></li>
        </ul>
        ${SITE.demoPrices ? '<p class="products__note">Los precios de esta demo son inventados. En la tienda online verás cómo funcionaría la compra.</p>' : ''}
      </div>
    </section>

    <section class="barra section section--dark" aria-labelledby="barra-title">
      <div class="wrap barra__grid">
        <figure class="barra__media" data-reveal="clip">
          <img src="/img/tienda/interior-pasillo-800.webp" srcset="/img/tienda/interior-pasillo-800.webp 800w, /img/tienda/interior-pasillo-1380.webp 1380w" sizes="(min-width: 960px) 45vw, 100vw" width="1380" height="1038" loading="lazy" alt="Las vitrinas de la tienda de Triana: cristal iluminado y estantes llenos de frascos de perfume">
        </figure>
        <div class="barra__copy" data-reveal="up" data-stagger>
          <p class="eyebrow eyebrow--light">En la tienda</p>
          <h2 class="section__title" id="barra-title">Prueba el que quieras antes de comprarlo</h2>
          <p class="section__intro">Todos los perfumes están en las vitrinas. Pide a la dependienta el que quieras oler: te lo prueba en una tira o en la piel y te cuenta cómo es. No hace falta cita ni comprar nada.</p>
          <ul class="ritual">
            <li><h3>Consejo</h3><p>Dile qué perfumes te gustan y te propondrá otros que te pueden encajar.</p></li>
            <li><h3>Muestras para casa</h3><p>Llévate muestras de los que más te gusten y decide en casa.</p></li>
            <li><h3>Tu lista</h3><p>Guarda en la web los que quieras oler y enséñaselos a la dependienta al llegar.</p></li>
          </ul>
          <a class="btn btn--line" href="${u('probar/')}">Cómo es una visita</a>
        </div>
      </div>
    </section>

    <section class="section" aria-labelledby="tiendas-title">
      <div class="wrap">
        <header class="section__head section__head--row">
          <div data-reveal="up" data-stagger>
            <h2 class="section__title" id="tiendas-title">Nuestras tiendas</h2>
            <p class="section__intro">Abrimos la primera en Tenerife en 2022. La de Triana es la más nueva y la primera en Gran Canaria.</p>
          </div>
          <a class="link section__more" href="${u('tiendas/')}" data-reveal="up">Todas las tiendas</a>
        </header>
        <ul class="storecards" data-reveal="up" data-stagger>${SITE.stores.map((st) => storeCard(st)).join('')}</ul>
      </div>
    </section>

    <section class="section section--stone" aria-labelledby="guias-title">
      <div class="wrap">
        <header class="section__head section__head--row">
          <div data-reveal="up" data-stagger>
            <h2 class="section__title" id="guias-title">Guías para elegir perfume</h2>
            <p class="section__intro">Lo que más nos preguntan en tienda: cómo elegir, qué llevar con el calor de Canarias y cómo acertar con un regalo.</p>
          </div>
          <a class="link section__more" href="${u('guias/')}" data-reveal="up">Todas las guías</a>
        </header>
        <ul class="guiatexts">${GUIAS_PORTADA.map((id) => GUIAS.find((g) => g.id === id)).filter(Boolean).map(guiaTexto).join('')}</ul>
      </div>
    </section>`;
  return {
    path: '', section: 'home', intro: true, rotulo: true, main,
    title: 'Perfumería nicho en Las Palmas y Tenerife | The Fragrance Bar',
    ogTitle: 'The Fragrance Bar · Triana, Las Palmas de Gran Canaria',
    description: 'Perfumería nicho en la Calle Mayor de Triana (Las Palmas de Gran Canaria), Costa Adeje y Playa de las Américas. Creed, Xerjoff, Amouage, Initio y más.',
    preload: `<link rel="preload" as="image" href="/${t.img}-1448.webp" imagesrcset="/${t.img}-800.webp 800w, /${t.img}-1448.webp 1448w" imagesizes="${HERO_SIZES}">`,
    schema: schema.graph([
      { '@type': 'WebSite', '@id': `${url}/#web`, name: SITE.brand, url: `${url}/`, inLanguage: 'es' },
      schema.organization(SITE, url),
      ...SITE.stores.map((st) => schema.store(SITE, url, st))
    ])
  };
}

/** Tarjeta de una tienda: sus datos, si está abierta, el teléfono y cómo llegar.
    Por defecto sin foto, para que no quede un hueco vacío en las tiendas que aún no tienen
    (las de Tenerife); con photo, la foto de la tienda encima si la tiene (índice de tiendas) */
function storeCard(s, { photo = false } = {}) {
  const media = photo && s.img;
  return `
          <li class="storecard${media ? '' : ' storecard--texto'}">
            ${media ? `<figure class="storecard__media"><img src="/${s.cardImg || s.img}-800.webp" width="800" height="600" loading="lazy" alt=""></figure>` : ''}
            <div class="storecard__body">
              <p class="eyebrow">${esc(s.islandName)}${s.isNew ? ' · Nueva tienda' : ''}</p>
              <h3 class="storecard__title"><a href="${storeUrl(s)}">${esc(s.title)}</a></h3>
              <p class="storecard__addr">${esc(s.addressShort)}</p>
              ${clock(s)}
              <p class="storecard__acts"><a href="${telHref(s.phone)}">${ICON.phone}${esc(s.phone)}</a><a href="${s.mapsUrl}" target="_blank" rel="noopener">${ICON.pin}Cómo llegar${NEW_TAB}</a></p>
            </div>
          </li>`;
}

/** Las tiendas al pie de una casa o de una guía: dónde se puede oler lo que se acaba de ver (SEO local) */
const dondeProbar = (title, intro) => `<section class="section probar" aria-labelledby="probar-title">
        <div class="wrap">
          <header class="section__head" data-reveal="up" data-stagger>
            <h2 class="section__title" id="probar-title">${title}</h2>
            <p class="section__intro">${intro}</p>
          </header>
          <ul class="storecards">${SITE.stores.map((x) => storeCard(x)).join('')}</ul>
        </div>
      </section>`;

/* ---------------------------------------------------------------- Casas */
function casas(url) {
  const main = `${pageHead({
    crumbs: [['Inicio', ''], ['Casas']],
    eyebrow: 'Perfumería nicho',
    title: 'Las casas que trabajamos',
    intro: 'Estas son las marcas de perfumería nicho que tenemos en tienda. En cada una encontrarás su historia y sus fragancias.'
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
              <span class="casacard__count">${fragsDeCasa(c.id).length ? nFrag(fragsDeCasa(c.id).length) : 'Pruébalas en tienda'} ${ICON.arrow}</span>
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
            ${items.length ? `<a class="btn btn--dark" href="#fragancias">Ver ${items.length === 1 ? 'su fragancia' : `sus ${items.length} fragancias`}</a>` : ''}
            <a class="btn btn--line" href="${u('tiendas/')}">Probarlas en tienda</a>
          </div>
        </div>
      </header>

      ${items.length ? `<section class="section" id="fragancias" aria-labelledby="frag-title">
        <div class="wrap" data-paged>
          <header class="section__head section__head--row">
            <h2 class="section__title" id="frag-title" data-reveal="up">Fragancias de ${esc(c.name)}</h2>
            <a class="link section__more" href="${u(`comprar/?casa=${c.id}`)}" data-reveal="up">Filtrar en la tienda</a>
          </header>
          <ul class="products">${items.map((p, i) => productCard(p, { notes: true, i })).join('')}</ul>
          ${moreButton()}
          ${demoNote(SITE)}
        </div>
      </section>` : ''}

      ${dondeProbar(`${esc(c.name)} en Las Palmas y Tenerife`,
        `Puedes oler las fragancias de ${esc(c.name)} en nuestras tiendas de Triana, en Las Palmas de Gran Canaria, y de Plaza del Duque y Américas Plaza, en el sur de Tenerife. Pide a la dependienta la que quieras probar. Si buscas una en concreto, escríbenos antes y te decimos en qué tienda está.`)}

      <nav class="brandline brandline--foot" aria-label="Otras casas">
        <ul class="brandline__list wrap">${brandStrip(c.id)}</ul>
      </nav>
    </article>`;
  const bc = [['Inicio', ''], ['Casas', 'casas/'], [c.name, `casas/${c.id}/`]];
  return {
    path: `casas/${c.id}/`, section: 'casas', main,
    title: `${c.name} en Las Palmas y Tenerife | The Fragrance Bar`,
    description: fit(`${c.desc}`, ` Pruébala en Triana (Las Palmas), Costa Adeje y Playa de las Américas.`, ` Pruébala en Las Palmas y Tenerife.`, ` En The Fragrance Bar.`),
    ogImage: `${url}/img/casas/${c.img}-1000.webp`,
    preload: `<link rel="preload" as="image" href="/img/casas/${c.img}-1000.webp" imagesrcset="/img/casas/${c.img}-560.webp 560w, /img/casas/${c.img}-1000.webp 1000w" imagesizes="(min-width: 960px) 45vw, 100vw">`,
    schema: schema.graph([schema.breadcrumbs(url, bc), { '@type': 'CollectionPage', name: `${c.name} · The Fragrance Bar`, url: `${url}/casas/${c.id}/`, mainEntity: schema.itemList(url, items) }])
  };
}

/* ---------------------------------------------------------------- Comprar */
function comprar(url) {
  const enVenta = CASAS.filter((c) => fragsDeCasa(c.id).length);
  const main = `${pageHead({
    crumbs: [['Inicio', ''], ['Comprar']],
    eyebrow: 'Tienda online',
    title: 'Comprar fragancias',
    intro: `${enVenta.slice(0, 4).map((c) => c.name).join(', ')} y más casas nicho. Envío en ${SITE.shipping.days}, gratis desde ${euros(SITE.shipping.freeFrom)}, o recogida gratis en tienda.`,
    extra: demoNote(SITE)
  })}
    <section class="shop section section--tight" data-shop data-paged>
      <div class="wrap">
        <div class="toolbar" role="search" aria-label="Buscar y filtrar fragancias">
          <div class="toolbar__search">
            <label class="visually-hidden" for="q">Buscar fragancia o casa</label>
            ${ICON.search}<input id="q" type="search" placeholder="Buscar: Aventus, vainilla, Xerjoff…" autocomplete="off" data-q>
          </div>
          <div class="toolbar__selects">
            <label class="select"><span>Casa</span><select data-casa-filter>${[{ id: '', name: 'Todas' }, ...enVenta].map((c) => `<option value="${c.id}" data-label="${esc(c.name)}">${esc(c.name)}</option>`).join('')}</select></label>
            <label class="select"><span>Precio</span><select data-precio-filter>${[{ id: '', name: 'Todos' }, ...PRECIOS].map((r) => `<option value="${r.id}" data-label="${esc(r.name)}"${r.min ? ` data-min="${r.min}"` : ''}${r.max ? ` data-max="${r.max}"` : ''}>${esc(r.name)}</option>`).join('')}</select></label>
            <label class="select"><span>Ordenar</span><select data-sort>
              <option value="destacadas">Destacadas</option><option value="precio-asc">Precio: de menor a mayor</option><option value="precio-desc">Precio: de mayor a menor</option><option value="nombre">Nombre</option><option value="nuevas">Más recientes</option>
            </select></label>
          </div>
        </div>
        <div class="filters scroller" role="group" aria-label="Filtrar por familia olfativa" data-filters>
          ${[{ id: '', name: 'Todas' }, ...FAMILIAS].map((x) => `<button class="chip" type="button" data-familia-filter="${x.id}" aria-pressed="${x.id === ''}">${x.name} <span class="chip__n" data-n>${FRAGANCIAS.filter((p) => !x.id || p.familia === x.id).length}</span></button>`).join('')}
        </div>
        <p class="shop__count" data-count aria-live="polite">${nFrag(FRAGANCIAS.length)}</p>
        <ul class="products" data-products>${FRAGANCIAS.map((p, i) => productCard(p, { i })).join('')}</ul>
        ${moreButton()}
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
  const grupos = gruposDeNotas(p.notes);
  const main = `
    <div class="wrap pdp__crumbs">${crumbs([['Inicio', ''], ['Comprar', 'comprar/'], [c.name, `casas/${c.id}/`], [p.name]])}</div>
    <article class="pdp wrap" data-pdp="${p.id}">
      <div class="pdp__media">${productGallery(p)}</div>
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
          <li>${ICON.drop}<span><strong>Huélela antes en tienda.</strong> Pídesela a la dependienta en cualquiera de nuestras tiendas.</span></li>
          <li>${ICON.truck}<span><strong>Envío en ${SITE.shipping.days}.</strong> Gratis a partir de ${euros(SITE.shipping.freeFrom)}.</span></li>
          <li>${ICON.store}<span><strong>Recogida gratis</strong> en Triana, Plaza del Duque o Américas Plaza.</span></li>
          <li>${ICON.gift}<span><strong>Envoltorio de regalo</strong> sin coste.</span></li>
        </ul>
        <a class="pdp__ask" href="${whatsappHref(`Hola, me interesa ${label}. ¿Me podéis dar más información?`)}" target="_blank" rel="noopener">${ICON.whatsapp}<span>¿Dudas? Pregúntanos por WhatsApp</span>${NEW_TAB}</a>
      </div>
    </article>

    <section class="notes section section--stone" aria-labelledby="notes-title">
      <div class="wrap">
        <header class="section__head">
          <h2 class="section__title" id="notes-title" data-reveal="up">Notas olfativas</h2>
          <p class="notes__fuente" data-reveal="up">${grupos.length
            ? `Tal como las describe ${esc(c.name)} en su <a href="${p.notes.fuente}" target="_blank" rel="noopener">web oficial${NEW_TAB}</a>.`
            : `${esc(c.name)} guarda en secreto las notas de ${esc(p.name)}. Para conocerlo, lo mejor es olerlo: pídelo en cualquiera de nuestras tiendas.`}</p>
        </header>
        ${grupos.map(([t, notas]) => `<div class="notes__group" data-reveal="up">
          <h3 class="notes__tier">${t}</h3>
          <ul class="notes__list">${notas.map(nota).join('')}</ul>
        </div>`).join('')}
      </div>
    </section>

    ${related.length ? `<section class="section" aria-labelledby="rel-title">
      <div class="wrap">
        <header class="section__head section__head--row">
          <h2 class="section__title" id="rel-title" data-reveal="up">También te puede gustar</h2>
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
    description: fit(`${label}, ${CONCENTRACIONES[p.conc].toLowerCase()}${p.year ? ` de ${p.year}` : ''}. ${p.desc}`, notasPlanas(p.notes).length ? ` Notas: ${notasPlanas(p.notes).join(', ').toLowerCase()}.` : '', ' En The Fragrance Bar.'),
    ogImage: p.orig ? `${url}/img/originales/${p.id}-a-1600.webp` : `${url}/img/productos/${p.img}-800.webp`,
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
  const main = `${pageHead({ crumbs: [['Inicio', ''], ['Comprar', 'comprar/'], ['Cesta']], title: 'Tu cesta', extra: demoNote(SITE) })}
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
          <h2 class="success__title">Gracias, <span data-order-name></span></h2>
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

/* ---------------------------------------------------------------- Probar en tienda */
// Cómo se prueba un perfume en las tiendas: todo está en vitrinas y la dependienta te saca el que quieras oler
function probar(url) {
  const main = `
    <header class="barrahero section--dark">
      <div class="wrap barrahero__grid">
        <div class="barrahero__copy" data-reveal="up" data-stagger>
          ${crumbs([['Inicio', ''], ['Probar en tienda']])}
          <p class="eyebrow eyebrow--light">Probar en tienda</p>
          <h1 class="pagehead__title">Cómo probar un perfume en la tienda</h1>
          <p class="pagehead__intro">En nuestras tiendas todos los perfumes están en vitrinas. Para oler cualquiera, pregunta a la dependienta: te lo saca y te lo prueba en una tira o en la piel. No hace falta cita ni comprar nada.</p>
        </div>
        <figure class="barrahero__media" data-reveal="clip">
          <img src="/img/tienda/interior-pasillo-800.webp" srcset="/img/tienda/interior-pasillo-800.webp 800w, /img/tienda/interior-pasillo-1380.webp 1380w" sizes="(min-width: 960px) 40vw, 100vw" width="1380" height="1038" fetchpriority="high" alt="Las vitrinas de la tienda de Triana: cristal iluminado y estantes llenos de frascos de perfume">
        </figure>
      </div>
    </header>

    <section class="section" aria-labelledby="ritual-title">
      <div class="wrap">
        <header class="section__head" data-reveal="up" data-stagger>
          <h2 class="section__title" id="ritual-title">Cómo es una visita</h2>
          <p class="section__intro">Si es tu primera vez, así suele ir.</p>
        </header>
        <ol class="steps" data-reveal="up" data-stagger>
          <li><span class="steps__n">01</span><h3>Mira las vitrinas</h3><p>Todos los perfumes están a la vista, ordenados por casa. Fíjate en los que te llamen la atención, aunque no conozcas la marca.</p></li>
          <li><span class="steps__n">02</span><h3>Pregunta a la dependienta</h3><p>Dile cuál quieres oler y te lo saca de la vitrina. Si no sabes por dónde empezar, cuéntale qué perfumes te gustan y te propondrá algunos.</p></li>
          <li><span class="steps__n">03</span><h3>Primero en tira</h3><p>Te los prueba en tiras de papel. Así se descarta rápido y te quedas con dos o tres.</p></li>
          <li><span class="steps__n">04</span><h3>Después en la piel</h3><p>El que más te guste, en la muñeca. Un perfume cambia con el calor de la piel, así que dale unos minutos antes de decidir, o vuelve otro día.</p></li>
        </ol>
      </div>
    </section>

    <section class="section section--stone" aria-labelledby="servicios-title">
      <div class="wrap">
        <h2 class="section__title" id="servicios-title" data-reveal="up">También puedes pedir</h2>
        <ul class="services" data-reveal="up" data-stagger>
          <li>${ICON.drop}<h3>Muestras para casa</h3><p>Pide muestras de los que te hayan gustado y decide en casa, sin prisa.</p></li>
          <li>${ICON.gift}<h3>Regalos</h3><p>Te ayudamos a elegir y lo envolvemos sin coste. También hay tarjeta regalo.</p></li>
          <li>${ICON.heart}<h3>Tu lista</h3><p>Guarda en la web los que te interesen y enséñaselos a la dependienta al llegar, o mándanoslos por WhatsApp.</p></li>
        </ul>
        <div class="hero__ctas" data-reveal="up">
          <a class="btn btn--dark" href="${u('tiendas/')}">Ver las tiendas</a>
          <a class="btn btn--line" href="${u('comprar/')}">Ver el catálogo</a>
        </div>
        <p class="barra__guia" data-reveal="up">¿Primera vez? Lee <a href="${u('guias/como-elegir-un-perfume/')}">cómo elegir un perfume sin equivocarte</a>.</p>
      </div>
    </section>`;
  return {
    path: 'probar/', section: 'probar', main,
    title: 'Probar perfumes nicho en tienda, sin cita | The Fragrance Bar',
    description: 'En las tiendas de The Fragrance Bar los perfumes están en vitrinas: pide a la dependienta el que quieras oler y te lo prueba en tira o en la piel, sin cita.',
    schema: schema.graph([schema.breadcrumbs(url, [['Inicio', ''], ['Probar en tienda', 'probar/']])])
  };
}

/* ---------------------------------------------------------------- Historia */
// El rótulo de verdad, en la pared de la tienda de Triana (foto del interior)
function historiaFoto() {
  const f = mainStore().interior.find((x) => x.img.endsWith('lamparas'));
  return `<figure class="pagehead__media"><img src="/${f.img}-800.webp" srcset="${f.sizes.map((w) => `/${f.img}-${w}.webp ${Math.min(w, f.w)}w`).join(', ')}" sizes="(min-width: 960px) 40vw, 100vw" width="${f.w}" height="${f.h}" fetchpriority="high" alt="${esc(f.alt)}"></figure>`;
}

function historia(url) {
  const main = `${pageHead({ crumbs: [['Inicio', ''], ['Historia']], eyebrow: 'Desde 2022', title: 'Nuestra historia',
    intro: 'The Fragrance Bar nace de un negocio familiar de perfumería y de una idea sencilla: en Canarias faltaba una tienda dedicada solo a la perfumería nicho.',
    cls: 'pagehead--foto', extra: historiaFoto() })}
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
/** Las tiendas agrupadas por isla, en el orden de SITE.stores: [['Gran Canaria', [triana]], ['Tenerife', […]]] */
const islas = () => [...SITE.stores.reduce((m, s) => m.set(s.islandName, [...(m.get(s.islandName) || []), s]), new Map())];

function tiendas(url) {
  const main = `${pageHead({ crumbs: [['Inicio', ''], ['Tiendas']], eyebrow: 'Gran Canaria y Tenerife', title: 'Nuestras tiendas',
    intro: 'Una en la Calle Mayor de Triana, en Las Palmas de Gran Canaria, y dos en centros comerciales del sur de Tenerife. Puedes venir sin cita a cualquiera.' })}
    ${islas().map(([isla, list]) => `<section class="section section--tight isla" aria-labelledby="isla-${list[0].island}">
      <div class="wrap">
        <h2 class="isla__title" id="isla-${list[0].island}" data-reveal="up">Perfumería nicho en ${esc(isla)}</h2>
        <ul class="storecards storecards--big" data-reveal="up" data-stagger>${list.map((x) => storeCard(x, { photo: true })).join('')}</ul>
      </div>
    </section>`).join('')}`;
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
          <h1 class="pagehead__title">${esc(s.title)}</h1>
          <p class="pagehead__intro">${esc(s.intro)}</p>
          ${clock(s)}
          ${storeFicha(s)}
          <div class="hero__ctas">
            <a class="btn btn--dark" href="${s.mapsUrl}" target="_blank" rel="noopener">Cómo llegar${NEW_TAB}</a>
            <a class="btn btn--line" href="${telHref(s.phone)}">Llamar</a>
          </div>
        </div>
        ${s.img
          ? `<figure class="storehero__media"><img src="/${s.img}-1448.webp" srcset="/${s.img}-800.webp 800w, /${s.img}-1448.webp 1448w" sizes="(min-width: 960px) 50vw, 100vw" width="1448" height="1086" fetchpriority="high" alt="${esc(s.imgAlt)}"></figure>`
          : `<div class="storehero__media storehero__media--map">${mapBox(s)}</div>`}
      </header>

      ${s.interior ? `<section class="section section--tight" aria-labelledby="dentro-title">
        <div class="wrap">
          <h2 class="section__title" id="dentro-title" data-reveal="up">Dentro de la tienda</h2>
          <ul class="interior" data-reveal="up" data-stagger>${s.interior.map((x) => {
            const set = x.sizes.map((w) => `/${x.img}-${w}.webp ${Math.min(w, x.w)}w`).join(', ');
            return `<li><figure class="interior__media"><img src="/${x.img}-800.webp" srcset="${set}" sizes="(min-width: 960px) 40vw, 100vw" width="${x.w}" height="${x.h}" loading="lazy" alt="${esc(x.alt)}"></figure></li>`;
          }).join('')}</ul>
        </div>
      </section>` : ''}

      ${s.img ? `<section class="section section--tight" aria-label="Mapa"><div class="wrap">${mapBox(s)}</div></section>` : ''}

      <section class="section" aria-labelledby="casas-tienda-title">
        <div class="wrap localseo">
          <div data-reveal="up" data-stagger>
            <h2 class="section__title" id="casas-tienda-title">Perfumería nicho en ${esc(s.city)}</h2>
            <p class="section__intro">Si vienes desde ${esc(s.near)}, en The Fragrance Bar ${esc(s.name)} tienes las casas que trabajamos. Pide a la dependienta las que quieras oler y te las prueba en tira o en la piel. No hace falta cita.</p>
            <a class="link" href="${u('probar/')}">Cómo es una visita</a>
          </div>
          <ul class="localseo__casas" data-reveal="up" data-stagger>${CASAS.map((c) => `<li><a href="${casaUrl(c)}"><span>${esc(c.name)}</span><small>${esc(c.icons.slice(0, 2).join(' · '))}</small></a></li>`).join('')}</ul>
        </div>
      </section>

      <section class="section section--stone" aria-labelledby="opiniones-title">
        <div class="wrap reviews">
          <div data-reveal="up" data-stagger>
            <h2 class="section__title" id="opiniones-title">Opiniones en Google</h2>
            <p class="section__intro">Lo que cuentan nuestros clientes en la ficha de la tienda.</p>
            <a class="link" href="${s.gbp || s.mapsUrl}" target="_blank" rel="noopener">Ver las reseñas y dejar la tuya${NEW_TAB}</a>
          </div>
          <p class="reviews__proto" data-proto>Prototipo: aquí se mostrarán las reseñas reales de la ficha de Google Business Profile de la tienda, con su valoración media.</p>
        </div>
      </section>

      <section class="section" aria-labelledby="otras-title">
        <div class="wrap">
          <h2 class="section__title" id="otras-title" data-reveal="up">Otras tiendas</h2>
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

/* ---------------------------------------------------------------- Guías */
/** Párrafo de una guía: texto plano con enlaces internos [texto](ruta) */
const prosa = (t) => esc(t).replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, txt, path) => `<a href="${u(path)}">${txt}</a>`);
const fechaLarga = (d) => new Date(`${d}T12:00:00`).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
/** Las fragancias publicadas de las que habla la guía (portada de su tarjeta: la primera) */
const fragsDe = (ids = []) => ids.map(fragById).filter(Boolean);
const fragsGuia = (g) => fragsDe(g.sections.flatMap((x) => x.frags || []));

/** Guía en una tarjeta de solo texto (portada): en la portada sus frascos repetirían los de «Las más pedidas» */
const guiaTexto = (g, i) => `
          <li class="guiatext" data-reveal="up" data-reveal-delay="${i * 80}">
            <a class="guiatext__link" href="${u(`guias/${g.id}/`)}">
              <span class="eyebrow">${esc(g.eyebrow)}</span>
              <span class="guiatext__title">${esc(g.title)}</span>
              <span class="guiatext__desc">${esc(g.lede)}</span>
              <span class="guiatext__go">Leer la guía ${ICON.arrow}</span>
            </a>
          </li>`;

function guiaCard(g, i = 0) {
  const p = fragsGuia(g)[0];
  return `
          <li class="guiacard" data-reveal="up" data-reveal-delay="${(i % 3) * 80}">
            <a class="guiacard__link" href="${u(`guias/${g.id}/`)}">
              ${p ? productMedia(p, { sizes: '(min-width: 1100px) 30vw, (min-width: 640px) 46vw, 100vw', vt: false, hover: false }) : ''}
              <span class="eyebrow">${esc(g.eyebrow)}</span>
              <span class="guiacard__title">${esc(g.title)}</span>
              <span class="guiacard__desc">${esc(g.lede)}</span>
            </a>
          </li>`;
}

function guias(url) {
  const main = `${pageHead({ crumbs: [['Inicio', ''], ['Guías']], eyebrow: 'Guías', title: 'Guías de perfumería nicho',
    intro: 'Respuestas a lo que más nos preguntan en tienda: qué es el nicho, cómo elegir, qué llevar con el calor de Canarias y cómo acertar con un regalo.' })}
    <section class="section section--tight">
      <ul class="wrap guiagrid">${GUIAS.map(guiaCard).join('')}</ul>
    </section>`;
  return {
    path: 'guias/', section: 'guias', main,
    title: 'Guías de perfumería nicho | The Fragrance Bar',
    description: 'Guías de The Fragrance Bar: qué es la perfumería nicho, cómo elegir un perfume, perfumes para el calor de Canarias, concentraciones y regalos.',
    schema: schema.graph([schema.breadcrumbs(url, [['Inicio', ''], ['Guías', 'guias/']]),
      { '@type': 'CollectionPage', name: 'Guías de perfumería nicho', url: `${url}/guias/`,
        mainEntity: { '@type': 'ItemList', itemListElement: GUIAS.map((g, i) => ({ '@type': 'ListItem', position: i + 1, url: `${url}/guias/${g.id}/` })) } }])
  };
}

function guia(url, g) {
  const otras = GUIAS.filter((x) => x.id !== g.id).slice(0, 3);
  const portada = fragsGuia(g)[0];
  const main = `
    <article class="guia">
      ${pageHead({ crumbs: [['Inicio', ''], ['Guías', 'guias/'], [g.title]], eyebrow: esc(g.eyebrow), title: g.h1, intro: esc(g.lede),
        extra: `<p class="guia__meta">The Fragrance Bar · <time datetime="${g.updated || g.date}">${fechaLarga(g.updated || g.date)}</time></p>` })}
      <div class="wrap guia__body">${g.sections.map((x) => {
        const fr = fragsDe(x.frags);
        return `
        <section class="guia__section">
          <h2>${esc(x.h)}</h2>
          ${x.p.map((t) => `<p>${prosa(t)}</p>`).join('\n          ')}
          ${fr.length ? `<ul class="products guia__products">${fr.map((p, i) => productCard(p, { i })).join('')}</ul>` : ''}
        </section>`;
      }).join('')}
        ${fragsGuia(g).length ? demoNote(SITE) : ''}
      </div>

      ${dondeProbar('Dónde olerlas', 'Las fragancias de esta guía se pueden oler en nuestras tiendas de Las Palmas de Gran Canaria y del sur de Tenerife. Pídeselas a la dependienta; no hace falta cita.')}

      <section class="section" aria-labelledby="otras-guias-title">
        <div class="wrap">
          <header class="section__head section__head--row">
            <h2 class="section__title" id="otras-guias-title" data-reveal="up">Otras guías</h2>
            <a class="link section__more" href="${u('guias/')}" data-reveal="up">Todas las guías</a>
          </header>
          <ul class="guiagrid">${otras.map(guiaCard).join('')}</ul>
        </div>
      </section>
    </article>`;
  const bc = [['Inicio', ''], ['Guías', 'guias/'], [g.title, `guias/${g.id}/`]];
  return {
    path: `guias/${g.id}/`, section: 'guias', main,
    // Sin la marca si el título ya es largo (Google corta hacia los 60 caracteres)
    title: g.title.length > 46 ? g.title : `${g.title} | The Fragrance Bar`,
    description: g.description,
    ...(portada?.orig && { ogImage: `${url}/img/originales/${portada.id}-a-1600.webp` }),
    schema: schema.graph([schema.breadcrumbs(url, bc), schema.organization(SITE, url),
      schema.article(SITE, url, { ...g, img: portada?.orig ? `img/originales/${portada.id}-a-1600.webp` : '', about: fragsGuia(g).map((p) => ({ '@type': 'Product', name: `${casaById(p.casa).name} ${p.name}`, url: `${url}/fragancias/${p.id}/` })) })])
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
          <h2 class="section__title" id="faq-title">Preguntas frecuentes</h2>
          <p class="section__intro">Lo que más nos preguntan en tienda.</p>
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
    description: 'Escribe a The Fragrance Bar por WhatsApp, teléfono o correo. Muestras, tarjeta regalo, envíos y lo que más nos preguntan en tienda.',
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
        <a href="#aviso-legal">Aviso legal</a><a href="#privacidad">Privacidad</a><a href="#cookies">Cookies</a><a href="#creditos">Créditos</a>
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
        <section id="creditos" aria-labelledby="t-creditos">
          <h2 id="t-creditos">Créditos de las imágenes</h2>
          <p>Las fotos de los frascos son las oficiales de cada casa. Las notas olfativas de cada fragancia son las que publica su casa en su web. Las fotos de las notas vienen de <a href="https://commons.wikimedia.org" rel="noopener" target="_blank">Wikimedia Commons${NEW_TAB}</a> y se usan según la licencia de cada una:</p>
          ${Object.keys(NOTAS_FOTOS).length ? `<ul class="legal__credits">${Object.entries(NOTAS_FOTOS).map(([k, f]) => `<li><strong>${esc(NOTAS[k].name)}:</strong> <a href="${f.url}" rel="noopener" target="_blank">${esc(f.titulo)}${NEW_TAB}</a>, de ${esc(f.autor)}, <a href="${f.licenciaUrl}" rel="noopener" target="_blank">${esc(f.licencia)}${NEW_TAB}</a>${f.cambios ? '. Recortada' : ''}.</li>`).join('')}</ul>` : ''}
        </section>
      </div>
    </div>`;
  return { path: 'legal/', section: 'legal', main, title: 'Información legal | The Fragrance Bar',
    description: 'Aviso legal, política de privacidad, política de cookies y créditos de las imágenes de The Fragrance Bar.' };
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
    probar(url), historia(url), tiendas(url), ...SITE.stores.map((s) => tienda(url, s)),
    guias(url), ...GUIAS.map((g) => guia(url, g)),
    contacto(url), legal(), notFound()
  ];
  return Object.fromEntries(list.map((p) => [p.path.endsWith('.html') ? p.path : `${p.path}index.html`, layout(p, url)]));
}
