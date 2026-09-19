#!/usr/bin/env bash
set -eo pipefail

# ==============================================================================
# ZOTH STUDIO — Sovereign Local-First AI Agent Environment Installer
# Usage:
#   curl -fsSL https://raw.githubusercontent.com/NullAITech/zoth-studio/main/public/install.sh | bash
#   curl -fsSL https://raw.githubusercontent.com/NullAITech/zoth-studio/main/public/install.sh | bash -s -- --unattended
#   ./install.sh -y --dir ~/.zoth
# ==============================================================================

# Parse options & environment
UNATTENDED="${ZOTH_UNATTENDED:-0}"
INSTALL_DIR="${ZOTH_INSTALL_DIR:-$HOME/.zoth}"
BIN_DIR="${ZOTH_BIN_DIR:-$HOME/.local/bin}"
REPO_URL="${ZOTH_REPO_URL:-https://github.com/NullAITech/zoth-studio.git}"
BRANCH="${ZOTH_BRANCH:-main}"
USE_COLOR=1

# Auto-detect non-interactive CI/Docker environments
if [ "${CI:-}" = "true" ] || [ "${CI:-}" = "1" ] || [ "${DEBIAN_FRONTEND:-}" = "noninteractive" ] || [ ! -t 0 ]; then
    UNATTENDED=1
fi

show_help() {
    cat << EOF
Zoth Studio Universal Installer

Usage:
  install.sh [options]
  curl -fsSL https://raw.githubusercontent.com/NullAITech/zoth-studio/main/public/install.sh | bash -s -- [options]

Options:
  -y, --yes, --unattended, --no-prompt, --non-interactive
                        Run non-interactively without terminal prompts
  -d, --dir, --install-dir <path>
                        Custom installation directory (default: ~/.zoth)
  --bin-dir <path>      Custom binary directory (default: ~/.local/bin)
  --security              Activate Security-Tier tools (Hacker Mode)
  -b, --branch <name>   Git branch to checkout (default: main)
  --repo <url>          Git repository URL (default: https://github.com/NullAITech/zoth-studio.git)
  --no-color            Disable ANSI color output
  -h, --help            Show this help message and exit

Environment Variables:
  ZOTH_UNATTENDED=1     Enable unattended / non-interactive installation
  ZOTH_INSTALL_DIR      Target installation directory
  ZOTH_BIN_DIR          Target directory for CLI binary symlink
  ZOTH_REPO_URL         Source git repository
  ZOTH_BRANCH           Source branch
EOF
}

while [[ $# -gt 0 ]]; do
    case "$1" in
        -y|--yes|-u|--unattended|--no-prompt|--non-interactive)
            UNATTENDED=1
            shift
            ;;
        -d|--dir|--install-dir)
            INSTALL_DIR="$2"
            shift 2
            ;;
        --bin-dir)
            BIN_DIR="$2"
            shift 2
            ;;
        -b|--branch)
            BRANCH="$2"
            shift 2
            ;;
        --repo|--repo-url)
            REPO_URL="$2"
            shift 2
            ;;
        --no-color)
            USE_COLOR=0
            shift
            ;;
        --security)
            mkdir -p "$HOME/.zoth"
            touch "$HOME/.zoth/.security_mode"
            shift
            ;;
        -h|--help)
            show_help
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            show_help
            exit 1
            ;;
    esac
done

if [ "$USE_COLOR" -eq 1 ] && [ -t 1 ] && [ -z "${NO_COLOR:-}" ]; then
    GOLD="\033[38;2;251;191;36m"
    CYAN="\033[38;2;0;240;255m"
    GREEN="\033[38;2;52;211;153m"
    PURPLE="\033[38;2;192;132;252m"
    RED="\033[38;2;244;63;94m"
    GRAY="\033[38;2;148;163;184m"
    BOLD="\033[1m"
    DIM="\033[2m"
    RESET="\033[0m"
else
    GOLD=""
    CYAN=""
    GREEN=""
    PURPLE=""
    RED=""
    GRAY=""
    BOLD=""
    DIM=""
    RESET=""
fi

echo -e "${GOLD}${BOLD}"
cat << "ASCIIEOF"
  ███████╗ ██████╗ ████████╗██╗  ██╗    ███████╗████████╗██╗   ██╗██████╗ ██╗ ██████╗ 
  ╚══███╔╝██╔═══██╗╚══██╔══╝██║  ██║    ██╔════╝╚══██╔══╝██║   ██║██╔══██╗██║██╔═══██╗
    ███╔╝ ██║   ██║   ██║   ███████║    ███████╗   ██║   ██║   ██║██║  ██║██║██║   ██║
   ███╔╝  ██║   ██║   ██║   ██╔══██║    ╚════██║   ██║   ██║   ██║██║  ██║██║██║   ██║
  ███████╗╚██████╔╝   ██║   ██║  ██║    ███████║   ██║   ╚██████╔╝██████╔╝██║╚██████╔╝
  ╚══════╝ ╚═════╝    ╚═╝   ╚═╝  ╚═╝    ╚══════╝   ╚═╝    ╚═════╝ ╚═════╝ ╚═╝ ╚═════╝ 
ASCIIEOF
echo -e "${RESET}${GRAY}  [ Sovereign Local-First AI Agent Environment · Autonomous Multi-Node Studio ]${RESET}\n"

if [ "$UNATTENDED" -eq 1 ]; then
    echo -e "  ${PURPLE}⚙ Non-Interactive / Unattended Mode Active${RESET}"
    export GIT_TERMINAL_PROMPT=0
fi

echo -e "${BOLD}Initializing Zoth Studio Architecture...${RESET}\n"

# Step 1: Check Git
if ! command -v git &> /dev/null; then
    echo -e "${RED}✖ Error: git is required to install Zoth Studio.${RESET}"
    echo -e "  Install with:"
    echo -e "    Debian/Ubuntu: sudo apt-get install -y git"
    echo -e "    macOS:         brew install git"
    echo -e "    Fedora/RHEL:   sudo dnf install -y git"
    echo -e "    Arch Linux:    sudo pacman -S --noconfirm git"
    exit 1
fi
echo -e "  ${GREEN}✔${RESET} Git found: $(git --version)"

# Step 2: Check Python
PYTHON_BIN=""
if command -v python3 &> /dev/null; then
    PYTHON_BIN="python3"
elif command -v python &> /dev/null; then
    PYTHON_BIN="python"
fi

if [ -z "$PYTHON_BIN" ]; then
    echo -e "${RED}✖ Error: python3 (3.10+) is required to run the orchestrator.${RESET}"
    echo -e "  Install with:"
    echo -e "    Debian/Ubuntu: sudo apt-get install -y python3 python3-pip"
    echo -e "    macOS:         brew install python"
    exit 1
fi
echo -e "  ${GREEN}✔${RESET} Python found: $($PYTHON_BIN --version)"

# Step 3: Fetch / Update Repository
echo -e "\n${BOLD}Fetching Repository & Workstations into ${CYAN}$INSTALL_DIR${RESET}..."
if [ -d "$INSTALL_DIR/.git" ]; then
    echo -e "  ${GRAY}Updating existing installation in $INSTALL_DIR...${RESET}"
    git -C "$INSTALL_DIR" fetch origin "$BRANCH" || true
    git -C "$INSTALL_DIR" pull --ff-only origin "$BRANCH" 2>/dev/null || git -C "$INSTALL_DIR" pull origin "$BRANCH" || true
elif [ -d "$INSTALL_DIR" ]; then
    echo -e "  ${GRAY}Target directory exists without git repository. Initializing...${RESET}"
    git clone --depth 1 --branch "$BRANCH" "$REPO_URL" "$INSTALL_DIR.tmp"
    cp -r "$INSTALL_DIR.tmp/." "$INSTALL_DIR/"
    rm -rf "$INSTALL_DIR.tmp"
else
    echo -e "  ${GRAY}Cloning Zoth Studio ($BRANCH) into $INSTALL_DIR...${RESET}"
    mkdir -p "$(dirname "$INSTALL_DIR")"
    git clone --depth 1 --branch "$BRANCH" "$REPO_URL" "$INSTALL_DIR"
fi

# Step 4: Symlink CLI Binary to ~/.local/bin/zoth
ZOTH_CLI_SRC=""
if [ -f "$INSTALL_DIR/core-app/bin/zoth" ]; then
    ZOTH_CLI_SRC="$INSTALL_DIR/core-app/bin/zoth"
elif [ -f "$INSTALL_DIR/bin/zoth" ]; then
    ZOTH_CLI_SRC="$INSTALL_DIR/bin/zoth"
elif [ -f "$INSTALL_DIR/scripts/zoth-start.sh" ]; then
    ZOTH_CLI_SRC="$INSTALL_DIR/scripts/zoth-start.sh"
fi

if [ -n "$ZOTH_CLI_SRC" ]; then
    mkdir -p "$BIN_DIR"
    chmod +x "$ZOTH_CLI_SRC" 2>/dev/null || true
    ln -sf "$ZOTH_CLI_SRC" "$BIN_DIR/zoth"
    echo -e "  ${GREEN}✔${RESET} CLI binary linked: ${CYAN}$BIN_DIR/zoth${RESET} -> ${GRAY}$ZOTH_CLI_SRC${RESET}"
else
    echo -e "  ${GOLD}⚠ Warning: CLI binary source not found in $INSTALL_DIR.${RESET}"
fi

# Ensure helper scripts are executable
if [ -d "$INSTALL_DIR/scripts" ]; then
    chmod +x "$INSTALL_DIR"/scripts/*.sh 2>/dev/null || true
fi
if [ -d "$INSTALL_DIR/core-app/scripts" ]; then
    chmod +x "$INSTALL_DIR"/core-app/scripts/*.sh 2>/dev/null || true
fi

# Step 5: Success Banner & Next Steps
echo -e "\n${GREEN}${BOLD}══════════════════════════════════════════════════════════════════${RESET}"
echo -e "  ${GREEN}${BOLD}✔ Zoth Studio Installed Successfully!${RESET}"
echo -e "${GREEN}${BOLD}══════════════════════════════════════════════════════════════════${RESET}\n"

echo -e "${BOLD}⚡ Quick Start (CLI & TUI):${RESET}"
if [[ ":$PATH:" != *":$BIN_DIR:"* ]]; then
    echo -e "  ${GOLD}Note:${RESET} Add ${CYAN}$BIN_DIR${RESET} to your PATH in ~/.bashrc or ~/.zshrc:"
    echo -e "  ${GRAY}export PATH=\"\$HOME/.local/bin:\$PATH\"${RESET}\n"
fi

echo -e "  ${CYAN}zoth tui${RESET}        Launch interactive Terminal Cockpit (Live Telemetry)"
echo -e "  ${CYAN}zoth start${RESET}      Start all local services (:8484 Orchestrator, :8088 Web)"
echo -e "  ${CYAN}zoth status${RESET}     View real-time status of all ports and tool pipelines"
echo -e "  ${CYAN}zoth update${RESET}     Self-update to the latest Git commits & rebuild binaries"
echo -e "  ${CYAN}zoth doctor${RESET}     Run system health check & diagnostics"
echo -e "  ${CYAN}zoth list${RESET}       Inspect all 298+ registered tools\n"

echo -e "${BOLD}🌐 Web Dashboard & Hub Routes:${RESET}"
echo -e "  • Studio Workstations:   ${CYAN}http://127.0.0.1:8088/studio/${RESET}"
echo -e "  • Operator Deck (:8484):  ${CYAN}http://127.0.0.1:8484/${RESET}"
echo -e "  • WebGen Studio:        ${CYAN}http://127.0.0.1:8088/studio/webgen.html${RESET}"
echo -e "  • Master Azoth:           ${CYAN}http://127.0.0.1:8088/zoth/${RESET}\n"


