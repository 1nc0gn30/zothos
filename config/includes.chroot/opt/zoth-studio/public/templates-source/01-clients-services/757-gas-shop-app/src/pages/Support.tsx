import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Send, CheckCircle2, Mail, DollarSign } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const Support = () => {
  const { user } = useAuthStore();
  const [submitted, setSubmitted] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('');

  const subjects = [
    'Order Issue',
    'Wallet/Credits',
    'Cash App Credit Inquiry',
    'Account Help',
    'General Inquiry'
  ];

  // For Netlify forms in React, we need a hidden form in public/index.html 
  // or we can just use a standard form with data-netlify="true" and a hidden input for form-name.
  // Netlify parses the HTML at build time, so we need to ensure the form is discoverable.
  // The best way in a React app is to have a hidden HTML form in index.html, 
  // or just submit via fetch to the same path with URL encoded data.

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(formData as any).toString()
    })
      .then(() => setSubmitted(true))
      .catch((error) => alert(error));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Helmet>
        <title>Support | 757 Gas Shop</title>
        <meta name="description" content="Contact 757 Gas Shop support for help with your orders or account." />
      </Helmet>

      <div className="card-premium p-8">
        <h1 className="text-4xl font-black tracking-tight mb-2 text-center"><span className="text-gradient">Support Center</span></h1>
        <p className="text-muted-foreground mb-8 text-lead">
          Need help with an order or have a question? Send us a message and we'll get back to you as soon as possible.
        </p>

        <div className="mb-6 rounded-xl border border-border bg-muted/30 p-4 flex items-start gap-3">
          <Mail size={18} className="shrink-0 text-primary mt-0.5" />
          <div className="min-w-0">
            <p className="text-sm font-bold text-foreground">Direct email</p>
            <p className="text-sm text-muted-foreground">
              For faster response, email{' '}
              <a href="mailto:support@757gas.shop" className="text-primary hover:underline font-medium">support@757gas.shop</a>
              . Include your registered email and as much detail as possible.
            </p>
          </div>
        </div>

        <div className="mb-6 rounded-xl border border-green-500/20 bg-green-500/5 p-4 flex items-start gap-3">
          <DollarSign size={18} className="shrink-0 text-green-400 mt-0.5" />
          <div className="min-w-0">
            <p className="text-sm font-bold text-green-400">Cash App credit inquiries</p>
            <p className="text-sm text-muted-foreground">
              For Cash App payments sent to <span className="font-bold text-foreground">$t757gs</span>, email{' '}
              <a href="mailto:support@757gas.shop" className="text-primary hover:underline font-medium">support@757gas.shop</a>{' '}
              with your Cash App receipt, amount sent, date/time, and registered email. Credits reflect within 2 hours max.
            </p>
          </div>
        </div>

        {submitted ? (
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-8 text-center">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Message Sent!</h2>
            <p className="text-muted-foreground text-lead">
              We've received your support request and will be in touch shortly.
            </p>
            <button 
              onClick={() => setSubmitted(false)}
              className="mt-6 text-primary hover:underline font-medium"
            >
              Send another message
            </button>
          </div>
        ) : (
          <form 
            name="support" 
            method="POST" 
            data-netlify="true" 
            netlify-honeypot="bot-field"
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* Hidden inputs for Netlify */}
            <input type="hidden" name="form-name" value="support" />
            <p className="hidden">
              <label>
                Don't fill this out if you're human: <input name="bot-field" />
              </label>
            </p>

            {/* Auto-captured Supabase User Data */}
            {user && (
              <>
                <input type="hidden" name="userId" value={user.id} />
                <input type="hidden" name="userEmail" value={user.email || ''} />
              </>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="input-premium"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  defaultValue={user?.email || ''}
                  className="input-premium"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium mb-2">What do you need help with?</label>
              <select
                id="subject"
                name="subject"
                required
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="input-premium appearance-none"
              >
                <option value="">Please choose an option...</option>
                {subjects.map((subject) => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-2">Tell us more</label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                className="input-premium resize-none"
                placeholder="Please provide as much detail as possible about your issue..."
              ></textarea>
            </div>

            <div className="p-4 bg-muted/20 rounded-xl border border-border/50">
              <p className="text-sm text-muted-foreground mb-2"><span className="text-strong-box">For faster help</span></p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li><span className="text-emphasis">Order issues:</span> Include your order number or approximate date</li>
                <li><span className="text-emphasis">Wallet issues:</span> Mention your wallet address if applicable</li>
                <li><span className="text-emphasis">Cash App issues:</span> Attach your Cash App receipt and the exact amount sent</li>
                <li><span className="text-emphasis">Technical issues:</span> Describe what you were doing when it happened</li>
              </ul>
            </div>

            <button
              type="submit"
              className="w-full btn-premium py-4 text-lg font-bold flex items-center justify-center gap-2"
            >
              <Send size={20} />
              Submit Support Request
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Support;
