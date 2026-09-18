# The Cockpit: Multi-Agent Swarm Orchestration & Generator Architecture

## 1. Overview & Vision
**The Cockpit** (`/studio/cockpit.html`) is the unified command center for Zoth Studio. It bridges local-first sovereign LLM instances, autonomous tool harnesses, and procedural asset generators across **21 specialized agents** organized into **7 Lead AGY Squads**.

This exact same hierarchical logic and sequential execution flow is designed to power the **Universal Website & Application Generator** (`/studio/webgen.html` and `public/tools/site-swarm-orchestrator.js`).

---

## 2. The 21-Agent Swarm Hierarchy (7 AGY Squads)

The swarm is structured into 7 Domain Squads, each led by a Lead AGY and supported by 2 specialized subagents:

```
                  ┌───────────────────────────────┐
                  │    Master Azoth (Arbiter)     │
                  │  Supreme Alchemical Synthesis │
                  └──────────────┬────────────────┘
                                 │
  ┌──────────────┬───────────────┼───────────────┬──────────────┬──────────────┬──────────────┐
  ▼              ▼               ▼               ▼              ▼              ▼              ▼
Squad 1        Squad 2         Squad 3         Squad 4        Squad 5        Squad 6        Squad 7
@antigravity   @grok           @hermes         @ghostbyte     @draco         @kitsune       @onyx
Code & AST     Math & Truth    Tool Harness    Argon2id Vault Consensus Mesh Visual & 3D    Low-Level OS
├─ @kai        ├─ @athena      ├─ @radical-min ├─ @lycan      ├─ @kraken     ├─ @pixel-neko ├─ @aquila
└─ @ignis      └─ @chronos     └─ @pixel-shiba └─ @scorpius   └─ @leviathan  └─ @aether     └─ @azoth
```

### Squad Roster & Responsibilities

| Squad | Lead AGY | Subagents | Domain & Specialization |
|---|---|---|---|
| **1. Code & AST** | **`@antigravity`** | `@kai`, `@ignis` | Full-stack architecture, AST invariant validation, O(1) loop optimization. |
| **2. Math & Truth** | **`@grok`** | `@athena`, `@chronos` | First-principles logic, JSON-LD schema entity graphs, Git temporal checkpoints. |
| **3. Tool Harness** | **`@hermes`** | `@radical-minion`, `@pixel-shiba` | Local shell execution, crontabs, multi-platform thread formatting (X/Discord/Telegram). |
| **4. Vault & Crypto** | **`@ghostbyte`** | `@lycan`, `@scorpius` | Argon2id memory enclaves, loopback firewall checks, penetration fuzzing. |
| **5. Consensus** | **`@draco`** | `@kraken`, `@leviathan` | Multi-model token merge, vector memory persistence (<3ms), concurrency locks. |
| **6. Visual & 3D** | **`@kitsune`** | `@pixel-neko`, `@aether` | Pollinations.ai Neural Flux images, 60fps WebGL shaders, chiptune/ambient SFX. |
| **7. Systems Core** | **`@onyx`** | `@aquila`, `@master-azoth` | Zero-latency stdout pipes, hardware telemetry, final Grand Synthesis. |

---

## 3. Swarm Strength Modes

The user controls the swarm power via the Cockpit HUD:
1. **Solo (3 Agents)**: Targeted squad execution based on intent (e.g. Visual Squad for images, Tool Squad for crons).
2. **Strike Team (9 Agents)**: 3 coordinated squads working in tandem (Generator + Architect + Tool runner).
3. **Full Swarm (21 Agents)**: All 7 squads collaborate, run invariants, and pass consensus to Master Azoth.

---

## 4. Sequential Artifact-First Execution Pipeline

Unlike naive single-turn models that talk in vague hypothetical plans, The Cockpit and Site Generator follow a **Sequential Artifact-First Pipeline**:

```
[User Prompt] ──▶ 1. Generator Agent (@kitsune / @antigravity)
                      └─ Produces concrete artifact (Image, Code, Schema, AST)
                  ──▶ 2. Structural & Quality Analyzer (@kai / @ignis)
                      └─ Validates GPU budget, AST safety, CSS contrast
                  ──▶ 3. Tool & Persistence Dispatcher (@hermes)
                      └─ Saves file to disk, configures routes, generates zip/export
                  ──▶ 4. Grand Alchemical Synthesis (@azoth)
                      └─ Unified deliverable summary with direct actionable links
```

### Context Passing to Downstream Agents
When an artifact is generated (e.g. a 1024x1024 Flux render or a React hero component), its metadata and parameters are injected into the downstream agents' context windows:
- `@antigravity` analyzes lighting, volumetric balance, and how to embed it into a `<canvas>` or CSS container.
- `@hermes` runs `curl` or filesystem scripts to cache the image locally in `public/assets/images/`.
- `Master Azoth` reviews the verified artifact and delivers actionable links (`/studio/nexus-3d.html` or direct download).

---

## 5. Integration into the Universal WebGen Studio

To align `webgen.html` and `site-swarm-orchestrator.js` with The Cockpit:

1. **Shared Route Ingestion**:
   - `webgen.html` dispatches generation requests to `/api/zoth/swarm` on port `8484`.
2. **Dynamic Archetype Synthesis**:
   - Instead of static mockups, `@kitsune` generates real custom logo/hero assets via Pollinations Flux for the selected domain (e.g. roofing, restaurant, web3 app).
3. **AST Validation & Export**:
   - `@antigravity` verifies the generated HTML/CSS/JS files for WCAG 2.1 compliance and zero external CDN dependencies.
   - `@hermes` bundles the site into a 1-click Netlify / ZIP export.

---

## 6. Endpoints & Telemetry Reference

- **Static Frontend**: `http://127.0.0.1:8088/studio/cockpit.html`
- **Orchestrator Backend**: `http://127.0.0.1:8484/api/zoth/swarm`
- **Local LLM Engine**: `http://127.0.0.1:11434/api/chat` (`zoth-ai-micro:latest`, `dolphin-llama3:8b`, `qwen2.5-coder:1.5b`)
- **Neural Image Synthesizer**: `https://image.pollinations.ai/prompt/{encoded_prompt}?width=1024&height=1024&nologo=true&seed={safe_seed}&model=flux`
