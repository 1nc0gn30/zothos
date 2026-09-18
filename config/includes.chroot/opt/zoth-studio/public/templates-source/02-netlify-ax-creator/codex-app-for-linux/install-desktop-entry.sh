#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DESKTOP_DIR="${XDG_DATA_HOME:-$HOME/.local/share}/applications"
DESKTOP_FILE="$DESKTOP_DIR/codex-workbench-linux.desktop"

mkdir -p "$DESKTOP_DIR"
sed "s#Exec=.*#Exec=$ROOT_DIR/codex-workbench-linux#" \
  "$ROOT_DIR/packaging/codex-workbench-linux.desktop" > "$DESKTOP_FILE"
chmod +x "$ROOT_DIR/codex-workbench-linux"
chmod +x "$ROOT_DIR/codex_workbench_linux/server.py"
chmod 644 "$DESKTOP_FILE"

echo "Installed $DESKTOP_FILE"
