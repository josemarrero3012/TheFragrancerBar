/* ==========================================================================
   Diccionario de notas olfativas: una entrada por imagen.

   Cada nota que aparece en notas-oficiales.js se busca aquí por su nombre o por
   uno de sus alias (sin tildes ni mayúsculas). Varias notas comparten imagen:
   «Bergamota de Calabria» usa la de bergamota.

     name   nombre de la nota
     wiki   artículo de la Wikipedia en inglés cuya foto principal se usa
     file   (opcional) archivo concreto de Wikimedia Commons; manda sobre wiki
     alias  otros nombres con los que aparece en las fichas

   `npm run notas` descarga las fotos a public/img/notas/<clave>.webp y apunta
   autor y licencia en notas-fotos.js. Las notas sin foto se ven con su inicial.
   Como site.js, no debe usar nada del navegador.
   ========================================================================== */

import { NOTAS_FOTOS } from './notas-fotos.js';

export { NOTAS_FOTOS };

export const NOTAS = {
  abedul: { name: 'Abedul', wiki: 'Birch' },
  abeto: { name: 'Abeto', wiki: 'Abies balsamea', alias: ['Bálsamo de abeto'] },
  acacia: { name: 'Acacia', wiki: 'Acacia dealbata', alias: ['Flor de acacia'] },
  ajenjo: { name: 'Ajenjo', wiki: 'Artemisia absinthium', alias: ['Absenta'] },
  albahaca: { name: 'Albahaca', wiki: 'Basil', alias: ['Hojas de albahaca'] },
  almendra: { name: 'Almendra', wiki: 'Almond', alias: ['Almendra amarga', 'Almendra en polvo'] },
  almizcle: { name: 'Almizcle', wiki: 'Musk', alias: ['Almizcle blanco', 'Almizcle rosa', 'Almizcles', 'Almizcles blancos'] },
  ambar: { name: 'Ámbar', wiki: 'Amber', alias: ['Ámbar salado'] },
  'ambar-gris': { name: 'Ámbar gris', wiki: 'Ambergris', alias: ['Ambrox'] },
  ambreta: { name: 'Ambreta', wiki: 'Abelmoschus moschatus' },
  angelica: { name: 'Angélica', wiki: 'Angelica archangelica' },
  anis: { name: 'Anís', wiki: 'Anise' },
  avellana: { name: 'Avellana', wiki: 'Hazelnut' },
  azafran: { name: 'Azafrán', wiki: 'Saffron', alias: ['Flor de azafrán'] },
  azahar: { name: 'Azahar', wiki: 'Orange blossom', alias: ['Flor de azahar'] },
  'azucar-moreno': { name: 'Azúcar moreno', wiki: 'Brown sugar' },
  'balsamo-de-peru': { name: 'Bálsamo de Perú', wiki: 'Balsam of Peru' },
  'balsamo-de-tolu': { name: 'Bálsamo de Tolú', wiki: 'Tolu balsam' },
  benjui: { name: 'Benjuí', wiki: 'Benzoin resin' },
  bergamota: { name: 'Bergamota', wiki: 'Bergamot orange', alias: ['Bergamota de Calabria', 'Bergamota italiana'] },
  cacao: { name: 'Cacao', wiki: 'Cocoa bean', alias: ['Haba de cacao'] },
  cachemira: { name: 'Cachemira', wiki: 'Cashmere wool', alias: ['Cashmeran', 'Madera de cachemira'] },
  cafe: { name: 'Café', wiki: 'Coffee bean', alias: ['Grano de café'] },
  canela: { name: 'Canela', wiki: 'Cinnamon' },
  caramelo: { name: 'Caramelo', wiki: 'Caramel', alias: ['Toffee'] },
  cardamomo: { name: 'Cardamomo', wiki: 'Cardamom' },
  castoreo: { name: 'Castóreo', wiki: 'Castoreum' },
  cedro: { name: 'Cedro', wiki: 'Cedar wood' },
  cereza: { name: 'Cereza', wiki: 'Cherry', alias: ['Cereza negra', 'Guinda', 'Sirope de cereza'] },
  cilantro: { name: 'Cilantro', wiki: 'Coriander' },
  cipres: { name: 'Ciprés', wiki: 'Cupressus sempervirens' },
  ciruela: { name: 'Ciruela', wiki: 'Plum' },
  citricos: { name: 'Cítricos', wiki: 'Citrus' },
  civeta: { name: 'Civeta', wiki: 'Civet' },
  clavel: { name: 'Clavel', wiki: 'Dianthus caryophyllus' },
  clavo: { name: 'Clavo', wiki: 'Clove' },
  coco: { name: 'Coco', wiki: 'Coconut' },
  comino: { name: 'Comino', wiki: 'Cumin' },
  conac: { name: 'Coñac', wiki: 'Cognac' },
  cuero: { name: 'Cuero', wiki: 'Leather', alias: ['Ante', 'Cuero ahumado'] },
  curcuma: { name: 'Cúrcuma', wiki: 'Turmeric' },
  cypriol: { name: 'Cypriol', wiki: 'Cyperus scariosus' },
  davana: { name: 'Davana', wiki: 'Artemisia pallens' },
  ebano: { name: 'Ébano', wiki: 'Ebony' },
  elemi: { name: 'Elemí', wiki: 'Elemi' },
  enebro: { name: 'Enebro', wiki: 'Juniper berry', alias: ['Baya de enebro', 'Bayas de enebro'] },
  especias: { name: 'Especias', wiki: 'Spice' },
  estoraque: { name: 'Estoraque', wiki: 'Storax balsam' },
  eucalipto: { name: 'Eucalipto', wiki: 'Eucalyptus' },
  fenogreco: { name: 'Fenogreco', wiki: 'Fenugreek' },
  'flor-de-manzano': { name: 'Flor de manzano', wiki: 'Apple blossom' },
  'flor-de-tabaco': { name: 'Flor de tabaco', wiki: 'Nicotiana alata' },
  flores: { name: 'Flores', wiki: 'Flower', alias: ['Notas florales'] },
  'flores-blancas': { name: 'Flores blancas', wiki: 'Philadelphus coronarius' },
  frambuesa: { name: 'Frambuesa', wiki: 'Raspberry' },
  frutas: { name: 'Frutas', wiki: 'Fruit', alias: ['Frutas mediterráneas', 'Notas afrutadas'] },
  'frutos-rojos': { name: 'Frutos rojos', wiki: 'Berry' },
  galbano: { name: 'Gálbano', wiki: 'Galbanum' },
  gardenia: { name: 'Gardenia', wiki: 'Gardenia jasminoides' },
  geranio: { name: 'Geranio', wiki: 'Pelargonium graveolens' },
  'grosella-negra': { name: 'Grosella negra', wiki: 'Blackcurrant' },
  guayaco: { name: 'Guayaco', wiki: 'Guaiacum officinale', alias: ['Madera de guayaco'] },
  'haba-tonka': { name: 'Haba tonka', wiki: 'Tonka bean', alias: ['Cumarina', 'Haba tonka tostada'] },
  heliotropo: { name: 'Heliotropo', wiki: 'Heliotropium arborescens', alias: ['Heliotropina'] },
  heno: { name: 'Heno', wiki: 'Hay' },
  hiedra: { name: 'Hiedra', wiki: 'Hedera helix', alias: ['Hojas de hiedra'] },
  'hoja-de-violeta': { name: 'Hoja de violeta', wiki: 'Viola odorata', alias: ['Hojas de violeta'] },
  'hojas-verdes': { name: 'Hojas verdes', wiki: 'Leaf', alias: ['Notas verdes'] },
  incienso: { name: 'Incienso', wiki: 'Frankincense', alias: ['Olíbano'] },
  iris: { name: 'Iris', wiki: 'Iris pallida', alias: ['Iris de Florencia', 'Iris de la Toscana'] },
  jacinto: { name: 'Jacinto', wiki: 'Hyacinthus orientalis' },
  jara: { name: 'Jara', wiki: 'Cistus ladanifer', alias: ['Ládano'] },
  jazmin: { name: 'Jazmín', wiki: 'Jasminum grandiflorum', alias: ['Absoluto de jazmín', 'Jazmín de Egipto'] },
  'jazmin-sambac': { name: 'Jazmín sambac', wiki: 'Jasminum sambac' },
  jengibre: { name: 'Jengibre', wiki: 'Ginger' },
  lavanda: { name: 'Lavanda', wiki: 'Lavandula angustifolia', alias: ['Absoluto de lavanda', 'Lavandín'] },
  leche: { name: 'Leche', wiki: 'Milk', alias: ['Mousse de leche', 'Notas lácteas'] },
  lentisco: { name: 'Lentisco', wiki: 'Pistacia lentiscus' },
  lichi: { name: 'Lichi', wiki: 'Lychee' },
  lila: { name: 'Lila', wiki: 'Syringa vulgaris' },
  lima: { name: 'Lima', wiki: 'Lime (fruit)' },
  limon: { name: 'Limón', wiki: 'Lemon', alias: ['Limón de Amalfi', 'Limón de Calabria', 'Limón de Sicilia', 'Piel de limón'] },
  'lirio-de-los-valles': { name: 'Lirio de los valles', wiki: 'Lily of the valley' },
  loto: { name: 'Loto', wiki: 'Nelumbo nucifera', alias: ['Flor de loto'] },
  'madera-ahumada': { name: 'Madera ahumada', wiki: 'Smoke' },
  'madera-flotante': { name: 'Madera flotante', wiki: 'Driftwood' },
  maderas: { name: 'Maderas', wiki: 'Wood', alias: ['Georgywood', 'Madera ambarada', 'Maderas oscuras', 'Maderas rubias', 'Maderas secas', 'Notas amaderadas'] },
  magnolia: { name: 'Magnolia', wiki: 'Magnolia grandiflora', alias: ['Magnolia blanca'] },
  mandarina: { name: 'Mandarina', wiki: 'Mandarin orange', alias: ['Mandarina de Brasil'] },
  mango: { name: 'Mango', wiki: 'Mango' },
  mantequilla: { name: 'Mantequilla', wiki: 'Buttercream', alias: ['Crema de mantequilla'] },
  manzana: { name: 'Manzana', wiki: 'Apple' },
  'manzana-verde': { name: 'Manzana verde', wiki: 'Granny Smith' },
  melocoton: { name: 'Melocotón', wiki: 'Peach', alias: ['Melocotón blanco'] },
  melon: { name: 'Melón', wiki: 'Melon' },
  menta: { name: 'Menta', wiki: 'Mentha', alias: ['Hierbabuena', 'Menta piperita'] },
  miel: { name: 'Miel', wiki: 'Honey' },
  mirra: { name: 'Mirra', wiki: 'Myrrh' },
  mirto: { name: 'Mirto', wiki: 'Myrtus communis' },
  'musgo-de-roble': { name: 'Musgo de roble', wiki: 'Evernia prunastri', alias: ['Musgo'] },
  naranja: { name: 'Naranja', wiki: 'Orange (fruit)', alias: ['Naranja de Brasil', 'Naranja de Sicilia', 'Naranja dulce'] },
  'naranja-amarga': { name: 'Naranja amarga', wiki: 'Bitter orange' },
  'naranja-sanguina': { name: 'Naranja sanguina', wiki: 'Blood orange' },
  nardo: { name: 'Nardo', wiki: 'Polianthes tuberosa' },
  neroli: { name: 'Neroli', wiki: 'Neroli', alias: ['Neroli de Túnez'] },
  'notas-marinas': { name: 'Notas marinas', wiki: 'Wind wave', alias: ['Acorde ozónico'] },
  'nuez-moscada': { name: 'Nuez moscada', wiki: 'Nutmeg', alias: ['Macis'] },
  opoponaco: { name: 'Opopónaco', wiki: 'Opopanax' },
  oregano: { name: 'Orégano', wiki: 'Oregano' },
  osmanto: { name: 'Osmanto', wiki: 'Osmanthus fragrans' },
  oud: { name: 'Oud', wiki: 'Agarwood', alias: ['Humo de oud', 'Oud de Laos'] },
  pachuli: { name: 'Pachulí', wiki: 'Patchouli', alias: ['Akigalawood', 'Hojas de pachulí'] },
  'palo-de-rosa': { name: 'Palo de rosa', wiki: 'Aniba rosodora' },
  'palo-santo': { name: 'Palo santo', wiki: 'Bursera graveolens' },
  peonia: { name: 'Peonía', wiki: 'Paeonia lactiflora' },
  pera: { name: 'Pera', wiki: 'Pear' },
  petitgrain: { name: 'Petitgrain', wiki: 'Petitgrain', alias: ['Hojas de naranjo amargo', 'Petitgrain de Paraguay'] },
  'pimienta-blanca': { name: 'Pimienta blanca', wiki: 'White pepper' },
  'pimienta-de-jamaica': { name: 'Pimienta de Jamaica', wiki: 'Allspice' },
  'pimienta-de-sichuan': { name: 'Pimienta de Sichuan', wiki: 'Sichuan pepper', alias: ['Pimienta timur'] },
  'pimienta-negra': { name: 'Pimienta negra', wiki: 'Black pepper', alias: ['Pimienta'] },
  'pimienta-rosa': { name: 'Pimienta rosa', wiki: 'Pink peppercorn', alias: ['Bayas de pimienta roja'] },
  pina: { name: 'Piña', wiki: 'Pineapple' },
  pino: { name: 'Pino', wiki: 'Pine', alias: ['Pino mediterráneo'] },
  pistacho: { name: 'Pistacho', wiki: 'Pistachio' },
  polvora: { name: 'Pólvora', wiki: 'Gunpowder' },
  pomelo: { name: 'Pomelo', wiki: 'Grapefruit' },
  praline: { name: 'Praliné', wiki: 'Praline (nut confection)' },
  regaliz: { name: 'Regaliz', wiki: 'Liquorice' },
  roble: { name: 'Roble', wiki: 'Oak' },
  romero: { name: 'Romero', wiki: 'Rosemary' },
  ron: { name: 'Ron', wiki: 'Rum' },
  rosa: { name: 'Rosa', wiki: 'Rose', alias: ['Agua de rosas', 'Esencia de rosa', 'Pétalos de rosa', 'Rosa de Bulgaria', 'Rosa turca'] },
  'rosa-centifolia': { name: 'Rosa centifolia', wiki: 'Rosa × centifolia', alias: ['Rosa de mayo'] },
  'rosa-damascena': { name: 'Rosa damascena', wiki: 'Rosa × damascena' },
  ruibarbo: { name: 'Ruibarbo', wiki: 'Rhubarb', alias: ['Hojas de ruibarbo'] },
  salvia: { name: 'Salvia', wiki: 'Salvia sclarea', alias: ['Salvia esclarea'] },
  sandalo: { name: 'Sándalo', wiki: 'Sandalwood', alias: ['Sándalo blanco', 'Sándalo de Mysore'] },
  shiso: { name: 'Shiso', wiki: 'Perilla frutescens var. crispa' },
  tabaco: { name: 'Tabaco', wiki: 'Tobacco', alias: ['Hoja de tabaco', 'Hojas de tabaco', 'Tabaco rubio'] },
  te: { name: 'Té', wiki: 'Tea', alias: ['Té de jazmín'] },
  teca: { name: 'Teca', wiki: 'Teak' },
  tomillo: { name: 'Tomillo', wiki: 'Thyme' },
  trufa: { name: 'Trufa negra', wiki: 'Tuber melanosporum' },
  vainilla: { name: 'Vainilla', wiki: 'Vanilla', alias: ['Vainilla Bourbon', 'Vainilla de Madagascar'] },
  vetiver: { name: 'Vetiver', wiki: 'Chrysopogon zizanioides', alias: ['Vetiver de Haití'] },
  violeta: { name: 'Violeta', wiki: 'Viola odorata' },
  'ylang-ylang': { name: 'Ylang-ylang', wiki: 'Cananga odorata' },
  zanahoria: { name: 'Zanahoria', wiki: 'Carrot', alias: ['Semilla de zanahoria'] }
};
export const FASES = [['salida', 'Salida'], ['corazon', 'Corazón'], ['fondo', 'Fondo']];

const norm = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const CLAVES = new Map(Object.entries(NOTAS).flatMap(([k, n]) => [n.name, ...(n.alias || [])].map((x) => [norm(x), k])));

/** Clave de imagen de una nota tal como aparece en una ficha, o null */
export const notaKey = (texto) => CLAVES.get(norm(texto)) || null;
/** Clave de la nota solo si ya tiene foto descargada */
export const notaFoto = (texto) => { const k = notaKey(texto); return k && NOTAS_FOTOS[k] ? k : null; };

/** Grupos de notas de una fragancia: [[título, [notas]], …] (vacío si la casa las guarda en secreto) */
export const gruposDeNotas = (n) => (n.clave ? [['Notas clave', n.clave]] : FASES.filter(([k]) => n[k]).map(([k, t]) => [t, n[k]]));
/** Todas las notas seguidas, sin repetir */
export const notasPlanas = (n) => [...new Set(gruposDeNotas(n).flatMap(([, x]) => x))];
