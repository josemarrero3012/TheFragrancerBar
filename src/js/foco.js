/* Foco de luz que sigue al cursor sobre la pared de chevron ([data-foco]), como los focos
   del carril del techo. Solo con ratón y sin «reducir movimiento»; si no, el foco queda fijo. */
import { $$, reduceMotion } from './utils.js';

export function initFoco() {
  if (reduceMotion || !matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  $$('[data-foco]').forEach((el) => {
    let frame = 0;
    el.addEventListener('pointermove', (e) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const r = el.getBoundingClientRect();
        el.style.setProperty('--fx', `${((e.clientX - r.left) / r.width * 100).toFixed(1)}%`);
        el.style.setProperty('--fy', `${((e.clientY - r.top) / r.height * 100).toFixed(1)}%`);
      });
    });
    el.addEventListener('pointerleave', () => { el.style.removeProperty('--fx'); el.style.removeProperty('--fy'); });
  });
}
