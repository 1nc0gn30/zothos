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
        body: JSON.stringify({}),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.url) {
        const msg = data.error || 'Checkout failed';
        if (msg.includes('STRIPE') || msg.includes('price')) {
          throw new Error('Payments not configured yet. Add Stripe keys in Netlify env.');
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
        <p className="text-zinc-400 mb-6">A short, practical guide to writing clearly and shipping consistently.</p>
        <ul className="text-sm text-zinc-300 space-y-2 mb-8 flex-1">
          <li>✓ Instant access via Stripe checkout</li>
          <li>✓ Plain-English, no fluff</li>
          <li>✓ Read it in an afternoon</li>
          <li>✓ Free updates</li>
        </ul>
        <button
          onClick={buy}
          disabled={loading}
          className="w-full py-3 rounded-lg bg-brand-600 hover:bg-brand-500 disabled:opacity-50 font-semibold transition"
        >
          {loading ? 'Redirecting…' : 'Buy the guide'}
        </button>
      </div>
      {message && <p className="text-center text-rose-400 text-sm mt-4">{message}</p>}
    </div>
  );
}