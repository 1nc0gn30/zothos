import { useCallback, useEffect, useRef } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  MiniMap,
  BackgroundVariant,
  ReactFlowProvider,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useFlowStore, useNodes, useEdges } from '../store/useFlowStore';
import { nodeTypes } from './nodes';
import SidePanel from './sidebar/SidePanel';
import AvailableAgentsPanel from './agents/AvailableAgentsPanel';
import ToastContainer from './toast/ToastContainer';
import LogDrawer from './logs/LogDrawer';
import ShortcutsModal from './modals/ShortcutsModal';

import {
  Plus,
  Play,
  Workflow,
  PanelLeftClose,
  PanelLeft,
  Sun,
  Moon,
  Monitor,
  Volume2,
  VolumeX,
  Download,
  Upload,
  Keyboard,
  Terminal,
  Sparkles,
} from 'lucide-react';
import { GitHubIcon } from './Icons';
import { playSound } from '../utils/audio';

function CanvasInner() {
  const nodes = useNodes();
  const edges = useEdges();
  const onNodesChange = useFlowStore((s) => s.onNodesChange);
  const onEdgesChange = useFlowStore((s) => s.onEdgesChange);
  const onConnect = useFlowStore((s) => s.onConnect);
  const addNode = useFlowStore((s) => s.addNode);
  const runFlow = useFlowStore((s) => s.runFlow);
  const openSidebar = useFlowStore((s) => s.openSidebar);
  const sidebarNode = useFlowStore((s) => s.sidebarNode);
  const theme = useFlowStore((s) => s.theme);
  const setTheme = useFlowStore((s) => s.setTheme);
  const isMuted = useFlowStore((s) => s.isMuted);
  const toggleMute = useFlowStore((s) => s.toggleMute);
  const ariaAnnouncement = useFlowStore((s) => s.ariaAnnouncement);
  const toggleShortcuts = useFlowStore((s) => s.toggleShortcuts);
  const toggleLogDrawer = useFlowStore((s) => s.toggleLogDrawer);
  const loadPresetWorkflow = useFlowStore((s) => s.loadPresetWorkflow);
  const exportWorkflowJson = useFlowStore((s) => s.exportWorkflowJson);
  const importWorkflowJson = useFlowStore((s) => s.importWorkflowJson);
  const isExecuting = useFlowStore((s) => s.isExecuting);
  const globalLogs = useFlowStore((s) => s.globalLogs);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: { id: string }) => {
      playSound('click');
      const found = nodes.find((n) => n.id === node.id);
      openSidebar(found || null);
    },
    [nodes, openSidebar]
  );

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
  }, [theme]);

  // Global Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '?' && (e.shiftKey || e.metaKey)) {
        e.preventDefault();
        toggleShortcuts();
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('input[placeholder*="Search agents"]') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      } else if (e.key === 'Escape') {
        openSidebar(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleShortcuts, openSidebar]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (content) {
          importWorkflowJson(content);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="w-full h-screen bg-[var(--bg-deep)] text-[var(--text-primary)] flex flex-col overflow-hidden font-[var(--sans)] relative">
      {/* Skip Navigation for Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2.5 focus:bg-[var(--accent)] focus:text-slate-950 focus:font-bold focus:rounded-xl focus:shadow-2xl"
      >
        Skip to main content
      </a>

      {/* ARIA Live Region for Screen Readers */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {ariaAnnouncement}
      </div>

      <div className="scanlines" />
      <ToastContainer />
      <ShortcutsModal />
      <LogDrawer />

      {/* Hidden File Input for JSON Workflow Import */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept=".json"
        className="hidden"
      />

      {/* HEADER TOOLBAR */}
      <header
        role="banner"
        className="flex items-center gap-2.5 px-4 py-2.5 border-b border-[var(--border)] bg-[var(--bg-base)] z-20 overflow-x-auto custom-scrollbar"
        style={{ backdropFilter: 'blur(12px)' }}
      >
        {/* Brand */}
        <div className="flex items-center gap-2.5 mr-2 shrink-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[var(--accent)] to-[var(--accent-dim)] flex items-center justify-center shadow-lg shadow-cyan-950/40">
            <Workflow className="w-4 h-4 text-slate-950 font-bold" />
          </div>
          <div>
            <h1 className="text-[13px] font-extrabold tracking-wider text-[var(--text-primary)] leading-none">
              AGENT LOOM
            </h1>
            <p className="text-[9px] font-[var(--mono)] text-[var(--text-muted)] uppercase tracking-widest mt-0.5">
              Visual Agent Workflow Canvas
            </p>
          </div>
        </div>

        <div className="h-5 w-px bg-[var(--border-subtle)] shrink-0" />

        {/* Primary Actions */}
        <button
          onClick={addNode}
          aria-label="Add new agent node"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--accent-bg)] border border-[var(--accent-border)] hover:bg-[var(--accent)] hover:text-slate-950 transition-all text-xs font-semibold text-[var(--accent)] shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Agent
        </button>

        <button
          onClick={runFlow}
          disabled={isExecuting}
          aria-label="Run agent workflow pipeline"
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg border transition-all text-xs font-semibold shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
            isExecuting
              ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400 cursor-not-allowed opacity-75'
              : 'bg-emerald-500/10 border-emerald-500/30 hover:bg-emerald-500/20 text-emerald-400'
          }`}
        >
          <Play className={`w-3.5 h-3.5 ${isExecuting ? 'animate-spin' : ''}`} />
          {isExecuting ? 'Running...' : 'Run Flow'}
        </button>

        <div className="h-5 w-px bg-[var(--border-subtle)] shrink-0" />

        {/* Presets dropdown / Quick load */}
        <div className="flex items-center gap-1 text-[11px] font-[var(--mono)] text-[var(--text-muted)] shrink-0">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden xl:inline text-[10px] uppercase tracking-wider font-semibold">Presets:</span>
          {(['fullstack', 'security', 'mlops'] as const).map((p) => (
            <button
              key={p}
              onClick={() => loadPresetWorkflow(p)}
              className="px-2 py-1 rounded-md bg-[var(--bg-raised)] border border-[var(--border-subtle)] hover:border-[var(--accent)] text-[10px] uppercase font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            >
              {p}
            </button>
          ))}
        </div>

        <div className="flex-1 min-w-[12px]" />

        {/* Workflow Stats */}
        <div className="hidden lg:flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-[var(--bg-raised)] border border-[var(--border-subtle)] shrink-0">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--success)] animate-pulse" />
            <span className="text-[10px] font-[var(--mono)] text-[var(--text-muted)]">
              {nodes.length} agent{nodes.length !== 1 ? 's' : ''}
            </span>
          </div>
          {nodes.length > 0 && (
            <>
              <div className="w-px h-3 bg-[var(--border-subtle)]" />
              <span className="text-[10px] font-[var(--mono)] text-[var(--text-muted)]">
                {edges.length} edge{edges.length !== 1 ? 's' : ''}
              </span>
            </>
          )}
        </div>

        {/* Export / Import Buttons */}
        <button
          onClick={exportWorkflowJson}
          title="Export Workflow JSON"
          aria-label="Export workflow JSON definition"
          className="p-1.5 rounded-lg bg-[var(--bg-raised)] border border-[var(--border-subtle)] hover:border-[var(--accent)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors focus-visible:ring-2 focus-visible:ring-[var(--accent)] shrink-0"
        >
          <Download className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => fileInputRef.current?.click()}
          title="Import Workflow JSON"
          aria-label="Import workflow JSON definition"
          className="p-1.5 rounded-lg bg-[var(--bg-raised)] border border-[var(--border-subtle)] hover:border-[var(--accent)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors focus-visible:ring-2 focus-visible:ring-[var(--accent)] shrink-0"
        >
          <Upload className="w-3.5 h-3.5" />
        </button>

        {/* Execution Studio Log Drawer Toggle */}
        <button
          onClick={toggleLogDrawer}
          aria-label="Toggle execution log drawer"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[var(--bg-raised)] border border-[var(--border-subtle)] hover:border-[var(--accent)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors text-xs font-[var(--mono)] focus-visible:ring-2 focus-visible:ring-[var(--accent)] shrink-0"
        >
          <Terminal className="w-3.5 h-3.5 text-[var(--accent)]" />
          <span className="hidden sm:inline">Studio</span>
          {globalLogs.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-[var(--accent-bg)] border border-[var(--accent-border)] text-[9px] text-[var(--accent)] font-bold">
              {globalLogs.length}
            </span>
          )}
        </button>

        {/* Audio Mute Toggle */}
        <button
          onClick={toggleMute}
          title={isMuted ? 'Unmute Sound Effects' : 'Mute Sound Effects'}
          aria-label={isMuted ? 'Unmute sound effects' : 'Mute sound effects'}
          className="p-1.5 rounded-lg bg-[var(--bg-raised)] border border-[var(--border-subtle)] hover:border-[var(--accent)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors focus-visible:ring-2 focus-visible:ring-[var(--accent)] shrink-0"
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-cyan-400" />}
        </button>

        {/* Keyboard Shortcuts Button */}
        <button
          onClick={toggleShortcuts}
          title="Keyboard Shortcuts (?)"
          aria-label="Keyboard Shortcuts"
          className="p-1.5 rounded-lg bg-[var(--bg-raised)] border border-[var(--border-subtle)] hover:border-[var(--accent)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors focus-visible:ring-2 focus-visible:ring-[var(--accent)] shrink-0"
        >
          <Keyboard className="w-3.5 h-3.5" />
        </button>

        {/* Theme Switcher */}
        <div className="flex items-center gap-0.5 rounded-lg bg-[var(--bg-raised)] border border-[var(--border-subtle)] p-0.5 shrink-0">
          {(['parrot', 'dark', 'light'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              aria-label={`Switch theme to ${t}`}
              title={`Switch theme to ${t}`}
              className={`p-1 rounded-md text-[10px] font-[var(--mono)] transition-colors focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${
                theme === t
                  ? 'bg-[var(--bg-overlay)] text-[var(--text-primary)] border border-[var(--border)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              {t === 'parrot' ? <Monitor className="w-3.5 h-3.5" /> : t === 'dark' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
            </button>
          ))}
        </div>

        {/* GitHub Star Link */}
        <a
          href="https://github.com/1nc0gn30/hermes-parrot-os-workhouse"
          target="_blank"
          rel="noreferrer"
          aria-label="View Agent Loom source code on GitHub"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--bg-raised)] border border-[var(--border-subtle)] hover:border-[var(--accent)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all text-xs font-semibold focus-visible:ring-2 focus-visible:ring-[var(--accent)] shrink-0"
        >
          <GitHubIcon size={14} />
          Star
        </a>

        {/* Inspector Toggle */}
        <button
          onClick={() => openSidebar(null)}
          aria-label={sidebarNode ? 'Hide inspector panel' : 'Show inspector panel'}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-[var(--bg-raised)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors text-xs font-[var(--mono)] border border-transparent hover:border-[var(--border-subtle)] focus-visible:ring-2 focus-visible:ring-[var(--accent)] shrink-0"
        >
          {sidebarNode ? (
            <><PanelLeftClose className="w-3.5 h-3.5" /> Hide</>
          ) : (
            <><PanelLeft className="w-3.5 h-3.5" /> Panel</>
          )}
        </button>
      </header>

      {/* MAIN CANVAS BODY */}
      <div className="flex flex-1 overflow-hidden relative">
        <AvailableAgentsPanel />
        <main id="main-content" role="main" tabIndex={-1} className="flex-1 relative focus:outline-none">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            nodeTypes={nodeTypes}
            fitView
            snapToGrid
            snapGrid={[16, 16]}
            deleteKeyCode={['Backspace', 'Delete']}
            proOptions={{ hideAttribution: true }}
            defaultEdgeOptions={{
              animated: true,
              style: { stroke: 'var(--accent)', strokeWidth: 2 },
              type: 'smoothstep',
            }}
          >
            <Controls
              className="!bg-[var(--bg-raised)] !border !border-[var(--border)] !rounded-xl !shadow-2xl"
              style={{ backdropFilter: 'blur(12px)' }}
            />
            <MiniMap
              className="!bg-[var(--bg-raised)] !border !border-[var(--border)] !rounded-xl"
              style={{ backdropFilter: 'blur(12px)' }}
              nodeColor={(n) => {
                const statusColors: Record<string, string> = {
                  idle: '#52525b',
                  running: '#f59e0b',
                  done: '#22c55e',
                  error: '#ef4444',
                };
                return (n.data as any)?.status ? statusColors[(n.data as any).status] || '#71717a' : '#71717a';
              }}
              maskColor="rgba(5,7,10,0.9)"
            />
            <Background
              gap={24}
              size={1}
              color="var(--border-subtle)"
              variant={BackgroundVariant.Cross}
            />
          </ReactFlow>

          {nodes.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center animate-fade-in-up p-8 max-w-sm rounded-3xl border border-[var(--border)] bg-[var(--bg-raised)]/80 backdrop-blur-xl shadow-2xl">
                <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--accent)]/20 to-[var(--accent-dim)]/10 border border-[var(--accent)]/30 flex items-center justify-center mx-auto mb-4 shadow-xl shadow-cyan-950/30">
                  <div className="absolute inset-0 rounded-2xl animate-pulse bg-[var(--accent)]/10" />
                  <Workflow className="w-8 h-8 text-[var(--accent)]" />
                </div>
                <h3 className="text-sm font-bold text-[var(--text-primary)] font-[var(--mono)] mb-1">
                  No agents on canvas
                </h3>
                <p className="text-xs text-[var(--text-muted)] mt-1.5 font-[var(--mono)] leading-relaxed">
                  Click <span className="text-[var(--accent)] font-semibold">+ Add Agent</span>, pick a template from <span className="text-[var(--accent)] font-semibold">Available Agents</span>, or load a <span className="text-amber-400 font-semibold">Preset</span> from the top bar.
                </p>
              </div>
            </div>
          )}
        </main>

        <SidePanel />
      </div>
    </div>
  );
}

export default function Canvas() {
  return (
    <ReactFlowProvider>
      <CanvasInner />
    </ReactFlowProvider>
  );
}
