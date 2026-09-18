#!/usr/bin/env python3
"""
Generate ultra-luxurious, modern glassmorphic SVG icons for ZOTHOS.
"""

import os
import subprocess

ICONS_DIR = "/home/neo/zothos/config/includes.chroot/usr/share/icons/Zoth-Hermetic"
SCALABLE_DIR = os.path.join(ICONS_DIR, "scalable/apps")
DIR_48 = os.path.join(ICONS_DIR, "48x48/apps")
DIR_128 = os.path.join(ICONS_DIR, "128x128/apps")

for d in [SCALABLE_DIR, DIR_48, DIR_128]:
    os.makedirs(d, exist_ok=True)

ICON_DEFS = {
    "zoth-tool-nexus": {
        "accent": "#00ff9d",
        "gold": "#ffd700",
        "symbol": """
            <circle cx="64" cy="64" r="32" fill="none" stroke="#00ff9d" stroke-width="4" stroke-dasharray="8 4"/>
            <polygon points="64,28 95,82 33,82" fill="none" stroke="#ffd700" stroke-width="4"/>
            <circle cx="64" cy="64" r="8" fill="#00ff9d"/>
            <path d="M64,16 L64,28 M64,100 L64,112 M16,64 L28,64 M100,64 L112,64" stroke="#00ff9d" stroke-width="3" stroke-linecap="round"/>
        """
    },
    "zoth-studio": {
        "accent": "#ffd700",
        "gold": "#00e5ff",
        "symbol": """
            <polygon points="64,20 102,86 26,86" fill="none" stroke="#00e5ff" stroke-width="3" opacity="0.6"/>
            <polygon points="64,108 102,42 26,42" fill="none" stroke="#ffd700" stroke-width="3" opacity="0.6"/>
            <path d="M44,40 L84,40 L48,88 L88,88" fill="none" stroke="#ffd700" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
            <circle cx="64" cy="64" r="6" fill="#00e5ff"/>
        """
    },
    "zoth-cockpit": {
        "accent": "#00e5ff",
        "gold": "#00ff9d",
        "symbol": """
            <rect x="30" y="32" width="68" height="52" rx="10" fill="#060d16" stroke="#00e5ff" stroke-width="3"/>
            <polyline points="38,58 48,58 56,42 66,74 74,52 82,58 90,58" fill="none" stroke="#00ff9d" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
            <circle cx="42" cy="74" r="3" fill="#00e5ff"/>
            <circle cx="52" cy="74" r="3" fill="#ffd700"/>
            <circle cx="62" cy="74" r="3" fill="#00ff9d"/>
        """
    },
    "zoth-ai": {
        "accent": "#a855f7",
        "gold": "#ec4899",
        "symbol": """
            <circle cx="64" cy="64" r="26" fill="none" stroke="#a855f7" stroke-width="4"/>
            <circle cx="64" cy="40" r="5" fill="#ec4899"/>
            <circle cx="44" cy="76" r="5" fill="#ec4899"/>
            <circle cx="84" cy="76" r="5" fill="#ec4899"/>
            <line x1="64" y1="40" x2="44" y2="76" stroke="#a855f7" stroke-width="2"/>
            <line x1="64" y1="40" x2="84" y2="76" stroke="#a855f7" stroke-width="2"/>
            <line x1="44" y1="76" x2="84" y2="76" stroke="#a855f7" stroke-width="2"/>
            <circle cx="64" cy="64" r="8" fill="#ffd700"/>
        """
    },
    "zoth-sec": {
        "accent": "#ff0055",
        "gold": "#ffd700",
        "symbol": """
            <path d="M64,22 L94,36 C94,68 64,104 64,104 C64,104 34,68 34,36 Z" fill="#14050a" stroke="#ff0055" stroke-width="4"/>
            <path d="M64,36 L64,88" stroke="#ffd700" stroke-width="3" stroke-linecap="round"/>
            <circle cx="64" cy="56" r="10" fill="none" stroke="#ff0055" stroke-width="3"/>
            <circle cx="64" cy="56" r="4" fill="#ffd700"/>
        """
    },
    "zoth-ghost": {
        "accent": "#00ff9d",
        "gold": "#38bdf8",
        "symbol": """
            <path d="M36,60 C36,42 48,30 64,30 C80,30 92,42 92,60 L92,94 L80,84 L64,94 L48,84 L36,94 Z" fill="#05120d" stroke="#00ff9d" stroke-width="4" stroke-linejoin="round"/>
            <circle cx="52" cy="54" r="5" fill="#00ff9d"/>
            <circle cx="76" cy="54" r="5" fill="#00ff9d"/>
        """
    },
    "zoth-mode": {
        "accent": "#3b82f6",
        "gold": "#00ff9d",
        "symbol": """
            <path d="M64,24 A40,40 0 0,0 64,104 L64,24 Z" fill="#00ff9d" opacity="0.8"/>
            <path d="M64,24 A40,40 0 0,1 64,104 L64,24 Z" fill="none" stroke="#3b82f6" stroke-width="4"/>
            <circle cx="64" cy="64" r="40" fill="none" stroke="#ffffff" stroke-width="3"/>
        """
    },
    "zoth-mcp": {
        "accent": "#f59e0b",
        "gold": "#00ff9d",
        "symbol": """
            <circle cx="64" cy="64" r="14" fill="#060d16" stroke="#f59e0b" stroke-width="4"/>
            <circle cx="64" cy="28" r="8" fill="#00ff9d"/>
            <circle cx="95" cy="82" r="8" fill="#00e5ff"/>
            <circle cx="33" cy="82" r="8" fill="#f59e0b"/>
            <line x1="64" y1="36" x2="64" y2="50" stroke="#00ff9d" stroke-width="3"/>
            <line x1="88" y1="78" x2="76" y2="71" stroke="#00e5ff" stroke-width="3"/>
            <line x1="40" y1="78" x2="52" y2="71" stroke="#f59e0b" stroke-width="3"/>
        """
    },
    "hermes-agent": {
        "accent": "#f59e0b",
        "gold": "#ffd700",
        "symbol": """
            <path d="M64,20 L64,108 M44,48 C44,32 84,32 84,48 C84,64 44,64 44,80 C44,96 84,96 84,80" fill="none" stroke="#ffd700" stroke-width="6" stroke-linecap="round"/>
            <circle cx="64" cy="20" r="6" fill="#f59e0b"/>
            <polygon points="34,36 44,48 24,48" fill="#ffd700"/>
            <polygon points="94,36 104,48 84,48" fill="#ffd700"/>
        """
    },
    "claude-code": {
        "accent": "#d97706",
        "gold": "#ea580c",
        "symbol": """
            <polygon points="64,24 74,52 104,52 80,70 89,98 64,80 39,98 48,70 24,52 54,52" fill="url(#goldGrad)" stroke="#d97706" stroke-width="2"/>
        """
    },
    "openai-codex": {
        "accent": "#10b981",
        "gold": "#059669",
        "symbol": """
            <circle cx="64" cy="64" r="34" fill="none" stroke="#10b981" stroke-width="5"/>
            <path d="M50,48 L36,64 L50,80 M78,48 L92,64 L78,80 M70,44 L58,84" fill="none" stroke="#ffffff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
        """
    },
    "hexstrike-ai": {
        "accent": "#ef4444",
        "gold": "#f97316",
        "symbol": """
            <polygon points="64,24 98,44 98,84 64,104 30,84 30,44" fill="#180608" stroke="#ef4444" stroke-width="4"/>
            <path d="M64,36 L64,92 M36,64 L92,64" stroke="#f97316" stroke-width="4" stroke-linecap="round"/>
            <circle cx="64" cy="64" r="8" fill="#ef4444"/>
        """
    },
    "grok-ai": {
        "accent": "#ffffff",
        "gold": "#38bdf8",
        "symbol": """
            <path d="M42,92 L86,36 M86,36 L70,36 M86,36 L86,52" fill="none" stroke="#38bdf8" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
            <line x1="42" y1="36" x2="62" y2="60" stroke="#ffffff" stroke-width="5" stroke-linecap="round"/>
        """
    },
    "opencode": {
        "accent": "#00ff9d",
        "gold": "#38bdf8",
        "symbol": """
            <rect x="28" y="28" width="72" height="72" rx="14" fill="#040810" stroke="#00ff9d" stroke-width="3"/>
            <path d="M48,50 L38,64 L48,78 M80,50 L90,64 L80,78 M68,46 L60,82" fill="none" stroke="#38bdf8" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
        """
    },
    "zoth-agent-hud": {
        "accent": "#00ff9d",
        "gold": "#00e5ff",
        "symbol": """
            <circle cx="64" cy="64" r="38" fill="none" stroke="#00ff9d" stroke-width="2" stroke-dasharray="6 3"/>
            <circle cx="64" cy="64" r="22" fill="none" stroke="#00e5ff" stroke-width="3"/>
            <line x1="64" y1="20" x2="64" y2="108" stroke="#00ff9d" stroke-width="2"/>
            <line x1="20" y1="64" x2="108" y2="64" stroke="#00ff9d" stroke-width="2"/>
            <circle cx="76" cy="52" r="4" fill="#ffd700"/>
        """
    }
}

for name, data in ICON_DEFS.items():
    svg_content = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
  <defs>
    <radialGradient id="bgGrad" cx="50%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#182234"/>
      <stop offset="60%" stop-color="#0b101a"/>
      <stop offset="100%" stop-color="#04070d"/>
    </radialGradient>
    <linearGradient id="rimGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="{data['accent']}" stop-opacity="0.8"/>
      <stop offset="50%" stop-color="{data['gold']}" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="#04070d" stop-opacity="0.9"/>
    </linearGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffd700"/>
      <stop offset="100%" stop-color="#ea580c"/>
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="#000000" flood-opacity="0.7"/>
    </filter>
  </defs>

  <!-- Squircle Base with Metallic Rim -->
  <rect x="10" y="10" width="108" height="108" rx="26" fill="url(#bgGrad)" stroke="url(#rimGrad)" stroke-width="3" filter="url(#shadow)"/>
  
  <!-- Subtle Inner Top Highlight -->
  <path d="M 24 13 Q 64 16 104 13" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" opacity="0.3"/>

  <!-- Center Vector Glyph -->
  {data['symbol']}
</svg>"""

    svg_path = os.path.join(SCALABLE_DIR, f"{name}.svg")
    with open(svg_path, "w") as f:
        f.write(svg_content)

print(f"Generated {len(ICON_DEFS)} ultra-premium glassmorphic icons in {SCALABLE_DIR}")
