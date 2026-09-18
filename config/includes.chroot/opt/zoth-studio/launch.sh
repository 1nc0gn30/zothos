#!/usr/bin/env bash
# ==============================================================================
#  ZOTH STUDIO LAUNCHER FOR ZOTHOS
# ==============================================================================

set -e

# Start Zoth background services if not running
if command -v zoth >/dev/null 2>&1; then
    zoth start 2>/dev/null || true
fi

# If break screen / web hub is available, open it
if [[ -f "/opt/zoth-studio/index.html" ]]; then
    x-www-browser "/opt/zoth-studio/index.html" 2>/dev/null || true
elif ss -tuln | grep -q ":8199 "; then
    x-www-browser "http://localhost:8199" 2>/dev/null || true
elif ss -tuln | grep -q ":8989 "; then
    x-www-browser "http://localhost:8989" 2>/dev/null || true
else
    # Launch interactive Zoth TUI in terminal
    xfce4-terminal -T "Zoth Studio Sovereign Cockpit" -e "zoth tui"
fi
