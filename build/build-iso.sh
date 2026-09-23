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
for pkg in live-build debootstrap xorriso squashfs-tools isolinux syslinux-common; do
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
umount -l "$WORK_DIR/chroot/proc" 2>/dev/null || true
umount -l "$WORK_DIR/chroot/sys" 2>/dev/null || true
umount -l "$WORK_DIR/chroot/dev/pts" 2>/dev/null || true
umount -l "$WORK_DIR/chroot/dev" 2>/dev/null || true
rm -rf "$WORK_DIR"
mkdir -p "$WORK_DIR"
cd "$WORK_DIR"

echo -e "${CYAN}[3/6] Initializing live-build configuration...${RESET}"
export LIVE_BUILD=/usr/lib/live
lb config \
    --distribution trixie \
    --architecture amd64 \
    --archive-areas "main contrib non-free non-free-firmware" \
    --bootloader syslinux \
    --binary-images iso-hybrid \
    --iso-application "ZOTHOS Linux 1.0 (Azoth)" \
    --iso-publisher "Zoth Studio & NullAI <https://zoth.nullai.tech>" \
    --iso-volume "ZOTHOS_1.0" \
    --initramfs live-boot \
    --linux-flavours amd64 \
    --linux-packages linux-image-amd64 \
    --bootappend-live "boot=live components username=neo hostname=zothos quiet splash systemd.unit=graphical.target" \
    --apt-secure false \
    --apt-options "--yes --ignore-missing"

# Add Kali and Parrot repositories for security/AI packages
mkdir -p "$WORK_DIR/config/apt/sources.list.d"
cat > "$WORK_DIR/config/apt/sources.list.d/kali.list" << 'KALEOF'
deb [trusted=yes] http://http.kali.org/kali kali-rolling main non-free non-free-firmware
KALEOF
cat > "$WORK_DIR/config/apt/sources.list.d/parrot.list" << 'PAROTEOF'
deb [trusted=yes] http://deb.parrot.sh/parrot parrot main non-free non-free-firmware
PAROTEOF
cat > "$WORK_DIR/config/apt/sources.list.d/zothos.list" << 'ZOTHOEOF'
deb [trusted=yes] file:///opt/zothos/repo /
ZOTHOEOF

echo -e "${CYAN}[4/6] Staging package lists and chroot inclusions...${RESET}"
mkdir -p config/package-lists
cp "$PROJECT_DIR/package-lists/"*.list.chroot config/package-lists/
# Also stage the rich native package lists (00-core .. 90-science, aliases) so
# the full desktop/security/AI/media/web3 arsenal actually gets baked into the ISO.
cp "$PROJECT_DIR"/config/package-lists/*.list.chroot config/package-lists/ 2>/dev/null || true

mkdir -p config/includes.chroot
# Copy ALL chroot overlay files recursively preserving permissions and hierarchy
cp -a "$PROJECT_DIR/config/includes.chroot/." config/includes.chroot/

# Ensure all scripts inside /usr/local/bin have execution bit set
chmod +x config/includes.chroot/usr/local/bin/* 2>/dev/null || true

# Add chroot post-install hook to configure default user and services
mkdir -p config/hooks/normal
cat <<'EOF' > config/hooks/normal/0000-install-initramfs.hook.chroot
#!/bin/sh
set -e
echo "[ZOTHOS HOOK] Guaranteeing desktop, LightDM, initramfs-tools & linux-image..."
apt-get update -y || true
apt-get install -y --no-install-recommends initramfs-tools linux-image-amd64 live-boot xfce4 xfce4-terminal xfce4-goodies lightdm lightdm-gtk-greeter xorg x11-xserver-utils desktop-base dbus-x11 at-spi2-core xfce4-settings || true
EOF
chmod +x config/hooks/normal/0000-install-initramfs.hook.chroot

cat <<'EOF' > config/hooks/normal/099-zothos-setup.hook.chroot
#!/bin/sh
set -e

if ! id "neo" >/dev/null 2>&1; then
    groupadd -f docker || true
    useradd -m -s /bin/bash -G sudo,audio,video neo 2>/dev/null || true
    echo "neo:zoth" | chpasswd
fi

# Enable NetworkManager and LightDM
systemctl enable NetworkManager || true
systemctl enable lightdm || true
systemctl enable tor || true
systemctl set-default graphical.target || true

# Configure Plymouth default boot splash
if command -v plymouth-set-default-theme >/dev/null 2>&1; then
    plymouth-set-default-theme -R zothos-matrix 2>/dev/null || plymouth-set-default-theme -R zoth-matrix 2>/dev/null || true
fi

# Setup Fastfetch / Bash defaults
cp -rf /etc/skel/. /home/neo/
chown -R neo:neo /home/neo

echo "[ZOTHOS HOOK] Complete."
EOF
chmod +x config/hooks/normal/099-zothos-setup.hook.chroot

echo -e "${CYAN}[5/6] Generating 4K wallpapers & 3D visual assets...${RESET}"
# Execute master wallpaper, 3D glassmorphic icon, and Plymouth theme synthesizers
if [ -f "$PROJECT_DIR/tools/generate_plymouth_assets.py" ]; then
    python3 "$PROJECT_DIR/tools/generate_plymouth_assets.py" 2>&1 | tail -5
fi
if [ -f "$PROJECT_DIR/generate_zoth_wallpapers.py" ]; then
    python3 "$PROJECT_DIR/generate_zoth_wallpapers.py" 2>&1 | tail -5
fi
if [ -f "$PROJECT_DIR/generate_zoth_icons.py" ]; then
    python3 "$PROJECT_DIR/generate_zoth_icons.py" 2>&1 | tail -5
fi
cp -a "$PROJECT_DIR/config/includes.chroot/usr/share/backgrounds/zothos" config/includes.chroot/usr/share/backgrounds/ 2>/dev/null || true
cp -a "$PROJECT_DIR/config/includes.chroot/usr/share/icons/." config/includes.chroot/usr/share/icons/ 2>/dev/null || true
cp -a "$PROJECT_DIR/config/includes.chroot/usr/share/plymouth/themes/." config/includes.chroot/usr/share/plymouth/themes/ 2>/dev/null || true

echo -e "${GREEN}[6/6] Starting Live-Build execution (lb build)...${RESET}"
echo -e "${YELLOW}[*] This will bootstrap the Debian base, fetch security & AI packages, and compile the ISO.${RESET}"
export LIVE_BUILD=/usr/lib/live
lb build 2>&1 | tee /tmp/lb-build.log

if [[ -f live-image-amd64.hybrid.iso ]]; then
    mv live-image-amd64.hybrid.iso "$PROJECT_DIR/build/zothos-1.0-amd64.iso"
    echo -e "\n${GREEN}${BOLD}[✓] SUCCESS: ZOTHOS ISO built at: $PROJECT_DIR/build/zothos-1.0-amd64.iso${RESET}\n"
else
    echo -e "\n${YELLOW}[!] Build finished. Inspect workspace logs in $WORK_DIR${RESET}\n"
fi
