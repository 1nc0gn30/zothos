#!/usr/bin/env python3
import os
import subprocess

ICONS = {
    "zoth-studio": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
  <defs>
    <radialGradient id="bg" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#0e1726"/>
      <stop offset="100%" stop-color="#02040a"/>
    </radialGradient>
    <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fef08a"/>
      <stop offset="50%" stop-color="#fbbf24"/>
      <stop offset="100%" stop-color="#b45309"/>
    </linearGradient>
    <filter id="glow">
      <feGaussianBlur stdDeviation="3" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <rect width="128" height="128" rx="28" fill="url(#bg)" stroke="#fbbf24" stroke-width="2.5" stroke-opacity="0.6"/>
  <!-- Alchemical Hexagram -->
  <polygon points="64,18 104,86 24,86" fill="none" stroke="#00f3ff" stroke-width="2" stroke-opacity="0.4"/>
  <polygon points="64,110 104,42 24,42" fill="none" stroke="#fbbf24" stroke-width="2" stroke-opacity="0.4"/>
  <!-- Zoth Z Stylized Glyph -->
  <path d="M42,38 L86,38 L50,90 L90,90" fill="none" stroke="url(#gold)" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" filter="url(#glow)"/>
  <!-- Inner Core Orb -->
  <circle cx="64" cy="64" r="7" fill="#00f3ff" filter="url(#glow)"/>
</svg>""",

    "zoth-agent": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
  <defs>
    <radialGradient id="bg_agent" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#061a12"/>
      <stop offset="100%" stop-color="#02040a"/>
    </radialGradient>
    <linearGradient id="emerald_grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#6ee7b7"/>
      <stop offset="50%" stop-color="#00ff88"/>
      <stop offset="100%" stop-color="#059669"/>
    </linearGradient>
    <filter id="glow_green">
      <feGaussianBlur stdDeviation="3.5" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <rect width="128" height="128" rx="28" fill="url(#bg_agent)" stroke="#00ff88" stroke-width="2.5" stroke-opacity="0.7"/>
  <!-- AI Agent Neural Nodes & Hexagon -->
  <polygon points="64,20 102,42 102,86 64,108 26,86 26,42" fill="none" stroke="#00ff88" stroke-width="3" stroke-dasharray="6,4" stroke-opacity="0.8"/>
  <circle cx="64" cy="64" r="16" fill="url(#emerald_grad)" filter="url(#glow_green)"/>
  <circle cx="64" cy="64" r="28" fill="none" stroke="#00f3ff" stroke-width="1.5" stroke-dasharray="4,4"/>
  <!-- Connectors -->
  <line x1="64" y1="20" x2="64" y2="48" stroke="#00ff88" stroke-width="2"/>
  <line x1="64" y1="80" x2="64" y2="108" stroke="#00ff88" stroke-width="2"/>
  <line x1="26" y1="64" x2="48" y2="64" stroke="#00ff88" stroke-width="2"/>
  <line x1="80" y1="64" x2="102" y2="64" stroke="#00ff88" stroke-width="2"/>
</svg>""",

    "zoth-agent-hud": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
  <defs>
    <radialGradient id="bg_hud" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#041822"/>
      <stop offset="100%" stop-color="#02040a"/>
    </radialGradient>
    <filter id="glow_hud">
      <feGaussianBlur stdDeviation="3" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <rect width="128" height="128" rx="28" fill="url(#bg_hud)" stroke="#00f3ff" stroke-width="2.5" stroke-opacity="0.7"/>
  <!-- HUD Crosshairs & Rings -->
  <circle cx="64" cy="64" r="42" fill="none" stroke="#00f3ff" stroke-width="2" stroke-opacity="0.5"/>
  <circle cx="64" cy="64" r="30" fill="none" stroke="#00ff88" stroke-width="2.5" stroke-dasharray="8,6" filter="url(#glow_hud)"/>
  <circle cx="64" cy="64" r="10" fill="#00f3ff" filter="url(#glow_hud)"/>
  <!-- Crosshair Reticle -->
  <line x1="14" y1="64" x2="38" y2="64" stroke="#00f3ff" stroke-width="2.5"/>
  <line x1="90" y1="64" x2="114" y2="64" stroke="#00f3ff" stroke-width="2.5"/>
  <line x1="64" y1="14" x2="64" y2="38" stroke="#00f3ff" stroke-width="2.5"/>
  <line x1="64" y1="90" x2="64" y2="114" stroke="#00f3ff" stroke-width="2.5"/>
</svg>""",

    "hermes-agent": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
  <defs>
    <radialGradient id="bg_hermes" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#141a06"/>
      <stop offset="100%" stop-color="#02040a"/>
    </radialGradient>
    <filter id="glow_gold">
      <feGaussianBlur stdDeviation="3" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <rect width="128" height="128" rx="28" fill="url(#bg_hermes)" stroke="#fbbf24" stroke-width="2.5" stroke-opacity="0.7"/>
  <!-- Winged Helm / Caduceus staff -->
  <path d="M64,22 L64,106" stroke="#fbbf24" stroke-width="4" stroke-linecap="round" filter="url(#glow_gold)"/>
  <!-- Intertwined Energy Serpents -->
  <path d="M42,50 Q64,36 86,50 Q64,64 42,78 Q64,92 86,78" fill="none" stroke="#00ff88" stroke-width="3" filter="url(#glow_gold)"/>
  <circle cx="64" cy="22" r="7" fill="#fbbf24" filter="url(#glow_gold)"/>
  <!-- Wings -->
  <path d="M64,34 C40,20 20,40 24,60 C40,55 55,45 64,34 Z" fill="#fbbf24" fill-opacity="0.8"/>
  <path d="M64,34 C88,20 108,40 104,60 C88,55 73,45 64,34 Z" fill="#fbbf24" fill-opacity="0.8"/>
</svg>""",

    "claude-code": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
  <defs>
    <radialGradient id="bg_claude" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#241408"/>
      <stop offset="100%" stop-color="#02040a"/>
    </radialGradient>
    <filter id="glow_claude">
      <feGaussianBlur stdDeviation="3" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <rect width="128" height="128" rx="28" fill="url(#bg_claude)" stroke="#f97316" stroke-width="2.5" stroke-opacity="0.7"/>
  <!-- Claude 8-Pointed Starburst / Prompt Spark -->
  <path d="M64,22 L68,54 L100,50 L76,72 L92,100 L64,82 L36,100 L52,72 L28,50 L60,54 Z" fill="#f97316" filter="url(#glow_claude)"/>
  <circle cx="64" cy="64" r="9" fill="#fef08a"/>
</svg>""",

    "openai-codex": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
  <defs>
    <radialGradient id="bg_codex" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#051c14"/>
      <stop offset="100%" stop-color="#02040a"/>
    </radialGradient>
    <filter id="glow_codex">
      <feGaussianBlur stdDeviation="3" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <rect width="128" height="128" rx="28" fill="url(#bg_codex)" stroke="#10b981" stroke-width="2.5" stroke-opacity="0.7"/>
  <!-- Spiral Knot Geometry -->
  <g transform="translate(64,64)" filter="url(#glow_codex)">
    <path d="M0,-36 C18,-36 36,-18 36,0 C36,10 30,18 20,24 L0,12 L-20,24 C-30,18 -36,10 -36,0 C-36,-18 -18,-36 0,-36 Z" fill="none" stroke="#10b981" stroke-width="4.5"/>
    <circle cx="0" cy="0" r="8" fill="#34d399"/>
  </g>
</svg>""",

    "opencode": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
  <defs>
    <radialGradient id="bg_opencode" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#041620"/>
      <stop offset="100%" stop-color="#02040a"/>
    </radialGradient>
    <filter id="glow_opencode">
      <feGaussianBlur stdDeviation="3" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <rect width="128" height="128" rx="28" fill="url(#bg_opencode)" stroke="#00f3ff" stroke-width="2.5" stroke-opacity="0.7"/>
  <!-- Terminal Brackets < / > -->
  <path d="M42,42 L24,64 L42,86" fill="none" stroke="#00f3ff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" filter="url(#glow_opencode)"/>
  <path d="M86,42 L104,64 L86,86" fill="none" stroke="#00f3ff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" filter="url(#glow_opencode)"/>
  <line x1="70" y1="36" x2="58" y2="92" stroke="#00ff88" stroke-width="5" stroke-linecap="round" filter="url(#glow_opencode)"/>
</svg>""",

    "grok-ai": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
  <defs>
    <radialGradient id="bg_grok" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#141416"/>
      <stop offset="100%" stop-color="#02040a"/>
    </radialGradient>
    <filter id="glow_grok">
      <feGaussianBlur stdDeviation="3" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <rect width="128" height="128" rx="28" fill="url(#bg_grok)" stroke="#ffffff" stroke-width="2" stroke-opacity="0.6"/>
  <!-- Grok Futuristic Slash / Chevron -->
  <polygon points="34,96 74,32 94,32 54,96" fill="#ffffff" filter="url(#glow_grok)"/>
  <polygon points="78,96 98,64 88,64 68,96" fill="#00f3ff" filter="url(#glow_grok)"/>
</svg>""",

    "hexstrike-ai": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
  <defs>
    <radialGradient id="bg_hexstrike" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#240810"/>
      <stop offset="100%" stop-color="#02040a"/>
    </radialGradient>
    <filter id="glow_hex">
      <feGaussianBlur stdDeviation="3" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <rect width="128" height="128" rx="28" fill="url(#bg_hexstrike)" stroke="#ef4444" stroke-width="2.5" stroke-opacity="0.7"/>
  <!-- Shield with Strike Cross -->
  <polygon points="64,22 104,38 104,78 64,106 24,78 24,38" fill="none" stroke="#ef4444" stroke-width="3" filter="url(#glow_hex)"/>
  <!-- Cyber Crosshair / Sword -->
  <line x1="64" y1="34" x2="64" y2="94" stroke="#ffffff" stroke-width="4" stroke-linecap="round"/>
  <line x1="40" y1="52" x2="88" y2="52" stroke="#ffffff" stroke-width="4" stroke-linecap="round"/>
  <circle cx="64" cy="64" r="8" fill="#ef4444" filter="url(#glow_hex)"/>
</svg>""",

    "zoth-cockpit": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
  <defs>
    <radialGradient id="bg_cockpit" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#081420"/>
      <stop offset="100%" stop-color="#02040a"/>
    </radialGradient>
    <filter id="glow_cockpit">
      <feGaussianBlur stdDeviation="3" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <rect width="128" height="128" rx="28" fill="url(#bg_cockpit)" stroke="#00f3ff" stroke-width="2.5" stroke-opacity="0.7"/>
  <!-- Terminal Cockpit Multi-Grid Gauges -->
  <rect x="24" y="24" width="36" height="36" rx="6" fill="none" stroke="#00ff88" stroke-width="2"/>
  <rect x="68" y="24" width="36" height="36" rx="6" fill="none" stroke="#00f3ff" stroke-width="2"/>
  <rect x="24" y="68" width="80" height="36" rx="6" fill="none" stroke="#fbbf24" stroke-width="2"/>
  <!-- Internal Indicators -->
  <line x1="30" y1="42" x2="54" y2="42" stroke="#00ff88" stroke-width="3"/>
  <circle cx="86" cy="42" r="8" fill="#00f3ff"/>
  <line x1="32" y1="86" x2="84" y2="86" stroke="#fbbf24" stroke-width="4" stroke-dasharray="6,4"/>
</svg>""",

    "zoth-sec": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
  <defs>
    <radialGradient id="bg_sec" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#1c0a1a"/>
      <stop offset="100%" stop-color="#02040a"/>
    </radialGradient>
    <filter id="glow_sec">
      <feGaussianBlur stdDeviation="3" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <rect width="128" height="128" rx="28" fill="url(#bg_sec)" stroke="#d946ef" stroke-width="2.5" stroke-opacity="0.7"/>
  <!-- Trident & Cyber Dragon Crest -->
  <polygon points="64,20 84,54 44,54" fill="#d946ef" filter="url(#glow_sec)"/>
  <path d="M64,54 L64,106" stroke="#d946ef" stroke-width="5" stroke-linecap="round"/>
  <path d="M34,44 Q34,74 64,74 Q94,74 94,44" fill="none" stroke="#00f3ff" stroke-width="3.5" stroke-linecap="round"/>
</svg>""",

    "zoth-ghost": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
  <defs>
    <radialGradient id="bg_ghost" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#180a26"/>
      <stop offset="100%" stop-color="#02040a"/>
    </radialGradient>
    <filter id="glow_ghost">
      <feGaussianBlur stdDeviation="3" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <rect width="128" height="128" rx="28" fill="url(#bg_ghost)" stroke="#a855f7" stroke-width="2.5" stroke-opacity="0.7"/>
  <!-- Spectre Mask & Eye Slots -->
  <path d="M64,24 C40,24 30,44 30,68 C30,94 44,104 64,104 C84,104 98,94 98,68 C98,44 88,24 64,24 Z" fill="none" stroke="#c084fc" stroke-width="3" filter="url(#glow_ghost)"/>
  <!-- Neon Slit Eyes -->
  <polygon points="44,56 56,52 52,62" fill="#00f3ff" filter="url(#glow_ghost)"/>
  <polygon points="84,56 72,52 76,62" fill="#00f3ff" filter="url(#glow_ghost)"/>
  <circle cx="64" cy="80" r="4" fill="#a855f7"/>
</svg>""",

    "zoth-matrix": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
  <defs>
    <radialGradient id="bg_matrix" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#041a0d"/>
      <stop offset="100%" stop-color="#02040a"/>
    </radialGradient>
    <filter id="glow_matrix">
      <feGaussianBlur stdDeviation="3" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <rect width="128" height="128" rx="28" fill="url(#bg_matrix)" stroke="#00ff88" stroke-width="2.5" stroke-opacity="0.7"/>
  <!-- Digital Rain Glyph Columns -->
  <text x="32" y="44" fill="#00ff88" font-family="monospace" font-size="20" font-weight="bold">1</text>
  <text x="32" y="68" fill="#00ff88" font-family="monospace" font-size="20" opacity="0.6">0</text>
  <text x="32" y="92" fill="#00ff88" font-family="monospace" font-size="20" opacity="0.3">1</text>

  <text x="60" y="36" fill="#ffffff" font-family="monospace" font-size="22" font-weight="bold" filter="url(#glow_matrix)">Ψ</text>
  <text x="60" y="62" fill="#00ff88" font-family="monospace" font-size="20">🜂</text>
  <text x="60" y="88" fill="#00ff88" font-family="monospace" font-size="20" opacity="0.7">Ω</text>

  <text x="88" y="48" fill="#00ff88" font-family="monospace" font-size="20">0</text>
  <text x="88" y="74" fill="#ffffff" font-family="monospace" font-size="20" font-weight="bold" filter="url(#glow_matrix)">1</text>
  <text x="88" y="98" fill="#00ff88" font-family="monospace" font-size="20" opacity="0.5">λ</text>
</svg>""",

    "zoth-mode": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
  <defs>
    <radialGradient id="bg_mode" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#161224"/>
      <stop offset="100%" stop-color="#02040a"/>
    </radialGradient>
    <filter id="glow_mode">
      <feGaussianBlur stdDeviation="3" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <rect width="128" height="128" rx="28" fill="url(#bg_mode)" stroke="#38bdf8" stroke-width="2.5" stroke-opacity="0.7"/>
  <!-- Tri-Realm Interconnected Nodes -->
  <circle cx="64" cy="38" r="16" fill="#00ff88" filter="url(#glow_mode)"/>
  <circle cx="38" cy="84" r="16" fill="#a855f7" filter="url(#glow_mode)"/>
  <circle cx="90" cy="84" r="16" fill="#38bdf8" filter="url(#glow_mode)"/>
  <polygon points="64,38 38,84 90,84" fill="none" stroke="#ffffff" stroke-width="2" stroke-dasharray="4,4"/>
</svg>""",

    "zoth-live-wallpaper": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
  <defs>
    <radialGradient id="bg_live" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#08181a"/>
      <stop offset="100%" stop-color="#02040a"/>
    </radialGradient>
    <filter id="glow_live">
      <feGaussianBlur stdDeviation="3" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <rect width="128" height="128" rx="28" fill="url(#bg_live)" stroke="#00f3ff" stroke-width="2.5" stroke-opacity="0.7"/>
  <!-- Waveform & CRT Beams -->
  <path d="M20,64 L36,64 L48,34 L60,94 L72,44 L84,78 L96,64 L108,64" fill="none" stroke="#00f3ff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" filter="url(#glow_live)"/>
  <circle cx="60" cy="94" r="5" fill="#00ff88"/>
  <circle cx="48" cy="34" r="5" fill="#fbbf24"/>
</svg>""",

    "zoth-ai": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
  <defs>
    <radialGradient id="bg_ai" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#101a24"/>
      <stop offset="100%" stop-color="#02040a"/>
    </radialGradient>
    <filter id="glow_ai">
      <feGaussianBlur stdDeviation="3" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <rect width="128" height="128" rx="28" fill="url(#bg_ai)" stroke="#00f3ff" stroke-width="2.5" stroke-opacity="0.7"/>
  <!-- Neural Core Brain Vector -->
  <circle cx="64" cy="64" r="32" fill="none" stroke="#00f3ff" stroke-width="3" stroke-dasharray="6,4" filter="url(#glow_ai)"/>
  <circle cx="64" cy="64" r="14" fill="#00ff88" filter="url(#glow_ai)"/>
  <circle cx="64" cy="32" r="5" fill="#00f3ff"/>
  <circle cx="64" cy="96" r="5" fill="#00f3ff"/>
  <circle cx="32" cy="64" r="5" fill="#00f3ff"/>
  <circle cx="96" cy="64" r="5" fill="#00f3ff"/>
</svg>"""
}

# Directories to write to
ROOT = "/home/neo/zothos/config/includes.chroot/usr/share/icons"
TARGET_DIRS = [
    os.path.join(ROOT, "hicolor"),
    os.path.join(ROOT, "Zoth-Hermetic")
]

for base in TARGET_DIRS:
    svg_dir = os.path.join(base, "scalable", "apps")
    p48_dir = os.path.join(base, "48x48", "apps")
    p128_dir = os.path.join(base, "128x128", "apps")
    os.makedirs(svg_dir, exist_ok=True)
    os.makedirs(p48_dir, exist_ok=True)
    os.makedirs(p128_dir, exist_ok=True)

    for name, svg_data in ICONS.items():
        svg_file = os.path.join(svg_dir, f"{name}.svg")
        with open(svg_file, "w") as f:
            f.write(svg_data)
        
        # Convert SVG to PNG using ImageMagick convert
        p128_file = os.path.join(p128_dir, f"{name}.png")
        p48_file = os.path.join(p48_dir, f"{name}.png")
        
        subprocess.run(["convert", "-background", "none", "-resize", "128x128", svg_file, p128_file], check=False)
        subprocess.run(["convert", "-background", "none", "-resize", "48x48", svg_file, p48_file], check=False)

print("Icons generated successfully!")
