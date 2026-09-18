import { useState } from 'react';

const PRICES: Record<string, string> = {
  stripe: '$49',
  lemonsqueezy: '$49',
};

export function Payments() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const buy = async (provider: 'stripe' | 'lemonsqueezy') => {
    setLoading(true);
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
        if (msg.includes('apiKey') || msg.includes('authenticator') || msg.includes('LS_API_KEY') || msg.includes('store') || msg.includes('variant')) {
          throw new Error('Payments not configured yet. Add provider keys in Netlify env.');
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
    <div className="grid md:grid-cols-2 gap-6">
      <div className="rounded-2xl border border-zinc-800 p-8 bg-zinc-900/50 flex flex-col">
        <div className="mb-6">
          <span className="text-3xl font-bold">{PRICES.stripe}</span>
          <span className="text-zinc-400"> one-time</span>
        </div>
        <h3 className="text-xl font-semibold mb-2">CreatorKit License</h3>
        <p className="text-zinc-400 mb-6">Everything you need to launch, sell, and book.</p>
        <ul className="text-sm text-zinc-300 space-y-2 mb-8 flex-1">
          <li>✓ Deploy checklist & env template</li>
          <li>✓ Stripe setup guide</li>
          <li>✓ Newsletter + payments wiring</li>
          <li>✓ Lifetime updates</li>
        </ul>
        <button
          onClick={() => buy('stripe')}
          disabled={loading}
          className="w-full py-3 rounded-lg bg-brand-600 hover:bg-brand-500 disabled:opacity-50 font-semibold transition"
        >
          Buy with Stripe
        </button>
      </div>

      <div className="rounded-2xl border border-zinc-800 p-8 bg-zinc-900/50 flex flex-col">
        <div className="mb-6">
          <span className="text-3xl font-bold">{PRICES.lemonsqueezy}</span>
          <span className="text-zinc-400"> one-time</span>
        </div>
        <h3 className="text-xl font-semibold mb-2">CreatorKit + Strategy Call</h3>
        <p className="text-zinc-400 mb-6">License plus a 30-minute implementation call.</p>
        <ul className="text-sm text-zinc-300 space-y-2 mb-8 flex-1">
          <li>✓ Everything in License</li>
          <li>✓ 30-min 1:1 setup call</li>
          <li>✓ Customization pointers</li>
          <li>✓ 7-day async support</li>
        </ul>
        <button
          onClick={() => buy('lemonsqueezy')}
          disabled={loading}
          className="w-full py-3 rounded-lg bg-zinc-100 text-zinc-950 hover:bg-white disabled:opacity-50 font-semibold transition"
        >
          Buy with LemonSqueezy
        </button>
      </div>

      {message && <p className="md:col-span-2 text-center text-rose-400 text-sm mt-2">{message}</p>}
    </div>
  );
}
