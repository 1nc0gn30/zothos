import { useEffect, useState, useRef } from 'react';
import { Terminal as TerminalIcon, ChevronRight } from 'lucide-react';

export default function Terminal() {
  const [lines, setLines] = useState<string[]>([
    "INITIALIZING CHALLENGE_REPORT...",
    "CONNECTING TO NETLIFY_EDGE_NETWORK...",
    "AUTH_SUCCESS: NEAL_FRAZIER_COMMUNICATIONS_NODE",
    "LOADING TRIBUTE_DATA.DATABASE...",
    "READY."
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  useEffect(() => {
    const autoMessages = [
      "ACCESSING DATA: The Architects...",
      "SCANNING SYSTEM: The Engines...",
      "RECOGNIZING: The Vanguard...",
      "STATUS: CHALLENGE_COMPLETE_ENGAGED",
      "UPTIME: 30_DAYS_OF_SHIPPING"
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < autoMessages.length) {
        setLines(prev => [...prev, autoMessages[i]]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-2xl bg-black/80 border border-hacker/30 rounded-lg overflow-hidden shadow-2xl shadow-hacker/10 font-mono text-sm mb-12 transform hover:scale-[1.01] transition-transform duration-300">
      <div className="bg-hacker/10 px-4 py-2 flex items-center gap-2 border-bottom border-hacker/20">
        <TerminalIcon size={14} className="text-hacker" />
        <span className="text-hacker uppercase tracking-widest text-[10px]">Tribute Command Line v1.0.0</span>
        <div className="flex gap-1.5 ml-auto">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
        </div>
      </div>
      <div 
        ref={scrollRef}
        className="p-4 h-48 overflow-y-auto scrollbar-hide flex flex-col gap-1"
      >
        {lines.map((line, idx) => (
          <div key={idx} className="flex items-start gap-2 animate-in fade-in slide-in-from-left-2 duration-300">
            <span className="text-netlify shrink-0 select-none">›</span>
            <span className="text-hacker/90 leading-relaxed">{line}</span>
          </div>
        ))}
        <div className="flex items-center gap-2 mt-1">
          <ChevronRight size={14} className="text-netlify animate-pulse" />
          <input 
            type="text"
            className="bg-transparent border-none outline-none text-white w-full pointer-events-none"
            placeholder="SYSTEM_AWAITING_INPUT..."
            readOnly
          />
        </div>
      </div>
    </div>
  );
}
