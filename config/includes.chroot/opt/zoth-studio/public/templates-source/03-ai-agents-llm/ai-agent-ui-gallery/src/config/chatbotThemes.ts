/**
 * Chatbot Theme Configuration
 * Use this file to define and customize your AI agent's visual identity.
 */

export const chatbotThemes = {
  glass: {
    container: "backdrop-blur-xl bg-white/70 border border-white/40 shadow-2xl",
    header: "bg-white/20 backdrop-blur-md border-white/20",
    input: "bg-white/30 backdrop-blur-sm",
    messageUser: "bg-blue-600 text-white shadow-md",
    messageBot: "bg-white/50 text-slate-800 border border-white/40"
  },
  brutalist: {
    container: "bg-white border-[3px] border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]",
    header: "bg-white border-b-[3px] border-black",
    input: "bg-white",
    messageUser: "bg-yellow-400 text-black border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
    messageBot: "bg-white text-black border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
  },
  neoTokyo: {
    container: "bg-slate-950 border border-cyan-500/40 shadow-[0_0_30px_rgba(6,182,212,0.2)]",
    header: "bg-slate-900/80 border-cyan-500/20",
    input: "bg-slate-900/50",
    messageUser: "bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.5)]",
    messageBot: "bg-slate-800 text-cyan-400 border border-cyan-500/20"
  },
  cyberpunk: {
    container: "bg-black border-2 border-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.4)]",
    header: "bg-yellow-400 text-black border-none",
    input: "bg-black",
    messageUser: "bg-yellow-400 text-black font-black",
    messageBot: "bg-black text-yellow-400 border border-yellow-400/30"
  }
};

export const defaultIcons = {
  send: "Send",
  attach: "Paperclip",
  emoji: "Smile",
  close: "X",
  minimize: "Minus"
};

/**
 * Example of a custom variant config
 */
export const customAgentConfig = {
  name: "Custom Assistant",
  style: "glass",
  theme: {
    primary: "bg-indigo-600",
    secondary: "bg-indigo-50",
    accent: "text-indigo-600",
    containerRadius: "rounded-[32px]",
    buttonRadius: "rounded-2xl",
    fontFamily: "font-sans",
    backgroundImage: "https://picsum.photos/seed/custom/800/600"
  }
};
