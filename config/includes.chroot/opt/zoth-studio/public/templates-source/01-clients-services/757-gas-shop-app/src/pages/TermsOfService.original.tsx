import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ShieldCheck } from 'lucide-react';

const TermsOfService = () => {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <Helmet>
        <title>Terms of Service | 757 Gas</title>
        <meta name="description" content="Terms of Service and User Agreement for 757 Gas." />
      </Helmet>

      <div className="mb-10 text-center">
        <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
          <ShieldCheck className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-4">Terms of Service</h1>
        <p className="text-muted-foreground">Last Updated: March 26, 2026</p>
      </div>

      <div className="prose prose-zinc dark:prose-invert max-w-none space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
          <p className="text-muted-foreground leading-relaxed">
            By accessing or using the 757 Gas website (757gas.shop) and our associated services (collectively, the "Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you may not access or use the Service. These Terms constitute a legally binding agreement between you and 757 Gas.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">2. Eligibility and Age Restriction</h2>
          <p className="text-muted-foreground leading-relaxed">
            You must be at least 21 years of age to use this Service. By creating an account and using our platform, you represent and warrant that you are 21 years of age or older. We reserve the right to request valid, government-issued identification at any time to verify your age. Failure to provide valid identification upon request will result in immediate termination of your account and cancellation of any pending orders.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">3. Service Description</h2>
          <p className="text-muted-foreground leading-relaxed">
            757 Gas operates as a premium cannabis pickup service exclusively within the 757 area code (Hampton Roads, Virginia). We do not offer shipping or delivery services. All orders placed through the platform must be picked up in person at the designated meetup locations agreed upon during the checkout process.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">4. User Accounts and Security</h2>
          <p className="text-muted-foreground leading-relaxed">
            To use certain features of the Service, you must register for an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account. 757 Gas will not be liable for any loss or damage arising from your failure to protect your account information.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">5. Wallet and Credits Policy</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Our platform utilizes a digital wallet system ("757 Gas Wallet") for all transactions. By purchasing credits, you agree to the following:
          </p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-2">
            <li><strong>Purchases are Final:</strong> All purchases of wallet credits are final and non-refundable, except as required by law.</li>
            <li><strong>No Cash Value:</strong> Wallet credits have no cash value outside of the 757 Gas platform and cannot be exchanged for fiat currency.</li>
            <li><strong>Dispute Resolution:</strong> If a payment made via our third-party processor (e.g., Stripe) is disputed, that dispute is handled through the payment processor. However, any disputes regarding the usage of credits within the 757 Gas platform must be directed to and resolved by 757 Gas directly.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">6. Orders and Pickup Protocol</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            When placing an order for pickup, you agree to adhere to our pickup protocols:
          </p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-2">
            <li><strong>Verification:</strong> You must present the unique pinpoint code generated for your order and a valid, government-issued ID matching your account details at the time of pickup.</li>
            <li><strong>Right to Refuse:</strong> 757 Gas reserves the right to refuse service, cancel orders, or deny the handover of products to any individual who appears intoxicated, fails to provide valid ID, or engages in hostile or suspicious behavior.</li>
            <li><strong>Timeliness:</strong> You are expected to arrive at the designated meetup location at the agreed-upon time. Repeated failure to show up for scheduled pickups may result in account suspension.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">7. Prohibited Conduct</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            You agree not to engage in any of the following prohibited activities:
          </p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-2">
            <li>Using the Service for any illegal purpose or in violation of any local, state, or federal laws.</li>
            <li>Attempting to purchase products on behalf of individuals under the age of 21.</li>
            <li>Harassing, threatening, or intimidating 757 Gas staff or other users.</li>
            <li>Attempting to interfere with or compromise the system integrity or security of the Service.</li>
            <li>Reselling or redistributing products acquired through the Service without proper licensing.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">8. Disclaimer of Warranties</h2>
          <p className="text-muted-foreground leading-relaxed">
            The Service and all products offered are provided on an "as is" and "as available" basis. 757 Gas makes no representations or warranties of any kind, express or implied, regarding the operation of the Service or the information, content, materials, or products included on the platform. To the full extent permissible by applicable law, 757 Gas disclaims all warranties, express or implied, including, but not limited to, implied warranties of merchantability and fitness for a particular purpose.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">9. Limitation of Liability</h2>
          <p className="text-muted-foreground leading-relaxed">
            In no event shall 757 Gas, its directors, employees, or agents be liable for any direct, indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of the Service or the products purchased through the Service. This includes, but is not limited to, damages for loss of profits, goodwill, use, data, or other intangible losses.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">10. Modifications to Terms</h2>
          <p className="text-muted-foreground leading-relaxed">
            We reserve the right to modify or replace these Terms at any time. We will provide notice of any material changes by posting the updated Terms on this page and updating the "Last Updated" date. Your continued use of the Service following the posting of any changes constitutes acceptance of those changes.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">11. Contact Information</h2>
          <p className="text-muted-foreground leading-relaxed">
            If you have any questions or concerns about these Terms of Service, please contact us at support@757gas.shop or through our official social media channels.
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsOfService;
