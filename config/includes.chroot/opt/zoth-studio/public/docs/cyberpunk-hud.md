<div align="center">

# <img src="/assets/mascot/azoth-mask.jpg" width="40" height="40" style="border-radius: 50%; vertical-align: middle; border: 2px solid #e8c872; box-shadow: 0 0 15px rgba(232,200,114,0.6);" /> ⚡ ZOTH STUDIO: MASTER CYBERPUNK VIDEO GAME HUD SYSTEM

### *1:1 Whiteboard Layout Specification, Dynamic Center Stage, 21-Agent Telemetry Deck & 4-Theme Standard*

[![Cockpit Surface](https://img.shields.io/badge/surface-studio%2Fcockpit.html-00f0ff?style=for-the-badge&logo=target&logoColor=white)](http://127.0.0.1:8088/studio/cockpit.html)
[![Themes](https://img.shields.io/badge/themes-Dark%20%7C%20Light%20%7C%20Matrix%20%7C%20Gold-fbbf24?style=for-the-badge&logo=safari&logoColor=white)](http://127.0.0.1:8088/studio/cockpit.html)
[![Zero Root Scroll](https://img.shields.io/badge/layout-Zero%20Root%20Scroll%20100vh-34d399?style=for-the-badge&logo=w3c&logoColor=white)](http://127.0.0.1:8088/studio/cockpit.html)
[![Tool Registry](https://img.shields.io/badge/tools-298%2B%20Tools%20%7C%2028%2B%20Suites-a855f7?style=for-the-badge&logo=webgl&logoColor=white)](http://127.0.0.1:8088/studio/cockpit.html)

<br>

</div>

<p align="center"><img src="/assets/brand/azoth-watermark-seal.svg" width="120" height="120" alt="Zoth Sovereign Seal" /></p>

---

## 🏛️ 1. Executive Summary & The Whiteboard Origin

**The Cockpit** (`/studio/cockpit.html`) represents the flagship control surface of Zoth Studio. Originating directly from the core architectural whiteboard blueprint, the Cyberpunk Video Game HUD re-imagines multi-agent AI orchestration not as a generic chat interface, but as an **immersive, zero-root-scroll mission deck**.

Traditional AI dashboards force users to scroll through endless vertically stacked panels, disorienting operators and losing vital system state. The Cyberpunk HUD solves this with a **fixed, high-density 2-column tactical matrix**:

```
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│ [⚡ ZOTH STUDIO (SOVEREIGN)]  (?)   [☷ DECK]             [PORTS] [TIME UTC] [THEMES] [TOOL MGR]│
├──────────────────────────────────────┬──────────────────────────────────────────────────────┤
│ ⚡ ACTIVE AGENTS (21 FLEET)           │ 🎬 OMNIPOST 2.0 VIDEO STUDIO  [TAGS]                 │
│ (•) AZOTH          Prime Arbiter     │ ───────────────────────────────────────────────────  │
│ ( ) ATHENA         Math & Truth      │ [OMNI POST] [TOOL BENCH] [FULLSCREEN] [DETACH]       │
│ ( ) DRACO          Consensus Mesh    │                                                      │
│ ( ) HERMES         Tool Harness      │ ┌──────────────────────────────────────────────────┐ │
│ ( ) [ + Slot / Specialist ]          │ │ ┏                                              ┓ │ │
│                                      │ │                                                  │ │
│ 🧠 SYNAPTIC MEMORY (:8788 LIVE)      │ │              DYNAMIC MODULAR STAGE               │ │
│ ┌──────────────────────────────────┐ │ │                                                  │ │
│ │  ~ ~ ~ [ Canvas Graph ] ~ ~ ~    │ │ │          (Hosts Any Studio Workstation:          │ │
│ └──────────────────────────────────┘ │ │           OmniPost, Tool Bench, Swarm,           │ │
│ VECTORS: 1,024D   RECALL: <2.4ms     │ │           WebGen, Consensus, Nexus 3D,           │ │
│ NODES: 21 Live    ENTROPY: -0.042 H  │ │             vOS Sandbox, Memory, Vault)          │ │
│                                      │ │                                                  │ │
│ 💻 COMMAND LINE (REPL)               │ │                                                  │ │
│ [zoth-hud $ ________________ ] [EXEC]│ │ ┗                                              ┛ │ │
│                                      │ └──────────────────────────────────────────────────┘ │
│ 📜 MESSAGE LOG (STREAM)              │ STAGE: LOCAL 127.0.0.1      FPS: 60.0    E2EE ENCLAVE│
│ [CONSENSUS] Invariants verified pass.├──────────────────────────────────────────────────────┤
│ [MEMORY] STDP synaptic link adjusted.│ [SWARM] [MEMORY] [WEB GEN] [PETS] [VAULT] [CONSENSUS]│
│                                      │                                                      │
│ 📐 MAIN PILLAR 6 STATUS              │                                                      │
│ STDP Synaptic Growth: [████████] 98% │                                                      │
│ AST Invariant Sealing: [███████] 100%│                                                      │
└──────────────────────────────────────┴──────────────────────────────────────────────────────┘
```

---

## 🎨 2. The 4 Sovereign Visual Themes

The HUD enforces complete semantic color and typography tokens via `/assets/zoth-cyberpunk-hud.css`, guaranteeing WCAG AAA contrast across 4 distinct aesthetics:

| Theme Name | Primary Aesthetic | Background | Accent & Accents | Typography |
|---|---|---|---|---|
| **🌙 Dark Void** | Midnight Cyberpunk | `#030408` (Deep Obsidian) | `#00f0ff` (Neon Cyan) · `#fbbf24` (Gold) | `Orbitron` + `JetBrains Mono` |
| **☀️ Solar Light** | Swiss Architectural | `#f4f6fb` (Pristine Frost) | `#0071e3` (Cobalt) · `#059669` (Emerald) | `Plus Jakarta Sans` + `IBM Plex Mono` |
| **📟 Matrix CRT** | Phosphor Terminal | `#000000` (Pitch Black) | `#00ff66` (Phosphor Green) | `Share Tech Mono` |
| **⚗️ Hermetic Gold**| 24K Alchemical Amber | `#050300` (Celestial Bronze) | `#ffd700` (Alchemical Gold) | `Cinzel` + `IBM Plex Mono` |

*Theme controls*: Toggle instantly via `[ THEMES ]` in the top bar, `Shift+T` globally, or via terminal command `theme <dark|light|matrix|gold>`.

---

## 🧩 3. Architectural Component Breakdown

### 1. Top Header (`.hud-header` · 54px Fixed)
- **Brand Lockup**: `⚡ ZOTH STUDIO` emblem with chamfered neon badge (`.hud-logo-badge`).
- **Help Button `(?)`**: One-click trigger for keyboard shortcuts and HUD usage modal.
- **Deck Toggle Button (`[ DECK ]`)**: Responsive trigger for tablet and mobile slide-over operations.
- **Ports Badge (`[ PORTS ]`)**: Displays real-time loopback daemon status and opens the port topology modal.
- **Time Clock Badge (`[ TIME ]`)**: Live UTC/Local millisecond-precise clock. Click toggles time format.
- **Theme Badge (`[ THEMES ]`)**: Interactive theme switcher displaying color swatches.
- **Tool Manager Button (`[ TOOL MGR ➔ ]`)**: Opens the studio workstation directory and catalog modal.

### 2. Left Operations & Telemetry Deck (`.hud-deck` · 340px–380px)
- **Panel 1: ACTIVE AGENTS Roster**:
  - Custom cyber radio buttons (`(•)` active vs `( )` idle).
  - Instant focus attunement to any of the 21 sovereign agents (`@azoth`, `@athena`, `@draco`, `@hermes`, `@antigravity`, etc.).
  - `[ + Slot / Specialist ]`: Dynamically allocate custom subagents and roles into the active session.
- **Panel 2: SYNAPTIC MEMORY Canvas**:
  - Live 2D HTML5 Canvas simulation of 21 neural agent clusters with pulsing synaptic connections and STDP data packets.
  - High-precision telemetry metrics: Vectors (`1,024 Dim`), Nodes (`21 Live`), Recall latency (`< 2.4ms`), Shannon Entropy (`-0.042 H`).
- **Panel 3: COMMAND LINE REPL (TTY-0)**:
  - Interactive terminal shell with prompt history (Up/Down arrows) and execution output.
  - Commands: `help`, `status`, `tool <id>`, `agent <id>`, `theme <name>`, `ports`, `exec <prompt>`, `clear`, `time`.
- **Panel 4: MESSAGE LOG Stream**:
  - Rolling real-time event log with color-coded provenance tags (`[AZOTH]`, `[CONSENSUS]`, `[MEMORY]`, `[SYSTEM]`, `[DAEMON]`).
  - Integrated with the native sovereign Swarm Bus (`BroadcastChannel('zoth_swarm_bus')`).
- **Panel 5: MAIN PILLAR 6 STATUS**:
  - Real-time animated telemetry meters measuring STDP Synaptic Growth, AST Consensus Sealing, and Shannon Entropy Reduction.

### 3. Center Stage (`.hud-stage` · Dynamic Modular Workspace)
- **Stage Header Strip (44px)**:
  - Displays the active workstation name, category, and metadata tags (e.g., `VIDEO`, `60 FPS`, `MOTION`).
  - Quick launch buttons: `[ OMNI POST ]`, `[ TOOL BENCH ]`, `[ FULLSCREEN ]`, and `[ DETACH ]` (opens the workstation in a detached sovereign browser window).
- **Modular Viewport Container (100% Height)**:
  - Encased in four cyberpunk corner reticle brackets (`.hud-bracket-tl`, `.hud-bracket-tr`, `.hud-bracket-bl`, `.hud-bracket-br`).
  - Seamlessly hosts any studio workstation via dynamic zero-latency iframe orchestration (`/studio/omnipost.html`, `/studio/tool-bench.html`, `/studio/swarm.html`, `/studio/webgen.html`, `/studio/consensus.html`, etc.).
  - Overlay telemetry watermark showing active stage coordinate, 60.0 FPS lock, and E2EE enclave seal.

### 4. Bottom Quick-Dock (`.hud-dock` · 46px Fixed)
- **Quick-Launch Tabs**: Instant single-click switching between flagship studio suites:
  - `[ SWARM ]` ➔ `/studio/swarm.html` (3D WebGL Arena)
  - `[ MEMORY ]` ➔ `/memory/` (Associative Whitespace Graph)
  - `[ WEB GEN ]` ➔ `/studio/webgen.html` (Template Foundry)
  - `[ PETS ]` ➔ `/pets/` (3D Figurine Mascots)
  - `[ VAULT ]` ➔ `/vault/` (Argon2id Enclave)
  - `[ CONSENSUS ]` ➔ `/studio/consensus.html` (AST Battle Arena)
  - `[ NEXUS 3D ]` ➔ `/studio/nexus-3d.html` (Parametric CAD)
- **Right Telemetry Status**: Live LED indicators for Loopback `:8484`, `21 AGENTS`, and `ZERO TELEMETRY`.

---

## 📱 4. Responsive Viewport Strategy

| Viewport Category | Screen Width | Layout Behavior | Navigation / Controls |
|---|---|---|---|
| **Desktop Cockpit** | $\ge 1101\text{px}$ | Full 2-column fixed grid (Left Deck + Center Stage). Zero root scroll. | Permanent topbar, full deck visibility, fixed bottom dock. |
| **Tablet Viewport** | $769\text{px} - 1100\text{px}$ | Center Stage expands to 100% width. Left Deck operates as a slide-out HUD drawer. | `[ DECK ]` button in header toggles the telemetry deck with smooth Bezier slide. |
| **Mobile Handheld** | $\le 768\text{px}$ | Center Stage takes 100% viewport. Slide-up bottom sheets handle Agents, Terminal & Logs. | Simplified topbar, bottom quick dock optimized for touch targets. |

---

## ⌨️ 5. Global Keyboard Shortcuts

The Cockpit is fully keyboard-navigable for maximum power-user ergonomics:

| Keybinding | Action | Scope / Context |
|---|---|---|
| <kbd>1</kbd> | Quick Load **OmniPost 2.0 Video Studio** | Global (when not typing in inputs) |
| <kbd>2</kbd> | Quick Load **Tool Bench 2.0 Simulation Suite** | Global |
| <kbd>3</kbd> | Quick Load **3D Swarm Command Arena** | Global |
| <kbd>4</kbd> | Quick Load **Memory Whitespace & Lucy Oracle** | Global |
| <kbd>5</kbd> | Quick Load **WebGen Studio & Template Foundry** | Global |
| <kbd>Shift</kbd> + <kbd>T</kbd> | Cycle Visual Themes (`dark` $\to$ `light` $\to$ `matrix` $\to$ `gold`) | Global |
| <kbd>Ctrl</kbd> + <kbd>K</kbd> / <kbd>M</kbd> | Open **Studio Workstations & Tool Manager Modal** | Global |
| <kbd>P</kbd> | Open **Loopback Port Topology Modal** | Global |
| <kbd>F</kbd> | Toggle **Fullscreen Center Stage** | Global |
| <kbd>?</kbd> | Open **Keyboard Shortcuts & Quick Help Modal** | Global |
### 6. Tactical Visualizers & Action Bridge Engines

#### 1. 360° Polar Radar Sweep Mini-Map
- **Interactive 2D Polar Canvas**: Tracks all 21 swarm agents positioned across 4 quadrants.
- **Dynamic Sweep Beam**: 60 FPS rotating beam with glow fading, range zoom (`radar zoom <x>`), and clickable blips for instant agent focus.

#### 2. Real-Time Audio Oscilloscope
- **Web Audio Engine**: 60 FPS visualizer rendering Waveform, FFT frequency spectrum analyzer, and XY Lissajous orbital figures.
- **Low-Latency Analysis**: Intercepts Web Audio synthesizer beeps, voice memos, and tactical soundboard clicks.

#### 3. Dynamic Tool Operations Deck (`#hud-tool-context-card`)
- **Profile-Driven Operations**: Automatically detects which tool is active in the Center Stage and renders quick dials and telemetry:
  - *OmniPost*: Aspect Ratio toggles (`16:9`, `4:3`, `9:16`), 60 FPS Video Render, Synth Audio Track, Generate Thumbs.
  - *3D CAD*: Toggle Wireframe, PBR Shading, Spawn Mesh, Snapshot Canvas.
  - *Swarm Arena*: Laser Triangulation, Broadcast Swarm Bus, Dispatch Agent.
  - *Consensus*: Dialectic Code Arbitration, Shannon Divergence Meter.
  - *Hermes Agent*: Engine Status, Subagent Dispatch, Doctor Diagnostics.

#### 4. Bi-Directional Action Bridge (`zoth-hud-embedded.js`)
- **Message Dispatching**: Communicates across the stage iframe boundary via `postMessage({ type: 'ZOTH_TOOL_ACTION', action, payload })`.
- **Zero-Friction Execution**: Workstations register handlers via `ZothEmbeddedAdapter.onAction(action, callback)` and execute canvas renders, mesh manipulations, and exports without full-page reloads.

#### 5. Grok Intelligence Layer & Stage Self-Healing Watchdog (`zoth-hud-intel.js`)
- **Intelligence Dashboard Mode (`showDashboard()`)**: High-level tactical command surface providing instant overview of workstations, learned recents, and live port health checks (`:8484`, `:8788`, `:8088`, `:11434`).
- **Dynamic Learned Recents Dock (`#hud-dock-learned`)**: Tracks tool dwell times, open frequency, and dynamically surfaces the operator's most frequent workstations directly on the HUD dock.
- **Auto-Acclimation Engine (`acclimate(toolId)`)**: Automatically synchronizes the active Sovereign Agent (`webgen` ➔ `hermes`, `netrunner-memory` ➔ `leviathan`, `math-pillars` ➔ `grok`, `consensus` ➔ `draco`, etc.), presets aspect ratios, and customizes tactical dial telemetry.
- **Stage Self-Healing Watchdog (`#hud-stage-heal`, `retryStage()`, `healNow()`)**: Monitors iframe mount handshakes; automatically triggers graceful retry loops and fallback dashboard routing upon mount delays or error events.

---

## ⌨️ 6. Global Keyboard Shortcuts

| Shortcut | Action Description | Scope |
|---|---|---|
| <kbd>Ctrl</kbd> + <kbd>K</kbd> | Open 298+ Tools Omniverse Navigator | Global |
| <kbd>Shift</kbd> + <kbd>T</kbd> | Cycle 4 Themes (Dark Void → Solar Light → Matrix → Gold) | Global |
| <kbd>Shift</kbd> + <kbd>S</kbd> | Toggle Dual-Tool Split Stage Mode | Global |
| <kbd>Tab</kbd> | Auto-complete command in Terminal REPL | Terminal Input |
| <kbd>Escape</kbd> | Close any open modal, sheet, or drawer | Global |
| <kbd>↑</kbd> / <kbd>↓</kbd> | Navigate Terminal REPL command history | Terminal Input |
| <kbd>Enter</kbd> | Execute command in Terminal REPL | Terminal Input |

---

## 🔌 7. Local Port Topology & Sovereign Endpoints

The Cockpit communicates exclusively over local loopback connections with zero cloud data transmission:

```
┌───────────┬──────────────────────────────────┬─────────────────────────────────────────────────┐
│ Port      │ Protocol / Service               │ Function & Responsibility                       │
├───────────┼──────────────────────────────────┼─────────────────────────────────────────────────┤
│ **:8088** │ HTTP (Static Server)             │ Core HTML/CSS/JS Studio Hub & Cockpit Surface   │
│ **:8484** │ WebSocket / HTTP / IPC           │ Sovereign Swarm Bus & Orchestration Gateway     │
│ **:8787** │ HTTP (Encrypted Vault)           │ Argon2id Cryptographic Secrets & Keyring Daemon │
│ **:8788** │ HTTP / REST (Memory Daemon)      │ 1,024-dim Biomorphic Vector Substrate & STDP DB │
│ **:5225** │ WebSocket (SimpleX E2EE)         │ Post-Quantum Zero-Metadata Messaging Gateway    │
│ **:8199** │ HTTP (Topology Lab)              │ 12-Formula #つぶやきProcessing WebGL Studio     │
│ **:11434**│ HTTP (Local LLM Inference)       │ Ollama / Llama.cpp Local Sovereign Models       │
└───────────┴──────────────────────────────────┴─────────────────────────────────────────────────┘
```

---

## 🛠️ 8. File Manifest & Automated Verification

- **`public/assets/zoth-cyberpunk-hud.css`**: Master Cyberpunk CSS system with 4 high-contrast themes and responsive drawers.
- **`public/assets/zoth-cyberpunk-hud.js`**: Master HUD controller engine (Polar Radar, Audio Scope, 6 Pillars, Memory Graph, Split Stage, Omniverse Navigator).
- **`public/assets/zoth-hud-intel.js`**: Grok Intelligence Layer (Dashboard mode, Learned Recents dock, auto-acclimation, stage self-healing watchdog).
- **`public/assets/zoth-hud-embedded.css`**: Aggressive header/footer cleaner for embedded workstations.
- **`public/assets/zoth-hud-embedded.js`**: Universal embedded adapter and bi-directional action bridge.
- **`public/assets/zoth-cyberpunk-hud.test.js`**: 18-suite automated test suite verifying all visualizers, Hermes dispatch, and Grok intelligence layer (100% pass rate).

