/* ==========================================================================
   Contenido editable de la web: casas, selección, tiendas, horario y contacto.
   Todo lo marcado PROVISIONAL debe confirmarlo el negocio.
   Las rutas de imagen son relativas a /public (p. ej. img/casas/creed-1000.webp).
   Este archivo también lo lee vite.config.js para generar los datos estructurados,
   así que no debe usar nada del navegador (window, document…).
   ========================================================================== */

export const SITE = {
  brand: 'The Fragrance Bar',
  url: 'https://thefragrancebar.es', // PROVISIONAL: dominio definitivo de la web de Triana
  timezone: 'Atlantic/Canary',

  // true: muestra los avisos de prototipo (formularios sin envío, capítulos pendientes)
  prototype: true,

  contact: {
    address: 'Calle Mayor de Triana (número por confirmar), 35002 Las Palmas de Gran Canaria', // PROVISIONAL
    addressShort: 'Calle Mayor de Triana, Las Palmas de Gran Canaria',
    street: 'Calle Mayor de Triana', postalCode: '35002', city: 'Las Palmas de Gran Canaria', region: 'Las Palmas',
    // Contacto general publicado en thefragrancebar.es. Confirmar si Triana tendrá teléfono propio
    phone: '+34 670 680 692',
    email: 'info@thefragrancebar.es',
    geo: { lat: 28.1035, lng: -15.4160 },     // PROVISIONAL (aprox.)
    howTo: 'A cinco minutos andando del Parque de San Telmo y su intercambiador de guaguas. Parking público en San Bernardo.',
    mapQuery: 'Calle Mayor de Triana, Las Palmas de Gran Canaria'
  },

  // Índice 0 = domingo; null = cerrado. PROVISIONAL
  hours: [null, ['10:00', '21:00'], ['10:00', '21:00'], ['10:00', '21:00'], ['10:00', '21:00'], ['10:00', '21:00'], ['10:00', '21:00']],

  // Tiendas de Tenerife (fuente: thefragrancebar.es)
  stores: [
    { name: 'CC Plaza del Duque', detail: 'Local B26 · Costa Adeje, Tenerife' },
    { name: 'CC Américas Plaza', detail: 'Playa de las Américas, Tenerife' }
  ],

  // Con url '#' se muestran como texto, sin enlace. PROVISIONAL
  social: [{ name: 'Instagram', url: '#' }, { name: 'Facebook', url: '#' }, { name: 'WhatsApp', url: '#' }],

  casas: [
    { id: 'creed', name: 'Creed', city: 'Londres · París', img: 'creed',
      alt: 'Creed Aventus entre piña, bergamota y una roca',
      desc: 'Casa de herencia familiar, nacida como sastrería en Londres. Perfumes frescos y amaderados de gran presencia.',
      icons: ['Aventus', 'Green Irish Tweed', 'Silver Mountain Water'] },
    { id: 'amouage', name: 'Amouage', city: 'Mascate, Omán', img: 'amouage',
      alt: 'Frasco de Amouage Guidance 46 sobre fondo rosado',
      desc: 'La casa de Omán que llevó el incienso y la tradición perfumista árabe a la alta perfumería.',
      icons: ['Interlude Man', 'Reflection Man', 'Guidance'] },
    { id: 'xerjoff', name: 'Xerjoff', city: 'Turín, Italia', img: 'xerjoff',
      alt: 'Xerjoff Naxos sobre un mapa antiguo con una cinta verde',
      desc: 'Lujo italiano: cristal tallado, tapones dorados y composiciones luminosas y generosas.',
      icons: ['Naxos', 'Erba Pura', 'Alexandria II'] },
    { id: 'pdm', name: 'Parfums de Marly', city: 'París', img: 'parfums-de-marly',
      alt: 'Detalle del frasco azul de Layton con los caballos en relieve',
      desc: 'Inspirada en la tradición ecuestre de la corte francesa del siglo XVIII. Elegancia clásica, muy ponible.',
      icons: ['Layton', 'Delina', 'Pegasus'] },
    { id: 'initio', name: 'Initio', city: 'París', img: 'initio',
      alt: 'Frasco de Initio Oud for Greatness emergiendo de un líquido dorado',
      desc: 'Perfumes construidos alrededor de materias de gran magnetismo, como el oud y los almizcles.',
      icons: ['Oud for Greatness', 'Side Effect', 'Rehab'] },
    { id: 'montale', name: 'Montale', city: 'París', img: 'montale',
      alt: 'Frasco metálico negro de Montale Arabians Tonka',
      desc: 'Pionera del oud en Occidente. Fragancias intensas y duraderas en su característico frasco de aluminio.',
      icons: ['Arabians Tonka', 'Intense Café', 'Black Aoud'] },
    { id: 'memo', name: 'Memo Paris', city: 'París', img: 'memo',
      alt: 'Frasco de Memo Paris Marfa sobre una ilustración de paisaje desértico',
      desc: 'Perfumes de viaje: cada fragancia es un destino, contado con materias primas excepcionales.',
      icons: ['Marfa', 'African Leather', 'Irish Leather'] },
    { id: 'tomford', name: 'Tom Ford', city: 'Private Blend', img: 'tom-ford',
      alt: 'Tom Ford Tobacco Vanille entre hojas de tabaco secas',
      desc: 'La colección Private Blend: lujo nocturno y sensual, con tabaco, oud, cuero y vainilla.',
      icons: ['Tobacco Vanille', 'Oud Wood', 'Lost Cherry'] }
  ],

  familias: [
    { id: 'frescas', name: 'Frescas y afrutadas' },
    { id: 'florales', name: 'Florales' },
    { id: 'amaderadas', name: 'Amaderadas' },
    { id: 'ambar', name: 'Ámbar y especiadas' }
  ],

  // Selección: notas principales según cada casa. Precios: consultar en tienda.
  seleccion: [
    { id: 'aventus', casa: 'creed', name: 'Aventus', familia: 'frescas', img: 'creed-aventus', notes: 'Piña, bergamota, abedul ahumado, almizcle' },
    { id: 'delina', casa: 'pdm', name: 'Delina', familia: 'florales', img: 'pdm-delina', notes: 'Lichi, ruibarbo, rosa turca, vainilla' },
    { id: 'ofg', casa: 'initio', name: 'Oud for Greatness', familia: 'amaderadas', img: 'initio-ofg', notes: 'Azafrán, nuez moscada, oud, pachulí' },
    { id: 'naxos', casa: 'xerjoff', name: 'Naxos', familia: 'ambar', img: 'xerjoff-naxos', notes: 'Lavanda, bergamota, miel, tabaco, haba tonka' },
    { id: 'interlude', casa: 'amouage', name: 'Interlude Man', familia: 'amaderadas', img: 'amouage-interlude', notes: 'Orégano, incienso, ámbar, oud' },
    { id: 'tobacco-vanille', casa: 'tomford', name: 'Tobacco Vanille', familia: 'ambar', img: 'tf-tobacco-vanille', notes: 'Hoja de tabaco, vainilla, haba tonka, cacao' },
    { id: 'erba-pura', casa: 'xerjoff', name: 'Erba Pura', familia: 'frescas', img: 'xerjoff-erbapura', notes: 'Naranja siciliana, frutas, almizcle blanco, ámbar' },
    { id: 'layton', casa: 'pdm', name: 'Layton', familia: 'ambar', img: 'pdm-layton', notes: 'Manzana, lavanda, cardamomo, vainilla' },
    { id: 'marfa', casa: 'memo', name: 'Marfa', familia: 'florales', editorial: 'img/casas/memo-560.webp', notes: 'Nardo, flor de azahar, agave, sándalo' },
    { id: 'guidance', casa: 'amouage', name: 'Guidance 46', familia: 'florales', img: 'amouage-guidance46', notes: 'Pera, avellana, rosa, incienso' },
    { id: 'arabians-tonka', casa: 'montale', name: 'Arabians Tonka', familia: 'ambar', img: 'montale-arabians-tonka', notes: 'Azafrán, rosa, oud, haba tonka' }
  ]
};

/* Animaciones. mode: 'completo' | 'sutil' (portada solo con fundidos y sin parallax).
   marquee: franja de marcas en movimiento continuo (opcional). */
export const MOTION = { mode: 'completo', marquee: false };
