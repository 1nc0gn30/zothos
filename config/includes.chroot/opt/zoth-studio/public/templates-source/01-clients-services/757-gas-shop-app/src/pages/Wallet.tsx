import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowDownLeft,
  ArrowUpRight,
  CircleAlert,
  ExternalLink,
  FileText,
  RefreshCcw,
  ShieldCheck,
  Wallet as WalletIcon,
  DollarSign,
  Mail,
  Clock,
  Link as LinkIcon,
  ToggleRight,
} from 'lucide-react';
import HelpTip from '../components/HelpTip';
import LottieWatermark from '../components/LottieWatermark';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';
import { WalletTransaction } from '../types/database';

function getMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }
  return 'Something went wrong. Please try again.';
}

const DEPAY_LINK = 'https://link.depay.com/1EdlpJvblIBqN9c0PHHSBF';
const DEPAY_LINK_SMALL = 'https://link.depay.com/5GQUJPqh74C73RcTJxCGKi';

export default function WalletPage() {
  const { profile, fetchProfile, user, hasSolanaIdentity, isCheckingSolanaIdentity, advancedMode, toggleAdvancedMode } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);

  const loadWalletActivity = async () => {
    if (!user) {
      setTransactions([]);
      return;
    }
    const { data, error } = await supabase
      .from('wallet_transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }
    setTransactions(data || []);
  };

  useEffect(() => {
    async function initialise() {
      try {
        await loadWalletActivity();
      } catch (loadError) {
        setError(getMessage(loadError));
      } finally {
        setLoading(false);
      }
    }

    initialise();

    const handleFocus = () => {
      if (user) {
        fetchProfile(user.id);
        loadWalletActivity();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [user]);

  const handleRefresh = async () => {
    if (!user) return;
    setRefreshing(true);
    setError(null);
    try {
      await Promise.all([fetchProfile(user.id), loadWalletActivity()]);
    } catch (refreshError) {
      setError(getMessage(refreshError));
    } finally {
      setRefreshing(false);
    }
  };

  const getDePayUrl = (link: string) => {
    if (!user) return link;
    const reference = `user_${user.id}_${Date.now()}`;
    return `${link}?reference=${encodeURIComponent(reference)}`;
  };

  const balance = Number(profile?.wallet_balance ?? 0);
  const deposits = transactions.filter((t) => t.type === 'credit' || t.type === 'deposit').length;
  const charges = transactions.filter((t) => t.type !== 'credit' && t.type !== 'deposit').length;

  if (loading || isCheckingSolanaIdentity) {
    return (
      <div className="flex h-72 items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Loading wallet</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-6xl overflow-x-hidden pb-24"
    >
      <section className="hero-watermark-wrap bg-zinc-950 text-white relative overflow-hidden rounded-[1.8rem] p-6 sm:p-8 shadow-2xl border border-zinc-800/80 glow-primary-hover">
        <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[150%] bg-primary/20 rounded-full blur-[80px] pointer-events-none" />
        <LottieWatermark src="/lottie/wallet-glow.json" className="lottie-watermark--hero" />
        
        <div className="hero-watermark-content grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <div className="text-xs font-bold uppercase tracking-wider text-zinc-400">Wallet</div>
              <HelpTip text="Use your wallet balance at checkout. Refresh after a top-up if you need to confirm the latest amount." />
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/20 text-primary">Checkout ready</span>
            </div>
            <h1 className="mt-3 font-display text-4xl sm:text-5xl font-extrabold tracking-tight">
              {balance.toFixed(2)}
            </h1>
            <p className="text-zinc-400 mt-2 text-sm">Credits available for checkout</p>
            
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleRefresh}
                disabled={refreshing}
                className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900/80 px-4 py-2 text-sm font-bold text-zinc-300 transition-all hover:bg-zinc-800 hover:text-white disabled:opacity-50"
              >
                <RefreshCcw size={16} className={refreshing ? 'animate-spin' : ''} />
                {refreshing ? 'Refreshing...' : 'Refresh balance'}
              </button>
              <Link
                to="/orders"
                className="inline-flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-bold text-primary transition-all hover:bg-primary/20"
              >
                <FileText size={16} />
                View orders
              </Link>
              <button
                type="button"
                onClick={toggleAdvancedMode}
                className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-bold transition-all ${
                  advancedMode
                    ? 'border-primary/30 bg-primary/10 text-primary hover:bg-primary/20'
                    : 'border-zinc-700 bg-zinc-900/80 text-zinc-300 hover:bg-zinc-800 hover:text-white'
                }`}
                title="Toggle advanced user mode"
              >
                <ToggleRight size={16} />
                {advancedMode ? 'Advanced: On' : 'Advanced: Off'}
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <article className="flex-1 min-w-[140px] rounded-[1.35rem] border border-zinc-800 bg-zinc-900/50 p-5 backdrop-blur-sm">
              <div className="text-xs font-bold uppercase tracking-wider text-zinc-400">Deposits</div>
              <div className="mt-2 text-2xl font-extrabold text-white">{deposits}</div>
            </article>
            <article className="flex-1 min-w-[140px] rounded-[1.35rem] border border-zinc-800 bg-zinc-900/50 p-5 backdrop-blur-sm">
              <div className="text-xs font-bold uppercase tracking-wider text-zinc-400">Charges</div>
              <div className="mt-2 text-2xl font-extrabold text-white">{charges}</div>
            </article>
            <article className="flex-1 min-w-[140px] rounded-[1.35rem] border border-zinc-800 bg-zinc-900/50 p-5 backdrop-blur-sm">
              <div className="text-xs font-bold uppercase tracking-wider text-zinc-400">Total activity</div>
              <div className="mt-2 text-2xl font-extrabold text-white">{transactions.length}</div>
            </article>
          </div>
        </div>
      </section>

      {advancedMode && !hasSolanaIdentity && (
        <div className="mt-6 rounded-[1.35rem] border border-amber-500/20 bg-amber-500/5 p-5 flex items-start gap-3">
          <CircleAlert size={20} className="shrink-0 text-amber-400 mt-0.5" />
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-amber-400">Wallet not linked</h3>
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
              Link a verified Solana wallet to enable DePay top-ups and checkout. You can still view the menu and build your cart.{' '}
              <Link to="/profile" className="text-primary hover:underline font-medium">Link wallet now →</Link>
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-xl mt-6 text-sm font-medium border border-destructive/20">
          {error}
        </div>
      )}

      <section className="mt-10">
        <div className="mb-6 flex items-center gap-2">
          <div className="min-w-0">
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Top up</div>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight">Buy credits</h2>
          </div>
          <HelpTip text="Cash App is the default top-up method. Enable advanced mode to see DePay and Solana wallet options." />
        </div>

        <div className="card-premium rounded-[1.8rem] p-6 sm:p-8 space-y-6">
          {advancedMode && (
          <>
          {/* DePay */}
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0 max-w-xl">
              <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">DePay checkout</div>
              <h3 className="mt-2 font-display text-2xl font-extrabold tracking-tight">Add credits via DePay</h3>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                Choose a checkout option below. Each opens DePay in a new tab and lets you pick the amount on the checkout page. A linked wallet is required.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              {hasSolanaIdentity ? (
                <>
                  <a
                    href={getDePayUrl(DEPAY_LINK_SMALL)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 btn-premium px-6 py-3 font-bold text-primary-foreground"
                  >
                    <ExternalLink size={18} />
                    10–100 credits
                  </a>
                  <a
                    href={getDePayUrl(DEPAY_LINK)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 btn-premium px-6 py-3 font-bold text-primary-foreground"
                  >
                    <ExternalLink size={18} />
                    25–250 credits
                  </a>
                </>
              ) : (
                <div className="inline-flex items-center gap-2 rounded-xl border border-border bg-muted/50 px-4 py-3 text-sm text-muted-foreground">
                  <LinkIcon size={16} />
                  <span>Link a Solana wallet to enable DePay top-ups.</span>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-muted/50 p-4">
            <div className="flex items-start gap-3 text-sm text-muted-foreground">
              <CircleAlert size={18} className="mt-0.5 shrink-0 text-primary" />
              <p className="m-0 leading-relaxed">
                After a successful DePay payment, credits are added automatically. Refresh the page if they do not appear immediately. Review the{' '}
                <Link to="/terms" className="text-primary hover:underline cursor-pointer">Terms of Service</Link>.
              </p>
            </div>
          </div>
          </>
          )}

          {/* Cash App */}
          <div className="rounded-[1.35rem] border border-green-500/20 bg-green-500/5 p-5 sm:p-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="min-w-0 max-w-xl">
                <div className="flex items-center gap-2">
                  <img src="/cashapp-logo.svg" alt="Cash App" className="h-6 w-6 rounded-md" />
                  <div className="text-xs font-bold uppercase tracking-wider text-green-400">Cash App</div>
                </div>
                <h3 className="mt-2 font-display text-2xl font-extrabold tracking-tight">Add credits via Cash App</h3>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                  Send funds to tag <span className="font-bold text-foreground">$t757gs</span>. Include your registered email in the note so we can match the payment to your account. Credits are for use inside the app only.
                </p>
                <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                  <span className="text-strong">Not for cannabis purchases</span> — Cash App payments are accepted solely to add credits to your app wallet.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <a
                  href="https://cash.app/$t757gs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-green-500/30 bg-green-500/10 px-6 py-3 text-sm font-bold text-green-400 transition-all hover:bg-green-500/20"
                >
                  <DollarSign size={18} />
                  Open Cash App — $t757gs
                </a>
                <Link
                  to="/cashapp-terms"
                  className="inline-flex items-center justify-center gap-2 text-xs font-bold text-primary hover:underline"
                >
                  <ExternalLink size={14} />
                  Cash App credit terms
                </Link>
              </div>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="flex items-start gap-3 rounded-xl border border-border bg-background p-4">
                <Clock size={18} className="shrink-0 text-primary mt-0.5" />
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Processing time</div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Credits reflect within <span className="font-bold text-foreground">2 hours max</span>. Most updates happen sooner.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-xl border border-border bg-background p-4">
                <Mail size={18} className="shrink-0 text-primary mt-0.5" />
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Inquiries</div>
                  <p className="text-sm text-muted-foreground mt-1">
                    All Cash App inquiries to{' '}
                    <a href="mailto:support@757gas.shop" className="text-primary hover:underline font-medium">
                      support@757gas.shop
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <div className="rounded-[1.8rem] border border-border bg-card p-6 sm:p-8 shadow-sm">
          <div className="flex items-start gap-3">
            <ShieldCheck size={20} className="mt-1 shrink-0 text-primary" />
            <div className="min-w-0">
              <h3 className="font-display text-lg font-bold">Dispute handling</h3>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                <span className="text-strong">Credit top-ups use DePay and Cash App as payment systems.</span> DePay disputes follow the DePay payment trail. Cash App disputes must be sent to{' '}
                <a href="mailto:support@757gas.shop" className="text-primary hover:underline font-medium">support@757gas.shop</a>
                . Wallet credit disputes inside 757 GAS are reviewed by 757 GAS directly.
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <article className="card-premium p-5">
              <div className="flex items-center gap-2 text-primary">
                <ShieldCheck size={18} />
                <span className="text-xs font-bold uppercase tracking-wider">Payment disputes</span>
              </div>
              <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                <span className="text-strong">If a DePay payment is disputed</span>, that dispute is handled through DePay as the payment system powering the checkout link.
              </p>
            </article>

            <article className="card-premium p-5">
              <div className="flex items-center gap-2 text-primary">
                <WalletIcon size={18} />
                <span className="text-xs font-bold uppercase tracking-wider">Credit disputes</span>
              </div>
              <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                <span className="text-strong">If your payment is complete but the expected wallet credits</span> or related credit balance issue needs review, 757 Gas Shop handles that dispute directly. For Cash App issues, email{' '}
                <a href="mailto:support@757gas.shop" className="text-primary hover:underline font-medium">support@757gas.shop</a>.
              </p>
            </article>
          </div>

          <p className="text-muted-foreground mt-6 text-sm">
            <span className="text-lead">Using the wallet means you should review the</span>{' '}
            <Link to="/terms" className="text-primary hover:underline cursor-pointer font-medium">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/cashapp-terms" className="text-primary hover:underline cursor-pointer font-medium">
              Cash App Terms
            </Link>
            {' '}before checkout.
          </p>
        </div>
      </section>

      <section className="mt-12">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div className="min-w-0">
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Activity</div>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight"><span className="text-emphasis">Recent wallet activity</span></h2>
          </div>
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-muted text-foreground">
            <span>{transactions.length} entries</span>
          </div>
        </div>

        <div className="card-premium overflow-hidden rounded-[2rem]">
          {transactions.length === 0 ? (
            <div className="px-8 py-16 text-center text-muted-foreground">
              <WalletIcon className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p className="font-medium">No wallet activity yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex flex-col gap-4 px-5 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex min-w-0 items-center gap-5">
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
                        transaction.type === 'credit' || transaction.type === 'deposit'
                          ? 'bg-green-500/10 text-green-500'
                          : 'bg-destructive/10 text-destructive'
                      }`}
                    >
                      {transaction.type === 'credit' || transaction.type === 'deposit' ? (
                        <ArrowDownLeft size={24} />
                      ) : (
                        <ArrowUpRight size={24} />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="break-words font-bold text-lg">{transaction.description}</div>
                      <div className="mt-1 break-words text-sm text-muted-foreground font-medium">
                        {new Date(transaction.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                        {transaction.status ? ` • ${transaction.status}` : ''}
                      </div>
                    </div>
                  </div>
                  <div
                    className={`w-full text-left text-xl font-extrabold sm:w-auto sm:text-right ${
                      transaction.amount >= 0
                        ? 'text-green-500'
                        : 'text-foreground'
                    }`}
                  >
                    {transaction.amount >= 0 ? '+' : ''}
                    {Number(transaction.amount).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </motion.div>
  );
}
