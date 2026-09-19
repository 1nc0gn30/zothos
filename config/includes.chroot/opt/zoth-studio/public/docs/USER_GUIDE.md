<div align="center">

# <img src="/assets/mascot/azoth-mask.jpg" width="40" height="40" style="border-radius: 50%; vertical-align: middle; border: 2px solid #e8c872; box-shadow: 0 0 15px rgba(232,200,114,0.6);" /> ⚡ ZOTH STUDIO OPERATOR MANUAL & USER GUIDE

### *Sovereign Local-First Multi-Agent Architecture, 3D CAD Omniverse & ESP32-S3 Companion*

[![Version](https://img.shields.io/badge/manual-v12.0.0-00f0ff?style=for-the-badge&logo=target&logoColor=white)](http://127.0.0.1:8088/docs/)
[![Local-First](https://img.shields.io/badge/architecture-100%25%20Local--First-34d399?style=for-the-badge&logo=safari&logoColor=white)](http://127.0.0.1:8088/)
[![Security](https://img.shields.io/badge/vault-Argon2id%20%2B%20XChaCha20-f472b6?style=for-the-badge&logo=rust&logoColor=white)](http://127.0.0.1:8088/vault/)

<br>

</div>

<p align="center"><img src="/assets/brand/azoth-watermark-seal.svg" width="120" height="120" /></p>

---

## 🔌 1. System Topology & Network Ports

| Surface | Port / URL | Function | Security & Isolation Doctrine |
| :--- | :--- | :--- | :--- |
| **Public Hub & HUD** | `http://127.0.0.1:8088/` | Static brochures, Cyberpunk HUD, 28+ creative suites, 3D showcases | Public / Tunnel Safe |
| **Operator Deck** | `http://127.0.0.1:8484/` | Multi-model chat harness, terminal dock, swarm arbitration engine | **Loopback Only** (`127.0.0.1`) |
| **ESP32-S3 Serial Bridge** | `http://127.0.0.1:8585/` | Hardware Web HUD, serial monitor & TTS audio server | Private Loopback |
| **Argon2id Vault Daemon** | `http://127.0.0.1:8787/` | Hardware-isolated zero-leak key store (Rust RPC daemon) | **Zero-Leak Loopback** |
| **Cognitive Memory Daemon** | `http://127.0.0.1:8788/` | Dual-layer memory engine, STDP synaptic links & Lucy Oracle | **Private Loopback** |
| **Local LLM (Ollama)** | `http://127.0.0.1:11434/` | Offline `zoth-micro`, Qwen 2.5 Coder, SmolLM2, Hermes 3 | Private Loopback |
| **Signal swarm bridge** | `http://127.0.0.1:8765/` | Tagged conversation memory + SSE | Private Loopback |
| **SimpleX web bridge** | `http://127.0.0.1:8767/` | Same router as Signal (`process_swarm_command`) | Private Loopback |

---

## 🎛️ 2. Operator Command Deck & HUD Shortcuts

### ⚡ Interactive Keyboard Shortcuts
* `Enter`: Send message or execute active slash command.
* `Shift + Enter`: Multi-line prompt formatting in chat composer.
* `↑ ArrowUp`: When input is empty, loads your previous prompt for instant editing and re-running.
* `⌘K / Ctrl+K`: Focus the composer dock or open the global Command Palette across 298+ tools.
* `⌘N / Ctrl+N`: Start a fresh multi-agent session.
* `Alt + P`: Open 24 Cyber Pet Companion selector.
* `Alt + V`: Open Zero-Knowledge Argon2id Vault unseal modal.
* `Shift + K`: Toggle Kiroshi POV Visor mode with targeting reticle and optical zoom.
* `Shift + X`: Trigger Sandevistan Overdrive (10s boosted frame pacing & chromatic aberration).
* `Shift + S`: Toggle Dual-Tool Split Stage side-by-side mode.
* `Shift + M`: Mute / Unmute Procedural Cyber Audio Synthesizer.
* `Shift + T`: Cycle 4-theme engine (`dark`, `matrix`, `gold`, `light`).

### 📜 Master Slash Commands
* `/doctor`: Run automated system dependency audit and diagnostic scan (`orchestrator.py doctor`).
* `/scan`: Re-index and verify all 298+ local tool manifests (`orchestrator.py scan`).
* `/github [repos|dispatch]`: Query GitHub Octokit REST endpoints or trigger Actions workflows.
* `/models`: Switch neural providers (Ollama `zoth-micro`, `qwen2.5-coder:1.5b`, `smollm2:360m`, OpenAI, Groq, Cerebras).
* `/pet <name>`: Engage specialized companion cyber pets (`azoth`, `kai`, `draco`, `ignis`, `athena`, `lycan`, `lucy`).
* `/studio [brief]`: Launch the 8-step Astro / Tailwind website generator with live preview.
* `/who`: Query active swarm agents, project locks, and heartbeat status.
* `/vault`: Inspect or unlock local Argon2id credentials.

---

## 📐 3. AI Math Pillars & Interactive Theory Academy (`/studio/math-pillars.html`)

The **Math Pillars Academy** ([`/studio/math-pillars.html`](http://127.0.0.1:8088/studio/math-pillars.html)) is an interactive mathematical visualization suite covering the fundamental principles of sovereign intelligence:

1. **Linear Algebra & SVD / Eigendecompositions**:
   - Interactive 2D/3D matrix transformation simulator with live eigenvector deformation grids and singular value spectrum plots.
2. **High-Dimensional Probability & Information Geometry**:
   - Fisher Information metric visualization and natural gradient descent trajectories across curved probability simplices.
3. **Spike-Timing-Dependent Plasticity (STDP)**:
   - Real-time simulation of Hebbian synaptic weight adaptation ($\Delta w = A_+ e^{-\Delta t/\tau_+}$) under varying pulse intervals.
4. **Shannon Epistemic Agreement Entropy**:
   - Multi-agent token entropy calculator showing $H(p) < 0.20\text{ bits}$ consensus threshold boundaries.
5. **Kolmogorov-Arnold Networks (KAN)**:
   - Visualizing learnable B-spline activation functions along edges for transparent symbolic regression.
6. **Modern Continuous Hopfield Energy Networks**:
   - Energy landscape surface rendering showing single-step associative recall without spurious local minima.

---

## 🧠 4. Sovereign Memory Whitespace & Dual-Version Netrunner Engine (`/memory/`)

The **Memory Whitespace Hub** ([`/memory/`](http://127.0.0.1:8088/memory/) and [`/studio/netrunner-memory.html`](http://127.0.0.1:8088/studio/netrunner-memory.html)) is the dedicated sovereign cognitive space:

### 📖 Dual-Version Representation Architecture
Every memory recorded across Zoth Studio (tool runs, code changes, AST arbitrations) is automatically structured with two synchronized formats:
* **📖 Human Narrative Digest (`human_digest`)**:
  - Clean, distraction-free markdown storytelling crafted for human strategic review, milestone tracking, and calm thinking.
  - Includes high-level context, intent, actions taken, outcome summaries, and key takeaways without clutter.
  - Rendered by default in web workstation cards and standard CLI lists.
* **🧬 AI Full Spectrum Telemetry (`ai_spectrum`)**:
  - Raw, lossless machine telemetry designed for deterministic AI agent reasoning, AST diff tracking, and tool replay.
  - Contains exact CLI arguments, exit codes, output tails, byte sizes, AST invariants, and neuromodulator valence/arousal/dominance vectors.
  - Formatted into `<ai_spectrum>` tags inside `<memory_context>` XML blocks for prompt injection.

### 💻 Operator Memory CLI Runbook (`zoth mem`)
```bash
# 1. View recent human narrative digests
zoth mem list

# 2. Inspect raw AI full-spectrum telemetry (tool args, AST diffs, exit codes)
zoth mem list --spectrum

# 3. Search memories by semantic query or tool name
zoth mem search "refactor theme tokens"
zoth mem search "webgen_compiler" --spectrum

# 4. Generate deterministic XML memory context for autonomous agent prompt injection
zoth mem prompt-context --mode dual --limit 5

# 5. Record tool execution event with automated dual-version synthesis
zoth mem record-tool "webgen_compiler" "success" "Compiled 3-page Astro workspace" --output "OK"

# 6. Record codebase mutation event with AST invariants
zoth mem record-code "public/studio/swarm.html" "modified" "Added 3D laser sound effects"
```

### 🎮 Lucy Netrunner Oracle & 3D Matrix
* **Lucy Netrunner Oracle**: Embodying Lucy from *Cyberpunk: Edgerunners*, this oracle navigates the 3D associative memory graph, performs Blackwall diagnostic scans, broadcasts deep neural context, and triggers audio voice lines.
* **Dual-View Workstation HUD**: Switch between 📖 **Human Digest** and 🧬 **AI Full Spectrum** modes in real time with 1-click XML prompt copying for LLM sessions.
* **STDP Causal Traversal**: Sub-millisecond root cause search linking historical agent actions to present outcomes via `/v1/memories/causal-path`.

---

## 🤖 5. ESP32-S3 Physical Hardware Companion

<div align="center">
  <img src="/assets/media/cyber-esp32-companion-photoreal.jpg" width="480" style="border-radius: 12px; border: 2px solid #34d399;" />
</div>

### Hardware Specifications & Pinouts
* **MCU**: ESP32-S3 N16R8 (Dual Core Xtensa LX7 @ 240MHz, 16MB Flash, 8MB PSRAM)
* **Screen**: 2.0" ST7789 IPS SPI TFT (240x320 resolution, RGB565 format)
  - `MOSI: GPIO 11`, `SCLK: GPIO 12`, `CS: GPIO 10`, `DC: GPIO 13`, `RST: GPIO 1`
* **Audio**: ES8311 I2S Audio Codec + PA Power Amplifier + Speaker
  - `BCLK: GPIO 15`, `WS/LRCK: GPIO 16`, `DOUT: GPIO 7`, `DIN: GPIO 8`
* **LEDs**: Addressable WS2812B RGB Status Ring on `GPIO 48`
* **Inputs**: Tactile buttons on `GPIO 20` (Up/Next) and `GPIO 19` (Down/Action)

### Launching the Serial & TTS Bridges
```bash
# 1. Start bridge daemon
./start-hardware-bridge.sh

# 2. Bridge connects to /dev/ttyACM0 @ 115200 baud
# Web HUD available at http://127.0.0.1:8585/
```

### Compact Serial JSON Protocol
```json
// Host -> ESP32-S3 (State & Emotion Broadcast)
{"type":"state_update","companion":"azoth","mood":"focused","cpu_load":38.2,"status_text":"Refactoring Shader"}

// ESP32-S3 -> Host (Hardware Event)
{"type":"button_press","button":"UP","hold_ms":350,"trigger":"TRIGGER_SWARM_CYCLE"}
```

---

## 🔐 6. Zero-Knowledge BYOK Vault (`/vault/`)

* **Rust Daemon (`:8787`)**: Encrypted using Argon2id ($m=64\text{MB}, t=3, p=4$) and XChaCha20-Poly1305.
* **Zero-Leak Memory Policy**: Sensitive buffers are wrapped in Rust `Zeroize` traits and zeroed upon drop.
* **In-Browser Web Crypto Fallback**: Uses PBKDF2 (100,000 iterations) + AES-GCM 256-bit for client-side storage.

```bash
# Store Secret
curl -X POST http://127.0.0.1:8787/api/vault/store \
  -H "Content-Type: application/json" \
  -d '{"key_alias":"OPENAI_API_KEY","secret_value":"sk-xxx","passphrase":"master-secret"}'

# Retrieve Secret
curl -X POST http://127.0.0.1:8787/api/vault/retrieve \
  -H "Content-Type: application/json" \
  -d '{"key_alias":"OPENAI_API_KEY","passphrase":"master-secret"}'
```

---

## 🏛️ 7. Creative & Diagnostic Web Studios (`/studio/`)

| Studio Suite | Endpoint Path | Role & Capabilities |
| :--- | :--- | :--- |
| **Master Azoth Portal** | `/zoth/` | Sacred Fibonacci token visualizer, AST code synthesis, and alchemical core. |
| **Memory Whitespace Hub** | `/memory/` | Distraction-free sovereign cognitive space with dual-layer story digests and neural graph. |
| **Math Pillars Academy** | `/studio/math-pillars.html` | Interactive mathematical theory academy: linear algebra, manifolds, STDP, and KAN. |
| **Netrunner 3D Cyberspace** | `/studio/netrunner-memory.html` | AAA 3D Cyberspace world, 360° radar, AR scanner mode, stepped altars & Lucy oracle. |
| **Nexus 3D CAD Omniverse** | `/studio/nexus-3d.html` | Three.js 3D viewport with GLTF asset loader, Wireframe/PBR modes, and HDRI skyboxes. |
| **Consensus Arena v2** | `/studio/consensus.html` | 3-agent triangulation with Shannon entropy and Jaccard token overlap metrics. |
| **Swarm Command Arena** | `/studio/swarm.html` | Craig Reynolds Boids 3D kinetic flocking simulation tracking agent communication vectors. |
| **OmniPost 2.0 Video Engine**| `/studio/omnipost.html` | 60 FPS HTML5 Canvas video synthesizer, thumbnail forge, subtitle & speech narration syncer. |
| **Vision Link Spatial HUD** | `/studio/vision-link.html` | Webcam hand gesture recognition, 3D holographic overlays, and air typing keyboard. |
| **Visual DAG Agent Composer**| `/studio/agent-composer.html` | Interactive node graph editor with bezier connecting wires and JSON playbook exporter. |
| **Edge Function Forge** | `/studio/edge-forge.html` | Serverless V8 isolate sandbox with Solana RPC connectors and waterfall telemetry. |
| **SubSweep Recon** | `/studio/subsweep.html` | OSINT attack surface scanner, Certificate Transparency log probe, and TLS security auditor. |

---

## 💛 8. Support the forge (`/pricing/`)

The operator OS is **$0**. Install, deck, vault, swarm, agents, and BYOK run on your hardware. Patron is optional funding. NullAI is paid work at nullai.tech. This product is **Zoth Studio**, not NullAI. Nothing here is a SaaS seat, and the vault is never locked behind a plan.

| Door | What it is | Where |
| :--- | :--- | :--- |
| **Operator** | Free local OS. Primary conversion is install. | [`/#install`](/#install) |
| **Founder Patron** | Optional funding. Keep Zoth free and sovereign. GitHub Sponsors when live. | [GitHub](https://github.com/NullAITech/zoth-studio) |
| **NullAI** | Paid services at [nullai.tech](https://nullai.tech/): SLA, hardware, custom foundry. | [NullAI](https://nullai.tech/) |

Doctrine, never-pay list (keys, inference, telemetry), and FAQ: [`/pricing/`](/pricing/).

---

<div align="center">
  <img src="/assets/mascot/azoth-mask.jpg" width="30" height="30" style="border-radius:50%; vertical-align:middle; border:1px solid #e8c872;" />
  <br>
  <strong>Zoth Studio Documentation Group</strong> · Licensed under Apache License 2.0
</div>
