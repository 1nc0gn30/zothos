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
        "label": "ZothOS Tool Nexus",
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
        "label": "Zoth Studio — Alchemical Neural Hub",
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
        "label": "ZothOS Cockpit — OS Dashboard",
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
        "label": "ZOTH Master MCP — AI Registry",
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
        "label": "ZOTHOS Security Arsenal",
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
        "label": "NullAI Ghostmode — Amnesic Stealth",
        "accent": "#00ff9d",
        "gold": "#38bdf8",
        "symbol": """
            <path d="M36,60 C36,42 48,30 64,30 C80,30 92,42 92,60 L92,94 L80,84 L64,94 L48,84 L36,94 Z" fill="#05120d" stroke="#00ff9d" stroke-width="4" stroke-linejoin="round"/>
            <circle cx="52" cy="54" r="5" fill="#00ff9d"/>
            <circle cx="76" cy="54" r="5" fill="#00ff9d"/>
        """
    },
    "zoth-mode": {
        "label": "Reality Switcher — Matrix / Ghost / Win11",
        "accent": "#3b82f6",
        "gold": "#00ff9d",
        "symbol": """
            <path d="M64,24 A40,40 0 0,0 64,104 L64,24 Z" fill="#00ff9d" opacity="0.8"/>
            <path d="M64,24 A40,40 0 0,1 64,104 L64,24 Z" fill="none" stroke="#3b82f6" stroke-width="4"/>
            <circle cx="64" cy="64" r="40" fill="none" stroke="#ffffff" stroke-width="3"/>
        """
    },
    "zoth-mcp": {
        "label": "ZOTH MCP — Model Context Protocol",
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
        "label": "Hermes Agent — Autonomous Gateway",
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
        "label": "Claude Code — Autonomous Agent",
        "accent": "#d97706",
        "gold": "#ea580c",
        "symbol": """
            <polygon points="64,24 74,52 104,52 80,70 89,98 64,80 39,98 48,70 24,52 54,52" fill="url(#goldGrad)" stroke="#d97706" stroke-width="2"/>
        """
    },
    "openai-codex": {
        "label": "OpenAI Codex — CLI Suite",
        "accent": "#10b981",
        "gold": "#059669",
        "symbol": """
            <circle cx="64" cy="64" r="34" fill="none" stroke="#10b981" stroke-width="5"/>
            <path d="M50,48 L36,64 L50,80 M78,48 L92,64 L78,80 M70,44 L58,84" fill="none" stroke="#ffffff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
        """
    },
    "hexstrike-ai": {
        "label": "HexStrike AI — Security Framework",
        "accent": "#ef4444",
        "gold": "#f97316",
        "symbol": """
            <polygon points="64,24 98,44 98,84 64,104 30,84 30,44" fill="#180608" stroke="#ef4444" stroke-width="4"/>
            <path d="M64,36 L64,92 M36,64 L92,64" stroke="#f97316" stroke-width="4" stroke-linecap="round"/>
            <circle cx="64" cy="64" r="8" fill="#ef4444"/>
        """
    },
    "grok-ai": {
        "label": "Grok AI — xAI Intelligence",
        "accent": "#ffffff",
        "gold": "#38bdf8",
        "symbol": """
            <path d="M42,92 L86,36 M86,36 L70,36 M86,36 L86,52" fill="none" stroke="#38bdf8" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
            <line x1="42" y1="36" x2="62" y2="60" stroke="#ffffff" stroke-width="5" stroke-linecap="round"/>
        """
    },
    "opencode": {
        "label": "OpenCode AI — Programming Agent",
        "accent": "#00ff9d",
        "gold": "#38bdf8",
        "symbol": """
            <rect x="28" y="28" width="72" height="72" rx="14" fill="#040810" stroke="#00ff9d" stroke-width="3"/>
            <path d="M48,50 L38,64 L48,78 M80,50 L90,64 L80,78 M68,46 L60,82" fill="none" stroke="#38bdf8" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
        """
    },
    "zoth-agent-hud": {
        "label": "Zoth Agent HUD — Multi-Ring Controller",
        "accent": "#00ff9d",
        "gold": "#00e5ff",
        "symbol": """
            <circle cx="64" cy="64" r="38" fill="none" stroke="#00ff9d" stroke-width="2" stroke-dasharray="6 3"/>
            <circle cx="64" cy="64" r="22" fill="none" stroke="#00e5ff" stroke-width="3"/>
            <line x1="64" y1="20" x2="64" y2="108" stroke="#00ff9d" stroke-width="2"/>
            <line x1="20" y1="64" x2="108" y2="64" stroke="#00ff9d" stroke-width="2"/>
            <circle cx="76" cy="52" r="4" fill="#ffd700"/>
        """
    },
    # ── NEW 2026 EXPANSION: 12 additional icons ──────────────────────────
    "zoth-matrix-rain": {
        "label": "Matrix Rain — Phosphor Green Terminal",
        "accent": "#00ff9d",
        "gold": "#00e5ff",
        "symbol": """
            <rect x="20" y="16" width="14" height="96" rx="2" fill="#002010" stroke="#00ff9d" stroke-width="1.5" opacity="0.9"/>
            <rect x="38" y="28" width="14" height="84" rx="2" fill="#002010" stroke="#00e5ff" stroke-width="1.5" opacity="0.85"/>
            <rect x="56" y="10" width="14" height="108" rx="2" fill="#002010" stroke="#00ff9d" stroke-width="1.5" opacity="0.9"/>
            <rect x="74" y="40" width="14" height="72" rx="2" fill="#002010" stroke="#00e5ff" stroke-width="1.5" opacity="0.85"/>
            <rect x="92" y="22" width="14" height="90" rx="2" fill="#002010" stroke="#00ff9d" stroke-width="1.5" opacity="0.9"/>
            <line x1="27" y1="20" x2="27" y2="112" stroke="#00ff9d" stroke-width="2" stroke-linecap="round" opacity="0.7"/>
            <line x1="45" y1="32" x2="45" y2="112" stroke="#00e5ff" stroke-width="2" stroke-linecap="round" opacity="0.6"/>
            <line x1="63" y1="14" x2="63" y2="112" stroke="#00ff9d" stroke-width="2" stroke-linecap="round" opacity="0.8"/>
            <line x1="81" y1="44" x2="81" y2="112" stroke="#00e5ff" stroke-width="2" stroke-linecap="round" opacity="0.5"/>
            <line x1="99" y1="26" x2="99" y2="112" stroke="#00ff9d" stroke-width="2" stroke-linecap="round" opacity="0.7"/>
        """
    },
    "zoth-ghost-amnesic": {
        "label": "Ghost Amnesic — Stealth & Anti-Forensics",
        "accent": "#38bdf8",
        "gold": "#00ff9d",
        "symbol": """
            <path d="M64,18 L78,28 L78,46 L64,54 L50,46 L50,28 Z" fill="#0a1a2a" stroke="#38bdf8" stroke-width="3" stroke-linejoin="round"/>
            <path d="M46,50 L78,50 L82,108 L42,108 Z" fill="#001a1a" stroke="#00ff9d" stroke-width="3" stroke-linejoin="round"/>
            <circle cx="64" cy="36" r="6" fill="none" stroke="#00ff9d" stroke-width="2"/>
            <circle cx="64" cy="36" r="2.5" fill="#00ff9d"/>
            <line x1="64" y1="42" x2="64" y2="50" stroke="#38bdf8" stroke-width="2" stroke-linecap="round"/>
            <path d="M52,60 L60,68 L68,60" fill="none" stroke="#00ff9d" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        """
    },
    "zoth-netkill": {
        "label": "NetKill — Firewall Block & Neutralization",
        "accent": "#ff3333",
        "gold": "#ffd700",
        "symbol": """
            <rect x="34" y="28" width="60" height="68" rx="8" fill="#1a0505" stroke="#ff3333" stroke-width="4"/>
            <line x1="42" y1="46" x2="86" y2="46" stroke="#ffd700" stroke-width="5" stroke-linecap="round"/>
            <line x1="42" y1="62" x2="86" y2="62" stroke="#ff3333" stroke-width="5" stroke-linecap="round"/>
            <line x1="42" y1="78" x2="86" y2="78" stroke="#ffd700" stroke-width="5" stroke-linecap="round"/>
            <circle cx="64" cy="62" r="10" fill="none" stroke="#ff3333" stroke-width="4"/>
            <line x1="64" y1="52" x2="64" y2="72" stroke="#ffd700" stroke-width="3" stroke-linecap="round"/>
            <line x1="56" y1="62" x2="72" y2="62" stroke="#ff3333" stroke-width="3" stroke-linecap="round"/>
        """
    },
    "zoth-quicklock": {
        "label": "QuickLock — Panic Lock & Screen Freeze",
        "accent": "#ff0055",
        "gold": "#ffd700",
        "symbol": """
            <circle cx="64" cy="64" r="36" fill="#1a0410" stroke="#ff0055" stroke-width="4"/>
            <rect x="48" y="46" width="32" height="28" rx="4" fill="none" stroke="#ffd700" stroke-width="3"/>
            <circle cx="64" cy="60" r="8" fill="none" stroke="#ff0055" stroke-width="3"/>
            <rect x="60" y="56" width="8" height="8" rx="1" fill="#ffd700"/>
            <line x1="64" y1="30" x2="64" y2="46" stroke="#ff0055" stroke-width="3" stroke-linecap="round"/>
            <line x1="64" y1="82" x2="64" y2="98" stroke="#ff0055" stroke-width="3" stroke-linecap="round"/>
            <line x1="30" y1="64" x2="48" y2="64" stroke="#ffd700" stroke-width="3" stroke-linecap="round"/>
            <line x1="80" y1="64" x2="98" y2="64" stroke="#ffd700" stroke-width="3" stroke-linecap="round"/>
        """
    },
    "zoth-plymouth": {
        "label": "Plymouth Phoenix — Boot Animation",
        "accent": "#ffd700",
        "gold": "#ff8c00",
        "symbol": """
            <path d="M64,20 L80,44 L100,40 L84,58 L96,80 L76,70 L64,94 L52,70 L32,80 L44,58 L28,40 L48,44 Z" fill="#1a0e00" stroke="#ffd700" stroke-width="3" stroke-linejoin="round"/>
            <circle cx="64" cy="56" r="8" fill="#ff8c00"/>
            <circle cx="64" cy="56" r="4" fill="#ffffff"/>
            <line x1="64" y1="16" x2="64" y2="30" stroke="#ffd700" stroke-width="3" stroke-linecap="round"/>
            <line x1="64" y1="80" x2="64" y2="104" stroke="#ff8c00" stroke-width="3" stroke-linecap="round" opacity="0.7"/>
            <path d="M48,40 L52,32 M56,38 L62,30 M64,34 L64,28" stroke="#ffd700" stroke-width="2" stroke-linecap="round" opacity="0.6"/>
        """
    },
    "zoth-cockpit": {
        "label": "ZothOS Cockpit — Dashboard Dials",
        "accent": "#00e5ff",
        "gold": "#00ff9d",
        "symbol": """
            <rect x="24" y="28" width="80" height="56" rx="12" fill="#060d16" stroke="#00e5ff" stroke-width="3"/>
            <circle cx="42" cy="50" r="10" fill="none" stroke="#00ff9d" stroke-width="2"/>
            <circle cx="42" cy="50" r="2" fill="#00ff9d"/>
            <line x1="42" y1="50" x2="42" y2="42" stroke="#00e5ff" stroke-width="2" stroke-linecap="round"/>
            <circle cx="64" cy="50" r="10" fill="none" stroke="#00e5ff" stroke-width="2"/>
            <circle cx="64" cy="50" r="2" fill="#00ff9d"/>
            <line x1="64" y1="50" x2="70" y2="44" stroke="#ffd700" stroke-width="2" stroke-linecap="round"/>
            <circle cx="86" cy="50" r="10" fill="none" stroke="#ffd700" stroke-width="2"/>
            <circle cx="86" cy="50" r="2" fill="#00e5ff"/>
            <line x1="86" y1="50" x2="86" y2="42" stroke="#00ff9d" stroke-width="2" stroke-linecap="round"/>
            <polyline points="34,82 44,82 52,72 64,90 76,72 84,82 94,82" fill="none" stroke="#00e5ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity="0.7"/>
        """
    },
    "zoth-animated-bg": {
        "label": "Animated BG — Cyber Film Strip & Datamosh",
        "accent": "#a855f7",
        "gold": "#00ff9d",
        "symbol": """
            <rect x="18" y="36" width="20" height="56" rx="2" fill="#0a0018" stroke="#a855f7" stroke-width="2"/>
            <rect x="42" y="36" width="20" height="56" rx="2" fill="#0a0018" stroke="#a855f7" stroke-width="2"/>
            <rect x="66" y="36" width="20" height="56" rx="2" fill="#0a0018" stroke="#a855f7" stroke-width="2"/>
            <rect x="90" y="36" width="20" height="56" rx="2" fill="#0a0018" stroke="#a855f7" stroke-width="2"/>
            <circle cx="28" cy="50" r="3" fill="#00ff9d" opacity="0.8"/>
            <circle cx="52" cy="64" r="5" fill="#a855f7" opacity="0.6"/>
            <circle cx="76" cy="48" r="4" fill="#00ff9d" opacity="0.9"/>
            <circle cx="100" cy="60" r="3" fill="#ffffff" opacity="0.5"/>
            <line x1="14" y1="36" x2="114" y2="36" stroke="#a855f7" stroke-width="3" stroke-linecap="round"/>
            <line x1="14" y1="92" x2="114" y2="92" stroke="#a855f7" stroke-width="3" stroke-linecap="round"/>
            <line x1="28" y1="30" x2="28" y2="34" stroke="#00ff9d" stroke-width="2" stroke-linecap="round"/>
            <line x1="76" y1="30" x2="76" y2="34" stroke="#00ff9d" stroke-width="2" stroke-linecap="round"/>
        """
    },
    "zoth-pet-hud": {
        "label": "Pet HUD — All-Seeing Eye Companion",
        "accent": "#00ff9d",
        "gold": "#ffd700",
        "symbol": """
            <circle cx="64" cy="64" r="34" fill="#04100a" stroke="#00ff9d" stroke-width="3"/>
            <circle cx="64" cy="64" r="24" fill="none" stroke="#ffd700" stroke-width="2" stroke-dasharray="4 3"/>
            <circle cx="64" cy="64" r="10" fill="#00ff9d"/>
            <circle cx="64" cy="62" r="4" fill="#ffffff" opacity="0.8"/>
            <circle cx="64" cy="64" r="3" fill="#04100a"/>
            <line x1="54" y1="54" x2="46" y2="46" stroke="#ffd700" stroke-width="2" stroke-linecap="round" opacity="0.7"/>
            <line x1="74" y1="54" x2="82" y2="46" stroke="#ffd700" stroke-width="2" stroke-linecap="round" opacity="0.7"/>
            <line x1="54" y1="74" x2="46" y2="82" stroke="#00ff9d" stroke-width="2" stroke-linecap="round" opacity="0.7"/>
            <line x1="74" y1="74" x2="82" y2="82" stroke="#00ff9d" stroke-width="2" stroke-linecap="round" opacity="0.7"/>
        """
    },
    "zoth-powershell": {
        "label": "PowerShell — Windows Terminal CLI",
        "accent": "#0078d4",
        "gold": "#ffffff",
        "symbol": """
            <rect x="26" y="20" width="76" height="88" rx="8" fill="#041420" stroke="#0078d4" stroke-width="3"/>
            <rect x="26" y="20" width="76" height="18" rx="8" fill="#0078d4" opacity="0.8"/>
            <rect x="26" y="34" width="76" height="4" fill="#0078d4" opacity="0.4"/>
            <circle cx="36" cy="29" r="2" fill="#ffffff"/>
            <circle cx="44" cy="29" r="2" fill="#ffd700"/>
            <circle cx="52" cy="29" r="2" fill="#ff3333"/>
            <text x="64" y="52" font-family="monospace" font-size="10" fill="#ffffff" text-anchor="middle" opacity="0.9">PS ZOTHOS</text>
            <line x1="36" y1="62" x2="88" y2="62" stroke="#00ff9d" stroke-width="1.5" opacity="0.7"/>
            <line x1="36" y1="70" x2="80" y2="70" stroke="#ffffff" stroke-width="1.5" opacity="0.5"/>
            <line x1="36" y1="78" x2="84" y2="78" stroke="#00ff9d" stroke-width="1.5" opacity="0.6"/>
            <line x1="36" y1="86" x2="76" y2="86" stroke="#ffffff" stroke-width="1.5" opacity="0.4"/>
            <line x1="36" y1="94" x2="82" y2="94" stroke="#00ff9d" stroke-width="1.5" opacity="0.5"/>
        """
    },
    "zoth-undercover": {
        "label": "Undercover — Disguise & Identity Mask",
        "accent": "#3b82f6",
        "gold": "#00ff9d",
        "symbol": """
            <ellipse cx="64" cy="52" rx="28" ry="32" fill="#0a0e1a" stroke="#3b82f6" stroke-width="3"/>
            <ellipse cx="64" cy="52" rx="20" ry="24" fill="none" stroke="#00ff9d" stroke-width="2" stroke-dasharray="4 3" opacity="0.6"/>
            <ellipse cx="64" cy="46" rx="14" ry="10" fill="#001520" stroke="#3b82f6" stroke-width="2"/>
            <circle cx="56" cy="46" r="3" fill="#00ff9d" opacity="0.9"/>
            <circle cx="72" cy="46" r="3" fill="#00ff9d" opacity="0.9"/>
            <path d="M52,56 Q64,64 76,56" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round"/>
            <line x1="64" y1="20" x2="64" y2="36" stroke="#ffffff" stroke-width="2" stroke-linecap="round" opacity="0.4"/>
            <line x1="64" y1="68" x2="64" y2="84" stroke="#ffffff" stroke-width="2" stroke-linecap="round" opacity="0.4"/>
        """
    },
    "zoth-ai-stack": {
        "label": "AI Stack — Layered Neural Compute Chips",
        "accent": "#8b5cf6",
        "gold": "#00e5ff",
        "symbol": """
            <rect x="30" y="32" width="68" height="16" rx="3" fill="#0a0a20" stroke="#8b5cf6" stroke-width="2"/>
            <rect x="26" y="52" width="76" height="16" rx="3" fill="#0a0a20" stroke="#00e5ff" stroke-width="2"/>
            <rect x="30" y="72" width="68" height="16" rx="3" fill="#0a0a20" stroke="#8b5cf6" stroke-width="2"/>
            <circle cx="42" cy="40" r="2" fill="#8b5cf6"/>
            <circle cx="52" cy="40" r="2" fill="#00e5ff"/>
            <circle cx="64" cy="40" r="2" fill="#8b5cf6"/>
            <circle cx="76" cy="40" r="2" fill="#00e5ff"/>
            <circle cx="86" cy="40" r="2" fill="#8b5cf6"/>
            <circle cx="38" cy="60" r="2" fill="#00e5ff"/>
            <circle cx="50" cy="60" r="2" fill="#8b5cf6"/>
            <circle cx="64" cy="60" r="2" fill="#ffffff"/>
            <circle cx="78" cy="60" r="2" fill="#8b5cf6"/>
            <circle cx="90" cy="60" r="2" fill="#00e5ff"/>
            <circle cx="42" cy="80" r="2" fill="#8b5cf6"/>
            <circle cx="56" cy="80" r="2" fill="#00e5ff"/>
            <circle cx="64" cy="80" r="2" fill="#8b5cf6"/>
            <circle cx="76" cy="80" r="2" fill="#00e5ff"/>
            <line x1="64" y1="32" x2="64" y2="108" stroke="#8b5cf6" stroke-width="1" opacity="0.4" stroke-dasharray="3 3"/>
        """
    },
    "zoth-security-suite": {
        "label": "Security Suite — Shield Crosshair Arsenal",
        "accent": "#ef4444",
        "gold": "#ffd700",
        "symbol": """
            <path d="M64,16 L90,28 L90,54 C90,78 64,108 64,108 C64,108 38,78 38,54 L38,28 Z" fill="#120505" stroke="#ef4444" stroke-width="3" stroke-linejoin="round"/>
            <circle cx="64" cy="64" r="18" fill="none" stroke="#ffd700" stroke-width="2" stroke-dasharray="5 3"/>
            <circle cx="64" cy="64" r="8" fill="none" stroke="#ef4444" stroke-width="2"/>
            <circle cx="64" cy="64" r="3" fill="#ffd700"/>
            <line x1="64" y1="38" x2="64" y2="90" stroke="#00ff9d" stroke-width="1.5" stroke-linecap="round" opacity="0.6"/>
            <line x1="38" y1="64" x2="90" y2="64" stroke="#00ff9d" stroke-width="1.5" stroke-linecap="round" opacity="0.6"/>
            <path d="M64,20 L64,32 M64,96 L64,108 M20,64 L32,64 M96,64 L108,64" stroke="#ffd700" stroke-width="2" stroke-linecap="round" opacity="0.5"/>
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
