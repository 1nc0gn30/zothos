#!/usr/bin/env bash
# ==============================================================================
#  ZOTHOS VM CUSTOMIZATION INJECTION
# ==============================================================================

set -e

VM_DISK="/home/neo/hermes-workspace/vms/zothos/zothos.qcow2"
ZOTHOS_SRC="/home/neo/zothos/config/includes.chroot"

SSH_KEY_PUB="${HOME}/.ssh/id_ed25519.pub"
if [[ ! -f "$SSH_KEY_PUB" ]]; then
    SSH_KEY_PUB="${HOME}/.ssh/id_rsa.pub"
fi

SSH_KEY_CONTENT=""
if [[ -f "$SSH_KEY_PUB" ]]; then
    SSH_KEY_CONTENT=$(cat "$SSH_KEY_PUB")
fi

echo "[*] Customizing ZOTHOS VM disk image with virt-customize..."

virt-customize -a "$VM_DISK" \
    --root-password password:zoth \
    --run-command "useradd -m -s /bin/bash -G sudo,audio,video,dialout neo 2>/dev/null || true" \
    --run-command "echo 'neo:zoth' | chpasswd" \
    --run-command "echo 'neo ALL=(ALL) NOPASSWD:ALL' > /etc/sudoers.d/neo && chmod 0440 /etc/sudoers.d/neo" \
    --run-command "mkdir -p /usr/share/backgrounds /usr/share/themes /opt /etc/systemd/network /etc/systemd/system/multi-user.target.wants /etc/systemd/system/sockets.target.wants /home/neo/.ssh" \
    --network \
    --install openssh-server,qemu-guest-agent,sudo,curl,rsync \
    --copy-in "$ZOTHOS_SRC/usr/local/bin:/usr/local" \
    --copy-in "$ZOTHOS_SRC/usr/share/applications:/usr/share" \
    --copy-in "$ZOTHOS_SRC/usr/share/backgrounds/zothos:/usr/share/backgrounds" \
    --copy-in "$ZOTHOS_SRC/usr/share/themes:/usr/share" \
    --copy-in "$ZOTHOS_SRC/usr/share/color-schemes:/usr/share" \
    --copy-in "$ZOTHOS_SRC/usr/share/icons:/usr/share" \
    --copy-in "$ZOTHOS_SRC/usr/share/pixmaps:/usr/share" \
    --copy-in "$ZOTHOS_SRC/usr/share/sddm:/usr/share" \
    --copy-in "$ZOTHOS_SRC/etc/lightdm:/etc" \
    --copy-in "$ZOTHOS_SRC/etc/sddm.conf.d:/etc" \
    --copy-in "$ZOTHOS_SRC/opt/zoth-studio:/opt" \
    --copy-in "$ZOTHOS_SRC/opt/zoth-desktop-pet:/opt" \
    --copy-in "$ZOTHOS_SRC/opt/zoth-hud:/opt" \
    --copy-in "$ZOTHOS_SRC/etc/xdg/kwinrulesrc:/etc/xdg" \
    --copy-in "$ZOTHOS_SRC/etc/skel/.config:/etc/skel" \
    --run-command "echo 'exec /usr/bin/startplasma-x11' > /etc/skel/.xsession && chmod +x /etc/skel/.xsession" \
    --run-command "printf 'export DESKTOP_SESSION=plasma\nexport XDG_CURRENT_DESKTOP=KDE\n' > /etc/skel/.xsessionrc" \
    --run-command "printf '[Desktop]\nSession=plasma\n' > /etc/skel/.dmrc" \
    --copy-in "$ZOTHOS_SRC/etc/skel/.bashrc:/etc/skel" \
    --copy-in "$ZOTHOS_SRC/etc/skel/.zshrc:/etc/skel" \
    --copy-in "$ZOTHOS_SRC/etc/systemd/system/zoth-ghost-amnesic.service:/etc/systemd/system" \
    --copy-in "$ZOTHOS_SRC/etc/udev/rules.d/99-zoth-panic.rules:/etc/udev/rules.d" \
    --run-command "printf '[Match]\nName=en* eth*\n\n[Network]\nDHCP=yes\n' > /etc/systemd/network/20-wired.network" \
    --run-command "printf 'auto lo\niface lo inet loopback\n\nallow-hotplug enp1s0\niface enp1s0 inet dhcp\n\nallow-hotplug eth0\niface eth0 inet dhcp\n' > /etc/network/interfaces" \
    --run-command "ssh-keygen -A" \
    --run-command "systemctl enable ssh ssh.socket systemd-networkd qemu-guest-agent 2>/dev/null || true" \
    --run-command "ln -sf /lib/systemd/system/ssh.socket /etc/systemd/system/sockets.target.wants/ssh.socket 2>/dev/null || true" \
    --run-command "ln -sf /lib/systemd/system/ssh.service /etc/systemd/system/multi-user.target.wants/ssh.service 2>/dev/null || true" \
    --run-command "ln -sf /lib/systemd/system/systemd-networkd.service /etc/systemd/system/multi-user.target.wants/systemd-networkd.service 2>/dev/null || true" \
    --run-command "ln -sf /lib/systemd/system/qemu-guest-agent.service /etc/systemd/system/multi-user.target.wants/qemu-guest-agent.service 2>/dev/null || true" \
    --run-command "chmod +x /usr/local/bin/* /opt/zoth-studio/launch.sh 2>/dev/null || true" \
    --run-command "rm -rf /home/neo/.config/xfce4/panel/launcher-* 2>/dev/null || true" \
    --run-command "cp -rf /etc/skel/. /home/neo/ && chown -R neo:neo /home/neo" \
    --run-command "if [ -n '$SSH_KEY_CONTENT' ]; then echo '$SSH_KEY_CONTENT' > /home/neo/.ssh/authorized_keys && chmod 700 /home/neo/.ssh && chmod 600 /home/neo/.ssh/authorized_keys && chown -R neo:neo /home/neo/.ssh; fi" \
    --run-command "mkdir -p /etc/systemd/system/getty@tty1.service.d" \
    --run-command "printf '[Service]\nExecStart=\nExecStart=-/sbin/agetty -o \"-p -f -- \\\\\\\\u\" --noclear --autologin neo %%I \$TERM\n' > /etc/systemd/system/getty@tty1.service.d/autologin.conf" \
    --run-command "mkdir -p /etc/systemd/system/serial-getty@ttyS0.service.d" \
    --run-command "printf '[Service]\nExecStart=\nExecStart=-/sbin/agetty -o \"-p -f -- \\\\\\\\u\" --keep-baud --autologin neo 115200,38400,9600 %%I \$TERM\n' > /etc/systemd/system/serial-getty@ttyS0.service.d/autologin.conf" \
    --run-command "systemctl daemon-reload 2>/dev/null || true"

echo "[✓] ZOTHOS VM disk image successfully customized."

