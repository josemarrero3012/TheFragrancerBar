/* ==========================================================================
   Catálogo: casas, familias olfativas y fragancias.
   Cada fragancia genera su página /fragancias/<id>/ al compilar.

   PRECIOS DE DEMOSTRACIÓN: son inventados para enseñar cómo funcionaría la
   tienda online. Mientras SITE.demoPrices sea true se avisa en la web y los
   precios no se publican en los datos estructurados.

   Campos de cada fragancia:
     id       ruta de su página (casa-nombre)
     casa     id de la casa
     conc     concentración: EDT, EDP, Extrait o Parfum
     familia  id de familia olfativa
     notes    notas oficiales de la casa (vienen de notas-oficiales.js)
     sizes    [[ml, precio en euros], …] — el primero es el tamaño por defecto
     year     año de lanzamiento, o null si no está confirmado (entonces no se muestra)
     featured (opcional) aparece en la selección de la portada

   FOTOS: solo se publican las fragancias que tienen foto oficial en
   public/img/productos/<id>-400.webp y -800.webp. La lista la mantiene
   `npm run fotos` en fotos.js; las demás quedan en TODAS hasta que tengan foto.
   ORIGINALES: las que además tienen la foto original de la casa, sin recortar, y la
   que la casa enseña al pasar el ratón (`npm run originales`, en originales.js).
   Como site.js, no debe usar nada del navegador (lo lee también vite.config.js).
   ========================================================================== */

import { FOTOS } from './fotos.js';
import { ORIGINALES } from './originales.js';
import { NOTAS_OFICIALES } from './notas-oficiales.js';

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

const C = { creed: [[50, 255], [100, 365]], amouage: [[50, 235], [100, 330]], xerjoff: [[50, 215], [100, 310]],
  pdm: [[75, 235], [125, 315]], initio: [[90, 295]], montale: [[50, 95], [100, 135]], memo: [[30, 135], [75, 245]],
  tomford: [[50, 295], [100, 405]] };

/** Atajo: f('casa', 'Nombre', 'EDP', año, 'familia', 'descripción', {extra}) */
const slug = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
// Variación fija por fragancia (−10 a +30 €) para que los precios de una casa no sean todos iguales
const vary = (id) => ([...id].reduce((h, ch) => h + ch.charCodeAt(0), 0) % 5) * 10 - 10;
const f = (casa, name, conc, year, familia, desc, extra = {}) => {
  const id = `${casa}-${slug(name)}`;
  return { id, casa, name, conc, year, familia, notes: NOTAS_OFICIALES[id], desc, sizes: C[casa].map(([ml, pr]) => [ml, pr + vary(id)]),
    ...(FOTOS.includes(id) && { img: id }), ...(ORIGINALES[id] && { orig: ORIGINALES[id] }), ...extra };
};

/** Todas las fragancias del catálogo, tengan foto o no (las usa scripts/fotos.mjs) */
export const TODAS = [
  // Creed
  f('creed', 'Aventus', 'EDP', 2010, 'frescas',
    'El chipre afrutado que convirtió a Creed en un fenómeno: piña luminosa sobre un fondo ahumado de abedul.', { featured: true }),
  f('creed', 'Green Irish Tweed', 'EDP', 1985, 'frescas',
    'Hierba recién cortada y hoja de violeta: el gran clásico verde de la casa.'),
  f('creed', 'Silver Mountain Water', 'EDP', 1995, 'frescas',
    'Arroyos de montaña y té verde, fresco y con un brillo casi metálico.'),
  f('creed', 'Viking', 'EDP', 2017, 'amaderadas',
    'Pimienta y menta sobre vetiver: energía de travesía nórdica.'),
  f('creed', 'Royal Oud', 'EDP', 2011, 'amaderadas',
    'Un oud elegante y seco, muy lejos de los ouds densos de Oriente.', { sizes: [[50, 285], [100, 395]] }),
  f('creed', 'Original Santal', 'EDP', 2005, 'amaderadas',
    'Sándalo cálido y especiado, de los más versátiles de la casa.'),
  f('creed', 'Millésime Impérial', 'EDP', 1995, 'frescas',
    'Sal marina y cítricos sicilianos, con un brillo dorado.'),
  f('creed', 'Himalaya', 'EDP', 2002, 'amaderadas',
    'Cítricos y maderas frías, inspirado en las cumbres del Himalaya.'),
  f('creed', 'Virgin Island Water', 'EDP', 2007, 'frescas',
    'Lima y coco: un daiquiri a la orilla del Caribe.'),
  f('creed', 'Aventus for Her', 'EDP', 2016, 'florales',
    'La versión femenina de Aventus: manzana verde, rosa y almizcle.', { sizes: [[30, 175], [75, 315]] }),
  f('creed', 'Love in White', 'EDP', 2005, 'florales',
    'Blanco, limpio y luminoso: iris y arroz sobre flores blancas.', { sizes: [[30, 175], [75, 315]] }),
  f('creed', 'Wind Flowers', 'EDP', 2009, 'florales',
    'Jazmín y melocotón llevados por la brisa: un floral delicado.', { sizes: [[30, 175], [75, 315]] }),

  f('creed', 'Absolu Aventus', 'EDP', 2023, 'frescas',
    'Aventus llevado al extremo: más ahumado, más oscuro y más persistente.'),
  f('creed', 'Centaurus', 'EDP', 2023, 'amaderadas',
    'Cítricos brillantes sobre maderas ambaradas: enérgico y muy fácil de llevar.'),
  f('creed', 'Bois du Portugal', 'EDP', 1987, 'amaderadas',
    'Cedro y lavanda con aire de barbería clásica: elegancia sin prisa.'),
  f('creed', 'Spice and Wood', 'EDP', 2015, 'amaderadas',
    'Fruta jugosa, especias cálidas y un fondo de cuero suave.'),
  f('creed', 'Carmina', 'EDP', 2023, 'florales',
    'Una rosa aterciopelada con cereza y azafrán, rotunda y femenina.'),
  f('creed', 'Wild Vetiver', 'EDP', 2023, 'amaderadas',
    'Vetiver verde y luminoso, como hierba al sol.'),
  f('creed', 'Royal Water', 'EDP', 1997, 'frescas',
    'Cítricos, menta y albahaca: un agua de colonia de verano con distinción.'),
  f('creed', 'Erolfa', 'EDP', 1992, 'frescas',
    'Brisa marina y cítricos, pensada para la vida en el mar.'),
  f('creed', 'Néroli Sauvage', 'EDP', 1994, 'frescas',
    'Neroli puro y chispeante, limpio de principio a fin.'),
  f('creed', 'Original Vetiver', 'EDP', 2004, 'frescas',
    'Un vetiver fresco y jabonoso, de camisa blanca recién planchada.'),
  f('creed', 'Fleurissimo', 'EDP', 1956, 'florales',
    'El ramo de novia creado para Grace Kelly: tuberosa, rosa y violeta.'),
  // Amouage
  f('amouage', 'Interlude Man', 'EDP', 2012, 'amaderadas',
    'Caos ordenado: humo de incienso, orégano y oud, con una estela inconfundible.', { featured: true }),
  f('amouage', 'Reflection Man', 'EDP', 2007, 'florales',
    'El floral limpio y elegante de Amouage, perfecto para el día a día.'),
  f('amouage', 'Guidance 46', 'Extrait', 2023, 'florales',
    'Pera y avellana tostada sobre incienso, en concentración de extracto.', { featured: true, sizes: [[50, 295], [100, 415]] }),
  f('amouage', 'Jubilation XXV', 'EDP', 2008, 'ambar',
    'Creado para el 25 aniversario de la casa: incienso, miel y frutas oscuras.'),
  f('amouage', 'Epic Man', 'EDP', 2009, 'amaderadas',
    'Un viaje por la Ruta de la Seda: té, especias e incienso.'),
  f('amouage', 'Memoir Man', 'EDP', 2010, 'amaderadas',
    'Ajenjo y cuero: el lado oscuro y literario de la casa.'),
  f('amouage', 'Lyric Woman', 'EDP', 2008, 'florales',
    'Una rosa de ópera, profunda y especiada.'),
  f('amouage', 'Gold Woman', 'EDP', 1983, 'florales',
    'El primer perfume de la casa: un floral aldehídico majestuoso.'),
  f('amouage', 'Honour Man', 'EDP', 2011, 'amaderadas',
    'Pimienta negra y vetiver: elegancia contenida.'),
  f('amouage', 'Beach Hut Man', 'EDP', 2016, 'frescas',
    'Menta y hojas verdes: una cabaña de playa al atardecer.'),

  f('amouage', 'Guidance', 'EDP', 2023, 'florales',
    'Pera y avellana tostada sobre incienso cremoso: la versión eau de parfum de Guidance.'),
  f('amouage', 'Honour Woman', 'EDP', 2011, 'florales',
    'Flores blancas con pimienta: luminosa, intensa y muy elegante.'),
  f('amouage', 'Epic Woman', 'EDP', 2009, 'ambar',
    'La Ruta de la Seda en un frasco: especias, té ahumado e incienso.'),
  f('amouage', 'Memoir Woman', 'EDP', 2010, 'amaderadas',
    'Ajenjo y rosa sobre cuero: oscura, literaria y de mucho carácter.'),
  f('amouage', 'Journey Man', 'EDP', 2014, 'ambar',
    'Tabaco, cardamomo y cuero: un viaje en un tren nocturno de los años 30.'),
  f('amouage', 'Overture Man', 'EDP', null, 'ambar',
    'Coñac y especias cálidas: festivo, envolvente y muy de noche.'),
  f('amouage', 'Lilac Love', 'EDP', 2016, 'florales',
    'Lila y heliotropo empolvados con un toque goloso de cacao.'),
  // Xerjoff
  f('xerjoff', 'Naxos', 'EDP', 2015, 'ambar',
    'Lavanda, miel y tabaco: un homenaje a Sicilia y una de las fragancias más queridas del nicho.', { featured: true }),
  f('xerjoff', 'Erba Pura', 'EDP', 2019, 'frescas',
    'Una explosión de fruta mediterránea sobre almizcles blancos. De las más pedidas en tienda.', { featured: true }),
  f('xerjoff', 'Alexandria II', 'Parfum', 2012, 'amaderadas',
    'Uno de los grandes ouds de la casa, rosado y cremoso.', { sizes: [[50, 395], [100, 575]] }),
  f('xerjoff', 'Torino21', 'EDP', 2021, 'frescas',
    'Menta y hierbas aromáticas: un homenaje fresco a la ciudad de Turín.'),
  f('xerjoff', 'Lira', 'EDP', 2010, 'ambar',
    'Naranja sanguina y caramelo: un gourmand luminoso.'),
  f('xerjoff', 'Accento', 'EDP', 2010, 'florales',
    'Piña y jacinto sobre iris: dulce y floral.'),
  f('xerjoff', 'Erba Gold', 'EDP', 2021, 'frescas',
    'La hermana dorada de Erba Pura, con jengibre y melón.'),
  f('xerjoff', 'Renaissance', 'EDP', 2012, 'frescas',
    'Cítricos y menta: chispeante y elegante.'),
  f('xerjoff', '40 Knots', 'EDP', 2013, 'frescas',
    'Brisa marina y madera arrastrada por el mar.'),
  f('xerjoff', 'Mefisto', 'EDP', 2009, 'frescas',
    'Un fougère cítrico, clásico y limpio.'),
  f('xerjoff', 'Golden Dallah', 'Parfum', 2015, 'ambar',
    'Café árabe, azafrán y oud: la hospitalidad del Golfo en un frasco.', { sizes: [[50, 425], [100, 615]] }),

  f('xerjoff', 'Elle', 'EDP', null, 'florales',
    'Un gran floral clásico: rosa, iris y jazmín sobre un fondo ambarado.'),
  f('xerjoff', 'Elle Anniversary', 'EDP', null, 'florales',
    'Elle en versión afrutada: lichi y frutos rojos sobre peonía y jazmín.'),
  f('xerjoff', 'Decas', 'EDP', null, 'ambar',
    'Tabaco y tuberosa sobre bálsamos y vainilla: cálido, rico y elegante.'),
  f('xerjoff', 'Accento Overdose', 'EDP', null, 'florales',
    'Accento más verde y fresco, con pino y eucalipto entre las flores.'),
  f('xerjoff', 'Alexandria III', 'EDP', null, 'amaderadas',
    'La continuación de Alexandria II: especias, rosa y una mezcla de ouds de Tailandia y Laos.'),
  f('xerjoff', 'Cruz del Sur II', 'EDP', null, 'frescas',
    'Mango y piña con flores verdes: un viaje tropical muy luminoso.'),
  f('xerjoff', 'Oesel', 'EDP', null, 'florales',
    'Azahar y jazmín con un fondo de flor de tabaco: soleado y elegante.'),
  f('xerjoff', 'Italica', 'EDP', null, 'ambar',
    'Almendra, leche y toffee: un gourmand cremoso e italianísimo.'),
  f('xerjoff', "Fiore d'Ulivo", 'EDP', null, 'frescas',
    'Albahaca, limón y jazmín: la frescura de un jardín mediterráneo.'),
  f('xerjoff', 'Quattro Pizzi', 'EDP', null, 'ambar',
    'Ron, coco y tabaco rubio: cálido, tropical y muy goloso.'),
  // Parfums de Marly
  f('pdm', 'Layton', 'EDP', 2016, 'ambar',
    'Manzana, lavanda y vainilla con un toque de cardamomo. Elegante y muy versátil.', { featured: true }),
  f('pdm', 'Delina', 'EDP', 2017, 'florales',
    'Lichi y ruibarbo sobre una rosa turca: el floral más famoso de la casa.', { featured: true }),
  f('pdm', 'Pegasus', 'EDP', 2011, 'ambar',
    'Almendra y vainilla: el gourmand elegante de la casa.'),
  f('pdm', 'Herod', 'EDP', 2012, 'amaderadas',
    'Tabaco y canela: cálido, sereno y muy de invierno.'),
  f('pdm', 'Percival', 'EDP', 2015, 'frescas',
    'Fresco y almizclado, el comodín para todos los días.'),
  f('pdm', 'Greenley', 'EDP', 2020, 'frescas',
    'Manzana verde y cachemira: verde y luminoso.'),
  f('pdm', 'Sedley', 'EDP', 2019, 'frescas',
    'Menta helada y pomelo: el más fresco de Marly.'),
  f('pdm', 'Carlisle', 'EDP', 2015, 'ambar',
    'Manzana y nuez moscada con un fondo de vainilla y pachulí.'),
  f('pdm', 'Oajan', 'EDP', 2013, 'ambar',
    'Miel y canela: un ámbar dorado y envolvente.'),
  f('pdm', 'Haltane', 'EDP', 2021, 'amaderadas',
    'Praliné y oud, con la lavanda como contrapunto.'),
  f('pdm', 'Valaya', 'EDP', 2022, 'florales',
    'Almizcles blancos y azahar: limpio como la seda.'),
  f('pdm', 'Althaïr', 'EDP', 2023, 'ambar',
    'Vainilla bourbon y praliné con especias suaves.'),

  f('pdm', 'Delina Exclusif', 'Parfum', 2018, 'florales',
    'Delina más profunda y nocturna, con incienso y oud bajo la rosa.'),
  f('pdm', 'Delina La Rosée', 'EDP', 2021, 'florales',
    'La Delina más ligera y acuosa: rosa con rocío de la mañana.'),
  f('pdm', 'Layton Exclusif', 'Parfum', 2017, 'ambar',
    'Layton en clave oscura: más vainilla, más especia y un toque de oud.'),
  f('pdm', 'Pegasus Exclusif', 'Parfum', 2019, 'ambar',
    'Almendra y vainilla con más profundidad y una estela muy cálida.'),
  f('pdm', 'Kalan', 'EDP', 2019, 'frescas',
    'Naranja sanguina y lavanda: fresco, especiado y muy versátil.'),
  f('pdm', 'Godolphin', 'EDP', 2012, 'amaderadas',
    'Cuero noble con tomillo y azafrán, en homenaje a un caballo árabe legendario.'),
  f('pdm', 'Galloway', 'EDP', 2009, 'frescas',
    'Cítricos y flores empolvadas: limpio, suave y muy luminoso.'),
  f('pdm', 'Safanad', 'EDP', 2017, 'florales',
    'Azahar e iris sobre vainilla: un floral dulce y sofisticado.'),
  f('pdm', 'Meliora', 'EDP', 2016, 'florales',
    'Frutos rojos y rosa: alegre, chispeante y muy femenino.'),
  // Initio
  f('initio', 'Oud for Greatness', 'EDP', 2018, 'amaderadas',
    'Azafrán y un oud poderoso: la fragancia insignia de Initio.', { featured: true }),
  f('initio', 'Side Effect', 'EDP', 2016, 'ambar',
    'Ron, tabaco y vainilla: adictivo y nocturno.'),
  f('initio', 'Rehab', 'EDP', 2016, 'amaderadas',
    'Lavanda y almizcles cremosos: reconfortante.'),
  f('initio', 'Musk Therapy', 'EDP', 2017, 'florales',
    'Almizcles limpios y pera: como una piel mejorada.'),
  f('initio', 'Atomic Rose', 'EDP', 2019, 'florales',
    'Una rosa luminosa con un fondo de vainilla.'),
  f('initio', 'Psychedelic Love', 'EDP', 2019, 'florales',
    'Iris y azahar sobre maderas suaves: hipnótico y luminoso.'),
  f('initio', 'Absolute Aphrodisiac', 'EDP', 2016, 'ambar',
    'Vainilla, almizcle y maderas: sensualidad en estado puro.'),
  f('initio', 'Paragon', 'EDP', 2017, 'amaderadas',
    'Un fougère amaderado, solar y moderno.'),
  f('initio', 'Blessed Baraka', 'EDP', 2016, 'amaderadas',
    'Sándalo, ámbar y almizcle: místico y cálido.'),
  f('initio', 'High Frequency', 'EDP', 2018, 'frescas',
    'Cítricos y flores blancas sobre almizcle: vibrante.'),
  f('initio', 'Narcotic Delight', 'EDP', 2020, 'ambar',
    'Cereza negra y coñac: un ámbar embriagador.'),

  // Montale
  f('montale', 'Arabians Tonka', 'EDP', 2016, 'ambar',
    'Azafrán, rosa y oud endulzados con haba tonka. Intenso y muy duradero.', { featured: true }),
  f('montale', 'Intense Café', 'EDP', 2013, 'ambar',
    'Café tostado y rosa: el gourmand más famoso de Montale.'),
  f('montale', 'Black Aoud', 'EDP', 2006, 'amaderadas',
    'Oud y rosa negra: intenso, sin concesiones.'),
  f('montale', 'Roses Musk', 'EDP', 2007, 'florales',
    'Rosa y almizcle blanco: suave y muy persistente.'),
  f('montale', 'Chocolate Greedy', 'EDP', 2009, 'ambar',
    'Chocolate, café y vainilla: goloso de verdad.'),
  f('montale', 'Wild Pears', 'EDP', 2013, 'frescas',
    'Pera jugosa con un fondo almizclado.'),
  f('montale', 'Dark Purple', 'EDP', 2009, 'florales',
    'Ciruela y rosa: oscuro y seductor.'),
  f('montale', 'Aoud Forest', 'EDP', 2008, 'amaderadas',
    'Oud y cítricos en un bosque de maderas húmedas.'),
  f('montale', 'Starry Nights', 'EDP', 2015, 'florales',
    'Rosa y frutas bajo un cielo de pachulí.'),
  f('montale', 'Vanille Absolu', 'EDP', 2004, 'ambar',
    'Vainilla absoluta: densa, cremosa, sin artificio.'),
  f('montale', 'Fantastic Oud', 'EDP', 2016, 'amaderadas',
    'Oud especiado y ahumado, de los más intensos de la casa.'),

  f('montale', 'Amandes Orientales', 'EDP', null, 'ambar',
    'Almendra y vainilla cremosas: un gourmand suave y reconfortante.'),
  f('montale', 'Vanilla Cake', 'EDP', null, 'ambar',
    'Vainilla de pastelería recién horneada, dulce y desenfadada.'),
  f('montale', 'Pure Gold', 'EDP', null, 'ambar',
    'Flores luminosas sobre vainilla y almizcle: dorado y muy envolvente.'),
  f('montale', 'Red Aoud', 'EDP', null, 'amaderadas',
    'Oud y rosa con azafrán: intenso y muy oriental.'),
  f('montale', 'Mango Manga', 'EDP', null, 'frescas',
    'Mango maduro y flores blancas: tropical, alegre y jugoso.'),
  f('montale', 'Roses Elixir', 'EDP', null, 'florales',
    'Una rosa fresca y afrutada, más ligera que Roses Musk.'),
  // Memo Paris
  f('memo', 'Marfa', 'EDP', 2016, 'florales',
    'Nardo y azahar en el desierto de Texas: un floral blanco cálido y solar.', { featured: true }),
  f('memo', 'African Leather', 'EDP', 2015, 'amaderadas',
    'Cuero especiado con azafrán: la sabana al atardecer.'),
  f('memo', 'Irish Leather', 'EDP', 2014, 'amaderadas',
    'Cuero verde con enebro y mate: las praderas de Irlanda.'),
  f('memo', 'Inlé', 'EDP', 2011, 'florales',
    'Osmanthus y té: el lago Inle de Birmania al amanecer.'),
  f('memo', 'French Leather', 'EDP', 2017, 'amaderadas',
    'Un cuero rosado, fino como un guante.'),
  f('memo', 'Italian Leather', 'EDP', 2016, 'amaderadas',
    'Hoja de tomatera y cuero: Italia en pleno verano.'),
  f('memo', 'Lalibela', 'EDP', 2014, 'ambar',
    'Incienso y miel inspirados en las iglesias excavadas de Etiopía.'),
  f('memo', "Tiger's Nest", 'EDP', 2018, 'ambar',
    'Especias y té a la sombra del monasterio de Bután.'),
  f('memo', 'Russian Leather', 'EDP', 2015, 'amaderadas',
    'Cuero helado con menta: las estepas rusas en invierno.'),

  // Tom Ford Private Blend
  f('tomford', 'Tobacco Vanille', 'EDP', 2007, 'ambar',
    'Hoja de tabaco y vainilla: un clásico cálido y envolvente de la colección Private Blend.', { featured: true }),
  f('tomford', 'Oud Wood', 'EDP', 2007, 'amaderadas',
    'El oud que lo empezó todo en Occidente: suave, seco y elegante.'),
  f('tomford', 'Lost Cherry', 'EDP', 2018, 'ambar',
    'Cereza negra y licor: seductor, goloso y muy nocturno.'),
  f('tomford', 'Bitter Peach', 'EDP', 2020, 'ambar',
    'Melocotón maduro con ron y coñac.'),
  f('tomford', 'Tuscan Leather', 'EDP', 2007, 'amaderadas',
    'Cuero crudo con frambuesa y azafrán: icónico.'),
  f('tomford', 'Neroli Portofino', 'EDP', 2011, 'frescas',
    'La Riviera italiana en un frasco: neroli y cítricos.'),
  f('tomford', 'Soleil Blanc', 'EDP', 2016, 'florales',
    'Flores blancas y coco: piel tostada al sol.'),
  f('tomford', 'Rose Prick', 'EDP', 2020, 'florales',
    'Tres rosas con espinas de pimienta.'),
  f('tomford', 'Ébène Fumé', 'EDP', 2021, 'amaderadas',
    'Ébano y palo santo: ahumado y meditativo.'),
  f('tomford', 'Café Rose', 'EDP', 2012, 'florales',
    'Rosa y café tostado: una rosa de madrugada.'),
  f('tomford', 'Santal Blush', 'EDP', 2011, 'amaderadas',
    'Sándalo cremoso y especias suaves: cálido y sensual.'),
  f('tomford', 'Noir de Noir', 'EDP', 2007, 'florales',
    'Rosa negra y trufa: oscuro y aterciopelado.'),
  f('tomford', 'Fucking Fabulous', 'EDP', 2017, 'amaderadas',
    'Lavanda, almendra y cuero: provocador, cremoso y adictivo.'),
  f('tomford', 'Oud Minérale', 'EDP', 2017, 'frescas',
    'Un oud bañado en agua de mar: salino, mineral y sorprendente.'),
  f('tomford', 'Vanilla Sex', 'EDP', 2024, 'ambar',
    'Vainilla cruda y cremosa, cálida como la piel.'),
  f('tomford', 'Tobacco Oud', 'EDP', 2013, 'ambar',
    'Tabaco y oud con un trago de whisky: oscuro y lujoso.'),
  f('tomford', 'Costa Azzurra', 'EDP', 2014, 'frescas',
    'Madera arrastrada por el mar y hierbas mediterráneas.'),
  f('tomford', 'Mandarino di Amalfi', 'EDP', 2014, 'frescas',
    'Mandarina y hierbas frescas de la costa de Amalfi.'),
  f('tomford', 'Jasmin Rouge', 'EDP', 2011, 'florales',
    'Jazmín especiado y sensual, con un fondo de cuero.'),
  f('tomford', 'Grey Vetiver', 'EDP', 2009, 'frescas',
    'Vetiver pulido y elegante, de traje gris.'),
  f('tomford', 'Electric Cherry', 'EDP', 2022, 'florales',
    'La cereza más luminosa de la casa: chispeante, ligera y floral.'),
  f('tomford', 'Cherry Smoke', 'EDP', 2022, 'ambar',
    'Cereza y humo de madera: oscuro, ahumado y muy seductor.')
];

/** Las que se publican: solo las que tienen foto oficial (y notas oficiales) */
export const FRAGANCIAS = TODAS.filter((p) => p.img && p.notes);

/* Utilidades de datos (sirven al navegador y al compilar) */
export const casaById = (id) => CASAS.find((c) => c.id === id);
export const fragById = (id) => FRAGANCIAS.find((p) => p.id === id);
export const familiaName = (id) => FAMILIAS.find((x) => x.id === id).name;
export const fragsDeCasa = (id) => FRAGANCIAS.filter((p) => p.casa === id);
export const priceFrom = (p) => Math.min(...p.sizes.map((s) => s[1]));
export const euros = (n) => `${n.toLocaleString('es-ES', { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 })} €`;
