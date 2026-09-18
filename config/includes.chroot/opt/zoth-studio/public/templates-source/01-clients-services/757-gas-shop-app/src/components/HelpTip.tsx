import React from 'react';
import { CircleHelp } from 'lucide-react';

export default function HelpTip({ text }: { text: string }) {
  return (
    <div className="group relative inline-flex items-center justify-center cursor-help">
      <CircleHelp size={16} className="text-muted-foreground hover:text-primary transition-colors" />
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-48 p-2 bg-zinc-900 text-white text-xs rounded-lg shadow-xl z-50 text-center">
        {text}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-zinc-900" />
      </div>
    </div>
  );
}
