#!/usr/bin/env bash
# ==============================================================================
#  ZOTHOS VM CUSTOMIZATION INJECTION
# ==============================================================================

set -e

VM_DISK="/home/neo/hermes-workspace/vms/zothos/zothos.qcow2"
ZOTHOS_SRC="/home/neo/zothos/config/includes.chroot"

echo "[*] Customizing ZOTHOS VM disk image with virt-customize..."

virt-customize -a "$VM_DISK" \
    --root-password password:zoth \
    --run-command "useradd -m -s /bin/bash -G sudo,audio,video,dialout neo 2>/dev/null || true" \
    --run-command "echo 'neo:zoth' | chpasswd" \
    --run-command "echo 'neo ALL=(ALL) NOPASSWD:ALL' > /etc/sudoers.d/neo && chmod 0440 /etc/sudoers.d/neo" \
    --run-command "mkdir -p /usr/share/backgrounds /usr/share/themes /opt" \
    --copy-in "$ZOTHOS_SRC/usr/local/bin:/usr/local" \
    --copy-in "$ZOTHOS_SRC/usr/share/backgrounds/zothos:/usr/share/backgrounds" \
    --copy-in "$ZOTHOS_SRC/usr/share/themes:/usr/share" \
    --copy-in "$ZOTHOS_SRC/opt/zoth-studio:/opt" \
    --copy-in "$ZOTHOS_SRC/etc/skel/.bashrc:/etc/skel" \
    --copy-in "$ZOTHOS_SRC/etc/skel/.zshrc:/etc/skel" \
    --copy-in "$ZOTHOS_SRC/etc/systemd/system/zoth-ghost-amnesic.service:/etc/systemd/system" \
    --copy-in "$ZOTHOS_SRC/etc/udev/rules.d/99-zoth-panic.rules:/etc/udev/rules.d" \
    --run-command "chmod +x /usr/local/bin/zoth*" \
    --run-command "chmod +x /opt/zoth-studio/launch.sh" \
    --run-command "cp -rf /etc/skel/. /home/neo/ && chown -R neo:neo /home/neo" \
    --run-command "mkdir -p /etc/systemd/system/getty@tty1.service.d" \
    --run-command "printf '[Service]\nExecStart=\nExecStart=-/sbin/agetty -o \"-p -f -- \\\\\\\\u\" --noclear --autologin neo %%I \$TERM\n' > /etc/systemd/system/getty@tty1.service.d/autologin.conf" \
    --run-command "mkdir -p /etc/systemd/system/serial-getty@ttyS0.service.d" \
    --run-command "printf '[Service]\nExecStart=\nExecStart=-/sbin/agetty -o \"-p -f -- \\\\\\\\u\" --keep-baud --autologin neo 115200,38400,9600 %%I \$TERM\n' > /etc/systemd/system/serial-getty@ttyS0.service.d/autologin.conf" \
    --run-command "systemctl daemon-reload 2>/dev/null || true"

echo "[✓] ZOTHOS VM disk image successfully customized."
