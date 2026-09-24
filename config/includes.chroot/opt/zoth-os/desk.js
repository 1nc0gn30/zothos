const stage = document.getElementById("stage");
const q = document.getElementById("q");
const toast = document.getElementById("toast");
let view = "desk";
let board = { items: [], rooms: [] };
let pulse = null;
let journal = [];
let gpuLocal = null;
let painted = false;

let ipcRenderer = null;
try {
  ipcRenderer = require('electron').ipcRenderer;
} catch (e) {}

async function apiFetch(endpoint, method = 'GET', body = null) {
  if (ipcRenderer) {
    try {
      return await ipcRenderer.invoke('zoth-api', { endpoint, method, body });
    } catch (e) {}
  }
  const opts = { method };
  if (body) {
    opts.headers = { 'Content-Type': 'application/json' };
    opts.body = JSON.stringify(body);
  }
  const res = await fetch(endpoint, opts);
  return await res.json();
}

const titles = {
  desk: "What is actually running on this machine.",
  arms: "Kali and Parrot tools. Open launches the program. Install only runs a known package.",
  mind: "Agent harnesses on the path, or one install away.",
  chip: "Local models, the resident watcher, and this window's WebGPU adapter.",
  hub: "Zoth Studio's real hub, served from the copy on disk.",
  ops: "Reality profiles, the install journal, and the doctor.",
};

function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, (ch) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[ch]));
}

function fmtRate(n) {
  if (n > 1024 * 1024) return (n / 1024 / 1024).toFixed(1) + " MB/s";
  if (n > 1024) return Math.round(n / 1024) + " kB/s";
  return Math.round(n) + " B/s";
}

function fmtUptime(sec) {
  const d = Math.floor(sec / 86400);
  const h = Math.floor((sec % 86400) / 3600);
  const m = Math.floor((sec % 3600) / 60);
  return d ? `${d}d ${h}h` : `${h}h ${m}m`;
}

function showToast(text) {
  toast.textContent = text;
  toast.classList.add("show");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove("show"), 3200);
}

async function act(op, id) {
  const data = await apiFetch("/api/act", "POST", { op, id });
  showToast(data.message || data.error || "Done");
  board = await apiFetch("/api/board");
  await refreshJournal();
  render();
}

function row(item) {
  const ready = item.installed;
  const install = item.install;
  const kind = install ? install.kind : "none";
  const open = ready
    ? `<button class="primary" data-act="open" data-id="${esc(item.id)}">Open</button>`
    : "";
  let setup = "";
  if (!ready && kind === "apt") setup = `<button data-act="install" data-id="${esc(item.id)}">Install</button>`;
  if (!ready && (kind === "pip" || kind === "npm")) setup = `<button data-act="install" data-id="${esc(item.id)}">Install</button>`;
  if (!ready && kind === "hint") setup = `<button data-act="install" data-id="${esc(item.id)}">How</button>`;
  return `<div class="row" title="${esc(item.path || item.blurb)}">
    <i class="dot ${ready ? "on" : ""}"></i>
    <div class="name">${esc(item.name)}</div>
    <div class="blurb">${esc(item.blurb)}</div>
    <div class="actions">${open}${setup}</div>
  </div>`;
}

function grouped(items) {
  const groups = [];
  for (const item of items) {
    let bucket = groups.find((g) => g.id === item.group);
    if (!bucket) {
      bucket = { id: item.group, label: item.group_label, items: [] };
      groups.push(bucket);
    }
    bucket.items.push(item);
  }
  if (!groups.length) return `<p class="empty">Nothing matches.</p>`;
  return groups.map((g) => `<section class="group"><h2>${esc(g.label)}</h2>${g.items.map(row).join("")}</section>`).join("");
}

function matches(item) {
  const needle = q.value.trim().toLowerCase();
  if (!needle) return true;
  return [item.name, item.blurb, item.group, item.path, ...(item.bins || [])].join(" ").toLowerCase().includes(needle);
}

function renderDesk() {
  const p = pulse;
  const listeners = (p.listeners || []).map((l) => `<div class="chip"><b>:${l.port}</b><em>${esc(l.name)}</em></div>`).join("") || `<p class="note">No known services are listening.</p>`;
  const resident = (p.models || []).filter((m) => m.resident);
  const sentinel = p.sentinel || {};
  const webgpu = p.webgpu || {};
  const counts = p.counts || { ready: 0, mind: 0, missing: 0 };
  const watch = resident.length
    ? resident.map((m) => `${m.name}`).join(", ")
    : (sentinel.model || "none yet");
  const gpus = (p.gpus || []).map((g) => `${g.vendor} ${g.name}${g.driver ? " · " + g.driver : ""}`).join(" / ") || "No display controller reported";
  return `<div class="split">
    <div>
      <section class="group">
        <h2>Listeners</h2>
        <div class="chips">${listeners}</div>
      </section>
      ${grouped((board.items || []).filter((i) => i.installed && ["desk", "mind", "silicon"].includes(i.group)).slice(0, 8))}
    </div>
    <aside class="panel">
      <h2>Watcher</h2>
      <div class="kv"><span>Model</span><div>${esc(watch)}</div></div>
      <div class="kv"><span>State</span><div>${esc(sentinel.status || "idle")}${sentinel.error ? " — " + esc(sentinel.error) : ""}</div></div>
      <div class="kv"><span>GPU</span><div>${esc(gpus)}</div></div>
      <div class="kv"><span>WebGPU</span><div>${esc(webgpu.name || webgpu.note || "probe on Chip")}</div></div>
      <div class="kv"><span>Uptime</span><div>${esc(fmtUptime(p.uptime_s || 0))}</div></div>
      <div class="kv"><span>Ready</span><div>${counts.ready} tools · ${counts.mind} harnesses</div></div>
      <p><button class="text-btn primary" data-act="arm">Keep the micro model resident</button></p>
    </aside>
  </div>`;
}

function renderChip() {
  const models = pulse.models || [];
  const local = models.filter((m) => m.local);
  const remote = models.filter((m) => !m.local);
  const list = (rows) => rows.length ? rows.map((m) => `<div class="row">
      <i class="dot ${m.resident ? "gold" : "on"}"></i>
      <div class="name">${esc(m.name)}</div>
      <div class="blurb">${m.resident ? "Resident · " : ""}${esc(m.params)} ${esc(m.quant)} · ${m.size_gb} GB</div>
      <div class="actions">${m.local && m.size_gb < 2.2 && !m.resident ? `<button class="primary" data-act="arm">Warm</button>` : ""}</div>
    </div>`).join("") : `<p class="empty">Ollama has no models in this list.</p>`;
  const gpu = gpuLocal || pulse.webgpu || {};
  return `<div class="split">
    <div>
      <section class="group"><h2>On this machine</h2>${list(local)}</section>
      <section class="group"><h2>Remote names</h2>${list(remote)}</section>
    </div>
    <aside class="panel">
      <h2>This window</h2>
      <p class="note">A short compute shader runs on the GPU exposed to the browser. It does not download a model.</p>
      <div class="gpu-box">
        <strong>${esc(gpu.name || "Not probed")}</strong>
        <p class="note">${gpu.ok ? `${gpu.features} features · ${Number(gpu.ms).toFixed(1)} ms` : esc(gpu.note || "")}</p>
      </div>
      <p><button class="text-btn primary" id="probe">Probe WebGPU</button></p>
      <div class="kv"><span>Sentinel</span><div>${esc(pulse.sentinel.status)} ${esc(pulse.sentinel.model)}</div></div>
    </aside>
  </div>`;
}

function renderHub() {
  const rooms = (board.rooms || []).map((r) => `<button class="room" data-act="room" data-id="${esc(r.path)}">${esc(r.name)}</button>`).join("");
  return `<div class="panel">
    <h2>Studio</h2>
    <p class="note">${pulse.studio.present ? "The hub files are on disk. A room opens the real public site, not the old racer page." : "The Studio public folder was not found."}</p>
    <div class="actions" style="flex-wrap:wrap;margin-top:14px">${rooms}</div>
  </div>`;
}

function renderOps() {
  const modes = (board.items || []).filter((i) => i.group === "reality").map(row).join("");
  const lines = journal.slice(-40).map((l) => `<li><time>${esc(l.t)}</time>${esc(l.line)}</li>`).join("") || "<li>Journal is empty.</li>";
  const doctor = (board.items || []).filter((i) => i.id === "zoth-doctor");
  return `<div class="split">
    <div>
      <section class="group"><h2>Reality</h2>${modes}</section>
      <section class="group"><h2>Journal</h2><ul class="journal">${lines}</ul></section>
    </div>
    <aside class="panel">
      <h2>Doctor</h2>
      <div class="kv"><span>Ready</span><div>${pulse.counts.ready}</div></div>
      <div class="kv"><span>Missing</span><div>${pulse.counts.missing}</div></div>
      <div class="kv"><span>OS</span><div>${esc(pulse.os)}</div></div>
      <div class="kv"><span>Kernel</span><div>${esc(pulse.kernel)}</div></div>
      <div class="kv"><span>CPU</span><div>${esc(pulse.cpu.model)}</div></div>
      ${doctor.map(row).join("")}
    </aside>
  </div>`;
}

function render() {
  document.querySelectorAll(".rail button").forEach((btn) => btn.classList.toggle("on", btn.dataset.view === view));
  document.getElementById("lede").textContent = titles[view];
  if (!pulse) {
    stage.innerHTML = `<p class="empty">Waiting for the machine.</p>`;
    return;
  }
  if (view === "desk") stage.innerHTML = renderDesk();
  else if (view === "arms") stage.innerHTML = grouped(board.items.filter((i) => ["recon", "web", "exploit", "wireless", "passwords", "packets", "reverse", "forensics", "privacy"].includes(i.group) && matches(i)));
  else if (view === "mind") stage.innerHTML = grouped(board.items.filter((i) => i.group === "mind" && matches(i)));
  else if (view === "chip") stage.innerHTML = renderChip();
  else if (view === "hub") stage.innerHTML = renderHub();
  else stage.innerHTML = renderOps();
}

function paintMeters() {
  if (!pulse || !pulse.cpu || !pulse.mem || !pulse.disk || !pulse.net) return;
  const setBar = (id, pct) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.style.setProperty("--w", Math.max(0, Math.min(100, pct)) + "%");
    el.classList.toggle("hot", pct >= 90);
    el.classList.toggle("warn", pct >= 75 && pct < 90);
  };
  const setTxt = (id, txt) => {
    const el = document.getElementById(id);
    if (el) el.textContent = txt;
  };
  setTxt("m-cpu", (pulse.cpu.pct || 0).toFixed(0) + "%");
  setTxt("m-ram", `${pulse.mem.used_gb || 0}/${pulse.mem.total_gb || 0} GB`);
  setTxt("m-disk", (pulse.disk.pct || 0).toFixed(0) + "%");
  setTxt("m-net", fmtRate(pulse.net.rx_bps || 0));
  setTxt("m-temp", pulse.temp_c == null ? "n/a" : pulse.temp_c.toFixed(0) + "°");
  setTxt("m-load", "load " + (pulse.cpu.load || []).map((n) => n.toFixed(2)).join(" "));
  setBar("b-cpu", pulse.cpu.pct || 0);
  setBar("b-ram", pulse.mem.pct || 0);
  setBar("b-disk", pulse.disk.pct || 0);
  const netPct = Math.min(100, ((pulse.net.rx_bps || 0) / (5 * 1024 * 1024)) * 100);
  setBar("b-net", netPct || 4);
  setTxt("clock", pulse.clock || "--:--:--");
  setTxt("host", pulse.host || "—");
  setTxt("rail-mode", (pulse.mode || "unset").slice(0, 8));
  const netLabel = document.querySelector(".meters article:nth-child(4) span");
  if (netLabel) netLabel.textContent = pulse.net.iface && pulse.net.iface !== "—" ? "Net · " + pulse.net.iface : "Net";
}

async function refreshJournal() {
  const data = await apiFetch("/api/journal");
  if (data && data.lines) journal = data.lines;
}

async function tick() {
  try {
    const [p, b] = await Promise.all([apiFetch("/api/pulse"), apiFetch("/api/board")]);
    if (p && p.cpu && p.mem && p.disk && p.net) {
      pulse = p;
      if (b && b.items) board = b;
      paintMeters();
      if (!painted || (view !== "arms" && view !== "mind")) render();
      painted = true;
    }
  } catch (err) {
    console.warn("Telemetry tick error:", err);
  }
}

async function probeGpu() {
  const out = { ok: false, name: "", ms: null, features: 0, note: "" };
  if (!navigator.gpu) {
    out.note = "This window has no WebGPU. Chrome or Edge on the desktop will.";
  } else {
    try {
      const adapter = await navigator.gpu.requestAdapter();
      if (!adapter) {
        out.note = "WebGPU is in this browser, but no GPU adapter was granted.";
      } else {
        const info = adapter.info || {};
        out.name = info.description || info.device || info.vendor || "local adapter";
        out.features = [...adapter.features].length;
        const device = await adapter.requestDevice();
        const module = device.createShaderModule({
          code: `
            @group(0) @binding(0) var<storage, read_write> data: array<f32>;
            @compute @workgroup_size(64)
            fn main(@builtin(global_invocation_id) id: vec3<u32>) {
              let i = id.x;
              if (i >= arrayLength(&data)) { return; }
              data[i] = data[i] * 1.0001 + 0.001;
            }`,
        });
        const pipeline = device.createComputePipeline({
          layout: "auto",
          compute: { module, entryPoint: "main" },
        });
        const n = 65536;
        const buf = device.createBuffer({
          size: n * 4,
          usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
        });
        const bind = device.createBindGroup({
          layout: pipeline.getBindGroupLayout(0),
          entries: [{ binding: 0, resource: { buffer: buf } }],
        });
        const encoder = device.createCommandEncoder();
        const pass = encoder.beginComputePass();
        pass.setPipeline(pipeline);
        pass.setBindGroup(0, bind);
        pass.dispatchWorkgroups(n / 64);
        pass.end();
        const t0 = performance.now();
        device.queue.submit([encoder.finish()]);
        await device.queue.onSubmittedWorkDone();
        out.ms = performance.now() - t0;
        out.ok = true;
        device.destroy();
      }
    } catch (err) {
      out.note = String(err && err.message || err);
    }
  }
  gpuLocal = out;
  await apiFetch("/api/webgpu", "POST", out);
  if (view === "chip" || view === "desk") render();
}

document.querySelector(".rail").addEventListener("click", (event) => {
  const btn = event.target.closest("[data-view]");
  if (!btn) return;
  view = btn.dataset.view;
  render();
  if (view === "chip" && !gpuLocal) probeGpu();
  if (view === "ops") refreshJournal().then(render);
});

stage.addEventListener("click", (event) => {
  if (event.target.id === "probe") {
    probeGpu();
    return;
  }
  const btn = event.target.closest("[data-act]");
  if (!btn) return;
  act(btn.dataset.act, btn.dataset.id || "");
});

q.addEventListener("input", () => {
  if ((view === "desk" || view === "chip" || view === "hub" || view === "ops") && q.value.trim()) view = "arms";
  render();
});

document.addEventListener("keydown", (event) => {
  if (event.target === q) {
    if (event.key === "Escape") q.value = "", q.blur(), render();
    return;
  }
  if (event.key === "/") {
    event.preventDefault();
    q.focus();
  }
  const map = { "1": "desk", "2": "arms", "3": "mind", "4": "chip", "5": "hub", "6": "ops" };
  if (map[event.key]) {
    view = map[event.key];
    render();
  }
});

const initial = location.hash.replace("#", "");
if (titles[initial]) view = initial;

tick().then(() => {
  refreshJournal();
  probeGpu();
});
setInterval(tick, 1500);
