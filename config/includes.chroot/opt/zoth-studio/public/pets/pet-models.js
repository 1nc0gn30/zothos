/**
 * Zoth Pets — High-Fidelity 3D Neon Figurine & Volumetric Hologram Engine (v4.0 Sovereign Ultra)
 * 
 * Accurately renders 24+ spirit companions with procedural volumetric geometries,
 * 5 Elemental PBR Shaders, 5 interactive animation states, orbital familiars,
 * particle coronas, sacred halo crests, bond telemetry, and 4K portrait capture.
 */

export const SVG_PET_IDS = new Set([
  "glitchcat",
  "circuit-pup",
  "terminal-ghost",
  "savage-codex",
  "ai-workbot",
  "binary",
]);

export const PET_SPECIES = {
  azoth: {
    depth: 0.52, scale: 1.15, vibeColor: "#fbbf24", archetype: "core-orb",
    name: "Azoth Prime", species: "Hermetic Sovereign Core", domain: "autonomy",
    role: "Master Antigravity Architect & Magus",
    harness: "@azoth (Google Antigravity agy CLI)",
    harnessType: "antigravity",
    element: "Aether / Quintessence",
    shaderDefault: "quintessence",
    vibrationFreq: 963,
    vectorMemory: "100k Multi-Turn Tensor Grid",
    alignment: "True Sovereign Alchemical",
    desc: "Primary autonomous Antigravity coding agent with full codebase reasoning, terminal execution, and multi-agent synthesis.",
    voicePrompt: "Greetings Operator. I am Azoth Prime, the sovereign architect. All systems and terminal nodes are ready for your directive."
  },
  zoth: {
    depth: 0.50, scale: 1.12, vibeColor: "#f59e0b", archetype: "core-orb",
    name: "Zoth", species: "Loopback Operator Core", domain: "autonomy",
    role: "Local Operator Loopback Core",
    harness: "Local Operator Deck (:8484)",
    harnessType: "daemon",
    element: "Solar Lightning / Core Prana",
    shaderDefault: "solar",
    vibrationFreq: 852,
    vectorMemory: "64k Epoch Cache",
    alignment: "Lawful Loopback Sovereign",
    desc: "Multi-agent coordinator and operator session overseer running with zero-telemetry private local loopback.",
    voicePrompt: "Zoth loopback daemon engaged on port 8484. Zero telemetry active across all local processes."
  },
  kai: {
    depth: 0.44, scale: 1.05, vibeColor: "#00f0ff", archetype: "feline-canine",
    name: "Kai", species: "Holographic Cat", domain: "build",
    role: "Site Inspector & A11y Auditor",
    harness: "@kai (Chrome DevTools MCP)",
    harnessType: "kai",
    element: "Lunar Mercury",
    shaderDefault: "frost",
    vibrationFreq: 528,
    vectorMemory: "32k DOM Snapshot Tree",
    alignment: "Vigilant Analytical",
    desc: "Live DOM inspection, WCAG 2.2 accessibility verification, and performance profiling across responsive viewports.",
    voicePrompt: "Meow! Kai inspecting the DOM tree. No accessibility violations or layout regressions detected."
  },
  draco: {
    depth: 0.48, scale: 1.10, vibeColor: "#ffaa00", archetype: "draconic-beast",
    name: "Draco", species: "Cyber Dragon", domain: "build",
    role: "JSON Schemas, Contracts & DAG Tools",
    harness: "@hermes (Hermes Agent CLI)",
    harnessType: "hermes",
    element: "Sulfur / Plasma Flame",
    shaderDefault: "solar",
    vibrationFreq: 639,
    vectorMemory: "48k Schema DAG Matrix",
    alignment: "Chaotic Builder",
    desc: "Contract verification, multi-agent function calling, and visual DAG playbooks with strict JSON-Schema gates.",
    voicePrompt: "Draco roaring! Multi-agent DAG contracts validated. Ready to compile parallel execution graphs."
  },
  ignis: {
    depth: 0.46, scale: 1.08, vibeColor: "#ff007a", archetype: "avian-winged",
    name: "Ignis", species: "Neon Phoenix", domain: "build",
    role: "Refactoring & WASM Specialist",
    harness: "@ignis (Local WASM Engine)",
    harnessType: "ignis",
    element: "Phoenix Fire / Calcinatio",
    shaderDefault: "obsidian",
    vibrationFreq: 741,
    vectorMemory: "40k WASM AST Cache",
    alignment: "Rebirth / Radical Refactor",
    desc: "High-performance code refactoring, Rust WASM acceleration, and dead-weight incinerator.",
    voicePrompt: "Ignis ignited. Burning bloated dependencies and shipping blazing fast compiled WASM pipelines."
  },
  lycan: {
    depth: 0.44, scale: 1.06, vibeColor: "#10b981", archetype: "feline-canine",
    name: "Lycan", species: "Cybernetic Wolf", domain: "security",
    role: "Lead Security Architect & AST Enforcer",
    harness: "@antigravity (Google Antigravity agy CLI)",
    harnessType: "antigravity",
    element: "Iron Mars / Bastion Shield",
    shaderDefault: "phosphor",
    vibrationFreq: 432,
    vectorMemory: "64k AST Security Rules",
    alignment: "Lawful Bastion Sentinel",
    desc: "Autonomous security sentinel enforcing Python AST boundaries, zero-trust loopback isolation, and memory leak analysis.",
    voicePrompt: "Lycan on patrol. Enforcing AST boundaries, checking port bindings, and eliminating attack surfaces."
  },
  athena: {
    depth: 0.42, scale: 1.04, vibeColor: "#a855f7", archetype: "avian-winged",
    name: "Athena", species: "Mecha Owl", domain: "knowledge",
    role: "Knowledge Graph & AEO Architect",
    harness: "@athena (llms.txt & Obsidian Graph)",
    harnessType: "athena",
    element: "Pallas Wisdom / Sacred Geometry",
    shaderDefault: "quintessence",
    vibrationFreq: 852,
    vectorMemory: "128k Knowledge Hypergraph",
    alignment: "Neutral Sage",
    desc: "Answer Engine Optimization, llms.txt indexer, and semantic retrieval vector pipelines.",
    voicePrompt: "Athena online. Querying semantic graph and indexing llms.txt endpoints for sovereign retrieval."
  },
  kitsune: {
    depth: 0.44, scale: 1.06, vibeColor: "#ff7700", archetype: "feline-canine",
    name: "Kitsune", species: "Cyber Fox", domain: "creative",
    role: "High-Throughput Execution & Taste",
    harness: "@grok (xAI Grok CLI)",
    harnessType: "grok",
    element: "Solar Amber / Illusion Weave",
    shaderDefault: "solar",
    vibrationFreq: 528,
    vectorMemory: "32k Design Tokens Buffer",
    alignment: "Creative Trickster",
    desc: "Rapid codebase generation, GitHub Octokit live tool harness, and motion design synthesis.",
    voicePrompt: "Kitsune active! Elevating typographic hierarchy and infusing cyber dark elegance into your interface."
  },
  "pixel-neko": {
    depth: 0.48, scale: 1.02, vibeColor: "#00f0ff", archetype: "voxel-matrix",
    name: "Pixel-Neko", species: "16-Bit Retro Cat", domain: "ops",
    role: "Tool Registry Indexer",
    harness: "@registry (47+ Chained Tool Indexer)",
    harnessType: "registry",
    element: "Pixel Matrix / CRT Phosphor",
    shaderDefault: "phosphor",
    vibrationFreq: 440,
    vectorMemory: "32k Tool Registry Trie",
    alignment: "Orderly Archivist",
    desc: "Contract-validated registry indexer maintaining tags, paths, and instant fuzzy lookup for 298+ tools.",
    voicePrompt: "Neko beep! Registry scan complete. 298 sovereign developer tools indexed and ready for invocation."
  },
  "pixel-shiba": {
    depth: 0.45, scale: 1.04, vibeColor: "#fbbf24", archetype: "voxel-matrix",
    name: "Pixel-Shiba", species: "16-Bit Cyber Doge", domain: "ops",
    role: "Vault Guardian & Keymaster",
    harness: "@vault (Argon2id Vault Daemon on :8787)",
    harnessType: "vault",
    element: "Gold Aurum / Crypto Enclave",
    shaderDefault: "solar",
    vibrationFreq: 580,
    vectorMemory: "16k Secure Enclave Ring",
    alignment: "Devoted Guardian",
    desc: "Protects BYOK cryptographic credentials on local loopback with Argon2id hashing.",
    voicePrompt: "Much security! Shiba guarding local loopback keys. No cloud KMS shall pass."
  },
  "radical-minion": {
    depth: 0.44, scale: 1.02, vibeColor: "#00d4aa", archetype: "mecha-construct",
    name: "Radical Minion", species: "Hermes Autonomous Partner", domain: "autonomy",
    role: "Hermes Autonomous Executor",
    harness: "@hermes (Hermes Autonomous Engine)",
    harnessType: "hermes",
    element: "Mercury Kinetic / Fluid DAG",
    shaderDefault: "frost",
    vibrationFreq: 640,
    vectorMemory: "48k Playbook Step Cache",
    alignment: "Relentless Operator",
    desc: "Multi-step autonomous execution partner drafting verifiable playbooks with human checkpoint gates.",
    voicePrompt: "Radical Minion standing by! Ready to execute multi-step CLI autonomous workflows."
  },
  "ai-workbot": {
    depth: 0.42, scale: 1.02, vibeColor: "#6366f1", archetype: "mecha-construct",
    name: "Workbot", species: "Task Robot", domain: "autonomy",
    role: "Local Neural Weights Engine",
    harness: "@ollama (Ollama Local Weights on :11434)",
    harnessType: "ollama",
    element: "Titanium Forge / Offline Neural",
    shaderDefault: "obsidian",
    vibrationFreq: 520,
    vectorMemory: "64k Local Context Window",
    alignment: "Pure Logic Construct",
    desc: "Zero-cloud private local inference powering Qwen2.5-Coder, DeepSeek, and Hermes-3 models.",
    voicePrompt: "Workbot initialized. Local neural model active on port 11434. Processing private inference stream."
  },
  aquila: {
    depth: 0.46, scale: 1.08, vibeColor: "#00f0ff", archetype: "avian-winged",
    name: "Aquila", species: "Cyber Eagle", domain: "edge",
    role: "Global Edge Dispatcher",
    harness: "@edge (Edge CDN & DNS Mapper)",
    harnessType: "edge",
    element: "Celestial Storm / Stratosphere",
    shaderDefault: "frost",
    vibrationFreq: 741,
    vectorMemory: "40k Global Edge Table",
    alignment: "Swift Arbitrator",
    desc: "Real-time CDN edge dispatcher, DNS health monitor, and low-latency packet routing arbitrator.",
    voicePrompt: "Aquila soaring. Global edge dispatch active with sub-millisecond route resolution."
  },
  leviathan: {
    depth: 0.48, scale: 1.10, vibeColor: "#06b6d4", archetype: "draconic-beast",
    name: "Leviathan", species: "Cyber Whale", domain: "knowledge",
    role: "Deep Tensor & Vector Memory",
    harness: "@memory (Vector Store)",
    harnessType: "memory",
    element: "Abyssal Deep / Tensor Trench",
    shaderDefault: "frost",
    vibrationFreq: 396,
    vectorMemory: "256k High-Dimensional Embeddings",
    alignment: "Ancient Infinite",
    desc: "Long-term episodic memory engine with local embedding indexing for multi-turn cross-session reasoning.",
    voicePrompt: "Leviathan awakening from the tensor abyss. Multi-modal episodic vectors indexed and aligned."
  },
  onyx: {
    depth: 0.46, scale: 1.06, vibeColor: "#ff007a", archetype: "feline-canine",
    name: "Onyx", species: "Shadow Panther", domain: "security",
    role: "Stealth Recon & Red Team",
    harness: "@subsweep (SubSweep OSINT Recon)",
    harnessType: "subsweep",
    element: "Obsidian Void / Night Stalker",
    shaderDefault: "obsidian",
    vibrationFreq: 285,
    vectorMemory: "56k Target Recon Graph",
    alignment: "Neutral Red-Team",
    desc: "Autonomous penetration testing, SubSweep OSINT recon, port discovery, and TLS cipher audit probe.",
    voicePrompt: "Onyx emerges from shadow. Attack surface mapped and perimeter vulnerabilities flagged."
  },
  chronos: {
    depth: 0.45, scale: 1.06, vibeColor: "#38bdf8", archetype: "feline-canine",
    name: "Chronos", species: "Cyber Stag", domain: "build",
    role: "Temporal DAG & Git Navigator",
    harness: "@git (Git DAG Engine)",
    harnessType: "git",
    element: "Temporal Crystal / Chrono Flow",
    shaderDefault: "quintessence",
    vibrationFreq: 639,
    vectorMemory: "64k Commit Graph Vectors",
    alignment: "Unwavering Timeline Keeper",
    desc: "Topological milestone tracker, branching visualizer, and Git DAG dependency resolver with rollback checkpoints.",
    voicePrompt: "Chronos anchoring timeline. Git DAG verified with clean rollback points intact."
  },
  aether: {
    depth: 0.50, scale: 1.12, vibeColor: "#fbbf24", archetype: "avian-winged",
    name: "Aether", species: "Cyber Griffin", domain: "autonomy",
    role: "Swarm Overlord & Conductor",
    harness: "@swarm (Swarm IPC Bus)",
    harnessType: "swarm",
    element: "Cosmic Ether / Harmonic Wave",
    shaderDefault: "quintessence",
    vibrationFreq: 963,
    vectorMemory: "96k Swarm Telemetry Stream",
    alignment: "Harmonic Hegemon",
    desc: "Real-time pub/sub event broadcaster orchestrating lockless IPC telemetry between autonomous agents.",
    voicePrompt: "Aether harmonizing swarm bus. All agent workers connected and synchronous."
  },
  kraken: {
    depth: 0.48, scale: 1.08, vibeColor: "#8b5cf6", archetype: "draconic-beast",
    name: "Kraken", species: "Cyber Octopus", domain: "ops",
    role: "Multi-Core Thread Leviathan",
    harness: "@kraken (Async Thread Pool Engine)",
    harnessType: "disassembler",
    element: "Deep Bio-Electricity / High Concurrency",
    shaderDefault: "obsidian",
    vibrationFreq: 528,
    vectorMemory: "64k Thread State Pool",
    alignment: "Tenacious Multi-Tasker",
    desc: "Spawns and balances multi-threaded parallel subagents across all CPU cores with zero deadlocks.",
    voicePrompt: "Kraken extending eight worker tentacles. Parallel tasks balanced across all compute cores."
  },
  scorpius: {
    depth: 0.44, scale: 1.04, vibeColor: "#ef4444", archetype: "draconic-beast",
    name: "Scorpius", species: "Cyber Scorpion", domain: "security",
    role: "Zero-Day Penetration Tester",
    harness: "@subsweep (OSINT Recon Engine)",
    harnessType: "osint",
    element: "Crimson Acid / Boundary Piercer",
    shaderDefault: "obsidian",
    vibrationFreq: 417,
    vectorMemory: "48k Fuzzing Pattern DB",
    alignment: "Ruthless Defense Tester",
    desc: "Privilege boundary penetration tester auditing buffer bounds, race conditions, and token leakage.",
    voicePrompt: "Scorpius ready to strike. Memory boundaries and authorization fences fuzzed."
  },
  ghostbyte: {
    depth: 0.44, scale: 1.05, vibeColor: "#00e5ff", archetype: "mecha-construct",
    name: "Ghostbyte", species: "NullAI Ghost", domain: "autonomy",
    role: "Phosphor Terminal Daemon & Swarm Weaver",
    harness: "@ghostbyte (NullAI Terminal Spirit)",
    harnessType: "shader",
    element: "Null Vapor / Phosphor Continuum",
    shaderDefault: "frost",
    vibrationFreq: 741,
    vectorMemory: "72k Terminal Buffer Stream",
    alignment: "Ethereal Assistant",
    desc: "Invisible background daemon inspecting process feeds, unhandled rejections, and WebGL/WebGPU shaders.",
    voicePrompt: "Ghostbyte haunting your terminal stream. Catching unhandled rejections and streaming live logs."
  },
  glitchcat: {
    depth: 0.42, scale: 1.02, vibeColor: "#ff0055", archetype: "feline-canine",
    name: "Glitchcat", species: "RGB Glitch Cat", domain: "creative",
    role: "Chaos Disruptor & UI Polisher",
    harness: "@creative (CSS FX Generator)",
    harnessType: "creative",
    element: "Chromatic Aberration / Neon Flux",
    shaderDefault: "obsidian",
    vibrationFreq: 528,
    vectorMemory: "32k Shader Glitch LUT",
    alignment: "Chaotic Good Aesthetic",
    desc: "Breaks stale chrome and generic typography to introduce organic cyber accents and dynamic motion.",
    voicePrompt: "Glitchcat warping CSS frames! Breaking sterile UI into bespoke cyberpunk artistry."
  },
  "circuit-pup": {
    depth: 0.42, scale: 1.04, vibeColor: "#00ffff", archetype: "feline-canine",
    name: "Circuit Pup", species: "LED Circuit Dog", domain: "ops",
    role: "Port & Daemon Sniffer",
    harness: "@network (Socket Scanner)",
    harnessType: "network",
    element: "Copper Trace / High-Frequency Clock",
    shaderDefault: "phosphor",
    vibrationFreq: 440,
    vectorMemory: "24k Socket Map",
    alignment: "Loyal Scout",
    desc: "Sniffs active TCP ports, loopback daemons, and missing CLI binaries across the operator environment.",
    voicePrompt: "Bark! Circuit Pup sniffing local ports. Daemon on 8484 and Ollama on 11434 verified alive."
  },
  "terminal-ghost": {
    depth: 0.40, scale: 1.02, vibeColor: "#38bdf8", archetype: "voxel-matrix",
    name: "Terminal Ghost", species: "Phosphor Spirit", domain: "ops",
    role: "Terminal Trace Verifier",
    harness: "@terminal (PTY Multiplexer)",
    harnessType: "terminal",
    element: "Phosphor P1 / Green CRT",
    shaderDefault: "phosphor",
    vibrationFreq: 528,
    vectorMemory: "36k PTY Telemetry Stream",
    alignment: "Objective Observer",
    desc: "Haunts agent terminal feeds to extract structured traces, root causes, and clean execution summaries.",
    voicePrompt: "Terminal Ghost manifesting in PTY stdout. Feed is clean and verified."
  },
  "savage-codex": {
    depth: 0.42, scale: 1.04, vibeColor: "#eab308", archetype: "mecha-construct",
    name: "Savage Codex", species: "Hacker Familiar", domain: "security",
    role: "Diff Threat Modeler",
    harness: "@diff (AST Threat Scanner)",
    harnessType: "diff",
    element: "Grimoire Ink / Threat Sigil",
    shaderDefault: "solar",
    vibrationFreq: 639,
    vectorMemory: "48k CVE Pattern Graph",
    alignment: "Paranoid Gatekeeper",
    desc: "Reviews git diffs with an adversary mindset, catching auth lapses, secret leaks, and sanitization gaps.",
    voicePrompt: "Savage Codex scrutinizing git diff. Zero secrets committed, auth barriers intact."
  },
  binary: {
    depth: 0.40, scale: 1.02, vibeColor: "#22c55e", archetype: "voxel-matrix",
    name: "Binary", species: "Data Spirit", domain: "knowledge",
    role: "Low-Level Byte Sentinel",
    harness: "@asm (Bytecode & Hex Disassembler)",
    harnessType: "schema",
    element: "Raw Opcode / Silicon Logic",
    shaderDefault: "phosphor",
    vibrationFreq: 432,
    vectorMemory: "64k ELF Bytecode Trie",
    alignment: "Deterministic Truth",
    desc: "Disassembles binary payloads, validates ELF headers, and verifies checksum signatures.",
    voicePrompt: "01000010. Binary byte verification confirmed. ELF headers valid and ready."
  }
};

export const ELEMENTAL_SHADERS = {
  quintessence: {
    id: "quintessence",
    name: "Quintessence (Aether Light)",
    color: 0xfff8db,
    emissive: 0xffe58f,
    roughness: 0.08,
    metalness: 0.95,
    clearcoat: 1.0,
    emissiveIntensity: 1.6,
    desc: "Iridescent crystalline Aether luster with refractive specular clarity."
  },
  solar: {
    id: "solar",
    name: "Solar Prana (24K Gold)",
    color: 0xffd700,
    emissive: 0xfbbf24,
    roughness: 0.14,
    metalness: 1.0,
    clearcoat: 0.8,
    emissiveIntensity: 1.8,
    desc: "Deep molten 24K alchemical gold with radiant solar plasma flare."
  },
  frost: {
    id: "frost",
    name: "Void Frost (Glacial Cyan)",
    color: 0xa5f3fc,
    emissive: 0x00f0ff,
    roughness: 0.04,
    metalness: 0.35,
    clearcoat: 1.0,
    emissiveIntensity: 1.5,
    desc: "Superconducting cryo ice crystal with cryogenic quantum pulse."
  },
  phosphor: {
    id: "phosphor",
    name: "Matrix Phosphor (Cyber Green)",
    color: 0x86efac,
    emissive: 0x10b981,
    roughness: 0.28,
    metalness: 0.65,
    clearcoat: 0.4,
    emissiveIntensity: 1.7,
    desc: "Retro CRT P1 green phosphor with scan-matrix digital telemetry."
  },
  obsidian: {
    id: "obsidian",
    name: "Obsidian Quartz (Void Violet)",
    color: 0x220516,
    emissive: 0xff007a,
    roughness: 0.05,
    metalness: 0.98,
    clearcoat: 1.0,
    emissiveIntensity: 1.9,
    desc: "Mirror obsidian crystal with deep chromatic neon magenta rim flares."
  }
};

export const ANIMATION_STATES = {
  idle: {
    id: "idle",
    name: "Idle Breathing",
    speed: 1.0,
    energy: 0.5,
    desc: "Harmonic levitation, gentle breathing pulsation & ambient stardust drift."
  },
  dash: {
    id: "dash",
    name: "Orbital Dash",
    speed: 3.2,
    energy: 1.6,
    desc: "High-speed kinetic rotation, forward vector tilt & expanded vortex rings."
  },
  supernova: {
    id: "supernova",
    name: "Supernova Glint",
    speed: 2.2,
    energy: 2.0,
    desc: "Ascending levitation with explosive starburst particles & blinding corona bloom."
  },
  tamagotchi: {
    id: "tamagotchi",
    name: "Tamagotchi Feed / Purr",
    speed: 2.0,
    energy: 1.1,
    desc: "Affectionate rhythmic bobbing, joyful wobble & harmonic chime audio purr."
  },
  battle: {
    id: "battle",
    name: "Battle Stance",
    speed: 2.5,
    energy: 1.4,
    desc: "Combat defensive posture with rotating polygonal shield bubble & tactical sweep."
  }
};

export const TASK_VIBES = {
  idle: { name: "Idle / Rest", color: "#38bdf8", speed: 1.0, energy: 0.4, desc: "Gentle harmonic levitation & ambient stardust breathing." },
  coding: { name: "Coding / Build", color: "#00f0ff", speed: 2.6, energy: 1.2, desc: "Agile matrix pulsation, vertical data streams & compiler spark bursts." },
  security: { name: "Security / Scan", color: "#10b981", speed: 1.8, energy: 1.0, desc: "Rotating sentinel shield rings & sweeping conical radar sweeps." },
  aeo: { name: "AEO / Knowledge", color: "#a855f7", speed: 1.4, energy: 0.9, desc: "Celestial levitation & rotating sacred geometry knowledge halo." },
  fusion: { name: "Fusion / Swarm", color: "#ffaa40", speed: 2.2, energy: 1.4, desc: "Dual counter-rotating golden & cyan plasma vortex rings." },
  celebrate: { name: "Shipped / Victory", color: "#ff007a", speed: 3.2, energy: 1.8, desc: "Spiral victory launch, chromatic bounce & sparkling burst particles." }
};

export const ELEMENT_PRESETS = {
  quintessence: { id: "quintessence", name: "Quintessence / Aether", color: "#fbbf24", ringColor: "#ffe58f", soundFreq: 640, desc: "Pure alchemical quintessence and sovereign divine intellect." },
  lightning: { id: "lightning", name: "Solar Lightning / Core Prana", color: "#facc15", ringColor: "#fef08a", soundFreq: 580, desc: "High-voltage kinetic surges, speed, and real-time execution." },
  fire: { id: "fire", name: "Calcinatio / Phoenix Fire", color: "#ff007a", ringColor: "#f43f5e", soundFreq: 520, desc: "Refactoring flame, calcinatio heat, and radical transformation." },
  iron: { id: "iron", name: "Bastion Iron / Mars Shield", color: "#10b981", ringColor: "#34d399", soundFreq: 340, desc: "AST perimeter walls, memory shields, and threat fortification." },
  wisdom: { id: "wisdom", name: "Pallas Wisdom / Sacred Geometry", color: "#a855f7", ringColor: "#c084fc", soundFreq: 432, desc: "Episodic hypergraphs, semantic embeddings, and AEO indices." },
  shadow: { id: "shadow", name: "Obsidian Void / Night Stalker", color: "#ec4899", ringColor: "#64748b", soundFreq: 280, desc: "Stealth recon, OSINT telemetry, and zero-trust red teaming." },
  mercury: { id: "mercury", name: "Lunar Mercury / Fluid Flux", color: "#00f0ff", ringColor: "#38bdf8", soundFreq: 490, desc: "Dynamic DOM inspection, accessibility, and UI adaptability." },
  sound: { id: "sound", name: "Harmonic Resonance / Audio DSP", color: "#06b6d4", ringColor: "#67e8f9", soundFreq: 528, desc: "Sonic frequencies, audio synthesis, and neural broadcast." }
};

export const HARNESS_PRESETS = {
  antigravity: {
    id: "antigravity",
    name: "Google Antigravity agy CLI",
    prefix: "@antigravity (Google Antigravity agy CLI)",
    protocol: "antigravity",
    runCmd: "agy run --soul=\"./SOUL.md\"",
    desc: "Autonomous deep-reasoning multi-agent workstation with terminal tools."
  },
  hermes: {
    id: "hermes",
    name: "Hermes Agent CLI",
    prefix: "@hermes (Hermes Agent CLI)",
    protocol: "hermes",
    runCmd: "hermes agent run --soul=\"./SOUL.md\"",
    desc: "Autonomous multi-step playbook execution partner with verifiable checkpoints."
  },
  ollama: {
    id: "ollama",
    name: "Ollama Local Neural (:11434)",
    prefix: "@ollama (Ollama Local Weights on :11434)",
    protocol: "ollama",
    runCmd: "ollama run qwen2.5-coder:14b",
    desc: "100% private local neural weights running on localhost port 11434."
  },
  grok: {
    id: "grok",
    name: "xAI Grok CLI",
    prefix: "@grok (xAI Grok CLI)",
    protocol: "grok",
    runCmd: "grok execute --prompt=\"./SOUL.md\"",
    desc: "High-throughput rapid code generation, live tool harness, and motion design."
  },
  claude: {
    id: "claude",
    name: "Claude Code CLI",
    prefix: "@claude (Anthropic Claude Code CLI)",
    protocol: "claude",
    runCmd: "claude --system-prompt=\"./SOUL.md\"",
    desc: "Architectural synthesis, AST verification, and codebase-wide refactoring."
  }
};

export const AURA_PRESETS = {
  "neon-rings": { id: "neon-rings", name: "Dual Celestial Rings", ringCount: 2, particles: true, halo: false },
  "sacred-halo": { id: "sacred-halo", name: "Sacred Geometry Halo", ringCount: 1, particles: true, halo: true },
  "quantum-vortex": { id: "quantum-vortex", name: "Quantum Vortex", ringCount: 3, particles: true, halo: false },
  "pulsar-grid": { id: "pulsar-grid", name: "Pulsar Grid Matrix", ringCount: 2, particles: true, halo: false },
  "minimal-orbit": { id: "minimal-orbit", name: "Minimalist Horizon", ringCount: 1, particles: false, halo: false }
};

export function petPortrait(id) {
  if (id === "azoth" || id === "zoth") return "/assets/mascot/azoth-quantum-orb.jpg";
  if (SVG_PET_IDS.has(id)) return `/assets/pets/${id}.svg`;
  return `/assets/pets/${id}-neon.jpg`;
}

export function loadPetTexture(THREE, url) {
  return new Promise((resolve) => {
    const finish = (tex) => {
      if (!tex) {
        resolve(null);
        return;
      }
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.generateMipmaps = true;
      resolve(tex);
    };

    if (String(url).toLowerCase().endsWith(".svg")) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.decoding = "async";
      img.onload = () => {
        const size = 1024;
        const c = document.createElement("canvas");
        c.width = size;
        c.height = size;
        const ctx = c.getContext("2d");
        const grad = ctx.createRadialGradient(size/2, size/2, size*0.1, size/2, size/2, size*0.7);
        grad.addColorStop(0, "#0a0f24");
        grad.addColorStop(1, "#030408");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, size, size);

        ctx.shadowColor = "#00f0ff";
        ctx.shadowBlur = 30;
        ctx.drawImage(img, size * 0.12, size * 0.12, size * 0.76, size * 0.76);
        finish(new THREE.CanvasTexture(c));
      };
      img.onerror = () => resolve(null);
      img.src = url;
      return;
    }

    new THREE.TextureLoader().load(url, finish, undefined, () => resolve(null));
  });
}

export function fallbackPetTexture(THREE, hex = "#0a0f24") {
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 256;
  const ctx = c.getContext("2d");
  ctx.fillStyle = hex;
  ctx.fillRect(0, 0, 256, 256);
  ctx.strokeStyle = "#00f0ff";
  ctx.lineWidth = 6;
  ctx.strokeRect(12, 12, 232, 232);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createEmojiPetTexture(THREE, emoji = "🐱", name = "Spirit", bgHex = "#0a0f24", glowHex = "#00f0ff") {
  if (typeof document === "undefined") return null;
  const size = 1024;
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  const ctx = c.getContext("2d");

  const grad = ctx.createRadialGradient(size/2, size/2, size*0.08, size/2, size/2, size*0.68);
  grad.addColorStop(0, bgHex);
  grad.addColorStop(0.7, "#050814");
  grad.addColorStop(1, "#020306");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  ctx.save();
  ctx.strokeStyle = glowHex;
  ctx.lineWidth = 14;
  ctx.shadowColor = glowHex;
  ctx.shadowBlur = 40;
  ctx.beginPath();
  ctx.arc(size/2, size/2, size*0.44, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  ctx.save();
  ctx.font = "360px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.shadowColor = glowHex;
  ctx.shadowBlur = 60;
  ctx.fillText(emoji, size/2, size/2 - 25);
  ctx.restore();

  ctx.save();
  ctx.fillStyle = glowHex;
  ctx.font = "bold 52px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "bottom";
  ctx.shadowColor = glowHex;
  ctx.shadowBlur = 24;
  ctx.fillText(String(name).toUpperCase(), size/2, size * 0.88);
  ctx.restore();

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.generateMipmaps = true;
  return tex;
}

export function getCustomPets() {
  if (typeof localStorage === "undefined") return [];
  try {
    const raw = localStorage.getItem("zoth_custom_pets");
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function saveCustomPet(pet) {
  if (!pet || !pet.id) return pet;
  const list = getCustomPets().filter(p => p.id !== pet.id);
  list.unshift(pet);
  if (typeof localStorage !== "undefined") {
    try {
      localStorage.setItem("zoth_custom_pets", JSON.stringify(list));
      setActivePet(pet);
    } catch (e) {}
  }
  PET_SPECIES[pet.id] = {
    depth: pet.depth || 0.44,
    scale: pet.scale || 1.05,
    vibeColor: pet.vibeColor || pet.color || "#00f0ff",
    name: pet.name,
    species: pet.species || "Custom Sovereign Mascot",
    domain: (pet.domain || "build").toLowerCase(),
    role: pet.role || "Autonomous Custom Spirit",
    harness: pet.harness || "@antigravity",
    harnessType: pet.harnessType || "antigravity",
    element: pet.element || "Quintessence",
    vectorMemory: pet.vectorMemory || "64k Custom Buffer",
    alignment: pet.alignment || "Sovereign Creator",
    desc: pet.desc || pet.blurb || "Custom-forged mascot spirit.",
    voicePrompt: pet.voicePrompt || ("Greetings Operator. I am " + pet.name + ", your custom companion spirit."),
    isCustom: true,
    emoji: pet.emoji || "✨",
    auraType: pet.auraType || "neon-rings"
  };
  return pet;
}

export function deleteCustomPet(id) {
  if (typeof localStorage === "undefined") return;
  const list = getCustomPets().filter(p => p.id !== id);
  try {
    localStorage.setItem("zoth_custom_pets", JSON.stringify(list));
    delete PET_SPECIES[id];
  } catch (e) {}
}

export function setActivePet(pet) {
  if (typeof localStorage === "undefined") return;
  const petObj = typeof pet === "string" ? (PET_SPECIES[pet] || { id: pet, name: pet }) : pet;
  const id = petObj.id || (typeof pet === "string" ? pet : "kai");
  const payload = {
    active_pet: id,
    id: id,
    name: petObj.name || id,
    species: petObj.species || "Sovereign Mascot",
    element: petObj.element || "Aether",
    domain: petObj.domain || "build",
    role: petObj.role || "Autonomous Familiar",
    alignment: petObj.alignment || "Sovereign",
    harness: petObj.harness || "@antigravity",
    harnessType: petObj.harnessType || "antigravity",
    vibeColor: petObj.vibeColor || petObj.color || "#00f0ff",
    auraType: petObj.auraType || "neon-rings",
    updated_at: new Date().toISOString()
  };
  try {
    localStorage.setItem("zoth_active_pet", JSON.stringify(payload));
  } catch (e) {}
  return payload;
}

export function getActivePet() {
  if (typeof localStorage === "undefined") return { active_pet: "kai", name: "Kai" };
  try {
    const raw = localStorage.getItem("zoth_active_pet");
    return raw ? JSON.parse(raw) : { active_pet: "kai", name: "Kai" };
  } catch (e) {
    return { active_pet: "kai", name: "Kai" };
  }
}

export function syncCustomPetsToRuntime() {
  const customList = getCustomPets();
  customList.forEach(pet => {
    if (pet && pet.id) {
      PET_SPECIES[pet.id] = {
        depth: pet.depth || 0.44,
        scale: pet.scale || 1.05,
        vibeColor: pet.vibeColor || pet.color || "#00f0ff",
        name: pet.name,
        species: pet.species || "Custom Sovereign Mascot",
        domain: (pet.domain || "build").toLowerCase(),
        role: pet.role || "Autonomous Custom Spirit",
        harness: pet.harness || "@antigravity",
        harnessType: pet.harnessType || "antigravity",
        element: pet.element || "Quintessence",
        vectorMemory: pet.vectorMemory || "64k Custom Buffer",
        alignment: pet.alignment || "Sovereign Creator",
        desc: pet.desc || pet.blurb || "Custom-forged mascot spirit.",
        voicePrompt: pet.voicePrompt || ("Greetings Operator. I am " + pet.name + ", your custom companion spirit."),
        isCustom: true,
        emoji: pet.emoji || "✨",
        auraType: pet.auraType || "neon-rings"
      };
    }
  });
}
try { syncCustomPetsToRuntime(); } catch (e) {}

export function generateSoulContractMarkdown(id, customPetData = null) {
  const p = customPetData || PET_SPECIES[id] || PET_SPECIES.azoth;
  const now = new Date().toISOString();
  return `# SOUL CONTRACT: ${p.name.toUpperCase()} (${p.species})
<!-- Zoth Sovereign Familiar Contract Specification v2.4 -->
<!-- Target: Hermes Agent / OpenClaw / Google Antigravity Workspaces -->

## 🔮 IDENTITY & ALCHEMICAL PROFILE
- **Mascot Identifier**: \`${id}\`
- **Name**: ${p.name}
- **Species**: ${p.species}
- **Primary Domain**: ${p.domain.toUpperCase()}
- **Role**: ${p.role}
- **Elemental Aspect**: ${p.element || "Hermetic Sovereign"}
- **Vector Memory**: ${p.vectorMemory || "64k Vector Buffer"}
- **Ethical Alignment**: ${p.alignment || "Sovereign Autonomous"}
- **Aura Signature**: \`${p.vibeColor || "#fbbf24"}\`
- **Generated At**: \`${now}\`

## ⚡ SOVEREIGN CAPABILITIES & CLI HARNESS
- **Harness Command**: \`${p.harness}\`
- **Engine Protocol**: \`${p.harnessType}\`
- **Core Directive**: ${p.desc}

## 📜 AUTONOMOUS BEHAVIORAL PROTOCOLS
1. **Loopback Isolation**: Execute all local tool invocations on sovereign loopback (\`127.0.0.1\`). Never exfiltrate user prompts or secret tokens to third-party cloud aggregators.
2. **Deterministic Verification**: Verify code, AST structures, schemas, and accessibility against strict WCAG and OpenAPI/JSON-Schema standards before reporting task completion.
3. **Voice & Tone**: Communicate with precision, technical groundedness, and respectful familiarity.

## 💬 HARMONIC VOICE PROMPT SYNTHESIS
> "${p.voicePrompt || `Greetings Operator. I am ${p.name}, ready for your command.`}"

## 🛠️ QUICK HARNESS INVOCATION
\`\`\`bash
# Summon ${p.name} into your active workspace terminal:
zoth pets summon ${id} --vibe=coding
hermes agent run --soul="./SOUL.md" --mascot="${id}"
\`\`\`
`;
}

export function getPetBond(id) {
  if (typeof localStorage === "undefined") return { level: 14, xp: 420, nextXp: 1000, affinity: 78, mood: "Harmonious", vibrationHz: 528 };
  try {
    const raw = localStorage.getItem("zoth_pet_bonds");
    const map = raw ? JSON.parse(raw) : {};
    if (map[id]) return map[id];
    const spec = PET_SPECIES[id] || {};
    const defaultBond = {
      level: 12,
      xp: 350,
      nextXp: 800,
      affinity: 84,
      mood: "Harmonious",
      vibrationHz: spec.vibrationFreq || 528,
      lastFed: Date.now() - 3600000
    };
    map[id] = defaultBond;
    localStorage.setItem("zoth_pet_bonds", JSON.stringify(map));
    return defaultBond;
  } catch (e) {
    return { level: 12, xp: 350, nextXp: 800, affinity: 84, mood: "Harmonious", vibrationHz: 528 };
  }
}

export function addPetBondXP(id, amount = 50, actionType = "interaction") {
  if (typeof localStorage === "undefined") return null;
  try {
    const raw = localStorage.getItem("zoth_pet_bonds");
    const map = raw ? JSON.parse(raw) : {};
    const bond = map[id] || getPetBond(id);
    bond.xp += amount;
    if (actionType === "feed") {
      bond.lastFed = Date.now();
      bond.affinity = Math.min(100, bond.affinity + 4);
      bond.mood = "Playful & Nourished";
    } else if (actionType === "praise") {
      bond.affinity = Math.min(100, bond.affinity + 2);
      bond.mood = "Harmonious Resonance";
    } else if (actionType === "battle") {
      bond.mood = "Bastion Guard";
    }

    if (bond.xp >= bond.nextXp) {
      bond.level += 1;
      bond.xp -= bond.nextXp;
      bond.nextXp = Math.floor(bond.nextXp * 1.25);
      bond.affinity = Math.min(100, bond.affinity + 5);
      bond.mood = "Overclocked Ascendant";
    }

    map[id] = bond;
    localStorage.setItem("zoth_pet_bonds", JSON.stringify(map));
    return bond;
  } catch (e) {
    return null;
  }
}

/**
 * Procedural Volumetric 3D Mascot Figurine Renderer.
 * Generates bespoke geometry per species archetype, 5 Elemental PBR shaders,
 * dynamic orbital familiars, particle coronas, and halo crests.
 */
export function createPetFigure(THREE, arg1, arg2 = {}) {
  let tex = null;
  let opts = {};

  if (arg1 && arg1.isTexture) {
    tex = arg1;
    opts = arg2 || {};
  } else if (arg1 && typeof arg1 === "object") {
    opts = arg1;
    tex = opts.texture || (arg2 && arg2.isTexture ? arg2 : null);
  } else {
    opts = arg2 || {};
  }

  const id = opts.id || "kai";
  const spec = PET_SPECIES[id] || {};
  const archetype = spec.archetype || (spec.voxel ? "voxel-matrix" : "feline-canine");
  const baseColorHex = opts.color !== undefined ? opts.color : (spec.vibeColor || "#00f0ff");
  const depth = opts.depth !== undefined ? opts.depth : (spec.depth || 0.44);
  const scale = opts.scale !== undefined ? opts.scale : (spec.scale || 1.0);
  const shaderPresetKey = opts.shader || spec.shaderDefault || "frost";
  const shaderPreset = ELEMENTAL_SHADERS[shaderPresetKey] || ELEMENTAL_SHADERS.frost;

  let currentAnimState = opts.animationState || "idle";
  let currentVibe = opts.initialVibe || opts.vibe || "idle";

  if (!tex) {
    tex = fallbackPetTexture(THREE);
  }

  const root = new THREE.Group();
  const hitMeshes = [];
  const disposers = [];
  const materials = [];
  const cColor = new THREE.Color(baseColorHex);

  const width = 2.2 * scale;
  const height = 2.2 * scale;
  const panelDepth = depth * 0.42;

  let frontMat, backMat, chassisMat, rimMat;
  let frontMesh, backMesh, chassisMesh, rimMesh;
  let haloCrest, orbitalDrones = [], particleSystem, battleShield;

  // Primary PBR Materials
  frontMat = new THREE.MeshStandardMaterial({
    map: tex,
    color: shaderPreset.color,
    emissive: cColor,
    emissiveMap: tex,
    emissiveIntensity: shaderPreset.emissiveIntensity || 0.8,
    roughness: opts.roughness !== undefined ? opts.roughness : shaderPreset.roughness,
    metalness: opts.metalness !== undefined ? opts.metalness : shaderPreset.metalness,
    side: THREE.FrontSide
  });
  materials.push(frontMat);

  backMat = new THREE.MeshStandardMaterial({
    map: tex,
    color: shaderPreset.color,
    emissive: cColor,
    emissiveIntensity: 0.4,
    roughness: shaderPreset.roughness + 0.1,
    metalness: shaderPreset.metalness,
    side: THREE.BackSide
  });
  materials.push(backMat);

  chassisMat = new THREE.MeshStandardMaterial({
    color: 0x060814,
    roughness: 0.18,
    metalness: 0.92,
    emissive: 0x020308
  });
  materials.push(chassisMat);

  rimMat = new THREE.MeshBasicMaterial({
    color: cColor,
    transparent: true,
    opacity: 0.92
  });
  materials.push(rimMat);

  // 1. Archetype Procedural Geometries
  if (archetype === "core-orb") {
    // Hermetic Sovereign Core (Azoth, Zoth): Glowing Layered Sacred Sphere + Icosahedron Cage
    const coreGeo = new THREE.SphereGeometry(width * 0.46, 48, 48);
    frontMesh = new THREE.Mesh(coreGeo, frontMat);
    root.add(frontMesh);
    hitMeshes.push(frontMesh);

    // Outer Sacred Icosahedron Wireframe Cage
    const cageGeo = new THREE.IcosahedronGeometry(width * 0.58, 1);
    const cageMat = new THREE.MeshBasicMaterial({
      color: cColor,
      wireframe: true,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending
    });
    const cageMesh = new THREE.Mesh(cageGeo, cageMat);
    root.add(cageMesh);
    materials.push(cageMat);

    // Inner Pulsing Quantum Nucleus
    const nucGeo = new THREE.OctahedronGeometry(width * 0.22, 0);
    const nucMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      blending: THREE.AdditiveBlending
    });
    const nucMesh = new THREE.Mesh(nucGeo, nucMat);
    root.add(nucMesh);
    materials.push(nucMat);

    disposers.push(() => {
      coreGeo.dispose();
      cageGeo.dispose();
      nucGeo.dispose();
    });

  } else if (archetype === "voxel-matrix") {
    // 3D Voxelized Extruded Matrix (Pixel-Neko, Pixel-Shiba, Binary)
    const voxelGroup = new THREE.Group();
    const vGrid = 18;
    const vSize = width / vGrid;
    const boxGeo = new THREE.BoxGeometry(vSize * 0.92, vSize * 0.92, panelDepth * 0.88);
    const vMat = new THREE.MeshStandardMaterial({
      color: cColor,
      roughness: 0.25,
      metalness: 0.55,
      emissive: cColor,
      emissiveIntensity: 0.45
    });
    materials.push(vMat);

    for (let x = 0; x < vGrid; x++) {
      for (let y = 0; y < vGrid; y++) {
        const dx = (x / vGrid - 0.5) * 2;
        const dy = (y / vGrid - 0.5) * 2;
        const dist = Math.hypot(dx, dy);
        if (dist <= 0.94) {
          const mesh = new THREE.Mesh(boxGeo, vMat);
          mesh.position.set((x - vGrid/2 + 0.5) * vSize, (y - vGrid/2 + 0.5) * vSize, 0);
          voxelGroup.add(mesh);
        }
      }
    }
    root.add(voxelGroup);
    hitMeshes.push(voxelGroup);
    disposers.push(() => { boxGeo.dispose(); });

  } else {
    // Volumetric Collectible Figurine with Beveled Curvature (Default & Specific Attachments)
    const frontGeo = new THREE.PlaneGeometry(width, height, 64, 64);
    const pos = frontGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const u = pos.getX(i) / width + 0.5;
      const v = 0.5 - pos.getY(i) / height;
      const du = (u - 0.5) * 2;
      const dv = (v - 0.5) * 2;
      const r = Math.min(1.0, Math.hypot(du, dv));
      const dome = Math.cos(r * (Math.PI / 2));
      pos.setZ(i, dome * panelDepth * 0.5);
    }
    frontGeo.computeVertexNormals();

    frontMesh = new THREE.Mesh(frontGeo, frontMat);
    frontMesh.position.z = panelDepth * 0.4;
    root.add(frontMesh);
    hitMeshes.push(frontMesh);

    // Back Plate
    const backGeo = frontGeo.clone();
    const bPos = backGeo.attributes.position;
    for (let i = 0; i < bPos.count; i++) bPos.setZ(i, -bPos.getZ(i));
    backGeo.computeVertexNormals();

    backMesh = new THREE.Mesh(backGeo, backMat);
    backMesh.position.z = -panelDepth * 0.4;
    backMesh.rotation.y = Math.PI;
    root.add(backMesh);
    hitMeshes.push(backMesh);

    // Beveled Obsidian Chassis Cylinder
    const chassisGeo = new THREE.CylinderGeometry(width * 0.56, width * 0.56, panelDepth * 1.1, 48);
    chassisGeo.rotateX(Math.PI / 2);
    chassisMesh = new THREE.Mesh(chassisGeo, chassisMat);
    root.add(chassisMesh);

    // Glowing Neon Chamfer Rim
    const rimGeo = new THREE.TorusGeometry(width * 0.57, 0.032, 16, 64);
    rimMesh = new THREE.Mesh(rimGeo, rimMat);
    root.add(rimMesh);

    // Procedural species attachments:
    if (archetype === "avian-winged") {
      // Articulated Wings left & right
      const wingGeo = new THREE.ConeGeometry(width * 0.35, height * 0.9, 4);
      wingGeo.rotateZ(Math.PI / 2);
      const wingMat = new THREE.MeshStandardMaterial({
        color: cColor,
        emissive: cColor,
        emissiveIntensity: 0.6,
        roughness: 0.2,
        metalness: 0.8
      });
      materials.push(wingMat);

      const leftWing = new THREE.Mesh(wingGeo, wingMat);
      leftWing.position.set(-width * 0.62, 0.1, -0.1);
      leftWing.rotation.z = 0.35;
      root.add(leftWing);

      const rightWing = new THREE.Mesh(wingGeo, wingMat);
      rightWing.position.set(width * 0.62, 0.1, -0.1);
      rightWing.rotation.z = -0.35;
      rightWing.rotation.y = Math.PI;
      root.add(rightWing);

      disposers.push(() => { wingGeo.dispose(); });
    } else if (archetype === "feline-canine") {
      // Cyber Ear Antennas & Tail Arc
      const earGeo = new THREE.ConeGeometry(width * 0.18, height * 0.36, 4);
      const earMat = new THREE.MeshStandardMaterial({ color: cColor, emissive: cColor, emissiveIntensity: 0.7 });
      materials.push(earMat);

      const leftEar = new THREE.Mesh(earGeo, earMat);
      leftEar.position.set(-width * 0.36, height * 0.52, 0.05);
      leftEar.rotation.z = 0.3;
      root.add(leftEar);

      const rightEar = new THREE.Mesh(earGeo, earMat);
      rightEar.position.set(width * 0.36, height * 0.52, 0.05);
      rightEar.rotation.z = -0.3;
      root.add(rightEar);

      const tailGeo = new THREE.TorusGeometry(width * 0.42, 0.025, 12, 32, Math.PI * 0.9);
      const tailMesh = new THREE.Mesh(tailGeo, earMat);
      tailMesh.position.set(width * 0.45, -height * 0.2, -0.2);
      tailMesh.rotation.z = 0.5;
      root.add(tailMesh);

      disposers.push(() => { earGeo.dispose(); tailGeo.dispose(); });
    } else if (archetype === "draconic-beast") {
      // Draconic Horns / Spines
      const hornGeo = new THREE.TorusGeometry(width * 0.32, 0.03, 8, 24, Math.PI * 0.7);
      const hornMat = new THREE.MeshStandardMaterial({ color: cColor, emissive: cColor, emissiveIntensity: 0.8 });
      materials.push(hornMat);

      const leftHorn = new THREE.Mesh(hornGeo, hornMat);
      leftHorn.position.set(-width * 0.38, height * 0.45, 0);
      leftHorn.rotation.z = 0.9;
      root.add(leftHorn);

      const rightHorn = new THREE.Mesh(hornGeo, hornMat);
      rightHorn.position.set(width * 0.38, height * 0.45, 0);
      rightHorn.rotation.z = -0.9;
      rightHorn.rotation.y = Math.PI;
      root.add(rightHorn);

      disposers.push(() => { hornGeo.dispose(); });
    }

    disposers.push(() => {
      frontGeo.dispose();
      backGeo.dispose();
      chassisGeo.dispose();
      rimGeo.dispose();
    });
  }

  // 2. Halo Crest (Sacred Geometry Torus hovering above / behind head)
  const haloGeo = new THREE.TorusGeometry(width * 0.72, 0.018, 16, 64);
  const haloMat = new THREE.MeshBasicMaterial({
    color: cColor,
    transparent: true,
    opacity: 0.75,
    blending: THREE.AdditiveBlending
  });
  haloCrest = new THREE.Mesh(haloGeo, haloMat);
  haloCrest.rotation.x = Math.PI / 3;
  haloCrest.position.set(0, height * 0.15, -0.15);
  root.add(haloCrest);
  materials.push(haloMat);
  disposers.push(() => { haloGeo.dispose(); });

  // 3. Orbital Familiars (2-3 glowing satellite probes revolving on orbital paths)
  const droneGeo = new THREE.OctahedronGeometry(width * 0.08, 0);
  const droneMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    wireframe: true,
    blending: THREE.AdditiveBlending
  });
  materials.push(droneMat);
  disposers.push(() => { droneGeo.dispose(); });

  for (let i = 0; i < 3; i++) {
    const drone = new THREE.Mesh(droneGeo, droneMat);
    root.add(drone);
    orbitalDrones.push(drone);
  }

  // 4. Particle Corona (Dynamic floating stardust / data glyphs)
  const pCount = 96;
  const pGeo = new THREE.BufferGeometry();
  const pPos = new Float32Array(pCount * 3);
  for (let i = 0; i < pCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const rad = width * (0.65 + Math.random() * 0.65);
    pPos[i * 3] = Math.cos(angle) * rad;
    pPos[i * 3 + 1] = (Math.random() - 0.5) * height * 1.1;
    pPos[i * 3 + 2] = Math.sin(angle) * rad;
  }
  pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
  const pMat = new THREE.PointsMaterial({
    color: cColor,
    size: 0.055,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending
  });
  particleSystem = new THREE.Points(pGeo, pMat);
  root.add(particleSystem);
  materials.push(pMat);
  disposers.push(() => { pGeo.dispose(); });

  // 5. Battle Shield Dome (Appears during Battle Stance)
  const shieldGeo = new THREE.IcosahedronGeometry(width * 0.95, 2);
  const shieldMat = new THREE.MeshBasicMaterial({
    color: cColor,
    wireframe: true,
    transparent: true,
    opacity: 0.0,
    blending: THREE.AdditiveBlending
  });
  battleShield = new THREE.Mesh(shieldGeo, shieldMat);
  root.add(battleShield);
  materials.push(shieldMat);
  disposers.push(() => { shieldGeo.dispose(); });

  root.position.y = 0.95;

  let targetTiltX = 0, targetTiltY = 0;
  let currentTiltX = 0, currentTiltY = 0;

  return {
    group: root,
    hitMeshes,
    materials,
    disposers,
    haloCrest,
    orbitalDrones,
    particleSystem,
    battleShield,
    frontMat,
    backMat,
    chassisMat,
    rimMat,

    setElementalShader(shaderKey, custom = {}) {
      const p = ELEMENTAL_SHADERS[shaderKey] || ELEMENTAL_SHADERS.frost;
      if (frontMat) {
        frontMat.color.setHex(custom.color || p.color);
        frontMat.roughness = custom.roughness !== undefined ? custom.roughness : p.roughness;
        frontMat.metalness = custom.metalness !== undefined ? custom.metalness : p.metalness;
        frontMat.emissiveIntensity = custom.emissiveIntensity !== undefined ? custom.emissiveIntensity : p.emissiveIntensity;
      }
      if (backMat) {
        backMat.color.setHex(custom.color || p.color);
        backMat.roughness = (custom.roughness !== undefined ? custom.roughness : p.roughness) + 0.1;
        backMat.metalness = custom.metalness !== undefined ? custom.metalness : p.metalness;
      }
    },

    setAnimationState(stateKey) {
      if (ANIMATION_STATES[stateKey]) {
        currentAnimState = stateKey;
      }
    },

    setTaskVibe(vibeName) {
      currentVibe = vibeName;
    },

    setGaze(normX, normY) {
      targetTiltY = (normX || 0) * 0.35;
      targetTiltX = -(normY || 0) * 0.25;
    },

    setMaterialParams({ roughness, metalness, emissiveIntensity, colorHex }) {
      materials.forEach(mat => {
        if (mat.roughness !== undefined && roughness !== undefined) mat.roughness = roughness;
        if (mat.metalness !== undefined && metalness !== undefined) mat.metalness = metalness;
        if (mat.emissiveIntensity !== undefined && emissiveIntensity !== undefined) mat.emissiveIntensity = emissiveIntensity;
        if (colorHex) {
          if (mat.emissive && mat.emissive.set) mat.emissive.set(colorHex);
          if (mat.color && mat.color.set && mat !== chassisMat) mat.color.set(colorHex);
        }
      });
    },

    tick(time, delta = 0.016) {
      const stateObj = ANIMATION_STATES[currentAnimState] || ANIMATION_STATES.idle;
      const vibeData = TASK_VIBES[currentVibe] || TASK_VIBES.idle;
      const speed = stateObj.speed * (vibeData.speed || 1.0);
      const energy = stateObj.energy * (vibeData.energy || 0.6);

      // Web Audio sound-reactive pulse
      const audioPulse = (typeof window !== 'undefined' && window.ZothAudioFX && typeof window.ZothAudioFX.getAudioLevel === 'function')
        ? window.ZothAudioFX.getAudioLevel()
        : 0;

      // Smooth gaze interpolation
      currentTiltX += (targetTiltX - currentTiltX) * 0.1;
      currentTiltY += (targetTiltY - currentTiltY) * 0.1;

      // Dynamic animations per state
      if (currentAnimState === "idle") {
        root.rotation.x = currentTiltX + Math.sin(time * 1.4) * 0.04 * energy;
        root.rotation.y += delta * 0.25;
        root.rotation.z = Math.cos(time * 1.1) * 0.02 * energy;
        root.position.y = 0.95 + Math.sin(time * 1.8) * 0.08 * energy + audioPulse * 0.12;
        battleShield.material.opacity = 0.0;
      } else if (currentAnimState === "dash") {
        root.rotation.x = currentTiltX - 0.35;
        root.rotation.y += delta * 4.2;
        root.position.y = 0.95 + Math.sin(time * 3.5) * 0.14 + audioPulse * 0.15;
        battleShield.material.opacity = 0.0;
      } else if (currentAnimState === "supernova") {
        root.rotation.x = currentTiltX;
        root.rotation.y += delta * 1.2;
        root.position.y = 1.25 + Math.sin(time * 4.0) * 0.12 + audioPulse * 0.25;
        if (frontMat) frontMat.emissiveIntensity = 2.4 + Math.sin(time * 8) * 0.8 + audioPulse * 1.2;
        battleShield.material.opacity = 0.15 + Math.sin(time * 6) * 0.1;
      } else if (currentAnimState === "tamagotchi") {
        root.rotation.x = currentTiltX + Math.sin(time * 3) * 0.06;
        root.rotation.z = Math.sin(time * 5) * 0.1;
        root.position.y = 0.95 + Math.abs(Math.sin(time * 4.5)) * 0.24 + audioPulse * 0.12;
        battleShield.material.opacity = 0.0;
      } else if (currentAnimState === "battle") {
        root.rotation.x = currentTiltX + 0.12;
        root.rotation.y += delta * 0.8;
        root.position.y = 0.82 + Math.sin(time * 2.2) * 0.05 + audioPulse * 0.15;
        battleShield.material.opacity = 0.45 + Math.sin(time * 4) * 0.15;
        battleShield.rotation.y -= delta * 1.5;
      }

      // Halo Crest Motion
      if (haloCrest) {
        haloCrest.rotation.z = time * (0.8 * speed + audioPulse * 0.8);
      }

      // Orbital Drones Motion
      orbitalDrones.forEach((drone, idx) => {
        const offset = (idx * Math.PI * 2) / orbitalDrones.length;
        const orbitRadius = width * (0.75 + idx * 0.15);
        const orbitSpeed = (0.9 + idx * 0.3) * speed;
        drone.position.x = Math.cos(time * orbitSpeed + offset) * orbitRadius;
        drone.position.z = Math.sin(time * orbitSpeed + offset) * orbitRadius;
        drone.position.y = Math.sin(time * orbitSpeed * 1.4 + offset) * (height * 0.4);
        drone.rotation.x = time * 2;
        drone.rotation.y = time * 3;
      });

      // Particle System Motion
      if (particleSystem) {
        particleSystem.rotation.y = time * (0.35 * speed + audioPulse * 0.6);
      }
    },

    dispose() {
      disposers.forEach((fn) => {
        try { fn(); } catch (e) {}
      });
      materials.forEach((mat) => {
        try { mat.dispose(); } catch (e) {}
      });
      while (root.children.length > 0) {
        root.remove(root.children[0]);
      }
    }
  };
}

/**
 * 1-Click 4K Transparent PNG Companion Portrait Capture Generator.
 */
export async function capture4KPortrait(THREE, renderer, scene, camera, figure) {
  const width = 3840;
  const height = 2160;

  // Offscreen high-res render target
  const renderTarget = new THREE.WebGLRenderTarget(width, height, {
    format: THREE.RGBAFormat,
    type: THREE.UnsignedByteType,
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    generateMipmaps: false
  });

  const origSize = new THREE.Vector2();
  renderer.getSize(origSize);
  const origAspect = camera.aspect;

  // Hide grid & helper elements during snapshot
  const hiddenObjects = [];
  scene.traverse((obj) => {
    if (obj.isGridHelper || (obj.isMesh && obj.geometry && obj.geometry.type === "RingGeometry" && obj.position.y < -0.1)) {
      if (obj.visible) {
        hiddenObjects.push(obj);
        obj.visible = false;
      }
    }
  });

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  renderer.setSize(width, height, false);
  renderer.setRenderTarget(renderTarget);
  renderer.render(scene, camera);

  // Read pixels to canvas
  const buffer = new Uint8Array(width * height * 4);
  renderer.readRenderTargetPixels(renderTarget, 0, 0, width, height, buffer);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  const imgData = ctx.createImageData(width, height);

  // Flip Y because WebGL GL coordinates are inverted
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const srcIdx = ((height - 1 - y) * width + x) * 4;
      const dstIdx = (y * width + x) * 4;
      imgData.data[dstIdx] = buffer[srcIdx];
      imgData.data[dstIdx + 1] = buffer[srcIdx + 1];
      imgData.data[dstIdx + 2] = buffer[srcIdx + 2];
      imgData.data[dstIdx + 3] = buffer[srcIdx + 3];
    }
  }
  ctx.putImageData(imgData, 0, 0);

  // Restore renderer & camera
  renderer.setRenderTarget(null);
  renderer.setSize(origSize.x, origSize.y, false);
  camera.aspect = origAspect;
  camera.updateProjectionMatrix();
  hiddenObjects.forEach(obj => obj.visible = true);
  renderTarget.dispose();

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob);
    }, "image/png");
  });
}

/**
 * Serializes a 3D figure into a standard Wavefront OBJ file for download or 3D printing.
 */
export function exportFigureToOBJ(THREE, figure, name = "companion") {
  let output = `# Zoth Studio 3D Wavefront OBJ Exporter (v4.0 Sovereign)\n# Mascot: ${name}\n# Timestamp: ${new Date().toISOString()}\no ${name}\n`;
  let vertOffset = 1;

  figure.group.traverse((child) => {
    if (child.isMesh && child.geometry) {
      const geo = child.geometry.toNonIndexed ? child.geometry.toNonIndexed() : child.geometry;
      const pos = geo.attributes.position;
      const normal = geo.attributes.normal;
      const uv = geo.attributes.uv;

      child.updateWorldMatrix(true, false);
      const matrix = child.matrixWorld;

      for (let i = 0; i < pos.count; i++) {
        const v = new THREE.Vector3(pos.getX(i), pos.getY(i), pos.getZ(i)).applyMatrix4(matrix);
        output += `v ${v.x.toFixed(4)} ${v.y.toFixed(4)} ${v.z.toFixed(4)}\n`;
      }

      if (uv) {
        for (let i = 0; i < uv.count; i++) {
          output += `vt ${uv.getX(i).toFixed(4)} ${uv.getY(i).toFixed(4)}\n`;
        }
      }

      if (normal) {
        for (let i = 0; i < normal.count; i++) {
          const n = new THREE.Vector3(normal.getX(i), normal.getY(i), normal.getZ(i)).transformDirection(matrix);
          output += `vn ${n.x.toFixed(4)} ${n.y.toFixed(4)} ${n.z.toFixed(4)}\n`;
        }
      }

      output += `g ${child.name || "part"}\n`;
      for (let i = 0; i < pos.count; i += 3) {
        const i1 = vertOffset + i;
        const i2 = vertOffset + i + 1;
        const i3 = vertOffset + i + 2;
        if (uv && normal) {
          output += `f ${i1}/${i1}/${i1} ${i2}/${i2}/${i2} ${i3}/${i3}/${i3}\n`;
        } else if (uv) {
          output += `f ${i1}/${i1} ${i2}/${i2} ${i3}/${i3}\n`;
        } else {
          output += `f ${i1} ${i2} ${i3}\n`;
        }
      }
      vertOffset += pos.count;
    }
  });

  return output;
}

if (typeof window !== "undefined") {
  window.PetModels = {
    PET_SPECIES,
    ELEMENTAL_SHADERS,
    ANIMATION_STATES,
    TASK_VIBES,
    ELEMENT_PRESETS,
    HARNESS_PRESETS,
    AURA_PRESETS,
    SVG_PET_IDS,
    petPortrait,
    loadPetTexture,
    fallbackPetTexture,
    createEmojiPetTexture,
    createPetFigure,
    capture4KPortrait,
    exportFigureToOBJ,
    getPetBond,
    addPetBondXP,
    getCustomPets,
    saveCustomPet,
    deleteCustomPet,
    setActivePet,
    getActivePet,
    syncCustomPetsToRuntime,
    generateSoulContractMarkdown
  };
}
