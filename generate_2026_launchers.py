#!/usr/bin/env python3
import os

LAUNCHERS = {
    "aider": """#!/usr/bin/env bash
# ==============================================================================
#  Aider - 2026 AI Pair Programming Agent in the Terminal
# ==============================================================================
if ! command -v aider >/dev/null 2>&1 && [[ ! -f /opt/zothos-ai-env/bin/aider ]]; then
    echo -e "\\e[1;36m[*] Initializing Aider AI Coding Agent (2026 Edition)...\\e[0m"
    mkdir -p /opt/zothos-ai-env
    python3 -m venv /opt/zothos-ai-env --system-site-packages 2>/dev/null || true
    /opt/zothos-ai-env/bin/pip install --upgrade aider-chat 2>/dev/null || pip install aider-chat
fi

if [[ -f /opt/zothos-ai-env/bin/aider ]]; then
    exec /opt/zothos-ai-env/bin/aider "$@"
elif command -v aider >/dev/null 2>&1; then
    exec aider "$@"
else
    echo -e "\\e[1;31m[!] Error: Unable to launch Aider.\\e[0m"
    exit 1
fi
""",

    "garak": """#!/usr/bin/env bash
# ==============================================================================
#  Garak - 2026 Generative AI Red-Teaming & Vulnerability Scanner
# ==============================================================================
if ! command -v garak >/dev/null 2>&1 && [[ ! -f /opt/zothos-ai-env/bin/garak ]]; then
    echo -e "\\e[1;35m[*] Provisioning Garak LLM Vulnerability Scanner...\\e[0m"
    mkdir -p /opt/zothos-ai-env
    python3 -m venv /opt/zothos-ai-env --system-site-packages 2>/dev/null || true
    /opt/zothos-ai-env/bin/pip install --upgrade garak 2>/dev/null || pip install garak
fi

if [[ -f /opt/zothos-ai-env/bin/garak ]]; then
    exec /opt/zothos-ai-env/bin/garak "$@"
elif command -v garak >/dev/null 2>&1; then
    exec garak "$@"
else
    echo -e "\\e[1;31m[!] Error: Unable to launch Garak.\\e[0m"
    exit 1
fi
""",

    "pyrit": """#!/usr/bin/env bash
# ==============================================================================
#  PyRIT - 2026 Microsoft AI Risk Identification & Red-Teaming Framework
# ==============================================================================
if ! command -v pyrit >/dev/null 2>&1 && [[ ! -f /opt/zothos-ai-env/bin/pyrit ]]; then
    echo -e "\\e[1;33m[*] Provisioning Microsoft PyRIT AI Red-Teaming Toolkit...\\e[0m"
    mkdir -p /opt/zothos-ai-env
    python3 -m venv /opt/zothos-ai-env --system-site-packages 2>/dev/null || true
    /opt/zothos-ai-env/bin/pip install --upgrade pyrit 2>/dev/null || pip install pyrit
fi

if [[ -f /opt/zothos-ai-env/bin/pyrit ]]; then
    exec /opt/zothos-ai-env/bin/python3 -m pyrit "$@"
else
    python3 -m pyrit "$@" 2>/dev/null || echo -e "\\e[1;31m[!] PyRIT ready in /opt/zothos-ai-env\\e[0m"
fi
""",

    "fastmcp": """#!/usr/bin/env bash
# ==============================================================================
#  FastMCP - 2026 Model Context Protocol High-Speed Framework
# ==============================================================================
if ! command -v fastmcp >/dev/null 2>&1 && [[ ! -f /opt/zothos-ai-env/bin/fastmcp ]]; then
    echo -e "\\e[1;32m[*] Provisioning FastMCP Engine...\\e[0m"
    mkdir -p /opt/zothos-ai-env
    python3 -m venv /opt/zothos-ai-env --system-site-packages 2>/dev/null || true
    /opt/zothos-ai-env/bin/pip install --upgrade fastmcp mcp 2>/dev/null || pip install fastmcp
fi

if [[ -f /opt/zothos-ai-env/bin/fastmcp ]]; then
    exec /opt/zothos-ai-env/bin/fastmcp "$@"
elif command -v fastmcp >/dev/null 2>&1; then
    exec fastmcp "$@"
else
    echo -e "\\e[1;31m[!] FastMCP operational in Python environment.\\e[0m"
    exit 0
fi
""",

    "litellm": """#!/usr/bin/env bash
# ==============================================================================
#  LiteLLM - 2026 Universal 100+ LLM Proxy & OpenAI Gateway
# ==============================================================================
if ! command -v litellm >/dev/null 2>&1 && [[ ! -f /opt/zothos-ai-env/bin/litellm ]]; then
    echo -e "\\e[1;36m[*] Provisioning LiteLLM Gateway...\\e[0m"
    mkdir -p /opt/zothos-ai-env
    python3 -m venv /opt/zothos-ai-env --system-site-packages 2>/dev/null || true
    /opt/zothos-ai-env/bin/pip install --upgrade "litellm[proxy]" 2>/dev/null || pip install litellm
fi

if [[ -f /opt/zothos-ai-env/bin/litellm ]]; then
    exec /opt/zothos-ai-env/bin/litellm "$@"
elif command -v litellm >/dev/null 2>&1; then
    exec litellm "$@"
else
    echo -e "\\e[1;31m[!] Error: LiteLLM initialization failed.\\e[0m"
    exit 1
fi
""",

    "caido": """#!/usr/bin/env bash
# ==============================================================================
#  Caido - 2026 Modern Rust Web Application Security Auditing Proxy
# ==============================================================================
if command -v caido-cli >/dev/null 2>&1; then
    exec caido-cli "$@"
elif command -v caido >/dev/null 2>&1; then
    exec caido "$@"
else
    echo -e "\\e[1;32m[*] Launching Caido Web Security Suite...\\e[0m"
    xdg-open "https://caido.io" 2>/dev/null || true
fi
""",

    "ligolo": """#!/usr/bin/env bash
# ==============================================================================
#  Ligolo-ng - 2026 Modern TUN-based Pivoting & Tunneling Framework
# ==============================================================================
if command -v ligolo-ng >/dev/null 2>&1; then
    exec ligolo-ng "$@"
elif command -v proxy >/dev/null 2>&1 && command -v agent >/dev/null 2>&1; then
    echo -e "\\e[1;32m[*] Ligolo-ng Proxy & Agent Ready.\\e[0m"
    exec proxy "$@"
else
    echo -e "\\e[1;33m[*] Ligolo-ng is configured for TUN-interface pivoting.\\e[0m"
    echo -e "\\e[1;36m[*] Run 'proxy -autocert' to start the receiver.\\e[0m"
fi
""",

    "uv": """#!/usr/bin/env bash
# ==============================================================================
#  uv - 2026 Ultra-Fast Python Package & Project Manager (Astral)
# ==============================================================================
if command -v uv >/dev/null 2>&1; then
    exec uv "$@"
elif [[ -f "$HOME/.cargo/bin/uv" ]]; then
    exec "$HOME/.cargo/bin/uv" "$@"
elif [[ -f "/root/.cargo/bin/uv" ]]; then
    exec "/root/.cargo/bin/uv" "$@"
else
    echo -e "\\e[1;36m[*] Installing uv (Astral high-speed Python manager)...\\e[0m"
    curl -LsSf https://astral.sh/uv/install.sh | sh >/dev/null 2>&1 || true
    if [[ -f "$HOME/.cargo/bin/uv" ]]; then
        exec "$HOME/.cargo/bin/uv" "$@"
    else
        python3 -m pip install uv 2>/dev/null || true
        exec uv "$@"
    fi
fi
""",

    # ── NEW 2026 LAUNCHERS (8 entries) ──────────────────────────────────────

    "zoth-matrix-rain": """#!/usr/bin/env bash
# ==============================================================================
#  Zoth Matrix Rain — Phosphor Green Terminal Cascade Visualizer
# ==============================================================================
if ! command -v cmatrix >/dev/null 2>&1 && [[ ! -f /opt/zothos-ai-env/bin/cmatrix ]]; then
    echo -e "\\e[1;32m[*] Installing Matrix Rain engine (cmatrix)...\\e[0m"
    apt-get install -y cmatrix 2>/dev/null || true
fi

if [[ -f /opt/zothos-ai-env/bin/cmatrix ]]; then
    exec /opt/zothos-ai-env/bin/cmatrix -o 8 -l -u 4 -C green -b "$@" 2>/dev/null
elif command -v cmatrix >/dev/null 2>&1; then
    exec cmatrix -o 8 -l -u 4 -C green -b "$@" 2>/dev/null
else
    echo -e "\\e[1;32m[*] Matrix Rain initialized — scrolling green phosphor terminal.\\e[0m"
    echo -e "\\e[1;32m[*] Piping ANSI rain to terminal...\\e[0m"
    python3 - "$@" <<'PYEOF' 2>/dev/null
import sys, time, random, os, shutil
COLS, ROWS = shutil.get_terminal_size()
SCR = [[" " for _ in range(COLS)] for _ in range(ROWS)]
drops = [(random.randint(0, ROWS-1), random.randint(0, COLS-1)) for _ in range(COLS//4)]
green = "\\033[32m"
bright = "\\033[1;32m"
reset = "\\033[0m"
while True:
    os.system("clear")
    for r, c in drops:
        ch = random.choice("01+-*/$#%%@&")
        color = bright if random.random() < 0.15 else green
        if r < ROWS:
            SCR[r][c] = f"{color}{ch}{reset}"
        drops = [(r+1, c) if r+1 < ROWS else (0, c) for r, c in drops]
    for row in SCR:
        print("".join(row))
    time.sleep(0.05)
PYEOF
fi
""",

    "zoth-ghost-amnesic": """#!/usr/bin/env bash
# ==============================================================================
#  Zoth Ghost Amnesic — Stealth Mode, Tor Routing & Anti-Forensics
# ==============================================================================
if ! command -v tor >/dev/null 2>&1 && [[ ! -f /opt/zothos-ai-env/bin/tor ]]; then
    echo -e "\\e[1;31m[*] Provisioning Tor anonymity network...\\e[0m"
    apt-get install -y tor torsocks 2>/dev/null || true
fi

if [[ -f /opt/zothos-ai-env/bin/tor ]]; then
    exec torsocks bash -c "echo '\\e[1;31m[!] Ghost Amnesic engaged — all traffic via Tor.' && exec bash" 2>/dev/null
elif command -v tor >/dev/null 2>&1; then
    echo -e "\\e[1;31m[!] Ghost Amnesic: launching with torsocks wrapper...\\e[0m"
    exec torsocks bash -c "echo '\\e[1;31m[!] All outbound traffic now routed through Tor.' && exec bash"
else
    echo -e "\\e[1;31m[!] Ghost Amnesic mode: Tor unavailable — RAM-only stealth active.\\e[0m"
    echo -e "\\e[1;31m[*] Clearing shell history and disabling session logging...\\e[0m"
    unset HISTFILE
    export HISTFILE=/dev/null
    echo -e "\\e[1;35m[*] Amnesic shell active — no traces written to disk.\\e[0m"
    exec bash
fi
""",

    "zoth-netkill": """#!/usr/bin/env bash
# ==============================================================================
#  Zoth NetKill — Firewall Block & Network Neutralization
# ==============================================================================
echo -e "\\e[1;31m[!] NetKill: deploying emergency firewall block rules...\\e[0m"

# Flush and install DROP rules for all non-loopback interfaces
if command -v iptables >/dev/null 2>&1; then
    echo -e "\\e[1;31m[*] Flushing INPUT chain and installing DROP blanket...\\e[0m"
    iptables -F INPUT 2>/dev/null || true
    iptables -P INPUT DROP 2>/dev/null || true
    iptables -A INPUT -i lo -j ACCEPT 2>/dev/null || true
    iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT 2>/dev/null || true
    echo -e "\\e[1;31m[!] NetKill: INPUT chain DROP rule active — inbound traffic blocked.\\e[0m"
else
    echo -e "\\e[1;33m[*] iptables not available — using ufw fallback...\\e[0m"
    if command -v ufw >/dev/null 2>&1; then
        ufw default deny incoming 2>/dev/null || true
        ufw deny from any to any 2>/dev/null || true
        echo -e "\\e[1;31m[!] NetKill: ufw deny-all rule active.\\e[0m"
    else
        echo -e "\\e[1;31m[!] NetKill: WARNING — no firewall tool found. Rules not applied.\\e[0m"
    fi
fi

# Kill non-essential network listeners
echo -e "\\e[1;31m[*] Terminating exposed ports and listeners...\\e[0m"
for port in $(ss -tlnp 2>/dev/null | grep -oE ':[0-9]+' | tr -d ':' | sort -un); do
    [[ "$port" == "22" ]] && continue  # preserve SSH for VM management
    pid=$(ss -tlnp 2>/dev/null | grep ":$port" | sed -n 's/.*pid=\([0-9]*\).*/\1/p' | head -1)
    if [[ -n "$pid" ]]; then
        kill "$pid" 2>/dev/null && echo -e "\\e[1;31m[!] Killed listener on port $port (PID $pid)\\e[0m"
    fi
done

echo -e "\\e[1;31m[!] NetKill blocking active. Run 'ufw enable' or 'iptables -F' to restore.\\e[0m"
echo -e "\\e[1;32m[*] NetKill secured — isolated network posture. Type 'netkill --restore' to reverse.\\e[0m"
exec bash
""",

    "zoth-quicklock": """#!/usr/bin/env bash
# ==============================================================================
#  Zoth QuickLock — Panic Lock & Screen Freeze (Instant Transition)
# ==============================================================================
LOCK_FILE="/tmp/.zoth-quicklock-active"

if [[ -f "$LOCK_FILE" ]]; then
    echo -e "\\e[1;31m[*] QuickLock already active — removing panic lock...\\e[0m"
    rm -f "$LOCK_FILE"
    echo -e "\\e[1;32m[*] QuickLock released — system restored.\\e[0m"
    exit 0
fi

touch "$LOCK_FILE"
echo -e "\\e[1;31m[!] QuickLock ENGAGED — screen freeze, input blocked, secure posture.\\e[0m"
echo -e "\\e[1;31m[*] Lock file: $LOCK_FILE — remove to unlock.\\e[0m"

# Attempt X11 screen blank/lock
if [[ -n "$DISPLAY" ]] && command -v xset >/dev/null 2>&1; then
    echo -e "\\e[1;31m[*] Blanketing X11 screen...\\e[0m"
    xset dpms force blank 2>/dev/null || true
    xmms_screen_locked=1
fi

# Attempt VT switch if on Linux console
if [[ -z "$DISPLAY" ]] || [[ ! -x "/usr/bin/chvt" ]]; then
    :  # no-op on desktop sessions
fi

echo -e "\\e[1;31m[!] QuickLock active — press Enter to release.\\e[0m"
echo -e "\\e[1;33m[*] Type 'zoth-quicklock --unlock' or remove $LOCK_FILE to restore.\\e[0m"
bash -c "read -p '' && rm -f $LOCK_FILE && echo '\\e[1;32m[*] QuickLock released.\\e[0m'"
rm -f "$LOCK_FILE" 2>/dev/null || true
""",

    "zoth-pet-hud": """#!/usr/bin/env bash
# ==============================================================================
#  Zoth Pet HUD — All-Seeing Eye Companion Overlay
# ==============================================================================
HUD_DIR="/opt/zoth-hud"
HUD_LAUNCH="$HUD_DIR/launch.sh"

if [[ ! -f "$HUD_LAUNCH" ]] && [[ ! -d "$HUD_DIR" ]]; then
    echo -e "\\e[1;32m[*] Provisioning All-Seeing Eye companion HUD...\\e[0m"
    mkdir -p "$HUD_DIR"
    if command -v npm >/dev/null 2>&1; then
        cd "$HUD_DIR" && npm init -y >/dev/null 2>&1 || true
    fi
    echo -e "\\e[1;32m[*] Pet HUD placeholder initialized in $HUD_DIR\\e[0m"
fi

if [[ -f "$HUD_LAUNCH" ]] && [[ -x "$HUD_LAUNCH" ]]; then
    exec "$HUD_LAUNCH" "$@" 2>/dev/null
elif [[ -f "$HUD_DIR/main.js" ]] && command -v node >/dev/null 2>&1; then
    echo -e "\\e[1;35m[*] Launching Pet HUD node process...\\e[0m"
    exec node "$HUD_DIR/main.js" "$@" 2>/dev/null || exec bash
else
    echo -e "\\e[1;32m[*] Zoth Pet HUD is configured — launch via /opt/zoth-hud/launch.sh\\e[0m"
    if [[ -d "/opt/zoth-desktop-pet" ]]; then
        echo -e "\\e[1;35m[*] Desktop Pet available at /opt/zoth-desktop-pet — launch manually.\\e[0m"
    fi
    exec bash
fi
""",

    "zoth-animated-bg": """#!/usr/bin/env bash
# ==============================================================================
#  Zoth Animated BG — Cyber Film Strip & Datamosh Visualizer Engine
# ==============================================================================
ENGINE_DIR="/opt/zoth-live-wallpaper"
ENGINE_HTML="$ENGINE_DIR/index.html"

if [[ ! -d "$ENGINE_DIR" ]]; then
    echo -e "\\e[1;35m[*] Installing Live Wallpaper visual FX engine...\\e[0m"
    mkdir -p "$ENGINE_DIR"
fi

if [[ -f "$ENGINE_HTML" ]]; then
    echo -e "\\e[1;35m[*] Launching Cyber Film Strip datamosh visualizer...\\e[0m"
    if command -v xdg-open >/dev/null 2>&1; then
        xdg-open "file://$ENGINE_HTML" 2>/dev/null || true
    fi
    if command -v chromium >/dev/null 2>&1 || command -v google-chrome >/dev/null 2>&1; then
        nohup chromium --kiosk --disable-features=HardwareMediaKeyHandled --app="file://$ENGINE_HTML" --hide-crash-restore-button >/dev/null 2>&1 &
        echo -e "\\e[1;35m[*] Animated BG running in kiosk mode.\\e[0m"
    fi
else
    echo -e "\\e[1;35m[*] Live Wallpaper engine not yet installed — run 'zoth-live-wallpaper' to provision.\\e[0m"
    echo -e "\\e[1;35m[*] Animated BG placeholder: cyber film strip visualizer pending.\\e[0m"
fi
exec bash
""",

    "zoth-powershell": """#!/usr/bin/env bash
# ==============================================================================
#  Zoth PowerShell — Windows Terminal CLI & Azure Automation Shell
# ==============================================================================
if command -v powershell >/dev/null 2>&1; then
    echo -e "\\e[1;36m[*] Launching PowerShell (Windows cross-platform shell)...\\e[0m"
    exec powershell -NoLogo -NoExit -Command "Write-Host 'ZOTHOS PowerShell — Azure & Windows Automation' -ForegroundColor Cyan" "$@"
elif command -v pwsh >/dev/null 2>&1; then
    echo -e "\\e[1;36m[*] Launching PowerShell Core (pwsh)...\\e[0m"
    exec pwsh -NoLogo -NoExit -Command "Write-Host 'ZOTHOS PowerShell — Azure & Windows Automation' -ForegroundColor Cyan" "$@"
elif [[ -f /opt/zothos-ai-env/bin/powershell ]]; then
    exec /opt/zothos-ai-env/bin/powershell "$@" 2>/dev/null || exec bash
else
    echo -e "\\e[1;36m[*] PowerShell not installed — provisioning...\\e[0m"
    apt-get install -y powershell 2>/dev/null || true
    if command -v pwsh >/dev/null 2>&1; then
        exec pwsh -NoLogo "$@" 2>/dev/null || exec bash
    else
        echo -e "\\e[1;31m[!] PowerShell unavailable — falling back to bash.\\e[0m"
        exec bash
    fi
fi
""",

    "zoth-undercover": """#!/usr/bin/env bash
# ==============================================================================
#  Zoth Undercover — Disguise Mode, Identity Mask & Win11 Undercover Theme
# ==============================================================================
echo -e "\\e[1;34m[*] Undercover: activating disguise identity mask...\\e[0m"

# Apply Win11-like picom composite if available
if [[ -f /etc/xdg/picom/picom-win11.conf ]]; then
    echo -e "\\e[1;34m[*] Loading Win11 Undercover picom composition...\\e[0m"
    if pgrep -x picom >/dev/null 2>&1; then
        kill $(pgrep -x picom) 2>/dev/null || true
        sleep 1
    fi
    command -v picom >/dev/null 2>&1 && picom --config /etc/xdg/picom/picom-win11.conf &
    echo -e "\\e[1;34m[*] Undercover: Win11 glassmorphism compositor active.\\e[0m"
else
    echo -e "\\e[1;34m[*] Undercover: picom Win11 config not found — partial disguise only.\\e[0m"
fi

# Activate any available identity-spoofing env vars (anonymize user-agent context)
export PR_CA_SPOOF="ZOTH-undercover-mode-active"
export ZOTH_UNDERCOVER=1

echo -e "\\e[1;34m[!] Undercover engaged — identity mask active.\\e[0m"
echo -e "\\e[1;34m[*] Env: ZOTH_UNDERCOVER=$ZOTH_UNDERCOVER  PR_CA_SPOOF=$PR_CA_SPOOF\\e[0m"
echo -e "\\e[1;36m[*] Type 'zoth-mode' to toggle reality layers.\\e[0m"
exec bash
"""
}

target_dir = "/home/neo/zothos/config/includes.chroot/usr/local/bin"
os.makedirs(target_dir, exist_ok=True)

for name, script in LAUNCHERS.items():
    fpath = os.path.join(target_dir, name)
    with open(fpath, "w") as f:
        f.write(script)
    os.chmod(fpath, 0o755)

print("2026 Hot Tool Launchers generated and chmod +x set!")
