import { useEffect, useState } from 'react';
import { config } from '../lib/config';

type Status = 'checking' | 'connected' | 'offline';

export function AxBadge() {
  const [status, setStatus] = useState<Status>('checking');

  useEffect(() => {
    let cancelled = false;
    async function check() {
      if (!config.axApiUrl) {
        setStatus('offline');
        return;
      }
      try {
        const res = await fetch(`${config.axApiUrl}/api/ax/overview`);
        if (cancelled) return;
        if (res.ok) {
          setStatus('connected');
        } else {
          setStatus('offline');
        }
      } catch {
        if (cancelled) return;
        setStatus('offline');
      }
    }
    check();
    return () => {
      cancelled = true;
    };
  }, []);

  const dot =
    status === 'connected'
      ? 'bg-emerald-400'
      : status === 'checking'
        ? 'bg-amber-400 animate-pulse'
        : 'bg-zinc-600';
  const label =
    status === 'connected'
      ? 'AX-Powered · Live'
      : status === 'checking'
        ? 'AX-Powered · Connecting...'
        : 'AX-Powered · Not connected';

  return (
    <a
      href="/#ax"
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-zinc-800 bg-zinc-900/60 text-xs font-medium text-zinc-300 hover:border-brand-500 transition"
    >
      <span className={`w-2 h-2 rounded-full ${dot}`} />
      {label}
    </a>
  );
}