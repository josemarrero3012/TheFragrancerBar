/* Datos del catálogo que necesita el navegador (cesta y «Tu lista»): solo lo imprescindible de
   las fragancias publicadas. Los genera vite.config.js (virtual:tienda) desde src/data/catalogo.js,
   así el JavaScript de la web no crece con las notas y los textos de todo el catálogo. */
import { CASAS, FRAGANCIAS } from 'virtual:tienda';

export { euros } from '../data/casas.js';
const porId = new Map(FRAGANCIAS.map((p) => [p.id, p]));
export const fragById = (id) => porId.get(id);
export const casaById = (id) => CASAS.find((c) => c.id === id);
