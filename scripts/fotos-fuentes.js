/* ==========================================================================
   De dónde saca `npm run fotos` la foto oficial de cada fragancia.

   casas        cómo buscar en la web oficial de cada casa:
                  shopify  dominio de una tienda Shopify: se lee /products.json
                           y se elige el producto cuyo título coincide con el nombre
                  buscar   página de búsqueda ({q} = nombre) y patrón del enlace al
                           producto: se abre el primer resultado y se toma su og:image
   fragancias   por id: página oficial del producto (se toma su og:image) o la URL
                directa de la imagen. Tiene prioridad sobre la búsqueda de la casa.
                Sirve para las casas sin búsqueda (Creed) y para corregir una
                coincidencia equivocada.
   ========================================================================== */

export const CASAS = {
  pdm: { shopify: 'https://parfums-de-marly.com' },
  xerjoff: { shopify: 'https://www.xerjoff.com' },
  amouage: { shopify: 'https://amouage.com' },
  initio: { shopify: 'https://initioparfums.com' },
  memo: { shopify: 'https://us.memoparis.com' },
  tomford: { shopify: 'https://www.tomfordbeauty.com' },
  montale: {
    buscar: 'https://www.montaleparfums.com/en/search?controller=search&s={q}',
    enlace: /https:\/\/www\.montaleparfums\.com\/en\/[a-z-]+\/\d+-[a-z0-9-]+\.html/
  }
  // creed: su web no es Shopify ni tiene una búsqueda fácil de leer. Añade sus páginas en FRAGANCIAS
};

export const FRAGANCIAS = {
  'xerjoff-elle': 'https://www.xerjoff.com/products/elle-parfum',
  'xerjoff-elle-anniversary': 'https://www.xerjoff.com/products/elle-anniversary-parfum',
  'xerjoff-decas': 'https://www.xerjoff.com/products/decas-eau-de-parfum',
  'xerjoff-accento-overdose': 'https://www.xerjoff.com/products/accento-overdose-eau-de-parfum',
  'xerjoff-alexandria-iii': 'https://www.xerjoff.com/products/alexandria-lll-parfum',
  'xerjoff-alexandria-ii': 'https://www.xerjoff.com/products/alexandria-ll-parfum',
  'xerjoff-cruz-del-sur-ii': 'https://www.xerjoff.com/products/cruz-del-sur-ll-parfum',
  'xerjoff-oesel': 'https://www.xerjoff.com/products/oesel-parfum',
  'xerjoff-italica': 'https://www.xerjoff.com/products/italica-au-de-parfum',
  'xerjoff-fiore-d-ulivo': 'https://www.xerjoff.com/products/fiore-dulivo-eau-de-parfum',
  'xerjoff-quattro-pizzi': 'https://www.xerjoff.com/products/quattro-pizzi-eau-de-parfum',
  'xerjoff-accento': 'https://www.xerjoff.com/products/accento-eau-de-parfum',
  'xerjoff-erba-gold': 'https://www.xerjoff.com/products/erba-gold-eau-de-parfum',
  'pdm-layton': 'https://parfums-de-marly.com/products/layton',
  'pdm-delina': 'https://parfums-de-marly.com/products/delina',
  'pdm-valaya': 'https://parfums-de-marly.com/products/valaya',
  'pdm-althair': 'https://parfums-de-marly.com/products/althair',
  'pdm-delina-exclusif': 'https://parfums-de-marly.com/products/delina-exclusif',
  'pdm-delina-la-rosee': 'https://parfums-de-marly.com/products/delina-la-rosee',
  'pdm-layton-exclusif': 'https://parfums-de-marly.com/products/layton-exclusif',
  'pdm-pegasus-exclusif': 'https://parfums-de-marly.com/products/pegasus-exclusif',
  'pdm-safanad': 'https://parfums-de-marly.com/products/safanad',
  'pdm-meliora': 'https://parfums-de-marly.com/products/meliora',
  'montale-arabians-tonka': 'https://www.montaleparfums.com/en/oriental/282-arabians-tonka.html'
};
