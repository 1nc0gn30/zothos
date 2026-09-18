import { Link } from 'react-router-dom';
import { Check, Mail, CreditCard, Calendar, Download, Bot, Code } from 'lucide-react';
import { Newsletter } from '../components/Newsletter';
import { Payments } from '../components/Payments';
import { Booking } from '../components/Booking';
import { AxSection } from '../components/AxSection';

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

export function Home() {
  return (
    <div className="min-h-screen">
      <main className="pt-16">
        {/* Hero */}
        <section className="py-20 md:py-28 px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <span className="inline-block px-3 py-1 rounded-full bg-brand-900/40 text-brand-400 text-sm font-medium mb-6">
              Built by Zoth Studio Team + Jai · Powered by Netlify
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
              Turn your audience into income
            </h1>
            <p className="text-lg md:text-xl text-zinc-400 mb-10">
              Newsletter, payments, booking, digital delivery, and an agent-readable AX API —
              wired up and ready to deploy on Netlify.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a href="/#pricing" className="px-6 py-3 rounded-lg bg-brand-600 hover:bg-brand-500 font-semibold transition">
                Get the toolkit
              </a>
              <a href="/#ax" className="px-6 py-3 rounded-lg border border-zinc-700 hover:border-zinc-500 font-semibold transition flex items-center gap-2 justify-center">
                <Bot size={18} /> Explore the AX API
              </a>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="toolkit" className="py-20 px-6 bg-zinc-900">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need to ship</h2>
              <p className="text-zinc-400">A complete starter kit for newsletter writers, coaches, and indie makers.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <Feature icon={Mail} title="Newsletter engine" desc="Capture subscribers with beehiiv or Substack, no backend required." />
              <Feature icon={CreditCard} title="Payments ready" desc="Accept one-time payments via Stripe or LemonSqueezy out of the box." />
              <Feature icon={Calendar} title="Booking embedded" desc="Let visitors book calls through Cal.com or Calendly." />
              <Feature icon={Download} title="Digital delivery" desc="Stripe webhooks unlock a gated toolkit page automatically." />
              <Feature icon={Bot} title="AX knowledge API" desc="Any AI agent can fetch playbooks, env vars, and setup guides as JSON." />
              <Feature icon={Code} title="Netlify-native" desc="Serverless functions, redirects, and Blobs — deploy in minutes." />
            </div>
          </div>
        </section>

        {/* AX Section */}
        <AxSection />

        {/* Newsletter */}
        <Newsletter />

        {/* Pricing */}
        <section id="pricing" className="py-20 px-6 bg-zinc-950">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Pick your path</h2>
              <p className="text-zinc-400">Start free, then upgrade when you're ready to sell.</p>
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
              <CheckItem text="Stripe Checkout + webhook delivery" />
              <CheckItem text="LemonSqueezy fallback checkout" />
              <CheckItem text="Cal.com / Calendly embed" />
              <CheckItem text="beehiiv / Substack newsletter signup" />
              <CheckItem text="Gated toolkit page with session verification" />
              <CheckItem text="AX API — agent-readable knowledge endpoints" />
              <CheckItem text="README + env template + deploy guide" />
            </div>
            <div className="mt-10 text-center">
              <Link to="/toolkit" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-brand-600 hover:bg-brand-500 font-semibold transition">
                <Download size={18} /> Preview gated toolkit page
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-10 px-6 text-center text-zinc-500 text-sm border-t border-zinc-800 bg-zinc-950">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <span>© {new Date().getFullYear()} CreatorKit. Built by Zoth Studio Team + Jai. Powered by Netlify.</span>
          <div className="flex gap-6">
            <a href="https://github.com/nullai/creator-netlify-boilerplate" target="_blank" rel="noreferrer" className="hover:text-zinc-300">GitHub</a>
            <a href="/#ax" className="hover:text-zinc-300">AX API</a>
            <a href="/#newsletter" className="hover:text-zinc-300">Newsletter</a>
            <a href="/toolkit" className="hover:text-zinc-300">Toolkit</a>
          </div>
        </div>
      </footer>
    </div>
  );
}