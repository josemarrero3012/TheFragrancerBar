# Mantenimiento del prototipo

Usa Node.js 22 (`.nvmrc`) e instala con `npm ci`. Mantén los cambios enfocados y abre una rama `codex/<descripcion>` o `feature/<descripcion>` para cada trabajo.

## Cambios y comprobaciones

1. Edita el CSV para cambiar el catálogo; no modifiques `src/data/fragancias.js` a mano.
2. Conserva en Git las imágenes publicadas, sus atribuciones y los registros de origen necesarios. Los informes regenerables van en `reports/`.
3. Ejecuta `npm run check`, `npm run build` y `npm run check:dist`.
4. Revisa en el navegador la portada, el catálogo, una ficha, la cesta y las tiendas en escritorio y móvil cuando el cambio afecte a la interfaz.
5. Describe el cambio y su validación en la pull request. Publicar en `main` actualiza la presentación del negocio.

## Commits

Formato: `tipo(alcance): descripción breve en español`.

- `feat(catalogo): añadir filtro por concentración`
- `fix(cesta): conservar el tamaño seleccionado`
- `style(portada): ajustar el espaciado en móvil`
- `docs(readme): actualizar el alcance del prototipo`
- `chore(deps): actualizar herramientas de desarrollo`
- `ci(pages): comprobar enlaces antes de publicar`

Usa `refactor` cuando cambie la organización del código y `test` para verificaciones. No reescribas commits publicados solo para cambiar su apariencia: conserva autoría, firmas y referencias de las pull requests.

## Contenido público

No subas credenciales, datos de clientes, pedidos reales, contratos, presupuestos ni conversaciones internas. `.gitignore` evita algunos errores comunes, pero no sustituye revisar `git diff --cached`. Cualquier material interno futuro debe mantenerse en un repositorio privado.
