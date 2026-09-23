#!/usr/bin/env bash
# ==============================================================================
#  ZOTH ARSENAL - Kali & Parrot Apt Repository Setup with Safe Pinning
# ==============================================================================
set -euo pipefail

GREEN="\e[1;32m"
CYAN="\e[1;36m"
YELLOW="\e[1;33m"
RESET="\e[0m"

echo -e "${CYAN}[+] Configuring Zoth Arsenal repository sources (Kali + Parrot)...${RESET}"

# Ensure apt prerequisites
apt-get update -y || true
apt-get install -y --no-install-recommends curl wget gnupg ca-certificates || true

# 1. Setup Kali Archive Key & Sources
mkdir -p /etc/apt/trusted.gpg.d
if [[ ! -f /etc/apt/trusted.gpg.d/kali-archive-keyring.gpg ]]; then
    echo -e "${YELLOW}[*] Fetching Kali Archive Keyring...${RESET}"
    curl -fsSL https://archive.kali.org/archive-key.asc | gpg --dearmor -o /etc/apt/trusted.gpg.d/kali-archive-keyring.gpg 2>/dev/null || true
fi

cat > /etc/apt/sources.list.d/kali.list << 'EOF'
deb [signed-by=/etc/apt/trusted.gpg.d/kali-archive-keyring.gpg] http://http.kali.org/kali kali-rolling main non-free contrib non-free-firmware
EOF

# 2. Setup Parrot Archive Key & Sources
if [[ ! -f /etc/apt/trusted.gpg.d/parrot-archive-keyring.gpg ]]; then
    echo -e "${YELLOW}[*] Fetching Parrot Archive Keyring...${RESET}"
    curl -fsSL https://deb.parrot.sh/parrot/misc/parrotsec.gpg | gpg --dearmor -o /etc/apt/trusted.gpg.d/parrot-archive-keyring.gpg 2>/dev/null || true
fi

cat > /etc/apt/sources.list.d/parrot.list << 'EOF'
deb [signed-by=/etc/apt/trusted.gpg.d/parrot-archive-keyring.gpg] http://deb.parrot.sh/parrot parrot main contrib non-free
EOF

# 3. Setup Safe Apt Pinning
# Ensures base system packages (libc6, systemd, kernel, python3) prefer Debian Trixie,
# while security tools can be freely installed from Kali and Parrot.
mkdir -p /etc/apt/preferences.d
cat > /etc/apt/preferences.d/zoth-arsenal.pref << 'EOF'
Package: *
Pin: release o=Debian,a=trixie
Pin-Priority: 900

Package: *
Pin: release o=Kali
Pin-Priority: 100

Package: *
Pin: release o=Parrot
Pin-Priority: 100
EOF

echo -e "${GREEN}[✓] Zoth Arsenal repositories & pinning configured successfully.${RESET}"
apt-get update -y || true
