#!/usr/bin/env bash
# ==============================================================================
#  INSTALL XFCE4 GUI & LIGHTDM AUTOLOGIN INTO ZOTHOS VM
# ==============================================================================

set -e

VM_DISK="/home/neo/hermes-workspace/vms/zothos/zothos.qcow2"

echo "[*] Installing XFCE4 Desktop Environment & LightDM into ZOTHOS VM..."

virt-customize -a "$VM_DISK" \
    --network \
    --run-command "apt-get update" \
    --install xserver-xorg,xinit,xfce4,xfce4-terminal,xfce4-whiskermenu-plugin,lightdm,lightdm-gtk-greeter,picom \
    --run-command "mkdir -p /etc/lightdm/lightdm.conf.d" \
    --run-command "printf '[Seat:*]\nautologin-user=neo\nautologin-user-timeout=0\nuser-session=xfce\n' > /etc/lightdm/lightdm.conf.d/01_autologin.conf" \
    --run-command "groupadd -r autologin 2>/dev/null || true" \
    --run-command "gpasswd -a neo autologin 2>/dev/null || true" \
    --run-command "gpasswd -a neo video 2>/dev/null || true" \
    --run-command "systemctl set-default graphical.target" \
    --run-command "systemctl enable lightdm 2>/dev/null || true" \
    --run-command "mkdir -p /home/neo/.config/xfce4/xfconf/xfce-perchannel-xml" \
    --run-command "chown -R neo:neo /home/neo/.config"

echo "[✓] GUI installation and LightDM autologin configured."
