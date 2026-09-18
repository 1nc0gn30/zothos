import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Lock, Download, ArrowLeft, CheckCircle } from 'lucide-react';
import { config } from '../lib/config';

export function Toolkit() {
  const [status, setStatus] = useState<'locked' | 'verifying' | 'unlocked' | 'error'>('locked');
  const [params] = useState(() => new URLSearchParams(window.location.search));

  useEffect(() => {
    const sessionId = params.get('session_id');
    if (!sessionId) return;
    setStatus('verifying');
    fetch(`/api/verify-purchase?session_id=${sessionId}`)
      .then((r) => r.json())
      .then((data) => {
        setStatus(data.verified ? 'unlocked' : 'locked');
      })
      .catch(() => setStatus('error'));
  }, [params]);

  if (status === 'verifying') {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <p className="text-zinc-400">Verifying your {config.product} purchase...</p>
      </div>
    );
  }

  if (status === 'unlocked') {
    return (
      <div className="min-h-screen px-6 py-20">
        <div className="max-w-2xl mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-200 mb-8">
            <ArrowLeft size={18} /> Back to home
          </Link>
          <div className="p-8 rounded-2xl border border-green-800 bg-green-950/30">
            <div className="flex items-center gap-3 mb-6">
              <CheckCircle className="text-green-500" size={28} />
              <h1 className="text-2xl font-bold">Your {config.product} is unlocked</h1>
            </div>
            <p className="text-zinc-300 mb-6">
              Thanks for purchasing. Your downloads and setup guides are below.
            </p>
            <div className="space-y-4">
              <a href="/assets/creatorkit-deploy-checklist.md" download className="flex items-center gap-3 p-4 rounded-xl border border-zinc-800 bg-zinc-900 hover:border-zinc-600 transition">
                <Download size={20} />
                <span>Deploy Checklist (PDF/Markdown)</span>
              </a>
              <a href="/assets/creatorkit-stripe-setup-guide.md" download className="flex items-center gap-3 p-4 rounded-xl border border-zinc-800 bg-zinc-900 hover:border-zinc-600 transition">
                <Download size={20} />
                <span>Stripe Setup Guide</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-20">
      <div className="max-w-xl mx-auto text-center">
        <Link to="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-200 mb-8">
          <ArrowLeft size={18} /> Back to home
        </Link>
        <Lock className="mx-auto text-zinc-600 mb-6" size={48} />
        <h1 className="text-2xl font-bold mb-4">{config.product} access is gated</h1>
        <p className="text-zinc-400 mb-8">Purchase {config.product} to unlock the deploy checklist, Stripe setup guide, and env template.</p>
        <a href="/#pricing" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-brand-600 hover:bg-brand-500 font-semibold transition">
          Buy {config.product} — {config.price}
        </a>
      </div>
    </div>
  );
}
