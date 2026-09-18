import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Star, MapPin, PhoneCall, ArrowRight, Sun, Droplets, Leaf } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';

export default function Home() {
  useSEO("Lawn Care Service in Hampton Roads", "HappyLawns provides lawn mowing, landscaping, and tree care services in Virginia Beach, Norfolk, Chesapeake, and across Hampton Roads.");

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 lg:pt-32 lg:pb-48 px-4 sm:px-6 lg:px-8 bg-emerald-50">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-200/50 blur-3xl"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-yellow-200/50 blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-yellow-100 text-yellow-800 font-bold mb-6 border-2 border-yellow-300">
                <Star className="w-4 h-4 mr-2 text-yellow-500 fill-yellow-500" />
                Local Lawn Care in Hampton Roads
              </div>
              <h1 className="text-5xl lg:text-7xl font-extrabold text-emerald-950 leading-tight mb-6">
                Your Dream Lawn, <br />
                <span className="text-emerald-500 relative">
                  Zero Hassle!
                  <svg className="absolute w-full h-4 -bottom-2 left-0 text-yellow-400" viewBox="0 0 100 10" preserveAspectRatio="none">
                    <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="4" fill="transparent" />
                  </svg>
                </span>
              </h1>
              <p className="text-xl text-emerald-800 mb-8 font-medium max-w-lg leading-relaxed">
                We bring the green to Virginia Beach, Norfolk, Chesapeake, and all of Hampton Roads. Professional, friendly, and always on time.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/contact"
                  className="px-8 py-4 bg-emerald-500 text-white font-extrabold rounded-2xl shadow-[0_6px_0_rgb(4,120,87)] hover:shadow-[0_3px_0_rgb(4,120,87)] hover:translate-y-[3px] transition-all text-center text-lg flex items-center justify-center"
                >
                  Get Your Free Quote <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <Link
                  to="/contact"
                  className="px-8 py-4 bg-white text-emerald-700 font-extrabold rounded-2xl border-4 border-emerald-100 hover:border-emerald-300 hover:bg-emerald-50 transition-all text-center text-lg flex items-center justify-center"
                >
                  Contact Us Online
                </Link>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-[3rem] overflow-hidden border-8 border-white shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <img 
                  src="https://picsum.photos/seed/lawncare/800/600" 
                  alt="Beautiful green lawn" 
                  className="w-full h-auto object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/40 to-transparent"></div>
              </div>
              
              {/* Floating Badges */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl border-4 border-emerald-100 flex items-center gap-4"
              >
                <div className="bg-yellow-400 p-3 rounded-xl text-yellow-900">
                  <Sun className="w-8 h-8" />
                </div>
                <div>
                  <div className="font-extrabold text-emerald-950 text-xl">Friendly</div>
                  <div className="text-emerald-700 font-bold text-sm">Service</div>
                </div>
              </motion.div>
              
              <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="absolute -top-6 -right-6 bg-white p-4 rounded-2xl shadow-xl border-4 border-emerald-100 flex items-center gap-4"
              >
                <div className="bg-emerald-500 p-3 rounded-xl text-white">
                  <MapPin className="w-8 h-8" />
                </div>
                <div>
                  <div className="font-extrabold text-emerald-950 text-xl">Local</div>
                  <div className="text-emerald-700 font-bold text-sm">Hampton Roads</div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
        
        {/* Wavy bottom divider */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg className="relative block w-full h-[100px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.06,155.1,120.4,214.34,108.6,251.5,101.2,288.66,80.1,321.39,56.44Z" fill="#ffffff"></path>
          </svg>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-emerald-950 mb-4">Our Green Services</h2>
            <p className="text-xl text-emerald-700 font-medium max-w-2xl mx-auto">Everything you need to keep your yard looking its absolute best, all year round.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Lawn Mowing",
                desc: "Regular, reliable mowing, edging, and blowing. We leave your yard looking crisp and clean.",
                icon: <Leaf className="w-10 h-10" />,
                color: "bg-emerald-500",
                link: "/services/lawn-mowing"
              },
              {
                title: "Landscaping",
                desc: "Mulch, flower beds, planting, and design. Transform your outdoor living space.",
                icon: <Sun className="w-10 h-10" />,
                color: "bg-yellow-400",
                textColor: "text-yellow-900",
                link: "/services/landscaping"
              },
              {
                title: "Tree & Shrub Care",
                desc: "Trimming, pruning, and health assessments to keep your plants thriving.",
                icon: <Droplets className="w-10 h-10" />,
                color: "bg-blue-400",
                link: "/services/tree-care"
              }
            ].map((service, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -10 }}
                className="bg-emerald-50 rounded-[2rem] p-8 border-4 border-emerald-100 hover:border-emerald-300 transition-colors relative overflow-hidden group"
              >
                <div className={`w-20 h-20 rounded-2xl ${service.color} ${service.textColor || 'text-white'} flex items-center justify-center mb-6 transform group-hover:rotate-12 transition-transform shadow-lg`}>
                  {service.icon}
                </div>
                <h3 className="text-2xl font-extrabold text-emerald-950 mb-4">{service.title}</h3>
                <p className="text-emerald-800 font-medium mb-8 leading-relaxed">{service.desc}</p>
                <Link to={service.link} className="inline-flex items-center font-bold text-emerald-600 hover:text-emerald-800">
                  Learn more <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-emerald-900 text-white px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-800 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-950 rounded-full blur-3xl opacity-50"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-extrabold mb-6">Why Hampton Roads Chooses Us</h2>
              <p className="text-xl text-emerald-200 font-medium mb-8">We're not just cutting grass; we're building relationships. Here is why your neighbors love HappyLawns.</p>
              
              <div className="space-y-6">
                {[
                  "Always on time, every time.",
                  "Upfront pricing with no hidden fees.",
                  "Fully licensed and insured for your peace of mind.",
                  "Friendly, uniformed, and professional crews.",
                  "Satisfaction-first service approach."
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start">
                    <div className="bg-yellow-400 rounded-full p-1 mr-4 mt-1 flex-shrink-0">
                      <CheckCircle2 className="w-5 h-5 text-yellow-900" />
                    </div>
                    <p className="text-lg font-bold text-emerald-50">{item}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4 mt-12">
                <img src="https://picsum.photos/seed/yard1/400/500" alt="Lawn care work" className="rounded-3xl border-4 border-emerald-700 shadow-2xl" referrerPolicy="no-referrer" />
                <div className="bg-emerald-800 p-6 rounded-3xl border-4 border-emerald-700">
                  <div className="text-4xl font-extrabold text-yellow-400 mb-2">Reliable</div>
                  <div className="font-bold text-emerald-100">Weekly Service</div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-emerald-800 p-6 rounded-3xl border-4 border-emerald-700">
                  <div className="text-4xl font-extrabold text-yellow-400 mb-2">Local</div>
                  <div className="font-bold text-emerald-100">Crew</div>
                </div>
                <img src="https://picsum.photos/seed/yard2/400/600" alt="Beautiful landscaping" className="rounded-3xl border-4 border-emerald-700 shadow-2xl" referrerPolicy="no-referrer" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-yellow-400 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-extrabold text-yellow-950 mb-6">Ready for a Better Lawn?</h2>
          <p className="text-2xl text-yellow-800 font-bold mb-10">Get your free, no-obligation quote today and let us do the heavy lifting.</p>
          <Link
            to="/contact"
            className="inline-block px-10 py-5 bg-emerald-900 text-white font-extrabold rounded-2xl shadow-[0_8px_0_rgb(2,44,34)] hover:shadow-[0_4px_0_rgb(2,44,34)] hover:translate-y-[4px] transition-all text-2xl"
          >
            Claim Your Free Quote Now
          </Link>
        </div>
      </section>
    </div>
  );
}
