/* ==========================================================================
   Lo que comparten `npm run fotos` y `npm run originales` para encontrar una
   fragancia en la web oficial de su casa: descargas, el catálogo de las tiendas
   Shopify y la elección del producto por su nombre (scripts/fotos-fuentes.js).
   ========================================================================== */

export const UA = { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36' };

// Productos de Shopify que no son el frasco de perfume (sets, muestras, cuerpo, pelo, minis…)
export const NO_PERFUME = /\b(set|kit|coffret|duo|trio|sample|samples|discovery|calendar|candle|body|hair|lotion|cream|gel|hand|cleansing|cleaning|shower|soap|deo|deodorant|refill|travel|mini|gift|wrapping|bag|postcard|oil|mist)\b|\b(1\.5|2|3|5|7\.5|8|10|12|15|20)\s?ml\b/i;
export const CONC_WORDS = /\b(eau de parfum|eau de toilette|extrait de parfum|extrait|parfum|edp|edt)\b/g;

export const norm = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, ' ').trim();
export const get = async (url, as = 'text', headers = {}) => {
  const res = await fetch(url, { headers: { ...UA, ...headers }, redirect: 'follow' });
  if (!res.ok) throw new Error(`${res.status} en ${url}`);
  return as === 'buffer' ? Buffer.from(await res.arrayBuffer()) : as === 'json' ? res.json() : res.text();
};
export const ogImage = (html, base) => {
  const m = html.match(/<meta[^>]+property=["']og:image(?::secure_url)?["'][^>]+content=["']([^"']+)["']/i)
    || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
  return m && new URL(m[1].replace(/&amp;/g, '&'), base).href;
};
export const isImage = (url) => /\.(png|jpe?g|webp|avif)(\?|$)/i.test(url);
// La página tiene que nombrar el perfume (og:title o <title>), para no coger otro producto
export const nombra = (html, p) => {
  const t = norm((html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)/i) || html.match(/<title>([^<]+)/i) || [])[1] || '');
  return norm(p.name).split(' ').every((w) => t.includes(w));
};

/* Catálogo completo de cada tienda Shopify (se pide una vez por casa) */
const shopify = new Map();
export async function shopifyProducts(base) {
  if (!shopify.has(base)) {
    shopify.set(base, (async () => {
      const all = [];
      for (let page = 1; page <= 20; page++) {
        const { products } = await get(`${base}/products.json?limit=250&page=${page}`, 'json');
        all.push(...products);
        if (products.length < 250) break;
      }
      return all;
    })());
  }
  return shopify.get(base);
}

/* Elige el producto de Shopify: título igual al nombre y, entre varios, el que parece el frasco grande */
export function eligeShopify(products, p) {
  const want = norm(p.name);
  const puntos = (x) => {
    const h = x.handle.replace(/-/g, ' ');
    if ([x.title, x.product_type || '', h].some((t) => NO_PERFUME.test(t))) return -1;
    const titulo = norm(x.title), sinConc = titulo.replace(CONC_WORDS, '').replace(/\s+/g, ' ').trim();
    if (titulo !== want && sinConc !== want) return -1;
    let n = 1;
    if (/eau de parfum/.test(h) && p.conc === 'EDP') n += 2;
    if (/(^| )parfum$/.test(h) && !/eau de parfum/.test(h) && p.conc === 'EDP') n -= 0.5;
    if (/\b30\s?ml\b/.test(h)) n -= 0.5;
    return n;
  };
  return products.filter((x) => x.images?.length).map((x) => [puntos(x), x]).filter(([n]) => n > 0).sort((a, b) => b[0] - a[0])[0]?.[1];
}

/* Páginas de producto de un listado (para casas sin Shopify ni búsqueda, como Creed) */
const listados = new Map();
export async function enlacesDe(casa) {
  if (!listados.has(casa.listado)) {
    listados.set(casa.listado, (async () => {
      const links = new Set();
      for (const url of casa.listado) for (const m of (await get(url)).matchAll(new RegExp(casa.enlace, 'g'))) links.add(new URL(m[0], url).href.split('?')[0]);
      return [...links];
    })());
  }
  return listados.get(casa.listado);
}
