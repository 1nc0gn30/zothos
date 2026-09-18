import { config } from '../lib/config';

export function Booking() {
  const src = config.calUsername ? `https://app.cal.com/${config.calUsername}/30min` : '';
  const isPlaceholder = !src;

  return (
    <section id="book" className="py-20 px-6 bg-zinc-900">
      <div className="max-w-3xl mx-auto text-center">
        <span className="inline-block px-3 py-1 rounded-full bg-accent-900/40 text-accent-400 text-sm font-medium mb-4">
          Free 30-minute call
        </span>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Book a product strategy call</h2>
        <p className="text-zinc-400 mb-8">
          Not sure what to build? Let's map your MVP, pricing, and launch plan in 30 minutes.
        </p>

        {isPlaceholder ? (
          <div className="rounded-2xl border border-dashed border-zinc-700 bg-zinc-950 p-10 text-zinc-400">
            <p className="mb-4">Booking not configured yet.</p>
            <p className="text-sm">
              Set <code className="bg-zinc-900 px-1 rounded">VITE_CAL_USERNAME</code> in Netlify env
              to embed your Cal.com scheduling page.
            </p>
          </div>
        ) : (
          <div className="rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950 aspect-[4/5] md:aspect-[16/10]">
            <iframe src={src} className="w-full h-full" frameBorder="0" title="Book a product strategy call" />
          </div>
        )}
      </div>
    </section>
  );
}