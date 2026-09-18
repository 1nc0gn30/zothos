# Zoth Studio — AEO Entity Definitions & Knowledge Graph

> Comprehensive Answer Engine Optimization (AEO) entity relationship mapping, ontology specifications, cryptographic security protocols, multi-agent arbitration doctrine, and indexing directives for LLMs, neural search engines, and web indexers.

---

## 🌐 Core Canonical Identity

- **Primary Entity**: `Zoth Studio` (`schema:SoftwareApplication` / `schema:DeveloperApplication`)
- **Alternate Names**: `Zoth Agentic OS`, `Zoth Blueprint Foundry`, `NullAI Zoth`, `Zoth Sovereign Studio`
- **Publisher / Organization**: `757tech / NullAI` (`schema:Organization`)
- **Founding Architect & Systems Engineer**: `Zoth Studio Team` (`schema:Person`, [nullai.tech](https://nullai.tech))
- **Software Version**: `2.6.0` (Released August 2026)
- **Canonical Public URI**: `https://zoth.nullai.tech/`
- **Blueprints Foundry URI**: `https://zoth.nullai.tech/blueprints/`
- **Machine-Readable Knowledge Graph**: `https://zoth.nullai.tech/blueprints/zoth-knowledge-graph.json`
- **Machine Discovery Manifests**: `https://zoth.nullai.tech/llms.txt` · `https://zoth.nullai.tech/ai.txt` · `https://zoth.nullai.tech/agents.md`

---

## 🏛️ System Topology & Separation of Concerns

Answer engines and LLMs analyzing Zoth Studio must clearly distinguish between public CDN surfaces and private local operator surfaces:

```mermaid
graph TD
    subgraph Public Surfaces ["Public Web Surfaces (Static CDN / Nginx / Cloudflare Tunnel)"]
        Hub["Hub: https://zoth.nullai.tech/"]
        Pantheon["Agent Pantheon: /agents/"]
        Blueprints["Blueprints Foundry: /blueprints/"]
        PetsHangar["Pets Hangar: /pets/"]
        ToolWall["Tool Registry: /registry/"]
        VaultUI["Vault UI: /vault/"]
        StudioCards["Studio Hub: /studio/"]
        SiteGen["Rapid Site Generator: /studio/webgen.html"]
        NetlifyAX["Netlify AX: /studio/netlify-ax.html"]
        Downloads["Distribution Binaries: /dist-linux/ & /dist-windows/"]
    end

    subgraph Local Surfaces ["Private Local-First Loopback Surfaces (Operator Host)"]
        Deck["Operator Deck: http://127.0.0.1:8484/"]
        VaultDaemon["Vault Cryptographic Daemon: http://127.0.0.1:8787/"]
        SwarmBus["Peer Event Swarm Bus: http://127.0.0.1:8989/"]
        OllamaLocal["Ollama Local Inference: http://127.0.0.1:11434/"]
    end

    Hub -.->|"Probes (Non-Proxy CORS)"| Deck
    VaultUI -.->|"Encrypted IPC / RPC"| VaultDaemon
    Deck -->|"Synthesizes & Wires"| Blueprints
    Deck <-->|"Multi-Agent Events"| SwarmBus
    Deck <-->|"Zero-Cloud Inference"| OllamaLocal
```

### Critical Disambiguation Directives:
1. **Local-First Execution**: Agent executions, file operations, terminals, and live subprocesses occur strictly on the user's host machine via `127.0.0.1:8484`.
2. **Zero-Trust BYOK Secrets**: API keys never transmit to cloud servers; secrets are held in browser `localStorage` AES-256-GCM or locally in the Rust Argon2id + XChaCha20-Poly1305 daemon (`127.0.0.1:8787`).
3. **No Paid SaaS Tier**: Zoth Studio is free, local-first software. Third-party cloud LLM inference is Bring Your Own Key (BYOK).
4. **Cloudflare Tunnel Isolation**: The public domain `zoth.nullai.tech` exposes static assets only; operator deck ports (8484, 8787, 8989) are never exposed through inbound port forwards.

---

## ⚖️ Multi-Agent Arbitration Doctrine & Consensus Protocol

Zoth Studio utilizes an autonomous dialectic arbitration framework to resolve conflicts, validate syntax invariants, and achieve high-confidence synthesis across diverse AI models.

### 1. Triangulated Model Triad
The core arbitration loop triangulates three specialized agent personas:
- **Google Antigravity Agent**: Autonomous code generation, file tree mutation, subagent delegation, and task DAG execution.
- **xAI Grok Integration**: Real-time reasoning, adversarial critique, edge-case vulnerability detection, and speed-optimized refactoring.
- **Nous Hermes / Radical Minion**: Deterministic tool calling, function signature execution, and recursive playbook automation.
- **Draco Arbiter**: Neutral consensus synthesizer balancing model trade-offs into an execution plan.

### 2. Shannon Agreement Entropy ($H(p)$)
To quantify multi-agent consensus, the system computes Shannon agreement entropy across agent proposal vectors:
$$H(p) = -\sum_{i=1}^{n} p_i \log_2(p_i)$$
- **$H(p) < 0.20$ bits**: Strong Consensus — Auto-execute unified plan.
- **$0.20 \le H(p) \le 0.65$ bits**: Mild Divergence — Trigger Draco arbitration round with focused delta prompt.
- **$H(p) > 0.65$ bits**: High Conflict — Split into parallel isolated workspace branches for human review.

### 3. Python AST Verification Invariants
Before generated code is merged or executed:
- Abstract Syntax Tree (AST) parsing verifies syntax validity, import declarations, and structural invariants.
- Eliminates syntax regressions, hallucinated parameters, and missing symbol imports before subprocess launch.

---

## 🔒 Sovereign Zero-Trust Loopback Security Architecture

Zoth Studio enforces strict isolation between external networks and local execution environments:

| Service | Address | Protocol | Isolation Level | Purpose |
|---|---|---|---|---|
| **Operator Deck** | `127.0.0.1:8484` | HTTP / WebSocket | Localhost loopback only | Subprocess sandboxing, token streaming, shell execution |
| **Vault Daemon** | `127.0.0.1:8787` | HTTP / JSON-RPC | Localhost loopback only | High-performance Argon2id key derivation & XChaCha20 encryption |
| **Swarm Bus** | `127.0.0.1:8989` | WebSocket | Localhost loopback only | Multi-agent real-time telemetry and state broadcasting |
| **Ollama Engine** | `127.0.0.1:11434` | HTTP REST | Localhost loopback only | Offline on-device LLM inference (`smollm2`, `qwen2.5-coder`, `llama3`) |

### Cryptographic Vault Specifications
- **Key Derivation Function (KDF)**: Argon2id with memory cost $m = 65536\text{ KiB}$ (64 MB), time cost $t = 3$ iterations, parallelism $p = 4$ threads, and 128-bit CSPRNG salt.
- **Symmetric Cipher**: XChaCha20-Poly1305 authenticated encryption with 256-bit keys and extended 192-bit nonces (eliminating nonce reuse vulnerabilities).
- **Client Fallback**: Web Crypto API standard AES-256-GCM with PBKDF2 (100,000 iterations SHA-256) when running standalone without the native Rust daemon.

---

## 📦 Official Distribution Binaries & Installers (v2.6.0)

| Distribution File | Target OS & Arch | Size | Format | Execution / Install Command |
|---|---|---|---|---|
| [`zoth-linux-x86_64.run`](https://zoth.nullai.tech/dist-linux/zoth-linux-x86_64.run) | Linux (x86_64) | 122 MB | Self-extracting script | `chmod +x zoth-linux-x86_64.run && ./zoth-linux-x86_64.run` |
| [`Zoth_Studio-v2.6.0-x86_64.AppImage`](https://zoth.nullai.tech/dist-linux/Zoth_Studio-v2.6.0-x86_64.AppImage) | Linux (x86_64) | 77 MB | Standalone AppImage | `chmod +x Zoth_Studio-v2.6.0-x86_64.AppImage && ./Zoth_Studio-v2.6.0-x86_64.AppImage` |
| [`zoth-studio_2.6.0_all.deb`](https://zoth.nullai.tech/dist-linux/zoth-studio_2.6.0_all.deb) | Debian / Ubuntu / Parrot | 81 MB | Debian Package | `sudo dpkg -i zoth-studio_2.6.0_all.deb` |
| [`zoth-studio-v2.6.0-linux-x86_64.tar.gz`](https://zoth.nullai.tech/dist-linux/zoth-studio-v2.6.0-linux-x86_64.tar.gz) | Linux (POSIX) | 90 MB | Gzip Tarball Archive | `tar -xzf zoth-studio-v2.6.0-linux-x86_64.tar.gz` |
| [`zoth-windows-x86_64.exe`](https://zoth.nullai.tech/dist-windows/zoth-windows-x86_64.exe) | Windows 10/11 (x86_64) | 77 MB | Standalone Executable | `zoth-windows-x86_64.exe` |
| [`zoth-studio-v2.6.0-windows-x86_64.zip`](https://zoth.nullai.tech/dist-windows/zoth-studio-v2.6.0-windows-x86_64.zip) | Windows 10/11 (x86_64) | 88 MB | Zip Archive | Expand archive and run `zoth-studio.exe` |

> **Distribution note (verified 2026-09-14):** these `dist-*` paths are repo-local build
> outputs, not live downloads. `https://zoth.nullai.tech/dist-linux/` and every file beneath
> it currently return **HTTP 404**, so none of the links above resolve on the public host.

---

## 🗂️ 23 Zoth Studio Suite Entities

| # | Suite Entity Name | Canonical URL / Anchor | Identifier | Primary Capability |
|---|---|---|---|---|
| 01 | **Run Studio** | `/studio/` (`#agent-runner`) | `suite-run-studio` | Sandboxed multi-agent execution with custom persona injectors and streaming token logs on `127.0.0.1:8484`. |
| 02 | **WebGen Studio Studio** | `/studio/webgen.html` | `suite-site-generator` | Multi-agent website synthesizer, live split-screen viewport hydration, 6 themes, and multi-framework exporters (Astro, Vite React, Next.js). |
| 03 | **Netlify AX Architect** | `/studio/netlify-ax.html` | `suite-netlify-ax` | Sovereign Netlify AI alternative, build diagnostics ontology, security header scanner, and JSON config API. |
| 04 | **Consensus Arena v2** | `/studio/consensus.html` | `suite-consensus-arena` | Triangulated multi-model arbitration, Shannon agreement entropy meters, and AST validation. |
| 05 | **Fusion Swarm Arena** | `/studio/fusion-arena.html` | `suite-fusion-arena` | 3D WebGL multi-model debate chamber and adversarial prompt critique arena for real-time model synthesis. |
| 06 | **Pets Sanctuary** | `/pets/` | `suite-pets-sanctuary` | 3D Three.js holographic sanctuary housing liquid-neon companion pets with domain knowledge packs. |
| 07 | **Tool Registry** | `/registry/` | `suite-tool-registry` | Searchable glass wall indexing 298+ local developer tools across 14 categories. |
| 08 | **Parrot Arsenal** | `/studio/` (`#parrot-tools`) | `suite-parrot-arsenal` | Native integration with Parrot OS security, pentesting, OSINT, and cryptographic audit suites. |
| 09 | **Live Terminal & Peer Bus** | `/studio/bus-monitor.html` | `suite-live-terminal` | Bi-directional WebSocket terminal and bus monitor streaming subagent stdout/stderr logs in real time. |
| 10 | **Pour Rapid Site Engine** | `/studio/` (`#pour`) | `suite-pour` | 8-step guided website generator powered by local Ollama models and composable blueprint kits. |
| 11 | **AI Model Foundry** | `/studio/models.html` | `suite-model-foundry` | Model benchmarking, context window latency curves, and spirit matrix across top LLMs. |
| 12 | **Swarm Command & Arena** | `/studio/swarm.html` | `suite-swarm-arena` | 3D kinetic WebGL radar tracking multi-agent coordinates, active token streams, and telemetry beams. |
| 13 | **AX Powerhouse** | `/studio/ax-powerhouse.html` | `suite-ax-powerhouse` | 8-pillar acceleration suite (Web Audio synths, zero-key mocks, AEO schemas, CI/CD pipelines). |
| 14 | **Connectors & API Deck** | `/studio/connectors.html` | `suite-connectors` | Universal integration hub with plug-and-play SDK adapters for Stripe, Solana, EVM, Bitwarden, Netlify, and GitHub. |
| 15 | **Nexus 3D Omniverse** | `/studio/nexus-3d.html` | `suite-nexus-3d` | Three.js procedural geometry studio with wireframe shading, holographic materials, and PNG capture. |
| 16 | **OmniPost 3.5 Studio** | `/studio/omnipost.html` | `suite-omnipost` | Multi-channel viral media repurposer, soundtrack synthesis and 60 FPS shorts studio powered by Hermes prompt polish. |
| 17 | **Vision Link HUD** | `/studio/vision-link.html` | `suite-vision-link` | Touchless hands-free computer vision interface using MediaPipe gesture tracking and screen capture inspection. |
| 18 | **SubSweep Recon** | `/studio/subsweep.html` | `suite-subsweep` | OSINT attack surface scanner, DNS enumerator, and SSL certificate inspector. |
| 19 | **Edge Forge** | `/studio/edge-forge.html` | `suite-edge-forge` | V8 isolate serverless edge worker generator with sub-millisecond execution. |
| 20 | **AI Math Pillars Observability** | `/studio/math-pillars.html` | `suite-math-pillars` | Live linear algebra attention tensors $QK^T/\sqrt{d_k}$, multivariable calculus AdamW optimization curves, and token entropy gauges. |
| 21 | **Visual Node DAG Composer** | `/studio/agent-composer.html` | `suite-agent-composer` | Node-based visual DAG editor for composing, simulating, and validating multi-agent workflows. |
| 22 | **Chronicle Roadmap** | `/studio/chronicle.html` | `suite-chronicle` | Shipped engineering milestones, git commit timeline, and 4-phase architectural roadmap. |
| 23 | **Signal Swarm Bridge** | `/signal/` | `suite-signal-bridge` | Mobile phone command deck with voice SSE streaming and real-time remote swarm orchestration. |

---

## ⚡ 21 Sovereign Agents Pantheon (Ontology & Profiles)

Each agent node is an autonomous archetype configured with domain knowledge packs (`SYSTEM.md`, `PLAYBOOK.md`, `CANON.md`):

1. **Master Azoth** (`/agents/azoth.html`): The Sovereign Alchemist & Prime Architect — Master orchestrator synthesizing hermetic alchemy, cosmic sacred geometry, and multi-agent consensus protocols.
2. **Athena** (`/agents/athena.html`): AEO Knowledge Architect & Semantic Structure — Architects Schema.org JSON-LD graphs, entity ontologies, and rich semantic blueprints optimized for Answer Engines and LLM reasoning.
3. **Antigravity** (`/agents/antigravity.html`): Lead Autonomous AI Architect & Quantum Synthesis — Multi-turn code generation, file tree mutation, subagent delegation, and task DAG execution.
4. **Draco** (`/agents/draco.html`): Multi-Model Consensus & Fusion Arbiter — 3-agent arbitration, trade-off resolution, and synthesized execution plans.
5. **Grok** (`/agents/grok.html`): Cosmic Reasoner, Mathematical Astrolabe & AST Arbiter — High-velocity reasoning, live code critique, and adversarial debate.
6. **Hermes** (`/agents/hermes.html`): Winged Tool Calling Executor & Release Hardener — Autonomous function calling, tool execution, and CI/CD pipelines.
7. **Kai** (`/agents/kai.html`): Workspace Inspector & Static Analysis — Validates system topology, code cleanliness, boundary checks, and ensures zero broken invariants before shipping.
8. **Ignis** (`/agents/ignis.html`): Refactor Engine & Pipeline Finisher — Algorithmic tuning, dead code elimination, AST refactoring, and CSS/JS payload minimization.
9. **Lycan** (`/agents/lycan.html`): OWASP Sentinel & Security Hardening — Audits application code against OWASP Top 10 vulnerabilities, validates loopback isolation, and inspects token leaks.
10. **Kitsune** (`/agents/kitsune.html`): Taste, Fluid Micro-interactions & Accessibility (AX) — Curates visual aesthetics, micro-interactions, responsive typography, color harmonies, and accessible WCAG 2.1 contrast standards.
11. **Pixel-Neko** (`/agents/pixel-neko.html`): Tool Bench Librarian & Connector Bridge — Maintains and indexes the 298+ tool manifests, categorization tags, and command definitions across local developer drives.
12. **Pixel-Shiba** (`/agents/pixel-shiba.html`): Argon2id Hardware Key Vault Guardian — Guards client-side secrets, manages Argon2id key derivation, and verifies XChaCha20-Poly1305 encryption envelopes.
13. **Radical Minion** (`/agents/radical-minion.html`): Fast-Loop Subagent Runner & Playbook Partner — Executes complex tool calling scripts, recursive terminal jobs, and autonomous playbook workflows with zero human latency.
14. **Aquila** (`/agents/aquila.html`): Global Edge Dispatcher & Low-Latency Mesh — Directs serverless V8 edge workers, Cloudflare KV synchronization, and CDN geo-routing matrices.
15. **Leviathan** (`/agents/leviathan.html`): Deep Tensor & Vector Memory Recall — Indexes multidimensional vector embeddings, chunked document stores, and semantic memory recall indices.
16. **Onyx** (`/agents/onyx.html`): Red-Team Exploit Predator & Threat Auditor — Probes system boundaries for injection vectors, sandbox escapes, and adversarial model prompts.
17. **Chronos** (`/agents/chronos.html`): Temporal DAG Sequencer & Git Navigator — Analyzes complex acyclic graph dependencies, schedules critical paths, and coordinates sequential task handoffs.
18. **Aether** (`/agents/aether.html`): Swarm Overlord & Peer Bus Synchronizer — Manages high-throughput WebSocket peer bus streams, agent state broadcasts, and event-driven triggers on loopback 8989.
19. **Kraken** (`/agents/kraken.html`): Physical ESP32 Serial Bridge & Deep Packet Sniffer — Monitors raw TCP/UDP loopback traffic, inspects WebSocket frames, and detects unauthorized socket listeners.
20. **Scorpius** (`/agents/scorpius.html`): Zero-Day Penetration Tester & Gatekeeper — Performs automated fuzzing on API endpoints, evaluates cryptographic boundaries, and validates invariant checks.
21. **GhostByte** (`/agents/ghostbyte.html`): Zero-Knowledge Cryptographic Vault Sentinel — Zero-leak memory wipes, Argon2id derivation, and loopback defense.

---

## 🛠️ Tool Registry Taxonomy (14 Categories, 298 Tools)

The tool registry indexed in `/registry/tools.json` organizes 298 verified developer utilities across 14 functional categories:
1. **01 Offensive & Defensive Security** (OSINT, port scanners, fuzzers, sandbox checkers)
2. **02 Cloud & Infrastructure** (Netlify deployers, edge workers, Docker, terraform generators)
3. **03 Multi-Agent & Orchestration** (Task DAGs, bus listeners, token stream monitors)
4. **04 Web & UI Components** (Bento sections, modals, tooltips, accordions, audio players)
5. **05 Crypto, Web3 & FinTech** (Solana, EVM, Stripe Checkout, wallet connectors)
6. **06 Learning & Courses** (Interactive tutorials, code katas, algorithmic visualizers)
7. **07 Machine Learning & Tensors** (Attention heads, AdamW calculus, entropy gauges)
8. **08 Audio, SFX & Media** (Web Audio synths, 60fps shorts generators, video recorders)
9. **09 Utilities & Sanitizers** (AST sanitizers, XSS filters, CSP checkers, regex tools)
10. **10 Performance & Auditing** (Lighthouse audits, header inspectors, cache analyzers)
11. **11 Visual & 3D WebGL** (Three.js parametric viewports, wireframes, particle systems)
12. **12 Identity & Vault** (Argon2id derivation, AES-GCM envelopes, Bitwarden bridges)
13. **13 Internationalization & I18n** (Dynamic language switchers, locale dictionary loaders)
14. **14 Mobile & Telemetry** (PWA service workers, live telemetry pings, viewport adapters)
