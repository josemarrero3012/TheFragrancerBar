/* Datos estructurados LocalBusiness (schema.org).
   Se generan al compilar desde SITE y se insertan en el <head> de index.html
   (ver vite.config.js), así los buscadores los leen sin ejecutar JavaScript. */

const DAYS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function localBusinessSchema(site) {
  const c = site.contact;
  return {
    '@context': 'https://schema.org', '@type': 'Store',
    name: `${site.brand} Triana`, description: 'Perfumería nicho en Triana, Las Palmas de Gran Canaria.',
    url: `${site.url}/`, image: `${site.url}/og-tienda.jpg`,
    telephone: c.phone, email: c.email, priceRange: '€€€',
    address: { '@type': 'PostalAddress', streetAddress: c.street, postalCode: c.postalCode, addressLocality: c.city, addressRegion: c.region, addressCountry: 'ES' },
    geo: { '@type': 'GeoCoordinates', latitude: c.geo.lat, longitude: c.geo.lng },
    openingHoursSpecification: site.hours
      .map((h, d) => h && { '@type': 'OpeningHoursSpecification', dayOfWeek: DAYS_EN[d], opens: h[0], closes: h[1] })
      .filter(Boolean)
  };
}
