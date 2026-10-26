# El catálogo de la web

Todas las fragancias están en una hoja de cálculo: [`catalogo/fragancias.csv`](../catalogo/fragancias.csv). Una fila por fragancia. La web se monta sola a partir de esa hoja: cada fragancia que se publica tiene su página, sale en el catálogo de `/comprar/`, en la página de su casa y en el mapa del sitio para Google.

Hoy la hoja tiene 141 fragancias de las 8 casas y la web publica 40, las cinco más conocidas de cada casa.

## Para la tienda: cómo rellenar la hoja

Se abre con Excel, Numbers o Google Sheets (en Google Sheets: *Archivo → Importar → Subir*, separador «punto y coma»). Al terminar se guarda otra vez como CSV, con el mismo nombre.

| Columna | Qué poner | Ejemplo |
|---|---|---|
| **id** | Se deja como está. Es la dirección de la ficha (`/fragancias/creed-aventus/`) y el nombre de sus fotos. En una fila nueva se deja vacío y la web lo crea | `creed-aventus` |
| **casa** | El nombre de la casa, como sale en la web | `Parfums de Marly` |
| **nombre** | El nombre de la fragancia | `Layton` |
| **concentracion** | EDT, EDP, Extrait o Parfum (también vale escrito entero: «Eau de Parfum») | `EDP` |
| **año** | Año de lanzamiento. Vacío si no se sabe seguro | `2016` |
| **familia** | Frescas y afrutadas, Florales, Amaderadas o Ámbar y especiadas (basta la primera palabra) | `Ámbar` |
| **tamaños y precios** | Cada tamaño con su precio, separados por `/`. El primero es el que se añade a la cesta por defecto | `75 ml = 245 € / 125 ml = 325 €` |
| **descripcion** | Una o dos frases que la presenten | `Manzana, lavanda y vainilla…` |
| **destacada** | `sí` para que salga en la selección de la portada (se ven las 8 primeras) | `sí` |
| **publicar** | `sí` para que salga en la web, `no` para guardarla sin publicar | `sí` |

- **El orden de las filas es el orden de la web**: en el catálogo con «Destacadas» y en la página de cada casa.
- **Para quitar una fragancia de la web** basta con poner `no` en «publicar». No hace falta borrar la fila.
- **Para añadir una** se añade una fila con el id vacío. La primera vez la web crea el id a partir de la casa y el nombre (Layton de Parfums de Marly → `pdm-layton`) y lo apunta en el informe; conviene copiarlo a la hoja para que la dirección no cambie si luego se corrige el nombre.
- **Una casa nueva** no se puede añadir desde la hoja: necesita su texto y su foto en la web. Pídela a quien mantiene la web.
- **Los precios** de la hoja son de demostración hasta que el negocio dé los reales. Con los precios reales se cambian aquí, sin tocar nada más.

## Qué hace falta para que una fragancia salga en la web

Marcarla con `sí` en «publicar» no basta: solo sale en la web si además tiene

1. **foto de calidad**: las fotos originales de su casa en alta resolución, o una foto propia hecha en la tienda ([FOTOS.md](FOTOS.md));
2. **las notas oficiales** de su casa (salida, corazón y fondo);
3. **descripción**.

Así la web nunca enseña una ficha a medias. Las que están marcadas y aún no cumplen esto quedan en espera, y el informe (`scripts/catalogo-informe.txt`) dice qué le falta a cada una.

## Para quien mantiene la web

```bash
npm run catalogo               # comprueba la hoja y la pasa a src/data/fragancias.js
npm run catalogo -- --comprobar  # solo la comprueba
```

No hace falta lanzarlo a mano: se ejecuta solo antes de `npm run dev` y de `npm run build`, y con `npm run dev` en marcha basta con guardar la hoja para ver el cambio. Si una fila está mal (una casa o una familia que no existe, un precio que no se entiende, un id repetido…), dice la fila y el problema y no cambia nada, así que la web nunca se publica con la hoja rota.

Para ampliar lo publicado:

1. El negocio marca `sí` en «publicar» en las que quiera.
2. `npm run originales` descarga las fotos originales de todas las marcadas (o `npm run originales -- <casa o id>`), y se revisan como dice [FOTOS.md](FOTOS.md). Si son fotos propias, `npm run fotos -- --carpeta <carpeta>`.
3. Las notas oficiales de las que no las tengan se añaden en `src/data/notas-oficiales.js`.
4. `npm run catalogo` y el informe dice cuántas salen ya y qué le falta al resto.

El catálogo de `/comprar/` está pensado para cientos de fragancias: enseña 24 y un botón «Ver más» (todas están en el HTML para Google y se ven sin JavaScript), y se filtra por casa, familia y precio, con el número de resultados junto a cada opción. Los tramos de precio están en `PRECIOS` (`src/data/catalogo.js`) y conviene ajustarlos con los precios reales. El JavaScript del navegador solo lleva lo imprescindible de las fragancias publicadas (`virtual:tienda` en `vite.config.js`), así que no crece con las notas ni con los textos del catálogo.
