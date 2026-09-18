import { AGENT_TEMPLATES, PET_EMOJI } from './agentTemplates';
import type { AgentTemplate } from './agentTemplates';
import { useFlowStore } from '../../store/useFlowStore';
import {
  Bot,
  Sparkles,
  Plus,
  RotateCw,
  Gauge,
  Cpu,
  X,
  Search,
} from 'lucide-react';
import { useState, useMemo } from 'react';
import { playSound } from '../../utils/audio';

function TemplateCard({ template, onAdd }: { template: AgentTemplate; onAdd: (t: AgentTemplate) => void }) {
  const roleColor = template.role === 'orchestrator' ? '#a855f7' : template.color;
  const roleBg = template.role === 'orchestrator' ? 'rgba(168,85,247,0.12)' : `${template.color}20`;

  return (
    <div
      tabIndex={0}
      role="button"
      aria-label={`Add template agent ${template.label} to canvas`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onAdd(template);
        }
      }}
      onClick={() => onAdd(template)}
      className="group relative flex flex-col gap-2 p-3 rounded-xl border transition-all duration-200 hover:border-opacity-100 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
      style={{
        background: 'var(--bg-raised)',
        borderColor: `${roleColor}30`,
        borderWidth: '1px',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = `${roleColor}80`;
        (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 20px ${roleColor}18`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = `${roleColor}30`;
        (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
      }}
    >
      {/* Top accent bar */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] rounded-t-xl"
        style={{ background: `linear-gradient(90deg, ${roleColor}, transparent)` }}
      />

      {/* Header */}
      <div className="flex items-start gap-2.5 pt-1">
        <div
          className="text-[22px] leading-none select-none shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ background: roleBg, border: `1px solid ${roleColor}30` }}
        >
          {PET_EMOJI[template.pet] || '🦊'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <h3 className="font-bold text-[13px] text-[var(--text-primary)] truncate leading-tight">
              {template.label}
            </h3>
            {template.role === 'orchestrator' && (
              <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase tracking-wider" style={{ background: roleBg, color: roleColor, border: `1px solid ${roleColor}40` }}>
                orch
              </span>
            )}
          </div>
          <p className="text-[11px] text-[var(--text-muted)] line-clamp-2 leading-relaxed">
            {template.description}
          </p>
        </div>
      </div>

      {/* Meta row */}
      <div className="flex items-center gap-2 text-[10px] font-[var(--mono)] text-[var(--text-muted)]">
        <span className="flex items-center gap-1">
          <Cpu className="w-3 h-3" />
          {template.model.split('/').pop()?.slice(0, 18)}
        </span>
        <span className="flex items-center gap-1">
          <Gauge className="w-3 h-3" />
          {template.timeout}s
        </span>
        {template.loopMode !== 'once' && (
          <span className="flex items-center gap-1 text-[#c084fc]">
            <RotateCw className="w-3 h-3" />
            {template.loopMode === 'loop-max' ? `×${template.maxLoops}` : 'loop'}
          </span>
        )}
      </div>

      {/* Tool chips */}
      {template.toolset.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {template.toolset.slice(0, 4).map((t) => (
            <span
              key={t}
              className="px-1.5 py-0.5 rounded text-[9px] font-[var(--mono)]"
              style={{
                background: `${roleColor}12`,
                border: `1px solid ${roleColor}25`,
                color: roleColor,
              }}
            >
              {t}
            </span>
          ))}
          {template.toolset.length > 4 && (
            <span className="text-[9px] text-[var(--text-muted)] px-1">+{template.toolset.length - 4}</span>
          )}
        </div>
      )}

      {/* Skill chips */}
      {template.skills.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {template.skills.slice(0, 3).map((s) => (
            <span
              key={s}
              className="px-1.5 py-0.5 rounded text-[9px] font-[var(--mono)]"
              style={{
                background: 'rgba(251,191,36,0.10)',
                border: '1px solid rgba(251,191,36,0.25)',
                color: '#fbbf24',
              }}
            >
              {s}
            </span>
          ))}
          {template.skills.length > 3 && (
            <span className="text-[9px] text-[var(--text-muted)] px-1">+{template.skills.length - 3}</span>
          )}
        </div>
      )}

      {/* Add button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onAdd(template);
        }}
        aria-label={`Add ${template.label} agent to canvas`}
        className="mt-1 flex items-center justify-center gap-1.5 w-full py-1.5 rounded-lg text-[11px] font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
        style={{
          background: `${roleColor}12`,
          border: `1px solid ${roleColor}30`,
          color: roleColor,
        }}
      >
        <Plus className="w-3.5 h-3.5" />
        Add to Canvas
      </button>
    </div>
  );
}

export default function AvailableAgentsPanel() {
  const addNodeFromTemplate = useFlowStore((s) => s.addNodeFromTemplate);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | 'leaf' | 'orchestrator'>('all');
  const [isOpen, setIsOpen] = useState(true);

  const filtered = useMemo(() => {
    let result = AGENT_TEMPLATES;
    if (filterRole !== 'all') result = result.filter((t) => t.role === filterRole);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) =>
          t.label.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.skills.some((s) => s.toLowerCase().includes(q)) ||
          t.toolset.some((s) => s.toLowerCase().includes(q))
      );
    }
    return result;
  }, [search, filterRole]);

  const leafCount = AGENT_TEMPLATES.filter((t) => t.role === 'leaf').length;
  const orchCount = AGENT_TEMPLATES.filter((t) => t.role === 'orchestrator').length;

  if (!isOpen) {
    return (
      <button
        onClick={() => {
          playSound('click');
          setIsOpen(true);
        }}
        aria-label="Open Available Agents catalog panel"
        className="fixed left-0 top-[52px] z-30 flex items-center gap-2 px-3 py-2.5 rounded-r-xl border border-[var(--border)] border-l-0 bg-[var(--bg-raised)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all text-[11px] font-semibold shadow-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
      >
        <Bot className="w-4 h-4 text-[var(--accent)]" />
        <span className="hidden lg:inline">Agents</span>
      </button>
    );
  }

  return (
    <aside
      role="complementary"
      aria-label="Available Agents Catalog"
      className="flex flex-col w-[320px] h-full bg-[var(--bg-base)] border-r border-[var(--border)] shadow-2xl z-20"
      style={{ backdropFilter: 'blur(20px)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)] bg-[var(--bg-raised)]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[var(--accent)] to-[var(--accent-dim)] flex items-center justify-center shadow-lg shadow-cyan-950/20">
            <Sparkles className="w-3.5 h-3.5 text-slate-950 font-bold" />
          </div>
          <div>
            <h2 className="text-[13px] font-bold tracking-wide text-[var(--text-primary)] leading-none">
              Available Agents
            </h2>
            <p className="text-[10px] font-[var(--mono)] text-[var(--text-muted)] uppercase tracking-wider mt-0.5">
              {AGENT_TEMPLATES.length} templates
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            playSound('click');
            setIsOpen(false);
          }}
          aria-label="Close agents catalog panel"
          className="p-1.5 rounded-md hover:bg-[var(--bg-overlay)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Search & filters */}
      <div className="px-4 py-3 space-y-2.5 border-b border-[var(--border)]">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-muted)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search agents, tools, skills... (Cmd+K)"
            aria-label="Search available agents by name, tool, or skill"
            className="w-full bg-[var(--bg-deep)] border border-[var(--border)] rounded-lg pl-8 pr-3 py-2 text-xs text-[var(--text-primary)] font-[var(--mono)] focus:outline-none focus:border-[var(--accent)] focus-visible:ring-2 focus-visible:ring-[var(--accent)] transition-colors placeholder:text-[var(--text-muted)]"
          />
        </div>
        <div className="flex gap-1.5" role="tablist" aria-label="Filter agent roles">
          {[
            { key: 'all' as const, label: `All (${AGENT_TEMPLATES.length})` },
            { key: 'leaf' as const, label: `Leaf (${leafCount})` },
            { key: 'orchestrator' as const, label: `Orch (${orchCount})` },
          ].map((f) => (
            <button
              key={f.key}
              role="tab"
              aria-selected={filterRole === f.key}
              onClick={() => {
                playSound('click');
                setFilterRole(f.key);
              }}
              className={`px-2.5 py-1 rounded-md text-[10px] font-semibold transition-all border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${
                filterRole === f.key
                  ? 'bg-[var(--accent-bg)] border-[var(--accent-border)] text-[var(--accent)]'
                  : 'bg-[var(--bg-deep)] border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--text-muted)]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Template grid */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5 custom-scrollbar">
        {filtered.length === 0 && (
          <div className="text-center py-8">
            <Bot className="w-8 h-8 text-[var(--text-muted)] mx-auto mb-2 opacity-50" />
            <p className="text-xs text-[var(--text-muted)] font-[var(--mono)]">No agents match.</p>
          </div>
        )}
        {filtered.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            onAdd={(t) => {
              addNodeFromTemplate(t);
            }}
          />
        ))}
      </div>

      {/* Footer */}
      <div className="px-4 py-2.5 border-t border-[var(--border)] bg-[var(--bg-raised)]">
        <p className="text-[10px] font-[var(--mono)] text-[var(--text-muted)] text-center">
          Click card to add agent to canvas
        </p>
      </div>
    </aside>
  );
}
