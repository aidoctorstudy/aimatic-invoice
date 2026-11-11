"""Recolors the AiMatic logo PNGs to the exact new brand colors (teal icon, navy wordmark),
preserving each pixel's original alpha (shape/anti-aliasing untouched, only hue remapped).
"""
from PIL import Image
import sys

TEAL = (28, 164, 148)   # #1CA494
NAVY = (12, 40, 76)     # #0C284C

def dist2(a, b):
    return (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2

def recolor(path, icon_sample, wordmark_sample, out_path=None):
    im = Image.open(path).convert("RGBA")
    px = im.load()
    w, h = im.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a == 0:
                continue
            d_icon = dist2((r, g, b), icon_sample)
            d_word = dist2((r, g, b), wordmark_sample)
            if d_icon <= d_word:
                px[x, y] = (TEAL[0], TEAL[1], TEAL[2], a)
            else:
                px[x, y] = (NAVY[0], NAVY[1], NAVY[2], a)
    im.save(out_path or path)
    print(f"recolored {path} -> {out_path or path}")

if __name__ == "__main__":
    # icon.png / ai-matic-logo.png: teal icon (46,196,174), pale wordmark (233,241,255)
    recolor("app/icon.png", (46, 196, 174), (233, 241, 255))
    recolor("public/ai-matic-logo.png", (46, 196, 174), (233, 241, 255))
    # ai-matic-logo-navbar.png: SeaGreen icon (46,139,87), near-black wordmark (11,18,32)
    recolor("public/ai-matic-logo-navbar.png", (46, 139, 87), (11, 18, 32))
