/**
 * Zoth Studio hub — nav, scroll, parallax, pets modal, lightbox, filters
 */
(function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Mobile nav ---------- */
  const toggle = document.querySelector('[data-nav-toggle]');
  const panel = document.querySelector('[data-nav-panel]');
  if (toggle && panel) {
    toggle.addEventListener('click', () => {
      const open = panel.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.classList.toggle('nav-open', open);
    });
    panel.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => {
        panel.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('nav-open');
      });
    });
  }

  /* ---------- Header + scroll progress ---------- */
  const header = document.querySelector('.site-header');
  const progress = document.querySelector('[data-scroll-progress]');
  const backTop = document.querySelector('[data-back-top]');

  let scrollTicking = false;
  const onScrollChrome = () => {
    const y = window.scrollY || 0;
    if (header) header.classList.toggle('is-scrolled', y > 24);
    if (progress) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? (y / max) * 100 : 0;
      progress.style.width = `${p}%`;
    }
    if (backTop) backTop.hidden = y < 480;
  };

  /* ---------- Active section nav ---------- */
  const sectionIds = [
    'overview',
    'features',
    'pets',
    'pipeline',
    'arsenal',
    'run',
    'faq',
  ];
  const navLinks = [...document.querySelectorAll('[data-nav-link]')];
  const setActive = () => {
    let current = sectionIds[0];
    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (!el) continue;
      if (el.getBoundingClientRect().top <= 140) current = id;
    }
    navLinks.forEach((link) => {
      const href = link.getAttribute('href') || '';
      link.classList.toggle('is-active', href === `#${current}`);
    });
  };

  const handleScrollUpdate = () => {
    if (!scrollTicking) {
      scrollTicking = true;
      window.requestAnimationFrame(() => {
        onScrollChrome();
        setActive();
        scrollTicking = false;
      });
    }
  };

  onScrollChrome();
  setActive();
  window.addEventListener('scroll', handleScrollUpdate, { passive: true });
  if (backTop) {
    backTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    });
  }

  const revealIfInView = () => {
    document.querySelectorAll('[data-reveal]:not(.is-visible)').forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.bottom > 40 && r.top < window.innerHeight - 40) el.classList.add('is-visible');
    });
  };
  window.addEventListener('hashchange', () => {
    requestAnimationFrame(revealIfInView);
  });
  window.addEventListener('load', revealIfInView);

  /* ---------- Reveal on view ---------- */
  const revealEls = document.querySelectorAll('[data-reveal]');
  if (!reduce && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.1 }
    );
    revealEls.forEach((el, i) => {
      el.style.setProperty('--reveal-delay', `${Math.min(i % 6, 5) * 55}ms`);
      io.observe(el);
    });
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  /* ---------- Pet filters ---------- */
  const filterBar = document.querySelector('[data-pet-filters]');
  const petCards = [...document.querySelectorAll('[data-pet]')];
  if (filterBar && petCards.length) {
    filterBar.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-filter]');
      if (!btn) return;
      const filter = btn.dataset.filter;
      filterBar.querySelectorAll('[data-filter]').forEach((b) => b.classList.toggle('is-active', b === btn));
      petCards.forEach((card) => {
        const show = filter === 'all' || card.dataset.domain === filter;
        card.classList.toggle('is-filtered-out', !show);
        card.hidden = !show;
      });
    });
  }

  /* ---------- Pet art style (neon default / classic) ---------- */
  const artBar = document.querySelector('[data-art-style]');
  const applyArtStyle = (style) => {
    petCards.forEach((card) => {
      const neon = card.dataset.img; // current default is neon path in data-img
      const classic = card.dataset.imgClassic;
      const img = card.querySelector('.pet-media img');
      if (!img) return;
      // data-img holds neon default; classic is data-img-classic
      const neonSrc = card.getAttribute('data-img') || '';
      const classicSrc = card.getAttribute('data-img-classic') || neonSrc;
      const next = style === 'classic' ? classicSrc : neonSrc;
      img.src = next;
      card.dataset.currentArt = style;
    });
    document.body.classList.toggle('pets-classic', style === 'classic');
    document.body.classList.toggle('pets-neon', style !== 'classic');
  };
  // ensure defaults are neon
  applyArtStyle('neon');
  if (artBar) {
    artBar.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-art]');
      if (!btn) return;
      const style = btn.dataset.art || 'neon';
      artBar.querySelectorAll('[data-art]').forEach((b) => b.classList.toggle('is-active', b === btn));
      applyArtStyle(style);
    });
  }

  /* ---------- Pet modal ---------- */
  const petModal = document.querySelector('[data-pet-modal]');
  const petImg = document.querySelector('[data-pet-modal-img]');
  const petName = document.querySelector('[data-pet-modal-name]');
  const petRole = document.querySelector('[data-pet-modal-role]');
  const petBlurb = document.querySelector('[data-pet-modal-blurb]');
  const petDomain = document.querySelector('[data-pet-modal-domain]');
  const petTags = document.querySelector('[data-pet-modal-tags]');
  const petEngage = document.querySelector('[data-pet-modal-engage]');
  const copyEngage = document.querySelector('[data-copy-engage]');
  let lastFocus = null;

  const openPetModal = (card) => {
    if (!petModal) return;
    lastFocus = document.activeElement;
    const name = card.dataset.name || '';
    const role = card.dataset.role || '';
    const style = card.dataset.currentArt || 'neon';
    const img =
      style === 'classic'
        ? card.getAttribute('data-img-classic') || card.getAttribute('data-img') || ''
        : card.getAttribute('data-img') || '';
    const blurb = card.dataset.blurb || '';
    const engage = card.dataset.engage || '';
    const domain = (card.dataset.domain || '').toUpperCase();
    const tags = (card.dataset.tags || '').split(',').map((t) => t.trim()).filter(Boolean);

    if (petImg) {
      petImg.src = img;
      petImg.alt = name;
      petImg.classList.toggle('is-neon', style !== 'classic');
    }
    if (petName) petName.textContent = name;
    if (petRole) petRole.innerHTML = role;
    if (petBlurb) petBlurb.textContent = blurb;
    if (petDomain) petDomain.textContent = `Companion · ${domain}`;
    if (petEngage) petEngage.textContent = engage;
    if (petTags) {
      petTags.innerHTML = tags.map((t) => `<span class="tag">${t}</span>`).join('');
    }
    petModal.hidden = false;
    document.body.classList.add('modal-open');
    petModal.querySelector('.modal-close')?.focus();
  };

  const closePetModal = () => {
    if (!petModal) return;
    petModal.hidden = true;
    document.body.classList.remove('modal-open');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  };

  petCards.forEach((card) => {
    card.addEventListener('click', () => openPetModal(card));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openPetModal(card);
      }
    });
  });

  petModal?.querySelectorAll('[data-modal-close]').forEach((el) => {
    el.addEventListener('click', closePetModal);
  });
  window.addEventListener('hashchange', () => {
    if (petModal && !petModal.hidden) closePetModal();
    if (lbModal && !lbModal.hidden) closeLightbox();
  });

  copyEngage?.addEventListener('click', async () => {
    const text = petEngage?.textContent || '';
    try {
      await navigator.clipboard.writeText(text);
      copyEngage.textContent = 'Copied';
      setTimeout(() => {
        copyEngage.textContent = 'Copy engage prompt';
      }, 1400);
    } catch {
      copyEngage.textContent = 'Copy failed';
    }
  });

  /* ---------- Lightbox ---------- */
  const lbModal = document.querySelector('[data-lightbox-modal]');
  const lbStage = document.querySelector('[data-lightbox-stage]');
  const lbCap = document.querySelector('[data-lightbox-caption]');

  const closeLightbox = () => {
    if (!lbModal) return;
    lbModal.hidden = true;
    document.body.classList.remove('modal-open');
    if (lbStage) lbStage.innerHTML = '';
  };

  document.querySelectorAll('[data-lightbox]').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (!lbModal || !lbStage) return;
      const type = btn.dataset.type || 'image';
      const src = btn.dataset.src || '';
      const poster = btn.dataset.poster || '';
      const caption = btn.dataset.caption || '';
      lbStage.innerHTML = '';
      if (type === 'video') {
        const v = document.createElement('video');
        v.controls = true;
        v.autoplay = true;
        v.playsInline = true;
        if (poster) v.poster = poster;
        const s = document.createElement('source');
        s.src = src;
        s.type = 'video/mp4';
        v.appendChild(s);
        lbStage.appendChild(v);
      } else {
        const img = document.createElement('img');
        img.src = src;
        img.alt = caption;
        lbStage.appendChild(img);
      }
      if (lbCap) lbCap.textContent = caption;
      lbModal.hidden = false;
      document.body.classList.add('modal-open');
    });
  });

  lbModal?.querySelectorAll('[data-lightbox-close]').forEach((el) => {
    el.addEventListener('click', closeLightbox);
  });

  /* ---------- Escape closes modals ---------- */
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (petModal && !petModal.hidden) closePetModal();
    if (lbModal && !lbModal.hidden) closeLightbox();
  });

  /* ---------- Copy runbook ---------- */
  const copyBtn = document.querySelector('[data-copy-code]');
  const codeBlock = document.querySelector('[data-code-block]');
  copyBtn?.addEventListener('click', async () => {
    const text = codeBlock?.textContent || '';
    try {
      await navigator.clipboard.writeText(text);
      copyBtn.textContent = 'Copied';
      setTimeout(() => {
        copyBtn.textContent = 'Copy';
      }, 1400);
    } catch {
      copyBtn.textContent = 'Failed';
    }
  });

  /* ---------- Year ---------- */
  const y = document.querySelector('[data-year]');
  if (y) y.textContent = String(new Date().getFullYear());

  /* ---------- Optional vault daemon + studio health probes (fail soft) ---------- */
  const daemonBadge = document.querySelector('[data-daemon-badge]');
  const studioBadges = [...document.querySelectorAll('[data-studio-badge]')];
  const studioLabel = document.querySelector('[data-studio-label]');
  const studioMeta = document.querySelector('[data-studio-meta]');

  const probe = async (url) => {
    const ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
    const timer = setTimeout(() => ctrl?.abort(), 1200);
    try {
      const res = await fetch(url, {
        method: 'GET',
        mode: 'cors',
        cache: 'no-store',
        signal: ctrl?.signal,
      });
      if (!res.ok) return null;
      try {
        return await res.json();
      } catch {
        return { ok: true };
      }
    } catch {
      return null;
    } finally {
      clearTimeout(timer);
    }
  };

  const probeDaemon = async () => {
    if (!daemonBadge) return;
    const data = (location.hostname === 'localhost' || location.hostname === '127.0.0.1') ? await probe('http://127.0.0.1:8787/health') : null;
    const ok = data && data.ok !== false;
    if (ok) {
      daemonBadge.hidden = false;
      daemonBadge.setAttribute('data-daemon-online', 'true');
    }
  };

  const probeStudio = async () => {
    if (!studioBadges.length) return;
    const data = (location.hostname === 'localhost' || location.hostname === '127.0.0.1') ? await probe('http://127.0.0.1:8484/api/dashboard') : null;
    const online = !!(data && (data.healthy === true || data.status === 'ok' || data.tool_count));
    studioBadges.forEach((badge) => {
      badge.hidden = false;
      badge.classList.toggle('is-offline', !online);
      badge.setAttribute('data-studio-online', online ? 'true' : 'false');
      badge.setAttribute('aria-label', online ? 'Studio deck is online' : 'Studio deck is offline');
    });
    if (studioLabel) studioLabel.textContent = online ? 'Deck online' : 'Deck offline';
    if (studioMeta) {
      studioMeta.textContent = online
        ? `${data.tool_count || 298} tools · Studio Deck`
        : 'Start orchestrator.py serve';
    }
    const map = document.querySelector('.deck-map');
    if (map) map.classList.toggle('is-offline', !online);
    const launch = document.querySelector('[data-studio-launch]');
    if (launch) {
      launch.title = online
        ? 'Open the operator deck'
        : 'Deck is offline — start orchestrator.py serve, then retry';
    }
  };

  const probeSpark = async () => {
    const launch = document.querySelector('[data-spark-launch]');
    if (!launch) return;
    const data = (location.hostname === 'localhost' || location.hostname === '127.0.0.1') ? await probe('http://127.0.0.1:8765/health') : null;
    const online = !!(data && data.ok);
    launch.title = online
      ? `Spark online · ${data.model || 'local model'}`
      : 'Spark is offline — python3 scripts/try_server.py in rust-website';
    launch.classList.toggle('is-offline', !online);
  };

  const runProbes = () => {
    probeDaemon();
    probeStudio();
    probeSpark();
  };
  if (typeof requestIdleCallback === 'function') {
    requestIdleCallback(runProbes, { timeout: 2500 });
  } else {
    setTimeout(runProbes, 400);
  }

  /* ---------- AI Tools Matrix & OS-Aware Installer ---------- */
  let activeToolData = null;
  let currentToolOS = 'linux';
  let toolsInventory = [];

  const initToolMatrix = async () => {
    const grid = document.getElementById('tool-logo-grid');
    if (!grid) return;

    // Detect browser OS
    const navPlat = (navigator.userAgentData?.platform || navigator.platform || '').toLowerCase();
    if (navPlat.includes('mac')) currentToolOS = 'macos';
    else if (navPlat.includes('win')) currentToolOS = 'windows';
    else currentToolOS = 'linux';

    const osBadge = document.getElementById('matrix-os-badge');
    if (osBadge) {
      const osNames = { linux: '🐧 Linux / Parrot OS', macos: '🍎 macOS', windows: '🪟 Windows' };
      osBadge.textContent = `Host OS: ${osNames[currentToolOS] || 'Linux'}`;
    }

    // Data source: the static registry endpoint this site actually serves
    // (public/api/tools.json, generated by scripts/generate-tools-json.py).
    // The old target -- http://127.0.0.1:8484/api/tools/status -- is a loopback
    // orchestrator that cannot exist for a visitor, so it failed on every load
    // with a console error. A live daemon is only consulted when the host opts
    // in by defining window.ZOTH_TOOLS_LIVE_API.
    const liveApi = typeof window.ZOTH_TOOLS_LIVE_API === 'string' ? window.ZOTH_TOOLS_LIVE_API.replace(/\/+$/, '') : '';
    const REGISTRY_ICON = {
      'Web Apps & SaaS': '🛰️', 'Client Services': '🤝', 'Creative & Media': '🎛️',
      'AI Agents & LLM': '🧠', 'Learning & Courses': '📚', 'Portfolio & Agency': '🗂️',
      'Netlify & Creator Tools': '⚡', 'Automation & Tools': '⚙️',
      'Security Operations & OSINT': '🛡️', 'Games & Experiments': '🎮',
      'Python Tools': '🐍', 'Crypto & Web3': '⛓️', 'Workspaces': '🏗️', 'Rust Projects': '🦀'
    };
    // Registry entries are repo projects, not host binaries: `installed` stays
    // null so nothing here can claim "Ready" or offer a fake 1-click install.
    const toMatrixEntry = (t) => ({
      id: t.id,
      name: t.name || t.id,
      icon: REGISTRY_ICON[t.category] || '📦',
      category: t.category || 'Other',
      desc: t.description || '',
      relative_path: t.relative_path || '',
      registry: true,
      installed: null,
    });

    let toolsSource = 'curated fallback';
    try {
      const url = liveApi ? `${liveApi}/api/tools/status` : '/api/tools.json';
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) throw new Error(`tools registry HTTP ${res.status}`);
      const data = await res.json();
      if (data.host_os) currentToolOS = data.host_os;
      toolsInventory = (data.tools || []).map(toMatrixEntry);
      if (toolsInventory.length) toolsSource = liveApi ? 'live daemon' : 'static registry endpoint';
    } catch (e) {
      // Explicit, honest degradation: fall through to the curated list below
      // and say so on the page instead of failing silently.
      toolsInventory = [];
    }

    if (!toolsInventory.length) {
      toolsInventory = [
        { id: 'antigravity', name: 'Antigravity CLI', icon: '🐺', category: 'Security & AST', installed: true, version: '1.1.15', desc: 'Autonomous pair programming agent with deep AST invariants, security verification, and multi-agent cascades.', doc_route: '/docs/', github: 'https://github.com/google/antigravity', install_options: { linux: 'curl -fsSL https://antigravity.google.com/install.sh | bash', macos: 'brew install google/tap/antigravity', windows: 'irm https://antigravity.google.com/install.ps1 | iex' } },
        { id: 'hermes', name: 'Hermes Agent', icon: '🐲', category: 'JSON Schemas', installed: true, version: '0.20.0', desc: 'Autonomous tool-calling agent with strict JSON schema compliance and multi-provider slots.', doc_route: '/docs/', github: 'https://github.com/NousResearch/Hermes-Agent', install_options: { linux: 'pip install --upgrade hermes-agent', macos: 'pip3 install hermes-agent', windows: 'pip install hermes-agent' } },
        { id: 'grok', name: 'Grok Build CLI', icon: '🦊', category: 'High-Throughput', installed: true, version: '1.0.5', desc: 'High-velocity streaming code generator with GitHub Octokit harness and instant TUI.', doc_route: '/docs/', github: 'https://github.com/xai-org/grok-cli', install_options: { linux: 'npm install -g @xai/grok-cli || cargo install grok-cli', macos: 'npm install -g @xai/grok-cli', windows: 'npm install -g @xai/grok-cli' } },
        { id: 'claude', name: 'Claude Code', icon: '🟣', category: 'Reasoning', installed: false, version: 'Not Detected', desc: 'Agentic coding tool that navigates codebases, edits files, and executes commands with deep reasoning.', doc_route: '/docs/', github: 'https://github.com/anthropics/claude-code', install_options: { linux: 'npm install -g @anthropic-ai/claude-code', macos: 'npm install -g @anthropic-ai/claude-code', windows: 'npm install -g @anthropic-ai/claude-code' } },
        { id: 'opencode', name: 'OpenCode', icon: '🧩', category: 'Fullstack Agent', installed: true, version: '2026.4.11', desc: 'Open agent execution protocol with full-stack DAG orchestrator and containerized tool execution.', doc_route: '/docs/', github: 'https://github.com/openclaw-ai/opencode', install_options: { linux: 'pip install opencode-ai || npm install -g opencode', macos: 'pip3 install opencode-ai', windows: 'pip install opencode-ai' } },
        { id: 'codex', name: 'Codex CLI', icon: '🤖', category: 'Code Generator', installed: true, version: '0.135.0', desc: 'Structured code generation and migration assistant with strict syntax guarantees.', doc_route: '/docs/', github: 'https://github.com/openai/codex-cli', install_options: { linux: 'npm install -g @openai/codex', macos: 'npm install -g @openai/codex', windows: 'npm install -g @openai/codex' } },
        { id: 'aider', name: 'Aider Coder', icon: '⚡', category: 'Git Pair Coder', installed: true, version: '0.86.2', desc: 'AI pair programming in your terminal, with automated git commits and AST diff patching.', doc_route: '/docs/', github: 'https://github.com/paul-gauthier/aider', install_options: { linux: 'pip install aider-chat', macos: 'brew install aider || pip install aider-chat', windows: 'pip install aider-chat' } },
        { id: 'ollama', name: 'Ollama Local', icon: '🦙', category: 'Local Neural', installed: true, version: '0.30.10', desc: 'Run open-weight frontier models completely offline on 127.0.0.1:11434.', doc_route: '/docs/', github: 'https://github.com/ollama/ollama', install_options: { linux: 'curl -fsSL https://ollama.com/install.sh | sh', macos: 'brew install ollama', windows: 'winget install Ollama.Ollama' } },
        { id: 'lafvin', name: 'Lafvin Companion', icon: '🦾', category: 'ESP32 Hardware', installed: false, version: 'Not Detected', desc: 'Physical desktop companion bridge with ST7789 TFT screen rendering and DSP audio chime.', doc_route: '/docs/', github: 'https://github.com/NullAITech/zoth-studio', install_options: { linux: 'pip install pyserial edge-tts Pillow', macos: 'pip3 install pyserial edge-tts Pillow', windows: 'pip install pyserial edge-tts Pillow' } },
        { id: 'zoth-vault', name: 'Argon2id Vault', icon: '🔒', category: 'BYOK Vault', installed: false, version: 'Not Detected', desc: 'Rust-powered sovereign BYOK vault daemon keeping all API keys encrypted on loopback :8787.', doc_route: '/vault/index.html', github: 'https://github.com/NullAITech/zoth-studio', install_options: { linux: 'cargo build --release', macos: 'cargo build --release', windows: 'cargo build --release' } },
        { id: 'subsweep', name: 'SubSweep OSINT', icon: '🔍', category: 'Recon & Surface', installed: false, version: 'Not Detected', desc: 'Fast attack surface discovery, TLS certificate monitoring, and security header auditing.', doc_route: '/studio/subsweep.html', github: 'https://github.com/NullAITech/zoth-studio', install_options: { linux: 'pip install requests dnspython cryptography', macos: 'pip3 install requests dnspython cryptography', windows: 'pip install requests dnspython cryptography' } },
        { id: 'radare2', name: 'Radare2 (R2)', icon: '💀', category: 'Reverse Eng', installed: true, version: 'Installed', desc: 'Advanced UNIX reverse engineering framework and command-line disassembler.', doc_route: '/docs/', github: 'https://github.com/radareorg/radare2', install_options: { linux: 'sudo apt install radare2', macos: 'brew install radare2', windows: 'winget install radareorg.radare2' } }
      ];
    }

    grid.innerHTML = '';
    if (toolsSource === 'curated fallback') {
      const note = document.createElement('div');
      note.setAttribute('role', 'status');
      note.style.cssText = 'grid-column:1/-1;font-size:12px;opacity:.75;margin-bottom:8px;';
      note.textContent = 'Static tools registry unreachable — showing the curated onboard list.';
      grid.appendChild(note);
    }
    toolsInventory.forEach((tool, idx) => {
      const card = document.createElement('div');
      card.className = `tool-logo-card ${idx === 0 ? 'active' : ''}`;
      card.dataset.id = tool.id;
      
      const isInst = !!tool.installed;
      const statusBadge = tool.registry
        ? `<span class="tool-logo-status">📦 In registry</span>`
        : isInst
        ? `<span class="tool-logo-status online">🟢 Ready</span>`
        : `<span class="tool-logo-status offline">🟡 Install</span>`;

      card.innerHTML = `
        <span class="tool-logo-icon">${tool.icon || '🤖'}</span>
        <span class="tool-logo-name">${tool.name}</span>
        ${statusBadge}
      `;

      card.addEventListener('click', () => {
        document.querySelectorAll('.tool-logo-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        showToolInspector(tool);
      });

      grid.appendChild(card);
    });

    if (toolsInventory.length) {
      showToolInspector(toolsInventory[0]);
    }
  };

  function showToolInspector(tool) {
    activeToolData = tool;
    const card = document.getElementById('tool-inspector-card');
    if (!card) return;
    card.style.display = 'block';

    document.getElementById('tool-insp-emoji').textContent = tool.icon || '🤖';
    document.getElementById('tool-insp-title').textContent = tool.name;
    document.getElementById('tool-insp-category').textContent = tool.category || 'AI Agent';
    document.getElementById('tool-insp-desc').textContent = tool.desc || '';
    
    const isInst = !!tool.installed;
    const statusText = document.getElementById('tool-insp-status-text');
    if (statusText) {
      if (tool.registry) {
        statusText.innerHTML = `<span style="color:#93c5fd;">📦 Project in the site registry — not a host binary</span>`;
      } else {
        statusText.innerHTML = isInst
          ? `<span style="color:#34d399;">🟢 Installed (${tool.version || 'Active'})</span>`
          : `<span style="color:#fbbf24;">🟡 Not Detected on Host — Ready to Install</span>`;
      }
    }

    const docLink = document.getElementById('tool-doc-link');
    if (docLink) docLink.href = tool.doc_route || '/docs/';
    const gitLink = document.getElementById('tool-git-link');
    if (gitLink) gitLink.href = tool.github || 'https://github.com/NullAITech/zoth-studio';

    updateToolCmdBox();
  }

  function updateToolCmdBox() {
    if (!activeToolData) return;
    const codeEl = document.getElementById('tool-insp-cmd');
    if (activeToolData.registry) {
      // Registry entries are repo projects, not installable host binaries --
      // show the relative location instead of an install command we cannot run.
      if (codeEl) codeEl.textContent = activeToolData.relative_path || activeToolData.id;
      document.querySelectorAll('.tool-os-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.os === currentToolOS);
      });
      return;
    }
    const cmd = activeToolData.install_options?.[currentToolOS] || activeToolData.install_cmd || activeToolData.install_options?.linux || 'curl -fsSL https://nullai.tech/install.sh | bash';
    if (codeEl) codeEl.textContent = cmd;

    document.querySelectorAll('.tool-os-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.os === currentToolOS);
    });
  }

  window.switchToolOS = function(osKey) {
    currentToolOS = osKey;
    updateToolCmdBox();
  };

  window.copyToolCommand = function() {
    const codeEl = document.getElementById('tool-insp-cmd');
    if (!codeEl) return;
    navigator.clipboard.writeText(codeEl.textContent).then(() => {
      const btn = document.getElementById('tool-copy-btn');
      if (btn) {
        btn.textContent = '✓ Copied';
        setTimeout(() => btn.textContent = 'Copy', 2000);
      }
    });
  };

  window.triggerAutoInstall = async function() {
    if (!activeToolData) return;
    const msg = document.getElementById('install-stream-msg');
    const liveApi = typeof window.ZOTH_TOOLS_LIVE_API === 'string' ? window.ZOTH_TOOLS_LIVE_API.replace(/\/+$/, '') : '';

    // Registry entries are repo projects -- there is nothing to install.
    if (activeToolData.registry) {
      if (msg) {
        msg.style.display = 'block';
        msg.textContent = `📦 ${activeToolData.name} is a project in the site registry (${activeToolData.relative_path || 'no path recorded'}) — nothing to install on this host.`;
      }
      return;
    }

    // No orchestrator configured => this is a static host. Say so instead of
    // firing a request at a loopback port that cannot be listening, which only
    // produced a console error.
    if (!liveApi) {
      if (msg) {
        msg.style.display = 'block';
        msg.textContent = 'ℹ️ No live orchestrator is configured on this host — copy the command above and run it in your terminal.';
      }
      return;
    }

    if (msg) {
      msg.style.display = 'block';
      msg.textContent = `⏳ Initiating automated install for ${activeToolData.name}...`;
    }

    try {
      const res = await fetch(`${liveApi}/api/tools/install`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tool_id: activeToolData.id })
      });
      if (res.ok) {
        const data = await res.json();
        if (msg) msg.textContent = `🚀 [Started PID ${data.pid}] Running: ${data.install_cmd}`;
      } else {
        if (msg) msg.textContent = `ℹ️ Installer returned HTTP ${res.status} — copy the command above and run it in your terminal.`;
      }
    } catch (err) {
      if (msg) msg.textContent = `ℹ️ Copy command above and run in your terminal: ${document.getElementById('tool-insp-cmd').textContent}`;
    }
  };

  // Inject In-Browser Visual Annotator & Agent Feedback Overlay
  function loadAnnotatorOverlay() {
    if (window.__ZOTH_ANNOTATOR_LOADED__ || document.querySelector('script[src*="zoth-annotator.js"]')) return;
    const s = document.createElement('script');
    s.src = '/assets/zoth-annotator.js';
    s.defer = true;
    document.body.appendChild(s);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadAnnotatorOverlay);
  } else {
    loadAnnotatorOverlay();
  }

  initToolMatrix();
})();
