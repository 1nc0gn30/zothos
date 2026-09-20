#!/usr/bin/env bash
# ==============================================================================
#  ZOTHOS LIVE VM DIRECT SYNC & REFRESH TOOL
# ==============================================================================

set -e

VM_IP="192.168.122.188"
ZOTHOS_SRC="/home/neo/zothos/config/includes.chroot"

echo "[*] Syncing updated ZothOS sovereign components to live VM at $VM_IP..."

# 1. Sync icons
rsync -avz -e "ssh -o StrictHostKeyChecking=no" "$ZOTHOS_SRC/usr/share/icons/" neo@$VM_IP:/tmp/icons/
ssh -o StrictHostKeyChecking=no neo@$VM_IP "echo zoth | sudo -S cp -rf /tmp/icons/* /usr/share/icons/ && echo zoth | sudo -S gtk-update-icon-cache -f -t /usr/share/icons/hicolor 2>/dev/null || true"

# 2. Sync applications shortcuts
rsync -avz -e "ssh -o StrictHostKeyChecking=no" "$ZOTHOS_SRC/usr/share/applications/" neo@$VM_IP:/tmp/apps/
ssh -o StrictHostKeyChecking=no neo@$VM_IP "echo zoth | sudo -S cp -rf /tmp/apps/* /usr/share/applications/"

# 3. Sync themes & GTK config
rsync -avz -e "ssh -o StrictHostKeyChecking=no" "$ZOTHOS_SRC/usr/share/themes/" neo@$VM_IP:/tmp/themes/
ssh -o StrictHostKeyChecking=no neo@$VM_IP "echo zoth | sudo -S cp -rf /tmp/themes/* /usr/share/themes/"

# 4. Stop xfconfd daemon to ensure fresh panel XML is loaded without in-memory override
ssh -o StrictHostKeyChecking=no neo@$VM_IP "killall -9 xfconfd xfce4-panel electron node 2>/dev/null || true; rm -rf ~/.config/xfce4/panel/launcher-*"

rsync -avz -e "ssh -o StrictHostKeyChecking=no" "$ZOTHOS_SRC/etc/skel/.config/" neo@$VM_IP:/home/neo/.config/
ssh -o StrictHostKeyChecking=no neo@$VM_IP "chown -R neo:neo /home/neo/.config"

# 5. Sync opt apps (pet & hud)
rsync -avz --exclude='public/assets/media' -e "ssh -o StrictHostKeyChecking=no" "$ZOTHOS_SRC/opt/" neo@$VM_IP:/tmp/opt/
ssh -o StrictHostKeyChecking=no neo@$VM_IP "echo zoth | sudo -S cp -rf /tmp/opt/* /opt/ && echo zoth | sudo -S chmod -R 755 /opt/zoth-desktop-pet /opt/zoth-hud"

# 6. Sync usr/local/bin
rsync -avz -e "ssh -o StrictHostKeyChecking=no" "$ZOTHOS_SRC/usr/local/bin/" neo@$VM_IP:/tmp/bin/
ssh -o StrictHostKeyChecking=no neo@$VM_IP "echo zoth | sudo -S cp -rf /tmp/bin/* /usr/local/bin/ && echo zoth | sudo -S chmod +x /usr/local/bin/*"

echo "[*] Restarting desktop panel & sovereign pet/hud on display :0..."
ssh -o StrictHostKeyChecking=no neo@$VM_IP "DISPLAY=:0 XAUTHORITY=/home/neo/.Xauthority xfce4-panel & sleep 1 && DISPLAY=:0 XAUTHORITY=/home/neo/.Xauthority /usr/local/bin/zoth-desktop-hud & sleep 1 && DISPLAY=:0 XAUTHORITY=/home/neo/.Xauthority /usr/local/bin/zoth-desktop-pet &"

echo "[✓] Live VM successfully synchronized and desktop refreshed!"
