const state = {
  sessionId: null,
  cursor: 0,
  pollTimer: null,
  output: "",
  filePath: ".",
  selectedFile: "",
  detectedUrls: new Set(),
  lastInputCount: 0,
  showcase: null,
};

const cloudModels = [
  "deepseek-v4-pro:cloud",
  "deepseek-v4-flash:cloud",
  "qwen3-coder:480b-cloud",
  "gpt-oss:120b-cloud",
  "gpt-oss:20b-cloud",
  "minimax-m2.7:cloud",
  "minimax-m2.5:cloud",
  "minimax-m2.1:cloud",
  "minimax-m2:cloud",
  "kimi-k2.6:cloud",
  "kimi-k2.5:cloud",
  "kimi-k2-thinking:cloud",
  "kimi-k2:1t-cloud",
  "glm-5.1:cloud",
  "glm-5:cloud",
  "glm-4.7:cloud",
  "glm-4.6:cloud",
  "qwen3.5:cloud",
  "qwen3.5:397b-cloud",
  "qwen3-coder-next:cloud",
  "qwen3-next:80b-cloud",
  "devstral-2:123b-cloud",
  "devstral-small-2:24b-cloud",
  "deepseek-v3.2:cloud",
  "deepseek-v3.1:671b-cloud",
  "mistral-large-3:675b-cloud",
  "cogito-2.1:671b-cloud",
  "nemotron-3-super:cloud",
  "nemotron-3-nano:30b-cloud",
  "gemini-3-flash-preview:cloud",
  "gemma4:31b-cloud",
  "gemma3:27b-cloud",
  "gemma3:12b-cloud",
  "gemma3:4b-cloud",
  "ministral-3:14b-cloud",
  "ministral-3:8b-cloud",
  "ministral-3:3b-cloud",
  "qwen3-vl:235b-cloud",
  "qwen3-vl:235b-instruct-cloud",
  "rnj-1:8b-cloud",
];

const preferredModels = [
  "deepseek-v4-pro:cloud",
  "deepseek-v4-flash:cloud",
  "qwen3-coder:480b-cloud",
  "gpt-oss:120b-cloud",
  "minimax-m2.7:cloud",
  "kimi-k2.6:cloud",
];

const els = {
  health: document.querySelector("#health"),
  startForm: document.querySelector("#start-form"),
  workspaceMode: document.querySelector("#workspace-mode"),
  workspace: document.querySelector("#workspace"),
  workspaceHelp: document.querySelector("#workspace-help"),
  prompt: document.querySelector("#prompt"),
  launcher: document.querySelector("#launcher"),
  model: document.querySelector("#model"),
  modelPresets: document.querySelector("#model-presets"),
  modelChips: document.querySelector("#model-chips"),
  commandPreview: document.querySelector("#command-preview"),
  themeToggle: document.querySelector("#theme-toggle"),
  themeIcon: document.querySelector("#theme-icon"),
  sandbox: document.querySelector("#sandbox"),
  resumeLast: document.querySelector("#resume-last"),
  terminal: document.querySelector("#terminal"),
  sessionMeta: document.querySelector("#session-meta"),
  inputForm: document.querySelector("#input-form"),
  commandInput: document.querySelector("#command-input"),
  sendInput: document.querySelector("#send-input"),
  stopSession: document.querySelector("#stop-session"),
  clearOutput: document.querySelector("#clear-output"),
  tabs: document.querySelectorAll(".tab"),
  views: document.querySelectorAll(".view"),
  filePath: document.querySelector("#file-path"),
  fileUp: document.querySelector("#file-up"),
  refreshFiles: document.querySelector("#refresh-files"),
  fileList: document.querySelector("#file-list"),
  fileTitle: document.querySelector("#file-title"),
  fileMeta: document.querySelector("#file-meta"),
  fileContent: document.querySelector("#file-content"),
  showcaseKind: document.querySelector("#showcase-kind"),
  showcaseSummary: document.querySelector("#showcase-summary"),
  showcasePreviewHint: document.querySelector("#showcase-preview-hint"),
  refreshShowcase: document.querySelector("#refresh-showcase"),
  showcaseLive: document.querySelector("#showcase-live"),
  showcaseFiles: document.querySelector("#showcase-files"),
  previewUrl: document.querySelector("#preview-url"),
  loadPreview: document.querySelector("#load-preview"),
  refreshPreview: document.querySelector("#refresh-preview"),
  openPreview: document.querySelector("#open-preview"),
  detectedUrls: document.querySelector("#detected-urls"),
  previewFrame: document.querySelector("#preview-frame"),
};

els.workspaceMode.value = window.localStorage.getItem("codex-workbench-workspace-mode") || "existing";
els.workspace.value = window.localStorage.getItem("codex-workbench-workspace") || "";
els.launcher.value = window.localStorage.getItem("codex-workbench-launcher") || "ollama-codex";
els.model.value = window.localStorage.getItem("codex-workbench-model") || "deepseek-v4-pro:cloud";
els.previewUrl.value = window.localStorage.getItem("codex-workbench-preview-url") || "";

function currentTheme() {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  window.localStorage.setItem("codex-workbench-theme", theme);
  els.themeIcon.textContent = theme === "dark" ? "☀" : "◐";
  els.themeToggle.title = theme === "dark" ? "Switch to light theme" : "Switch to dark theme";
}

setTheme(currentTheme());

async function api(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    headers: {
      "content-type": "application/json",
      ...(options.headers || {}),
    },
  });
  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload.error || `Request failed: ${response.status}`);
  }
  return payload;
}

function cleanOutputText(text) {
  return text
    .replace(/\u001b\][^\u0007]*(?:\u0007|\u001b\\)/g, "")
    .replace(/\u001b\[[0-?]*[ -/]*[@-~]/g, "")
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "")
    .replace(/\ufffd/g, "");
}

function setTerminalText(text) {
  state.output = cleanOutputText(text);
  els.terminal.textContent = state.output;
  els.terminal.scrollTop = els.terminal.scrollHeight;
}

function appendOutput(chunks) {
  if (!chunks.length) return;
  const text = cleanOutputText(chunks.join(""));
  setTerminalText(state.output + text);
  detectPreviewUrls(text);
}

function renderSession(snapshot) {
  const delta = cleanOutputText(snapshot.output.join(""));
  if (typeof snapshot.screen === "string") {
    setTerminalText(snapshot.screen);
  } else {
    setTerminalText(state.output + delta);
  }
  detectPreviewUrls(delta);
}

function setActive(enabled) {
  els.commandInput.disabled = !enabled;
  els.sendInput.disabled = !enabled;
  els.stopSession.disabled = !enabled;
  els.refreshFiles.disabled = !enabled;
  els.refreshShowcase.disabled = !enabled;
  els.fileUp.disabled = !enabled || state.filePath === ".";
}

async function checkHealth() {
  try {
    const health = await api("/api/health");
    const ollama = health.ollama ? "Ollama detected" : "Ollama not detected";
    els.health.textContent = `Codex: ${health.codex}. ${ollama}.`;
  } catch (error) {
    els.health.textContent = error.message;
  }
}

function renderModelPresets() {
  els.modelPresets.replaceChildren();
  for (const model of cloudModels) {
    const option = document.createElement("option");
    option.value = model;
    els.modelPresets.appendChild(option);
  }

  els.modelChips.replaceChildren();
  for (const model of preferredModels) {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "model-chip";
    chip.textContent = model;
    chip.addEventListener("click", () => {
      els.model.value = model;
      updateCommandPreview();
    });
    els.modelChips.appendChild(chip);
  }
}

function shellQuote(value) {
  if (!value) return "''";
  if (/^[A-Za-z0-9_./:@-]+$/.test(value)) return value;
  return `'${value.replaceAll("'", "'\\''")}'`;
}

function updateCommandPreview() {
  const workspace = els.workspace.value.trim();
  const model = els.model.value.trim();
  const sandbox = els.sandbox.value;
  let command;
  if (!workspace) {
    command = "Choose a workspace folder first";
  } else if (els.launcher.value === "ollama-codex") {
    command = `ollama launch codex --model ${shellQuote(model)} -- --no-alt-screen --cd ${shellQuote(workspace)} --sandbox ${shellQuote(sandbox)}`;
  } else if (els.launcher.value === "codex-oss") {
    command = `codex --no-alt-screen --cd ${shellQuote(workspace)} --sandbox ${shellQuote(sandbox)} --oss --local-provider ollama`;
    if (model) command += ` --model ${shellQuote(model)}`;
  } else {
    command = `codex --no-alt-screen --cd ${shellQuote(workspace)} --sandbox ${shellQuote(sandbox)}`;
    if (model) command += ` --model ${shellQuote(model)}`;
  }
  els.workspaceHelp.textContent = els.workspaceMode.value === "create"
    ? "A missing folder will be created before Codex starts."
    : "The folder must already exist before Codex starts.";
  if (els.resumeLast.checked && workspace) {
    command += " resume --last";
  }
  els.commandPreview.value = command;
}

async function poll() {
  if (!state.sessionId) return;
  try {
    const snapshot = await api(`/api/sessions/${state.sessionId}?after=${state.cursor}`);
    state.cursor = snapshot.next;
    renderSession(snapshot);
    const inputMeta = snapshot.inputCount ? ` · ${snapshot.inputCount} sent` : "";
    els.sessionMeta.textContent = `Session ${snapshot.id} in ${snapshot.cwd}${inputMeta}`;
    if (snapshot.closed) {
      setActive(false);
      window.clearInterval(state.pollTimer);
      state.pollTimer = null;
    }
  } catch (error) {
    appendOutput([`\n[app error: ${error.message}]\n`]);
    setActive(false);
  }
}

els.startForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  window.clearInterval(state.pollTimer);
  state.output = "";
  state.cursor = 0;
  els.terminal.textContent = "";
  els.sessionMeta.textContent = "Starting session...";
  setActive(false);
  const workspace = els.workspace.value.trim();
  if (!workspace) {
    els.sessionMeta.textContent = "Choose an existing folder or name a new folder before starting.";
    els.workspace.focus();
    return;
  }
  window.localStorage.setItem("codex-workbench-workspace", workspace);
  window.localStorage.setItem("codex-workbench-workspace-mode", els.workspaceMode.value);
  window.localStorage.setItem("codex-workbench-launcher", els.launcher.value);
  window.localStorage.setItem("codex-workbench-model", els.model.value.trim());

  try {
    const session = await api("/api/sessions", {
      method: "POST",
      body: JSON.stringify({
        workspace,
        workspaceMode: els.workspaceMode.value,
        prompt: els.prompt.value,
        launcher: els.launcher.value,
        model: els.model.value,
        sandbox: els.sandbox.value,
        mode: els.resumeLast.checked ? "resume-last" : "new",
      }),
    });
    state.sessionId = session.id;
    state.cursor = session.next;
    state.filePath = ".";
    state.selectedFile = "";
    state.lastInputCount = session.inputCount || 0;
    renderSession(session);
    setActive(true);
    loadFiles(".");
    loadShowcase();
    state.pollTimer = window.setInterval(poll, 650);
    poll();
  } catch (error) {
    els.sessionMeta.textContent = error.message;
  }
});

els.inputForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const text = els.commandInput.value;
  if (!state.sessionId || !text.trim()) return;
  els.commandInput.value = "";
  try {
    const receipt = await api(`/api/sessions/${state.sessionId}/input`, {
      method: "POST",
      body: JSON.stringify({ text, enter: true }),
    });
    state.lastInputCount = receipt.inputCount || state.lastInputCount;
    els.sessionMeta.textContent = receipt.closed
      ? `Session ${receipt.sessionId} is closed`
      : `Session ${receipt.sessionId} · ${state.lastInputCount} sent`;
    poll();
  } catch (error) {
    appendOutput([`\n[send failed: ${error.message}]\n`]);
  }
});

els.commandInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
    els.inputForm.requestSubmit();
  }
});

els.stopSession.addEventListener("click", async () => {
  if (!state.sessionId) return;
  await api(`/api/sessions/${state.sessionId}/stop`, {
    method: "POST",
    body: JSON.stringify({}),
  });
  poll();
});

els.clearOutput.addEventListener("click", () => {
  state.output = "";
  els.terminal.textContent = "";
});

els.themeToggle.addEventListener("click", () => {
  setTheme(currentTheme() === "dark" ? "light" : "dark");
});

els.tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const target = tab.dataset.tab;
    els.tabs.forEach((item) => {
      item.classList.toggle("is-active", item === tab);
      item.setAttribute("aria-selected", item === tab ? "true" : "false");
    });
    els.views.forEach((view) => {
      const active = view.id === target;
      view.classList.toggle("is-active", active);
      view.hidden = !active;
    });
    if (target === "files-view" && state.sessionId) {
      loadFiles(state.filePath);
    }
    if (target === "showcase-view" && state.sessionId) {
      loadShowcase();
    }
  });
});

async function loadFiles(path = ".") {
  if (!state.sessionId) return;
  try {
    const tree = await api(
      `/api/sessions/${state.sessionId}/files?path=${encodeURIComponent(path)}`,
    );
    state.filePath = tree.path || ".";
    els.filePath.textContent = tree.path === "." ? tree.cwd : `${tree.cwd}/${tree.path}`;
    els.fileUp.disabled = !tree.parent;
    els.refreshFiles.disabled = false;
    els.fileList.replaceChildren();

    if (tree.parent) {
      els.fileUp.dataset.path = tree.parent;
    } else {
      els.fileUp.dataset.path = ".";
    }

    for (const entry of tree.entries) {
      const row = document.createElement("button");
      row.type = "button";
      row.className = "file-row";
      row.dataset.path = entry.path;
      row.dataset.type = entry.type;
      const name = document.createElement("span");
      name.textContent = entry.name;
      const kind = document.createElement("span");
      kind.className = "file-kind";
      kind.textContent = entry.type === "directory" ? "dir" : formatBytes(entry.size);
      row.append(name, kind);
      row.addEventListener("click", () => {
        if (entry.type === "directory") {
          loadFiles(entry.path);
          return;
        }
        loadFile(entry.path);
      });
      els.fileList.appendChild(row);
    }
  } catch (error) {
    els.filePath.textContent = error.message;
  }
}

async function loadFile(path) {
  if (!state.sessionId) return;
  try {
    const file = await api(
      `/api/sessions/${state.sessionId}/file?path=${encodeURIComponent(path)}`,
    );
    state.selectedFile = file.path;
    els.fileTitle.textContent = file.path;
    els.fileMeta.textContent = `${formatBytes(file.size)} UTF-8`;
    els.fileContent.textContent = file.content;
    document.querySelectorAll(".file-row").forEach((row) => {
      row.classList.toggle("is-active", row.dataset.path === file.path);
    });
  } catch (error) {
    els.fileTitle.textContent = path;
    els.fileMeta.textContent = error.message;
    els.fileContent.textContent = "";
  }
}

async function loadShowcase() {
  if (!state.sessionId) return;
  try {
    const showcase = await api(`/api/sessions/${state.sessionId}/showcase`);
    state.showcase = showcase;
    els.showcaseKind.textContent = `${showcase.kind} · ${showcase.cwd}`;
    els.showcaseSummary.textContent = showcase.summary;
    els.showcasePreviewHint.textContent = showcase.previewHint;
    renderShowcaseLive();
    renderShowcaseFiles(showcase.files || []);
  } catch (error) {
    els.showcaseSummary.textContent = error.message;
  }
}

function renderShowcaseLive() {
  const url = els.previewUrl.value || [...state.detectedUrls][0] || "";
  if (!url) {
    els.showcaseLive.className = "showcase-live-empty";
    els.showcaseLive.textContent = "Waiting for Codex to print a local dev server URL...";
    return;
  }
  els.showcaseLive.className = "showcase-live-frame";
  const frame = document.createElement("iframe");
  frame.title = "Agent build live preview";
  frame.src = normalizePreviewUrl(url);
  frame.sandbox = "allow-forms allow-modals allow-pointer-lock allow-popups allow-same-origin allow-scripts";
  els.showcaseLive.replaceChildren(frame);
}

function renderShowcaseFiles(files) {
  els.showcaseFiles.replaceChildren();
  if (!files.length) {
    const empty = document.createElement("p");
    empty.textContent = "No showcase files yet. Ask Codex to build or scaffold the app.";
    els.showcaseFiles.appendChild(empty);
    return;
  }
  for (const file of files) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "showcase-file";
    const name = document.createElement("span");
    name.textContent = file.path;
    const meta = document.createElement("small");
    meta.textContent = formatBytes(file.size || 0);
    button.append(name, meta);
    button.addEventListener("click", () => {
      loadFile(file.path);
      activateTab("files-view");
    });
    els.showcaseFiles.appendChild(button);
  }
}

function activateTab(target) {
  const tab = [...els.tabs].find((item) => item.dataset.tab === target);
  if (tab) tab.click();
}

function formatBytes(size) {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / 1024 / 1024).toFixed(1)} MB`;
}

els.fileUp.addEventListener("click", () => {
  loadFiles(els.fileUp.dataset.path || ".");
});

els.refreshFiles.addEventListener("click", () => {
  loadFiles(state.filePath);
  if (state.selectedFile) {
    loadFile(state.selectedFile);
  }
});

function normalizePreviewUrl(value) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (/^(localhost|127\.0\.0\.1|0\.0\.0\.0):\d+/i.test(trimmed)) {
    return `http://${trimmed}`;
  }
  return trimmed;
}

function loadPreview(url = els.previewUrl.value) {
  const normalized = normalizePreviewUrl(url);
  if (!normalized) return;
  els.previewUrl.value = normalized;
  els.previewFrame.src = normalized;
  els.openPreview.href = normalized;
  window.localStorage.setItem("codex-workbench-preview-url", normalized);
  renderShowcaseLive();
}

function detectPreviewUrls(text) {
  const matches = text.match(/https?:\/\/(?:localhost|127\.0\.0\.1|0\.0\.0\.0|[a-z0-9.-]+)(?::\d+)?(?:\/[^\s<>"')\]]*)?/gi);
  if (!matches) return;
  let changed = false;
  for (const match of matches) {
    const url = match.replace(/[.,;:]+$/, "");
    if (!state.detectedUrls.has(url)) {
      state.detectedUrls.add(url);
      changed = true;
    }
  }
  if (changed) {
    renderDetectedUrls();
    renderShowcaseLive();
  }
}

function renderDetectedUrls() {
  els.detectedUrls.replaceChildren();
  for (const url of state.detectedUrls) {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "url-chip";
    chip.textContent = url;
    chip.addEventListener("click", () => loadPreview(url));
    els.detectedUrls.appendChild(chip);
  }
}

els.refreshShowcase.addEventListener("click", loadShowcase);
els.loadPreview.addEventListener("click", () => loadPreview());
els.refreshPreview.addEventListener("click", () => {
  const current = els.previewFrame.src;
  if (current) {
    els.previewFrame.src = current;
  } else {
    loadPreview();
  }
});
els.previewUrl.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    loadPreview();
  }
});

if (els.previewUrl.value) {
  els.openPreview.href = els.previewUrl.value;
}

for (const control of [
  els.workspaceMode,
  els.workspace,
  els.launcher,
  els.model,
  els.sandbox,
  els.resumeLast,
  els.prompt,
]) {
  control.addEventListener("input", updateCommandPreview);
  control.addEventListener("change", updateCommandPreview);
}

renderModelPresets();
updateCommandPreview();
checkHealth();
