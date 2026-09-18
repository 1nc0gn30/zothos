import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Terms() {
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
          <h1 className="text-4xl font-display font-bold text-brand-900 mb-8">Terms of Service</h1>
          <div className="prose prose-slate max-w-none space-y-6 text-brand-500">
            <p>Last Updated: April 4, 2026</p>
            
            <section>
              <h2 className="text-2xl font-display font-bold text-brand-900 mt-8 mb-4">1. Acceptance of Terms</h2>
              <p>By accessing or using the Aura service, hosted by Tech Pro at auraai.757tech.pro, you agree to be bound by these Terms of Service.</p>
            </section>

            <section>
              <h2 className="text-2xl font-display font-bold text-brand-900 mt-8 mb-4">2. Description of Service</h2>
              <p>Aura is an AI-driven front desk service. We provide automated call handling, appointment scheduling, and visitor greeting services. We guarantee a minimum of 25% savings compared to your documented human receptionist costs.</p>
            </section>

            <section>
              <h2 className="text-2xl font-display font-bold text-brand-900 mt-8 mb-4">3. User Responsibilities</h2>
              <p>You are responsible for providing accurate business information and ensuring that your use of Aura complies with all applicable local laws and regulations regarding automated communications.</p>
            </section>

            <section>
              <h2 className="text-2xl font-display font-bold text-brand-900 mt-8 mb-4">4. Limitation of Liability</h2>
              <p>Tech Pro and its affiliates shall not be liable for any indirect, incidental, or consequential damages resulting from the use or inability to use the Aura service.</p>
            </section>

            <section>
              <h2 className="text-2xl font-display font-bold text-brand-900 mt-8 mb-4">5. Governing Law</h2>
              <p>These terms are governed by the laws of the jurisdiction in which Tech Pro operates.</p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
