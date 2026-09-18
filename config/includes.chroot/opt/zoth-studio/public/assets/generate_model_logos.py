import os

logos = {
    "nous-research.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
  <defs>
    <linearGradient id="nousGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffaa40"/>
      <stop offset="100%" stop-color="#ff007a"/>
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>
  <rect width="100" height="100" rx="20" fill="#0b0e1a"/>
  <!-- Celestial Geometric Dragon Emblem -->
  <polygon points="50,15 82,34 82,66 50,85 18,66 18,34" stroke="url(#nousGrad)" stroke-width="3" fill="none" filter="url(#glow)"/>
  <circle cx="50" cy="50" r="14" fill="url(#nousGrad)" opacity="0.25"/>
  <polygon points="50,28 68,50 50,72 32,50" fill="url(#nousGrad)"/>
  <circle cx="50" cy="50" r="4" fill="#ffffff"/>
</svg>""",

    "deepseek.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
  <defs>
    <linearGradient id="dsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00f0ff"/>
      <stop offset="100%" stop-color="#4d6bfe"/>
    </linearGradient>
  </defs>
  <rect width="100" height="100" rx="20" fill="#060b18"/>
  <!-- Oceanic Deep Wave Whale Tail -->
  <path d="M50 20 C65 20, 80 35, 80 50 C80 68, 65 78, 50 82 C35 78, 20 68, 20 50 C20 35, 35 20, 50 20 Z" stroke="url(#dsGrad)" stroke-width="2.5" fill="none"/>
  <path d="M32 45 C42 45, 48 32, 50 26 C52 32, 58 45, 68 45 C60 55, 40 55, 32 45 Z" fill="url(#dsGrad)"/>
  <circle cx="50" cy="62" r="5" fill="#00f0ff"/>
</svg>""",

    "xai-grok.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
  <defs>
    <linearGradient id="grokGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00d4aa"/>
      <stop offset="100%" stop-color="#00f0ff"/>
    </linearGradient>
  </defs>
  <rect width="100" height="100" rx="20" fill="#040810"/>
  <!-- Cyber X Slash & Kitsune Flame -->
  <path d="M25 25 L75 75 M75 25 L25 75" stroke="url(#grokGrad)" stroke-width="7" stroke-linecap="round"/>
  <polygon points="50,20 60,35 40,35" fill="#00d4aa"/>
  <circle cx="50" cy="50" r="8" fill="#040810" stroke="#00f0ff" stroke-width="3"/>
</svg>""",

    "anthropic-claude.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
  <defs>
    <linearGradient id="claudeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#d4a27f"/>
      <stop offset="100%" stop-color="#f59e0b"/>
    </linearGradient>
  </defs>
  <rect width="100" height="100" rx="20" fill="#120e0a"/>
  <!-- Claude Kinetic Asterisk Spark -->
  <path d="M50 16 L50 84 M16 50 L84 50 M26 26 L74 74 M26 74 L74 26" stroke="url(#claudeGrad)" stroke-width="6" stroke-linecap="round"/>
  <circle cx="50" cy="50" r="7" fill="#ffffff"/>
</svg>""",

    "google-gemini.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
  <defs>
    <linearGradient id="gemGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#7c9cff"/>
      <stop offset="100%" stop-color="#ff007a"/>
    </linearGradient>
  </defs>
  <rect width="100" height="100" rx="20" fill="#080c1e"/>
  <!-- 4-Point Cosmic Diamond Star -->
  <path d="M50 15 C50 35, 65 50, 85 50 C65 50, 50 65, 50 85 C50 65, 35 50, 15 50 C35 50, 50 35, 50 15 Z" fill="url(#gemGrad)"/>
  <circle cx="50" cy="50" r="6" fill="#ffffff"/>
</svg>""",

    "cerebras-wafer.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
  <defs>
    <linearGradient id="cerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f59e0b"/>
      <stop offset="100%" stop-color="#ef4444"/>
    </linearGradient>
  </defs>
  <rect width="100" height="100" rx="20" fill="#140a08"/>
  <!-- Giant Wafer Scale Microchip Grid -->
  <rect x="22" y="22" width="56" height="56" rx="8" stroke="url(#cerGrad)" stroke-width="3" fill="none"/>
  <circle cx="36" cy="36" r="4" fill="#f59e0b"/>
  <circle cx="64" cy="36" r="4" fill="#f59e0b"/>
  <circle cx="36" cy="64" r="4" fill="#f59e0b"/>
  <circle cx="64" cy="64" r="4" fill="#f59e0b"/>
  <path d="M50 30 L50 70 M30 50 L70 50" stroke="url(#cerGrad)" stroke-width="2.5"/>
</svg>"""
}

target_dir = "/media/neo/f2fdda77-178b-4603-ae80-c7aa4cd97908/13-creative-media/zoth/public/assets/logos"
for name, svg_content in logos.items():
    path = os.path.join(target_dir, name)
    with open(path, "w", encoding="utf-8") as f:
        f.write(svg_content)
    print(f"Generated logo: {path}")

