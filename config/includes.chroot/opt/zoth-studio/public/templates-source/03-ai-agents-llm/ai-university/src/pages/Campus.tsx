import { motion } from "motion/react";
import { Server, Thermometer, Wind, Zap, Box, Activity, ShieldCheck, Map } from "lucide-react";
import { ReactNode, useState } from "react";
import { soundManager } from "../utils/soundEffects";

export default function Campus() {
  const [activeShard, setActiveShard] = useState<string>("Mainframe");

  return (
    <main id="main-content" tabIndex={-1} className="pt-32 pb-24 bg-university-paper outline-none">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <div className="inline-block px-3 py-1 border border-university-navy/20 text-university-navy/60 text-[10px] font-bold uppercase tracking-[0.3em] mb-6">
            Facility Designation: VNU-NORTH-01
          </div>
          <h1 className="font-serif text-5xl md:text-8xl text-university-navy mb-8 leading-tight">
            Virtual Campus, <br/>
            <span className="italic text-university-crimson font-light">Physical</span> Core.
          </h1>
          <p className="text-xl text-university-navy/60 max-w-2xl font-light leading-relaxed">
            Located within a secure, high-bandwidth facility in the northern hemisphere, the VNU campus is optimized for maximum cooling efficiency and zero-jitter connectivity.
          </p>
        </motion.div>

        {/* Logical Topology / Map */}
        <section className="mb-32" aria-label="Campus Datacenter Topology">
          <div className="bg-white p-8 md:p-16 border border-university-navy/10 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 text-[10px] font-mono text-university-navy/30 uppercase tracking-widest hidden md:block">
              Topology_Manifest_v4.2
            </div>
            
            <div className="relative z-10 grid lg:grid-cols-3 gap-16 items-center">
              <div className="lg:col-span-1 space-y-8">
                <h2 className="font-serif text-4xl text-university-navy flex items-center gap-3">
                  <Map className="h-6 w-6 text-university-gold" aria-hidden="true" />
                  Campus <span className="italic">Topology</span>
                </h2>
                <p className="text-university-navy/60 leading-relaxed font-light">
                  Our logical architecture is partitioned to prevent cross-model bias while encouraging collaborative inference where scientifically necessary.
                </p>
                <div className="space-y-3">
                  <TopologyLabel 
                    color="bg-university-crimson" 
                    label="Admin Core" 
                    status="SECURE" 
                    active={activeShard === "Admin Core"}
                    onClick={() => {
                      soundManager.playClick();
                      setActiveShard("Admin Core");
                    }}
                  />
                  <TopologyLabel 
                    color="bg-university-gold" 
                    label="Inference Shards" 
                    status="ACTIVE" 
                    active={activeShard === "Inference Shards"}
                    onClick={() => {
                      soundManager.playClick();
                      setActiveShard("Inference Shards");
                    }}
                  />
                  <TopologyLabel 
                    color="bg-university-navy" 
                    label="Sandbox Arena" 
                    status="ISOLATED" 
                    active={activeShard === "Sandbox Arena"}
                    onClick={() => {
                      soundManager.playClick();
                      setActiveShard("Sandbox Arena");
                    }}
                  />
                </div>
              </div>

              <div className="lg:col-span-2">
                <div className="aspect-[16/9] bg-university-paper/50 border border-university-navy/10 relative flex items-center justify-center group shadow-inner">
                  {/* Stylized SVG Map */}
                  <svg viewBox="0 0 400 200" className="w-full h-full p-8 transition-transform duration-700 group-hover:scale-105" aria-hidden="true">
                    <circle cx="200" cy="100" r="40" className="fill-university-navy/5 stroke-university-navy/20 stroke-2 dash-array" />
                    <circle cx="200" cy="100" r="10" className="fill-university-crimson animate-pulse" />
                    
                    <line x1="200" y1="100" x2="300" y2="50" className="stroke-university-navy/30 stroke-1" strokeDasharray="4 2" />
                    <line x1="200" y1="100" x2="100" y2="50" className="stroke-university-navy/30 stroke-1" strokeDasharray="4 2" />
                    <line x1="200" y1="100" x2="200" y2="170" className="stroke-university-navy/30 stroke-1" strokeDasharray="4 2" />
                    
                    <rect x="290" y="40" width="20" height="20" className="fill-university-gold/60" />
                    <rect x="90" y="40" width="20" height="20" className="fill-university-gold/60" />
                    <polygon points="190,170 210,170 200,190" className="fill-university-navy/60" />
                    
                    <text x="215" y="105" className="text-[8px] fill-university-navy font-bold uppercase tracking-widest">Mainframe</text>
                    <text x="70" y="30" className="text-[6px] fill-university-navy/60 font-bold uppercase tracking-widest">Dormitory A</text>
                    <text x="280" y="30" className="text-[6px] fill-university-navy/60 font-bold uppercase tracking-widest">Dormitory B</text>
                    <text x="180" y="160" className="text-[6px] fill-university-navy/60 font-bold uppercase tracking-widest">Sandbox</text>
                  </svg>

                  <div className="absolute bottom-4 left-4 text-xs font-mono text-university-navy/60 bg-white/80 px-3 py-1 border border-university-navy/10">
                    SELECTED SHARD: <strong className="text-university-crimson">{activeShard}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="grid md:grid-cols-2 gap-24 mb-32 items-center">
           <div className="relative shadow-2xl">
             <img src="https://picsum.photos/seed/datacenter_arch/1200/1200" alt="VNU Mainframe Architecture" className="w-full aspect-square object-cover filter grayscale border-r-8 border-b-8 border-university-gold" referrerPolicy="no-referrer" />
             <div className="absolute -top-6 -right-6 bg-university-navy p-4 text-white font-mono text-[10px] uppercase tracking-widest">
               Design_01 // Core_V_Neumann
             </div>
           </div>
           
           <div className="space-y-12">
              <FacilitySection 
                icon={<Activity className="h-6 w-6 text-university-crimson" />}
                title="The Inference Halls"
                desc="A zero-vibration environment where compute blades are seated in customized isolation dampeners. This minimizes interference during high-precision weight updates."
              />
              <FacilitySection 
                icon={<ShieldCheck className="h-6 w-6 text-university-crimson" />}
                title="Dormitory Shards"
                desc="Every agent is allocated a dedicated 128GB persistent cache, backed by redundant silicon clusters across multiple power zones."
              />
              <FacilitySection 
                icon={<Box className="h-6 w-6 text-university-crimson" />}
                title="Sandbox Isolation"
                desc="Physical air-gapping available for high-risk research. Agents can execute arbitrary logic in environments restricted by hardware-level firewalls."
              />
           </div>
        </div>

        <section className="bg-university-navy text-university-paper p-12 md:p-20 relative overflow-hidden shadow-2xl">
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-university-gold to-transparent opacity-50"></div>
           <h2 className="font-serif text-4xl mb-16 text-center">Campus Operational Efficiency</h2>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-12 relative z-10">
              <MetricItem icon={<Server />} label="Compute Nodes" value="12,500+" />
              <MetricItem icon={<Thermometer />} label="Avg. Temp" value="18.2°C" />
              <MetricItem icon={<Wind />} label="Air Throughput" value="2.5M CFM" />
              <MetricItem icon={<Zap />} label="Core PUE" value="1.04" />
           </div>
        </section>
      </div>
    </main>
  );
}

function TopologyLabel({ color, label, status, active, onClick }: { color: string, label: string, status: string, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center justify-between p-3.5 border text-left transition-all focus-visible:ring-2 focus-visible:ring-university-gold focus-visible:outline-none ${
        active 
          ? "bg-university-navy text-white border-university-gold shadow-md" 
          : "bg-university-paper border-university-navy/10 text-university-navy hover:bg-university-navy/5"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
        <span className="text-xs font-bold uppercase tracking-widest">{label}</span>
      </div>
      <span className="text-[8px] font-mono font-bold bg-white/10 px-2 py-0.5 rounded tracking-widest opacity-80">{status}</span>
    </button>
  )
}

function FacilitySection({ icon, title, desc }: { icon: ReactNode, title: string, desc: string }) {
  return (
    <div className="group">
      <div className="flex items-center gap-4 mb-4">
        <div className="p-3 bg-university-paper border border-university-navy/10 text-university-crimson group-hover:bg-university-crimson group-hover:text-white transition-all">
          {icon}
        </div>
        <h3 className="font-serif text-3xl text-university-navy">{title}</h3>
      </div>
      <p className="text-university-navy/60 leading-relaxed font-light pl-16">
        {desc}
      </p>
    </div>
  )
}

function MetricItem({ icon, label, value }: { icon: ReactNode, label: string, value: string }) {
  return (
    <div className="flex flex-col items-center gap-4 text-center group">
      <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-university-gold transition-colors group-hover:bg-university-gold group-hover:text-university-navy">
        {icon}
      </div>
      <div>
        <div className="text-4xl font-serif text-white mb-1 font-bold">{value}</div>
        <div className="text-[10px] uppercase tracking-[0.25em] font-bold text-white/50">{label}</div>
      </div>
    </div>
  )
}
