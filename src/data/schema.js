/* Datos estructurados schema.org, generados al compilar desde SITE y el catálogo.
   Cada plantilla de página elige los suyos (ver src/templates/pages.js);
   vite.config.js los inserta en el <head>, así los buscadores los leen sin ejecutar JavaScript. */
import { CASAS, casaById } from './catalogo.js';

const DAYS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const orgId = (url) => `${url}/#organizacion`;
const storeId = (url, s) => `${url}/tiendas/${s.id}/#tienda`;

export function organization(site, url) {
  return {
    '@type': 'Organization', '@id': orgId(url),
    name: site.brand, url: `${url}/`, logo: `${url}/icon-512.png`, email: site.contact.email,
    sameAs: site.social.map((s) => s.url).filter((u) => u.startsWith('http') && !u.includes('wa.me')),
    brand: CASAS.map((c) => ({ '@type': 'Brand', name: c.name })),
    department: site.stores.map((s) => ({ '@id': storeId(url, s) }))
  };
}

export function store(site, url, s) {
  return {
    '@type': 'Store', '@id': storeId(url, s),
    name: `${site.brand} ${s.name}`, url: `${url}/tiendas/${s.id}/`,
    image: `${url}/og-tienda.jpg`, telephone: s.phone, priceRange: '€€€',
    parentOrganization: { '@id': orgId(url) },
    hasMap: s.mapsUrl,
    brand: CASAS.map((c) => ({ '@type': 'Brand', name: c.name })),
    address: { '@type': 'PostalAddress', streetAddress: s.street, postalCode: s.postalCode, addressLocality: s.city, addressRegion: s.region, addressCountry: 'ES' },
    geo: { '@type': 'GeoCoordinates', latitude: s.geo.lat, longitude: s.geo.lng },
    openingHoursSpecification: s.hours
      .map((h, d) => h && { '@type': 'OpeningHoursSpecification', dayOfWeek: DAYS_EN[d], opens: h[0], closes: h[1] })
      .filter(Boolean)
  };
}

/** Producto. Mientras los precios sean de demostración no se publica la oferta */
export function product(site, url, p) {
  const c = casaById(p.casa), prices = p.sizes.map((s) => s[1]);
  return {
    '@type': 'Product', name: `${c.name} ${p.name}`, url: `${url}/fragancias/${p.id}/`,
    description: p.desc, category: 'Perfume', brand: { '@type': 'Brand', name: c.name },
    ...(p.img && { image: `${url}/img/productos/${p.img}-800.webp` }),
    ...(!site.demoPrices && { offers: { '@type': 'AggregateOffer', priceCurrency: 'EUR', lowPrice: Math.min(...prices), highPrice: Math.max(...prices), offerCount: prices.length } })
  };
}

export const itemList = (url, items) => ({
  '@type': 'ItemList',
  itemListElement: items.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: `${url}/fragancias/${p.id}/` }))
});

export const faqPage = (site) => ({
  '@type': 'FAQPage',
  mainEntity: site.faq.map((x) => ({ '@type': 'Question', name: x.q, acceptedAnswer: { '@type': 'Answer', text: x.a } }))
});

/** Migas de pan: [['Inicio', ''], ['Casas', 'casas/'], ['Creed', 'casas/creed/']] */
export const breadcrumbs = (url, items) => ({
  '@type': 'BreadcrumbList',
  itemListElement: items.map(([name, path], i) => ({ '@type': 'ListItem', position: i + 1, name, item: `${url}/${path}` }))
});

export const graph = (nodes) => ({ '@context': 'https://schema.org', '@graph': nodes });
