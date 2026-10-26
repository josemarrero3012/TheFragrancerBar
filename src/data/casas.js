/* ==========================================================================
   Casas, familias olfativas y concentraciones: lo que no cambia de una fragancia a otra.
   Las fragancias están en la hoja catalogo/fragancias.csv (ver catalogo.js y docs/CATALOGO.md).
   Una casa nueva se da de alta aquí, con sus imágenes en public/img/casas/<img>-560|1000.webp,
   y desde ese momento ya se pueden poner fragancias suyas en la hoja.
   Como site.js, no debe usar nada del navegador (lo leen también los scripts y vite.config.js).
   ========================================================================== */

export const FAMILIAS = [
  { id: 'frescas', name: 'Frescas y afrutadas' },
  { id: 'florales', name: 'Florales' },
  { id: 'amaderadas', name: 'Amaderadas' },
  { id: 'ambar', name: 'Ámbar y especiadas' }
];

export const CONCENTRACIONES = {
  EDT: 'Eau de Toilette', EDP: 'Eau de Parfum', Extrait: 'Extrait de Parfum', Parfum: 'Parfum'
};

export const CASAS = [
  { id: 'creed', name: 'Creed', city: 'Londres · París', founded: 'Desde 1760', img: 'creed',
    alt: 'Creed Aventus entre piña, bergamota y una roca',
    desc: 'Casa de herencia familiar, nacida como sastrería en Londres. Perfumes frescos y amaderados de gran presencia.',
    story: [
      'Creed remonta su historia a una sastrería londinense que vestía a la corte inglesa y que, con los años, empezó a perfumar los guantes de piel de sus clientes. De ahí nació una casa de perfumería que sigue en manos de la misma familia.',
      'Su estilo es reconocible: materias primas nobles, cítricos luminosos y fondos de almizcle y ámbar gris. Aventus, lanzado en 2010, la convirtió en una de las casas nicho más conocidas del mundo.'
    ],
    icons: ['Aventus', 'Green Irish Tweed', 'Silver Mountain Water'] },
  { id: 'amouage', name: 'Amouage', city: 'Mascate, Omán', founded: 'Desde 1983', img: 'amouage',
    alt: 'Frasco de Amouage Guidance 46 sobre fondo rosado',
    desc: 'La casa de Omán que llevó el incienso y la tradición perfumista árabe a la alta perfumería.',
    story: [
      'Amouage nació en Mascate en 1983 con una idea ambiciosa: crear la gran casa de perfumería de Oriente, con el incienso de Omán como seña de identidad.',
      'Sus fragancias son densas, teatrales y muy persistentes. Trabajan con perfumistas de primera línea y cada lanzamiento se plantea casi como una obra: Interlude, Reflection o Jubilation son ya clásicos del nicho.'
    ],
    icons: ['Interlude Man', 'Reflection Man', 'Guidance 46'] },
  { id: 'xerjoff', name: 'Xerjoff', city: 'Turín, Italia', founded: 'Desde 2003', img: 'xerjoff',
    alt: 'Xerjoff Naxos sobre un mapa antiguo con una cinta verde',
    desc: 'Lujo italiano: cristal tallado, tapones dorados y composiciones luminosas y generosas.',
    story: [
      'Sergio Momo fundó Xerjoff en Turín en 2003 con la vocación de unir perfumería y artesanía italiana: frascos de cristal tallado a mano, tapones pesados y estuches de madera.',
      'Dentro hay composiciones generosas y muy bien terminadas, de los cítricos de Erba Pura al tabaco con miel de Naxos, que es para muchos la puerta de entrada al nicho.'
    ],
    icons: ['Naxos', 'Erba Pura', 'Alexandria II'] },
  { id: 'pdm', name: 'Parfums de Marly', city: 'París', founded: 'Desde 2009', img: 'parfums-de-marly',
    alt: 'Detalle del frasco azul de Layton con los caballos en relieve',
    desc: 'Inspirada en la tradición ecuestre de la corte francesa del siglo XVIII. Elegancia clásica, muy ponible.',
    story: [
      'Julien Sprecher creó Parfums de Marly en 2009 inspirándose en el siglo XVIII y en Luis XV, que organizaba en el castillo de Marly las grandes fiestas de la corte en torno a los caballos.',
      'Los caballos encabritados del frasco son su firma. Sus perfumes son elegantes y fáciles de llevar, con éxitos como Layton para él y Delina para ella.'
    ],
    icons: ['Layton', 'Delina', 'Pegasus'] },
  { id: 'initio', name: 'Initio', city: 'París', founded: 'Desde 2015', img: 'initio',
    alt: 'Frasco de Initio Oud for Greatness emergiendo de un líquido dorado',
    desc: 'Perfumes construidos alrededor de materias de gran magnetismo, como el oud y los almizcles.',
    story: [
      'Initio Parfums Privés nació en París en 2015 con una premisa: el perfume como herramienta de seducción, construido alrededor de materias primas que actúan sobre las emociones.',
      'Sus frascos negros y sus composiciones intensas, con mucho oud, almizcle y vainilla, han hecho de títulos como Oud for Greatness o Side Effect auténticos fenómenos.'
    ],
    icons: ['Oud for Greatness', 'Side Effect', 'Rehab'] },
  { id: 'montale', name: 'Montale', city: 'París', founded: 'Desde 2001', img: 'montale',
    alt: 'Frasco metálico negro de Montale Arabians Tonka',
    desc: 'Pionera del oud en Occidente. Fragancias intensas y duraderas en su característico frasco de aluminio.',
    story: [
      'Pierre Montale descubrió el oud trabajando en Arabia Saudí y, en 2001, abrió su casa en París para llevarlo a la perfumería occidental.',
      'Sus frascos de aluminio protegen fragancias muy intensas y duraderas. Junto a los ouds, la casa es famosa por sus rosas y por gourmands como Intense Café.'
    ],
    icons: ['Arabians Tonka', 'Intense Café', 'Black Aoud'] },
  { id: 'memo', name: 'Memo Paris', city: 'París', founded: 'Desde 2007', img: 'memo',
    alt: 'Frasco de Memo Paris Marfa sobre una ilustración de paisaje desértico',
    desc: 'Perfumes de viaje: cada fragancia es un destino, contado con materias primas excepcionales.',
    story: [
      'Clara Molloy fundó Memo Paris en 2007 con una idea literaria: cada perfume es un viaje, y cada frasco lleva la ilustración del lugar que lo inspira.',
      'De Marfa, en el desierto de Texas, al lago Inle de Birmania, la casa cuenta destinos con materias primas excepcionales. Su colección de cueros es de las más reconocidas del nicho.'
    ],
    icons: ['Marfa', 'African Leather', 'Irish Leather'] },
  { id: 'tomford', name: 'Tom Ford', city: 'Private Blend', founded: 'Desde 2007', img: 'tom-ford',
    alt: 'Tom Ford Tobacco Vanille entre hojas de tabaco secas',
    desc: 'La colección Private Blend: lujo nocturno y sensual, con tabaco, oud, cuero y vainilla.',
    story: [
      'En 2007 Tom Ford presentó Private Blend, una colección de perfumes de autor dentro de su propia casa de moda, pensada como un vestidor de fragancias para combinar.',
      'Es lujo nocturno y sensual: Tobacco Vanille, Oud Wood o Lost Cherry se han convertido en referencias que han marcado a toda una generación de perfumes.'
    ],
    icons: ['Tobacco Vanille', 'Oud Wood', 'Lost Cherry'] }
];

/* Utilidades de texto (sirven al compilar y en el navegador) */
/** «Green Irish Tweed» → green-irish-tweed (los ids de las fragancias son casa-nombre) */
export const slug = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
export const euros = (n) => `${n.toLocaleString('es-ES', { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 })} €`;
