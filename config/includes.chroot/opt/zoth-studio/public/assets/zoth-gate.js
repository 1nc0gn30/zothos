/**
 * Zoth Public Gate & Sovereign Desktop Install Subsystem (v2.0)
 * Provides a digestible, approachable multi-option installer modal for all kinds of users:
 *   1. Direct 1-Click Desktop App Download (Linux AppImage/deb, Windows .exe, macOS)
 *   2. 1-Click Terminal Command for developers (curl | bash, PowerShell irm | iex)
 *   3. 60 FPS Web Showcase Tour on Social Wall
 */
(function () {
  var DECK = location.protocol + "//" + location.hostname + ":8484";
  var HEALTH = DECK + "/api/health";
  
  var INSTALL_COMMANDS = {
    linux: "curl -fsSL https://zoth.nullai.tech/install.sh | bash",
    mac: "curl -fsSL https://zoth.nullai.tech/install.sh | bash",
    windows: "irm https://zoth.nullai.tech/install.ps1 | iex",
    appimage: "chmod +x Zoth_Studio-v2.6.0-x86_64.AppImage && ./Zoth_Studio-v2.6.0-x86_64.AppImage",
  };

  var DOWNLOAD_PACKAGES = {
    linux: {
      primary: { label: "📥 Download Linux AppImage (v2.6.0)", href: "https://github.com/NullAITech/zoth-studio/raw/main/dist-linux/Zoth_Studio-v2.6.0-x86_64.AppImage", size: "78 MB" },
      secondary: [
        { label: "Debian / Ubuntu (.deb)", href: "https://github.com/NullAITech/zoth-studio/raw/main/dist-linux/zoth-studio_2.6.0_all.deb" },
        { label: "Universal (.run)", href: "https://github.com/NullAITech/zoth-studio/raw/main/dist-linux/zoth-linux-x86_64.run" }
      ]
    },
    windows: {
      primary: { label: "📥 Download Windows App (.exe)", href: "https://github.com/NullAITech/zoth-studio/raw/main/dist-windows/zoth-windows-x86_64.exe", size: "84 MB" },
      secondary: [
        { label: "Portable (.zip)", href: "https://github.com/NullAITech/zoth-studio/raw/main/dist-windows/zoth-studio-v2.6.0-windows-x86_64.zip" }
      ]
    },
    mac: {
      primary: { label: "📥 Download macOS Universal Package", href: "https://github.com/NullAITech/zoth-studio/raw/main/dist-linux/Zoth_Studio-v2.6.0-x86_64.AppImage", size: "78 MB" },
      secondary: [
        { label: "CLI Installer Script", href: "#terminal-tab" }
      ]
    }
  };

  /* Workstations that bind loopback. Catalog pages (home, docs, comic, studio index) stay public. */
  var TOOL_PATH = /\/(vault|memory|signal)(\/|$)|\/studio\/(?!index\.html(?:$|\?))[^/]+\.html/i;

  var PUBLIC_HOSTS = /^(zoth\.nullai\.tech|www\.zoth\.nullai\.tech|nullai\.tech|www\.nullai\.tech)$/;

  function hostname() {
    return (location.hostname || "").toLowerCase().replace(/^\[|\]$/g, "");
  }

  function isPrivateLan(h) {
    if (/^10\.\d+\.\d+\.\d+$/.test(h)) return true;
    if (/^192\.168\.\d+\.\d+$/.test(h)) return true;
    var m = h.match(/^172\.(\d+)\.\d+\.\d+$/);
    if (m) {
      var n = +m[1];
      return n >= 16 && n <= 31;
    }
    return false;
  }

  function isTailscale(h) {
    if (h.endsWith(".ts.net") || h.endsWith(".tailscale.net")) return true;
    var m = h.match(/^100\.(\d+)\.\d+\.\d+$/);
    if (!m) return false;
    var n = +m[1];
    return n >= 64 && n <= 127;
  }

  function isLoopbackHost(h) {
    return (
      h === "127.0.0.1" ||
      h === "localhost" ||
      h === "::1" ||
      h === "0.0.0.0" ||
      h.endsWith(".local") ||
      h.endsWith(".internal") ||
      isPrivateLan(h) ||
      isTailscale(h)
    );
  }

  function loopback() {
    return isLoopbackHost(hostname());
  }

  function isPublicHub() {
    var h = hostname();
    if (PUBLIC_HOSTS.test(h)) return true;
    if (h.endsWith(".netlify.app") || h.endsWith(".netlify.com")) return true;
    if (h.endsWith(".nullai.tech")) return true;
    return !isLoopbackHost(h);
  }

  function onDeck() {
    return location.port === "8484";
  }

  function forcePreview() {
    return /(?:\?|&)preview=1(?:&|$)/.test(location.search);
  }

  function runtimeKind() {
    if (onDeck()) return "deck";
    if (isTailscale(hostname())) return "tailscale";
    if (isLoopbackHost(hostname())) return "local-preview";
    return "public";
  }

  function isToolPath(path) {
    var p = path || location.pathname || "";
    if (p.length > 1 && p.charAt(p.length - 1) === "/") p = p.slice(0, -1);
    return TOOL_PATH.test(p);
  }

  function shouldLockTools() {
    return isPublicHub() && isToolPath() && !forcePreview() && !onDeck();
  }

  function detectOs() {
    var ua = (navigator.userAgent || "").toLowerCase();
    var plat = (navigator.userAgentData && navigator.userAgentData.platform) || navigator.platform || "";
    plat = String(plat).toLowerCase();
    if (/win/.test(plat) || /windows/.test(ua)) return "windows";
    if (/mac/.test(plat) || /macintosh/.test(ua)) return "mac";
    return "linux";
  }

  function isLocalHref(href) {
    if (!href) return false;
    if (/127\.0\.0\.1:8484|localhost:8484/.test(href)) return true;
    if (href === DECK || href === DECK + "/") return true;
    return false;
  }

  var aliveCache = null;
  function deckAlive() {
    if (forcePreview()) return Promise.resolve(false);
    if (onDeck()) return Promise.resolve(true);
    if (!loopback()) return Promise.resolve(false);
    if (aliveCache) return aliveCache;
    aliveCache = new Promise(function (resolve) {
      var ctrl = new AbortController();
      var t = setTimeout(function () { ctrl.abort(); }, 1100);
      fetch(HEALTH, { cache: "no-store", signal: ctrl.signal, mode: "cors" })
        .then(function (r) { clearTimeout(t); resolve(!!r.ok); })
        .catch(function () { clearTimeout(t); resolve(false); });
    });
    return aliveCache;
  }

  function css() {
    return [
      ":root{--zoth-ribbon:0px}",
      "html.zoth-preview{--zoth-ribbon:38px;scroll-padding-top:calc(54px + 38px + 12px)}",
      "html.zoth-preview body{padding-top:calc(54px + 38px)!important}",
      "html.zoth-preview header.bar, html.zoth-preview header.topbar, html.zoth-preview .comic-topbar, html.zoth-preview header[role=\"banner\"], html.zoth-preview #topbar{top:38px!important}",
      "html.zoth-preview nav.drawer, html.zoth-preview #drawer{top:calc(54px + 38px)!important}",
      "#zoth-ribbon{position:fixed;top:0;left:0;right:0;z-index:100000;display:none;align-items:center;justify-content:space-between;gap:10px;",
      "height:38px;padding:0 16px;background:rgba(10,14,26,0.96);backdrop-filter:blur(16px);color:#f7f4ee;border-bottom:1px solid rgba(0,240,255,0.35);",
      "font-family:Inter,system-ui,sans-serif;font-size:.82rem;line-height:1;box-shadow:0 4px 20px rgba(0,0,0,0.5);box-sizing:border-box}",
      "#zoth-ribbon.on{display:flex}",
      "#zoth-ribbon .zoth-r-left{display:flex;align-items:center;gap:8px;overflow:hidden;min-width:0;flex:1 1 auto}",
      "#zoth-ribbon .zoth-r-badge{background:rgba(0,240,255,0.15);color:#00f0ff;border:1px solid rgba(0,240,255,0.4);font-family:JetBrains Mono,monospace;font-size:0.68rem;padding:2px 6px;border-radius:4px;font-weight:700;letter-spacing:0.04em;flex-shrink:0}",
      "#zoth-ribbon .zoth-r-text-desktop{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;display:inline}",
      "#zoth-ribbon .zoth-r-text-mobile{display:none}",
      "#zoth-ribbon .zoth-r-actions{display:flex;align-items:center;gap:8px;flex-shrink:0}",
      "#zoth-ribbon button.zoth-btn-install{background:linear-gradient(135deg,#e8c872,#fbbf24);color:#0a0e1a;font-family:JetBrains Mono,monospace;font-size:.72rem;font-weight:700;padding:4px 12px;border-radius:999px;border:none;cursor:pointer;box-shadow:0 0 10px rgba(232,200,114,0.4);transition:all .2s ease;white-space:nowrap;min-height:28px!important;max-height:30px!important;height:28px!important;width:auto!important;max-width:none!important;line-height:1!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;box-sizing:border-box!important}",
      "#zoth-ribbon button.zoth-btn-install:hover{transform:scale(1.04);box-shadow:0 0 16px rgba(232,200,114,0.7)}",
      "#zoth-ribbon a.zoth-btn-social{background:rgba(255,255,255,0.08);color:#e2e8f0;font-family:JetBrains Mono,monospace;font-size:.72rem;padding:5px 10px;border-radius:999px;border:1px solid rgba(255,255,255,0.15);text-decoration:none;transition:all .2s ease;white-space:nowrap;min-height:28px!important;max-height:30px!important;height:28px!important;line-height:1!important;display:inline-flex!important;align-items:center!important;box-sizing:border-box!important}",
      "#zoth-ribbon a.zoth-btn-social:hover{background:rgba(255,255,255,0.15);color:#fff}",
      "@media (max-width:760px){",
      "#zoth-ribbon{height:40px;font-size:.74rem;padding:0 10px;gap:6px}",
      "html.zoth-preview{--zoth-ribbon:40px;scroll-padding-top:calc(54px + 40px + 8px)}",
      "html.zoth-preview body{padding-top:calc(54px + 40px)!important}",
      "html.zoth-preview header.bar, html.zoth-preview header.topbar, html.zoth-preview .comic-topbar, html.zoth-preview header[role=\"banner\"], html.zoth-preview #topbar{top:40px!important}",
      "html.zoth-preview nav.drawer, html.zoth-preview #drawer{top:calc(54px + 40px)!important}",
      "#zoth-ribbon .zoth-hide-mobile{display:none}",
      "#zoth-ribbon .zoth-r-badge{font-size:0.62rem;padding:2px 5px}",
      "#zoth-ribbon .zoth-r-text-desktop{display:none}",
      "#zoth-ribbon .zoth-r-text-mobile{display:inline;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:0.72rem;min-width:0}",
      "#zoth-ribbon button.zoth-btn-install{padding:3px 9px!important;font-size:.66rem!important;min-height:26px!important;max-height:28px!important;height:26px!important;width:auto!important;line-height:1!important}",
      "}",
      
      "#zoth-modal{position:fixed;inset:0;z-index:999999;display:none;align-items:center;justify-content:center;padding:16px;background:rgba(3,5,10,0.85);backdrop-filter:blur(12px)}",
      "#zoth-modal.on{display:flex;animation:zothModalFadeIn .2s ease-out}",
      "@keyframes zothModalFadeIn{from{opacity:0;transform:scale(0.97)}to{opacity:1;transform:scale(1)}}",
      "#zoth-modal .sheet{width:min(38rem,100%);max-height:92vh;overflow-y:auto;background:#090d16;color:#f7f4ee;border:1px solid rgba(0,240,255,0.3);border-radius:20px;padding:28px 26px 24px;font-family:Inter,system-ui,sans-serif;box-shadow:0 20px 60px rgba(0,0,0,0.8),0 0 40px rgba(0,240,255,0.12);position:relative}",
      "#zoth-modal .close-btn{position:absolute;top:18px;right:18px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);color:#94a3b8;width:32px;height:32px;border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:1.1rem;transition:all .2s ease}",
      "#zoth-modal .close-btn:hover{background:rgba(255,255,255,0.15);color:#fff;transform:rotate(90deg)}",
      "#zoth-modal .header-badge{display:inline-flex;align-items:center;gap:6px;font-family:JetBrains Mono,monospace;font-size:.7rem;letter-spacing:.12em;text-transform:uppercase;color:#00f0ff;background:rgba(0,240,255,0.1);border:1px solid rgba(0,240,255,0.3);padding:3px 8px;border-radius:6px;margin:0 0 12px}",
      "#zoth-modal h2{font-family:Syne,Inter,sans-serif;font-weight:800;letter-spacing:-.02em;font-size:1.6rem;line-height:1.2;margin:0 0 8px;color:#ffffff}",
      "#zoth-modal .modal-sub{color:#94a3b8;line-height:1.55;margin:0 0 20px;font-size:.92rem}",
      
      "#zoth-modal .mode-tabs{display:flex;gap:6px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);padding:5px;border-radius:12px;margin:0 0 18px}",
      "#zoth-modal .mode-tab{flex:1;background:none;border:0;color:#94a3b8;cursor:pointer;font-family:JetBrains Mono,monospace;font-size:.76rem;font-weight:600;padding:8px 10px;border-radius:8px;text-align:center;transition:all .2s ease;display:flex;align-items:center;justify-content:center;gap:6px}",
      "#zoth-modal .mode-tab.active{color:#fff;background:rgba(0,240,255,0.15);border:1px solid rgba(0,240,255,0.4);box-shadow:0 0 12px rgba(0,240,255,0.2)}",
      
      "#zoth-modal .tab-panel{display:none}",
      "#zoth-modal .tab-panel.active{display:block}",
      
      "#zoth-modal .primary-dl-box{background:linear-gradient(180deg,rgba(0,240,255,0.08) 0%,rgba(0,0,0,0.3) 100%);border:1px solid rgba(0,240,255,0.35);border-radius:14px;padding:18px;margin:0 0 16px;text-align:center}",
      "#zoth-modal .primary-dl-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;width:100%;background:linear-gradient(135deg,#00f0ff,#38bdf8);color:#040711;font-family:Syne,sans-serif;font-weight:800;font-size:1.05rem;padding:14px 20px;border-radius:12px;text-decoration:none;border:none;cursor:pointer;box-shadow:0 0 20px rgba(0,240,255,0.4);transition:all .2s ease}",
      "#zoth-modal .primary-dl-btn:hover{transform:translateY(-2px);box-shadow:0 0 30px rgba(0,240,255,0.6)}",
      "#zoth-modal .alt-links{display:flex;justify-content:center;flex-wrap:wrap;gap:12px;margin-top:12px;font-size:.78rem;color:#94a3b8}",
      "#zoth-modal .alt-links a{color:#cbd5e1;text-decoration:none;border-bottom:1px dashed rgba(255,255,255,0.3)}",
      "#zoth-modal .alt-links a:hover{color:#00f0ff;border-color:#00f0ff}",
      
      "#zoth-modal .steps-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin:0 0 16px}",
      "@media (max-width:580px){#zoth-modal .steps-grid{grid-template-columns:1fr}}",
      "#zoth-modal .step-card{background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:10px;padding:12px 10px;text-align:center}",
      "#zoth-modal .step-num{font-family:JetBrains Mono,monospace;font-size:.7rem;font-weight:700;color:#e8c872;margin-bottom:4px}",
      "#zoth-modal .step-title{font-size:.82rem;font-weight:700;color:#f1f5f9;margin-bottom:3px}",
      "#zoth-modal .step-desc{font-size:.72rem;color:#94a3b8;line-height:1.4}",
      
      "#zoth-modal .cmd-box{border:1px solid rgba(255,255,255,0.1);border-radius:12px;overflow:hidden;background:#05070d;margin:0 0 14px}",
      "#zoth-modal .cmd-tabs{display:flex;gap:4px;padding:6px;background:rgba(255,255,255,0.03);border-bottom:1px solid rgba(255,255,255,0.08);overflow-x:auto}",
      "#zoth-modal .cmd-tab{background:none;border:0;color:#94a3b8;cursor:pointer;font-family:JetBrains Mono,monospace;font-size:.7rem;padding:5px 9px;border-radius:6px;white-space:nowrap}",
      "#zoth-modal .cmd-tab.on{color:#f7f4ee;background:rgba(232,200,114,0.15);border:1px solid rgba(232,200,114,0.3)}",
      "#zoth-modal .cmd-row{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:12px 14px}",
      "#zoth-modal code{font-family:JetBrains Mono,monospace;font-size:.76rem;color:#e8c872;word-break:break-all}",
      "#zoth-modal .cmd-copy{background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.16);color:#f7f4ee;border-radius:8px;font-family:JetBrains Mono,monospace;font-size:.7rem;padding:6px 12px;cursor:pointer;white-space:nowrap;transition:all .2s ease}",
      "#zoth-modal .cmd-copy:hover{background:rgba(255,255,255,0.18)}",
      
      "#zoth-modal .modal-footer{display:flex;align-items:center;justify-content:space-between;gap:10px;padding-top:14px;border-top:1px solid rgba(255,255,255,0.08);font-size:.82rem}",
      "#zoth-modal .btn-dismiss{background:none;border:none;color:#94a3b8;cursor:pointer;font-family:Inter,sans-serif;padding:6px 10px}",
      "#zoth-modal .btn-dismiss:hover{color:#fff}",
      "#zoth-modal .btn-social-wall{color:#e8c872;text-decoration:none;font-family:JetBrains Mono,monospace;font-weight:600}",

      "#zoth-tool-lock{position:fixed;inset:0;z-index:999990;display:none;align-items:center;justify-content:center;padding:20px;background:rgba(5,6,10,0.92);backdrop-filter:blur(18px)}",
      "#zoth-tool-lock.on{display:flex}",
      "#zoth-tool-lock .lock-sheet{width:min(36rem,100%);background:var(--panel,#0d1222);color:var(--text,#f8fafc);border:1px solid var(--gold,#fbbf24);border-radius:22px;padding:32px 28px;font-family:var(--font-sans,Inter,system-ui,sans-serif);box-shadow:0 24px 80px rgba(0,0,0,0.55)}",
      "#zoth-tool-lock .lock-kicker{font-family:var(--font-mono,ui-monospace,monospace);font-size:.72rem;letter-spacing:.16em;text-transform:uppercase;color:var(--gold,#fbbf24);margin:0 0 12px}",
      "#zoth-tool-lock h2{font-family:var(--font-display,Syne,serif);font-size:clamp(1.5rem,3vw,2.1rem);letter-spacing:-.03em;margin:0 0 10px;line-height:1.15}",
      "#zoth-tool-lock p{color:var(--text-subhead,#cbd5e1);line-height:1.55;margin:0 0 18px}",
      "#zoth-tool-lock .lock-actions{display:flex;flex-wrap:wrap;gap:10px}",
      "#zoth-tool-lock .lock-on{display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:10px 20px;border-radius:999px;background:var(--gold,#fbbf24);color:#14110a;font-family:var(--font-mono,ui-monospace,monospace);font-weight:700;text-decoration:none;border:0;cursor:pointer}",
      "#zoth-tool-lock .lock-ghost{display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:10px 18px;border-radius:999px;border:1px solid var(--line,rgba(255,255,255,.18));background:transparent;color:var(--text,#f8fafc);font-family:var(--font-mono,ui-monospace,monospace);font-weight:600;text-decoration:none}",
      "html.zoth-tool-locked body{overflow:hidden}",
      "html.zoth-tool-locked #zoth-guide{display:none!important}"
    ].join("");
  }

  function ensureUi() {
    if (document.getElementById("zoth-modal")) return;
    var st = document.createElement("style");
    st.textContent = css();
    document.head.appendChild(st);

    var os = detectOs();
    var pkg = DOWNLOAD_PACKAGES[os] || DOWNLOAD_PACKAGES.linux;
    var cmd = INSTALL_COMMANDS[os] || INSTALL_COMMANDS.linux;

    var ribbon = document.createElement("div");
    ribbon.id = "zoth-ribbon";
    ribbon.innerHTML =
      '<div class="zoth-r-left">' +
        '<span class="zoth-r-badge">PREVIEW</span>' +
        '<span class="zoth-r-text-desktop">Full sovereign multi-agent tools run on your local machine (:8484)</span>' +
        '<span class="zoth-r-text-mobile">Local Hub (:8484)</span>' +
      '</div>' +
      '<div class="zoth-r-actions">' +
        '<a href="/social/" class="zoth-btn-social zoth-hide-mobile">🎬 46 Video Demos</a>' +
        '<button type="button" class="zoth-btn-install" data-zoth-open>' +
          '<span class="zoth-r-text-desktop">🚀 Install Desktop App</span>' +
          '<span class="zoth-r-text-mobile">⚡ Install</span>' +
        '</button>' +
      '</div>';
    document.body.appendChild(ribbon);

    var secondaryLinksHtml = pkg.secondary.map(function (s) {
      return '<a href="' + s.href + '">' + s.label + '</a>';
    }).join("");

    var modal = document.createElement("div");
    modal.id = "zoth-modal";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-labelledby", "zoth-modal-title");
    modal.innerHTML =
      '<div class="sheet">' +
        '<button class="close-btn" data-zoth-close aria-label="Close modal">✕</button>' +
        '<div class="header-badge">⚡ 100% Sovereign · Local-First AI</div>' +
        '<h2 id="zoth-modal-title">Get Zoth Studio for Your Desktop</h2>' +
        '<p class="modal-sub">Run 24 AI agent swarms, 3D CAD Omniverse, and Argon2id zero-leak vaults directly on your own computer with zero cloud subscriptions.</p>' +

        '<div class="mode-tabs">' +
          '<button class="mode-tab active" data-tab="desktop">🖥️ Desktop App (Easiest)</button>' +
          '<button class="mode-tab" data-tab="terminal">⚡ 1-Click Terminal</button>' +
          '<button class="mode-tab" data-tab="web">🌐 Web Tour</button>' +
        '</div>' +

        '<div class="tab-panel active" id="tab-desktop">' +
          '<div class="primary-dl-box">' +
            '<a href="' + pkg.primary.href + '" class="primary-dl-btn" id="zoth-main-dl">' +
              pkg.primary.label +
            '</a>' +
            '<div class="alt-links">' +
              '<span>Also available: </span>' +
              secondaryLinksHtml +
            '</div>' +
          '</div>' +
          '<div class="steps-grid">' +
            '<div class="step-card">' +
              '<div class="step-num">STEP 1</div>' +
              '<div class="step-title">📥 Download</div>' +
              '<div class="step-desc">Grab the standalone binary for your OS.</div>' +
            '</div>' +
            '<div class="step-card">' +
              '<div class="step-num">STEP 2</div>' +
              '<div class="step-title">⚡ Double Click</div>' +
              '<div class="step-desc">Launch instantly — zero cloud signups needed.</div>' +
            '</div>' +
            '<div class="step-card">' +
              '<div class="step-num">STEP 3</div>' +
              '<div class="step-title">🔒 Pure Privacy</div>' +
              '<div class="step-desc">Local weights & swarms on :8484.</div>' +
            '</div>' +
          '</div>' +
        '</div>' +

        '<div class="tab-panel" id="tab-terminal">' +
          '<div class="cmd-box">' +
            '<div class="cmd-tabs">' +
              '<button class="cmd-tab' + (os === "linux" ? " on" : "") + '" type="button" data-cmd="' + INSTALL_COMMANDS.linux + '">Linux</button>' +
              '<button class="cmd-tab' + (os === "mac" ? " on" : "") + '" type="button" data-cmd="' + INSTALL_COMMANDS.mac + '">macOS</button>' +
              '<button class="cmd-tab' + (os === "windows" ? " on" : "") + '" type="button" data-cmd="' + INSTALL_COMMANDS.windows + '">Windows (PowerShell)</button>' +
              '<button class="cmd-tab" type="button" data-cmd="' + INSTALL_COMMANDS.appimage + '">AppImage</button>' +
            '</div>' +
            '<div class="cmd-row">' +
              '<code id="zoth-cmd">' + cmd + '</code>' +
              '<button class="cmd-copy" type="button" id="zoth-copy">Copy</button>' +
            '</div>' +
          '</div>' +
          '<p style="font-size:0.78rem; color:#94a3b8; margin:0 0 14px;">Paste into your terminal. Auto-detects dependencies, configures Ollama sockets, and starts the operator deck.</p>' +
        '</div>' +

        '<div class="tab-panel" id="tab-web">' +
          '<div style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius:12px; padding:18px; margin-bottom:14px; text-align:center;">' +
            '<p style="color:#cbd5e1; font-size:0.92rem; line-height:1.5; margin:0 0 12px;">Want to explore without downloading? Check out our 46 live video showcases featuring all 24 companion spirits, 3D CAD tools, and real-time swarm consensus.</p>' +
            '<a href="/social/" class="primary-dl-btn" style="background:linear-gradient(135deg,#e8c872,#fbbf24); color:#0a0e1a; font-size:0.92rem; padding:10px 18px;">🎬 Open Social Wall & Video Forge →</a>' +
          '</div>' +
        '</div>' +

        '<div class="modal-footer">' +
          '<button class="btn-dismiss" data-zoth-close>Stay on Web Preview</button>' +
          '<a href="/social/" class="btn-social-wall">View 46 Video Demos →</a>' +
        '</div>' +
      '</div>';
    document.body.appendChild(modal);

    modal.addEventListener("click", function (e) {
      if (e.target === modal) hide();
    });
    modal.querySelectorAll("[data-zoth-close]").forEach(function (el) {
      el.addEventListener("click", hide);
    });
    ribbon.querySelectorAll("[data-zoth-open]").forEach(function (el) {
      el.addEventListener("click", show);
    });

    modal.querySelectorAll(".mode-tab").forEach(function (tab) {
      tab.addEventListener("click", function () {
        modal.querySelectorAll(".mode-tab").forEach(function (t) { t.classList.remove("active"); });
        modal.querySelectorAll(".tab-panel").forEach(function (p) { p.classList.remove("active"); });
        tab.classList.add("active");
        var targetId = "tab-" + tab.getAttribute("data-tab");
        var panel = document.getElementById(targetId);
        if (panel) panel.classList.add("active");
      });
    });

    modal.querySelectorAll(".cmd-tab").forEach(function (tab) {
      tab.addEventListener("click", function () {
        modal.querySelectorAll(".cmd-tab").forEach(function (t) { t.classList.remove("on"); });
        tab.classList.add("on");
        document.getElementById("zoth-cmd").textContent = tab.getAttribute("data-cmd");
      });
    });

    document.getElementById("zoth-copy").addEventListener("click", function () {
      var t = document.getElementById("zoth-cmd").textContent;
      if (navigator.clipboard) navigator.clipboard.writeText(t);
      this.textContent = "✓ Copied!";
      var btn = this;
      setTimeout(function () { btn.textContent = "Copy"; }, 1600);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") hide();
    });
  }

  function show() {
    ensureUi();
    var m = document.getElementById("zoth-modal");
    if (m) m.classList.add("on");
  }

  function hide() {
    var m = document.getElementById("zoth-modal");
    if (m) m.classList.remove("on");
  }

  function ribbon(on) {
    ensureUi();
    var r = document.getElementById("zoth-ribbon");
    if (!r) return;
    if (on) {
      document.documentElement.classList.add("zoth-preview");
      r.classList.add("on");
    } else {
      document.documentElement.classList.remove("zoth-preview");
      r.classList.remove("on");
    }
  }

  function ensureLock() {
    if (document.getElementById("zoth-tool-lock")) return;
    ensureUi();
    var lock = document.createElement("div");
    lock.id = "zoth-tool-lock";
    lock.setAttribute("role", "dialog");
    lock.setAttribute("aria-modal", "true");
    lock.setAttribute("aria-labelledby", "zoth-lock-title");
    lock.innerHTML =
      '<div class="lock-sheet">' +
        '<p class="lock-kicker">Local workstation · loopback only</p>' +
        '<h2 id="zoth-lock-title">This tool runs on your machine, not in the cloud.</h2>' +
        '<p>zoth.nullai.tech is the public preview. Swarm, vault, signal, and studio workstations bind <code>127.0.0.1:8484</code>. Opening them here would look broken. Install Zoth Studio locally — or open the catalog while you wait.</p>' +
        '<div class="lock-actions">' +
          '<button type="button" class="lock-on" data-zoth-open>Install locally</button>' +
          '<a class="lock-ghost" href="/studio/">Studio catalog</a>' +
          '<a class="lock-ghost" href="/#install">Install section</a>' +
          '<a class="lock-ghost" href="?preview=1">Peek static preview</a>' +
        '</div>' +
      '</div>';
    document.body.appendChild(lock);
    var openBtn = lock.querySelector("[data-zoth-open]");
    if (openBtn) openBtn.addEventListener("click", show);
  }

  function showLock() {
    ensureLock();
    var lock = document.getElementById("zoth-tool-lock");
    if (lock) lock.classList.add("on");
    document.documentElement.classList.add("zoth-tool-locked");
  }

  function intercept(e) {
    var a = e.target && e.target.closest ? e.target.closest("a") : null;
    if (!a) return;
    var href = a.getAttribute("href") || "";
    var local = isLocalHref(href) || a.classList.contains("js-deck");
    if (!local) return;
    if (onDeck() && !forcePreview()) return;
    e.preventDefault();
    e.stopPropagation();
    deckAlive().then(function (ok) {
      if (ok) {
        location.href = onDeck() ? "/" : DECK + "/";
        return;
      }
      show();
    });
  }

  function rewriteHubLinks() {
    document.querySelectorAll("a.js-hub, a[href='/hub/'], a[href='/hub'], a[href^='/hub/#']").forEach(function (a) {
      var href = a.getAttribute("href") || "";
      var hash = href.indexOf("#") >= 0 ? href.slice(href.indexOf("#")) : "";
      a.setAttribute("href", onDeck() ? "/hub/" + hash : (hash || "/"));
    });
  }

  function stampRuntime() {
    var kind = runtimeKind();
    var html = document.documentElement;
    html.setAttribute("data-zoth-runtime", kind);
    html.setAttribute("data-zoth-public", isPublicHub() ? "1" : "0");
    html.setAttribute("data-zoth-local", loopback() ? "1" : "0");
  }

  function boot() {
    stampRuntime();
    rewriteHubLinks();
    ensureUi();
    document.addEventListener("click", intercept, true);
    if (isPublicHub()) ribbon(true);
    if (shouldLockTools()) showLock();
  }

  window.ZothRuntime = {
    kind: runtimeKind,
    isPublic: isPublicHub,
    isLocal: loopback,
    isDeck: onDeck,
    isTailscale: function () { return isTailscale(hostname()); },
    isToolPath: isToolPath,
    shouldLockTools: shouldLockTools,
    hostname: hostname
  };

  window.ZothGate = {
    show: show,
    hide: hide,
    deckAlive: deckAlive,
    detectOs: detectOs,
    runtime: window.ZothRuntime
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
