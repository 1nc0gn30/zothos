import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Check,
  Mail,
  CreditCard,
  Calendar,
  Download,
  Bot,
  Code,
  TrendingUp,
  Terminal,
  Copy,
} from 'lucide-react';
import { config } from '../lib/config';
import { Newsletter } from '../components/Newsletter';
import { Payments } from '../components/Payments';
import { Booking } from '../components/Booking';
import { AxBadge } from '../components/AxBadge';

function Feature({ icon: Icon, title, desc }: { icon: any; title: string; desc: string }) {
  return (
    <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/40">
      <div className="w-10 h-10 rounded-lg bg-brand-900/40 flex items-center justify-center text-brand-400 mb-4">
        <Icon size={20} />
      </div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-zinc-400 text-sm">{desc}</p>
    </div>
  );
}

function CheckItem({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-3 text-sm text-zinc-300">
      <Check size={18} className="text-brand-500 mt-0.5 shrink-0" />
      {text}
    </li>
  );
}

const AX_ENDPOINTS = [
  { method: 'GET', path: '/api/ax/overview', desc: 'Full boilerplate summary: integrations, playbooks, templates' },
  { method: 'GET', path: '/api/ax/playbooks', desc: 'All setup playbooks (newsletter, payments, booking, delivery, deploy)' },
  { method: 'GET', path: '/api/ax/integrations', desc: 'All supported integrations with env var schemas' },
  { method: 'GET', path: '/api/ax/env-vars', desc: 'Every env var, description, and which integration it belongs to' },
  { method: 'POST', path: '/api/ax/query', desc: 'Natural-language query: { "topic": "lemonsqueezy" } returns matching knowledge' },
];

export function Home() {
  const axExample = `curl ${config.axApiUrl || 'https://your-creatorkit.netlify.app'}/api/ax/overview | jq`;
  const [copied, setCopied] = useState(false);

  const copyCmd = () => {
    navigator.clipboard.writeText(axExample);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen">
      <main className="pt-16">
        {/* Hero */}
        <section className="py-20 md:py-28 px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="mb-6 flex flex-wrap justify-center gap-3">
              <span className="inline-block px-3 py-1 rounded-full bg-brand-900/40 text-brand-400 text-sm font-medium">
                Build in public · Powered by Netlify
              </span>
              <AxBadge />
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
              {config.tagline}
            </h1>
            <p className="text-lg md:text-xl text-zinc-400 mb-10">
              The indie hacker starter kit — newsletter, lifetime deal, strategy calls, and an AX
              API that makes your whole setup agent-readable. Ship your SaaS in a weekend.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href="/#pricing"
                className="px-6 py-3 rounded-lg bg-brand-600 hover:bg-brand-500 font-semibold transition"
              >
                Get the lifetime deal
              </a>
              <a
                href="/#ax"
                className="px-6 py-3 rounded-lg border border-zinc-700 hover:border-zinc-500 font-semibold transition flex items-center gap-2 justify-center"
              >
                <Bot size={18} /> Explore the AX API
              </a>
            </div>
            {config.buildLogUrl && (
              <div className="mt-6">
                <a
                  href={config.buildLogUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-brand-400 hover:text-brand-300 inline-flex items-center gap-1"
                >
                  <TrendingUp size={14} /> Follow the build log →
                </a>
              </div>
            )}
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-20 px-6 bg-zinc-900">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything an indie hacker needs</h2>
              <p className="text-zinc-400">
                A complete build-in-public stack — newsletter, payments, booking, and agent-native docs.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <Feature
                icon={Mail}
                title="beehiiv newsletter"
                desc="Grow your audience with a build-in-public newsletter. Auto-subscribe from your landing page."
              />
              <Feature
                icon={CreditCard}
                title="LemonSqueezy lifetime deal"
                desc="Sell a one-time lifetime deal with global tax/VAT handled. Pay once, use forever."
              />
              <Feature
                icon={Calendar}
                title="Cal.com strategy calls"
                desc="Book product strategy calls with prospects and users via Cal.com embed."
              />
              <Feature
                icon={Bot}
                title="AX knowledge API"
                desc="This template self-documents — any AI agent can read your integrations, env vars, and playbooks as JSON."
              />
              <Feature
                icon={Download}
                title="Gated deal page"
                desc="LemonSqueezy redirect unlocks a download page with your SaaS starter kit resources."
              />
              <Feature
                icon={Code}
                title="Netlify-native"
                desc="Serverless functions, redirects, and SPA fallback. Deploy in minutes, not days."
              />
            </div>
          </div>
        </section>

        {/* AX Section — self-documentation */}
        <section id="ax" className="py-20 px-6 bg-zinc-950">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-900/40 text-brand-400 text-sm font-medium mb-6">
                <Bot size={16} /> AX-Powered — Self-Documenting Template
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                This template documents itself
              </h2>
              <p className="text-zinc-400 max-w-2xl mx-auto">
                Every integration, playbook, and env var is served as structured JSON from the AX
                API. Point any AI agent — or yourself — at the AX endpoints and the full setup is
                machine-readable. No source code reading required.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-10">
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Terminal size={18} className="text-brand-400" />
                  <h3 className="font-semibold">Live endpoints</h3>
                </div>
                <div className="space-y-2">
                  {AX_ENDPOINTS.map((ep) => (
                    <div key={ep.path} className="flex items-start gap-3 text-sm">
                      <span
                        className={`shrink-0 px-1.5 py-0.5 rounded text-xs font-mono font-bold ${
                          ep.method === 'GET'
                            ? 'bg-emerald-900/50 text-emerald-400'
                            : 'bg-amber-900/50 text-amber-400'
                        }`}
                      >
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
                <div className="relative">
                  <pre className="bg-zinc-950 border border-zinc-800 rounded-lg p-4 text-xs font-mono text-zinc-300 overflow-x-auto whitespace-pre-wrap break-all">
                    {axExample}
                  </pre>
                  <button
                    onClick={copyCmd}
                    className="absolute top-2 right-2 p-1.5 rounded bg-zinc-800 hover:bg-zinc-700 transition"
                    aria-label="Copy command"
                  >
                    {copied ? (
                      <Check size={14} className="text-emerald-400" />
                    ) : (
                      <Copy size={14} className="text-zinc-400" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-zinc-500 mt-3">
                  Set <code className="text-brand-400">VITE_AX_API_URL</code> to your deployed
                  CreatorKit boilerplate URL. The AX badge above checks live status automatically.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-brand-900/40 bg-brand-950/10 p-6">
              <h3 className="font-semibold mb-2 text-brand-400">Why AX for indie hackers?</h3>
              <p className="text-sm text-zinc-400">
                When you're moving fast, docs rot. The AX API keeps your setup knowledge in code —
                integrations, env vars, and step-by-step playbooks are all served as JSON. Any AI
                agent (including Jai) can read your config and guide you through setup, debugging,
                or onboarding a collaborator without reading a single README.
              </p>
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <Newsletter />

        {/* Pricing */}
        <section id="pricing" className="py-20 px-6 bg-zinc-950">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">One price. Lifetime access.</h2>
              <p className="text-zinc-400">
                No subscriptions. No upsells. Pay once and get every future update free.
              </p>
            </div>
            <Payments />
          </div>
        </section>

        {/* Booking */}
        <Booking />

        {/* What's included */}
        <section className="py-20 px-6 bg-zinc-900">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center">What's included</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <CheckItem text="Vite + React + TypeScript + Tailwind site" />
              <CheckItem text="Netlify Functions for newsletter + checkout" />
              <CheckItem text="LemonSqueezy lifetime deal checkout" />
              <CheckItem text="beehiiv newsletter auto-subscribe" />
              <CheckItem text="Cal.com booking embed" />
              <CheckItem text="Gated deal page with download links" />
              <CheckItem text="AX API — agent-readable self-documentation" />
              <CheckItem text="AX badge with live connection status" />
              <CheckItem text="Build-in-public link in nav" />
              <CheckItem text="README + env template + deploy guide" />
            </div>
            <div className="mt-10 text-center">
              <Link
                to="/deal"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-brand-600 hover:bg-brand-500 font-semibold transition"
              >
                <Download size={18} /> Preview the gated deal page
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-10 px-6 text-center text-zinc-500 text-sm border-t border-zinc-800 bg-zinc-950">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <span>
            © {new Date().getFullYear()} {config.brand}. Built by Zoth Studio Team + Jai. Powered by
            Netlify.
          </span>
          <div className="flex gap-6">
            <a
              href="https://github.com/nullai/creator-netlify-boilerplate"
              target="_blank"
              rel="noreferrer"
              className="hover:text-zinc-300"
            >
              GitHub
            </a>
            <a href="/#ax" className="hover:text-zinc-300">
              AX API
            </a>
            <a href="/#newsletter" className="hover:text-zinc-300">
              Newsletter
            </a>
            <a href="/deal" className="hover:text-zinc-300">
              Deal
            </a>
            {config.buildLogUrl && (
              <a
                href={config.buildLogUrl}
                target="_blank"
                rel="noreferrer"
                className="hover:text-zinc-300"
              >
                Build Log
              </a>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}