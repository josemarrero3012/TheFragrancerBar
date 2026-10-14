/* Vuelca en el HTML los datos de SITE: contacto, tiendas, redes, franja de casas y horario */
import { SITE } from '../data/site.js';
import { $, $$, DAYS, canaryNow } from './utils.js';

export function bindData() {
  $$('[data-bind]').forEach((el) => { const v = SITE.contact[el.dataset.bind]; if (v) el.textContent = v; });
  $$('[data-bind-href]').forEach((el) => {
    el.href = el.dataset.bindHref === 'tel' ? `tel:${SITE.contact.phone.replace(/\s/g, '')}` : `mailto:${SITE.contact.email}`;
  });
  $$('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });
  $$('[data-proto]').forEach((el) => { el.hidden = !SITE.prototype; });

  const social = $('[data-social]');
  if (social) social.innerHTML = SITE.social.map((s) =>
    s.url && s.url !== '#' ? `<li><a href="${s.url}" rel="noopener" target="_blank">${s.name}</a></li>` : `<li>${s.name}</li>`).join('');

  const stores = $('[data-stores]');
  if (stores) stores.innerHTML = `<li><p class="label">También en Tenerife</p></li>` +
    SITE.stores.map((t) => `<li><span class="n">${t.name}</span><span class="a">${t.detail}</span></li>`).join('');
  const storesFooter = $('[data-stores-footer]');
  if (storesFooter) storesFooter.innerHTML = SITE.stores.map((t) => `<li>${t.name}<br>${t.detail}</li>`).join('');
  const brandline = $('[data-brandline]');
  if (brandline) brandline.innerHTML = SITE.casas.map((c) => `<li><a href="#casas" data-brand-jump="${c.id}">${c.name}</a></li>`).join('');
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
