/* Contacto: mapas bajo demanda, formulario (sin envío real todavía) y boletín */
import { casaById } from './tienda.js';
import { $, $$, reduceMotion, EASE } from './utils.js';
import { pickedProducts } from './lista.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/* Mapa: se carga solo si el visitante lo pide (privacidad y rendimiento) */
export function initMap() {
  $$('[data-map]').forEach((box) => $('[data-map-load]', box).addEventListener('click', () => {
    box.innerHTML = `<iframe title="Mapa de la tienda en Google Maps" src="https://www.google.com/maps?q=${encodeURIComponent(box.dataset.map)}&output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`;
  }));
}

/* Formulario de contacto. Para conectarlo a un servicio real, sustituir el setTimeout
   del envío por un fetch() al endpoint (Formspree, Netlify Forms, API propia…) */
export function initContacto() {
  const form = $('[data-form]'); if (!form) return;
  const f = form.elements, body = $('.contacto__body');

  const rules = {
    name: () => f.name.value.trim().length < 2 && 'Escribe tu nombre.',
    email: () => !EMAIL_RE.test(f.email.value.trim()) && 'Revisa el correo, por ejemplo: nombre@dominio.es.',
    store: () => false,
    message: () => f.message.value.trim().length < 5 && !pickedProducts().length && 'Cuéntanos en qué podemos ayudarte.',
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
      const picks = pickedProducts().map((p) => `${p.name} (${casaById(p.casa).name})`);
      $('[data-success-text]').textContent =
        `Gracias, ${f.name.value.trim().split(' ')[0]}. Hemos recibido tu mensaje para la tienda de ${f.store.value.split(',')[0]}` +
        (picks.length ? ` junto con tu lista: ${picks.join(', ')}` : '') +
        `. Te responderemos en ${f.email.value.trim()}.`;
      body.classList.add('is-done');
      const ok = $('[data-success]'); ok.hidden = false; ok.focus();
      if (!reduceMotion) {
        ok.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 600, easing: EASE });
        [...ok.children].forEach((c, i) => c.animate([{ opacity: 0, transform: 'translateY(14px)' }, { opacity: 1, transform: 'none' }],
          { duration: 650, delay: i * 90, easing: EASE, fill: 'backwards' }));
      }
    }, reduceMotion ? 0 : 700);
  });

  $('[data-reset]').addEventListener('click', () => {
    body.classList.remove('is-done'); $('[data-success]').hidden = true;
    form.reset(); tried = false;
    Object.keys(rules).forEach((k) => showError(k, ''));
    f.name.focus();
  });
}

export function initNews() {
  const form = $('[data-news]'); if (!form) return;
  const input = $('#n-email'), msg = $('#n-msg');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const v = input.value.trim();
    if (!EMAIL_RE.test(v)) { msg.textContent = 'Revisa el correo: falta la @ o el dominio.'; input.focus(); return; }
    msg.textContent = `Hecho. Te escribiremos a ${v}.`; input.value = '';
  });
}
