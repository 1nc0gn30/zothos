#!/usr/bin/env bash
# ==============================================================================
#  ZOTH APPIMAGES - Universal AppImage & Standalone Tool Installer
# ==============================================================================
set -euo pipefail

APP_ID="${1:-}"
if [[ -z "$APP_ID" ]]; then
    echo "Usage: $0 <app_id>"
    echo "Example: $0 obsidian"
    exit 1
fi

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CATALOG="$HERE/catalog.json"

GREEN="\e[1;32m"
CYAN="\e[1;36m"
YELLOW="\e[1;33m"
RED="\e[1;31m"
RESET="\e[0m"

APP_META=$(python3 -c "
import json
with open('$CATALOG') as f:
    cat = json.load(f)
app = cat['apps'].get('$APP_ID')
if app:
    print(f\"{app['id']}|{app['name']}|{app['url']}|{app['filename']}|{app['runner']}|{app['icon']}|{app['comment']}|{app['desktop_name']}\")
else:
    print('NOT_FOUND')
")

if [[ "$APP_META" == "NOT_FOUND" ]]; then
    echo -e "${RED}[!] AppImage '$APP_ID' not found in catalog.${RESET}"
    exit 1
fi

IFS="|" read -r ID NAME URL FILENAME RUNNER ICON COMMENT DESKTOP_NAME <<< "$APP_META"

TARGET_DIR="/opt/appimages"
sudo mkdir -p "$TARGET_DIR"

echo -e "${CYAN}[+] Installing AppImage: $NAME ($ID)...${RESET}"

if [[ "$URL" == local:* ]]; then
    echo -e "${GREEN}[*] Using local component: $URL${RESET}"
elif [[ "$URL" == system:* ]]; then
    PKG="${URL#system:}"
    echo -e "${YELLOW}[*] Installing system package: $PKG...${RESET}"
    sudo apt-get update -y && sudo apt-get install -y "$PKG"
else
    DEST="$TARGET_DIR/$FILENAME"
    if [[ -f "$DEST" ]]; then
        echo -e "${GREEN}[✓] $FILENAME is already cached at $DEST.${RESET}"
    else
        echo -e "${YELLOW}[*] Downloading from $URL...${RESET}"
        sudo curl -fsSL -L --retry 3 -C - "$URL" -o "$DEST.tmp"
        sudo mv "$DEST.tmp" "$DEST"
    fi

    # Handle archives
    if [[ "$FILENAME" == *.tar.gz ]]; then
        sudo tar -xzf "$DEST" -C "$TARGET_DIR/"
    elif [[ "$FILENAME" == *.zip ]]; then
        sudo unzip -q -o "$DEST" -d "$TARGET_DIR/"
    fi
    sudo chmod +x "$DEST" 2>/dev/null || true
    RUNNER_BIN="${RUNNER%% *}"
    [[ -f "$RUNNER_BIN" ]] && sudo chmod +x "$RUNNER_BIN" 2>/dev/null || true
fi

# Setup Desktop Launcher
LAUNCHER_PATH="/usr/share/applications/$DESKTOP_NAME"
DESKTOP_DIR="/home/neo/Desktop"
SKEL_DESKTOP_DIR="/etc/skel/Desktop"
sudo mkdir -p "$DESKTOP_DIR" "$SKEL_DESKTOP_DIR"

# Install Icon if present
if [[ -f "$HERE/icons/$ICON" ]]; then
    sudo cp "$HERE/icons/$ICON" "/usr/share/icons/Zoth-Hermetic/scalable/apps/$ICON" 2>/dev/null || true
    sudo cp "$HERE/icons/$ICON" "/usr/share/pixmaps/$ICON" 2>/dev/null || true
fi

# Create .desktop file
sudo bash -c "cat > '$LAUNCHER_PATH'" << EOF
[Desktop Entry]
Version=1.0
Type=Application
Name=$NAME
Comment=$COMMENT
Exec=$RUNNER
Icon=$ICON
Terminal=false
Categories=Application;Development;Security;
StartupNotify=true
EOF

sudo chmod +x "$LAUNCHER_PATH"
sudo cp -f "$LAUNCHER_PATH" "$DESKTOP_DIR/$DESKTOP_NAME"
sudo cp -f "$LAUNCHER_PATH" "$SKEL_DESKTOP_DIR/$DESKTOP_NAME"
sudo chmod +x "$DESKTOP_DIR/$DESKTOP_NAME" "$SKEL_DESKTOP_DIR/$DESKTOP_NAME"
sudo chown -R neo:neo "$DESKTOP_DIR" 2>/dev/null || true

# Add symlink to /usr/local/bin
sudo bash -c "cat > '/usr/local/bin/$ID'" << EOF
#!/usr/bin/env bash
exec $RUNNER "\$@"
EOF
sudo chmod +x "/usr/local/bin/$ID"

echo -e "${GREEN}[✓] Successfully installed $NAME!${RESET}"
echo -e "${CYAN}    Desktop shortcut created at ~/Desktop/$DESKTOP_NAME${RESET}"
echo -e "${CYAN}    CLI command available: $ID${RESET}"
