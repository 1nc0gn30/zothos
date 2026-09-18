import { create } from 'zustand';
import { soundEngine } from '../lib/soundEngine';

interface SoundState {
  isMuted: boolean;
  toggleMute: () => void;
  playClick: () => void;
  playAddToCart: () => void;
  playCheckoutSuccess: () => void;
  playToggle: () => void;
}

const STORAGE_KEY = '757gas_sound_muted';

export const useSoundStore = create<SoundState>((set, get) => {
  const initialMuted = (() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  })();

  soundEngine.setMuted(initialMuted);

  return {
    isMuted: initialMuted,
    toggleMute: () => {
      const nextMuted = !get().isMuted;
      soundEngine.setMuted(nextMuted);
      try {
        localStorage.setItem(STORAGE_KEY, String(nextMuted));
      } catch {}
      set({ isMuted: nextMuted });
      if (!nextMuted) {
        soundEngine.playToggle();
      }
    },
    playClick: () => soundEngine.playClick(),
    playAddToCart: () => soundEngine.playAddToCart(),
    playCheckoutSuccess: () => soundEngine.playCheckoutSuccess(),
    playToggle: () => soundEngine.playToggle(),
  };
});
