#!/usr/bin/env python3
"""
ZOTHOS Wallpaper Synthesis Engine v2.0
Generates high-definition (1920x1080) generative alchemical artworks:
  1. hermetic-matrix.png  - Emerald Tablet, Metatron's Cube, Sacred Geometry & Phosphor Matrix Lattices
  2. ghostmode-nullai.png - nullai.tech Stealth OLED Tactical HUD & Radar Matrix
  3. win11-bloom.jpg      - Windows 11 Fluent Acrylic Dark Bloom Disguise
"""

import math
import random
from PIL import Image, ImageDraw, ImageFilter

WIDTH, HEIGHT = 1920, 1080
OUT_DIR = "config/includes.chroot/usr/share/backgrounds/zothos"

def generate_matrix():
    print("[*] Synthesizing High-Art Hermetic Matrix wallpaper...")
    # Deep obsidian-emerald void
    img = Image.new("RGBA", (WIDTH, HEIGHT), (5, 8, 7, 255))
    overlay = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)

    random.seed(1337)

    # 1. Multi-layered Digital Rain in the background
    for col in range(0, WIDTH, 18):
        density = random.random()
        if density < 0.75:
            stream_len = random.randint(180, 850)
            start_y = random.randint(-200, HEIGHT - stream_len)
            head_brightness = random.randint(180, 255)
            for y in range(start_y, start_y + stream_len, 10):
                if 0 <= y < HEIGHT:
                    fade = (y - start_y) / stream_len
                    # Head glyph is brilliant emerald-white, tail fades to deep emerald
                    if y > start_y + stream_len - 25:
                        r, g, b, a = 180, 255, 220, 240
                    else:
                        g = int(25 + fade * 160)
                        r, b, a = 0, int(g * 0.4), int(fade * 140)
                    draw.rectangle([col, y, col + 2, y + 7], fill=(r, g, b, a))

    # 2. Sacred Geometry - Metatron's Cube & Concentric Alchemical Spheres
    cx, cy = WIDTH // 2, HEIGHT // 2
    
    # Glow pass for geometry
    glow_layer = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow_layer)

    # Outer Zodiacal / Degree Rings
    for r in [480, 476, 440, 420, 360, 320, 260, 200, 140, 80]:
        alpha = 140 if r in [440, 360, 260] else 60
        glow_draw.ellipse([cx - r, cy - r, cx + r, cy + r], outline=(0, 255, 157, alpha), width=2 if r in [440, 360] else 1)

    # 72 Ray Radiants (Alchemical Solar Flares)
    for i in range(72):
        angle = math.radians(i * 5)
        r1 = 440
        r2 = 470 if i % 6 == 0 else (455 if i % 2 == 0 else 448)
        x1 = cx + r1 * math.cos(angle)
        y1 = cy + r1 * math.sin(angle)
        x2 = cx + r2 * math.cos(angle)
        y2 = cy + r2 * math.sin(angle)
        color = (245, 158, 11, 200) if i % 6 == 0 else (0, 255, 157, 100)
        glow_draw.line([(x1, y1), (x2, y2)], fill=color, width=2 if i % 6 == 0 else 1)

    # Inscribed Hexagram (The Emerald Tablet: As Above, So Below)
    r_hex = 360
    pts_up = []
    pts_down = []
    for i in range(3):
        a_up = -math.pi / 2 + i * (2 * math.pi / 3)
        pts_up.append((cx + r_hex * math.cos(a_up), cy + r_hex * math.sin(a_up)))
        a_down = math.pi / 2 + i * (2 * math.pi / 3)
        pts_down.append((cx + r_hex * math.cos(a_down), cy + r_hex * math.sin(a_down)))

    glow_draw.polygon(pts_up, outline=(245, 158, 11, 220), width=3)
    glow_draw.polygon(pts_down, outline=(245, 158, 11, 220), width=3)

    # Inner Metatron's 13 Sacred Nodes
    node_centers = [(cx, cy)]
    for i in range(6):
        a = i * (math.pi / 3)
        node_centers.append((cx + 140 * math.cos(a), cy + 140 * math.sin(a)))
        node_centers.append((cx + 280 * math.cos(a), cy + 280 * math.sin(a)))

    # Interconnect all 13 nodes (Metatron Lattice)
    for p1 in node_centers:
        for p2 in node_centers:
            if p1 != p2:
                glow_draw.line([p1, p2], fill=(0, 255, 157, 30), width=1)

    for p in node_centers:
        glow_draw.ellipse([p[0] - 12, p[1] - 12, p[0] + 12, p[1] + 12], outline=(0, 255, 157, 200), width=2)
        glow_draw.ellipse([p[0] - 4, p[1] - 4, p[0] + 4, p[1] + 4], fill=(245, 158, 11, 220))

    # Center Sun / Monas Core
    glow_draw.ellipse([cx - 45, cy - 45, cx + 45, cy + 45], outline=(245, 158, 11, 240), width=2)
    glow_draw.ellipse([cx - 18, cy - 18, cx + 18, cy + 18], fill=(0, 255, 157, 255))
    glow_draw.ellipse([cx - 6, cy - 6, cx + 6, cy + 6], fill=(255, 255, 255, 255))

    # Composite & bloom
    bloom = glow_layer.filter(ImageFilter.GaussianBlur(radius=3))
    composite = Image.alpha_composite(img, overlay)
    composite = Image.alpha_composite(composite, bloom)
    composite = Image.alpha_composite(composite, glow_layer)
    composite.convert("RGB").save(f"{OUT_DIR}/hermetic-matrix.png", "PNG", optimize=True)
    print("    -> Generated enhanced hermetic-matrix.png")


def generate_ghostmode():
    print("[*] Synthesizing High-Tech Ghostmode (nullai.tech) wallpaper...")
    img = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 255))
    draw = ImageDraw.Draw(img)

    # 1. Subtle tactical graph grid
    for x in range(0, WIDTH, 48):
        alpha = 35 if x % 144 == 0 else 15
        draw.line([(x, 0), (x, HEIGHT)], fill=(18, 22, 28, alpha), width=1)
    for y in range(0, HEIGHT, 48):
        alpha = 35 if y % 144 == 0 else 15
        draw.line([(0, y), (WIDTH, y)], fill=(18, 22, 28, alpha), width=1)

    cx, cy = WIDTH // 2, HEIGHT // 2

    # Tactical Radar Sweep Circles & Angles
    for r in [96, 192, 288, 384, 480]:
        draw.ellipse([cx - r, cy - r, cx + r, cy + r], outline=(225, 29, 72, 60), width=1)

    for deg in [0, 45, 90, 135, 180, 225, 270, 315]:
        rad = math.radians(deg)
        x = cx + 480 * math.cos(rad)
        y = cy + 480 * math.sin(rad)
        draw.line([(cx, cy), (x, y)], fill=(225, 29, 72, 40), width=1)

    # Corner brackets / military HUD viewfinder
    bw, bh = 540, 320
    # Top-left
    draw.line([(cx - bw, cy - bh), (cx - bw + 40, cy - bh)], fill=(225, 29, 72, 180), width=2)
    draw.line([(cx - bw, cy - bh), (cx - bw, cy - bh + 40)], fill=(225, 29, 72, 180), width=2)
    # Top-right
    draw.line([(cx + bw, cy - bh), (cx + bw - 40, cy - bh)], fill=(225, 29, 72, 180), width=2)
    draw.line([(cx + bw, cy - bh), (cx + bw, cy - bh + 40)], fill=(225, 29, 72, 180), width=2)
    # Bottom-left
    draw.line([(cx - bw, cy + bh), (cx - bw + 40, cy + bh)], fill=(225, 29, 72, 180), width=2)
    draw.line([(cx - bw, cy + bh), (cx - bw, cy + bh - 40)], fill=(225, 29, 72, 180), width=2)
    # Bottom-right
    draw.line([(cx + bw, cy + bh), (cx + bw - 40, cy + bh)], fill=(225, 29, 72, 180), width=2)
    draw.line([(cx + bw, cy + bh), (cx + bw, cy + bh - 40)], fill=(225, 29, 72, 180), width=2)

    # Central Reticle & Status Tag
    draw.ellipse([cx - 40, cy - 40, cx + 40, cy + 40], outline=(225, 29, 72, 200), width=2)
    draw.ellipse([cx - 6, cy - 6, cx + 6, cy + 6], fill=(225, 29, 72, 255))
    draw.line([(cx - 70, cy), (cx - 45, cy)], fill=(225, 29, 72, 200), width=2)
    draw.line([(cx + 45, cy), (cx + 70, cy)], fill=(225, 29, 72, 200), width=2)
    draw.line([(cx, cy - 70), (cx, cy - 45)], fill=(225, 29, 72, 200), width=2)
    draw.line([(cx, cy + 45), (cx, cy + 70)], fill=(225, 29, 72, 200), width=2)

    # Clean Stealth HUD Coordinates
    draw.text((cx - bw, cy + bh + 14), "GHOSTMODE // NULLAI.TECH PROTOCOL v3.2", fill=(225, 29, 72, 220))
    draw.text((cx + bw - 210, cy + bh + 14), "TOR: ROUTED | MAC: CLOAKED", fill=(148, 163, 184, 200))

    img.convert("RGB").save(f"{OUT_DIR}/ghostmode-nullai.png", "PNG", optimize=True)
    print("    -> Generated enhanced ghostmode-nullai.png")


def generate_win11():
    print("[*] Synthesizing Windows 11 Fluent Dark Bloom wallpaper...")
    # Soft deep slate background gradient
    img = Image.new("RGBA", (WIDTH, HEIGHT), (15, 23, 42, 255))
    bloom = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    draw = ImageDraw.Draw(bloom)

    cx, cy = WIDTH // 2, HEIGHT // 2 + 40

    # Layered organic bezier-approximated curves for Windows 11 Bloom
    petals = [
        # (radius_x, radius_y, color_rgba, angle_deg, offset_x, offset_y)
        (380, 220, (0, 102, 204, 160), -45, -60, -30),
        (340, 200, (0, 120, 215, 180), -20, -30, -10),
        (320, 180, (0, 153, 255, 170), 0, 0, 0),
        (300, 160, (51, 153, 255, 160), 25, 30, -20),
        (280, 150, (102, 178, 255, 150), 50, 60, -40),
        (260, 130, (147, 197, 253, 140), 75, 80, -60),
        (220, 110, (191, 219, 254, 180), -60, -80, 20),
        (180, 90,  (224, 242, 254, 200), -30, -40, 10),
    ]

    for rx, ry, col, angle, ox, oy in petals:
        rad = math.radians(angle)
        px = cx + ox
        py = cy + oy
        # Draw soft curved ellipses rotated
        layer = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
        ldraw = ImageDraw.Draw(layer)
        ldraw.ellipse([px - rx, py - ry, px + rx, py + ry], fill=col)
        # Apply gaussian blur for organic silk bloom feel
        layer = layer.filter(ImageFilter.GaussianBlur(radius=18))
        bloom = Image.alpha_composite(bloom, layer)

    composite = Image.alpha_composite(img, bloom)
    composite.convert("RGB").save(f"{OUT_DIR}/win11-bloom.jpg", "JPEG", quality=96)
    print("    -> Generated enhanced win11-bloom.jpg")


if __name__ == "__main__":
    generate_matrix()
    generate_ghostmode()
    generate_win11()
    print("[✓] All ZOTHOS artistic wallpapers synthesized successfully.")
