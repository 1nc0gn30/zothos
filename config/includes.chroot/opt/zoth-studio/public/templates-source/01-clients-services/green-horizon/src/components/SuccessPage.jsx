import { useEffect } from 'react';
import Logo from './Logo';

export default function SuccessPage() {
  useEffect(() => {
    document.title = 'Thank You | Nature Harmony Landscaping';
  }, []);

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col justify-center items-center px-6 py-12">
      <div className="bg-white rounded-2xl shadow-xl border border-stone-200 p-10 max-w-xl w-full text-center">
        <div className="flex justify-center mb-6">
          <Logo size="md" showText={false} />
        </div>

        <h1 className="text-3xl sm:text-4xl font-serif font-medium text-stone-800 mb-4">
          Thank You!
        </h1>

        <p className="text-lg text-stone-600 mb-6">
          Your message has been sent to Nature Harmony Landscaping. Ian will review your request and get back to you shortly.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/"
            className="bg-[#bfa06f] hover:bg-[#967d4e] text-white px-6 py-3 rounded-full font-semibold transition-colors"
          >
            Back to Home
          </a>
          <a
            href="tel:+17576670064"
            className="text-teal-700 hover:text-teal-800 font-semibold px-6 py-3 border border-teal-700 rounded-full transition-colors"
          >
            Call (757) 667-0064
          </a>
        </div>
      </div>

      <p className="text-center text-stone-500 text-sm mt-8">
        <a href="/privacy-policy/" className="hover:text-teal-700 transition-colors">Privacy Policy</a>
        {' • '}
        <a href="/terms-of-service/" className="hover:text-teal-700 transition-colors">Terms of Service</a>
      </p>
    </div>
  );
}
