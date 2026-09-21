# 🜂 ZOTHOS AI Agent & Developer Handoff Guide 🜄

Welcome, AI Agent / Developer! This document is your comprehensive operational guide for working on **ZOTHOS Linux**—the sovereign Alchemical Intelligence & Security Operating System based on Debian Trixie, KDE Plasma 6, Kali Linux, and Parrot OS tool repositories.

---

## ✦ 1. Architecture Overview

ZOTHOS is structured around a live-build chroot overlay architecture, coupled with automated VM injection and verification tools:

```
zothos/
├── config/includes.chroot/       # Root filesystem overlay copied verbatim into target OS
│   ├── etc/
│   │   ├── apt/sources.list.d/   # Kali, Parrot, and ZothOS Debian repos
│   │   ├── lightdm/              # LightDM autologin & plasma session configs
│   │   ├── sddm.conf.d/          # SDDM QML greeter configuration
│   │   ├── skel/.config/         # Default user KDE Plasma 6 & KWin settings
│   │   └── zothos/               # MCP server & agent permissions JSON registries
│   ├── opt/
│   │   ├── zoth-desktop-pet/     # Electron 60 FPS All-Seeing Eye desktop companion
│   │   └── zoth-studio/          # Sovereign Zoth Studio WebGL hub & cockpit
│   ├── usr/
│   │   ├── local/bin/            # ZothOS CLI commands (zoth-mode, zoth-ai, zoth-sec, zoth-heal, etc.)
│   │   ├── share/backgrounds/    # High-definition 4K ZothOS wallpapers
│   │   ├── share/icons/Zoth-Hermetic/  # Scalable 3D Glass icon theme
│   │   └── share/pixmaps/        # High-res PNG launcher icons
├── tools/                        # Test, injection, sync, and audit tools
│   ├── verify-zothos.sh          # System compliance & integrity checker (25/25 checks)
│   ├── test-zothos.sh            # Automated VM test harness
│   ├── inject-vm-customization.sh# Bakes repository changes directly into live QCOW2 image
│   └── sync-to-live-vm.sh        # Syncs live edits directly over SSH to running VM
├── build/                        # ISO build scripts
│   └── build-iso.sh              # Debian live-build ISO builder
├── generate_zoth_icons.py        # PIL 3D glassmorphic icon generator script
└── docs/                         # Extended operational documentation
```

---

## ✦ 2. Critical Components & Specifications

### 2.1 KDE Plasma 6 Desktop & KWin Compositor
- **Global Config**: `config/includes.chroot/etc/skel/.config/kdeglobals`
- **Icon Theme**: `Zoth-Hermetic` (`config/includes.chroot/usr/share/icons/Zoth-Hermetic/index.theme`)
  - *Note*: Directory entries MUST specify `Type=Scalable` with `MinSize=16` and `MaxSize=512` so KDE Plasma 6 scales icons properly on dock panels of any height (e.g. 56px).
- **Dock & Launcher Panel**: `config/includes.chroot/etc/skel/.config/plasma-org.kde.plasma.desktop-appletsrc`
  - Defines the 56px floating KDE glass dock with 7 custom launchers.
- **Session Autostart**: Default session set to `plasma` (`/usr/bin/startplasma-x11`) in LightDM (`/etc/lightdm/99-zothos-default.conf`) and SDDM (`/etc/sddm.conf.d/zothos.conf`). User `.xsession` executes `/usr/bin/startplasma-x11`.

### 2.2 All-Seeing Eye Mascot (`zoth-desktop-pet`)
- **Location**: `config/includes.chroot/opt/zoth-desktop-pet/`
- **Execution**: Electron frameless transparent app running borderless/shadowless on top of the desktop.
- **Global Pupil Tracking**: `main.js` uses `screen.getCursorScreenPoint()` polled at 60 FPS to calculate global relative mouse offsets across the entire screen geometry.
- **Window Dragging**: `index.html` sets `-webkit-app-region: drag` on interactive elements, and `main.js` provides `move-pet-window` IPC handlers to allow full dragging anywhere on the desktop.

### 2.3 3D Glassmorphic Icon Generator
- **Location**: `generate_zoth_icons.py`
- Uses Python `PIL` (`Pillow`) to generate multi-layered 3D glass icons with specular highlights, glass refraction, metallic bevel borders, and inner shadow depth.
- Re-generate icon sets anytime:
  ```bash
  python3 generate_zoth_icons.py
  ```

---

## ✦ 3. Essential Workflows for AI Agents

### 3.1 Verification & Audit Protocol
Always run the verification tool before committing changes:
```bash
./tools/verify-zothos.sh
```
*Requirement*: Must exit with status code `0` and 100% PASS on all integrity checks.

### 3.2 Testing Changes in the Live KVM VM
The repository includes a live QCOW2 virtual machine image located at `/home/neo/hermes-workspace/vms/zothos/zothos.qcow2`.

1. **Inject modifications into VM disk**:
   ```bash
   ./tools/inject-vm-customization.sh
   ```
2. **Boot or restart VM**:
   ```bash
   virsh -c qemu:///system start zothos
   ```
3. **Automated VM test harness**:
   ```bash
   ./tools/test-zothos.sh --vm
   ```
4. **Sync live updates to active VM (IP: `192.168.122.188`)**:
   ```bash
   ./tools/sync-to-live-vm.sh
   ```

### 3.3 Compiling the ISO
To produce the final hybrid UEFI/BIOS ISO image (`zothos-1.0-amd64.iso`):
```bash
sudo ./build/build-iso.sh
```
*Note*: ISO build output files are written to `/home/neo/zothos/build/`. Stale ISO files should be cleaned before fresh compilation.

---

## ✦ 4. Agent Guidelines & Golden Rules

1. **No Broken Contracts**: Do NOT modify system configs without testing in `./tools/verify-zothos.sh`.
2. **Local-First & Zero-Telemetry**: All AI models, MCP servers, and background utilities must operate 100% locally without external telemetry or data leaks.
3. **Empirical Verification**: Never claim a task is complete until you have executed verification or tested inside the VM.
4. **Git Hygiene**: Commit changes in clean, logical atomic units with clear commit messages (`feat`, `fix`, `docs`, `refactor`).

---

> *"As above, so below; as code, so mind."* — **ZOTHOS OS Core**
