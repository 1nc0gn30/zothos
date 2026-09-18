import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';

export default function TreeCare() {
  useSEO("Tree & Shrub Care Services", "Protect your investment with expert tree and shrub pruning, trimming, and health management in Hampton Roads, VA.");

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
            Tree & <span className="text-blue-500">Shrub Care</span>
          </h1>
          <p className="text-xl text-emerald-800 font-medium mb-8 leading-relaxed">
            Protect your investment. Proper pruning and trimming keep your trees and shrubs healthy, safe, and looking their best year-round.
          </p>
          
          <div className="space-y-4 mb-10">
            {[
              "Hedge and Shrub Trimming",
              "Small Tree Pruning",
              "Deadwood Removal",
              "Shaping and Canopy Thinning"
            ].map((item, i) => (
              <div key={i} className="flex items-center">
                <CheckCircle2 className="w-6 h-6 text-blue-500 mr-3 flex-shrink-0" />
                <span className="text-lg font-bold text-emerald-900">{item}</span>
              </div>
            ))}
          </div>

          <Link
            to="/contact"
            className="inline-flex items-center px-8 py-4 bg-blue-500 text-white font-extrabold rounded-2xl shadow-[0_4px_0_rgb(37,99,235)] hover:shadow-[0_2px_0_rgb(37,99,235)] hover:translate-y-[2px] transition-all text-lg"
          >
            Get a Trimming Quote <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-blue-200 rounded-[3rem] transform rotate-3"></div>
          <img 
            src="https://picsum.photos/seed/treecare/800/600" 
            alt="Tree Care Service" 
            className="relative rounded-[3rem] border-8 border-white shadow-xl object-cover w-full h-auto"
            referrerPolicy="no-referrer"
          />
        </motion.div>
      </div>
    </div>
  );
}
