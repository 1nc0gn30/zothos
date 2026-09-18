import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Send, X, Minus, Paperclip, Smile, 
  Mic, Image as ImageIcon, FileText, Code as CodeIcon, Search, 
  Languages, Palette, Sparkles, Settings 
} from "lucide-react";
import { ChatbotVariant, ChatbotCapability } from "../data/chatbotVariants";
import { useAI, AIProvider } from "../hooks/useAI";
import { cn } from "../lib/utils";
import { sound } from "../lib/sound";

interface ChatbotPreviewProps {
  variant: ChatbotVariant;
}

const CapabilityIcon = ({ capability, size = 16 }: { capability: ChatbotCapability; size?: number }) => {
  switch (capability) {
    case "voice": return <Mic size={size} />;
    case "vision": return <ImageIcon size={size} />;
    case "files": return <FileText size={size} />;
    case "code": return <CodeIcon size={size} />;
    case "search": return <Search size={size} />;
    case "translation": return <Languages size={size} />;
    case "creative": return <Palette size={size} />;
    default: return <Sparkles size={size} />;
  }
};

export const ChatbotPreview: React.FC<ChatbotPreviewProps> = ({ variant }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  const [activeProvider, setActiveProvider] = useState<AIProvider>(
    () => (localStorage.getItem("ai_provider") as AIProvider) || "gemini"
  );
  
  const [geminiKey, setGeminiKey] = useState(() => localStorage.getItem("gemini_api_key") || "");
  const [openaiKey, setOpenaiKey] = useState(() => localStorage.getItem("openai_api_key") || "");
  const [ollamaUrl, setOllamaUrl] = useState(() => localStorage.getItem("ollama_url") || "http://localhost:11434/api/chat");
  const [ollamaModel, setOllamaModel] = useState(() => localStorage.getItem("ollama_model") || "llama3");

  const [input, setInput] = useState("");
  const { messages, sendMessage, isLoading } = useAI();
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, isMinimized]);

  const saveSettings = () => {
    sound.playClick();
    localStorage.setItem("ai_provider", activeProvider);
    localStorage.setItem("gemini_api_key", geminiKey);
    localStorage.setItem("openai_api_key", openaiKey);
    localStorage.setItem("ollama_url", ollamaUrl);
    localStorage.setItem("ollama_model", ollamaModel);
    setShowSettings(false);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    
    const config = {
      provider: activeProvider,
      apiKey: activeProvider === "gemini" ? geminiKey : openaiKey,
      baseUrl: activeProvider === "ollama" ? ollamaUrl : undefined,
      model: activeProvider === "ollama" ? ollamaModel : undefined,
      capability: variant.capabilities[0]
    };
    
    sendMessage(input, config);
    setInput("");
  };

  const handleCapabilityClick = (cap: ChatbotCapability) => {
    sound.playClick();
    let prompt = "";
    switch (cap) {
      case "voice": prompt = "Can you demonstrate your voice processing capabilities?"; break;
      case "vision": prompt = "How do you handle image analysis and vision tasks?"; break;
      case "files": prompt = "What kind of files can you process and analyze?"; break;
      case "code": prompt = "Can you help me write or debug some code?"; break;
      case "search": prompt = "How do you perform real-time web searches?"; break;
      case "translation": prompt = "What languages can you translate between?"; break;
      case "creative": prompt = "Can you help me with a creative writing task?"; break;
      default: prompt = `Tell me more about your ${cap} features.`;
    }
    
    const config = {
      provider: activeProvider,
      apiKey: activeProvider === "gemini" ? geminiKey : openaiKey,
      baseUrl: activeProvider === "ollama" ? ollamaUrl : undefined,
      model: activeProvider === "ollama" ? ollamaModel : undefined,
      capability: cap
    };
    
    sendMessage(prompt, config);
  };

  const handleActionClick = (action: string) => {
    sound.playClick();
    const config = {
      provider: activeProvider,
      apiKey: activeProvider === "gemini" ? geminiKey : openaiKey,
      baseUrl: activeProvider === "ollama" ? ollamaUrl : undefined,
      model: activeProvider === "ollama" ? ollamaModel : undefined
    };

    if (action === "Emoji") {
      setInput(prev => prev + "😊");
    } else if (action === "Attachment") {
      sendMessage("[System] Attachment selected. Please upload a file (simulation).", config);
    }
  };

  const toggleOpen = () => {
    sound.playSwoosh();
    setIsOpen(!isOpen);
    setIsMinimized(false);
  };

  const toggleMinimize = () => {
    sound.playToggle();
    setIsMinimized(!isMinimized);
  };

  const toggleSettings = () => {
    sound.playClick();
    setShowSettings(!showSettings);
  };

  const Icon = variant.icon;
  const SendIcon = variant.theme.customIcons?.send || Send;
  const AttachIcon = variant.theme.customIcons?.attach || Paperclip;
  const EmojiIcon = variant.theme.customIcons?.emoji || Smile;
  const CloseIcon = variant.theme.customIcons?.close || X;
  const MinimizeIcon = variant.theme.customIcons?.minimize || Minus;

  // Style-specific classes
  const getContainerClasses = () => {
    switch (variant.style) {
      case "glass":
        return "backdrop-blur-xl bg-white/70 border border-white/40 shadow-2xl";
      case "brutalist":
        return "bg-white border-[3px] border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]";
      case "neo-tokyo":
        return "bg-slate-950 border border-cyan-500/40 shadow-[0_0_30px_rgba(6,182,212,0.2)]";
      case "dark-mode":
        return "bg-slate-900 text-white border border-slate-800 shadow-2xl";
      case "gradient":
        return "bg-gradient-to-b from-white to-slate-50 border-none shadow-2xl";
      case "retro":
        return "bg-[#c0c0c0] border-t-2 border-l-2 border-white border-b-2 border-r-2 border-gray-800 shadow-md";
      case "cyberpunk":
        return "bg-black border-2 border-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.4)]";
      case "playful":
        return "bg-white border-4 border-pink-200 shadow-xl";
      default:
        return "bg-white border border-slate-200 shadow-2xl";
    }
  };

  const getButtonClasses = () => {
    switch (variant.style) {
      case "brutalist":
        return cn(variant.theme.primary, "border-[3px] border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all");
      case "neo-tokyo":
        return "bg-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.6)] hover:shadow-[0_0_35px_rgba(6,182,212,0.9)] transition-all";
      case "retro":
        return "bg-[#c0c0c0] border-t-2 border-l-2 border-white border-b-2 border-r-2 border-gray-800 text-black active:border-t-gray-800 active:border-l-gray-800 active:border-b-white active:border-r-white";
      case "cyberpunk":
        return "bg-yellow-400 text-black font-black uppercase italic tracking-tighter hover:bg-yellow-300 transition-colors";
      default:
        return cn(variant.theme.primary, "hover:scale-105 active:scale-95 transition-all shadow-xl");
    }
  };

  return (
    <div className={cn("fixed inset-0 z-[60] pointer-events-none", variant.theme.fontFamily)}>
      <AnimatePresence>
        {isOpen && (
          <motion.button
            type="button"
            aria-label="Close chat preview overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm pointer-events-auto cursor-pointer focus:outline-none"
          />
        )}
      </AnimatePresence>

      <div
        className={cn(
          "absolute pointer-events-none",
          isOpen
            ? "inset-0 flex flex-col items-center justify-center gap-4 p-4 md:p-6"
            : "bottom-4 right-4 md:bottom-8 md:right-8"
        )}
      >
        <AnimatePresence>
          {isOpen && (
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby={`dialog-title-${variant.id}`}
              initial={{ opacity: 0, y: 24, scale: 0.94 }}
              animate={{ 
                opacity: 1, 
                y: 0, 
                scale: 1,
                height: isMinimized ? "64px" : "min(600px, calc(100dvh - 180px))"
              }}
              exit={{ opacity: 0, y: 24, scale: 0.94 }}
              className={cn(
                "w-[calc(100vw-32px)] md:w-[400px] flex flex-col overflow-hidden transition-all duration-300 relative pointer-events-auto",
                variant.theme.containerRadius,
                variant.theme.borderWidth,
                getContainerClasses()
              )}
            >
            {/* Background Image Overlay */}
            {variant.theme.backgroundImage && (
              <div 
                className="absolute inset-0 z-0 opacity-10 pointer-events-none bg-cover bg-center"
                style={{ backgroundImage: `url(${variant.theme.backgroundImage})` }}
              />
            )}

            {/* Header */}
            <div className={cn(
              "p-5 flex items-center justify-between border-b transition-all relative z-10",
              variant.theme.headerStyle === "glassy" ? "bg-white/20 backdrop-blur-md border-white/20" :
              variant.theme.headerStyle === "brutal" ? "bg-white border-b-[3px] border-black" :
              variant.theme.headerStyle === "accented" ? cn(variant.theme.primary, "text-white border-none") :
              variant.style === "neo-tokyo" ? "bg-slate-900/80 border-cyan-500/20" : 
              variant.style === "retro" ? "bg-blue-900 text-white border-none m-1" :
              variant.style === "cyberpunk" ? "bg-yellow-400 text-black border-none" :
              "bg-white/50 border-slate-100"
            )}>
              <div className="flex items-center gap-3">
                <div className={cn(
                  "p-2 rounded-lg flex items-center justify-center",
                  variant.style === "retro" ? "bg-gray-300 text-black" : 
                  variant.style === "cyberpunk" ? "bg-black text-yellow-400" :
                  cn(variant.theme.primary, "text-white")
                )}>
                  <Icon size={20} />
                </div>
                <div>
                  <h3 id={`dialog-title-${variant.id}`} className={cn(
                    "font-bold text-sm leading-none mb-1",
                    variant.style === "dark-mode" || variant.style === "neo-tokyo" ? "text-white" : 
                    variant.style === "retro" ? "text-white" : "text-slate-900"
                  )}>
                    {variant.name}
                  </h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className={cn(
                      "text-[9px] uppercase tracking-widest font-bold",
                      variant.style === "dark-mode" || variant.style === "neo-tokyo" || variant.style === "retro" ? "text-white/60" : "text-slate-500"
                    )}>
                      {variant.capabilities.join(" • ")}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={toggleSettings}
                  className={cn(
                    "p-1.5 rounded-md transition-colors focus:ring-2 focus:ring-blue-500",
                    showSettings ? "bg-blue-500 text-white" : "hover:bg-black/5"
                  )}
                  aria-label="API Engine Settings"
                  title="API Settings"
                >
                  <Settings size={18} />
                </button>
                <button 
                  onClick={toggleMinimize}
                  aria-label={isMinimized ? "Expand Chat Window" : "Minimize Chat Window"}
                  className="p-1.5 hover:bg-black/5 rounded-md transition-colors focus:ring-2 focus:ring-blue-500"
                >
                  <MinimizeIcon size={18} />
                </button>
                <button 
                  onClick={() => {
                    sound.playClick();
                    setIsOpen(false);
                  }} 
                  aria-label="Close Chat Window"
                  className="p-1.5 hover:bg-red-500/10 hover:text-red-500 rounded-md transition-colors focus:ring-2 focus:ring-red-500"
                >
                  <CloseIcon size={18} />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                <AnimatePresence>
                  {showSettings && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="absolute top-[73px] inset-x-0 bg-white dark:bg-slate-900 border-b z-20 p-4 shadow-xl max-h-[80%] overflow-y-auto"
                    >
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-black uppercase tracking-widest text-slate-500">AI Engine Settings</h4>
                          <button onClick={() => setShowSettings(false)} className="text-slate-400 hover:text-slate-600" aria-label="Close settings"><X size={14} /></button>
                        </div>
                        
                        {/* Provider Selector */}
                        <div className="grid grid-cols-3 gap-2">
                          {(["gemini", "openai", "ollama"] as AIProvider[]).map((p) => (
                            <button
                              key={p}
                              onClick={() => {
                                sound.playClick();
                                setActiveProvider(p);
                              }}
                              className={cn(
                                "py-2 px-1 text-[10px] font-bold uppercase tracking-tighter rounded-lg border transition-all focus:ring-2 focus:ring-blue-500",
                                activeProvider === p 
                                  ? "bg-blue-600 border-blue-600 text-white" 
                                  : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                              )}
                            >
                              {p}
                            </button>
                          ))}
                        </div>

                        <div className="space-y-3 pt-2">
                          {activeProvider === "gemini" && (
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold text-slate-400 uppercase">Gemini API Key (Optional)</label>
                              <input 
                                type="password"
                                value={geminiKey}
                                onChange={(e) => setGeminiKey(e.target.value)}
                                placeholder="sk-... (Leave empty for Offline Showcase mode)"
                                className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-lg px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-blue-500"
                              />
                              <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-[9px] text-blue-500 hover:underline">Get Gemini Key</a>
                            </div>
                          )}

                          {activeProvider === "openai" && (
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold text-slate-400 uppercase">OpenAI API Key (Optional)</label>
                              <input 
                                type="password"
                                value={openaiKey}
                                onChange={(e) => setOpenaiKey(e.target.value)}
                                placeholder="sk-... (Leave empty for Offline Showcase mode)"
                                className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-lg px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-blue-500"
                              />
                              <a href="https://platform.openai.com/api-keys" target="_blank" rel="noreferrer" className="text-[9px] text-emerald-500 hover:underline">Get OpenAI Key</a>
                            </div>
                          )}

                          {activeProvider === "ollama" && (
                            <div className="space-y-3">
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase">Ollama Endpoint</label>
                                <input 
                                  type="text"
                                  value={ollamaUrl}
                                  onChange={(e) => setOllamaUrl(e.target.value)}
                                  placeholder="http://localhost:11434/api/chat"
                                  className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-lg px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-blue-500"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase">Local Model Name</label>
                                <input 
                                  type="text"
                                  value={ollamaModel}
                                  onChange={(e) => setOllamaModel(e.target.value)}
                                  placeholder="llama3, mistral, etc."
                                  className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-lg px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-blue-500"
                                />
                              </div>
                            </div>
                          )}
                        </div>

                        <button 
                          onClick={saveSettings}
                          className="w-full bg-slate-900 dark:bg-white dark:text-slate-900 text-white py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg focus:ring-2 focus:ring-blue-500"
                        >
                          Apply Engine Configuration
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Messages */}
                <div 
                  ref={scrollRef}
                  aria-live="polite"
                  className={cn(
                    "flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth relative z-10",
                    variant.style === "retro" ? "bg-white m-1 border-2 border-gray-600" : ""
                  )}
                >
                  {messages.length === 0 && (
                    <div className="text-center py-12 px-6">
                      <div className={cn(
                        "w-16 h-16 mx-auto mb-6 flex items-center justify-center",
                        variant.theme.buttonRadius,
                        variant.theme.primary, "text-white shadow-lg"
                      )}>
                        <Icon size={32} />
                      </div>
                      <h4 className={cn(
                        "font-bold text-lg mb-2",
                        variant.style === "dark-mode" || variant.style === "neo-tokyo" ? "text-white" : "text-slate-900"
                      )}>
                        Welcome to {variant.name}
                      </h4>
                      <p className={cn(
                        "text-sm mb-4",
                        variant.style === "dark-mode" || variant.style === "neo-tokyo" ? "text-slate-400" : "text-slate-500"
                      )}>
                        I'm specialized in {variant.capabilities.join(", ")}. How can I assist you?
                      </p>
                      
                      <div className="mt-6 grid grid-cols-2 gap-2">
                        {variant.capabilities.map(cap => (
                          <button 
                            key={cap}
                            onClick={() => handleCapabilityClick(cap)}
                            className={cn(
                              "p-2 text-[10px] uppercase font-bold tracking-tighter border rounded-lg transition-colors flex items-center justify-center gap-2 focus:ring-2 focus:ring-blue-500",
                              variant.style === "dark-mode" || variant.style === "neo-tokyo" 
                                ? "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700" 
                                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                            )}
                          >
                            <CapabilityIcon capability={cap} size={12} />
                            {cap}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {messages.map((msg, i) => (
                    <motion.div 
                      initial={{ opacity: 0, x: msg.role === "user" ? 20 : -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      key={i} 
                      className={cn(
                        "flex",
                        msg.role === "user" ? "justify-end" : "justify-start"
                      )}
                    >
                      <div className={cn(
                        "max-w-[85%] p-3.5 text-sm leading-relaxed whitespace-pre-wrap",
                        variant.theme.buttonRadius,
                        msg.role === "user" 
                          ? cn(
                              variant.style === "cyberpunk" ? "bg-yellow-400 text-black font-black" : 
                              variant.style === "brutalist" ? "bg-black text-white border-[3px] border-black" :
                              cn(variant.theme.primary, "text-white shadow-md")
                            ) 
                          : variant.style === "dark-mode" || variant.style === "neo-tokyo"
                            ? "bg-slate-800 text-white border border-slate-700"
                            : variant.style === "retro"
                              ? "bg-gray-100 border border-gray-300 text-slate-900"
                              : variant.style === "cyberpunk"
                                ? "bg-black text-yellow-400 border border-yellow-400/30"
                                : "bg-slate-100 text-slate-800"
                      )}>
                        {msg.content}
                      </div>
                    </motion.div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className={cn(
                        "p-3 px-4 bg-slate-100 rounded-full flex gap-1.5 items-center",
                        (variant.style === "dark-mode" || variant.style === "neo-tokyo") && "bg-slate-800 text-white"
                      )}>
                        <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" />
                        <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce [animation-delay:0.2s]" />
                        <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce [animation-delay:0.4s]" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Input Area */}
                <div className={cn(
                  "p-4 border-t relative z-10",
                  variant.style === "retro" ? "bg-[#c0c0c0] m-1" : "bg-white/30 backdrop-blur-sm"
                )}>
                  <div className="flex items-center gap-2 mb-3 overflow-x-auto pb-1 no-scrollbar">
                    {variant.capabilities.map(cap => (
                      <button 
                        key={cap}
                        title={cap}
                        aria-label={`Test capability: ${cap}`}
                        onClick={() => handleCapabilityClick(cap)}
                        className={cn(
                          "p-2 rounded-full transition-all hover:scale-110 focus:ring-2 focus:ring-blue-500",
                          variant.style === "dark-mode" || variant.style === "neo-tokyo" ? "bg-slate-800 text-slate-400 hover:text-white" : "bg-slate-100 text-slate-500 hover:text-slate-900"
                        )}
                      >
                        <CapabilityIcon capability={cap} size={14} />
                      </button>
                    ))}
                    <div className="h-4 w-[1px] bg-slate-200 mx-1 shrink-0" />
                    <button 
                      onClick={() => handleActionClick("Emoji")}
                      aria-label="Add emoji"
                      className="p-2 text-slate-400 hover:text-slate-600 transition-colors focus:ring-2 focus:ring-blue-500"
                    >
                      <EmojiIcon size={16} />
                    </button>
                    <button 
                      onClick={() => handleActionClick("Attachment")}
                      aria-label="Upload attachment"
                      className="p-2 text-slate-400 hover:text-slate-600 transition-colors focus:ring-2 focus:ring-blue-500"
                    >
                      <AttachIcon size={16} />
                    </button>
                  </div>

                  <div className={cn(
                    "flex items-center gap-2 p-1.5 pl-4",
                    variant.theme.buttonRadius,
                    variant.style === "dark-mode" || variant.style === "neo-tokyo" ? "bg-slate-800 border border-slate-700" : 
                    variant.style === "retro" ? "bg-white border-b-2 border-r-2 border-white border-t-2 border-l-2 border-gray-800" :
                    "bg-slate-100 border border-slate-200"
                  )}>
                    <input 
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSend()}
                      placeholder="Ask anything..."
                      aria-label="Message prompt"
                      className={cn(
                        "flex-1 bg-transparent border-none focus:ring-0 text-sm outline-none py-2",
                        variant.style === "dark-mode" || variant.style === "neo-tokyo" ? "text-white placeholder:text-slate-500" : "text-slate-900 placeholder:text-slate-400"
                      )}
                    />
                    <button 
                      onClick={handleSend}
                      disabled={isLoading || !input.trim()}
                      aria-label="Send Message"
                      className={cn(
                        "p-2.5 rounded-xl text-white disabled:opacity-30 transition-all active:scale-90 focus:ring-2 focus:ring-blue-500",
                        variant.style === "retro" ? "bg-blue-900" :
                        variant.style === "cyberpunk" ? "bg-black text-yellow-400" :
                        variant.theme.primary
                      )}
                    >
                      <SendIcon size={18} />
                    </button>
                  </div>
                </div>
              </>
            )}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleOpen}
          aria-label={isOpen ? "Close Chatbot Preview" : `Open Chatbot Preview (${variant.name})`}
          className={cn(
            "w-14 h-14 md:w-16 md:h-16 flex items-center justify-center text-white relative group pointer-events-auto focus:ring-4 focus:ring-blue-400",
            variant.theme.buttonRadius,
            getButtonClasses()
          )}
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
              >
                <X size={28} />
              </motion.div>
            ) : (
              <motion.div
                key="open"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                className="relative"
              >
                <Icon size={28} />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 border-2 border-white rounded-full" />
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Tooltip */}
          {!isOpen && (
            <div className="absolute right-full mr-4 px-3 py-1.5 bg-black text-white text-[10px] font-bold uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl">
              Chat with {variant.name}
            </div>
          )}
        </motion.button>
      </div>
    </div>
  );
};
