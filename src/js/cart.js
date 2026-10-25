/* Tienda online (demo): cesta guardada en el navegador, cesta lateral, ficha de producto y pedido.
   Para conectarla a una tienda real, el pedido de initCheckout() debe enviarse a la pasarela
   de pago y al sistema de pedidos en lugar de mostrarse directamente como confirmado. */
import { SITE, storeById } from '../data/site.js';
import { fragById, casaById, euros } from '../data/catalogo.js';
import { $, $$, reduceMotion, EASE, store, esc, asset } from './utils.js';

const KEY = 'tfb-cart';
// Cada línea: { id, ml, qty }
let cart = store.get(KEY, []).filter((l) => { const p = fragById(l.id); return p && p.sizes.some((s) => s[0] === l.ml); });

const priceOf = (l) => fragById(l.id).sizes.find((s) => s[0] === l.ml)[1];
export const subtotal = () => cart.reduce((t, l) => t + priceOf(l) * l.qty, 0);
const count = () => cart.reduce((t, l) => t + l.qty, 0);
const shipping = (delivery = 'pickup') => (delivery === 'ship' && subtotal() < SITE.shipping.freeFrom ? SITE.shipping.canarias : 0);
const save = () => { store.set(KEY, cart); render(); };

export function addToCart(id, ml, qty = 1) {
  const p = fragById(id);
  ml = ml || p.sizes[0][0];
  const line = cart.find((l) => l.id === id && l.ml === ml);
  if (line) line.qty = Math.min(line.qty + qty, 9); else cart.push({ id, ml, qty });
  save();
  openDrawer(`${p.name} (${ml} ml) añadido a la cesta.`);
  if (!reduceMotion) $$('[data-cart-count]').forEach((b) => b.animate([{ transform: 'scale(1.6)' }, { transform: 'scale(1)' }], { duration: 450, easing: EASE }));
}

function setQty(i, qty) {
  if (qty < 1) cart.splice(i, 1); else cart[i].qty = Math.min(qty, 9);
  save();
}

/* Miniatura: la foto de producto (todas las fragancias publicadas la tienen) */
const thumb = (p) => `<img src="${asset(`img/productos/${p.img}-400.webp`)}" width="80" height="100" alt="" loading="lazy">`;

function lineHtml(l, i, { readonly = false } = {}) {
  const p = fragById(l.id), c = casaById(p.casa), unit = priceOf(l);
  const href = asset(`fragancias/${p.id}/`);
  return `
    <li class="cartline">
      <a class="cartline__media" href="${href}" tabindex="-1" aria-hidden="true">${thumb(p)}</a>
      <div class="cartline__info">
        <p class="cartline__brand">${esc(c.name)}</p>
        <a class="cartline__name" href="${href}">${esc(p.name)}</a>
        <p class="cartline__meta">${l.ml} ml · ${euros(unit)}${readonly ? ` · ${l.qty} ud.` : ''}</p>
        ${readonly ? '' : `<div class="cartline__ctrl">
          <div class="qty" role="group" aria-label="Cantidad de ${esc(p.name)}">
            <button type="button" data-qty="${i}" data-d="-1" aria-label="Quitar una unidad">−</button>
            <span aria-live="polite">${l.qty}</span>
            <button type="button" data-qty="${i}" data-d="1" aria-label="Añadir una unidad"${l.qty >= 9 ? ' disabled' : ''}>+</button>
          </div>
          <button class="cartline__remove" type="button" data-remove="${i}" aria-label="Quitar ${esc(p.name)} de la cesta">Quitar</button>
        </div>`}
      </div>
      <p class="cartline__total">${euros(unit * l.qty)}</p>
    </li>`;
}

function render() {
  const n = count(), empty = !cart.length;
  $$('[data-cart-count]').forEach((b) => { b.hidden = !n; $('[data-n]', b).textContent = n; });
  $$('[data-cart-open]').forEach((b) => b.setAttribute('aria-label', n ? `Abrir la cesta (${n} ${n === 1 ? 'producto' : 'productos'})` : 'Abrir la cesta'));
  $$('[data-cart-lines]').forEach((ul) => { ul.innerHTML = cart.map((l, i) => lineHtml(l, i)).join(''); });
  $$('[data-cart-empty]').forEach((el) => { el.hidden = !empty; });
  $$('[data-cart-full]').forEach((el) => { el.hidden = empty; });
  $$('[data-cart-subtotal]').forEach((el) => { el.textContent = euros(subtotal()); });
  const left = SITE.shipping.freeFrom - subtotal();
  $$('[data-cart-ship]').forEach((el) => {
    el.textContent = left > 0 ? `Te faltan ${euros(left)} para el envío gratis a domicilio. La recogida en tienda siempre es gratis.` : 'Tienes envío gratis a domicilio.';
  });
  updateSummary();
}

/* ---------- Cesta lateral */
let drawer;
function openDrawer(msg = '') {
  $('[data-drawer-added]', drawer).textContent = msg;
  if (drawer.open) return;
  drawer.showModal();
  document.documentElement.classList.add('has-drawer');
}
function closeDrawer() {
  if (!drawer.open) return;
  const done = () => { drawer.close(); drawer.classList.remove('is-closing'); document.documentElement.classList.remove('has-drawer'); };
  if (reduceMotion) return done();
  drawer.classList.add('is-closing');
  setTimeout(done, 300);
}

/* ---------- Ficha de producto: tamaño, precio y barra fija en móvil */
function initPdp() {
  const form = $('[data-buy]'); if (!form) return;
  const price = $('[data-buy-price]'), barPrice = $('[data-buybar-price]');
  const sel = () => Number($('input[name="size"]:checked', form).value);
  form.addEventListener('change', () => {
    const r = $('input[name="size"]:checked', form);
    price.textContent = barPrice.textContent = euros(Number(r.dataset.price));
  });
  form.addEventListener('submit', (e) => { e.preventDefault(); addToCart(form.dataset.buy, sel()); });

  const bar = $('[data-buybar]'), barBtn = $('[data-buybar-add]');
  barBtn.addEventListener('click', () => addToCart(form.dataset.buy, sel()));
  new IntersectionObserver(([e]) => {
    const show = !e.isIntersecting && e.boundingClientRect.top < 0;
    bar.classList.toggle('is-visible', show);
    bar.setAttribute('aria-hidden', String(!show)); barBtn.tabIndex = show ? 0 : -1;
  }).observe($('.buy__row', form));
}

/* ---------- Página de la cesta: entrega, resumen y pedido */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
let order;
function delivery() { return order ? order.elements.delivery.value : 'pickup'; }
function updateSummary() {
  if (!order) return;
  const ship = shipping(delivery());
  $('[data-sum-ship]').textContent = delivery() === 'pickup' ? 'Recogida gratis' : ship ? euros(ship) : 'Envío gratis';
  $('[data-sum-total]').textContent = euros(subtotal() + ship);
}

function initCheckout() {
  order = $('[data-order]'); if (!order) return;
  const f = order.elements;
  const showWhen = () => $$('[data-when]', order).forEach((el) => { el.hidden = el.dataset.when !== delivery(); });
  order.addEventListener('change', (e) => { if (e.target.name === 'delivery') { showWhen(); updateSummary(); } });
  showWhen();

  const ship = () => delivery() === 'ship';
  const rules = {
    name: () => f.name.value.trim().length < 2 && 'Escribe tu nombre.',
    email: () => !EMAIL_RE.test(f.email.value.trim()) && 'Revisa el correo, por ejemplo: nombre@dominio.es.',
    phone: () => f.phone.value.replace(/\D/g, '').length < 9 && 'Escribe un teléfono de al menos 9 cifras.',
    address: () => ship() && f.address.value.trim().length < 5 && 'Escribe la dirección de entrega.',
    cp: () => ship() && !/^35|^38/.test(f.cp.value.trim()) && 'Solo enviamos a Canarias: el código empieza por 35 o 38.',
    city: () => ship() && f.city.value.trim().length < 2 && 'Escribe el municipio.',
    privacy: () => !f.privacy.checked && 'Necesitamos tu aceptación para tramitar el pedido.'
  };
  const showError = (k, msg) => {
    f[k].closest('.field').classList.toggle('is-invalid', !!msg);
    f[k].setAttribute('aria-invalid', msg ? 'true' : 'false');
    $(`#e-o-${k}`).textContent = msg || '';
  };
  let tried = false;
  Object.keys(rules).forEach((k) => ['input', 'change'].forEach((ev) => f[k].addEventListener(ev, () => tried && showError(k, rules[k]()))));

  order.addEventListener('submit', (e) => {
    e.preventDefault(); tried = true;
    let first = null;
    Object.keys(rules).forEach((k) => { const m = rules[k](); showError(k, m); if (m && !first) first = k; });
    if (first) { f[first].focus(); return; }

    const btn = $('[data-order-submit]');
    btn.disabled = true; btn.textContent = 'Confirmando…';
    setTimeout(() => {
      const total = subtotal() + shipping(delivery());
      const where = ship() ? `a ${f.address.value.trim()}, ${f.cp.value.trim()} ${f.city.value.trim()} (${f.island.value})` : `en la tienda de ${storeById(f.store.value).title}`;
      $('[data-order-id]').textContent = `TFB-${String(Date.now()).slice(-6)}`;
      $('[data-order-name]').textContent = f.name.value.trim().split(' ')[0];
      $('[data-order-text]').textContent = ship()
        ? `Hemos recibido tu pedido de ${euros(total)}. Lo enviaremos ${where} en ${SITE.shipping.days} y te avisaremos en ${f.email.value.trim()}.`
        : `Hemos recibido tu pedido de ${euros(total)}. Te avisaremos en ${f.email.value.trim()} cuando esté listo para recoger ${where}.`;
      $('[data-order-lines]').innerHTML = cart.map((l, i) => lineHtml(l, i, { readonly: true })).join('');
      cart = []; store.set(KEY, cart); render();
      $('[data-cart-empty]').hidden = true;
      const ok = $('[data-order-done]'); ok.hidden = false; ok.focus();
      scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
      if (!reduceMotion) [...ok.children].forEach((c, i) => c.animate([{ opacity: 0, transform: 'translateY(14px)' }, { opacity: 1, transform: 'none' }],
        { duration: 650, delay: i * 80, easing: EASE, fill: 'backwards' }));
    }, reduceMotion ? 0 : 800);
  });
}

export function initCart() {
  drawer = $('[data-drawer]');
  document.addEventListener('click', (e) => {
    const add = e.target.closest('[data-add]'); if (add) return addToCart(add.dataset.add);
    if (e.target.closest('[data-cart-open]')) return openDrawer();
    if (e.target.closest('[data-drawer-close]')) return closeDrawer();
    const q = e.target.closest('[data-qty]'); if (q) return setQty(Number(q.dataset.qty), cart[Number(q.dataset.qty)].qty + Number(q.dataset.d));
    const r = e.target.closest('[data-remove]'); if (r) return setQty(Number(r.dataset.remove), 0);
  });
  // Clic en el fondo oscuro: cierra
  drawer.addEventListener('click', (e) => { if (e.target === drawer) closeDrawer(); });
  drawer.addEventListener('cancel', (e) => { e.preventDefault(); closeDrawer(); });
  initPdp();
  initCheckout();
  render();
  // Otra pestaña cambió la cesta, o se vuelve con «Atrás» desde caché
  addEventListener('storage', (e) => { if (e.key === KEY) { cart = store.get(KEY, []); render(); } });
  addEventListener('pageshow', (e) => { if (e.persisted) { cart = store.get(KEY, []); render(); } });
}
