#!/usr/bin/env bash
# ==============================================================================
#  ZOTH ARSENAL - Universal Tool Installer
# ==============================================================================
set -euo pipefail

TOOL_ID="${1:-}"
if [[ -z "$TOOL_ID" ]]; then
    echo "Usage: $0 <tool_id_or_package>"
    exit 1
fi

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
INDEX_FILE="$HERE/manifests/index.json"

GREEN="\e[1;32m"
CYAN="\e[1;36m"
YELLOW="\e[1;33m"
RED="\e[1;31m"
RESET="\e[0m"

# Look up tool in index.json using python3
TOOL_INFO=$(python3 -c "
import json, sys
with open('$INDEX_FILE') as f:
    idx = json.load(f)
tool = idx['tools'].get('$TOOL_ID')
if not tool:
    # search by pkg name
    for t in idx['tools'].values():
        if t['pkg'] == '$TOOL_ID':
            tool = t
            break
if tool:
    print(f\"{tool['id']}|{tool['pkg']}|{tool['type']}|{tool['desc']}\")
else:
    print('NOT_FOUND')
")

if [[ "$TOOL_INFO" == "NOT_FOUND" ]]; then
    echo -e "${YELLOW}[*] '$TOOL_ID' not in curated index. Attempting direct apt install...${RESET}"
    sudo apt-get update -y
    sudo apt-get install -y "$TOOL_ID"
    exit $?
fi

IFS="|" read -r ID PKG TYPE DESC <<< "$TOOL_INFO"
echo -e "${CYAN}[+] Installing $ID (${DESC})...${RESET}"

case "$TYPE" in
    apt)
        sudo apt-get update -y
        sudo apt-get install -y "$PKG"
        ;;
    pip)
        pip install --upgrade --break-system-packages "$PKG" 2>/dev/null || pip install --upgrade "$PKG"
        ;;
    npm)
        sudo npm install -g "$PKG"
        ;;
    binary|binary_or_apt|cargo_or_apt|pip_or_apt)
        # Try apt first, fall back to specialized method
        if sudo apt-get install -y "$PKG" 2>/dev/null; then
            echo -e "${GREEN}[✓] Installed $ID via apt.${RESET}"
        else
            case "$ID" in
                ollama)
                    curl -fsSL https://ollama.com/install.sh | sh
                    ;;
                cline)
                    npm install -g cline 2>/dev/null || true
                    ;;
                hermes-agent)
                    /usr/local/bin/hermes setup || pip install --break-system-packages hermes-agent
                    ;;
                foundry)
                    curl -L https://foundry.paradigm.xyz | bash && ~/.foundry/bin/foundryup
                    ;;
                solana-cli)
                    sh -c "$(curl -sSfL https://release.anza.xyz/stable/install)"
                    ;;
                *)
                    echo -e "${RED}[!] Automatic installer for $ID ($TYPE) encountered an issue.${RESET}"
                    exit 1
                    ;;
            esac
        fi
        ;;
    script)
        case "$ID" in
            anonsurf)
                if [[ ! -d /opt/anonsurf ]]; then
                    sudo git clone https://github.com/Und3rf10w/kali-anonsurf.git /opt/anonsurf 2>/dev/null || true
                    if [[ -d /opt/anonsurf ]]; then
                        (cd /opt/anonsurf && sudo ./installer.sh)
                    fi
                fi
                ;;
            *)
                echo -e "${YELLOW}[*] Custom script installation for $ID${RESET}"
                ;;
        esac
        ;;
    *)
        sudo apt-get install -y "$PKG"
        ;;
esac

echo -e "${GREEN}[✓] $ID installed successfully.${RESET}"
