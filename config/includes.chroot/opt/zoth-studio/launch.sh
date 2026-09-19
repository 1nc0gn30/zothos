#!/usr/bin/env bash
# ==============================================================================
#  ZOTH STUDIO — Master Workspace Launcher
# ==============================================================================
set -euo pipefail

ROOT="/opt/zoth-studio"
if [[ ! -d "$ROOT" ]]; then
    if [[ -d "/home/neo/zothos/config/includes.chroot/opt/zoth-studio" ]]; then
        ROOT="/home/neo/zothos/config/includes.chroot/opt/zoth-studio"
    elif [[ -d "/usr/share/zoth-studio" ]]; then
        ROOT="/usr/share/zoth-studio"
    fi
fi

PUBLIC="$ROOT"
if [[ -d "$ROOT/public" ]]; then
    PUBLIC="$ROOT/public"
fi

# Dynamic port selection: check 8088, 8080, 3000, 8008, or next free
find_free_port() {
    local ports=(8088 8080 3000 8008 8090 8099 8100 8101 8102)
    for p in "${ports[@]}"; do
        if ! ss -tuln 2>/dev/null | grep -q ":$p " && ! lsof -i :"$p" >/dev/null 2>&1; then
            echo "$p"
            return 0
        fi
    done
    echo "8088"
}

PORT=$(find_free_port)
URL="http://127.0.0.1:$PORT/index.html"

echo -e "\e[1;32m[⚡] Starting ZOTH STUDIO Powerhouse Hub on port $PORT...\e[0m"

# Start background web hub if not already running on this port
if ! lsof -i :"$PORT" >/dev/null 2>&1 && ! ss -tuln 2>/dev/null | grep -q ":$PORT "; then
    python3 -m http.server "$PORT" --bind 127.0.0.1 --directory "$ROOT" >/dev/null 2>&1 &
    sleep 0.8
fi

echo -e "\e[1;36m[🌐] Zoth Studio Hub live at: $URL\e[0m"

# Delegate to native Python WebKit2GTK wrapper if available
if [[ -x "/usr/local/bin/zoth-studio" ]]; then
    exec /usr/local/bin/zoth-studio "$@"
fi

# Launch in application mode
if command -v chromium >/dev/null 2>&1; then
    exec chromium --app="$URL" --start-maximized --class=zoth-studio --disable-extensions --disable-default-apps >/dev/null 2>&1 &
elif command -v google-chrome >/dev/null 2>&1; then
    exec google-chrome --app="$URL" --start-maximized --class=zoth-studio >/dev/null 2>&1 &
elif command -v firefox-esr >/dev/null 2>&1; then
    exec firefox-esr --new-window "$URL" >/dev/null 2>&1 &
elif command -v firefox >/dev/null 2>&1; then
    exec firefox --new-window "$URL" >/dev/null 2>&1 &
else
    xdg-open "$URL" 2>/dev/null || true
fi
