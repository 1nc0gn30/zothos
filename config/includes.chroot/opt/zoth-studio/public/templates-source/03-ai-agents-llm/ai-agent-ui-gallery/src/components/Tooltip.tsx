import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface TooltipProps {
  children: React.ReactNode;
  content: string;
  position?: "top" | "bottom" | "left" | "right";
}

export const Tooltip = ({ children, content, position = "top" }: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);

  const getPositionClasses = () => {
    switch (position) {
      case "top": return "bottom-full left-1/2 -translate-x-1/2 mb-2";
      case "bottom": return "top-full left-1/2 -translate-x-1/2 mt-2";
      case "left": return "right-full top-1/2 -translate-y-1/2 mr-2";
      case "right": return "left-full top-1/2 -translate-y-1/2 ml-2";
      default: return "bottom-full left-1/2 -translate-x-1/2 mb-2";
    }
  };

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 5 }}
            className={`absolute z-[110] whitespace-nowrap px-3 py-1.5 bg-slate-800 text-white text-[10px] font-bold uppercase tracking-widest rounded-lg border border-white/10 shadow-xl pointer-events-none ${getPositionClasses()}`}
          >
            {content}
            <div className={`absolute w-2 h-2 bg-slate-800 border-r border-b border-white/10 rotate-45 ${
              position === "top" ? "top-full left-1/2 -translate-x-1/2 -translate-y-1/2" :
              position === "bottom" ? "bottom-full left-1/2 -translate-x-1/2 translate-y-1/2" :
              position === "left" ? "left-full top-1/2 -translate-y-1/2 -translate-x-1/2" :
              "right-full top-1/2 -translate-y-1/2 translate-x-1/2"
            }`} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
