import { execFileSync } from 'node:child_process';
import { readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { SITE } from '../src/data/site.js';

const root = resolve(import.meta.dirname, '..');
function sources(directory) {
  return readdirSync(resolve(root, directory), { withFileTypes: true }).flatMap((entry) => {
    const path = `${directory}/${entry.name}`;
    return entry.isDirectory() ? sources(path) : /\.(m?js)$/.test(path) ? [path] : [];
  });
}
for (const file of [...sources('src'), ...sources('scripts'), 'vite.config.js']) {
  execFileSync(process.execPath, ['--check', file], { cwd: root, stdio: 'inherit' });
}
execFileSync(process.execPath, ['scripts/catalogo.mjs', '--comprobar'], { cwd: root, stdio: 'inherit' });
if (!SITE.prototype || !SITE.demoPrices) {
  throw new Error('Esta presentación debe conservar los avisos de prototipo y precios de demostración.');
}
console.log('Sintaxis, catálogo y configuración del prototipo correctos.');
