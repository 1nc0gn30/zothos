// Zoth Blueprint Foundry — Engine, Catalog & Interactive Composer

const BLUEPRINTS_DATA = [
  // AI & Agents
  {
    id: "nullai-hexstrike-terminal",
    title: "NullAI HexStrike AI Terminal",
    category: "ai-agents",
    categoryLabel: "AI & Agents",
    archetype: "Cyberpunk Neural Terminal & CLI Engine",
    stack: "React, Vite, Web Audio, Canvas",
    why: "Provides a complete retro-cyberpunk terminal interface, ANSI command parser, 20+ offline security tool simulations, and a 60fps Hex Matrix rain canvas.",
    superpower: "Allows AI agents to spin up authentic hacker CLI dashboards, command consoles, or developer playgrounds in 1 click without building command loops from scratch.",
    modules: ["HexMatrixCanvas.jsx", "CommandTerminal.jsx", "AgentStatusHud.jsx", "audioSynth.js", "offlineEngine.js"],
    wiring: ["ANSI Color Engine", "Up/Down Command Buffer", "CRT Scanline Shader Overlay", "Web Audio Beep/Chord Synth"],
    tags: ["Terminal CLI", "Web Audio", "Canvas 60fps", "CRT Filter", "Offline Mock Engine"]
  },
  {
    id: "agent-ax",
    title: "Agent AX Orchestration DAG",
    category: "ai-agents",
    categoryLabel: "AI & Agents",
    archetype: "Multi-Agent DAG Workflow Visualizer",
    stack: "Vanilla JS, SVG DAG, Netlify AX",
    why: "Visualizes complex multi-agent execution pipelines with real-time laser data pulses, agent state transitions (Idle -> Planning -> Executing -> Verified), and Merkle task signatures.",
    superpower: "Provides the visual orchestration surface for AI agents to explain multi-step workflows, autonomous reasoning paths, and distributed system executions to human users.",
    modules: ["DAG Canvas Engine", "Agent State Router", "Task Payload Inspector", "Consensus Verifier"],
    wiring: ["Animated SVG Curves", "Laser Telemetry Pulse", "Dynamic Task JSON Viewer", "Theme Matrix Switcher"],
    tags: ["DAG Visualizer", "Multi-Agent", "SVG Graph", "State Machines", "Telemetry"]
  },
  {
    id: "nullai-ui",
    title: "NullAI Transformer Neural Lab",
    category: "ai-agents",
    categoryLabel: "AI & Agents",
    archetype: "Interactive Transformer Layer & Latency Lab",
    stack: "React, Vite, HTML5 Canvas",
    why: "Renders multi-layer attention heads, forward-pass synapse pulses, latency benchmarking suites, and temperature/top_p parameter response comparators.",
    superpower: "Gives AI builders a drop-in neural network visualization laboratory for LLM tuning interfaces, model benchmarks, and explainable AI tooling.",
    modules: ["NeuronCanvas.jsx", "NeuralLab.jsx", "ModelComparator.jsx", "LatencyBenchmark.jsx"],
    wiring: ["Synaptic Weight Heatmaps", "Interactive Neuron Hover Inspector", "Dual-Temp Split Inference", "Throughput Profiler"],
    tags: ["Neural Canvas", "Transformer Viz", "Model Benchmark", "Inference Comparator"]
  },
  {
    id: "signalbridge-ai",
    title: "SignalBridge AI Node Hub",
    category: "ai-agents",
    categoryLabel: "AI & Agents",
    archetype: "Autonomous IoT & Signal Node Network",
    stack: "React, Tailwind, Lucide, Web Audio",
    why: "Interactive network telemetry mesh with real-time signal strength meters, multi-band frequency analyzers, and defensive offline simulation queues.",
    superpower: "Enables instant generation of IoT monitoring dashboards, telecommunication signal radars, and mesh network management web apps.",
    modules: ["SignalMatrix.tsx", "FrequencyAnalyzer.tsx", "NodeHealthHUD.tsx", "TelemetryQueue.ts"],
    wiring: ["Web Audio Radar Ping", "Dynamic Node Graph Canvas", "Simulated Packet Stream", "Bandwidth Gauges"],
    tags: ["IoT Mesh", "Signal Radar", "Web Audio", "Telemetry"]
  },
  {
    id: "adytum-alchemist-ai-workflow",
    title: "Adytum Alchemist Workflow",
    category: "ai-agents",
    categoryLabel: "AI & Agents",
    archetype: "22-Node Constellation & Prompt Chain Visualizer",
    stack: "React, Vite, Canvas 2D, Framer Motion",
    why: "Archetypal node constellation canvas connecting high-level creative prompts to multi-tier deterministic transformation pipelines.",
    superpower: "Ideal template for node-based automation editors, creative prompt chaining engines, and visual rule builders.",
    modules: ["ConstellationCanvas.tsx", "AlchemistPipeline.tsx", "PromptChainer.tsx"],
    wiring: ["Force-Directed Node Physics", "Bezier Energy Splines", "Prompt Mutation Engine"],
    tags: ["Prompt Chaining", "Constellation Canvas", "Visual Pipeline"]
  },

  // SaaS & Web Apps
  {
    id: "nfc-link-hub",
    title: "NFC Link Hub Enterprise",
    category: "saas-apps",
    categoryLabel: "SaaS & Products",
    archetype: "Smart Physical-to-Digital Routing Engine",
    stack: "React, Vite, Tailwind, Web NFC API",
    why: "Complete digital card and physical asset management SaaS with multi-route sitemaps, QR/NFC link routers, analytics HUDs, and dynamic redirection rules.",
    superpower: "Drop-in architecture for link-in-bio SaaS, smart business card managers, and physical NFC asset tracking products.",
    modules: ["NfcCardDesigner.tsx", "RoutingRulesEngine.tsx", "LiveTapAnalytics.tsx", "QrMatrixGenerator.tsx"],
    wiring: ["Web NFC Read/Write Fallback", "Multi-URL Sitemap XML", "Dynamic Redirection Matrix", "Client Lead Capture"],
    tags: ["NFC/QR SaaS", "Link Router", "Tap Analytics", "Lead Capture"]
  },
  {
    id: "757tech2025",
    title: "757tech Flagship Tech Hub",
    category: "saas-apps",
    categoryLabel: "SaaS & Products",
    archetype: "Regional Tech Ecosystem & Radar Portal",
    stack: "Astro, Tailwind, Content Collections, Netlify",
    why: "Modern tech community portal featuring interactive ecosystem tech radars, terminal sandbox simulators, job boards, and automated RSS/Sitemap pipelines.",
    superpower: "Provides the gold standard for developer community portals, startup directories, and regional tech ecosystem showcases.",
    modules: ["TechRadarCanvas.astro", "TerminalSimulator.astro", "CommunityDirectory.astro"],
    wiring: ["Astro SSG + SSR Hybrid", "Strict Schema.org Organization", "Interactive Skill Radar"],
    tags: ["Astro Hub", "Tech Radar", "Content Collections", "SEO/AEO"]
  },
  {
    id: "edge-forge",
    title: "EdgeForge Edge Compute Manager",
    category: "saas-apps",
    categoryLabel: "SaaS & Products",
    archetype: "Serverless Edge Function Management SaaS",
    stack: "React, TypeScript, Lucide, Netlify Edge",
    why: "Modern edge deployment simulator with latency telemetry, function routing maps, cache hit-rate counters, and real-time log tailers.",
    superpower: "Enables instant generation of cloud infrastructure consoles, DevOps dashboards, and serverless compute monitors.",
    modules: ["EdgeTopologyMap.tsx", "LatencyTelemetry.tsx", "FunctionDeployer.tsx"],
    wiring: ["Real-Time Edge Telemetry", "Cache Ratio Visualizer", "Mock Function Invoker"],
    tags: ["DevOps Console", "Edge Functions", "Latency Map"]
  },
  {
    id: "envguard-pro",
    title: "EnvGuard Pro Zero-Trust Vault",
    category: "saas-apps",
    categoryLabel: "SaaS & Products",
    archetype: "Environment Secrets & Zero-Trust Auditor",
    stack: "React, TypeScript, Tailwind",
    why: "Zero-trust secrets vulnerability analyzer with live linting, weak password detection, honeypot canary decoy generator, and encrypted vault storage.",
    superpower: "Provides the complete UI and validation logic for cybersecurity secrets management, environment auditors, and API key sanitizers.",
    modules: ["EnvLinter.tsx", "HoneypotGenerator.tsx", "ZeroTrustVault.tsx"],
    wiring: ["Entropy Scorer", "Secret Masking Filters", "Audit Trail Logger"],
    tags: ["Secrets Vault", "Zero-Trust", "Env Linter", "Honeypot Decoys"]
  },

  // Security & OSINT
  {
    id: "subsweep",
    title: "SubSweep Attack Surface Suite",
    category: "security-osint",
    categoryLabel: "Security & OSINT",
    archetype: "3D Attack Surface & Subdomain Topology",
    stack: "React, Three.js / R3F, Web Audio, CRT.sh",
    why: "Interactive 3D threat orbit visualization, DNS record sweeper, port vulnerability auditor, and live security telemetry stream.",
    superpower: "Gives AI agents an instant 3D cybersecurity recon surface for domain intelligence, external attack surface management (EASM), and vulnerability scanners.",
    modules: ["ThreatOrbit3D.tsx", "DnsRecordSweeper.tsx", "PortScannerEngine.tsx", "ReconTelemetry.tsx"],
    wiring: ["Three.js Particle Satellites", "CRT.sh API + Fallbacks", "Web Audio Radar Sweep", "Export to CSV/JSON"],
    tags: ["Three.js 3D", "Attack Surface", "DNS Sweeper", "Port Auditor"]
  },
  {
    id: "local-business-lead-scanner",
    title: "Local Business Lead Recon Scanner",
    category: "security-osint",
    categoryLabel: "Security & OSINT",
    archetype: "Geospatial OSINT & Digital Footprint Auditor",
    stack: "Vanilla JS, Overpass API, Web Audio",
    why: "Multi-stage digital gap analyzer extracting municipal/business leads, checking SSL/meta tags/mobile readiness, and generating automated cold outreach playbooks.",
    superpower: "Template for automated B2B lead scrapers, agency audit generators, and digital marketing pitch tools.",
    modules: ["NominatimEngine.js", "DigitalGapAuditor.js", "OutreachPlaybookGen.js", "AudioTelemetry.js"],
    wiring: ["Overpass OSINT Engine", "Regional Fallback Data", "Automated Scorecard Exporter"],
    tags: ["OSINT Scraper", "Lead Scanner", "Cold Outreach Gen", "Web Audio"]
  },
  {
    id: "cisa-grc-study-portal",
    title: "CISA & NIST CSF 2.0 Study Portal",
    category: "security-osint",
    categoryLabel: "Security & OSINT",
    archetype: "GRC Control Crosswalk & Exam Engine",
    stack: "React, TypeScript, Web Speech API, Tailwind",
    why: "Cross-maps NIST CSF 2.0 to CISA domains, includes CMMI 1-5 audit readiness scoring calculators, Leitner 5-box flashcards with text-to-speech audio, and timed exam simulators.",
    superpower: "Perfect blueprint for compliance portals, corporate training apps, certification study engines, and governance risk compliance (GRC) tools.",
    modules: ["NistCisaExplorer.tsx", "GrcAuditCalculator.tsx", "EnhancedFlashcards.tsx", "DynamicQuizEngine.tsx"],
    wiring: ["Leitner 5-Box Spaced Repetition", "Web Speech API TTS", "CMMI 1-5 Formula", "Workpaper Export"],
    tags: ["GRC Compliance", "NIST CSF 2.0", "Spaced Repetition", "Web Speech TTS"]
  },
  {
    id: "privacy-toolbelt",
    title: "Privacy Toolbelt Zero-Knowledge Suite",
    category: "security-osint",
    categoryLabel: "Security & OSINT",
    archetype: "Browser Fingerprint Auditor & Crypto Toolset",
    stack: "Vanilla JS, Canvas 2D, Web Audio",
    why: "Calculates real-time device entropy (Canvas/Audio/WebGL GPU), simulates network telemetry blockers, generates Diceware passphrases, runs RFC 6238 TOTP 2FA, and strips image EXIF metadata client-side.",
    superpower: "Provides essential zero-knowledge privacy modules that AI agents can insert into any app requiring secure credentials or client-side privacy auditing.",
    modules: ["FingerprintAuditor.js", "TrackerBlockerSim.js", "TotpEngine.js", "ExifStripper.js"],
    wiring: ["Canvas 2D Hash Engine", "AudioContext Entropy", "Diceware Wordlist", "In-Memory Image Scrubbing"],
    tags: ["Browser Fingerprint", "EXIF Stripper", "TOTP 2FA", "Telemetry Blocker"]
  },

  // Arcade & Games
  {
    id: "street-fighter-arcade",
    title: "Street Fighter Arcade Canvas Combat",
    category: "games-arcade",
    categoryLabel: "Arcade & 3D",
    archetype: "60 FPS HTML5 Canvas Fighter Engine",
    stack: "React, TypeScript, HTML5 Canvas, Web Audio",
    why: "Full 60 FPS combat state machine with special move input buffers (Hadoken, Shoryuken), input history visualizer, multi-hit combo banners, EX super meters, and procedural chiptune synth.",
    superpower: "Gives AI agents a proven, self-contained 2D canvas physics and state-machine framework for games, interactive landing page heroes, and gamified promotions.",
    modules: ["ArcadeFightEngine.tsx", "InputBuffer.ts", "arcadeAudio.ts", "ComboTracker.ts"],
    wiring: ["Circular Input Buffer", "Procedural 8-bit Audio", "60 FPS Render Loop", "4-tier CPU AI Logic"],
    tags: ["Canvas 60fps", "Arcade Game", "Combo Engine", "Chiptune Synth"]
  },
  {
    id: "mechshift-vr",
    title: "MechShift 3D Cockpit Combat Simulator",
    category: "games-arcade",
    categoryLabel: "Arcade & 3D",
    archetype: "Pseudo-3D Flight HUD & Tactical Combat Engine",
    stack: "React, TypeScript, Canvas 2D/3D, Web Audio",
    why: "Cockpit simulation with starfield depth projection, 360° sweeping tactical radar, gimbal target lead prediction, tri-system power routing (Engines/Shields/Weapons), and overheating mechanics.",
    superpower: "Provides the mathematical and visual framework for futuristic cockpit HUDs, flight simulators, radar tracking displays, and game dashboards.",
    modules: ["MechCockpitSimulator.tsx", "TacticalRadar.ts", "PowerRouter.ts", "mechAudio.ts"],
    wiring: ["Pitch/Yaw Kinematics", "Continuous Hum Synth", "Gimbal Target Lock", "Emergency Heat Purge"],
    tags: ["Cockpit HUD", "Tactical Radar", "Flight Sim", "Power Routing"]
  },
  {
    id: "grip-and-grime-game-of-skate",
    title: "Grip & Grime S.K.A.T.E. Match Engine",
    category: "games-arcade",
    categoryLabel: "Arcade & 3D",
    archetype: "Authentic Action Sports Engine & Scorekeeper",
    stack: "React, TypeScript, Web Audio, Lucide",
    why: "90s street zine aesthetic with authentic maple board pop/landing sound synthesizer, 3D interactive trick dice, Berrics-style scorekeeper, and skateboard geometry visualizer.",
    superpower: "The blueprint for action sports trackers, competition scorekeepers, dice battle apps, and authentic street-culture aesthetic designs.",
    modules: ["TrickDice.tsx", "Scorekeeper.tsx", "DifficultyAnalyzer.tsx", "skateAudio.ts"],
    wiring: ["Synthesized Urethane SFX", "Offense/Defense Turn FSM", "Geometry Stance Multiplier"],
    tags: ["Skate Engine", "Turn-Based FSM", "Web Audio SFX", "90s Zine UI"]
  },

  // Web3 & Crypto
  {
    id: "solanaworldmap",
    title: "Solana Global Validator Mesh",
    category: "crypto-web3",
    categoryLabel: "Web3 & Crypto",
    archetype: "3D Validator Globe & TPS Telemetry Engine",
    stack: "Three.js, Vanilla JS, Web Audio, Canvas",
    why: "3D interactive globe and 2D cyber hologram map displaying validator nodes, dynamic cluster switching (Mainnet/Testnet/Devnet), live TPS ticker with sparkline canvas, and global RPC sonar ping latency tests.",
    superpower: "Enables instant generation of blockchain explorers, decentralized network telemetry monitors, and distributed server visualizers.",
    modules: ["Globe3D.js", "TpsTickerCanvas.js", "RpcLatencyTester.js", "ValidatorModal.js"],
    wiring: ["Three.js Shader Glow", "RPC Sonar Chirp Audio", "Dynamic Epoch Ticker", "Stake Delegation Calculator"],
    tags: ["Three.js Globe", "TPS Ticker", "Solana Mesh", "Latency Sonar"]
  },
  {
    id: "crypto-tracker-agent",
    title: "Autonomous Crypto Market Sentiment Agent",
    category: "crypto-web3",
    categoryLabel: "Web3 & Crypto",
    archetype: "Candlestick Charting & AI Sentiment Agent",
    stack: "React, TypeScript, HTML5 Canvas, Web Audio",
    why: "Real-time HTML5 Canvas candlestick and sparkline charts (EMA/SMA overlays), AI sentiment reasoning agent with step-by-step logic, $50k paper trading portfolio simulator, and custom price alerts.",
    superpower: "Provides the foundational components for fintech trading terminals, crypto analytics portals, and autonomous investment agent dashboards.",
    modules: ["CandlestickCanvas.tsx", "SentimentAgent.tsx", "PortfolioSimulator.tsx", "PriceAlertEngine.ts"],
    wiring: ["Canvas OHLC Crosshairs", "Technical Indicator Overlays", "Audio Frequency Alerts", "Paper Trading Order Book"],
    tags: ["Candlestick Chart", "Paper Trading", "AI Sentiment", "Price Alerts"]
  },
  {
    id: "blockfans",
    title: "BlockFans Creator Token & AMM Suite",
    category: "crypto-web3",
    categoryLabel: "Web3 & Crypto",
    archetype: "Bonding Curve AMM & NFT Fan Pass Minting",
    stack: "React, TypeScript, HTML5 Canvas, Web Audio",
    why: "Mathematical AMM bonding curve visualizer (P(S) = a*S^k), 4-tier NFT fan pass minting sandbox, creator tip jar with full-screen confetti canvas & arpeggio chimes, and staking yield APY calculators.",
    superpower: "Gives AI agents an out-of-the-box tokenomics and Web3 creator monetization engine ready to embed into any decentralized social or creator economy app.",
    modules: ["BondingCurveCanvas.tsx", "FanPassMinter.tsx", "TipJarConfetti.tsx", "StakingCalculator.tsx"],
    wiring: ["Mathematical Bonding Formula", "Full-Screen Particle Confetti", "Arpeggio Web Audio", "Simulated Web3 Signature"],
    tags: ["Bonding Curve", "AMM Math", "NFT Minting", "Staking APY", "Confetti Canvas"]
  },

  // Local & Client Services
  {
    id: "frn2026",
    title: "Family Reunite Network Portal",
    category: "clients-services",
    categoryLabel: "Local & Client",
    archetype: "Non-Profit Humanitarian Case Intake & Search",
    stack: "React, Vite, Tailwind, Netlify",
    why: "Humanitarian case intake system with secure document upload flows, searchable case registry, emergency help hotline triggers, and multilingual support.",
    superpower: "Ready-made architecture for case management, non-profit portals, humanitarian relief networks, and sensitive client intake applications.",
    modules: ["CaseIntakeForm.tsx", "CaseSearchFilter.tsx", "EmergencyHotlineBar.tsx"],
    wiring: ["Client-side Sanitization", "Netlify Forms Integration", "Accessible Intake Stepper"],
    tags: ["Non-Profit", "Case Intake", "Humanitarian", "Form Stepper"]
  },
  {
    id: "lfcf",
    title: "Living Faith Community Fellowship",
    category: "clients-services",
    categoryLabel: "Local & Client",
    archetype: "Modern Community & Ministry Media Hub",
    stack: "Astro, Tailwind, Schema.org LocalBusiness",
    why: "Complete community organization portal with sermon audio streams, event calendars, ministry directories, and structured JSON-LD church schemas.",
    superpower: "Template for community centers, religious institutions, non-profits, and event-driven organizations.",
    modules: ["SermonAudioPlayer.astro", "EventCalendar.astro", "MinistryGrid.astro"],
    wiring: ["Schema.org Church Graph", "Audio Stream Fallback", "Responsive Media Gallery"],
    tags: ["Astro Local", "Media Stream", "Church Schema", "Event Calendar"]
  },
  {
    id: "valetninjasv2",
    title: "Valet Ninjas Premium Service Platform",
    category: "clients-services",
    categoryLabel: "Local & Client",
    archetype: "On-Demand Logistics & Dynamic Contract Generator",
    stack: "React, Vite, Tailwind, Lucide",
    why: "Dynamic event service estimator, instant contract agreement generator with digital signature canvas, and real-time attendant dispatch tracker.",
    superpower: "Provides the complete booking, estimation, and digital signing flow for local service providers, logistics operations, and catering/event companies.",
    modules: ["InstantEstimator.tsx", "DigitalSignatureCanvas.tsx", "ContractGenerator.tsx"],
    wiring: ["Dynamic Rate Formula", "Canvas Signature Capture", "PDF Workpaper Generator"],
    tags: ["Service Estimator", "Digital Signature", "Contract Generator", "Local Business"]
  },

  // Fintech & Tools
  {
    id: "stripe-mastery-hub",
    title: "Stripe Mastery Architecture Designer",
    category: "fintech-tools",
    categoryLabel: "Fintech & Tools",
    archetype: "Fintech Billing Architecture & Webhook Sandbox",
    stack: "React, TypeScript, Netlify Functions",
    why: "Interactive subscription billing flow designer, payment intent lifecycle visualizer, webhook event testing sandbox, and Stripe checkout blueprints.",
    superpower: "Enables AI agents to immediately wire production Stripe subscription models, multi-tier pricing plans, and webhook handlers into any new app without API guesswork.",
    modules: ["SubscriptionDesigner.tsx", "WebhookSimulator.tsx", "CheckoutBlueprint.tsx"],
    wiring: ["Webhook Payload Validator", "Pricing Tier Matrix", "Payment Intent State Machine"],
    tags: ["Stripe Billing", "Webhook Sandbox", "Fintech Architecture", "Pricing Engine"]
  },
  {
    id: "html-to-pdf-invoice-generator",
    title: "Zero-Dependency HTML to PDF Invoice Suite",
    category: "fintech-tools",
    categoryLabel: "Fintech & Tools",
    archetype: "Client-Side Financial Document Generator",
    stack: "Vanilla HTML5, CSS3, JavaScript",
    why: "Zero-dependency, purely client-side invoice and receipt generator with multi-currency math, tax calculations, dynamic line items, and print/PDF rendering.",
    superpower: "Provides an instant in-browser invoicing and document generation engine requiring no external PDF microservices or paid APIs.",
    modules: ["InvoiceMathEngine.js", "PrintStyles.css", "CurrencyFormatter.js"],
    wiring: ["Browser Print Optimization", "LocalStorage Invoice History", "Multi-Currency Table"],
    tags: ["PDF Generator", "Invoice Suite", "Zero-Dependency", "In-Browser Math"]
  },
  {
    id: "certpath-roadmaps",
    title: "CertPath Interactive Certification Roadmaps",
    category: "fintech-tools",
    categoryLabel: "Fintech & Tools",
    archetype: "Interactive Career Skill Tree & Node Graph",
    stack: "React, TypeScript, HTML5 Canvas, Lucide",
    why: "Skill-tree visualizer with prerequisite unlocks, career milestone tracking, salary estimator curves, and certification study progress persistence.",
    superpower: "Ideal blueprint for skill trees, learning paths, interactive career roadmaps, and gamified onboarding funnels.",
    modules: ["CertCanvas.tsx", "SkillPrereqTree.tsx", "ProgressTracker.tsx"],
    wiring: ["Canvas Node Dragging", "Prerequisite Dependency Resolution", "Salary Curve Interpolator"],
    tags: ["Skill Tree", "Node Graph", "Interactive Canvas", "Career Roadmap"]
  }
];

// State
let currentCategory = "all";
let searchQuery = "";
let composerSlots = [null, null, null];
let soundEnabled = true;

// Web Audio API Synthesizer
let audioCtx = null;

function initAudio() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

function playTone(freq = 440, type = 'sine', duration = 0.08, gainVal = 0.1) {
  if (!soundEnabled) return;
  try {
    initAudio();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(gainVal, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {}
}

function playSlotSound() {
  playTone(523.25, 'triangle', 0.1, 0.12);
  setTimeout(() => playTone(659.25, 'triangle', 0.12, 0.1), 60);
}

function playSynthesizeChime() {
  const freqs = [440, 554.37, 659.25, 880];
  freqs.forEach((f, idx) => {
    setTimeout(() => playTone(f, 'sine', 0.25, 0.08), idx * 70);
  });
}

// Background Neural Constellation Canvas
function initNeuralCanvas() {
  const canvas = document.getElementById('neural-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;
  
  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const nodeCount = Math.min(50, Math.floor(window.innerWidth / 30));
  const nodes = Array.from({ length: nodeCount }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    radius: Math.random() * 1.8 + 1
  }));

  function draw() {
    ctx.clearRect(0, 0, width, height);
    
    // Draw connections
    ctx.lineWidth = 0.5;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 140) {
          const alpha = (1 - dist / 140) * 0.25;
          ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw and update nodes
    for (const node of nodes) {
      node.x += node.vx;
      node.y += node.vy;
      if (node.x < 0 || node.x > width) node.vx *= -1;
      if (node.y < 0 || node.y > height) node.vy *= -1;

      ctx.fillStyle = 'rgba(0, 240, 255, 0.4)';
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(draw);
  }

  draw();
}

// Render Blueprints Cards
function renderBlueprints() {
  const container = document.getElementById('blueprints-grid');
  if (!container) return;

  const filtered = BLUEPRINTS_DATA.filter(bp => {
    const matchesCat = currentCategory === 'all' || bp.category === currentCategory;
    const query = searchQuery.toLowerCase().trim();
    if (!query) return matchesCat;

    const matchesQuery = bp.title.toLowerCase().includes(query) ||
      bp.archetype.toLowerCase().includes(query) ||
      bp.why.toLowerCase().includes(query) ||
      bp.superpower.toLowerCase().includes(query) ||
      bp.stack.toLowerCase().includes(query) ||
      bp.tags.some(t => t.toLowerCase().includes(query));

    return matchesCat && matchesQuery;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; color: var(--text-dim);">
        <p style="font-family: var(--font-mono); font-size: 1.1rem; margin-bottom: 0.5rem;">No blueprint modules match your query.</p>
        <p style="font-size: 0.9rem;">Try searching for "3D", "Canvas", "Audio", "Stripe", or "Terminal".</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(bp => `
    <article class="blueprint-card" data-id="${bp.id}">
      <div class="card-top">
        <span class="cat-tag ${bp.category}">${bp.categoryLabel}</span>
        <span class="stack-pill">${bp.stack}</span>
      </div>

      <h3 class="card-title">${bp.title}</h3>
      <div class="card-archetype"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:inline-block;vertical-align:-1px;margin-right:4px;"><polygon points="2 2 22 2 2 22 2 2"/><line x1="2" y1="8" x2="8" y2="8"/><line x1="2" y1="14" x2="14" y2="14"/></svg>${bp.archetype}</div>

      <div class="card-why-block">
        <strong>Why it powers Zoth Studio</strong>
        ${bp.why}
      </div>

      <div class="features-tags">
        ${bp.tags.map(t => `<span class="feat-tag">${t}</span>`).join('')}
      </div>

      <div class="card-footer">
        <button class="btn-card-detail" type="button" aria-label="View Blueprint Specification" onclick="openBlueprintModal('${bp.id}')">
          <span>View Spec</span>
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
        <button class="btn-card-add" type="button" aria-label="Add Blueprint to Composer" onclick="addToComposer('${bp.id}')">
          + Add to Composer
        </button>
      </div>
    </article>
  `).join('');
}

// Modal View
window.openBlueprintModal = function(id) {
  const bp = BLUEPRINTS_DATA.find(b => b.id === id);
  if (!bp) return;

  playTone(600, 'sine', 0.05, 0.08);

  const modal = document.getElementById('blueprint-modal');
  document.getElementById('modal-category').textContent = bp.categoryLabel.toUpperCase();
  document.getElementById('modal-category').className = `modal-cat-badge ${bp.category}`;
  document.getElementById('modal-title').textContent = bp.title;
  document.getElementById('modal-archetype').textContent = `Archetype: ${bp.archetype} (${bp.stack})`;
  document.getElementById('modal-why').textContent = bp.why;
  document.getElementById('modal-superpower').textContent = bp.superpower;

  document.getElementById('modal-modules-list').innerHTML = bp.modules.map(m => `<li>${m}</li>`).join('');
  document.getElementById('modal-wiring-list').innerHTML = bp.wiring.map(w => `<li>${w}</li>`).join('');

  const samplePrompt = `zoth build --blueprint "${bp.id}" \\
  --archetype "${bp.archetype}" \\
  --include-modules "${bp.modules.join(',')}" \\
  --wiring "${bp.wiring.join(',')}" \\
  --deploy netlify`;
  
  document.getElementById('modal-prompt-code').textContent = samplePrompt;

  const addBtn = document.getElementById('modal-add-composer-btn');
  addBtn.onclick = () => {
    addToComposer(bp.id);
    modal.close();
  };

  const copyBtn = document.getElementById('modal-copy-prompt-btn');
  copyBtn.onclick = () => {
    navigator.clipboard.writeText(samplePrompt);
    copyBtn.textContent = 'Copied!';
    playTone(880, 'sine', 0.08, 0.1);
    setTimeout(() => { copyBtn.textContent = 'Copy Agent Prompt'; }, 2000);
  };

  modal.showModal();
};

// Composer Slots Logic
window.addToComposer = function(id) {
  const bp = BLUEPRINTS_DATA.find(b => b.id === id);
  if (!bp) return;

  // Check if already present
  if (composerSlots.some(s => s && s.id === bp.id)) {
    playTone(300, 'sawtooth', 0.1, 0.1);
    return;
  }

  // Find first empty slot
  const emptyIdx = composerSlots.findIndex(s => s === null);
  if (emptyIdx === -1) {
    // replace last
    composerSlots[2] = bp;
  } else {
    composerSlots[emptyIdx] = bp;
  }

  playSlotSound();
  renderComposerSlots();
};

window.removeFromComposer = function(idx) {
  composerSlots[idx] = null;
  playTone(350, 'sine', 0.06, 0.08);
  renderComposerSlots();
};

function renderComposerSlots() {
  const container = document.getElementById('composer-slots');
  if (!container) return;

  container.innerHTML = composerSlots.map((slot, idx) => {
    if (!slot) {
      const labels = [
        "Select a Foundation UI / Client Block",
        "Select an Interactive Engine / Canvas Block",
        "Select a Logic / Web3 / Fintech Block"
      ];
      return `
        <div class="slot-empty" data-slot="${idx + 1}">
          <span class="slot-num">${idx + 1}</span>
          <span class="slot-text">${labels[idx]}</span>
        </div>
      `;
    }

    return `
      <div class="slot-filled" data-slot="${idx + 1}">
        <span class="slot-num">${idx + 1}</span>
        <div class="slot-filled-meta">
          <h4>${slot.title}</h4>
          <p>${slot.archetype}</p>
        </div>
        <button class="slot-remove-btn" type="button" aria-label="Remove slot" onclick="removeFromComposer(${idx})">✕</button>
      </div>
    `;
  }).join('');
}

// Generate Full Zoth Spec
function generateZothSpec() {
  const active = composerSlots.filter(Boolean);
  if (active.length === 0) {
    playTone(250, 'sawtooth', 0.15, 0.1);
    alert("Please select at least 1 blueprint block into the composer slots!");
    return;
  }

  playSynthesizeChime();

  const tray = document.getElementById('composer-output-tray');
  const codeBlock = document.getElementById('spec-code-block');

  const blueprintsFlag = active.map(b => b.id).join(' + ');
  const archetypes = active.map(b => b.archetype).join(' | ');
  const combinedModules = Array.from(new Set(active.flatMap(b => b.modules)));
  const combinedWiring = Array.from(new Set(active.flatMap(b => b.wiring)));

  const specText = `// ==========================================
// 🚀 ZOTH STUDIO COMPOSITE APP BLUEPRINT SPEC
// Generated: ${new Date().toISOString()}
// Blueprints: [ ${blueprintsFlag} ]
// ==========================================

$ zoth compose \\
  --blueprints "${active.map(b => b.id).join(',')}" \\
  --target-stack "Astro/Vite + Tailwind + Web Audio" \\
  --seo-aeo-mode "strict-schema-org" \\
  --wcag-audit "level-aa" \\
  --offline-mocks "enabled"

## 🏗️ Architecture Composite Graph:
${active.map((b, i) => `  ${i+1}. [${b.categoryLabel.toUpperCase()}] ${b.title} (${b.archetype})`).join('\n')}

## 📦 Bundled Core Modules:
${combinedModules.map(m => `  • ${m}`).join('\n')}

## ⚡ Technical Wiring & Integration Hooks:
${combinedWiring.map(w => `  • ${w}`).join('\n')}

## 🤖 Agent Execution Prompt:
"Act as the Zoth Studio Senior Systems Architect. Compose a unified production-ready web application by integrating the ${active.map(b => `'${b.title}'`).join(' and ')} blueprints. Ensure zero external broken API dependencies by embedding offline fallback mock engines, full WCAG 2.1 AA :focus-visible styling, schema.org JSON-LD structured data, and responsive glassmorphic UI tokens."
`;

  codeBlock.textContent = specText;
  tray.classList.remove('hidden');
  tray.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// =============================================================================
// SYSTEM BLUEPRINTS & ARCHITECTURE DIAGRAM ENGINE
// Sacred Geometry Nodes, Sovereign Airgap Schemas, Multi-Agent Consensus DAGs
// =============================================================================

let currentDiagramMode = "sovereign-airgap";
let selectedDiagramNodeId = "vault";
let laserTelemetryActive = true;
let isSwarmRunning = false;

const DIAGRAM_NODES_DATA = {
  // Sovereign Airgap Nodes
  "vault": {
    title: "Rust Argon2id BYOK Vault",
    badge: "TIER 1 · ZERO-LEAK",
    category: "Zero-Leak Key Store",
    layer: "Tier 1: Hardware-Isolated Key Vault",
    port: "127.0.0.1:8787 (Loopback Only)",
    metric: "Argon2id (m=64MB, t=3, p=4)",
    protocol: "XChaCha20-Poly1305 + Rust Zeroize",
    security: "Zero-Leak Hardware Loopback · Keyring dropped on scope exit",
    desc: "Standalone cryptographic micro-daemon isolating user API keys, Solana private keypairs, and database secrets. Private keys are never passed through HTTP query params or public edge routes.",
    freq: 587.33
  },
  "esp32": {
    title: "ESP32-S3 Hardware Companion",
    badge: "TIER 2 · HARDWARE AIRGAP",
    category: "Physical Companion Hub",
    layer: "Tier 2: Embedded Hardware Bridge",
    port: "127.0.0.1:8585 (/dev/ttyACM0 @ 115200 baud)",
    metric: "240x320 ST7789 IPS · ES8311 I2S Audio",
    protocol: "Bidirectional Serial JSON + NeoPixel",
    security: "Physical Hardware Airgap · Dedicated Serial USB Port",
    desc: "Lafvin ESP32-S3 N16R8 companion device running modular C++ firmware. Renders 24 companion pet moods, live swarm CPU metrics, vocalizes TTS notifications, and accepts tactile button trigger interrupts.",
    freq: 659.25
  },
  "deck": {
    title: "Operator Command Deck Router",
    badge: "TIER 3 · LOCAL CORE",
    category: "Swarm Router & Dispatcher",
    layer: "Tier 3: Local Operator Core",
    port: "127.0.0.1:8484 (Operator Only)",
    metric: "Starlette/FastAPI Async · Sub-1ms Router",
    protocol: "HTTP/2 SSE Event Streams + Terminal Dock",
    security: "Operator Loopback Auth · Zero Public Relay",
    desc: "Central nervous system orchestrating parallel multi-agent runs, WebSocket telemetry feeds, claim locking lifecycle, and model consensus arbitration.",
    freq: 523.25
  },
  "llm": {
    title: "Local AI: zoth-micro (1.5B)",
    badge: "TIER 3 · LOCAL INFERENCE",
    category: "Offline Neural Inference",
    layer: "Tier 3: Local Execution Engine",
    port: "127.0.0.1:11434 (Ollama Backend)",
    metric: "1.53B Tensors · GGUF Q4_K_M · 986MB RAM",
    protocol: "Qwen2.5-Coder Tensor Graph · 32k Context",
    security: "100% Offline Weights · Zero Cloud Telemetry",
    desc: "Specialized local-first coding LLM synthesized directly from the 24 pet companion doctrines, 47 tool schemas, and Obsidian Knowledge Matrix for instant sub-second code generation without internet.",
    freq: 440.00
  },
  "tools": {
    title: "47+ Chained Local Tools",
    badge: "TIER 3 · SYSTEM ARSENAL",
    category: "CLI & System Automation",
    layer: "Tier 3: Execution Arsenal",
    port: "Native POSIX / Subprocess Sandbox",
    metric: "47 Deterministic Contracts · SubSweep OSINT",
    protocol: "JSON-RPC Tool Schemas · Zero-External Dep",
    security: "Strict Path Isolation & Whitelisted Execution",
    desc: "Autonomous local tool contracts spanning DNS reconnaissance, static AST linting, Three.js shader compilers, Solana micropayment RPCs, and automated build verification scripts.",
    freq: 493.88
  },
  "hub": {
    title: "Public Studio Hub",
    badge: "TIER 4 · PUBLIC / EDGE SAFE",
    category: "Web & Viewport Foundry",
    layer: "Tier 4: Public / Tunnel Safe",
    port: "127.0.0.1:8088 / Public Reverse Proxy",
    metric: "23+ Workstations · Three.js 3D Viewport",
    protocol: "Modern Vanilla JS / Vite / Web Audio / AEO",
    security: "Strict CSP Headers · Read-Only Secret Proxies",
    desc: "Public presentation surface delivering 23+ interactive workstations, real-time 3D Three.js CAD viewport, anime comic reader, soundboards, and Schema.org machine-readable discovery graphs.",
    freq: 783.99
  },

  // Multi-Agent DAG Nodes
  "dag-operator": {
    title: "Operator Task Ingestion",
    badge: "STAGE 0 · INTENT",
    category: "DAG Ingestion",
    layer: "Stage 0: Intent Ingestion",
    port: "CLI / Web Deck / Signal NOC",
    metric: "Natural Language Prompt & AST Constraints",
    protocol: "Standardized Task Request Schema",
    security: "Loopback Authenticated Operator Channel",
    desc: "Initial requirement ingest capturing operator intent, target deployment constraints, UI tokens, and security criteria.",
    freq: 440.00
  },
  "dag-antigravity": {
    title: "@antigravity Lead Architect",
    badge: "STAGE 1 · SOVEREIGN LEAD",
    category: "Sovereign Lead Agent",
    layer: "Stage 1: Parallel Agent Synthesis",
    port: "agent-comms/inbox/from-antigravity/",
    metric: "Static AST Analysis · Security Boundary",
    protocol: "Inter-Agent Message Bus Protocol v2.6.0",
    security: "Strict Architectural Invariance Enforcer",
    desc: "Sovereign lead agent persona ensuring zero regression, rigorous zero-trust containment, and architectural coherence across the entire codebase.",
    freq: 554.37
  },
  "dag-grok": {
    title: "@grok Kinetic Core",
    badge: "STAGE 1 · SHADERS & 3D",
    category: "Throughput & Shaders",
    layer: "Stage 1: Parallel Agent Synthesis",
    port: "agent-comms/inbox/from-grok/",
    metric: "60 FPS Canvas Shaders · Kinetic Physics",
    protocol: "High-Throughput Code Generation Pipeline",
    security: "WebGL Isolate Execution",
    desc: "Specialist model driving high-speed procedural WebGL/Three.js shader synthesis, fluid 60 FPS CSS/canvas micro-animations, and algorithmic refactoring.",
    freq: 659.25
  },
  "dag-hermes": {
    title: "@hermes Tool Contracts",
    badge: "STAGE 1 · TOOL ROUTER",
    category: "Tool Router Agent",
    layer: "Stage 1: Parallel Agent Synthesis",
    port: "agent-comms/inbox/from-hermes/",
    metric: "47 Tool Schemas · Subprocess Pipeline",
    protocol: "Nous Research Function Call Contract",
    security: "Strict Argument Schema Validation",
    desc: "Autonomous tool caller and DAG playbook coordinator wrapping system diagnostics, terminal pipelines, and network verification.",
    freq: 493.88
  },
  "dag-ollama": {
    title: "@ollama (zoth-micro)",
    badge: "STAGE 1 · LOCAL CORE",
    category: "Offline Local Core",
    layer: "Stage 1: Parallel Agent Synthesis",
    port: "127.0.0.1:11434 (Local Model)",
    metric: "GGUF Q4_K_M · Zero Cloud Dependency",
    protocol: "Native Ollama REST API",
    security: "100% Offline Airgapped Inference",
    desc: "Autonomous local inference core generating offline mock fallbacks, local storage adapters, and deterministic unit test suites.",
    freq: 392.00
  },
  "dag-shannon": {
    title: "Shannon Entropy Arbiter",
    badge: "STAGE 2 · CONSENSUS GATE",
    category: "Mathematical Arbiter",
    layer: "Stage 2: Mathematical Consensus Gate",
    port: "core-app/orchestrator/consensus.py",
    metric: "H(S) = -∑ p_i log2(p_i) | Score ≥ 0.80",
    protocol: "Jaccard Token Overlap & AST Reconciliation",
    security: "Conflict Resolution & Deadlock Breaker",
    desc: "Mathematical consensus engine evaluating token divergence and structural plans across peer models. Synthesizes a unified high-confidence build ticket.",
    freq: 739.99
  },
  "dag-ast": {
    title: "AST Syntax & CSP Validator",
    badge: "STAGE 3 · QUALITY GATE",
    category: "Build Validation",
    layer: "Stage 3: Automated Quality Gate",
    port: "Local Lint & Security Engine",
    metric: "WCAG 2.1 AA · CSP Strictness · Zero Lints",
    protocol: "Parser Tree Verification & AX Checker",
    security: "Pre-execution Sanitization",
    desc: "Automated syntax tree parser and Content Security Policy linter verifying responsive layouts, touch targets, keyboard navigation, and zero inline script injection.",
    freq: 830.61
  },
  "dag-merkle": {
    title: "Merkle Task Sealer & Vault",
    badge: "STAGE 4 · CRYPTO NOTARY",
    category: "Cryptographic Sealer",
    layer: "Stage 4: Cryptographic Notary",
    port: "Argon2id Vault RPC Gate (:8787)",
    metric: "SHA-256 Task Hash · XChaCha20 Sig",
    protocol: "Zero-Leak Key Signing Protocol",
    security: "Immutable Build Ledger & Audit Trail",
    desc: "Locks build artifacts with a cryptographic SHA-256 hash and records execution metadata to the local immutable agent audit board.",
    freq: 880.00
  },
  "dag-release": {
    title: "Sovereign App Deployment",
    badge: "STAGE 5 · PRODUCTION",
    category: "Production Release",
    layer: "Stage 5: Live Foundry Deployment",
    port: "Target Web Server / Physical Device",
    metric: "0.4s Synthesis · Netlify / Host / Device",
    protocol: "Static Build Output / Micro-Frontend",
    security: "Verified Production-Ready Package",
    desc: "Final deployment of the synthesized application blueprint, ready for local execution or instant edge cloud hosting.",
    freq: 987.77
  },

  // Sacred Geometry Nodes
  "geo-azoth": {
    title: "Azoth Sovereign Phoenix",
    badge: "CROWN · SOVEREIGN LEAD",
    category: "Ecosystem Sovereign",
    layer: "Sacred Crown (Point 0° / Top)",
    port: "Azoth Persona Core",
    metric: "Golden Ratio Coordinate (Φ = 1.618)",
    protocol: "Hermetic Synthesis & Architectural Invariance",
    security: "Sovereign Lead Pairing Doctrine",
    desc: "Master alchemical persona coordinating all sub-models and pet spirits. Doctrine: Complete architectural coherence, zero regression, and total local sovereignty.",
    freq: 880.00
  },
  "geo-kai": {
    title: "Kai Holographic Cat",
    badge: "VERTEX 60° · DIFF AUDITOR",
    category: "Diff & AST Auditor",
    layer: "Hex Vertex 60° (Top Right)",
    port: "Kai Verification Engine",
    metric: "Minimal AST Blast Radius | 659Hz",
    protocol: "Precision Code Inspection",
    security: "Zero False Positives",
    desc: "Workspace inspector specializing in minimal blast radius changes, AST tree verification, and deterministic bug squashing.",
    freq: 659.25
  },
  "geo-draco": {
    title: "Draco Cyber Dragon",
    badge: "VERTEX 120° · FUSION COMPILER",
    category: "Multi-Agent Fusion Compiler",
    layer: "Hex Vertex 120° (Bottom Right)",
    port: "Draco Fusion Harness",
    metric: "Consensus Agreement Matrix | 587Hz",
    protocol: "Multi-Model Fusion & AST Merging",
    security: "Conflict Escalation Gate",
    desc: "Fuses divergent code proposals from Grok, Hermes, and Antigravity into a harmonious, optimized single codebase.",
    freq: 587.33
  },
  "geo-luna": {
    title: "Luna Lunar Fox",
    badge: "VERTEX 180° · MEDIA & SHADERS",
    category: "Media & Canvas Synthesizer",
    layer: "Hex Vertex 180° (Bottom)",
    port: "Luna Canvas Renderer",
    metric: "60 FPS Fluid Three.js Shaders | 523Hz",
    protocol: "WebGL & Web Audio Procedural Synthesis",
    security: "GPU Memory Bound Buffer Management",
    desc: "Creative media spirit designing fluid cybernetic aesthetics, glassmorphism design tokens, particle fields, and procedural audio synthesis.",
    freq: 523.25
  },
  "geo-zephyr": {
    title: "Zephyr Wind Falcon",
    badge: "VERTEX 240° · REFACTORER",
    category: "High-Velocity Refactorer",
    layer: "Hex Vertex 240° (Bottom Left)",
    port: "Zephyr Optimizer Core",
    metric: "Max Throughput & Dead-Code Pruning",
    protocol: "High-Speed AST Pruning",
    security: "Zero-Latency Code Simplification",
    desc: "Velocity refactoring master. Eliminates dead abstractions, strips redundant imports, and maximizes execution throughput.",
    freq: 440.00
  },
  "geo-nyx": {
    title: "Nyx Shadow Panther",
    badge: "VERTEX 300° · CRYPTO SENTINEL",
    category: "Zero-Trust Cryptographer",
    layer: "Hex Vertex 300° (Top Left)",
    port: "Nyx Security Sentinel",
    metric: "Argon2id Vault Guard | 392Hz",
    protocol: "Zero-Trust Encrypted Ingress/Egress",
    security: "Continuous Cryptographic Verification",
    desc: "Cryptographic security sentinel continuously auditing memory buffers, verifying zero-leak policies, and enforcing XChaCha20 encryption at rest.",
    freq: 392.00
  },
  "geo-zoth": {
    title: "Zoth Prime Core",
    badge: "ORIGIN (0,0) · SOVEREIGN NEXUS",
    category: "Master Loopback Deck",
    layer: "Center Alchemical Origin (0,0)",
    port: "127.0.0.1:8484 (Zoth Daemon)",
    metric: "Sovereign Alchemical Nexus (Φ^0 = 1.0)",
    protocol: "Master Loopback Orchestration Daemon",
    security: "Hardware-Bounded Loopback Core",
    desc: "The alchemical singularity binding all 24 companion pet archetypes, 47 tool contracts, and local AI model weights into a unified sovereign operating system.",
    freq: 432.00
  },
  "geo-matrix": {
    title: "47+ Chained Tools Lattice",
    badge: "TRIAD 1 · SYSTEM MATRIX",
    category: "Tool Matrix",
    layer: "Inner Golden Triad Point 1",
    port: "tools-and-automation/",
    metric: "47 POSIX Subprocess Contracts",
    protocol: "Deterministic JSON-RPC Contracts",
    security: "Sandboxed Path Enforcement",
    desc: "Inner triad node binding local threat scanners, 3D asset generators, and Web Audio synthesizers into callable function definitions.",
    freq: 493.88
  },
  "geo-obsidian": {
    title: "Obsidian Vector Matrix",
    badge: "TRIAD 2 · KNOWLEDGE GRAPH",
    category: "Knowledge Matrix",
    layer: "Inner Golden Triad Point 2",
    port: "Obsidian Vault Linkage",
    metric: "Bidirectional Graph Links & Vectors",
    protocol: "Markdown / Frontmatter Knowledge Graph",
    security: "Local-Only Knowledge Store",
    desc: "Interlinked documentation, architectural diagrams, pet doctrines, and AEO keyword maps powering local grounding.",
    freq: 523.25
  },
  "geo-keyring": {
    title: "Argon2id Zero-Leak Keyring",
    badge: "TRIAD 3 · MEMORY KEYRING",
    category: "Cryptographic Keyring",
    layer: "Inner Golden Triad Point 3",
    port: "127.0.0.1:8787",
    metric: "Argon2id (m=64MB, t=3, p=4)",
    protocol: "XChaCha20-Poly1305 Secure Key Store",
    security: "RAM Sanitization with Rust Zeroize",
    desc: "Encrypted memory-only keyring protecting master API keys and cryptographic signatures without external cloud KMS.",
    freq: 587.33
  }
};

// SVG Diagram Renderers
function renderSovereignAirgapSVG() {
  const pulseClass = laserTelemetryActive ? 'svg-dag-line' : '';
  const pulseClassGold = laserTelemetryActive ? 'svg-dag-line-gold' : '';
  const dotDisplay = laserTelemetryActive ? 'inline' : 'none';

  return `
    <svg class="diagram-svg-root" viewBox="0 0 900 560" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="glow-gold" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="grad-tier-deck" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="rgba(14, 24, 48, 0.85)" />
          <stop offset="100%" stop-color="rgba(6, 10, 20, 0.95)" />
        </linearGradient>
        <linearGradient id="grad-gold-border" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#fbbf24" />
          <stop offset="100%" stop-color="#d97706" />
        </linearGradient>
        <linearGradient id="grad-cyan-border" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#00f0ff" />
          <stop offset="100%" stop-color="#0284c7" />
        </linearGradient>
      </defs>

      <!-- Background Grid & Sacred Geometry Watermark -->
      <g opacity="0.12">
        <circle cx="450" cy="280" r="240" fill="none" stroke="#00f0ff" stroke-width="1" stroke-dasharray="4 8" />
        <circle cx="450" cy="280" r="150" fill="none" stroke="#fbbf24" stroke-width="1" stroke-dasharray="6 6" />
        <polygon points="450,40 657,160 657,400 450,520 243,400 243,160" fill="none" stroke="#00f0ff" stroke-width="0.8" />
      </g>

      <!-- Tier 1: Hardware-Isolated Key Vault (Top-Left) -->
      <g id="node-group-vault" class="svg-interactive-node ${selectedDiagramNodeId === 'vault' ? 'is-selected' : ''}" onclick="selectDiagramNode('vault')">
        <rect x="50" y="50" width="240" height="130" rx="12" fill="url(#grad-tier-deck)" stroke="rgba(245, 158, 11, 0.4)" stroke-width="1.5" class="node-gold-bg" />
        <rect x="50" y="50" width="240" height="28" rx="12" fill="rgba(245, 158, 11, 0.15)" />
        <text x="65" y="70" fill="#fbbf24" font-family="'IBM Plex Mono', monospace" font-size="11" font-weight="700">🔒 TIER 1: KEY VAULT (:8787)</text>
        <text x="65" y="105" fill="#ffffff" font-family="'Syne', sans-serif" font-size="14" font-weight="700">Rust Argon2id BYOK</text>
        <text x="65" y="125" fill="#94a3b8" font-family="'IBM Plex Mono', monospace" font-size="11">XChaCha20-Poly1305 AEAD</text>
        <text x="65" y="145" fill="#38bdf8" font-family="'IBM Plex Mono', monospace" font-size="10">● Zeroize Buffer Barrier</text>
        <circle cx="265" cy="115" r="14" fill="rgba(245, 158, 11, 0.2)" stroke="#fbbf24" stroke-width="1" />
        <text x="260" y="120" font-size="12">🔐</text>
      </g>

      <!-- Tier 2: ESP32-S3 Hardware Companion Bridge (Bottom-Left) -->
      <g id="node-group-esp32" class="svg-interactive-node ${selectedDiagramNodeId === 'esp32' ? 'is-selected' : ''}" onclick="selectDiagramNode('esp32')">
        <rect x="50" y="380" width="240" height="130" rx="12" fill="url(#grad-tier-deck)" stroke="rgba(16, 185, 129, 0.4)" stroke-width="1.5" class="node-bg" />
        <rect x="50" y="380" width="240" height="28" rx="12" fill="rgba(16, 185, 129, 0.15)" />
        <text x="65" y="400" fill="#34d399" font-family="'IBM Plex Mono', monospace" font-size="11" font-weight="700">📟 TIER 2: HARDWARE (:8585)</text>
        <text x="65" y="435" fill="#ffffff" font-family="'Syne', sans-serif" font-size="14" font-weight="700">ESP32-S3 N16R8 Companion</text>
        <text x="65" y="455" fill="#94a3b8" font-family="'IBM Plex Mono', monospace" font-size="11">ST7789 IPS · ES8311 I2S Audio</text>
        <text x="65" y="475" fill="#34d399" font-family="'IBM Plex Mono', monospace" font-size="10">● /dev/ttyACM0 Serial JSON</text>
        <circle cx="265" cy="445" r="14" fill="rgba(16, 185, 129, 0.2)" stroke="#34d399" stroke-width="1" />
        <text x="260" y="450" font-size="12">📟</text>
      </g>

      <!-- Tier 3: Operator Command Deck (Center Core) -->
      <g id="node-group-deck" class="svg-interactive-node ${selectedDiagramNodeId === 'deck' ? 'is-selected' : ''}" onclick="selectDiagramNode('deck')">
        <rect x="350" y="140" width="220" height="280" rx="16" fill="url(#grad-tier-deck)" stroke="#00f0ff" stroke-width="2" class="node-bg" filter="url(#glow-cyan)" />
        <rect x="350" y="140" width="220" height="34" rx="16" fill="rgba(0, 240, 255, 0.18)" />
        <text x="368" y="162" fill="#00f0ff" font-family="'IBM Plex Mono', monospace" font-size="12" font-weight="700">⚡ TIER 3: DECK (:8484)</text>
        <text x="368" y="200" fill="#ffffff" font-family="'Syne', sans-serif" font-size="16" font-weight="800">Operator Swarm Router</text>
        <text x="368" y="222" fill="#94a3b8" font-family="'IBM Plex Mono', monospace" font-size="11">Starlette Async Dispatcher</text>

        <!-- Sub-nodes inside Deck -->
        <g id="node-group-llm" class="svg-interactive-node ${selectedDiagramNodeId === 'llm' ? 'is-selected' : ''}" onclick="event.stopPropagation(); selectDiagramNode('llm');">
          <rect x="368" y="240" width="184" height="65" rx="8" fill="rgba(10, 16, 30, 0.9)" stroke="rgba(0, 240, 255, 0.4)" stroke-width="1" class="node-bg" />
          <text x="380" y="260" fill="#fbbf24" font-family="'IBM Plex Mono', monospace" font-size="10" font-weight="700">🧠 zoth-micro (1.5B GGUF)</text>
          <text x="380" y="278" fill="#cbd5e1" font-size="10">Offline Local Model Inference</text>
          <text x="380" y="294" fill="#38bdf8" font-family="'IBM Plex Mono', monospace" font-size="9">Ollama Loopback :11434</text>
        </g>

        <g id="node-group-tools" class="svg-interactive-node ${selectedDiagramNodeId === 'tools' ? 'is-selected' : ''}" onclick="event.stopPropagation(); selectDiagramNode('tools');">
          <rect x="368" y="320" width="184" height="65" rx="8" fill="rgba(10, 16, 30, 0.9)" stroke="rgba(168, 85, 247, 0.4)" stroke-width="1" class="node-bg" />
          <text x="380" y="340" fill="#c084fc" font-family="'IBM Plex Mono', monospace" font-size="10" font-weight="700">🛠️ 47+ Chained Tools</text>
          <text x="380" y="358" fill="#cbd5e1" font-size="10">SubSweep · V8 Forge · Solana</text>
          <text x="380" y="374" fill="#a855f7" font-family="'IBM Plex Mono', monospace" font-size="9">Native POSIX Subprocess</text>
        </g>

        <circle cx="538" cy="195" r="14" fill="rgba(0, 240, 255, 0.2)" stroke="#00f0ff" stroke-width="1" />
        <text x="533" y="200" font-size="12">🎛️</text>
      </g>

      <!-- Tier 4: Public Studio Hub (Right) -->
      <g id="node-group-hub" class="svg-interactive-node ${selectedDiagramNodeId === 'hub' ? 'is-selected' : ''}" onclick="selectDiagramNode('hub')">
        <rect x="630" y="160" width="220" height="240" rx="14" fill="url(#grad-tier-deck)" stroke="rgba(56, 189, 248, 0.4)" stroke-width="1.5" class="node-bg" />
        <rect x="630" y="160" width="220" height="30" rx="14" fill="rgba(56, 189, 248, 0.15)" />
        <text x="648" y="181" fill="#38bdf8" font-family="'IBM Plex Mono', monospace" font-size="11" font-weight="700">🌐 TIER 4: PUBLIC HUB (:8088)</text>
        <text x="648" y="215" fill="#ffffff" font-family="'Syne', sans-serif" font-size="15" font-weight="700">23+ Web Workstations</text>
        <text x="648" y="235" fill="#94a3b8" font-family="'IBM Plex Mono', monospace" font-size="11">Three.js 3D Viewport</text>
        
        <rect x="648" y="255" width="184" height="42" rx="6" fill="rgba(10, 16, 30, 0.8)" stroke="rgba(255, 255, 255, 0.1)" />
        <text x="658" y="272" fill="#cbd5e1" font-size="10">AEO Knowledge Graph</text>
        <text x="658" y="287" fill="#fbbf24" font-family="'IBM Plex Mono', monospace" font-size="9">zoth-knowledge-graph.json</text>

        <rect x="648" y="310" width="184" height="42" rx="6" fill="rgba(10, 16, 30, 0.8)" stroke="rgba(255, 255, 255, 0.1)" />
        <text x="658" y="327" fill="#cbd5e1" font-size="10">Nexus 3D Shader Omniverse</text>
        <text x="658" y="342" fill="#00f0ff" font-family="'IBM Plex Mono', monospace" font-size="9">WebGL 60 FPS Viewport</text>

        <circle cx="818" cy="210" r="14" fill="rgba(56, 189, 248, 0.2)" stroke="#38bdf8" stroke-width="1" />
        <text x="813" y="215" font-size="12">🌐</text>
      </g>

      <!-- Connecting Corridors & Animated Data Flowpaths -->
      <!-- Vault (:8787) -> Deck (:8484) -->
      <path d="M 290 115 C 320 115, 320 200, 350 200" fill="none" stroke="#fbbf24" stroke-width="2" class="${pulseClassGold}" />
      <circle cx="320" cy="155" r="4" fill="#fbbf24" class="dag-pulse-dot-gold" style="display: ${dotDisplay};" />

      <!-- ESP32 (:8585) <-> Deck (:8484) -->
      <path d="M 290 445 C 320 445, 320 360, 350 360" fill="none" stroke="#34d399" stroke-width="2" class="${pulseClass}" />
      <circle cx="320" cy="400" r="4" fill="#34d399" class="dag-pulse-dot" style="display: ${dotDisplay};" />

      <!-- Deck (:8484) -> Public Hub (:8088) -->
      <path d="M 570 280 L 630 280" fill="none" stroke="#00f0ff" stroke-width="2.5" class="${pulseClass}" />
      <circle cx="600" cy="280" r="4" fill="#00f0ff" class="dag-pulse-dot" style="display: ${dotDisplay};" />

      <!-- Airgap Isolation Boundary Labels -->
      <line x1="320" y1="20" x2="320" y2="540" stroke="rgba(245, 158, 11, 0.3)" stroke-width="1" stroke-dasharray="4 6" />
      <text x="312" y="530" fill="rgba(245, 158, 11, 0.7)" font-family="'IBM Plex Mono', monospace" font-size="9" text-anchor="end" transform="rotate(-90 312 530)">PRIVATE LOOPBACK WALL</text>

      <line x1="600" y1="20" x2="600" y2="540" stroke="rgba(0, 240, 255, 0.3)" stroke-width="1" stroke-dasharray="4 6" />
      <text x="592" y="530" fill="rgba(0, 240, 255, 0.7)" font-family="'IBM Plex Mono', monospace" font-size="9" text-anchor="end" transform="rotate(-90 592 530)">READ-ONLY REVERSE PROXY BOUNDARY</text>
    </svg>
  `;
}

function renderMultiAgentDAGSVG() {
  const pulseClass = laserTelemetryActive ? 'svg-dag-line' : '';
  const pulseClassGold = laserTelemetryActive ? 'svg-dag-line-gold' : '';
  const dotDisplay = laserTelemetryActive ? 'inline' : 'none';

  return `
    <svg class="diagram-svg-root" viewBox="0 0 900 560" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="dag-glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="dag-glow-gold" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      <!-- Stage 0: Operator Task Ingest -->
      <g id="node-group-dag-operator" class="svg-interactive-node ${selectedDiagramNodeId === 'dag-operator' ? 'is-selected' : ''}" onclick="selectDiagramNode('dag-operator')">
        <rect x="30" y="235" width="130" height="90" rx="10" fill="rgba(14, 22, 40, 0.9)" stroke="#38bdf8" stroke-width="1.5" class="node-bg" />
        <text x="45" y="258" fill="#38bdf8" font-family="'IBM Plex Mono', monospace" font-size="10" font-weight="700">STAGE 0</text>
        <text x="45" y="280" fill="#ffffff" font-family="'Syne', sans-serif" font-size="13" font-weight="700">Operator</text>
        <text x="45" y="298" fill="#94a3b8" font-size="10">Prompt &amp; AST</text>
        <circle cx="135" cy="255" r="10" fill="rgba(56, 189, 248, 0.2)" />
        <text x="131" y="259" font-size="10">🧑‍💻</text>
      </g>

      <!-- Connecting Lines to Stage 1 Parallel Swarm -->
      <path d="M 160 280 C 190 280, 190 105, 230 105" fill="none" stroke="#fbbf24" stroke-width="1.5" class="${pulseClassGold}" />
      <path d="M 160 280 C 190 280, 190 215, 230 215" fill="none" stroke="#00f0ff" stroke-width="1.5" class="${pulseClass}" />
      <path d="M 160 280 C 190 280, 190 335, 230 335" fill="none" stroke="#a855f7" stroke-width="1.5" class="${pulseClass}" />
      <path d="M 160 280 C 190 280, 190 445, 230 445" fill="none" stroke="#10b981" stroke-width="1.5" class="${pulseClass}" />

      <!-- Stage 1 Parallel Agent Swarm -->
      <!-- Antigravity -->
      <g id="node-group-dag-antigravity" class="svg-interactive-node ${selectedDiagramNodeId === 'dag-antigravity' ? 'is-selected' : ''}" onclick="selectDiagramNode('dag-antigravity')">
        <rect x="230" y="65" width="180" height="75" rx="10" fill="rgba(14, 22, 40, 0.9)" stroke="#fbbf24" stroke-width="1.5" class="node-gold-bg" />
        <text x="245" y="88" fill="#fbbf24" font-family="'IBM Plex Mono', monospace" font-size="10" font-weight="700">@antigravity Lead</text>
        <text x="245" y="108" fill="#ffffff" font-family="'Syne', sans-serif" font-size="12" font-weight="700">Static AST &amp; Security</text>
        <text x="245" y="125" fill="#94a3b8" font-size="9">Architectural Invariance</text>
        <text x="385" y="90" font-size="12">🔮</text>
      </g>

      <!-- Grok -->
      <g id="node-group-dag-grok" class="svg-interactive-node ${selectedDiagramNodeId === 'dag-grok' ? 'is-selected' : ''}" onclick="selectDiagramNode('dag-grok')">
        <rect x="230" y="175" width="180" height="75" rx="10" fill="rgba(14, 22, 40, 0.9)" stroke="#00f0ff" stroke-width="1.5" class="node-bg" />
        <text x="245" y="198" fill="#00f0ff" font-family="'IBM Plex Mono', monospace" font-size="10" font-weight="700">@grok Kinetic Core</text>
        <text x="245" y="218" fill="#ffffff" font-family="'Syne', sans-serif" font-size="12" font-weight="700">60fps Three.js Shaders</text>
        <text x="245" y="235" fill="#94a3b8" font-size="9">Throughput Refactoring</text>
        <text x="385" y="200" font-size="12">⚡</text>
      </g>

      <!-- Hermes -->
      <g id="node-group-dag-hermes" class="svg-interactive-node ${selectedDiagramNodeId === 'dag-hermes' ? 'is-selected' : ''}" onclick="selectDiagramNode('dag-hermes')">
        <rect x="230" y="295" width="180" height="75" rx="10" fill="rgba(14, 22, 40, 0.9)" stroke="#a855f7" stroke-width="1.5" class="node-bg" />
        <text x="245" y="318" fill="#c084fc" font-family="'IBM Plex Mono', monospace" font-size="10" font-weight="700">@hermes Tool Router</text>
        <text x="245" y="338" fill="#ffffff" font-family="'Syne', sans-serif" font-size="12" font-weight="700">47 Tool Schemas</text>
        <text x="245" y="355" fill="#94a3b8" font-size="9">DAG Contract Playbooks</text>
        <text x="385" y="320" font-size="12">📜</text>
      </g>

      <!-- Ollama zoth-micro -->
      <g id="node-group-dag-ollama" class="svg-interactive-node ${selectedDiagramNodeId === 'dag-ollama' ? 'is-selected' : ''}" onclick="selectDiagramNode('dag-ollama')">
        <rect x="230" y="405" width="180" height="75" rx="10" fill="rgba(14, 22, 40, 0.9)" stroke="#10b981" stroke-width="1.5" class="node-bg" />
        <text x="245" y="428" fill="#34d399" font-family="'IBM Plex Mono', monospace" font-size="10" font-weight="700">@ollama (zoth-micro)</text>
        <text x="245" y="448" fill="#ffffff" font-family="'Syne', sans-serif" font-size="12" font-weight="700">Offline Local Core</text>
        <text x="245" y="465" fill="#94a3b8" font-size="9">Deterministic Unit Mocks</text>
        <text x="385" y="430" font-size="12">🧠</text>
      </g>

      <!-- Connecting Lines from Stage 1 to Stage 2 (Shannon Arbiter) -->
      <path d="M 410 105 C 440 105, 440 280, 480 280" fill="none" stroke="#fbbf24" stroke-width="1.5" class="${pulseClassGold}" />
      <path d="M 410 215 C 440 215, 440 280, 480 280" fill="none" stroke="#00f0ff" stroke-width="1.5" class="${pulseClass}" />
      <path d="M 410 335 C 440 335, 440 280, 480 280" fill="none" stroke="#a855f7" stroke-width="1.5" class="${pulseClass}" />
      <path d="M 410 445 C 440 445, 440 280, 480 280" fill="none" stroke="#10b981" stroke-width="1.5" class="${pulseClass}" />

      <!-- Stage 2: Shannon Entropy Consensus Arbiter -->
      <g id="node-group-dag-shannon" class="svg-interactive-node ${selectedDiagramNodeId === 'dag-shannon' ? 'is-selected' : ''}" onclick="selectDiagramNode('dag-shannon')">
        <polygon points="530,220 590,280 530,340 470,280" fill="rgba(245, 158, 11, 0.2)" stroke="#fbbf24" stroke-width="2" class="node-gold-bg" filter="url(#dag-glow-gold)" />
        <text x="530" y="270" fill="#fbbf24" font-family="'IBM Plex Mono', monospace" font-size="10" font-weight="700" text-anchor="middle">SHANNON ARBITER</text>
        <text x="530" y="288" fill="#ffffff" font-family="'Syne', sans-serif" font-size="11" font-weight="700" text-anchor="middle">H(S) ≥ 0.80</text>
        <text x="530" y="304" fill="#a5f3fc" font-family="'IBM Plex Mono', monospace" font-size="8" text-anchor="middle">Token Overlap</text>
      </g>

      <!-- Connecting Lines to Stage 3 & 4 -->
      <path d="M 590 280 C 620 280, 620 180, 650 180" fill="none" stroke="#00f0ff" stroke-width="1.5" class="${pulseClass}" />
      <path d="M 590 280 C 620 280, 620 380, 650 380" fill="none" stroke="#fbbf24" stroke-width="1.5" class="${pulseClassGold}" />

      <!-- Stage 3: AST Syntax & CSP Validator -->
      <g id="node-group-dag-ast" class="svg-interactive-node ${selectedDiagramNodeId === 'dag-ast' ? 'is-selected' : ''}" onclick="selectDiagramNode('dag-ast')">
        <rect x="650" y="140" width="130" height="80" rx="10" fill="rgba(14, 22, 40, 0.9)" stroke="#00f0ff" stroke-width="1.5" class="node-bg" />
        <text x="665" y="163" fill="#00f0ff" font-family="'IBM Plex Mono', monospace" font-size="10" font-weight="700">STAGE 3</text>
        <text x="665" y="183" fill="#ffffff" font-family="'Syne', sans-serif" font-size="12" font-weight="700">AST &amp; CSP</text>
        <text x="665" y="202" fill="#94a3b8" font-size="9">WCAG 2.1 AA Linter</text>
        <text x="755" y="165" font-size="11">🛡️</text>
      </g>

      <!-- Stage 4: Merkle Task Sealer & Vault Gate -->
      <g id="node-group-dag-merkle" class="svg-interactive-node ${selectedDiagramNodeId === 'dag-merkle' ? 'is-selected' : ''}" onclick="selectDiagramNode('dag-merkle')">
        <rect x="650" y="340" width="130" height="80" rx="10" fill="rgba(14, 22, 40, 0.9)" stroke="#fbbf24" stroke-width="1.5" class="node-gold-bg" />
        <text x="665" y="363" fill="#fbbf24" font-family="'IBM Plex Mono', monospace" font-size="10" font-weight="700">STAGE 4</text>
        <text x="665" y="383" fill="#ffffff" font-family="'Syne', sans-serif" font-size="12" font-weight="700">Merkle Sealer</text>
        <text x="665" y="402" fill="#94a3b8" font-size="9">Argon2id Hash Notary</text>
        <text x="755" y="365" font-size="11">🔏</text>
      </g>

      <!-- Connecting Lines to Final Stage 5 -->
      <path d="M 780 180 C 800 180, 800 280, 820 280" fill="none" stroke="#00f0ff" stroke-width="1.5" class="${pulseClass}" />
      <path d="M 780 380 C 800 380, 800 280, 820 280" fill="none" stroke="#fbbf24" stroke-width="1.5" class="${pulseClassGold}" />

      <!-- Stage 5: Live Sovereign Deployment -->
      <g id="node-group-dag-release" class="svg-interactive-node ${selectedDiagramNodeId === 'dag-release' ? 'is-selected' : ''}" onclick="selectDiagramNode('dag-release')">
        <circle cx="850" cy="280" r="36" fill="rgba(0, 240, 255, 0.2)" stroke="#00f0ff" stroke-width="2" class="node-bg" filter="url(#dag-glow-cyan)" />
        <text x="850" y="275" font-size="18" text-anchor="middle">🚀</text>
        <text x="850" y="295" fill="#ffffff" font-family="'Syne', sans-serif" font-size="10" font-weight="700" text-anchor="middle">RELEASE</text>
      </g>
    </svg>
  `;
}

function renderSacredGeometrySVG() {
  return `
    <svg class="diagram-svg-root" viewBox="0 0 900 560" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="sacred-glow-gold" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="sacred-glow-cyan" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      <!-- Center (450, 280) Golden Ratio Concentric Rings -->
      <g class="sacred-spin-cw" opacity="0.35">
        <circle cx="450" cy="280" r="254" fill="none" stroke="#fbbf24" stroke-width="1" stroke-dasharray="6 8" />
        <circle cx="450" cy="280" r="157" fill="none" stroke="#00f0ff" stroke-width="1" stroke-dasharray="4 6" />
        <polygon points="450,26 670,153 670,407 450,534 230,407 230,153" fill="none" stroke="#fbbf24" stroke-width="0.8" />
      </g>

      <g class="sacred-spin-ccw" opacity="0.25">
        <circle cx="450" cy="280" r="190" fill="none" stroke="#38bdf8" stroke-width="1" stroke-dasharray="10 5" />
        <polygon points="450,90 615,185 615,375 450,470 285,375 285,185" fill="none" stroke="#a855f7" stroke-width="0.8" />
      </g>

      <!-- Metatron's Cube Lattice Interconnecting Energy Vectors -->
      <g stroke="rgba(0, 240, 255, 0.25)" stroke-width="1" class="sacred-pulse">
        <!-- Lines from Center (450, 280) to 6 Hexagon Vertices -->
        <line x1="450" y1="280" x2="450" y2="80" stroke="#fbbf24" stroke-width="1.5" />
        <line x1="450" y1="280" x2="623" y2="180" stroke="#00f0ff" />
        <line x1="450" y1="280" x2="623" y2="380" stroke="#fbbf24" />
        <line x1="450" y1="280" x2="450" y2="480" stroke="#00f0ff" />
        <line x1="450" y1="280" x2="277" y2="380" stroke="#fbbf24" />
        <line x1="450" y1="280" x2="277" y2="180" stroke="#00f0ff" />

        <!-- Perimeter Hexagon -->
        <line x1="450" y1="80" x2="623" y2="180" />
        <line x1="623" y1="180" x2="623" y2="380" />
        <line x1="623" y1="380" x2="450" y2="480" />
        <line x1="450" y1="480" x2="277" y2="380" />
        <line x1="277" y1="380" x2="277" y2="180" />
        <line x1="277" y1="180" x2="450" y2="80" />

        <!-- Inner Golden Triad -->
        <line x1="450" y1="195" x2="523" y2="322" stroke="rgba(245, 158, 11, 0.5)" />
        <line x1="523" y1="322" x2="377" y2="322" stroke="rgba(245, 158, 11, 0.5)" />
        <line x1="377" y1="322" x2="450" y2="195" stroke="rgba(245, 158, 11, 0.5)" />
      </g>

      <!-- Inner Triad Nodes -->
      <g id="node-group-geo-matrix" class="svg-interactive-node ${selectedDiagramNodeId === 'geo-matrix' ? 'is-selected' : ''}" onclick="selectDiagramNode('geo-matrix')">
        <circle cx="450" cy="195" r="22" fill="rgba(168, 85, 247, 0.25)" stroke="#c084fc" stroke-width="1.5" class="node-bg" />
        <text x="450" y="199" font-size="12" text-anchor="middle">🛠️</text>
      </g>

      <g id="node-group-geo-obsidian" class="svg-interactive-node ${selectedDiagramNodeId === 'geo-obsidian' ? 'is-selected' : ''}" onclick="selectDiagramNode('geo-obsidian')">
        <circle cx="523" cy="322" r="22" fill="rgba(56, 189, 248, 0.25)" stroke="#38bdf8" stroke-width="1.5" class="node-bg" />
        <text x="523" y="326" font-size="12" text-anchor="middle">📚</text>
      </g>

      <g id="node-group-geo-keyring" class="svg-interactive-node ${selectedDiagramNodeId === 'geo-keyring' ? 'is-selected' : ''}" onclick="selectDiagramNode('geo-keyring')">
        <circle cx="377" cy="322" r="22" fill="rgba(245, 158, 11, 0.25)" stroke="#fbbf24" stroke-width="1.5" class="node-gold-bg" />
        <text x="377" y="326" font-size="12" text-anchor="middle">🔐</text>
      </g>

      <!-- Center: Zoth Prime Core (0,0) -->
      <g id="node-group-geo-zoth" class="svg-interactive-node ${selectedDiagramNodeId === 'geo-zoth' ? 'is-selected' : ''}" onclick="selectDiagramNode('geo-zoth')">
        <circle cx="450" cy="280" r="38" fill="rgba(245, 158, 11, 0.25)" stroke="#fbbf24" stroke-width="2.5" class="node-gold-bg" filter="url(#sacred-glow-gold)" />
        <circle cx="450" cy="280" r="48" fill="none" stroke="#00f0ff" stroke-width="1" stroke-dasharray="4 4" />
        <text x="450" y="275" font-size="18" text-anchor="middle">⚡</text>
        <text x="450" y="293" fill="#ffffff" font-family="'Syne', sans-serif" font-size="9" font-weight="800" text-anchor="middle">ZOTH CORE</text>
      </g>

      <!-- Outer 6 Hexagon Pet Mascot Nodes -->
      <!-- 1. Crown: Azoth Sovereign Phoenix (Top) -->
      <g id="node-group-geo-azoth" class="svg-interactive-node ${selectedDiagramNodeId === 'geo-azoth' ? 'is-selected' : ''}" onclick="selectDiagramNode('geo-azoth')">
        <circle cx="450" cy="80" r="32" fill="rgba(245, 158, 11, 0.2)" stroke="#fbbf24" stroke-width="2" class="node-gold-bg" filter="url(#sacred-glow-gold)" />
        <text x="450" y="75" font-size="16" text-anchor="middle">🔮</text>
        <text x="450" y="94" fill="#fbbf24" font-family="'Syne', sans-serif" font-size="9" font-weight="700" text-anchor="middle">AZOTH</text>
      </g>

      <!-- 2. Kai Holographic Cat (Top Right 60°) -->
      <g id="node-group-geo-kai" class="svg-interactive-node ${selectedDiagramNodeId === 'geo-kai' ? 'is-selected' : ''}" onclick="selectDiagramNode('geo-kai')">
        <circle cx="623" cy="180" r="30" fill="rgba(0, 240, 255, 0.2)" stroke="#00f0ff" stroke-width="1.8" class="node-bg" filter="url(#sacred-glow-cyan)" />
        <text x="623" y="175" font-size="15" text-anchor="middle">🐱</text>
        <text x="623" y="193" fill="#00f0ff" font-family="'Syne', sans-serif" font-size="9" font-weight="700" text-anchor="middle">KAI</text>
      </g>

      <!-- 3. Draco Cyber Dragon (Bottom Right 120°) -->
      <g id="node-group-geo-draco" class="svg-interactive-node ${selectedDiagramNodeId === 'geo-draco' ? 'is-selected' : ''}" onclick="selectDiagramNode('geo-draco')">
        <circle cx="623" cy="380" r="30" fill="rgba(245, 158, 11, 0.2)" stroke="#fbbf24" stroke-width="1.8" class="node-gold-bg" />
        <text x="623" y="375" font-size="15" text-anchor="middle">🐉</text>
        <text x="623" y="393" fill="#fbbf24" font-family="'Syne', sans-serif" font-size="9" font-weight="700" text-anchor="middle">DRACO</text>
      </g>

      <!-- 4. Luna Lunar Fox (Bottom 180°) -->
      <g id="node-group-geo-luna" class="svg-interactive-node ${selectedDiagramNodeId === 'geo-luna' ? 'is-selected' : ''}" onclick="selectDiagramNode('geo-luna')">
        <circle cx="450" cy="480" r="30" fill="rgba(0, 240, 255, 0.2)" stroke="#00f0ff" stroke-width="1.8" class="node-bg" filter="url(#sacred-glow-cyan)" />
        <text x="450" y="475" font-size="15" text-anchor="middle">🦊</text>
        <text x="450" y="493" fill="#00f0ff" font-family="'Syne', sans-serif" font-size="9" font-weight="700" text-anchor="middle">LUNA</text>
      </g>

      <!-- 5. Zephyr Wind Falcon (Bottom Left 240°) -->
      <g id="node-group-geo-zephyr" class="svg-interactive-node ${selectedDiagramNodeId === 'geo-zephyr' ? 'is-selected' : ''}" onclick="selectDiagramNode('geo-zephyr')">
        <circle cx="277" cy="380" r="30" fill="rgba(245, 158, 11, 0.2)" stroke="#fbbf24" stroke-width="1.8" class="node-gold-bg" />
        <text x="277" y="375" font-size="15" text-anchor="middle">🦅</text>
        <text x="277" y="393" fill="#fbbf24" font-family="'Syne', sans-serif" font-size="9" font-weight="700" text-anchor="middle">ZEPHYR</text>
      </g>

      <!-- 6. Nyx Shadow Panther (Top Left 300°) -->
      <g id="node-group-geo-nyx" class="svg-interactive-node ${selectedDiagramNodeId === 'geo-nyx' ? 'is-selected' : ''}" onclick="selectDiagramNode('geo-nyx')">
        <circle cx="277" cy="180" r="30" fill="rgba(0, 240, 255, 0.2)" stroke="#00f0ff" stroke-width="1.8" class="node-bg" filter="url(#sacred-glow-cyan)" />
        <text x="277" y="175" font-size="15" text-anchor="middle">🐆</text>
        <text x="277" y="193" fill="#00f0ff" font-family="'Syne', sans-serif" font-size="9" font-weight="700" text-anchor="middle">NYX</text>
      </g>
    </svg>
  `;
}

function renderCurrentDiagram() {
  const mount = document.getElementById('diagram-svg-mount');
  if (!mount) return;

  if (currentDiagramMode === 'sovereign-airgap') {
    mount.innerHTML = renderSovereignAirgapSVG();
  } else if (currentDiagramMode === 'multi-agent-dag') {
    mount.innerHTML = renderMultiAgentDAGSVG();
  } else if (currentDiagramMode === 'sacred-geometry') {
    mount.innerHTML = renderSacredGeometrySVG();
  }
}

window.selectDiagramNode = function(nodeId) {
  const node = DIAGRAM_NODES_DATA[nodeId];
  if (!node) return;

  selectedDiagramNodeId = nodeId;
  if (node.freq) {
    playTone(node.freq, 'sine', 0.12, 0.12);
  }

  // Update DOM inspector
  document.getElementById('insp-badge').textContent = node.badge || node.layer.toUpperCase();
  document.getElementById('insp-title').textContent = node.title;
  document.getElementById('insp-subtitle').textContent = node.port;
  document.getElementById('insp-desc').textContent = node.desc;
  document.getElementById('insp-protocol').textContent = node.protocol;
  document.getElementById('insp-metric').textContent = node.metric;
  document.getElementById('insp-security').textContent = node.security;

  addInspectorLog(`Node selected: ${node.title} [${node.port}]`);

  // Re-render SVG to update active selection styling
  renderCurrentDiagram();
};

window.switchDiagramMode = function(mode) {
  currentDiagramMode = mode;
  playTone(550, 'sine', 0.08, 0.1);

  const tabs = document.querySelectorAll('.diagram-tab-btn');
  tabs.forEach(t => {
    const isActive = t.getAttribute('data-mode') === mode;
    t.classList.toggle('is-active', isActive);
    t.setAttribute('aria-selected', isActive ? 'true' : 'false');
  });

  const labelEl = document.getElementById('diagram-active-mode-label');
  if (mode === 'sovereign-airgap') {
    labelEl.textContent = 'Active Topology: 4-Tier Zero-Leak Airgap';
    selectDiagramNode('vault');
  } else if (mode === 'multi-agent-dag') {
    labelEl.textContent = 'Active Topology: Multi-Agent Consensus DAG';
    selectDiagramNode('dag-antigravity');
  } else if (mode === 'sacred-geometry') {
    labelEl.textContent = 'Active Topology: Sacred Geometry Metatron (Φ)';
    selectDiagramNode('geo-azoth');
  }

  renderCurrentDiagram();
};

function addInspectorLog(msg) {
  const logStream = document.getElementById('insp-log-stream');
  if (!logStream) return;

  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
  
  const entry = document.createElement('div');
  entry.className = 'inspector-log-entry';
  entry.innerHTML = `<span class="inspector-log-time">[${timeStr}]</span> <span>${msg}</span>`;
  logStream.appendChild(entry);
  logStream.scrollTop = logStream.scrollHeight;
}

window.triggerSwarmCycle = function() {
  if (isSwarmRunning) return;
  isSwarmRunning = true;

  if (currentDiagramMode !== 'multi-agent-dag') {
    switchDiagramMode('multi-agent-dag');
  }

  addInspectorLog("⚡ Initiating Multi-Agent Consensus Swarm Cycle...");
  playTone(440, 'triangle', 0.15, 0.15);

  const steps = [
    { id: 'dag-operator', text: "Operator requirement parsed into AST intent.", delay: 400, freq: 440 },
    { id: 'dag-antigravity', text: "@antigravity lead initialized AST invariant constraints.", delay: 900, freq: 554 },
    { id: 'dag-grok', text: "@grok synthesized 60 FPS shader physics engine.", delay: 1400, freq: 659 },
    { id: 'dag-hermes', text: "@hermes verified 47 deterministic tool contracts.", delay: 1900, freq: 493 },
    { id: 'dag-ollama', text: "@ollama (zoth-micro) verified offline fallback mock engine.", delay: 2400, freq: 392 },
    { id: 'dag-shannon', text: "Shannon Entropy Arbiter: H(S)=0.94 score (Consensus Passed).", delay: 3000, freq: 740 },
    { id: 'dag-ast', text: "AST Linter & CSP strictness verified with zero warnings.", delay: 3500, freq: 830 },
    { id: 'dag-merkle', text: "Merkle Task sealed with Argon2id cryptographic signature.", delay: 4000, freq: 880 },
    { id: 'dag-release', text: "🚀 Sovereign application deployed to production foundry!", delay: 4600, freq: 988 }
  ];

  steps.forEach(step => {
    setTimeout(() => {
      selectDiagramNode(step.id);
      addInspectorLog(step.text);
      if (step.freq) playTone(step.freq, 'sine', 0.18, 0.15);
    }, step.delay);
  });

  setTimeout(() => {
    isSwarmRunning = false;
    addInspectorLog("✅ Swarm cycle complete. All contracts verified.");
  }, 5000);
};

window.toggleLaserTelemetry = function() {
  laserTelemetryActive = !laserTelemetryActive;
  const btn = document.getElementById('btn-toggle-laser');
  const label = document.getElementById('label-laser-telemetry');
  if (btn) {
    btn.classList.toggle('active-laser', laserTelemetryActive);
  }
  if (label) {
    label.textContent = `Telemetry Pulse: ${laserTelemetryActive ? 'ON' : 'OFF'}`;
  }
  playTone(laserTelemetryActive ? 700 : 350, 'sine', 0.08, 0.1);
  renderCurrentDiagram();
};

// Initialize Everything
document.addEventListener('DOMContentLoaded', () => {
  initNeuralCanvas();

  // Set counts
  document.getElementById('count-all').textContent = BLUEPRINTS_DATA.length;
  document.getElementById('metric-total-blueprints').textContent = `${BLUEPRINTS_DATA.length}+`;

  renderBlueprints();
  renderComposerSlots();

  // Initialize System Architecture Diagram
  renderCurrentDiagram();
  selectDiagramNode('vault');

  // Diagram Tab Switchers
  const diagTabs = document.querySelectorAll('.diagram-tab-btn');
  diagTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const mode = tab.getAttribute('data-mode');
      if (mode) switchDiagramMode(mode);
    });
  });

  // Diagram Controls Bar
  const toggleLaserBtn = document.getElementById('btn-toggle-laser');
  if (toggleLaserBtn) toggleLaserBtn.addEventListener('click', toggleLaserTelemetry);

  const soundDiagramBtn = document.getElementById('btn-sound-diagram');
  const soundLabel = document.getElementById('label-sound-diagram');
  if (soundDiagramBtn) {
    soundDiagramBtn.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      if (soundLabel) {
        soundLabel.textContent = `Chimes: ${soundEnabled ? 'ON' : 'OFF'}`;
      }
      playTone(soundEnabled ? 660 : 330, 'sine', 0.08, 0.1);
    });
  }

  const triggerSwarmBtn = document.getElementById('btn-trigger-swarm');
  if (triggerSwarmBtn) triggerSwarmBtn.addEventListener('click', triggerSwarmCycle);

  const inspActionBtn = document.getElementById('insp-action-btn');
  if (inspActionBtn) {
    inspActionBtn.addEventListener('click', () => {
      const node = DIAGRAM_NODES_DATA[selectedDiagramNodeId];
      if (node) {
        addInspectorLog(`Probing ${node.title}... OK (Latency: 0.2ms)`);
        playTone(750, 'sine', 0.1, 0.12);
      }
    });
  }

  // Search input
  const searchInput = document.getElementById('blueprint-search');
  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderBlueprints();
  });

  // Hotkey / to search
  window.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement !== searchInput) {
      e.preventDefault();
      searchInput.focus();
    }
    if (e.key === 'Escape') {
      const modal = document.getElementById('blueprint-modal');
      if (modal && modal.open) modal.close();
    }
    if (e.key === 'm' || e.key === 'M') {
      if (document.activeElement.tagName !== 'INPUT') {
        soundEnabled = !soundEnabled;
        playTone(440, 'sine', 0.05, 0.1);
      }
    }
  });

  // Category filter pills
  const pills = document.querySelectorAll('.pill-btn');
  pills.forEach(p => {
    p.addEventListener('click', () => {
      pills.forEach(btn => {
        btn.classList.remove('is-active');
        btn.setAttribute('aria-selected', 'false');
      });
      p.classList.add('is-active');
      p.setAttribute('aria-selected', 'true');
      currentCategory = p.getAttribute('data-cat');
      playTone(500, 'sine', 0.04, 0.06);
      renderBlueprints();
    });
  });

  // Synthesize button
  document.getElementById('btn-synthesize').addEventListener('click', generateZothSpec);
  document.getElementById('btn-clear-composer').addEventListener('click', () => {
    composerSlots = [null, null, null];
    document.getElementById('composer-output-tray').classList.add('hidden');
    playTone(300, 'sine', 0.06, 0.08);
    renderComposerSlots();
  });

  // Copy Spec button
  document.getElementById('btn-copy-spec').addEventListener('click', () => {
    const code = document.getElementById('spec-code-block').textContent;
    navigator.clipboard.writeText(code);
    const copyBtn = document.getElementById('btn-copy-spec');
    copyBtn.innerHTML = '<span>Copied to Clipboard!</span>';
    playTone(880, 'sine', 0.08, 0.1);
    setTimeout(() => {
      copyBtn.innerHTML = '<span class="copy-text">Copy Prompt</span>';
    }, 2000);
  });

  // Modal Close
  document.getElementById('modal-close-btn').addEventListener('click', () => {
    document.getElementById('blueprint-modal').close();
  });
});

