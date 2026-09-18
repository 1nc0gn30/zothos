import { Bot, Code, Zap, BookOpen } from 'lucide-react';
import { AxBrowser } from '../components/AxBrowser';
import { SetupWizard } from '../components/SetupWizard';
import { Booking } from '../components/Booking';
import { config } from '../lib/config';

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

export function Home() {
  return (
    <div className="min-h-screen">
      <main className="pt-16">
        {/* Hero */}
        <section className="py-20 md:py-28 px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <span className="inline-block px-3 py-1 rounded-full bg-brand-900/40 text-brand-400 text-sm font-medium mb-6">
              Template by Zoth Studio Team + Jai · Powered by AX API
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
              {config.tagline}
            </h1>
            <p className="text-lg md:text-xl text-zinc-400 mb-10">
              The first creator business template that fetches its own documentation from a live AX API.
              Any AI agent can guide setup. Any creator can follow the wizard.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a href="/#ax-browser" className="px-6 py-3 rounded-lg bg-brand-600 hover:bg-brand-500 font-semibold transition flex items-center gap-2 justify-center">
                <Bot size={18} /> Browse AX Knowledge
              </a>
              <a href="/#wizard" className="px-6 py-3 rounded-lg border border-zinc-700 hover:border-zinc-500 font-semibold transition">
                Setup Wizard
              </a>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 px-6 bg-zinc-900">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Self-documenting from day one</h2>
              <p className="text-zinc-400">This template doesn't just look good — it teaches itself.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Feature icon={Bot} title="AX Knowledge Browser" desc="Live-fetch playbooks, integrations, and env var schemas from the CreatorKit AX API." />
              <Feature icon={Zap} title="Setup Wizard" desc="Step-by-step guided setup powered by AX playbooks. Check off steps as you complete them." />
              <Feature icon={BookOpen} title="Agent-readable" desc="Any AI agent can call the same AX endpoints to guide a creator through full setup." />
              <Feature icon={Code} title="Config-driven" desc="Set VITE_AX_API_URL to point at any CreatorKit deployment. The UI adapts automatically." />
            </div>
          </div>
        </section>

        {/* AX Browser */}
        <AxBrowser />

        {/* Setup Wizard */}
        <SetupWizard />

        {/* Booking */}
        <Booking />

        {/* Footer */}
        <footer className="py-10 px-6 text-center text-zinc-500 text-sm border-t border-zinc-800 bg-zinc-950">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            <span>© {new Date().getFullYear()} AX Creator Flow. Built by Zoth Studio Team + Jai.</span>
            <div className="flex gap-6">
              <a href="https://github.com/nullai/creator-netlify-boilerplate" target="_blank" rel="noreferrer" className="hover:text-zinc-300">GitHub</a>
              <a href="/#ax-browser" className="hover:text-zinc-300">AX Browser</a>
              <a href="/#wizard" className="hover:text-zinc-300">Wizard</a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}