import { useState, useEffect, useMemo } from 'react';
import { loadProgress, saveProgress, healStorage } from '../lib/gameplanClient';
import type { StoredProgress } from '../lib/gameplanClient';

const LOCAL_KEY = 'dogfooding-gameplan-progress';
const HEAL_KEY = 'dogfooding-gameplan-healed-version';
const CURRENT_HEAL_VERSION = 'v2';

interface Task {
  id: string;
  text: string;
}

interface Phase {
  id: string;
  number: number;
  title: string;
  duration: string;
  goal: string;
  tasks: Task[];
}

const phases: Phase[] = [
  {
    id: 'academy',
    number: 1,
    title: 'Master the Agile App Academy',
    duration: 'This week',
    goal: 'Finish the core materials and produce a one-page strategy summary.',
    tasks: [
      { id: 'p1-t1', text: 'Go to trydogfooding.com/agile-app-academy' },
      { id: 'p1-t2', text: 'Consume all videos, guides, and frameworks' },
      { id: 'p1-t3', text: 'Define your MVP clearly' },
      { id: 'p1-t4', text: 'Map an agile/iterative build process' },
      { id: 'p1-t5', text: 'Identify fastest dogfooding feedback loops' },
      { id: 'p1-t6', text: 'Write a one-page strategy/roadmap summary' },
    ],
  },
  {
    id: 'kitchen',
    number: 2,
    title: 'Secure Commercial Kitchen Access',
    duration: 'This week',
    goal: 'Reach out to 1–2 kitchen/incubator options and get on their radar.',
    tasks: [
      { id: 'p2-t1', text: 'Research QEDC / Entrepreneur Space (NYC option)' },
      { id: 'p2-t2', text: 'Contact info@entrepreneurspace.org or call 718-392-0025' },
      { id: 'p2-t3', text: 'Ask about incubation, shared kitchen, free/low-cost programs' },
      { id: 'p2-t4', text: 'Confirm NY business registration requirements' },
      { id: 'p2-t5', text: 'Search local food business incubators as backup' },
      { id: 'p2-t6', text: 'Prepare a short one-pager about the business' },
    ],
  },
  {
    id: 'call',
    number: 3,
    title: 'Prepare for the Call with Jai',
    duration: 'Late next week',
    goal: 'Show up with strategy, questions, and kitchen updates ready.',
    tasks: [
      { id: 'p3-t1', text: 'Finish Agile App Academy materials' },
      { id: 'p3-t2', text: 'Update strategy/roadmap based on the course' },
      { id: 'p3-t3', text: 'Prepare 3–5 specific questions for Jai' },
      { id: 'p3-t4', text: 'Summarize kitchen/incubator outreach status' },
      { id: 'p3-t5', text: 'Have one-page strategy summary ready to share' },
    ],
  },
  {
    id: 'execute',
    number: 4,
    title: 'Execute & Iterate',
    duration: 'Ongoing',
    goal: 'Build in sprints, dogfood relentlessly, and loop back with Jai.',
    tasks: [
      { id: 'p4-t1', text: 'Plan first 1–2 week agile sprint' },
      { id: 'p4-t2', text: 'Use kitchen space to test/produce prototypes' },
      { id: 'p4-t3', text: 'Use your own app + workflow to find friction fast' },
      { id: 'p4-t4', text: 'Collect feedback and prioritize next sprint' },
      { id: 'p4-t5', text: 'Loop back with Jai after the first call' },
    ],
  },
];

export default function GameplanTracker() {
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [mounted, setMounted] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced' | 'offline'>('idle');
  const [healed, setHealed] = useState(false);

  // Self-healing + server load on mount
  useEffect(() => {
    (async () => {
      // Check if we've already healed this version
      const alreadyHealed = sessionStorage.getItem(HEAL_KEY) === CURRENT_HEAL_VERSION;
      if (!alreadyHealed) {
        healStorage();
        sessionStorage.setItem(HEAL_KEY, CURRENT_HEAL_VERSION);
        setHealed(true);
      }

      // Load from server (or localStorage fallback)
      const data = await loadProgress();
      const validCompleted = new Set<string>(
        data.completed.filter((id) => phases.some((p) => p.tasks.some((t) => t.id === id)))
      );
      setCompleted(validCompleted);
      setMounted(true);
      updateStickyStatus(validCompleted.size, 22);
      dispatchProgress(Math.round((validCompleted.size / 22) * 100));
      setSyncStatus('synced');
    })();
  }, []);

  // Heartbeat: sync to server every 30s (self-healing recovers if writes fail)
  useEffect(() => {
    if (!mounted) return;
    const interval = setInterval(async () => {
      if (completed.size === 0) return;
      const ok = await saveProgress(Array.from(completed), CURRENT_HEAL_VERSION);
      setSyncStatus(ok ? 'synced' : 'offline');
    }, 30_000);
    return () => clearInterval(interval);
  }, [mounted, completed]);

  const toggleTask = async (id: string) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      const wasDone = next.has(id);
      if (wasDone) next.delete(id);
      else next.add(id);

      // Write-through: save immediately
      saveProgress(Array.from(next), CURRENT_HEAL_VERSION).then((ok) => {
        setSyncStatus(ok ? 'synced' : 'offline');
      });

      const percent = Math.round((next.size / 22) * 100);
      updateStickyStatus(next.size, 22);
      dispatchProgress(percent);
      return next;
    });
  };

  const totalTasks = useMemo(() => phases.reduce((sum, phase) => sum + phase.tasks.length, 0), []);
  const completedCount = completed.size;
  const percent = Math.round((completedCount / totalTasks) * 100);

  if (!mounted) {
    return (
      <section className="section" id="phases" aria-labelledby="phases-heading">
        <div className="container">
          <div className="section-header">
            <span className="section-kicker">Mission Phases</span>
            <h2 id="phases-heading" className="section-title">Track every move</h2>
            <p className="section-subtitle">Check items off as you finish them. Your progress is saved locally.</p>
          </div>
          <StatusPanel percent={0} completedCount={0} totalTasks={totalTasks} syncStatus="syncing" healed={true} />
          <div className="phases-timeline">
            {phases.map((phase) => (
              <PhaseStep
                key={phase.id}
                phase={phase}
                completed={new Set()}
                onToggle={() => {}}
                phasePercent={0}
                phaseCompleted={0}
                isActive={phase.number === 1}
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section" id="phases" aria-labelledby="phases-heading">
      <div className="container">
        <div className="section-header">
          <span className="section-kicker">Mission Phases</span>
          <h2 id="phases-heading" className="section-title">Track every move</h2>
          <p className="section-subtitle">
            Check items off as you finish them. {syncStatus === 'offline' ? (
              <span className="sync-offline" title="Server unavailable — progress saved locally">⚡ Progress saved locally (server offline)</span>
            ) : (
              'Progress syncs to the cloud.'
            )}
            {healed ? <span className="healed-badge" title="Storage self-healed"> ✨</span> : ''}
          </p>
        </div>

        <StatusPanel percent={percent} completedCount={completedCount} totalTasks={totalTasks} syncStatus={syncStatus} healed={healed} />

        <div className="phases-timeline">
          {phases.map((phase, index) => {
            const phaseCompleted = phase.tasks.filter((t) => completed.has(t.id)).length;
            const phasePercent = Math.round((phaseCompleted / phase.tasks.length) * 100);
            const isCompleted = phaseCompleted === phase.tasks.length;
            const isActive = !isCompleted && phaseCompleted > 0;
            return (
              <PhaseStep
                key={phase.id}
                phase={phase}
                completed={completed}
                onToggle={toggleTask}
                phasePercent={phasePercent}
                phaseCompleted={phaseCompleted}
                isActive={isActive}
                isCompleted={isCompleted}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

function StatusPanel({ percent, completedCount, totalTasks, syncStatus, healed }: {
  percent: number; completedCount: number; totalTasks: number;
  syncStatus: string; healed: boolean;
}) {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;
  const statusLabel = syncStatus === 'offline' ? 'Offline mode — local only' : percent === 100 ? 'All systems go' : percent >= 50 ? 'Momentum building' : 'Mission initialized';
  const statusTitle = percent === 100 ? 'All systems go' : percent >= 50 ? 'Momentum building' : 'Mission initialized';

  return (
    <div className="status-panel" role="region" aria-label="Overall mission progress">
      <div className="status-ring" aria-hidden="true">
        <svg width="120" height="120" viewBox="0 0 120 120">
          <defs>
            <linearGradient id="ring-gradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#00f0ff" />
              <stop offset="100%" stopColor="#a78bfa" />
            </linearGradient>
          </defs>
          <circle className="status-ring-bg" cx="60" cy="60" r={radius} />
          <circle
            className="status-ring-fill"
            cx="60"
            cy="60"
            r={radius}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 0.8s ease' }}
          />
        </svg>
        <div className="status-ring-label">{percent}%</div>
      </div>

      <div className="status-body">
        <span className="status-label">Mission Status</span>
        <h3 className="status-title">{statusTitle}</h3>
        <p className="status-caption">
          {percent === 100
            ? 'Every action item is complete. Time to ship and keep iterating.'
            : `${completedCount} of ${totalTasks} action items checked. Keep the streak alive.`}
          {syncStatus === 'offline' ? ' (local backup active)' : ''}
        </p>
      </div>

      <div className="status-summary">
        <div className="status-summary-number">{completedCount}/{totalTasks}</div>
        <div className="status-summary-label">Tasks done</div>
      </div>
      {syncStatus === 'syncing' && <div className="status-badge syncing" aria-live="polite">Syncing…</div>}
      {syncStatus === 'synced' && <div className="status-badge synced" aria-live="polite">Cloud-synced</div>}
      {syncStatus === 'offline' && <div className="status-badge offline" aria-live="polite">Offline</div>}
    </div>
  );
}

interface PhaseStepProps {
  phase: Phase;
  completed: Set<string>;
  onToggle: (id: string) => void;
  phasePercent: number;
  phaseCompleted: number;
  isActive?: boolean;
  isCompleted?: boolean;
}

function PhaseStep({ phase, completed, onToggle, phasePercent, phaseCompleted, isActive, isCompleted }: PhaseStepProps) {
  return (
    <div className={`phase-step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}>
      <div className="phase-dot">
        {isCompleted ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : (
          phase.number
        )}
      </div>

      <article className="phase-panel" aria-labelledby={`phase-title-${phase.id}`}>
        <div className="phase-header">
          <h3 id={`phase-title-${phase.id}`} className="phase-title">{phase.title}</h3>
          <div className="phase-meta">
            <span className="phase-duration">{phase.duration}</span>
          </div>
        </div>

        <p className="phase-goal">{phase.goal}</p>

        <div className="phase-progress">
          <div className="phase-progress-bar" aria-hidden="true">
            <div className="phase-progress-fill" style={{ width: `${phasePercent}%` }} />
          </div>
          <span className="phase-progress-text">{phaseCompleted}/{phase.tasks.length}</span>
        </div>

        <ul className="task-list" role="list">
          {phase.tasks.map((task) => {
            const isDone = completed.has(task.id);
            return (
              <li
                key={task.id}
                className={`task-item ${isDone ? 'completed' : ''}`}
                onClick={() => onToggle(task.id)}
                role="button"
                tabIndex={0}
                aria-pressed={isDone}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onToggle(task.id);
                  }
                }}
              >
                <span className="task-checkbox" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                <span className="task-text">{task.text}</span>
              </li>
            );
          })}
        </ul>
      </article>
    </div>
  );
}
