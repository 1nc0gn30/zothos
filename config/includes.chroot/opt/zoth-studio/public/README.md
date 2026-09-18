# 🌐 Zoth Studio — Public Showcase, Creative Suites & Documentation Hub (v5.6.0)

<p align="center">
  <img src="assets/brand/zoth-golden-z-192.png" alt="Zoth Studio Hermetic Seal" width="128" style="border-radius:16px; box-shadow:0 0 25px rgba(251,191,36,0.4);" />
</p>

<p align="center">
  <strong>Static Production-Ready Web Workstation Suite & Autonomous Engineering Launchpad</strong><br>
  <em>28+ Specialized Creative Workstations · Cyberpunk HUD Cockpit · Nexus 3D Studio · Swarm Arena · OmniPost 2.0 · Argon2id Vault</em>
</p>

---

## 🌟 Overview
This directory (`core-app/public/`) contains the static frontend suites for **Zoth Studio**. It is engineered to run locally on port `8088` with zero external dependencies and zero telemetry, or deploy to static edge CDNs (Netlify, Cloudflare Pages, Vercel) with **zero build step requirements**.

All styles leverage CSS variables from `assets/zoth-theme.css` to support the **4-Theme Master System** (`dark`, `matrix`, `gold`, `light`) across every workstation.

---

## 🏛️ Comprehensive Web Workstations Directory

| Suite / Launchpad | Local Path | Description & Features |
| :--- | :--- | :--- |
| **Cyberpunk HUD Cockpit** | [`studio/cyberpunk-hud.html`](studio/cyberpunk-hud.html) | Flagship 2-column tactical video game HUD with 360° radar, audio oscilloscope, dual-tool split stage, and TTY-0 terminal REPL. |
| **OmniPost 2.0 Video Engine** | [`studio/omnipost.html`](studio/omnipost.html) | 60 FPS HTML5 Canvas/WebCodecs video creator, multi-platform preview cards (X, Warpcast, Bluesky, LinkedIn), and AI tone-shifter. |
| **Nexus 3D Studio & CAD** | [`studio/nexus-3d.html`](studio/nexus-3d.html) | Three.js CAD viewport with procedural shader materials, GLTF/USDZ 1-click exporter, and 4K turnaround canvas recorder. |
| **3D CAD Mesh Deformer** | [`studio/3d-editor.html`](studio/3d-editor.html) | CAD-grade 3D viewport with mesh deformation tools, wireframe inspection, and ambient lighting rigs. |
| **Swarm Command Arena** | [`studio/swarm.html`](studio/swarm.html) | 3D Craig Reynolds Boids flocking arena, 21-agent conversation telemetry, and laser triangulation. |
| **Consensus Crucible v2** | [`studio/consensus.html`](studio/consensus.html) | Autonomous 3-agent arbitration engine with live Shannon entropy calculation ($H < 0.20$ bits) and AST dialectic synthesis. |
| **AI Math Pillars Academy** | [`studio/math-pillars.html`](studio/math-pillars.html) | 6 Sacred Mathematical Pillars interactive proofs: SVD eigendecomposition, Fisher information, STDP, Shannon entropy, KANs, and Hopfield energy. |
| **Netrunner Memory Studio** | [`studio/netrunner-memory.html`](studio/netrunner-memory.html) | 3D Canvas synaptic force-directed graph connecting to Lucy (:8788), entropy filtering, and 1-click Obsidian markdown export. |
| **Memory Whitespace Hub** | [`memory/index.html`](memory/index.html) | Dual-version cognitive space: human narrative digests + AI full-spectrum telemetry inspector. |
| **WebGen Site Foundry** | [`studio/webgen.html`](studio/webgen.html) | Full-stack autonomous site synthesizer, 8-step generation pipeline, live sandbox preview, and ZIP export. |
| **Tool Nexus Explorer** | [`studio/tool-nexus.html`](studio/tool-nexus.html) | Searchable index of 298+ verified tools with interactive schema contract viewer and category badges. |
| **Tool Bench & Harness** | [`studio/tool-bench.html`](studio/tool-bench.html) | Uniform execution harness for local tools with simulated/live execution modes and schema validation. |
| **Peer Bus & Swarm Bridge** | [`studio/peer-bus.html`](studio/peer-bus.html) | Multi-agent file bus coordination, live event stream, and broadcast task dispatch. |
| **Connectors & Loopback Bridge**| [`studio/connectors.html`](studio/connectors.html) | Integration hub for local daemons (:8788, :8787, :8765, :8767, :11434) with live health probes. |
| **Bus Monitor** | [`studio/bus-monitor.html`](studio/bus-monitor.html) | Real-time message throughput, latency waterfall charts, and packet telemetry. |
| **Edge Function Forge** | [`studio/edge-forge.html`](studio/edge-forge.html) | Serverless V8 isolate code editor with built-in rate limiters, Solana RPC connectors, and waterfall latency. |
| **SubSweep Reconnaissance** | [`studio/subsweep.html`](studio/subsweep.html) | OSINT attack surface scanner, Certificate Transparency log probe, and TLS cryptographic auditor. |
| **Vision Link Spatial HUD** | [`studio/vision-link.html`](studio/vision-link.html) | Webcam-based computer vision hand gesture tracking, 3D spatial overlays, and touchless window pinch-zooming. |
| **AI Model Foundry** | [`studio/models.html`](studio/models.html) | Ollama local model benchmark arena with latency waterfall charts and interactive prompt testing. |
| **Visual DAG Agent Composer** | [`studio/agent-composer.html`](studio/agent-composer.html) | Node graph editor with bezier connecting wires, conditional logic branches, and JSON playbook exporter. |
| **IDE / Code Workbench** | [`studio/ide.html`](studio/ide.html) | In-browser code editing with local filesystem access, syntax highlighting, and PTY terminal. |
| **Notes Reviewer & Codex** | [`studio/notes-reviewer.html`](studio/notes-reviewer.html) | Structured research review, wikilink parsing, and Obsidian synchronization. |
| **VOS Virtual Sandbox** | [`studio/vos-sandbox.html`](studio/vos-sandbox.html) | In-browser virtualized Unix execution sandbox and memory scratchpad. |
| **Keymaster Argon2id Vault** | [`vault/index.html`](vault/index.html) | Zero-leak hardware key store encrypted with Argon2id ($m=64\text{MB}, t=3, p=4$) and XChaCha20-Poly1305 AEAD. |
| **Adytum Zero-Trust Sanctum** | [`adytum/index.html`](adytum/index.html) | Cryptographic secret verification, hardware attestation, and key signing. |
| **Pet Dex Sanctuary 3D** | [`pets/studio.html`](pets/studio.html) | 24 Cyber Pet Companion 3D hangar with procedural voxel shaders and interaction prompts. |
| **Pet Companion Habitat** | [`pets/index.html`](pets/index.html) | Interactive pet habitat, telemetry stats, and sprite animation viewer. |
| **Documentation Portal** | [`docs/index.html`](docs/index.html) | Editorial poster documentation hub with searchable manual, port matrix, and architecture. |
| **Interactive README Library** | [`docs/readmes.html`](docs/readmes.html) | Dynamic markdown renderer presenting all in-repo guides with syntax highlighting. |

---

## 🚀 Running Locally

```bash
# Serve static directory on loopback:
cd core-app/public
python3 -m http.server 8088 --bind 127.0.0.1
```

Visit: [http://127.0.0.1:8088/](http://127.0.0.1:8088/)
HUD: [http://127.0.0.1:8088/studio/cyberpunk-hud.html](http://127.0.0.1:8088/studio/cyberpunk-hud.html)
READMEs: [http://127.0.0.1:8088/docs/readmes.html](http://127.0.0.1:8088/docs/readmes.html)
