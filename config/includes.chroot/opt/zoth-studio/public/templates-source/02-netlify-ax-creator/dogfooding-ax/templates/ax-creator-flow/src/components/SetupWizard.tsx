import { useState, useEffect } from 'react';
import { Bot, Loader2, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';
import { AxClient, AxPlaybook } from '../lib/ax-client';

export function SetupWizard() {
  const client = new AxClient();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [playbooks, setPlaybooks] = useState<AxPlaybook[]>([]);
  const [activePlaybook, setActivePlaybook] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!client.isConfigured()) {
      setLoading(false);
      return;
    }
    (async () => {
      try {
        const data = await client.fetchPlaybooks();
        setPlaybooks(data.playbooks);
      } catch (err: any) {
        setError(err.message);
      }
      setLoading(false);
    })();
  }, []);

  const toggleStep = (stepId: string) => {
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(stepId)) next.delete(stepId);
      else next.add(stepId);
      return next;
    });
  };

  if (!client.isConfigured()) {
    return null;
  }

  if (loading) {
    return (
      <section id="wizard" className="py-20 px-6 bg-zinc-950">
        <div className="max-w-3xl mx-auto flex items-center justify-center py-12 text-zinc-500">
          <Loader2 size={24} className="animate-spin mr-2" /> Loading setup wizard...
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="wizard" className="py-20 px-6 bg-zinc-950">
        <div className="max-w-3xl mx-auto rounded-lg border border-rose-900/60 bg-rose-950/20 p-4 flex items-center gap-2 text-rose-200">
          <AlertCircle size={18} /> {error}
        </div>
      </section>
    );
  }

  const pb = playbooks[activePlaybook];
  if (!pb) return null;
  const pbStepIds = pb.steps.map((_, i) => `${pb.id}-${i}`);
  const pbCompleted = pbStepIds.filter((id) => completedSteps.has(id)).length;
  const pbPercent = Math.round((pbCompleted / pb.steps.length) * 100);
  const totalSteps = playbooks.reduce((sum, p) => sum + p.steps.length, 0);
  const totalCompleted = completedSteps.size;
  const totalPercent = Math.round((totalCompleted / totalSteps) * 100);

  return (
    <section id="wizard" className="py-20 px-6 bg-zinc-950">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-900/40 text-brand-400 text-sm font-medium mb-4">
            <Bot size={16} /> AX-Powered Setup Wizard
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-2">Guided setup from AX playbooks</h2>
          <p className="text-zinc-400">Step through each integration with instructions fetched from the AX API.</p>
          <div className="mt-4 max-w-xs mx-auto">
            <div className="flex justify-between text-xs text-zinc-500 mb-1">
              <span>Overall progress</span>
              <span>{totalCompleted}/{totalSteps} ({totalPercent}%)</span>
            </div>
            <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
              <div className="h-full bg-brand-500 transition-all duration-500" style={{ width: `${totalPercent}%` }} />
            </div>
          </div>
        </div>

        {/* Playbook selector */}
        <div className="flex flex-wrap gap-2 mb-6">
          {playbooks.map((p, i) => {
            const pIds = p.steps.map((_, si) => `${p.id}-${si}`);
            const pDone = pIds.filter((id) => completedSteps.has(id)).length;
            const pComplete = pDone === p.steps.length;
            return (
              <button
                key={p.id}
                onClick={() => setActivePlaybook(i)}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition flex items-center gap-2 ${activePlaybook === i ? 'bg-brand-600 text-white' : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200'}`}
              >
                {pComplete && <CheckCircle size={14} className="text-emerald-400" />}
                {p.title}
              </button>
            );
          })}
        </div>

        {/* Active playbook */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-zinc-200">{pb.title}</h3>
              <p className="text-sm text-zinc-500 mt-1">{pb.description}</p>
            </div>
            <span className="text-xs text-brand-400 px-2 py-1 rounded bg-brand-900/30 shrink-0">{pb.category}</span>
          </div>

          <div className="mb-4">
            <div className="flex justify-between text-xs text-zinc-500 mb-1">
              <span>Playbook progress</span>
              <span>{pbCompleted}/{pb.steps.length} ({pbPercent}%)</span>
            </div>
            <div className="h-1.5 rounded-full bg-zinc-800 overflow-hidden">
              <div className="h-full bg-brand-500 transition-all duration-500" style={{ width: `${pbPercent}%` }} />
            </div>
          </div>

          <div className="space-y-3">
            {pb.steps.map((step, i) => {
              const stepId = `${pb.id}-${i}`;
              const done = completedSteps.has(stepId);
              return (
                <div
                  key={i}
                  onClick={() => toggleStep(stepId)}
                  className={`flex gap-3 p-3 rounded-lg border cursor-pointer transition ${done ? 'border-emerald-900/50 bg-emerald-950/10' : 'border-zinc-800 bg-zinc-950 hover:border-zinc-700'}`}
                >
                  <div className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${done ? 'bg-emerald-900 text-emerald-400' : 'bg-zinc-800 text-zinc-500'}`}>
                    {done ? <CheckCircle size={14} /> : i + 1}
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${done ? 'text-emerald-300 line-through' : 'text-zinc-200'}`}>{step.action}</p>
                    <p className="text-xs text-zinc-500 mt-0.5">{step.detail}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between mt-6">
            <button
              onClick={() => setActivePlaybook(Math.max(0, activePlaybook - 1))}
              disabled={activePlaybook === 0}
              className="px-4 py-2 rounded-lg text-sm text-zinc-400 hover:text-zinc-200 disabled:opacity-30 transition"
            >
              ← Previous
            </button>
            <button
              onClick={() => setActivePlaybook(Math.min(playbooks.length - 1, activePlaybook + 1))}
              disabled={activePlaybook === playbooks.length - 1}
              className="px-4 py-2 rounded-lg text-sm font-medium text-brand-400 hover:text-brand-300 disabled:opacity-30 transition flex items-center gap-1"
            >
              Next playbook <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}