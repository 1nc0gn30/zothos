// TrustBadges.jsx
export default function TrustBadges() {
  return (
    <section className="bg-speckle py-8 border-b border-stone-200">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-wrap justify-center items-center gap-8 text-center">
          <div className="flex items-center space-x-2 text-stone-700">
            <svg className="w-6 h-6 text-[#bfa06f]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="7" />
              <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
            </svg>
            <span className="font-semibold">Owner-Led Craftsmanship</span>
          </div>
          <div className="flex items-center space-x-2 text-stone-700">
            <svg className="w-6 h-6 text-teal-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span className="font-semibold">Fully Licensed & Insured</span>
          </div>
          <div className="flex items-center space-x-2 text-stone-700">
            <svg className="w-6 h-6 text-[#bfa06f]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <span className="font-semibold">Hampton Roads Trusted</span>
          </div>
          <div className="flex items-center space-x-2 text-stone-700">
            <svg className="w-6 h-6 text-teal-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            <span className="font-semibold">Satisfaction Guaranteed</span>
          </div>
        </div>
      </div>
    </section>
  );
}
