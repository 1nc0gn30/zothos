import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-accent-soft py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-brand-500 hover:text-brand-900 mb-12 transition-colors">
          <ArrowLeft size={20} />
          Back to Home
        </Link>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 md:p-12 rounded-[2.5rem]"
        >
          <h1 className="text-4xl font-display font-bold text-brand-900 mb-8">Privacy Policy</h1>
          <div className="prose prose-slate max-w-none space-y-6 text-brand-500">
            <p>Last Updated: April 4, 2026</p>
            
            <section>
              <h2 className="text-2xl font-display font-bold text-brand-900 mt-8 mb-4">1. Information We Collect</h2>
              <p>We collect information you provide directly to us through our contact forms, including your name, business email, company name, and current operational costs. This data is used solely to provide you with a customized quote and demo of the Aura service.</p>
            </section>

            <section>
              <h2 className="text-2xl font-display font-bold text-brand-900 mt-8 mb-4">2. How We Use Your Information</h2>
              <p>Your information is used to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Respond to your requests for service.</li>
                <li>Provide customer support and technical assistance.</li>
                <li>Analyze and improve our AI models and service performance.</li>
                <li>Send you marketing communications (which you can opt-out of at any time).</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-display font-bold text-brand-900 mt-8 mb-4">3. Data Security</h2>
              <p>Aura, hosted by Tech Pro, employs industry-standard security measures to protect your data. However, no method of transmission over the internet is 100% secure.</p>
            </section>

            <section>
              <h2 className="text-2xl font-display font-bold text-brand-900 mt-8 mb-4">4. Contact Us</h2>
              <p>If you have any questions about this Privacy Policy, please contact us at support@757tech.pro.</p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
