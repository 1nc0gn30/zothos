export default function Contact() {
  return (
    <section
      id="contact"
      className="bg-gradient-to-br from-teal-800 to-stone-900 text-white py-20 px-6"
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* Info Panel */}
        <div className="space-y-6">
          <h2 className="text-4xl sm:text-5xl font-serif font-medium">
            Ready to Transform Your Yard?
          </h2>
          <p className="text-lg text-stone-200 leading-relaxed">
            Get your free, no-obligation estimate. Ian and the Nature Harmony team offer fast, friendly service across Hampton Roads.
          </p>

          <ul className="space-y-3 text-stone-200 text-sm mt-4">
            <li className="flex items-start">
              <svg className="w-5 h-5 text-[#bfa06f] mr-2 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              Hampton Roads, VA
            </li>
            <li className="flex items-center">
              <svg className="w-5 h-5 text-[#bfa06f] mr-2 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <a href="tel:+17576670064" className="hover:text-[#bfa06f] transition-colors">(757) 667-0064</a>
            </li>
            <li className="flex items-center">
              <svg className="w-5 h-5 text-[#bfa06f] mr-2 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <a href="mailto:nhlandscapingva@gmail.com" className="hover:text-[#bfa06f] transition-colors">nhlandscapingva@gmail.com</a>
            </li>
            <li className="flex items-center">
              <svg className="w-5 h-5 text-[#bfa06f] mr-2 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              Mon–Sat: 7AM–7PM
            </li>
          </ul>

          <p className="text-sm text-stone-400 pt-4">
            Fully licensed & insured • Locally owned • Owner on every job
          </p>
        </div>

        {/* Netlify Form with honeypot + reCAPTCHA 2 invisible */}
        <form
          name="contact"
          method="POST"
          action="/success/"
          data-netlify="true"
          data-netlify-recaptcha="true"
          netlify-honeypot="bot-field"
          className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl border border-white/20 space-y-6"
        >
          <input type="hidden" name="form-name" value="contact" />

          {/* Honeypot field */}
          <p className="hidden">
            <label>
              Do not fill this out if you are human:{' '}
              <input name="bot-field" />
            </label>
          </p>

          <div>
            <label htmlFor="name" className="block mb-1 text-sm font-semibold">
              Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              required
              className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-stone-300 border border-white/30 focus:outline-none focus:ring-2 focus:ring-[#bfa06f]"
              placeholder="Jane Doe"
            />
          </div>

          <div>
            <label htmlFor="email" className="block mb-1 text-sm font-semibold">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              required
              className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-stone-300 border border-white/30 focus:outline-none focus:ring-2 focus:ring-[#bfa06f]"
              placeholder="you@email.com"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block mb-1 text-sm font-semibold">
              Phone
            </label>
            <input
              type="tel"
              name="phone"
              id="phone"
              className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-stone-300 border border-white/30 focus:outline-none focus:ring-2 focus:ring-[#bfa06f]"
              placeholder="(757) 000-0000"
            />
          </div>

          <div>
            <label htmlFor="message" className="block mb-1 text-sm font-semibold">
              Message
            </label>
            <textarea
              name="message"
              id="message"
              required
              rows="4"
              className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-stone-300 border border-white/30 focus:outline-none focus:ring-2 focus:ring-[#bfa06f]"
              placeholder="Tell us about your landscaping needs..."
            />
          </div>

          <div data-netlify-recaptcha="true" className="min-h-[78px]"></div>

          <button
            type="submit"
            className="w-full bg-[#bfa06f] hover:bg-[#967d4e] text-white font-bold py-3 rounded-lg transition-transform hover:scale-105"
          >
            Request Free Estimate
          </button>

          <p className="text-xs text-stone-300 mt-4">
            By submitting, you agree to our{' '}
            <a href="/privacy-policy/" className="underline hover:text-[#bfa06f]">Privacy Policy</a>
            {' '}and{' '}
            <a href="/terms-of-service/" className="underline hover:text-[#bfa06f]">Terms of Service</a>.
          </p>
        </form>
      </div>
    </section>
  );
}
