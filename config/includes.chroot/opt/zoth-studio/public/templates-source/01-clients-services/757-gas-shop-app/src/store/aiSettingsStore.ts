import { create } from 'zustand';

export type AIProvider = 'pollinations' | 'openai';

interface AISettingsState {
  provider: AIProvider;
  ollamaUrl: string;
  ollamaModel: string;
  ollamaApiKey: string;
  openaiApiKey: string;
  openaiModel: string;
  
  setProvider: (p: AIProvider) => void;
  setOllamaUrl: (url: string) => void;
  setOllamaModel: (model: string) => void;
  setOllamaApiKey: (key: string) => void;
  setOpenaiApiKey: (key: string) => void;
  setOpenaiModel: (model: string) => void;
}

const STORAGE_KEY = '757gas_ai_settings';

function loadFromStorage(): Partial<AISettingsState> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveToStorage(state: Partial<AISettingsState>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

const defaults = loadFromStorage();

export const useAISettingsStore = create<AISettingsState>((set, get) => ({
  provider: defaults.provider || 'pollinations',
  ollamaUrl: defaults.ollamaUrl || 'http://localhost:11434',
  ollamaModel: defaults.ollamaModel || 'llava',
  ollamaApiKey: defaults.ollamaApiKey || '',
  openaiApiKey: defaults.openaiApiKey || '',
  openaiModel: defaults.openaiModel || 'dall-e-3',

  setProvider: (provider) => {
    set({ provider });
    saveToStorage(get());
  },
  setOllamaUrl: (ollamaUrl) => {
    set({ ollamaUrl });
    saveToStorage(get());
  },
  setOllamaModel: (ollamaModel) => {
    set({ ollamaModel });
    saveToStorage(get());
  },
  setOllamaApiKey: (ollamaApiKey) => {
    set({ ollamaApiKey });
    saveToStorage(get());
  },
  setOpenaiApiKey: (openaiApiKey) => {
    set({ openaiApiKey });
    saveToStorage(get());
  },
  setOpenaiModel: (openaiModel) => {
    set({ openaiModel });
    saveToStorage(get());
  },
}));
