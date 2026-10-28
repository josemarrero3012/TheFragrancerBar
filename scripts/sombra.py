"""Saca de una foto de sombras sobre una pared solo la sombra, como capa transparente.

La luz de la portada y de las cabeceras (src/styles/base/luz.css) lleva la sombra de una
palmera. Es una foto real, no un dibujo: «Shadow of palm fronds cast on light wall», de
Augustine Wong en Unsplash (licencia de Unsplash, uso comercial sin atribución obligatoria):
https://unsplash.com/photos/shadow-of-palm-fronds-cast-on-light-wall-T0BYurbDK_M

    curl -o palmera.jpg "https://images.unsplash.com/photo-1530177150700-84cd9a3b059b?fm=jpg&q=85&w=2400"
    python3 scripts/sombra.py palmera.jpg src/assets/luz/palmera.webp

La foto se voltea (las hojas entran por la izquierda), se desenfoca lo justo para borrar el
grano de la pared y cada píxel pasa a ser un marrón cálido cuya opacidad es lo oscura que
era la sombra: la pared iluminada queda transparente. Así vale sobre cualquier fondo claro
y la intensidad se regula en el CSS.
"""
import sys

import numpy as np
from PIL import Image, ImageFilter, ImageOps

ANCHO = 1000            # se ve desenfocada: más resolución solo pesa más
DESENFOQUE = 7          # en píxeles de la foto de 2400 px
COLOR = (92, 66, 40)    # marrón cálido: la sombra de una pared crema al sol

src, out = sys.argv[1], sys.argv[2]
im = ImageOps.mirror(Image.open(src).convert('L')).filter(ImageFilter.GaussianBlur(DESENFOQUE))
im = im.resize((ANCHO, round(im.height * ANCHO / im.width)), Image.LANCZOS)
v = np.asarray(im).astype(np.float32)
luz, sombra = np.percentile(v, 97), np.percentile(v, 3)
alfa = np.clip((luz - v) / (luz - sombra), 0, 1) ** 1.1

rgba = np.zeros((*alfa.shape, 4), np.uint8)
rgba[..., :3] = COLOR
rgba[..., 3] = (alfa * 255).round().astype(np.uint8)
Image.fromarray(rgba, 'RGBA').save(out, 'WEBP', quality=70, alpha_quality=60, method=6)
print(out, f'{rgba.shape[1]}×{rgba.shape[0]}')
