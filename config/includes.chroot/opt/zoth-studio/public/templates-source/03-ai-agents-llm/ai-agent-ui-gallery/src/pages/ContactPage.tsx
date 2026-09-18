import React from "react";
import { motion } from "motion/react";
import { Mail, ArrowLeft, Send } from "lucide-react";
import { Link } from "react-router-dom";

export const ContactPage = () => {
  return (
    <div className="min-h-screen bg-[#050505] text-slate-300 font-sans p-6 md:p-12">
      <div className="max-w-3xl mx-auto space-y-12">
        <Link to="/" className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-400 transition-colors font-bold uppercase tracking-widest text-xs">
          <ArrowLeft size={16} />
          Back to Gallery
        </Link>

        <div className="space-y-4">
          <div className="w-16 h-16 bg-blue-600/10 border border-blue-500/20 rounded-2xl flex items-center justify-center text-blue-500">
            <Mail size={32} />
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-white uppercase italic">Get in <span className="text-blue-500">Touch</span></h1>
          <p className="text-slate-500 uppercase tracking-widest text-xs font-bold">We'd love to hear from you</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 md:p-12">
          <form name="contact" method="POST" data-netlify="true" className="space-y-6">
            <input type="hidden" name="form-name" value="contact" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Name</label>
                <input 
                  type="text" 
                  name="name"
                  required
                  className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Email</label>
                <input 
                  type="email" 
                  name="email"
                  required
                  className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Message</label>
              <textarea 
                name="message"
                required
                rows={5}
                className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none"
                placeholder="How can we help?"
              />
            </div>

            <button 
              type="submit"
              className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black uppercase tracking-widest text-sm transition-all flex items-center justify-center gap-3 shadow-lg shadow-blue-600/20"
            >
              <Send size={18} />
              Send Message
            </button>
          </form>
        </div>

        <footer className="pt-12 pb-32 border-t border-white/5 text-slate-600 text-xs font-bold uppercase tracking-widest">
          © 2026 AgentUI Gallery • Built by Tech Pro
        </footer>
      </div>
    </div>
  );
};
