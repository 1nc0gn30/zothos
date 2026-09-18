import { motion } from 'motion/react';
import { Star, Quote } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';

export default function Testimonials() {
  useSEO("Customer Reviews & Testimonials", "Read what your neighbors in Virginia Beach, Chesapeake, and Norfolk have to say about HappyLawns' reliable lawn care services.");

  const reviews = [
    {
      name: "Sarah Jenkins",
      location: "Virginia Beach",
      text: "HappyLawns completely transformed our front yard. They are always on time, super friendly, and the grass has never looked greener!",
      rating: 5
    },
    {
      name: "Mike Thompson",
      location: "Chesapeake",
      text: "I've gone through three different lawn services before finding these guys. They actually care about the details. Highly recommend.",
      rating: 5
    },
    {
      name: "Linda Davis",
      location: "Norfolk",
      text: "The landscaping team did an amazing job with our new flower beds. They listened to what I wanted and delivered perfectly.",
      rating: 5
    },
    {
      name: "James Wilson",
      location: "Hampton",
      text: "Reliable and affordable. It's so nice to come home from work on Fridays to a perfectly cut lawn.",
      rating: 5
    },
    {
      name: "Emily Roberts",
      location: "Newport News",
      text: "They handled a massive fall cleanup for us. Removed tons of leaves and trimmed all the overgrown shrubs. Great work.",
      rating: 5
    },
    {
      name: "Robert Clark",
      location: "Suffolk",
      text: "Professional crew, easy billing, and great communication. The best lawn care service in Hampton Roads, hands down.",
      rating: 5
    }
  ];

  return (
    <div className="pt-10 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-6xl font-extrabold text-emerald-950 mb-6"
        >
          Happy <span className="text-yellow-500">Customers</span>
        </motion.h1>
        <p className="text-xl text-emerald-700 font-medium max-w-3xl mx-auto">
          Don't just take our word for it. See what your neighbors across Hampton Roads have to say about our services.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {reviews.map((review, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-8 rounded-[2rem] border-4 border-emerald-100 relative shadow-sm hover:shadow-lg transition-shadow"
          >
            <Quote className="absolute top-6 right-6 w-10 h-10 text-emerald-100" />
            <div className="flex mb-4">
              {[...Array(review.rating)].map((_, j) => (
                <Star key={j} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              ))}
            </div>
            <p className="text-emerald-800 font-medium mb-6 italic relative z-10">"{review.text}"</p>
            <div>
              <p className="font-extrabold text-emerald-950">{review.name}</p>
              <p className="text-emerald-600 text-sm font-bold">{review.location}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
