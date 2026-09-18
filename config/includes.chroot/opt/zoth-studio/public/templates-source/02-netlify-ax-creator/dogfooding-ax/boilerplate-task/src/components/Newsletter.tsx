import { useState } from 'react';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Subscription failed');
      setStatus('success');
      setMessage(data.message || 'You’re on the list. Check your inbox.');
      if (data.redirect && data.url) {
        setTimeout(() => window.open(data.url, '_blank'), 800);
      } else {
        setEmail('');
      }
    } catch (err: any) {
      setStatus('error');
      setMessage(err.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <section id="newsletter" className="py-20 px-6 bg-zinc-900">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <span className="inline-block px-3 py-1 rounded-full bg-brand-900/40 text-brand-400 text-sm font-medium mb-4">
            Free weekly email
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">The Solo Creator Ops Log</h2>
          <p className="text-zinc-400">One email a week on building a lean, profitable creator business.</p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 px-4 py-3 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-brand-500"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="px-6 py-3 rounded-lg bg-brand-600 hover:bg-brand-500 disabled:opacity-50 font-semibold transition"
          >
            {status === 'loading' ? 'Joining...' : 'Join newsletter'}
          </button>
        </form>
        {status !== 'idle' && status !== 'loading' && (
          <p className={`mt-4 text-sm text-center ${status === 'success' ? 'text-emerald-400' : 'text-rose-400'}`}>
            {message}
          </p>
        )}
      </div>
    </section>
  );
}
