# 🕊️ Hermes Agent & Autonomous Subagent Engine (v0.21.2)
### *Nous Research Hermes Agent Integration, Sovereign Profiles & HUD REPL Execution*

> [!IMPORTANT]
> **Zero Telemetry & Strict Sovereignty**: Zoth Studio couples its multi-agent intelligence layer directly to the **Nous Research Hermes Agent (v0.21.2)** framework. All execution, tool-calling, and synaptic memory indexing run on local loopback with zero telemetry egress.

---

## ⚡ 1. Overview & Architecture

**Hermes Agent** is an open-source autonomous agent framework by Nous Research that runs natively in your terminal, IDEs, and messaging gateways. Within **Zoth Studio**, Hermes acts as the herald and execution engine, powering autonomous subagent swarms, tool dispatching, and bi-directional workstation coordination.

```mermaid
flowchart TD
    subgraph UI_LAYER["🎮 Cyberpunk HUD Cockpit (:8088)"]
        A["TTY-0 Terminal REPL"] -->|"hermes <prompt>"| B["Zoth Bridge Adapter"]
        C["Active Agents Deck"] -->|"Attune HERMES"| D["Hermes Herald Persona"]
        E["Quick Chips [🕊 Hermes Status]"] -->|"1-Click Telemetry"| A
    end

    subgraph ENGINE["🕊️ Hermes Agent Engine v0.21.2"]
        B --> F["azoth-prime Profile (Gemini 3.7 Flash)"]
        F --> G["25 Toolsets (file, terminal, browser, delegation, kanban)"]
        F --> H["270+ Loaded Skills (dev, media, research, web)"]
    end

    subgraph MEMORY_BUS["🧠 Sovereign Memory & Local Loopback"]
        F <--> I["Biomorphic STDP Memory Daemon (:8788)"]
        F <--> J["Sovereign IPC Daemon (:8484)"]
        F <--> K["Hermes State DB (state.db / SQLite WAL)"]
    end

    style UI_LAYER fill:#050811,stroke:#00f0ff,stroke-width:2px,color:#fff
    style ENGINE fill:#090703,stroke:#fbbf24,stroke-width:2px,color:#fff
    style MEMORY_BUS fill:#000b04,stroke:#00ff66,stroke-width:2px,color:#fff
```

---

## 🏛️ 2. Core Capabilities & Profile Specification

| Feature | Specification Details |
|:---|:---|
| **Framework Engine** | **Hermes Agent v0.21.2** (Nous Research) |
| **Active Profile** | `azoth-prime` (`~/.hermes/profiles/azoth-prime/`) |
| **Backing Model** | `gemini-3.7-flash` (via Nous Research / Google AI) |
| **Loaded Skills** | **270+ Procedural Skills** (`.agents/skills/` and `~/.hermes/skills/`) |
| **Active Toolsets** | **25 Toolsets**: `file`, `terminal`, `browser`, `code_execution`, `delegation`, `memory`, `kanban`, `vision`, `tts` |
| **Memory Engine** | Canonical SQLite + FTS5 (`~/.hermes/state.db`) + Zoth Memory Daemon (`http://127.0.0.1:8788`) |
| **CLI Execution** | `/home/neo/.local/bin/hermes` |
| **Security Mode** | Automated secret redaction, non-destructive sandboxing, strict POSIX execution |

---

## ⌨️ 3. Cyberpunk HUD Terminal Commands

The HUD TTY-0 Terminal REPL provides dedicated commands for inspecting and driving Hermes:

```bash
# Display Hermes engine diagnostics, profile info, and loaded skills
hermes status

# Run doctor self-check on tools and environment
hermes doctor

# Dispatch an autonomous subagent task
hermes build a real-time WebCodecs video pipeline for OmniPost

# Trigger memory sync with the Zoth daemon
hermes memory sync
```

### Auto-Completion & Command Chips
- **Tab Auto-Completion**: Typing `her` and pressing `Tab` autocompletes to `hermes`.
- **Quick Chip**: Clicking `[🕊 Hermes Status]` directly above the prompt executes an instant health probe.

---

## 🐾 4. Subagent Delegation Workflow

When executing complex multi-file engineering tasks, Hermes uses `delegate_task` to spawn isolated background subagents:

```mermaid
sequenceDiagram
    autonumber
    participant Op as 🎮 Operator / HUD
    participant H as 🕊️ Hermes (azoth-prime)
    participant Sub1 as 🤖 Subagent: 3D CAD Specialist
    participant Sub2 as 🎬 Subagent: OmniPost Engine
    participant Mem as 🧠 Memory Daemon (:8788)

    Op->>H: hermes build multi-angle CAD preview for OmniPost
    H->>Mem: Recall previous shader & WebCodecs context
    Mem-->>H: Return synaptic weights & node telemetry
    par Parallel Subagents
        H->>Sub1: Build Three.js CAD Gizmo in 3d-editor.html
        H->>Sub2: Wire WebCodecs 60 FPS exporter in omnipost.html
    end
    Sub1-->>H: Return diff & pass verification tests
    Sub2-->>H: Return export draft logic & event listeners
    H->>Mem: Consolidate new memories & update Hopfield energy
    H-->>Op: ✔ Multi-Angle CAD preview & 60 FPS pipeline deployed!
```

---

## 🛡️ 5. Integration Verification

You can verify Hermes Agent integration locally at any time:

```bash
# 1. Check Hermes version & profile
hermes --version
hermes profile list

# 2. Run test query
hermes -p azoth-prime chat -q "Status report for Zoth Studio"

# 3. Run full HUD & Hermes unit test suite (17/17 passing)
node core-app/public/assets/zoth-cyberpunk-hud.test.js
```
