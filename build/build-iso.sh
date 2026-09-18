#!/usr/bin/env bash
# ==============================================================================
#  ZOTHOS LIVE ISO BUILD SCRIPT
#  Builds a bootable hybrid UEFI/BIOS ISO: zothos-1.0-amd64.iso
#  Based on Debian 13 (Trixie) with Kali & Parrot Security Arsenal + Frontier AI
# ==============================================================================

set -e

GREEN="\e[1;32m"
CYAN="\e[1;36m"
YELLOW="\e[1;33m"
RED="\e[1;31m"
BOLD="\e[1m"
RESET="\e[0m"

echo -e "${GREEN}${BOLD}"
echo "  ╔════════════════════════════════════════════════════════════════════╗"
echo "  ║                  ZOTHOS DISTRIBUTION BUILDER                      ║"
echo "  ║              The Alchemical & Agentic Security OS                  ║"
echo "  ╚════════════════════════════════════════════════════════════════════╝"
echo -e "${RESET}"

if [[ $EUID -ne 0 ]]; then
    echo -e "${RED}[!] This build script requires root privileges to configure chroot and loop devices.${RESET}"
    echo -e "    Please run: sudo bash $0"
    exit 1
fi

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
WORK_DIR="$PROJECT_DIR/build/live_workspace"

echo -e "${CYAN}[1/6] Verifying host build prerequisites...${RESET}"
MISSING_PKGS=()
for pkg in live-build debootstrap xorriso squashfs-tools isolinux syslinux-common grub-pc-bin grub-efi-amd64-bin; do
    if ! dpkg -l "$pkg" >/dev/null 2>&1; then
        MISSING_PKGS+=("$pkg")
    fi
done

if [[ ${#MISSING_PKGS[@]} -gt 0 ]]; then
    echo -e "${YELLOW}[*] Installing missing build tools: ${MISSING_PKGS[*]}...${RESET}"
    apt-get update -y
    apt-get install -y "${MISSING_PKGS[@]}"
fi

echo -e "${CYAN}[2/6] Setting up clean workspace at $WORK_DIR ...${RESET}"
rm -rf "$WORK_DIR"
mkdir -p "$WORK_DIR"
cd "$WORK_DIR"

echo -e "${CYAN}[3/6] Initializing live-build configuration...${RESET}"
lb config \
    --distribution trixie \
    --architecture amd64 \
    --archive-areas "main contrib non-free non-free-firmware" \
    --bootloader grub-efi \
    --binary-images iso-hybrid \
    --iso-application "ZOTHOS Linux 1.0 (Azoth)" \
    --iso-publisher "Zoth Studio & NullAI <https://zothos.org>" \
    --iso-volume "ZOTHOS_1.0" \
    --memtest none \
    --win32-loader false

echo -e "${CYAN}[4/6] Staging package lists and chroot inclusions...${RESET}"
mkdir -p config/package-lists
cp "$PROJECT_DIR/package-lists/"*.list.chroot config/package-lists/

mkdir -p config/includes.chroot
cp -r "$PROJECT_DIR/config/includes.chroot/"* config/includes.chroot/

# Ensure all scripts inside /usr/local/bin have execution bit set
chmod +x config/includes.chroot/usr/local/bin/* 2>/dev/null || true

# Add chroot post-install hook to configure default user and services
mkdir -p config/hooks/normal
cat <<'EOF' > config/hooks/normal/099-zothos-setup.hook.chroot
#!/bin/sh
set -e

echo "[ZOTHOS HOOK] Setting up default user 'neo' and security permissions..."
# Ensure default user exists with sudo
if ! id "neo" >/dev/null 2>&1; then
    useradd -m -s /bin/bash -G sudo,audio,video,dialout,plugdev,docker neo
    echo "neo:zoth" | chpasswd
fi

# Enable NetworkManager and LightDM
systemctl enable NetworkManager || true
systemctl enable lightdm || true
systemctl enable tor || true

# Setup Fastfetch / Bash defaults
cp -rf /etc/skel/. /home/neo/
chown -R neo:neo /home/neo

echo "[ZOTHOS HOOK] Complete."
EOF
chmod +x config/hooks/normal/099-zothos-setup.hook.chroot

echo -e "${CYAN}[5/6] Generating wallpapers...${RESET}"
python3 "$PROJECT_DIR/tools/generate-wallpapers.py"
cp -r "$PROJECT_DIR/config/includes.chroot/usr/share/backgrounds/zothos" config/includes.chroot/usr/share/backgrounds/

echo -e "${GREEN}[6/6] Starting Live-Build execution (lb build)...${RESET}"
echo -e "${YELLOW}[*] This will bootstrap the Debian base, fetch security & AI packages, and compile the ISO.${RESET}"
lb build

if [[ -f live-image-amd64.hybrid.iso ]]; then
    mv live-image-amd64.hybrid.iso "$PROJECT_DIR/build/zothos-1.0-amd64.iso"
    echo -e "\n${GREEN}${BOLD}[✓] SUCCESS: ZOTHOS ISO built at: $PROJECT_DIR/build/zothos-1.0-amd64.iso${RESET}\n"
else
    echo -e "\n${YELLOW}[!] Build finished. Inspect workspace logs in $WORK_DIR${RESET}\n"
fi
