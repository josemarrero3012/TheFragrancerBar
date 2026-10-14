/* Estado de apertura en la portada: «Abierto ahora», «Cerramos pronto», «Abrimos mañana…» */
import { SITE } from '../data/site.js';
import { $, DAYS, toMin, canaryNow } from './utils.js';

export function initClock() {
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
