#!/usr/bin/env python3
"""
ZOTHOS Wallpaper Generator
Creates crisp 1920x1080 procedural wallpapers for:
  1. hermetic-matrix.png  (Emerald alchemical circles, sacred geometry & matrix rain)
  2. ghostmode-nullai.png (nullai.tech stealth amnesic dark HUD)
  3. win11-bloom.jpg      (Windows 11 Bloom disguise)
"""

import math
import random
from PIL import Image, ImageDraw

WIDTH, HEIGHT = 1920, 1080
OUT_DIR = "config/includes.chroot/usr/share/backgrounds/zothos"

def generate_matrix():
    print("[*] Generating Hermetic Matrix wallpaper...")
    img = Image.new("RGB", (WIDTH, HEIGHT), (5, 8, 7))
    draw = ImageDraw.Draw(img)

    # 1. Subtle vertical matrix rain traces
    random.seed(42)
    for x in range(0, WIDTH, 16):
        length = random.randint(150, 700)
        start_y = random.randint(0, HEIGHT - length)
        for y in range(start_y, start_y + length, 8):
            fade = (y - start_y) / length
            g = int(25 + fade * 100)
            draw.rectangle([x, y, x + 2, y + 6], fill=(0, g, int(g * 0.5)))

    # 2. Concentric Hermetic Circles & Sacred Geometry in the center
    cx, cy = WIDTH // 2, HEIGHT // 2
    radii = [60, 120, 200, 280, 360, 440]
    for r in radii:
        draw.ellipse([cx - r, cy - r, cx + r, cy + r], outline=(0, 255, 157, 180), width=2)

    # Inscribed Hexagram / Star of David (As above, so below)
    r = 280
    pts_up = []
    pts_down = []
    for i in range(3):
        angle_up = -math.pi / 2 + i * (2 * math.pi / 3)
        pts_up.append((cx + r * math.cos(angle_up), cy + r * math.sin(angle_up)))
        angle_down = math.pi / 2 + i * (2 * math.pi / 3)
        pts_down.append((cx + r * math.cos(angle_down), cy + r * math.sin(angle_down)))

    draw.polygon(pts_up, outline=(245, 158, 11), width=2)
    draw.polygon(pts_down, outline=(245, 158, 11), width=2)

    # Outer ray lines
    for angle_deg in range(0, 360, 15):
        rad = math.radians(angle_deg)
        x1 = cx + 360 * math.cos(rad)
        y1 = cy + 360 * math.sin(rad)
        x2 = cx + 440 * math.cos(rad)
        y2 = cy + 440 * math.sin(rad)
        draw.line([(x1, y1), (x2, y2)], fill=(0, 180, 110), width=1)

    # Subtle Central Monas Hieroglyphica / Sun Symbol
    draw.ellipse([cx - 25, cy - 25, cx + 25, cy + 25], outline=(255, 215, 0), width=3)
    draw.ellipse([cx - 5, cy - 5, cx + 5, cy + 5], fill=(255, 215, 0))

    img.save(f"{OUT_DIR}/hermetic-matrix.png", "PNG")
    print("    -> Saved hermetic-matrix.png")


def generate_ghostmode():
    print("[*] Generating Ghostmode (nullai.tech) wallpaper...")
    img = Image.new("RGB", (WIDTH, HEIGHT), (0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Ultra-subtle stealth grid lines
    for x in range(0, WIDTH, 60):
        draw.line([(x, 0), (x, HEIGHT)], fill=(12, 12, 16), width=1)
    for y in range(0, HEIGHT, 60):
        draw.line([(0, y), (WIDTH, y)], fill=(12, 12, 16), width=1)

    cx, cy = WIDTH // 2, HEIGHT // 2

    # Radar stealth reticle
    for r in [100, 200, 300]:
        draw.ellipse([cx - r, cy - r, cx + r, cy + r], outline=(35, 10, 14), width=1)

    # Red/Amber operational crosshair
    draw.line([(cx - 350, cy), (cx + 350, cy)], fill=(225, 29, 72), width=1)
    draw.line([(cx, cy - 350), (cx, cy + 350)], fill=(225, 29, 72), width=1)

    # Ghost insignia box
    box_w, box_h = 240, 80
    draw.rectangle([cx - box_w, cy - box_h, cx + box_w, cy + box_h], outline=(225, 29, 72), width=2)

    img.save(f"{OUT_DIR}/ghostmode-nullai.png", "PNG")
    print("    -> Saved ghostmode-nullai.png")


def generate_win11():
    print("[*] Generating Windows 11 Incognito Bloom wallpaper...")
    # Soft deep navy/slate gradient
    img = Image.new("RGB", (WIDTH, HEIGHT), (14, 23, 42))
    draw = ImageDraw.Draw(img)

    cx, cy = WIDTH // 2, HEIGHT // 2 + 30

    # Curved layered bloom petals in blue tones
    petals = [
        (320, 180, (0, 120, 215)),
        (280, 150, (30, 144, 255)),
        (240, 130, (96, 165, 250)),
        (200, 100, (147, 197, 253)),
        (160, 70, (219, 234, 254)),
    ]

    for angle in [ -45, -20, 0, 20, 45, 70, -70 ]:
        for rx, ry, col in petals:
            rad = math.radians(angle)
            px = cx + int(120 * math.cos(rad))
            py = cy + int(100 * math.sin(rad))
            draw.ellipse([px - rx, py - ry, px + rx, py + ry], outline=col, width=3)

    img.save(f"{OUT_DIR}/win11-bloom.jpg", "JPEG", quality=95)
    print("    -> Saved win11-bloom.jpg")


if __name__ == "__main__":
    generate_matrix()
    generate_ghostmode()
    generate_win11()
    print("[✓] All ZOTHOS wallpapers generated.")
