import { existsSync, readFileSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import { SITE } from './src/data/site.js';
import { localBusinessSchema } from './src/data/schema.js';

// La variable de entorno SITE_URL sustituye a SITE.url (p. ej. al publicar en GitHub Pages)
const SITE_URL = (process.env.SITE_URL || SITE.url).replace(/\/$/, '');

/* Completa la web con los datos de src/data/site.js:
   - %SITE_URL% → URL pública (canonical, Open Graph)
   - Datos estructurados schema.org en la portada
   - robots.txt y sitemap.xml al compilar */
function siteData() {
  return {
    name: 'tfb-site-data',
    // En `npm run preview`, como en el alojamiento: lo que no existe muestra 404.html
    configurePreviewServer(server) {
      const dist = resolve(server.config.root, server.config.build.outDir);
      return () => server.middlewares.use((req, res, next) => {
        const file = resolve(dist, `.${decodeURIComponent(new URL(req.url, 'http://x').pathname)}`);
        if (existsSync(file) && statSync(file).isFile()) return next();
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.end(readFileSync(resolve(dist, '404.html')));
      });
    },
    generateBundle() {
      const pages = ['', 'legal.html'];
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n` });
      this.emitFile({
        type: 'asset', fileName: 'sitemap.xml',
        source: '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
          pages.map((p) => `  <url><loc>${SITE_URL}/${p}</loc></url>`).join('\n') + '\n</urlset>\n'
      });
    },
    transformIndexHtml: {
      order: 'pre',
      handler(html, ctx) {
        html = html.replaceAll('%SITE_URL%', SITE_URL);
        if (!ctx.path.endsWith('/index.html')) return html;
        return {
          html,
          tags: [{ tag: 'script', attrs: { type: 'application/ld+json' }, children: JSON.stringify(localBusinessSchema({ ...SITE, url: SITE_URL })), injectTo: 'head' }]
        };
      }
    }
  };
}

export default defineConfig({
  // Para publicar en una subcarpeta (p. ej. GitHub Pages): npm run build -- --base=/nombre-repo/
  base: '/',
  // Web de varias páginas: las rutas que no existen devuelven 404 (no la portada)
  appType: 'mpa',
  plugins: [siteData()],
  server: { port: 8765, open: false },
  preview: { port: 8765 },
  build: {
    rolldownOptions: {
      input: {
        main: 'index.html',
        legal: 'legal.html',
        notFound: '404.html'
      }
    }
  }
});
