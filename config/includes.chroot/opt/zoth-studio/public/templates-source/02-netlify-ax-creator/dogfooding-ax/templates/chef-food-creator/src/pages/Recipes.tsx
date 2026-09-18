import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Lock, Download, ArrowLeft, CheckCircle } from 'lucide-react';
import { config } from '../lib/config';

export function Recipes() {
  const [status, setStatus] = useState<'checking' | 'unlocked' | 'locked' | 'error'>('checking');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const sessionId = new URLSearchParams(window.location.search).get('session_id');
    if (!sessionId) {
      setStatus('locked');
      return;
    }
    fetch(`/api/verify-purchase?session_id=${sessionId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data?.valid) {
          setStatus('unlocked');
          setEmail(data.customer_email || '');
        } else {
          setStatus('locked');
        }
      })
      .catch(() => setStatus('error'));
  }, []);

  return (
    <div className="min-h-screen pt-28 pb-20 px-6">
      <div className="max-w-2xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-100 mb-8">
          <ArrowLeft size={18} /> Back to home
        </Link>

        {status === 'checking' && (
          <div className="text-center py-20 text-zinc-400">Verifying your recipe kit purchase...</div>
        )}

        {status === 'locked' && (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-10 text-center">
            <div className="w-14 h-14 rounded-full bg-zinc-800 flex items-center justify-center mx-auto mb-6 text-zinc-400">
              <Lock size={28} />
            </div>
            <h1 className="text-2xl font-bold mb-3">Recipe kit is gated</h1>
            <p className="text-zinc-400 mb-6">Purchase the {config.productName} to unlock the recipe cards, shopping list templates, and prep guides.</p>
            <a href="/#pricing" className="inline-block px-6 py-3 rounded-lg bg-brand-600 hover:bg-brand-500 font-semibold transition">
              Get the {config.productName}
            </a>
          </div>
        )}

        {status === 'unlocked' && (
          <div className="rounded-2xl border border-brand-900/60 bg-zinc-900/50 p-10">
            <div className="flex items-center gap-3 text-emerald-400 mb-6">
              <CheckCircle size={24} />
              <span className="font-semibold">Recipe kit unlocked</span>
            </div>
            <h1 className="text-2xl font-bold mb-2">Your {config.productName}</h1>
            {email && <p className="text-zinc-400 mb-6">Delivered to {email}</p>}

            <div className="space-y-4">
              <a
                href="/assets/recipe-cards.pdf"
                download
                className="flex items-center justify-between p-4 rounded-xl border border-zinc-800 hover:border-brand-500 transition"
              >
                <span className="font-medium">Recipe Cards (PDF, 12 cards)</span>
                <Download size={18} className="text-zinc-400" />
              </a>
              <a
                href="/assets/shopping-list-template.pdf"
                download
                className="flex items-center justify-between p-4 rounded-xl border border-zinc-800 hover:border-brand-500 transition"
              >
                <span className="font-medium">Shopping List Template (PDF)</span>
                <Download size={18} className="text-zinc-400" />
              </a>
              <a
                href="/assets/prep-guide.pdf"
                download
                className="flex items-center justify-between p-4 rounded-xl border border-zinc-800 hover:border-brand-500 transition"
              >
                <span className="font-medium">Prep Guide & Timing Sheet (PDF)</span>
                <Download size={18} className="text-zinc-400" />
              </a>
              <a
                href="/assets/plating-reference.zip"
                download
                className="flex items-center justify-between p-4 rounded-xl border border-zinc-800 hover:border-brand-500 transition"
              >
                <span className="font-medium">Plating Reference Photos (ZIP)</span>
                <Download size={18} className="text-zinc-400" />
              </a>
            </div>

            <p className="mt-8 text-sm text-zinc-500">
              Need help scaling a recipe or designing a menu? <a href="/#book" className="text-brand-400 hover:text-brand-300">Book a kitchen consultation</a> with {config.chefName}.
            </p>
          </div>
        )}

        {status === 'error' && (
          <div className="rounded-2xl border border-rose-900/60 bg-rose-950/20 p-10 text-center text-rose-200">
            Could not verify your purchase. Contact support or try the purchase link again.
          </div>
        )}
      </div>
    </div>
  );
}