#!/usr/bin/env bash
# ==============================================================================
#  ZOTHOS AI STACK BOOTSTRAPPER (Mainstream & Frontier/Underground Arsenal)
# ==============================================================================

set -e

GREEN="\e[1;32m"
CYAN="\e[1;36m"
YELLOW="\e[1;33m"
BOLD="\e[1m"
RESET="\e[0m"

echo -e "${GREEN}${BOLD}[*] Initializing ZOTHOS AI Stack Setup...${RESET}"

# Create shared virtualenv for AI tools to avoid system python conflicts
AI_ENV="/opt/zothos-ai-env"
echo -e "${CYAN}[1/5] Setting up dedicated AI Python Environment at $AI_ENV ...${RESET}"
sudo mkdir -p /opt
sudo python3 -m venv "$AI_ENV"
sudo chown -R "$USER":"$USER" "$AI_ENV"
source "$AI_ENV/bin/activate"

pip install --upgrade pip setuptools wheel

# 1. Mainstream Local Inference & Tools
echo -e "${CYAN}[2/5] Installing Mainstream AI Engine Toolchains...${RESET}"
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu || pip install torch
pip install \
    huggingface_hub[cli] \
    hf-transfer \
    transformers \
    accelerate \
    bitsandbytes \
    openai \
    faster-whisper \
    piper-tts \
    vllm || true

# Install Ollama if not present
if ! command -v ollama >/dev/null 2>&1; then
    echo -e "${YELLOW}[*] Downloading Ollama Engine...${RESET}"
    curl -fsSL https://ollama.com/install.sh | sh || true
fi

# Clone ComfyUI into /opt/ComfyUI if missing
if [[ ! -d "/opt/ComfyUI" ]]; then
    echo -e "${YELLOW}[*] Cloning ComfyUI Generative Diffusion Studio...${RESET}"
    sudo git clone https://github.com/comfyanonymous/ComfyUI.git /opt/ComfyUI
    sudo chown -R "$USER":"$USER" /opt/ComfyUI
    pip install -r /opt/ComfyUI/requirements.txt || true
fi

# 2. Frontier & Underground AI Red-Teaming Harnesses
echo -e "${CYAN}[3/5] Installing Red-Teaming & Benchmark Harnesses...${RESET}"
pip install \
    garak \
    pyrit \
    promptfoo \
    lm-eval \
    inspect-ai || true

# 3. Agent Orchestrators & Automation Frameworks
echo -e "${CYAN}[4/5] Installing Multi-Agent Orchestrators & Automation Frameworks...${RESET}"
pip install \
    crewai \
    crewai-tools \
    langgraph \
    langchain \
    autogen-agentchat \
    browser-use \
    open-interpreter \
    crawl4ai || true

# Install Caido CLI if available
if ! command -v caido >/dev/null 2>&1; then
    echo -e "${YELLOW}[*] Provisioning Caido Proxy...${RESET}"
    curl -s https://caido.download/releases/v0.44.0/caido-cli-v0.44.0-linux-x86_64.tar.gz | sudo tar -xz -C /usr/local/bin 2>/dev/null || true
fi

# 4. Integrate into system PATH
echo -e "${CYAN}[5/5] Linking AI binaries to /usr/local/bin ...${RESET}"
for bin_file in "$AI_ENV/bin/"*; do
    bname=$(basename "$bin_file")
    if [[ ! -e "/usr/local/bin/$bname" ]]; then
        sudo ln -sf "$bin_file" "/usr/local/bin/$bname" 2>/dev/null || true
    fi
done

echo -e "\n${GREEN}${BOLD}[✓] ZOTHOS AI Stack Successfully Installed and Ready.${RESET}"
