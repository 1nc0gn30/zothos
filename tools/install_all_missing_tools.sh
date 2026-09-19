#!/usr/bin/env bash
# ==============================================================================
#  ZOTHOS COMPREHENSIVE TOOL INSTALLER (VM & HOST)
#  Pre-installs 100% of Security, Frontier AI, and UI Arsenal
# ==============================================================================

set -e
export DEBIAN_FRONTEND=noninteractive

echo "[*] Phase 1: Installing native Debian APT security & system packages..."
apt-get update -y
apt-get install -y --no-install-recommends \
    wireshark-qt tshark hydra john aircrack-ng binwalk masscan nmap sqlmap \
    papirus-icon-theme numix-icon-theme numix-icon-theme-circle \
    fonts-jetbrains-mono fonts-firacode fonts-inter fonts-roboto fonts-hack \
    picom rofi plank curl wget git jq htop btop tmux \
    docker.io net-tools dnsutils tcpdump socat p7zip-full unrar-free \
    build-essential libpcap-dev libssl-dev python3-dev python3-pip python3-venv || true

echo "[*] Phase 2: Installing Precompiled Go Security Tools (Nuclei, Amass, Gobuster, FFUF, Subfinder, HTTPX)..."
# Gobuster
if ! which gobuster >/dev/null 2>&1; then
    echo "  -> Installing gobuster..."
    wget -qO /tmp/gobuster.tar.gz https://github.com/OJ/gobuster/releases/download/v3.6.0/gobuster_Linux_x86_64.tar.gz && \
    tar -xzf /tmp/gobuster.tar.gz -C /tmp/ && mv /tmp/gobuster /usr/local/bin/ && rm -f /tmp/gobuster.tar.gz
fi

# FFUF
if ! which ffuf >/dev/null 2>&1; then
    echo "  -> Installing ffuf..."
    wget -qO /tmp/ffuf.tar.gz https://github.com/ffuf/ffuf/releases/download/v2.1.0/ffuf_2.1.0_linux_amd64.tar.gz && \
    tar -xzf /tmp/ffuf.tar.gz -C /tmp/ && mv /tmp/ffuf /usr/local/bin/ && rm -f /tmp/ffuf.tar.gz
fi

# Nuclei
if ! which nuclei >/dev/null 2>&1; then
    echo "  -> Installing nuclei..."
    wget -qO /tmp/nuclei.zip https://github.com/projectdiscovery/nuclei/releases/download/v3.3.2/nuclei_3.3.2_linux_amd64.zip && \
    unzip -qo /tmp/nuclei.zip -d /tmp/ && mv /tmp/nuclei /usr/local/bin/ && rm -f /tmp/nuclei.zip
fi

# Subfinder
if ! which subfinder >/dev/null 2>&1; then
    echo "  -> Installing subfinder..."
    wget -qO /tmp/subfinder.zip https://github.com/projectdiscovery/subfinder/releases/download/v2.6.6/subfinder_2.6.6_linux_amd64.zip && \
    unzip -qo /tmp/subfinder.zip -d /tmp/ && mv /tmp/subfinder /usr/local/bin/ && rm -f /tmp/subfinder.zip
fi

# HTTPX
if ! which httpx >/dev/null 2>&1; then
    echo "  -> Installing httpx..."
    wget -qO /tmp/httpx.zip https://github.com/projectdiscovery/httpx/releases/download/v1.6.8/httpx_1.6.8_linux_amd64.zip && \
    unzip -qo /tmp/httpx.zip -d /tmp/ && mv /tmp/httpx /usr/local/bin/ && rm -f /tmp/httpx.zip
fi

# Amass
if ! which amass >/dev/null 2>&1; then
    echo "  -> Installing amass..."
    wget -qO /tmp/amass.zip https://github.com/owasp-amass/amass/releases/download/v4.2.0/amass_Linux_amd64.zip && \
    unzip -qo /tmp/amass.zip -d /tmp/ && mv /tmp/amass_Linux_amd64/amass /usr/local/bin/ && rm -rf /tmp/amass*
fi

# Radare2
if ! which r2 >/dev/null 2>&1; then
    echo "  -> Installing radare2..."
    wget -qO /tmp/radare2.deb https://github.com/radareorg/radare2/releases/download/5.9.8/radare2_5.9.8_amd64.deb && \
    dpkg -i /tmp/radare2.deb 2>/dev/null || apt-get install -f -y && rm -f /tmp/radare2.deb
fi

echo "[*] Phase 3: Installing Metasploit Framework..."
if ! which msfconsole >/dev/null 2>&1; then
    echo "  -> Installing Metasploit Omnibus package..."
    curl -fsSL https://raw.githubusercontent.com/rapid7/metasploit-omnibus/master/config/templates/metasploit-framework-wrappers/msfupdate.erb > /tmp/msfinstall
    chmod 755 /tmp/msfinstall
    /tmp/msfinstall || true
    rm -f /tmp/msfinstall
fi

echo "[*] Phase 4: Setting up Python Security & AI Tooling (theHarvester, Garak, PyRIT, Aider)..."
mkdir -p /opt/zothos-venvs
if [ ! -d /opt/zothos-venvs/ai-security ]; then
    python3 -m venv /opt/zothos-venvs/ai-security
    /opt/zothos-venvs/ai-security/bin/pip install --upgrade pip setuptools wheel
    /opt/zothos-venvs/ai-security/bin/pip install --no-cache-dir \
        theHarvester garak pyrit aider-chat promptfoo inspect-ai crawl4ai \
        scapy impacket requests rich typer textual || true
fi

# Link python binaries to /usr/local/bin if they exist
for tool in theHarvester garak pyrit aider; do
    if [ -f /opt/zothos-venvs/ai-security/bin/$tool ]; then
        ln -sf /opt/zothos-venvs/ai-security/bin/$tool /usr/local/bin/$tool
    fi
done

echo "[*] Phase 5: Setting permissions and verifying all tools..."
chmod +x /usr/local/bin/* 2>/dev/null || true

echo "=== PRE-INSTALLED TOOLS VERIFICATION ==="
for cmd in nmap wireshark tshark sqlmap gobuster ffuf hydra john r2 aircrack-ng msfconsole nuclei amass subfinder httpx docker ollama uv aider garak pyrit hermes; do
    if which $cmd >/dev/null 2>&1; then
        echo "  [INSTALLED] $cmd -> $(which $cmd)"
    else
        echo "  [WARNING] $cmd missing"
    fi
done

echo "[✓] Tool Installation & Hardening Complete."
