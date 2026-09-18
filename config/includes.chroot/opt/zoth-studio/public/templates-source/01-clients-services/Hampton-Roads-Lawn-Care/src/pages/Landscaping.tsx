import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';

export default function Landscaping() {
  useSEO("Landscaping & Design Services", "Transform your outdoor space with our professional landscaping, mulch installation, and flower bed design services in Hampton Roads.");

  return (
    <div className="pt-10 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <Link to="/services" className="text-emerald-600 font-bold hover:text-emerald-800 flex items-center">
          &larr; Back to All Services
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-16">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-4xl md:text-6xl font-extrabold text-emerald-950 mb-6 leading-tight">
            Beautiful <span className="text-yellow-500">Landscaping</span>
          </h1>
          <p className="text-xl text-emerald-800 font-medium mb-8 leading-relaxed">
            Transform your outdoor space into a beautiful oasis. From fresh mulch to complete flower bed redesigns, we bring your vision to life.
          </p>
          
          <div className="space-y-4 mb-10">
            {[
              "Mulch and Pine Straw Installation",
              "Flower Bed Design & Planting",
              "Weed Barrier Installation",
              "Decorative Rock & Stone",
              "Sod Installation"
            ].map((item, i) => (
              <div key={i} className="flex items-center">
                <CheckCircle2 className="w-6 h-6 text-yellow-500 mr-3 flex-shrink-0" />
                <span className="text-lg font-bold text-emerald-900">{item}</span>
              </div>
            ))}
          </div>

          <Link
            to="/contact"
            className="inline-flex items-center px-8 py-4 bg-yellow-400 text-yellow-900 font-extrabold rounded-2xl shadow-[0_4px_0_rgb(202,138,4)] hover:shadow-[0_2px_0_rgb(202,138,4)] hover:translate-y-[2px] transition-all text-lg"
          >
            Start Your Project <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-emerald-300 rounded-[3rem] transform -rotate-3"></div>
          <img 
            src="https://picsum.photos/seed/landscaping/800/600" 
            alt="Landscaping Service" 
            className="relative rounded-[3rem] border-8 border-white shadow-xl object-cover w-full h-auto"
            referrerPolicy="no-referrer"
          />
        </motion.div>
      </div>
    </div>
  );
}
