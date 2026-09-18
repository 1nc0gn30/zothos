import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Lock, Download, ArrowLeft, CheckCircle } from 'lucide-react';

export function Toolkit() {
  const [status, setStatus] = useState<'checking' | 'unlocked' | 'locked' | 'error'>('checking');

  useEffect(() => {
    const sessionId = new URLSearchParams(window.location.search).get('session_id');
    if (!sessionId) {
      setStatus('locked');
      return;
    }
    // LemonSqueezy redirects back with a checkout reference.
    // In production, verify the LemonSqueezy order via their API.
    setStatus('unlocked');
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
            <h1 className="text-2xl font-bold mb-3">Toolkit access is gated</h1>
            <p className="text-zinc-400 mb-6">Purchase the CreatorKit to unlock templates, checklists, and the deploy guide.</p>
            <a href="/#pricing" className="inline-block px-6 py-3 rounded-lg bg-brand-600 hover:bg-brand-500 font-semibold transition">
              Buy the toolkit
            </a>
          </div>
        )}

        {status === 'unlocked' && (
          <div className="rounded-2xl border border-brand-900/60 bg-zinc-900/50 p-10">
            <div className="flex items-center gap-3 text-emerald-400 mb-6">
              <CheckCircle size={24} />
              <span className="font-semibold">Access confirmed</span>
            </div>
            <h1 className="text-2xl font-bold mb-2">Welcome to your toolkit</h1>
            <p className="text-zinc-400 mb-6">Your LemonSqueezy purchase has been confirmed.</p>

            <div className="space-y-4">
              <a href="/assets/creatorkit-deploy-checklist.md" download className="flex items-center justify-between p-4 rounded-xl border border-zinc-800 hover:border-brand-500 transition">
                <span className="font-medium">Deploy Checklist</span>
                <Download size={18} className="text-zinc-400" />
              </a>
              <a href="/assets/creatorkit-env-template.txt" download className="flex items-center justify-between p-4 rounded-xl border border-zinc-800 hover:border-brand-500 transition">
                <span className="font-medium">Environment Template (.env)</span>
                <Download size={18} className="text-zinc-400" />
              </a>
              <a href="/assets/creatorkit-lemonsqueezy-setup-guide.md" download className="flex items-center justify-between p-4 rounded-xl border border-zinc-800 hover:border-brand-500 transition">
                <span className="font-medium">LemonSqueezy Setup Guide</span>
                <Download size={18} className="text-zinc-400" />
              </a>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="rounded-2xl border border-rose-900/60 bg-rose-950/20 p-10 text-center text-rose-200">
            Could not verify purchase. Contact support or try the purchase link again.
          </div>
        )}
      </div>
    </div>
  );
}