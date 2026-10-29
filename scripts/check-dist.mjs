import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { resolve, sep } from 'node:path';

const root = resolve(import.meta.dirname, '../dist');
const base = process.argv[2] || '/';
if (!base.startsWith('/') || !base.endsWith('/')) throw new Error('La base debe empezar y terminar con /.');
if (!existsSync(resolve(root, 'index.html'))) throw new Error('Ejecuta npm run build antes de comprobar dist.');
const errors = [];
const files = (directory) => readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
  const path = resolve(directory, entry.name);
  return entry.isDirectory() ? files(path) : [path];
});
const htmlFiles = files(root).filter((file) => file.endsWith('.html'));
const origin = 'https://preview.invalid';
for (const file of htmlFiles) {
  const relative = file.slice(root.length + 1).split(sep).join('/');
  const pageURL = new URL(base + relative, origin);
  const html = readFileSync(file, 'utf8');
  if (!/<html\b[^>]*\blang="es"/.test(html)) errors.push(`${relative}: falta lang="es"`);
  if (!/<title>[^<]+<\/title>/.test(html)) errors.push(`${relative}: falta el título`);
  if (process.env.SITE_URL && new URL(process.env.SITE_URL).hostname.endsWith('.github.io') &&
      !/<meta\s+name="robots"\s+content="[^"]*noindex/.test(html)) {
    errors.push(`${relative}: la vista previa de Pages debe llevar noindex`);
  }
  const references = [...html.matchAll(/\b(?:href|src|poster)="([^"]+)"/g)].map((match) => match[1]);
  for (const match of html.matchAll(/\bsrcset="([^"]+)"/g)) {
    references.push(...match[1].split(',').map((candidate) => candidate.trim().split(/\s+/)[0]));
  }
  for (const reference of references) {
    if (!reference || reference.startsWith('#')) continue;
    const url = new URL(reference.replaceAll('&amp;', '&'), pageURL);
    if (url.origin !== origin) continue;
    if (!url.pathname.startsWith(base)) {
      errors.push(`${relative}: enlace fuera de la base ${reference}`);
      continue;
    }
    const target = resolve(root, decodeURIComponent(url.pathname.slice(base.length)));
    if (!target.startsWith(root + sep) && target !== root) {
      errors.push(`${relative}: ruta fuera de dist ${reference}`);
    } else if (!existsSync(target) || (statSync(target).isDirectory() && !existsSync(resolve(target, 'index.html')))) {
      errors.push(`${relative}: recurso inexistente ${reference}`);
    }
  }
}
for (const file of ['404.html', 'robots.txt', 'sitemap.xml']) {
  if (!existsSync(resolve(root, file))) errors.push(`Falta ${file}`);
}
if (errors.length) throw new Error([...new Set(errors)].join('\n'));
console.log(`${htmlFiles.length} páginas verificadas: idioma, títulos, enlaces, recursos y base ${base}.`);
