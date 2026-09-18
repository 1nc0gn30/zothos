import { motion } from 'motion/react';
import { Cpu, ShieldCheck, Zap, X, Linkedin, Github, MapPin, Heart } from 'lucide-react';

interface Person {
  name: string;
  role?: string;
  category: string;
  twitter?: string;
  linkedin?: string;
  github?: string;
  handle?: string;
  location?: string;
  projects?: number;
  quote?: string;
}

interface PersonCardProps {
  person: Person;
  index: number;
  key?: string | number;
}

export default function PersonCard({ person, index }: PersonCardProps) {
  const isArchitect = person.category === 'Architect';
  const isEngine = person.category === 'Engine';
  const isVanguard = person.category === 'AI Shipper';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.5 }}
      whileHover={{ scale: 1.02, y: -5 }}
      className="group relative p-0.5 rounded-lg overflow-hidden border-gradient-teal transition-all duration-300 shadow-lg hover:shadow-netlify/20"
    >
      <div className="bg-[#050505] p-5 h-full flex flex-col gap-4 relative z-10 transition-colors group-hover:bg-[#0a0a0a]">
        {/* Header: Icons & ID */}
        <div className="flex items-center justify-between">
          <div className="p-2 rounded bg-netlify/5 text-netlify group-hover:text-hacker group-hover:bg-hacker/5 transition-colors duration-500">
            {isArchitect && <ShieldCheck size={20} />}
            {isEngine && <Cpu size={20} />}
            {isVanguard && <Zap size={20} />}
          </div>
          <span className="text-[10px] font-mono text-gray-600 uppercase tracking-tighter">
            NODE_ID: {person.name.replace(/\s+/g, '_').toUpperCase().slice(0, 8)}
          </span>
        </div>
        
        {/* Identity Section */}
        <div className="relative">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-mono text-base md:text-lg text-gray-100 group-hover:text-netlify transition-colors duration-300 glitch-hover uppercase font-bold">
                {person.name}
              </h3>
              {person.handle && (
                <p className="text-hacker text-[10px] font-mono mt-0.5">
                  {person.handle}
                </p>
              )}
            </div>
            <div className="p-1 px-2 rounded-full bg-red-500/10 text-red-500 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0 shadow-[0_0_10px_rgba(239,68,68,0.2)]">
              <Heart size={10} fill="currentColor" className="animate-pulse" />
              <span className="text-[8px] font-mono uppercase font-bold tracking-tight">Token</span>
            </div>
          </div>
          {person.role && (
            <p className="text-[11px] font-mono text-gray-500 mt-1 uppercase tracking-tight leading-tight">
              &gt; {person.role}
            </p>
          )}
        </div>

        {/* Heartwarming Quote */}
        {person.quote && (
          <div className="relative py-2 px-3 bg-white/[0.02] border-l-2 border-netlify/30 italic">
            <p className="text-[10px] md:text-[11px] font-mono text-gray-400 leading-relaxed">
              "{person.quote}"
            </p>
          </div>
        )}

        {/* Stats / Location */}
        <div className="flex flex-col gap-1.5 py-3 border-y border-white/5">
          {person.location && (
            <div className="flex items-center gap-2 text-gray-500 font-mono text-[10px]">
              <MapPin size={12} className="text-netlify" />
              <span>{person.location.toUpperCase()}</span>
            </div>
          )}
        </div>

        {/* Action: Social Links */}
        <div className="flex items-center gap-3 mt-auto">
          {person.twitter && (
            <a 
              href={person.twitter} 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label={`${person.name} X Profile`}
              className="flex items-center gap-1.5 text-gray-600 hover:text-white transition-all hover:scale-105 group/link"
            >
              <div className="relative">
                <X size={14} />
                <div className="absolute inset-0 bg-white/20 blur-sm scale-150 opacity-0 group-hover/link:opacity-100 transition-opacity" />
              </div>
              <span className="text-[10px] font-mono uppercase tracking-tighter opacity-0 group-hover/link:opacity-100 transition-opacity whitespace-nowrap">X Social</span>
            </a>
          )}
          {person.github && (
            <a 
              href={person.github} 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label={`${person.name} Github Profile`}
              className="text-gray-600 hover:text-white transition-all hover:scale-110 hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]"
            >
              <Github size={16} />
            </a>
          )}
          {person.linkedin && (
            <a 
              href={person.linkedin} 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label={`${person.name} LinkedIn Profile`}
              className="text-gray-600 hover:text-[#0077b5] transition-all hover:scale-110 hover:drop-shadow-[0_0_8px_rgba(0,119,181,0.8)]"
            >
              <Linkedin size={16} />
            </a>
          )}
        </div>
      </div>
      
      {/* Decorative pulse element */}
      <div className="absolute top-0 right-0 p-4 pointer-events-none">
        <div className="w-1.5 h-1.5 rounded-full bg-hacker/20 group-hover:bg-hacker shadow-[0_0_5px_rgba(0,255,65,0)] group-hover:shadow-[0_0_10px_rgba(0,255,65,0.8)] transition-all duration-500" />
      </div>

      {/* Decorative scanline sweep */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-netlify/5 to-transparent h-20 w-full -translate-y-full group-hover:animate-scanline pointer-events-none" />
    </motion.div>
  );
}
