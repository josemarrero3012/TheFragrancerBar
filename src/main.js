/* ==========================================================================
   The Fragrance Bar — punto de entrada común a todas las páginas.
   Cada módulo comprueba si su parte existe en la página antes de actuar.
   Contenido editable: src/data/site.js y src/data/catalogo.js
   Marcado: src/templates · Estilos: src/styles/main.css
   ========================================================================== */
import { SITE } from './data/site.js';
import { $$, fadeIn } from './js/utils.js';
import { initHeader } from './js/header.js';
import { initClock } from './js/clock.js';
import { initLista } from './js/lista.js';
import { initCart } from './js/cart.js';
import { initShop } from './js/shop.js';
import { initMap, initContacto, initNews } from './js/contacto.js';
import { initMotion } from './js/motion.js';
import { initFoco } from './js/foco.js';

// Los módulos se ejecutan con el documento ya analizado (equivalen a «defer»)
$$('[data-proto]').forEach((el) => { el.hidden = !SITE.prototype; });
initHeader();
initClock();
initLista();
initCart();
initShop();
initMap();
initContacto();
initNews();
initFoco();
$$('main img:not([fetchpriority])').forEach(fadeIn);
initMotion();
