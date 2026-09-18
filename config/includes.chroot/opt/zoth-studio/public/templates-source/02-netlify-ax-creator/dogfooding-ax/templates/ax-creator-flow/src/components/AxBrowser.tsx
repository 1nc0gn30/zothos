import { useState, useEffect, useCallback } from 'react';
import { Bot, Search, BookOpen, Plug, Key, Layers, Loader2, AlertCircle, ExternalLink } from 'lucide-react';
import { AxClient, AxOverview, AxPlaybook, AxIntegration } from '../lib/ax-client';

type Tab = 'overview' | 'playbooks' | 'integrations' | 'env-vars' | 'templates';

export function AxBrowser() {
  const client = new AxClient();
  const [tab, setTab] = useState<Tab>('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [overview, setOverview] = useState<AxOverview | null>(null);
  const [playbooks, setPlaybooks] = useState<AxPlaybook[]>([]);
  const [integrations, setIntegrations] = useState<AxIntegration[]>([]);
  const [envVars, setEnvVars] = useState<{ key: string; required: boolean; description: string; integration: string }[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [query, setQuery] = useState('');
  const [queryResult, setQueryResult] = useState<any>(null);
  const [queryLoading, setQueryLoading] = useState(false);
  const [expandedPlaybook, setExpandedPlaybook] = useState<string | null>(null);

  const loadOverview = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const ov = await client.fetchOverview();
      setOverview(ov);
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  }, []);

  const loadPlaybooks = useCallback(async () => {
    if (playbooks.length > 0) return;
    setLoading(true);
    try {
      const data = await client.fetchPlaybooks();
      setPlaybooks(data.playbooks);
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  }, [playbooks.length]);

  const loadIntegrations = useCallback(async () => {
    if (integrations.length > 0) return;
    setLoading(true);
    try {
      const data = await client.fetchIntegrations();
      setIntegrations(data.integrations);
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  }, [integrations.length]);

  const loadEnvVars = useCallback(async () => {
    if (envVars.length > 0) return;
    setLoading(true);
    try {
      const data = await client.fetchEnvVars();
      setEnvVars(data.envVars);
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  }, [envVars.length]);

  const loadTemplates = useCallback(async () => {
    if (templates.length > 0) return;
    setLoading(true);
    try {
      const data = await client.fetchTemplates();
      setTemplates(data.templates);
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  }, [templates.length]);

  useEffect(() => {
    loadOverview();
  }, [loadOverview]);

  const runQuery = async () => {
    if (!query.trim()) return;
    setQueryLoading(true);
    try {
      const result = await client.query(query.trim());
      setQueryResult(result);
    } catch (err: any) {
      setError(err.message);
    }
    setQueryLoading(false);
  };

  if (!client.isConfigured()) {
    return (
      <section id="ax-browser" className="py-20 px-6 bg-zinc-900">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-900/40 text-brand-400 text-sm font-medium mb-6">
            <Bot size={16} /> AX Knowledge Browser
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Connect to a CreatorKit AX API</h2>
          <p className="text-zinc-400 mb-8">
            This template fetches its own documentation from a deployed CreatorKit boilerplate.
            Set <code className="bg-zinc-800 px-2 py-0.5 rounded text-brand-400">VITE_AX_API_URL</code> in your environment
            to connect to the AX API and browse playbooks, integrations, and env var schemas live.
          </p>
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6 text-left">
            <p className="text-sm text-zinc-400 mb-2">Example .env:</p>
            <code className="text-brand-400 text-sm">VITE_AX_API_URL=https://your-creatorkit.netlify.app</code>
          </div>
        </div>
      </section>
    );
  }

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: 'overview', label: 'Overview', icon: Bot },
    { id: 'playbooks', label: 'Playbooks', icon: BookOpen },
    { id: 'integrations', label: 'Integrations', icon: Plug },
    { id: 'env-vars', label: 'Env Vars', icon: Key },
    { id: 'templates', label: 'Templates', icon: Layers },
  ];

  return (
    <section id="ax-browser" className="py-20 px-6 bg-zinc-900">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-900/40 text-brand-400 text-sm font-medium mb-4">
            <Bot size={16} /> AX Knowledge Browser — Live
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-2">Browse the boilerplate knowledge</h2>
          <p className="text-zinc-400">Fetched live from the CreatorKit AX API. Any AI agent can access the same data.</p>
        </div>

        {/* Query bar */}
        <div className="flex gap-2 mb-8 max-w-2xl mx-auto">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="Search: stripe, newsletter, booking..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && runQuery()}
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-brand-500"
            />
          </div>
          <button
            onClick={runQuery}
            disabled={queryLoading}
            className="px-5 py-3 rounded-lg bg-brand-600 hover:bg-brand-500 disabled:opacity-50 font-semibold transition"
          >
            {queryLoading ? <Loader2 size={18} className="animate-spin" /> : 'Query'}
          </button>
        </div>

        {queryResult && (
          <div className="mb-8 rounded-xl border border-brand-900/50 bg-brand-950/10 p-6">
            <h3 className="font-semibold mb-3 text-brand-400">Query: "{queryResult.topic}"</h3>
            <div className="grid sm:grid-cols-3 gap-4 text-sm">
              <div><span className="text-zinc-500">Playbooks:</span> <span className="text-zinc-200">{queryResult.playbooks.length}</span></div>
              <div><span className="text-zinc-500">Integrations:</span> <span className="text-zinc-200">{queryResult.integrations.length}</span></div>
              <div><span className="text-zinc-500">Env vars:</span> <span className="text-zinc-200">{queryResult.envVars.length}</span></div>
            </div>
            {queryResult.playbooks.length > 0 && (
              <div className="mt-4 space-y-2">
                {queryResult.playbooks.map((pb: AxPlaybook) => (
                  <div key={pb.id} className="text-sm">
                    <span className="text-brand-400">→</span> <span className="text-zinc-200">{pb.title}</span>
                  </div>
                ))}
              </div>
            )}
            {queryResult.envVars.length > 0 && (
              <div className="mt-3 space-y-1">
                {queryResult.envVars.map((v: any) => (
                  <div key={v.key} className="text-xs font-mono text-zinc-400">
                    <span className="text-emerald-400">{v.key}</span> — {v.description}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-lg border border-rose-900/60 bg-rose-950/20 p-4 flex items-center gap-2 text-rose-200">
            <AlertCircle size={18} /> {error}
          </div>
        )}

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 border-b border-zinc-800 pb-3">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                setTab(t.id);
                if (t.id === 'playbooks') loadPlaybooks();
                if (t.id === 'integrations') loadIntegrations();
                if (t.id === 'env-vars') loadEnvVars();
                if (t.id === 'templates') loadTemplates();
              }}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition ${tab === t.id ? 'bg-brand-600 text-white' : 'text-zinc-400 hover:text-zinc-200'}`}
            >
              <t.icon size={16} /> {t.label}
            </button>
          ))}
        </div>

        {loading && (
          <div className="flex items-center justify-center py-12 text-zinc-500">
            <Loader2 size={24} className="animate-spin mr-2" /> Loading from AX API...
          </div>
        )}

        {!loading && tab === 'overview' && overview && (
          <div className="space-y-6">
            <div className="grid sm:grid-cols-3 gap-4">
              <StatCard label="Integrations" value={overview.integrationCount} />
              <StatCard label="Playbooks" value={overview.playbookCount} />
              <StatCard label="Templates" value={overview.templateCount} />
            </div>
            <div>
              <h3 className="font-semibold mb-3 text-zinc-300">Available endpoints</h3>
              <div className="space-y-1">
                {overview.endpoints.map((ep) => (
                  <code key={ep} className="block text-xs font-mono text-brand-400 bg-zinc-950 rounded p-2 border border-zinc-800">{ep}</code>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-3 text-zinc-300">Integrations</h3>
              <div className="grid sm:grid-cols-2 gap-2">
                {overview.integrations.map((i) => (
                  <div key={i.id} className="rounded-lg border border-zinc-800 bg-zinc-950 p-3 text-sm">
                    <span className="text-zinc-200 font-medium">{i.name}</span>
                    <span className="text-zinc-500 ml-2 text-xs">{i.category}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {!loading && tab === 'playbooks' && (
          <div className="space-y-3">
            {playbooks.map((pb) => (
              <div key={pb.id} className="rounded-xl border border-zinc-800 bg-zinc-950 overflow-hidden">
                <button
                  onClick={() => setExpandedPlaybook(expandedPlaybook === pb.id ? null : pb.id)}
                  className="w-full p-4 flex items-center justify-between text-left hover:bg-zinc-900 transition"
                >
                  <div>
                    <h3 className="font-semibold text-zinc-200">{pb.title}</h3>
                    <p className="text-sm text-zinc-500 mt-0.5">{pb.description}</p>
                  </div>
                  <span className="text-xs text-brand-400 shrink-0 ml-3 px-2 py-1 rounded bg-brand-900/30">{pb.category}</span>
                </button>
                {expandedPlaybook === pb.id && (
                  <div className="border-t border-zinc-800 p-4 space-y-3">
                    {pb.steps.map((step, i) => (
                      <div key={i} className="flex gap-3 text-sm">
                        <span className="shrink-0 w-6 h-6 rounded-full bg-brand-900/40 text-brand-400 flex items-center justify-center text-xs font-bold">{i + 1}</span>
                        <div>
                          <p className="text-zinc-200 font-medium">{step.action}</p>
                          <p className="text-zinc-500 text-xs mt-0.5">{step.detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {!loading && tab === 'integrations' && (
          <div className="grid sm:grid-cols-2 gap-4">
            {integrations.map((integ) => (
              <div key={integ.id} className="rounded-xl border border-zinc-800 bg-zinc-950 p-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-zinc-200">{integ.name}</h3>
                  <span className="text-xs text-brand-400 px-2 py-0.5 rounded bg-brand-900/30">{integ.category}</span>
                </div>
                <p className="text-xs text-zinc-500 mb-3">{integ.notes}</p>
                <div className="space-y-1 mb-3">
                  {integ.envVars.map((v) => (
                    <div key={v.key} className="text-xs font-mono">
                      <span className={v.required ? 'text-emerald-400' : 'text-zinc-500'}>{v.required ? '●' : '○'}</span>{' '}
                      <span className="text-zinc-300">{v.key}</span>
                      <span className="text-zinc-600"> — {v.description}</span>
                    </div>
                  ))}
                </div>
                <a href={integ.setupUrl} target="_blank" rel="noreferrer" className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1">
                  Setup <ExternalLink size={12} />
                </a>
              </div>
            ))}
          </div>
        )}

        {!loading && tab === 'env-vars' && (
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-zinc-900 border-b border-zinc-800">
                <tr>
                  <th className="text-left p-3 text-zinc-400 font-medium">Key</th>
                  <th className="text-left p-3 text-zinc-400 font-medium">Required</th>
                  <th className="text-left p-3 text-zinc-400 font-medium">Integration</th>
                  <th className="text-left p-3 text-zinc-400 font-medium">Description</th>
                </tr>
              </thead>
              <tbody>
                {envVars.map((v) => (
                  <tr key={v.key + v.integration} className="border-b border-zinc-800/50">
                    <td className="p-3 font-mono text-emerald-400 text-xs">{v.key}</td>
                    <td className="p-3">{v.required ? <span className="text-rose-400">required</span> : <span className="text-zinc-500">optional</span>}</td>
                    <td className="p-3 text-zinc-300 text-xs">{v.integration}</td>
                    <td className="p-3 text-zinc-500 text-xs">{v.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && tab === 'templates' && (
          <div className="grid sm:grid-cols-2 gap-4">
            {templates.map((tmpl) => (
              <div key={tmpl.slug} className="rounded-xl border border-zinc-800 bg-zinc-950 p-5">
                <h3 className="font-semibold text-zinc-200 mb-1">{tmpl.name}</h3>
                <p className="text-sm text-zinc-500 mb-3">{tmpl.description}</p>
                <div className="flex flex-wrap gap-1 mb-3">
                  {tmpl.envVars.map((v: string) => (
                    <code key={v} className="text-xs font-mono text-zinc-400 bg-zinc-900 px-1.5 py-0.5 rounded">{v}</code>
                  ))}
                </div>
                <p className="text-xs text-zinc-600">{tmpl.useCase}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5 text-center">
      <div className="text-3xl font-bold text-brand-400">{value}</div>
      <div className="text-sm text-zinc-500 mt-1">{label}</div>
    </div>
  );
}