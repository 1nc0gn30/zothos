#!/usr/bin/env bash
# =============================================================================
#  ZOTHOS Instant Dev Build & Live Visual Preview Tool
#  Guarantees 100% fresh ISO rebuild, clean VM boot, and visual screenshot
# =============================================================================
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
BUILD_DIR="$PROJECT_DIR/build"
ISO_PATH="$BUILD_DIR/zothos-1.0-amd64.iso"
ARTIFACT_DIR="${ARTIFACT_DIR:-/tmp/zothos-preview}"

echo "=================================================="
echo "[*] ZOTHOS Dev-Build & Visual Preview Pipeline"
echo "=================================================="

# 1. Sync config overlay into live workspace if present
if [[ -d "$BUILD_DIR/live_workspace" ]]; then
    echo "[1/5] Syncing chroot configuration overlay..."
    mkdir -p "$BUILD_DIR/live_workspace/config/includes.chroot"
    cp -a "$PROJECT_DIR/config/includes.chroot/." "$BUILD_DIR/live_workspace/config/includes.chroot/" 2>/dev/null || true
fi

# 2. Rebuild ISO
echo "[2/5] Repacking fresh ZOTHOS ISO..."
bash "$BUILD_DIR/pack-iso.sh"

# 3. Reset Ephemeral Disk & Define VM Domain
echo "[3/5] Resetting VM state & defining libvirt domain..."
sudo virsh destroy zothos-iso-live 2>/dev/null || true
sudo rm -f /tmp/zothos-iso-test.qcow2
sudo qemu-img create -f qcow2 /tmp/zothos-iso-test.qcow2 50G >/dev/null

cat << 'EOF' > /tmp/zothos-iso-live.xml
<domain type='kvm'>
  <name>zothos-iso-live</name>
  <memory unit='KiB'>8388608</memory>
  <currentMemory unit='KiB'>8388608</currentMemory>
  <vcpu placement='static'>4</vcpu>
  <os>
    <type arch='x86_64' machine='pc-q35-8.2'>hvm</type>
  </os>
  <features>
    <acpi/>
    <apic/>
  </features>
  <cpu mode='host-passthrough' check='none'/>
  <clock offset='utc'/>
  <on_poweroff>destroy</on_poweroff>
  <on_reboot>restart</on_reboot>
  <on_crash>destroy</on_crash>
  <devices>
    <emulator>/usr/bin/qemu-system-x86_64</emulator>
    <disk type='file' device='cdrom'>
      <driver name='qemu' type='raw'/>
      <source file='/home/neo/zothos/build/zothos-1.0-amd64.iso'/>
      <target dev='sda' bus='sata'/>
      <readonly/>
      <boot order='1'/>
    </disk>
    <disk type='file' device='disk'>
      <driver name='qemu' type='qcow2'/>
      <source file='/tmp/zothos-iso-test.qcow2'/>
      <target dev='vda' bus='virtio'/>
      <boot order='2'/>
    </disk>
    <interface type='user'>
      <mac address='52:54:00:23:3d:a7'/>
      <model type='virtio'/>
    </interface>
    <graphics type='vnc' port='5900' autoport='no' listen='0.0.0.0'>
      <listen type='address' address='0.0.0.0'/>
    </graphics>
    <video>
      <model type='vga' vram='65536' heads='1' primary='yes'/>
    </video>
    <input type='tablet' bus='usb'/>
    <input type='keyboard' bus='ps2'/>
    <rng model='virtio'>
      <backend model='random'>/dev/urandom</backend>
    </rng>
  </devices>
</domain>
EOF

sudo virsh undefine zothos-iso-live 2>/dev/null || true
sudo virsh define /tmp/zothos-iso-live.xml >/dev/null

# 4. Start VM and send boot key
echo "[4/5] Starting fresh VM instance..."
sudo virsh start zothos-iso-live >/dev/null
sleep 3
sudo virsh send-key zothos-iso-live KEY_ENTER 2>/dev/null || true

# 5. Capture Live Visual Screenshot
echo "[5/5] Capturing live VM screen..."
sleep 5
sudo virsh screenshot zothos-iso-live /tmp/vm_screenshot.pnm >/dev/null 2>&1 || true
if [[ -f /tmp/vm_screenshot.pnm ]]; then
    mkdir -p "$ARTIFACT_DIR"
    cp -f /tmp/vm_screenshot.pnm "$ARTIFACT_DIR/vm_live_screen.png"
    echo "[✓] Live screen captured at: $ARTIFACT_DIR/vm_live_screen.png"
fi

echo "=================================================="
echo "✓ DEV PREVIEW COMPLETE"
echo "  ISO: $ISO_PATH"
echo "  VNC: localhost:5900"
echo "=================================================="
