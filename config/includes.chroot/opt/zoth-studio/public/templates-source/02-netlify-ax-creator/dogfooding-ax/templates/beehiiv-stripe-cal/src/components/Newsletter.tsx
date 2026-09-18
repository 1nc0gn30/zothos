import { useState } from 'react';
import { config } from '../lib/config';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    setMessage('');
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
    <section id="newsletter" className="py-20 px-6">
      <div className="max-w-2xl mx-auto text-center">
        <span className="text-brand-400 text-sm font-semibold">Free weekly email</span>
        <h2 className="text-3xl md:text-4xl font-bold mt-3 mb-4">The {config.brand} Ops Log</h2>
        <p className="text-zinc-400 mb-8">
          One email a week on building a lean, profitable creator business with Netlify.
        </p>
        <form onSubmit={submit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-700 focus:border-brand-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="px-6 py-3 rounded-lg bg-brand-600 hover:bg-brand-500 disabled:opacity-60 font-semibold transition"
          >
            {status === 'loading' ? 'Joining...' : 'Join newsletter'}
          </button>
        </form>
        {message && (
          <p className={`mt-4 text-sm ${status === 'error' ? 'text-red-400' : 'text-green-400'}`}>
            {message}
          </p>
        )}
      </div>
    </section>
  );
}
