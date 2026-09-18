import { useState } from 'react';
import { Bot, Terminal, Copy, Check } from 'lucide-react';

const ENDPOINTS = [
  { method: 'GET', path: '/api/ax/overview', desc: 'Full boilerplate summary: integrations, playbooks, templates' },
  { method: 'GET', path: '/api/ax/playbooks', desc: 'All setup playbooks (newsletter, payments, booking, delivery, deploy)' },
  { method: 'GET', path: '/api/ax/playbooks/:id', desc: 'Single playbook with step-by-step instructions' },
  { method: 'GET', path: '/api/ax/integrations', desc: 'All supported integrations with env var schemas' },
  { method: 'GET', path: '/api/ax/integrations/:id', desc: 'Single integration detail' },
  { method: 'GET', path: '/api/ax/env-vars', desc: 'Every env var, its description, and which integration it belongs to' },
  { method: 'GET', path: '/api/ax/templates', desc: 'Available templates and their stack configurations' },
  { method: 'GET', path: '/api/ax/patterns', desc: 'Framework-agnostic integration patterns with code snippets for any stack' },
  { method: 'POST', path: '/api/ax/query', desc: 'Natural-language query: { "topic": "stripe" } returns matching playbooks, integrations, env vars' },
  { method: 'POST', path: '/api/ax/configure', desc: 'Universal configurator: send framework + integrations, get tailored setup plan with code snippets' },
];

const EXAMPLES = [
  {
    label: 'Overview',
    cmd: 'curl https://your-site.netlify.app/api/ax/overview | jq',
  },
  {
    label: 'Configure Next.js',
    cmd: 'curl -X POST https://your-site.netlify.app/api/ax/configure \\\n  -H "Content-Type: application/json" \\\n  -d \'{"framework":"next.js","integrations":["stripe","beehiiv","calcom"]}\' | jq',
  },
  {
    label: 'Query: stripe',
    cmd: 'curl -X POST https://your-site.netlify.app/api/ax/query \\\n  -H "Content-Type: application/json" \\\n  -d \'{"topic":"stripe"}\' | jq',
  },
  {
    label: 'All patterns',
    cmd: 'curl https://your-site.netlify.app/api/ax/patterns | jq',
  },
  {
    label: 'Env var schema',
    cmd: 'curl https://your-site.netlify.app/api/ax/env-vars | jq',
  },
];

export function AxSection() {
  const [activeExample, setActiveExample] = useState(0);
  const [copied, setCopied] = useState(false);

  const copyCmd = () => {
    navigator.clipboard.writeText(EXAMPLES[activeExample].cmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="ax" className="py-20 px-6 bg-zinc-950">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-900/40 text-brand-400 text-sm font-medium mb-6">
            <Bot size={16} /> Agent AX — AI-Readable Knowledge API
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Any AI agent can read this boilerplate</h2>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            Every integration, playbook, and env var is served as structured JSON from Netlify Functions.
            Point any AI agent at the AX endpoints and it can guide a creator through full setup —
            no source code reading required.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Terminal size={18} className="text-brand-400" />
              <h3 className="font-semibold">Live endpoints</h3>
            </div>
            <div className="space-y-2">
              {ENDPOINTS.map((ep) => (
                <div key={ep.path} className="flex items-start gap-3 text-sm">
                  <span className={`shrink-0 px-1.5 py-0.5 rounded text-xs font-mono font-bold ${ep.method === 'GET' ? 'bg-emerald-900/50 text-emerald-400' : 'bg-amber-900/50 text-amber-400'}`}>
                    {ep.method}
                  </span>
                  <div>
                    <code className="text-zinc-200 font-mono text-xs">{ep.path}</code>
                    <p className="text-zinc-500 text-xs mt-0.5">{ep.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Terminal size={18} className="text-brand-400" />
              <h3 className="font-semibold">Try it</h3>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {EXAMPLES.map((ex, i) => (
                <button
                  key={ex.label}
                  onClick={() => setActiveExample(i)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${activeExample === i ? 'bg-brand-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'}`}
                >
                  {ex.label}
                </button>
              ))}
            </div>
            <div className="relative">
              <pre className="bg-zinc-950 border border-zinc-800 rounded-lg p-4 text-xs font-mono text-zinc-300 overflow-x-auto whitespace-pre-wrap break-all">
                {EXAMPLES[activeExample].cmd}
              </pre>
              <button
                onClick={copyCmd}
                className="absolute top-2 right-2 p-1.5 rounded bg-zinc-800 hover:bg-zinc-700 transition"
                aria-label="Copy command"
              >
                {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} className="text-zinc-400" />}
              </button>
            </div>
            <p className="text-xs text-zinc-500 mt-3">
              Run these against your deployed site or local dev server (replace the URL).
              All AX responses are JSON with CORS enabled.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-brand-900/40 bg-brand-950/10 p-6">
          <h3 className="font-semibold mb-2 text-brand-400">Why AX?</h3>
          <p className="text-sm text-zinc-400">
            When Jai sends you a new creator client, their AI agent can call the AX API to understand
            exactly what integrations are available, what env vars to set, and what steps to follow —
            then guide the creator through setup autonomously. The boilerplate becomes self-documenting
            and agent-native, not just human-readable docs.
          </p>
        </div>
      </div>
    </section>
  );
}