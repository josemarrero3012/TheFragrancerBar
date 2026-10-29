import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

/** Los informes son resultados locales; los datos de la web siguen versionados. */
export function reportPath(name) {
  const directory = resolve(import.meta.dirname, '../../reports');
  mkdirSync(directory, { recursive: true });
  return resolve(directory, name);
}
