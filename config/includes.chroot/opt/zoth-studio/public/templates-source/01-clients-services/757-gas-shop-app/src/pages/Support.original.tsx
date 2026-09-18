import React, { useState, useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Send, CheckCircle2, ChevronDown } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const Support = () => {
  const { user } = useAuthStore();
  const [submitted, setSubmitted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const subjects = [
    'Order Issue',
    'Wallet/Credits',
    'Account Help',
    'General Inquiry'
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
        <title>Support | 757 Gas</title>
        <meta name="description" content="Contact 757 Gas support for help with your orders or account." />
      </Helmet>

      <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Support</h1>
        <p className="text-muted-foreground mb-8">
          Need help with an order or have a question? Send us a message and we'll get back to you as soon as possible.
        </p>

        {submitted ? (
          <div className="bg-primary/10 border border-primary/20 rounded-xl p-8 text-center">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Message Sent!</h2>
            <p className="text-muted-foreground">
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
                Don’t fill this out if you're human: <input name="bot-field" />
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
                  className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
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
                  className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium mb-2">Subject</label>
              <div className="relative" ref={dropdownRef}>
                <input type="hidden" name="subject" value={selectedSubject} required />
                <button
                  type="button"
                  onClick={() => setIsOpen(!isOpen)}
                  className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground text-left focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all flex items-center justify-between cursor-pointer"
                >
                  <span className={selectedSubject ? 'text-foreground' : 'text-muted-foreground'}>
                    {selectedSubject || 'Select a topic...'}
                  </span>
                  <ChevronDown size={16} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {isOpen && (
                  <div className="absolute z-50 w-full mt-2 bg-card border border-border rounded-xl shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    {subjects.map((subject) => (
                      <button
                        key={subject}
                        type="button"
                        onClick={() => {
                          setSelectedSubject(subject);
                          setIsOpen(false);
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-accent hover:text-accent-foreground transition-colors text-foreground bg-card"
                      >
                        {subject}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-2">Message</label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                placeholder="How can we help you today?"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
            >
              <Send size={18} />
              Send Message
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Support;
