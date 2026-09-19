#!/usr/bin/env python3
"""
⚡ ZothOS Ultra-HD 3D Glassmorphic Icon Suite Generator
Generates rich, multi-layered 3D glassmorphic icons with specular highlights,
metallic borders, glass refraction, and inner shadows composited with authentic
master art assets from Zoth Studio.
"""

import os
import sys
import math
import shutil
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance, ImageChops

ROOT_DIR = "/home/neo/zothos"
ASSETS_DIR = os.path.join(ROOT_DIR, "config/includes.chroot/opt/zoth-studio/public/assets")
LOCAL_ICONS = os.path.expanduser("~/.local/share/icons")

CHROOT_ICONS = os.path.join(ROOT_DIR, "config/includes.chroot/usr/share/icons")
CHROOT_PIXMAPS = os.path.join(ROOT_DIR, "config/includes.chroot/usr/share/pixmaps")

SIZES = [512, 256, 128, 96, 64, 48, 32, 24, 16]

CANVAS_SIZE = 512
PADDING = 32
CORNER_RADIUS = 104

def get_asset_path(rel_path):
    p = os.path.join(ASSETS_DIR, rel_path)
    if os.path.exists(p):
        return p
    # Fallback to local user paths or repo paths if needed
    alt = os.path.join("/home/neo/lafvin/public/assets", rel_path)
    if os.path.exists(alt):
        return alt
    return None

def create_glass_squircle_base(
    bg_top=(20, 24, 35, 255),
    bg_bot=(4, 6, 12, 255),
    glow_color=(0, 243, 255, 60),
    rim_top=(255, 255, 255, 180),
    rim_bot=(40, 60, 80, 140)
):
    """
    Creates a 512x512 multi-layered 3D glassmorphic squircle container:
    - Deep drop shadow + ambient color bloom
    - Frosted dark glass gradient fill
    - Inner ambient shadow / depth occlusion
    - 3D Metallic / Beveled dual-tone stroke
    - Specular curved glass reflection arc (frosted gloss highlight)
    """
    canvas = Image.new("RGBA", (CANVAS_SIZE, CANVAS_SIZE), (0, 0, 0, 0))
    
    # 1. Outer Glow & Drop Shadow
    bbox = [PADDING, PADDING, CANVAS_SIZE - PADDING, CANVAS_SIZE - PADDING]
    
    # Drop shadow
    shadow = Image.new("RGBA", (CANVAS_SIZE, CANVAS_SIZE), (0, 0, 0, 0))
    s_draw = ImageDraw.Draw(shadow)
    s_draw.rounded_rectangle([PADDING, PADDING + 14, CANVAS_SIZE - PADDING, CANVAS_SIZE - PADDING + 14], radius=CORNER_RADIUS, fill=(0, 0, 0, 160))
    shadow = shadow.filter(ImageFilter.GaussianBlur(18))
    canvas = Image.alpha_composite(canvas, shadow)

    # Ambient colored glow behind squircle
    if glow_color[3] > 0:
        glow = Image.new("RGBA", (CANVAS_SIZE, CANVAS_SIZE), (0, 0, 0, 0))
        g_draw = ImageDraw.Draw(glow)
        g_draw.rounded_rectangle(bbox, radius=CORNER_RADIUS, fill=glow_color)
        glow = glow.filter(ImageFilter.GaussianBlur(22))
        canvas = Image.alpha_composite(canvas, glow)

    # 2. Base Squircle Glass Gradient Fill
    body = Image.new("RGBA", (CANVAS_SIZE, CANVAS_SIZE), (0, 0, 0, 0))
    b_draw = ImageDraw.Draw(body)
    
    # Gradient render
    grad = Image.new("RGBA", (CANVAS_SIZE, CANVAS_SIZE), (0, 0, 0, 0))
    gr_draw = ImageDraw.Draw(grad)
    for y in range(CANVAS_SIZE):
        t = y / CANVAS_SIZE
        # Hermite smoothing
        t_smooth = t * t * (3 - 2 * t)
        r = int(bg_top[0] * (1 - t_smooth) + bg_bot[0] * t_smooth)
        g = int(bg_top[1] * (1 - t_smooth) + bg_bot[1] * t_smooth)
        b = int(bg_top[2] * (1 - t_smooth) + bg_bot[2] * t_smooth)
        a = int(bg_top[3] * (1 - t_smooth) + bg_bot[3] * t_smooth)
        gr_draw.line([(0, y), (CANVAS_SIZE, y)], fill=(r, g, b, a))

    # Mask to squircle
    mask = Image.new("L", (CANVAS_SIZE, CANVAS_SIZE), 0)
    m_draw = ImageDraw.Draw(mask)
    m_draw.rounded_rectangle(bbox, radius=CORNER_RADIUS, fill=255)
    
    body = Image.composite(grad, body, mask)
    canvas = Image.alpha_composite(canvas, body)

    # 3. Inner Shadow / Ambient Depth Occlusion
    inner_shadow = Image.new("RGBA", (CANVAS_SIZE, CANVAS_SIZE), (0, 0, 0, 0))
    is_draw = ImageDraw.Draw(inner_shadow)
    is_draw.rounded_rectangle([PADDING + 3, PADDING + 3, CANVAS_SIZE - PADDING - 3, CANVAS_SIZE - PADDING - 3], radius=CORNER_RADIUS - 3, outline=(0, 0, 0, 180), width=12)
    inner_shadow = inner_shadow.filter(ImageFilter.GaussianBlur(10))
    inner_shadow = Image.composite(inner_shadow, Image.new("RGBA", (CANVAS_SIZE, CANVAS_SIZE), (0, 0, 0, 0)), mask)
    canvas = Image.alpha_composite(canvas, inner_shadow)

    # 4. Specular Curved Glass Glare (Apple VisionOS / 3D Glass Arc)
    glare = Image.new("RGBA", (CANVAS_SIZE, CANVAS_SIZE), (0, 0, 0, 0))
    gl_draw = ImageDraw.Draw(glare)
    # Parabolic top glare ellipse
    gl_draw.ellipse([PADDING + 20, PADDING + 12, CANVAS_SIZE - PADDING - 20, PADDING + 220], fill=(255, 255, 255, 45))
    glare = glare.filter(ImageFilter.GaussianBlur(16))
    glare = Image.composite(glare, Image.new("RGBA", (CANVAS_SIZE, CANVAS_SIZE), (0, 0, 0, 0)), mask)
    canvas = Image.alpha_composite(canvas, glare)

    # 5. Dual-Tone 3D Metallic / Beveled Rim Stroke
    rim = Image.new("RGBA", (CANVAS_SIZE, CANVAS_SIZE), (0, 0, 0, 0))
    r_draw = ImageDraw.Draw(rim)
    # Top-left bright stroke
    r_draw.rounded_rectangle(bbox, radius=CORNER_RADIUS, outline=rim_top, width=4)
    # Bottom-right shadow stroke
    r_draw.arc([PADDING, PADDING, CANVAS_SIZE - PADDING, CANVAS_SIZE - PADDING], start=45, end=135, fill=rim_bot, width=4)
    r_draw.arc([PADDING, PADDING, CANVAS_SIZE - PADDING, CANVAS_SIZE - PADDING], start=0, end=90, fill=rim_bot, width=4)
    canvas = Image.alpha_composite(canvas, rim)

    return canvas

def make_circular_artwork_badge(img_path, size=290, glow_color=(251, 191, 36, 160), rim_color=(251, 191, 36, 220)):
    """Helper to crop authentic art into a 3D glass medallion with glowing rim."""
    im = Image.open(img_path).convert("RGBA")
    # Crop center square
    min_dim = min(im.width, im.height)
    left = (im.width - min_dim) // 2
    top = (im.height - min_dim) // 2
    im_sq = im.crop((left, top, left + min_dim, top + min_dim))
    im_scaled = im_sq.resize((size, size), Image.Resampling.LANCZOS)

    # Create circular mask
    mask = Image.new("L", (size, size), 0)
    m_draw = ImageDraw.Draw(mask)
    m_draw.ellipse([4, 4, size - 4, size - 4], fill=255)
    mask = mask.filter(ImageFilter.GaussianBlur(1.5))

    badge = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    badge.paste(im_scaled, (0, 0), mask)

    # Add 3D glass bevel & rim
    rim = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    r_draw = ImageDraw.Draw(rim)
    r_draw.ellipse([4, 4, size - 4, size - 4], outline=rim_color, width=4)
    r_draw.ellipse([8, 8, size - 8, size - 8], outline=(255, 255, 255, 90), width=1)
    
    # Specular curved highlight on glass badge
    r_draw.arc([14, 14, size - 14, size - 14], start=210, end=330, fill=(255, 255, 255, 160), width=3)

    badge = Image.alpha_composite(badge, rim)
    return badge

# ==============================================================================
#  ICON BUILDERS
# ==============================================================================

def build_icon_zoth_studio():
    """Authentic 3D Golden Azoth Seal (zoth-golden-z-512.png / emblem)"""
    base = create_glass_squircle_base(
        bg_top=(45, 30, 10, 255),
        bg_bot=(8, 6, 2, 255),
        glow_color=(251, 191, 36, 90),
        rim_top=(254, 240, 138, 230),
        rim_bot=(180, 83, 9, 160)
    )
    
    # Check for master golden emblem
    p = get_asset_path("brand/zoth-golden-z-emblem.png") or get_asset_path("brand/zoth-golden-z-512.png")
    if p:
        emblem = Image.open(p).convert("RGBA")
        e_size = 340
        emblem_scaled = emblem.resize((e_size, e_size), Image.Resampling.LANCZOS)
        
        # Golden drop shadow
        sh = Image.new("RGBA", (e_size + 40, e_size + 40), (0, 0, 0, 0))
        sh_mask = emblem_scaled.split()[3]
        sh_solid = Image.new("RGBA", (e_size, e_size), (251, 191, 36, 160))
        sh_solid.putalpha(sh_mask)
        sh.paste(sh_solid, (20, 20))
        sh = sh.filter(ImageFilter.GaussianBlur(14))
        
        pos = (CANVAS_SIZE - e_size) // 2
        base.paste(sh, (pos - 20, pos - 20), sh)
        base.paste(emblem_scaled, (pos, pos), emblem_scaled)
    else:
        # Vector fallback
        d = ImageDraw.Draw(base)
        d.ellipse([100, 100, 412, 412], outline=(251, 191, 36, 220), width=6)
    
    return base

def build_icon_zoth_ai():
    """Aether neural crystal orb (azoth-aether.jpg / azoth-quantum-orb.jpg)"""
    base = create_glass_squircle_base(
        bg_top=(8, 28, 38, 255),
        bg_bot=(2, 8, 14, 255),
        glow_color=(0, 243, 255, 90),
        rim_top=(56, 189, 248, 230),
        rim_bot=(5, 150, 105, 160)
    )
    
    p = get_asset_path("mascot/azoth-aether.jpg") or get_asset_path("mascot/azoth-quantum-orb.jpg")
    if p:
        badge = make_circular_artwork_badge(p, size=300, glow_color=(0, 243, 255, 180), rim_color=(0, 243, 255, 230))
        pos = (CANVAS_SIZE - 300) // 2
        
        # Neural rings & nodes around orb
        rings = Image.new("RGBA", (CANVAS_SIZE, CANVAS_SIZE), (0, 0, 0, 0))
        rd = ImageDraw.Draw(rings)
        cx, cy = CANVAS_SIZE // 2, CANVAS_SIZE // 2
        for r in [170, 195]:
            rd.ellipse([cx - r, cy - r, cx + r, cy + r], outline=(0, 255, 157, 100), width=2)
        # 6 neural nodes
        for angle in range(0, 360, 60):
            rad = math.radians(angle)
            nx = cx + math.cos(rad) * 195
            ny = cy + math.sin(rad) * 195
            rd.ellipse([nx - 6, ny - 6, nx + 6, ny + 6], fill=(0, 255, 157, 240))
        
        base = Image.alpha_composite(base, rings)
        base.paste(badge, (pos, pos), badge)
    
    return base

def build_icon_zoth_sec():
    """Cyberpunk offensive shield with phosphor glow (cyber_security_badge / strike shield)"""
    base = create_glass_squircle_base(
        bg_top=(38, 10, 18, 255),
        bg_bot=(8, 2, 5, 255),
        glow_color=(239, 68, 68, 90),
        rim_top=(248, 113, 113, 230),
        rim_bot=(0, 255, 136, 140)
    )
    
    p = get_asset_path("generated/cyber_security_badge_1786718112180.jpg")
    if p:
        badge = make_circular_artwork_badge(p, size=290, glow_color=(239, 68, 68, 180), rim_color=(239, 68, 68, 230))
        pos = (CANVAS_SIZE - 290) // 2
        
        # Cyber strike crosshair overlay
        ov = Image.new("RGBA", (CANVAS_SIZE, CANVAS_SIZE), (0, 0, 0, 0))
        od = ImageDraw.Draw(ov)
        cx, cy = CANVAS_SIZE // 2, CANVAS_SIZE // 2
        
        # Outer Hexagon
        pts = []
        for i in range(6):
            ang = math.radians(60 * i - 30)
            pts.append((cx + math.cos(ang) * 185, cy + math.sin(ang) * 185))
        od.polygon(pts, outline=(0, 255, 136, 160), width=3)
        
        # Crosshair lines
        od.line([(cx, cy - 205), (cx, cy - 150)], fill=(0, 255, 136, 220), width=3)
        od.line([(cx, cy + 150), (cx, cy + 205)], fill=(0, 255, 136, 220), width=3)
        od.line([(cx - 205, cy), (cx - 150, cy)], fill=(0, 255, 136, 220), width=3)
        od.line([(cx + 150, cy), (cx + 205, cy)], fill=(0, 255, 136, 220), width=3)
        
        base = Image.alpha_composite(base, ov)
        base.paste(badge, (pos, pos), badge)
    
    return base

def build_icon_zoth_ghost():
    """GhostByte NullAI avatar in dark glass (ghostbyte-nullai-icon.png)"""
    base = create_glass_squircle_base(
        bg_top=(26, 12, 42, 255),
        bg_bot=(5, 2, 10, 255),
        glow_color=(168, 85, 247, 95),
        rim_top=(192, 132, 252, 230),
        rim_bot=(0, 243, 255, 160)
    )
    
    p = get_asset_path("mascot/ghostbyte-nullai-icon.png") or get_asset_path("mascot/azoth-ghostbyte.jpg")
    if p:
        im = Image.open(p).convert("RGBA")
        i_size = 310
        im_scaled = im.resize((i_size, int(i_size * (im.height / im.width))), Image.Resampling.LANCZOS)
        
        # Violet bloom drop shadow
        sh = Image.new("RGBA", (im_scaled.width + 40, im_scaled.height + 40), (0, 0, 0, 0))
        sh_mask = im_scaled.split()[3]
        sh_solid = Image.new("RGBA", im_scaled.size, (168, 85, 247, 180))
        sh_solid.putalpha(sh_mask)
        sh.paste(sh_solid, (20, 20))
        sh = sh.filter(ImageFilter.GaussianBlur(16))
        
        pos_x = (CANVAS_SIZE - im_scaled.width) // 2
        pos_y = (CANVAS_SIZE - im_scaled.height) // 2
        
        # Telemetry circles
        tel = Image.new("RGBA", (CANVAS_SIZE, CANVAS_SIZE), (0, 0, 0, 0))
        td = ImageDraw.Draw(tel)
        cx, cy = CANVAS_SIZE // 2, CANVAS_SIZE // 2
        td.ellipse([cx - 180, cy - 180, cx + 180, cy + 180], outline=(168, 85, 247, 80), width=2)
        base = Image.alpha_composite(base, tel)

        base.paste(sh, (pos_x - 20, pos_y - 20), sh)
        base.paste(im_scaled, (pos_x, pos_y), im_scaled)
    
    return base

def build_icon_zoth_mode():
    """Alchemical transmutation triad (3 glowing glass orbs connected by alchemical energy)"""
    base = create_glass_squircle_base(
        bg_top=(22, 14, 38, 255),
        bg_bot=(4, 3, 10, 255),
        glow_color=(56, 189, 248, 85),
        rim_top=(56, 189, 248, 230),
        rim_bot=(168, 85, 247, 160)
    )
    
    triad = Image.new("RGBA", (CANVAS_SIZE, CANVAS_SIZE), (0, 0, 0, 0))
    td = ImageDraw.Draw(triad)
    cx, cy = CANVAS_SIZE // 2, CANVAS_SIZE // 2 + 10
    
    # 3 nodes positions: Top (Gold), Bottom Left (Emerald), Bottom Right (Cyan/Purple)
    r_triad = 120
    p1 = (cx, cy - r_triad)
    p2 = (int(cx - r_triad * math.cos(math.radians(30))), int(cy + r_triad * math.sin(math.radians(30))))
    p3 = (int(cx + r_triad * math.cos(math.radians(30))), int(cy + r_triad * math.sin(math.radians(30))))
    
    # Connecting energetic lines
    td.line([p1, p2], fill=(0, 255, 157, 180), width=4)
    td.line([p2, p3], fill=(0, 243, 255, 180), width=4)
    td.line([p3, p1], fill=(251, 191, 36, 180), width=4)
    
    # Inner transmutation seal
    td.ellipse([cx - 50, cy - 50, cx + 50, cy + 50], outline=(255, 255, 255, 140), width=2)
    td.ellipse([cx - 16, cy - 16, cx + 16, cy + 16], fill=(254, 240, 138, 240))
    
    # Function to draw 3D glass sphere
    def draw_orb(pos, base_color, highlight_color, radius=48):
        ox, oy = pos
        # Glow
        for r in range(radius + 20, radius, -3):
            td.ellipse([ox - r, oy - r, ox + r, oy + r], outline=(*base_color[:3], 30), width=2)
        # Base fill
        td.ellipse([ox - radius, oy - radius, ox + radius, oy + radius], fill=base_color)
        # Rim
        td.ellipse([ox - radius, oy - radius, ox + radius, oy + radius], outline=(255, 255, 255, 160), width=2)
        # Specular shine
        td.ellipse([ox - radius//2, oy - radius*3//4, ox + radius//3, oy - radius//6], fill=highlight_color)

    draw_orb(p1, (251, 191, 36, 230), (255, 255, 255, 190), 46)
    draw_orb(p2, (0, 255, 157, 230), (255, 255, 255, 190), 46)
    draw_orb(p3, (168, 85, 247, 230), (255, 255, 255, 190), 46)
    
    base = Image.alpha_composite(base, triad)
    return base

def build_icon_hermes():
    """Hermes winged talisman (azoth-hermes.jpg)"""
    base = create_glass_squircle_base(
        bg_top=(26, 32, 10, 255),
        bg_bot=(5, 8, 2, 255),
        glow_color=(234, 179, 8, 90),
        rim_top=(254, 240, 138, 230),
        rim_bot=(113, 63, 18, 160)
    )
    
    p = get_asset_path("mascot/azoth-hermes.jpg")
    if p:
        badge = make_circular_artwork_badge(p, size=280, glow_color=(234, 179, 8, 180), rim_color=(254, 240, 138, 230))
        pos = (CANVAS_SIZE - 280) // 2
        
        # Golden wings & sunburst
        wings = Image.new("RGBA", (CANVAS_SIZE, CANVAS_SIZE), (0, 0, 0, 0))
        wd = ImageDraw.Draw(wings)
        cx, cy = CANVAS_SIZE // 2, CANVAS_SIZE // 2
        
        # Solar rays
        for angle in range(0, 360, 30):
            rad = math.radians(angle)
            x1 = cx + math.cos(rad) * 150
            y1 = cy + math.sin(rad) * 150
            x2 = cx + math.cos(rad) * 190
            y2 = cy + math.sin(rad) * 190
            wd.line([(x1, y1), (x2, y2)], fill=(251, 191, 36, 120), width=3)
        
        base = Image.alpha_composite(base, wings)
        base.paste(badge, (pos, pos), badge)
    
    return base

def build_icon_claude_code():
    """Claude 8-pointed starburst / prompt spark in 3D glass"""
    base = create_glass_squircle_base(
        bg_top=(45, 20, 8, 255),
        bg_bot=(10, 4, 2, 255),
        glow_color=(249, 115, 22, 90),
        rim_top=(253, 186, 116, 230),
        rim_bot=(154, 52, 18, 160)
    )
    
    fg = Image.new("RGBA", (CANVAS_SIZE, CANVAS_SIZE), (0, 0, 0, 0))
    fd = ImageDraw.Draw(fg)
    cx, cy = CANVAS_SIZE // 2, CANVAS_SIZE // 2
    
    # 8-pointed starburst
    outer_r = 160
    inner_r = 65
    points = []
    for i in range(16):
        r = outer_r if i % 2 == 0 else inner_r
        ang = math.radians(i * (360 / 16) - 90)
        points.append((cx + math.cos(ang) * r, cy + math.sin(ang) * r))
    
    # Shadow
    sh = Image.new("RGBA", (CANVAS_SIZE, CANVAS_SIZE), (0, 0, 0, 0))
    sh_d = ImageDraw.Draw(sh)
    sh_d.polygon(points, fill=(249, 115, 22, 180))
    sh = sh.filter(ImageFilter.GaussianBlur(16))
    base = Image.alpha_composite(base, sh)

    fd.polygon(points, fill=(249, 115, 22, 240), outline=(254, 240, 138, 240), width=4)
    # Core crystal
    fd.ellipse([cx - 36, cy - 36, cx + 36, cy + 36], fill=(254, 240, 138, 255), outline=(255, 255, 255, 255), width=3)
    
    base = Image.alpha_composite(base, fg)
    return base

def build_icon_openai_codex():
    """Codex emerald spiral knot geometry in 3D glass"""
    base = create_glass_squircle_base(
        bg_top=(10, 36, 22, 255),
        bg_bot=(2, 10, 6, 255),
        glow_color=(16, 185, 129, 90),
        rim_top=(110, 231, 183, 230),
        rim_bot=(4, 120, 87, 160)
    )
    
    fg = Image.new("RGBA", (CANVAS_SIZE, CANVAS_SIZE), (0, 0, 0, 0))
    fd = ImageDraw.Draw(fg)
    cx, cy = CANVAS_SIZE // 2, CANVAS_SIZE // 2
    
    # Concentric spiral arcs
    for r in [150, 120, 90]:
        fd.ellipse([cx - r, cy - r, cx + r, cy + r], outline=(16, 185, 129, 200), width=6)
    
    # 6-fold radial spiral petals
    for i in range(6):
        ang = math.radians(60 * i)
        x2 = cx + math.cos(ang) * 150
        y2 = cy + math.sin(ang) * 150
        fd.line([(cx, cy), (x2, y2)], fill=(52, 211, 153, 220), width=4)
        fd.ellipse([x2 - 10, y2 - 10, x2 + 10, y2 + 10], fill=(110, 231, 183, 255))
    
    fd.ellipse([cx - 30, cy - 30, cx + 30, cy + 30], fill=(52, 211, 153, 255), outline=(255, 255, 255, 220), width=3)
    
    base = Image.alpha_composite(base, fg)
    return base

def build_icon_opencode():
    """Cyberpunk OpenCode brackets < / > in electric cyan glass"""
    base = create_glass_squircle_base(
        bg_top=(8, 30, 45, 255),
        bg_bot=(2, 8, 14, 255),
        glow_color=(0, 243, 255, 90),
        rim_top=(56, 189, 248, 230),
        rim_bot=(0, 255, 136, 160)
    )
    
    fg = Image.new("RGBA", (CANVAS_SIZE, CANVAS_SIZE), (0, 0, 0, 0))
    fd = ImageDraw.Draw(fg)
    
    # Left Bracket <
    fd.line([(180, 160), (100, 256), (180, 352)], fill=(0, 243, 255, 240), width=18)
    # Right Bracket >
    fd.line([(332, 160), (412, 256), (332, 352)], fill=(0, 243, 255, 240), width=18)
    # Slash /
    fd.line([(286, 140), (226, 372)], fill=(0, 255, 136, 240), width=16)
    
    base = Image.alpha_composite(base, fg)
    return base

def build_icon_grok_ai():
    """Grok futuristic monochrome & cyan slash in obsidian glass"""
    base = create_glass_squircle_base(
        bg_top=(26, 26, 28, 255),
        bg_bot=(5, 5, 7, 255),
        glow_color=(255, 255, 255, 70),
        rim_top=(255, 255, 255, 240),
        rim_bot=(51, 65, 85, 160)
    )
    
    fg = Image.new("RGBA", (CANVAS_SIZE, CANVAS_SIZE), (0, 0, 0, 0))
    fd = ImageDraw.Draw(fg)
    
    # Grok Chevron Poly
    fd.polygon([(140, 380), (300, 132), (380, 132), (220, 380)], fill=(255, 255, 255, 240))
    fd.polygon([(310, 380), (390, 256), (350, 256), (270, 380)], fill=(0, 243, 255, 240))
    
    base = Image.alpha_composite(base, fg)
    return base

def build_icon_zoth_agent():
    """Tactical AI Agent Telemetry HUD"""
    base = create_glass_squircle_base(
        bg_top=(8, 36, 28, 255),
        bg_bot=(2, 10, 8, 255),
        glow_color=(0, 255, 136, 90),
        rim_top=(110, 231, 183, 230),
        rim_bot=(0, 243, 255, 160)
    )
    
    fg = Image.new("RGBA", (CANVAS_SIZE, CANVAS_SIZE), (0, 0, 0, 0))
    fd = ImageDraw.Draw(fg)
    cx, cy = CANVAS_SIZE // 2, CANVAS_SIZE // 2
    
    # Radar dials & crosshair
    fd.ellipse([cx - 160, cy - 160, cx + 160, cy + 160], outline=(0, 255, 136, 180), width=4)
    fd.ellipse([cx - 110, cy - 110, cx + 110, cy + 110], outline=(0, 243, 255, 160), width=2)
    fd.ellipse([cx - 50, cy - 50, cx + 50, cy + 50], fill=(0, 255, 136, 220), outline=(255, 255, 255, 230), width=3)
    
    # Crosshairs
    fd.line([(cx - 180, cy), (cx - 70, cy)], fill=(0, 243, 255, 220), width=4)
    fd.line([(cx + 70, cy), (cx + 180, cy)], fill=(0, 243, 255, 220), width=4)
    fd.line([(cx, cy - 180), (cx, cy - 70)], fill=(0, 243, 255, 220), width=4)
    fd.line([(cx, cy + 70), (cx, cy + 180)], fill=(0, 243, 255, 220), width=4)
    
    base = Image.alpha_composite(base, fg)
    return base

def build_icon_zoth_matrix():
    """Hermetic Matrix Digital Rain in Emerald Glass"""
    base = create_glass_squircle_base(
        bg_top=(4, 28, 12, 255),
        bg_bot=(1, 8, 3, 255),
        glow_color=(0, 255, 136, 95),
        rim_top=(110, 231, 183, 230),
        rim_bot=(5, 150, 105, 160)
    )
    
    fg = Image.new("RGBA", (CANVAS_SIZE, CANVAS_SIZE), (0, 0, 0, 0))
    fd = ImageDraw.Draw(fg)
    
    # Big central PSI glyph
    cx, cy = CANVAS_SIZE // 2, CANVAS_SIZE // 2
    fd.ellipse([cx - 150, cy - 150, cx + 150, cy + 150], outline=(0, 255, 136, 100), width=2)
    
    # Draw stylized central Psi / Alchemical Trident
    fd.line([(cx, cy - 140), (cx, cy + 140)], fill=(255, 255, 255, 240), width=10)
    fd.arc([cx - 100, cy - 100, cx + 100, cy + 60], start=0, end=180, fill=(0, 255, 136, 240), width=8)
    fd.line([(cx - 100, cy - 100), (cx - 100, cy - 20)], fill=(0, 255, 136, 240), width=8)
    fd.line([(cx + 100, cy - 100), (cx + 100, cy - 20)], fill=(0, 255, 136, 240), width=8)
    
    base = Image.alpha_composite(base, fg)
    return base

def build_icon_zoth_tool_nexus():
    """Terminal Tool Nexus & Workbench"""
    base = create_glass_squircle_base(
        bg_top=(18, 28, 42, 255),
        bg_bot=(4, 6, 12, 255),
        glow_color=(56, 189, 248, 85),
        rim_top=(254, 240, 138, 230),
        rim_bot=(14, 116, 144, 160)
    )
    
    fg = Image.new("RGBA", (CANVAS_SIZE, CANVAS_SIZE), (0, 0, 0, 0))
    fd = ImageDraw.Draw(fg)
    
    # Prompt >_
    fd.line([(120, 180), (220, 256), (120, 332)], fill=(251, 191, 36, 240), width=18)
    fd.line([(250, 332), (380, 332)], fill=(0, 243, 255, 240), width=18)
    
    # Subtle circuitry header dots
    for x in [120, 160, 200]:
        fd.ellipse([x - 10, 130 - 10, x + 10, 130 + 10], fill=(0, 255, 157, 220))
    
    base = Image.alpha_composite(base, fg)
    return base

def build_icon_zoth_live_wallpaper():
    """Cyber Waveform & CRT Beams"""
    base = create_glass_squircle_base(
        bg_top=(8, 30, 36, 255),
        bg_bot=(2, 8, 10, 255),
        glow_color=(0, 243, 255, 90),
        rim_top=(56, 189, 248, 230),
        rim_bot=(251, 191, 36, 160)
    )
    
    fg = Image.new("RGBA", (CANVAS_SIZE, CANVAS_SIZE), (0, 0, 0, 0))
    fd = ImageDraw.Draw(fg)
    
    # Waveform path
    pts = [
        (80, 256), (150, 256), (190, 140), (240, 370),
        (290, 170), (340, 320), (380, 256), (432, 256)
    ]
    for i in range(len(pts) - 1):
        fd.line([pts[i], pts[i+1]], fill=(0, 243, 255, 240), width=12)
    
    for p in [(190, 140), (240, 370), (290, 170)]:
        fd.ellipse([p[0] - 12, p[1] - 12, p[0] + 12, p[1] + 12], fill=(251, 191, 36, 255))
    
    base = Image.alpha_composite(base, fg)
    return base

# Registry of Icon Builders & Aliases
BUILDERS = {
    "zoth-studio": build_icon_zoth_studio,
    "zoth-cockpit": build_icon_zoth_studio,
    "zoth-ai": build_icon_zoth_ai,
    "zoth-sec": build_icon_zoth_sec,
    "hexstrike": build_icon_zoth_sec,
    "hexstrike-ai": build_icon_zoth_sec,
    "zoth-ghost": build_icon_zoth_ghost,
    "nullai": build_icon_zoth_ghost,
    "nullai-ghostmode": build_icon_zoth_ghost,
    "zoth-mode": build_icon_zoth_mode,
    "hermes": build_icon_hermes,
    "hermes-agent": build_icon_hermes,
    "claude-code": build_icon_claude_code,
    "openai-codex": build_icon_openai_codex,
    "opencode": build_icon_opencode,
    "grok-ai": build_icon_grok_ai,
    "zoth-agent": build_icon_zoth_agent,
    "zoth-agent-hud": build_icon_zoth_agent,
    "zoth-matrix": build_icon_zoth_matrix,
    "zoth-tool-nexus": build_icon_zoth_tool_nexus,
    "zoth-live-wallpaper": build_icon_zoth_live_wallpaper,
    
    # Aliases & System icons
    "zothos": build_icon_zoth_studio,
    "zoth": build_icon_zoth_studio,
    "zoth-logo": build_icon_zoth_studio,
    "distributor-logo": build_icon_zoth_studio,
    "start-here": build_icon_zoth_studio,
    "security-high": build_icon_zoth_sec,
    "utilities-terminal": build_icon_zoth_tool_nexus,
}

# SVG representations for scalable fallback
SVG_TEMPLATES = {
    "zoth-studio": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <radialGradient id="bg" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#2d1e0a"/>
      <stop offset="100%" stop-color="#050401"/>
    </radialGradient>
    <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fef08a"/>
      <stop offset="50%" stop-color="#fbbf24"/>
      <stop offset="100%" stop-color="#b45309"/>
    </linearGradient>
  </defs>
  <rect x="32" y="32" width="448" height="448" rx="104" fill="url(#bg)" stroke="url(#gold)" stroke-width="8"/>
  <circle cx="256" cy="256" r="140" fill="none" stroke="url(#gold)" stroke-width="6"/>
  <path d="M168,160 L344,160 L200,352 L360,352" fill="none" stroke="url(#gold)" stroke-width="28" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="256" cy="256" r="24" fill="#00f3ff"/>
</svg>""",
}

def export_icon(name, master_img, target_dirs, pixmaps_dir):
    """Exports master 512x512 image to all required PNG resolutions and directories."""
    print(f"  [+] Deploying 3D glass icon: {name}")
    
    for theme_dir in target_dirs:
        for size in SIZES:
            s_dir = os.path.join(theme_dir, f"{size}x{size}", "apps")
            os.makedirs(s_dir, exist_ok=True)
            
            scaled = master_img.resize((size, size), Image.Resampling.LANCZOS)
            out_file = os.path.join(s_dir, f"{name}.png")
            scaled.save(out_file, "PNG", optimize=True)

        # Scalable SVG
        svg_dir = os.path.join(theme_dir, "scalable", "apps")
        os.makedirs(svg_dir, exist_ok=True)
        svg_file = os.path.join(svg_dir, f"{name}.svg")
        svg_content = SVG_TEMPLATES.get(name, SVG_TEMPLATES.get("zoth-studio"))
        with open(svg_file, "w") as sf:
            sf.write(svg_content)

    # Pixmaps copy (128x128 high fidelity)
    if pixmaps_dir:
        os.makedirs(pixmaps_dir, exist_ok=True)
        p128 = master_img.resize((128, 128), Image.Resampling.LANCZOS)
        p128.save(os.path.join(pixmaps_dir, f"{name}.png"), "PNG", optimize=True)

def main():
    print("======================================================")
    print("   ⚡ ZOTHOS 3D GLASSMORPHIC ICON SUITE GENERATOR     ")
    print("======================================================")
    
    target_themes = [
        os.path.join(CHROOT_ICONS, "hicolor"),
        os.path.join(CHROOT_ICONS, "Zoth-Hermetic"),
        os.path.join(LOCAL_ICONS, "hicolor"),
        os.path.join(LOCAL_ICONS, "Zoth-Hermetic"),
    ]
    
    # Pre-render each unique builder
    rendered_masters = {}
    for name, builder_fn in BUILDERS.items():
        if builder_fn not in rendered_masters:
            rendered_masters[builder_fn] = builder_fn()
        
        master_img = rendered_masters[builder_fn]
        export_icon(name, master_img, target_themes, CHROOT_PIXMAPS)

    # Update GTK Icon Caches if available
    for theme_dir in target_themes:
        if os.path.exists(theme_dir):
            if shutil.which("gtk-update-icon-cache"):
                os.system(f"gtk-update-icon-cache -f -t '{theme_dir}' >/dev/null 2>&1 || true")

    print("\n[✓] All 3D Glassmorphic Icon Sets deployed successfully!")

if __name__ == "__main__":
    main()
