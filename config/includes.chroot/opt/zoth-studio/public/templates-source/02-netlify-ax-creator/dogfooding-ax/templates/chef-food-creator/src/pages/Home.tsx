import { Link } from 'react-router-dom';
import { Check, Mail, CreditCard, Calendar, Download, ChefHat, ClipboardList, Utensils } from 'lucide-react';
import { Newsletter } from '../components/Newsletter';
import { Payments } from '../components/Payments';
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
              {config.chefName} · {config.cuisine} kitchen
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
              {config.brandName}
            </h1>
            <p className="text-lg md:text-xl text-zinc-400 mb-10">
              {config.brandTagline}. Buy the {config.productName} — tested recipe cards, shopping lists, and prep guides — or book a kitchen consultation with {config.chefName}.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a href="/#pricing" className="px-6 py-3 rounded-lg bg-brand-600 hover:bg-brand-500 font-semibold transition">
                Get the {config.productName}
              </a>
              <Link to="/recipes" className="px-6 py-3 rounded-lg border border-zinc-700 hover:border-zinc-500 font-semibold transition flex items-center gap-2 justify-center">
                <Download size={18} /> Preview recipe kit
              </Link>
            </div>
          </div>
        </section>

        {/* Features — what's in the recipe kit */}
        <section id="recipe-kit" className="py-20 px-6 bg-zinc-900">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">What’s in the {config.productName}</h2>
              <p className="text-zinc-400">Everything a working chef or food creator needs to plate, prep, and scale — {config.cuisine} focused.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <Feature icon={ChefHat} title="12 tested recipe cards" desc="Printable cards with ingredients, method, plating notes, and yield — ready for the line or the home kitchen." />
              <Feature icon={ClipboardList} title="Shopping list templates" desc="Categorized prep lists by cuisine so you can source, scale, and cost a service in minutes." />
              <Feature icon={Utensils} title="Prep guides & timing" desc="Day-of prep timeline, station assignments, and holding notes so the kit actually survives a real service." />
              <Feature icon={Mail} title="Kitchen crew newsletter" desc="Weekly tested recipe and prep notes via beehiiv — free to join." />
              <Feature icon={CreditCard} title="Stripe checkout" desc="One-time payment unlocks the full recipe kit instantly. Gated download page included." />
              <Feature icon={Calendar} title="Kitchen consultation" desc="Book a 1:1 with the chef via Cal.com — menu design, kitchen setup, or recipe scaling." />
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <Newsletter />

        {/* Pricing */}
        <section id="pricing" className="py-20 px-6 bg-zinc-950">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Get the {config.productName}</h2>
              <p className="text-zinc-400">One-time payment. Instant download. Gated delivery page.</p>
            </div>
            <Payments />
          </div>
        </section>

        {/* Booking */}
        <Booking />

        {/* What's included */}
        <section className="py-20 px-6 bg-zinc-900">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center">What’s included</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <CheckItem text="12 tested, printable recipe cards" />
              <CheckItem text="Shopping list templates by cuisine" />
              <CheckItem text="Prep guides & day-of timing sheets" />
              <CheckItem text="Plating reference photos" />
              <CheckItem text="Gated recipe kit download page" />
              <CheckItem text="Stripe checkout + webhook delivery" />
              <CheckItem text="beehiiv newsletter signup — join the crew" />
              <CheckItem text="Cal.com kitchen consultation booking" />
              <CheckItem text="Vite + React + TS + Tailwind, Netlify-ready" />
            </div>
            <div className="mt-10 text-center">
              <Link to="/recipes" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-brand-600 hover:bg-brand-500 font-semibold transition">
                <Download size={18} /> Preview recipe kit page
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-10 px-6 text-center text-zinc-500 text-sm border-t border-zinc-800 bg-zinc-950">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <span>© {new Date().getFullYear()} {config.brandName} · {config.chefName}. Powered by Netlify.</span>
          <div className="flex gap-6">
            <a href="https://github.com/nealfrazier/creator-netlify-boilerplate" target="_blank" rel="noreferrer" className="hover:text-zinc-300">GitHub</a>
            <a href="/#newsletter" className="hover:text-zinc-300">Kitchen Crew</a>
            <a href="/#pricing" className="hover:text-zinc-300">Recipe Kit</a>
            <Link to="/recipes" className="hover:text-zinc-300">Recipes</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}