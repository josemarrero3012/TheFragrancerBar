/* ==========================================================================
   The Fragrance Bar · Triana — punto de entrada
   Contenido editable: src/data/site.js
   Estilos: src/styles/main.css (enlazado desde el HTML para que no parpadee en desarrollo)
   ========================================================================== */
import { $$, fadeIn } from './js/utils.js';
import { bindData, renderHours } from './js/render.js';
import { initHeader } from './js/header.js';
import { initClock } from './js/clock.js';
import { initCasas } from './js/casas.js';
import { initSeleccion } from './js/seleccion.js';
import { initMap, initContacto, initNews } from './js/contacto.js';
import { initMotion } from './js/motion.js';

// Los módulos se ejecutan con el documento ya analizado (equivalen a «defer»)
bindData();
renderHours();
initHeader();
initClock();
initCasas();
initSeleccion();
initMap();
initContacto();
initNews();
$$('.invitada img, .barra__media img').forEach(fadeIn);
initMotion();
