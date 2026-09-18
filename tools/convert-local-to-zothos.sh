#!/usr/bin/env bash
# ==============================================================================
#  ZOTHOS LOCAL SYSTEM CONVERTER / QUICK-DEPLOY
#  Transforms your existing Debian/Parrot/Ubuntu system into ZOTHOS instantly!
# ==============================================================================

set -e

GREEN="\e[1;32m"
CYAN="\e[1;36m"
YELLOW="\e[1;33m"
BOLD="\e[1m"
RESET="\e[0m"

echo -e "${GREEN}${BOLD}"
echo "  ╔════════════════════════════════════════════════════════════════════╗"
echo "  ║         TRANSMUTING HOST SYSTEM INTO ZOTHOS REALITY                ║"
echo "  ╚════════════════════════════════════════════════════════════════════╝"
echo -e "${RESET}"

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo -e "${CYAN}[1/5] Installing ZOTHOS command utilities to /usr/local/bin ...${RESET}"
sudo cp -v "$ROOT_DIR/config/includes.chroot/usr/local/bin/"* /usr/local/bin/
sudo chmod +x /usr/local/bin/zoth-*

echo -e "${CYAN}[2/5] Deploying Wallpapers & Visual Assets ...${RESET}"
sudo mkdir -p /usr/share/backgrounds/zothos
sudo cp -v "$ROOT_DIR/config/includes.chroot/usr/share/backgrounds/zothos/"* /usr/share/backgrounds/zothos/

echo -e "${CYAN}[3/5] Deploying GTK3 Themes (Matrix, Ghost, Incognito) ...${RESET}"
sudo cp -rv "$ROOT_DIR/config/includes.chroot/usr/share/themes/"* /usr/share/themes/

echo -e "${CYAN}[4/5] Deploying Desktop Applications & Shortcuts ...${RESET}"
sudo cp -v "$ROOT_DIR/config/includes.chroot/usr/share/applications/zoth-"*.desktop /usr/share/applications/
mkdir -p "$HOME/Desktop"
cp -v "$ROOT_DIR/config/includes.chroot/usr/share/applications/zoth-"*.desktop "$HOME/Desktop/"
chmod +x "$HOME/Desktop/zoth-"*.desktop 2>/dev/null || true

echo -e "${CYAN}[5/5] Deploying Zoth Studio Assets to /opt/zoth-studio ...${RESET}"
sudo mkdir -p /opt/zoth-studio
sudo cp -r "$ROOT_DIR/config/includes.chroot/opt/zoth-studio/"* /opt/zoth-studio/
sudo chmod +x /opt/zoth-studio/launch.sh

echo -e "\n${GREEN}${BOLD}[✓] ZOTHOS TRANSMUTATION COMPLETE!${RESET}"
echo -e "You can now execute:"
echo -e "  - ${CYAN}zoth-mode matrix${RESET}     (Switch to Hermetic Matrix Reality)"
echo -e "  - ${CYAN}zoth-mode ghost${RESET}      (Switch to nullai.tech Ghostmode)"
echo -e "  - ${CYAN}zoth-mode incognito${RESET}  (Switch to Windows 11 Chameleon)"
echo -e "  - ${CYAN}zoth-ai${RESET}              (Unified AI Command Center)"
echo -e "  - ${CYAN}zoth-sec${RESET}             (Kali & Parrot Security Arsenal)"
echo -e "  - ${CYAN}zoth-matrix-rain${RESET}     (Hermetic Alchemical Rain)"
echo -e "  - ${CYAN}zoth-fastfetch${RESET}       (ZOTHOS System Status Display)\n"
