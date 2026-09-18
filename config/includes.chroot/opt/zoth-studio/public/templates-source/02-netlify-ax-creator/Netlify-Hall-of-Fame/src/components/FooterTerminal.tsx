import { useEffect, useState } from 'react';

export default function FooterTerminal() {
  const [text, setText] = useState("");
  const fullText = "root@parrot-os:~/100-days-challenge# ship --tribute";
  
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < fullText.length) {
        setText(fullText.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-black border border-hacker/20 rounded p-3 font-mono text-[10px] md:text-xs text-hacker shadow-[0_0_15px_rgba(0,255,65,0.1)] inline-block">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-hacker animate-pulse" />
        <span>{text}</span>
        <span className="w-1.5 h-3 bg-hacker animate-[blink_1s_infinite] ml-1" />
      </div>
      <style>{`
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
      `}</style>
    </div>
  );
}
