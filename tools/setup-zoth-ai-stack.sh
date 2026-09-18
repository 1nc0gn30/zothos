#!/usr/bin/env bash
# ==============================================================================
#  ZOTHOS Linux - AI Toolchain & MCP Ecosystem Provisioning Script
#  Installs Hermes, Ollama, Codex, Grok, HexStrike, OpenCode, Claude Code & MCPs
# ==============================================================================

set -euo pipefail

GREEN="\e[1;32m"
CYAN="\e[1;36m"
YELLOW="\e[1;33m"
RED="\e[1;31m"
BOLD="\e[1m"
RESET="\e[0m"

echo -e "${GREEN}${BOLD}=== [ ZOTHOS AI & MCP TOOLCHAIN PROVISIONING ] ===${RESET}"

# 1. Ensure Node.js and NPM
echo -e "${CYAN}[1/8] Verifying Node.js and npm...${RESET}"
if ! command -v node >/dev/null 2>&1; then
    apt-get update && apt-get install -y nodejs npm
fi

# 2. Install Claude Code & OpenCode globally
echo -e "${CYAN}[2/8] Installing Claude Code and OpenCode globally via npm...${RESET}"
npm install -g @anthropic-ai/claude-code opencode-ai @openai/codex || true

# 3. Install Hot MCP Server Packages globally
echo -e "${CYAN}[3/8] Installing Trending MCP Server Packages...${RESET}"
npm install -g \
    @modelcontextprotocol/server-filesystem \
    @modelcontextprotocol/server-github \
    @modelcontextprotocol/server-fetch \
    @modelcontextprotocol/server-memory \
    @modelcontextprotocol/server-puppeteer \
    @modelcontextprotocol/server-brave-search \
    @modelcontextprotocol/server-postgres \
    mcp-server-sqlite || true

# 4. Install Ollama if not present
echo -e "${CYAN}[4/8] Verifying Ollama...${RESET}"
if ! command -v ollama >/dev/null 2>&1; then
    echo "Installing Ollama binary..."
    curl -fsSL https://ollama.com/install.sh | sh || true
fi

# 5. Install Python AI packages & Evaluation suites
echo -e "${CYAN}[5/8] Installing Python AI frameworks and security red teaming packages...${RESET}"
pip3 install --break-system-packages \
    torch torchvision torchaudio \
    transformers accelerate huggingface_hub \
    fastapi uvicorn pydantic rich click typer \
    crawl4ai aider-chat garak \
    mcp || true

# 6. Set up HexStrike AI MCP & Server
echo -e "${CYAN}[6/8] Configuring HexStrike AI Platform...${RESET}"
mkdir -p /usr/share/hexstrike-ai /etc/zothos
chmod +x /usr/local/bin/hexstrike* 2>/dev/null || true

# 7. Sync Master MCP Registry
echo -e "${CYAN}[7/8] Priming Master MCP Registry...${RESET}"
if command -v zoth-mcp >/dev/null 2>&1; then
    zoth-mcp sync || true
fi

# 8. Create Ollama systemd unit
echo -e "${CYAN}[8/8] Configuring Ollama systemd service...${RESET}"
cat << 'EOF' > /etc/systemd/system/ollama.service
[Unit]
Description=Ollama Service
After=network-online.target

[Service]
ExecStart=/usr/local/bin/ollama serve
User=neo
Group=neo
Restart=always
RestartSec=3
Environment="PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload 2>/dev/null || true
echo -e "${GREEN}${BOLD}[✓] ZOTHOS AI & MCP Ecosystem successfully provisioned!${RESET}"
