import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, ExternalLink, Mail, Zap, Globe, ShieldCheck,
  AlertTriangle, CheckCircle2, Timer, Layers, DollarSign,
  Coins, Blocks, BadgeDollarSign, Lock
} from 'lucide-react';
import { motion } from 'motion/react';
import SolanaLogo from '../components/SolanaLogo';

const SolanaGuide = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>What is Solana? | 757 Gas Shop Guide</title>
        <meta name="description" content="Learn what Solana is, how it compares to Bitcoin and Ethereum, what tokens exist on Solana, and why 757 Gas Shop uses it for fast, low-cost transactions." />
      </Helmet>

      <div className="max-w-3xl mx-auto px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>

          <div className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-primary/10 rounded-2xl">
                <SolanaLogo className="h-10 w-10" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-black tracking-tight">What is Solana?</h1>
                <p className="text-muted-foreground text-sm mt-1">The blockchain powering 757 Gas Shop</p>
              </div>
            </div>
          </div>

          <section className="mb-10 rounded-[1.8rem] border border-border bg-card p-6 sm:p-8">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              What is Solana?
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              <strong className="text-foreground">Solana</strong> is a high-speed blockchain designed for everyday use. Unlike older blockchains that take minutes and charge dollars per transaction, Solana processes thousands of transactions per second for <strong className="text-foreground">less than a penny each</strong>.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              It was launched in 2020 by Anatoly Yakovenko, a former engineer at Qualcomm who wanted to build a blockchain that could keep up with real-world demand — think stock exchanges, payment networks, and apps like 757 Gas Shop.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Solana uses a unique technology called <strong className="text-foreground">Proof of History</strong> (combined with Proof of Stake) to timestamp transactions before they are confirmed. This removes bottlenecks and lets the network stay fast even when millions of people use it at once.
            </p>
          </section>

          <section className="mb-10 rounded-[1.8rem] border border-border bg-card p-6 sm:p-8">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Layers className="h-5 w-5 text-primary" />
              How Solana Compares
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 font-bold text-foreground">Feature</th>
                    <th className="text-left py-3 px-2 font-bold text-foreground">Solana</th>
                    <th className="text-left py-3 px-2 font-bold text-muted-foreground">Bitcoin</th>
                    <th className="text-left py-3 px-2 font-bold text-muted-foreground">Ethereum</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b border-border/50">
                    <td className="py-3 px-2 font-medium text-foreground">Speed</td>
                    <td className="py-3 px-2 text-primary font-semibold">~400ms</td>
                    <td className="py-3 px-2">~10 minutes</td>
                    <td className="py-3 px-2">~12 seconds</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 px-2 font-medium text-foreground">Cost per tx</td>
                    <td className="py-3 px-2 text-primary font-semibold">~$0.00025</td>
                    <td className="py-3 px-2">~$1–$10</td>
                    <td className="py-3 px-2">~$0.50–$5</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 px-2 font-medium text-foreground">Transactions/sec</td>
                    <td className="py-3 px-2 text-primary font-semibold">~65,000</td>
                    <td className="py-3 px-2">~7</td>
                    <td className="py-3 px-2">~30</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 px-2 font-medium text-foreground">Best for</td>
                    <td className="py-3 px-2 text-primary font-semibold">Apps, payments, gaming</td>
                    <td className="py-3 px-2">Store of value</td>
                    <td className="py-3 px-2">DeFi, smart contracts</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 px-2 font-medium text-foreground">Energy use</td>
                    <td className="py-3 px-2 text-primary font-semibold">Very low (PoS)</td>
                    <td className="py-3 px-2">Very high (PoW)</td>
                    <td className="py-3 px-2">Low (PoS)</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-muted-foreground mt-4 leading-relaxed">
              Figures are approximate and vary with network conditions. Solana&rsquo;s speed and cost make it ideal for frequent, small transactions like cannabis pickups.
            </p>
          </section>

          <section className="mb-10 rounded-[1.8rem] border border-border bg-card p-6 sm:p-8">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <BadgeDollarSign className="h-5 w-5 text-primary" />
              Why 757 Gas Shop Uses Solana
            </h2>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex gap-3">
                <Timer className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span><strong className="text-foreground">Instant payments:</strong> Your order is confirmed in under a second. No waiting for bank transfers or card settlements.</span>
              </li>
              <li className="flex gap-3">
                <DollarSign className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span><strong className="text-foreground">Near-zero fees:</strong> We pass the savings to you. No hidden credit-card processing fees, no chargebacks, no middlemen.</span>
              </li>
              <li className="flex gap-3">
                <ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span><strong className="text-foreground">Self-custody:</strong> Your wallet balance is yours. We cannot freeze it, seize it, or lose it in a data breach.</span>
              </li>
              <li className="flex gap-3">
                <Lock className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span><strong className="text-foreground">Privacy-first sign-in:</strong> Connecting your wallet proves who you are without sharing personal documents or phone numbers with third parties.</span>
              </li>
            </ul>
          </section>

          <section className="mb-10 rounded-[1.8rem] border border-border bg-card p-6 sm:p-8">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Coins className="h-5 w-5 text-primary" />
              Popular Tokens on Solana
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-5">
              Solana supports thousands of tokens. Here are the ones most relevant to 757 Gas Shop users:
            </p>
            <div className="space-y-3">
              <div className="rounded-xl border border-border bg-muted/20 p-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-foreground">SOL</span>
                  <span className="text-xs text-muted-foreground">Solana</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">The native token of Solana. You need a tiny amount (about $0.01 worth) in your wallet to pay for transaction fees. Think of it like gas in a car — you need a little to move, but you do not spend much per trip.</p>
              </div>
              <div className="rounded-xl border border-border bg-muted/20 p-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-foreground">USDC</span>
                  <span className="text-xs text-muted-foreground">USD Coin</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">A digital dollar backed 1:1 by real U.S. dollars held in regulated bank accounts. 1 USDC always equals $1. 757 Gas Shop uses USDC for orders because it is stable, fast, and easy to understand.</p>
              </div>
              <div className="rounded-xl border border-border bg-muted/20 p-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-foreground">USDT</span>
                  <span className="text-xs text-muted-foreground">Tether</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">Another stablecoin pegged to the U.S. dollar. Widely accepted across exchanges and DeFi apps on Solana.</p>
              </div>
              <div className="rounded-xl border border-border bg-muted/20 p-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-foreground">BONK</span>
                  <span className="text-xs text-muted-foreground">Bonk</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">A community-driven meme token on Solana. Fun, but volatile — not used for purchases at 757 Gas.</p>
              </div>
              <div className="rounded-xl border border-border bg-muted/20 p-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-foreground">JUP</span>
                  <span className="text-xs text-muted-foreground">Jupiter</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">The governance token of Jupiter, Solana&rsquo;s largest decentralized exchange aggregator. Used for trading and voting on protocol changes.</p>
              </div>
              <div className="rounded-xl border border-border bg-muted/20 p-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-foreground">PYTH</span>
                  <span className="text-xs text-muted-foreground">Pyth Network</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">A token tied to Pyth, which provides real-time price data to Solana apps. Powers the infrastructure behind many DeFi tools.</p>
              </div>
            </div>
          </section>

          <section className="mb-10 rounded-[1.8rem] border border-border bg-card p-6 sm:p-8">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Blocks className="h-5 w-5 text-primary" />
              How a Transaction Works
            </h2>
            <ol className="space-y-4 text-sm text-muted-foreground">
              <li>
                <strong className="text-foreground">You approve:</strong> When you click &ldquo;Pay&rdquo; or &ldquo;Connect Wallet,&rdquo; Phantom pops up asking you to sign. This is <em>not</em> a charge — it is a cryptographic proof that you authorize the action.
              </li>
              <li>
                <strong className="text-foreground">Phantom signs:</strong> Your wallet uses your private key to create a digital signature. The actual key never leaves your device. Only the proof does.
              </li>
              <li>
                <strong className="text-foreground">Solana confirms:</strong> The network checks the signature, verifies you have enough funds, and adds the transaction to the blockchain in roughly 400 milliseconds.
              </li>
              <li>
                <strong className="text-foreground">Done:</strong> Your wallet balance updates, 757 Gas Shop receives the payment, and your order is instantly confirmed. No banks, no delays, no chargebacks.
              </li>
            </ol>
            <p className="text-xs text-muted-foreground mt-4 leading-relaxed">
              Every transaction is{' '}
              <a href="https://solscan.io" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">
                publicly viewable on Solscan <ExternalLink className="h-3 w-3" />
              </a>
              , Solana&rsquo;s block explorer. You can search your wallet address and see every payment you have ever made.
            </p>
          </section>

          <section className="mb-10 rounded-[1.8rem] border border-border bg-card p-6 sm:p-8">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              Do&rsquo;s and Don&rsquo;ts on Solana
            </h2>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-5">
                <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" /> Do
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>Keep a small amount of SOL in your wallet for fees (less than $1 is plenty for months).</li>
                  <li>Double-check wallet addresses before sending funds — transactions are irreversible.</li>
                  <li>Use USDC for purchases if you want price stability.</li>
                  <li>Bookmark 757gas.shop and only use that link.</li>
                  <li>Explore your transaction history on{' '}
                    <a href="https://solscan.io" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Solscan</a>
                    {' '}to build confidence.</li>
                </ul>
              </div>
              <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-5">
                <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-destructive" /> Don&rsquo;t
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>Don&rsquo;t send tokens to addresses you do not recognize or trust.</li>
                  <li>Don&rsquo;t click random airdrop links or &ldquo;free SOL&rdquo; offers — they are scams.</li>
                  <li>Don&rsquo;t share your Phantom recovery phrase with anyone, ever.</li>
                  <li>Don&rsquo;t treat meme coins like BONK as stable savings — they can swing wildly in value.</li>
                  <li>Don&rsquo;t rush transaction approvals. Read what Phantom is asking you to sign.</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-10 rounded-[1.8rem] border border-border bg-card p-6 sm:p-8">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              Learn More About Solana
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { name: 'Solana Official', url: 'https://solana.com/' },
                { name: 'Solana Docs', url: 'https://docs.solana.com/' },
                { name: 'Solscan (Block Explorer)', url: 'https://solscan.io/' },
                { name: 'Solana Foundation', url: 'https://solana.org/' },
              ].map(link => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 rounded-xl border border-border bg-muted/20 p-3 transition-all hover:border-primary/40 hover:bg-primary/5"
                >
                  <SolanaLogo className="h-6 w-6" />
                  <span className="text-sm font-bold text-foreground flex-1">{link.name}</span>
                  <ExternalLink className="h-3.5 w-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                </a>
              ))}
            </div>
          </section>

          <section className="rounded-[1.8rem] border border-primary/20 bg-primary/5 p-6 sm:p-8 text-center">
            <Lock className="h-8 w-8 text-primary mx-auto mb-3" />
            <h2 className="text-xl font-bold mb-2">Have questions about crypto or Solana?</h2>
            <p className="text-muted-foreground text-sm mb-5 max-w-md mx-auto">
              Crypto can feel like a new language. We are here to translate it — whether you are buying your first SOL or just curious how it all works.
            </p>
            <a
              href="mailto:support@757gas.shop"
              className="inline-flex items-center gap-2 btn-premium px-6 py-3 font-bold text-primary-foreground"
            >
              <Mail className="h-4 w-4" />
              Email support@757gas.shop
            </a>
          </section>
        </motion.div>
      </div>
    </div>
  );
};

export default SolanaGuide;
