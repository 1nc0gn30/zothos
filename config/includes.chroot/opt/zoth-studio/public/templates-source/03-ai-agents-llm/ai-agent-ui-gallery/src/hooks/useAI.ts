import { GoogleGenAI } from "@google/genai";
import OpenAI from "openai";
import { useState } from "react";
import { sound } from "../lib/sound";

export type AIProvider = "gemini" | "openai" | "ollama";

export interface Message {
  role: "user" | "assistant" | "model";
  content: string;
}

interface AIServiceConfig {
  provider: AIProvider;
  apiKey?: string;
  baseUrl?: string;
  model?: string;
  capability?: string;
}

const getMockResponse = (prompt: string, capability?: string): string => {
  const lower = prompt.toLowerCase();
  
  if (lower.includes("voice") || capability === "voice") {
    return "🎙️ [Voice Engine Simulated]: Audio stream initialized at 48kHz. Transcribing speech input with low-latency neural acoustic modeling. Ready for bidirectional voice synthesis!";
  }
  if (lower.includes("vision") || lower.includes("image") || capability === "vision") {
    return "👁️ [Vision Engine Simulated]: Input image payload processed (1024x1024). Segmented 3 primary objects: 1. Glassmorphic UI element (confidence 99.2%), 2. Neural accent glow, 3. High-contrast typography layer.";
  }
  if (lower.includes("code") || lower.includes("debug") || capability === "code") {
    return `💻 [Code Engine Simulated]: Here is a clean production component architecture:

\`\`\`tsx
import React from "react";

export const AIAgentWidget = ({ name }: { name: string }) => {
  return (
    <div className="p-4 bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl text-white">
      <h3 className="font-bold text-sm">{name} Agent Active</h3>
      <p className="text-xs text-slate-400 mt-1">Ready for real-time inference...</p>
    </div>
  );
};
\`\`\``;
  }
  if (lower.includes("file") || capability === "files") {
    return "📄 [Document Processing Engine]: Document stream loaded. Extracted 4 key entities, generated semantic embeddings, and verified schema integrity.";
  }
  if (lower.includes("search") || capability === "search") {
    return "🔍 [Live Web Search Grounding]: Queried real-time indices. Sources verified: nealfrazier.tech, React 19 documentation, Tailwind CSS v4 release notes. Status: 100% grounded.";
  }
  if (lower.includes("translate") || capability === "translation") {
    return "🌐 [Translation Engine Simulated]: Input localized across 12 target languages (EN, ES, FR, DE, JA, ZH, AR, IT, PT, KO, RU, HI) preserving contextual intent and tone.";
  }
  if (lower.includes("creative") || capability === "creative") {
    return "🎨 [Creative Engine Simulated]: Concept generated: 'Futuristic Glassmorphic AI Interface System' — Features dynamic aura glows, reactive typography, and WCAG AA accessible contrast rings.";
  }

  return `⚡ [AgentUI Demo Engine]: Processed your request ("${prompt.slice(0, 50)}${prompt.length > 50 ? '...' : ''}"). 

*Tip: Connect your own Gemini or OpenAI API key in Settings for live model responses, or test offline showcase mode seamlessly.*`;
};

export function useAI() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (prompt: string, config: AIServiceConfig) => {
    if (!prompt.trim()) return;

    sound.playSend();
    const { provider, apiKey, baseUrl, model, capability } = config;
    
    const userMessage: Message = { role: "user", content: prompt };
    const newMessages: Message[] = [...messages, userMessage];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      let responseText = "";

      // Check if user provided an API key for live calls
      const hasKey = Boolean(apiKey && apiKey.trim().length > 5);

      if (hasKey && provider === "gemini") {
        const ai = new GoogleGenAI({ apiKey: apiKey! });
        const response = await ai.models.generateContent({
          model: model || "gemini-2.5-flash",
          contents: newMessages.map(m => ({
            role: m.role === "assistant" ? "model" : "user",
            parts: [{ text: m.content }]
          })),
        });
        responseText = response.text || "No response received.";
      } 
      else if (hasKey && provider === "openai") {
        const openai = new OpenAI({ 
          apiKey: apiKey!, 
          dangerouslyAllowBrowser: true,
          baseURL: baseUrl || undefined 
        });

        const chatMessages = newMessages.map(m => ({
          role: m.role === "model" ? "assistant" : m.role,
          content: m.content
        })) as any[];

        const completion = await openai.chat.completions.create({
          messages: chatMessages,
          model: model || "gpt-4o-mini",
        });

        responseText = completion.choices[0]?.message?.content || "No response received.";
      } 
      else if (provider === "ollama" && baseUrl) {
        const url = baseUrl || "http://localhost:11434/api/chat";
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: model || "llama3",
            messages: newMessages.map(m => ({
              role: m.role === "model" ? "assistant" : m.role,
              content: m.content
            })),
            stream: false
          })
        });

        if (!response.ok) throw new Error(`Ollama connection status: ${response.statusText}`);
        const data = await response.json();
        responseText = data.message?.content || data.response || "No response received.";
      }
      else {
        // Defensive Offline Fallback / Showcase Engine
        await new Promise(res => setTimeout(res, 600));
        responseText = getMockResponse(prompt, capability);
      }

      sound.playReceive();
      setMessages(prev => [...prev, { role: provider === "gemini" ? "model" : "assistant", content: responseText }]);
    } catch (error: any) {
      console.warn(`${provider} API Error, switching to showcase mock fallback:`, error);
      
      // Fallback mock engine on error so portfolio visitor is never stuck
      await new Promise(res => setTimeout(res, 400));
      const fallbackText = getMockResponse(prompt, capability);
      
      sound.playReceive();
      setMessages(prev => [...prev, { 
        role: provider === "gemini" ? "model" : "assistant", 
        content: `${fallbackText}\n\n*(Note: Live ${provider.toUpperCase()} API attempt returned: ${error?.message || 'Offline mode active'})*`
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearMessages = () => setMessages([]);

  return { messages, sendMessage, isLoading, clearMessages };
}
