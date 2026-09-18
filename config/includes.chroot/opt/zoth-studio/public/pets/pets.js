import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js";
import {
  createPetFigure,
  PET_SPECIES,
  petPortrait,
  loadPetTexture,
  fallbackPetTexture,
} from "./pet-models.js?v=20260819s";

const PETS = [
  {
    id: "kai",
    name: "Kai",
    domain: "build",
    role: "Workspace inspector",
    neon: petPortrait("kai"),
    blurb: "Kai prowls the workspace for broken imports, dead code paths, and sloppy diffs.",
    engage:
      "Engage Kai: audit the open workspace for type errors, dead exports, and high-risk files. Report a short fix list ranked by blast radius.",
    tags: ["review", "debug", "typescript"],
  },
  {
    id: "draco",
    name: "Draco",
    domain: "build",
    role: "Fusion compiler",
    neon: petPortrait("draco"),
    blurb: "Draco fuses multi-model outputs into one coherent plan.",
    engage:
      "Engage Draco: run a 3-model Fusion Arena on the current task. Synthesize agreements, flag conflicts, output one executable plan.",
    tags: ["fusion", "arena", "multi-model"],
  },
  {
    id: "ignis",
    name: "Ignis",
    domain: "build",
    role: "Refactor & ship",
    neon: petPortrait("ignis"),
    blurb: "Ignis burns dead weight: refactors, resurrected pipelines, green builds after chaos.",
    engage:
      "Engage Ignis: identify the smallest refactor that unblocks ship. Propose file-level changes and a safe order of operations.",
    tags: ["refactor", "ship", "ci"],
  },
  {
    id: "lycan",
    name: "Lycan",
    domain: "security",
    role: "OWASP sentinel",
    neon: petPortrait("lycan"),
    blurb: "Lycan hunts insecure defaults, missing headers, XSS traps, and auth gaps.",
    engage:
      "Engage Lycan: OWASP-oriented review of the current surface. List critical/high findings with fix suggestions, no exploit payloads.",
    tags: ["security", "owasp", "hardening"],
  },
  {
    id: "athena",
    name: "Athena",
    domain: "knowledge",
    role: "Knowledge & AEO",
    neon: petPortrait("athena"),
    blurb: "Athena keeps the vault honest: AEO blocks, schema, FAQ integrity, Obsidian links.",
    engage:
      "Engage Athena: improve AEO/SEO for the current page set. Add FAQ answers, schema opportunities, and internal linking notes.",
    tags: ["aeo", "seo", "vault"],
  },
  {
    id: "kitsune",
    name: "Kitsune",
    domain: "build",
    role: "Taste & motion",
    neon: petPortrait("kitsune"),
    blurb: "Kitsune owns motion, type, and taste when UI looks AI-generic.",
    engage:
      "Engage Kitsune: redesign the current UI surface for premium dark cyberpunk taste. Preserve content; improve type, spacing, and motion.",
    tags: ["ui", "motion", "brand"],
  },
  {
    id: "pixel-neko",
    name: "Pixel-Neko",
    domain: "ops",
    role: "Tool indexer",
    neon: petPortrait("pixel-neko"),
    blurb: "Pixel-Neko indexes the fleet so tools stay searchable.",
    engage:
      "Engage Pixel-Neko: scan project folders and propose registry tags, categories, and missing README metadata.",
    tags: ["registry", "index", "drive"],
  },
  {
    id: "pixel-shiba",
    name: "Pixel-Shiba",
    domain: "ops",
    role: "Vault guardian",
    neon: petPortrait("pixel-shiba"),
    blurb: "Pixel-Shiba guards keys and storage boundaries.",
    engage:
      "Engage Pixel-Shiba: audit env usage and secret handling. Recommend vault layout and what must never leave local disk.",
    tags: ["keys", "storage", "byok"],
  },
  {
    id: "radical-minion",
    name: "Radical Minion",
    domain: "autonomy",
    role: "Hermes partner",
    neon: petPortrait("radical-minion"),
    blurb: "Radical Minion is the Hermes execution partner for multi-step autonomous runs.",
    engage:
      "Engage Radical Minion: draft a Hermes multi-step playbook for the current goal with checkpoints a human can approve.",
    tags: ["hermes", "autonomy", "playbook"],
  },
  {
    id: "glitchcat",
    name: "Glitchcat",
    domain: "build",
    role: "RGB glitch cat",
    neon: petPortrait("glitchcat"),
    blurb: "Glitchcat breaks stale chrome so the composition can land.",
    engage: "Engage Glitchcat: find the most generic UI block and restyle it without changing the copy.",
    tags: ["glitch", "ui", "chaos"],
  },
  {
    id: "circuit-pup",
    name: "Circuit Pup",
    domain: "ops",
    role: "LED circuit dog",
    neon: petPortrait("circuit-pup"),
    blurb: "Circuit Pup sniffs live ports, daemons, and missing CLIs.",
    engage: "Engage Circuit Pup: report which connectors and local ports are actually up.",
    tags: ["ports", "ops", "health"],
  },
  {
    id: "terminal-ghost",
    name: "Terminal Ghost",
    domain: "ops",
    role: "Phosphor spirit",
    neon: petPortrait("terminal-ghost"),
    blurb: "Terminal Ghost haunts agent feeds until the log is honest.",
    engage: "Engage Terminal Ghost: read the latest terminal feed and summarize what actually happened.",
    tags: ["terminal", "logs", "trace"],
  },
  {
    id: "savage-codex",
    name: "Savage Codex",
    domain: "security",
    role: "Hacker familiar",
    neon: petPortrait("savage-codex"),
    blurb: "Savage Codex reads diffs like a threat model. No payloads.",
    engage: "Engage Savage Codex: review the current diff for auth, secret, and XSS gaps. No exploit code.",
    tags: ["review", "security", "diff"],
  },
  {
    id: "ai-workbot",
    name: "AI Workbot",
    domain: "autonomy",
    role: "Task robot",
    neon: petPortrait("ai-workbot"),
    blurb: "Workbot turns a chat request into a claimed checklist.",
    engage: "Engage AI Workbot: break the current goal into claimed steps and post them to the swarm board.",
    tags: ["tasks", "swarm", "checklist"],
  },
  {
    id: "binary",
    name: "Binary",
    domain: "knowledge",
    role: "Data spirit",
    neon: petPortrait("binary"),
    blurb: "Binary keeps schema, llms.txt, and connector bits honest.",
    engage: "Engage Binary: check connector status and name the next missing key or CLI.",
    tags: ["data", "schema", "aeo"],
  },
  {
    id: "aquila",
    name: "Aquila",
    domain: "edge",
    role: "Global Edge Dispatcher",
    neon: petPortrait("aquila"),
    blurb: "Aquila delivers sub-millisecond API routing and high-speed multi-model edge dispatch.",
    engage: "Engage Aquila: optimize routing latency across local and edge AI models.",
    tags: ["edge", "routing", "latency", "dispatch"],
  },
  {
    id: "leviathan",
    name: "Leviathan",
    domain: "knowledge",
    role: "Deep Tensor & Vector Memory",
    neon: petPortrait("leviathan"),
    blurb: "Leviathan indexes dense multidimensional embeddings and long-context RAG memory.",
    engage: "Engage Leviathan: perform dense vector search and long-context retrieval over project docs.",
    tags: ["rag", "vectors", "embeddings", "memory"],
  },
  {
    id: "onyx",
    name: "Onyx",
    domain: "security",
    role: "Red-Team Exploit Predator",
    neon: petPortrait("onyx"),
    blurb: "Onyx runs stealth penetration audits, SubSweep recon, and zero-day defense verification.",
    engage: "Engage Onyx: execute a stealth security scan and audit network perimeter defenses.",
    tags: ["security", "redteam", "kernel", "osint"],
  },
  {
    id: "chronos",
    name: "Chronos",
    domain: "build",
    role: "Temporal DAG & Git Navigator",
    neon: petPortrait("chronos"),
    blurb: "Chronos traverses DAG execution graphs, multiversal time-travel diffs, and rollback checkpoints.",
    engage: "Engage Chronos: build a topological DAG execution plan with rollback safety checkpoints.",
    tags: ["dag", "git", "workflow", "versioning"],
  },
  {
    id: "aether",
    name: "Aether",
    domain: "autonomy",
    role: "Swarm Overlord & Conductor",
    neon: petPortrait("aether"),
    blurb: "Aether orchestrates asynchronous consensus across Antigravity, Grok, Hermes, and Ollama.",
    engage: "Engage Aether: coordinate multi-agent swarm consensus across all active nodes.",
    tags: ["swarm", "consensus", "orchestration", "bus"],
  },
  {
    id: "kraken",
    name: "Kraken",
    domain: "ops",
    role: "Deep Packet Sniffer & OSINT",
    neon: petPortrait("kraken"),
    blurb: "Kraken wraps tentacles around raw packet streams, DNS telemetry, and network topology.",
    engage: "Engage Kraken: inspect local port bindings and live network traffic streams.",
    tags: ["network", "dns", "osint", "packets"],
  },
  {
    id: "scorpius",
    name: "Scorpius",
    domain: "security",
    role: "Zero-Day Penetration Tester",
    neon: petPortrait("scorpius"),
    blurb: "Scorpius delivers precision strikes against memory corruption, race conditions, and auth bypasses.",
    engage: "Engage Scorpius: test application endpoints against race conditions and logic flaws.",
    tags: ["fuzzing", "penetration", "zero-day", "security"],
  },
  {
    id: "azoth",
    name: "Azoth Prime",
    domain: "autonomy",
    role: "Master Antigravity Architect",
    neon: petPortrait("azoth"),
    blurb: "Azoth synthesizes autonomous codebase directives, terminal execution, and alchemical plans.",
    engage: "Engage Azoth: plan and execute complex multi-step codebase transformations with full architectural reasoning.",
    tags: ["antigravity", "architect", "sovereign", "magus"],
  },
  {
    id: "ghostbyte",
    name: "Ghostbyte",
    domain: "autonomy",
    role: "Phosphor Terminal Daemon",
    neon: petPortrait("ghostbyte"),
    blurb: "Ghostbyte haunts terminal feeds, WebGPU shaders, and unhandled signal rejections.",
    engage: "Engage Ghostbyte: trace loopback process feeds and verify WebGL/WebGPU hardware acceleration.",
    tags: ["terminal", "daemon", "phosphor", "webgpu"],
  },
];

const $ = (id) => document.getElementById(id);
const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isMobile = () => window.innerWidth < 860;

let filter = "all";
let selectedId = null;
let hoverId = null;
const figures = [];
const packs = new Map();

const inspect = $("inspect");
const tip = $("tip");

function accentOf(pet) {
  return new THREE.Color(PET_SPECIES[pet.id]?.vibeColor || "#c4a574");
}

async function loadTex(url, fallbackHex) {
  const tex = await loadPetTexture(THREE, url);
  return tex || fallbackPetTexture(THREE, fallbackHex || "#16120e");
}

function restPose(i, n) {
  const mobile = isMobile();
  if (n <= 9) {
    const t = n === 1 ? 0.5 : i / (n - 1);
    const a = THREE.MathUtils.degToRad(-68 + t * 136);
    const r = mobile ? 3.4 : 4.35;
    return {
      x: Math.sin(a) * r,
      y: 0,
      z: -Math.cos(a) * r * 0.42,
      rotY: -a * 0.55,
      scale: 1,
    };
  }
  const backN = Math.ceil(n / 2);
  const front = i >= backN;
  const rowI = front ? i - backN : i;
  const rowN = front ? n - backN : backN;
  const t = rowN === 1 ? 0.5 : rowI / (rowN - 1);
  const span = front ? 118 : 156;
  const a = THREE.MathUtils.degToRad(-span / 2 + t * span);
  const r = mobile ? (front ? 3.2 : 4.6) : front ? 4.1 : 5.9;
  return {
    x: Math.sin(a) * r,
    y: front ? 0 : 0.06,
    z: -Math.cos(a) * r * 0.5 - (front ? 0 : 1.2),
    rotY: -a * 0.48,
    scale: front ? 0.9 : 0.78,
  };
}

function makeFigure(pet, tex) {
  const g = new THREE.Group();
  g.userData.pet = pet;
  const accent = accentOf(pet);

  const figure = createPetFigure(THREE, {
    id: pet.id,
    color: accent.getHex(),
    texture: tex,
    style: "realistic",
    withAura: false,
  });
  g.add(figure.group);
  const body = figure.hitMeshes[0] || figure.group;
  body.userData.hit = true;
  g.userData.figure = figure;

  const glow = new THREE.Mesh(
    new THREE.PlaneGeometry(1.85, 1.85),
    new THREE.MeshBasicMaterial({
      map: tex,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.06,
    })
  );
  glow.position.set(0, 1.18, -0.26);
  g.add(glow);

  const pedestal = new THREE.Mesh(
    new THREE.TorusGeometry(0.36, 0.012, 8, 36),
    new THREE.MeshBasicMaterial({ color: accent, transparent: true, opacity: 0.28 })
  );
  pedestal.rotation.x = Math.PI / 2;
  pedestal.position.y = 0.02;
  g.add(pedestal);

  const disc = new THREE.Mesh(
    new THREE.CircleGeometry(0.32, 24),
    new THREE.MeshBasicMaterial({
      color: 0xc4a574,
      transparent: true,
      opacity: 0.05,
      side: THREE.DoubleSide,
    })
  );
  disc.rotation.x = -Math.PI / 2;
  disc.position.y = 0.01;
  g.add(disc);

  const light = new THREE.PointLight(accent, 0.28, 2.6, 2);
  light.position.set(0, 1.25, 0.4);
  g.add(light);

  g.userData.body = body;
  g.userData.glow = glow;
  g.userData.light = light;
  return g;
}

function renderHangarGrid() {
  const root = $("hangar-roster");
  if (!root) return;
  root.replaceChildren();
  visiblePets().forEach((pet) => {
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.type = "button";
    btn.innerHTML = `<img src="${pet.neon}" alt="" /><b>${pet.name}</b><span>${pet.role}</span>`;
    btn.addEventListener("click", () => openInspect(pet));
    li.append(btn);
    root.append(li);
  });
}

const useGL = !isMobile();
const canvas = $("gl");
const renderer = useGL
  ? new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
      stencil: false,
    })
  : null;
if (renderer) {
  renderer.setClearColor(0x07060a, 1);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.setSize(window.innerWidth || 1440, window.innerHeight || 900, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NoToneMapping;
}

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x07060a, 0.038);

const camera = new THREE.PerspectiveCamera(36, 1, 0.2, 60);
const camRest = new THREE.Vector3(0, 1.7, isMobile() ? 10.2 : 9.4);
const lookRest = new THREE.Vector3(0, 0.78, 0);
camera.position.copy(camRest);
camera.lookAt(lookRest);

scene.add(new THREE.AmbientLight(0x1c1814, 0.62));
const key = new THREE.PointLight(0xc4a574, 4.2, 18);
key.position.set(-2.6, 4.2, 5.2);
scene.add(key);
const fill = new THREE.PointLight(0x5b4a78, 1.6, 14);
fill.position.set(3.6, 1.8, 2.8);
scene.add(fill);

const hullMat = new THREE.MeshBasicMaterial({ color: 0x0a090c });
const hull = new THREE.Mesh(new THREE.PlaneGeometry(30, 16), hullMat);
hull.position.set(0, 1.4, -7.4);
scene.add(hull);

const floor = new THREE.Mesh(
  new THREE.CircleGeometry(8.2, 64),
  new THREE.MeshBasicMaterial({
    color: 0x08070a,
    transparent: true,
    opacity: 0.62,
  })
);
floor.rotation.x = -Math.PI / 2;
scene.add(floor);

const ring = new THREE.Mesh(
  new THREE.RingGeometry(5.15, 5.2, 80),
  new THREE.MeshBasicMaterial({
    color: 0xc4a574,
    transparent: true,
    opacity: 0.14,
    side: THREE.DoubleSide,
  })
);
ring.rotation.x = -Math.PI / 2;
ring.position.y = 0.02;
scene.add(ring);

const sparkN = 48;
const sparkPos = new Float32Array(sparkN * 3);
for (let i = 0; i < sparkN; i++) {
  sparkPos[i * 3] = (Math.random() - 0.5) * 12;
  sparkPos[i * 3 + 1] = Math.random() * 3.6;
  sparkPos[i * 3 + 2] = (Math.random() - 0.5) * 8;
}
const sparks = new THREE.Points(
  new THREE.BufferGeometry().setAttribute("position", new THREE.BufferAttribute(sparkPos, 3)),
  new THREE.PointsMaterial({
    color: 0xd8c6a0,
    size: 0.022,
    transparent: true,
    opacity: 0.28,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })
);
scene.add(sparks);

const hangar = new THREE.Group();
scene.add(hangar);

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2(-10, -10);
let pointerNdc = { x: 0, y: 0 };

function visiblePets() {
  return PETS.filter((p) => filter === "all" || p.domain === filter);
}

function layoutArc() {
  const vis = new Set(visiblePets().map((p) => p.id));
  const shown = figures.filter((f) => vis.has(f.userData.pet.id));
  shown.forEach((f, i) => {
    f.userData.rest = restPose(i, shown.length);
    f.visible = true;
  });
  figures.forEach((f) => {
    if (!vis.has(f.userData.pet.id)) {
      f.visible = false;
      f.userData.rest = { x: 0, y: -4, z: 0, rotY: 0, scale: 1 };
    }
  });
  $("count").textContent = String(shown.length);
  camRest.z = shown.length > 9 ? (isMobile() ? 10.4 : 9.6) : isMobile() ? 8.4 : 7.6;
}

function renderCats() {
  const domains = ["all", "build", "security", "knowledge", "ops", "autonomy"];
  const labels = {
    all: `All ${PETS.length}`,
    build: "Build",
    security: "Security",
    knowledge: "Knowledge",
    ops: "Ops",
    autonomy: "Autonomy",
  };
  $("cats").replaceChildren();
  domains.forEach((id) => {
    const b = document.createElement("button");
    b.type = "button";
    b.setAttribute("role", "tab");
    b.setAttribute("aria-selected", filter === id ? "true" : "false");
    b.textContent = labels[id];
    b.classList.toggle("is-on", filter === id);
    b.addEventListener("click", () => {
      filter = id;
      if (selectedId && !visiblePets().some((p) => p.id === selectedId)) closeInspect();
      renderCats();
      renderHangarGrid();
      if (renderer) layoutArc();
    });
    $("cats").append(b);
  });
}

function applyPack(pet, pack) {
  if (!pack) return pet;
  return {
    ...pet,
    health: pack.health,
    doc_count: pack.doc_count,
    topics: pack.topics,
    healed_at: pack.healed_at,
  };
}

function setPackSource(label, live) {
  const el = document.querySelector(".src");
  if (!el) return;
  el.textContent = label;
  el.classList.toggle("is-live", !!live);
}

async function loadKnowledge() {
  let fromSnap = false;
  try {
    const snap = await fetch("/pets/packs.json", { cache: "no-store" });
    if (snap.ok) {
      const data = await snap.json();
      (data.pets || []).forEach((p) => packs.set(p.id, p));
      fromSnap = packs.size > 0;
      if (fromSnap) setPackSource("snapshot", false);
    }
  } catch {
    /* snapshot optional */
  }
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 600);
    const live = await fetch("/api/pets", { cache: "no-store", signal: ctrl.signal });
    clearTimeout(t);
    if (live.ok) {
      const data = await live.json();
      (data.pets || []).forEach((p) => packs.set(p.id, p));
      setPackSource("live deck", true);
      return;
    }
  } catch {
    /* studio optional */
  }
  if (!fromSnap) setPackSource("no packs", false);
}

function openInspect(pet) {
  selectedId = pet.id;
  const view = applyPack(pet, packs.get(pet.id));
  $("inspect-cat").textContent = `Companion · ${view.domain}`;
  $("inspect-name").textContent = view.name;
  $("inspect-role").textContent = view.role;
  const portrait = $("inspect-portrait");
  if (portrait) {
    portrait.src = view.neon || petPortrait(view.id);
    portrait.alt = view.name;
  }
  $("inspect-desc").textContent = view.blurb;
  $("inspect-engage").textContent = view.engage;
  $("inspect-tags").replaceChildren(
    ...view.tags.map((t) => {
      const s = document.createElement("span");
      s.textContent = t;
      return s;
    })
  );
  const health = view.health || {};
  const healthEl = $("inspect-health");
  if (healthEl) {
    const score = health.score != null ? `${Math.round(health.score * 100)}%` : "—";
    const when = view.healed_at ? ` · healed ${view.healed_at}` : "";
    healthEl.textContent = `${health.status || "snapshot"} ${score} · ${view.doc_count || 0} notes${when}`;
  }
  const docsEl = $("inspect-docs");
  if (docsEl) {
    const topics = view.topics || [];
    docsEl.replaceChildren(
      ...topics.map((title) => {
        const li = document.createElement("li");
        li.textContent = title;
        return li;
      })
    );
  }
  inspect.hidden = false;
  if (location.hash !== `#${pet.id}`) history.replaceState(null, "", `#${pet.id}`);
}

function closeInspect() {
  selectedId = null;
  inspect.hidden = true;
  if (location.hash) history.replaceState(null, "", location.pathname);
}

function hitTest(x, y) {
  if (!renderer || !canvas) return null;
  const rect = canvas.getBoundingClientRect();
  pointer.x = ((x - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((y - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const meshes = figures.filter((f) => f.visible);
  const hits = raycaster.intersectObjects(meshes, true);
  if (!hits.length) return null;
  let obj = hits[0].object;
  while (obj && !obj.userData.pet) obj = obj.parent;
  return obj?.userData.pet || null;
}

$("inspect-close").addEventListener("click", closeInspect);
$("inspect-engage-btn")?.addEventListener("click", () => {
  const id = selectedId;
  if (!id) return;
  try {
    window.parent?.postMessage({ type: "zoth-engage-pet", id }, "*");
  } catch {}
  window.open(`/?engage=${encodeURIComponent(id)}`, "_blank", "noopener");
});
$("inspect-copy").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText($("inspect-engage").textContent || "");
    $("inspect-copy").textContent = "Copied";
    setTimeout(() => {
      $("inspect-copy").textContent = "Copy engage prompt";
    }, 1400);
  } catch {
    $("inspect-copy").textContent = "Copy failed";
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeInspect();
  if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
  const list = visiblePets();
  if (!list.length) return;
  const idx = Math.max(0, list.findIndex((p) => p.id === selectedId));
  const next = e.key === "ArrowRight" ? (idx + 1) % list.length : (idx - 1 + list.length) % list.length;
  openInspect(list[next]);
});

window.addEventListener(
  "pointermove",
  (e) => {
    if (e.target.closest(".hud, .inspect")) {
      tip.hidden = true;
      hoverId = null;
      return;
    }
    pointerNdc.x = e.clientX / window.innerWidth - 0.5;
    pointerNdc.y = e.clientY / window.innerHeight - 0.5;
    const hit = hitTest(e.clientX, e.clientY);
    if (hit) {
      hoverId = hit.id;
      tip.hidden = false;
      tip.innerHTML = `<span>${hit.domain}</span><b>${hit.name}</b>`;
      tip.style.left = `${e.clientX}px`;
      tip.style.top = `${e.clientY}px`;
      canvas.style.cursor = "pointer";
    } else {
      hoverId = null;
      tip.hidden = true;
      canvas.style.cursor = "default";
    }
  },
  { passive: true }
);

window.addEventListener("click", (e) => {
  if (e.target.closest(".hud, .inspect")) return;
  const hit = hitTest(e.clientX, e.clientY);
  if (hit) openInspect(hit);
  else closeInspect();
});

function resize() {
  if (!renderer) return;
  const w = window.innerWidth;
  const h = window.innerHeight;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, w < 800 ? 1.15 : 1.5));
  renderer.setSize(w, h, false);
  camera.aspect = w / Math.max(h, 1);
  camera.updateProjectionMatrix();
  const n = visiblePets().length || PETS.length;
  camRest.z = n > 9 ? (w < 800 ? 10.4 : 9.6) : w < 800 ? 8.4 : 7.6;
}
window.addEventListener("resize", resize, { passive: true });

let t0 = performance.now();
function tick(now) {
  if (!renderer) return;
  const t = (now - t0) / 1000;
  figures.forEach((f) => {
    const rest = f.userData.rest;
    const hot = selectedId === f.userData.pet.id;
    const hover = hoverId === f.userData.pet.id;
    const tx = hot ? 0 : rest.x;
    const ty = hot ? 0.18 : rest.y + (hover ? 0.08 : 0);
    const tz = hot ? 1.35 : rest.z;
    const ry = hot ? 0 : rest.rotY;
    const sc = (hot ? 1.14 : hover ? 1.04 : 1) * (rest.scale || 1);
    f.position.x += (tx - f.position.x) * 0.08;
    f.position.y += (ty - f.position.y) * 0.08;
    f.position.z += (tz - f.position.z) * 0.08;
    f.rotation.y += (ry - f.rotation.y) * 0.08;
    const s = f.scale.x + (sc - f.scale.x) * 0.08;
    f.scale.setScalar(s);
    if (!reduce) f.position.y += Math.sin(t * 0.7 + rest.x) * 0.0012;
    f.userData.light.intensity = hot ? 0.7 : hover ? 0.42 : 0.22;
  });
  if (!reduce) {
    camera.position.x += (camRest.x + pointerNdc.x * 0.45 - camera.position.x) * 0.04;
    camera.position.y += (camRest.y - pointerNdc.y * 0.22 - camera.position.y) * 0.04;
    camera.position.z += (camRest.z - camera.position.z) * 0.06;
    camera.lookAt(lookRest);
    sparks.rotation.y = t * 0.01;
    ring.rotation.z = t * 0.012;
  }
  renderer.render(scene, camera);
  requestAnimationFrame(tick);
}

let revealed = false;
function revealWall() {
  if (revealed) return;
  revealed = true;
  requestAnimationFrame(() => {
    renderer.render(scene, camera);
    requestAnimationFrame(() => $("veil")?.classList.add("is-off"));
  });
}

async function boot() {
  renderCats();
  renderHangarGrid();
  await loadKnowledge();
  if (!renderer) {
    document.body.classList.add("hangar-flat");
    $("veil")?.classList.add("is-off");
    return;
  }
  resize();
  renderer.render(scene, camera);

  const hullTex = await loadTex("/assets/media/hero-pet-roster.jpg");
  if (hullTex) {
    renderer.initTexture(hullTex);
    hullMat.map = hullTex;
    hullMat.color.set(0x2a3340);
    hullMat.needsUpdate = true;
  }

  const textures = await Promise.all(
    PETS.map((p) => loadTex(p.neon, PET_SPECIES[p.id]?.vibeColor || "#16120e"))
  );
  PETS.forEach((pet, i) => {
    const tex = textures[i];
    if (tex) renderer.initTexture(tex);
    const fig = makeFigure(pet, tex);
    fig.userData.rest = restPose(i, PETS.length);
    fig.position.set(fig.userData.rest.x, fig.userData.rest.y, fig.userData.rest.z);
    fig.rotation.y = fig.userData.rest.rotY;
    fig.scale.setScalar(fig.userData.rest.scale || 1);
    hangar.add(fig);
    figures.push(fig);
  });
  layoutArc();

  const applyHash = () => {
    const want = (location.hash || "").replace("#", "").toLowerCase();
    if (!want) return;
    const found = PETS.find((p) => p.id === want || p.name.toLowerCase() === want);
    if (found) {
      filter = "all";
      renderCats();
      layoutArc();
      openInspect(found);
    }
  };
  window.addEventListener("hashchange", applyHash);
  applyHash();

  requestAnimationFrame(tick);
  setTimeout(revealWall, 240);
}

boot();
