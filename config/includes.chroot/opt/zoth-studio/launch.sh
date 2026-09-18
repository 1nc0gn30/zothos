#!/usr/bin/env bash
# ==============================================================================
#  ZOTH STUDIO — Master Workspace Launcher
# ==============================================================================
set -euo pipefail

ROOT="/opt/zoth-studio"
PUBLIC="$ROOT/public"
PORT=8088

if [[ ! -d "$PUBLIC" ]]; then
    PUBLIC="/media/neo/f2fdda77-178b-4603-ae80-c7aa4cd97908/zoth-studio/core-app/public"
fi

echo -e "\e[1;32m[⚡] Starting ZOTH STUDIO Powerhouse Hub on port $PORT...\e[0m"

# Start background web hub if not already running
if ! lsof -i :$PORT >/dev/null 2>&1; then
    python3 -m http.server $PORT --bind 127.0.0.1 --directory "$PUBLIC" >/dev/null 2>&1 &
    sleep 1
fi

URL="http://127.0.0.1:$PORT"

echo -e "\e[1;36m[🌐] Zoth Studio Hub live at: $URL\e[0m"

# Launch in application mode
if command -v chromium >/dev/null 2>&1; then
    exec chromium --app="$URL" --start-maximized >/dev/null 2>&1 &
elif command -v firefox-esr >/dev/null 2>&1; then
    exec firefox-esr "$URL" >/dev/null 2>&1 &
elif command -v firefox >/dev/null 2>&1; then
    exec firefox "$URL" >/dev/null 2>&1 &
else
    xdg-open "$URL" 2>/dev/null || true
fi
