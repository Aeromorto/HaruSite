"""Prepare web-ready images for the HARU landing page."""
from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parent
IMG = ROOT / "images"
SESSION = Path(
    r"C:\Users\arthur.mattos\.grok\sessions"
    r"\C%3A%5CUsers%5Carthur.mattos\01a066d0-286a-7960-8097-861938a3d2d8\images"
)

IMG.mkdir(parents=True, exist_ok=True)


def save_jpeg(im: Image.Image, dest: Path, width: int, quality: int = 84) -> None:
    rgb = im.convert("RGB")
    if rgb.width > width:
        h = round(width * rgb.height / rgb.width)
        rgb = rgb.resize((width, h), Image.Resampling.LANCZOS)
    rgb.save(dest, "JPEG", quality=quality, optimize=True, progressive=True)
    print(f"jpeg {dest.name:22} {rgb.size} {dest.stat().st_size / 1024:.0f} KB")


def crop_opaque(im: Image.Image, pad_ratio: float = 0.12) -> Image.Image:
    alpha = im.split()[-1]
    bbox = alpha.getbbox()
    if not bbox:
        return im
    l, t, r, b = bbox
    w, h = r - l, b - t
    pad = int(max(w, h) * pad_ratio)
    l = max(0, l - pad)
    t = max(0, t - pad)
    r = min(im.width, r + pad)
    b = min(im.height, b + pad)
    return im.crop((l, t, r, b))


def key_dark_green(src: Path, dest: Path) -> None:
    im = Image.open(src).convert("RGBA")
    px = im.load()
    w, h = im.size
    for y in range(h):
        for x in range(w):
            r, g, b, _a = px[x, y]
            luma = 0.299 * r + 0.587 * g + 0.114 * b
            if luma < 95 and g >= r - 8 and b < g + 12:
                px[x, y] = (r, g, b, 0)
    out = crop_opaque(im)
    out.save(dest, "PNG")
    print(f"png  {dest.name:22} {out.size} {dest.stat().st_size / 1024:.0f} KB")


def key_ivory(src: Path, dest: Path) -> None:
    im = Image.open(src).convert("RGBA")
    px = im.load()
    w, h = im.size
    for y in range(h):
        for x in range(w):
            r, g, b, _a = px[x, y]
            if r > 212 and g > 200 and b > 175 and abs(r - g) < 30 and (r - b) < 50:
                px[x, y] = (r, g, b, 0)
    out = crop_opaque(im)
    out.save(dest, "PNG")
    print(f"png  {dest.name:22} {out.size} {dest.stat().st_size / 1024:.0f} KB")


def main() -> None:
    hero1 = Path(
        r"C:\Users\arthur.mattos\Desktop\wallpaperswide.com-green-bamboo-forest-wallpaper-3840x2160.jpg"
    )
    hero2 = Path(r"C:\Users\arthur.mattos\Desktop\873620.jpg")

    save_jpeg(Image.open(hero1), IMG / "hero-bamboo.jpg", 2560, 83)
    save_jpeg(Image.open(hero2), IMG / "hero-2.jpg", 2560, 83)

    save_jpeg(Image.open(SESSION / "1.jpg"), IMG / "product-escova.jpg", 1200, 86)
    save_jpeg(Image.open(SESSION / "3.jpg"), IMG / "product-kit.jpg", 1200, 86)
    save_jpeg(Image.open(SESSION / "2.jpg"), IMG / "product-suporte.jpg", 1200, 86)

    key_dark_green(SESSION / "4.jpg", IMG / "logo-light.png")
    key_ivory(SESSION / "5.jpg", IMG / "logo-olive.png")


if __name__ == "__main__":
    main()
