import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, Sun, Droplets, Wind, Shovel, Trees } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';

export default function Services() {
  useSEO("Lawn Care & Landscaping Services", "Explore our comprehensive lawn care services including mowing, landscaping, tree care, and seasonal cleanups in Hampton Roads.");

  const services = [
    {
      id: "lawn-mowing",
      title: "Lawn Mowing & Maintenance",
      desc: "Keep your grass at the perfect height all season long. Includes mowing, edging, and blowing.",
      icon: <Leaf className="w-8 h-8" />,
      color: "bg-emerald-500",
      link: "/services/lawn-mowing"
    },
    {
      id: "landscaping",
      title: "Landscaping & Design",
      desc: "Mulch installation, flower bed creation, and complete yard makeovers.",
      icon: <Sun className="w-8 h-8" />,
      color: "bg-yellow-400",
      textColor: "text-yellow-900",
      link: "/services/landscaping"
    },
    {
      id: "tree-care",
      title: "Tree & Shrub Care",
      desc: "Pruning, trimming, and health management for your woody plants.",
      icon: <Trees className="w-8 h-8" />,
      color: "bg-blue-500",
      link: "/services/tree-care"
    },
    {
      id: "cleanup",
      title: "Seasonal Cleanup",
      desc: "Spring and Fall cleanups to prepare your yard for the changing seasons.",
      icon: <Wind className="w-8 h-8" />,
      color: "bg-orange-500",
      link: "/contact"
    },
    {
      id: "aeration",
      title: "Aeration & Seeding",
      desc: "Breathe life back into compacted soil and fill in bare patches.",
      icon: <Shovel className="w-8 h-8" />,
      color: "bg-amber-700",
      link: "/contact"
    },
    {
      id: "irrigation",
      title: "Irrigation Maintenance",
      desc: "Sprinkler head adjustments and minor repairs to keep your lawn hydrated.",
      icon: <Droplets className="w-8 h-8" />,
      color: "bg-cyan-500",
      link: "/contact"
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
          Our <span className="text-emerald-500">Services</span>
        </motion.h1>
        <p className="text-xl text-emerald-700 font-medium max-w-3xl mx-auto">
          From basic mowing to complex landscape design, we offer everything you need for a perfect yard in Hampton Roads.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service, i) => (
          <motion.div 
            key={service.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-[2rem] p-8 border-4 border-emerald-100 hover:border-emerald-400 transition-all flex flex-col h-full shadow-sm hover:shadow-xl"
          >
            <div className={`w-16 h-16 rounded-2xl ${service.color} ${service.textColor || 'text-white'} flex items-center justify-center mb-6 shadow-md`}>
              {service.icon}
            </div>
            <h3 className="text-2xl font-extrabold text-emerald-950 mb-4">{service.title}</h3>
            <p className="text-emerald-800 font-medium mb-8 flex-grow">{service.desc}</p>
            <Link 
              to={service.link} 
              className="inline-flex items-center font-bold text-emerald-600 hover:text-emerald-800 bg-emerald-50 px-4 py-2 rounded-xl w-fit"
            >
              Learn more <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="mt-20 bg-emerald-900 rounded-[3rem] p-12 text-center text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-800 rounded-full blur-3xl opacity-50"></div>
        <div className="relative z-10">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-6">Need a Custom Service?</h2>
          <p className="text-xl text-emerald-200 font-medium mb-8 max-w-2xl mx-auto">
            Don't see exactly what you're looking for? Contact us! We can tailor our services to meet your specific yard care needs.
          </p>
          <Link
            to="/contact"
            className="inline-block px-8 py-4 bg-yellow-400 text-yellow-900 font-extrabold rounded-2xl shadow-[0_4px_0_rgb(202,138,4)] hover:shadow-[0_2px_0_rgb(202,138,4)] hover:translate-y-[2px] transition-all text-lg"
          >
            Contact Us Today
          </Link>
        </div>
      </div>
    </div>
  );
}
