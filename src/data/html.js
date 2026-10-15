/* ==========================================================================
   Marcado de casas y selección, generado desde SITE al servir o compilar.
   vite.config.js sustituye los marcadores <!-- build:… --> de index.html,
   así el contenido está en el HTML (buscadores, carga sin JavaScript) y
   los módulos de src/js solo le añaden comportamiento.
   Como schema.js, no debe usar nada del navegador (window, document…).
   Las rutas de imagen empiezan por / y Vite les añade la base del despliegue.
   ========================================================================== */

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Franja de casas bajo la portada */
function brandline(site) {
  return site.casas.map((c) => `<li><a href="#casas" data-brand-jump="${c.id}">${esc(c.name)}</a></li>`).join('');
}

/** Pestañas de las casas. La primera queda seleccionada */
function casasTabs(site) {
  return site.casas.map((c, i) => `
            <li role="presentation"><button class="casa" type="button" role="tab" id="tab-${c.id}" data-brand="${c.id}" aria-selected="${i === 0}" aria-controls="casa-${c.id}" tabindex="${i === 0 ? 0 : -1}">
              <span class="casa__name">${esc(c.name)}</span><span class="casa__city">${esc(c.city)}</span>
            </button></li>`).join('');
}

/** Imagen de la primera casa (las demás las carga casas.js al cambiar de pestaña) */
function casasImg(site) {
  const c = site.casas[0];
  return `<img src="/img/casas/${c.img}-1000.webp" srcset="/img/casas/${c.img}-560.webp 560w, /img/casas/${c.img}-1000.webp 1000w" sizes="(min-width: 960px) 45vw, 100vw" width="1000" height="1250" loading="lazy" alt="${esc(c.alt)}" data-casa="${c.id}">`;
}

/** Un panel por casa: origen, descripción y fragancias emblemáticas */
function casasPanels(site) {
  return site.casas.map((c, i) => {
    const has = site.seleccion.some((p) => p.casa === c.id);
    return `
              <div class="casas__caption" role="tabpanel" id="casa-${c.id}" aria-labelledby="tab-${c.id}"${i === 0 ? '' : ' hidden'}>
                <p class="casas__origin">${esc(c.city)}</p>
                <p class="casas__desc">${esc(c.desc)}</p>
                <p class="casas__icons">Emblemáticas: ${c.icons.map(esc).join(', ')}.${has ? ` <a class="link" href="#seleccion" data-filter-link="${c.id}">Ver en la selección</a>` : ''}</p>
              </div>`;
  }).join('');
}

/** Fichas de la selección y la tarjeta final «Y muchas más…» */
function products(site) {
  const casa = (id) => site.casas.find((c) => c.id === id);
  const familia = (id) => site.familias.find((f) => f.id === id).name;
  const items = site.seleccion.map((p, i) => {
    const c = casa(p.casa);
    const media = p.editorial
      ? `<figure class="product__media product__media--editorial"><img src="/${p.editorial}" width="560" height="700" loading="lazy" alt="${esc(`${c.name} ${p.name}`)}, imagen de campaña"></figure>`
      : `<figure class="product__media"><img src="/img/productos/${p.img}-400.webp" srcset="/img/productos/${p.img}-400.webp 400w, /img/productos/${p.img}-800.webp 800w" sizes="(min-width: 1100px) 22vw, (min-width: 760px) 30vw, 46vw" width="800" height="1000" loading="lazy" alt="Frasco de ${esc(`${c.name} ${p.name}`)}"></figure>`;
    return `
          <li class="product" data-id="${p.id}" data-familia="${p.familia}" data-casa="${p.casa}" data-reveal="up" data-reveal-delay="${(i % 4) * 90}">
            ${media}
            <div class="product__body">
              <p class="product__brand">${esc(c.name)}</p>
              <h3 class="product__name" id="name-${p.id}">${esc(p.name)}</h3>
              <p class="product__notes">${esc(p.notes)}</p>
              <p class="product__family">${esc(familia(p.familia))}</p>
              <button class="product__try" type="button" data-pick="${p.id}" aria-pressed="false" aria-describedby="name-${p.id}">Guardar en mi lista</button>
            </div>
          </li>`;
  }).join('');
  return items + `
          <li class="product product--more" data-always data-reveal="up" data-reveal-delay="${(site.seleccion.length % 4) * 90}">
            <div class="product__media"><p>Y muchas más casas y fragancias en tienda.</p><a class="link" href="#contacto">Pregúntanos por la tuya</a></div>
          </li>`;
}

const BLOCKS = { brandline, 'casas-tabs': casasTabs, 'casas-img': casasImg, 'casas-panels': casasPanels, products };

/** Sustituye cada <!-- build:nombre --> por su bloque. Falla si falta alguno */
export function renderBlocks(html, site) {
  for (const [name, fn] of Object.entries(BLOCKS)) {
    const mark = `<!-- build:${name} -->`;
    if (!html.includes(mark)) throw new Error(`index.html: falta el marcador ${mark}`);
    html = html.replace(mark, () => fn(site));
  }
  return html;
}
