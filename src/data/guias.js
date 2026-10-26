/* ==========================================================================
   Guías: artículos para quien busca en Google antes de venir a la tienda
   («qué es la perfumería nicho», «perfume para el calor», «perfume para regalar»…).
   Cada guía genera su página /guias/<id>/ al compilar, con datos estructurados Article.

   Cada párrafo es texto plano; [texto](ruta) crea un enlace interno (ruta sin barra inicial,
   como 'comprar/?familia=frescas' o 'tiendas/'). frags: ids de fragancias del catálogo que
   se enseñan al final de la sección (solo salen las publicadas).
   Como site.js, no debe usar nada del navegador (lo lee también vite.config.js).
   ========================================================================== */

export const GUIAS = [
  {
    id: 'que-es-la-perfumeria-nicho',
    title: 'Qué es la perfumería nicho y en qué se diferencia',
    h1: 'Qué es la <em>perfumería nicho</em>',
    description: 'Qué es un perfume nicho, en qué se diferencia de uno de gran distribución y por qué conviene probarlo en piel antes de comprarlo. Guía de The Fragrance Bar.',
    eyebrow: 'Para empezar',
    lede: 'Casas pequeñas o independientes, materias primas protagonistas y fragancias que no buscan gustar a todo el mundo. Te contamos qué hay detrás de la palabra «nicho».',
    date: '2026-10-26',
    sections: [
      { h: 'Una definición sencilla',
        p: ['La perfumería nicho es la que crean casas dedicadas solo, o casi solo, al perfume. No dependen de una marca de moda ni de un gran grupo de cosmética, y eso les deja hacer fragancias con más personalidad, aunque no gusten a todo el mundo.',
          'Se suele oponer a la perfumería de gran distribución, la que se encuentra en cualquier gran almacén y se diseña para agradar a la mayoría. No es que una sea buena y la otra mala: buscan cosas distintas.'] },
      { h: 'Qué la hace diferente',
        p: ['El perfumista suele tener más libertad y más presupuesto para las materias primas. Por eso en el nicho se habla tanto de ingredientes: el incienso de Omán en Amouage, el oud en Initio o Tom Ford, la lavanda y la miel de Naxos en Xerjoff.',
          'También cambia la forma de vender. Las casas nicho se distribuyen en pocas tiendas, con personal que conoce cada fragancia y tiempo para probar. Es justo la idea de [nuestra barra](la-barra/).'],
        frags: ['amouage-interlude-man', 'xerjoff-naxos', 'initio-oud-for-greatness'] },
      { h: 'Nicho no siempre significa intenso',
        p: ['Hay quien asocia el nicho a perfumes densos y orientales, pero el abanico es enorme: de los verdes limpios de Creed a los florales luminosos de Parfums de Marly. Si buscas algo fresco para el día a día, también hay nicho para ti.'],
        frags: ['creed-green-irish-tweed', 'pdm-delina', 'xerjoff-erba-pura'] },
      { h: 'Por qué probarlo antes',
        p: ['Un perfume nicho cambia mucho con el tiempo y con la piel de cada uno. La salida, lo que hueles en los primeros minutos, puede no parecerse al fondo que queda horas después.',
          'Por eso te recomendamos olerlo primero en tira y después en piel, y no decidir con prisa. En cualquiera de [nuestras tiendas](tiendas/) puedes hacerlo sin cita y llevarte muestras para casa.'] }
    ]
  },
  {
    id: 'perfumes-para-el-calor',
    title: 'Perfumes para el calor: qué llevar en Canarias todo el año',
    h1: 'Perfumes para <em>el calor</em>',
    description: 'Qué perfumes funcionan mejor con calor y humedad, cómo aplicarlos para que duren y nuestras fragancias nicho frescas favoritas para Canarias.',
    eyebrow: 'Clima de Canarias',
    lede: 'En Canarias es verano casi todo el año. El calor hace que un perfume se note más y dure distinto, así que conviene elegirlo y ponérselo con un poco de cabeza.',
    date: '2026-10-26',
    sections: [
      { h: 'Qué le pasa a un perfume con calor',
        p: ['Con la piel caliente, el perfume se evapora antes y se proyecta más. Una fragancia que en invierno es discreta puede resultar demasiado en una terraza en agosto, y las notas más pesadas, como la vainilla, el oud o el ámbar, se vuelven más densas.',
          'No hace falta renunciar a ellas, pero sí dosificarlas: una o dos pulverizaciones bastan, y de noche funcionan mucho mejor que a mediodía.'] },
      { h: 'Las familias que mejor funcionan',
        p: ['Los cítricos, las notas verdes, las aromáticas como la menta o la lavanda y los almizcles limpios son los grandes aliados del calor. En el catálogo los encontrarás en [frescas y afrutadas](comprar/?familia=frescas).',
          'Los florales luminosos, con azahar, neroli o flores blancas, también funcionan muy bien de día.'],
        frags: ['tomford-neroli-portofino', 'creed-silver-mountain-water', 'xerjoff-torino21', 'pdm-greenley'] },
      { h: 'Cómo ponérselo para que dure',
        p: ['Aplícalo sobre la piel hidratada: una crema sin perfume ayuda a que la fragancia se agarre. Mejor en el cuello, la nuca y el pecho que en las muñecas, que frotamos sin darnos cuenta.',
          'Si te gusta llevarlo en la ropa, prueba antes en una zona que no se vea: algunos perfumes manchan las prendas claras. Y guarda el frasco lejos del sol y del calor del coche, que es lo que más estropea un perfume.'] },
      { h: 'Para las noches de verano',
        p: ['Si te gustan las fragancias cálidas, guárdalas para la noche o elige versiones más ligeras. Un ámbar con fruta o una vainilla con lavanda resultan más amables que un oud puro.'],
        frags: ['pdm-layton', 'xerjoff-naxos'] }
    ]
  },
  {
    id: 'eau-de-toilette-eau-de-parfum-extracto',
    title: 'Eau de toilette, eau de parfum o extracto: qué cambia',
    h1: 'Eau de toilette, eau de parfum <em>o extracto</em>',
    description: 'La diferencia entre eau de toilette, eau de parfum, parfum y extracto: concentración, duración, estela y cuál elegir según el uso.',
    eyebrow: 'Concentraciones',
    lede: 'La etiqueta del frasco dice cuánta esencia lleva el perfume. Influye en lo que dura y en cómo se nota, pero no en si te va a gustar.',
    date: '2026-10-26',
    sections: [
      { h: 'La diferencia es la concentración',
        p: ['Todas las versiones mezclan esencia y alcohol, en distinta proporción. Como orientación, un eau de toilette suele rondar el 8 al 12 % de esencia, un eau de parfum el 15 al 20 % y un extracto o parfum puede superar el 25 %. Cada casa ajusta sus fórmulas, así que son cifras aproximadas.'] },
      { h: 'Más concentración no siempre es más estela',
        p: ['Un extracto suele durar más, pero se queda más pegado a la piel: se nota de cerca. Un eau de parfum, con más alcohol, tiende a proyectarse más en las primeras horas.',
          'Además, a veces la misma fragancia cambia de una versión a otra: el perfumista reequilibra las notas para cada concentración.'],
        frags: ['amouage-guidance-46', 'xerjoff-alexandria-ii'] },
      { h: 'Cuál elegir',
        p: ['Para el día a día y el calor, un eau de toilette o un eau de parfum fresco. Para la noche o para quien quiere un perfume muy duradero y cercano, un extracto.',
          'La mayoría de las fragancias de nuestro [catálogo](comprar/) son eau de parfum, la concentración más habitual en perfumería nicho. Si dudas entre dos versiones, pruébalas a la vez en la barra, una en cada muñeca.'] }
    ]
  },
  {
    id: 'como-elegir-un-perfume',
    title: 'Cómo elegir un perfume nicho sin equivocarte',
    h1: 'Cómo elegir un perfume <em>sin equivocarte</em>',
    description: 'Cinco consejos para elegir un perfume nicho: familias olfativas, cuántos oler a la vez, probar en piel y llevarse muestras antes de decidir.',
    eyebrow: 'En la barra',
    lede: 'Elegir perfume es más fácil de lo que parece si sabes qué buscar. Estos son los consejos que damos cada día en la barra.',
    date: '2026-10-26',
    sections: [
      { h: '1. Empieza por lo que ya te gusta',
        p: ['Piensa en un perfume que hayas llevado y te haya gustado, aunque no sea nicho. Nos dice mucho: si es fresco o dulce, si te gustan las flores, la madera o las especias. A partir de ahí es fácil proponerte casas que no conocías.'] },
      { h: '2. Conoce las cuatro familias',
        p: ['Las [frescas y afrutadas](comprar/?familia=frescas) son cítricos, verdes y fruta. Las [florales](comprar/?familia=florales), rosa, azahar, iris o flores blancas. Las [amaderadas](comprar/?familia=amaderadas), cedro, sándalo, oud o cuero. Las de [ámbar y especias](comprar/?familia=ambar), vainilla, resinas, tabaco y especias. La mayoría de los perfumes mezclan dos.'] },
      { h: '3. No huelas más de tres o cuatro seguidos',
        p: ['La nariz se cansa pronto. Prueba en tira, descarta rápido y quédate con dos o tres candidatas. Entre una y otra, descansa unos segundos.'] },
      { h: '4. Decide en la piel, no en la tira',
        p: ['La tira sirve para descartar; la piel, para decidir. Ponte tu favorita y date un paseo: la salida de los primeros minutos no es lo que olerás después. Si dudas, vuelve otro día.'] },
      { h: '5. Llévate muestras',
        p: ['Pídenos muestras de tus candidatas y llévalas unos días. Puedes guardar las que te interesen en [Tu lista](contacto/#lista) y enseñárnoslas al llegar o mandárnoslas por WhatsApp.'],
        frags: ['creed-aventus', 'pdm-delina', 'memo-marfa', 'tomford-tobacco-vanille'] }
    ]
  },
  {
    id: 'perfume-para-regalar',
    title: 'Cómo acertar al regalar un perfume nicho',
    h1: 'Cómo acertar al <em>regalar un perfume</em>',
    description: 'Ideas para regalar un perfume nicho sin conocer los gustos exactos de quien lo recibe: fragancias versátiles, muestras y consejos de The Fragrance Bar.',
    eyebrow: 'Regalos',
    lede: 'Regalar perfume da respeto, porque es algo muy personal. Con unas pocas pistas sobre la persona es más fácil acertar de lo que parece.',
    date: '2026-10-26',
    sections: [
      { h: 'Las pistas que necesitas',
        p: ['Fíjate en qué perfume lleva ahora, si prefiere lo fresco o lo cálido y si lo usará a diario o para ocasiones. Con eso ya podemos orientarte en la barra, aunque no sepas el nombre de ninguna fragancia.'] },
      { h: 'Fragancias que gustan a casi todos',
        p: ['Si no tienes pistas, busca perfumes versátiles: limpios, luminosos y sin notas difíciles. Estas son algunas de las que más recomendamos para regalar.'],
        frags: ['pdm-layton', 'xerjoff-erba-pura', 'amouage-reflection-man', 'montale-roses-musk'] },
      { h: 'Para quien ya sabe de perfumes',
        p: ['A alguien que ya conoce el nicho le sorprenderá más una casa nueva que el clásico que ya tiene. Las casas más literarias, como Memo Paris, o los cueros de Tom Ford suelen ser un buen descubrimiento.'],
        frags: ['memo-inle', 'tomford-tuscan-leather'] },
      { h: 'Si sigues dudando',
        p: ['Escríbenos por WhatsApp o pásate por [cualquiera de nuestras tiendas](tiendas/): te ayudamos a elegir y lo envolvemos para regalo. Las preguntas que más nos hacen sobre regalos están en [contacto](contacto/#preguntas).'] }
    ]
  }
];
