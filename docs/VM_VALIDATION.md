# ZOTHOS VM & System Validation Architecture

## Overview
This document details the virtual machine setup, network bridging, guest services, automated validation suite, and desktop console integration for ZOTHOS Linux.

---

## 1. Virtual Machine Domain Topology

- **Hypervisor**: KVM / QEMU via Libvirt (`qemu:///system`)
- **Domain Name**: `zothos`
- **Domain UUID**: `363ac874-d73d-452a-bd90-df03b574d4cf`
- **Virtual Disk**: `/home/neo/hermes-workspace/vms/zothos/zothos.qcow2` (QCOW2 with virtio bus)
- **vCPU Allocation**: 2 vCPUs (`host-model`)
- **Memory Allocation**: 4096 MiB RAM
- **Display Server**: XFCE 4.18 + LightDM + Picom compositor (SPICE / QXL / VirtIO)

---

## 2. Network Bridge & Guest Communications

- **Host Bridge**: `virbr0` on default libvirt network (`192.168.122.0/24`)
- **Guest Interface**: `vnet*` virtio NIC (`52:54:00:bd:c7:e0`)
- **IP Assignment**: Static/DHCP via `systemd-networkd` / `isc-dhcp-client`
  - Assigned IP: `192.168.122.188/24`
- **Guest Agent**: `qemu-guest-agent` channel enabled (`org.qemu.guest_agent.0`)
- **Automated SSH Access**:
  - OpenSSH Server active on port 22 (`ssh.service` & `ssh.socket`)
  - Key-based authentication configured from host (`~/.ssh/id_ed25519.pub`)
  - Passwordless sudo for user `neo`

---

## 3. Automated Validation Suite (`tools/test-zothos.sh`)

The validation suite provides 4 verification phases:

1. **Static & Chroot Integrity Audit**:
   - Validates all `/usr/local/bin/zoth*` and HexStrike scripts for executable bits and Bash/Python syntax.
   - Verifies systemd unit files, udev rules, GTK themes, and wallpapers.
2. **Desktop & Launcher Integrity**:
   - Validates desktop entries in `/home/neo/Desktop/zothos-vm.desktop` and `/usr/share/applications/`.
3. **Libvirt Domain & Network Validation**:
   - Queries `virsh` domain state, memory, vCPUs, MAC, and leases.
   - Verifies host-to-guest ICMP ping with zero packet loss.
4. **Live VM Runtime Smoke Testing (SSH)**:
   - Authenticates directly into the running guest.
   - Confirms kernel version, ZOTHOS commands (`zoth`, `zoth-fastfetch`, `zoth-mode`, `zoth-ai`, `zoth-sec`, `zoth-mcp`, `zoth-agent-os`, `zoth-agent-hud`, `zoth-cockpit`).
   - Checks active GUI processes (`lightdm`, `Xorg`, `xfce4-session`).
   - Verifies Zoth Studio installation in `/opt/zoth-studio`.

### Usage:
```bash
# Run full automated validation suite:
./tools/test-zothos.sh --all

# Run live VM tests only:
./tools/test-zothos.sh --vm

# Run chroot/static file audit only:
./tools/test-zothos.sh --chroot

# Boot ISO or QCOW2 directly in QEMU:
./tools/test-zothos.sh --iso [path-to-iso]
./tools/test-zothos.sh --qcow2 [path-to-qcow2]
```

---

## 4. Desktop Integration

- **Desktop Entry**: `/home/neo/Desktop/zothos-vm.desktop`
- **Action**: Opens the graphical VM console in Virtual Machine Manager:
  ```desktop
  [Desktop Entry]
  Name=ZOTHOS Linux (Virtual Machine)
  Comment=Open ZOTHOS VM console in Virtual Machine Manager
  Exec=virt-manager --connect qemu:///system --show-domain-console zothos
  Icon=zoth-cockpit
  Terminal=false
  Type=Application
  Categories=System;
  ```
- **Icon**: `zoth-cockpit` installed in `~/.local/share/icons/hicolor/48x48/apps/`.
