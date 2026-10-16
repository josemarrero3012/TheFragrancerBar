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
     notes    [salida, corazón, fondo]
     sizes    [[ml, precio en euros], …] — el primero es el tamaño por defecto
     img      (opcional) img/productos/<img>-400.webp y -800.webp; sin foto se dibuja un frasco
     featured (opcional) aparece en la selección de la portada
   Como site.js, no debe usar nada del navegador (lo lee también vite.config.js).
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

const C = { creed: [[50, 255], [100, 365]], amouage: [[50, 235], [100, 330]], xerjoff: [[50, 215], [100, 310]],
  pdm: [[75, 235], [125, 315]], initio: [[90, 295]], montale: [[50, 95], [100, 135]], memo: [[30, 135], [75, 245]],
  tomford: [[50, 295], [100, 405]] };

/** Atajo: f('casa', 'Nombre', 'EDP', año, 'familia', [salida, corazón, fondo], 'descripción', {extra}) */
const slug = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
// Variación fija por fragancia (−10 a +30 €) para que los precios de una casa no sean todos iguales
const vary = (id) => ([...id].reduce((h, ch) => h + ch.charCodeAt(0), 0) % 5) * 10 - 10;
const f = (casa, name, conc, year, familia, notes, desc, extra = {}) => {
  const id = `${casa}-${slug(name)}`;
  return { id, casa, name, conc, year, familia, notes, desc, sizes: C[casa].map(([ml, pr]) => [ml, pr + vary(id)]), ...extra };
};

export const FRAGANCIAS = [
  // Creed
  f('creed', 'Aventus', 'EDP', 2010, 'frescas', ['Piña, bergamota, grosella negra, manzana', 'Abedul ahumado, pachulí, jazmín', 'Musgo de roble, almizcle, ámbar gris, vainilla'],
    'El chipre afrutado que convirtió a Creed en un fenómeno: piña luminosa sobre un fondo ahumado de abedul.', { img: 'creed-aventus', featured: true }),
  f('creed', 'Green Irish Tweed', 'EDP', 1985, 'frescas', ['Verbena de limón, menta', 'Hoja de violeta, iris', 'Sándalo, ámbar gris'],
    'Hierba recién cortada y hoja de violeta: el gran clásico verde de la casa.'),
  f('creed', 'Silver Mountain Water', 'EDP', 1995, 'frescas', ['Bergamota, mandarina', 'Té verde, grosella negra', 'Almizcle, sándalo, petitgrain'],
    'Arroyos de montaña y té verde, fresco y con un brillo casi metálico.'),
  f('creed', 'Viking', 'EDP', 2017, 'amaderadas', ['Bergamota, limón, pimienta rosa', 'Menta, rosa, pimienta', 'Vetiver, sándalo, pachulí'],
    'Pimienta y menta sobre vetiver: energía de travesía nórdica.'),
  f('creed', 'Royal Oud', 'EDP', 2011, 'amaderadas', ['Limón, bergamota, pimienta rosa', 'Cedro, angélica, gálbano', 'Sándalo, oud, almizcle'],
    'Un oud elegante y seco, muy lejos de los ouds densos de Oriente.', { sizes: [[50, 285], [100, 395]] }),
  f('creed', 'Original Santal', 'EDP', 2005, 'amaderadas', ['Enebro, mandarina, canela', 'Lavanda, cilantro, rosa', 'Sándalo, vainilla, haba tonka'],
    'Sándalo cálido y especiado, de los más versátiles de la casa.'),
  f('creed', 'Millésime Impérial', 'EDP', 1995, 'frescas', ['Bergamota, limón, mandarina', 'Iris, notas marinas, sal', 'Almizcle, maderas'],
    'Sal marina y cítricos sicilianos, con un brillo dorado.'),
  f('creed', 'Himalaya', 'EDP', 2002, 'amaderadas', ['Bergamota, limón, pomelo', 'Enebro, pimienta de Sichuan', 'Sándalo, cedro, almizcle, ámbar'],
    'Cítricos y maderas frías, inspirado en las cumbres del Himalaya.'),
  f('creed', 'Virgin Island Water', 'EDP', 2007, 'frescas', ['Lima, coco, bergamota', 'Jengibre, hibisco, jazmín', 'Ron blanco, caña de azúcar, almizcle'],
    'Lima y coco: un daiquiri a la orilla del Caribe.'),
  f('creed', 'Aventus for Her', 'EDP', 2016, 'florales', ['Manzana verde, limón, pimienta rosa', 'Rosa, estoraque, sándalo', 'Almizcle, pachulí, ylang-ylang'],
    'La versión femenina de Aventus: manzana verde, rosa y almizcle.', { sizes: [[30, 175], [75, 315]] }),
  f('creed', 'Love in White', 'EDP', 2005, 'florales', ['Piel de naranja, arroz, iris', 'Narciso, magnolia, jazmín, rosa', 'Sándalo, vainilla, ámbar gris'],
    'Blanco, limpio y luminoso: iris y arroz sobre flores blancas.', { sizes: [[30, 175], [75, 315]] }),
  f('creed', 'Wind Flowers', 'EDP', 2009, 'florales', ['Melocotón, flor de azahar', 'Jazmín, tuberosa', 'Iris, almizcle, vainilla'],
    'Jazmín y melocotón llevados por la brisa: un floral delicado.', { sizes: [[30, 175], [75, 315]] }),

  // Amouage
  f('amouage', 'Interlude Man', 'EDP', 2012, 'amaderadas', ['Orégano, pimienta, bergamota', 'Incienso, ámbar, opopónaco', 'Oud, cuero, pachulí, sándalo'],
    'Caos ordenado: humo de incienso, orégano y oud, con una estela inconfundible.', { img: 'amouage-interlude', featured: true }),
  f('amouage', 'Reflection Man', 'EDP', 2007, 'florales', ['Romero, pimienta rosa, hoja de violeta', 'Jazmín, flor de azahar, raíz de lirio', 'Sándalo, vetiver, cedro, pachulí'],
    'El floral limpio y elegante de Amouage, perfecto para el día a día.'),
  f('amouage', 'Guidance 46', 'Extrait', 2023, 'florales', ['Pera, avellana', 'Rosa, flor de azahar, osmanthus', 'Incienso, sándalo, vainilla'],
    'Pera y avellana tostada sobre incienso, en concentración de extracto.', { img: 'amouage-guidance46', featured: true, sizes: [[50, 295], [100, 415]] }),
  f('amouage', 'Jubilation XXV', 'EDP', 2008, 'ambar', ['Naranja, cilantro, frutas oscuras', 'Incienso, mirra, rosa, miel', 'Láudano, oud, almizcle, ámbar gris'],
    'Creado para el 25 aniversario de la casa: incienso, miel y frutas oscuras.'),
  f('amouage', 'Epic Man', 'EDP', 2009, 'amaderadas', ['Comino, cardamomo, pimienta rosa', 'Incienso, geranio, té negro', 'Oud, sándalo, almizcle'],
    'Un viaje por la Ruta de la Seda: té, especias e incienso.'),
  f('amouage', 'Memoir Man', 'EDP', 2010, 'amaderadas', ['Ajenjo, menta, albahaca', 'Incienso, lavanda, rosa', 'Cuero, vetiver, sándalo'],
    'Ajenjo y cuero: el lado oscuro y literario de la casa.'),
  f('amouage', 'Lyric Woman', 'EDP', 2008, 'florales', ['Bergamota, jengibre', 'Rosa, ylang-ylang, jazmín', 'Incienso, sándalo, almizcle'],
    'Una rosa de ópera, profunda y especiada.'),
  f('amouage', 'Gold Woman', 'EDP', 1983, 'florales', ['Aldehídos, rosa, lirio de los valles', 'Jazmín, mirra, iris', 'Ámbar gris, almizcle, sándalo'],
    'El primer perfume de la casa: un floral aldehídico majestuoso.'),
  f('amouage', 'Honour Man', 'EDP', 2011, 'amaderadas', ['Pimienta negra, elemí', 'Nuez moscada, incienso', 'Vetiver, cedro, haba tonka'],
    'Pimienta negra y vetiver: elegancia contenida.'),
  f('amouage', 'Beach Hut Man', 'EDP', 2016, 'frescas', ['Menta, hiedra', 'Mirra, pachulí', 'Musgo de roble, ámbar'],
    'Menta y hojas verdes: una cabaña de playa al atardecer.'),

  // Xerjoff
  f('xerjoff', 'Naxos', 'EDP', 2015, 'ambar', ['Lavanda, bergamota, limón', 'Miel, canela, jazmín', 'Tabaco, haba tonka, vainilla'],
    'Lavanda, miel y tabaco: un homenaje a Sicilia y una de las fragancias más queridas del nicho.', { img: 'xerjoff-naxos', featured: true }),
  f('xerjoff', 'Erba Pura', 'EDP', 2019, 'frescas', ['Naranja siciliana, limón, bergamota', 'Frutas mediterráneas', 'Almizcle blanco, ámbar, vainilla'],
    'Una explosión de fruta mediterránea sobre almizcles blancos. De las más pedidas en tienda.', { img: 'xerjoff-erbapura', featured: true }),
  f('xerjoff', 'Alexandria II', 'Parfum', 2012, 'amaderadas', ['Palo de rosa, lavanda, canela', 'Rosa, lirio de los valles, cedro', 'Oud, ámbar, vainilla, almizcle'],
    'Uno de los grandes ouds de la casa, rosado y cremoso.', { sizes: [[50, 395], [100, 575]] }),
  f('xerjoff', 'Torino21', 'EDP', 2021, 'frescas', ['Limón, bergamota, menta', 'Lavanda, albahaca, tomillo', 'Almizcle, maderas'],
    'Menta y hierbas aromáticas: un homenaje fresco a la ciudad de Turín.'),
  f('xerjoff', 'Lira', 'EDP', 2010, 'ambar', ['Bergamota, naranja sanguina, limón', 'Lavanda, jazmín, canela, regaliz', 'Caramelo, vainilla, almizcle'],
    'Naranja sanguina y caramelo: un gourmand luminoso.'),
  f('xerjoff', 'Accento', 'EDP', 2010, 'florales', ['Piña, jacinto, pimienta rosa', 'Iris, jazmín', 'Vainilla, almizcle, ámbar, pachulí'],
    'Piña y jacinto sobre iris: dulce y floral.'),
  f('xerjoff', 'Erba Gold', 'EDP', 2021, 'frescas', ['Jengibre, limón, mandarina, cardamomo', 'Pera, melón, canela', 'Almizcle, ámbar, vainilla'],
    'La hermana dorada de Erba Pura, con jengibre y melón.'),
  f('xerjoff', 'Renaissance', 'EDP', 2012, 'frescas', ['Mandarina, limón, menta, bergamota', 'Rosa, lirio de los valles', 'Ámbar, almizcle, maderas'],
    'Cítricos y menta: chispeante y elegante.'),
  f('xerjoff', '40 Knots', 'EDP', 2013, 'frescas', ['Notas marinas, sal', 'Madera flotante, salvia', 'Musgo de roble, ámbar gris'],
    'Brisa marina y madera arrastrada por el mar.'),
  f('xerjoff', 'Mefisto', 'EDP', 2009, 'frescas', ['Bergamota, limón, pomelo', 'Lavanda, rosa, flor de azahar', 'Musgo de roble, almizcle, ámbar'],
    'Un fougère cítrico, clásico y limpio.'),
  f('xerjoff', 'Golden Dallah', 'Parfum', 2015, 'ambar', ['Café, cardamomo, azafrán', 'Rosa, oud', 'Ámbar, vainilla, almizcle'],
    'Café árabe, azafrán y oud: la hospitalidad del Golfo en un frasco.', { sizes: [[50, 425], [100, 615]] }),

  // Parfums de Marly
  f('pdm', 'Layton', 'EDP', 2016, 'ambar', ['Manzana, lavanda, bergamota', 'Geranio, violeta, jazmín', 'Vainilla, cardamomo, sándalo, pachulí'],
    'Manzana, lavanda y vainilla con un toque de cardamomo. Elegante y muy versátil.', { img: 'pdm-layton', featured: true }),
  f('pdm', 'Delina', 'EDP', 2017, 'florales', ['Lichi, ruibarbo, bergamota, nuez moscada', 'Rosa turca, peonía, vainilla', 'Cachemira, cedro, incienso'],
    'Lichi y ruibarbo sobre una rosa turca: el floral más famoso de la casa.', { img: 'pdm-delina', featured: true }),
  f('pdm', 'Pegasus', 'EDP', 2011, 'ambar', ['Heliotropo, comino, bergamota', 'Almendra amarga, lavanda, jazmín', 'Vainilla, sándalo, ámbar'],
    'Almendra y vainilla: el gourmand elegante de la casa.'),
  f('pdm', 'Herod', 'EDP', 2012, 'amaderadas', ['Canela, pimienta', 'Hoja de tabaco, incienso, osmanthus', 'Vainilla, almizcle, cedro, vetiver'],
    'Tabaco y canela: cálido, sereno y muy de invierno.'),
  f('pdm', 'Percival', 'EDP', 2015, 'frescas', ['Mandarina, lavanda, bergamota', 'Geranio, canela', 'Almizcle, ámbar'],
    'Fresco y almizclado, el comodín para todos los días.'),
  f('pdm', 'Greenley', 'EDP', 2020, 'frescas', ['Manzana verde, mandarina, bergamota', 'Cachemira, violeta, naranja', 'Cedro, pachulí, almizcle'],
    'Manzana verde y cachemira: verde y luminoso.'),
  f('pdm', 'Sedley', 'EDP', 2019, 'frescas', ['Menta, pomelo, bergamota', 'Lavanda, geranio, romero', 'Cedro, maderas'],
    'Menta helada y pomelo: el más fresco de Marly.'),
  f('pdm', 'Carlisle', 'EDP', 2015, 'ambar', ['Manzana verde, nuez moscada', 'Rosa, haba tonka, pachulí', 'Vainilla, opopónaco'],
    'Manzana y nuez moscada con un fondo de vainilla y pachulí.'),
  f('pdm', 'Oajan', 'EDP', 2013, 'ambar', ['Canela, osmanthus', 'Miel, haba tonka', 'Ámbar, benjuí, vainilla'],
    'Miel y canela: un ámbar dorado y envolvente.'),
  f('pdm', 'Haltane', 'EDP', 2021, 'amaderadas', ['Salvia, bergamota, lavanda', 'Praliné, cedro', 'Oud, musgo, ámbar'],
    'Praliné y oud, con la lavanda como contrapunto.'),
  f('pdm', 'Valaya', 'EDP', 2022, 'florales', ['Aldehídos, bergamota, mandarina', 'Flor de azahar, iris', 'Almizcle blanco, vainilla'],
    'Almizcles blancos y azahar: limpio como la seda.'),
  f('pdm', 'Althaïr', 'EDP', 2023, 'ambar', ['Cardamomo, canela, flor de azahar', 'Vainilla bourbon, praliné', 'Almizcle, maderas'],
    'Vainilla bourbon y praliné con especias suaves.'),

  // Initio
  f('initio', 'Oud for Greatness', 'EDP', 2018, 'amaderadas', ['Azafrán, nuez moscada', 'Lavanda', 'Oud, pachulí, almizcle'],
    'Azafrán y un oud poderoso: la fragancia insignia de Initio.', { img: 'initio-ofg', featured: true }),
  f('initio', 'Side Effect', 'EDP', 2016, 'ambar', ['Ron, canela', 'Tabaco', 'Vainilla'],
    'Ron, tabaco y vainilla: adictivo y nocturno.'),
  f('initio', 'Rehab', 'EDP', 2016, 'amaderadas', ['Lavanda, bergamota', 'Almizcle, sándalo', 'Haba tonka, maderas'],
    'Lavanda y almizcles cremosos: reconfortante.'),
  f('initio', 'Musk Therapy', 'EDP', 2017, 'florales', ['Bergamota, pimienta rosa', 'Almizcle blanco, pera', 'Maderas claras'],
    'Almizcles limpios y pera: como una piel mejorada.'),
  f('initio', 'Atomic Rose', 'EDP', 2019, 'florales', ['Bergamota, coñac', 'Rosa, jazmín', 'Vainilla, haba tonka'],
    'Una rosa luminosa con un fondo de vainilla.'),
  f('initio', 'Psychedelic Love', 'EDP', 2019, 'florales', ['Bergamota, almizcle', 'Iris, flor de azahar', 'Vetiver, madera de guayaco'],
    'Iris y azahar sobre maderas suaves: hipnótico y luminoso.'),
  f('initio', 'Absolute Aphrodisiac', 'EDP', 2016, 'ambar', ['Vainilla', 'Almizcle', 'Sándalo, haba tonka'],
    'Vainilla, almizcle y maderas: sensualidad en estado puro.'),
  f('initio', 'Paragon', 'EDP', 2017, 'amaderadas', ['Lavanda, salvia', 'Sándalo', 'Ámbar, maderas'],
    'Un fougère amaderado, solar y moderno.'),
  f('initio', 'Blessed Baraka', 'EDP', 2016, 'amaderadas', ['Sándalo', 'Ámbar', 'Almizcle'],
    'Sándalo, ámbar y almizcle: místico y cálido.'),
  f('initio', 'High Frequency', 'EDP', 2018, 'frescas', ['Bergamota, limón', 'Flores blancas', 'Almizcle, maderas'],
    'Cítricos y flores blancas sobre almizcle: vibrante.'),
  f('initio', 'Narcotic Delight', 'EDP', 2020, 'ambar', ['Coñac, cereza negra', 'Especias', 'Vainilla, ámbar'],
    'Cereza negra y coñac: un ámbar embriagador.'),

  // Montale
  f('montale', 'Arabians Tonka', 'EDP', 2016, 'ambar', ['Azafrán, bergamota', 'Rosa búlgara, oud', 'Haba tonka, ámbar, almizcle'],
    'Azafrán, rosa y oud endulzados con haba tonka. Intenso y muy duradero.', { img: 'montale-arabians-tonka', featured: true }),
  f('montale', 'Intense Café', 'EDP', 2013, 'ambar', ['Rosa, café', 'Flores blancas', 'Vainilla, ámbar, almizcle'],
    'Café tostado y rosa: el gourmand más famoso de Montale.'),
  f('montale', 'Black Aoud', 'EDP', 2006, 'amaderadas', ['Mandarina', 'Rosa, pachulí', 'Oud, almizcle, ládano'],
    'Oud y rosa negra: intenso, sin concesiones.'),
  f('montale', 'Roses Musk', 'EDP', 2007, 'florales', ['Rosa', 'Jazmín', 'Almizcle, ámbar'],
    'Rosa y almizcle blanco: suave y muy persistente.'),
  f('montale', 'Chocolate Greedy', 'EDP', 2009, 'ambar', ['Cacao, café', 'Frutos secos, naranja amarga', 'Vainilla, haba tonka'],
    'Chocolate, café y vainilla: goloso de verdad.'),
  f('montale', 'Wild Pears', 'EDP', 2013, 'frescas', ['Pera, mandarina', 'Rosa, flores blancas', 'Almizcle, ámbar'],
    'Pera jugosa con un fondo almizclado.'),
  f('montale', 'Dark Purple', 'EDP', 2009, 'florales', ['Ciruela, naranja', 'Rosa, geranio', 'Pachulí, vainilla, almizcle'],
    'Ciruela y rosa: oscuro y seductor.'),
  f('montale', 'Aoud Forest', 'EDP', 2008, 'amaderadas', ['Cítricos', 'Oud, rosa', 'Maderas, almizcle'],
    'Oud y cítricos en un bosque de maderas húmedas.'),
  f('montale', 'Starry Nights', 'EDP', 2015, 'florales', ['Cítricos, frutas', 'Rosa, jazmín', 'Pachulí, almizcle'],
    'Rosa y frutas bajo un cielo de pachulí.'),
  f('montale', 'Vanille Absolu', 'EDP', 2004, 'ambar', ['Vainilla', 'Almizcle', 'Ámbar'],
    'Vainilla absoluta: densa, cremosa, sin artificio.'),
  f('montale', 'Fantastic Oud', 'EDP', 2016, 'amaderadas', ['Especias', 'Oud, rosa', 'Maderas ahumadas, ámbar'],
    'Oud especiado y ahumado, de los más intensos de la casa.'),

  // Memo Paris
  f('memo', 'Marfa', 'EDP', 2016, 'florales', ['Agave, flor de azahar', 'Nardo, ylang-ylang', 'Sándalo, cedro, almizcle'],
    'Nardo y azahar en el desierto de Texas: un floral blanco cálido y solar.', { img: 'memo-marfa', featured: true }),
  f('memo', 'African Leather', 'EDP', 2015, 'amaderadas', ['Cardamomo, comino, azafrán', 'Cuero, geranio', 'Pachulí, vetiver, oud'],
    'Cuero especiado con azafrán: la sabana al atardecer.'),
  f('memo', 'Irish Leather', 'EDP', 2014, 'amaderadas', ['Enebro, pimienta rosa, mate', 'Cuero, iris', 'Haba tonka, ámbar, musgo'],
    'Cuero verde con enebro y mate: las praderas de Irlanda.'),
  f('memo', 'Inlé', 'EDP', 2011, 'florales', ['Té, osmanthus', 'Jazmín', 'Almizcle'],
    'Osmanthus y té: el lago Inle de Birmania al amanecer.'),
  f('memo', 'French Leather', 'EDP', 2017, 'amaderadas', ['Pimienta rosa, mandarina', 'Cuero, rosa', 'Almizcle, maderas'],
    'Un cuero rosado, fino como un guante.'),
  f('memo', 'Italian Leather', 'EDP', 2016, 'amaderadas', ['Hoja de tomatera, pimienta', 'Cuero, iris', 'Haba tonka, vainilla'],
    'Hoja de tomatera y cuero: Italia en pleno verano.'),
  f('memo', 'Lalibela', 'EDP', 2014, 'ambar', ['Mirra, incienso', 'Miel', 'Benjuí, vainilla'],
    'Incienso y miel inspirados en las iglesias excavadas de Etiopía.'),
  f('memo', "Tiger's Nest", 'EDP', 2018, 'ambar', ['Cardamomo, canela', 'Té, especias', 'Ámbar, maderas'],
    'Especias y té a la sombra del monasterio de Bután.'),
  f('memo', 'Russian Leather', 'EDP', 2015, 'amaderadas', ['Menta', 'Cuero', 'Maderas, ámbar'],
    'Cuero helado con menta: las estepas rusas en invierno.'),

  // Tom Ford Private Blend
  f('tomford', 'Tobacco Vanille', 'EDP', 2007, 'ambar', ['Hoja de tabaco, especias', 'Vainilla, cacao, haba tonka', 'Frutos secos, maderas'],
    'Hoja de tabaco y vainilla: un clásico cálido y envolvente de la colección Private Blend.', { img: 'tf-tobacco-vanille', featured: true }),
  f('tomford', 'Oud Wood', 'EDP', 2007, 'amaderadas', ['Palo de rosa, cardamomo, pimienta', 'Oud, sándalo, vetiver', 'Haba tonka, vainilla, ámbar'],
    'El oud que lo empezó todo en Occidente: suave, seco y elegante.'),
  f('tomford', 'Lost Cherry', 'EDP', 2018, 'ambar', ['Cereza negra, licor de cereza, almendra amarga', 'Rosa turca, jazmín', 'Haba tonka, vainilla, sándalo'],
    'Cereza negra y licor: seductor, goloso y muy nocturno.'),
  f('tomford', 'Bitter Peach', 'EDP', 2020, 'ambar', ['Melocotón, naranja sanguina, cardamomo', 'Ron, coñac, jazmín', 'Vainilla, pachulí, sándalo'],
    'Melocotón maduro con ron y coñac.'),
  f('tomford', 'Tuscan Leather', 'EDP', 2007, 'amaderadas', ['Frambuesa, azafrán, tomillo', 'Olíbano, jazmín', 'Cuero, ámbar, maderas'],
    'Cuero crudo con frambuesa y azafrán: icónico.'),
  f('tomford', 'Neroli Portofino', 'EDP', 2011, 'frescas', ['Bergamota, mandarina, limón', 'Neroli, flor de azahar, jazmín', 'Ámbar, almizcle'],
    'La Riviera italiana en un frasco: neroli y cítricos.'),
  f('tomford', 'Soleil Blanc', 'EDP', 2016, 'florales', ['Bergamota, cardamomo, pistacho', 'Ylang-ylang, jazmín, tuberosa', 'Coco, ámbar, haba tonka'],
    'Flores blancas y coco: piel tostada al sol.'),
  f('tomford', 'Rose Prick', 'EDP', 2020, 'florales', ['Pimienta de Sichuan, cúrcuma', 'Rosa de mayo, rosa turca', 'Pachulí, haba tonka'],
    'Tres rosas con espinas de pimienta.'),
  f('tomford', 'Ébène Fumé', 'EDP', 2021, 'amaderadas', ['Pimienta rosa', 'Ébano, palo santo', 'Cuero, ládano'],
    'Ébano y palo santo: ahumado y meditativo.'),
  f('tomford', 'Café Rose', 'EDP', 2012, 'florales', ['Café, azafrán', 'Rosa turca, rosa de mayo', 'Incienso, pachulí, sándalo'],
    'Rosa y café tostado: una rosa de madrugada.'),
  f('tomford', 'Santal Blush', 'EDP', 2011, 'amaderadas', ['Canela, comino, fenogreco', 'Sándalo, jazmín, rosa', 'Benjuí, cedro'],
    'Sándalo cremoso y especias suaves: cálido y sensual.'),
  f('tomford', 'Noir de Noir', 'EDP', 2007, 'florales', ['Azafrán', 'Rosa negra, trufa', 'Pachulí, vainilla, oud'],
    'Rosa negra y trufa: oscuro y aterciopelado.')
];

/* Utilidades de datos (sirven al navegador y al compilar) */
export const casaById = (id) => CASAS.find((c) => c.id === id);
export const fragById = (id) => FRAGANCIAS.find((p) => p.id === id);
export const familiaName = (id) => FAMILIAS.find((x) => x.id === id).name;
export const fragsDeCasa = (id) => FRAGANCIAS.filter((p) => p.casa === id);
export const priceFrom = (p) => Math.min(...p.sizes.map((s) => s[1]));
export const euros = (n) => `${n.toLocaleString('es-ES', { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 })} €`;
