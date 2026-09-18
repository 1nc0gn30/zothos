import React from "react";
import { motion } from "motion/react";
import { Shield, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-[#050505] text-slate-300 font-sans p-6 md:p-12">
      <div className="max-w-3xl mx-auto space-y-12">
        <Link to="/" className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-400 transition-colors font-bold uppercase tracking-widest text-xs">
          <ArrowLeft size={16} />
          Back to Gallery
        </Link>

        <div className="space-y-4">
          <div className="w-16 h-16 bg-blue-600/10 border border-blue-500/20 rounded-2xl flex items-center justify-center text-blue-500">
            <Shield size={32} />
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-white uppercase italic">Privacy <span className="text-blue-500">Policy</span></h1>
          <p className="text-slate-500 uppercase tracking-widest text-xs font-bold">Last Updated: April 9, 2026</p>
        </div>

        <div className="prose prose-invert max-w-none space-y-8">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">1. Data Collection</h2>
            <p className="leading-relaxed">
              AgentUI Gallery does not collect personal data from visitors browsing the gallery. We do not use tracking cookies or third-party analytics that identify you personally.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">2. Waitlist Information</h2>
            <p className="leading-relaxed">
              If you choose to join our waitlist, we collect your email address and name. This information is used solely to notify you about Pro Access and related updates. We use Netlify Forms to process this data securely.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">3. Third-Party Services</h2>
            <p className="leading-relaxed">
              Our site is hosted on Netlify. They may collect standard server logs. We do not share your waitlist information with any other third parties.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">4. Contact Us</h2>
            <p className="leading-relaxed">
              For any privacy-related questions, please reach out via our contact page.
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
