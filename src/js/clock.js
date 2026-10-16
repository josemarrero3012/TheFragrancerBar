/* Estado de apertura de cada tienda: «Abierto ahora», «Cerramos pronto», «Abrimos mañana…».
   Tiene en cuenta los festivos y horarios especiales de SITE.calendar. */
import { SITE, storeById } from '../data/site.js';
import { $, $$, DAYS, toMin, canaryNow } from './utils.js';

/** Horario de una tienda para una fecha concreta (null = cerrado) */
function hoursOn(s, n) {
  const cal = SITE.calendar;
  if (cal.closed.includes(n.iso) || (cal.islands[s.island] || []).includes(n.iso)) return { h: null, holiday: true };
  if (cal.special[n.iso]) return { h: cal.special[n.iso], special: true };
  return { h: s.hours[n.day] };
}

function status(s) {
  const now = canaryNow(), today = hoursOn(s, now), h = today.h;
  if (h && now.mins >= toMin(h[0]) && now.mins < toMin(h[1])) {
    const last = toMin(h[1]) - now.mins <= 30;
    return { cls: last ? 'is-last' : 'is-open', text: last ? `Cerramos pronto, a las ${h[1]}` : `Abierto ahora · hasta las ${h[1]}${today.special ? ' (horario especial)' : ''}` };
  }
  if (h && now.mins < toMin(h[0])) return { cls: '', text: `Cerrado · abrimos hoy a las ${h[0]}` };
  for (let i = 1; i <= 14; i++) {
    const n = canaryNow(new Date(Date.now() + i * 864e5)), next = hoursOn(s, n);
    if (next.h) return { cls: '', text: `${today.holiday ? 'Cerrado por festivo' : 'Cerrado'} · abrimos ${i === 1 ? 'mañana' : `el ${DAYS[n.day]}`} a las ${next.h[0]}` };
  }
  return { cls: '', text: 'Cerrado' };
}

export function initClock() {
  const els = $$('[data-clock]');
  const update = () => els.forEach((el) => {
    const s = storeById(el.dataset.clock), st = status(s);
    el.classList.remove('is-open', 'is-last');
    if (st.cls) el.classList.add(st.cls);
    $('.status__text', el).textContent = st.text;
  });
  if (els.length) { update(); setInterval(update, 60000); }

  // Día de hoy en las tablas de horario
  const day = String(canaryNow().day);
  $$('[data-days]').forEach((el) => el.classList.toggle('is-today', el.dataset.days.split(',').includes(day)));
}
