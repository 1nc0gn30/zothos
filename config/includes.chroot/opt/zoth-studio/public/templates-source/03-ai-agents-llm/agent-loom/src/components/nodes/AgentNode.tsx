import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import type { AgentNodeData } from '../../store/useFlowStore';
import {
  CircleDot,
  CircleCheckBig,
  TriangleAlert,
  Loader2,
  RotateCw,
  Clock,
  Zap,
  BrainCircuit,
  FileCode,
} from 'lucide-react';

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

const STATUS_CONFIG = {
  idle: {
    border: 'border-[var(--border)]',
    bg: 'bg-[var(--bg-raised)]',
    glow: '',
    badge: null,
    badgeColor: '',
    icon: CircleDot,
    iconColor: '#71717a',
  },
  running: {
    border: 'border-[var(--warn)]',
    bg: 'bg-[var(--bg-raised)]',
    glow: 'animate-[statusGlowRunning_2s_ease-in-out_infinite]',
    badge: 'Running',
    badgeColor: 'var(--warn)',
    icon: Loader2,
    iconColor: 'var(--warn)',
  },
  done: {
    border: 'border-[var(--success)]',
    bg: 'bg-[var(--bg-raised)]',
    glow: 'animate-[statusGlowDone_2s_ease-in-out_infinite]',
    badge: 'Done',
    badgeColor: 'var(--success)',
    icon: CircleCheckBig,
    iconColor: 'var(--success)',
  },
  error: {
    border: 'border-[var(--error)]',
    bg: 'bg-[var(--bg-raised)]',
    glow: 'animate-[statusGlowError_2s_ease-in-out_infinite]',
    badge: 'Error',
    badgeColor: 'var(--error)',
    icon: TriangleAlert,
    iconColor: 'var(--error)',
  },
};

function AgentNodeComponent({ data, selected }: { data: AgentNodeData; selected?: boolean }) {
  const config = STATUS_CONFIG[data.status];
  const roleColor = data.role === 'orchestrator' ? '#a855f7' : 'var(--accent)';
  const roleBg = data.role === 'orchestrator' ? 'rgba(168,85,247,0.12)' : 'rgba(0,240,255,0.1)';
  const StatusIcon = config.icon;

  return (
    <div
      tabIndex={0}
      role="region"
      aria-label={`Agent ${data.label}, role ${data.role}, status ${data.status}`}
      className={`
        relative min-w-[280px] max-w-[340px] rounded-xl border-2 p-0 shadow-2xl 
        transition-all duration-300 ease-out overflow-hidden group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-deep)]
        ${config.border} ${config.bg} ${config.glow}
        ${selected ? 'ring-2 ring-[var(--accent)] ring-offset-2 ring-offset-[var(--bg-deep)]' : ''}
      `}
      style={{
        zIndex: selected ? 50 : 10,
        opacity: 1,
        background:
          data.status === 'idle'
            ? 'linear-gradient(180deg, #111820 0%, #0b0f15 100%)'
            : undefined,
      }}
    >
      {/* Top accent bar with shimmer */}
      <div
        className="absolute top-0 left-0 right-0 h-[3px] overflow-hidden"
        style={{
          background: `linear-gradient(90deg, ${roleColor}, transparent 60%)`,
        }}
      >
        <div
          className="absolute inset-0 animate-shimmer"
          style={{
            background:
              'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%)',
          }}
        />
      </div>

      {/* Running status top stripe */}
      {data.status === 'running' && (
        <div className="absolute top-[3px] left-0 right-0 h-[1px] bg-[#ffb020]/40 animate-pulse" />
      )}

      <div className="p-3.5 pt-4">
        {/* Header row */}
        <div className="flex items-center gap-2 mb-3">
          {/* Role badge */}
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md font-semibold text-[10px] uppercase tracking-wider text-white transition-all duration-200"
            style={{
              background: roleBg,
              border: `1px solid ${roleColor}40`,
            }}
          >
            {data.role === 'orchestrator' ? (
              <BrainCircuit className="w-3 h-3" style={{ color: roleColor }} />
            ) : (
              <CircleDot className="w-3 h-3" style={{ color: roleColor }} />
            )}
            {data.role}
          </div>

          {/* Loop badge */}
          {(data.loopMode === 'loop' || data.loopMode === 'loop-on-error' || data.loopMode === 'loop-max') && (
            <div
              className="flex items-center gap-1 px-2 py-1 rounded-md transition-all"
              style={{
                background: 'rgba(192,132,252,0.12)',
                border: '1px solid #a855f740',
              }}
            >
              <RotateCw className="w-3 h-3 text-[#c084fc]" />
              <span className="text-[10px] font-[var(--mono)] text-[#c084fc] uppercase font-semibold">
                {data.loopMode === 'loop-max' ? `×${data.maxLoops}` : data.loopMode}
              </span>
            </div>
          )}

          {/* Status badge */}
          {config.badge && (
            <div className="ml-auto flex items-center gap-1.5 animate-fade-in-up">
              <StatusIcon
                className={`w-3 h-3 ${data.status === 'running' ? 'animate-spin' : ''}`}
                style={{ color: config.iconColor }}
              />
              <span
                className="text-[10px] font-[var(--mono)] uppercase font-semibold"
                style={{ color: config.badgeColor }}
              >
                {config.badge}
              </span>
            </div>
          )}
        </div>

        {/* Label + pet */}
        <div className="flex items-start gap-3 mb-2.5">
          <div className="relative">
            <div
              className="text-[28px] leading-none select-none transition-transform duration-200 group-hover:scale-110"
              style={{
                filter: selected
                  ? `drop-shadow(0 0 8px ${roleColor}40)`
                  : undefined,
              }}
            >
              {PET_EMOJI[data.pet] || '🦊'}
            </div>
            {/* Tiny dot indicator */}
            <div
              className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[var(--bg-deep)]"
              style={{
                background:
                  data.status === 'running'
                    ? 'var(--warn)'
                    : data.status === 'done'
                    ? 'var(--success)'
                    : data.status === 'error'
                    ? 'var(--error)'
                    : 'var(--text-muted)',
              }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-[15px] text-[var(--text-primary)] leading-tight truncate">
              {data.label}
            </div>
            {/* Subtitle with model */}
            <div className="flex items-center gap-1 mt-1">
              <Zap className="w-2.5 h-2.5 text-[var(--text-muted)]" />
              <span className="text-[10px] font-[var(--mono)] text-[var(--text-muted)] truncate">
                {data.model.split('/').pop()}
              </span>
            </div>
          </div>
        </div>

        {/* Tool/skill chips */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {data.toolset.slice(0, 4).map((t) => (
            <span
              key={t}
              className="px-2 py-0.5 rounded-md text-[10px] font-[var(--mono)] border transition-all duration-200 hover:border-opacity-100"
              style={{
                background: `${roleColor}10`,
                border: `1px solid ${roleColor}30`,
                color: roleColor,
              }}
            >
              {t}
            </span>
          ))}
          {data.toolset.length > 4 && (
            <span className="text-[9px] text-[var(--text-muted)] px-1 self-center">
              +{data.toolset.length - 4}
            </span>
          )}
          {data.skills.slice(0, 2).map((s) => (
            <span
              key={s}
              className="px-2 py-0.5 rounded-md text-[10px] font-[var(--mono)] border transition-all duration-200"
              style={{
                background: 'rgba(251,191,36,0.08)',
                border: '1px solid rgba(251,191,36,0.25)',
                color: '#fcd34d',
              }}
            >
              {s}
            </span>
          ))}
          {data.skills.length > 2 && (
            <span className="text-[9px] text-[var(--text-muted)] px-1 self-center">
              +{data.skills.length - 2}
            </span>
          )}
        </div>

        {/* Instructions */}
        {data.instructions && (
          <div className="text-[11px] text-[var(--text-secondary)] line-clamp-2 font-[var(--mono)] bg-[var(--bg-deep)] rounded-lg px-3 py-2 mb-3 border border-[var(--border-subtle)] transition-colors duration-200 group-hover:border-[var(--border)]">
            {data.instructions}
          </div>
        )}

        {/* Artifact output indicator */}
        {data.output && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-[var(--mono)] text-emerald-400 mb-3">
            <FileCode className="w-3 h-3" />
            <span>Generated Artifact Ready</span>
          </div>
        )}

        {/* Bottom meta row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-[var(--text-muted)]">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span className="text-[10px] font-[var(--mono)]">{data.timeout}s</span>
            </div>
            {data.maxLoops > 1 && (
              <div className="flex items-center gap-1">
                <RotateCw className="w-3 h-3" />
                <span className="text-[10px] font-[var(--mono)]">{data.maxLoops}</span>
              </div>
            )}
          </div>

          {/* Live pulse dot for running */}
          {data.status === 'running' && (
            <div className="flex items-center gap-1.5">
              <div className="relative">
                <div className="w-2 h-2 rounded-full bg-[#ffb020]" />
                <div className="absolute inset-0 w-2 h-2 rounded-full bg-[#ffb020] animate-ping opacity-75" />
              </div>
              <span className="text-[10px] font-[var(--mono)] text-[#ffb020] uppercase">
                live
              </span>
            </div>
          )}
        </div>

        {/* Logs */}
        {data.logs.length > 0 && (
          <div className="mt-3 space-y-1 max-h-[80px] overflow-hidden animate-fade-in-up">
            <div className="flex items-center gap-1 mb-1">
              <div className="h-px flex-1 bg-[var(--border-subtle)]" />
              <span className="text-[9px] font-[var(--mono)] text-[var(--text-muted)] uppercase tracking-wider">
                Logs
              </span>
              <div className="h-px flex-1 bg-[var(--border-subtle)]" />
            </div>
            {data.logs.slice(-3).map((log: string, i: number) => (
              <div
                key={`${data.label}-log-${i}`}
                className="text-[10px] font-[var(--mono)] text-[var(--text-muted)] truncate pl-2 border-l border-[var(--border-subtle)]"
                style={{
                  animationDelay: `${i * 50}ms`,
                }}
              >
                {log}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Target Handle */}
      <Handle
        type="target"
        position={Position.Top}
        aria-label="Input handle for agent dependency connection"
        className="!w-3.5 !h-3.5 !bg-[var(--accent)] !border-2 !border-[var(--bg-deep)] transition-all duration-200 hover:!scale-125 hover:!shadow-[0_0_10px_rgba(0,240,255,0.6)]"
        style={{ top: '-7px' }}
      />

      {/* Source Handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        aria-label="Output handle for downstream agent connection"
        className="!w-3.5 !h-3.5 !bg-[var(--accent)] !border-2 !border-[var(--bg-deep)] transition-all duration-200 hover:!scale-125 hover:!shadow-[0_0_10px_rgba(0,240,255,0.6)]"
        style={{ bottom: '-7px' }}
      />
    </div>
  );
}

export const AgentNode = memo(AgentNodeComponent);
AgentNode.displayName = 'AgentNode';
