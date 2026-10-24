/* ==========================================================================
   Contenido editable del negocio: tiendas, horarios, contacto, envíos y FAQ.
   Las casas y las fragancias están en catalogo.js.
   Todo lo marcado PROVISIONAL debe confirmarlo el negocio.
   Las rutas de imagen son relativas a /public (p. ej. img/tienda/triana-fachada-800.webp).
   Este archivo también lo lee vite.config.js para generar las páginas y los datos
   estructurados, así que no debe usar nada del navegador (window, document…).
   ========================================================================== */

export const SITE = {
  brand: 'The Fragrance Bar',
  url: 'https://thefragrancebar.es', // PROVISIONAL: dominio definitivo
  timezone: 'Atlantic/Canary',

  // true: muestra los avisos de prototipo (formularios sin envío, capítulos pendientes, FAQ de ejemplo)
  prototype: true,
  // true: los precios son inventados. Se avisa en la tienda y no se publican en schema.org
  demoPrices: true,

  // Contacto general (el de la tienda de Triana)
  contact: {
    email: 'info@evergreenperfumes.com',
    // Número de WhatsApp en formato internacional, solo dígitos. PROVISIONAL: confirmar qué número tiene WhatsApp
    whatsapp: '34828903088',
    whatsappText: 'Hola, os escribo desde la web de The Fragrance Bar.'
  },

  // Tiendas. La primera es la principal (portada, contacto rápido, pie)
  // hours: índice 0 = domingo; null = cerrado
  stores: [
    { id: 'triana', name: 'Triana', title: 'Triana, Las Palmas', island: 'gran-canaria', islandName: 'Gran Canaria', isNew: true,
      address: 'Calle Mayor de Triana, 32, 35002 Las Palmas de Gran Canaria',
      addressShort: 'Calle Mayor de Triana, 32, Las Palmas de Gran Canaria',
      street: 'Calle Mayor de Triana, 32', postalCode: '35002', city: 'Las Palmas de Gran Canaria', region: 'Las Palmas',
      phone: '+34 828 903 088',
      geo: { lat: 28.1035, lng: -15.4160 }, // PROVISIONAL (aprox.)
      hours: [null, ['10:00', '21:00'], ['10:00', '21:00'], ['10:00', '21:00'], ['10:00', '21:00'], ['10:00', '21:00'], ['10:00', '21:00']], // PROVISIONAL
      intro: 'En plena calle peatonal de Triana, entre fachadas modernistas, a unos minutos del Parque de San Telmo. Es nuestra primera tienda en Gran Canaria.',
      howTo: 'A cinco minutos andando del Parque de San Telmo y su intercambiador de guaguas. Parking público en San Bernardo.',
      mapQuery: 'The Fragrance Bar, Calle Mayor de Triana 32, Las Palmas de Gran Canaria',
      // Enlace a la ficha de Google Maps («Compartir» > «Copiar enlace»). PROVISIONAL: sustituir por el enlace exacto de la ficha
      mapsUrl: 'https://www.google.com/maps/search/?api=1&query=The+Fragrance+Bar+Calle+Mayor+de+Triana+32+Las+Palmas+de+Gran+Canaria',
      img: 'img/tienda/triana-fachada', imgAlt: 'Fachada de The Fragrance Bar en Triana: arco de piedra, rótulo negro y un interior iluminado con vitrinas de perfumes y una barra de madera en el centro',
      /* Fotos del interior para la página de la tienda (prototipo: confirmar con la tienda que se pueden usar) */
      interior: [
        { img: 'img/tienda/interior-pasillo', w: 1380, h: 1038, sizes: [800, 1380], alt: 'Pasillo de vitrinas de cristal iluminadas, llenas de frascos de perfume, con suelo de madera clara' },
        { img: 'img/tienda/interior-mesa', w: 579, h: 1035, sizes: [800], alt: 'La barra: mesa de madera con encimera de mármol, un gran ramo de flores, frascos para probar y taburetes' },
        { img: 'img/tienda/interior-lamparas', w: 1380, h: 1040, sizes: [800, 1380], alt: 'Lámparas de cuentas de cristal blancas, azules y rosas sobre el mostrador de azulejo azul, con las vitrinas negras y la cortina de cadenas cobre al fondo' }
      ] },
    { id: 'plaza-del-duque', name: 'Plaza del Duque', title: 'C. C. Plaza del Duque', island: 'tenerife', islandName: 'Tenerife',
      address: 'C. C. Plaza del Duque, local B26, 38660 Costa Adeje, Santa Cruz de Tenerife', // PROVISIONAL: calle exacta
      addressShort: 'C. C. Plaza del Duque, local B26, Costa Adeje',
      street: 'C. C. Plaza del Duque, local B26', postalCode: '38660', city: 'Costa Adeje', region: 'Santa Cruz de Tenerife',
      phone: '+34 822 128 563',
      geo: { lat: 28.0905, lng: -16.7374 }, // PROVISIONAL (aprox.)
      hours: Array(7).fill(['10:00', '22:00']), // PROVISIONAL: horario del centro comercial
      intro: 'En el centro comercial de lujo de Costa Adeje, a un paso de la Playa del Duque y de los grandes hoteles del sur de Tenerife.',
      howTo: 'Dentro del centro comercial, junto a la Playa del Duque. Aparcamiento en el propio centro.',
      mapQuery: 'The Fragrance Bar, Centro Comercial Plaza del Duque, Costa Adeje',
      mapsUrl: 'https://www.google.com/maps/search/?api=1&query=The+Fragrance+Bar+Plaza+del+Duque+Costa+Adeje' },
    { id: 'americas-plaza', name: 'Américas Plaza', title: 'C. C. Américas Plaza', island: 'tenerife', islandName: 'Tenerife',
      address: 'C. C. Américas Plaza, local L28, 38650 Playa de las Américas, Santa Cruz de Tenerife', // PROVISIONAL: calle exacta
      addressShort: 'C. C. Américas Plaza, local L28, Playa de las Américas',
      street: 'C. C. Américas Plaza, local L28', postalCode: '38650', city: 'Playa de las Américas', region: 'Santa Cruz de Tenerife',
      phone: '+34 822 127 365',
      geo: { lat: 28.0606, lng: -16.7290 }, // PROVISIONAL (aprox.)
      hours: Array(7).fill(['10:00', '22:00']), // PROVISIONAL: horario del centro comercial
      intro: 'En el corazón de Playa de las Américas, en uno de los centros comerciales más concurridos del sur de Tenerife.',
      howTo: 'En la Avenida de las Américas, a pocos pasos del paseo marítimo.',
      mapQuery: 'The Fragrance Bar, Centro Comercial Américas Plaza, Playa de las Américas',
      mapsUrl: 'https://www.google.com/maps/search/?api=1&query=The+Fragrance+Bar+Americas+Plaza+Playa+de+las+Americas' }
  ],

  /* Festivos y horarios especiales para «Abierto ahora» (AAAA-MM-DD). PROVISIONAL: revisar cada año.
     closed: cerrado en todas las tiendas · islands: cerrado solo en esa isla · special: horario reducido */
  calendar: {
    closed: ['2026-01-01', '2026-01-06', '2026-04-03', '2026-05-01', '2026-12-25', '2027-01-01', '2027-01-06', '2027-03-26', '2027-05-01', '2027-12-25'],
    islands: {
      'gran-canaria': ['2026-04-02', '2026-05-30', '2026-06-24', '2026-08-15', '2026-09-08', '2026-10-12', '2026-12-08',
        '2027-03-25', '2027-05-30', '2027-06-24', '2027-08-15', '2027-09-08', '2027-10-12', '2027-12-08'],
      tenerife: []
    },
    special: { '2026-12-24': ['10:00', '15:00'], '2026-12-31': ['10:00', '15:00'], '2027-12-24': ['10:00', '15:00'], '2027-12-31': ['10:00', '15:00'] }
  },

  // Tienda online (demo): gastos de envío inventados
  shipping: { canarias: 4.95, freeFrom: 120, days: '24–48 h en Canarias' },

  // Con url '#' se muestran como texto, sin enlace
  social: [
    { name: 'Instagram', url: 'https://www.instagram.com/thefragrancebar0/' },
    { name: 'WhatsApp', url: 'https://wa.me/34828903088' },
    { name: 'Google Maps', url: 'https://www.google.com/maps/search/?api=1&query=The+Fragrance+Bar+Calle+Mayor+de+Triana+32+Las+Palmas+de+Gran+Canaria' }
  ],

  // Casa destacada de la portada
  destacada: { casa: 'xerjoff',
    text: 'Cristal tallado, tapones dorados y composiciones luminosas desde Turín. Destacamos Naxos, con lavanda, miel y tabaco, y Erba Pura, una de las más pedidas en tienda.' },

  // Preguntas frecuentes (página de contacto). PROVISIONAL: respuestas de ejemplo, a confirmar con el negocio
  faq: [
    { q: '¿Puedo probar un perfume antes de comprarlo?',
      a: 'Sí, y te lo recomendamos. En la barra de cada tienda puedes oler todo lo que hay en las vitrinas, primero en tira y después en piel, sin cita y sin compromiso.' },
    { q: '¿Preparáis muestras para probar en casa?',
      a: 'Sí. Pregúntanos en tienda o por WhatsApp y te preparamos muestras de las fragancias que te interesen, para que las lleves unos días antes de decidir.' },
    { q: '¿Qué diferencia hay entre Eau de Toilette, Eau de Parfum y extracto?',
      a: 'La concentración de esencia. Un Eau de Toilette suele rondar el 8–12 %, un Eau de Parfum el 15–20 % y un extracto puede superar el 25 %. A más concentración, más duración y una estela más cercana a la piel.' },
    { q: '¿Cuánto cuesta un perfume nicho?',
      a: 'Depende de la casa y del tamaño. Como orientación, la mayoría de nuestras fragancias están entre 100 y 400 euros. Los precios exactos los tienes en cada ficha y en tienda.' },
    { q: '¿Hacéis envíos?',
      a: 'Enviamos a todas las islas en 24–48 horas, gratis a partir de 120 euros. También puedes comprar online y recoger tu pedido en cualquiera de nuestras tiendas.' },
    { q: '¿Tenéis tarjeta regalo y envoltorio de regalo?',
      a: 'Sí. Tenemos tarjetas regalo del importe que quieras y envolvemos cualquier compra sin coste, tanto en tienda como en los pedidos online.' }
  ]
};

/* Animaciones. mode: 'completo' | 'sutil' (solo fundidos y sin parallax).
   marquee: franja de marcas en movimiento continuo (opcional). */
export const MOTION = { mode: 'completo', marquee: false };

/* Navegación principal: la misma en escritorio y en móvil */
export const NAV = [
  { id: 'casas', label: 'Casas', path: 'casas/' },
  { id: 'comprar', label: 'Comprar', path: 'comprar/' },
  { id: 'barra', label: 'La barra', path: 'la-barra/' },
  { id: 'historia', label: 'Historia', path: 'historia/' },
  { id: 'tiendas', label: 'Tiendas', path: 'tiendas/' }
];

export const mainStore = () => SITE.stores[0];
export const storeById = (id) => SITE.stores.find((s) => s.id === id);
