export function Booking() {
  const calUsername = (import.meta as any).env?.VITE_CAL_USERNAME || 'yourname';
  const caldlyUrl = (import.meta as any).env?.VITE_CALDLY_URL || '';

  const src = caldlyUrl
    ? caldlyUrl
    : `https://app.cal.com/${calUsername}/30min`;

  const isPlaceholder = calUsername === 'yourname' && !caldlyUrl;

  return (
    <section id="book" className="py-20 px-6 bg-zinc-900">
      <div className="max-w-3xl mx-auto text-center">
        <span className="inline-block px-3 py-1 rounded-full bg-emerald-900/40 text-emerald-400 text-sm font-medium mb-4">
          Free 15-minute call
        </span>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Book a strategy call</h2>
        <p className="text-zinc-400 mb-8">We’ll map your first paid offer and pick the right stack.</p>

        {isPlaceholder ? (
          <div className="rounded-2xl border border-dashed border-zinc-700 bg-zinc-950 p-10 text-zinc-400">
            <p className="mb-4">Booking not configured yet.</p>
            <p className="text-sm">Set <code className="bg-zinc-900 px-1 rounded">VITE_CAL_USERNAME</code> or <code className="bg-zinc-900 px-1 rounded">VITE_CALDLY_URL</code> in Netlify env to embed Cal.com or Calendly.</p>
          </div>
        ) : (
          <div className="rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950 aspect-[4/5] md:aspect-[16/10]">
            <iframe
              src={src}
              className="w-full h-full"
              frameBorder="0"
              allow="camera; microphone; fullscreen; autoplay"
              title="Book a call"
            />
          </div>
        )}
      </div>
    </section>
  );
}
