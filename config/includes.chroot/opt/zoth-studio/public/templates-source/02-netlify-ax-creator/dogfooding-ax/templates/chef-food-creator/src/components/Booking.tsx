import { config } from '../lib/config';

export function Booking() {
  const calUsername = config.calUsername;
  const src = `https://app.cal.com/${calUsername}/30min`;
  const isPlaceholder = calUsername === 'yourname';

  return (
    <section id="book" className="py-20 px-6 bg-zinc-900">
      <div className="max-w-3xl mx-auto text-center">
        <span className="inline-block px-3 py-1 rounded-full bg-brand-900/40 text-brand-400 text-sm font-medium mb-4">
          30-minute kitchen consultation
        </span>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Book a kitchen consultation</h2>
        <p className="text-zinc-400 mb-8">Talk menu design, kitchen setup, or recipe scaling with {config.chefName} — built for chefs and food creators going pro.</p>

        {isPlaceholder ? (
          <div className="rounded-2xl border border-dashed border-zinc-700 bg-zinc-950 p-10 text-zinc-400">
            <p className="mb-4">Booking not configured yet.</p>
            <p className="text-sm">Set <code className="bg-zinc-900 px-1 rounded">VITE_CAL_USERNAME</code> in Netlify env to embed your Cal.com scheduler.</p>
          </div>
        ) : (
          <div className="rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950 aspect-[4/5] md:aspect-[16/10]">
            <iframe
              src={src}
              className="w-full h-full"
              frameBorder="0"
              allow="camera; microphone; fullscreen; autoplay"
              title="Book a kitchen consultation"
            />
          </div>
        )}
      </div>
    </section>
  );
}