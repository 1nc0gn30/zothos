import { useState } from 'react';
import { config } from '../lib/config';

export function Payments() {
  const [loading, setLoading] = useState<'idle' | 'stripe' | 'lemonsqueezy'>('idle');
  const [message, setMessage] = useState('');

  const buy = async (provider: 'stripe' | 'lemonsqueezy') => {
    setLoading(provider);
    setMessage('');
    try {
      const res = await fetch(`/api/checkout?provider=${provider}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ return_path: '/toolkit' }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.url) {
        const msg = data.error || 'Checkout failed';
        if (msg.includes('apiKey') || msg.includes('authenticator') || msg.includes('price') || msg.includes('not configured')) {
          setMessage('Payments not configured yet. Add provider keys in Netlify env.');
        } else {
          setMessage(msg);
        }
        return;
      }
      window.location.href = data.url;
    } catch (err: any) {
      setMessage(err.message || 'Could not start checkout.');
    } finally {
      setLoading('idle');
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="p-8 rounded-2xl border border-zinc-800 bg-zinc-900/40 flex flex-col">
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-2">{config.product}</h3>
          <div className="text-3xl font-extrabold text-brand-400">{config.price}</div>
          <p className="text-zinc-400 text-sm mt-2">Everything you need to launch, sell, and book.</p>
        </div>
        <button
          onClick={() => buy('stripe')}
          disabled={loading !== 'idle'}
          className="mt-auto w-full px-6 py-3 rounded-lg bg-brand-600 hover:bg-brand-500 disabled:opacity-60 font-semibold transition"
        >
          {loading === 'stripe' ? 'Redirecting...' : 'Buy with Stripe'}
        </button>
      </div>

      {message && (
        <p className="col-span-full text-center text-sm text-red-400 mt-2">{message}</p>
      )}
    </div>
  );
}
