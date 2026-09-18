import { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from '@google/genai';
import { soundEngine } from '../utils/audio';

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [useFallbackEngine, setUseFallbackEngine] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const generateMusic = async () => {
    const apiKey = typeof process !== 'undefined' ? process.env.GEMINI_API_KEY : undefined;
    if (!apiKey) {
      // Gracefully switch to Web Audio procedural engine if no API key present
      setUseFallbackEngine(true);
      return;
    }

    if (audioUrl) return;
    setIsLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContentStream({
        model: "lyria-3-clip-preview",
        contents: "Generate a 30-second calming, professional, ambient corporate background track with soft piano and light airy pads. Welcoming and sophisticated.",
      });

      let audioBase64 = "";
      let mimeType = "audio/wav";

      for await (const chunk of response) {
        const parts = chunk.candidates?.[0]?.content?.parts;
        if (!parts) continue;
        for (const part of parts) {
          if (part.inlineData?.data) {
            if (!audioBase64 && part.inlineData.mimeType) {
              mimeType = part.inlineData.mimeType;
            }
            audioBase64 += part.inlineData.data;
          }
        }
      }

      if (audioBase64) {
        const binary = atob(audioBase64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
          bytes[i] = binary.charCodeAt(i);
        }
        const blob = new Blob([bytes], { type: mimeType });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
      } else {
        setUseFallbackEngine(true);
      }
    } catch (error) {
      console.warn("Gemini music generation offline fallback engaged:", error);
      setUseFallbackEngine(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    generateMusic();
  }, []);

  const togglePlay = () => {
    soundEngine.playClick();
    if (useFallbackEngine || !audioUrl) {
      const newState = soundEngine.toggleAmbient();
      setIsPlaying(newState);
      return;
    }

    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(() => {
          // If media element fails, fall back to procedural sound engine
          setUseFallbackEngine(true);
          const newState = soundEngine.toggleAmbient(true);
          setIsPlaying(newState);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    soundEngine.playClick();
    if (useFallbackEngine) {
      const newState = soundEngine.toggleAmbient();
      setIsPlaying(newState);
      setIsMuted(!newState);
      return;
    }

    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-3 rounded-full flex items-center gap-3 border border-white/50 shadow-2xl"
      >
        {audioUrl && !useFallbackEngine && (
          <audio 
            ref={audioRef} 
            src={audioUrl} 
            loop 
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />
        )}
        
        <button 
          onClick={togglePlay}
          disabled={isLoading}
          aria-label={isPlaying ? "Pause ambient Audio Track (Alt + M)" : "Play ambient Audio Track (Alt + M)"}
          className="w-10 h-10 rounded-full bg-brand-900 text-white flex items-center justify-center hover:scale-105 transition-transform disabled:opacity-50 focus:ring-2 focus:ring-brand-900"
        >
          {isLoading ? (
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            >
              <Music size={18} />
            </motion.div>
          ) : isPlaying ? (
            <Pause size={18} />
          ) : (
            <Play size={18} fill="currentColor" />
          )}
        </button>

        <AnimatePresence>
          {isPlaying && (
            <motion.div 
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "auto", opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="flex items-center gap-2 overflow-hidden px-1"
            >
              <div className="flex gap-1 h-3 items-end" aria-hidden="true">
                {[1, 2, 3, 4].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ height: [4, 12, 6, 10, 4] }}
                    transition={{ repeat: Infinity, duration: 1, delay: i * 0.1 }}
                    className="w-1 bg-brand-900/60 rounded-full"
                  />
                ))}
              </div>
              <button
                onClick={toggleMute}
                aria-label={isMuted ? "Unmute audio" : "Mute audio"}
                className="text-brand-900/60 hover:text-brand-900 focus:outline-none"
              >
                {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
