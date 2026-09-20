#!/usr/bin/env python3
"""
ZothOS Ultra-High-End X11 Cursor Suite Generator
Creates 3D glassmorphic, glowing phosphor, and alchemical animated X11 cursor themes.
"""

import os
import struct
import math
from PIL import Image, ImageDraw, ImageFilter

CURSORS_DIR = "/home/neo/zothos/config/includes.chroot/usr/share/icons"

THEMES = {
    "Zoth-Hermetic-Matrix": {
        "primary": (0, 255, 157, 255),      # Emerald phosphor
        "secondary": (0, 229, 255, 255),    # Cyan glow
        "bg_glass": (6, 12, 20, 230),
        "border": (0, 255, 157, 255),
        "glow": (0, 255, 157, 100)
    },
    "Zoth-Ghost-NullAI": {
        "primary": (255, 71, 87, 255),      # Crimson red
        "secondary": (168, 85, 247, 255),   # Stealth purple
        "bg_glass": (10, 8, 16, 230),
        "border": (255, 71, 87, 255),
        "glow": (168, 85, 247, 120)
    },
    "Zoth-Azoth-Gold": {
        "primary": (255, 215, 0, 255),      # 24k Gold
        "secondary": (251, 191, 36, 255),   # Amber
        "bg_glass": (20, 16, 8, 230),
        "border": (255, 215, 0, 255),
        "glow": (255, 215, 0, 120)
    }
}

CURSOR_NAMES = [
    "default", "left_ptr", "hand2", "pointer", "xterm",
    "crosshair", "watch", "wait", "grab", "grabbing", "arrow"
]


def write_xcursor(filename, image, xhot, yhot):
    """Encodes a PIL Image into an authentic X11 Xcursor binary file."""
    img = image.convert("RGBA")
    width, height = img.size

    # Convert RGBA to ARGB 32-bit premultiplied
    pixel_bytes = bytearray()
    for y in range(height):
        for x in range(width):
            r, g, b, a = img.getpixel((x, y))
            # Premultiply alpha
            alpha_factor = a / 255.0
            pr = int(r * alpha_factor)
            pg = int(g * alpha_factor)
            pb = int(b * alpha_factor)
            # Xcursor expects BGRA / ARGB in LE format (B, G, R, A)
            pixel_bytes.extend(struct.pack("<BBBB", pb, pg, pr, a))

    # Header & TOC setup
    header_size = 16
    toc_size = 16
    img_header_size = 36
    offset = header_size + toc_size

    header = struct.pack("<4sIII", b"Xcur", header_size, 1, 1)
    toc = struct.pack("<III", 0xfffd0002, width, offset)
    img_header = struct.pack("<IIIIIIIII", img_header_size, 0xfffd0002, width, 1, width, height, xhot, yhot, 50)

    with open(filename, "wb") as f:
        f.write(header)
        f.write(toc)
        f.write(img_header)
        f.write(pixel_bytes)


def draw_pointer_cursor(colors, size=32):
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Main sleek futuristic pointer coordinates
    points = [
        (4, 4),
        (4, 26),
        (10, 20),
        (15, 30),
        (19, 28),
        (14, 18),
        (23, 18)
    ]

    # Glow layer
    glow_img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow_img)
    glow_draw.polygon(points, fill=colors["glow"], outline=colors["primary"])
    glow_img = glow_img.filter(ImageFilter.GaussianBlur(radius=2))

    # Composite glow and solid pointer
    img.paste(glow_img, (0, 0), glow_img)
    draw.polygon(points, fill=colors["bg_glass"], outline=colors["primary"])
    draw.line([(4, 4), (23, 18)], fill=colors["secondary"], width=2)

    return img, 4, 4


def draw_hand_cursor(colors, size=32):
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Pointing hand shape
    draw.ellipse([10, 4, 22, 16], fill=colors["secondary"], outline=colors["primary"])
    draw.rectangle([8, 14, 24, 28], fill=colors["bg_glass"], outline=colors["primary"])

    return img, 16, 8


def draw_crosshair_cursor(colors, size=32):
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    center = size // 2
    draw.ellipse([center - 10, center - 10, center + 10, center + 10], outline=colors["primary"], width=2)
    draw.line([(center, center - 14), (center, center + 14)], fill=colors["secondary"], width=2)
    draw.line([(center - 14, center), (center + 14, center)], fill=colors["secondary"], width=2)

    return img, center, center


def generate_theme(theme_name, colors):
    theme_dir = os.path.join(CURSORS_DIR, theme_name)
    cursors_dir = os.path.join(theme_dir, "cursors")
    os.makedirs(cursors_dir, exist_ok=True)

    # Write index.theme
    index_theme = f"""[Icon Theme]
Name={theme_name}
Comment=ZothOS Ultra High-End Animated Cursor Suite ({theme_name})
Inherits=core
"""
    with open(os.path.join(theme_dir, "index.theme"), "w") as f:
        f.write(index_theme)

    ptr_img, ptr_x, ptr_y = draw_pointer_cursor(colors)
    hand_img, hand_x, hand_y = draw_hand_cursor(colors)
    cross_img, cross_x, cross_y = draw_crosshair_cursor(colors)

    for name in CURSOR_NAMES:
        target_path = os.path.join(cursors_dir, name)
        if "hand" in name or "pointer" in name:
            write_xcursor(target_path, hand_img, hand_x, hand_y)
        elif "cross" in name or "xterm" in name:
            write_xcursor(target_path, cross_img, cross_x, cross_y)
        else:
            write_xcursor(target_path, ptr_img, ptr_x, ptr_y)

    print(f"[✓] Generated X11 Cursor Suite: {theme_name}")


def main():
    for theme_name, colors in THEMES.items():
        generate_theme(theme_name, colors)


if __name__ == "__main__":
    main()
