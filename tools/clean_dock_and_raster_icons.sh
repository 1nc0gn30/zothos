#!/usr/bin/env bash
# ==============================================================================
#  ZOTHOS UI HARDENING: NO SVGS, CRISP PNG ICONS & CLEAN BOTTOM DOCK
# ==============================================================================

set -e

echo "[1/4] Ensuring 100% Raster PNG Icons in /usr/share/pixmaps..."
mkdir -p /usr/share/pixmaps /usr/share/icons/hicolor/48x48/apps /usr/share/icons/hicolor/512x512/apps

# Ensure standard PNG pixmaps exist
cp -f /home/neo/zothos/config/includes.chroot/usr/share/pixmaps/*.png /usr/share/pixmaps/ 2>/dev/null || true
cp -f /usr/share/icons/hicolor/512x512/apps/*.png /usr/share/pixmaps/ 2>/dev/null || true

# Strip any .svg extensions from all .desktop files across the entire system
echo "[2/4] Sanitizing all .desktop files to use NO SVGs..."
find /usr/share/applications /home/neo/Desktop /home/neo/.local/share/applications /etc/skel/Desktop -name "*.desktop" -type f | while read -r df; do
    sed -i -E 's/Icon=(.*)\.svg/Icon=\1\.png/g' "$df"
    sed -i -E 's/Icon=(.*)\.svg;/Icon=\1\.png;/g' "$df"
done

# Ensure specific distinct icons on key launchers
sed -i 's|Icon=.*|Icon=/usr/share/pixmaps/obsidian.png|g' /usr/share/applications/obsidian.desktop /home/neo/Desktop/obsidian.desktop 2>/dev/null || true
sed -i 's|Icon=.*|Icon=/usr/share/pixmaps/hermes-agent.png|g' /usr/share/applications/hermes-agent.desktop /home/neo/Desktop/hermes-agent.desktop 2>/dev/null || true
sed -i 's|Icon=.*|Icon=/usr/share/pixmaps/zoth-studio.png|g' /usr/share/applications/zoth-studio.desktop /home/neo/Desktop/zoth-studio.desktop 2>/dev/null || true
sed -i 's|Icon=.*|Icon=/usr/share/pixmaps/hexstrike-ai.png|g' /usr/share/applications/hexstrike-ai.desktop /home/neo/Desktop/hexstrike-ai.desktop 2>/dev/null || true
sed -i 's|Icon=.*|Icon=/usr/share/pixmaps/nullai-ghostmode.png|g' /usr/share/applications/anonsurf.desktop /home/neo/Desktop/anonsurf.desktop 2>/dev/null || true
sed -i 's|Icon=.*|Icon=/usr/share/pixmaps/preferences-system.png|g' /usr/share/applications/tailscale.desktop /home/neo/Desktop/tailscale.desktop 2>/dev/null || true
sed -i 's|Icon=.*|Icon=/usr/share/pixmaps/security-high.png|g' /usr/share/applications/tor-anonymity.desktop /home/neo/Desktop/tor-anonymity.desktop 2>/dev/null || true
sed -i 's|Icon=.*|Icon=/usr/share/pixmaps/solana.png|g' /usr/share/applications/web3-dev.desktop /home/neo/Desktop/web3-dev.desktop 2>/dev/null || true

echo "[3/4] Reconfiguring Bottom Dock (No Duplicates, Tooltips Above Bar)..."
# Configure clean curated bottom dock in xfconf
export DISPLAY=:0
xfconf-query -c xfce4-panel -p /panels/panel-2/size -s 48 2>/dev/null || true
xfconf-query -c xfce4-panel -p /panels/panel-2/icon-size -s 32 2>/dev/null || true
xfconf-query -c xfce4-panel -p /panels/panel-2/position -s "p=10;x=0;y=12" 2>/dev/null || true

# Clean up desktop surface to 5 clean, essential shortcuts
rm -f /home/neo/Desktop/*.desktop
cp /usr/share/applications/zoth-studio.desktop /home/neo/Desktop/
cp /usr/share/applications/hermes-agent.desktop /home/neo/Desktop/
cp /usr/share/applications/hexstrike-ai.desktop /home/neo/Desktop/
cp /usr/share/applications/obsidian.desktop /home/neo/Desktop/
cp /usr/share/applications/anonsurf.desktop /home/neo/Desktop/
chmod +x /home/neo/Desktop/*.desktop
chown -R neo:neo /home/neo/Desktop

echo "[4/4] Reloading panel and desktop..."
sudo gtk-update-icon-cache -f -t /usr/share/icons/hicolor 2>/dev/null || true
xfdesktop --reload 2>/dev/null || true
xfce4-panel -r 2>/dev/null || true

echo "[✓] UI & Dock Polish Complete."
