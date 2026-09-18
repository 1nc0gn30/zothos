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
