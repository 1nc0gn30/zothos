#!/usr/bin/env python3
import os

DESK_ENTRIES = {
    # ── EXISTING 13 entries ──────────────────────────────────────────────────
    "zoth-studio.desktop": {
        "Name": "Zoth Studio",
        "Comment": "Alchemical Neural Hub & Tooling Suite",
        "Exec": "/opt/zoth-studio/launch.sh",
        "Icon": "zoth-studio",
        "Terminal": "false",
        "Categories": "Development;ArtificialIntelligence;Security;",
        "Keywords": "studio;hub;neural;alchemical;webgl;cockpit;",
        "MimeType": "application/x-zoth-studio;"
    },
    "zoth-agent-hud.desktop": {
        "Name": "Zoth Agent HUD",
        "Comment": "Autonomous OS Agent Multi-Ring Controller HUD",
        "Exec": "/usr/local/bin/zoth-agent-hud",
        "Icon": "zoth-agent-hud",
        "Terminal": "false",
        "Categories": "System;Security;ArtificialIntelligence;",
        "Keywords": "agent;hud;controller;autonomous;multi-ring;",
        "MimeType": "application/x-zoth-agent-hud;"
    },
    "zoth-agent.desktop": {
        "Name": "Zoth Agent CLI",
        "Comment": "Autonomous OS Agent CLI Interface",
        "Exec": "xfce4-terminal -T 'ZOTHOS Agent Terminal' -e 'zoth-agent-os'",
        "Icon": "zoth-agent",
        "Terminal": "false",
        "Categories": "System;ArtificialIntelligence;",
        "Keywords": "agent;cli;autonomous;os;terminal;",
        "MimeType": "application/x-zoth-agent-cli;"
    },
    "hermes-agent.desktop": {
        "Name": "Hermes Agent",
        "Comment": "Hermes Agent Autonomous Gateway",
        "Exec": "xfce4-terminal -T 'Hermes Agent' -e 'hermes'",
        "Icon": "hermes-agent",
        "Terminal": "false",
        "Categories": "Development;ArtificialIntelligence;",
        "Keywords": "hermes;agent;gateway;autonomous;ai;",
        "MimeType": "application/x-hermes-agent;"
    },
    "claude-code.desktop": {
        "Name": "Claude Code",
        "Comment": "Claude Code Autonomous Agent",
        "Exec": "xfce4-terminal -T 'Claude Code CLI' -e 'claude'",
        "Icon": "claude-code",
        "Terminal": "false",
        "Categories": "Development;ArtificialIntelligence;",
        "Keywords": "claude;code;anthropic;agent;cli;",
        "MimeType": "application/x-claude-code;"
    },
    "openai-codex.desktop": {
        "Name": "OpenAI Codex",
        "Comment": "OpenAI Codex CLI Suite",
        "Exec": "xfce4-terminal -T 'OpenAI Codex' -e 'codex'",
        "Icon": "openai-codex",
        "Terminal": "false",
        "Categories": "Development;ArtificialIntelligence;",
        "Keywords": "openai;codex;cli;ai;developer;",
        "MimeType": "application/x-openai-codex;"
    },
    "opencode.desktop": {
        "Name": "OpenCode AI",
        "Comment": "OpenCode AI Programming Agent",
        "Exec": "xfce4-terminal -T 'OpenCode AI' -e 'opencode'",
        "Icon": "opencode",
        "Terminal": "false",
        "Categories": "Development;ArtificialIntelligence;",
        "Keywords": "opencode;ai;programming;agent;cli;",
        "MimeType": "application/x-opencode;"
    },
    "grok-ai.desktop": {
        "Name": "Grok AI",
        "Comment": "xAI Grok Intelligence Terminal",
        "Exec": "xfce4-terminal -T 'Grok AI' -e 'grok'",
        "Icon": "grok-ai",
        "Terminal": "false",
        "Categories": "Network;ArtificialIntelligence;",
        "Keywords": "grok;xai;intelligence;terminal;llm;",
        "MimeType": "application/x-grok-ai;"
    },
    "hexstrike-ai.desktop": {
        "Name": "HexStrike AI",
        "Comment": "HexStrike AI Security Assessment Framework",
        "Exec": "xfce4-terminal -T 'HexStrike AI' -e 'hexstrike'",
        "Icon": "hexstrike-ai",
        "Terminal": "false",
        "Categories": "Security;ArtificialIntelligence;",
        "Keywords": "hexstrike;security;pentest;ai;assessment;",
        "MimeType": "application/x-hexstrike-ai;"
    },
    "zoth-live-wallpaper.desktop": {
        "Name": "Visual FX Engine",
        "Comment": "Interactive Cyber Matrix & Datamosh Visualizer",
        "Exec": "/usr/local/bin/zoth-live-wallpaper",
        "Icon": "zoth-live-wallpaper",
        "Terminal": "false",
        "Categories": "Graphics;Utility;",
        "Keywords": "wallpaper;visual;fx;matrix;datamosh;cyber;",
        "MimeType": "application/x-zoth-live-wallpaper;"
    },
    "zoth-ghost.desktop": {
        "Name": "NullAI Ghostmode",
        "Comment": "Tor Route, Amnesic RAM & Anti-Forensics Mode",
        "Exec": "xfce4-terminal -T 'Ghostmode Operations' -e 'zoth-ghost'",
        "Icon": "zoth-ghost",
        "Terminal": "false",
        "Categories": "Security;System;",
        "Keywords": "ghost;nullai;tor;amnesic;anti-forensics;stealth;",
        "MimeType": "application/x-zoth-ghost;"
    },
    "zoth-sec.desktop": {
        "Name": "ZOTHOS Sec Arsenal",
        "Comment": "Kali & Parrot Pentesting Toolchain",
        "Exec": "xfce4-terminal -T 'Security Arsenal' -e 'zoth-sec'",
        "Icon": "zoth-sec",
        "Terminal": "false",
        "Categories": "Security;System;",
        "Keywords": "security;pentest;kali;parrot;arsenal;toolchain;",
        "MimeType": "application/x-zoth-sec;"
    },
    "zoth-mode.desktop": {
        "Name": "Reality Switcher",
        "Comment": "Toggle Matrix / Ghost / Win11 Undercover",
        "Exec": "xfce4-terminal -T 'Reality Switcher' -e 'zoth-mode'",
        "Icon": "zoth-mode",
        "Terminal": "false",
        "Categories": "Settings;System;",
        "Keywords": "reality;switcher;matrix;ghost;win11;undercover;",
        "MimeType": "application/x-zoth-mode;"
    },
    "zoth-ai.desktop": {
        "Name": "ZOTH Master MCP",
        "Comment": "Master Model Context Protocol Registry",
        "Exec": "xfce4-terminal -T 'ZOTH MCP Hub' -e 'zoth-mcp'",
        "Icon": "zoth-ai",
        "Terminal": "false",
        "Categories": "Development;ArtificialIntelligence;",
        "Keywords": "mcp;model-context-protocol;registry;master;ai;",
        "MimeType": "application/x-zoth-mcp;"
    },
    # ── NEW: 12 icon + launcher desktop entries ─────────────────────────────
    "zoth-matrix-rain.desktop": {
        "Name": "Matrix Rain",
        "Comment": "Green Phosphor Terminal Cascade Visualizer",
        "Exec": "/usr/local/bin/zoth-matrix-rain",
        "Icon": "zoth-matrix-rain",
        "Terminal": "false",
        "Categories": "Graphics;Utility;",
        "Keywords": "matrix;rain;phosphor;green;terminal;visualizer;cmatrix;",
        "MimeType": "application/x-zoth-matrix-rain;"
    },
    "zoth-ghost-amnesic.desktop": {
        "Name": "Ghost Amnesic",
        "Comment": "Stealth Mode, Tor Routing & Anti-Forensics",
        "Exec": "/usr/local/bin/zoth-ghost-amnesic",
        "Icon": "zoth-ghost-amnesic",
        "Terminal": "false",
        "Categories": "Security;Network;System;",
        "Keywords": "ghost;amnesic;stealth;tor;anti-forensics;anonymity;security;",
        "MimeType": "application/x-zoth-ghost-amnesic;"
    },
    "zoth-netkill.desktop": {
        "Name": "NetKill",
        "Comment": "Firewall Block & Network Neutralization",
        "Exec": "/usr/local/bin/zoth-netkill",
        "Icon": "zoth-netkill",
        "Terminal": "false",
        "Categories": "Security;Network;System;",
        "Keywords": "netkill;firewall;block;neutralize;iptables;network;security;",
        "MimeType": "application/x-zoth-netkill;"
    },
    "zoth-quicklock.desktop": {
        "Name": "QuickLock",
        "Comment": "Panic Lock & Instant Screen Freeze",
        "Exec": "/usr/local/bin/zoth-quicklock",
        "Icon": "zoth-quicklock",
        "Terminal": "false",
        "Categories": "System;Security;",
        "Keywords": "quicklock;panic;lock;freeze;screen;security;emergency;",
        "MimeType": "application/x-zoth-quicklock;"
    },
    "zoth-pet-hud.desktop": {
        "Name": "Pet HUD",
        "Comment": "All-Seeing Eye Desktop Companion Overlay",
        "Exec": "/usr/local/bin/zoth-pet-hud",
        "Icon": "zoth-pet-hud",
        "Terminal": "false",
        "Categories": "Utility;Graphics;ArtificialIntelligence;",
        "Keywords": "pet;hud;companion;eye;overlay;desktop;ai;",
        "MimeType": "application/x-zoth-pet-hud;"
    },
    "zoth-animated-bg.desktop": {
        "Name": "Animated BG",
        "Comment": "Cyber Film Strip & Datamosh Visualizer Engine",
        "Exec": "/usr/local/bin/zoth-animated-bg",
        "Icon": "zoth-animated-bg",
        "Terminal": "false",
        "Categories": "Graphics;Utility;",
        "Keywords": "animated;background;film;datamosh;cyber;visualizer;wallpaper;",
        "MimeType": "application/x-zoth-animated-bg;"
    },
    "zoth-powershell.desktop": {
        "Name": "PowerShell",
        "Comment": "Windows PowerShell & Azure Automation Shell",
        "Exec": "/usr/local/bin/zoth-powershell",
        "Icon": "zoth-powershell",
        "Terminal": "false",
        "Categories": "Development;System;Shell;",
        "Keywords": "powershell;windows;azure;shell;automation;cli;ps;",
        "MimeType": "application/x-zoth-powershell;"
    },
    "zoth-undercover.desktop": {
        "Name": "Undercover",
        "Comment": "Disguise Mode, Identity Mask & Win11 Undercover Theme",
        "Exec": "/usr/local/bin/zoth-undercover",
        "Icon": "zoth-undercover",
        "Terminal": "false",
        "Categories": "Settings;System;Security;",
        "Keywords": "undercover;disguise;mask;identity;win11;theme;stealth;",
        "MimeType": "application/x-zoth-undercover;"
    },
    "zoth-plymouth.desktop": {
        "Name": "Plymouth Phoenix",
        "Comment": "Boot Animation & Display Manager Theme",
        "Exec": "",
        "Icon": "zoth-plymouth",
        "Terminal": "false",
        "Categories": "Settings;System;",
        "Keywords": "plymouth;phoenix;boot;animation;theme;display-manager;",
        "MimeType": "application/x-zoth-plymouth;"
    },
    "zoth-cockpit.desktop": {
        "Name": "ZothOS Cockpit",
        "Comment": "OS Dashboard & System Diagnostics",
        "Exec": "/usr/local/bin/zoth-cockpit",
        "Icon": "zoth-cockpit",
        "Terminal": "false",
        "Categories": "System;Monitoring;",
        "Keywords": "cockpit;dashboard;diagnostics;system;monitor;os;",
        "MimeType": "application/x-zoth-cockpit;"
    },
    "zoth-ai-stack.desktop": {
        "Name": "AI Stack",
        "Comment": "Stacked Neural Compute Chips & ML Pipeline",
        "Exec": "xfce4-terminal -T 'AI Stack' -e 'zoth-ai-stack'",
        "Icon": "zoth-ai-stack",
        "Terminal": "false",
        "Categories": "Development;ArtificialIntelligence;",
        "Keywords": "ai;stack;neural;chips;ml;pipeline;compute;deep-learning;",
        "MimeType": "application/x-zoth-ai-stack;"
    },
    "zoth-security-suite.desktop": {
        "Name": "Security Suite",
        "Comment": "Shield Crosshair — Full Security Arsenal",
        "Exec": "/usr/local/bin/zoth-sec",
        "Icon": "zoth-security-suite",
        "Terminal": "false",
        "Categories": "Security;System;",
        "Keywords": "security;suite;shield;crosshair;arsenal;pentest;defense;",
        "MimeType": "application/x-zoth-security-suite;"
    }
}

target_dirs = [
    "/home/neo/zothos/config/includes.chroot/etc/skel/Desktop",
    "/home/neo/zothos/config/includes.chroot/usr/share/applications"
]

for tdir in target_dirs:
    os.makedirs(tdir, exist_ok=True)
    for fname, data in DESK_ENTRIES.items():
        fpath = os.path.join(tdir, fname)
        content = f"""[Desktop Entry]
Version=1.0
Type=Application
Name={data['Name']}
Comment={data['Comment']}
Exec={data['Exec']}
Icon={data['Icon']}
Terminal={data['Terminal']}
Categories={data['Categories']}
Keywords={data['Keywords']}
MimeType={data['MimeType']}
StartupNotify=true
"""
        with open(fpath, "w") as f:
            f.write(content)
        os.chmod(fpath, 0o755)

print("Desktop files updated and permissions set to 0755!")
