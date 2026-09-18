import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import toolRegistry from '../data/tools.json';
import HexMatrixCanvas from '../components/HexMatrixCanvas';
import CrtOverlay from '../components/CrtOverlay';
import AgentStatusHud from '../components/AgentStatusHud';
import CommandTerminal from '../components/CommandTerminal';
import { audioSynth } from '../utils/audioSynth';
import { getFallbackSimulation, executeCliCommand } from '../utils/offlineEngine';

const THEME_COLORS = {
  red: '#ff0033',
  green: '#00ff66',
  amber: '#ffaa00',
  purple: '#b827fc',
};

const TYPING_DELAYS = {
  instant: 0,
  fast: 6,
  normal: 18,
  slow: 40,
};

const TerminalPage = () => {
  const [target, setTarget] = useState('target.corp');
  const [selectedToolId, setSelectedToolId] = useState(toolRegistry[0]?.id || 'nmap');
  const [toolLogs, setToolLogs] = useState([
    '[SYSTEM] HexStrike Neural Strike Platform Initialized.',
    '[SYSTEM] LocalAI Cognitive Subsystem Online (Capped @ 6GB RAM).',
    '[TIP] Type "help" in the bottom CLI prompt or select a tool above and click EXECUTE STRIKE.',
  ]);
  const [aiLogs, setAiLogs] = useState([
    '[NEURAL CORE] Autonomous Reasoning Core Active.',
    '[MODEL] Hermes-3-Llama-3-8B quantized Q4_K_M loaded in memory.',
    '[DEFENSE] MITRE ATT&CK correlation matrix synchronized.',
  ]);
  const [executing, setExecuting] = useState(false);
  const [showFuture, setShowFuture] = useState(false);
  const [showHud, setShowHud] = useState(true);
  
  // Customization Toggles
  const [crtEnabled, setCrtEnabled] = useState(true);
  const [matrixEnabled, setMatrixEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [themeName, setThemeName] = useState('red');
  const [typingSpeed, setTypingSpeed] = useState('fast');
  const [rawSearchTerm, setRawSearchTerm] = useState('');

  // References for auto-scrolling
  const toolRef = useRef(null);
  const aiRef = useRef(null);

  const themeColor = THEME_COLORS[themeName] || THEME_COLORS.red;
  const currentTool = toolRegistry.find(t => t.id === selectedToolId) || toolRegistry[0];

  // Set theme data attribute on body
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', themeName);
  }, [themeName]);

  // Sync audio toggle with synthesizer
  useEffect(() => {
    audioSynth.setMuted(!audioEnabled);
  }, [audioEnabled]);

  // Auto-scroll effect
  useEffect(() => {
    toolRef.current?.scrollIntoView({ behavior: 'smooth' });
    aiRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [toolLogs, aiLogs]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleGlobalKey = (e) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'l' || e.key === 'L') {
          e.preventDefault();
          clearLogs();
        } else if (e.key === 'b' || e.key === 'B') {
          e.preventDefault();
          setCrtEnabled(prev => !prev);
          toast.info(`CRT Overlay: ${!crtEnabled ? 'ENABLED' : 'DISABLED'}`);
        } else if (e.key === 'm' || e.key === 'M') {
          e.preventDefault();
          setMatrixEnabled(prev => !prev);
          toast.info(`Hex Matrix: ${!matrixEnabled ? 'ENABLED' : 'DISABLED'}`);
        } else if (e.key === 's' || e.key === 'S') {
          e.preventDefault();
          setAudioEnabled(prev => !prev);
          toast.info(`Audio Synth: ${!audioEnabled ? 'ENABLED' : 'MUTED'}`);
        }
      }
    };
    window.addEventListener('keydown', handleGlobalKey);
    return () => window.removeEventListener('keydown', handleGlobalKey);
  }, [crtEnabled, matrixEnabled, audioEnabled]);

  // Typewriter streaming helper for AI logs
  const streamTextToLogs = async (text, setter) => {
    const delay = TYPING_DELAYS[typingSpeed] || 0;
    if (delay === 0) {
      setter(prev => [...prev, text]);
      return;
    }

    setter(prev => [...prev, '']);
    let current = '';
    for (let i = 0; i < text.length; i += 2) {
      current += text.slice(i, i + 2);
      setter(prev => {
        const copy = [...prev];
        copy[copy.length - 1] = current;
        return copy;
      });
      if (i % 24 === 0) {
        audioSynth.playKeyClick();
      }
      await new Promise(r => setTimeout(r, delay));
    }
  };

  const clearLogs = () => {
    setToolLogs(['[SYSTEM] Terminal logs cleared. Ready for next command.']);
    setAiLogs(['[NEURAL CORE] Context window refreshed.']);
    audioSynth.playSynthTone(400, 'sine', 0.08);
    toast.info('Terminal Cleared');
  };

  // Execution dispatch (GUI or CLI)
  const executeStrike = async (customToolId = null, customTarget = null) => {
    const toolToUse = customToolId || selectedToolId;
    const targetToUse = customTarget || target;

    if (!targetToUse || executing) return;
    setExecuting(true);
    audioSynth.playRadarSweep();

    const toolObj = toolRegistry.find(t => t.id === toolToUse) || { name: toolToUse.toUpperCase() };

    setToolLogs(prev => [
      ...prev,
      `\n>>> [DISPATCH] ${toolObj.name.toUpperCase()} ON ${targetToUse}...`,
      `[*] Target resolved. Initializing payload streams...`
    ]);
    setAiLogs(prev => [
      ...prev,
      `\n>>> [COGNITIVE CORE] ANALYZING TARGET SURFACE: ${targetToUse}...`
    ]);
    toast.info(`Initiating ${toolObj.name} on ${targetToUse}...`);

    try {
      // Attempt connection to live backend
      const response = await axios.post(
        'http://localhost:8000/execute',
        { tool: toolToUse, target: targetToUse },
        { timeout: 4000 }
      );

      const output = response.data?.output || 'No standard output returned from backend.';
      const analysis = response.data?.analysis || 'AI reasoning unavailable from local model.';

      setToolLogs(prev => [...prev, output]);
      await streamTextToLogs(analysis, setAiLogs);
      audioSynth.playCommandChime();
      toast.success('Strike Execution Complete');
    } catch {
      // Defensive fallback to built-in simulation engine
      const sim = getFallbackSimulation(toolToUse, targetToUse);
      
      setToolLogs(prev => [
        ...prev,
        `[BRIDGE OFFLINE] Falling back to Neural Sandbox Simulation Engine.`,
        sim.output
      ]);
      await streamTextToLogs(sim.analysis, setAiLogs);
      audioSynth.playCommandChime();
      toast.success('Strike Simulation Executed');
    } finally {
      setExecuting(false);
    }
  };

  // CLI Command Handler
  const handleCliCommand = async (cmdString) => {
    audioSynth.playKeyClick();
    const result = await executeCliCommand(cmdString);
    if (!result) return;

    if (result.type === 'clear') {
      clearLogs();
      return;
    }

    if (result.type === 'matrix') {
      setMatrixEnabled(prev => !prev);
      toast.info('Hex Matrix Rain Toggled');
    }

    if (result.type === 'synth') {
      const parts = cmdString.split(' ');
      const sub = parts[1]?.toLowerCase();
      if (sub === 'radar') audioSynth.playRadarSweep();
      else if (sub === 'beep') audioSynth.playErrorBuzz();
      else audioSynth.playCommandChime();
    }

    // CLI configuration modifiers
    const parts = cmdString.trim().split(/\s+/);
    if (parts[0].toLowerCase() === 'theme' && parts[1]) {
      const col = parts[1].toLowerCase();
      if (THEME_COLORS[col]) {
        setThemeName(col);
        toast.success(`Theme set to ${col.toUpperCase()}`);
      }
    }
    if (parts[0].toLowerCase() === 'speed' && parts[1]) {
      const spd = parts[1].toLowerCase();
      if (TYPING_DELAYS[spd] !== undefined) {
        setTypingSpeed(spd);
        toast.success(`Typing speed set to ${spd.toUpperCase()}`);
      }
    }
    if (parts[0].toLowerCase() === 'audio' && parts[1]) {
      const state = parts[1].toLowerCase() === 'on';
      setAudioEnabled(state);
      toast.info(`Audio ${state ? 'ENABLED' : 'MUTED'}`);
    }
    if (parts[0].toLowerCase() === 'crt' && parts[1]) {
      const state = parts[1].toLowerCase() === 'on';
      setCrtEnabled(state);
      toast.info(`CRT ${state ? 'ENABLED' : 'DISABLED'}`);
    }
    if (parts[0].toLowerCase() === 'export') {
      exportLogs(parts[1] || 'json');
      return;
    }

    // Append CLI Output
    setToolLogs(prev => [
      ...prev,
      `\n$ ${cmdString}`,
      result.output || ''
    ]);

    if (result.analysis) {
      await streamTextToLogs(result.analysis, setAiLogs);
    }
  };

  // Export audit logs
  const exportLogs = (format = 'json') => {
    let content = '';
    let mimeType = 'text/plain';
    let fileName = `hexstrike-audit-${Date.now()}`;

    if (format === 'json') {
      content = JSON.stringify({
        timestamp: new Date().toISOString(),
        target: target,
        tool: selectedToolId,
        rawLogs: toolLogs,
        aiLogs: aiLogs,
      }, null, 2);
      mimeType = 'application/json';
      fileName += '.json';
    } else {
      content = `=== HEXSTRIKE AUDIT LOG ===\nDate: ${new Date().toISOString()}\nTarget: ${target}\n\n--- RAW TOOL LOGS ---\n${toolLogs.join('\n')}\n\n--- AI INTELLIGENCE ---\n${aiLogs.join('\n')}`;
      fileName += '.txt';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${fileName}`);
  };

  const futureFeatures = [
    { name: 'Metasploit Pro Bridge', desc: 'Autonomous CVE matching & interactive reverse meterpreter tunnel' },
    { name: 'Live Packet Interceptor', desc: 'Real-time eBPF & Wireshark protocol stream fuzzer' },
    { name: 'Cloud Strike Engine', desc: 'AWS / GCP / Azure IAM privilege escalation & S3 bucket scanner' },
    { name: 'Quantum Cryptanalysis', desc: 'Lattice-based post-quantum signature verification simulator' },
    { name: 'Deep-Fake Audio Recon', desc: 'Acoustic fingerprinting & adversarial speech perturbation analysis' }
  ];

  const filteredToolLogs = rawSearchTerm.trim()
    ? toolLogs.filter(log => log.toLowerCase().includes(rawSearchTerm.toLowerCase()))
    : toolLogs;

  return (
    <div className="hex-container" role="main">
      <a href="#cli-prompt" className="skip-link">Skip to Interactive CLI Prompt</a>

      {/* --- BACKGROUND MATRIX CANVAS --- */}
      <HexMatrixCanvas
        enabled={matrixEnabled}
        speed={1.2}
        density={45}
        color={themeColor}
        opacity={0.2}
      />

      {/* --- CRT SCANLINE & VIGNETTE OVERLAY --- */}
      <CrtOverlay enabled={crtEnabled} scanlines={true} flicker={true} />

      {/* --- TOP CONTROL & HUD TOOLBAR --- */}
      <header className="control-bar" role="banner">
        <div className="brand-badge">
          <span className="brand-hex">⬡</span>
          <span className="brand-name">HEXSTRIKE</span>
          <span className="brand-tag">AI CORE v4.2</span>
        </div>

        <div className="input-group">
          {/* Tool Selector */}
          <select
            value={selectedToolId}
            onChange={(e) => {
              setSelectedToolId(e.target.value);
              audioSynth.playKeyClick();
            }}
            className="hex-select"
            aria-label="Select Security Recon Tool"
          >
            {[...new Set(toolRegistry.map(t => t.category))].map(cat => (
              <optgroup label={`== ${cat.toUpperCase()} ==`} key={cat}>
                {toolRegistry.filter(t => t.category === cat).map(t => (
                  <option key={t.id} value={t.id}>{t.name} ({t.id})</option>
                ))}
              </optgroup>
            ))}
          </select>

          {/* Target Input */}
          <input
            type="text"
            placeholder="TARGET HOST / IP / DOMAIN"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            className="hex-input"
            aria-label="Target domain or IP address"
            spellCheck={false}
          />
        </div>

        {/* Action Buttons */}
        <div className="button-group">
          <button
            onClick={() => executeStrike()}
            disabled={executing}
            className={`hex-button ${executing ? 'executing' : ''}`}
            style={{ backgroundColor: themeColor, borderColor: themeColor }}
            aria-label="Execute Security Strike"
          >
            {executing ? '⚡ STRIKING...' : '⚡ EXECUTE'}
          </button>

          <button
            onClick={() => {
              setShowHud(!showHud);
              audioSynth.playKeyClick();
            }}
            className="hud-toggle-btn"
            title="Toggle Sub-Agent Telemetry HUD"
          >
            {showHud ? 'HIDE HUD' : 'AGENT HUD'}
          </button>

          <button
            onClick={() => {
              setShowFuture(!showFuture);
              audioSynth.playKeyClick();
            }}
            className="future-button"
            title="Encrypted Ops Roadmap"
          >
            {showFuture ? 'CLOSE OPS' : 'FUTURE OPS'}
          </button>
        </div>

        {/* Quick Toggles: Theme, CRT, Matrix, Audio, Speed, Export */}
        <div className="utility-bar">
          {/* Theme Switcher */}
          <select
            value={themeName}
            onChange={(e) => setThemeName(e.target.value)}
            className="mini-select"
            title="Phosphor Color Palette"
            aria-label="Theme Selector"
          >
            <option value="red">RED PHOSPHOR</option>
            <option value="green">MATRIX GREEN</option>
            <option value="amber">SOLAR AMBER</option>
            <option value="purple">SYNTH PURPLE</option>
          </select>

          {/* Typing Speed */}
          <select
            value={typingSpeed}
            onChange={(e) => setTypingSpeed(e.target.value)}
            className="mini-select"
            title="Typewriter Stream Velocity"
            aria-label="Typing Speed"
          >
            <option value="instant">SPEED: INSTANT</option>
            <option value="fast">SPEED: FAST</option>
            <option value="normal">SPEED: NORMAL</option>
            <option value="slow">SPEED: SLOW</option>
          </select>

          {/* CRT Toggle */}
          <button
            onClick={() => setCrtEnabled(!crtEnabled)}
            className={`icon-pill ${crtEnabled ? 'active' : ''}`}
            title="Toggle CRT Scanlines (Ctrl+B)"
            aria-label="Toggle CRT"
          >
            CRT
          </button>

          {/* Matrix Toggle */}
          <button
            onClick={() => setMatrixEnabled(!matrixEnabled)}
            className={`icon-pill ${matrixEnabled ? 'active' : ''}`}
            title="Toggle Hex Matrix Rain (Ctrl+M)"
            aria-label="Toggle Matrix Rain"
          >
            HEX
          </button>

          {/* Audio Toggle */}
          <button
            onClick={() => setAudioEnabled(!audioEnabled)}
            className={`icon-pill ${audioEnabled ? 'active' : ''}`}
            title="Toggle Synthesizer Audio (Ctrl+S)"
            aria-label="Toggle Audio"
          >
            {audioEnabled ? 'SFX: ON' : 'SFX: OFF'}
          </button>

          {/* Export button */}
          <button
            onClick={() => exportLogs('json')}
            className="icon-pill"
            title="Export Strike Audit Logs"
            aria-label="Export Logs"
          >
            EXPORT
          </button>

          {/* Clear button */}
          <button
            onClick={clearLogs}
            className="icon-pill"
            title="Clear Display (Ctrl+L)"
            aria-label="Clear Terminal Logs"
          >
            CLEAR
          </button>
        </div>
      </header>

      {/* --- SUB-AGENT TELEMETRY HUD --- */}
      {showHud && (
        <div style={{ padding: '8px 16px 0 16px', position: 'relative', zIndex: 5 }}>
          <AgentStatusHud themeColor={themeColor} />
        </div>
      )}

      {/* --- MAIN SPLIT-PANE TERMINAL VIEW --- */}
      <main className="terminal-main" role="region" aria-label="Terminal Split Workspaces">
        {/* Left Pane: Raw Tool Output & Logs */}
        <section className="terminal-column left-pane" role="region" aria-label="Raw Tool Console">
          <div className="pane-header">
            <div className="pane-header-left">
              <span className="pane-status-indicator" style={{ background: themeColor }} />
              <span>RAW_OUTPUT.LOG</span>
              <span className="pane-count">[{filteredToolLogs.length} LINES]</span>
            </div>
            <div className="pane-header-right">
              <input
                type="text"
                placeholder="FILTER LOGS..."
                value={rawSearchTerm}
                onChange={(e) => setRawSearchTerm(e.target.value)}
                className="log-filter-input"
                aria-label="Filter raw tool output logs"
              />
              <span className="tool-info-tag">{currentTool.name}</span>
            </div>
          </div>

          <div className="terminal-content" role="log" aria-live="polite">
            {filteredToolLogs.map((log, i) => (
              <div key={i} className="log-entry">
                <span className="line-num">{String(i + 1).padStart(3, '0')}</span>
                <span className="log-text">{log}</span>
              </div>
            ))}
            {executing && (
              <div className="shimmer-container" aria-label="Executing strike...">
                <div className="shimmer-line" style={{ width: '85%' }}></div>
                <div className="shimmer-line" style={{ width: '65%' }}></div>
                <div className="shimmer-line" style={{ width: '92%' }}></div>
              </div>
            )}
            <div ref={toolRef} />
          </div>
        </section>

        {/* Right Pane: AI Neural Reasoning Intelligence */}
        <section className="terminal-column right-pane" role="region" aria-label="AI Cognitive Intelligence">
          <div className="pane-header ai-header">
            <div className="pane-header-left">
              <span className="ai-status-pulse" />
              <span>AI_NEURAL_INTELLIGENCE.EXE</span>
            </div>
            <div className="pane-header-right">
              <span className="ai-model-tag">HERMES-3-8B // Q4_K_M</span>
              <span className="ai-latency-tag">4ms</span>
            </div>
          </div>

          <div className="terminal-content ai-content" role="log" aria-live="polite">
            {aiLogs.map((log, i) => (
              <div key={i} className="ai-log-entry">
                {log}
              </div>
            ))}
            {executing && (
              <div className="shimmer-container ai-shimmer" aria-label="Analyzing neural vector...">
                <div className="shimmer-line" style={{ width: '95%' }}></div>
                <div className="shimmer-line" style={{ width: '70%' }}></div>
                <div className="shimmer-line" style={{ width: '80%' }}></div>
              </div>
            )}
            <div ref={aiRef} />
          </div>
        </section>

        {/* Future Ops Drawer (Encrypted Pipeline) */}
        {showFuture && (
          <aside className="future-drawer" role="dialog" aria-label="Future Operations Drawer">
            <div className="drawer-head">
              <h3>ENCRYPTED PIPELINE</h3>
              <button
                onClick={() => setShowFuture(false)}
                className="close-drawer-btn"
                aria-label="Close Future Operations"
              >
                ✕
              </button>
            </div>
            <p className="drawer-subtitle">Classified offensive & defensive modules in build queue:</p>
            <div className="drawer-scroll-area">
              {futureFeatures.map((f, i) => (
                <div key={i} className="feature-item">
                  <div className="feature-name" style={{ color: themeColor }}>
                    [LOCKED] {f.name}
                  </div>
                  <div className="feature-desc">{f.desc}</div>
                </div>
              ))}
            </div>
          </aside>
        )}
      </main>

      {/* --- BOTTOM INTERACTIVE CLI PROMPT --- */}
      <footer id="cli-prompt">
        <CommandTerminal
          onExecuteCommand={handleCliCommand}
          onClear={clearLogs}
          themeColor={themeColor}
          promptPrefix={`hexstrike@${target.split('.')[0] || 'core'}:~#`}
          typingSpeed={typingSpeed}
        />
      </footer>

      {/* --- STYLES --- */}
      <style>{`
        .hex-container {
          display: flex;
          flex-direction: column;
          height: 100vh;
          width: 100vw;
          background-color: #030002;
          color: #f0f0f0;
          font-family: 'Fira Code', 'Courier New', monospace;
          overflow: hidden;
          position: relative;
        }

        /* Header Control Bar */
        .control-bar {
          padding: 10px 16px;
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          border-bottom: 1px solid var(--border-subtle);
          background: linear-gradient(180deg, rgba(20, 2, 8, 0.95) 0%, rgba(5, 0, 2, 0.95) 100%);
          align-items: center;
          position: relative;
          z-index: 10;
          backdrop-filter: blur(10px);
        }

        .brand-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          padding-right: 12px;
          border-right: 1px solid var(--border-subtle);
        }
        .brand-hex {
          color: ${themeColor};
          font-size: 1.2rem;
          filter: drop-shadow(0 0 8px ${themeColor});
        }
        .brand-name {
          font-weight: 800;
          letter-spacing: 2px;
          font-size: 0.95rem;
          color: #ffffff;
        }
        .brand-tag {
          font-size: 0.6rem;
          background: rgba(255, 255, 255, 0.08);
          padding: 2px 5px;
          border-radius: 2px;
          color: #888;
        }

        .input-group {
          display: flex;
          gap: 8px;
          flex: 1;
          min-width: 320px;
        }

        .hex-select, .hex-input {
          background: #000000;
          color: ${themeColor};
          border: 1px solid var(--border-subtle);
          padding: 8px 12px;
          outline: none;
          font-family: inherit;
          font-size: 0.8rem;
          border-radius: 3px;
        }
        .hex-select { flex: 0.9; cursor: pointer; }
        .hex-input { color: #ffffff; border-color: ${themeColor}; flex: 1.1; }

        .button-group {
          display: flex;
          gap: 8px;
        }

        .hex-button {
          color: #000000;
          font-weight: 800;
          border: 1px solid;
          padding: 8px 18px;
          cursor: pointer;
          border-radius: 3px;
          box-shadow: 0 0 12px ${themeColor};
          font-family: inherit;
          font-size: 0.8rem;
          transition: all 0.2s;
        }
        .hex-button:hover:not(:disabled) {
          filter: brightness(1.2);
          transform: translateY(-1px);
        }
        .hex-button.executing {
          background: #330011 !important;
          color: #888888 !important;
          box-shadow: none;
          cursor: not-allowed;
        }

        .hud-toggle-btn, .future-button {
          background: rgba(20, 4, 10, 0.8);
          color: #aaaaaa;
          border: 1px solid var(--border-subtle);
          padding: 8px 12px;
          cursor: pointer;
          font-family: inherit;
          font-size: 0.72rem;
          border-radius: 3px;
          transition: all 0.2s;
        }
        .hud-toggle-btn:hover, .future-button:hover {
          border-color: ${themeColor};
          color: #ffffff;
        }

        .utility-bar {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-left: auto;
        }

        .mini-select {
          background: #050002;
          color: #aaaaaa;
          border: 1px solid var(--border-subtle);
          padding: 5px 8px;
          font-size: 0.65rem;
          font-family: inherit;
          border-radius: 2px;
          outline: none;
        }

        .icon-pill {
          background: transparent;
          border: 1px solid var(--border-subtle);
          color: #888888;
          padding: 5px 8px;
          font-size: 0.65rem;
          font-family: inherit;
          border-radius: 2px;
          cursor: pointer;
          transition: all 0.15s;
        }
        .icon-pill:hover, .icon-pill.active {
          border-color: ${themeColor};
          color: #ffffff;
          background: rgba(255, 0, 50, 0.12);
        }

        /* Split-Pane Layout */
        .terminal-main {
          display: flex;
          flex: 1;
          overflow: hidden;
          position: relative;
          z-index: 5;
        }

        .terminal-column {
          flex: 1;
          display: flex;
          flex-direction: column;
          background: rgba(4, 1, 3, 0.88);
          overflow: hidden;
        }
        .left-pane {
          border-right: 1px solid var(--border-subtle);
        }
        .right-pane {
          background: rgba(2, 0, 2, 0.92);
        }

        .pane-header {
          padding: 8px 16px;
          background: rgba(15, 2, 7, 0.95);
          font-size: 0.72rem;
          letter-spacing: 1.5px;
          border-bottom: 1px solid var(--border-subtle);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .pane-header-left {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 700;
        }
        .pane-header-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .pane-status-indicator {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }
        .pane-count {
          color: #666666;
          font-size: 0.65rem;
        }
        .tool-info-tag {
          font-size: 0.65rem;
          color: #888888;
          border-left: 1px solid var(--border-subtle);
          padding-left: 8px;
        }
        .log-filter-input {
          background: #000000;
          border: 1px solid var(--border-subtle);
          color: #ffffff;
          padding: 2px 6px;
          font-size: 0.65rem;
          font-family: inherit;
          outline: none;
          width: 110px;
          border-radius: 2px;
        }

        .ai-header {
          background: rgba(22, 4, 12, 0.95);
        }
        .ai-status-pulse {
          width: 6px;
          height: 6px;
          background: #00ffcc;
          border-radius: 50%;
          box-shadow: 0 0 6px #00ffcc;
          animation: pulseDot 1.5s infinite;
        }
        .ai-model-tag {
          font-size: 0.65rem;
          color: #ff99bb;
          background: rgba(255, 0, 100, 0.12);
          padding: 2px 6px;
          border-radius: 2px;
          border: 1px solid rgba(255, 0, 100, 0.25);
        }
        .ai-latency-tag {
          font-size: 0.65rem;
          color: #00ff88;
        }

        .terminal-content {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
          font-size: 0.82rem;
          white-space: pre-wrap;
          line-height: 1.55;
          scroll-behavior: smooth;
        }

        .log-entry {
          margin-bottom: 4px;
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }
        .line-num {
          color: #444444;
          user-select: none;
          font-size: 0.72rem;
          margin-top: 1px;
        }
        .log-text {
          flex: 1;
          word-break: break-word;
        }

        .ai-content {
          color: #ffc2d4;
        }
        .ai-log-entry {
          margin-bottom: 10px;
          border-left: 2px solid ${themeColor};
          padding-left: 12px;
          background: rgba(255, 0, 50, 0.03);
          border-radius: 0 4px 4px 0;
          padding-top: 4px;
          padding-bottom: 4px;
        }

        /* Shimmer Loading Animation */
        .shimmer-container {
          margin-top: 16px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .shimmer-line {
          height: 10px;
          background: rgba(255, 0, 50, 0.12);
          position: relative;
          overflow: hidden;
          border-radius: 2px;
        }
        .ai-shimmer .shimmer-line {
          background: rgba(255, 100, 150, 0.15);
        }
        .shimmer-line::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.25), transparent);
          transform: translateX(-100%);
          animation: shimmer 1.4s infinite;
        }
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }

        /* Future Drawer */
        .future-drawer {
          position: absolute;
          right: 0;
          top: 0;
          bottom: 0;
          width: 340px;
          background: rgba(10, 1, 5, 0.97);
          border-left: 1px solid ${themeColor};
          padding: 20px;
          z-index: 100;
          backdrop-filter: blur(12px);
          display: flex;
          flex-direction: column;
          box-shadow: -10px 0 30px rgba(0, 0, 0, 0.8);
          animation: slideIn 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .drawer-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid var(--border-subtle);
          padding-bottom: 10px;
          margin-bottom: 12px;
        }
        .drawer-head h3 {
          margin: 0;
          font-size: 0.9rem;
          letter-spacing: 1.5px;
        }
        .close-drawer-btn {
          background: transparent;
          border: none;
          color: #888;
          font-size: 1.1rem;
          cursor: pointer;
        }
        .close-drawer-btn:hover { color: #fff; }
        .drawer-subtitle {
          color: #777;
          font-size: 0.72rem;
          margin-bottom: 16px;
        }
        .drawer-scroll-area {
          flex: 1;
          overflow-y: auto;
        }
        .feature-item {
          margin-bottom: 20px;
          padding: 10px;
          background: rgba(255, 0, 50, 0.05);
          border-left: 2px solid var(--border-subtle);
          border-radius: 0 3px 3px 0;
        }
        .feature-name {
          font-weight: 700;
          margin-bottom: 4px;
          font-size: 0.78rem;
        }
        .feature-desc {
          color: #888;
          font-size: 0.7rem;
          line-height: 1.4;
        }

        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }

        /* Mobile Responsiveness */
        @media (max-width: 900px) {
          .terminal-main { flex-direction: column; }
          .control-bar { flex-direction: column; align-items: stretch; }
          .future-drawer { width: 100%; }
          .left-pane { border-right: none; border-bottom: 1px solid var(--border-subtle); height: 50%; }
        }
      `}</style>
    </div>
  );
};

export default TerminalPage;