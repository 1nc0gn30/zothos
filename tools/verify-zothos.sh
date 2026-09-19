#!/usr/bin/env bash
# ==============================================================================
#  ZOTHOS COMPREHENSIVE INTEGRITY & VERIFICATION SUITE
# ==============================================================================

set -e

GREEN="\e[1;32m"
CYAN="\e[1;36m"
YELLOW="\e[1;33m"
RED="\e[1;31m"
BOLD="\e[1m"
RESET="\e[0m"

echo -e "${GREEN}${BOLD}======================================================"
echo "          ZOTHOS SYSTEM INTEGRITY AUDIT               "
echo -e "======================================================${RESET}\n"

ERRORS=0
WARNINGS=0

check_file() {
    local f="$1"
    local desc="$2"
    if [[ -f "$f" ]]; then
        echo -e "  [PASS] $desc: ${CYAN}$f${RESET}"
    else
        echo -e "  ${RED}[FAIL] Missing file: $f ($desc)${RESET}"
        ERRORS=$((ERRORS + 1))
    fi
}

check_executable() {
    local f="$1"
    if [[ -x "$f" ]]; then
        echo -e "  [PASS] Executable: ${CYAN}$f${RESET}"
    else
        echo -e "  ${RED}[FAIL] Not executable: $f${RESET}"
        ERRORS=$((ERRORS + 1))
    fi
}

check_syntax_bash() {
    local f="$1"
    if bash -n "$f" 2>/dev/null; then
        echo -e "  [PASS] Bash syntax OK: ${CYAN}$f${RESET}"
    else
        echo -e "  ${RED}[FAIL] Bash syntax error: $f${RESET}"
        ERRORS=$((ERRORS + 1))
    fi
}

check_syntax_python() {
    local f="$1"
    if python3 -m py_compile "$f" 2>/dev/null; then
        echo -e "  [PASS] Python syntax OK: ${CYAN}$f${RESET}"
    else
        echo -e "  ${RED}[FAIL] Python syntax error: $f${RESET}"
        ERRORS=$((ERRORS + 1))
    fi
}

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CHROOT="$ROOT_DIR/config/includes.chroot"

echo -e "${BOLD}${YELLOW}[1/5] Auditing Core Scripts in /usr/local/bin ...${RESET}"
SCRIPTS=(
    "$CHROOT/usr/local/bin/zoth"
    "$CHROOT/usr/local/bin/zoth-ai"
    "$CHROOT/usr/local/bin/zoth-sec"
    "$CHROOT/usr/local/bin/zoth-mode"
    "$CHROOT/usr/local/bin/zoth-ghost"
    "$CHROOT/usr/local/bin/zoth-undercover"
    "$CHROOT/usr/local/bin/zoth-fastfetch"
    "$CHROOT/usr/local/bin/zoth-matrix-rain"
    "$CHROOT/usr/local/bin/zoth-quicklock"
    "$CHROOT/usr/local/bin/zoth-netkill"
    "$CHROOT/usr/local/bin/zoth-cockpit"
    "$CHROOT/usr/local/bin/zoth-mcp"
    "$CHROOT/usr/local/bin/zoth-doctor"
    "$CHROOT/usr/local/bin/zoth-sentinel"
    "$CHROOT/usr/local/bin/zoth-sentinel-hud"
    "$CHROOT/usr/local/bin/zoth-desktop-hud"
    "$CHROOT/usr/local/bin/zoth-heal"
    "$CHROOT/usr/local/bin/zoth-studio"
    "$CHROOT/usr/local/bin/hexstrike"
    "$CHROOT/usr/local/bin/hexstrike_mcp"
    "$CHROOT/usr/local/bin/hexstrike_server"
    "$CHROOT/usr/local/bin/zoth-agent-os"
    "$CHROOT/usr/local/bin/zoth-agent-hud"
    "$CHROOT/usr/local/bin/zoth-agent-layer"
    "$CHROOT/usr/local/bin/zoth-live-wallpaper"
)

for s in "${SCRIPTS[@]}"; do
    check_file "$s" "Core CLI Script"
    check_executable "$s"
    if head -n 1 "$s" | grep -q "bash"; then
        check_syntax_bash "$s"
    elif head -n 1 "$s" | grep -q "python"; then
        check_syntax_python "$s"
    fi
done

echo -e "\n${BOLD}${YELLOW}[1b/5] Auditing Systemd Units & Udev Rules ...${RESET}"
check_file "$CHROOT/etc/systemd/system/zoth-ghost-amnesic.service" "Amnesic Systemd Unit"
check_file "$CHROOT/etc/systemd/system/zoth-sentinel.service" "Sentinel AI Systemd Unit"
check_file "$CHROOT/etc/systemd/system/zoth-watchdog.service" "Self-Healing Watchdog Service"
check_file "$CHROOT/etc/systemd/system/zoth-watchdog.timer" "Self-Healing Watchdog Timer"
check_file "$CHROOT/etc/udev/rules.d/99-zoth-panic.rules" "Panic Udev Rules"
check_file "$CHROOT/etc/xdg/picom/picom-matrix.conf" "Matrix Picom Config"
check_file "$CHROOT/etc/xdg/picom/picom-ghost.conf" "Ghost Picom Config"
check_file "$CHROOT/etc/xdg/picom/picom-gold.conf" "Gold Picom Config"
check_file "$CHROOT/etc/xdg/picom/picom-win11.conf" "Win11 Picom Config"
check_file "$ROOT_DIR/installer/calamares/settings.conf" "Calamares Settings"
check_file "$CHROOT/etc/skel/.config/xfce4/panel/whiskermenu-win11.rc" "Win11 Whisker Menu"
check_file "$CHROOT/etc/lightdm/lightdm-gtk-greeter.conf" "LightDM GTK Greeter Config"
check_file "$CHROOT/etc/lightdm/slick-greeter.conf" "LightDM Slick Greeter Config"
check_file "$CHROOT/etc/skel/.bashrc" "Skel Bashrc"
check_file "$CHROOT/etc/skel/.zshrc" "Skel Zshrc"

echo -e "\n${BOLD}${YELLOW}[2/5] Auditing Visual Themes & Generated Wallpapers ...${RESET}"
WALLPAPERS=(
    "$CHROOT/usr/share/backgrounds/zothos/hermetic-matrix.png"
    "$CHROOT/usr/share/backgrounds/zothos/ghostmode-nullai.png"
    "$CHROOT/usr/share/backgrounds/zothos/zoth-gold-master.png"
    "$CHROOT/usr/share/backgrounds/zothos/alchemical-gold.png"
    "$CHROOT/usr/share/backgrounds/zothos/win11-bloom.jpg"
)
for w in "${WALLPAPERS[@]}"; do
    check_file "$w" "Wallpaper Asset"
done

THEMES=(
    "$CHROOT/usr/share/themes/Zoth-Hermetic-Matrix/gtk-3.0/gtk.css"
    "$CHROOT/usr/share/themes/Zoth-Ghost-NullAI/gtk-3.0/gtk.css"
    "$CHROOT/usr/share/themes/Zoth-Azoth-Gold/gtk-3.0/gtk.css"
    "$CHROOT/usr/share/themes/Zoth-Incognito-Win11/gtk-3.0/gtk.css"
)
for t in "${THEMES[@]}"; do
    check_file "$t" "GTK-3.0 Theme CSS"
done

PLYMOUTH_FILES=(
    "$CHROOT/usr/share/plymouth/themes/zothos-matrix/zothos-matrix.plymouth"
    "$CHROOT/usr/share/plymouth/themes/zothos-matrix/zothos-matrix.script"
    "$CHROOT/usr/share/plymouth/themes/zothos-matrix/seal.png"
    "$CHROOT/usr/share/plymouth/themes/zothos-matrix/ring.png"
    "$CHROOT/usr/share/plymouth/themes/zothos-matrix/glow.png"
    "$CHROOT/etc/plymouth/plymouthd.conf"
)
for p in "${PLYMOUTH_FILES[@]}"; do
    check_file "$p" "Plymouth Boot Asset"
done

echo -e "\n${BOLD}${YELLOW}[3/5] Auditing APT Repositories & Pinning Policies ...${RESET}"
check_file "$CHROOT/etc/apt/sources.list.d/kali.list" "Kali Repo"
check_file "$CHROOT/etc/apt/sources.list.d/parrot.list" "Parrot Repo"
check_file "$CHROOT/etc/apt/sources.list.d/zothos.list" "ZothOS Repo"
check_file "$CHROOT/etc/apt/preferences.d/zothos-pinning.pref" "Pinning Policy"

echo -e "\n${BOLD}${YELLOW}[4/5] Auditing Package Lists & ISO Builder ...${RESET}"
check_file "$ROOT_DIR/package-lists/zothos-core.list.chroot" "Core Package List"
check_file "$ROOT_DIR/package-lists/zothos-security-kali-parrot.list.chroot" "Security Package List"
check_file "$ROOT_DIR/package-lists/zothos-programming-devel.list.chroot" "Programming Devel Package List"
check_file "$ROOT_DIR/package-lists/zothos-ai.list.chroot" "AI Arsenal Package List"
check_file "$CHROOT/etc/zothos/mcp-servers.json" "Master MCP Server Registry"
check_file "$CHROOT/etc/zothos/agent-permissions.json" "Agent Permission Ring Config"
check_file "$CHROOT/usr/share/zothos/live-wallpaper/index.html" "Interactive Live Wallpaper Engine"
check_file "$ROOT_DIR/build/build-iso.sh" "Master Build Script"
check_executable "$ROOT_DIR/build/build-iso.sh"
check_syntax_bash "$ROOT_DIR/build/build-iso.sh"
check_file "$ROOT_DIR/build/docker/Dockerfile.builder" "Docker Builder"

echo -e "\n${BOLD}${YELLOW}[5/5] Auditing Zoth Studio & HexStrike Integration ...${RESET}"
check_file "$CHROOT/opt/zoth-studio/launch.sh" "Zoth Studio Launcher"
check_executable "$CHROOT/opt/zoth-studio/launch.sh"
check_syntax_bash "$CHROOT/opt/zoth-studio/launch.sh"
check_file "$CHROOT/opt/zoth-studio/index.html" "Zoth Studio UI Hub"
check_file "$ROOT_DIR/tools/build-zoth-studio-appimage.sh" "Zoth Studio AppImage Builder"
check_executable "$ROOT_DIR/tools/build-zoth-studio-appimage.sh"
check_syntax_bash "$ROOT_DIR/tools/build-zoth-studio-appimage.sh"
check_file "$CHROOT/usr/share/hexstrike-ai/hexstrike_mcp.py" "HexStrike MCP Server"
check_syntax_python "$CHROOT/usr/share/hexstrike-ai/hexstrike_mcp.py"
check_file "$CHROOT/usr/share/hexstrike-ai/hexstrike_server.py" "HexStrike Backend Server"
check_syntax_python "$CHROOT/usr/share/hexstrike-ai/hexstrike_server.py"

echo -e "\n------------------------------------------------------"
if [[ $ERRORS -eq 0 ]]; then
    echo -e "${GREEN}${BOLD}[✓] AUDIT PASSED: All $ERRORS errors found. System is 100% compliant.${RESET}"
    exit 0
else
    echo -e "${RED}${BOLD}[✗] AUDIT FAILED: $ERRORS errors detected.${RESET}"
    exit 1
fi
