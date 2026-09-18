import React from "react";
import { motion } from "motion/react";
import { FileText, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export const TermsPage = () => {
  return (
    <div className="min-h-screen bg-[#050505] text-slate-300 font-sans p-6 md:p-12">
      <div className="max-w-3xl mx-auto space-y-12">
        <Link to="/" className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-400 transition-colors font-bold uppercase tracking-widest text-xs">
          <ArrowLeft size={16} />
          Back to Gallery
        </Link>

        <div className="space-y-4">
          <div className="w-16 h-16 bg-blue-600/10 border border-blue-500/20 rounded-2xl flex items-center justify-center text-blue-500">
            <FileText size={32} />
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-white uppercase italic">Terms of <span className="text-blue-500">Service</span></h1>
          <p className="text-slate-500 uppercase tracking-widest text-xs font-bold">Last Updated: April 9, 2026</p>
        </div>

        <div className="prose prose-invert max-w-none space-y-8">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">1. Use of Components</h2>
            <p className="leading-relaxed">
              The UI components provided in this gallery are free to use in your personal and commercial projects. You may modify them as needed.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">2. Restrictions</h2>
            <p className="leading-relaxed">
              You may not redistribute these components as a standalone library or sell them as your own work. The "Built by Tech Pro" attribution is appreciated but not required in your final products.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">3. No Warranty</h2>
            <p className="leading-relaxed">
              These components are provided "as is" without any warranty. We are not responsible for any issues arising from their use in your applications.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">4. Pro Access</h2>
            <p className="leading-relaxed">
              Waitlist signups for Pro Access do not guarantee early access or specific pricing. Pro features will be subject to additional terms upon launch.
            </p>
          </section>
        </div>

        <footer className="pt-12 pb-32 border-t border-white/5 text-slate-600 text-xs font-bold uppercase tracking-widest">
          © 2026 AgentUI Gallery • Built by Tech Pro
        </footer>
      </div>
    </div>
  );
};
