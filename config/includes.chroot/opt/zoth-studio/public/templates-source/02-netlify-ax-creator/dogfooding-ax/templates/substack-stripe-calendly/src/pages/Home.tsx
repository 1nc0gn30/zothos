import { Check } from 'lucide-react';
import { config } from '../lib/config';
import { Newsletter } from '../components/Newsletter';
import { Payments } from '../components/Payments';
import { Booking } from '../components/Booking';

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
              A writer's simplest landing page · Powered by Netlify
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
              {config.tagline}
            </h1>
            <p className="text-lg md:text-xl text-zinc-400 mb-10">
              {config.brand} publishes on Substack, sells a short writing guide via Stripe,
              and books reader calls on Calendly — one page, three actions, nothing else.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a href="/#pricing" className="px-6 py-3 rounded-lg bg-brand-600 hover:bg-brand-500 font-semibold transition">
                Get the guide
              </a>
              <a href="/#newsletter" className="px-6 py-3 rounded-lg border border-zinc-700 hover:border-zinc-500 font-semibold transition">
                Read the newsletter
              </a>
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <Newsletter />

        {/* Pricing */}
        <section id="pricing" className="py-20 px-6 bg-zinc-950">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">The writing guide</h2>
              <p className="text-zinc-400">One price. No tiers. Pay once, read forever.</p>
            </div>
            <Payments />
          </div>
        </section>

        {/* Booking */}
        <Booking />

        {/* What's included */}
        <section className="py-20 px-6 bg-zinc-900">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center">What's on this page</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <CheckItem text="Substack newsletter signup redirect" />
              <CheckItem text="Stripe checkout for a writing guide" />
              <CheckItem text="Calendly booking embed" />
              <CheckItem text="Single-page, minimal design" />
              <CheckItem text="Vite + React + TypeScript + Tailwind" />
              <CheckItem text="Netlify Functions keep keys server-side" />
            </div>
          </div>
        </section>
      </main>

      <footer className="py-10 px-6 text-center text-zinc-500 text-sm border-t border-zinc-800 bg-zinc-950">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <span>© {new Date().getFullYear()} {config.brand}. Built by Zoth Studio Team + Jai. Powered by Netlify.</span>
          <div className="flex gap-6">
            <a href="https://github.com/nullai/creator-netlify-boilerplate" target="_blank" rel="noreferrer" className="hover:text-zinc-300">GitHub</a>
            <a href="/#newsletter" className="hover:text-zinc-300">Newsletter</a>
            <a href="/#pricing" className="hover:text-zinc-300">Guide</a>
            <a href="/#book" className="hover:text-zinc-300">Book a call</a>
          </div>
        </div>
      </footer>
    </div>
  );
}