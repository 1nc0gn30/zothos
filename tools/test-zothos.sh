#!/usr/bin/env bash
# ==============================================================================
#  ZOTHOS QEMU VIRTUAL MACHINE TESTER
# ==============================================================================

set -e

ISO_PATH="${1:-build/zothos-1.0-amd64.iso}"

if [[ ! -f "$ISO_PATH" ]]; then
    echo "Error: ISO not found at $ISO_PATH"
    echo "Usage: ./tools/test-zothos.sh [path-to-iso]"
    exit 1
fi

echo "[*] Launching ZOTHOS in QEMU with KVM acceleration (4GB RAM, 4 vCPUs)..."
qemu-system-x86_64 \
    -enable-kvm \
    -m 4096 \
    -smp 4 \
    -cdrom "$ISO_PATH" \
    -boot d \
    -vga virtio \
    -display gtk \
    -net nic -net user
