"""Convierte fotos reales (originals/pNN.jpg) a public/img/pNN-{400,800,1600}.{avif,webp,jpg}"""
import os
from PIL import Image

BASE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(BASE, "..", "originals")
OUT = os.path.join(BASE, "..", "public", "img")
os.makedirs(OUT, exist_ok=True)

for f in sorted(os.listdir(SRC)):
    name, ext = os.path.splitext(f)
    if ext.lower() not in (".jpg", ".jpeg", ".png", ".webp"):
        continue
    im = Image.open(os.path.join(SRC, f)).convert("RGB")
    # Recorte centrado a proporción 8:5 (evita deformar y evita saltos de diseño / CLS)
    w, h = im.size
    if w / h > 8 / 5:
        nw = int(h * 8 / 5)
        im = im.crop(((w - nw) // 2, 0, (w - nw) // 2 + nw, h))
    else:
        nh = int(w * 5 / 8)
        im = im.crop((0, (h - nh) // 2, w, (h - nh) // 2 + nh))
    for tw in (400, 800, 1600):
        r = im.resize((tw, tw * 5 // 8), Image.LANCZOS)
        r.save(os.path.join(OUT, f"{name}-{tw}.avif"), quality=50)
        r.save(os.path.join(OUT, f"{name}-{tw}.webp"), quality=76)
        r.save(os.path.join(OUT, f"{name}-{tw}.jpg"), quality=80, optimize=True, progressive=True)
    print("ok", name)