#!/usr/bin/env bash
# Standalone bootstrap installer for Zoth Arsenal
set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
echo "=== Installing Zoth Arsenal Tool Registry ==="
sudo bash "$HERE/config/setup-sources.sh"

sudo mkdir -p /opt/zoth-arsenal
sudo cp -r "$HERE/." /opt/zoth-arsenal/

echo "=== Zoth Arsenal Ready ==="
