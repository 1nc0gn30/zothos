# ZOTHOS Distro Enhancement Implementation Plan

> **For Hermes / Subagent Orchestrator:** Use subagent delegation to implement this plan task-by-task.

**Goal:** Elevate ZOTHOS to an elite, production-grade Linux distribution with an interactive terminal control cockpit, advanced nullai.tech anti-forensics udev/systemd automation, deep Windows 11 PowerShell/GUI chameleon emulation, Picom glassmorphism compositor configs, and an automated verification suite.

**Architecture:** 
- Modular chroot overlay structure targeting Debian 13 / Parrot 7 base.
- Subagents partitioned strictly by file scope:
  - **Subagent A (Ghostmode & Hardening)**: Systemd services, udev panic triggers, network killswitch, RAM wiping hooks.
  - **Subagent B (Chameleon & Undercover)**: Windows PowerShell fake shell translator, Whisker menu layout, Windows audio/sound events.
  - **Subagent C (Cockpit & Compositor)**: Unified Python TUI Control Center (`zoth-cockpit`), Picom matrix/win11 compositing profiles, Calamares installer settings.
  - **Main Agent (Integration & Verification)**: Automated test suite, git commit, end-to-end audit.

**Tech Stack:** Bash, Python 3, Systemd, Udev, XFCE4, Picom, GTK3, Calamares, Curses.

---

### Task 1: Ghostmode Systemd & Anti-Forensics Automation (Subagent A)
**Objective:** Add background automation for nullai.tech Ghostmode, including udev USB panic triggers, systemd sleep/shutdown RAM purge service, and DNS/Tor leak prevention rules.
**Files:**
- Create: `config/includes.chroot/etc/systemd/system/zoth-ghost-amnesic.service`
- Create: `config/includes.chroot/etc/udev/rules.d/99-zoth-panic.rules`
- Create: `config/includes.chroot/usr/local/bin/zoth-netkill`
- Modify: `config/includes.chroot/usr/local/bin/zoth-ghost`

### Task 2: Windows 11 Chameleon Emulation & PowerShell Translator (Subagent B)
**Objective:** Complete the disguise illusion for Incognito Mode by creating a PowerShell syntax compatibility translator (`zoth-powershell`), Whisker menu layout, and Windows-style desktop icons.
**Files:**
- Create: `config/includes.chroot/usr/local/bin/zoth-powershell`
- Create: `config/includes.chroot/etc/skel/.config/xfce4/panel/whiskermenu-win11.rc`
- Modify: `config/includes.chroot/usr/local/bin/zoth-undercover`

### Task 3: Unified Cockpit TUI & Compositor Glassmorphism (Subagent C)
**Objective:** Build an interactive full-screen curses/terminal dashboard (`zoth-cockpit`) and dual Picom compositing configs (Matrix neon glass vs. Windows acrylic blur).
**Files:**
- Create: `config/includes.chroot/usr/local/bin/zoth-cockpit`
- Create: `config/includes.chroot/etc/xdg/picom/picom-matrix.conf`
- Create: `config/includes.chroot/etc/xdg/picom/picom-win11.conf`
- Create: `installer/calamares/settings.conf`

### Task 4: Automated Verification Test Suite (Main Agent)
**Objective:** Create and run an end-to-end verification script to ensure all scripts pass syntax checks, configs are valid, and mode switches function seamlessly.
**Files:**
- Create: `tools/verify-zothos.sh`
- Modify: `README.md`
