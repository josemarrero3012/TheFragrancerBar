/* ==========================================================================
   The Fragrance Bar · Triana — main.js (v2)
   1. SITE: datos editables (casas, selección, tiendas, horario, contacto)
   2. Utilidades   3. Render   4. Interacciones   5. Arranque
   ========================================================================== */

/* --------------------------------------------------------------------------
   1. SITE · Todo lo marcado PROVISIONAL debe confirmarlo el negocio.
   Imágenes de producto: material oficial de cada casa (ver /assets/img).
   -------------------------------------------------------------------------- */
const SITE = {
  brand: 'The Fragrance Bar',
  timezone: 'Atlantic/Canary',

  contact: {
    address: 'Calle Mayor de Triana (número por confirmar), 35002 Las Palmas de Gran Canaria', // PROVISIONAL
    addressShort: 'Calle Mayor de Triana, Las Palmas de Gran Canaria',
    street: 'Calle Mayor de Triana', postalCode: '35002', city: 'Las Palmas de Gran Canaria', region: 'Las Palmas',
    // Contacto general publicado en thefragrancebar.es. Confirmar si Triana tendrá teléfono propio
    phone: '+34 670 680 692',
    email: 'info@thefragrancebar.es',
    geo: { lat: 28.1035, lng: -15.4160 },     // PROVISIONAL (aprox.)
    howTo: 'A cinco minutos andando del Parque de San Telmo y su intercambiador de guaguas. Parking público en San Bernardo.',
    mapQuery: 'Calle Mayor de Triana, Las Palmas de Gran Canaria'
  },

  // Índice 0 = domingo; null = cerrado. PROVISIONAL
  hours: [null, ['10:00', '21:00'], ['10:00', '21:00'], ['10:00', '21:00'], ['10:00', '21:00'], ['10:00', '21:00'], ['10:00', '21:00']],

  // Tiendas de Tenerife (fuente: thefragrancebar.es)
  stores: [
    { name: 'CC Plaza del Duque', detail: 'Local B26 · Costa Adeje, Tenerife' },
    { name: 'CC Américas Plaza', detail: 'Playa de las Américas, Tenerife' }
  ],

  social: [{ name: 'Instagram', url: '#' }, { name: 'Facebook', url: '#' }, { name: 'WhatsApp', url: '#' }], // PROVISIONAL

  casas: [
    { id: 'creed', name: 'Creed', city: 'Londres · París', img: 'creed',
      alt: 'Creed Aventus entre piña, bergamota y una roca',
      desc: 'Casa de herencia familiar, nacida como sastrería en Londres. Perfumes frescos y amaderados de gran presencia.',
      icons: ['Aventus', 'Green Irish Tweed', 'Silver Mountain Water'] },
    { id: 'amouage', name: 'Amouage', city: 'Mascate, Omán', img: 'amouage',
      alt: 'Frasco de Amouage Guidance 46 sobre fondo rosado',
      desc: 'La casa de Omán que llevó el incienso y la tradición perfumista árabe a la alta perfumería.',
      icons: ['Interlude Man', 'Reflection Man', 'Guidance'] },
    { id: 'xerjoff', name: 'Xerjoff', city: 'Turín, Italia', img: 'xerjoff',
      alt: 'Xerjoff Naxos sobre un mapa antiguo con una cinta verde',
      desc: 'Lujo italiano: cristal tallado, tapones dorados y composiciones luminosas y generosas.',
      icons: ['Naxos', 'Erba Pura', 'Alexandria II'] },
    { id: 'pdm', name: 'Parfums de Marly', city: 'París', img: 'parfums-de-marly',
      alt: 'Detalle del frasco azul de Layton con los caballos en relieve',
      desc: 'Inspirada en la tradición ecuestre de la corte francesa del siglo XVIII. Elegancia clásica, muy ponible.',
      icons: ['Layton', 'Delina', 'Pegasus'] },
    { id: 'initio', name: 'Initio', city: 'París', img: 'initio',
      alt: 'Frasco de Initio Oud for Greatness emergiendo de un líquido dorado',
      desc: 'Perfumes construidos alrededor de materias de gran magnetismo, como el oud y los almizcles.',
      icons: ['Oud for Greatness', 'Side Effect', 'Rehab'] },
    { id: 'montale', name: 'Montale', city: 'París', img: 'montale',
      alt: 'Frasco metálico negro de Montale Arabians Tonka',
      desc: 'Pionera del oud en Occidente. Fragancias intensas y duraderas en su característico frasco de aluminio.',
      icons: ['Arabians Tonka', 'Intense Café', 'Black Aoud'] },
    { id: 'memo', name: 'Memo Paris', city: 'París', img: 'memo',
      alt: 'Frasco de Memo Paris Marfa sobre una ilustración de paisaje desértico',
      desc: 'Perfumes de viaje: cada fragancia es un destino, contado con materias primas excepcionales.',
      icons: ['Marfa', 'African Leather', 'Irish Leather'] },
    { id: 'tomford', name: 'Tom Ford', city: 'Private Blend', img: 'tom-ford',
      alt: 'Tom Ford Tobacco Vanille entre hojas de tabaco secas',
      desc: 'La colección Private Blend: lujo nocturno y sensual, con tabaco, oud, cuero y vainilla.',
      icons: ['Tobacco Vanille', 'Oud Wood', 'Lost Cherry'] }
  ],

  familias: [
    { id: 'frescas', name: 'Frescas y afrutadas' },
    { id: 'florales', name: 'Florales' },
    { id: 'amaderadas', name: 'Amaderadas' },
    { id: 'ambar', name: 'Ámbar y especiadas' }
  ],

  // Selección: notas principales según cada casa. Precios: consultar en tienda.
  seleccion: [
    { id: 'aventus', casa: 'creed', name: 'Aventus', familia: 'frescas', img: 'creed-aventus', notes: 'Piña, bergamota, abedul ahumado, almizcle' },
    { id: 'delina', casa: 'pdm', name: 'Delina', familia: 'florales', img: 'pdm-delina', notes: 'Lichi, ruibarbo, rosa turca, vainilla' },
    { id: 'ofg', casa: 'initio', name: 'Oud for Greatness', familia: 'amaderadas', img: 'initio-ofg', notes: 'Azafrán, nuez moscada, oud, pachulí' },
    { id: 'naxos', casa: 'xerjoff', name: 'Naxos', familia: 'ambar', img: 'xerjoff-naxos', notes: 'Lavanda, bergamota, miel, tabaco, haba tonka' },
    { id: 'interlude', casa: 'amouage', name: 'Interlude Man', familia: 'amaderadas', img: 'amouage-interlude', notes: 'Orégano, incienso, ámbar, oud' },
    { id: 'tobacco-vanille', casa: 'tomford', name: 'Tobacco Vanille', familia: 'ambar', img: 'tf-tobacco-vanille', notes: 'Hoja de tabaco, vainilla, haba tonka, cacao' },
    { id: 'erba-pura', casa: 'xerjoff', name: 'Erba Pura', familia: 'frescas', img: 'xerjoff-erbapura', notes: 'Naranja siciliana, frutas, almizcle blanco, ámbar' },
    { id: 'layton', casa: 'pdm', name: 'Layton', familia: 'ambar', img: 'pdm-layton', notes: 'Manzana, lavanda, cardamomo, vainilla' },
    { id: 'marfa', casa: 'memo', name: 'Marfa', familia: 'florales', editorial: 'assets/img/casas/memo-560.webp', notes: 'Nardo, flor de azahar, agave, sándalo' },
    { id: 'guidance', casa: 'amouage', name: 'Guidance 46', familia: 'florales', img: 'amouage-guidance46', notes: 'Pera, avellana, rosa, incienso' },
    { id: 'arabians-tonka', casa: 'montale', name: 'Arabians Tonka', familia: 'ambar', img: 'montale-arabians-tonka', notes: 'Azafrán, rosa, oud, haba tonka' }
  ]
};

/* --------------------------------------------------------------------------
   2. UTILIDADES
   -------------------------------------------------------------------------- */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const DAYS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const pad = (n) => String(n).padStart(2, '0');
const toMin = (t) => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
const casaById = (id) => SITE.casas.find((c) => c.id === id);
const store = {
  get(k, f) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : f; } catch { return f; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* sin almacenamiento */ } }
};

/** Hora actual en Canarias, sea cual sea la zona del visitante */
function canaryNow() {
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-GB', {
    timeZone: SITE.timezone, year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hour12: false, weekday: 'short'
  }).formatToParts(new Date()).map((x) => [x.type, x.value]));
  const hour = Number(p.hour) % 24;
  return { day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(p.weekday), hour, minute: Number(p.minute),
    mins: hour * 60 + Number(p.minute), iso: `${p.year}-${p.month}-${p.day}` };
}

/** Marca las imágenes como cargadas para el fundido suave */
function fadeIn(img) {
  img.classList.add('fade');
  if (img.complete && img.naturalWidth) img.classList.add('is-loaded');
  else img.addEventListener('load', () => img.classList.add('is-loaded'), { once: true });
}

/* --------------------------------------------------------------------------
   3. RENDER
   -------------------------------------------------------------------------- */
function bindData() {
  $$('[data-bind]').forEach((el) => { const v = SITE.contact[el.dataset.bind]; if (v) el.textContent = v; });
  $$('[data-bind-href]').forEach((el) => {
    el.href = el.dataset.bindHref === 'tel' ? `tel:${SITE.contact.phone.replace(/\s/g, '')}` : `mailto:${SITE.contact.email}`;
  });
  $('[data-year]').textContent = new Date().getFullYear();
  $('[data-social]').innerHTML = SITE.social.map((s) => `<li><a href="${s.url}">${s.name}</a></li>`).join('');
  $('[data-stores]').innerHTML = `<li><p class="label">También en Tenerife</p></li>` +
    SITE.stores.map((t) => `<li><span class="n">${t.name}</span><span class="a">${t.detail}</span></li>`).join('');
  $('[data-stores-footer]').innerHTML = SITE.stores.map((t) => `<li>${t.name}<br>${t.detail}</li>`).join('');
  $('[data-brandline]').innerHTML = SITE.casas.map((c) => `<li><a href="#casas" data-brand-jump="${c.id}">${c.name}</a></li>`).join('');
}

function hourGroups() {
  const groups = [];
  [1, 2, 3, 4, 5, 6, 0].forEach((d) => {
    const key = SITE.hours[d] ? SITE.hours[d].join('–') : 'Cerrado';
    const last = groups[groups.length - 1];
    if (last && last.key === key) last.days.push(d); else groups.push({ key, days: [d] });
  });
  const cap = (s) => s[0].toUpperCase() + s.slice(1);
  return groups.map((g) => ({
    days: g.days, value: g.key,
    label: g.days.length > 1 ? `${cap(DAYS[g.days[0]])} a ${DAYS[g.days[g.days.length - 1]]}` : cap(DAYS[g.days[0]])
  }));
}
function renderHours() {
  const today = canaryNow().day, groups = hourGroups();
  $('[data-hours]').innerHTML = `<span class="hours">${groups.map((g) =>
    `<span class="${g.days.includes(today) ? 'is-today' : ''}"><span>${g.label}</span><span>${g.value}</span></span>`).join('')}</span>`;
  $('[data-hours-short]').textContent = groups.map((g) => `${g.label}: ${g.value}`).join('. ');
}

function injectSchema() {
  const en = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const c = SITE.contact;
  const data = {
    '@context': 'https://schema.org', '@type': 'LocalBusiness',
    name: `${SITE.brand} Triana`, description: 'Perfumería nicho en Triana, Las Palmas de Gran Canaria.',
    image: 'assets/og-tienda.jpg', telephone: c.phone, email: c.email, priceRange: '€€€',
    address: { '@type': 'PostalAddress', streetAddress: c.street, postalCode: c.postalCode, addressLocality: c.city, addressRegion: c.region, addressCountry: 'ES' },
    geo: { '@type': 'GeoCoordinates', latitude: c.geo.lat, longitude: c.geo.lng },
    openingHoursSpecification: SITE.hours.map((h, d) => h && { '@type': 'OpeningHoursSpecification', dayOfWeek: en[d], opens: h[0], closes: h[1] }).filter(Boolean)
  };
  const s = document.createElement('script');
  s.type = 'application/ld+json'; s.textContent = JSON.stringify(data);
  document.head.appendChild(s);
}

/* --------------------------------------------------------------------------
   4. INTERACCIONES
   -------------------------------------------------------------------------- */

/* Cabecera, sección activa y menú móvil */
function initHeader() {
  const header = $('[data-header]');
  const onScroll = () => header.classList.toggle('is-scrolled', scrollY > 8);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  const links = $$('.nav a');
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) links.forEach((a) => a.setAttribute('aria-current', String(a.hash === `#${e.target.id}`)));
  }), { rootMargin: '-45% 0px -50% 0px' });
  $$('main section[id]').forEach((s) => io.observe(s));

  const btn = $('.burger'), menu = $('#menu-movil'), label = $('.burger__label');
  let t;
  const setOpen = (open) => {
    clearTimeout(t);
    btn.setAttribute('aria-expanded', String(open));
    label.textContent = open ? 'Cerrar' : 'Menú';
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) { menu.hidden = false; requestAnimationFrame(() => menu.classList.add('is-open')); $('a', menu).focus({ preventScroll: true }); }
    else { menu.classList.remove('is-open'); t = setTimeout(() => { menu.hidden = true; }, 350); }
  };
  btn.addEventListener('click', () => setOpen(btn.getAttribute('aria-expanded') !== 'true'));
  $$('a', menu).forEach((a) => a.addEventListener('click', () => setOpen(false)));
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && btn.getAttribute('aria-expanded') === 'true') { setOpen(false); btn.focus(); } });
}

/* Estado de apertura */
function initClock() {
  const el = $('[data-clock]'), txt = $('.status__text', el);
  const update = () => {
    const n = canaryNow(), h = SITE.hours[n.day];
    el.classList.remove('is-open', 'is-last');
    if (h && n.mins >= toMin(h[0]) && n.mins < toMin(h[1])) {
      const last = toMin(h[1]) - n.mins <= 30;
      el.classList.add(last ? 'is-last' : 'is-open');
      txt.textContent = last ? `Cerramos pronto, a las ${h[1]}` : `Abierto ahora · hasta las ${h[1]}`;
    } else if (h && n.mins < toMin(h[0])) {
      txt.textContent = `Cerrado · abrimos hoy a las ${h[0]}`;
    } else {
      for (let i = 1; i <= 7; i++) {
        const d = (n.day + i) % 7;
        if (SITE.hours[d]) { txt.textContent = `Cerrado · abrimos ${i === 1 ? 'mañana' : `el ${DAYS[d]}`} a las ${SITE.hours[d][0]}`; break; }
      }
    }
  };
  update(); setInterval(update, 60000);
}

/* Casas: lista + imagen editorial */
function initCasas() {
  const list = $('[data-brands]');
  list.innerHTML = SITE.casas.map((c) => `
    <li role="presentation"><button class="casa" type="button" role="tab" id="tab-${c.id}" data-brand="${c.id}" aria-selected="false" aria-controls="casa-panel">
      <span class="casa__name">${c.name}</span><span class="casa__city">${c.city}</span>
    </button></li>`).join('');
  $('.casas__panel').id = 'casa-panel';

  // Precarga ligera de las imágenes editoriales
  const wide = matchMedia('(min-width: 960px)').matches;
  const src = (c) => `assets/img/casas/${c.img}-${wide ? 1000 : 560}.webp`;
  SITE.casas.forEach((c) => { const i = new Image(); i.src = src(c); });

  const box = $('[data-brand-img]');
  let current = null;
  const select = (id, focus = false) => {
    if (id === current) return;
    current = id;
    const c = casaById(id);
    $$('.casa', list).forEach((b) => {
      const on = b.dataset.brand === id;
      b.setAttribute('aria-selected', String(on)); b.tabIndex = on ? 0 : -1;
      if (on && focus) b.focus();
    });
    $('.casas__panel').setAttribute('aria-labelledby', `tab-${id}`);
    const img = new Image();
    img.src = src(c); img.alt = c.alt; img.width = 1000; img.height = 1250;
    const old = $$('img', box);
    img.classList.add('fade');
    box.appendChild(img);
    const show = () => { img.classList.add('is-loaded'); old.forEach((o) => { o.classList.add('is-leaving'); setTimeout(() => o.remove(), 600); }); };
    img.decode ? img.decode().then(show, show) : img.addEventListener('load', show, { once: true });

    $('[data-brand-origin]').textContent = c.city;
    $('[data-brand-desc]').textContent = c.desc;
    const has = SITE.seleccion.some((p) => p.casa === id);
    $('[data-brand-icons]').innerHTML = `Emblemáticas: ${c.icons.join(', ')}.` +
      (has ? ` <a class="link" href="#seleccion" data-filter-link="${id}">Ver en la selección</a>` : '');
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

/* Selección: rejilla, filtros por familia o por casa, "quiero probarla" */
const state = { picks: store.get('tfb-picks', []), filter: { type: 'familia', value: 'todas' } };

function renderProducts() {
  const items = SITE.seleccion.map((p) => {
    const c = casaById(p.casa);
    const fam = SITE.familias.find((f) => f.id === p.familia).name;
    const media = p.editorial
      ? `<figure class="product__media product__media--editorial"><img src="${p.editorial}" width="560" height="700" loading="lazy" alt="${c.name} ${p.name}, imagen de campaña"></figure>`
      : `<figure class="product__media"><img src="assets/img/productos/${p.img}-400.webp" srcset="assets/img/productos/${p.img}-400.webp 400w, assets/img/productos/${p.img}-800.webp 800w" sizes="(min-width: 1100px) 22vw, (min-width: 760px) 30vw, 46vw" width="800" height="1000" loading="lazy" alt="Frasco de ${c.name} ${p.name}"></figure>`;
    return `<li class="product" data-id="${p.id}" data-familia="${p.familia}" data-casa="${p.casa}">
      ${media}
      <div class="product__body">
        <p class="product__brand">${c.name}</p>
        <h3 class="product__name">${p.name}</h3>
        <p class="product__notes">${p.notes}</p>
        <p class="product__family">${fam}</p>
        <button class="product__try" type="button" data-pick="${p.id}" aria-pressed="false">Guardar en mi lista</button>
      </div>
    </li>`;
  }).join('');
  const more = `<li class="product product--more" data-always>
      <div class="product__media"><p>Y muchas más casas y fragancias en tienda.</p><a class="link" href="#contacto">Pregúntanos por la tuya</a></div>
    </li>`;
  $('[data-products]').innerHTML = items + more;
  $$('[data-products] img').forEach(fadeIn);
}

function renderFilters() {
  const f = state.filter;
  const brandChip = f.type === 'casa' ? `<button class="chip" type="button" data-filter-casa="${f.value}" aria-pressed="true">${casaById(f.value).name} ✕</button>` : '';
  $('[data-filters]').innerHTML = brandChip + [{ id: 'todas', name: 'Todas' }, ...SITE.familias].map((x) =>
    `<button class="chip" type="button" data-filter="${x.id}" aria-pressed="${f.type === 'familia' && f.value === x.id}">${x.name}</button>`).join('');
}

function applyFilter(type, value) {
  state.filter = { type, value };
  renderFilters();
  const match = (li) => li.hasAttribute('data-always') || value === 'todas' || li.dataset[type] === value;
  const items = $$('.product');
  items.forEach((li) => { if (!match(li)) li.classList.add('is-fading'); });
  setTimeout(() => {
    items.forEach((li) => {
      const ok = match(li);
      li.classList.toggle('is-hidden', !ok);
      if (ok) { li.classList.add('is-fading'); requestAnimationFrame(() => requestAnimationFrame(() => li.classList.remove('is-fading'))); }
    });
  }, reduceMotion ? 0 : 280);
}

function initSeleccion() {
  renderProducts(); renderFilters();
  $('[data-filters]').addEventListener('click', (e) => {
    const b = e.target.closest('[data-filter]'); if (b) return applyFilter('familia', b.dataset.filter);
    if (e.target.closest('[data-filter-casa]')) applyFilter('familia', 'todas');
  });
  document.addEventListener('click', (e) => {
    const l = e.target.closest('[data-filter-link]'); if (l) applyFilter('casa', l.dataset.filterLink);
  });
  $('[data-products]').addEventListener('click', (e) => { const b = e.target.closest('[data-pick]'); if (b) togglePick(b.dataset.pick); });
  syncPicks();
}

function togglePick(id) {
  const i = state.picks.indexOf(id);
  if (i > -1) state.picks.splice(i, 1); else state.picks.push(id);
  store.set('tfb-picks', state.picks);
  syncPicks();
}
function syncPicks() {
  $$('[data-pick]').forEach((b) => {
    const on = state.picks.includes(b.dataset.pick);
    b.setAttribute('aria-pressed', String(on));
    b.textContent = on ? 'En tu lista' : 'Guardar en mi lista';
  });
  $('[data-picks]').innerHTML = state.picks.map((id) => {
    const p = SITE.seleccion.find((x) => x.id === id);
    return `<li><span><span class="n">${p.name}</span><span class="b">${casaById(p.casa).name}</span></span><button type="button" data-unpick="${id}" aria-label="Quitar ${p.name}">Quitar</button></li>`;
  }).join('');
  $('[data-picks-empty]').hidden = state.picks.length > 0;
}

/* Mapa: se carga solo si el visitante lo pide (privacidad y rendimiento) */
function initMap() {
  $('[data-map-load]').addEventListener('click', () => {
    const q = encodeURIComponent(SITE.contact.mapQuery);
    $('[data-map]').innerHTML = `<iframe title="Mapa de la tienda en Google Maps" src="https://www.google.com/maps?q=${q}&output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`;
  });
}

/* Formulario de contacto (sin envío real) */
function initContacto() {
  const form = $('[data-form]'), f = form.elements, body = $('.contacto__body');
  f.store.innerHTML = ['Triana, Las Palmas', ...SITE.stores.map((t) => `${t.name}, Tenerife`)].map((n) => `<option>${n}</option>`).join('');

  $('[data-picks]').addEventListener('click', (e) => { const b = e.target.closest('[data-unpick]'); if (b) togglePick(b.dataset.unpick); });

  const rules = {
    name: () => f.name.value.trim().length < 2 && 'Escribe tu nombre.',
    email: () => !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.value.trim()) && 'Revisa el correo, por ejemplo: nombre@dominio.es.',
    store: () => false,
    message: () => f.message.value.trim().length < 5 && !state.picks.length && 'Cuéntanos en qué podemos ayudarte.',
    privacy: () => !f.privacy.checked && 'Necesitamos tu aceptación para responderte.'
  };
  function showError(k, msg) {
    f[k].closest('.field').classList.toggle('is-invalid', !!msg);
    f[k].setAttribute('aria-invalid', msg ? 'true' : 'false');
    $(`#e-${k}`).textContent = msg || '';
  }
  let tried = false;
  Object.keys(rules).forEach((k) => ['input', 'change'].forEach((ev) => f[k].addEventListener(ev, () => tried && showError(k, rules[k]()))));

  form.addEventListener('submit', (e) => {
    e.preventDefault(); tried = true;
    let first = null;
    Object.keys(rules).forEach((k) => { const m = rules[k](); showError(k, m); if (m && !first) first = k; });
    if (first) { f[first].focus(); return; }

    const btn = $('[data-submit]');
    btn.disabled = true; btn.textContent = 'Enviando…';
    setTimeout(() => {
      btn.disabled = false; btn.textContent = 'Enviar mensaje';
      const picks = state.picks.map((id) => { const p = SITE.seleccion.find((x) => x.id === id); return `${p.name} (${casaById(p.casa).name})`; });
      $('[data-success-text]').textContent =
        `Gracias, ${f.name.value.trim().split(' ')[0]}. Hemos recibido tu mensaje para la tienda de ${f.store.value.split(',')[0]}` +
        (picks.length ? ` junto con tu lista: ${picks.join(', ')}` : '') +
        `. Te responderemos en ${f.email.value.trim()}.`;
      body.classList.add('is-done');
      const ok = $('[data-success]'); ok.hidden = false; ok.focus();
    }, reduceMotion ? 0 : 700);
  });

  $('[data-reset]').addEventListener('click', () => {
    body.classList.remove('is-done'); $('[data-success]').hidden = true;
    form.reset(); tried = false;
    Object.keys(rules).forEach((k) => showError(k, ''));
    f.name.focus();
  });
}

function initNews() {
  const form = $('[data-news]'), input = $('#n-email'), msg = $('#n-msg');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const v = input.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) { msg.textContent = 'Revisa el correo: falta la @ o el dominio.'; input.focus(); return; }
    msg.textContent = `Hecho. Te escribiremos a ${v}.`; input.value = '';
  });
  $$('[data-legal]').forEach((a) => a.addEventListener('click', (e) => e.preventDefault()));
}

/* --------------------------------------------------------------------------
   5. ARRANQUE
   -------------------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  bindData();
  renderHours();
  injectSchema();
  initHeader();
  initClock();
  initCasas();
  initSeleccion();
  initMap();
  initContacto();
  initNews();
  $$('.invitada img, .barra__media img').forEach(fadeIn);
});
