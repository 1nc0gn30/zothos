import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { CircleDollarSign, Clock, Mail, AlertTriangle } from 'lucide-react';

export default function CashAppTerms() {
  return (
    <div className="max-w-3xl mx-auto">
      <Helmet>
        <title>Cash App Terms | 757 Gas Shop</title>
        <meta name="description" content="Cash App credit top-up terms for 757 Gas Shop." />
      </Helmet>

      <div className="card-premium p-8 sm:p-10 space-y-8">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-500/10 text-green-500 ring-1 ring-green-500/20">
            <CircleDollarSign className="h-7 w-7" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Cash App Credit Terms</h1>
          <p className="text-muted-foreground mt-2 text-sm max-w-md mx-auto">
            By sending funds via Cash App, you are purchasing platform credits for use inside the 757 Gas Shop app only.
          </p>
        </div>

        <div className="rounded-[1.35rem] border border-border bg-muted/30 p-6 space-y-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 shrink-0 text-primary mt-0.5" />
            <div>
              <h3 className="font-bold text-foreground">Not for cannabis purchases</h3>
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                Cash App payments are accepted <span className="text-strong">solely to add credits to your app wallet</span>. These credits are digital tokens for use within the platform. No funds sent via Cash App are processed as direct payment for cannabis or related products.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-bold">How it works</h2>
          <ol className="space-y-3 text-sm text-muted-foreground list-decimal ml-4">
            <li>Open Cash App and send your desired amount to tag <strong className="text-foreground">$t757gs</strong>.</li>
            <li>In the Cash App note, include your registered email address so we can match the payment to your account.</li>
            <li>Credits are added to your wallet balance in the app within a maximum of 2 hours.</li>
            <li>If your balance has not updated after 2 hours, contact support with your Cash App receipt.</li>
          </ol>
        </div>

        <div className="rounded-[1.35rem] border border-border bg-muted/30 p-6 space-y-4">
          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 shrink-0 text-primary mt-0.5" />
            <div>
              <h3 className="font-bold text-foreground">Processing time</h3>
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                It takes a <span className="text-strong">maximum of 2 hours</span> for Cash App payments to reflect in your app wallet. Most updates happen sooner, but please allow the full window before reaching out.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[1.35rem] border border-border bg-muted/30 p-6 space-y-4">
          <div className="flex items-start gap-3">
            <Mail className="h-5 w-5 shrink-0 text-primary mt-0.5" />
            <div>
              <h3 className="font-bold text-foreground">Inquiries and disputes</h3>
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                All Cash App credit inquiries, missing balance requests, and disputes must be sent to{' '}
                <a href="mailto:support@757gas.shop" className="text-primary hover:underline font-medium">
                  support@757gas.shop
                </a>.
                Include your Cash App receipt, the exact amount sent, the date/time, and your registered email address.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3 text-sm text-muted-foreground">
          <h2 className="text-lg font-bold text-foreground">Refund policy</h2>
          <p className="leading-relaxed">
            Cash App credit purchases are final once credited to your account. If a payment was sent in error and has not yet been credited, contact support within 24 hours with proof of payment. Refunds are reviewed on a case-by-case basis and issued at the sole discretion of 757 Gas Shop.
          </p>
        </div>

        <div className="space-y-3 text-sm text-muted-foreground">
          <h2 className="text-lg font-bold text-foreground">Account safety</h2>
          <p className="leading-relaxed">
            Only send payments to the verified tag <strong className="text-foreground">$t757gs</strong>. 757 Gas Shop will never request payment to a different Cash App tag via email, text, or social media. Always verify the tag inside the app before sending.
          </p>
        </div>

        <p className="text-xs text-muted-foreground text-center pt-4 border-t border-border">
          These terms supplement the{' '}
          <Link to="/terms" className="text-primary hover:underline">
            Terms of Service
          </Link>.
        </p>
      </div>
    </div>
  );
}
