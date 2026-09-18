import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, ExternalLink, Mail, ShieldCheck, Smartphone, Monitor,
  Download, KeyRound, AlertTriangle, CheckCircle2, Globe, Sparkles, Lock,
  ChevronRight, Copy, Shield
} from 'lucide-react';
import { motion } from 'motion/react';

const PhantomGuide = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>How to Set Up Phantom Wallet | 757 Gas Shop</title>
        <meta name="description" content="Step-by-step guide to setting up Phantom wallet on mobile and desktop. Learn how to create, secure, and connect your Solana wallet to 757 Gas Shop." />
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
                <img src="/Phantom-Icon_App.svg" alt="Phantom" className="h-10 w-10" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Set Up Phantom Wallet</h1>
                <p className="text-muted-foreground text-sm mt-1">Your gateway to Solana and 757 Gas Shop</p>
              </div>
            </div>
          </div>

          <section className="mb-10 rounded-[1.8rem] border border-border bg-card p-6 sm:p-8">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              What is Phantom?
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              <strong className="text-foreground">Phantom</strong> is the most popular wallet for the Solana blockchain. Think of it like a digital bank account that lives in your browser or phone — except <strong className="text-foreground">you own the keys</strong>. No company can freeze it, no bank can delay your payments, and no one else can access it without your permission.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              757 Gas Shop uses Phantom so you can sign in securely, store credits, and pay for orders with <strong className="text-foreground">USDC</strong> (a stable digital dollar on Solana). Transactions settle in seconds and cost less than a penny.
            </p>
          </section>

          <section className="mb-10 rounded-[1.8rem] border border-border bg-card p-6 sm:p-8">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-primary" />
              Mobile Setup (iPhone &amp; Android)
            </h2>
            <ol className="space-y-6">
              <li className="flex gap-4">
                <div className="shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-sm">1</div>
                <div>
                  <h3 className="font-bold text-foreground mb-1">Download the app</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Get Phantom from the{' '}
                    <a href="https://phantom.app/download" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">
                      App Store or Google Play <ExternalLink className="h-3 w-3" />
                    </a>
                    . Only use the official links — fake wallets are the #1 way people lose funds.
                  </p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-sm">2</div>
                <div>
                  <h3 className="font-bold text-foreground mb-1">Create your wallet</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Open Phantom and tap <strong className="text-foreground">Create New Wallet</strong>. You will get a 12-word Secret Recovery Phrase. This is your master key.
                  </p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-sm">3</div>
                <div>
                  <h3 className="font-bold text-foreground mb-1">Save your recovery phrase — offline only</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Write the 12 words on <strong className="text-foreground">paper</strong>. Do not screenshot it. Do not store it in your phone notes, iCloud, Google Drive, or text it to anyone. If someone gets these 12 words, they own your wallet.
                  </p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-sm">4</div>
                <div>
                  <h3 className="font-bold text-foreground mb-1">Set a passcode or biometrics</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Phantom will ask for a device passcode or Face ID / fingerprint. This locks the app so even if someone has your phone, they cannot open your wallet.
                  </p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-sm">5</div>
                <div>
                  <h3 className="font-bold text-foreground mb-1">Visit 757 Gas in Phantom&rsquo;s browser</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Tap the <strong className="text-foreground">globe icon</strong> at the bottom of Phantom, type <strong className="text-foreground">757gas.shop</strong>, and visit the site. Sign up or sign in, then tap <strong className="text-foreground">Connect Wallet</strong> — it will link automatically.
                  </p>
                </div>
              </li>
            </ol>
          </section>

          <section className="mb-10 rounded-[1.8rem] border border-border bg-card p-6 sm:p-8">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Monitor className="h-5 w-5 text-primary" />
              Desktop Setup (Chrome, Firefox, Safari, Brave)
            </h2>
            <ol className="space-y-6">
              <li className="flex gap-4">
                <div className="shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-sm">1</div>
                <div>
                  <h3 className="font-bold text-foreground mb-1">Install the browser extension</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Go to{' '}
                    <a href="https://phantom.app/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">
                      phantom.app <ExternalLink className="h-3 w-3" />
                    </a>
                    {' '}and click Download. Add the extension to your browser.
                  </p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-sm">2</div>
                <div>
                  <h3 className="font-bold text-foreground mb-1">Create your wallet</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Click the Phantom icon in your browser toolbar, then <strong className="text-foreground">Create New Wallet</strong>.
                  </p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-sm">3</div>
                <div>
                  <h3 className="font-bold text-foreground mb-1">Save your Secret Recovery Phrase offline</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Phantom will show 12 words. <strong className="text-foreground">Write them down on paper.</strong> Never save them digitally. Never share them with anyone — not even &ldquo;Phantom support.&rdquo; Real support will never ask for your phrase.
                  </p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-sm">4</div>
                <div>
                  <h3 className="font-bold text-foreground mb-1">Pin the extension</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Click the puzzle-piece icon in your browser toolbar, find Phantom, and click the pin so it stays visible.
                  </p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-sm">5</div>
                <div>
                  <h3 className="font-bold text-foreground mb-1">Connect to 757 Gas Shop</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Visit <strong className="text-foreground">757gas.shop</strong>, sign in with email, then click <strong className="text-foreground">Connect Wallet</strong>. Phantom will pop up — approve the connection and sign the message. Done.
                  </p>
                </div>
              </li>
            </ol>
          </section>

          <section className="mb-10 rounded-[1.8rem] border border-border bg-card p-6 sm:p-8">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              Security: Do&rsquo;s and Don&rsquo;ts
            </h2>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-5">
                <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" /> Do
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>Write your recovery phrase on paper and store it in a safe place.</li>
                  <li>Use a strong device passcode or biometrics.</li>
                  <li>Verify you are on <strong className="text-foreground">phantom.app</strong> before downloading.</li>
                  <li>Start with a small amount of SOL for transaction fees until you are comfortable.</li>
                  <li>Bookmark 757gas.shop and only visit through that bookmark.</li>
                </ul>
              </div>
              <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-5">
                <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-destructive" /> Don&rsquo;t
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>Never share your recovery phrase with anyone — not even &ldquo;support.&rdquo;</li>
                  <li>Never screenshot or photograph your recovery phrase.</li>
                  <li>Never connect your wallet to random links or pop-ups.</li>
                  <li>Never store your phrase in cloud notes, email drafts, or password managers.</li>
                  <li>Never rush through approval prompts — read what you are signing.</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-10 rounded-[1.8rem] border border-border bg-card p-6 sm:p-8">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <KeyRound className="h-5 w-5 text-primary" />
              Key Terms to Know
            </h2>
            <dl className="space-y-4 text-sm">
              <div>
                <dt className="font-bold text-foreground">Secret Recovery Phrase</dt>
                <dd className="text-muted-foreground mt-1 leading-relaxed">12 random words that generate your wallet. Anyone with these words can access everything inside. Treat it like the PIN to your bank vault.</dd>
              </div>
              <div>
                <dt className="font-bold text-foreground">Private Key</dt>
                <dd className="text-muted-foreground mt-1 leading-relaxed">The cryptographic key that proves you own your wallet address. Phantom stores this securely — you do not need to see it.</dd>
              </div>
              <div>
                <dt className="font-bold text-foreground">Public Address</dt>
                <dd className="text-muted-foreground mt-1 leading-relaxed">Your wallet&rsquo;s &ldquo;account number.&rdquo; Safe to share. People send funds to this address, but only your private key can spend them.</dd>
              </div>
              <div>
                <dt className="font-bold text-foreground">SOL</dt>
                <dd className="text-muted-foreground mt-1 leading-relaxed">Solana&rsquo;s native token. You need a tiny amount (about $0.01 worth) in your wallet to pay for transaction fees. Think of it like gas in a car — you need a little to move, but you do not spend much per trip.</dd>
              </div>
              <div>
                <dt className="font-bold text-foreground">USDC</dt>
                <dd className="text-muted-foreground mt-1 leading-relaxed">A digital dollar backed 1:1 by real U.S. dollars held in regulated bank accounts. 1 USDC always equals $1. 757 Gas Shop uses USDC for orders because it is stable, fast, and easy to understand.</dd>
              </div>
              <div>
                <dt className="font-bold text-foreground">Signing</dt>
                <dd className="text-muted-foreground mt-1 leading-relaxed">When Phantom asks you to &ldquo;sign a message,&rdquo; it proves you control the wallet without exposing your private key. It is safe and free.</dd>
              </div>
            </dl>
          </section>

          <section className="mb-10 rounded-[1.8rem] border border-border bg-card p-6 sm:p-8">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              External Resources
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { name: 'Phantom Official', url: 'https://phantom.app/' },
                { name: 'Phantom Help Center', url: 'https://help.phantom.app/' },
                { name: 'Phantom on X / Twitter', url: 'https://x.com/phantom' },
                { name: 'Phantom Download', url: 'https://phantom.app/download' },
              ].map(link => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 rounded-xl border border-border bg-muted/20 p-3 transition-all hover:border-primary/40 hover:bg-primary/5"
                >
                  <img src="/Phantom-Icon_App.svg" alt="Phantom" className="h-6 w-6 rounded" />
                  <span className="text-sm font-bold text-foreground flex-1">{link.name}</span>
                  <ExternalLink className="h-3.5 w-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                </a>
              ))}
            </div>
          </section>

          <section className="rounded-[1.8rem] border border-primary/20 bg-primary/5 p-6 sm:p-8 text-center">
            <Lock className="h-8 w-8 text-primary mx-auto mb-3" />
            <h2 className="text-xl font-bold mb-2">Still have questions?</h2>
            <p className="text-muted-foreground text-sm mb-5 max-w-md mx-auto">
              Setting up a wallet can feel overwhelming the first time. Our team is happy to walk you through it — no question is too small.
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

export default PhantomGuide;
