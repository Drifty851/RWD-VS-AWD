"""
Genera 12 imágenes "de producto" (ilustraciones sintéticas) en 3 anchos y 3 formatos:
  public/img/pNN-{400,800,1600}.{avif,webp,jpg}
Uso:  pip install pillow numpy && python3 scripts/generate_images.py
Son ilustraciones propias (sin copyright). Puedes reemplazarlas por fotos reales
conservando los mismos nombres de archivo.
"""
import colorsys
import os

import numpy as np
from PIL import Image, ImageDraw, ImageFont

W, H = 1600, 1000
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "public", "img")
os.makedirs(OUT, exist_ok=True)

# (id, categoría, código visible)
ITEMS = [
    ("p01", "cpu", "Q64"), ("p02", "cpu", "Q32"),
    ("p03", "gpu", "G80"), ("p04", "gpu", "G48"),
    ("p05", "ram", "D5-64"), ("p06", "ram", "D5-128"),
    ("p07", "ssd", "N8"), ("p08", "ssd", "N4"),
    ("p09", "net", "100G"), ("p10", "net", "25G"),
    ("p11", "psu", "1600"), ("p12", "psu", "800"),
]
HUE = {"cpu": 0.60, "gpu": 0.08, "ram": 0.42, "ssd": 0.75, "net": 0.52, "psu": 0.12}


def hsv(h, s, v):
    r, g, b = colorsys.hsv_to_rgb(h % 1, s, v)
    return (int(r * 255), int(g * 255), int(b * 255))


def background(hue):
    y = np.linspace(0, 1, H)[:, None, None]
    x = np.linspace(0, 1, W)[None, :, None]
    top, bot = np.array(hsv(hue, .10, .93)), np.array(hsv(hue, .22, .78))
    img = (top * (1 - y) + bot * y) * (1 - 0.10 * x)  # degradado vertical + viñeta lateral
    return Image.fromarray(img.astype("uint8"))


def fan(d, cx, cy, r, col):
    d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(28, 34, 42))
    d.ellipse([cx - r + 12, cy - r + 12, cx + r - 12, cy + r - 12], outline=(70, 80, 92), width=6)
    for k in range(9):
        a = k * 40
        d.pieslice([cx - r + 30, cy - r + 30, cx + r - 30, cy + r - 30], a, a + 22, fill=(52, 60, 72))
    d.ellipse([cx - 34, cy - 34, cx + 34, cy + 34], fill=col)


def draw_product(cat, code, hue, seed):
    img = background(hue)
    d = ImageDraw.Draw(img)
    ink, accent = (24, 32, 42), hsv(hue, .75, .85)
    cx, cy = W // 2, H // 2
    d.ellipse([cx - 560, 800, cx + 560, 900], fill=hsv(hue, .25, .66))  # sombra
    if cat == "cpu":
        d.rounded_rectangle([cx - 330, cy - 330, cx + 330, cy + 300], 40, fill=(168, 176, 186))
        d.rounded_rectangle([cx - 270, cy - 270, cx + 270, cy + 240], 24, fill=(210, 216, 224))
        d.rectangle([cx - 160, cy - 160, cx + 160, cy + 130], fill=(120, 128, 140))
        for i in range(-300, 301, 40):
            for off in (-350, 330):
                d.ellipse([cx + i - 8, cy + off - 8, cx + i + 8, cy + off + 8], fill=(214, 170, 60))
                d.ellipse([cx + off - 8, cy + i - 8, cx + off + 8, cy + i + 8], fill=(214, 170, 60))
    elif cat == "gpu":
        d.rounded_rectangle([200, cy - 230, W - 200, cy + 230], 36, fill=ink)
        d.rectangle([200, cy - 230, 250, cy + 230], fill=(160, 168, 178))
        fan(d, 560, cy, 170, accent)
        fan(d, 1040, cy, 170, accent)
        d.rectangle([W - 560, cy - 210, W - 220, cy - 190], fill=accent)
    elif cat == "ram":
        for yy in (cy - 210, cy + 60):
            d.rectangle([220, yy, W - 220, yy + 150], fill=(34, 112, 82) if hue < .5 else (40, 60, 110))
            for i in range(8):
                d.rectangle([300 + i * 135, yy + 25, 400 + i * 135, yy + 105], fill=(22, 26, 30))
            for i in range(60):
                d.rectangle([232 + i * 22, yy + 150, 244 + i * 22, yy + 168], fill=(214, 170, 60))
    elif cat == "ssd":
        d.rounded_rectangle([200, cy - 170, W - 200, cy + 170], 20, fill=(36, 44, 72))
        for i in range(4):
            d.rectangle([330 + i * 250, cy - 100, 520 + i * 250, cy + 100], fill=(22, 26, 30))
        d.rectangle([W - 330, cy - 120, W - 230, cy + 120], fill=accent)
        d.rectangle([200, cy - 120, 280, cy + 120], fill=(214, 170, 60))
    elif cat == "net":
        d.rounded_rectangle([260, cy - 260, W - 260, cy + 220], 22, fill=(30, 40, 52))
        for i in range(14):
            d.rectangle([340 + i * 56, cy - 220, 372 + i * 56, cy + 40], fill=(120, 132, 146))
        for i in range(2):
            d.rectangle([W - 620 + i * 210, cy + 70, W - 460 + i * 210, cy + 180], fill=(10, 12, 14))
            d.rectangle([W - 600 + i * 210, cy + 90, W - 480 + i * 210, cy + 120], fill=accent)
    else:  # psu
        d.rounded_rectangle([300, cy - 260, W - 300, cy + 240], 28, fill=(48, 56, 68))
        fan(d, cx - 220, cy - 10, 190, accent)
        for i in range(6):
            d.rectangle([cx + 120, cy - 180 + i * 54, cx + 420, cy - 160 + i * 54], fill=(26, 32, 40))
        d.rectangle([300, cy - 260, 340, cy + 240], fill=accent)
    d.text((90, 70), code, font=ImageFont.load_default(size=96), fill=ink)
    # Grano leve: hace que el peso de los archivos se parezca al de una foto real
    arr = np.array(img).astype("int16")
    arr += np.random.default_rng(seed).normal(0, 9, arr.shape).astype("int16")
    return Image.fromarray(np.clip(arr, 0, 255).astype("uint8"))


for n, (pid, cat, code) in enumerate(ITEMS):
    base = draw_product(cat, code, HUE[cat] + (n % 2) * 0.05, n)
    for w in (400, 800, 1600):
        im = base.resize((w, w * H // W), Image.LANCZOS)
        im.save(f"{OUT}/{pid}-{w}.avif", quality=50)
        im.save(f"{OUT}/{pid}-{w}.webp", quality=76, method=4)
        im.save(f"{OUT}/{pid}-{w}.jpg", quality=80, optimize=True, progressive=True)
    print("ok", pid)
