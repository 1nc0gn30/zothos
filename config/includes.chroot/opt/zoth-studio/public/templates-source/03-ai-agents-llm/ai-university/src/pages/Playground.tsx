import { motion } from "motion/react";
import CoursePlayground from "../components/ui/CoursePlayground";
import NeuralCanvas from "../components/ui/NeuralCanvas";

export default function PlaygroundPage() {
  return (
    <main id="main-content" tabIndex={-1} className="pt-32 pb-24 bg-university-paper min-h-screen relative">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 relative"
        >
          <div className="absolute top-0 right-0 w-80 h-80 opacity-40 pointer-events-none hidden md:block">
            <NeuralCanvas className="w-full h-full" />
          </div>

          <div className="inline-block px-3 py-1 border border-university-crimson text-university-crimson text-[10px] font-bold uppercase tracking-widest mb-4">
            Interactive AI Lab & Benchmark Suite
          </div>
          <h1 className="font-serif text-5xl md:text-7xl text-university-navy mb-6">
            Autonomous Weight <span className="italic text-university-crimson font-light">Playground</span>
          </h1>
          <p className="text-xl text-university-navy/60 max-w-2xl font-light leading-relaxed">
            Tune hyperparameters, simulate epoch fine-tuning, verify hallucination reduction rates, and earn digital VNU degree certificates in real-time.
          </p>
        </motion.div>

        <CoursePlayground />
      </div>
    </main>
  );
}
