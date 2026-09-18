import { config } from '../lib/config';

export function Booking() {
  const { calendlyUrl } = config;
  const isPlaceholder = !calendlyUrl;

  return (
    <section id="book" className="py-20 px-6 bg-zinc-900">
      <div className="max-w-3xl mx-auto text-center">
        <span className="inline-block px-3 py-1 rounded-full bg-brand-900/40 text-brand-400 text-sm font-medium mb-4">
          30-minute call
        </span>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Book a writing feedback call</h2>
        <p className="text-zinc-400 mb-8">Stuck on a draft? Let's talk through it.</p>

        {isPlaceholder ? (
          <div className="rounded-2xl border border-dashed border-zinc-700 bg-zinc-950 p-10 text-zinc-400">
            <p className="mb-4">Booking not configured yet.</p>
            <p className="text-sm">Set <code className="bg-zinc-900 px-1 rounded">VITE_CALDLY_URL</code> in Netlify env to embed Calendly.</p>
          </div>
        ) : (
          <div className="rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950 aspect-[4/5] md:aspect-[16/10]">
            <iframe src={calendlyUrl} className="w-full h-full" frameBorder="0" title="Book a call" />
          </div>
        )}
      </div>
    </section>
  );
}