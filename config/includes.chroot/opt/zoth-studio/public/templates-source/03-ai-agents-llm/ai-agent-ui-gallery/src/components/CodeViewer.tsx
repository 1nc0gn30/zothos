import React, { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy, Check, Terminal, Code as CodeIcon } from "lucide-react";
import { ChatbotVariant } from "../data/chatbotVariants";
import { cn } from "../lib/utils";

interface CodeViewerProps {
  variant: ChatbotVariant;
}

export const CodeViewer: React.FC<CodeViewerProps> = ({ variant }) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"react" | "html">("react");

  const reactCode = `
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ${variant.icon.name}, Send, X, Minus } from 'lucide-react';

// Theme Configuration
const theme = {
  primary: "${variant.theme.primary}",
  containerRadius: "${variant.theme.containerRadius}",
  buttonRadius: "${variant.theme.buttonRadius}",
  borderWidth: "${variant.theme.borderWidth || 'border'}",
  headerStyle: "${variant.theme.headerStyle || 'default'}",
  style: "${variant.style}"
};

export const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="fixed bottom-8 right-8 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={\`w-[380px] h-[520px] bg-white shadow-2xl \${theme.containerRadius} overflow-hidden flex flex-col\`}
          >
            {/* Header */}
            <div className="p-5 bg-slate-50 flex justify-between items-center border-b">
              <div className="flex items-center gap-2">
                <div className={\`p-2 \${theme.primary} text-white rounded-lg\`}>
                  <${variant.icon.name} size={18} />
                </div>
                <span className="font-bold text-sm">${variant.name}</span>
              </div>
              <button onClick={() => setIsOpen(false)}><X size={18} /></button>
            </div>
            
            {/* Chat Body */}
            <div className="flex-1 p-4 overflow-y-auto">
              {/* Messages go here */}
            </div>
            
            {/* Input Area */}
            <div className="p-6 border-t">
              <div className={\`flex gap-2 bg-slate-50 p-2 \${theme.buttonRadius}\`}>
                <input className="flex-1 bg-transparent outline-none text-sm pl-2" placeholder="Type..." />
                <button className={\`p-2 \${theme.primary} text-white \${theme.buttonRadius}\`}>
                  <Send size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={\`w-16 h-16 \${theme.primary} text-white \${theme.buttonRadius} shadow-lg flex items-center justify-center\`}
      >
        <${variant.icon.name} size={28} />
      </button>
    </div>
  );
};
  `.trim();

  const htmlCode = `
<!-- AI Chatbot Component: ${variant.name} -->
<div class="chatbot-container" style="position: fixed; bottom: 32px; right: 32px; font-family: sans-serif;">
  <button id="chat-toggle" style="width: 64px; height: 64px; background: ${variant.theme.primary.replace('bg-', '')}; color: white; border: none; border-radius: ${variant.theme.buttonRadius === 'rounded-full' ? '50%' : '12px'}; cursor: pointer; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);">
    <!-- Icon SVG here -->
    💬
  </button>
  
  <div id="chat-window" style="display: none; width: 380px; height: 520px; background: white; border-radius: ${variant.theme.containerRadius === 'rounded-[60px]' ? '60px' : variant.theme.containerRadius === 'rounded-[40px]' ? '40px' : '24px'}; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); margin-bottom: 16px; flex-direction: column; overflow: hidden; border: ${variant.theme.borderWidth === 'border-[3px]' ? '3px solid black' : '1px solid #e2e8f0'};">
    <div style="padding: 20px; background: #f8fafc; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center;">
      <strong>${variant.name}</strong>
      <button id="chat-close" style="background: none; border: none; cursor: pointer;">✕</button>
    </div>
    <div id="chat-messages" style="flex: 1; padding: 20px; overflow-y: auto;"></div>
    <div style="padding: 24px; border-top: 1px solid #e2e8f0;">
      <div style="background: #f1f5f9; padding: 8px; border-radius: ${variant.theme.buttonRadius === 'rounded-full' ? '999px' : '12px'}; display: flex; align-items: center;">
        <input type="text" placeholder="Type..." style="flex: 1; background: transparent; border: none; outline: none; padding: 8px 12px;">
        <button style="background: ${variant.theme.primary.replace('bg-', '')}; color: white; border: none; padding: 8px 16px; border-radius: ${variant.theme.buttonRadius === 'rounded-full' ? '999px' : '8px'}; cursor: pointer;">Send</button>
      </div>
    </div>
  </div>
</div>

<script>
  const toggle = document.getElementById('chat-toggle');
  const window = document.getElementById('chat-window');
  toggle.onclick = () => window.style.display = window.style.display === 'none' ? 'flex' : 'none';
</script>
  `.trim();

  const handleCopy = () => {
    navigator.clipboard.writeText(activeTab === "react" ? reactCode : htmlCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
      <div className="flex items-center justify-between p-4 bg-slate-800/50 border-b border-slate-800">
        <div className="flex gap-4">
          <button 
            onClick={() => setActiveTab("react")}
            className={cn(
              "text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full transition-colors",
              activeTab === "react" ? "bg-blue-500 text-white" : "text-slate-400 hover:text-white"
            )}
          >
            React Snippet
          </button>
          <button 
            onClick={() => setActiveTab("html")}
            className={cn(
              "text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full transition-colors",
              activeTab === "html" ? "bg-orange-500 text-white" : "text-slate-400 hover:text-white"
            )}
          >
            HTML/CSS
          </button>
        </div>
        <button 
          onClick={handleCopy}
          className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors"
        >
          {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
          {copied ? "Copied!" : "Copy Code"}
        </button>
      </div>
      <div className="p-0 max-h-[400px] overflow-y-auto">
        <SyntaxHighlighter 
          language={activeTab === "react" ? "typescript" : "html"} 
          style={atomDark}
          customStyle={{ margin: 0, background: 'transparent', fontSize: '13px' }}
        >
          {activeTab === "react" ? reactCode : htmlCode}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};
