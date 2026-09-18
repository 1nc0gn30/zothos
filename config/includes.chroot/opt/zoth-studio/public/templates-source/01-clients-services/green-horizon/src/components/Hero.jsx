export default function Hero() {
  return (
    <section
      className="relative min-h-screen bg-gradient-to-br from-teal-950 via-teal-900 to-stone-900 text-white flex flex-col justify-center items-center text-center px-6 sm:px-8 pt-28 pb-20 overflow-hidden bg-speckle"
      aria-label="Nature Harmony Landscaping Hero Section"
    >
      {/* Overlay + floating accents */}
      <div className="absolute inset-0 bg-black/35 z-0"></div>
      <div className="absolute inset-0 z-0 opacity-25">
        <div className="absolute top-16 left-12 w-32 h-32 bg-teal-400 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-16 w-40 h-40 bg-[#bfa06f] rounded-full blur-3xl animate-float" style={{ animationDelay: '1.2s' }} />
        <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-teal-300 rounded-full blur-3xl animate-float" style={{ animationDelay: '2.2s' }} />
      </div>

      {/* Main Content */}
      <div className="relative z-10 animate-fade-in max-w-4xl w-full text-center">
        <span className="inline-block bg-teal-600/20 text-teal-100 px-5 py-2 rounded-full border border-[#bfa06f]/40 text-sm font-medium mb-6 backdrop-blur-sm shadow-md">
          Locally Owned • Hampton Roads, VA
        </span>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-medium leading-tight mb-5 tracking-tight drop-shadow-2xl">
          Transforming Outdoor Spaces with Care, Creativity, and Craftsmanship
        </h1>

        <h2 className="text-xl sm:text-2xl md:text-3xl text-stone-200 font-normal mb-8">
          Nature Harmony Landscaping — where your vision meets Virginia soil.
        </h2>

        <p className="text-lg sm:text-xl text-stone-300 max-w-2xl mx-auto leading-relaxed mb-10">
          Ian Davis and the Nature Harmony team design, build, and maintain landscapes that feel effortless — lush lawns, refined hardscapes, and seasonal cleanups delivered with honest pricing and personal service.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
          <a
            href="#contact"
            className="bg-gradient-to-r from-[#bfa06f] to-[#967d4e] hover:from-[#967d4e] hover:to-[#7a6240] text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
          >
            Get Your Free Quote
          </a>
          <a
            href="tel:+17576670064"
            className="bg-white/10 backdrop-blur-md text-white px-8 py-4 rounded-full border border-white/20 font-semibold text-lg hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
          >
            Speak with Ian
          </a>
        </div>

        {/* Trust Elements */}
        <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-stone-300 font-medium">
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4 text-[#bfa06f]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            Free Estimates
          </span>
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4 text-[#bfa06f]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            Same-Week Availability
          </span>
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4 text-[#bfa06f]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            Licensed & Insured
          </span>
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4 text-[#bfa06f]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            Eco-Conscious Practices
          </span>
        </div>
      </div>
    </section>
  );
}
