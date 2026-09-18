import { motion } from 'motion/react';
import { Users, Heart, Shield, Award } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';

export default function About() {
  useSEO("About Us - Local Lawn Care Team", "Learn about HappyLawns, a local lawn care and landscaping team serving Hampton Roads, VA with dependable service.");

  return (
    <div className="pt-10 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-6xl font-extrabold text-emerald-950 mb-6"
        >
          About <span className="text-emerald-500">HappyLawns</span>
        </motion.h1>
        <p className="text-xl text-emerald-700 font-medium max-w-3xl mx-auto">
          We are a locally owned and operated lawn care company dedicated to making Hampton Roads beautiful, one yard at a time.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-emerald-200 rounded-[3rem] transform -rotate-6"></div>
          <img 
            src="https://picsum.photos/seed/team/800/800" 
            alt="Our Team" 
            className="relative rounded-[3rem] border-8 border-white shadow-xl object-cover aspect-square"
            referrerPolicy="no-referrer"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-4xl font-extrabold text-emerald-950 mb-6">Our Story</h2>
          <div className="space-y-6 text-lg text-emerald-800 font-medium leading-relaxed">
            <p>
              HappyLawns started with a simple mission: to provide reliable, high-quality lawn care without the hassle. We noticed that many homeowners in Virginia Beach and surrounding areas were frustrated with unreliable contractors.
            </p>
            <p>
              We decided to change that. By combining professional expertise with a friendly, customer-first approach, we now support homeowners and property managers across Hampton Roads.
            </p>
            <p>
              Whether it's a simple weekly mow or a complete landscape redesign, we treat every yard as if it were our own.
            </p>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { icon: <Users />, title: "Local Team", desc: "We live and work in Hampton Roads." },
          { icon: <Heart />, title: "Passionate", desc: "We truly love making lawns look great." },
          { icon: <Shield />, title: "Fully Insured", desc: "Your property is safe in our hands." },
          { icon: <Award />, title: "Service Promise", desc: "If something is off, we make it right." }
        ].map((val, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-8 rounded-[2rem] border-4 border-emerald-100 text-center shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="w-16 h-16 mx-auto bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
              {val.icon}
            </div>
            <h3 className="text-xl font-extrabold text-emerald-950 mb-3">{val.title}</h3>
            <p className="text-emerald-700 font-medium">{val.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
