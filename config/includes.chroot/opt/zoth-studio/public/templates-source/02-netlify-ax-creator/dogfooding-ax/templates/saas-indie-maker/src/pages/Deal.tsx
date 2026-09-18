import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Lock, Download, ArrowLeft, CheckCircle } from 'lucide-react';
import { config } from '../lib/config';

export function Deal() {
  const [status, setStatus] = useState<'checking' | 'unlocked' | 'locked'>('checking');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    // LemonSqueezy redirects back with checkout reference parameters.
    // In production, verify the LemonSqueezy order via their API.
    if (params.get('success') === 'true' || params.has('checkout_id') || params.has('order_id')) {
      setStatus('unlocked');
    } else {
      setStatus('locked');
    }
  }, []);

  return (
    <div className="min-h-screen pt-28 pb-20 px-6">
      <div className="max-w-2xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-100 mb-8">
          <ArrowLeft size={18} /> Back to home
        </Link>

        {status === 'checking' && (
          <div className="text-center py-20 text-zinc-400">Verifying purchase...</div>
        )}

        {status === 'locked' && (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-10 text-center">
            <div className="w-14 h-14 rounded-full bg-zinc-800 flex items-center justify-center mx-auto mb-6 text-zinc-400">
              <Lock size={28} />
            </div>
            <h1 className="text-2xl font-bold mb-3">The lifetime deal is gated</h1>
            <p className="text-zinc-400 mb-6">
              Purchase {config.product} for {config.price} to unlock the SaaS starter kit —
              boilerplate code, deploy guide, and env template.
            </p>
            <a
              href="/#pricing"
              className="inline-block px-6 py-3 rounded-lg bg-brand-600 hover:bg-brand-500 font-semibold transition"
            >
              Get the lifetime deal
            </a>
          </div>
        )}

        {status === 'unlocked' && (
          <div className="rounded-2xl border border-brand-900/60 bg-zinc-900/50 p-10">
            <div className="flex items-center gap-3 text-emerald-400 mb-6">
              <CheckCircle size={24} />
              <span className="font-semibold">Lifetime deal confirmed</span>
            </div>
            <h1 className="text-2xl font-bold mb-2">Welcome to your SaaS starter kit</h1>
            <p className="text-zinc-400 mb-6">
              Your LemonSqueezy purchase has been confirmed. Download everything below — you have
              lifetime access to all future updates.
            </p>

            <div className="space-y-4">
              <a
                href="/assets/indiekit-boilerplate-code.md"
                download
                className="flex items-center justify-between p-4 rounded-xl border border-zinc-800 hover:border-brand-500 transition"
              >
                <div>
                  <span className="font-medium block">Boilerplate Code</span>
                  <span className="text-sm text-zinc-500">Full source reference for the SaaS starter kit</span>
                </div>
                <Download size={18} className="text-zinc-400" />
              </a>
              <a
                href="/assets/indiekit-deploy-guide.md"
                download
                className="flex items-center justify-between p-4 rounded-xl border border-zinc-800 hover:border-brand-500 transition"
              >
                <div>
                  <span className="font-medium block">Deploy Guide</span>
                  <span className="text-sm text-zinc-500">Step-by-step Netlify deployment instructions</span>
                </div>
                <Download size={18} className="text-zinc-400" />
              </a>
              <a
                href="/assets/indiekit-env-template.txt"
                download
                className="flex items-center justify-between p-4 rounded-xl border border-zinc-800 hover:border-brand-500 transition"
              >
                <div>
                  <span className="font-medium block">Environment Template (.env)</span>
                  <span className="text-sm text-zinc-500">All env vars pre-filled with placeholders</span>
                </div>
                <Download size={18} className="text-zinc-400" />
              </a>
            </div>

            <div className="mt-8 p-4 rounded-xl border border-brand-900/40 bg-brand-950/10">
              <p className="text-sm text-zinc-400">
                <span className="text-brand-400 font-medium">Pro tip:</span> Point your AX API at
                the deployed boilerplate to let any AI agent read your setup. Set{' '}
                <code className="text-brand-400">VITE_AX_API_URL</code> and the AX badge lights up
                green.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}