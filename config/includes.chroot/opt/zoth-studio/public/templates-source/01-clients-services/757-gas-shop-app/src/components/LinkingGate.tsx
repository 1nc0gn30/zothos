import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CircleAlert,
  ShieldCheck,
  ExternalLink,
  Sparkles,
  Smartphone,
  Globe,
  Copy,
  Check,
  Download,
  Lightbulb,
  Monitor,
  ArrowRight,
  Wallet,
} from 'lucide-react';
import { walletAuthService } from '../lib/wallet/auth';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';

function getMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }
  return 'Unable to link wallet. Please try again.';
}

const RECOMMENDED_WALLETS = [
  {
    name: 'Phantom',
    description:
      'The most popular Solana wallet. Clean design, built-in NFT support, and works on mobile and desktop.',
    url: 'https://phantom.app/',
    icon: '/Phantom-Icon_App.svg',
    bestFor: ['Beginners', 'Mobile & Desktop'],
  },
];

type LinkingGateProps = {
  title?: string;
  description?: string;
};

export default function LinkingGate({
  title = 'Secure your account',
  description = 'Link a verified Solana wallet to enable checkout, top-ups, and wallet activity. Your email login stays exactly the same — this just adds cryptographic proof to your existing profile.',
}: LinkingGateProps) {
  const { refreshUserIdentity, fetchProfile, user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isMobileNonWeb3Browser, setIsMobileNonWeb3Browser] = useState(false);

  useEffect(() => {
    const mobile = walletAuthService.isMobile();
    setIsMobileDevice(mobile);
    if (mobile) {
      const wallets = walletAuthService.getAvailableWallets();
      setIsMobileNonWeb3Browser(!wallets.some((w) => w.detected));
    }
  }, []);

  const handleSecureWithPhantom = async () => {
    setLoading(true);
    setError(null);

    try {
      const walletAddress = await walletAuthService.connectWithPhantom();
      const { message, signatureHex } = await walletAuthService.signLinkingMessage(walletAddress);

      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      const accessToken = sessionData.session?.access_token;
      if (!accessToken) throw new Error('You must be signed in to link a wallet.');

      const response = await fetch('/api/connect-solana-wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accessToken,
          walletAddress,
          message,
          signature: signatureHex,
        }),
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(result.error || 'Wallet linking failed.');
      }

      if (user) {
        await fetchProfile(user.id);
      }
      await refreshUserIdentity();
    } catch (linkError: any) {
      const msg = getMessage(linkError);
      setError(msg);
      if (msg.includes('MOBILE_WALLET_REQUIRED') || (walletAuthService.isMobile() && !walletAuthService.getAvailableWallets().some((w) => w.detected))) {
        setIsMobileNonWeb3Browser(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCopyUrl = async () => {
    if (typeof window === 'undefined') return;
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const input = document.createElement('input');
      input.value = window.location.href;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section className="mx-auto max-w-3xl">
      {/* Main card */}
      <div className="relative overflow-hidden rounded-[1.8rem] border border-border bg-card p-6 shadow-sm sm:p-10">
        {/* Subtle top accent */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary/60 via-primary to-primary/60" />

        <div className="flex flex-col items-center text-center sm:items-start sm:text-left sm:flex-row sm:gap-6">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/20">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <div className="min-w-0 flex-1 mt-4 sm:mt-0">
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Wallet required
            </div>
            <h1 className="mt-2 font-display text-3xl sm:text-4xl font-black tracking-tight">
              {title}
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base max-w-xl">
              {description}
            </p>

            {error && (
              <div className="mt-5 flex items-start gap-2 rounded-2xl border border-destructive/20 bg-destructive/10 p-4 text-sm font-medium text-destructive">
                <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Hero action */}
            <div className="mt-6 flex flex-col items-center gap-3 sm:items-start">
              <button
                type="button"
                onClick={handleSecureWithPhantom}
                disabled={loading}
                className="group inline-flex w-full sm:w-auto items-center justify-center gap-3 btn-premium px-7 py-4 text-base font-bold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50 shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30"
              >
                <img
                  src="/Phantom-Icon_App.svg"
                  alt="Phantom"
                  className="h-6 w-6 rounded"
                />
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="inline-block h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Opening Phantom…
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2">
                    Secure Account with Phantom
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                )}
              </button>

              <Link
                to="/profile"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground transition-colors hover:text-foreground"
              >
                <Wallet className="h-3.5 w-3.5" />
                Review profile instead
              </Link>
            </div>

            <p className="mt-4 text-xs leading-relaxed text-muted-foreground/80">
              Your email login stays active. This only adds wallet verification so checkout and
              top-ups work securely.
            </p>
          </div>
        </div>
      </div>

      {/* Mobile helper */}
      {isMobileNonWeb3Browser && (
        <div className="mt-5 rounded-2xl border border-primary/20 bg-primary/5 p-5">
          <div className="flex items-start gap-3">
            <Smartphone className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <div className="min-w-0">
              <p className="text-sm font-bold text-foreground">
                Open this site in Phantom
              </p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                Mobile browsers can’t talk to wallet apps directly. To link your wallet, open
                this exact page inside Phantom’s built-in browser.
              </p>
              <ol className="mt-3 ml-4 list-decimal text-xs text-muted-foreground space-y-1">
                <li>Copy the URL below</li>
                <li>
                  Open the <strong className="text-foreground">Phantom app</strong> and tap the
                  globe icon
                </li>
                <li>Paste the URL and return to this page</li>
                <li>
                  Tap <strong className="text-foreground">Secure Account with Phantom</strong>
                </li>
              </ol>
              <div className="mt-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyUrl}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-background border border-border px-3 py-2 text-xs font-bold text-foreground hover:bg-muted transition-colors"
                >
                  {copied ? (
                    <Check className="h-3.5 w-3.5 text-green-500" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                  {copied ? 'Copied!' : 'Copy URL'}
                </button>
                <button
                  type="button"
                  onClick={() => walletAuthService.openPhantomApp()}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 border border-primary/20 px-3 py-2 text-xs font-bold text-primary hover:bg-primary/20 transition-colors"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Open in Phantom
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Why link */}
      <div className="mt-6 rounded-[1.8rem] border border-border bg-card p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-bold text-foreground">Why link a wallet?</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="flex flex-col gap-2 rounded-xl bg-background border border-border p-4">
            <div className="text-xs font-bold uppercase tracking-wider text-primary">Secure checkout</div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Payments and credits are tied to a verifiable on-chain address, not just an email.
            </p>
          </div>
          <div className="flex flex-col gap-2 rounded-xl bg-background border border-border p-4">
            <div className="text-xs font-bold uppercase tracking-wider text-primary">One profile</div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Your order history and wallet balance stay on the same account — nothing gets split.
            </p>
          </div>
          <div className="flex flex-col gap-2 rounded-xl bg-background border border-border p-4">
            <div className="text-xs font-bold uppercase tracking-wider text-primary">No new password</div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Your email login still works. The wallet only adds cryptographic proof of ownership.
            </p>
          </div>
        </div>
      </div>

      {/* How-to cards */}
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="rounded-[1.8rem] border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Download className="h-4 w-4 text-primary" />
            <span className="text-sm font-bold text-foreground">Create a wallet</span>
          </div>
          <ol className="ml-4 list-decimal text-xs text-muted-foreground space-y-1.5">
            <li>
              Install <strong className="text-foreground">Phantom</strong> for your browser or mobile
            </li>
            <li>
              Open the app and tap <strong className="text-foreground">Create New Wallet</strong>
            </li>
            <li>
              Save your <strong className="text-foreground">recovery phrase</strong> somewhere safe
            </li>
            <li>Your wallet is ready — no email or password needed</li>
          </ol>
        </div>

        <div className="rounded-[1.8rem] border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Monitor className="h-4 w-4 text-primary" />
            <span className="text-sm font-bold text-foreground">Connect to 757 Gas</span>
          </div>
          <ol className="ml-4 list-decimal text-xs text-muted-foreground space-y-1.5">
            <li>Make sure your wallet app is installed</li>
            <li>
              Tap <strong className="text-foreground">Secure Account with Phantom</strong> above
            </li>
            <li>Approve the connection in your wallet popup</li>
            <li>Sign the message to verify — done!</li>
          </ol>
        </div>
      </div>

      {/* Wallet resources */}
      <div className="mt-5 rounded-[1.8rem] border border-border bg-card p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Recommended Solana wallets
          </h2>
        </div>
        <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
          Solana wallets are free browser extensions or mobile apps that let you sign in securely
          without passwords. Pick one, install it, then return here to connect.
        </p>

        <div className="grid gap-3 sm:grid-cols-3">
          {RECOMMENDED_WALLETS.map((wallet) => (
            <a
              key={wallet.name}
              href={wallet.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col rounded-[1.35rem] border border-border bg-background p-4 transition-all duration-300 hover:border-primary/40 hover:bg-primary/5"
            >
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={wallet.icon}
                  alt={`${wallet.name} icon`}
                  className="h-8 w-8 rounded-lg object-cover"
                  loading="lazy"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-bold text-foreground">{wallet.name}</span>
                    <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>
                </div>
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground mb-3 flex-1">
                {wallet.description}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {wallet.bestFor.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary"
                  >
                    {tag.includes('Mobile') ? (
                      <Smartphone className="h-2.5 w-2.5" />
                    ) : (
                      <Globe className="h-2.5 w-2.5" />
                    )}
                    {tag}
                  </span>
                ))}
              </div>
            </a>
          ))}
        </div>

        <div className="mt-4 rounded-xl bg-muted/50 p-4">
          <p className="text-xs leading-relaxed text-muted-foreground">
            <span className="font-semibold text-foreground">Why Solana?</span>{' '}
            We use Solana for fast, low-cost transactions. You do not need to buy SOL to connect your
            wallet — the wallet only creates a cryptographic signature to prove you own the address.
            If you later purchase credits, those transactions happen on-chain with USDC.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link
              to="/phantom-guide"
              className="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1"
            >
              Learn how to set up Phantom →
            </Link>
            <Link
              to="/solana-guide"
              className="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1"
            >
              Learn about Solana →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
