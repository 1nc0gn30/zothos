import { useState } from 'react';
import { config } from '../lib/config';

export function Payments() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const buy = async () => {
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ return_path: '/toolkit' }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.url) {
        const msg = data.error || 'Checkout failed';
        if (msg.includes('LS_API_KEY') || msg.includes('store') || msg.includes('variant')) {
          throw new Error('Payments not configured yet. Add LemonSqueezy keys in Netlify env.');
        }
        throw new Error(msg);
      }
      window.location.href = data.url;
    } catch (err: any) {
      setLoading(false);
      setMessage(err.message || 'Could not start checkout.');
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="rounded-2xl border border-zinc-800 p-8 bg-zinc-900/50 flex flex-col">
        <div className="mb-6">
          <span className="text-3xl font-bold">{config.price}</span>
          <span className="text-zinc-400"> one-time</span>
        </div>
        <h3 className="text-xl font-semibold mb-2">{config.product}</h3>
        <p className="text-zinc-400 mb-6">Everything you need to launch, sell, and book.</p>
        <ul className="text-sm text-zinc-300 space-y-2 mb-8 flex-1">
          <li>✓ LemonSqueezy checkout (global tax handled)</li>
          <li>✓ beehiiv newsletter integration</li>
          <li>✓ Calendly booking embed</li>
          <li>✓ Gated toolkit download page</li>
          <li>✓ Lifetime updates</li>
        </ul>
        <button
          onClick={buy}
          disabled={loading}
          className="w-full py-3 rounded-lg bg-zinc-100 text-zinc-950 hover:bg-white disabled:opacity-50 font-semibold transition"
        >
          {loading ? 'Redirecting...' : 'Buy with LemonSqueezy'}
        </button>
      </div>
      {message && <p className="text-center text-rose-400 text-sm mt-4">{message}</p>}
    </div>
  );
}