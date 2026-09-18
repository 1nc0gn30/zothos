import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, ExternalLink, Mail, ShieldCheck, Smartphone, DollarSign,
  AlertTriangle, CheckCircle2, Clock, Copy, Lock, Sparkles, CreditCard,
  HelpCircle, FileText
} from 'lucide-react';
import { motion } from 'motion/react';

const CashAppGuide = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>How to Add Credits with Cash App | 757 Gas Shop</title>
        <meta name="description" content="Step-by-step guide to adding wallet credits via Cash App. Learn how to send funds to $t757gs, what to include in the note, and when to expect your balance to update." />
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
              <div className="p-3 bg-green-500/10 rounded-2xl">
                <img src="/cashapp-logo.svg" alt="Cash App" className="h-10 w-10" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Add Credits with Cash App</h1>
                <p className="text-muted-foreground text-sm mt-1">The easiest way to top up without a crypto wallet</p>
              </div>
            </div>
          </div>

          <section className="mb-10 rounded-[1.8rem] border border-border bg-card p-6 sm:p-8">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-green-500" />
              What is Cash App top-up?
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              <strong className="text-foreground">Cash App</strong> is a fast, secure way to add credits to your 757 Gas Shop wallet — no Solana wallet or crypto knowledge required. You send funds directly from your Cash App account to our verified tag, and we credit your app wallet balance.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              <span className="text-strong">Important:</span> Cash App payments are accepted <strong className="text-foreground">solely to add credits to your app wallet</strong>. They are not processed as direct payment for cannabis or related products. Credits are digital tokens for use within the platform only.
            </p>
          </section>

          <section className="mb-10 rounded-[1.8rem] border border-border bg-card p-6 sm:p-8">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-green-500" />
              Step-by-Step: Send from Cash App
            </h2>
            <ol className="space-y-6">
              <li className="flex gap-4">
                <div className="shrink-0 w-8 h-8 rounded-full bg-green-500/10 text-green-500 font-bold flex items-center justify-center text-sm">1</div>
                <div>
                  <h3 className="font-bold text-foreground mb-1">Open Cash App</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Launch the Cash App on your phone. Make sure you are signed into the account you want to send from.
                  </p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="shrink-0 w-8 h-8 rounded-full bg-green-500/10 text-green-500 font-bold flex items-center justify-center text-sm">2</div>
                <div>
                  <h3 className="font-bold text-foreground mb-1">Enter the amount</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Type the dollar amount you want to add as credits. There is no minimum — send what works for you.
                  </p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="shrink-0 w-8 h-8 rounded-full bg-green-500/10 text-green-500 font-bold flex items-center justify-center text-sm">3</div>
                <div>
                  <h3 className="font-bold text-foreground mb-1">Tap Pay and enter the tag</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    In the recipient field, enter our verified Cash App tag:{' '}
                    <span className="inline-flex items-center gap-1 font-bold text-foreground bg-muted px-2 py-0.5 rounded-md">
                      $t757gs
                      <button
                        type="button"
                        onClick={() => {
                          if (typeof navigator !== 'undefined' && navigator.clipboard) {
                            navigator.clipboard.writeText('$t757gs');
                          }
                        }}
                        className="ml-1 text-muted-foreground hover:text-foreground transition-colors"
                        title="Copy tag"
                      >
                        <Copy className="h-3 w-3" />
                      </button>
                    </span>
                  </p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="shrink-0 w-8 h-8 rounded-full bg-green-500/10 text-green-500 font-bold flex items-center justify-center text-sm">4</div>
                <div>
                  <h3 className="font-bold text-foreground mb-1">Add your email in the note</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    In the payment note, include the <strong className="text-foreground">email address registered on your 757 Gas Shop account</strong>. This is how we match the payment to your wallet. Without it, crediting may be delayed.
                  </p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="shrink-0 w-8 h-8 rounded-full bg-green-500/10 text-green-500 font-bold flex items-center justify-center text-sm">5</div>
                <div>
                  <h3 className="font-bold text-foreground mb-1">Confirm and send</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Double-check the tag, amount, and note. Tap send. You will receive a Cash App receipt — screenshot it and keep it until your balance updates.
                  </p>
                </div>
              </li>
            </ol>
          </section>

          <section className="mb-10 rounded-[1.8rem] border border-border bg-card p-6 sm:p-8">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-green-500" />
              When will my credits appear?
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Cash App credits are added to your wallet within a <strong className="text-foreground">maximum of 2 hours</strong>. Most updates happen sooner, especially during business hours.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              If your balance has not updated after 2 hours, email us at{' '}
              <a href="mailto:support@757gas.shop" className="text-primary hover:underline font-medium">support@757gas.shop</a>
              {' '}with your Cash App receipt, amount sent, date/time, and registered email. We will investigate and credit your account.
            </p>
          </section>

          <section className="mb-10 rounded-[1.8rem] border border-border bg-card p-6 sm:p-8">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-green-500" />
              Safety Tips
            </h2>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-5">
                <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" /> Do
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>Double-check the tag is exactly <strong className="text-foreground">$t757gs</strong> before sending.</li>
                  <li>Always include your registered email in the payment note.</li>
                  <li>Screenshot your Cash App receipt after sending.</li>
                  <li>Allow the full 2-hour window before contacting support.</li>
                  <li>Only use the Cash App tag shown inside the official 757 Gas Shop app.</li>
                </ul>
              </div>
              <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-5">
                <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-destructive" /> Don&apos;t
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>Never send Cash App payments to a different tag someone sent you via DM or text.</li>
                  <li>Don&apos;t skip the email note — we can&apos;t match the payment without it.</li>
                  <li>Don&apos;t treat Cash App as a direct product purchase — it adds app credits only.</li>
                  <li>Don&apos;t send more than you intend to use as credits.</li>
                  <li>Don&apos;t panic if credits take a little time — the 2-hour window is normal.</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-10 rounded-[1.8rem] border border-border bg-card p-6 sm:p-8">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-green-500" />
              Frequently Asked Questions
            </h2>
            <dl className="space-y-5 text-sm">
              <div>
                <dt className="font-bold text-foreground">Do I need a Solana wallet to use Cash App top-ups?</dt>
                <dd className="text-muted-foreground mt-1 leading-relaxed">No. Cash App top-ups do not require a linked Solana wallet. However, you will need to link a wallet before you can place orders at checkout.</dd>
              </div>
              <div>
                <dt className="font-bold text-foreground">Is there a minimum or maximum amount?</dt>
                <dd className="text-muted-foreground mt-1 leading-relaxed">There is no platform minimum, but Cash App may have its own sending limits based on your account verification level. Check Cash App&apos;s settings for your current limits.</dd>
              </div>
              <div>
                <dt className="font-bold text-foreground">What if I send the wrong amount?</dt>
                <dd className="text-muted-foreground mt-1 leading-relaxed">Credits are added for the exact amount received. If you overpay, the extra becomes wallet credit. Underpayments will be credited for the amount actually received. Contact support within 24 hours if a mistake was made.</dd>
              </div>
              <div>
                <dt className="font-bold text-foreground">Can I get a refund after credits are added?</dt>
                <dd className="text-muted-foreground mt-1 leading-relaxed">Credit purchases are final once applied to your account. If a payment was sent in error and has not yet been credited, email support within 24 hours with proof of payment. Refunds are reviewed on a case-by-case basis.</dd>
              </div>
              <div>
                <dt className="font-bold text-foreground">Why do I need to include my email?</dt>
                <dd className="text-muted-foreground mt-1 leading-relaxed">Cash App payments do not automatically include your 757 Gas Shop user ID. Your registered email is the safest way for us to match the payment to the correct account quickly and accurately.</dd>
              </div>
            </dl>
          </section>

          <section className="mb-10 rounded-[1.8rem] border border-border bg-card p-6 sm:p-8">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-green-500" />
              Related Resources
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              <Link
                to="/cashapp-terms"
                className="group flex items-center gap-3 rounded-xl border border-border bg-muted/20 p-3 transition-all hover:border-primary/40 hover:bg-primary/5"
              >
                <CreditCard className="h-6 w-6 text-green-500" />
                <span className="text-sm font-bold text-foreground flex-1">Cash App Terms</span>
                <ExternalLink className="h-3.5 w-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>
              <Link
                to="/wallet"
                className="group flex items-center gap-3 rounded-xl border border-border bg-muted/20 p-3 transition-all hover:border-primary/40 hover:bg-primary/5"
              >
                <DollarSign className="h-6 w-6 text-primary" />
                <span className="text-sm font-bold text-foreground flex-1">Your Wallet</span>
                <ExternalLink className="h-3.5 w-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>
              <a
                href="https://cash.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 rounded-xl border border-border bg-muted/20 p-3 transition-all hover:border-primary/40 hover:bg-primary/5"
              >
                <img src="/cashapp-logo.svg" alt="Cash App" className="h-6 w-6 rounded" />
                <span className="text-sm font-bold text-foreground flex-1">Cash App Official</span>
                <ExternalLink className="h-3.5 w-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
              </a>
              <Link
                to="/support"
                className="group flex items-center gap-3 rounded-xl border border-border bg-muted/20 p-3 transition-all hover:border-primary/40 hover:bg-primary/5"
              >
                <Mail className="h-6 w-6 text-primary" />
                <span className="text-sm font-bold text-foreground flex-1">Contact Support</span>
                <ExternalLink className="h-3.5 w-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>
            </div>
          </section>

          <section className="rounded-[1.8rem] border border-green-500/20 bg-green-500/5 p-6 sm:p-8 text-center">
            <Lock className="h-8 w-8 text-green-500 mx-auto mb-3" />
            <h2 className="text-xl font-bold mb-2">Still have questions about Cash App top-ups?</h2>
            <p className="text-muted-foreground text-sm mb-5 max-w-md mx-auto">
              We know sending money to add credits can feel unfamiliar the first time. Our team is here to help — no question is too small.
            </p>
            <a
              href="mailto:support@757gas.shop"
              className="inline-flex items-center gap-2 rounded-xl border border-green-500/30 bg-green-500/10 px-6 py-3 font-bold text-green-400 transition-all hover:bg-green-500/20"
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

export default CashAppGuide;
