/* Fotos de la ficha de producto: las miniaturas cambian la foto grande.
   Sin JavaScript se ve solo la foto de producto y las miniaturas quedan ocultas. */
import { $, $$ } from './utils.js';

export function initGaleria() {
  $$('[data-gallery]').forEach((g) => {
    const slides = $$('[data-slide]', g), thumbs = $$('[data-thumb]', g);
    $('[data-thumbs]', g).hidden = false;
    thumbs.forEach((t) => t.addEventListener('click', () => {
      const n = Number(t.dataset.thumb);
      slides.forEach((s, i) => { s.hidden = i !== n; });
      thumbs.forEach((x) => x.setAttribute('aria-pressed', String(x === t)));
    }));
  });
}
