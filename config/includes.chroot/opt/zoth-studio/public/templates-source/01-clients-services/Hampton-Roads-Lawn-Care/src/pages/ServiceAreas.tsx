import { motion } from 'motion/react';
import { MapPin } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';

export default function ServiceAreas() {
  useSEO("Service Areas in Hampton Roads", "We provide top-tier lawn care and landscaping services in Virginia Beach, Chesapeake, Norfolk, Hampton, Newport News, Suffolk, and Portsmouth.");

  const areas = [
    { name: "Virginia Beach", desc: "Oceanfront, Pungo, Kempsville, Bayside, and all surrounding neighborhoods." },
    { name: "Chesapeake", desc: "Great Bridge, Greenbrier, Deep Creek, Western Branch, and South Norfolk." },
    { name: "Norfolk", desc: "Ghent, Ocean View, Downtown, and East Beach." },
    { name: "Hampton", desc: "Phoebus, Fox Hill, Wythe, and Buckroe Beach." },
    { name: "Newport News", desc: "Denbigh, Hilton Village, and Oyster Point." },
    { name: "Suffolk", desc: "North Suffolk, Chuckatuck, and Downtown." },
    { name: "Portsmouth", desc: "Olde Towne, Churchland, and Cradock." }
  ];

  return (
    <div className="pt-10 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-6xl font-extrabold text-emerald-950 mb-6"
        >
          Areas We <span className="text-emerald-500">Serve</span>
        </motion.h1>
        <p className="text-xl text-emerald-700 font-medium max-w-3xl mx-auto">
          Proudly providing top-tier lawn care and landscaping services across the entire Hampton Roads region.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-[3rem] p-8 md:p-12 border-4 border-emerald-100 shadow-lg"
        >
          <div className="space-y-6">
            {areas.map((area, i) => (
              <div key={i} className="flex items-start">
                <MapPin className="w-8 h-8 text-emerald-500 mr-4 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-2xl font-extrabold text-emerald-950">{area.name}</h3>
                  <p className="text-emerald-700 font-medium">{area.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative h-full min-h-[400px]"
        >
          <div className="absolute inset-0 bg-yellow-200 rounded-[3rem] transform rotate-2"></div>
          {/* Placeholder for a map image */}
          <div className="relative h-full rounded-[3rem] border-8 border-white shadow-xl overflow-hidden bg-emerald-50 flex items-center justify-center">
            <img 
              src="https://picsum.photos/seed/map/800/800" 
              alt="Map of Hampton Roads" 
              className="absolute inset-0 w-full h-full object-cover opacity-80"
              referrerPolicy="no-referrer"
            />
            <div className="relative z-10 bg-white/90 backdrop-blur p-6 rounded-2xl border-4 border-emerald-200 text-center max-w-xs">
              <MapPin className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
              <h3 className="text-xl font-extrabold text-emerald-950">Hampton Roads, VA</h3>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
