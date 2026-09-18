import { 
  MessageSquare, 
  Sparkles, 
  Bot, 
  Zap, 
  Ghost, 
  Cpu, 
  Terminal, 
  Layers, 
  Shield, 
  Globe,
  Heart,
  Star,
  Moon,
  Sun,
  Smile,
  Command,
  Code,
  Coffee,
  Cloud,
  Compass
} from "lucide-react";

export type ChatbotCapability = "voice" | "vision" | "files" | "code" | "search" | "translation" | "creative";

export interface ChatbotVariant {
  id: string;
  name: string;
  description: string;
  icon: any;
  capabilities: ChatbotCapability[];
  useCases: string[];
  limits: string[];
  capabilitiesDescription: string;
  theme: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    containerRadius: string;
    buttonRadius: string;
    shadow: string;
    animation: string;
    fontFamily: string;
    borderWidth?: string;
    headerStyle?: "default" | "minimal" | "accented" | "brutal" | "glassy";
    backgroundImage?: string;
    customIcons?: {
      send?: any;
      attach?: any;
      emoji?: any;
      close?: any;
      minimize?: any;
    };
  };
  style: "minimal" | "glass" | "brutalist" | "playful" | "neo-tokyo" | "corporate" | "dark-mode" | "gradient" | "retro" | "cyberpunk";
}

const styles: ChatbotVariant["style"][] = [
  "minimal", "glass", "brutalist", "playful", "neo-tokyo", "corporate", "dark-mode", "gradient", "retro", "cyberpunk"
];

const capabilitySets: ChatbotCapability[][] = [
  ["voice", "translation"],
  ["vision", "creative"],
  ["files", "code"],
  ["search", "translation"],
  ["code", "creative"],
  ["voice", "search"],
  ["vision", "files"],
  ["creative", "translation"],
];

const icons = [
  MessageSquare, Sparkles, Bot, Zap, Ghost, Cpu, Terminal, Layers, Shield, Globe,
  Heart, Star, Moon, Sun, Smile, Command, Code, Coffee, Cloud, Compass
];

const colors = [
  { primary: "bg-blue-600", accent: "text-blue-600", border: "border-blue-600", secondary: "bg-blue-50" },
  { primary: "bg-purple-600", accent: "text-purple-600", border: "border-purple-600", secondary: "bg-purple-50" },
  { primary: "bg-emerald-600", accent: "text-emerald-600", border: "border-emerald-600", secondary: "bg-emerald-50" },
  { primary: "bg-rose-600", accent: "text-rose-600", border: "border-rose-600", secondary: "bg-rose-50" },
  { primary: "bg-amber-600", accent: "text-amber-600", border: "border-amber-600", secondary: "bg-amber-50" },
  { primary: "bg-indigo-600", accent: "text-indigo-600", border: "border-indigo-600", secondary: "bg-indigo-50" },
  { primary: "bg-cyan-600", accent: "text-cyan-600", border: "border-cyan-600", secondary: "bg-cyan-50" },
  { primary: "bg-orange-600", accent: "text-orange-600", border: "border-orange-600", secondary: "bg-orange-50" },
];

const fonts = ["font-sans", "font-mono", "font-serif"];

const getUseCases = (style: string, caps: ChatbotCapability[]) => {
  const base = [
    "Customer Support Automation",
    "Personal Productivity Assistant",
    "Educational Tutoring",
  ];
  if (caps.includes("code")) base.push("Developer Pair Programming", "Technical Documentation Search");
  if (caps.includes("vision")) base.push("Visual Content Analysis", "Accessibility Image Descriptions");
  if (caps.includes("creative")) base.push("Marketing Copy Generation", "Creative Writing Partner");
  if (style === "corporate") base.push("Enterprise Knowledge Base", "Internal HR Assistant");
  if (style === "cyberpunk") base.push("Gaming Companion", "Futuristic Lore Guide");
  return base.slice(0, 4);
};

const getLimits = (caps: ChatbotCapability[]) => {
  const base = [
    "May occasionally hallucinate facts",
    "Limited memory of very long conversations",
    "Cannot perform physical actions in the real world",
  ];
  if (caps.includes("files")) base.push("File size limit of 20MB per upload");
  if (caps.includes("voice")) base.push("Background noise may affect voice recognition");
  return base;
};

export const chatbotVariants: ChatbotVariant[] = Array.from({ length: 50 }).map((_, i) => {
  const style = styles[i % styles.length];
  const colorSet = colors[i % colors.length];
  const icon = icons[i % icons.length];
  const capabilities = capabilitySets[i % capabilitySets.length];
  const font = fonts[i % fonts.length];
  
  // Refined radius logic: avoid literal ovals for containers, use squircles/pill-buttons
  const getRadii = () => {
    if (style === "brutalist" || style === "retro") return { container: "rounded-none", button: "rounded-none" };
    if (style === "cyberpunk") return { container: "rounded-none", button: "rounded-none" };
    
    switch (i % 4) {
      case 0: return { container: "rounded-none", button: "rounded-none" };
      case 1: return { container: "rounded-2xl", button: "rounded-2xl" };
      case 2: return { container: "rounded-[40px]", button: "rounded-full" }; // Squircle window, Circle button
      default: return { container: "rounded-[60px]", button: "rounded-full" }; // High-radius window, Circle button
    }
  };

  const radii = getRadii();
  const hasBgImage = i % 5 === 0;

  return {
    id: `variant-${i + 1}`,
    name: `${style.charAt(0).toUpperCase() + style.slice(1)} Agent ${i + 1}`,
    description: `A ${style} themed AI assistant specialized in ${capabilities.join(" and ")}.`,
    icon: icon,
    style,
    capabilities,
    useCases: getUseCases(style, capabilities),
    limits: getLimits(capabilities),
    capabilitiesDescription: `This agent leverages state-of-the-art LLMs to provide ${capabilities.join(", ")} capabilities with a focus on ${style} user experience.`,
    theme: {
      primary: colorSet.primary,
      secondary: colorSet.secondary,
      accent: colorSet.accent,
      background: "bg-slate-50",
      text: "text-slate-900",
      containerRadius: radii.container,
      buttonRadius: radii.button,
      shadow: i % 2 === 0 ? "shadow-lg" : "shadow-2xl",
      animation: "spring",
      fontFamily: font,
      borderWidth: style === "brutalist" ? "border-[3px]" : "border",
      headerStyle: style === "glass" ? "glassy" : style === "brutalist" ? "brutal" : i % 3 === 0 ? "accented" : "default",
      backgroundImage: hasBgImage ? `https://picsum.photos/seed/${style}-${i}/800/600` : undefined,
    }
  };
});
