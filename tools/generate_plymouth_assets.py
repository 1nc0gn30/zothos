#!/usr/bin/env python3
"""
⚡ ZothOS Plymouth Theme Asset Generator
Generates high-fidelity 3D assets for the ZothOS Hermetic Matrix Plymouth boot theme:
- seal.png: 3D Golden Azoth seal medallion with alchemical sigils & emerald rim glow
- ring.png: 3D Golden orbital ring with celestial notches
- glow.png: Emerald phosphor ambient bloom
- progress_box.png: Glassmorphic progress container
- progress_bar.png: Emerald & Gold radiant progress fill unit
- bullet.png: Alchemical golden dot for password entry
- lock.png: Cyber-hermetic security lock icon for LUKS passphrase prompt
- box.png: Passphrase entry dialog background
"""

import os
import math
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance, ImageChops

ROOT_DIR = "/home/neo/zothos"
ASSETS_DIR = os.path.join(ROOT_DIR, "config/includes.chroot/opt/zoth-studio/public/assets")
THEME_DIRS = [
    os.path.join(ROOT_DIR, "config/includes.chroot/usr/share/plymouth/themes/zothos-matrix"),
    os.path.join(ROOT_DIR, "config/includes.chroot/usr/share/plymouth/themes/zoth-matrix"),
]

def ensure_dirs():
    for d in THEME_DIRS:
        os.makedirs(d, exist_ok=True)

def get_asset(rel_path):
    p = os.path.join(ASSETS_DIR, rel_path)
    if os.path.exists(p):
        return p
    return None

def generate_seal(size=512):
    print("[-] Generating 3D Golden Azoth Seal (seal.png)...")
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(canvas)
    cx, cy = size // 2, size // 2

    # 1. Emerald outer bloom
    bloom = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    bd = ImageDraw.Draw(bloom)
    for r in range(size // 2 - 20, size // 2 - 120, -10):
        alpha = int(45 * (1 - (size // 2 - 20 - r) / 100))
        bd.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(0, 255, 157, alpha))
    bloom = bloom.filter(ImageFilter.GaussianBlur(25))
    canvas = Image.alpha_composite(canvas, bloom)

    # 2. Master Seal Core Artwork
    p_seal = get_asset("brand/azoth-seal-masterpiece.jpg") or get_asset("brand/zoth-seal-hermetic-hd.jpg")
    p_emblem = get_asset("brand/zoth-golden-z-emblem.png")

    core_size = int(size * 0.72)
    core_img = Image.new("RGBA", (core_size, core_size), (0, 0, 0, 0))
    if p_seal:
        im = Image.open(p_seal).convert("RGBA")
        im_res = im.resize((core_size, core_size), Image.Resampling.LANCZOS)
        # Circular mask
        mask = Image.new("L", (core_size, core_size), 0)
        md = ImageDraw.Draw(mask)
        md.ellipse([4, 4, core_size - 4, core_size - 4], fill=255)
        core_img.paste(im_res, (0, 0), mask)
    elif p_emblem:
        im = Image.open(p_emblem).convert("RGBA")
        core_img = im.resize((core_size, core_size), Image.Resampling.LANCZOS)

    # 3. Metallic Gold & Emerald Bevel Rings
    bevel = Image.new("RGBA", (core_size, core_size), (0, 0, 0, 0))
    b_draw = ImageDraw.Draw(bevel)
    # Gold rim
    b_draw.ellipse([4, 4, core_size - 4, core_size - 4], outline=(251, 191, 36, 230), width=6)
    b_draw.ellipse([10, 10, core_size - 10, core_size - 10], outline=(0, 255, 157, 180), width=2)
    b_draw.ellipse([16, 16, core_size - 16, core_size - 16], outline=(254, 240, 138, 140), width=2)
    # Specular gloss arc
    b_draw.arc([12, 12, core_size - 12, core_size - 12], start=210, end=330, fill=(255, 255, 255, 190), width=4)

    core_composite = Image.alpha_composite(core_img, bevel)

    # Center composite
    pos = (size - core_size) // 2
    canvas.paste(core_composite, (pos, pos), core_composite)

    # 4. Planetary runic nodes along the perimeter
    nodes = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    nd = ImageDraw.Draw(nodes)
    node_r = int(size * 0.44)
    for i in range(8):
        ang = math.radians(i * 45)
        nx = cx + math.cos(ang) * node_r
        ny = cy + math.sin(ang) * node_r
        # Golden runic node
        nd.ellipse([nx - 8, ny - 8, nx + 8, ny + 8], fill=(251, 191, 36, 240), outline=(255, 255, 255, 220), width=2)
        nd.ellipse([nx - 14, ny - 14, nx + 14, ny + 14], outline=(0, 255, 157, 100), width=1)

    canvas = Image.alpha_composite(canvas, nodes)
    return canvas

def generate_orbital_ring(size=600):
    print("[-] Generating 3D Golden Orbital Ring (ring.png)...")
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(canvas)
    cx, cy = size // 2, size // 2

    # Ring radii
    r_outer = size // 2 - 30
    r_inner = r_outer - 18

    # Outer glow
    glow = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    gd.ellipse([cx - r_outer - 8, cy - r_outer - 8, cx + r_outer + 8, cy + r_outer + 8], outline=(251, 191, 36, 80), width=18)
    gd.ellipse([cx - r_outer - 4, cy - r_outer - 4, cx + r_outer + 4, cy + r_outer + 4], outline=(0, 255, 157, 60), width=8)
    glow = glow.filter(ImageFilter.GaussianBlur(10))
    canvas = Image.alpha_composite(canvas, glow)

    # Main Ring track
    ring = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    rd = ImageDraw.Draw(ring)
    rd.ellipse([cx - r_outer, cy - r_outer, cx + r_outer, cy + r_outer], outline=(251, 191, 36, 200), width=3)
    rd.ellipse([cx - r_inner, cy - r_inner, cx + r_inner, cy + r_inner], outline=(254, 240, 138, 160), width=2)

    # Dashed celestial tick marks
    for deg in range(0, 360, 15):
        rad = math.radians(deg)
        x1 = cx + math.cos(rad) * (r_inner + 2)
        y1 = cy + math.sin(rad) * (r_inner + 2)
        x2 = cx + math.cos(rad) * (r_outer - 2)
        y2 = cy + math.sin(rad) * (r_outer - 2)
        color = (254, 240, 138, 240) if deg % 45 == 0 else (0, 255, 157, 180)
        width = 3 if deg % 45 == 0 else 1
        rd.line([(x1, y1), (x2, y2)], fill=color, width=width)

    # Major alchemical satellites on the ring
    for deg in [0, 90, 180, 270]:
        rad = math.radians(deg)
        mx = cx + math.cos(rad) * ((r_outer + r_inner) / 2)
        my = cy + math.sin(rad) * ((r_outer + r_inner) / 2)
        rd.ellipse([mx - 6, my - 6, mx + 6, my + 6], fill=(0, 243, 255, 255), outline=(255, 255, 255, 240), width=2)

    canvas = Image.alpha_composite(canvas, ring)
    return canvas

def generate_glow(size=800):
    print("[-] Generating Emerald Phosphor Bloom (glow.png)...")
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(canvas)
    cx, cy = size // 2, size // 2
    for r in range(size // 2, 10, -20):
        t = 1.0 - (r / (size // 2))
        alpha = int(60 * (t ** 1.8))
        draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(0, 255, 157, alpha))
    canvas = canvas.filter(ImageFilter.GaussianBlur(40))
    return canvas

def generate_progress_box(width=680, height=14):
    print("[-] Generating Progress Box (progress_box.png)...")
    img = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    # Glassmorphic container with glowing emerald border
    draw.rounded_rectangle([0, 0, width - 1, height - 1], radius=7, fill=(6, 12, 10, 220), outline=(0, 255, 157, 90), width=1)
    draw.rounded_rectangle([1, 1, width - 2, height - 2], radius=6, outline=(255, 255, 255, 25), width=1)
    return img

def generate_progress_bar(width=680, height=14):
    print("[-] Generating Progress Bar Fill (progress_bar.png)...")
    img = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    # Emerald to Gold gradient fill
    for x in range(width):
        t = x / width
        r = int(0 * (1 - t) + 251 * t)
        g = int(255 * (1 - t) + 215 * t)
        b = int(157 * (1 - t) + 36 * t)
        draw.line([(x, 2), (x, height - 3)], fill=(r, g, b, 235))
    # Top highlight line
    draw.line([(2, 2), (width - 3, 2)], fill=(255, 255, 255, 180), width=1)
    return img

def generate_bullet(size=24):
    print("[-] Generating Password Bullet (bullet.png)...")
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    cx, cy = size // 2, size // 2
    # Glowing golden bullet
    draw.ellipse([4, 4, size - 4, size - 4], fill=(251, 191, 36, 240), outline=(255, 255, 255, 220), width=2)
    draw.ellipse([2, 2, size - 2, size - 2], outline=(0, 255, 157, 120), width=1)
    return img

def generate_lock(size=64):
    print("[-] Generating Security Lock (lock.png)...")
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    cx, cy = size // 2, size // 2
    # Shackle
    draw.arc([cx - 16, 8, cx + 16, 40], start=180, end=0, fill=(254, 240, 138, 240), width=5)
    # Body
    draw.rounded_rectangle([cx - 20, 26, cx + 20, 56], radius=6, fill=(10, 24, 18, 230), outline=(0, 255, 157, 240), width=2)
    # Keyhole
    draw.ellipse([cx - 4, 34, cx + 4, 42], fill=(251, 191, 36, 255))
    draw.polygon([(cx - 2, 40), (cx + 2, 40), (cx + 3, 48), (cx - 3, 48)], fill=(251, 191, 36, 255))
    return img

def generate_box(width=340, height=52):
    print("[-] Generating Passphrase Box (box.png / entry.png)...")
    img = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    draw.rounded_rectangle([0, 0, width - 1, height - 1], radius=10, fill=(8, 14, 20, 230), outline=(0, 255, 157, 160), width=2)
    draw.rounded_rectangle([2, 2, width - 3, height - 3], radius=8, outline=(0, 243, 255, 60), width=1)
    return img

def main():
    print("======================================================")
    print("   ⚡ ZOTHOS PLYMOUTH BOOT THEME ASSET SYNTHESIZER    ")
    print("======================================================")
    ensure_dirs()

    seal = generate_seal(512)
    ring = generate_orbital_ring(600)
    glow = generate_glow(800)
    p_box = generate_progress_box(680, 14)
    p_bar = generate_progress_bar(680, 14)
    bullet = generate_bullet(24)
    lock = generate_lock(64)
    box = generate_box(340, 52)

    assets = {
        "seal.png": seal,
        "ring.png": ring,
        "glow.png": glow,
        "progress_box.png": p_box,
        "progress_bar.png": p_bar,
        "bullet.png": bullet,
        "lock.png": lock,
        "box.png": box,
        "entry.png": box,
    }

    for theme_dir in THEME_DIRS:
        print(f"\n[+] Writing assets to: {theme_dir}")
        for fname, img in assets.items():
            dest = os.path.join(theme_dir, fname)
            img.save(dest, "PNG", optimize=True)
            print(f"  [✓] Saved {fname} ({img.size})")

    print("\n[✓] Plymouth Theme Assets generated and deployed successfully!")

if __name__ == "__main__":
    main()
