#!/usr/bin/env python3
import os

DESK_ENTRIES = {
    "zoth-studio.desktop": {
        "Name": "Zoth Studio",
        "Comment": "Alchemical Neural Hub & Tooling Suite",
        "Exec": "/opt/zoth-studio/launch.sh",
        "Icon": "zoth-studio",
        "Terminal": "false",
        "Categories": "Development;ArtificialIntelligence;Security;"
    },
    "zoth-agent-hud.desktop": {
        "Name": "Zoth Agent HUD",
        "Comment": "Autonomous OS Agent Multi-Ring Controller HUD",
        "Exec": "/usr/local/bin/zoth-agent-hud",
        "Icon": "zoth-agent-hud",
        "Terminal": "false",
        "Categories": "System;Security;ArtificialIntelligence;"
    },
    "zoth-agent.desktop": {
        "Name": "Zoth Agent CLI",
        "Comment": "Autonomous OS Agent CLI Interface",
        "Exec": "xfce4-terminal -T 'ZOTHOS Agent Terminal' -e 'zoth-agent-os'",
        "Icon": "zoth-agent",
        "Terminal": "false",
        "Categories": "System;ArtificialIntelligence;"
    },
    "hermes-agent.desktop": {
        "Name": "Hermes Agent",
        "Comment": "Hermes Agent Autonomous Gateway",
        "Exec": "xfce4-terminal -T 'Hermes Agent' -e 'hermes'",
        "Icon": "hermes-agent",
        "Terminal": "false",
        "Categories": "Development;ArtificialIntelligence;"
    },
    "claude-code.desktop": {
        "Name": "Claude Code",
        "Comment": "Claude Code Autonomous Agent",
        "Exec": "xfce4-terminal -T 'Claude Code CLI' -e 'claude'",
        "Icon": "claude-code",
        "Terminal": "false",
        "Categories": "Development;ArtificialIntelligence;"
    },
    "openai-codex.desktop": {
        "Name": "OpenAI Codex",
        "Comment": "OpenAI Codex CLI Suite",
        "Exec": "xfce4-terminal -T 'OpenAI Codex' -e 'codex'",
        "Icon": "openai-codex",
        "Terminal": "false",
        "Categories": "Development;ArtificialIntelligence;"
    },
    "opencode.desktop": {
        "Name": "OpenCode AI",
        "Comment": "OpenCode AI Programming Agent",
        "Exec": "xfce4-terminal -T 'OpenCode AI' -e 'opencode'",
        "Icon": "opencode",
        "Terminal": "false",
        "Categories": "Development;ArtificialIntelligence;"
    },
    "grok-ai.desktop": {
        "Name": "Grok AI",
        "Comment": "xAI Grok Intelligence Terminal",
        "Exec": "xfce4-terminal -T 'Grok AI' -e 'grok'",
        "Icon": "grok-ai",
        "Terminal": "false",
        "Categories": "Network;ArtificialIntelligence;"
    },
    "hexstrike-ai.desktop": {
        "Name": "HexStrike AI",
        "Comment": "HexStrike AI Security Assessment Framework",
        "Exec": "xfce4-terminal -T 'HexStrike AI' -e 'hexstrike'",
        "Icon": "hexstrike-ai",
        "Terminal": "false",
        "Categories": "Security;ArtificialIntelligence;"
    },
    "zoth-live-wallpaper.desktop": {
        "Name": "Visual FX Engine",
        "Comment": "Interactive Cyber Matrix & Datamosh Visualizer",
        "Exec": "/usr/local/bin/zoth-live-wallpaper",
        "Icon": "zoth-live-wallpaper",
        "Terminal": "false",
        "Categories": "Graphics;Utility;"
    },
    "zoth-ghost.desktop": {
        "Name": "NullAI Ghostmode",
        "Comment": "Tor Route, Amnesic RAM & Anti-Forensics Mode",
        "Exec": "xfce4-terminal -T 'Ghostmode Operations' -e 'zoth-ghost'",
        "Icon": "zoth-ghost",
        "Terminal": "false",
        "Categories": "Security;System;"
    },
    "zoth-sec.desktop": {
        "Name": "ZOTHOS Sec Arsenal",
        "Comment": "Kali & Parrot Pentesting Toolchain",
        "Exec": "xfce4-terminal -T 'Security Arsenal' -e 'zoth-sec'",
        "Icon": "zoth-sec",
        "Terminal": "false",
        "Categories": "Security;System;"
    },
    "zoth-mode.desktop": {
        "Name": "Reality Switcher",
        "Comment": "Toggle Matrix / Ghost / Win11 Undercover",
        "Exec": "xfce4-terminal -T 'Reality Switcher' -e 'zoth-mode'",
        "Icon": "zoth-mode",
        "Terminal": "false",
        "Categories": "Settings;System;"
    },
    "zoth-ai.desktop": {
        "Name": "ZOTH Master MCP",
        "Comment": "Master Model Context Protocol Registry",
        "Exec": "xfce4-terminal -T 'ZOTH MCP Hub' -e 'zoth-mcp'",
        "Icon": "zoth-ai",
        "Terminal": "false",
        "Categories": "Development;ArtificialIntelligence;"
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
StartupNotify=true
"""
        with open(fpath, "w") as f:
            f.write(content)
        os.chmod(fpath, 0o755)

print("Desktop files updated and permissions set to 0755!")
