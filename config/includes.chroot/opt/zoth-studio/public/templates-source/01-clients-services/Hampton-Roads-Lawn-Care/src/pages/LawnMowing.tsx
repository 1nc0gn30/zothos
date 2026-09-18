import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';

export default function LawnMowing() {
  useSEO("Professional Lawn Mowing Services", "Get crisp, clean, and perfectly manicured lawns with our weekly and bi-weekly mowing services in Virginia Beach, Norfolk, and Chesapeake.");

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
            Professional <span className="text-emerald-500">Lawn Mowing</span>
          </h1>
          <p className="text-xl text-emerald-800 font-medium mb-8 leading-relaxed">
            Get the crisp, clean, and perfectly manicured lawn you deserve without lifting a finger. Our weekly and bi-weekly mowing services are designed for Hampton Roads weather.
          </p>
          
          <div className="space-y-4 mb-10">
            {[
              "Precision Mowing at the optimal height",
              "Crisp edging along driveways and sidewalks",
              "String trimming around obstacles",
              "Blowing debris off all hard surfaces"
            ].map((item, i) => (
              <div key={i} className="flex items-center">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 mr-3 flex-shrink-0" />
                <span className="text-lg font-bold text-emerald-900">{item}</span>
              </div>
            ))}
          </div>

          <Link
            to="/contact"
            className="inline-flex items-center px-8 py-4 bg-emerald-500 text-white font-extrabold rounded-2xl shadow-[0_4px_0_rgb(4,120,87)] hover:shadow-[0_2px_0_rgb(4,120,87)] hover:translate-y-[2px] transition-all text-lg"
          >
            Get a Mowing Quote <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-yellow-300 rounded-[3rem] transform rotate-3"></div>
          <img 
            src="https://picsum.photos/seed/mowing/800/600" 
            alt="Lawn Mowing Service" 
            className="relative rounded-[3rem] border-8 border-white shadow-xl object-cover w-full h-auto"
            referrerPolicy="no-referrer"
          />
        </motion.div>
      </div>

      <div className="bg-emerald-50 rounded-[3rem] p-8 md:p-12 border-4 border-emerald-100">
        <h2 className="text-3xl font-extrabold text-emerald-950 mb-6 text-center">Why Proper Mowing Matters</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h3 className="text-xl font-bold text-emerald-900 mb-3">Weed Control</h3>
            <p className="text-emerald-700 font-medium">Mowing at the correct height encourages dense grass growth, which naturally chokes out weeds.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h3 className="text-xl font-bold text-emerald-900 mb-3">Root Health</h3>
            <p className="text-emerald-700 font-medium">Never cutting more than 1/3 of the grass blade ensures deep, healthy root systems.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h3 className="text-xl font-bold text-emerald-900 mb-3">Curb Appeal</h3>
            <p className="text-emerald-700 font-medium">A freshly cut, edged, and blown yard instantly boosts your home's appearance.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
