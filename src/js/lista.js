/* «Tu lista»: fragancias guardadas con el corazón (en el navegador).
   Se añaden al mensaje de contacto y se pueden enviar por WhatsApp. */
import { fragById, casaById } from './tienda.js';
import { $, $$, reduceMotion, EASE, store, esc, asset, whatsappHref } from './utils.js';

const picks = store.get('tfb-picks', []).filter(fragById);

/** Fragancias guardadas, para el formulario de contacto */
export const pickedProducts = () => picks.map(fragById);

function toggle(id) {
  const i = picks.indexOf(id);
  if (i > -1) picks.splice(i, 1); else picks.push(id);
  store.set('tfb-picks', picks);
  sync();
  // El contador confirma que se ha guardado
  if (i === -1 && !reduceMotion) $$('[data-picks-count]:not([hidden])').forEach((b) =>
    b.animate([{ transform: 'scale(1.6)' }, { transform: 'scale(1)' }], { duration: 450, easing: EASE }));
}

function sync() {
  $$('[data-pick]').forEach((b) => {
    const p = fragById(b.dataset.pick), on = picks.includes(b.dataset.pick);
    b.setAttribute('aria-pressed', String(on));
    b.setAttribute('aria-label', `${on ? 'Quitar' : 'Guardar'} ${p.name} de ${casaById(p.casa).name} ${on ? 'de' : 'en'} mi lista`);
  });
  $$('[data-picks-count]').forEach((b) => { b.hidden = !picks.length; $('[data-n]', b).textContent = picks.length; });

  const list = $('[data-picks]');
  if (!list) return;
  list.innerHTML = pickedProducts().map((p) =>
    `<li><a href="${asset(`fragancias/${p.id}/`)}"><span class="n">${esc(p.name)}</span><span class="b">${esc(casaById(p.casa).name)}</span></a><button type="button" data-unpick="${p.id}" aria-label="Quitar ${esc(p.name)} de mi lista">Quitar</button></li>`).join('');
  $('[data-picks-empty]').hidden = picks.length > 0;
  const wa = $('[data-picks-wa]');
  wa.hidden = !picks.length;
  wa.href = whatsappHref(`Hola, me interesan estas fragancias: ${pickedProducts().map((p) => `${p.name} (${casaById(p.casa).name})`).join(', ')}. ¿Las tenéis en tienda?`);
}

export function initLista() {
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-pick]'); if (b) return toggle(b.dataset.pick);
    const u = e.target.closest('[data-unpick]'); if (u) toggle(u.dataset.unpick);
  });
  sync();
  // Al volver con «Atrás» la página puede venir de caché con la lista desactualizada
  addEventListener('pageshow', (e) => { if (e.persisted) { picks.splice(0, picks.length, ...store.get('tfb-picks', []).filter(fragById)); sync(); } });
}
