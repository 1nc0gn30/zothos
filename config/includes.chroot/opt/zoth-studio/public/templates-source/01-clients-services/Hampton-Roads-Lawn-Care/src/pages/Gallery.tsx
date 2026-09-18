import { motion } from 'motion/react';
import { useSEO } from '../hooks/useSEO';

export default function Gallery() {
  useSEO("Lawn Care & Landscaping Gallery", "View our portfolio of beautiful yard transformations, fresh mulch installations, and perfectly mowed lawns across Hampton Roads.");

  const images = [
    { src: "https://picsum.photos/seed/gal1/600/600", alt: "Freshly mowed lawn" },
    { src: "https://picsum.photos/seed/gal2/600/800", alt: "Landscaping project" },
    { src: "https://picsum.photos/seed/gal3/800/600", alt: "Mulch installation" },
    { src: "https://picsum.photos/seed/gal4/600/600", alt: "Tree trimming" },
    { src: "https://picsum.photos/seed/gal5/800/800", alt: "Flower bed design" },
    { src: "https://picsum.photos/seed/gal6/600/400", alt: "Spring cleanup" },
    { src: "https://picsum.photos/seed/gal7/600/600", alt: "Edging detail" },
    { src: "https://picsum.photos/seed/gal8/800/600", alt: "Backyard oasis" },
  ];

  return (
    <div className="pt-10 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-6xl font-extrabold text-emerald-950 mb-6"
        >
          Our <span className="text-emerald-500">Work</span>
        </motion.h1>
        <p className="text-xl text-emerald-700 font-medium max-w-3xl mx-auto">
          Take a look at some of the beautiful yards we've transformed across Hampton Roads.
        </p>
      </div>

      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
        {images.map((img, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: (i % 3) * 0.1 }}
            className="break-inside-avoid"
          >
            <div className="relative group rounded-3xl overflow-hidden border-4 border-white shadow-md hover:shadow-xl transition-all">
              <img 
                src={img.src} 
                alt={img.alt} 
                className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-emerald-900/0 group-hover:bg-emerald-900/40 transition-colors duration-300 flex items-end">
                <div className="p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-white font-bold text-lg">{img.alt}</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
