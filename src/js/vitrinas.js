/* Luz de las vitrinas en pantallas táctiles: sin cursor, la ficha que llega al centro
   de la pantalla enciende su luz, como al acercarse a una vitrina en la tienda.
   En escritorio lo hace el :hover de CSS (sections/products.css). */
import { $$ } from './utils.js';

export function initVitrinas() {
  if (!matchMedia('(hover: none)').matches || !('IntersectionObserver' in window)) return;
  const items = $$('.product:not(.product--more) .product__media');
  if (!items.length) return;
  const io = new IntersectionObserver((es) => es.forEach((e) => e.target.classList.toggle('is-on', e.isIntersecting)),
    { rootMargin: '-30% 0px -30% 0px' });
  items.forEach((el) => io.observe(el));
}
