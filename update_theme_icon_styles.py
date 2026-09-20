#!/usr/bin/env python3
"""
Appends high-contrast desktop icon selection and hover rules to all ZothOS GTK themes.
"""

import os

THEMES_DIR = "/home/neo/zothos/config/includes.chroot/usr/share/themes"

STYLES = {
    "Zoth-Hermetic-Matrix": """
/* ── XFCE Desktop Icon Selection & Hover Effects (Emerald Phosphor) ────────── */
XfdesktopIconView.view {
    background-color: transparent;
    color: #e2e8f0;
    font-family: "JetBrains Mono", monospace;
    font-weight: 700;
    font-size: 11px;
}
XfdesktopIconView.view .label {
    background-color: rgba(6, 9, 14, 0.88);
    border: 1px solid rgba(0, 255, 157, 0.25);
    border-radius: 8px;
    padding: 4px 10px;
    transition: all 150ms cubic-bezier(0.16, 1, 0.3, 1);
}
XfdesktopIconView.view .label:hover {
    background-color: rgba(0, 255, 157, 0.25);
    border-color: #00ff9d;
    color: #ffffff;
    box-shadow: 0 0 20px rgba(0, 255, 157, 0.6);
}
XfdesktopIconView.view:selected,
XfdesktopIconView.view .label:selected,
XfdesktopIconView.view:active,
XfdesktopIconView.view .label:active {
    background-color: rgba(0, 255, 157, 0.45);
    background-image: linear-gradient(135deg, rgba(0, 255, 157, 0.55), rgba(0, 229, 255, 0.35));
    border: 2px solid #00ff9d;
    border-radius: 8px;
    color: #ffffff;
    text-shadow: 0 0 10px #00ff9d;
    box-shadow: 0 0 35px rgba(0, 255, 157, 0.85);
}
""",
    "Zoth-Ghost-NullAI": """
/* ── XFCE Desktop Icon Selection & Hover Effects (NullAI Crimson) ──────────── */
XfdesktopIconView.view {
    background-color: transparent;
    color: #f1f5f9;
    font-family: "JetBrains Mono", monospace;
    font-weight: 700;
    font-size: 11px;
}
XfdesktopIconView.view .label {
    background-color: rgba(10, 8, 16, 0.88);
    border: 1px solid rgba(255, 71, 87, 0.3);
    border-radius: 8px;
    padding: 4px 10px;
    transition: all 150ms cubic-bezier(0.16, 1, 0.3, 1);
}
XfdesktopIconView.view .label:hover {
    background-color: rgba(255, 71, 87, 0.25);
    border-color: #ff4757;
    color: #ffffff;
    box-shadow: 0 0 20px rgba(255, 71, 87, 0.6);
}
XfdesktopIconView.view:selected,
XfdesktopIconView.view .label:selected,
XfdesktopIconView.view:active,
XfdesktopIconView.view .label:active {
    background-color: rgba(255, 71, 87, 0.45);
    background-image: linear-gradient(135deg, rgba(255, 71, 87, 0.55), rgba(168, 85, 247, 0.35));
    border: 2px solid #ff4757;
    border-radius: 8px;
    color: #ffffff;
    text-shadow: 0 0 10px #ff4757;
    box-shadow: 0 0 35px rgba(255, 71, 87, 0.85);
}
""",
    "Zoth-Azoth-Gold": """
/* ── XFCE Desktop Icon Selection & Hover Effects (24K Gold) ─────────────────── */
XfdesktopIconView.view {
    background-color: transparent;
    color: #f1f5f9;
    font-family: "JetBrains Mono", monospace;
    font-weight: 700;
    font-size: 11px;
}
XfdesktopIconView.view .label {
    background-color: rgba(20, 16, 8, 0.88);
    border: 1px solid rgba(255, 215, 0, 0.3);
    border-radius: 8px;
    padding: 4px 10px;
    transition: all 150ms cubic-bezier(0.16, 1, 0.3, 1);
}
XfdesktopIconView.view .label:hover {
    background-color: rgba(255, 215, 0, 0.25);
    border-color: #ffd700;
    color: #ffffff;
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.6);
}
XfdesktopIconView.view:selected,
XfdesktopIconView.view .label:selected,
XfdesktopIconView.view:active,
XfdesktopIconView.view .label:active {
    background-color: rgba(255, 215, 0, 0.45);
    background-image: linear-gradient(135deg, rgba(255, 215, 0, 0.55), rgba(251, 191, 36, 0.35));
    border: 2px solid #ffd700;
    border-radius: 8px;
    color: #ffffff;
    text-shadow: 0 0 10px #ffd700;
    box-shadow: 0 0 35px rgba(255, 215, 0, 0.85);
}
""",
    "Zoth-Incognito-Win11": """
/* ── XFCE Desktop Icon Selection & Hover Effects (Win11 Blue) ───────────────── */
XfdesktopIconView.view {
    background-color: transparent;
    color: #f1f5f9;
    font-family: "Segoe UI", sans-serif;
    font-weight: 600;
    font-size: 11px;
}
XfdesktopIconView.view .label {
    background-color: rgba(15, 23, 42, 0.85);
    border: 1px solid rgba(59, 130, 246, 0.3);
    border-radius: 6px;
    padding: 4px 10px;
    transition: all 150ms ease;
}
XfdesktopIconView.view .label:hover {
    background-color: rgba(59, 130, 246, 0.25);
    border-color: #3b82f6;
    color: #ffffff;
    box-shadow: 0 0 15px rgba(59, 130, 246, 0.5);
}
XfdesktopIconView.view:selected,
XfdesktopIconView.view .label:selected,
XfdesktopIconView.view:active,
XfdesktopIconView.view .label:active {
    background-color: rgba(59, 130, 246, 0.45);
    background-image: linear-gradient(135deg, rgba(59, 130, 246, 0.55), rgba(0, 229, 255, 0.35));
    border: 2px solid #3b82f6;
    border-radius: 6px;
    color: #ffffff;
    text-shadow: 0 0 10px #3b82f6;
    box-shadow: 0 0 30px rgba(59, 130, 246, 0.85);
}
"""
}

def main():
    for theme_name, css_content in STYLES.items():
        theme_path = os.path.join(THEMES_DIR, theme_name, "gtk-3.0/gtk.css")
        if os.path.exists(theme_path):
            with open(theme_path, "r") as f:
                existing = f.read()
            # Remove previous appended selection rules if present
            idx = existing.find("/* ── XFCE Desktop Icon Selection")
            if idx != -1:
                existing = existing[:idx].rstrip() + "\n"
            with open(theme_path, "w") as f:
                f.write(existing.rstrip() + "\n" + css_content + "\n")
            print(f"[✓] Updated icon selection CSS: {theme_name}")

if __name__ == "__main__":
    main()
