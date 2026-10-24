/* ==========================================================================
   De dónde saca `npm run fotos` la foto oficial de cada fragancia.

   casas        cómo buscar en la web oficial de cada casa:
                  shopify  dominio de una tienda Shopify: se lee /products.json
                           y se elige el producto cuyo título coincide con el nombre
                  buscar   página de búsqueda ({q} = nombre) y patrón del enlace al
                           producto: se abre el primer resultado y se toma su og:image
                  listado  páginas que enlazan a todos sus productos y patrón del enlace:
                           se elige el enlace cuyo nombre coincide y se toma su og:image
                En las dos últimas, la página tiene que nombrar el perfume.
   fragancias   por id: página oficial del producto (se toma su og:image) o la URL
                directa de la imagen. Tiene prioridad sobre la búsqueda de la casa.
                Sirve para fijar la página exacta y para corregir una coincidencia
                equivocada. null: no buscarla (la web oficial solo tiene otra versión).
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
  },
  creed: {
    listado: [1, 2, 3].map((n) => `https://www.creedfragrance.com/c/fragrances/?pageNumber=${n}`),
    enlace: /(?:https:\/\/www\.creedfragrance\.com)?\/p\/[a-z0-9-]+\/\d+\/?/
  }
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
  'creed-absolu-aventus': 'https://www.creedfragrance.com/p/absolu-aventus/14926231/',
  'creed-centaurus': 'https://www.creedfragrance.com/p/centaurus/15396603/',
  'creed-millesime-imperial': 'https://www.creedfragrance.com/p/millesime-imperial/12870041/',
  'creed-aventus-for-her': 'https://www.creedfragrance.com/p/aventus-for-her/12870031/',
  'creed-royal-oud': 'https://www.creedfragrance.com/p/royal-oud/12870045/',
  'creed-green-irish-tweed': 'https://www.creedfragrance.com/p/green-irish-tweed/12870035/',
  'creed-wild-vetiver': 'https://www.creedfragrance.com/p/wild-vetiver/16684202/',
  'creed-viking': 'https://www.creedfragrance.com/p/viking/12870053/',
  'creed-fleurissimo': 'https://www.creedfragrance.com/p/fleurissimo/12870034/',
  'creed-erolfa': 'https://www.creedfragrance.com/p/erolfa/12870033/',
  'creed-neroli-sauvage': 'https://www.creedfragrance.com/p/neroli-sauvage/12870042/',
  'creed-royal-water': 'https://www.creedfragrance.com/p/royal-water/12870048/',
  'creed-original-vetiver': 'https://www.creedfragrance.com/p/original-vetiver/12870044/',
  'montale-black-aoud': null, // su web solo tiene Black Aoud Intense
  'montale-arabians-tonka': 'https://www.montaleparfums.com/en/oriental/282-arabians-tonka.html'
};
