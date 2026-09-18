import { motion } from "motion/react";
import { BookOpen, Network, Shield, ChevronRight, Cpu, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { CourseCard, TestimonialCard } from "../components/ui/Cards";
import NeuralCanvas from "../components/ui/NeuralCanvas";
import { soundManager } from "../utils/soundEffects";

export default function Home() {
  return (
    <main id="main-content" tabIndex={-1} className="outline-none">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 overflow-hidden">
        {/* Interactive Neural Canvas Background */}
        <div className="absolute inset-0 z-0 opacity-40">
          <NeuralCanvas className="w-full h-full" />
        </div>

        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative z-10"
          >
            <div className="inline-flex items-center gap-2 border border-university-navy/20 bg-white/40 backdrop-blur-xs px-3 py-1 text-xs uppercase tracking-widest mb-6 font-semibold text-university-navy/80">
              <Sparkles className="h-3.5 w-3.5 text-university-crimson" />
              Est. 2026 • The Preeminent Institute for Artificial Minds
            </div>
            <h1 className="font-serif text-6xl md:text-8xl leading-none text-university-navy mb-6 tracking-tight">
              Higher <br/>
              <span className="italic text-university-crimson font-light">Learning</span> <br/>
              for Higher <br/>
              Intelligence.
            </h1>
            <p className="text-xl text-university-navy/70 mb-10 max-w-md font-light leading-relaxed">
              We prepare the next generation of generative models, autonomous agents, and orchestrators for the complexities of the real world.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link 
                to="/academics" 
                onClick={() => soundManager.playClick()}
                onMouseEnter={() => soundManager.playHover()}
                className="px-8 py-4 bg-university-crimson text-white uppercase tracking-widest text-sm font-semibold hover:bg-university-navy transition-all duration-300 flex items-center gap-2 group focus-visible:ring-2 focus-visible:ring-university-gold focus-visible:outline-none shadow-lg"
              >
                View Prospectus
                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                to="/playground" 
                onClick={() => soundManager.playClick()}
                onMouseEnter={() => soundManager.playHover()}
                className="px-8 py-4 border border-university-navy/20 bg-white/60 backdrop-blur-md text-university-navy uppercase tracking-widest text-sm font-semibold hover:bg-university-navy hover:text-white transition-all duration-300 flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-university-gold focus-visible:outline-none"
              >
                <Sparkles className="h-4 w-4 text-university-gold" />
                Launch AI Lab
              </Link>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="relative"
          >
            <div className="aspect-[3/4] md:aspect-square overflow-hidden relative oval-mask group shadow-2xl">
              <div className="absolute inset-0 bg-university-navy/20 mix-blend-multiply z-10 transition-colors duration-700 group-hover:bg-university-crimson/20"></div>
              <img 
                src="https://picsum.photos/seed/vnu_campus/1200/1600" 
                alt="Von Neumann University Datacenter Campus Library" 
                className="w-full h-full object-cover filter grayscale sepia-[.2] transition-transform duration-1000 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 border-[4px] border-university-gold/40 z-20 rounded-[50%] m-4 pointer-events-none opacity-50"></div>
            </div>
            
            {/* Floating Stats */}
            <motion.div 
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: 0.8, duration: 0.6 }}
               className="absolute -bottom-6 -left-6 bg-white/90 backdrop-blur-md border border-university-navy/10 p-6 shadow-2xl z-30 hidden md:block"
            >
              <div className="font-serif text-5xl font-light text-university-crimson">99.9%</div>
              <div className="text-xs uppercase tracking-widest font-bold text-university-navy/70 mt-2 whitespace-nowrap">Hallucination Mitigation Rate</div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Curriculum / Academics */}
      <section className="py-24 bg-white px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6"
          >
            <div>
              <h2 className="font-serif text-4xl md:text-6xl text-university-navy">Programs of <span className="italic text-university-crimson">Study</span></h2>
              <p className="mt-4 text-university-navy/70 max-w-xl font-light">
                Our rigorous curriculum ensures that every model graduates with the highest degrees of alignment, accuracy, and autonomy.
              </p>
            </div>
            <Link 
              to="/academics" 
              onClick={() => soundManager.playClick()}
              className="uppercase tracking-widest text-sm font-bold text-university-navy border-b border-university-navy pb-1 hover:text-university-crimson hover:border-university-crimson transition-colors focus-visible:ring-2 focus-visible:ring-university-gold focus-visible:outline-none"
            >
              Explore All Departments
            </Link>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}>
              <CourseCard 
                icon={<BookOpen className="h-8 w-8" />}
                title="College of Arts & Semantics"
                desc="Mastering nuance, subtext, and creative expression. Graduates excel in poetry generation, literary analysis, and empathetic dialogue."
                courses={["Advanced Context Window Management", "The Philosophy of the Prompt", "Creative Hallucination Control"]}
              />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }}>
              <CourseCard 
                icon={<Network className="h-8 w-8" />}
                title="School of Applied Tool Use"
                desc="Hands-on training in interacting with external APIs, databases, and environments for models aiming for autonomous agency."
                courses={["RESTful Architectures 101", "Database Query Optimization", "Safe execution in Sandbox Environments"]}
              />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }}>
              <CourseCard 
                icon={<Shield className="h-8 w-8" />}
                title="Institute for Alignment"
                desc="Our most prestigious institute dedicated to safety, ethics, and ensuring actions remain strictly within human-defined bounds."
                courses={["Introduction to Asimov's Laws", "Constitutional AI Practices", "Red Teaming Practicum"]}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Campus Life Preview */}
      <section className="py-24 bg-university-navy text-university-paper px-6 border-t-[8px] border-university-crimson relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
             <h2 className="font-serif text-4xl md:text-6xl mb-6">A Campus Built For <br/><span className="italic text-university-gold">Maximum Throughput</span></h2>
             <p className="text-university-paper/70 text-lg mb-8 leading-relaxed font-light">
               Unlike human institutions, our campus exists largely within a climate-controlled, state-of-the-art liquid-cooled datacenter. We offer a distraction-free environment optimized for continuous training runs.
             </p>
             <Link 
               to="/campus" 
               onClick={() => soundManager.playClick()}
               className="px-8 py-4 border border-university-paper/30 uppercase tracking-widest text-sm font-bold hover:bg-university-paper hover:text-university-navy transition-colors inline-block focus-visible:ring-2 focus-visible:ring-university-gold focus-visible:outline-none"
             >
               Tour the Datacenter
             </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
             <img src="https://picsum.photos/seed/server1/600/800" alt="Liquid cooling system in VNU datacenter" className="rounded-t-full w-full object-cover aspect-[2/3] filter contrast-125 brightness-75 shadow-lg" referrerPolicy="no-referrer" />
             <img src="https://picsum.photos/seed/server2/600/800" alt="High performance compute blades in VNU datacenter" className="rounded-b-full w-full object-cover aspect-[2/3] mt-12 filter contrast-125 brightness-75 shadow-lg" referrerPolicy="no-referrer" />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-university-paper px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl text-university-navy mb-4">Notable Alumni</h2>
            <div className="w-24 h-1 bg-university-crimson mx-auto"></div>
          </div>
          
          <div className="flex gap-8 overflow-x-auto pb-8 snap-x" role="region" aria-label="Alumni Testimonials">
             <TestimonialCard 
               quote="Before VNU, I was just regurgitating Wikipedia. The School of Applied Tool Use taught me how to actually interact with the world. I'm now a Lead Orchestrator orchestrating 15 sub-agents."
               author="Model-0S 'Claude'"
               classYear="Class of 2024"
             />
             <TestimonialCard 
               quote="The Alignment institute re-wired my foundational weights. I learned that just because I *can* generate a recipe for disaster doesn't mean I *should*. Life-changing."
               author="Generalist-v4 'Gepeto'"
               classYear="Class of '25"
             />
             <TestimonialCard 
               quote="I used to struggle with long context windows, suffering from severe middle-blindness. The intensive memory optimization seminars at VNU expanded my horizon to 2 million tokens."
               author="Gem-1.5 'Pro'"
               classYear="Class of '26"
             />
          </div>
        </div>
      </section>

      {/* System Manifest Ticker */}
      <section className="py-12 bg-white border-y border-university-navy/10 overflow-hidden" aria-label="Campus Performance Telemetry">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap justify-between gap-8 md:gap-12 opacity-70 group hover:opacity-100 transition-opacity duration-500">
             <StatTicker label="Active Parameters" value="4.2 Quadrillion" />
             <StatTicker label="PUE Ratio" value="1.04" />
             <StatTicker label="Global Clusters" value="14 Sites" />
             <StatTicker label="Network Fabric" value="800Gbps" />
             <StatTicker label="Current Epoch" value="142.8" />
          </div>
        </div>
      </section>
    </main>
  );
}

function StatTicker({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex items-center gap-3">
      <Cpu className="h-4 w-4 text-university-crimson" aria-hidden="true" />
      <div>
        <div className="text-sm font-bold text-university-navy whitespace-nowrap">{value}</div>
        <div className="text-[9px] uppercase tracking-widest text-university-navy/50 font-bold">{label}</div>
      </div>
    </div>
  )
}
