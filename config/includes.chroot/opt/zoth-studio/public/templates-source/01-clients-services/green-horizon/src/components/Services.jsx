const services = [
  {
    title: 'Premium Lawn Care',
    description: 'Mowing, fertilization, aeration, and seasonal treatments that keep Hampton Roads lawns thick, green, and healthy year-round.',
    features: ['Weekly/bi-weekly mowing', 'Custom fertilization programs', 'Weed control & aeration'],
    price: 'Starting at $45/visit',
    badge: 'Most Popular',
    image: 'photo-2.avif',
    badgeColor: 'bg-teal-600',
  },
  {
    title: 'Custom Hardscaping',
    description: 'Patios, walkways, retaining walls, and outdoor living spaces designed around how you actually live outside.',
    features: ['Paver patios & fire pits', 'Walkways & entryways', 'Retaining walls & edging'],
    price: 'Free Design Consultation',
    badge: 'Premium Service',
    image: 'photo-1.avif',
    badgeColor: 'bg-[#967d4e]',
  },
  {
    title: 'Tree & Cleanup Services',
    description: 'Storm damage cleanup, seasonal debris removal, and careful tree trimming to protect your property and your view.',
    features: ['Tree trimming & removal', 'Storm debris cleanup', 'Seasonal yard refresh'],
    price: 'Emergency Service Available',
    badge: 'Storm Ready',
    image: 'photo-3.avif',
    badgeColor: 'bg-stone-600',
  },
];

export default function Services() {
  return (
    <section className="py-20 px-6 max-w-7xl mx-auto bg-white" id="services">
      <div className="text-center mb-16">
        <h2 className="text-4xl sm:text-5xl font-serif font-medium mb-4 text-stone-800">
          Our Expert Services
        </h2>
        <p className="text-xl text-stone-600 max-w-2xl mx-auto">
          From weekly lawn care to full landscape transformations, Nature Harmony delivers thoughtful work that lasts.
        </p>
      </div>

      <div className="grid gap-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service, idx) => (
          <div
            key={idx}
            className="group bg-stone-50 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 animate-slide-up border border-stone-100"
          >
            <div className="relative overflow-hidden">
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              <div className={`absolute top-4 right-4 ${service.badgeColor} text-white px-3 py-1 rounded-full text-sm font-semibold shadow-md`}>
                {service.badge}
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-2xl font-bold mb-3 text-stone-800">{service.title}</h3>
              <p className="text-stone-600 mb-4">{service.description}</p>

              <ul className="space-y-2 text-sm text-stone-500 mb-4">
                {service.features.map((feature, i) => (
                  <li key={i} className="flex items-center">
                    <svg className="w-4 h-4 text-teal-600 mr-2 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="text-[#967d4e] font-bold text-lg">{service.price}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
