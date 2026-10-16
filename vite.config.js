import { existsSync, readFileSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import { SITE } from './src/data/site.js';
import { pages } from './src/templates/pages.js';

// La variable de entorno SITE_URL sustituye a SITE.url (p. ej. al publicar en GitHub Pages)
const SITE_URL = (process.env.SITE_URL || SITE.url).replace(/\/$/, '');
const ROOT = import.meta.dirname;

/* Web de varias páginas generadas desde src/data (contenido) y src/templates (marcado):
   - En desarrollo, cada petición se genera al vuelo (cambiar una plantilla recarga el navegador)
   - Al compilar, cada página es una entrada HTML virtual: Vite procesa sus recursos sin que
     existan archivos .html en el proyecto
   - robots.txt y sitemap.xml (con lastmod) al compilar */
function sitePages() {
  const PAGES = pages(SITE_URL);
  const toFile = (id) => (id.startsWith(ROOT) ? id.slice(ROOT.length + 1) : id.replace(/^\//, ''));
  // Ruta pedida → archivo de página: /casas/creed/ y /casas/creed → casas/creed/index.html
  const fileFor = (pathname) => {
    const p = decodeURIComponent(pathname).replace(/^\//, '');
    if (p === '' || p.endsWith('/')) return `${p}index.html`;
    return p.endsWith('.html') ? p : `${p}/index.html`;
  };

  return {
    name: 'tfb-pages',

    configureServer(server) {
      const reload = (f) => { if (/src[\\/](templates|data)[\\/]/.test(f)) server.ws.send({ type: 'full-reload' }); };
      server.watcher.on('change', reload);
      server.middlewares.use(async (req, res, next) => {
        const { pathname } = new URL(req.url, 'http://x');
        const base = server.config.base;
        if (!pathname.startsWith(base)) return next();
        const rel = `/${pathname.slice(base.length)}`;
        // Recursos (imágenes, módulos, /@vite…): los sirve Vite
        if (/\.(?!html$)[a-z0-9]+$/i.test(rel) || rel.startsWith('/@') || rel.startsWith('/src/') || rel.startsWith('/node_modules/')) return next();
        try {
          // Se recargan las plantillas en cada petición para ver los cambios sin reiniciar
          const mod = await server.ssrLoadModule('/src/templates/pages.js');
          const all = mod.pages(SITE_URL);
          let file = fileFor(rel), status = 200;
          if (!all[file]) { file = '404.html'; status = 404; }
          const html = await server.transformIndexHtml(req.url, all[file]);
          res.statusCode = status;
          res.setHeader('Content-Type', 'text/html; charset=utf-8');
          res.end(html);
        } catch (e) { next(e); }
      });
    },

    // En `npm run preview`, como en el alojamiento: lo que no existe muestra 404.html
    configurePreviewServer(server) {
      const dist = resolve(server.config.root, server.config.build.outDir);
      return () => server.middlewares.use((req, res, next) => {
        const p = decodeURIComponent(new URL(req.url, 'http://x').pathname).slice(server.config.base.length - 1);
        const file = resolve(dist, `.${p}`);
        if (existsSync(file) && (statSync(file).isFile() || existsSync(resolve(file, 'index.html')))) return next();
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.end(readFileSync(resolve(dist, '404.html')));
      });
    },

    // Entradas HTML virtuales para la compilación
    config() {
      return { build: { rolldownOptions: { input: Object.keys(PAGES).map((f) => resolve(ROOT, f)) } } };
    },
    resolveId(id) { const f = toFile(id); if (PAGES[f]) return resolve(ROOT, f); },
    load(id) { const f = toFile(id); if (PAGES[f]) return PAGES[f]; },

    generateBundle() {
      const today = new Date().toISOString().slice(0, 10);
      const urls = Object.keys(PAGES).filter((f) => f !== '404.html' && f !== 'cesta/index.html').map((f) => f.replace(/index\.html$/, ''));
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: `User-agent: *\nAllow: /\nDisallow: /cesta/\n\nSitemap: ${SITE_URL}/sitemap.xml\n` });
      this.emitFile({
        type: 'asset', fileName: 'sitemap.xml',
        source: '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
          urls.map((p) => `  <url><loc>${SITE_URL}/${p}</loc><lastmod>${today}</lastmod></url>`).join('\n') + '\n</urlset>\n'
      });
    }
  };
}

export default defineConfig({
  // Para publicar en una subcarpeta (p. ej. GitHub Pages): npm run build -- --base=/nombre-repo/
  base: '/',
  // Web de varias páginas: las rutas que no existen devuelven 404 (no la portada)
  appType: 'mpa',
  plugins: [sitePages()],
  server: { port: 8765, open: false },
  preview: { port: 8765 }
});
