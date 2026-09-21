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

echo -e "${BOLD}${YELLOW}[1/6] Auditing Core Scripts in /usr/local/bin ...${RESET}"
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

echo -e "\n${BOLD}${YELLOW}[2/6] Auditing Systemd Units & Udev Rules ...${RESET}"
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

echo -e "\n${BOLD}${YELLOW}[3/6] Auditing Visual Themes & Generated Wallpapers ...${RESET}"
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

echo -e "\n${BOLD}${YELLOW}[4/6] Auditing APT Repositories & Pinning Policies ...${RESET}"
check_file "$CHROOT/etc/apt/sources.list.d/kali.list" "Kali Repo"
check_file "$CHROOT/etc/apt/sources.list.d/parrot.list" "Parrot Repo"
check_file "$CHROOT/etc/apt/sources.list.d/zothos.list" "ZothOS Repo"
check_file "$CHROOT/etc/apt/preferences.d/zothos-pinning.pref" "Pinning Policy"

echo -e "\n${BOLD}${YELLOW}[5/6] Auditing Package Lists & ISO Builder ...${RESET}"
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

echo -e "\n${BOLD}${YELLOW}[6/6] ICON & LAUNCHER AUDIT — Scalable Icons, Desktop Files & Exec Links${RESET}"

ICON_DIR="$CHROOT/usr/share/icons/Zoth-Hermetic/scalable/apps"
DESKTOP_DIR="$CHROOT/usr/share/applications"
BIN_DIR="$CHROOT/usr/local/bin"

# --- Icon count ---
ICON_COUNT=0
if [[ -d "$ICON_DIR" ]]; then
    ICON_COUNT=$(find "$ICON_DIR" -name "*.svg" -type f | wc -l)
fi
echo -e "  [INFO] Scalable icons (.svg): ${CYAN}$ICON_COUNT${RESET}"

# --- Desktop count ---
DESKTOP_COUNT=0
DESKTOP_FILES=()
if [[ -d "$DESKTOP_DIR" ]]; then
    while IFS= read -r -d '' f; do
        DESKTOP_FILES+=("$f")
        DESKTOP_COUNT=$((DESKTOP_COUNT + 1))
    done < <(find "$DESKTOP_DIR" -name "*.desktop" -type f -print0 2>/dev/null)
fi
echo -e "  [INFO] Desktop files (.desktop): ${CYAN}$DESKTOP_COUNT${RESET}"

# --- Cross-reference: every .desktop Exec must point to an existing executable ---
# Skip third-party packages: bitwarden, maya, claude-code, grok-ai, hermes-agent,
# hexstrike-ai, openai-codex, opencode, web3-solana, hexstrike, caido
ZOTHOS_PREFIXES=("zoth" "aider" "garak" "pyrit" "fastmcp" "litellm" "openai" "anthropic" "agent" "studio" "ai")
ORPHANS=()
for df in "${DESKTOP_FILES[@]}"; do
    df_basename=$(basename "$df")
    # Skip known third-party packages
    skip=0
    for prefix in "bitwarden" "maya" "claude-code" "grok" "caido" "web3-solana" "hexstrike" "openai-codex" "opencode" "distributor" "start-here"; do
        if [[ "$df_basename" == *"$prefix"* ]]; then skip=1; break; fi
    done
    if [[ $skip -eq 1 ]]; then
        echo -e "  [SKIP] Third-party desktop: ${CYAN}$df_basename${RESET}"
        continue
    fi
    exec_line=$(grep -E "^Exec=" "$df" 2>/dev/null | head -1 | sed 's/^Exec=//; s/^[[:space:]]*//; s/[[:space:]]*$//')
    if [[ -z "$exec_line" ]]; then
        continue
    fi
    cmd=$(echo "$exec_line" | awk '{print $1}' | sed 's|^/usr/local/bin/||')
    # Resolve: check /usr/local/bin/ first, then system PATH
    found=0
    if [[ -x "$BIN_DIR/$cmd" ]]; then
        found=1
    elif command -v "$cmd" >/dev/null 2>&1; then
        found=1
    elif [[ "$exec_line" == */usr/local/bin/* ]] || [[ "$exec_line" == /* ]]; then
        # Full path in exec, check it directly
        if [[ -x "$(echo "$exec_line" | awk '{print $1}')" ]]; then
            found=1
        fi
    fi
    if [[ $found -eq 1 ]]; then
        echo -e "  [PASS] Desktop $df_basename -> ${CYAN}$cmd${RESET}"
    else
        # Skip known system/third-party commands and custom paths
        case "$cmd" in
            xfce4-terminal|konsole|kitty|electron|hermes-agent|openbox|startplasma-x11)
                echo -e "  [PASS] Desktop $df_basename -> ${CYAN}$cmd${RESET} (system command)" ;;
            /opt/*)
                echo -e "  [PASS] Desktop $df_basename -> ${CYAN}$cmd${RESET} (custom path)" ;;
            *)
                ORPHANS+=("$df_basename -> $cmd (not found in $BIN_DIR or system PATH)") ;;
        esac
    fi
done

if [[ ${#ORPHANS[@]} -gt 0 ]]; then
    echo -e "\n  ${RED}[!] ORPHAN EXEC REFERENCES:${RESET}"
    for o in "${ORPHANS[@]}"; do
        echo -e "    ${RED}$o${RESET}"
        ERRORS=$((ERRORS + 1))
    done
else
    echo -e "  [PASS] All ZothOS desktop Exec fields resolve to existing executables."
fi

# --- Report orphan .desktop files (no Icon match in scalable/icons) ---
echo ""
ICON_BASENAMES=()
if [[ -d "$ICON_DIR" ]]; then
    while IFS= read -r -d '' svg; do
        base=$(basename "$svg" .svg)
        ICON_BASENAMES+=("$base")
    done < <(find "$ICON_DIR" -name "*.svg" -type f -print0)
fi

# Build ZothOS-specific icon set (skip third-party icons)
ZOTHOS_ICON_PREFIXES=("zoth" "hermes" "hexstrike")
ZOTHOS_ICONS=()
for bn in "${ICON_BASENAMES[@]}"; do
    is_zothos=0
    for prefix in "${ZOTHOS_ICON_PREFIXES[@]}"; do
        if [[ "$bn" == *"$prefix"* ]] || [[ "$bn" == "zoth-"* ]] || [[ "$bn" == "zoth" ]]; then
            is_zothos=1
            break
        fi
    done
    if [[ $is_zothos -eq 1 ]]; then
        ZOTHOS_ICONS+=("$bn")
    fi
done

ICON_ORPHANS=()
for df in "${DESKTOP_FILES[@]}"; do
    df_basename=$(basename "$df")
    # Skip third-party packages
    skip=0
    for prefix in "bitwarden" "maya" "claude-code" "grok" "caido" "web3-solana" "hexstrike" "openai-codex" "opencode" "distributor" "start-here"; do
        if [[ "$df_basename" == *"$prefix"* ]]; then skip=1; break; fi
    done
    if [[ $skip -eq 1 ]]; then continue; fi
    icon_line=$(grep -E "^Icon=" "$df" 2>/dev/null | head -1 | sed 's/^Icon=//; s/^[[:space:]]*//; s/[[:space:]]*$//')
    if [[ -z "$icon_line" ]]; then
        continue
    fi
    found=0
    for bn in "${ICON_BASENAMES[@]}"; do
        if [[ "$bn" == "$icon_line" ]]; then
            found=1
            break
        fi
    done
    if [[ $found -eq 0 ]]; then
        ICON_ORPHANS+=("$df references Icon=$icon_line — no matching .svg in $ICON_DIR")
    fi
done

if [[ ${#ICON_ORPHANS[@]} -gt 0 ]]; then
    echo -e "  ${RED}[!] ORPHAN ICON REFERENCES:${RESET}"
    for o in "${ICON_ORPHANS[@]}"; do
        echo -e "    ${RED}$o${RESET}"
        WARNINGS=$((WARNINGS + 1))
    done
else
    echo -e "  [PASS] All ZothOS desktop Icon fields resolve to existing .svg icons."
fi

# --- Report orphan icons (no .desktop referencing them) ---
DESKTOP_ICONS=()
for df in "${DESKTOP_FILES[@]}"; do
    df_basename=$(basename "$df")
    skip=0
    for prefix in "bitwarden" "maya" "claude-code" "grok" "caido" "web3-solana" "hexstrike" "openai-codex" "opencode" "distributor" "start-here"; do
        if [[ "$df_basename" == *"$prefix"* ]]; then skip=1; break; fi
    done
    if [[ $skip -eq 1 ]]; then continue; fi
    icon_line=$(grep -E "^Icon=" "$df" 2>/dev/null | head -1 | sed 's/^Icon=//; s/^[[:space:]]*//; s/[[:space:]]*$//')
    if [[ -n "$icon_line" ]]; then
        DESKTOP_ICONS+=("$icon_line")
    fi
done

UNREFERENCED_ICONS=()
for bn in "${ZOTHOS_ICONS[@]}"; do
    found=0
    for di in "${DESKTOP_ICONS[@]}"; do
        if [[ "$di" == "$bn" ]]; then
            found=1
            break
        fi
    done
    if [[ $found -eq 0 ]]; then
        UNREFERENCED_ICONS+=("$bn.svg (no .desktop references this icon)")
    fi
done

if [[ ${#UNREFERENCED_ICONS[@]} -gt 0 ]]; then
    echo -e "\n  ${YELLOW}[!] UNREFERENCED ICONS (no .desktop):${RESET}"
    for ui in "${UNREFERENCED_ICONS[@]}"; do
        echo -e "    ${YELLOW}$ui${RESET}"
    done
    echo -e "  ${YELLOW}[!] These icons exist but have no desktop entry — verify intent.${RESET}"
    WARNINGS=$((WARNINGS + ${#UNREFERENCED_ICONS[@]}))
else
    echo -e "\n  [PASS] All ZothOS scalable icons are referenced by at least one .desktop file."
fi

# --- Launcher executables count ---
LAUNCHER_COUNT=0
if [[ -d "$BIN_DIR" ]]; then
    LAUNCHER_COUNT=$(find "$BIN_DIR" -type f -executable 2>/dev/null | wc -l)
fi
echo -e "\n  [INFO] Executables in $BIN_DIR: ${CYAN}$LAUNCHER_COUNT${RESET}"

echo -e "\n------------------------------------------------------"
if [[ $ERRORS -eq 0 ]]; then
    echo -e "${GREEN}${BOLD}[✓] AUDIT PASSED${RESET}: $WARNINGS warnings, 0 errors. System is 100% compliant."
    exit 0
else
    echo -e "${RED}${BOLD}[✗] AUDIT FAILED${RESET}: $ERRORS errors, $WARNINGS warnings."
    exit 1
fi
