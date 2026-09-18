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
        body: JSON.stringify({ return_path: '/recipes' }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.url) {
        const msg = data.error || 'Checkout failed';
        if (msg.includes('apiKey') || msg.includes('authenticator') || msg.includes('STRIPE_SECRET_KEY') || msg.includes('price')) {
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
    <div className="max-w-md mx-auto rounded-2xl border border-brand-900/60 p-8 bg-zinc-900/50 flex flex-col">
      <div className="mb-6">
        <span className="text-3xl font-bold text-brand-400">{config.productPrice}</span>
        <span className="text-zinc-400"> one-time</span>
      </div>
      <h3 className="text-xl font-semibold mb-2">Get the {config.productName}</h3>
      <p className="text-zinc-400 mb-6">Tested recipe cards, shopping list templates, and prep guides — ready to print or pin.</p>
      <ul className="text-sm text-zinc-300 space-y-2 mb-8 flex-1">
        <li>✓ 12 tested recipe cards (printable)</li>
        <li>✓ Shopping list templates by cuisine</li>
        <li>✓ Prep guides & timing sheets</li>
        <li>✓ Plating reference photos</li>
        <li>✓ Lifetime updates as new kits drop</li>
      </ul>
      <button
        onClick={buy}
        disabled={loading}
        className="w-full py-3 rounded-lg bg-brand-600 hover:bg-brand-500 disabled:opacity-50 font-semibold transition"
      >
        {loading ? 'Starting checkout...' : `Get the ${config.productName}`}
      </button>
      {message && <p className="mt-3 text-center text-rose-400 text-sm">{message}</p>}
    </div>
  );
}