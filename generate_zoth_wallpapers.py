#!/usr/bin/env python3
"""
ZothOS Master 4K Wallpaper Generator
Generates ultra-high-definition (3840x2160) composites from master art assets in Zoth Studio.
"""

import os
import math
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance, ImageOps, ImageChops

BG_DIR = "/home/neo/zothos/config/includes.chroot/usr/share/backgrounds/zothos"
ASSETS_DIR = "/home/neo/zothos/config/includes.chroot/opt/zoth-studio/public/assets"

WIDTH = 3840
HEIGHT = 2160

def ensure_dirs():
    os.makedirs(BG_DIR, exist_ok=True)

def load_image(rel_path):
    p = os.path.join(ASSETS_DIR, rel_path)
    if not os.path.exists(p):
        raise FileNotFoundError(f"Asset not found: {p}")
    return Image.open(p).convert("RGBA")

def create_radial_gradient(w, h, center_color, edge_color, radius=None):
    if radius is None:
        radius = math.hypot(w / 2, h / 2)
    
    # Render at half size and upscale for speed and ultra-smooth gradient
    sw, sh = w // 2, h // 2
    img = Image.new("RGBA", (sw, sh), edge_color)
    draw = ImageDraw.Draw(img)
    cx, cy = sw // 2, sh // 2
    s_radius = radius / 2

    # Draw smooth concentric steps
    steps = 120
    for i in range(steps, 0, -1):
        r = s_radius * (i / steps)
        t = i / steps
        # Hermite smoothstep
        t_smooth = t * t * (3 - 2 * t)
        c = tuple(
            int(center_color[j] * (1 - t_smooth) + edge_color[j] * t_smooth)
            for j in range(4)
        )
        draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=c)
    
    img = img.resize((w, h), Image.Resampling.BICUBIC)
    return img

def apply_vignette(img, intensity=0.65):
    w, h = img.size
    vignette = Image.new("L", (w, h), 255)
    draw = ImageDraw.Draw(vignette)
    cx, cy = w / 2, h / 2
    max_r = math.hypot(cx, cy)
    
    # Smooth dark border
    steps = 100
    for i in range(steps):
        r = max_r * (i / steps)
        alpha = int(255 * (1 - intensity * ((i / steps) ** 2.2)))
        alpha = max(0, min(255, alpha))
        draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=alpha)
    
    vignette = vignette.filter(ImageFilter.GaussianBlur(radius=80))
    # Apply vignette to image
    r, g, b, a = img.split()
    r = ImageChops.multiply(r, vignette)
    g = ImageChops.multiply(g, vignette)
    b = ImageChops.multiply(b, vignette)
    return Image.merge("RGBA", (r, g, b, a))

def generate_hermetic_matrix():
    print("[-] Generating Hermetic Matrix 4K (hermetic-matrix.png)...")
    # Base canvas: Obsidian-emerald radial void
    canvas = create_radial_gradient(
        WIDTH, HEIGHT,
        center_color=(10, 45, 32, 255),
        edge_color=(2, 8, 6, 255),
        radius=WIDTH * 0.75
    )

    # 1. Background layer: azoth-code-matrix.jpg
    code_matrix = load_image("mascot/azoth-code-matrix.jpg")
    cm_scaled = code_matrix.resize((WIDTH, HEIGHT), Image.Resampling.LANCZOS)
    # Dim and tint code matrix
    cm_dimmed = ImageEnhance.Brightness(cm_scaled).enhance(0.55)
    cm_dimmed.putalpha(160)
    canvas = Image.alpha_composite(canvas, cm_dimmed)

    # 2. Middle blend: azoth-sanctum-throne.jpg blended in center with soft circular gradient
    sanctum = load_image("mascot/azoth-sanctum-throne.jpg")
    # Aspect-fit cover
    s_w = int(HEIGHT * (sanctum.width / sanctum.height))
    sanctum_resized = sanctum.resize((s_w, HEIGHT), Image.Resampling.LANCZOS)
    s_canvas = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    s_x = (WIDTH - s_w) // 2
    s_canvas.paste(sanctum_resized, (s_x, 0))
    
    # Mask for sanctum - radial feather
    s_mask = Image.new("L", (WIDTH, HEIGHT), 0)
    s_draw = ImageDraw.Draw(s_mask)
    s_draw.ellipse([WIDTH//2 - 900, HEIGHT//2 - 900, WIDTH//2 + 900, HEIGHT//2 + 900], fill=180)
    s_mask = s_mask.filter(ImageFilter.GaussianBlur(150))
    s_canvas.putalpha(s_mask)
    canvas = Image.alpha_composite(canvas, s_canvas)

    # 3. Ambient Glow layer
    glow = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    g_draw = ImageDraw.Draw(glow)
    # Emerald & Cyan bloom circles in center
    for r in range(700, 100, -50):
        alpha = int(25 * (1 - r / 700))
        g_draw.ellipse([WIDTH//2 - r, HEIGHT//2 - r, WIDTH//2 + r, HEIGHT//2 + r], fill=(0, 255, 157, alpha))
    for r in range(400, 50, -30):
        alpha = int(35 * (1 - r / 400))
        g_draw.ellipse([WIDTH//2 - r, HEIGHT//2 - r, WIDTH//2 + r, HEIGHT//2 + r], fill=(0, 243, 255, alpha))
    glow = glow.filter(ImageFilter.GaussianBlur(60))
    canvas = Image.alpha_composite(canvas, glow)

    # 4. Centerpiece: Master Hermetic Seal (azoth-seal-masterpiece.jpg)
    seal = load_image("brand/azoth-seal-masterpiece.jpg")
    seal_size = 1100
    seal_scaled = seal.resize((seal_size, seal_size), Image.Resampling.LANCZOS)
    
    # Circular mask with soft anti-aliased edge
    seal_mask = Image.new("L", (seal_size, seal_size), 0)
    sm_draw = ImageDraw.Draw(seal_mask)
    sm_draw.ellipse([8, 8, seal_size - 8, seal_size - 8], fill=255)
    seal_mask = seal_mask.filter(ImageFilter.GaussianBlur(3))
    
    # Create sealed element with glow rim
    seal_rgba = Image.new("RGBA", (seal_size, seal_size), (0, 0, 0, 0))
    seal_rgba.paste(seal_scaled, (0, 0), seal_mask)

    # Rim glow on seal
    rim = Image.new("RGBA", (seal_size + 100, seal_size + 100), (0, 0, 0, 0))
    r_draw = ImageDraw.Draw(rim)
    cx, cy = (seal_size + 100) // 2, (seal_size + 100) // 2
    r_draw.ellipse([cx - seal_size//2 - 6, cy - seal_size//2 - 6, cx + seal_size//2 + 6, cy + seal_size//2 + 6], outline=(0, 255, 157, 220), width=6)
    r_draw.ellipse([cx - seal_size//2 - 16, cy - seal_size//2 - 16, cx + seal_size//2 + 16, cy + seal_size//2 + 16], outline=(0, 243, 255, 160), width=3)
    rim_blurred = rim.filter(ImageFilter.GaussianBlur(12))
    
    # Composite rim and seal onto center
    pos_x = (WIDTH - seal_size) // 2
    pos_y = (HEIGHT - seal_size) // 2
    
    canvas.paste(rim_blurred, (pos_x - 50, pos_y - 50), rim_blurred)
    canvas.paste(rim, (pos_x - 50, pos_y - 50), rim)
    canvas.paste(seal_rgba, (pos_x, pos_y), seal_rgba)

    # 5. Cybernetic HUD overlays / Hermetic Grid lines
    hud = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    h_draw = ImageDraw.Draw(hud)
    # Crosshair and telemetry circles
    cx, cy = WIDTH // 2, HEIGHT // 2
    for r in [650, 800, 950]:
        h_draw.ellipse([cx - r, cy - r, cx + r, cy + r], outline=(0, 255, 157, 40), width=1)
    
    # Corner HUD accents
    acc_color = (0, 255, 157, 90)
    cw = 80
    # Top Left
    h_draw.line([(100, 100), (100 + cw, 100)], fill=acc_color, width=2)
    h_draw.line([(100, 100), (100, 100 + cw)], fill=acc_color, width=2)
    # Top Right
    h_draw.line([(WIDTH - 100, 100), (WIDTH - 100 - cw, 100)], fill=acc_color, width=2)
    h_draw.line([(WIDTH - 100, 100), (WIDTH - 100, 100 + cw)], fill=acc_color, width=2)
    # Bottom Left
    h_draw.line([(100, HEIGHT - 100), (100 + cw, HEIGHT - 100)], fill=acc_color, width=2)
    h_draw.line([(100, HEIGHT - 100), (100, HEIGHT - 100 - cw)], fill=acc_color, width=2)
    # Bottom Right
    h_draw.line([(WIDTH - 100, HEIGHT - 100), (WIDTH - 100 - cw, HEIGHT - 100)], fill=acc_color, width=2)
    h_draw.line([(WIDTH - 100, HEIGHT - 100), (WIDTH - 100, HEIGHT - 100 - cw)], fill=acc_color, width=2)

    canvas = Image.alpha_composite(canvas, hud)

    # 6. Apply smooth vignette and contrast enhancement
    canvas = apply_vignette(canvas, intensity=0.7)
    enhancer = ImageEnhance.Contrast(canvas.convert("RGB"))
    final = enhancer.enhance(1.12)
    
    out_path = os.path.join(BG_DIR, "hermetic-matrix.png")
    final.save(out_path, "PNG", optimize=True)
    print(f"[✓] Hermetic Matrix 4K saved to {out_path} ({final.size})")

def generate_ghostmode_nullai():
    print("[-] Generating Ghostmode NullAI 4K (ghostmode-nullai.png)...")
    # Base canvas: Obsidian void with deep purple-blue radial gradient
    canvas = create_radial_gradient(
        WIDTH, HEIGHT,
        center_color=(24, 12, 38, 255),
        edge_color=(3, 2, 8, 255),
        radius=WIDTH * 0.75
    )

    # 1. Background layer: azoth-ghostbyte.jpg
    ghost_bg = load_image("mascot/azoth-ghostbyte.jpg")
    gb_scaled = ghost_bg.resize((WIDTH, HEIGHT), Image.Resampling.LANCZOS)
    gb_dimmed = ImageEnhance.Brightness(gb_scaled).enhance(0.45)
    gb_dimmed.putalpha(140)
    canvas = Image.alpha_composite(canvas, gb_dimmed)

    # 2. Ethereal atmospheric glow / nebula
    glow = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    g_draw = ImageDraw.Draw(glow)
    cx, cy = WIDTH // 2, HEIGHT // 2
    for r in range(800, 100, -50):
        alpha = int(30 * (1 - r / 800))
        g_draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(168, 85, 247, alpha))
    for r in range(450, 50, -30):
        alpha = int(40 * (1 - r / 450))
        g_draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(0, 243, 255, alpha))
    glow = glow.filter(ImageFilter.GaussianBlur(70))
    canvas = Image.alpha_composite(canvas, glow)

    # 3. Centerpiece: Authentic GhostByte NullAI Icon (ghostbyte-nullai-icon.png)
    nullai_icon = load_image("mascot/ghostbyte-nullai-icon.png")
    # Resize keeping aspect ratio
    icon_size = 920
    icon_scaled = nullai_icon.resize((icon_size, int(icon_size * (nullai_icon.height / nullai_icon.width))), Image.Resampling.LANCZOS)
    
    # 3D Glass pedestal backdrop
    glass_size = 1100
    glass_plate = Image.new("RGBA", (glass_size, glass_size), (0, 0, 0, 0))
    gp_draw = ImageDraw.Draw(glass_plate)
    gcx, gcy = glass_size // 2, glass_size // 2
    
    # Glass disc
    gp_draw.ellipse([50, 50, glass_size - 50, glass_size - 50], fill=(15, 10, 25, 170), outline=(192, 132, 252, 120), width=3)
    gp_draw.ellipse([70, 70, glass_size - 70, glass_size - 70], outline=(0, 243, 255, 90), width=1)
    
    # Specular reflection arc on glass plate
    gp_draw.arc([80, 80, glass_size - 80, glass_size - 80], start=200, end=340, fill=(255, 255, 255, 140), width=5)
    
    # Drop shadow & bloom for icon
    shadow = Image.new("RGBA", (icon_scaled.width + 120, icon_scaled.height + 120), (0, 0, 0, 0))
    sh_mask = icon_scaled.split()[3]
    sh_draw = Image.new("RGBA", icon_scaled.size, (168, 85, 247, 200))
    sh_draw.putalpha(sh_mask)
    shadow.paste(sh_draw, (60, 60))
    shadow_blurred = shadow.filter(ImageFilter.GaussianBlur(30))

    # Composite onto canvas
    pos_x = (WIDTH - icon_scaled.width) // 2
    pos_y = (HEIGHT - icon_scaled.height) // 2
    plate_x = (WIDTH - glass_size) // 2
    plate_y = (HEIGHT - glass_size) // 2

    canvas.paste(glass_plate, (plate_x, plate_y), glass_plate)
    canvas.paste(shadow_blurred, (pos_x - 60, pos_y - 60), shadow_blurred)
    canvas.paste(icon_scaled, (pos_x, pos_y), icon_scaled)

    # 4. Stealth HUD / Cyber Telemetry Grid
    hud = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    h_draw = ImageDraw.Draw(hud)
    # Hexagonal / Circuit telemetry
    for r in [600, 750, 900]:
        h_draw.ellipse([cx - r, cy - r, cx + r, cy + r], outline=(168, 85, 247, 35), width=1)
    
    # Corner HUD accents in Neon Violet & Cyan
    cw = 80
    v_acc = (168, 85, 247, 100)
    # Top Left
    h_draw.line([(100, 100), (100 + cw, 100)], fill=v_acc, width=2)
    h_draw.line([(100, 100), (100, 100 + cw)], fill=v_acc, width=2)
    # Top Right
    h_draw.line([(WIDTH - 100, 100), (WIDTH - 100 - cw, 100)], fill=v_acc, width=2)
    h_draw.line([(WIDTH - 100, 100), (WIDTH - 100, 100 + cw)], fill=v_acc, width=2)
    # Bottom Left
    h_draw.line([(100, HEIGHT - 100), (100 + cw, HEIGHT - 100)], fill=v_acc, width=2)
    h_draw.line([(100, HEIGHT - 100), (100, HEIGHT - 100 - cw)], fill=v_acc, width=2)
    # Bottom Right
    h_draw.line([(WIDTH - 100, HEIGHT - 100), (WIDTH - 100 - cw, HEIGHT - 100)], fill=v_acc, width=2)
    h_draw.line([(WIDTH - 100, HEIGHT - 100), (WIDTH - 100, HEIGHT - 100 - cw)], fill=v_acc, width=2)

    canvas = Image.alpha_composite(canvas, hud)

    # 5. Vignette & Final Polish
    canvas = apply_vignette(canvas, intensity=0.72)
    enhancer = ImageEnhance.Contrast(canvas.convert("RGB"))
    final = enhancer.enhance(1.15)

    out_path = os.path.join(BG_DIR, "ghostmode-nullai.png")
    final.save(out_path, "PNG", optimize=True)
    print(f"[✓] Ghostmode NullAI 4K saved to {out_path} ({final.size})")

def generate_zoth_gold_master():
    print("[-] Generating Zoth Gold Master 4K (zoth-gold-master.png & alchemical-gold.png)...")
    # Base canvas: Cosmic Obsidian-Gold radial gradient
    canvas = create_radial_gradient(
        WIDTH, HEIGHT,
        center_color=(55, 40, 10, 255),
        edge_color=(8, 6, 2, 255),
        radius=WIDTH * 0.75
    )

    # 1. Background layer: azoth-ascended.jpg
    ascended = load_image("mascot/azoth-ascended.jpg")
    # Aspect fit cover
    a_w = int(HEIGHT * (ascended.width / ascended.height))
    ascended_resized = ascended.resize((a_w, HEIGHT), Image.Resampling.LANCZOS)
    a_canvas = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    a_x = (WIDTH - a_w) // 2
    a_canvas.paste(ascended_resized, (a_x, 0))
    
    # Feather mask for soft atmospheric background
    a_mask = Image.new("L", (WIDTH, HEIGHT), 0)
    am_draw = ImageDraw.Draw(a_mask)
    am_draw.ellipse([WIDTH//2 - 1200, HEIGHT//2 - 1200, WIDTH//2 + 1200, HEIGHT//2 + 1200], fill=160)
    a_mask = a_mask.filter(ImageFilter.GaussianBlur(180))
    a_canvas.putalpha(a_mask)
    canvas = Image.alpha_composite(canvas, a_canvas)

    # 2. Solar Gold Bloom layer
    glow = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    g_draw = ImageDraw.Draw(glow)
    cx, cy = WIDTH // 2, HEIGHT // 2
    for r in range(850, 100, -50):
        alpha = int(32 * (1 - r / 850))
        g_draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(251, 191, 36, alpha))
    for r in range(450, 50, -30):
        alpha = int(45 * (1 - r / 450))
        g_draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(254, 240, 138, alpha))
    glow = glow.filter(ImageFilter.GaussianBlur(60))
    canvas = Image.alpha_composite(canvas, glow)

    # 3. Centerpiece: Master 3D Golden Azoth Emblem (zoth-golden-z-emblem.png)
    emblem = load_image("brand/zoth-golden-z-emblem.png")
    emblem_size = 1100
    emblem_scaled = emblem.resize((emblem_size, emblem_size), Image.Resampling.LANCZOS)

    # Solar flare / aura rings behind emblem
    rings = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    r_draw = ImageDraw.Draw(rings)
    for r in [580, 680, 800]:
        r_draw.ellipse([cx - r, cy - r, cx + r, cy + r], outline=(251, 191, 36, 60), width=2)
    for r in [630, 740]:
        r_draw.ellipse([cx - r, cy - r, cx + r, cy + r], outline=(0, 243, 255, 45), width=1)
    
    # 8-point subtle solar rays
    for angle in range(0, 360, 45):
        rad = math.radians(angle)
        x1 = cx + math.cos(rad) * 580
        y1 = cy + math.sin(rad) * 580
        x2 = cx + math.cos(rad) * 880
        y2 = cy + math.sin(rad) * 880
        r_draw.line([(x1, y1), (x2, y2)], fill=(254, 240, 138, 50), width=2)

    canvas = Image.alpha_composite(canvas, rings)

    # Drop shadow for emblem
    e_pos_x = (WIDTH - emblem_size) // 2
    e_pos_y = (HEIGHT - emblem_size) // 2
    
    # Soft shadow
    shadow = Image.new("RGBA", (emblem_size + 140, emblem_size + 140), (0, 0, 0, 0))
    sh_mask = emblem_scaled.split()[3]
    sh_solid = Image.new("RGBA", emblem_scaled.size, (251, 191, 36, 180))
    sh_solid.putalpha(sh_mask)
    shadow.paste(sh_solid, (70, 70))
    shadow_blurred = shadow.filter(ImageFilter.GaussianBlur(35))
    canvas.paste(shadow_blurred, (e_pos_x - 70, e_pos_y - 70), shadow_blurred)

    # Paste Emblem
    canvas.paste(emblem_scaled, (e_pos_x, e_pos_y), emblem_scaled)

    # 4. Corner Alchemical Accents
    hud = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    h_draw = ImageDraw.Draw(hud)
    cw = 80
    gold_acc = (251, 191, 36, 120)
    # Top Left
    h_draw.line([(100, 100), (100 + cw, 100)], fill=gold_acc, width=2)
    h_draw.line([(100, 100), (100, 100 + cw)], fill=gold_acc, width=2)
    # Top Right
    h_draw.line([(WIDTH - 100, 100), (WIDTH - 100 - cw, 100)], fill=gold_acc, width=2)
    h_draw.line([(WIDTH - 100, 100), (WIDTH - 100, 100 + cw)], fill=gold_acc, width=2)
    # Bottom Left
    h_draw.line([(100, HEIGHT - 100), (100 + cw, HEIGHT - 100)], fill=gold_acc, width=2)
    h_draw.line([(100, HEIGHT - 100), (100, HEIGHT - 100 - cw)], fill=gold_acc, width=2)
    # Bottom Right
    h_draw.line([(WIDTH - 100, HEIGHT - 100), (WIDTH - 100 - cw, HEIGHT - 100)], fill=gold_acc, width=2)
    h_draw.line([(WIDTH - 100, HEIGHT - 100), (WIDTH - 100, HEIGHT - 100 - cw)], fill=gold_acc, width=2)

    canvas = Image.alpha_composite(canvas, hud)

    # 5. Vignette & Contrast
    canvas = apply_vignette(canvas, intensity=0.7)
    enhancer = ImageEnhance.Contrast(canvas.convert("RGB"))
    final = enhancer.enhance(1.14)

    out_path = os.path.join(BG_DIR, "zoth-gold-master.png")
    final.save(out_path, "PNG", optimize=True)
    print(f"[✓] Zoth Gold Master 4K saved to {out_path} ({final.size})")

    # Also sync alchemical-gold.png so all references have the 4K asset
    gold_legacy_path = os.path.join(BG_DIR, "alchemical-gold.png")
    final.save(gold_legacy_path, "PNG", optimize=True)
    print(f"[✓] Alchemical Gold 4K synced to {gold_legacy_path}")

def main():
    ensure_dirs()
    generate_hermetic_matrix()
    generate_ghostmode_nullai()
    generate_zoth_gold_master()
    print("\n✨ All 4K Ultra-High-Definition Master Wallpapers generated successfully!")

if __name__ == "__main__":
    main()
