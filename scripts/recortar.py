"""Recorta de nuevo los frascos de public/img/productos con BiRefNet (rembg).

Las fotos de las marcas traen sombra y restos de fondo que `npm run fotos` no
quita del todo. Este paso deja solo el frasco, sin sombra ni halo.

    python3 -m venv .venv && .venv/bin/pip install "rembg[cpu]"
    .venv/bin/python scripts/recortar.py               # todos
    .venv/bin/python scripts/recortar.py creed-aventus # solo algunos ids

La primera vez descarga el modelo (~1 GB). Tarda unos 30 s por frasco en CPU.
"""
import os
import sys

import onnxruntime as ort

# Sin la reserva de memoria de ONNX Runtime el proceso no crece en cada imagen
_SessionOptions = ort.SessionOptions


def _opciones():
    o = _SessionOptions()
    o.enable_cpu_mem_arena = False
    o.enable_mem_pattern = False
    return o


ort.SessionOptions = _opciones

from PIL import Image  # noqa: E402
from rembg import new_session, remove  # noqa: E402

DIR = os.path.join(os.path.dirname(__file__), '..', 'public', 'img', 'productos')


def recortar(sesion, pid):
    origen = os.path.join(DIR, f'{pid}-800.webp')
    im = Image.open(origen).convert('RGBA')
    # Sobre blanco, como en la web de la marca, para que el modelo vea el frasco entero
    fondo = Image.new('RGBA', im.size, (255, 255, 255, 255))
    fondo.alpha_composite(im)
    frasco = remove(fondo.convert('RGB'), session=sesion, post_process_mask=True)
    frasco.save(origen, quality=82, alpha_quality=90)
    frasco.resize((400, 500), Image.LANCZOS).save(os.path.join(DIR, f'{pid}-400.webp'), quality=80, alpha_quality=90)


if __name__ == '__main__':
    ids = sys.argv[1:] or sorted(f[:-9] for f in os.listdir(DIR) if f.endswith('-800.webp'))
    sesion = new_session('birefnet-general')
    for pid in ids:
        recortar(sesion, pid)
        print(pid, flush=True)
