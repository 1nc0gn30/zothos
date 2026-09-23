#!/usr/bin/env bash
# Standalone bootstrap installer for Zoth AppImages Registry
set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
echo "=== Installing Zoth AppImages Registry ==="

sudo mkdir -p /opt/zoth-appimages /opt/appimages
sudo cp -r "$HERE/." /opt/zoth-appimages/

echo "=== Zoth AppImages Ready ==="
