const testimonials = [
  {
    name: 'Tyler W.',
    location: 'Ocean Lakes, VA',
    quote:
      'Nature Harmony transformed our disaster of a yard into the most beautiful landscape in our neighborhood. The crew was professional, fast, and the new patio is absolutely stunning!',
    initials: 'T',
    stars: 5,
  },
  {
    name: 'Marie H.',
    location: 'Harbor View, Suffolk',
    quote:
      'After the storm, they cleaned up everything perfectly and even helped document the damage for our insurance. Friendly, affordable, and they truly care.',
    initials: 'M',
    stars: 5,
  },
  {
    name: 'James R.',
    location: 'Red Mill, VA',
    quote:
      "Ian and his team have been maintaining our lawn for two years now, and it's never looked better. Honest pricing, great communication, worth every penny.",
    initials: 'J',
    stars: 5,
  },
];

function Star() {
  return (
    <svg className="w-5 h-5 text-[#bfa06f]" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

export default function Testimonials() {
  return (
    <section className="py-20 px-6 bg-white" id="testimonials">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl sm:text-5xl font-serif font-medium text-center mb-16 text-stone-800">
          What Our Clients Say
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="bg-stone-50 border border-stone-200 rounded-2xl p-6 shadow hover:shadow-xl transition-all duration-300 animate-slide-up"
            >
              <div className="flex mb-4">
                {[...Array(t.stars)].map((_, i) => (
                  <Star key={i} />
                ))}
              </div>
              <p className="text-stone-700 italic mb-6 leading-relaxed">“{t.quote}”</p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-teal-700 text-white font-serif font-bold flex items-center justify-center rounded-full shadow">
                  {t.initials}
                </div>
                <div className="ml-3">
                  <p className="font-bold text-stone-800">{t.name}</p>
                  <p className="text-sm text-stone-500">{t.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-xl font-medium text-teal-700">
            Join Hampton Roads homeowners who trust Nature Harmony with their outdoor spaces.
          </p>
        </div>
      </div>
    </section>
  );
}
