import { useFlowStore } from '../../store/useFlowStore';
import {
  ChevronRight,
  Zap,
  BookOpen,
  Wrench,
  RefreshCw,
  X,
  Trash2,
  GaugeCircle,
} from 'lucide-react';
import { playSound } from '../../utils/audio';

const PET_EMOJI: Record<string, string> = {
  fox: '🦊',
  owl: '🦉',
  wolf: '🐺',
  raven: '🐦‍⬛',
  bear: '🐻',
  cat: '🐆',
  dog: '🐕',
  dragon: '🐲',
  tiger: '🐯',
  lion: '🦁',
};

const PROVIDERS = ['openrouter', 'openai', 'anthropic', 'gemini', 'openai-compatible', 'x-ai', 'deepseek', 'siliconflow', 'groq'] as const;
const MODELS: Record<string, string[]> = {
  openrouter: ['openai/gpt-4o', 'openai/gpt-4o-mini', 'anthropic/claude-opus-4', 'anthropic/claude-sonnet-4', 'google/gemini-2.5-pro', 'meta-llama/llama-3.3-70b', 'deepseek/deepseek-r1', 'xai/grok-2', 'mistral/mistral-large', 'cohere/command-r-plus'],
  openai: ['gpt-4.1', 'gpt-4.1-mini', 'o3', 'o4-mini', 'gpt-4o', 'gpt-4o-mini'],
  anthropic: ['claude-opus-4', 'claude-sonnet-4', 'claude-3-5-haiku'],
  gemini: ['gemini-2.5-pro', 'gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-pro'],
  'openai-compatible': ['custom-model'],
  'x-ai': ['grok-2', 'grok-2-mini', 'grok-3-beta'],
  deepseek: ['deepseek-chat', 'deepseek-r1', 'deepseek-reasoner'],
  siliconflow: ['Qwen/Qwen3-235B-A22B-Instruct-2507', 'Qwen/Qwen3-30B-A3B', 'THUDM/glm-4-9b-chat', 'internlm/internlm2_5-7b-chat', 'google/gemma-2-9b-it'],
  groq: ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant', 'mixtral-8x7b-32768', 'gemma2-9b-it'],
};
const LOOP_MODES = [
  { value: 'once', label: 'Run Once' },
  { value: 'loop', label: 'Always Loop' },
  { value: 'loop-on-error', label: 'Retry on Error' },
  { value: 'loop-max', label: 'Max N Loops' },
] as const;

export default function SidePanel() {
  const node = useFlowStore((s) => s.sidebarNode);
  const updateNode = useFlowStore((s) => s.updateNode);
  const deleteNode = useFlowStore((s) => s.deleteNode);
  const openSidebar = useFlowStore((s) => s.openSidebar);

  if (!node) return null;

  const d = node.data;

  const set = <K extends keyof typeof d>(key: K, val: (typeof d)[K]) =>
    updateNode(node.id, { [key]: val } as any);

  const toggleArr = (key: 'toolset' | 'skills', val: string) => {
    playSound('click');
    set(
      key,
      d[key].includes(val) ? d[key].filter((v) => v !== val) : [...d[key], val]
    );
  };

  return (
    <aside
      role="complementary"
      aria-label="Agent Configuration Inspector"
      className="w-[380px] h-full bg-[var(--bg-base)] border-l border-[var(--border)] flex flex-col shadow-2xl z-20"
      style={{ backdropFilter: 'blur(20px)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-[var(--border)] bg-[var(--bg-raised)]">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[var(--accent)] to-[var(--accent-dim)] flex items-center justify-center">
            <Zap className="w-3.5 h-3.5 text-slate-950 font-bold" />
          </div>
          <span className="font-bold text-[13px] uppercase tracking-wider text-[var(--text-primary)]">
            Agent Inspector
          </span>
        </div>
        <button
          onClick={() => {
            playSound('click');
            openSidebar(null);
          }}
          aria-label="Close agent configuration inspector"
          className="p-1.5 rounded-md hover:bg-[var(--bg-overlay)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-5 custom-scrollbar">
        {/* Label */}
        <fieldset className="space-y-1.5 border-0 p-0 m-0">
          <legend className="text-[10px] font-[var(--mono)] text-[var(--text-muted)] uppercase tracking-widest px-0.5">
            Agent Label
          </legend>
          <input
            type="text"
            value={d.label}
            onChange={(e) => set('label', e.target.value)}
            aria-label="Agent Name Label"
            className="w-full bg-[var(--bg-deep)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] font-[var(--mono)] focus:outline-none focus:border-[var(--accent)] focus-visible:ring-2 focus-visible:ring-[var(--accent)] transition-colors placeholder:text-[var(--text-muted)]"
            placeholder="Agent name"
          />
        </fieldset>

        {/* Pet */}
        <fieldset className="space-y-2 border-0 p-0 m-0">
          <legend className="text-[10px] font-[var(--mono)] text-[var(--text-muted)] uppercase tracking-widest px-0.5">
            Pet / Avatar Mascot
          </legend>
          <div className="flex flex-wrap gap-2">
            {Object.entries(PET_EMOJI).map(([pet, emoji]) => (
              <button
                key={pet}
                onClick={() => {
                  playSound('click');
                  set('pet', pet);
                }}
                aria-label={`Select mascot avatar ${pet}`}
                title={pet}
                className={`w-10 h-10 rounded-xl border text-lg flex items-center justify-center transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${
                  d.pet === pet
                    ? 'border-[var(--accent)] bg-[var(--accent-bg)] shadow-[0_0_15px_rgba(0,240,255,0.25)]'
                    : 'border-[var(--border)] bg-[var(--bg-deep)] hover:border-[var(--text-muted)]'
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </fieldset>

        {/* Role */}
        <fieldset className="space-y-2 border-0 p-0 m-0">
          <legend className="text-[10px] font-[var(--mono)] text-[var(--text-muted)] uppercase tracking-widest px-0.5">
            Role Type
          </legend>
          <div className="flex gap-2">
            {(['leaf', 'orchestrator'] as const).map((r) => (
              <button
                key={r}
                onClick={() => {
                  playSound('click');
                  set('role', r);
                }}
                aria-label={`Select role ${r}`}
                className={`flex-1 py-2.5 rounded-lg text-xs font-semibold border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${
                  d.role === r
                    ? r === 'orchestrator'
                      ? 'bg-[rgba(168,85,247,0.12)] border-[var(--node-orchestrator)] text-[#c4b5fd] shadow-lg shadow-violet-900/10'
                      : 'bg-[rgba(0,240,255,0.1)] border-[var(--node-leaf)] text-[#93c5fd] shadow-lg shadow-cyan-900/10'
                    : 'bg-[var(--bg-deep)] border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--text-muted)]'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </fieldset>

        {/* Provider + Model */}
        <fieldset className="space-y-2 border-0 p-0 m-0">
          <legend className="text-[10px] font-[var(--mono)] text-[var(--text-muted)] uppercase tracking-widest px-0.5">
            Provider & LLM Engine
          </legend>
          <div className="space-y-2">
            <select
              value={d.provider}
              onChange={(e) => {
                const p = e.target.value as typeof d.provider;
                set('provider', p);
                set('model', (MODELS as Record<string, string[]>)[p][0]);
              }}
              aria-label="Select AI Provider"
              className="w-full bg-[var(--bg-deep)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] font-[var(--mono)] focus:outline-none focus:border-[var(--accent)] focus-visible:ring-2 focus-visible:ring-[var(--accent)] transition-colors"
            >
              {PROVIDERS.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <select
              value={d.model}
              onChange={(e) => set('model', e.target.value)}
              aria-label="Select Model"
              className="w-full bg-[var(--bg-deep)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] font-[var(--mono)] focus:outline-none focus:border-[var(--accent)] focus-visible:ring-2 focus-visible:ring-[var(--accent)] transition-colors"
            >
              {(MODELS as Record<string, string[]>)[d.provider].map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
        </fieldset>

        {/* Instructions */}
        <fieldset className="space-y-1.5 border-0 p-0 m-0">
          <legend className="text-[10px] font-[var(--mono)] text-[var(--text-muted)] uppercase tracking-widest px-0.5">
            System Instructions
          </legend>
          <textarea
            value={d.instructions}
            onChange={(e) => set('instructions', e.target.value)}
            rows={4}
            aria-label="System instructions for agent prompt"
            className="w-full bg-[var(--bg-deep)] border border-[var(--border)] rounded-lg px-3 py-2 text-xs text-[var(--text-primary)] font-[var(--mono)] focus:outline-none focus:border-[var(--accent)] focus-visible:ring-2 focus-visible:ring-[var(--accent)] transition-colors resize-none placeholder:text-[var(--text-muted)]"
            placeholder="Instructions, context, persona..."
          />
        </fieldset>

        {/* Tools */}
        <fieldset className="space-y-2 border-0 p-0 m-0">
          <legend className="flex items-center gap-1.5 text-[10px] font-[var(--mono)] text-[#60a5fa] uppercase tracking-widest px-0.5">
            <Wrench className="w-3 h-3" />
            Tools Attachment
          </legend>
          <ToolChecklist items={d.toolset} toggle={toggleArr.bind(null, 'toolset')} />
        </fieldset>

        {/* Skills */}
        <fieldset className="space-y-2 border-0 p-0 m-0">
          <legend className="flex items-center gap-1.5 text-[10px] font-[var(--mono)] text-[#fbbf24] uppercase tracking-widest px-0.5">
            <BookOpen className="w-3 h-3" />
            Skills Attachment
          </legend>
          <SkillChecklist items={d.skills} toggle={toggleArr.bind(null, 'skills')} />
        </fieldset>

        {/* Loop control */}
        <fieldset className="space-y-2 border-0 p-0 m-0">
          <legend className="flex items-center gap-1.5 text-[10px] font-[var(--mono)] text-[#c084fc] uppercase tracking-widest px-0.5">
            <RefreshCw className="w-3 h-3" />
            Loop Control
          </legend>
          <div className="space-y-2">
            <div className="flex flex-col gap-1">
              {LOOP_MODES.map((mode) => (
                <button
                  key={mode.value}
                  onClick={() => {
                    playSound('click');
                    set('loopMode', mode.value);
                  }}
                  aria-label={`Set loop mode to ${mode.label}`}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg border text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${
                    d.loopMode === mode.value
                      ? 'bg-[rgba(192,132,252,0.15)] border-[#a855f7] text-[#d8b4fe] shadow-lg shadow-violet-900/10'
                      : 'bg-[var(--bg-deep)] border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--text-muted)]'
                  }`}
                >
                  <span>{mode.label}</span>
                  {d.loopMode === mode.value && (
                    <ChevronRight className="w-3.5 h-3.5 text-[#a855f7]" />
                  )}
                </button>
              ))}
            </div>
            {d.loopMode === 'loop-max' && (
              <div className="flex items-center gap-3 px-1">
                <label htmlFor="max-loops-input" className="text-[10px] font-[var(--mono)] text-[var(--text-muted)]">Max loops:</label>
                <input
                  id="max-loops-input"
                  type="number"
                  min={1}
                  max={10}
                  value={d.maxLoops}
                  onChange={(e) => set('maxLoops', parseInt(e.target.value) || 1)}
                  className="w-16 bg-[var(--bg-deep)] border border-[var(--border)] rounded-md px-2 py-1.5 text-xs text-[var(--text-primary)] font-[var(--mono)] text-center focus:outline-none focus:border-[#a855f7] focus-visible:ring-2 focus-visible:ring-[var(--accent)] transition-colors"
                />
              </div>
            )}
          </div>
        </fieldset>

        {/* Timeout */}
        <fieldset className="space-y-2 border-0 p-0 m-0">
          <legend className="flex items-center gap-1.5 text-[10px] font-[var(--mono)] text-[var(--text-muted)] uppercase tracking-widest px-0.5">
            <GaugeCircle className="w-3 h-3" />
            Timeout Limit
          </legend>
          <div className="px-1">
            <input
              type="range"
              min={10}
              max={300}
              step={10}
              value={d.timeout}
              onChange={(e) => set('timeout', parseInt(e.target.value))}
              aria-label="Set timeout duration in seconds"
              className="w-full accent-[var(--accent)] focus-visible:outline-none"
            />
            <div className="text-right text-[10px] font-[var(--mono)] text-[var(--text-muted)] mt-0.5">
              {d.timeout}s
            </div>
          </div>
        </fieldset>
      </div>

      {/* Footer */}
      <div className="border-t border-[var(--border)] p-3.5 bg-[var(--bg-raised)]">
        <button
          onClick={() => deleteNode(node.id)}
          aria-label="Delete selected agent node from canvas"
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-[rgba(255,77,109,0.1)] border border-[rgba(255,77,109,0.3)] hover:bg-[rgba(255,77,109,0.18)] text-xs font-semibold text-[var(--error)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Delete Agent
        </button>
      </div>
    </aside>
  );
}

function ToolChecklist({
  items,
  toggle,
}: {
  items: string[];
  toggle: (v: string) => void;
}) {
  const tools = [
    'browser', 'terminal', 'file', 'web', 'search', 'code_exec', 'delegate'
  ];
  return (
    <div className="flex flex-wrap gap-1.5">
      {tools.map((t) => (
        <button
          key={t}
          onClick={() => toggle(t)}
          aria-label={`Toggle tool ${t}`}
          className={`px-2.5 py-1.5 rounded-md text-[10px] font-[var(--mono)] border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${
            items.includes(t)
              ? 'bg-[rgba(0,240,255,0.15)] border-[var(--node-leaf)] text-[#93c5fd]'
              : 'bg-[var(--bg-deep)] border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--text-muted)]'
          }`}
        >
          {t}
        </button>
      ))}
    </div>
  );
}

function SkillChecklist({
  items,
  toggle,
}: {
  items: string[];
  toggle: (v: string) => void;
}) {
  const skills = [
    'web-artifacts-builder',
    'aspnet-core',
    'claude-api',
    'data-science',
    'mlops',
    'devops',
    'frontend-design',
    'documentation',
    'testing',
    'git-workflow',
    'security',
    'performance',
    'research',
  ];
  return (
    <div className="flex flex-col gap-1 max-h-[180px] overflow-y-auto pr-1 custom-scrollbar">
      {skills.map((s) => (
        <button
          key={s}
          onClick={() => toggle(s)}
          aria-label={`Toggle skill ${s}`}
          className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg border text-[11px] font-[var(--mono)] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${
            items.includes(s)
              ? 'bg-[rgba(251,191,36,0.12)] border-[var(--warn)] text-[#fcd34d] shadow-sm shadow-amber-900/10'
              : 'bg-[var(--bg-deep)] border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--text-muted)]'
          }`}
        >
          <div
            className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 transition-all ${
              items.includes(s)
                ? 'border-[var(--warn)] bg-[var(--warn)]'
                : 'border-[var(--border)]'
            }`}
          >
            {items.includes(s) && (
              <ChevronRight className="w-3 h-3 text-[var(--bg-deep)] rotate-90" />
            )}
          </div>
          <span className="truncate">{s}</span>
        </button>
      ))}
    </div>
  );
}
