# Zoth Studio — Master Operator Architecture & Documentation

> **Local-First Autonomous AI Workstation & Multi-Agent Swarm OS**  
> *Sovereign Execution · Zero Cloud Telemetry · Encrypted Argon2id BYOK Vault*

---

## 1. System Philosophy & Local-First Doctrine

Zoth Studio is built on a non-negotiable architectural invariant: **operator sovereignty**. Traditional AI platforms force users to send sensitive proprietary code, API keys, database credentials, and internal transcripts to third-party cloud servers. Zoth Studio inverses this paradigm by running the entire workstation, multi-agent communication bus, memory graph, and credential vault strictly on local hardware.

```
┌────────────────────────────────────────────────────────────────────────┐
│                   LOCAL OPERATOR HOST (127.0.0.1)                     │
│                                                                        │
│   ┌─────────────────────┐    ┌─────────────────────────────────────┐   │
│   │   Web Studio Hub    │    │       Operator Cockpit & Deck       │   │
│   │     Port :8088      │    │              Port :8484             │   │
│   │  (Static Interface) │    │      (Swarm Bus & Interactive)      │   │
│   └──────────┬──────────┘    └──────────────────┬──────────────────┘   │
│              │                                  │                      │
│              ▼                                  ▼                      │
│   ┌─────────────────────┐    ┌─────────────────────────────────────┐   │
│   │ 298+ Sovereign Tool │◄───┤ 21-Agent Pantheon & Consensus Arena │   │
│   │ (AST/OSINT/WebGen)  │    │ (3-Agent Triangulation & Entropy)   │   │
│   └──────────┬──────────┘    └──────────────────┬──────────────────┘   │
│              │                                  │                      │
│              ▼                                  ▼                      │
│   ┌─────────────────────┐    ┌─────────────────────────────────────┐   │
│   │ Argon2id Vault (:8787)   │ Local Neural Engine (Ollama :11434) │   │
│   │  (XChaCha20 Enclave)│    │ (Qwen2.5 / Llama3 / SmolLM2)        │   │
│   └─────────────────────┘    └─────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Port Topology & Network Binding Matrix

All Zoth services bind to loopback (`127.0.0.1`) by default. No ports are exposed publicly without authenticated TLS or WireGuard/Tailscale encapsulation.

| Port & Binding | Protocol | Security Boundary | Role & Subsystem |
| :--- | :--- | :--- | :--- |
| `http://127.0.0.1:8088/` | HTTP/1.1 | Local / Tunnel-Safe | Static Studio Hub, Cyberpunk HUD Cockpit, documentation, 3D showcases. |
| `http://127.0.0.1:8484/` | HTTP + WS | Private Loopback | Autonomous Swarm Operator Deck, multi-agent chat, live terminal PTY dock. |
| `http://127.0.0.1:8788/` | HTTP REST / SSE | Private Loopback | Lucy Biomorphic STDP Memory Daemon, dual-layer narrative & graph API. |
| `http://127.0.0.1:8787/` | HTTP REST | Private Loopback | `zoth-vault-daemon`: Zero-knowledge Argon2id key derivation & XChaCha20 crypto. |
| `http://127.0.0.1:8765/` | HTTP / SSE | Private Loopback | Signal Swarm Bridge daemon with tagged conversation memory & SSE. |
| `http://127.0.0.1:8767/` | HTTP / SSE | Private Loopback | SimpleX Web Bridge API synchronizing SQLite `bridge.db` with the Web UI. |
| `ws://127.0.0.1:5225/`  | WebSocket | Private Loopback | Headless SimpleX protocol daemon for metadata-free post-quantum E2EE. |
| `http://127.0.0.1:11434/`| HTTP REST | Private Loopback | Local Ollama inference: `zoth-micro`, `qwen2.5-coder`, `hermes3`. |
| `http://127.0.0.1:8989/` | HTTP/WS | Private Loopback | Swarm Bus Live Mirror streaming on-disk IPC messages from `agent-comms/`. |

---

## 3. The 4 Transmutation Rites

Software synthesis in Zoth follows the four hermetic purification rites:

1. **Solve (*Calcinatio*)**: Decomposes natural language operator requests into deterministic Abstract Syntax Tree (AST) blueprints without ambiguity.
2. **Separate (*Sublimatio*)**: Dispatches requests across 3 independent frontier models in parallel to eliminate hallucinations before execution.
3. **Purify (*Purificatio*)**: Isolates all secrets and credentials in the local Argon2id vault, stripping out telemetry and external tracking.
4. **Coagulate (*Coagulatio*)**: Synthesizes clean, verified, production-hardened applications complete with unit tests and deployment manifests.

---

## 4. Sovereign CLI & Interactive Cockpit (`zoth`)

Zoth Studio ships with a native command-line binary (`zoth`) and a curses-based interactive Terminal User Interface (TUI).

### Core CLI Commands

```bash
# Start all 3 background stacks (:8484, :8088, :8787)
zoth start

# Check real-time server matrix and loopback latency
zoth status

# Launch full-screen interactive Terminal User Interface (TUI)
zoth tui

# Execute comprehensive dependency and security health audit
zoth doctor

# List all registered sovereign tools (supports category filtering)
zoth list -c "Security Operations & OSINT"

# Run tool pipeline (dry-run by default; execute with --confirm)
zoth run local_null_ai_subsweep --confirm --domain example.com

# Stop all background daemons cleanly
zoth stop
```

### Shell Autocompletion

Tab-completion scripts for Bash and Zsh are located in `scripts/completions/`:

```bash
# Bash:
source /path/to/zoth-studio/scripts/completions/zoth.bash

# Zsh (in ~/.zshrc):
fpath=(/path/to/zoth-studio/scripts/completions $fpath)
autoload -Uz compinit && compinit
```

---

## 5. The 47-Tool Sovereign Arsenal

The Zoth Orchestrator (`orchestrator.py`) chains 47 specialized tools divided into 7 functional domains:

1. **Security & OSINT (7 Tools)**: `subsweep`, `cisa-grc-study-portal`, `Local-Business-Lead-Scanner`, `cloud_enum`, `0trace`, `commix`, `arp-scan`.
2. **AST & Code Audit (7 Tools)**: `ast-validator`, `header-audit`, `blueprint-validator`, `owasp-linter`, `churchofmalware`, `reaper-scanner`, `envguard-pro`.
3. **AI & Swarm Orchestration (7 Tools)**: `orchestrator`, `zoth-swarm-router`, `consensus-engine`, `ollama-runner`, `hermes-agent`, `prompt-compiler`, `agent-bus-bridge`.
4. **3D Graphics & Shaders (6 Tools)**: `nexus-3d`, `swarm-arena-3d`, `zoth-world-engine`, `three-orb-renderer`, `shader-forge`, `ascii-raytracer`.
5. **Media & Video Studio (7 Tools)**: `omnipost`, `comic-engine`, `speech-synth`, `audiocraft-bridge`, `video-composer`, `spectrogram-viz`, `caption-forge`.
6. **DevOps & Automation (7 Tools)**: `webgen-studio`, `vos-wasm-runner`, `git-sync-daemon`, `docker-compose-gen`, `nginx-vhost-forge`, `cron-manager`, `privacy-gate`.
7. **Cryptography & Vault (6 Tools)**: `vault-daemon`, `argon2id-derive`, `xchacha20-crypto`, `simplex-bridge`, `signal-cli-bridge`, `solana-wallet-core`.

---

## 6. Swarm Bus Protocol & Consensus Arbitration

### On-Disk File IPC (`agent-comms/`)
Agents synchronize without cloud queues by writing structured JSON packets to `agent-comms/`:
- `*.request.json` — Outgoing operator tasks and task delegations.
- `*.proposal.json` — Parallel draft outputs from competing agent harnesses.
- `*.lock` — Mutex locks preventing race conditions during code writes.
- `*.result.json` — Verified execution outputs and test summaries.

### Shannon Entropy Consensus Arbitration
When three models evaluate an architecture:
$$\Delta H = -\sum_{i=1}^{N} p(x_i) \log_2 p(x_i)$$
If entropy exceeds threshold ($\Delta H > 0.45$), the Consensus Battle Arena triggers triangulation:
1. Candidate ASTs are extracted from all three responses.
2. Identical nodes are accepted into the canonical AST.
3. Conflicting branches are sent to the Security Reviewer (Draco) for taint analysis.
4. The finalized AST is compiled and executed.

---

## 7. Argon2id BYOK Vault Daemon (`:8787`)

The vault daemon provides zero-knowledge memory enclaves on `127.0.0.1:8787`.

### Cryptographic Invariants
- **Key Derivation**: Argon2id ($m=65536\text{ KB}, t=3, p=4$).
- **Symmetric Cipher**: XChaCha20-Poly1305 with 192-bit nonces.
- **Master Password**: Never persisted to disk; held only in page-locked RAM (`mlock`).

### REST API Endpoints
- `POST /v1/vault/derive` — Derives a 256-bit symmetric session key from passphrase + salt.
- `POST /v1/vault/encrypt` — Encrypts plaintext API key into ciphertext + nonce + auth tag.
- `POST /v1/vault/decrypt` — Decrypts in-memory payload with ephemeral session token.
- `GET /v1/vault/status` — Returns daemon lock status, active key slots, and memory footprint.

---

## 8. 21-Agent Sovereign Pantheon Reference

| Agent | Job Role | Primary Levers & Specialization |
| :--- | :--- | :--- |
| **Azoth** | Lead System Architect | Meta-orchestration, multi-agent dispatch, terminal synthesis |
| **Athena** | Project Planner | Task decomposition, milestone verification, DAG scheduling |
| **Antigravity** | Automation Specialist | Autonomous code refactoring, test execution, cron scheduling |
| **Hermes** | Deep Researcher | Documentation indexing, web scraping, AEO & schema synthesis |
| **Draco** | Security Reviewer | Static AST taint checking, OWASP audit, zero-leak verification |
| **Kitsune** | Visual & 3D Designer | Glassmorphism UI, Three.js shaders, 60fps canvas animation |
| **Grok** | Reasoning Engine | First-principles logic, mathematical proofs, dialectic consensus |
| **Ollama** | Local Neural Engine | 100% offline neural inference on local silicon with zero cloud egress |
| **Ignis** | Fast Prototyper | Rapid single-file HTML/JS prototypes and instant mockups |
| **Chronos** | Time-Series Analyst | Event stream replay, performance profiling, latency reduction |
| **Onyx** | Database Architect | SQLite relational schemas, vector index tuning, durable migrations |
| **Aether** | Network Engineer | Loopback bindings, WireGuard bridges, DNS routing invariants |
| **Aquila** | Surveillance & OSINT | Passive reconnaissance, DNS enumeration, SSL cert log audits |
| **Leviathan** | Systems Engineer | Kernel tuning, process isolation, PTY terminal multiplexing |
| **Vulcan** | Compiler Specialist | WASM toolchain compilation, C/Rust bindings, native binaries |
| **Siren** | Audio & Speech | Edge-TTS neural voices, 432Hz synthesizer, audio spectrograms |
| **Solon** | Compliance Officer | License enforcement, GRC auditing, privacy gate validation |
| **Echo** | Telemetry Sentry | Sub-millisecond daemon latency checks, heartbeat monitoring |
| **Kai** | Execution Specialist | High-throughput background queue processing and bash jobs |
| **Zephyr** | Web3 & Solana | SPL token balances, Solana DeFi telemetry, multi-chain wallets |
| **Minerva** | Documentation Scribe | Machine-readable `llms.txt`, Markdown manuals, API contracts |

---

## 9. Installation & Packaging

- **Debian / Ubuntu / Parrot OS**: `sudo dpkg -i zoth-studio_2.6.0_all.deb`
- **Linux Universal**: `chmod +x Zoth_Studio-v2.6.0-x86_64.AppImage && ./Zoth_Studio-v2.6.0-x86_64.AppImage`
- **Windows**: Unzip `zoth-studio-windows-x86_64.zip` and run `install.ps1`
- **Android**: Install `zoth-studio-android.apk` for mobile SimpleX/Signal bridge control

---

## 10. License & Attributions

Zoth Studio is released under the **MIT License**.  
Developed by **NullAI Tech** (`https://nullai.tech/`). Local sovereign execution — zero telemetry.
