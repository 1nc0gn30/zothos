#!/usr/bin/env python3
import os
import shutil

def generate_matrix_theme(dest_dir):
    os.makedirs(dest_dir, exist_ok=True)
    
    # themerc
    themerc = """# Zoth Hermetic Matrix xfwm4 theme
button_offset=8
button_spacing=4
full_width_title=true
title_horizontal_offset=0
title_vertical_offset_active=2
title_vertical_offset_inactive=2
active_text_color=#00ff9d
active_text_shadow_color=#02040a
inactive_text_color=#64748b
inactive_text_shadow_color=#02040a
title_shadow_active=false
title_shadow_inactive=false
show_frame_shadow=true
show_popup_shadow=true
shadow_delta_height=2
shadow_delta_width=0
shadow_delta_x=0
shadow_delta_y=2
shadow_opacity=60
resize_opacity=100
move_opacity=100
popup_opacity=100
"""
    with open(os.path.join(dest_dir, "themerc"), "w") as f:
        f.write(themerc)

    # First copy base pixmaps from ARK-Dark as template
    src_xfwm = "/usr/share/themes/ARK-Dark/xfwm4"
    if os.path.exists(src_xfwm):
        for f in os.listdir(src_xfwm):
            shutil.copy(os.path.join(src_xfwm, f), os.path.join(dest_dir, f))
    
    # Now customize colors in the XPM files for Matrix Emerald theme
    # Active titlebar background: #060a08, top accent: #00ff9d, inactive: #0b110e
    for root, _, files in os.walk(dest_dir):
        for fname in files:
            if fname.endswith(".xpm"):
                fpath = os.path.join(root, fname)
                with open(fpath, "r") as f:
                    content = f.read()
                
                # Replace colors
                # #21252B / #2F343F -> #060a08 (Obsidian)
                # #353B48 -> #00ff9d (Emerald Neon Top Line)
                if "active" in fname:
                    content = content.replace("#21252B", "#060A08")
                    content = content.replace("#2F343F", "#060A08")
                    content = content.replace("#353B48", "#00FF9D")
                    content = content.replace("#afb8c5", "#00FF9D")
                else:
                    content = content.replace("#21252B", "#0B110E")
                    content = content.replace("#2F343F", "#0B110E")
                    content = content.replace("#353B48", "#1A2B22")
                    content = content.replace("#808791", "#64748B")
                
                with open(fpath, "w") as f:
                    f.write(content)

def generate_ghost_theme(dest_dir):
    os.makedirs(dest_dir, exist_ok=True)
    
    themerc = """# Zoth Ghost NullAI xfwm4 theme
button_offset=8
button_spacing=4
full_width_title=true
title_horizontal_offset=0
title_vertical_offset_active=2
title_vertical_offset_inactive=2
active_text_color=#c084fc
active_text_shadow_color=#02040a
inactive_text_color=#64748b
inactive_text_shadow_color=#02040a
title_shadow_active=false
title_shadow_inactive=false
show_frame_shadow=true
show_popup_shadow=true
shadow_delta_height=2
shadow_delta_width=0
shadow_delta_x=0
shadow_delta_y=2
shadow_opacity=60
resize_opacity=100
move_opacity=100
popup_opacity=100
"""
    with open(os.path.join(dest_dir, "themerc"), "w") as f:
        f.write(themerc)

    src_xfwm = "/usr/share/themes/ARK-Dark/xfwm4"
    if os.path.exists(src_xfwm):
        for f in os.listdir(src_xfwm):
            shutil.copy(os.path.join(src_xfwm, f), os.path.join(dest_dir, f))
    
    for root, _, files in os.walk(dest_dir):
        for fname in files:
            if fname.endswith(".xpm"):
                fpath = os.path.join(root, fname)
                with open(fpath, "r") as f:
                    content = f.read()
                
                if "active" in fname:
                    content = content.replace("#21252B", "#090511")
                    content = content.replace("#2F343F", "#090511")
                    content = content.replace("#353B48", "#A855F7")
                    content = content.replace("#afb8c5", "#C084FC")
                else:
                    content = content.replace("#21252B", "#0E0A17")
                    content = content.replace("#2F343F", "#0E0A17")
                    content = content.replace("#353B48", "#241438")
                    content = content.replace("#808791", "#64748B")
                
                with open(fpath, "w") as f:
                    f.write(content)

def generate_gold_theme(dest_dir):
    os.makedirs(dest_dir, exist_ok=True)
    themerc = """# Zoth Azoth Gold xfwm4 theme
button_offset=8
button_spacing=4
full_width_title=true
title_horizontal_offset=0
title_vertical_offset_active=2
title_vertical_offset_inactive=2
active_text_color=#ffd700
active_text_shadow_color=#0a0802
inactive_text_color=#78716c
inactive_text_shadow_color=#0a0802
title_shadow_active=false
title_shadow_inactive=false
show_frame_shadow=true
show_popup_shadow=true
shadow_delta_height=2
shadow_delta_width=0
shadow_delta_x=0
shadow_delta_y=2
shadow_opacity=65
resize_opacity=100
move_opacity=100
popup_opacity=100
"""
    with open(os.path.join(dest_dir, "themerc"), "w") as f:
        f.write(themerc)

    src_xfwm = "/usr/share/themes/ARK-Dark/xfwm4"
    if os.path.exists(src_xfwm):
        for f in os.listdir(src_xfwm):
            shutil.copy(os.path.join(src_xfwm, f), os.path.join(dest_dir, f))
    
    for root, _, files in os.walk(dest_dir):
        for fname in files:
            if fname.endswith(".xpm"):
                fpath = os.path.join(root, fname)
                with open(fpath, "r") as f:
                    content = f.read()
                
                if "active" in fname:
                    content = content.replace("#21252B", "#0E0B04")
                    content = content.replace("#2F343F", "#0E0B04")
                    content = content.replace("#353B48", "#FBBF24")
                    content = content.replace("#afb8c5", "#FFD700")
                else:
                    content = content.replace("#21252B", "#140F06")
                    content = content.replace("#2F343F", "#140F06")
                    content = content.replace("#353B48", "#332408")
                    content = content.replace("#808791", "#78716C")
                
                with open(fpath, "w") as f:
                    f.write(content)

def generate_win11_theme(dest_dir):
    os.makedirs(dest_dir, exist_ok=True)
    src_xfwm = "/usr/share/themes/Windows 10 Dark/xfwm4"
    if os.path.exists(src_xfwm):
        for f in os.listdir(src_xfwm):
            shutil.copy(os.path.join(src_xfwm, f), os.path.join(dest_dir, f))

if __name__ == "__main__":
    generate_matrix_theme("/home/neo/zothos/config/includes.chroot/usr/share/themes/Zoth-Hermetic-Matrix/xfwm4")
    generate_ghost_theme("/home/neo/zothos/config/includes.chroot/usr/share/themes/Zoth-Ghost-NullAI/xfwm4")
    generate_gold_theme("/home/neo/zothos/config/includes.chroot/usr/share/themes/Zoth-Azoth-Gold/xfwm4")
    generate_win11_theme("/home/neo/zothos/config/includes.chroot/usr/share/themes/Zoth-Incognito-Win11/xfwm4")
    print("XFWM4 themes successfully generated!")
