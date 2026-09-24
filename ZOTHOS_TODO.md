# ZOTHOS Engineering Backlog & Deferred Tasks

This document tracks items deferred or placed on hold during the ZothOS 1.0 refinement cycle.

## 1. Zoth Studio Application (ON HOLD)
- **Status**: On Hold per operator instruction.
- **Current Behavior**: Temporarily loads lightweight break viewer.
- **Target Implementation**: Replace with official `nullaitech/zoth-studio` repository once the new release/branch is ready from the upstream team.
- **Integration Checklist**:
  - [ ] Pull verified release of Zoth Studio from GitHub.
  - [ ] Bundle dependencies cleanly into `/opt/zoth-studio`.
  - [ ] Validate IPC bridges and local hub endpoints.

## 2. Desktop Launchers & Secondary App Polish
- [x] Standardized all terminal CLI tools (`matrix-rain`, `ghost-amnesic`, `powershell`, `netkill`, `undercover`, `cockpit`, `hexstrike`, `appimages`) to execute via `konsole` instead of running headless with `Terminal=false`.
- [x] Fixed `zoth-desk` Electron launch: passed `--no-open` to avoid unwanted browser popups and guarded telemetry against startup race conditions.
- [x] Fixed `tor-browser` resilient launcher wrapper and package installation.
- [x] Integrated `zoth-animated-bg` with ambient HTML5 gold Celtic matrix engine.
- [ ] Evaluate pruning secondary/niche desktop shortcuts to keep the main application menu ultra-clean.

## 3. Tool Nexus & System Runtimes
- [x] Added `browser-use`, `open-interpreter`, `goose`, `promptfoo`, and `inspect-ai` to curated tool catalog.
- [x] Added `rustc`, `go`, `clang`, `sqlite3`, and `foundryup` detection aliases to `zoth-pkg`.
- [x] Configured system-wide `/etc/environment` and `/etc/profile.d/zothos-env.sh` to include all binary directories (`~/.cargo/bin`, `~/.foundry/bin`, `go/bin`, `/opt/zothos-ai-env/bin`).
- [ ] Monitor disk footprint when pre-installing additional heavyweight LLM evaluation harnesses.

## 4. Visuals & Styling
- [x] Deployed clean Celtic "ZothOS" minimalist wallpaper (gold "Zoth" + platinum silver "OS" on obsidian dark matte canvas).
- [x] Configured KDE Plasma 6 Cyber Gold palette (`#FFD700` accents and glows on selections, buttons, and menus).
- [x] Enabled KWin mouse tracking and compositor effects.
