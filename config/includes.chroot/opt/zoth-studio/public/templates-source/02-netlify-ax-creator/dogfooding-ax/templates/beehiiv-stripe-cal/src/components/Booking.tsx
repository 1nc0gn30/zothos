import { config } from '../lib/config';

export function Booking() {
  const src = config.calUsername
    ? `https://cal.com/${config.calUsername}/embed`
    : '';

  return (
    <section id="book" className="py-20 px-6 bg-zinc-900">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Book a strategy call</h2>
        <p className="text-zinc-400 mb-8">We’ll map your first paid offer and pick the right stack.</p>

        {src ? (
          <div className="rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950 aspect-[4/3] md:aspect-[16/9]">
            <iframe
              src={src}
              className="w-full h-full"
              frameBorder="0"
              allow="camera; microphone; fullscreen; autoplay"
              title="Book a call"
            />
          </div>
        ) : (
          <div className="p-8 rounded-2xl border border-zinc-800 bg-zinc-950">
            <p className="text-zinc-400">
              Booking not configured yet.
            </p>
            <p className="text-zinc-500 text-sm mt-2">
              Set <code className="text-brand-400">VITE_CAL_USERNAME</code> in Netlify env to embed Cal.com.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
