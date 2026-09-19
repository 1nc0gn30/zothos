import React, { useState, useEffect } from 'react';
import { Mic, Volume2, Sparkles, X, Play, Square, Loader2, Wand2 } from 'lucide-react';
import { ProjectState } from '../../types/project';
import { SubtitleItem, AudioTrack } from '../../types/models';
import { NEURAL_VOICE_PRESETS, generateAIAudio } from '../../services/ttsService';

interface TTSModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: ProjectState;
  onAddVoiceAndCaptions: (data: { audioTrack?: AudioTrack; subtitles: SubtitleItem[] }) => void;
}

export const TTSModal: React.FC<TTSModalProps> = ({
  isOpen,
  onClose,
  project,
  onAddVoiceAndCaptions,
}) => {
  const [script, setScript] = useState('');
  const [selectedVoice, setSelectedVoice] = useState<string>('en-US-ChristopherNeural');
  const [wpm, setWpm] = useState<number>(160);
  const [style, setStyle] = useState<'hormozi' | 'neonGlow' | 'glassCard' | 'minimal'>('hormozi');
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewAudio, setPreviewAudio] = useState<HTMLAudioElement | null>(null);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);

  useEffect(() => {
    return () => {
      if (previewAudio) {
        previewAudio.pause();
      }
    };
  }, [previewAudio]);

  if (!isOpen) return null;

  const handlePreview = async () => {
    if (isPlayingPreview && previewAudio) {
      previewAudio.pause();
      setIsPlayingPreview(false);
      return;
    }
    if (!script.trim()) return;

    setIsGenerating(true);
    try {
      const res = await generateAIAudio({
        text: script,
        voice: selectedVoice,
        rate: wpm / 150,
        style,
        startTime: project.currentSeconds || 0,
      });

      if (res.audioUrl) {
        const audio = new Audio(res.audioUrl);
        setPreviewAudio(audio);
        setIsPlayingPreview(true);
        audio.onended = () => setIsPlayingPreview(false);
        audio.play();
      }
    } catch (err: any) {
      alert(`Voice error: ${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerate = async () => {
    if (!script.trim()) return;
    setIsGenerating(true);

    try {
      const startSec = project.currentSeconds || 0;
      const res = await generateAIAudio({
        text: script,
        voice: selectedVoice,
        rate: wpm / 150,
        style,
        startTime: startSec,
      });

      let newTrack: AudioTrack | undefined;
      if (res.audioUrl) {
        newTrack = {
          id: crypto.randomUUID(),
          url: res.audioUrl,
          name: `AI Voice (${NEURAL_VOICE_PRESETS.find(v => v.id === selectedVoice)?.name.split(' ')[0] || 'Neural'})`,
          volume: 1.0,
          startTime: startSec,
          duration: res.duration || 3.0,
          isMuted: false,
        };
      }

      onAddVoiceAndCaptions({
        audioTrack: newTrack,
        subtitles: res.subtitles || [],
      });
      onClose();
    } catch (err: any) {
      alert(`Generation error: ${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-dark-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="w-[560px] bg-dark-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div className="flex items-center space-x-2 text-brand-400 font-semibold">
            <Mic className="w-5 h-5" />
            <span className="text-white font-bold">AI Voice & Auto-Captions</span>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Neural Studio
            </span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Script Area */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs">
            <label className="text-slate-300 font-medium">Script / Speech Text</label>
            <span className="text-slate-500 font-mono text-[10px]">{script.split(/\s+/).filter(Boolean).length} words</span>
          </div>
          <textarea
            rows={4}
            value={script}
            onChange={(e) => setScript(e.target.value)}
            placeholder="Type or paste your video script here... Maya will synthesize realistic AI speech and auto-time viral captions!"
            className="w-full px-3.5 py-2.5 rounded-xl bg-dark-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 font-mono resize-none transition"
          />
        </div>

        {/* Voice & Caption Style */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-[11px] text-slate-300 font-medium">AI Neural Voice</label>
            <select
              value={selectedVoice}
              onChange={(e) => setSelectedVoice(e.target.value)}
              className="w-full px-2.5 py-2 rounded-xl bg-dark-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-brand-500 font-mono transition"
            >
              {NEURAL_VOICE_PRESETS.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] text-slate-300 font-medium">Caption Style</label>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value as any)}
              className="w-full px-2.5 py-2 rounded-xl bg-dark-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-brand-500 transition"
            >
              <option value="hormozi">Viral Hormozi (Bold Yellow)</option>
              <option value="neonGlow">Cyber Neon Glow</option>
              <option value="glassCard">Frosted Glass Card</option>
              <option value="minimal">Minimal Modern Sans</option>
            </select>
          </div>
        </div>

        {/* Speed / WPM */}
        <div className="space-y-1.5 p-3 rounded-xl bg-dark-950/70 border border-slate-800">
          <div className="flex justify-between text-slate-300 text-[11px]">
            <span>Reading Speed</span>
            <span className="font-mono text-brand-300">{wpm} WPM</span>
          </div>
          <input
            type="range"
            min="110"
            max="220"
            step="10"
            value={wpm}
            onChange={(e) => setWpm(parseInt(e.target.value))}
            className="w-full accent-brand-500 cursor-pointer"
          />
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-5 gap-2 pt-1">
          <button
            onClick={handlePreview}
            disabled={!script.trim() || isGenerating}
            className="col-span-2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs font-semibold text-slate-200 hover:text-white transition flex items-center justify-center space-x-1.5 border border-slate-700 shadow-md"
          >
            {isGenerating ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-400" />
            ) : isPlayingPreview ? (
              <>
                <Square className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
                <span>Stop</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-indigo-400" />
                <span>Hear Voice</span>
              </>
            )}
          </button>

          <button
            onClick={handleGenerate}
            disabled={!script.trim() || isGenerating}
            className="col-span-3 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-40 text-xs font-semibold text-white transition flex items-center justify-center space-x-2 shadow-lg shadow-brand-600/30 active:scale-95"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Synthesizing Voice...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4" />
                <span>Add Voice & Captions</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
