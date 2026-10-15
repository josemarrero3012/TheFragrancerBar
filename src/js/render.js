/* Vuelca en el HTML los datos de SITE: contacto, tiendas, redes y horario.
   Las casas y la selección ya vienen en el HTML (src/data/html.js) */
import { SITE } from '../data/site.js';
import { $, $$, DAYS, canaryNow } from './utils.js';

const tel = (phone) => `tel:${phone.replace(/\s/g, '')}`;
const c = SITE.contact;
const HREFS = {
  tel: () => tel(c.phone),
  mailto: () => `mailto:${c.email}`,
  whatsapp: () => `https://wa.me/${c.whatsapp}?text=${encodeURIComponent(c.whatsappText)}`,
  maps: () => c.mapsUrl
};

export function bindData() {
  $$('[data-bind]').forEach((el) => { const v = c[el.dataset.bind]; if (v) el.textContent = v; });
  $$('[data-bind-href]').forEach((el) => { el.href = HREFS[el.dataset.bindHref](); });
  $$('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });
  $$('[data-proto]').forEach((el) => { el.hidden = !SITE.prototype; });

  const social = $('[data-social]');
  if (social) social.innerHTML = SITE.social.map((s) =>
    s.url && s.url !== '#' ? `<li><a href="${s.url}" rel="noopener" target="_blank">${s.name}<span class="visually-hidden"> (se abre en una pestaña nueva)</span></a></li>` : `<li>${s.name}</li>`).join('');

  const stores = $('[data-stores]');
  if (stores) stores.innerHTML = `<li><p class="label">También en Tenerife</p></li>` +
    SITE.stores.map((t) => `<li><span class="n">${t.name}</span><span class="a">${t.detail}</span><a class="a" href="${tel(t.phone)}">${t.phone}</a></li>`).join('');
  const storesFooter = $('[data-stores-footer]');
  if (storesFooter) storesFooter.innerHTML = SITE.stores.map((t) => `<li>${t.name}<br>${t.detail}<br><a href="${tel(t.phone)}">${t.phone}</a></li>`).join('');
}

/** Agrupa los días consecutivos con el mismo horario: «Lunes a sábado 10:00–21:00» */
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

export function renderHours() {
  const today = canaryNow().day, groups = hourGroups();
  const table = $('[data-hours]');
  if (table) table.innerHTML = `<span class="hours">${groups.map((g) =>
    `<span class="${g.days.includes(today) ? 'is-today' : ''}"><span>${g.label}</span><span>${g.value}</span></span>`).join('')}</span>`;
  const short = $('[data-hours-short]');
  if (short) short.innerHTML = groups.map((g) => `${g.label}: <span class="nowrap">${g.value === 'Cerrado' ? 'cerrado' : g.value}</span>`).join('<br>');
}
