/* ==========================================================================
   Esqueleto común de todas las páginas: <head>, cabecera, menú, pie,
   barra de contacto móvil y cesta lateral.
   ========================================================================== */
import { SITE, NAV, mainStore } from '../data/site.js';
import { esc, u, ICON, NEW_TAB, LOGO, storeUrl, telHref } from './ui.js';

const logo = (cls = '', label = 'The Fragrance Bar, inicio') => `
      <a class="logo${cls}" href="${u()}" aria-label="${label}">
        ${LOGO}
      </a>`;

const badge = (attr, label) => `<span class="badge" ${attr} hidden><span data-n>0</span><span class="visually-hidden"> ${label}</span></span>`;
const whatsappHref = (text = SITE.contact.whatsappText) => `https://wa.me/${SITE.contact.whatsapp}?text=${encodeURIComponent(text)}`;
export { whatsappHref };

function header(section) {
  const links = NAV.map((n) => `<a href="${u(n.path)}"${n.id === section ? ' aria-current="page"' : ''}>${n.label}</a>`).join('\n        ');
  return `
  <header class="header" data-header>
    <div class="header__inner wrap">${logo()}
      <nav class="nav" aria-label="Principal">
        ${links}
      </nav>
      <div class="header__actions">
        <a class="btn btn--dark btn--sm header__cta" href="${u('contacto/')}"${section === 'contacto' ? ' aria-current="page"' : ''}>Contacto${badge('data-picks-count', 'en tu lista')}</a>
        <button class="iconbtn" type="button" data-cart-open aria-haspopup="dialog" aria-label="Abrir la cesta">${ICON.bag}${badge('data-cart-count', 'productos en la cesta')}</button>
        <button class="burger" type="button" aria-expanded="false" aria-controls="menu-movil">
          <span class="burger__lines" aria-hidden="true"></span><span class="burger__label">Menú</span>${badge('data-picks-count', 'en tu lista')}
        </button>
      </div>
    </div>
  </header>

  <div class="mobile-menu" id="menu-movil" hidden>
    <nav aria-label="Menú móvil">
      ${NAV.map((n) => `<a href="${u(n.path)}"${n.id === section ? ' aria-current="page"' : ''}>${n.label}</a>`).join('\n      ')}
      <a href="${u('contacto/')}"${section === 'contacto' ? ' aria-current="page"' : ''}>Contacto${badge('data-picks-count', 'en tu lista')}</a>
    </nav>
    <p class="mobile-menu__foot">${esc(mainStore().addressShort)}</p>
  </div>`;
}

function footer() {
  const social = SITE.social.map((s) => s.url && s.url !== '#'
    ? `<li><a href="${s.url}" rel="noopener" target="_blank">${s.name}${NEW_TAB}</a></li>` : `<li>${s.name}</li>`).join('');
  return `
  <footer class="footer section--dark">
    <div class="wrap" data-reveal="up" data-stagger>
      <div class="footer__top">${logo(' logo--light', 'The Fragrance Bar, ir a la portada')}
        <form class="news" data-news novalidate>
          <label for="n-email">Novedades y nuevas casas, una vez al mes</label>
          <div class="news__row">
            <input id="n-email" name="email" type="email" placeholder="tu@correo.es" autocomplete="email" aria-describedby="n-msg n-legal">
            <button class="btn btn--light" type="submit">Suscribirme</button>
          </div>
          <p class="news__msg" id="n-msg" role="status"></p>
          <p class="news__legal" id="n-legal">Solo usaremos tu correo para enviarte el boletín. Puedes darte de baja cuando quieras. Más información en la <a href="${u('legal/#privacidad')}">política de privacidad</a>.</p>
        </form>
      </div>
      <div class="footer__cols">
        <div><p class="footer__label">Tiendas</p><ul>${SITE.stores.map((s) =>
          `<li><a href="${storeUrl(s)}">${esc(s.title)}</a><br><span class="footer__muted">${esc(s.islandName)} · <a href="${telHref(s.phone)}">${esc(s.phone)}</a></span></li>`).join('')}</ul></div>
        <div><p class="footer__label">Explorar</p><ul>${NAV.map((n) => `<li><a href="${u(n.path)}">${n.label}</a></li>`).join('')}<li><a href="${u('contacto/#preguntas')}">Preguntas frecuentes</a></li></ul></div>
        <div><p class="footer__label">Síguenos</p><ul>${social}</ul></div>
        <div><p class="footer__label">Legal</p><ul><li><a href="${u('legal/#aviso-legal')}">Aviso legal</a></li><li><a href="${u('legal/#privacidad')}">Privacidad</a></li><li><a href="${u('legal/#cookies')}">Cookies</a></li></ul></div>
      </div>
      <p class="footer__legal">© <span data-year>${new Date().getFullYear()}</span> The Fragrance Bar. Las marcas e imágenes de producto pertenecen a sus respectivas casas.</p>
    </div>
  </footer>`;
}

/* Contacto rápido en móvil: la tienda principal, o la de la página de cada tienda */
function quickbar(s = mainStore()) {
  return `
  <nav class="quickbar" aria-label="Contacto rápido">
    <a class="quickbar__btn" href="${whatsappHref()}" target="_blank" rel="noopener" aria-label="WhatsApp: escribir a The Fragrance Bar (se abre en una pestaña nueva)">${ICON.whatsapp}WhatsApp</a>
    <a class="quickbar__btn" href="${telHref(s.phone)}" aria-label="Llamar a la tienda de ${esc(s.name)}">${ICON.phone}Llamar</a>
    <a class="quickbar__btn" href="${s.mapsUrl}" target="_blank" rel="noopener" aria-label="Cómo llegar: abrir la tienda de ${esc(s.name)} en Google Maps (se abre en una pestaña nueva)">${ICON.pin}Cómo llegar</a>
  </nav>`;
}

/* Cesta lateral (un <dialog>: atrapa el foco y se cierra con Escape). La rellena src/js/cart.js */
const drawer = () => `
  <dialog class="drawer" data-drawer aria-labelledby="drawer-title">
    <div class="drawer__inner">
      <header class="drawer__head">
        <h2 class="drawer__title" id="drawer-title">Tu cesta</h2>
        <button class="iconbtn" type="button" data-drawer-close aria-label="Cerrar la cesta">${ICON.close}</button>
      </header>
      <p class="drawer__added" data-drawer-added role="status"></p>
      <ul class="cartlines cartlines--mini" data-cart-lines="mini"></ul>
      <div class="drawer__empty" data-cart-empty>
        <p>Tu cesta está vacía.</p>
        <a class="link" href="${u('comprar/')}">Ver todas las fragancias</a>
      </div>
      <footer class="drawer__foot" data-cart-full>
        <p class="drawer__total"><span>Subtotal</span><span data-cart-subtotal>0 €</span></p>
        <p class="drawer__ship" data-cart-ship></p>
        <a class="btn btn--dark btn--lg" href="${u('cesta/')}">Ver la cesta y pagar</a>
        <button class="link drawer__keep" type="button" data-drawer-close>Seguir comprando</button>
        ${SITE.demoPrices ? '<p class="demo-note demo-note--inline">Precios de demostración: ningún pedido se cobra.</p>' : ''}
      </footer>
    </div>
  </dialog>`;

/* La vista previa (GitHub Pages) no se indexa: si Google la encontrara, competiría con la web
   real del negocio por las mismas búsquedas. Con el dominio definitivo (SITE.url) sí se indexa */
const preview = (url) => /\.github\.io(\/|$)/.test(url);

/**
 * Documento completo.
 * page: { path, section, title, description, main, schema?, preload?, intro?, quickbar?, store?, ogImage?, noindex? }
 */
export function layout(page, url) {
  const canonical = `${url}/${page.path}`;
  const og = page.ogImage || `${url}/og-tienda.jpg`;
  return `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(page.title)}</title>
  <meta name="description" content="${esc(page.description)}">
  <meta name="theme-color" content="#161412">
  ${page.noindex ? '<meta name="robots" content="noindex">' : `<link rel="canonical" href="${canonical}">`}
  ${preview(url) && !page.noindex ? '<meta name="robots" content="noindex">' : ''}
  ${SITE.seo.googleVerification ? `<meta name="google-site-verification" content="${esc(SITE.seo.googleVerification)}">` : ''}

  <meta property="og:type" content="website">
  <meta property="og:url" content="${canonical}">
  <meta property="og:locale" content="es_ES">
  <meta property="og:site_name" content="The Fragrance Bar">
  <meta property="og:title" content="${esc(page.ogTitle || page.title)}">
  <meta property="og:description" content="${esc(page.description)}">
  <meta property="og:image" content="${og}">
  <meta name="twitter:card" content="summary_large_image">

  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">
  <link rel="manifest" href="/site.webmanifest">
  ${page.preload || ''}
  <!-- Transición entre páginas: la regla va en línea para que la página nueva la conozca desde el primer momento -->
  <style>@view-transition { navigation: auto; } @media (prefers-reduced-motion: reduce) { @view-transition { navigation: none; } }</style>
  <link rel="stylesheet" href="/src/styles/main.css">
  <link rel="expect" href="#contenido" blocking="render">
  <script>
    /* Animaciones: con movimiento, el contenido revelable espera a src/js/motion.js (con red de seguridad).
       En la portada, el logo de la cabecera espera a que el nombre grande del hero suba hasta él (src/js/rotulo.js) */
    ${page.rotulo ? "document.documentElement.classList.add('has-rotulo');" : ''}
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.documentElement.classList.add('has-motion'${page.intro ? ", 'is-intro'" : ''});
      ${page.intro ? "setTimeout(function () { document.documentElement.classList.remove('is-intro'); }, 3000);" : ''}
    }
  </script>
  ${page.schema ? `<script type="application/ld+json">${JSON.stringify(page.schema).replace(/</g, '\\u003c')}</script>` : ''}
  <script type="module" src="/src/main.js"></script>
</head>
<body class="page-${page.section || 'home'}">
  <a class="skip" href="#contenido">Saltar al contenido</a>
${header(page.section)}

  <main id="contenido">
${page.main}
  </main>
${footer()}
${page.quickbar === false ? '' : quickbar(page.store)}
${drawer()}
</body>
</html>
`;
}
