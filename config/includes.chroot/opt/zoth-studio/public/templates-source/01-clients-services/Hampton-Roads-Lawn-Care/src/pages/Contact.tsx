import { motion } from 'motion/react';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';

export default function Contact() {
  useSEO("Contact Us - Get a Free Quote", "Contact HappyLawns today for a free, no-obligation quote on lawn mowing, landscaping, and yard maintenance in Hampton Roads.");

  return (
    <div className="pt-10 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-6xl font-extrabold text-emerald-950 mb-6"
        >
          Get a <span className="text-emerald-500">Free Quote</span>
        </motion.h1>
        <p className="text-xl text-emerald-700 font-medium max-w-3xl mx-auto">
          Ready to transform your yard? Fill out the form below or give us a call. We usually respond within 24 hours!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-8 md:p-10 rounded-[3rem] border-4 border-emerald-100 shadow-xl"
        >
          <h2 className="text-3xl font-extrabold text-emerald-950 mb-8">Send Us a Message</h2>
          <form 
            name="contact" 
            method="POST" 
            data-netlify="true" 
            netlify-honeypot="bot-field"
            className="space-y-6"
          >
            <input type="hidden" name="form-name" value="contact" />
            <p className="hidden">
              <label>Don't fill this out if you're human: <input name="bot-field" /></label>
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-emerald-900 font-bold mb-2" htmlFor="firstName">First Name</label>
                <input 
                  type="text" 
                  id="firstName" 
                  name="firstName"
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-emerald-100 focus:border-emerald-500 focus:ring-0 outline-none transition-colors bg-emerald-50/50"
                  placeholder="John"
                />
              </div>
              <div>
                <label className="block text-emerald-900 font-bold mb-2" htmlFor="lastName">Last Name</label>
                <input 
                  type="text" 
                  id="lastName" 
                  name="lastName"
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-emerald-100 focus:border-emerald-500 focus:ring-0 outline-none transition-colors bg-emerald-50/50"
                  placeholder="Doe"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-emerald-900 font-bold mb-2" htmlFor="email">Email Address</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email"
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-emerald-100 focus:border-emerald-500 focus:ring-0 outline-none transition-colors bg-emerald-50/50"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block text-emerald-900 font-bold mb-2" htmlFor="phone">Phone Number</label>
                <input 
                  type="tel" 
                  id="phone" 
                  name="phone"
                  className="w-full px-4 py-3 rounded-xl border-2 border-emerald-100 focus:border-emerald-500 focus:ring-0 outline-none transition-colors bg-emerald-50/50"
                  placeholder="(757) 555-0123"
                />
              </div>
            </div>

            <div>
              <label className="block text-emerald-900 font-bold mb-2" htmlFor="service">Service Needed</label>
              <select 
                id="service" 
                name="service"
                className="w-full px-4 py-3 rounded-xl border-2 border-emerald-100 focus:border-emerald-500 focus:ring-0 outline-none transition-colors bg-emerald-50/50"
              >
                <option>Lawn Mowing</option>
                <option>Landscaping</option>
                <option>Tree & Shrub Care</option>
                <option>Seasonal Cleanup</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label className="block text-emerald-900 font-bold mb-2" htmlFor="message">Message / Details</label>
              <textarea 
                id="message" 
                name="message"
                rows={4}
                required
                className="w-full px-4 py-3 rounded-xl border-2 border-emerald-100 focus:border-emerald-500 focus:ring-0 outline-none transition-colors bg-emerald-50/50 resize-none"
                placeholder="Tell us about your yard and what you need..."
              ></textarea>
            </div>

            <button 
              type="submit"
              className="w-full py-4 bg-yellow-400 text-yellow-900 font-extrabold rounded-xl shadow-[0_4px_0_rgb(202,138,4)] hover:shadow-[0_2px_0_rgb(202,138,4)] hover:translate-y-[2px] transition-all text-lg"
            >
              Send Message
            </button>
          </form>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-8"
        >
          <div className="bg-emerald-900 text-white p-8 rounded-[3rem] shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-800 rounded-full blur-2xl opacity-50"></div>
            <h3 className="text-2xl font-extrabold mb-6">Contact Information</h3>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="bg-emerald-800 p-3 rounded-xl mr-4">
                  <Mail className="w-6 h-6 text-emerald-300" />
                </div>
                <div>
                  <p className="text-emerald-400 font-bold text-sm uppercase tracking-wider mb-1">Online Quote</p>
                  <p className="text-lg font-bold italic">Fill out the form for a fast response!</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-emerald-800 p-3 rounded-xl mr-4">
                  <MapPin className="w-6 h-6 text-emerald-300" />
                </div>
                <div>
                  <p className="text-emerald-400 font-bold text-sm uppercase tracking-wider mb-1">Service Area</p>
                  <p className="text-lg font-bold">Hampton Roads, Virginia</p>
                  <p className="text-emerald-200 text-sm mt-1">VA Beach, Norfolk, Chesapeake, Hampton, Newport News, Suffolk</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-emerald-800 p-3 rounded-xl mr-4">
                  <Clock className="w-6 h-6 text-emerald-300" />
                </div>
                <div>
                  <p className="text-emerald-400 font-bold text-sm uppercase tracking-wider mb-1">Hours</p>
                  <p className="text-lg font-bold">Mon - Fri: 7am - 6pm</p>
                  <p className="text-lg font-bold">Sat: 8am - 2pm</p>
                  <p className="text-emerald-200 text-sm mt-1">Sun: Closed</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-emerald-100 p-8 rounded-[3rem] border-4 border-emerald-200 text-center">
            <h3 className="text-xl font-extrabold text-emerald-950 mb-2">Satisfaction-First Service</h3>
            <p className="text-emerald-800 font-medium">If anything needs attention after a visit, reach out and we will schedule a follow-up.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
