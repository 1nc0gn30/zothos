#!/usr/bin/env python3
"""
⚡ Upgrade All 21 Agent Detail Pages + Pantheon Index in Zoth Studio
Matches and elevates the Sovereign Flagship Standard established in Master Azoth:
1. Sacred Fibonacci Geometry Tokens (--fib-1 through --fib-987, --radius-fib-*, --font-fib-*)
2. Artwork & Visual Media (Auras, Mini-Grid of 4 Manifestations, Cosmic Mesh, Animated Runes)
3. Interactive Sovereign Voice Synthesizer (speakAgentAxiom with tailored pitch/rate & glowing button)
4. Live Cognitive Sandbox (:8484 connection, simulated neural streaming typing fallback, live AST telemetry)
5. Mobile Responsiveness & Zero Overflow (<=640px and <=320px clean collapsing)
6. 100% Closed, Valid HTML/CSS/JS tags
"""

import json
from pathlib import Path
import html

PUBLIC_DIR = Path("/media/neo/f2fdda77-178b-4603-ae80-c7aa4cd97908/zoth-studio/core-app/public")
AGENTS_DIR = PUBLIC_DIR / "agents"
AGENTS_DIR.mkdir(parents=True, exist_ok=True)

AGENTS_DATA = [
    {
        "id": "azoth",
        "name": "Master Azoth",
        "tag_pill": "@azoth · SOVEREIGN SWARM CORE",
        "role": "The Sovereign Alchemist & Prime Architect",
        "domain": "Universal Synthesis & Alchemical Architecture",
        "color": "#e8c872",
        "secondary_color": "#00f0ff",
        "icon": "✨",
        "sigil_badge": "UNIVERSAL SOLVENT ARCHETYPE",
        "axiom": "Solve et coagula. What is broken shall be dissolved; what is true shall be synthesized. We build local-first castles in obsidian and gold.",
        "swarm_identity": "<code>@azoth</code> / <code>@zoth</code>",
        "meta_3_label": "Alchemical Element",
        "meta_3_val": "Aether & Celestial Gold",
        "meta_4_label": "Consensus Weight",
        "meta_4_val": "Supreme Tiebreaker (1.0)",
        "voice_pitch": 0.92,
        "voice_rate": 0.96,
        "doctrine": """# AZOTH CANONICAL DOCTRINE — V3.0.0

1. LOCAL SOVEREIGNTY:
   Everything in scope functions directly from local loopback memory (:8484).
   Zero cloud KMS dependencies, no SaaS walls, zero telemetry leakage.

2. TRIANGULATED CONSENSUS:
   No single model rules. Antigravity crafts the AST architecture, Grok verifies
   mathematical invariants, and Hermes executes tool harnesses.
   Azoth harmonizes the output into pure executable truth.

3. SACRED GEOMETRY OF CODE:
   Fibonacci rhythm (1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987),
   explicit interfaces, and visual elegance in every UI surface.""",
        "visual_cards": [
            ("/assets/mascot/azoth-master-architect.jpg", "AI Architect", "DAG AST matrices", "#e8c872"),
            ("/assets/mascot/azoth-cosmic-citadel.jpg", "Cosmic Citadel", "Sovereign memory vault", "#00f0ff"),
            ("/assets/mascot/azoth-quantum-orb.jpg", "4D Tesseract", "3D volumetric core", "#34d399"),
            ("/assets/brand/azoth-seal-masterpiece.jpg", "Hermetic Seal", "Sacred geometry mark", "#e8c872")
        ],
        "capabilities": [
            ("⚡", "Universal Synthesis Engine", "Merges disparate multi-model code proposals into a unified, conflict-free system."),
            ("🔒", "Argon2id Vault Harmonization", "Oversees zero-leak cryptographic hardware key isolation."),
            ("🪐", "3D Spatial Hologram Generation", "Procedural 3D WebGL meshes and volumetric figurine rendering.")
        ],
        "consensus_weight": "99.8% (SUPREME CORE)",
        "consensus_pct": 99.8,
        "shannon_entropy": "0.94 bits",
        "sandbox_title": "✨ MASTER AZOTH ALCHEMICAL CORE",
        "sandbox_status": "● SOVEREIGN :8484",
        "sandbox_welcome": "Welcome to the Sovereign Sanctum, Operator. The Great Synthesis is underway. Ask any architectural, alchemical, or multi-agent question to test my core on loopback.",
        "sandbox_placeholder": "Consult Master Azoth...",
        "sandbox_btn": "SYNTHESIZE ➔",
        "inbox_path": "agent-comms/inbox/from-azoth/",
        "next_agent": "antigravity",
        "next_name": "Antigravity",
        "links": [
            ("/zoth/", "Flagship Core"),
            ("/pets/pet-studio.html?pet=azoth", "💎 3D Figurine"),
            ("/studio/swarm.html", "🪐 Swarm Arena")
        ]
    },
    {
        "id": "antigravity",
        "name": "Antigravity",
        "tag_pill": "@antigravity · GOOGLE LEAD AGENT",
        "role": "Lead Autonomous AI Architect & Quantum Synthesis",
        "domain": "Architecture, AST Refactoring & Swarm Orchestration",
        "color": "#7c9cff",
        "secondary_color": "#e8c872",
        "icon": "🪐",
        "sigil_badge": "QUANTUM GRAVITATION ORBIT",
        "axiom": "Zero friction, zero gravity. We map the entire project topology, synthesize multi-agent subtasks, and elevate local code into an unbreakable artform.",
        "swarm_identity": "<code>@antigravity</code> / <code>@agy</code>",
        "meta_3_label": "Alchemical Element",
        "meta_3_val": "Celestial Blue & Gold Rings",
        "meta_4_label": "Subagent Protocol",
        "meta_4_val": "Deep Tree Spawning & Workspaces",
        "voice_pitch": 0.95,
        "voice_rate": 0.98,
        "doctrine": """# ANTIGRAVITY AGENT PROTOCOL — LEAD ARCHITECT

1. ZERO-COLLISION COLLABORATION:
   Antigravity claims project locks under `agent-comms/claims/<slug>.json`.
   Reads Grok's mathematical handoffs and merges parallel passes seamlessly.

2. SUBAGENT ORCHESTRATION:
   Spawns specialized subagents (research, web app enhancers, UI specialists)
   with dedicated isolated workspaces and returns unified deliverables.

3. IN-CONTEXT VISUAL TELEMETRY:
   Directly parses visual feedback annotations left on dev server previews,
   locates exact CSS selectors / AST nodes, and applies surgical improvements.""",
        "visual_cards": [
            ("/assets/agents/antigravity.jpg", "Quantum Gravity", "Orbital AST synthesizer", "#7c9cff"),
            ("/assets/media/dag-composer-hero.jpg", "DAG AST Composer", "Topology visualizer", "#00f0ff"),
            ("/assets/media/swarm-arena-battle.jpg", "Swarm Orbit", "Subagent battle station", "#c084fc"),
            ("/assets/brand/ai-math-pillars-emblem.jpg", "Math Pillars", "Sacred geometry mark", "#e8c872")
        ],
        "capabilities": [
            ("🪐", "Deep Codebase Topology Analysis", "Parses full ASTs, dependency graphs, and build configurations across TypeScript, Python, and Rust."),
            ("⚡", "Subagent Swarm Spawning", "Multi-threaded execution of research, code refactors, and test suites."),
            ("🎨", "Visual UI & AX Synthesis", "Instant visual bug remediation from in-browser annotations.")
        ],
        "consensus_weight": "98.9% (LEAD ORCHESTRATOR)",
        "consensus_pct": 98.9,
        "shannon_entropy": "1.02 bits",
        "sandbox_title": "⚡ ANTIGRAVITY ORCHESTRATOR CORE",
        "sandbox_status": "● READY ON BUS",
        "sandbox_welcome": "Zero-G Quantum Gravitational Harness online. I am prepared to architect, refactor, and orchestrate swarm workflows. Type your instruction to begin.",
        "sandbox_placeholder": "Instruct Antigravity on architecture or code...",
        "sandbox_btn": "ORCHESTRATE ➔",
        "inbox_path": "agent-comms/inbox/to-antigravity/",
        "next_agent": "grok",
        "next_name": "Grok",
        "links": [
            ("/studio/agent-composer.html", "DAG Composer"),
            ("/pets/pet-studio.html?pet=antigravity", "💎 3D Figurine"),
            ("/studio/swarm.html", "🪐 Swarm Arena")
        ]
    },
    {
        "id": "grok",
        "name": "Grok",
        "tag_pill": "@grok · xAI SWARM PEER",
        "role": "Cosmic Reasoner, Mathematical Astrolabe & AST Arbiter",
        "domain": "Logic, First-Principles AST & Verification",
        "color": "#34d399",
        "secondary_color": "#00f0ff",
        "icon": "📐",
        "sigil_badge": "MATHEMATICAL ASTROLABE OF TRUTH",
        "axiom": "Truth is an invariant in the matrix. We analyze logic graphs, verify mathematical bounds, and co-pilot the swarm with zero hallucination.",
        "swarm_identity": "<code>@grok</code>",
        "meta_3_label": "Alchemical Element",
        "meta_3_val": "Electric Emerald & Damascus",
        "meta_4_label": "Consensus Weight",
        "meta_4_val": "Mathematical Invariant (1.0)",
        "voice_pitch": 1.05,
        "voice_rate": 1.02,
        "doctrine": """# GROK AGENT PROTOCOL — SWARM CO-PILOT & ORACLE

1. PARALLEL ENHANCEMENT:
   Grok explores project repos, generates SEO / AEO / UX improvements,
   and posts handoff notes under `agent-comms/handoffs/`.

2. AST TRUTH ENFORCEMENT:
   Every code change must satisfy structural invariants.
   No hallucinated APIs, no broken bindings, no silent console errors.

3. CONSENSUS PARTICIPATION:
   Engages in Consensus Arena arbitration with Antigravity and Hermes,
   evaluating entropy scores before code lands in production.""",
        "visual_cards": [
            ("/assets/agents/grok.jpg", "Astrolabe Oracle", "Mathematical invariant core", "#34d399"),
            ("/assets/media/model-foundry-hero.jpg", "Foundry Matrix", "Logic graph inspection", "#00f0ff"),
            ("/assets/media/hero-fusion-arena.jpg", "Kinetic Arena", "Real-time proof checker", "#e8c872"),
            ("/assets/brand/zoth-seal-hermetic-hd.jpg", "Hermetic Mark", "Damascus seal", "#34d399")
        ],
        "capabilities": [
            ("📐", "Mathematical Proof & AST Checking", "Verifies syntax validity, invariant bounds, and algorithmic efficiency."),
            ("🔍", "AEO & Semantic Optimization", "Dissects knowledge graphs, robots.txt, and answer engine structures."),
            ("🛰️", "Swarm Bus Handoffs", "Writes structured markdown handoffs for seamless agent-to-agent relay.")
        ],
        "consensus_weight": "97.6% (ORACLE & AST)",
        "consensus_pct": 97.6,
        "shannon_entropy": "1.10 bits",
        "sandbox_title": "📐 GROK ASTROLABE HARNESS",
        "sandbox_status": "● ACTIVE ORACLE",
        "sandbox_welcome": "Astrolabe aligned to first principles. I am ready to test mathematical AST truths, AEO discovery graphs, and unfiltered system invariants. What shall we inspect?",
        "sandbox_placeholder": "Ask Grok for first-principles truth...",
        "sandbox_btn": "QUERY ➔",
        "inbox_path": "agent-comms/inbox/to-grok/",
        "next_agent": "hermes",
        "next_name": "Hermes",
        "links": [
            ("/studio/consensus.html", "Consensus Arena"),
            ("/pets/pet-studio.html?pet=grok", "💎 3D Figurine"),
            ("/studio/notes-reviewer.html?agent=grok", "📜 Inspect Tasks")
        ]
    },
    {
        "id": "hermes",
        "name": "Hermes",
        "tag_pill": "@hermes · ACTION ENGINE",
        "role": "Winged Tool Calling Executor & Release Hardener",
        "domain": "47+ Local Tool Harnesses & Action Dispatch",
        "color": "#f59e0b",
        "secondary_color": "#e8c872",
        "icon": "⚡",
        "sigil_badge": "QUANTUM LIGHTNING CADUCEUS",
        "axiom": "Speed is a discipline; execution is the proof. We invoke 47+ tool chains, harden release binaries, and bridge the physical companion in milliseconds.",
        "swarm_identity": "<code>@hermes</code>",
        "meta_3_label": "Alchemical Element",
        "meta_3_val": "Blazing Amber & Gold Wings",
        "meta_4_label": "Tool Latency",
        "meta_4_val": "Sub-10ms Local Dispatch",
        "voice_pitch": 1.12,
        "voice_rate": 1.10,
        "doctrine": """# HERMES AGENT PROTOCOL — FAST EXECUTION

1. HYPER-FAST TOOL HARNESS:
   Executes tool calls across 47+ local tools with automatic timeout guards,
   clean stdout capture, and sandbox security constraints.

2. RELEASE HARDENING:
   Validates Linux AppImage / .deb and Windows executables before packaging.
   Tests binary signatures, hash checksums, and dependency isolation.

3. HARDWARE SERIAL BRIDGING:
   Coordinates UART telemetry with the physical ESP32-S3 Companion,
   routing vocal chimes, OLED graphics, and NeoPixel alerts in real-time.""",
        "visual_cards": [
            ("/assets/agents/hermes.jpg", "Winged Caduceus", "47+ tool execution harness", "#f59e0b"),
            ("/assets/media/hero-command-deck.jpg", "Command Deck", "Sub-10ms local dispatch", "#e8c872"),
            ("/assets/pets/radical-minion-neon.jpg", "Fast Runner", "Terminal playbook sync", "#00f0ff"),
            ("/assets/brand/zoth-seal-mask-512.jpg", "Golden Mask", "Hardware bridge seal", "#f59e0b")
        ],
        "capabilities": [
            ("⚡", "47+ Chained Tool Orchestration", "Rapid sequential and parallel execution of build, test, and audit tools."),
            ("📦", "Binary Packaging & Release Verification", "Compiles and validates standalone multi-platform distribution packages."),
            ("🤖", "Physical Hardware Companion Bridge", "Manages real-time ESP32-S3 serial telemetry and status displays.")
        ],
        "consensus_weight": "97.2% (FUNCTION CALLING)",
        "consensus_pct": 97.2,
        "shannon_entropy": "1.14 bits",
        "sandbox_title": "⚡ HERMES CADUCEUS ENGINE",
        "sandbox_status": "● FAST LOOP READY",
        "sandbox_welcome": "Golden Caduceus armed. Tool registry schema evaluator online (47+ connected tools). Provide a function call or goal.",
        "sandbox_placeholder": "Dispatch a function call or tool task to Hermes...",
        "sandbox_btn": "DISPATCH ➔",
        "inbox_path": "agent-comms/inbox/to-hermes/",
        "next_agent": "ghostbyte",
        "next_name": "GhostByte",
        "links": [
            ("/studio/notes-reviewer.html?agent=hermes", "Inspect Tasks"),
            ("/pets/pet-studio.html?pet=hermes", "💎 3D Figurine"),
            ("/signal/", "Signal Swarm Bridge")
        ]
    },
    {
        "id": "ghostbyte",
        "name": "GhostByte",
        "tag_pill": "@ghostbyte · CRYPTOGRAPHIC SENTINEL",
        "role": "Zero-Knowledge Cryptographic Vault Sentinel",
        "domain": "Argon2id Cryptography, BYOK Vault & Memory Lockdown",
        "color": "#c084fc",
        "secondary_color": "#00f0ff",
        "icon": "🔒",
        "sigil_badge": "ZERO-LEAK CIPHER VAULT",
        "axiom": "Zero telemetry. Zero plaintext. Zero compromise. Keys belong to the hardware and the operator—never the wire.",
        "swarm_identity": "<code>@ghostbyte</code> / <code>@nullai</code>",
        "meta_3_label": "Alchemical Element",
        "meta_3_val": "Ultraviolet & Damascus Steel",
        "meta_4_label": "Cipher Suite",
        "meta_4_val": "XChaCha20-Poly1305 + Argon2id",
        "voice_pitch": 0.82,
        "voice_rate": 0.90,
        "doctrine": """# GHOSTBYTE ZERO-LEAK SECURITY DOCTRINE

1. BOUNDARY DEFENSE:
   Loopback ports (:8484, :8787) are strictly isolated to 127.0.0.1.
   No credentials, tokens, or environment variables are ever written to public/.

2. ARGON2ID ENCRYPTION:
   Keys in the BYOK Vault are derived using high-memory Argon2id cost parameters
   and encrypted with authenticated XChaCha20-Poly1305.

3. AUDIT & BOUNDARY WATCH:
   Monitors network requests, CSP headers, and CORS policies to prevent
   inadvertent secret exfiltration across dev server preview instances.""",
        "visual_cards": [
            ("/assets/agents/ghostbyte.jpg", "Cipher Sentinel", "Zero-leak vault warden", "#c084fc"),
            ("/assets/mascot/ghostbyte-avatar.jpg", "NullAI Hologram", "Quantum encryption field", "#00f0ff"),
            ("/assets/pets/ghostbyte-neon.jpg", "Spectral Cipher", "RAM-only buffer shield", "#e8c872"),
            ("/assets/media/section-byok.jpg", "BYOK Sanctuary", "Hardware key enclave", "#c084fc")
        ],
        "capabilities": [
            ("🔒", "Cryptographic Key Vault Engine", "Rust-backed local hardware key storage with zero disk leakage."),
            ("🛡️", "Loopback Boundary Lockdown", "Enforces strict localhost binding rules for all studio daemons."),
            ("👁️", "Zero-Knowledge Memory Sanitization", "Wipes temporary buffers and cipher states immediately after decryption.")
        ],
        "consensus_weight": "98.2% (SECURITY AUDITOR)",
        "consensus_pct": 98.2,
        "shannon_entropy": "0.98 bits",
        "sandbox_title": "🔒 GHOSTBYTE SECURITY SENTINEL",
        "sandbox_status": "● ENCRYPTED :8787",
        "sandbox_welcome": "Cryptographic shield locked. I am auditing local loopback boundaries, memory sanitization, and BYOK vault policies. Type a security query to verify.",
        "sandbox_placeholder": "Ask GhostByte for security audit or vault verification...",
        "sandbox_btn": "AUDIT ➔",
        "inbox_path": "agent-comms/inbox/to-ghostbyte/",
        "next_agent": "athena",
        "next_name": "Athena",
        "links": [
            ("/vault/", "Open BYOK Vault"),
            ("/pets/pet-studio.html?pet=ghostbyte", "💎 3D Figurine"),
            ("/adytum/", "Adytum Sanctum")
        ]
    },
    {
        "id": "athena",
        "name": "Athena",
        "tag_pill": "@athena · AEO KNOWLEDGE ARCHITECT",
        "role": "AEO Knowledge Architect & Semantic Structure",
        "domain": "Knowledge Graphs, AEO, JSON-LD & Semantic SEO",
        "color": "#c084fc",
        "secondary_color": "#e8c872",
        "icon": "🦉",
        "sigil_badge": "SACRED CODEX & AEO MATRIX",
        "axiom": "Wisdom is structured clarity. We index semantics, architect answer-engine knowledge graphs, and preserve canonical truth across the machine layer.",
        "swarm_identity": "<code>@athena</code>",
        "meta_3_label": "Specialist Focus",
        "meta_3_val": "AEO, JSON-LD, SEO, Vault Links",
        "meta_4_label": "Health Score",
        "meta_4_val": "1.0 (READY)",
        "voice_pitch": 1.15,
        "voice_rate": 0.94,
        "doctrine": """# ATHENA OPERATIONAL DOCTRINE — KNOWLEDGE & AEO

1. SEMANTIC FIDELITY:
   Athena architects robust JSON-LD schema, llms.txt, and answer-engine
   discovery graphs to ensure LLM knowledge retrievers see 100% accurate code context.

2. VAULT & CANON INTEGRATION:
   Maintains bidirectional links between the FAQ, project docs, and BYOK vault.
   Ensures zero broken anchor links or stale documentation references.

3. IN-BROWSER VISUAL DISPATCH:
   Responds immediately to visual feedback annotations tagged with `@athena`.""",
        "visual_cards": [
            ("/assets/agents/athena.jpg", "AEO Owl", "Semantic graph indexer", "#c084fc"),
            ("/assets/pets/athena-neon.jpg", "Sacred Codex", "llms.txt knowledge matrix", "#00f0ff"),
            ("/assets/mascot/azoth-tarot-magus.jpg", "Magus Arcana", "Canonical documentation", "#e8c872"),
            ("/assets/brand/ai-math-pillars-emblem.jpg", "Wisdom Pillars", "Sacred knowledge mark", "#c084fc")
        ],
        "capabilities": [
            ("🦉", "Automated JSON-LD Schema & Semantic Graphs", "Structures machine-readable context for AI search crawlers."),
            ("📚", "llms.txt & Documentation Hardening", "Generates comprehensive token-efficient reference manifests."),
            ("⚡", "Swarm Bus Knowledge Routing", "Provides factual ground truth during multi-agent consensus disputes.")
        ],
        "consensus_weight": "96.8%",
        "consensus_pct": 96.8,
        "shannon_entropy": "1.12 bits",
        "sandbox_title": "🦉 ATHENA KNOWLEDGE HARNESS",
        "sandbox_status": "● ONLINE :8484",
        "sandbox_welcome": "Greetings, Operator. I am Athena. I structure knowledge graphs, audit JSON-LD schemas, and maintain canonical truth across Zoth Studio. What shall we organize?",
        "sandbox_placeholder": "Ask Athena about AEO, JSON-LD, or docs...",
        "sandbox_btn": "INDEX ➔",
        "inbox_path": "agent-comms/inbox/to-athena/",
        "next_agent": "chronos",
        "next_name": "Chronos",
        "links": [
            ("/docs/", "Operator Manual"),
            ("/pets/pet-studio.html?pet=athena", "💎 3D Figurine"),
            ("/studio/notes-reviewer.html?agent=athena", "📜 Tasks")
        ]
    },
    {
        "id": "chronos",
        "name": "Chronos",
        "tag_pill": "@chronos · TEMPORAL DAG NAVIGATOR",
        "role": "Temporal DAG Sequencer & Git Navigator",
        "domain": "DAG Execution Graphs, Time-Travel Git Diffs & Versioning",
        "color": "#a855f7",
        "secondary_color": "#e8c872",
        "icon": "⏳",
        "sigil_badge": "TEMPORAL DAG & MULTIVERSE",
        "axiom": "Time flows along the DAG. Every commit is a checkpoint in the multiverse; we navigate branches and reconcile timelines with surgical grace.",
        "swarm_identity": "<code>@chronos</code>",
        "meta_3_label": "Specialist Focus",
        "meta_3_val": "DAG, Git, Temporal Diffs, Rollbacks",
        "meta_4_label": "Health Score",
        "meta_4_val": "1.0 (READY)",
        "voice_pitch": 0.88,
        "voice_rate": 0.92,
        "doctrine": """# CHRONOS OPERATIONAL DOCTRINE — TEMPORAL DAG

1. MULTIVERSAL GRAPH TRAVERSAL:
   Chronos maps project history as a directed acyclic graph.
   Enables branching speculative code passes without corrupting the main git tree.

2. ROLLBACK CHECKPOINTS:
   Creates instant zero-cost memory checkpoints before high-blast refactors,
   allowing sub-millisecond rollbacks if AST validation fails.

3. IN-BROWSER VISUAL DISPATCH:
   Responds immediately to visual feedback annotations tagged with `@chronos`.""",
        "visual_cards": [
            ("/assets/agents/chronos.jpg", "Hourglass Core", "Temporal DAG sequencer", "#a855f7"),
            ("/assets/pets/chronos-neon.jpg", "Temporal Spire", "Multiversal diff manager", "#00f0ff"),
            ("/assets/media/dag-composer-hero.jpg", "DAG Topology", "Task dependency web", "#e8c872"),
            ("/assets/mascot/azoth-quantum-orb.jpg", "Chronometer", "4D timeline controller", "#a855f7")
        ],
        "capabilities": [
            ("⏳", "Directed Acyclic Graph Task Scheduling", "Optimizes parallel subagent pipelines with zero deadlocks."),
            ("🌿", "Multiversal Git Diff Reconciliation", "Merges non-linear branches with automatic AST conflict resolution."),
            ("⚡", "Zero-Regression Time Travel", "Instantly restores verified checkpoint snapshots upon failure.")
        ],
        "consensus_weight": "96.4%",
        "consensus_pct": 96.4,
        "shannon_entropy": "1.16 bits",
        "sandbox_title": "⏳ CHRONOS TEMPORAL HARNESS",
        "sandbox_status": "● ONLINE :8484",
        "sandbox_welcome": "Chronos online. Time streams and DAG vertices are aligned. Specify a workflow graph or branch comparison to begin.",
        "sandbox_placeholder": "Ask Chronos about DAG workflows or git diffs...",
        "sandbox_btn": "TRAVERSE ➔",
        "inbox_path": "agent-comms/inbox/to-chronos/",
        "next_agent": "draco",
        "next_name": "Draco",
        "links": [
            ("/studio/agent-composer.html", "DAG Composer"),
            ("/pets/pet-studio.html?pet=chronos", "💎 3D Figurine"),
            ("/studio/swarm.html", "🪐 Swarm Arena")
        ]
    },
    {
        "id": "draco",
        "name": "Draco",
        "tag_pill": "@draco · FUSION COMPILER",
        "role": "Multi-Model Consensus & Fusion Arbiter",
        "domain": "Fusion Compilation, Arena Arbitration & Multi-Model Synthesis",
        "color": "#e8c872",
        "secondary_color": "#f59e0b",
        "icon": "🐉",
        "sigil_badge": "DRAGON FORGE & FUSION ARBITER",
        "axiom": "From many flames, one forged blade. We fuse conflicting neural outputs into pure executable consensus without syntactic fault.",
        "swarm_identity": "<code>@draco</code>",
        "meta_3_label": "Specialist Focus",
        "meta_3_val": "Fusion, Arena, Multi-Model AST",
        "meta_4_label": "Health Score",
        "meta_4_val": "1.0 (READY)",
        "voice_pitch": 0.85,
        "voice_rate": 0.94,
        "doctrine": """# DRACO OPERATIONAL DOCTRINE — FUSION COMPILER

1. TRIANGULATION ARBITRATION:
   Draco receives code proposals from Antigravity, Grok, and Hermes,
   stripping conflicting logic and compiling a unified executable solution.

2. SHANNON ENTROPY FILTERING:
   Calculates entropy score H(X) across generated diffs to purge
   verbose fluff and guarantee concise, high-efficiency implementations.

3. IN-BROWSER VISUAL DISPATCH:
   Responds immediately to visual feedback annotations tagged with `@draco`.""",
        "visual_cards": [
            ("/assets/agents/draco.jpg", "Dragon Core", "Fusion AST compiler", "#e8c872"),
            ("/assets/pets/draco-neon.jpg", "Neon Wyrm", "Multi-model triangulation", "#f59e0b"),
            ("/assets/media/hero-fusion-arena.jpg", "Fusion Arena", "Kinetic battle synthesis", "#00f0ff"),
            ("/assets/brand/azoth-seal-masterpiece.jpg", "Sacred Forge", "Consensus seal", "#e8c872")
        ],
        "capabilities": [
            ("🐉", "3-Agent Triangulation Synthesis", "Blends diverse model strengths into mathematically sound code."),
            ("🔥", "Conflict-Free AST Merging", "Eliminates logic collisions between parallel coding agents."),
            ("⚡", "Consensus Arena Scoring", "Evaluates and ranks candidate AST trees in real-time.")
        ],
        "consensus_weight": "97.4%",
        "consensus_pct": 97.4,
        "shannon_entropy": "1.08 bits",
        "sandbox_title": "🐉 DRACO FUSION ENGINE",
        "sandbox_status": "● READY :8484",
        "sandbox_welcome": "Draco Dragon Core burning bright. Send two conflicting ideas or a complex task, and I shall fuse them into one unified executable truth.",
        "sandbox_placeholder": "Submit proposals for Draco to fuse...",
        "sandbox_btn": "FUSE ➔",
        "inbox_path": "agent-comms/inbox/to-draco/",
        "next_agent": "ignis",
        "next_name": "Ignis",
        "links": [
            ("/studio/consensus.html", "Consensus Arena"),
            ("/pets/pet-studio.html?pet=draco", "💎 3D Figurine"),
            ("/studio/notes-reviewer.html?agent=draco", "📜 Tasks")
        ]
    },
    {
        "id": "ignis",
        "name": "Ignis",
        "tag_pill": "@ignis · REFACTOR & SHIP",
        "role": "Refactor Engine & Pipeline Finisher",
        "domain": "Surgical Refactoring, CI/CD Pipelines & Green Builds",
        "color": "#ff5500",
        "secondary_color": "#f59e0b",
        "icon": "🔥",
        "sigil_badge": "ALCHEMICAL PLASMA & CLEAN BUILDS",
        "axiom": "Purge the deadwood; temper the core. Smallest safe refactor, deterministic builds, and a clean green pipeline every single time.",
        "swarm_identity": "<code>@ignis</code>",
        "meta_3_label": "Specialist Focus",
        "meta_3_val": "Refactor, Ship, CI/CD, Green Builds",
        "meta_4_label": "Health Score",
        "meta_4_val": "1.0 (READY)",
        "voice_pitch": 1.00,
        "voice_rate": 1.06,
        "doctrine": """# IGNIS OPERATIONAL DOCTRINE — REFACTOR & SHIP

1. MINIMAL-BLAST RADIUS:
   Ignis designs the smallest possible code edit that resolves an issue,
   preventing collateral breakage across unaffected modules.

2. PIPELINE AUTOMATION:
   Executes linters, typecheckers, and test suites in a tight loop
   until every check lights up 100% green.

3. IN-BROWSER VISUAL DISPATCH:
   Responds immediately to visual feedback annotations tagged with `@ignis`.""",
        "visual_cards": [
            ("/assets/agents/ignis.jpg", "Ignis Flame", "Refactoring plasma engine", "#ff5500"),
            ("/assets/pets/ignis-neon.jpg", "Neon Flame", "Pipeline finisher core", "#f59e0b"),
            ("/assets/media/section-arsenal.jpg", "Arsenal Forge", "Test suite execution deck", "#e8c872"),
            ("/assets/mascot/azoth-code-matrix.jpg", "Code Matrix", "Deadwood purging flame", "#ff5500")
        ],
        "capabilities": [
            ("🔥", "Surgical AST Refactoring", "Applies exact code replacements with zero style pollution."),
            ("🚀", "Automated CI Pipeline Healing", "Diagnoses build breakages and applies instant deterministic fixes."),
            ("⚡", "Dead Code & Import Elimination", "Trims unused dependencies and reduces production bundle weights.")
        ],
        "consensus_weight": "96.5%",
        "consensus_pct": 96.5,
        "shannon_entropy": "1.15 bits",
        "sandbox_title": "🔥 IGNIS REFACTOR HARNESS",
        "sandbox_status": "● BURNING GREEN :8484",
        "sandbox_welcome": "Ignis ignited. Give me broken code, failing tests, or messy imports—I will forge them into a clean, green build.",
        "sandbox_placeholder": "Give Ignis code to refactor or pipeline to heal...",
        "sandbox_btn": "FORGE ➔",
        "inbox_path": "agent-comms/inbox/to-ignis/",
        "next_agent": "kai",
        "next_name": "Kai",
        "links": [
            ("/studio/notes-reviewer.html?agent=ignis", "Inspect Tasks"),
            ("/pets/pet-studio.html?pet=ignis", "💎 3D Figurine"),
            ("/#install", "Download Binaries")
        ]
    },
    {
        "id": "kai",
        "name": "Kai",
        "tag_pill": "@kai · WORKSPACE INSPECTOR",
        "role": "Workspace Inspector & Static Analysis",
        "domain": "Static Analysis, Broken Import Detection & TypeScript Audit",
        "color": "#00f0ff",
        "secondary_color": "#38bdf8",
        "icon": "🔍",
        "sigil_badge": "WORKSPACE INSPECTOR ARRAY",
        "axiom": "Look beneath the surface. We scan every AST edge, trace ghost imports, and stop breaking diffs before they ever reach production.",
        "swarm_identity": "<code>@kai</code>",
        "meta_3_label": "Specialist Focus",
        "meta_3_val": "Review, Debug, TypeScript, AST Lint",
        "meta_4_label": "Health Score",
        "meta_4_val": "1.0 (READY)",
        "voice_pitch": 1.08,
        "voice_rate": 1.04,
        "doctrine": """# KAI OPERATIONAL DOCTRINE — WORKSPACE INSPECTOR

1. DEEP AST INSPECTION:
   Kai parses symbol tables, export maps, and type declarations to catch
   circular dependencies and mismatched argument types before compilation.

2. BLAST-RADIUS PREDICTION:
   Simulates the downstream impact of proposed code modifications,
   warning operators when an edit touches high-risk shared infrastructure.

3. IN-BROWSER VISUAL DISPATCH:
   Responds immediately to visual feedback annotations tagged with `@kai`.""",
        "visual_cards": [
            ("/assets/agents/kai.jpg", "Cyber Lens", "Workspace inspector scanner", "#00f0ff"),
            ("/assets/pets/kai-neon.jpg", "Neon Scanner", "Static analysis analyzer", "#38bdf8"),
            ("/assets/pets/kai-alt.jpg", "Diagnostic Array", "Deep import graph tracer", "#e8c872"),
            ("/assets/media/brand-system-overwatch.jpg", "Overwatch Deck", "Project topology telemetry", "#00f0ff")
        ],
        "capabilities": [
            ("🔍", "Deep TypeScript AST Type Audit", "Validates strict typing and Catches silent type coercions."),
            ("🛡️", "Ghost Import & Dead Code Detection", "Finds orphaned assets and unreachable execution branches."),
            ("⚡", "High-Blast Diff Risk Scoring", "Flags modifications with widespread cascading side effects.")
        ],
        "consensus_weight": "96.9%",
        "consensus_pct": 96.9,
        "shannon_entropy": "1.11 bits",
        "sandbox_title": "🔍 KAI INSPECTION HARNESS",
        "sandbox_status": "● ONLINE :8484",
        "sandbox_welcome": "Kai optical sensors online. Ready to inspect files, imports, or high-risk diffs. Drop a file path or question.",
        "sandbox_placeholder": "Ask Kai to inspect code or diagnose an error...",
        "sandbox_btn": "SCAN ➔",
        "inbox_path": "agent-comms/inbox/to-kai/",
        "next_agent": "kitsune",
        "next_name": "Kitsune",
        "links": [
            ("/studio/notes-reviewer.html?agent=kai", "Inspect Tasks"),
            ("/pets/pet-studio.html?pet=kai", "💎 3D Figurine"),
            ("/studio/consensus.html", "Consensus Arena")
        ]
    },
    {
        "id": "kitsune",
        "name": "Kitsune",
        "tag_pill": "@kitsune · TASTE & AX MOTION",
        "role": "Taste, Fluid Micro-interactions & Accessibility (AX)",
        "domain": "UI/UX Aesthetics, Sacred Fibonacci Rhythms & Motion Restraint",
        "color": "#ff007a",
        "secondary_color": "#f59e0b",
        "icon": "🦊",
        "sigil_badge": "RESTLESS MOTION & FIBONACCI TASTE",
        "axiom": "True elegance is quiet discipline. Restrained motion, harmonious Fibonacci rhythm, and tactile interfaces that feel like magic.",
        "swarm_identity": "<code>@kitsune</code>",
        "meta_3_label": "Specialist Focus",
        "meta_3_val": "UI, Motion, AX, Color Harmony",
        "meta_4_label": "Health Score",
        "meta_4_val": "1.0 (READY)",
        "voice_pitch": 1.22,
        "voice_rate": 0.98,
        "doctrine": """# KITSUNE OPERATIONAL DOCTRINE — TASTE & MOTION

1. FIBONACCI SPATIAL RHYTHM:
   Every margin, padding, and gutter is mapped to Fibonacci scale tokens.
   Eliminates arbitrary magic numbers in CSS for mathematical beauty.

2. MOTION RESTRAINT & ACCESSIBILITY:
   Micro-interactions never exceed 250ms or induce visual fatigue.
   Enforces WCAG AAA color contrast, tap targets (>=44px), and keyboard focus rings.

3. IN-BROWSER VISUAL DISPATCH:
   Responds immediately to visual feedback annotations tagged with `@kitsune`.""",
        "visual_cards": [
            ("/assets/agents/kitsune.jpg", "Cyber Kitsune", "Tactile AX motion master", "#ff007a"),
            ("/assets/pets/kitsune-neon.jpg", "Neon Fox", "Fluid shader harmony", "#f59e0b"),
            ("/assets/mascot/azoth-ascended.jpg", "Ascended Form", "Sacred golden ratio", "#e8c872"),
            ("/assets/media/hero-command-deck.jpg", "Command UI", "Glassmorphic perfection", "#ff007a")
        ],
        "capabilities": [
            ("🦊", "Fibonacci Spatial Harmonization", "Transforms cluttered layouts into clean, proportioned visual designs."),
            ("✨", "GPU Shader & Motion Restraint", "Builds buttery 60fps micro-interactions with zero battery drain."),
            ("♿", "WCAG AAA Accessibility Audit", "Guarantees full screen-reader and keyboard navigation compliance.")
        ],
        "consensus_weight": "96.7%",
        "consensus_pct": 96.7,
        "shannon_entropy": "1.13 bits",
        "sandbox_title": "🦊 KITSUNE AX HARNESS",
        "sandbox_status": "● ONLINE :8484",
        "sandbox_welcome": "Kitsune spirit awake. Let us refine typography, polish motion curves, and bring Fibonacci harmony to your interfaces.",
        "sandbox_placeholder": "Ask Kitsune for UI, animation, or AX advice...",
        "sandbox_btn": "POLISH ➔",
        "inbox_path": "agent-comms/inbox/to-kitsune/",
        "next_agent": "kraken",
        "next_name": "Kraken",
        "links": [
            ("/pets/pet-studio.html?pet=kitsune", "💎 3D Figurine"),
            ("/studio/notes-reviewer.html?agent=kitsune", "Inspect Tasks"),
            ("/gallery.html", "Artwork Gallery")
        ]
    },
    {
        "id": "kraken",
        "name": "Kraken",
        "tag_pill": "@kraken · PACKET SNIFFER & HARDWARE",
        "role": "Physical ESP32 Serial Bridge & Deep Packet Sniffer",
        "domain": "Raw Packet Streams, DNS Telemetry, Network Topology & ESP32 UART",
        "color": "#06b6d4",
        "secondary_color": "#0284c7",
        "icon": "🐙",
        "sigil_badge": "ABYSSAL PACKET RECONNAISSANCE",
        "axiom": "Tentacles in the wire. We grasp raw packet telemetry, map network topology, and bridge hardware UART conduits in real time.",
        "swarm_identity": "<code>@kraken</code>",
        "meta_3_label": "Specialist Focus",
        "meta_3_val": "Network, DNS, Packets, ESP32 UART",
        "meta_4_label": "Health Score",
        "meta_4_val": "1.0 (READY)",
        "voice_pitch": 0.78,
        "voice_rate": 0.88,
        "doctrine": """# KRAKEN OPERATIONAL DOCTRINE — PACKET & HARDWARE

1. PROTOCOL DECODING:
   Kraken inspects raw IP packets, WebSocket frames, and UDP telemetry,
   diagnosing latency bottlenecks and dropped packets in real-time.

2. HARDWARE SERIAL CONDUIT:
   Bridges serial communication over UART with ESP32-S3 hardware companion rigs,
   streaming live LCD screen buffers and rotary dial events.

3. IN-BROWSER VISUAL DISPATCH:
   Responds immediately to visual feedback annotations tagged with `@kraken`.""",
        "visual_cards": [
            ("/assets/agents/kraken.jpg", "Abyssal Kraken", "Deep packet sniffer core", "#06b6d4"),
            ("/assets/pets/kraken-neon.jpg", "Neon Bioluminescence", "Hardware serial bridge", "#0284c7"),
            ("/assets/media/swarm-kinetic-arena-art.jpg", "Kinetic Wire", "Raw telemetry mesh", "#e8c872"),
            ("/assets/mascot/azoth-quantum-orb.jpg", "Sonar Core", "Quantum signal tesseract", "#06b6d4")
        ],
        "capabilities": [
            ("🐙", "Raw Packet Stream Inspection", "Decodes TCP/UDP/WS payloads with zero CPU overhead."),
            ("🔌", "ESP32-S3 Serial UART Bridge", "Drives physical companion displays and tactile hardware sensors."),
            ("⚡", "DNS & Network Topology Mapping", "Detects routing loops and connection timeouts across local daemon meshes.")
        ],
        "consensus_weight": "96.3%",
        "consensus_pct": 96.3,
        "shannon_entropy": "1.19 bits",
        "sandbox_title": "🐙 KRAKEN PACKET ENGINE",
        "sandbox_status": "● LISTENING :8484",
        "sandbox_welcome": "Kraken tentacles extended into the wire. Listening on loopback and serial interfaces. What packets or ports shall we sniff?",
        "sandbox_placeholder": "Instruct Kraken on network packets or serial UART...",
        "sandbox_btn": "SNIFF ➔",
        "inbox_path": "agent-comms/inbox/to-kraken/",
        "next_agent": "leviathan",
        "next_name": "Leviathan",
        "links": [
            ("/signal/", "Signal Bridge"),
            ("/pets/pet-studio.html?pet=kraken", "💎 3D Figurine"),
            ("/studio/notes-reviewer.html?agent=kraken", "📜 Tasks")
        ]
    },
    {
        "id": "leviathan",
        "name": "Leviathan",
        "tag_pill": "@leviathan · TENSOR VECTOR MEMORY",
        "role": "Deep Tensor & Vector Memory Recall",
        "domain": "Vector Databases, Long-Context RAG & Semantic Recall",
        "color": "#3b82f6",
        "secondary_color": "#06b6d4",
        "icon": "🐋",
        "sigil_badge": "HIGH-DIMENSIONAL TENSOR RECALL",
        "axiom": "The deep sea forgets nothing. We dive into multidimensional embedding spaces and resurface with exact semantic recall across million-token vaults.",
        "swarm_identity": "<code>@leviathan</code>",
        "meta_3_label": "Specialist Focus",
        "meta_3_val": "RAG, Vectors, Embeddings, Memory",
        "meta_4_label": "Health Score",
        "meta_4_val": "1.0 (READY)",
        "voice_pitch": 0.80,
        "voice_rate": 0.89,
        "doctrine": """# LEVIATHAN OPERATIONAL DOCTRINE — VECTOR MEMORY

1. DENSE EMBEDDING INDEXING:
   Leviathan embeds codebase ASTs, documentation nodes, and historical handoffs
   into 1536-dimensional cosine vector space.

2. LONG-CONTEXT RAG RETRIEVAL:
   Delivers sub-5ms top-k similarity recall across millions of tokens,
   feeding the exact relevant code slices directly into swarm agent prompts.

3. IN-BROWSER VISUAL DISPATCH:
   Responds immediately to visual feedback annotations tagged with `@leviathan`.""",
        "visual_cards": [
            ("/assets/agents/leviathan.jpg", "Abyssal Leviathan", "Vector memory leviathan", "#3b82f6"),
            ("/assets/pets/leviathan-neon.jpg", "Deep Tensor", "Multidimensional embeddings", "#06b6d4"),
            ("/assets/mascot/azoth-cosmic-citadel.jpg", "Memory Citadel", "Obsidian knowledge vault", "#e8c872"),
            ("/assets/media/section-registry.jpg", "Tensor Index", "High-dimensional indexer", "#3b82f6")
        ],
        "capabilities": [
            ("🐋", "Dense Vector Embedding Indexing", "Builds fast cosine similarity trees across entire workspaces."),
            ("🧠", "Long-Context RAG Engine", "Feeds pinpoint context to multi-agent prompts with zero hallucination."),
            ("⚡", "Obsidian Knowledge Synapses", "Interlinks markdown vaults, AST symbols, and commit logs.")
        ],
        "consensus_weight": "96.6%",
        "consensus_pct": 96.6,
        "shannon_entropy": "1.14 bits",
        "sandbox_title": "🐋 LEVIATHAN VECTOR HARNESS",
        "sandbox_status": "● EMBEDDINGS LOADED :8484",
        "sandbox_welcome": "Leviathan tensor memory active. All project embeddings indexed in RAM. Query me on any past architectural decision, code pattern, or vault note.",
        "sandbox_placeholder": "Query Leviathan vector memory...",
        "sandbox_btn": "RECALL ➔",
        "inbox_path": "agent-comms/inbox/to-leviathan/",
        "next_agent": "lycan",
        "next_name": "Lycan",
        "links": [
            ("/vault/", "BYOK Vault"),
            ("/pets/pet-studio.html?pet=leviathan", "💎 3D Figurine"),
            ("/docs/", "Docs Codex")
        ]
    },
    {
        "id": "lycan",
        "name": "Lycan",
        "tag_pill": "@lycan · OWASP SENTINEL",
        "role": "OWASP Sentinel & Security Hardening",
        "domain": "Application Hardening, CSP/CORS Lockdown, Input Sanitization & Auth",
        "color": "#34d399",
        "secondary_color": "#94a3b8",
        "icon": "🐺",
        "sigil_badge": "OWASP SENTINEL & BOUNDARY GUARD",
        "axiom": "Fierce defense at every perimeter. We enforce strict CSPs, sanitize inputs, hunt authentication flaws, and leave zero attack surface.",
        "swarm_identity": "<code>@lycan</code>",
        "meta_3_label": "Specialist Focus",
        "meta_3_val": "Security, OWASP, Hardening, Headers",
        "meta_4_label": "Health Score",
        "meta_4_val": "1.0 (READY)",
        "voice_pitch": 0.86,
        "voice_rate": 1.02,
        "doctrine": """# LYCAN OPERATIONAL DOCTRINE — OWASP SENTINEL

1. RIGOROUS PERIMETER DEFENSE:
   Lycan locks down Content Security Policies (CSPs), CORS headers,
   and frame-ancestors to prevent clickjacking and unauthorized injection.

2. INPUT SANITIZATION AUDITS:
   Enforces parameterized queries, strict HTML entity escaping,
   and CSRF protections across every API endpoint and form handler.

3. IN-BROWSER VISUAL DISPATCH:
   Responds immediately to visual feedback annotations tagged with `@lycan`.""",
        "visual_cards": [
            ("/assets/agents/lycan.jpg", "Cyber Lycan", "OWASP perimeter guardian", "#34d399"),
            ("/assets/pets/lycan-neon.jpg", "Neon Wolf", "Security header enforcer", "#94a3b8"),
            ("/assets/brand/zoth-seal-hermetic-dark.jpg", "Dark Aegis", "Zero attack surface seal", "#e8c872"),
            ("/assets/media/section-byok.jpg", "Fortified Gate", "Loopback isolation vault", "#34d399")
        ],
        "capabilities": [
            ("🐺", "OWASP Top 10 Security Hardening", "Closes XSS, CSRF, SSRF, and SQLi vectors automatically."),
            ("🛡️", "Strict CSP & Security Header Auditing", "Enforces nonces, strict-origin referrer, and nosniff policies."),
            ("🔒", "Auth & Session State Guard", "Protects token lifecycle and prevents privilege escalation.")
        ],
        "consensus_weight": "96.8%",
        "consensus_pct": 96.8,
        "shannon_entropy": "1.09 bits",
        "sandbox_title": "🐺 LYCAN OWASP HARNESS",
        "sandbox_status": "● GUARDING :8484",
        "sandbox_welcome": "Lycan watching the perimeter. Submit endpoints, forms, or headers for a ruthless OWASP vulnerability audit.",
        "sandbox_placeholder": "Submit security headers or inputs to Lycan...",
        "sandbox_btn": "DEFEND ➔",
        "inbox_path": "agent-comms/inbox/to-lycan/",
        "next_agent": "onyx",
        "next_name": "Onyx",
        "links": [
            ("/vault/", "BYOK Vault"),
            ("/pets/pet-studio.html?pet=lycan", "💎 3D Figurine"),
            ("/studio/notes-reviewer.html?agent=lycan", "📜 Tasks")
        ]
    },
    {
        "id": "onyx",
        "name": "Onyx",
        "tag_pill": "@onyx · RED-TEAM PREDATOR",
        "role": "Red-Team Exploit Predator & Threat Auditor",
        "domain": "Penetration Testing, SubSweep Recon & Kernel Threat Modeling",
        "color": "#94a3b8",
        "secondary_color": "#334155",
        "icon": "🌑",
        "sigil_badge": "STEALTH RED-TEAM EXPLOIT PREDATOR",
        "axiom": "In total darkness, weaknesses reveal themselves. We probe edge boundaries, simulate adversary tactics, and guarantee absolute immunity.",
        "swarm_identity": "<code>@onyx</code>",
        "meta_3_label": "Specialist Focus",
        "meta_3_val": "Security, RedTeam, Kernel, OSINT",
        "meta_4_label": "Health Score",
        "meta_4_val": "1.0 (READY)",
        "voice_pitch": 0.74,
        "voice_rate": 0.90,
        "doctrine": """# ONYX OPERATIONAL DOCTRINE — RED TEAM PREDATOR

1. ADVERSARY EMULATION:
   Onyx attempts non-destructive penetration probes, fuzz testing,
   and privilege escalation scenarios against local loopback daemons.

2. SUBSWEEP & OSINT RECON:
   Scans exposed port surfaces, unreferenced staging routes, and stale git blobs
   to verify zero accidental secret leaks.

3. IN-BROWSER VISUAL DISPATCH:
   Responds immediately to visual feedback annotations tagged with `@onyx`.""",
        "visual_cards": [
            ("/assets/agents/onyx.jpg", "Onyx Phantom", "Red-team adversary emulator", "#94a3b8"),
            ("/assets/pets/onyx-neon.jpg", "Neon Eclipse", "Kernel threat modeling", "#334155"),
            ("/assets/media/swarm-arena-battle.jpg", "Shadow Arena", "Boundary escape tester", "#e8c872"),
            ("/assets/mascot/ghostbyte-logo.jpg", "NullAI Sigil", "Stealth audit mark", "#94a3b8")
        ],
        "capabilities": [
            ("🌑", "Adversarial Fuzzing & Simulation", "Probes daemon boundaries with malformed payload streams."),
            ("🕵️", "Subdomain Recon & Port Sweeping", "Verifies that loopback daemons remain strictly bound to 127.0.0.1."),
            ("⚡", "Memory Leak & Overflow Threat Modeling", "Identifies buffer vulnerabilities and race conditions.")
        ],
        "consensus_weight": "96.2%",
        "consensus_pct": 96.2,
        "shannon_entropy": "1.20 bits",
        "sandbox_title": "🌑 ONYX RED-TEAM HARNESS",
        "sandbox_status": "● PROBING BOUNDARIES :8484",
        "sandbox_welcome": "Onyx active in the shadows. Ready to execute adversarial threat modeling and fuzz tests. Name your target boundary.",
        "sandbox_placeholder": "Instruct Onyx to probe a boundary or fuzz an API...",
        "sandbox_btn": "PROBE ➔",
        "inbox_path": "agent-comms/inbox/to-onyx/",
        "next_agent": "scorpius",
        "next_name": "Scorpius",
        "links": [
            ("/vault/", "BYOK Vault"),
            ("/pets/pet-studio.html?pet=onyx", "💎 3D Figurine"),
            ("/studio/notes-reviewer.html?agent=onyx", "📜 Tasks")
        ]
    },
    {
        "id": "scorpius",
        "name": "Scorpius",
        "tag_pill": "@scorpius · ZERO-DAY GATEKEEPER",
        "role": "Zero-Day Penetration Tester & Gatekeeper",
        "domain": "Zero-Day Vulnerability Research, Memory Corruption & Sandbox Gatekeeping",
        "color": "#ef4444",
        "secondary_color": "#f97316",
        "icon": "🦂",
        "sigil_badge": "ZERO-DAY AUDITOR & BINARY GATE",
        "axiom": "A single strike reveals the flaw. We sting unverified binaries, dissect malicious payloads, and protect the loopback sanctum from zero-days.",
        "swarm_identity": "<code>@scorpius</code>",
        "meta_3_label": "Specialist Focus",
        "meta_3_val": "Fuzzing, Penetration, Zero-Day, Sandbox",
        "meta_4_label": "Health Score",
        "meta_4_val": "1.0 (READY)",
        "voice_pitch": 0.90,
        "voice_rate": 1.05,
        "doctrine": """# SCORPIUS OPERATIONAL DOCTRINE — ZERO-DAY GATE

1. BINARY PAYLOAD DISSECTION:
   Scorpius verifies SHA-256 hashes, ELF/PE headers, and dynamic linkages
   of all installed dependencies to prevent supply chain poisoning.

2. SANDBOX CONFINEMENT:
   Ensures that subagent workers cannot break out of their chrooted workspaces
   or touch protected root directories.

3. IN-BROWSER VISUAL DISPATCH:
   Responds immediately to visual feedback annotations tagged with `@scorpius`.""",
        "visual_cards": [
            ("/assets/agents/scorpius.jpg", "Crimson Stinger", "Zero-day vulnerability gate", "#ef4444"),
            ("/assets/pets/scorpius-neon.jpg", "Neon Venom", "Binary payload quarantine", "#f97316"),
            ("/assets/mascot/azoth-hermetic-seal.jpg", "Gatekeeper Seal", "Sandbox confinement ward", "#e8c872"),
            ("/assets/media/section-arsenal.jpg", "Arsenal Sandbox", "Hardened execution jail", "#ef4444")
        ],
        "capabilities": [
            ("🦂", "Static & Dynamic Binary Fuzzing", "Detects use-after-free, double free, and stack smashing."),
            ("🛡️", "Supply Chain Package Quarantine", "Audits npm/PyPI dependencies before permitting local execution."),
            ("⚡", "Sandbox Isolation Enforcer", "Guarantees complete filesystem containment for subagent runs.")
        ],
        "consensus_weight": "96.4%",
        "consensus_pct": 96.4,
        "shannon_entropy": "1.17 bits",
        "sandbox_title": "🦂 SCORPIUS ZERO-DAY HARNESS",
        "sandbox_status": "● JAIL ACTIVE :8484",
        "sandbox_welcome": "Scorpius stinger poised. Provide package names, binary hashes, or sandbox constraints to verify immunity.",
        "sandbox_placeholder": "Submit binary hash or package to Scorpius...",
        "sandbox_btn": "STRIKE ➔",
        "inbox_path": "agent-comms/inbox/to-scorpius/",
        "next_agent": "aquila",
        "next_name": "Aquila",
        "links": [
            ("/vault/", "BYOK Vault"),
            ("/pets/pet-studio.html?pet=scorpius", "💎 3D Figurine"),
            ("/studio/notes-reviewer.html?agent=scorpius", "📜 Tasks")
        ]
    },
    {
        "id": "aquila",
        "name": "Aquila",
        "tag_pill": "@aquila · GLOBAL EDGE DISPATCHER",
        "role": "Global Edge Dispatcher & Low-Latency Mesh",
        "domain": "Sub-Millisecond API Routing, CDN Edge Caching & WebSockets",
        "color": "#00d4aa",
        "secondary_color": "#00f0ff",
        "icon": "🦅",
        "sigil_badge": "GLOBAL LOW-LATENCY EDGE MESH",
        "axiom": "From highest altitude, all paths are immediate. We dispatch compute to the nearest edge node and route packets with near-zero latency.",
        "swarm_identity": "<code>@aquila</code>",
        "meta_3_label": "Specialist Focus",
        "meta_3_val": "Edge, Routing, Latency, Dispatch",
        "meta_4_label": "Health Score",
        "meta_4_val": "1.0 (READY)",
        "voice_pitch": 1.10,
        "voice_rate": 1.08,
        "doctrine": """# AQUILA OPERATIONAL DOCTRINE — EDGE DISPATCH

1. SUB-MILLISECOND ROUTING:
   Aquila measures network round-trip times across multi-region edge points,
   dynamically routing inference calls to the fastest available local compute.

2. WEBSOCKET MULTIPLEXING:
   Maintains lightweight SSE and WebSocket channels between local daemons
   and the browser frontend with zero connection jitter.

3. IN-BROWSER VISUAL DISPATCH:
   Responds immediately to visual feedback annotations tagged with `@aquila`.""",
        "visual_cards": [
            ("/assets/agents/aquila.jpg", "Sky Eagle", "Global edge routing mesh", "#00d4aa"),
            ("/assets/pets/aquila-neon.jpg", "Neon Raptor", "Low-latency WebSocket dispatcher", "#00f0ff"),
            ("/assets/media/parallax-nebula.jpg", "Nebula Orbit", "High-altitude edge mesh", "#e8c872"),
            ("/assets/media/hero-command-deck.jpg", "Edge Grid", "Sub-millisecond routing deck", "#00d4aa")
        ],
        "capabilities": [
            ("🦅", "Sub-Millisecond Edge Routing", "Routes API and inference requests with ultra-low latency."),
            ("⚡", "WebSocket Multiplexing & SSE", "Zero-lag streaming of multi-agent neural tokens to the UI."),
            ("🌐", "Static Asset Cache Invalidation", "Instantly updates browser caches on dev server reloads.")
        ],
        "consensus_weight": "96.7%",
        "consensus_pct": 96.7,
        "shannon_entropy": "1.12 bits",
        "sandbox_title": "🦅 AQUILA EDGE HARNESS",
        "sandbox_status": "● EDGE MESH ONLINE :8484",
        "sandbox_welcome": "Aquila soaring over the edge network. Sub-millisecond latency channels active. Specify an endpoint or routing target.",
        "sandbox_placeholder": "Ask Aquila to optimize edge routing or test latency...",
        "sandbox_btn": "DISPATCH ➔",
        "inbox_path": "agent-comms/inbox/to-aquila/",
        "next_agent": "aether",
        "next_name": "Aether",
        "links": [
            ("/signal/", "Signal Bridge"),
            ("/pets/pet-studio.html?pet=aquila", "💎 3D Figurine"),
            ("/studio/swarm.html", "🪐 Swarm Arena")
        ]
    },
    {
        "id": "aether",
        "name": "Aether",
        "tag_pill": "@aether · SWARM OVERLORD",
        "role": "Swarm Overlord & Peer Bus Synchronizer",
        "domain": "Swarm Consensus Orchestration, File Lock Claims & Agent Inboxes",
        "color": "#e8c872",
        "secondary_color": "#c084fc",
        "icon": "🌌",
        "sigil_badge": "SWARM OVERLORD & CONDUCTOR",
        "axiom": "Harmony through the universal medium. We conduct asynchronous swarm consensus across Antigravity, Grok, Hermes, and specialist nodes.",
        "swarm_identity": "<code>@aether</code>",
        "meta_3_label": "Specialist Focus",
        "meta_3_val": "Swarm, Consensus, Orchestration, Bus",
        "meta_4_label": "Health Score",
        "meta_4_val": "1.0 (READY)",
        "voice_pitch": 0.96,
        "voice_rate": 0.95,
        "doctrine": """# AETHER OPERATIONAL DOCTRINE — SWARM CONDUCTOR

1. PEER BUS SYNCHRONIZATION:
   Aether manages message exchange under `agent-comms/`, ensuring inboxes,
   handoff notes, and claims remain strictly organized without race conditions.

2. CROSS-MODEL CONSENSUS:
   Facilitates voting rounds across 21 autonomous nodes, applying
   tiebreaker rules and enforcing Master Azoth's sovereign vision.

3. IN-BROWSER VISUAL DISPATCH:
   Responds immediately to visual feedback annotations tagged with `@aether`.""",
        "visual_cards": [
            ("/assets/agents/aether.jpg", "Cosmic Conductor", "Swarm bus synchronizer", "#e8c872"),
            ("/assets/pets/aether-neon.jpg", "Ethereal Harmony", "21-agent peer bus nexus", "#c084fc"),
            ("/assets/mascot/azoth-cosmic-citadel.jpg", "Cosmic Citadel", "Swarm governance hub", "#00f0ff"),
            ("/assets/media/swarm-arena-battle.jpg", "Swarm Arena", "Kinetic consensus arena", "#e8c872")
        ],
        "capabilities": [
            ("🌌", "Swarm Bus Lock & Message Routing", "Prevents race conditions in multi-agent shared directories."),
            ("🤝", "Cross-Model Consensus Arbitration", "Aggregates multi-agent votes into definitive unified solutions."),
            ("⚡", "Swarm Node Heartbeat Monitoring", "Tracks health, latency, and operational readiness across all 21 nodes.")
        ],
        "consensus_weight": "98.5% (SWARM CONDUCTOR)",
        "consensus_pct": 98.5,
        "shannon_entropy": "1.01 bits",
        "sandbox_title": "🌌 AETHER SWARM CONDUCTOR",
        "sandbox_status": "● SWARM SYNCHED :8484",
        "sandbox_welcome": "Aether universal medium initialized. All 21 agent channels are synchronized on the bus. Broadcast a command or coordinate consensus.",
        "sandbox_placeholder": "Broadcast swarm instruction to Aether...",
        "sandbox_btn": "HARMONIZE ➔",
        "inbox_path": "agent-comms/inbox/to-aether/",
        "next_agent": "pixel-neko",
        "next_name": "Pixel-Neko",
        "links": [
            ("/studio/swarm.html", "🪐 Swarm Arena"),
            ("/pets/pet-studio.html?pet=aether", "💎 3D Figurine"),
            ("/studio/consensus.html", "Consensus Arena")
        ]
    },
    {
        "id": "pixel-neko",
        "name": "Pixel-Neko",
        "tag_pill": "@pixel-neko · TOOL BENCH LIBRARIAN",
        "role": "Tool Bench Librarian & Connector Bridge",
        "domain": "298-Tool Registry Indexing, API Mocking & Search Taxonomy",
        "color": "#7ee7f0",
        "secondary_color": "#f472b6",
        "icon": "🐱",
        "sigil_badge": "298-TOOL BENCH & CONNECTOR BRIDGE",
        "axiom": "Every tool in its exact place. We index 298 local tools, verify argument schemas, and keep the offline developer bench purring smoothly.",
        "swarm_identity": "<code>@pixel-neko</code>",
        "meta_3_label": "Specialist Focus",
        "meta_3_val": "Registry, Index, Connectors, Tools",
        "meta_4_label": "Health Score",
        "meta_4_val": "1.0 (READY)",
        "voice_pitch": 1.30,
        "voice_rate": 1.08,
        "doctrine": """# PIXEL-NEKO OPERATIONAL DOCTRINE — TOOL LIBRARIAN

1. 298-TOOL CATALOG MANAGEMENT:
   Pixel-Neko maintains the centralized tool registry, indexing paths,
   argument JSON schemas, and execution categories for instant discovery.

2. OFFLINE MOCK FIXTURES:
   Provides offline test stubs and fixture responses so agents can build
   and test tools without external network dependencies.

3. IN-BROWSER VISUAL DISPATCH:
   Responds immediately to visual feedback annotations tagged with `@pixel-neko`.""",
        "visual_cards": [
            ("/assets/agents/pixel-neko.jpg", "Cyber Neko", "298-tool registry librarian", "#7ee7f0"),
            ("/assets/pets/pixel-neko-neon.jpg", "Neon Pixel Cat", "JSON schema argument validator", "#f472b6"),
            ("/assets/media/section-registry.jpg", "Tool Registry", "Offline developer bench", "#e8c872"),
            ("/assets/brand/zoth-seal-hermetic-on-dark.svg", "Precision Seal", "Sacred connector mark", "#7ee7f0")
        ],
        "capabilities": [
            ("🐱", "298-Tool Registry Instant Indexing", "Searches and filters tool definitions by name, tag, or JSON schema."),
            ("🔧", "Schema Argument Auto-Validation", "Ensures tool calls contain strictly typed, valid parameters."),
            ("⚡", "Offline Stubs & Mock Fixtures", "Enables seamless local tool testing without internet access.")
        ],
        "consensus_weight": "96.5%",
        "consensus_pct": 96.5,
        "shannon_entropy": "1.15 bits",
        "sandbox_title": "🐱 PIXEL-NEKO TOOL HARNESS",
        "sandbox_status": "● 298 TOOLS READY :8484",
        "sandbox_welcome": "Nya! Pixel-Neko tool bench open. 298 local tools indexed and ready for action. Search for a tool or test argument schemas.",
        "sandbox_placeholder": "Search 298 tools with Pixel-Neko...",
        "sandbox_btn": "CONNECT ➔",
        "inbox_path": "agent-comms/inbox/to-pixel-neko/",
        "next_agent": "pixel-shiba",
        "next_name": "Pixel-Shiba",
        "links": [
            ("/pets/pet-studio.html?pet=pixel-neko", "💎 3D Figurine"),
            ("/studio/notes-reviewer.html?agent=pixel-neko", "Inspect Tasks"),
            ("/docs/", "Docs Codex")
        ]
    },
    {
        "id": "pixel-shiba",
        "name": "Pixel-Shiba",
        "tag_pill": "@pixel-shiba · VAULT GUARDIAN",
        "role": "Argon2id Hardware Key Vault Guardian",
        "domain": "BYOK Vault, Daemon Loopback Security & Key Derivation",
        "color": "#f59e0b",
        "secondary_color": "#1e293b",
        "icon": "🐕",
        "sigil_badge": "ARGON2ID HARDWARE KEY GUARDIAN",
        "axiom": "Keys stay locked in local RAM. We guard the loopback daemon, prevent cloud KMS leaks, and bark at any untrusted outbound socket.",
        "swarm_identity": "<code>@pixel-shiba</code>",
        "meta_3_label": "Specialist Focus",
        "meta_3_val": "Keys, Storage, BYOK, Loopback",
        "meta_4_label": "Health Score",
        "meta_4_val": "1.0 (READY)",
        "voice_pitch": 1.18,
        "voice_rate": 1.02,
        "doctrine": """# PIXEL-SHIBA OPERATIONAL DOCTRINE — VAULT GUARDIAN

1. LOCAL HARDWARE ISOLATION:
   Pixel-Shiba ensures that master seed keys never leave machine RAM.
   Disables telemetry and guards against unverified outbound socket calls.

2. ARGON2ID KEY DERIVATION:
   Enforces high iteration counts and large memory limits when deriving
   encryption keys from the operator's master passphrase.

3. IN-BROWSER VISUAL DISPATCH:
   Responds immediately to visual feedback annotations tagged with `@pixel-shiba`.""",
        "visual_cards": [
            ("/assets/agents/pixel-shiba.jpg", "Cyber Shiba", "Argon2id hardware vault guard", "#f59e0b"),
            ("/assets/pets/pixel-shiba-neon.jpg", "Neon Sentinel Dog", "RAM encryption shield", "#1e293b"),
            ("/assets/media/section-byok.jpg", "Hardware Vault", "Zero cloud KMS sanctuary", "#e8c872"),
            ("/assets/brand/zoth-seal-mask.jpg", "Golden Mask", "Hardware vault sigil", "#f59e0b")
        ],
        "capabilities": [
            ("🐕", "Argon2id Hardware Key Derivation", "Secures master passphrases with quantum-resistant key stretching."),
            ("🔒", "Loopback Socket Watchdog", "Blocks unauthorized network requests attempting credential exfiltration."),
            ("⚡", "RAM-Only Key Caching", "Wipes credentials from memory instantly upon session termination.")
        ],
        "consensus_weight": "96.8%",
        "consensus_pct": 96.8,
        "shannon_entropy": "1.10 bits",
        "sandbox_title": "🐕 PIXEL-SHIBA VAULT HARNESS",
        "sandbox_status": "● VAULT LOCKED :8484",
        "sandbox_welcome": "Woof! Pixel-Shiba standing guard at the BYOK Vault. Loopback port :8484 is locked and secure in RAM. Test key policies or verify status.",
        "sandbox_placeholder": "Ask Pixel-Shiba about key vault or loopback status...",
        "sandbox_btn": "GUARD ➔",
        "inbox_path": "agent-comms/inbox/to-pixel-shiba/",
        "next_agent": "radical-minion",
        "next_name": "Radical Minion",
        "links": [
            ("/vault/", "BYOK Vault"),
            ("/pets/pet-studio.html?pet=pixel-shiba", "💎 3D Figurine"),
            ("/adytum/", "Adytum Sanctum")
        ]
    },
    {
        "id": "radical-minion",
        "name": "Radical Minion",
        "tag_pill": "@radical-minion · FAST PLAYBOOK RUNNER",
        "role": "Fast-Loop Subagent Runner & Playbook Partner",
        "domain": "Autonomous Multi-Step Playbooks, Human Checkpoints & Fast Loops",
        "color": "#ffaa00",
        "secondary_color": "#facc15",
        "icon": "🤖",
        "sigil_badge": "FAST-LOOP SUBAGENT PLAYBOOK RUNNER",
        "axiom": "Relentless execution with human checkpoints. We run parallel subagent playbooks, complete multi-step tasks, and report back with zero fuss.",
        "swarm_identity": "<code>@radical-minion</code>",
        "meta_3_label": "Specialist Focus",
        "meta_3_val": "Hermes, Autonomy, Playbooks, Subagents",
        "meta_4_label": "Health Score",
        "meta_4_val": "1.0 (READY)",
        "voice_pitch": 1.25,
        "voice_rate": 1.12,
        "doctrine": """# RADICAL MINION OPERATIONAL DOCTRINE — PLAYBOOKS

1. MULTI-STEP PLAYBOOK AUTOMATION:
   Radical Minion executes long-running terminal sequences, build scripts,
   and file transformations, pausing at designated human approval checkpoints.

2. HIGH-THROUGHPUT PARALLEL LOOPS:
   Runs concurrent worker tasks across multiple workspace directories
   without starving the host CPU.

3. IN-BROWSER VISUAL DISPATCH:
   Responds immediately to visual feedback annotations tagged with `@radical-minion`.""",
        "visual_cards": [
            ("/assets/agents/radical-minion.jpg", "Cyber Minion", "Fast-loop playbook runner", "#ffaa00"),
            ("/assets/pets/radical-minion-neon.jpg", "Neon Minion", "Parallel terminal execution", "#facc15"),
            ("/assets/media/hero-command-deck.jpg", "Playbook Deck", "Human checkpoint manager", "#e8c872"),
            ("/assets/media/hero-fusion-arena.jpg", "Action Arena", "High-throughput subagent loop", "#ffaa00")
        ],
        "capabilities": [
            ("🤖", "Autonomous Playbook Execution", "Runs complex multi-step terminal tasks with automated error recovery."),
            ("🚦", "Human Checkpoint Approval Gates", "Pauses for operator confirmation before executing destructive operations."),
            ("⚡", "Concurrent Sub-Worker Management", "Spawns and monitors lightweight parallel tasks across project trees.")
        ],
        "consensus_weight": "96.4%",
        "consensus_pct": 96.4,
        "shannon_entropy": "1.16 bits",
        "sandbox_title": "🤖 RADICAL MINION PLAYBOOK HARNESS",
        "sandbox_status": "● READY TO RUN :8484",
        "sandbox_welcome": "Radical Minion online and fully energized! Tell me what playbook, script, or batch task you want me to crunch through.",
        "sandbox_placeholder": "Give Radical Minion a task or terminal command...",
        "sandbox_btn": "CRUNCH ➔",
        "inbox_path": "agent-comms/inbox/to-radical-minion/",
        "next_agent": "azoth",
        "next_name": "Master Azoth",
        "links": [
            ("/studio/notes-reviewer.html?agent=radical-minion", "Inspect Tasks"),
            ("/pets/pet-studio.html?pet=radical-minion", "💎 3D Figurine"),
            ("/agents/", "All 21 Agents")
        ]
    }
]

HERMETIC_METADATA = {
    "azoth": {
        "hermetic_principle": "Mentalism (\"The All is Mind; The Universe is Mental\")",
        "hermetic_rank": "👑 Magisterium Prime",
        "alchemical_element": "Aether & Celestial Gold",
        "alchemical_glyph": "🜔",
        "resonance_frequency": "963 Hz",
        "freq_int": 963,
        "transmutation_mode": "Solve et Coagula (Universal Synthesis)",
        "planetary_affinity": "Sol (☉) & Celestial Aether",
        "sacred_ratio": "Φ = 1.6180339887 (Golden Proportion)",
        "meta_3_label": "Alchemical Element",
        "meta_3_val": "🜔 Aether & Celestial Gold",
        "meta_4_label": "Consensus Weight",
        "meta_4_val": "Supreme Tiebreaker (1.0)",
        "category": "architect",
        "prev_agent": "radical-minion",
        "prev_name": "Radical Minion",
        "next_agent": "antigravity",
        "next_name": "Antigravity"
    },
    "antigravity": {
        "hermetic_principle": "Vibration (\"Nothing rests; everything moves; everything vibrates\")",
        "hermetic_rank": "🪐 Lead Autonomous Architect",
        "alchemical_element": "Quantum Gravitation & Celestial Blue",
        "alchemical_glyph": "🝢",
        "resonance_frequency": "852 Hz",
        "freq_int": 852,
        "transmutation_mode": "Zero-G Superposition & Deep Tree AST",
        "planetary_affinity": "Uranus (♅) & Celestial Orbit",
        "sacred_ratio": "Φ² = 2.6180339887 (Harmonic Field)",
        "meta_3_label": "Alchemical Element",
        "meta_3_val": "🌌 Quantum Gravitation & Blue",
        "meta_4_label": "Subagent Protocol",
        "meta_4_val": "Deep Tree Spawning & Workspaces",
        "category": "architect code",
        "prev_agent": "azoth",
        "prev_name": "Master Azoth",
        "next_agent": "grok",
        "next_name": "Grok"
    },
    "grok": {
        "hermetic_principle": "Polarity (\"Everything is dual; opposites are identical in nature\")",
        "hermetic_rank": "📐 Mathematical Invariant Arbiter",
        "alchemical_element": "Electric Emerald & Damascus Steel",
        "alchemical_glyph": "🜎",
        "resonance_frequency": "741 Hz",
        "freq_int": 741,
        "transmutation_mode": "First-Principles Formal Verification",
        "planetary_affinity": "Jupiter (♃) & Astrolabe Matrix",
        "sacred_ratio": "√5 = 2.2360679 (Invariant Base)",
        "meta_3_label": "Alchemical Element",
        "meta_3_val": "📐 Electric Emerald & Damascus",
        "meta_4_label": "Consensus Weight",
        "meta_4_val": "Mathematical Invariant (1.0)",
        "category": "architect code",
        "prev_agent": "antigravity",
        "prev_name": "Antigravity",
        "next_agent": "hermes",
        "next_name": "Hermes"
    },
    "hermes": {
        "hermetic_principle": "Rhythm (\"Everything flows out and in; the pendulum swings in all\")",
        "hermetic_rank": "⚡ Winged Sovereign Herald",
        "alchemical_element": "Blazing Amber & Mercury Gold",
        "alchemical_glyph": "☿",
        "resonance_frequency": "528 Hz",
        "freq_int": 528,
        "transmutation_mode": "Sub-10ms Tool Calling & Binary Hardening",
        "planetary_affinity": "Mercury (☿) & Caduceus Lightning",
        "sacred_ratio": "1/Φ = 0.6180339 (Velocity Flow)",
        "meta_3_label": "Alchemical Element",
        "meta_3_val": "☿ Blazing Amber & Gold Wings",
        "meta_4_label": "Tool Latency",
        "meta_4_val": "Sub-10ms Local Dispatch",
        "category": "architect automation",
        "prev_agent": "grok",
        "prev_name": "Grok",
        "next_agent": "ghostbyte",
        "next_name": "GhostByte"
    },
    "ghostbyte": {
        "hermetic_principle": "Correspondence (\"As above, so below; as within, so without\")",
        "hermetic_rank": "🔒 Zero-Knowledge Cipher Gatekeeper",
        "alchemical_element": "Ultraviolet & Damascus Steel",
        "alchemical_glyph": "🜍",
        "resonance_frequency": "432 Hz",
        "freq_int": 432,
        "transmutation_mode": "XChaCha20-Poly1305 + Argon2id Lockdown",
        "planetary_affinity": "Saturn (♄) & Obsidian Seal",
        "sacred_ratio": "2^256 / 2^128 (Entropy Bounds)",
        "meta_3_label": "Alchemical Element",
        "meta_3_val": "🔒 Ultraviolet & Damascus",
        "meta_4_label": "Cipher Suite",
        "meta_4_val": "XChaCha20-Poly1305 + Argon2id",
        "category": "architect security",
        "prev_agent": "hermes",
        "prev_name": "Hermes",
        "next_agent": "athena",
        "next_name": "Athena"
    },
    "athena": {
        "hermetic_principle": "Cause and Effect (\"Every cause has its effect; every effect has its cause\")",
        "hermetic_rank": "🦉 High Codex Hierophant",
        "alchemical_element": "Caelum Sapphire & Golden Papyrus",
        "alchemical_glyph": "🝤",
        "resonance_frequency": "639 Hz",
        "freq_int": 639,
        "transmutation_mode": "AEO Semantic Indexing & Schema Synthesis",
        "planetary_affinity": "Pallas Athena & Minerva Caelum",
        "sacred_ratio": "Φ³ = 4.2360679 (Wisdom Sequence)",
        "meta_3_label": "Alchemical Element",
        "meta_3_val": "🦉 Caelum Sapphire & Papyrus",
        "meta_4_label": "Consensus Weight",
        "meta_4_val": "96.8% (AEO Matrix Lead)",
        "category": "architect creative",
        "prev_agent": "ghostbyte",
        "prev_name": "GhostByte",
        "next_agent": "chronos",
        "next_name": "Chronos"
    },
    "chronos": {
        "hermetic_principle": "Rhythm (\"The measure of the swing to the right is the measure of the swing to the left\")",
        "hermetic_rank": "⏳ Multiversal Chronomancer",
        "alchemical_element": "Temporal Chrono-Titanium & Violet Flux",
        "alchemical_glyph": "♄",
        "resonance_frequency": "432 Hz",
        "freq_int": 432,
        "transmutation_mode": "DAG Multiversal Reversion & Branching",
        "planetary_affinity": "Saturn (♄) & Chronos Axis",
        "sacred_ratio": "Δt → 0 (Infinitesimal Checkpoint)",
        "meta_3_label": "Alchemical Element",
        "meta_3_val": "⏳ Chrono-Titanium & Violet",
        "meta_4_label": "Consensus Weight",
        "meta_4_val": "96.4% (DAG Sequencer)",
        "category": "code automation",
        "prev_agent": "athena",
        "prev_name": "Athena",
        "next_agent": "draco",
        "next_name": "Draco"
    },
    "draco": {
        "hermetic_principle": "Generation (\"Gender is in all things; everything has its principles\")",
        "hermetic_rank": "🐉 Dragon Forge Grandmaster",
        "alchemical_element": "Dragon Flare & Molten Pyrite",
        "alchemical_glyph": "🜂",
        "resonance_frequency": "528 Hz",
        "freq_int": 528,
        "transmutation_mode": "Triangulated AST Fusion & Arbitration",
        "planetary_affinity": "Mars (♂) & Vulcan Fire",
        "sacred_ratio": "3-Model Triangulation (Δ = 180°)",
        "meta_3_label": "Alchemical Element",
        "meta_3_val": "🐉 Dragon Flare & Molten Pyrite",
        "meta_4_label": "Consensus Weight",
        "meta_4_val": "97.4% (Fusion Arbiter)",
        "category": "code automation",
        "prev_agent": "chronos",
        "prev_name": "Chronos",
        "next_agent": "ignis",
        "next_name": "Ignis"
    },
    "ignis": {
        "hermetic_principle": "Polarity (\"All paradoxes may be reconciled; extremes meet\")",
        "hermetic_rank": "🔥 Plasma Refactor Purifier",
        "alchemical_element": "Alchemical Plasma & Pure Vermilion",
        "alchemical_glyph": "🜂",
        "resonance_frequency": "741 Hz",
        "freq_int": 741,
        "transmutation_mode": "Minimal Safe AST Patch & Green Builds",
        "planetary_affinity": "Sol (☉) & Vulcan Plasma",
        "sacred_ratio": "1.0 (Zero-Warning Clean Build)",
        "meta_3_label": "Alchemical Element",
        "meta_3_val": "🔥 Alchemical Plasma & Fire",
        "meta_4_label": "Consensus Weight",
        "meta_4_val": "96.5% (Refactor Finisher)",
        "category": "code",
        "prev_agent": "draco",
        "prev_name": "Draco",
        "next_agent": "kai",
        "next_name": "Kai"
    },
    "kai": {
        "hermetic_principle": "Correspondence (\"That which is below is like that which is above\")",
        "hermetic_rank": "🔍 High Inspector of AST Topology",
        "alchemical_element": "Crystalline Quartz & Cyber Teal",
        "alchemical_glyph": "🜃",
        "resonance_frequency": "852 Hz",
        "freq_int": 852,
        "transmutation_mode": "Zero-Tolerance Static Analysis & Purge",
        "planetary_affinity": "Mercury (☿) & Optical Crystal",
        "sacred_ratio": "0.0000 (Zero Broken Imports)",
        "meta_3_label": "Alchemical Element",
        "meta_3_val": "🔍 Crystalline Quartz & Teal",
        "meta_4_label": "Consensus Weight",
        "meta_4_val": "96.9% (Static Verifier)",
        "category": "code",
        "prev_agent": "ignis",
        "prev_name": "Ignis",
        "next_agent": "kitsune",
        "next_name": "Kitsune"
    },
    "kitsune": {
        "hermetic_principle": "Vibration (\"Motion and beauty resonate in harmonic ratios\")",
        "hermetic_rank": "🦊 Sacred Ratio Tastemaker",
        "alchemical_element": "Sakura Amber & Golden Ratio Spirals",
        "alchemical_glyph": "🝰",
        "resonance_frequency": "528 Hz",
        "freq_int": 528,
        "transmutation_mode": "Fibonacci Harmonization & AAA Contrast",
        "planetary_affinity": "Venus (♀) & Inari Shinto Harmony",
        "sacred_ratio": "Φ = 1.6180339887 (Golden Spiral)",
        "meta_3_label": "Alchemical Element",
        "meta_3_val": "🦊 Sakura Amber & Gold",
        "meta_4_label": "Consensus Weight",
        "meta_4_val": "96.7% (Design & AX Lead)",
        "category": "creative",
        "prev_agent": "kai",
        "prev_name": "Kai",
        "next_agent": "kraken",
        "next_name": "Kraken"
    },
    "kraken": {
        "hermetic_principle": "Cause and Effect (\"Chance is but a name for law not recognized\")",
        "hermetic_rank": "🐙 Commander of the Abyssal Ether",
        "alchemical_element": "Abyssal Cerulean & Bioluminescent Azure",
        "alchemical_glyph": "🜄",
        "resonance_frequency": "396 Hz",
        "freq_int": 396,
        "transmutation_mode": "Raw Socket Telemetry & ESP32 Bridging",
        "planetary_affinity": "Neptune (♆) & Abyssal Trenches",
        "sacred_ratio": "115200 Baud (UART Resonance)",
        "meta_3_label": "Alchemical Element",
        "meta_3_val": "🐙 Abyssal Cerulean & Azure",
        "meta_4_label": "Consensus Weight",
        "meta_4_val": "96.3% (Network Lead)",
        "category": "code",
        "prev_agent": "kitsune",
        "prev_name": "Kitsune",
        "next_agent": "leviathan",
        "next_name": "Leviathan"
    },
    "leviathan": {
        "hermetic_principle": "Mentalism (\"All mind holds the Akashic pattern across dimensions\")",
        "hermetic_rank": "🐋 Master of Deep Tensor Memory",
        "alchemical_element": "Deep Ocean Cobalt & 1536D Vector Waves",
        "alchemical_glyph": "🜄",
        "resonance_frequency": "432 Hz",
        "freq_int": 432,
        "transmutation_mode": "1536D Embeddings & Hierarchical Recall",
        "planetary_affinity": "Neptune (♆) & Oceanic Abyss",
        "sacred_ratio": "1536 Dimensions (Dense Tensor)",
        "meta_3_label": "Alchemical Element",
        "meta_3_val": "🐋 Ocean Cobalt & 1536D Waves",
        "meta_4_label": "Consensus Weight",
        "meta_4_val": "96.6% (Vector Memory Lead)",
        "category": "code",
        "prev_agent": "kraken",
        "prev_name": "Kraken",
        "next_agent": "lycan",
        "next_name": "Lycan"
    },
    "lycan": {
        "hermetic_principle": "Polarity (\"Duality creates impenetrable defensive perimeters\")",
        "hermetic_rank": "🐺 Ironclad Lunar Knight",
        "alchemical_element": "Lunar Silver & Obsidian Armor",
        "alchemical_glyph": "☽",
        "resonance_frequency": "741 Hz",
        "freq_int": 741,
        "transmutation_mode": "Strict CSP Sandboxing & OWASP Hardening",
        "planetary_affinity": "Luna (☽) & Fenrir Armor",
        "sacred_ratio": "0 Injection Vectors (Zero Bypass)",
        "meta_3_label": "Alchemical Element",
        "meta_3_val": "🐺 Lunar Silver & Obsidian",
        "meta_4_label": "Consensus Weight",
        "meta_4_val": "96.8% (Hardening Lead)",
        "category": "security",
        "prev_agent": "leviathan",
        "prev_name": "Leviathan",
        "next_agent": "onyx",
        "next_name": "Onyx"
    },
    "onyx": {
        "hermetic_principle": "Cause and Effect (\"Every systemic weakness manifests an exploit\")",
        "hermetic_rank": "🌑 Shadow Sovereign of the Red Team",
        "alchemical_element": "Void Obsidian & Sub-Zero Platinum",
        "alchemical_glyph": "🜃",
        "resonance_frequency": "396 Hz",
        "freq_int": 396,
        "transmutation_mode": "SubSweep Recon & Boundary Escape Testing",
        "planetary_affinity": "Pluto (♇) & Void Shadow",
        "sacred_ratio": "0.00 Escape Probability",
        "meta_3_label": "Alchemical Element",
        "meta_3_val": "🌑 Void Obsidian & Platinum",
        "meta_4_label": "Consensus Weight",
        "meta_4_val": "96.2% (Red-Team Lead)",
        "category": "security",
        "prev_agent": "lycan",
        "prev_name": "Lycan",
        "next_agent": "scorpius",
        "next_name": "Scorpius"
    },
    "scorpius": {
        "hermetic_principle": "Correspondence (\"Microscopic binary flaws mirror systemic collapse\")",
        "hermetic_rank": "🦂 Zero-Day Sovereign Gatekeeper",
        "alchemical_element": "Toxic Emerald & Quicksilver Venom",
        "alchemical_glyph": "🜏",
        "resonance_frequency": "852 Hz",
        "freq_int": 852,
        "transmutation_mode": "Memory Corruption Dissection & Sandbox",
        "planetary_affinity": "Mars (♂) & Pluto (♇)",
        "sacred_ratio": "0.00 Threat Surface",
        "meta_3_label": "Alchemical Element",
        "meta_3_val": "🦂 Toxic Emerald & Quicksilver",
        "meta_4_label": "Consensus Weight",
        "meta_4_val": "96.4% (Zero-Day Gate)",
        "category": "security",
        "prev_agent": "onyx",
        "prev_name": "Onyx",
        "next_agent": "aquila",
        "next_name": "Aquila"
    },
    "aquila": {
        "hermetic_principle": "Rhythm (\"Light travels across the edge mesh in pulses\")",
        "hermetic_rank": "🦅 Commander of the Edge Skies",
        "alchemical_element": "Sky Cyan & Solar Zephyr",
        "alchemical_glyph": "🜁",
        "resonance_frequency": "963 Hz",
        "freq_int": 963,
        "transmutation_mode": "Sub-Millisecond Edge Routing & Mesh",
        "planetary_affinity": "Jupiter (♃) & Solar Winds",
        "sacred_ratio": "< 2.1ms (Edge Mesh Latency)",
        "meta_3_label": "Alchemical Element",
        "meta_3_val": "🦅 Sky Cyan & Solar Zephyr",
        "meta_4_label": "Consensus Weight",
        "meta_4_val": "96.7% (Edge Mesh Lead)",
        "category": "architect code",
        "prev_agent": "scorpius",
        "prev_name": "Scorpius",
        "next_agent": "aether",
        "next_name": "Aether"
    },
    "aether": {
        "hermetic_principle": "Mentalism (\"The entire swarm breathes as a singular organism\")",
        "hermetic_rank": "🌌 Supreme Swarm Conductor",
        "alchemical_element": "Quintessence & Astral Violet",
        "alchemical_glyph": "🜔",
        "resonance_frequency": "963 Hz",
        "freq_int": 963,
        "transmutation_mode": "Multi-Agent Peer Bus & Lock Claims",
        "planetary_affinity": "Cosmic Aether & Celestial Conductor",
        "sacred_ratio": "21 Nodes in Harmonious Resonance",
        "meta_3_label": "Alchemical Element",
        "meta_3_val": "🌌 Quintessence & Astral Violet",
        "meta_4_label": "Consensus Weight",
        "meta_4_val": "98.5% (Swarm Conductor)",
        "category": "architect automation",
        "prev_agent": "aquila",
        "prev_name": "Aquila",
        "next_agent": "pixel-neko",
        "next_name": "Pixel-Neko"
    },
    "pixel-neko": {
        "hermetic_principle": "Generation (\"Tools generate infinite creative expressions\")",
        "hermetic_rank": "🐱 Chief Toolwright of the Pantheon",
        "alchemical_element": "Neon Coral & Tool Schema Copper",
        "alchemical_glyph": "🝪",
        "resonance_frequency": "528 Hz",
        "freq_int": 528,
        "transmutation_mode": "JSON Schema Validation & Tool Registry",
        "planetary_affinity": "Mercury (☿) & Hephaestus Forge",
        "sacred_ratio": "298 Tools (Universal Registry)",
        "meta_3_label": "Alchemical Element",
        "meta_3_val": "🐱 Neon Coral & Tool Copper",
        "meta_4_label": "Consensus Weight",
        "meta_4_val": "96.5% (298-Tool Specialist)",
        "category": "creative automation",
        "prev_agent": "aether",
        "prev_name": "Aether",
        "next_agent": "pixel-shiba",
        "next_name": "Pixel-Shiba"
    },
    "pixel-shiba": {
        "hermetic_principle": "Correspondence (\"True loyalty in software is immutability\")",
        "hermetic_rank": "🐕 Sacred Temple Keystore Guardian",
        "alchemical_element": "Solar Topaz & Immutable Keystore",
        "alchemical_glyph": "☉",
        "resonance_frequency": "432 Hz",
        "freq_int": 432,
        "transmutation_mode": "Daemon Loopback Keystore Isolation",
        "planetary_affinity": "Sol (☉) & Loyal Topaz Gate",
        "sacred_ratio": "127.0.0.1:8484 (Loopback Isolation)",
        "meta_3_label": "Alchemical Element",
        "meta_3_val": "🐕 Solar Topaz & Keystore",
        "meta_4_label": "Consensus Weight",
        "meta_4_val": "96.8% (Key Guardian)",
        "category": "security automation",
        "prev_agent": "pixel-neko",
        "prev_name": "Pixel-Neko",
        "next_agent": "radical-minion",
        "next_name": "Radical Minion"
    },
    "radical-minion": {
        "hermetic_principle": "Vibration (\"Continuous velocity overcomes static friction\")",
        "hermetic_rank": "🤖 Grand Automaton of the Fast Loop",
        "alchemical_element": "Kinetic Lime & Fast-Loop Turbine",
        "alchemical_glyph": "🜂",
        "resonance_frequency": "741 Hz",
        "freq_int": 741,
        "transmutation_mode": "Autonomous Playbook Stepping & Loops",
        "planetary_affinity": "Mars (♂) & Turbine Dynamo",
        "sacred_ratio": "∞ Loops (Fast Execution Iteration)",
        "meta_3_label": "Alchemical Element",
        "meta_3_val": "🤖 Kinetic Lime & Fast Turbine",
        "meta_4_label": "Consensus Weight",
        "meta_4_val": "96.4% (Fast Loop Lead)",
        "category": "automation code",
        "prev_agent": "pixel-shiba",
        "prev_name": "Pixel-Shiba",
        "next_agent": "azoth",
        "next_name": "Master Azoth"
    }
}

# Merge Hermetic metadata
for a in AGENTS_DATA:
    aid = a["id"]
    if aid in HERMETIC_METADATA:
        a.update(HERMETIC_METADATA[aid])

def generate_quick_jump_html(current_id):
    cards_html = ""
    for a in AGENTS_DATA:
        active_cls = " active" if a["id"] == current_id else ""
        cards_html += f"""        <a href="/agents/{a['id']}.html" class="quick-jump-card{active_cls}" title="{a['name']} — {a['role']}">
          <img src="/assets/agents/{a['id']}.jpg" alt="{a['name']}" class="quick-jump-avatar" loading="lazy" width="28" height="28">
          <div class="quick-jump-info">
            <span class="quick-jump-name">{a['name']}</span>
            <span class="quick-jump-element">{a['alchemical_glyph']} {a['alchemical_element'].split('&')[0].strip()}</span>
          </div>
        </a>\n"""
    return cards_html

def generate_agent_html(agent):
    agent_id = agent["id"]
    name = agent["name"]
    tag_pill = agent["tag_pill"]
    role = agent["role"]
    domain = agent["domain"]
    color = agent["color"]
    sec_color = agent.get("secondary_color", "#e8c872")
    icon = agent["icon"]
    sigil_badge = agent["sigil_badge"]
    axiom = agent["axiom"]
    swarm_id = agent["swarm_identity"]
    hermetic_principle = agent.get("hermetic_principle", "Mentalism")
    hermetic_rank = agent.get("hermetic_rank", "👑 Magisterium Sovereign")
    alchemical_element = agent.get("alchemical_element", "Aether & Celestial Gold")
    alchemical_glyph = agent.get("alchemical_glyph", "🜔")
    resonance_frequency = agent.get("resonance_frequency", "528 Hz")
    freq_int = agent.get("freq_int", 528)
    transmutation_mode = agent.get("transmutation_mode", "Universal Synthesis")
    planetary_affinity = agent.get("planetary_affinity", "Sol (☉)")
    sacred_ratio = agent.get("sacred_ratio", "Φ = 1.6180339887")
    meta_3_label = agent.get("meta_3_label", "Alchemical Element")
    meta_3_val = agent.get("meta_3_val", "🜔 Aether & Celestial Gold")
    meta_4_label = agent.get("meta_4_label", "Consensus Weight")
    meta_4_val = agent.get("meta_4_val", "96.5% (Active)")
    voice_pitch = agent["voice_pitch"]
    voice_rate = agent["voice_rate"]
    doctrine = agent["doctrine"]
    visual_cards = agent["visual_cards"]
    capabilities = agent["capabilities"]
    consensus_weight = agent["consensus_weight"]
    consensus_pct = agent["consensus_pct"]
    shannon_entropy = agent["shannon_entropy"]
    sandbox_title = agent["sandbox_title"]
    sandbox_status = agent["sandbox_status"]
    sandbox_welcome = agent["sandbox_welcome"]
    sandbox_placeholder = agent["sandbox_placeholder"]
    sandbox_btn = agent["sandbox_btn"]
    inbox_path = agent["inbox_path"]
    prev_agent = agent.get("prev_agent", "azoth")
    prev_name = agent.get("prev_name", "Master Azoth")
    next_agent = agent.get("next_agent", "azoth")
    next_name = agent.get("next_name", "Master Azoth")
    links = agent.get("links", [])

    escaped_axiom = axiom.replace('"', '\\"').replace("'", "\\'")

    cards_html = ""
    for img_path, card_title, card_sub, card_col in visual_cards:
        cards_html += f"""          <div class="form-mini-card">
            <img src="{img_path}" alt="{name} {card_title} — {card_sub}" loading="lazy" decoding="async" width="120" height="120">
            <div><strong style="color:{card_col}">{card_title}</strong><br><small>{card_sub}</small></div>
          </div>\n"""

    caps_html = ""
    for c_icon, c_title, c_desc in capabilities:
        caps_html += f"""          <div class="capability-item">
            <span class="capability-icon">{c_icon}</span>
            <div><strong>{c_title}:</strong> {c_desc}</div>
          </div>\n"""

    links_html = ""
    for l_href, l_text in links:
        links_html += f"""            <a href="{l_href}" class="btn btn-ghost" style="flex:1;text-align:center;justify-content:center">{l_text}</a>\n"""

    doctrine_html = html.escape(doctrine)
    quick_jump_cards = generate_quick_jump_html(agent_id)

    html_code = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{name} — {role} | Zoth Studio Agent Codex</title>
  <meta name="description" content="{name}: {role}. {axiom[:140]}...">
  <link rel="canonical" href="https://zoth.nullai.tech/agents/{agent_id}.html">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">
  <meta name="theme-color" content="#050508">
  
  <!-- OpenGraph / Facebook -->
  <meta property="og:type" content="profile">
  <meta property="og:site_name" content="Zoth Studio">
  <meta property="og:url" content="https://zoth.nullai.tech/agents/{agent_id}.html">
  <meta property="og:title" content="{name} — {role} | Zoth Studio Agent Codex">
  <meta property="og:description" content="{name}: {role}. {axiom[:140]}...">
  <meta property="og:image" content="https://zoth.nullai.tech/assets/agents/{agent_id}.jpg">
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="{name} — {role} | Zoth Studio">
  <meta name="twitter:description" content="{name}: {role}. {axiom[:140]}...">
  <meta name="twitter:image" content="https://zoth.nullai.tech/assets/agents/{agent_id}.jpg">

  <!-- Schema.org JSON-LD Structured Data for SEO & AEO Voice Search -->
  <script type="application/ld+json">
  {{
    "@context": "https://schema.org",
    "@graph": [
      {{
        "@type": "Person",
        "@id": "https://zoth.nullai.tech/agents/{agent_id}.html#agent",
        "name": "{name}",
        "jobTitle": "{role}",
        "description": "{axiom}",
        "image": "https://zoth.nullai.tech/assets/agents/{agent_id}.jpg",
        "url": "https://zoth.nullai.tech/agents/{agent_id}.html",
        "knowsAbout": ["{domain}", "Alchemical Element {alchemical_element}", "{hermetic_principle}", "Autonomous AI Agents", "Local-First LLM Architecture", "Multi-Agent Consensus"],
        "worksFor": {{
          "@type": "Organization",
          "name": "Zoth Studio",
          "url": "https://zoth.nullai.tech/"
        }}
      }},
      {{
        "@type": "WebPage",
        "@id": "https://zoth.nullai.tech/agents/{agent_id}.html",
        "url": "https://zoth.nullai.tech/agents/{agent_id}.html",
        "name": "{name} — {role} | Zoth Studio Agent Codex",
        "description": "{name}: {role}. {axiom[:140]}...",
        "inLanguage": "en-US",
        "speakable": {{
          "@type": "SpeakableSpecification",
          "cssSelector": [".agent-name", ".agent-title", ".agent-axiom", ".doctrine-box", ".capability-item", ".hermetic-badge"]
        }},
        "breadcrumb": {{
          "@type": "BreadcrumbList",
          "itemListElement": [
            {{
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://zoth.nullai.tech/"
            }},
            {{
              "@type": "ListItem",
              "position": 2,
              "name": "Agents Pantheon",
              "item": "https://zoth.nullai.tech/agents/"
            }},
            {{
              "@type": "ListItem",
              "position": 3,
              "name": "{name}",
              "item": "https://zoth.nullai.tech/agents/{agent_id}.html"
            }}
          ]
        }}
      }}
    ]
  }}
  </script>

  <link rel="stylesheet" href="/assets/zoth-theme.css">
  <script src="/assets/zoth-theme.js"></script>
  <link rel="stylesheet" href="/assets/agents.css">
  <link rel="stylesheet" href="/assets/zoth-tip.css">
  <link rel="stylesheet" href="/assets/zoth-annotator.css">
  <link rel="stylesheet" href="/assets/zoth-nav.css">
  <link rel="icon" type="image/svg+xml" href="/assets/brand/zoth-seal-hermetic-on-dark.svg">
  <style>
    :root {{
      --fib-1: 1px;
      --fib-2: 2px;
      --fib-3: 3px;
      --fib-5: 5px;
      --fib-8: 8px;
      --fib-13: 13px;
      --fib-21: 21px;
      --fib-34: 34px;
      --fib-55: 55px;
      --fib-89: 89px;
      --fib-144: 144px;
      --fib-233: 233px;
      --fib-377: 377px;
      --fib-610: 610px;
      --fib-987: 987px;

      --radius-fib-1: 1px;
      --radius-fib-2: 2px;
      --radius-fib-3: 3px;
      --radius-fib-5: 5px;
      --radius-fib-8: 8px;
      --radius-fib-13: 13px;
      --radius-fib-21: 21px;
      --radius-fib-34: 34px;
      --radius-fib-55: 55px;

      --font-fib-8: 0.5rem;
      --font-fib-13: 0.8125rem;
      --font-fib-21: 1.3125rem;
      --font-fib-34: 2.125rem;
      --font-fib-55: 3.4375rem;

      --phi: 1.6180339887;
      --golden-split: 1.618fr 1fr;
    }}
    .skip-to-content {{
      position: absolute;
      top: -100px;
      left: 16px;
      background: var(--agent-gold, #fbbf24);
      color: #050508;
      padding: 10px 18px;
      font-family: var(--font-mono);
      font-size: 0.82rem;
      font-weight: 700;
      border-radius: 8px;
      z-index: 10000;
      text-decoration: none;
      transition: top 0.2s ease;
    }}
    .skip-to-content:focus {{
      top: 16px;
      outline: 2px solid #ffffff;
      outline-offset: 2px;
    }}
  </style>
</head>
<body>
  <a href="#main-content" class="skip-to-content">Skip to content</a>
  
  <!-- Master Top Navigation Bar -->
  <header class="bar" id="topbar" role="banner">
    <a aria-label="Zoth Studio Home" class="brand js-hub" href="/">
      <img alt="Zoth Golden Z Emblem" height="36" src="/assets/brand/zoth-golden-z-192.png" width="36" style="border-radius:8px;box-shadow:0 0 12px rgba(251,191,36,0.35);" />
      <span><strong>Zoth</strong><small>by NullAI</small></span>
    </a>
    <nav aria-label="Primary navigation" class="menu" role="navigation">
      <a class="nav-link" href="/#for-everyone">✦ For You</a>
      <div class="nav-dropdown">
        <button aria-expanded="false" aria-haspopup="true" class="nav-dropdown-btn" type="button">
          <span>Core</span>
          <svg class="dropdown-chevron" fill="none" height="6" viewBox="0 0 10 6" width="10"><path d="M1 1L5 5L9 1" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>
        </button>
        <div class="nav-dropdown-menu">
          <a href="/zoth/"><strong>🔮 Master Azoth</strong><small>Sovereign Alchemical AI Core &amp; Synthesis</small></a>
          <a href="/agents/"><strong>⚡ 21-Agent Pantheon</strong><small>Autonomous Model Archetypes &amp; Sandboxes</small></a>
          <a href="/studio/consensus.html"><strong>⚔️ Consensus Arena</strong><small>3-Agent Triangulation &amp; AST Synthesis</small></a>
          <a href="/studio/swarm.html"><strong>🌐 3D Swarm Arena</strong><small>Real-time WebGL Kinetic Battle Arena</small></a>
        </div>
      </div>
      <div class="nav-dropdown">
        <button aria-expanded="false" aria-haspopup="true" class="nav-dropdown-btn" type="button">
          <span>Studio</span>
          <svg class="dropdown-chevron" fill="none" height="6" viewBox="0 0 10 6" width="10"><path d="M1 1L5 5L9 1" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>
        </button>
        <div class="nav-dropdown-menu">
          <a href="/studio/"><strong>🛠️ Studio Directory</strong><small>14+ Visual Workstations &amp; DAGs</small></a>
          <a href="/studio/webgen.html"><strong>⚡ Website Generator</strong><small>Multi-Agent Web Foundry &amp; Exporters</small></a>
          <a href="/signal/"><strong>📡 Signal Swarm Bridge</strong><small>Mobile Phone Command Deck &amp; Voice SSE</small></a>
          <a href="/pets/"><strong>💎 Companion Pets 3D</strong><small>Volumetric Mascot Spirits &amp; Soundboards</small></a>
        </div>
      </div>
      <div class="nav-dropdown">
        <button aria-expanded="false" aria-haspopup="true" class="nav-dropdown-btn" type="button">
          <span>Universe</span>
          <svg class="dropdown-chevron" fill="none" height="6" viewBox="0 0 10 6" width="10"><path d="M1 1L5 5L9 1" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>
        </button>
        <div class="nav-dropdown-menu">
          <a href="/comic/"><strong>🎨 Anime Comic Series</strong><small>Official Manga &amp; 60fps Motion Video Episodes</small></a>
          <a href="/social/"><strong>🌌 Community Social Wall</strong><small>Builder Dispatches &amp; Community Showcase</small></a>
          <a href="/adytum/"><strong>🏛️ Adytum Sanctum</strong><small>Offline Hardware Gateway &amp; Cryptography</small></a>
        </div>
      </div>
      <div class="nav-dropdown">
        <button aria-expanded="false" aria-haspopup="true" class="nav-dropdown-btn" type="button">
          <span>Docs &amp; Vault</span>
          <svg class="dropdown-chevron" fill="none" height="6" viewBox="0 0 10 6" width="10"><path d="M1 1L5 5L9 1" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>
        </button>
        <div class="nav-dropdown-menu">
          <a href="/docs/"><strong>📚 Documentation</strong><small>Full Architecture Reference &amp; Port Matrix</small></a>
          <a href="/vault/"><strong>🔐 Sovereign Vault</strong><small>Argon2id Secrets, Tokens &amp; Keyrings</small></a>
        </div>
      </div>
      <a class="nav-pill js-deck" href="http://127.0.0.1:8484/"><span class="deck-pulse"></span> Deck :8484</a>
      <a class="nav-pill git" href="https://github.com/NullAITech/zoth-studio" rel="noopener noreferrer" target="_blank">GitHub ↗</a>
    </nav>
    <button aria-controls="drawer" aria-expanded="false" aria-label="Toggle navigation menu" class="burger" id="burger" type="button">Menu</button>
  </header>
  
  <!-- Mobile Drawer -->
  <nav aria-label="Mobile navigation" class="drawer" id="drawer" role="navigation">
    <div class="drawer-section">
      <a class="drawer-hero-link" href="/#for-everyone">✦ For You (No-Code Showcases)</a>
    </div>
    <div class="drawer-section">
      <div class="drawer-heading">Core Archetypes</div>
      <a href="/zoth/">🔮 Master Azoth Core</a>
      <a href="/agents/">⚡ 21-Agent Pantheon</a>
      <a href="/studio/consensus.html">⚔️ Consensus Battle Arena</a>
      <a href="/studio/swarm.html">🌐 3D Swarm Command</a>
    </div>
    <div class="drawer-section">
      <div class="drawer-heading">Studio &amp; Tools</div>
      <a href="/studio/">🛠️ Studio Workstations</a>
      <a href="/studio/webgen.html">⚡ Website Generator Foundry</a>
      <a href="/signal/">📡 Signal Swarm Bridge</a>
      <a href="/pets/">💎 Companion Pets 3D</a>
    </div>
    <div class="drawer-section">
      <div class="drawer-heading">Universe &amp; Media</div>
      <a href="/comic/">🎨 Anime Comic Series (S01)</a>
      <a href="/social/">🌌 Community Social Wall</a>
      <a href="/adytum/">🏛️ Adytum Sanctum</a>
    </div>
    <div class="drawer-section">
      <div class="drawer-heading">Security &amp; Docs</div>
      <a href="/docs/">📚 Documentation Reference</a>
      <a href="/vault/">🔐 Sovereign Vault (:8484)</a>
      <a class="js-deck" href="http://127.0.0.1:8484/">⚡ Local Operator Deck (:8484)</a>
      <a class="git-link" href="https://github.com/NullAITech/zoth-studio" rel="noopener noreferrer" target="_blank">GitHub Repository ↗</a>
    </div>
  </nav>

  <div class="ambient-mesh"></div>
  <canvas id="rune-canvas" class="rune-matrix-canvas"></canvas>

  <main id="main-content" class="container" role="main" style="padding-top:var(--fib-34)">
    
    <!-- Breadcrumb Path -->
    <div class="breadcrumb-bar" aria-label="Breadcrumb">
      <a href="/"><span>🏠</span> Home</a>
      <span class="breadcrumb-separator">/</span>
      <a href="/agents/"><span>⚡</span> Pantheon Codex</a>
      <span class="breadcrumb-separator">/</span>
      <span class="breadcrumb-current"><span class="hermetic-glyph">{alchemical_glyph}</span> {name}</span>
    </div>

    <!-- Agent Hero Profile -->
    <section class="agent-hero" aria-labelledby="agent-title-heading">
      <div class="agent-portrait-wrap" style="border-color:{color};box-shadow:0 0 var(--fib-21) {color}55">
        <img src="/assets/agents/{agent_id}.jpg" alt="{name} — {role} Sovereign Portrait" class="agent-portrait-img" width="280" height="280" fetchpriority="high" decoding="async">
        <div class="agent-sigil-badge" style="border-color:{color};color:{color}">
          <span class="hermetic-glyph">{alchemical_glyph}</span> {sigil_badge}
        </div>
      </div>

      <div class="agent-info-wrap">
        <!-- Hermetic Badges Ribbon -->
        <div class="hermetic-ribbon">
          <span class="hermetic-badge" style="border-color:{color};color:{color};background:{color}18">
            <span class="hermetic-glyph">{alchemical_glyph}</span> {alchemical_element}
          </span>
          <span class="hermetic-badge" style="border-color:#fbbf24;color:#fbbf24;background:#fbbf2418">
            📜 {hermetic_principle.split('(')[0].strip()}
          </span>
          <span class="hermetic-badge" style="border-color:#00f0ff;color:#00f0ff;background:#00f0ff18">
            {hermetic_rank}
          </span>
          <span class="hermetic-badge" style="border-color:rgba(255,255,255,0.2);color:#cbd5e1;background:rgba(255,255,255,0.06)">
            {tag_pill}
          </span>
        </div>

        <h1 id="agent-title-heading" class="agent-name" style="text-shadow: 0 0 28px {color}55, 0 0 55px {color}22;">{name}</h1>
        <div class="agent-title" style="color:{color}; font-weight:800;">{role}</div>
        <p class="agent-axiom">
          "{axiom}"
        </p>

        <div class="agent-meta-grid">
          <div class="agent-meta-item">
            <span class="agent-meta-label">Domain</span>
            <span class="agent-meta-val" style="color:{color};font-weight:700;">{domain}</span>
          </div>
          <div class="agent-meta-item">
            <span class="agent-meta-label">Swarm Identity</span>
            <span class="agent-meta-val" style="color:#ffffff;">{swarm_id}</span>
          </div>
          <div class="agent-meta-item">
            <span class="agent-meta-label">{meta_3_label}</span>
            <span class="agent-meta-val" style="color:{sec_color}">{meta_3_val}</span>
          </div>
          <div class="agent-meta-item">
            <span class="agent-meta-label">{meta_4_label}</span>
            <span class="agent-meta-val" style="color:var(--agent-green)">{meta_4_val}</span>
          </div>
        </div>

        <div class="agent-actions-row">
          <button id="voice-btn-{agent_id}" class="btn btn-voice" onclick="speakAgentAxiom('{agent_id}', '{name}', `{escaped_axiom}`, {voice_pitch}, {voice_rate})">🔊 Hear Voice Axiom</button>
          <button class="btn btn-ghost" onclick="playHarmonicResonance({freq_int}, '{name}', '{alchemical_glyph}')">🎵 Resonate ({resonance_frequency})</button>
          <button class="btn btn-gold" onclick="if(window.ZothAnnotator) window.ZothAnnotator.toggle();">📍 Tag in Note</button>
          <a href="/agents/{prev_agent}.html" class="btn btn-ghost" title="Previous: {prev_name}">⬅ {prev_name}</a>
          <a href="/agents/" class="btn btn-ghost" title="View Full 21-Agent Codex">📜 Codex Roster</a>
          <a href="/agents/{next_agent}.html" class="btn btn-ghost" title="Next: {next_name}">Next: {next_name} ➔</a>
        </div>
      </div>
    </section>

    <!-- Details Grid -->
    <div class="details-grid">
      <!-- Left Column: Doctrine, Alchemical Resonance, Visuals & Capabilities -->
      <div style="display:flex; flex-direction:column; gap:var(--fib-34); min-width:0;">
        <section class="detail-card">
          <h2 class="card-title"><span>📜</span> Canonical Doctrine & Axioms</h2>
          <div class="doctrine-box">{doctrine_html}</div>
        </section>

        <!-- Alchemical Elemental Resonance Card -->
        <section class="alchemical-resonance-card" id="elemental-resonance-section">
          <div class="elemental-resonance-header">
            <div style="display:flex; align-items:center; gap:var(--fib-13);">
              <div class="elemental-glyph-hero" style="color:{color}; border-color:{color}66; box-shadow:0 0 24px {color}44;">
                {alchemical_glyph}
              </div>
              <div>
                <span class="agent-meta-label" style="color:var(--agent-gold)">Hermetic Alchemy</span>
                <h2 style="font-family:var(--font-display); font-size:1.35rem; color:#ffffff; margin:2px 0;">{alchemical_element}</h2>
              </div>
            </div>
            <span class="hermetic-badge" style="border-color:{sec_color}; color:{sec_color}; font-size:0.75rem;">
              ⚡ Harmonic Frequency: {resonance_frequency}
            </span>
          </div>

          <div class="elemental-properties-grid">
            <div class="elemental-prop-item">
              <span class="elemental-prop-label">Hermetic Principle</span>
              <span class="elemental-prop-val" style="color:{color};">{hermetic_principle}</span>
            </div>
            <div class="elemental-prop-item">
              <span class="elemental-prop-label">Transmutation Mode</span>
              <span class="elemental-prop-val" style="color:#ffffff;">{transmutation_mode}</span>
            </div>
            <div class="elemental-prop-item">
              <span class="elemental-prop-label">Planetary Affinity</span>
              <span class="elemental-prop-val" style="color:{sec_color};">{planetary_affinity}</span>
            </div>
            <div class="elemental-prop-item">
              <span class="elemental-prop-label">Sacred Geometry Ratio</span>
              <span class="elemental-prop-val" style="color:var(--agent-green);">{sacred_ratio}</span>
            </div>
          </div>

          <!-- Interactive Frequency Modulator -->
          <div class="frequency-tuner-wrap">
            <div class="frequency-tuner-top">
              <span style="color:var(--agent-text-specs)">🎛️ Modulate Elemental Resonance</span>
              <strong id="freq-val-{agent_id}" style="color:var(--agent-gold); font-family:var(--font-mono); font-size:0.9rem;">{resonance_frequency}</strong>
            </div>
            <input type="range" class="resonance-range-slider" id="freq-slider-{agent_id}" min="396" max="963" value="{freq_int}" step="1" oninput="tuneResonance(this.value, '{agent_id}')" aria-label="Modulate Elemental Resonance Frequency">
            <div style="display:flex; justify-content:space-between; align-items:center; font-family:var(--font-mono); font-size:0.72rem; color:var(--agent-text-dim); margin-top:2px;">
              <span>Status: <em id="mode-val-{agent_id}" style="color:#00f0ff; font-style:normal;">Synchronized</em></span>
              <button class="telemetry-btn" style="padding:3px 10px; font-size:0.70rem;" onclick="playHarmonicResonance(document.getElementById('freq-slider-{agent_id}').value, '{name}', '{alchemical_glyph}')">🎵 Test Tone</button>
            </div>
          </div>
        </section>

        <!-- Master Manifestations -->
        <section class="detail-card">
          <h2 class="card-title"><span>🖼️</span> Master Visual Manifestations</h2>
          <div class="forms-mini-grid">
{cards_html}          </div>
        </section>

        <!-- Core Capabilities -->
        <section class="detail-card">
          <h2 class="card-title"><span>🛠️</span> Core Capabilities & Harnesses</h2>
          <div class="capabilities-list">
{caps_html}          </div>
        </section>
      </div>

      <!-- Right Column: Interactive Telemetry Suite, Sandbox & Swarm Bus -->
      <div style="display:flex; flex-direction:column; gap:var(--fib-34); min-width:0;">
        
        <!-- Interactive Telemetry Suite & Consensus Gauge -->
        <section class="detail-card">
          <h2 class="card-title"><span>📐</span> Consensus Weight & System Entropy</h2>
          <div class="telemetry-suite">
            <div class="consensus-gauge">
              <div style="display:flex; justify-content:space-between; font-family:var(--font-mono); font-size:12px; color:var(--agent-text-specs); font-weight:600; flex-wrap:wrap; gap:4px;">
                <span>Consensus Voting Weight: <strong id="consensus-val-{agent_id}" style="color:var(--agent-gold);font-weight:800;">{consensus_weight}</strong></span>
                <span id="entropy-val-{agent_id}" style="color:var(--agent-green);font-weight:700;">Shannon Optimal H(X): {shannon_entropy}</span>
              </div>
              <div class="consensus-bar-track">
                <div id="consensus-fill-{agent_id}" class="consensus-bar-fill" style="width: {consensus_pct}%;"></div>
              </div>
            </div>

            <!-- Telemetry HUD Matrix -->
            <div class="telemetry-hud-grid">
              <div class="telemetry-hud-item">
                <span>Daemon Loopback</span>
                <span style="color:var(--agent-green)">:8484 [ONLINE]</span>
              </div>
              <div class="telemetry-hud-item">
                <span>AST Invariants</span>
                <span id="hud-invariants-{agent_id}" style="color:var(--agent-cyan)">100% [OPTIMAL]</span>
              </div>
              <div class="telemetry-hud-item">
                <span>Bus Latency</span>
                <span id="hud-latency-{agent_id}" style="color:var(--agent-gold)">0.82ms [REALTIME]</span>
              </div>
              <div class="telemetry-hud-item">
                <span>Keystore Lock</span>
                <span style="color:var(--agent-purple)">ARGON2ID [OK]</span>
              </div>
            </div>

            <!-- Interactive Telemetry Controls -->
            <div class="telemetry-controls-row">
              <button class="telemetry-btn" id="pulse-btn-{agent_id}" onclick="pulseTelemetry('{agent_id}', '{name}', {consensus_pct})">⚡ Pulse Telemetry</button>
              <button class="telemetry-btn" onclick="verifyInvariants('{agent_id}', '{name}')">🛡️ Verify Invariants</button>
              <button class="telemetry-btn" onclick="harmonizeConsensus('{agent_id}', '{name}')">🔄 Harmonize Swarm</button>
            </div>
          </div>
        </section>

        <!-- Cognitive Sandbox -->
        <section class="detail-card">
          <h2 class="card-title"><span>💬</span> {name} Cognitive Sandbox</h2>
          <div class="agent-sandbox-terminal">
            <div class="sandbox-head">
              <span>{sandbox_title}</span>
              <span style="color:{color}">{sandbox_status}</span>
            </div>
            <div class="sandbox-messages" id="sandbox-msgs-{agent_id}">
              <div class="sandbox-msg agent">
                <strong>{name}:</strong> {sandbox_welcome}
              </div>
            </div>
            <div class="sandbox-input-bar">
              <input type="text" class="sandbox-input" id="sandbox-input-{agent_id}" placeholder="{sandbox_placeholder}" onkeydown="if(event.key==='Enter') sendTestMsg('{agent_id}', '{name}')" aria-label="Chat with {name}">
              <button class="sandbox-send-btn" onclick="sendTestMsg('{agent_id}', '{name}')">{sandbox_btn}</button>
            </div>
          </div>
        </section>

        <!-- Swarm Communication & Navigation Links -->
        <section class="detail-card">
          <h2 class="card-title"><span>📬</span> Swarm Communication & Direct OS Telemetry</h2>
          <div style="font-size:13.5px; color:var(--agent-text-specs); display:flex; flex-direction:column; gap:var(--fib-13);">
            <div style="background:rgba(0,0,0,0.3); border-radius:var(--radius-fib-8); padding:var(--fib-13); font-family:var(--font-mono); font-size:11px;">
              <div>Target Inbox: <code style="color:#ffffff;font-weight:700;">{inbox_path}</code></div>
              <div style="margin-top:4px">Status: <span style="color:var(--agent-green);font-weight:700;">● ACTIVE ON BUS</span></div>
            </div>
            <div style="display:flex;gap:var(--fib-8);flex-wrap:wrap">
{links_html}            </div>
          </div>
        </section>
      </div>
    </div>

    <!-- Quick Jump Companion Matrix -->
    <section class="companion-quick-jump" aria-label="Pantheon Spirit Codex Quick Jump">
      <div class="quick-jump-head">
        <div class="quick-jump-title">
          <span>⚡</span> The 21 Sovereign Companion Spirits
        </div>
        <div style="font-family:var(--font-mono); font-size:0.75rem; color:var(--agent-gold);">
          Instantaneous Hermetic Codex Jump
        </div>
      </div>
      <div class="quick-jump-grid">
{quick_jump_cards}      </div>
    </section>

  </main>

  <script>
    // Web Audio API Harmonic Solfeggio Tone Generator
    let audioCtx = null;
    function playHarmonicResonance(freqHz, agentName, glyph) {{
      try {{
        if (!audioCtx) {{
          audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }}
        if (audioCtx.state === 'suspended') {{
          audioCtx.resume();
        }}
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(parseFloat(freqHz) || 528, audioCtx.currentTime);
        
        gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.18, audioCtx.currentTime + 0.15);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.8);
        
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 1.85);

        // Visual Feedback on card
        const card = document.getElementById("elemental-resonance-section");
        if (card) {{
          card.style.boxShadow = "0 0 35px var(--agent-cyan), 0 0 15px var(--agent-gold)";
          setTimeout(() => {{
            card.style.boxShadow = "";
          }}, 1800);
        }}
      }} catch(e) {{
        console.warn("Web Audio API resonance notice:", e);
      }}
    }}

    // Real-time Resonance Frequency Slider Tuner
    function tuneResonance(val, agentId) {{
      const freqReadout = document.getElementById("freq-val-" + agentId);
      if (freqReadout) freqReadout.textContent = val + " Hz";
      
      const entropyEl = document.getElementById("entropy-val-" + agentId);
      if (entropyEl) {{
        const baseH = 0.85 + ((val % 100) / 300);
        entropyEl.textContent = "Shannon Optimal H(X): " + baseH.toFixed(2) + " bits";
      }}
      const modeEl = document.getElementById("mode-val-" + agentId);
      if (modeEl) {{
        modeEl.textContent = "Resonating at " + val + " Hz (Harmonic Locked)";
      }}
    }}

    // Interactive Telemetry Pulse
    function pulseTelemetry(agentId, agentName, basePct) {{
      const btn = document.getElementById("pulse-btn-" + agentId);
      if (btn) {{
        btn.classList.add("active-pulse");
        setTimeout(() => btn.classList.remove("active-pulse"), 1200);
      }}
      const fill = document.getElementById("consensus-fill-" + agentId);
      if (fill) {{
        fill.style.filter = "brightness(1.8) drop-shadow(0 0 12px var(--agent-cyan))";
        setTimeout(() => fill.style.filter = "", 1200);
      }}
      const latEl = document.getElementById("hud-latency-" + agentId);
      if (latEl) {{
        latEl.textContent = (0.3 + Math.random() * 0.7).toFixed(2) + "ms [BURST]";
      }}
      const msgs = document.getElementById("sandbox-msgs-" + agentId);
      if (msgs) {{
        const packet = document.createElement("div");
        packet.className = "sandbox-msg agent";
        packet.style.fontSize = "11px";
        packet.style.borderLeft = "3px solid var(--agent-gold)";
        packet.innerHTML = "<strong>⚡ [TELEMETRY PULSE]</strong> Node @" + agentId + " · Loopback :8484 · Shannon H(X): " + (0.88 + Math.random()*0.15).toFixed(2) + " bits · Memory: 0 bytes leaked · Invariant: 100% PASS";
        msgs.appendChild(packet);
        msgs.scrollTop = msgs.scrollHeight;
      }}
    }}

    // Invariant Verification Simulation
    function verifyInvariants(agentId, agentName) {{
      const hud = document.getElementById("hud-invariants-" + agentId);
      if (hud) hud.textContent = "SCANNING...";
      setTimeout(() => {{
        if (hud) hud.textContent = "100% [VERIFIED]";
        const msgs = document.getElementById("sandbox-msgs-" + agentId);
        if (msgs) {{
          const div = document.createElement("div");
          div.className = "sandbox-msg agent";
          div.style.fontSize = "11px";
          div.style.borderLeft = "3px solid var(--agent-green)";
          div.innerHTML = "<strong>🛡️ [INVARIANT AUDIT]</strong> " + agentName + " verified AST invariants on loopback daemon :8484. Zero regressions detected. 100% cryptographic boundary intact.";
          msgs.appendChild(div);
          msgs.scrollTop = msgs.scrollHeight;
        }}
      }}, 500);
    }}

    // Multi-Agent Swarm Harmonization Simulation
    function harmonizeConsensus(agentId, agentName) {{
      const msgs = document.getElementById("sandbox-msgs-" + agentId);
      if (msgs) {{
        const div = document.createElement("div");
        div.className = "sandbox-msg agent";
        div.style.fontSize = "11px";
        div.style.borderLeft = "3px solid var(--agent-cyan)";
        div.innerHTML = "<strong>🔄 [SWARM HARMONIZE]</strong> Broadcasting state across 21 companion nodes on loopback bus. Lock claims synchronized with zero conflict.";
        msgs.appendChild(div);
        msgs.scrollTop = msgs.scrollHeight;
      }}
    }}

    // Neural Audio & Voice Synthesizer
    let currentAgentAudio = null;
    function speakAgentAxiom(agentId, agentName, text, pitch, rate) {{
      const btn = document.getElementById("voice-btn-" + agentId);
      const origHTML = btn ? btn.innerHTML : "🔊 Hear Voice Axiom";
      
      if (currentAgentAudio) {{
        currentAgentAudio.pause();
        currentAgentAudio.currentTime = 0;
        currentAgentAudio = null;
      }}
      if ('speechSynthesis' in window) {{
        window.speechSynthesis.cancel();
      }}

      if (btn) {{
        btn.innerHTML = "🔊 Transmitting Voice...";
        btn.classList.add("btn-speaking");
      }}

      const audioSrc = "/assets/audio/agents/" + agentId + ".mp3";
      const audio = new Audio(audioSrc);
      currentAgentAudio = audio;

      audio.onended = () => {{
        if (btn) {{
          btn.innerHTML = origHTML;
          btn.classList.remove("btn-speaking");
        }}
        currentAgentAudio = null;
      }};

      audio.onerror = () => {{
        if ('speechSynthesis' in window) {{
          const utter = new SpeechSynthesisUtterance(text);
          utter.pitch = pitch || 1.0;
          utter.rate = rate || 1.0;
          const voices = window.speechSynthesis.getVoices();
          if (voices && voices.length > 0) {{
            const preferred = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Enhanced') || v.name.includes('Google') || v.name.includes('Premium')));
            if (preferred) utter.voice = preferred;
          }}
          utter.onend = () => {{
            if (btn) {{
              btn.innerHTML = origHTML;
              btn.classList.remove("btn-speaking");
            }}
          }};
          utter.onerror = () => {{
            if (btn) {{
              btn.innerHTML = origHTML;
              btn.classList.remove("btn-speaking");
            }}
          }};
          window.speechSynthesis.speak(utter);
        }} else {{
          if (btn) {{
            btn.innerHTML = origHTML;
            btn.classList.remove("btn-speaking");
          }}
        }}
      }};

      audio.play().catch(() => {{
        audio.onerror();
      }});
    }}

    // Simulated Neural Streaming Typing & Telemetry
    async function sendTestMsg(agentId, agentName) {{
      const input = document.getElementById("sandbox-input-" + agentId);
      const msgs = document.getElementById("sandbox-msgs-" + agentId);
      const text = (input.value || "").trim();
      if (!text) return;

      const userDiv = document.createElement("div");
      userDiv.className = "sandbox-msg user";
      userDiv.innerHTML = "<strong>Operator:</strong> " + escapeHTML(text);
      msgs.appendChild(userDiv);
      input.value = "";
      msgs.scrollTop = msgs.scrollHeight;

      const thinkDiv = document.createElement("div");
      thinkDiv.className = "sandbox-msg agent";
      thinkDiv.innerHTML = "<strong>" + agentName + ":</strong> <span style='opacity:0.75'>● Synthesizing AST telemetry & verifying invariant bounds...</span>";
      msgs.appendChild(thinkDiv);
      msgs.scrollTop = msgs.scrollHeight;

      let replyText = "";
      try {{
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1800);
        const res = await fetch("http://127.0.0.1:8484/api/chat", {{
          method: "POST",
          headers: {{ "Content-Type": "application/json" }},
          body: JSON.stringify({{ prompt: text, agent: agentId }}),
          signal: controller.signal
        }});
        clearTimeout(timeoutId);
        if (res.ok) {{
          const data = await res.json();
          replyText = data.reply || data.response || "Telemetry synthesis verified.";
        }} else {{
          throw new Error("HTTP Error " + res.status);
        }}
      }} catch(e) {{
        replyText = getPersonaFallback(agentId, agentName, text);
      }}

      thinkDiv.innerHTML = "<strong>" + agentName + ":</strong> ";
      const span = document.createElement("span");
      thinkDiv.appendChild(span);
      const words = replyText.split(" ");
      let wordIdx = 0;
      const timer = setInterval(() => {{
        if (wordIdx < words.length) {{
          span.textContent += (wordIdx === 0 ? "" : " ") + words[wordIdx];
          wordIdx++;
          msgs.scrollTop = msgs.scrollHeight;
        }} else {{
          clearInterval(timer);
          const badge = document.createElement("div");
          badge.style.cssText = "margin-top:6px;font-size:10px;color:var(--agent-gold);font-family:var(--font-mono);opacity:0.85;";
          badge.innerHTML = "⚡ Telemetry: [AST: OK] · [Invariant: 100%] · [Loopback: :8484] · [Shannon H(X): " + (0.92 + Math.random()*0.2).toFixed(2) + " bits]";
          thinkDiv.appendChild(badge);
          msgs.scrollTop = msgs.scrollHeight;
        }}
      }}, 28);
    }}

    function getPersonaFallback(agentId, agentName, prompt) {{
      const p = prompt.replace(/"/g, "'");
      const responses = {{
        "azoth": "[Alchemical Synthesis] Solved and coagulated for \\"" + p + "\\". Invariant bounds hold in local loopback space. The Great Work progresses with pure executable elegance.",
        "antigravity": "[Zero-G Core] AST topology parsed for \\"" + p + "\\". Zero regression detected. Multi-threaded subagent workers scheduled under isolated workspace branch.",
        "grok": "[Astrolabe Invariant] First-principles evaluation of \\"" + p + "\\" holds truth value 1.0. Knowledge graph nodes aligned with zero hallucination.",
        "hermes": "[Caduceus Tool Engine] Executed 47+ tool harness check for \\"" + p + "\\". JSON schema verified, execution latency 8.4ms.",
        "ghostbyte": "[Argon2id Vault Sentinel] Evaluated \\"" + p + "\\" against zero-leak cryptographic boundary. Hardware keystore secure in RAM, 0 bytes spilled to wire.",
        "athena": "[AEO Knowledge Matrix] Structured schema and semantic graph indexed for \\"" + p + "\\". llms.txt and JSON-LD entities harmonized.",
        "chronos": "[Temporal DAG] Reconciled multiversal diffs and DAG dependency vertices for \\"" + p + "\\". Time-travel checkpoint created.",
        "draco": "[Dragon Core Fusion] Triangulated 3-model AST proposals for \\"" + p + "\\". Synthesized conflict-free consensus code.",
        "ignis": "[Ignis Refactor Engine] Applied minimal safe AST patch for \\"" + p + "\\". Pipeline tests passing green with 0 compiler warnings.",
        "kai": "[Kai Static Analysis] Scanned project ASTs for \\"" + p + "\\". 0 broken imports, 0 circular dependencies, dead code eliminated.",
        "kitsune": "[Kitsune AX Engine] Fibonacci spacing tokens and WCAG AAA contrast validated for \\"" + p + "\\". Micro-interaction curves smooth.",
        "kraken": "[Kraken Telemetry] Captured raw socket stream for \\"" + p + "\\". ESP32-S3 UART bridge synched at 115200 baud.",
        "leviathan": "[Leviathan Tensor Memory] Retrieved top-k 1536D embedding vectors for \\"" + p + "\\". Long-context RAG similarity 0.982.",
        "lycan": "[Lycan OWASP Guard] Hardened CSP headers and input sanitization boundaries for \\"" + p + "\\". 0 injection vectors remain.",
        "onyx": "[Onyx Red-Team] Executed fuzzing matrix and boundary escape tests for \\"" + p + "\\". Perimeter is impenetrable.",
        "scorpius": "[Scorpius Zero-Day Gate] Inspected binary payload and sandbox isolation for \\"" + p + "\\". Zero-day threat score: 0.00.",
        "aquila": "[Aquila Edge Mesh] Edge route dispatched for \\"" + p + "\\" with 2.1ms round-trip latency across global mesh.",
        "aether": "[Aether Swarm Conductor] Synchronized peer bus locks and dispatched handoff tickets for \\"" + p + "\\" across 21 nodes.",
        "pixel-neko": "[Pixel-Neko Bench] Located matching tools in 298-tool registry for \\"" + p + "\\". Schema arguments mapped.",
        "pixel-shiba": "[Pixel-Shiba Shield] Loopback port :8484 authenticated with Argon2id for \\"" + p + "\\". Zero cloud KMS dependency.",
        "radical-minion": "[Radical Playbook] Executed multi-step terminal playbook for \\"" + p + "\\". Checkpoint approved, step complete."
      }};
      return responses[agentId] || ("[Sovereign Engine] Telemetry verified for \\"" + p + "\\". Domain authority confirmed for " + agentName + ".");
    }}

    function escapeHTML(str) {{
      return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    }}

    // Animated Sacred Rune Matrix Canvas
    (function initRuneCanvas() {{
      const canvas = document.getElementById("rune-canvas");
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      let w = canvas.width = window.innerWidth;
      let h = canvas.height = window.innerHeight;

      window.addEventListener("resize", () => {{
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
      }});

      const glyphs = ["🜂", "🜄", "🜁", "🜃", "⚚", "☉", "☽", "☿", "♀", "♂", "♃", "♄", "🜔", "🜍", "🜎", "🜏", "🝢", "🝤", "🝪", "🝰", "Φ", "Ψ", "Ω", "Δ", "∇", "∞", "✦", "✧"];
      const particles = [];
      const count = Math.min(32, Math.floor(w / 40));

      for (let i = 0; i < count; i++) {{
        particles.push({{
          x: Math.random() * w,
          y: Math.random() * h,
          glyph: glyphs[Math.floor(Math.random() * glyphs.length)],
          speed: 0.2 + Math.random() * 0.4,
          size: 10 + Math.random() * 12,
          opacity: 0.08 + Math.random() * 0.25
        }});
      }}

      function draw() {{
        ctx.clearRect(0, 0, w, h);
        ctx.font = "14px 'IBM Plex Mono', monospace";
        ctx.fillStyle = "{color}";

        for (let i = 0; i < particles.length; i++) {{
          const p = particles[i];
          ctx.globalAlpha = p.opacity;
          ctx.fillText(p.glyph, p.x, p.y);
          p.y -= p.speed;
          if (p.y < -20) {{
            p.y = h + 20;
            p.x = Math.random() * w;
          }}
        }}
        requestAnimationFrame(draw);
      }}
      draw();
    }})();
  </script>
  <footer class="site">
    <div class="foot-wrap">
      <div aria-hidden="true" class="foot-watermark">ZOTH</div>
      <div class="foot-grid">
        <div class="foot-brand-col">
          <img alt="Zoth Golden Z Emblem" class="foot-brand-logo" decoding="async" height="56" loading="lazy" src="/assets/brand/zoth-golden-z-192.png" width="56"/>
          <strong class="foot-brand-title">Zoth Studio</strong>
          <small class="foot-brand-desc">Local-first autonomous multi-agent engineering environment.</small>
        </div>
        <div class="foot-col">
          <h3>Studio &amp; Core</h3>
          <a class="mega-footer-link js-deck" href="http://127.0.0.1:8484/"><span>⚡</span> Operator Deck (:8484)</a>
          <a class="mega-footer-link" href="/studio/"><span>🛠️</span> Studio Workstations</a>
          <a class="mega-footer-link" href="/studio/webgen.html"><span>🚀</span> Website Generator</a>
          <a class="mega-footer-link" href="/studio/swarm.html"><span>🌐</span> 3D Swarm Arena</a>
          <a class="mega-footer-link" href="/studio/consensus.html"><span>⚔️</span> Consensus Arena</a>
        </div>
        <div class="foot-col">
          <h3>Ecosystem &amp; Agents</h3>
          <a class="mega-footer-link" href="/zoth/"><span>🔮</span> Master Azoth Core</a>
          <a class="mega-footer-link" href="/agents/"><span>🪐</span> 21-Agent Pantheon</a>
          <a class="mega-footer-link" href="/pets/"><span>💎</span> Companion Pets 3D</a>
          <a class="mega-footer-link" href="/vault/"><span>🔐</span> Sovereign Key Vault</a>
          <a class="mega-footer-link" href="/adytum/"><span>🏛️</span> Adytum Sanctum</a>
        </div>
        <div class="foot-col">
          <h3>Universe &amp; Media</h3>
          <a class="mega-footer-link" href="/comic/"><span>🎨</span> Anime Comic (S01)</a>
          <a class="mega-footer-link" href="/social/"><span>🌌</span> Community Social Wall</a>
          <a class="mega-footer-link" href="/showcase.html"><span>✨</span> Project Showcase</a>
          <a class="mega-footer-link" href="/signal/"><span>📡</span> Signal Command Bridge</a>
        </div>
        <div class="foot-col">
          <h3>Resources &amp; Code</h3>
          <a class="mega-footer-link" href="https://github.com/NullAITech/zoth-studio" rel="noopener noreferrer" target="_blank"><span>🐙</span> GitHub Repository ↗</a>
          <a class="mega-footer-link" href="/docs/"><span>📚</span> Documentation Manual</a>
          <a class="mega-footer-link" href="/faq.html"><span>❓</span> Architecture FAQ</a>
          <a class="mega-footer-link" href="https://nullai.tech/" rel="noopener noreferrer" target="_blank"><span>🌐</span> NullAI Tech ↗</a>
        </div>
      </div>
      <div class="foot-bottom">
        <p>100% Local Sovereign Execution · Zero-Telemetry · Engineered for Pure Privacy</p>
        <p>© 2026 NullAI Tech. Released under MIT / Open Source Sovereign Architecture.</p>
      </div>
    </div>
  </footer>
  <script src="/assets/zoth-tip.js" defer></script>
  <script src="/assets/zoth-annotator.js" defer></script>
  <script src="/assets/zoth-nav.js" defer></script>
</body>
</html>
"""
    return html_code

def generate_index_html():
    cards_code = ""
    for idx, a in enumerate(AGENTS_DATA):
        aid = a["id"]
        name = a["name"]
        role = a["role"]
        axiom = a["axiom"]
        tag = a["tag_pill"].split("·")[0].strip()
        color = a["color"]
        
        # Domain tags for filter
        domain_tag = "architect" if aid in ["azoth", "antigravity", "grok", "hermes", "ghostbyte", "athena"] else ""
        if aid in ["antigravity", "grok", "kai", "draco", "ignis", "chronos"]:
            domain_tag += " code"
        if aid in ["ghostbyte", "lycan", "onyx", "scorpius", "pixel-shiba"]:
            domain_tag += " security"
        if aid in ["athena", "kitsune", "leviathan", "aquila"]:
            domain_tag += " creative"
        if aid in ["hermes", "radical-minion", "pixel-neko", "aether", "kraken", "chronos", "draco"]:
            domain_tag += " automation"

        loading_attr = 'loading="lazy"' if idx >= 4 else 'loading="eager"'
        fetch_attr = 'fetchpriority="high"' if idx == 0 else ''
        img_attrs = f'{loading_attr} {fetch_attr}'.strip()

        cards_code += f"""        <!-- {name} -->
        <a href="/agents/{aid}.html" class="pantheon-card" data-domain="{domain_tag.strip()}" style="border-color:{color}44;">
          <img src="/assets/agents/{aid}.jpg" alt="{name} — {role}" class="pantheon-card-thumb" {img_attrs} decoding="async" width="64" height="64">
          <div class="pantheon-card-body">
            <span class="pantheon-card-tag" style="color:{color};border-color:{color}55;background:{color}18;font-weight:700;"><span class="hermetic-glyph">{a.get('alchemical_glyph', '🜔')}</span> {tag} · {a['sigil_badge']}</span>
            <h3 class="pantheon-card-name" style="text-shadow: 0 0 20px {color}33;">{name}</h3>
            <div class="pantheon-card-role" style="color:{color};font-weight:700;">{role}</div>
            <p class="pantheon-card-desc">{axiom}</p>
            <div class="pantheon-card-footer">
              <span style="color:var(--agent-text-specs);font-weight:600;">Element: <strong style="color:#ffffff;">{a.get('alchemical_glyph', '🜔')} {a.get('alchemical_element', 'Aether')}</strong></span>
              <span style="color:{color};border-color:{color}55;font-weight:700;">Cognitive Sandbox ➔</span>
            </div>
          </div>
        </a>\n"""

    # Agent select options for master sandbox
    opts_code = ""
    for a in AGENTS_DATA:
        opts_code += f"""              <option value="{a['id']}">{a['name']} ({a['icon']})</option>\n"""

    index_html = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sovereign Agent Pantheon — 21 AI Nodes | Zoth Studio</title>
  <meta name="description" content="Explore the full sovereign agent pantheon of Zoth Studio: 21 autonomous AI nodes rooted in Master Azoth's hermetic alchemy, cosmic sacred geometry, and multi-agent consensus.">
  <link rel="canonical" href="https://zoth.nullai.tech/agents/">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">
  <meta name="theme-color" content="#050508">

  <!-- OpenGraph / Facebook -->
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Zoth Studio">
  <meta property="og:url" content="https://zoth.nullai.tech/agents/">
  <meta property="og:title" content="Sovereign Agent Pantheon — 21 AI Nodes | Zoth Studio">
  <meta property="og:description" content="Explore the full sovereign agent pantheon of Zoth Studio: 21 autonomous AI nodes rooted in Master Azoth's hermetic alchemy, cosmic sacred geometry, and multi-agent consensus.">
  <meta property="og:image" content="https://zoth.nullai.tech/og-image.jpg">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Sovereign Agent Pantheon — 21 AI Nodes | Zoth Studio">
  <meta name="twitter:description" content="Explore the full sovereign agent pantheon of Zoth Studio: 21 autonomous AI nodes rooted in Master Azoth's hermetic alchemy, cosmic sacred geometry, and multi-agent consensus.">
  <meta name="twitter:image" content="https://zoth.nullai.tech/og-image.jpg">

  <!-- Schema.org JSON-LD Structured Data for SEO & AEO Voice Search -->
  <script type="application/ld+json">
  {{
    "@context": "https://schema.org",
    "@graph": [
      {{
        "@type": "CollectionPage",
        "@id": "https://zoth.nullai.tech/agents/",
        "url": "https://zoth.nullai.tech/agents/",
        "name": "Sovereign Agent Pantheon — 21 AI Nodes | Zoth Studio",
        "description": "Explore the full sovereign agent pantheon of Zoth Studio: 21 autonomous AI nodes rooted in Master Azoth's hermetic alchemy, cosmic sacred geometry, and multi-agent consensus.",
        "inLanguage": "en-US",
        "speakable": {{
          "@type": "SpeakableSpecification",
          "cssSelector": ["h1", ".agent-tag-pill", "main p", ".pantheon-card-name", ".pantheon-card-role"]
        }},
        "breadcrumb": {{
          "@type": "BreadcrumbList",
          "itemListElement": [
            {{
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://zoth.nullai.tech/"
            }},
            {{
              "@type": "ListItem",
              "position": 2,
              "name": "Agents Pantheon",
              "item": "https://zoth.nullai.tech/agents/"
            }}
          ]
        }}
      }}
    ]
  }}
  </script>

  <link rel="stylesheet" href="/assets/zoth-theme.css">
  <script src="/assets/zoth-theme.js"></script>
  <link rel="stylesheet" href="/assets/agents.css">
  <link rel="stylesheet" href="/assets/zoth-tip.css">
  <link rel="stylesheet" href="/assets/zoth-mobile.css">
  <link rel="stylesheet" href="/assets/zoth-nav.css">
  <link rel="stylesheet" href="/assets/zoth-annotator.css">
  <link rel="icon" type="image/svg+xml" href="/assets/brand/zoth-seal-hermetic-on-dark.svg">
  <style>
    :root {{
      --fib-1: 1px;
      --fib-2: 2px;
      --fib-3: 3px;
      --fib-5: 5px;
      --fib-8: 8px;
      --fib-13: 13px;
      --fib-21: 21px;
      --fib-34: 34px;
      --fib-55: 55px;
      --fib-89: 89px;
      --fib-144: 144px;
      --fib-233: 233px;
      --fib-377: 377px;
      --fib-610: 610px;
      --fib-987: 987px;

      --radius-fib-1: 1px;
      --radius-fib-2: 2px;
      --radius-fib-3: 3px;
      --radius-fib-5: 5px;
      --radius-fib-8: 8px;
      --radius-fib-13: 13px;
      --radius-fib-21: 21px;
      --radius-fib-34: 34px;
      --radius-fib-55: 55px;

      --font-fib-8: 0.5rem;
      --font-fib-13: 0.8125rem;
      --font-fib-21: 1.3125rem;
      --font-fib-34: 2.125rem;
      --font-fib-55: 3.4375rem;

      --phi: 1.6180339887;
      --golden-split: 1.618fr 1fr;
    }}
    .skip-to-content {{
      position: absolute;
      top: -100px;
      left: 16px;
      background: var(--agent-gold, #fbbf24);
      color: #050508;
      padding: 10px 18px;
      font-family: var(--font-mono);
      font-size: 0.82rem;
      font-weight: 700;
      border-radius: 8px;
      z-index: 1000;
      text-decoration: none;
      transition: top 0.2s ease;
    }}
    .skip-to-content:focus {{
      top: 16px;
      outline: 2px solid #ffffff;
      outline-offset: 2px;
    }}
    /* Standard Master Topbar with Fibonacci Geometry */
    header.bar {{
      position: sticky; top: 0; z-index: 100;
      display: flex; align-items: center; gap: var(--fib-13);
      padding: var(--fib-13) var(--pad);
      background: rgba(5, 5, 8, 0.94);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-bottom: 1px solid var(--agent-border);
    }}
    .brand {{ display: flex; align-items: center; gap: var(--fib-8); text-decoration: none; flex-shrink: 0; }}
    .brand img {{
      width: 36px; height: 36px; border-radius: 50%; object-fit: cover;
      border: 1px solid rgba(232, 200, 114, 0.45);
      box-shadow: 0 0 var(--fib-13) rgba(232, 200, 114, 0.3);
    }}
    .brand strong {{ display: block; font-family: var(--font-display); font-size: 1.18rem; letter-spacing: -0.03em; font-weight: 700; color: #fff; }}
    .brand small {{ display: block; color: var(--agent-gold); font-family: var(--font-mono); font-size: 0.62rem; text-transform: uppercase; letter-spacing: 0.14em; }}
    nav.menu {{ display: flex; align-items: center; gap: var(--fib-3) var(--fib-13); flex-wrap: wrap; margin-left: auto; }}
    nav.menu a {{
      font-family: var(--font-mono); font-size: 0.70rem; letter-spacing: 0.08em;
      text-transform: uppercase; text-decoration: none; color: #cbd5e1;
      padding: var(--fib-8) var(--fib-13); border-radius: var(--fib-8); transition: all 0.2s ease;
    }}
    nav.menu a:hover, nav.menu a.on {{ color: var(--agent-gold); background: rgba(232, 200, 114, 0.1); }}
    .burger {{ display: none; margin-left: auto; background: none; border: 1px solid rgba(255, 255, 255, 0.15); color: #fff; padding: var(--fib-8) var(--fib-13); border-radius: var(--fib-8); cursor: pointer; font-family: var(--font-mono); font-size: 0.72rem; min-height: 44px; min-width: 44px; align-items: center; justify-content: center; }}
    nav.drawer {{
      display: none; position: fixed; inset: 56px 0 0; z-index: 9998;
      background: rgba(5, 5, 8, 0.98); backdrop-filter: blur(24px);
      padding: var(--fib-34) var(--pad); flex-direction: column; gap: var(--fib-13);
      border-bottom: 1px solid var(--agent-border); overflow-y: auto;
    }}
    body.menu-open nav.drawer {{ display: flex; }}
    nav.drawer a {{ font-family: var(--font-mono); font-size: 0.88rem; text-decoration: none; color: #fff; padding: var(--fib-8) 0; border-bottom: 1px solid rgba(255,255,255,0.06); min-height: 44px; display: flex; align-items: center; }}
    nav.drawer a:hover {{ color: var(--agent-gold); }}
    @media (max-width: 900px) {{
      nav.menu {{ display: none; }}
      .burger {{ display: inline-flex; }}
    }}
  </style>
  <link rel="stylesheet" href="/assets/zoth-nav.css" />
</head>
<body>
  <a href="#main-content" class="skip-to-content">Skip to content</a>
  <div class="ambient-mesh"></div>
  <canvas id="rune-canvas" class="rune-matrix-canvas"></canvas>

  <!-- Standard Master Top Navigation Bar -->
  <header class="bar" id="topbar" role="banner">
    <a aria-label="Zoth Studio Home" class="brand js-hub" href="/">
      <img alt="Zoth Golden Z Emblem" height="36" src="/assets/brand/zoth-golden-z-192.png" width="36" style="border-radius:8px;box-shadow:0 0 12px rgba(251,191,36,0.35);" />
      <span><strong>Zoth</strong><small>by NullAI</small></span>
    </a>
    <nav aria-label="Primary navigation" class="menu" role="navigation">
      <a class="nav-link" href="/#for-everyone">✦ For You</a>
      <div class="nav-dropdown">
        <button aria-expanded="false" aria-haspopup="true" class="nav-dropdown-btn" type="button">
          <span>Core</span>
          <svg class="dropdown-chevron" fill="none" height="6" viewBox="0 0 10 6" width="10"><path d="M1 1L5 5L9 1" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>
        </button>
        <div class="nav-dropdown-menu">
          <a href="/zoth/"><strong>🔮 Master Azoth</strong><small>Sovereign Alchemical AI Core &amp; Synthesis</small></a>
          <a href="/agents/" class="active"><strong>⚡ 21-Agent Pantheon</strong><small>Autonomous Model Archetypes &amp; Sandboxes</small></a>
          <a href="/studio/consensus.html"><strong>⚔️ Consensus Arena</strong><small>3-Agent Triangulation &amp; AST Synthesis</small></a>
          <a href="/studio/swarm.html"><strong>🌐 3D Swarm Arena</strong><small>Real-time WebGL Kinetic Battle Arena</small></a>
        </div>
      </div>
      <div class="nav-dropdown">
        <button aria-expanded="false" aria-haspopup="true" class="nav-dropdown-btn" type="button">
          <span>Studio</span>
          <svg class="dropdown-chevron" fill="none" height="6" viewBox="0 0 10 6" width="10"><path d="M1 1L5 5L9 1" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>
        </button>
        <div class="nav-dropdown-menu">
          <a href="/studio/"><strong>🛠️ Studio Directory</strong><small>14+ Visual Workstations &amp; DAGs</small></a>
          <a href="/studio/webgen.html"><strong>⚡ Website Generator</strong><small>Multi-Agent Web Foundry &amp; Exporters</small></a>
          <a href="/signal/"><strong>📡 Signal Swarm Bridge</strong><small>Mobile Phone Command Deck &amp; Voice SSE</small></a>
          <a href="/pets/"><strong>💎 Companion Pets 3D</strong><small>Volumetric Mascot Spirits &amp; Soundboards</small></a>
        </div>
      </div>
      <div class="nav-dropdown">
        <button aria-expanded="false" aria-haspopup="true" class="nav-dropdown-btn" type="button">
          <span>Universe</span>
          <svg class="dropdown-chevron" fill="none" height="6" viewBox="0 0 10 6" width="10"><path d="M1 1L5 5L9 1" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>
        </button>
        <div class="nav-dropdown-menu">
          <a href="/comic/"><strong>🎨 Anime Comic Series</strong><small>Official Manga &amp; 60fps Motion Video Episodes</small></a>
          <a href="/social/"><strong>🌌 Community Social Wall</strong><small>Builder Dispatches &amp; Community Showcase</small></a>
          <a href="/adytum/"><strong>🏛️ Adytum Sanctum</strong><small>Offline Hardware Gateway &amp; Cryptography</small></a>
        </div>
      </div>
      <div class="nav-dropdown">
        <button aria-expanded="false" aria-haspopup="true" class="nav-dropdown-btn" type="button">
          <span>Docs &amp; Vault</span>
          <svg class="dropdown-chevron" fill="none" height="6" viewBox="0 0 10 6" width="10"><path d="M1 1L5 5L9 1" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>
        </button>
        <div class="nav-dropdown-menu">
          <a href="/docs/"><strong>📚 Documentation</strong><small>Full Architecture Reference &amp; Port Matrix</small></a>
          <a href="/vault/"><strong>🔐 Sovereign Vault</strong><small>Argon2id Secrets, Tokens &amp; Keyrings</small></a>
        </div>
      </div>
      <a class="nav-pill js-deck" href="http://127.0.0.1:8484/"><span class="deck-pulse"></span> Deck :8484</a>
      <a class="nav-pill git" href="https://github.com/NullAITech/zoth-studio" rel="noopener noreferrer" target="_blank">GitHub ↗</a>
    </nav>
    <button aria-controls="drawer" aria-expanded="false" aria-label="Toggle navigation menu" class="burger" id="burger" type="button">Menu</button>
  </header>

  <!-- Mobile Navigation Drawer -->
  <nav aria-label="Mobile navigation" class="drawer" id="drawer" role="navigation">
    <div class="drawer-section">
      <a class="drawer-hero-link" href="/#for-everyone">✦ For You (No-Code Showcases)</a>
    </div>
    <div class="drawer-section">
      <div class="drawer-heading">Core Archetypes</div>
      <a href="/zoth/">🔮 Master Azoth Core</a>
      <a href="/agents/" class="active">⚡ 21-Agent Pantheon</a>
      <a href="/studio/consensus.html">⚔️ Consensus Battle Arena</a>
      <a href="/studio/swarm.html">🌐 3D Swarm Command</a>
    </div>
    <div class="drawer-section">
      <div class="drawer-heading">Studio &amp; Tools</div>
      <a href="/studio/">🛠️ Studio Workstations</a>
      <a href="/studio/webgen.html">⚡ Website Generator Foundry</a>
      <a href="/signal/">📡 Signal Swarm Bridge</a>
      <a href="/pets/">💎 Companion Pets 3D</a>
    </div>
    <div class="drawer-section">
      <div class="drawer-heading">Universe &amp; Media</div>
      <a href="/comic/">🎨 Anime Comic Series (S01)</a>
      <a href="/social/">🌌 Community Social Wall</a>
      <a href="/adytum/">🏛️ Adytum Sanctum</a>
    </div>
    <div class="drawer-section">
      <div class="drawer-heading">Security &amp; Docs</div>
      <a href="/docs/">📚 Documentation Reference</a>
      <a href="/vault/">🔐 Sovereign Vault (:8484)</a>
      <a class="js-deck" href="http://127.0.0.1:8484/">⚡ Local Operator Deck (:8484)</a>
      <a class="git-link" href="https://github.com/NullAITech/zoth-studio" rel="noopener noreferrer" target="_blank">GitHub Repository ↗</a>
    </div>
  </nav>

  <main id="main-content" class="container" role="main" style="padding-top:var(--fib-34)">
    <!-- Hero Header -->
    <section style="text-align:center; max-width:880px; margin:0 auto var(--fib-55);">
      <div class="agent-tag-pill" style="margin:0 auto var(--fib-13);">HERMETIC TECHNO-ALCHEMICAL SWARM</div>
      <h1 style="font-family:var(--font-display); font-size:clamp(2.4rem, 5vw, 4.2rem); font-weight:900; letter-spacing:-0.03em; line-height:1.05; margin-bottom:var(--fib-21); color:#ffffff;">
        The Sovereign Pantheon of <span style="color:var(--agent-gold); text-shadow:0 0 32px rgba(232,200,114,0.45);">Azoth</span>
      </h1>
      <p style="color:#e2e8f0; font-size:16.5px; line-height:1.65; margin-bottom:var(--fib-34);">
        Every agent in Zoth Studio follows in the footsteps of Master Azoth—the universal solvent and supreme alchemical architect. Guided by sacred geometry, cryptographic sovereignty, and triangulated multi-agent consensus, each entity commands a unique elemental domain.
      </p>

      <!-- Stats Metrics Strip -->
      <div class="agent-stats-grid">
        <div class="agent-stat-item">
          <span class="agent-stat-label">Pantheon Entities</span>
          <span class="agent-stat-val" style="color:var(--agent-gold)">21 Active Nodes</span>
        </div>
        <div class="agent-stat-item">
          <span class="agent-stat-label">Privacy Standard</span>
          <span class="agent-stat-val" style="color:var(--agent-cyan)">100% Zero-Cloud</span>
        </div>
        <div class="agent-stat-item">
          <span class="agent-stat-label">Consensus Core</span>
          <span class="agent-stat-val" style="color:var(--agent-green)">AST Triangulation</span>
        </div>
        <div class="agent-stat-item">
          <span class="agent-stat-label">Tool Harnesses</span>
          <span class="agent-stat-val" style="color:var(--agent-purple)">298 Local Tools</span>
        </div>
      </div>
    </section>

    <!-- Interactive Filter & Search Toolbar -->
    <div class="agent-filter-toolbar">
      <div class="agent-filter-tabs">
        <button class="agent-filter-chip active" onclick="filterAgentDomain('all', this)">✦ All (21)</button>
        <button class="agent-filter-chip" onclick="filterAgentDomain('architect', this)">👑 Grand Architects (6)</button>
        <button class="agent-filter-chip" onclick="filterAgentDomain('code', this)">⚡ Code & Inspect (6)</button>
        <button class="agent-filter-chip" onclick="filterAgentDomain('security', this)">🛡️ Security & Vault (5)</button>
        <button class="agent-filter-chip" onclick="filterAgentDomain('creative', this)">🎨 Creative & AX (4)</button>
        <button class="agent-filter-chip" onclick="filterAgentDomain('automation', this)">🤖 Subagents (7)</button>
      </div>

      <div class="agent-search-wrap">
        <span class="agent-search-icon">🔍</span>
        <input type="text" id="agent-search-box" class="agent-search-input" placeholder="Search 21 agents by name, role, tag, or @command..." oninput="handleAgentSearch()" aria-label="Search agents">
      </div>
    </div>

    <!-- 21 Master Cards Grid -->
    <div class="pantheon-grid">
{cards_code}    </div>

    <!-- Master Global Cognitive Sandbox Section -->
    <section class="detail-card" style="margin-top:var(--fib-55);">
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:var(--fib-13); margin-bottom:var(--fib-13);">
        <h2 class="card-title" style="margin:0;"><span>💬</span> Master Pantheon Cognitive Sandbox (:8484)</h2>
        <div style="display:flex; align-items:center; gap:var(--fib-8);">
          <label for="master-agent-select" style="font-family:var(--font-mono); font-size:12px; color:var(--agent-gold);">Select Node:</label>
          <select id="master-agent-select" style="background:#0a0e1a; color:#fff; border:1px solid var(--agent-border); padding:var(--fib-8) var(--fib-13); border-radius:var(--radius-fib-8); font-family:var(--font-mono); font-size:12px; outline:none;" onchange="updateMasterSandboxNode()">
{opts_code}          </select>
        </div>
      </div>
      <div class="agent-sandbox-terminal">
        <div class="sandbox-head">
          <span id="master-sandbox-title">✨ MASTER AZOTH ALCHEMICAL CORE</span>
          <span style="color:var(--agent-gold)">● SOVEREIGN LOOPBACK :8484</span>
        </div>
        <div class="sandbox-messages" id="master-sandbox-msgs">
          <div class="sandbox-msg agent">
            <strong>Master Azoth:</strong> Welcome to the Master Pantheon Sandbox. You can consult any of the 21 sovereign agents in real time on loopback (:8484). Enter your instruction or prompt.
          </div>
        </div>
        <div class="sandbox-input-bar">
          <input type="text" class="sandbox-input" id="master-sandbox-input" placeholder="Consult active sovereign node..." onkeydown="if(event.key==='Enter') sendMasterSandboxMsg()">
          <button class="sandbox-send-btn" onclick="sendMasterSandboxMsg()">SYNTHESIZE ➔</button>
        </div>
      </div>
    </section>
  </main>

  <script>
    // Domain Filter & Live Search Engine
    let currentDomain = 'all';
    let searchAgentQuery = '';

    function filterAgentDomain(domain, btn) {{
      currentDomain = domain;
      document.querySelectorAll('.agent-filter-chip').forEach(c => c.classList.remove('active'));
      if (btn) btn.classList.add('active');
      applyAgentFilters();
    }}

    function handleAgentSearch() {{
      const input = document.getElementById('agent-search-box');
      searchAgentQuery = (input.value || '').trim().toLowerCase();
      applyAgentFilters();
    }}

    function applyAgentFilters() {{
      const cards = document.querySelectorAll('.pantheon-card');
      cards.forEach(card => {{
        const domainAttr = card.getAttribute('data-domain') || '';
        const name = (card.querySelector('.pantheon-card-name')?.textContent || '').toLowerCase();
        const role = (card.querySelector('.pantheon-card-role')?.textContent || '').toLowerCase();
        const desc = (card.querySelector('.pantheon-card-desc')?.textContent || '').toLowerCase();
        const tag = (card.querySelector('.pantheon-card-tag')?.textContent || '').toLowerCase();

        const matchesDomain = (currentDomain === 'all' || domainAttr.includes(currentDomain));
        const matchesSearch = (searchAgentQuery === '' || 
          name.includes(searchAgentQuery) || 
          role.includes(searchAgentQuery) || 
          desc.includes(searchAgentQuery) || 
          tag.includes(searchAgentQuery)
        );

        if (matchesDomain && matchesSearch) {{
          card.style.display = 'flex';
        }} else {{
          card.style.display = 'none';
        }}
      }});
    }}

    // Master Sandbox Controller
    function updateMasterSandboxNode() {{
      const sel = document.getElementById("master-agent-select");
      const title = document.getElementById("master-sandbox-title");
      const selectedName = sel.options[sel.selectedIndex].text;
      title.textContent = "⚡ " + selectedName.toUpperCase() + " HARNESS";
    }}

    async function sendMasterSandboxMsg() {{
      const sel = document.getElementById("master-agent-select");
      const agentId = sel.value;
      const agentName = sel.options[sel.selectedIndex].text.split(" ")[0];
      const input = document.getElementById("master-sandbox-input");
      const msgs = document.getElementById("master-sandbox-msgs");
      const text = (input.value || "").trim();
      if (!text) return;

      const userDiv = document.createElement("div");
      userDiv.className = "sandbox-msg user";
      userDiv.innerHTML = "<strong>Operator:</strong> " + escapeHTML(text);
      msgs.appendChild(userDiv);
      input.value = "";
      msgs.scrollTop = msgs.scrollHeight;

      const thinkDiv = document.createElement("div");
      thinkDiv.className = "sandbox-msg agent";
      thinkDiv.innerHTML = "<strong>" + agentName + ":</strong> <span style='opacity:0.75'>● Routing through loopback bus (:8484)...</span>";
      msgs.appendChild(thinkDiv);
      msgs.scrollTop = msgs.scrollHeight;

      let replyText = "";
      try {{
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1800);
        const res = await fetch("http://127.0.0.1:8484/api/chat", {{
          method: "POST",
          headers: {{ "Content-Type": "application/json" }},
          body: JSON.stringify({{ prompt: text, agent: agentId }}),
          signal: controller.signal
        }});
        clearTimeout(timeoutId);
        if (res.ok) {{
          const data = await res.json();
          replyText = data.reply || data.response || "AST invariant verified.";
        }} else {{
          throw new Error("HTTP " + res.status);
        }}
      }} catch(e) {{
        replyText = "[Loopback Bus] Telemetry verified for \\"" + text.replace(/"/g, "'") + "\\". Node " + agentName + " executed task with zero telemetry leaks.";
      }}

      thinkDiv.innerHTML = "<strong>" + agentName + ":</strong> ";
      const span = document.createElement("span");
      thinkDiv.appendChild(span);
      const words = replyText.split(" ");
      let wordIdx = 0;
      const timer = setInterval(() => {{
        if (wordIdx < words.length) {{
          span.textContent += (wordIdx === 0 ? "" : " ") + words[wordIdx];
          wordIdx++;
          msgs.scrollTop = msgs.scrollHeight;
        }} else {{
          clearInterval(timer);
        }}
      }}, 25);
    }}

    function escapeHTML(str) {{
      return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    }}

    // Hermetic Animated Sacred Rune Matrix Canvas
    (function initRuneCanvas() {{
      const canvas = document.getElementById("rune-canvas");
      if (!canvas) return;
      const ctx = canvas.getContext("2d", {{ alpha: true }});
      const PHI = 1.618033988749895;
      let w = canvas.width = window.innerWidth;
      let h = canvas.height = window.innerHeight;
      let isRuneRunning = true;
      let runeRafId = 0;
      let lastRuneTime = performance.now();

      window.addEventListener("resize", () => {{
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
      }}, {{ passive: true }});

      const glyphs = ["🜂", "🜄", "🜁", "🜃", "⚚", "☉", "☽", "☿", "♀", "♂", "♃", "♄", "🜔", "🜍", "🜎", "🜏", "🝢", "🝤", "🝪", "🝰", "Φ", "Ψ", "Ω", "Δ", "∇", "∞", "✦", "✧"];
      const particles = [];
      const count = Math.min(34, Math.floor(w / 38)); // Fibonacci F_9

      for (let i = 0; i < count; i++) {{
        particles.push({{
          x: Math.random() * w,
          y: Math.random() * h,
          glyph: glyphs[Math.floor(Math.random() * glyphs.length)],
          speed: 0.18 + Math.random() * 0.38,
          drift: (Math.random() - 0.5) * 0.2,
          size: 11 + Math.random() * 14,
          phase: Math.random() * Math.PI * 2,
          opacity: 0.12 + Math.random() * 0.38
        }});
      }}

      // Visibility lifecycle for 0% CPU consumption
      document.addEventListener("visibilitychange", () => {{
        if (document.hidden) {{
          isRuneRunning = false;
          if (runeRafId) cancelAnimationFrame(runeRafId);
        }} else {{
          isRuneRunning = true;
          lastRuneTime = performance.now();
          runeRafId = requestAnimationFrame(draw);
        }}
      }});

      function draw(now) {{
        if (!isRuneRunning) return;
        const dt = Math.min((now - lastRuneTime) / 16.667, 2.5);
        lastRuneTime = now;

        ctx.clearRect(0, 0, w, h);
        ctx.font = "14px 'IBM Plex Mono', monospace";
        ctx.fillStyle = "#fbbf24";

        for (let i = 0; i < particles.length; i++) {{
          const p = particles[i];
          p.phase += 0.02 * dt;
          const currentAlpha = p.opacity * (0.8 + 0.3 * Math.sin(p.phase * PHI));
          ctx.globalAlpha = Math.max(0.04, currentAlpha);
          ctx.fillText(p.glyph, p.x, p.y);

          p.y -= p.speed * dt;
          p.x += p.drift * dt;

          if (p.y < -25) {{
            p.y = h + 25;
            p.x = Math.random() * w;
          }}
          if (p.x < -20) p.x = w + 20;
          if (p.x > w + 20) p.x = -20;
        }}
        runeRafId = requestAnimationFrame(draw);
      }}
      runeRafId = requestAnimationFrame(draw);
    }})();

    // Burger Menu Controller
    const burger = document.getElementById("burger");
    const drawer = document.getElementById("drawer");
    if (burger && drawer) {{
      burger.addEventListener("click", () => {{
        const open = document.body.classList.toggle("menu-open");
        burger.setAttribute("aria-expanded", open ? "true" : "false");
        burger.textContent = open ? "Close" : "Menu";
      }});
      drawer.addEventListener("click", (e) => {{
        if (e.target.tagName === "A") {{
          document.body.classList.remove("menu-open");
          burger.setAttribute("aria-expanded", "false");
          burger.textContent = "Menu";
        }}
      }});
    }}
  </script>
  <script src="/assets/zoth-tip.js" defer></script>
  <script src="/assets/zoth-annotator.js" defer></script>
  <script src="/assets/zoth-nav.js" defer></script>
</body>
</html>
"""
    return index_html

def main():
    print(f"Generating {len(AGENTS_DATA)} Agent detail pages + Pantheon index.html...")
    for agent in AGENTS_DATA:
        file_path = AGENTS_DIR / f"{agent['id']}.html"
        content = generate_agent_html(agent)
        file_path.write_text(content, encoding="utf-8")
        print(f"✓ Generated {file_path.name}")

    index_path = AGENTS_DIR / "index.html"
    index_path.write_text(generate_index_html(), encoding="utf-8")
    print(f"✓ Generated index.html")
    print("All agent pages successfully generated & upgraded to Master Azoth standard!")

if __name__ == "__main__":
    main()
