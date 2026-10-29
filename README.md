# Prototipo Web - The Fragrance Bar

Prototipo oficial presentado al negocio **The Fragrance Bar**, desarrollado para Aterna Studio. Una propuesta de experiencia web para la perfumería nicho, con catálogo, descubrimiento de fragancias y presentación de sus tiendas en Canarias.

**[Ver el prototipo publicado](https://josemarrero3012.github.io/TheFragrancerBar/)** · [Documentación técnica](docs/DESARROLLO.md) · [Estado y alcance](docs/ESTADO.md)

> Versión de presentación. Los precios son de demostración; el pedido no procesa pagos y los formularios no envían mensajes. La aprobación para producción, los datos definitivos y las integraciones siguen pendientes.

## Experiencia incluida

- Portada con la tienda de Triana, escaparate de campañas y selección de fragancias.
- Ocho casas de perfumería y una muestra de 40 fragancias, con fichas, tamaños y notas olfativas.
- Catálogo con búsqueda, filtros y ordenación; cesta y recorrido de compra de prueba.
- Favoritos («Tu lista»), enlaces a WhatsApp, tres tiendas y cinco guías editoriales.
- Diseño adaptable, movimiento reducido y páginas generadas como HTML estático.

La hoja de catálogo contiene 141 fragancias. Solo se muestran las marcadas para publicar que tienen descripción, fotos y notas oficiales. Las cifras cambian al actualizar el catálogo.

## Desarrollo local

Requiere **Node.js 22.12 o superior**; se recomienda la rama 22 indicada en `.nvmrc`.

```bash
npm ci
npm run dev
```

Servidor: [localhost:8765](http://localhost:8765).

```bash
npm run check      # sintaxis, catálogo y avisos de demostración
npm run build      # genera dist/
npm run check:dist # comprueba páginas, enlaces y recursos generados
npm run preview    # revisa la compilación en localhost:8765
```

## Organización

```text
.github/     Automatización y plantilla de pull requests
catalogo/    Hoja editable y registro de fotografías propias
docs/        Desarrollo, catálogo, imágenes y estado del proyecto
public/      Imágenes, vídeos e iconos que se publican sin transformar
scripts/     Herramientas de catálogo, imágenes y verificación
src/
  assets/    Recursos procesados por Vite
  data/      Contenido, configuración y atribuciones
  js/        Comportamiento del navegador
  styles/    Estilos por base, componente, sección y página
  templates/ Plantillas HTML y rutas
reports/     Informes y hojas de revisión locales; fuera de Git
dist/        Web compilada; fuera de Git
```

HTML, CSS y JavaScript con Vite; sin framework de interfaz ni backend. Los datos y las plantillas generan las páginas durante la compilación. `src/data/fragancias.js` se regenera desde el CSV antes de iniciar o compilar.

## Editar y mantener

| Necesidad | Referencia |
| --- | --- |
| Fragancias, tamaños y precios | [Guía del catálogo](docs/CATALOGO.md) |
| Fotografías y atribuciones | [Guía de imágenes](docs/FOTOS.md) |
| Tiendas, horarios y contenido | [Desarrollo](docs/DESARROLLO.md) |
| Alcance, visibilidad y paso a producción | [Estado del prototipo](docs/ESTADO.md) |
| Convención de commits y comprobaciones | [Contribución](CONTRIBUTING.md) |

Las descargas de imágenes son herramientas de mantenimiento y se ejecutan de forma explícita (`npm run originales`, `npm run fotos`, `npm run notas`). No son necesarias para instalar o compilar el proyecto con sus recursos actuales.

## Publicación

Cada cambio en `main` ejecuta las comprobaciones, compila y despliega únicamente `dist/` mediante GitHub Actions. Las pull requests verifican la compilación con la misma subcarpeta de Pages.

Se conserva el identificador `TheFragrancerBar` para mantener el enlace de presentación. La vista previa de GitHub Pages incluye `noindex`; esto orienta a los buscadores y **no restringe el acceso**.

## Uso del material

Repositorio público para revisar el prototipo. No se concede una licencia general de reutilización del código ni de los contenidos. Las marcas, fotografías, vídeos y fuentes conservan sus derechos y licencias respectivos; las atribuciones disponibles se muestran en la web y en los datos del proyecto. Antes del uso en producción deben confirmarse las autorizaciones pendientes descritas en [FOTOS.md](docs/FOTOS.md).
