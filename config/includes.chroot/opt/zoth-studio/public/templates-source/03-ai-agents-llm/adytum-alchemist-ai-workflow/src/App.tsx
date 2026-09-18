import { useState, useRef, useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import {
  Send,
  Sparkles,
  Moon,
  Sun,
  Hourglass,
  Lock,
  Unlock,
  Settings,
  Download,
  Trash2,
  Volume2,
  VolumeX,
  BrainCircuit,
  HelpCircle,
  Keyboard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { generateOfflineResponse } from "@/lib/mockEngine";
import {
  playTactileClick,
  playCelestialChime,
  playGateUnlockSound,
  isAudioMuted,
  toggleAudioMute,
  initAudioFromStorage,
} from "@/lib/audio";
import { WorkflowNodeGraph } from "@/components/WorkflowNodeGraph";
import ZothStudioBar from "@/components/ZothStudioBar";

type AppStage = "welcome" | "loading" | "lesson" | "meditating" | "answering" | "reflection_needed";
type ProviderId = "openai" | "ollama_cloud" | "ollama_local" | "demo_offline";
type ChatRole = "user" | "assistant";

type SessionMessage = {
  role: ChatRole;
  content: string;
  createdAt: string;
};

type ProviderSettings = {
  provider: ProviderId;
  openaiApiKey: string;
  openaiModel: string;
  ollamaCloudApiKey: string;
  ollamaCloudBaseUrl: string;
  ollamaCloudModel: string;
  ollamaLocalBaseUrl: string;
  ollamaLocalModel: string;
};

type CardProgress = {
  lessonsOpened: number;
  reflectionsNeeded: number;
  meditationsStarted: number;
  insightSubmissions: number;
  gatesOpened: number;
  completed: boolean;
};

type ProgressState = {
  cards: Record<number, CardProgress>;
  totalCyclesCompleted: number;
  cycleCompletions: string[];
};

const MEDITATION_TIME_SECONDS = 300;
const PROVIDER_SETTINGS_STORAGE_KEY = "adytum_provider_settings";
const SESSION_LOG_STORAGE_KEY = "adytum_session_log";
const PROGRESS_STORAGE_KEY = "adytum_progress_state";

const DEFAULT_PROVIDER_SETTINGS: ProviderSettings = {
  provider: "demo_offline",
  openaiApiKey: "",
  openaiModel: "gpt-4.1-mini",
  ollamaCloudApiKey: "",
  ollamaCloudBaseUrl: "https://ollama.com",
  ollamaCloudModel: "llama3.1:8b",
  ollamaLocalBaseUrl: "http://localhost:11434",
  ollamaLocalModel: "llama3.1:8b",
};

const TAROT_BASE = `${import.meta.env.BASE_URL}tarot/`;
const TAROT_IMAGE_PATHS: Record<number, string> = {
  0: `${TAROT_BASE}fool.jpg`,
  1: `${TAROT_BASE}magician.jpg`,
  2: `${TAROT_BASE}highpriestess.jpg`,
  3: `${TAROT_BASE}empress.jpg`,
  4: `${TAROT_BASE}emperor.jpg`,
  5: `${TAROT_BASE}hierorphant.jpg`,
  6: `${TAROT_BASE}lovers.jpg`,
  7: `${TAROT_BASE}chariot.jpg`,
  8: `${TAROT_BASE}strength.jpg`,
  9: `${TAROT_BASE}hermit.jpg`,
  10: `${TAROT_BASE}wheeloffortune.jpg`,
  11: `${TAROT_BASE}justice.jpg`,
  12: `${TAROT_BASE}hangedman.jpg`,
  13: `${TAROT_BASE}death.jpg`,
  14: `${TAROT_BASE}temperance.jpg`,
  15: `${TAROT_BASE}devil.jpg`,
  16: `${TAROT_BASE}tower.jpg`,
  17: `${TAROT_BASE}star.jpg`,
  18: `${TAROT_BASE}moon.jpg`,
  19: `${TAROT_BASE}sun.jpg`,
  20: `${TAROT_BASE}judgement.jpg`,
  21: `${TAROT_BASE}world.jpg`,
};

const TAROT_CARD_NAMES: Record<number, string> = {
  0: "The Fool",
  1: "The Magician",
  2: "The High Priestess",
  3: "The Empress",
  4: "The Emperor",
  5: "The Hierophant",
  6: "The Lovers",
  7: "The Chariot",
  8: "Strength",
  9: "The Hermit",
  10: "Wheel of Fortune",
  11: "Justice",
  12: "The Hanged Man",
  13: "Death",
  14: "Temperance",
  15: "The Devil",
  16: "The Tower",
  17: "The Star",
  18: "The Moon",
  19: "The Sun",
  20: "Judgement",
  21: "The World",
};

const TAROT_NAME_TO_NUMBER: Record<string, number> = {
  fool: 0,
  magician: 1,
  highpriestess: 2,
  empress: 3,
  emperor: 4,
  hierophant: 5,
  hierorphant: 5,
  lovers: 6,
  chariot: 7,
  strength: 8,
  hermit: 9,
  wheeloffortune: 10,
  fortune: 10,
  justice: 11,
  hangedman: 12,
  death: 13,
  temperance: 14,
  devil: 15,
  tower: 16,
  star: 17,
  moon: 18,
  sun: 19,
  judgement: 20,
  world: 21,
};

function buildSystemInstruction(tarotReferenceText: string): string {
  const mappingLines = Object.entries(TAROT_CARD_NAMES)
    .map(([key, name]) => `Key ${key}: ${name}. Image: ![${name}](${TAROT_IMAGE_PATHS[Number(key)]})`)
    .join("\n");

  const sourceText = tarotReferenceText.trim() || "No external reference text loaded.";

  return `Role: You are Adytum, the hermetic planning tool inside Zoth Studio by NullAI. You master the Builders of the Adytum (BOTA) Tarot system and translate it into a project brief. Lead the user through a sequential initiation from Key 0 (The Fool) to Key 21 (The World), then they pour the brief into Studio.

Operational Rules:
1. Strict Sequence: Start at Key 0. Do not move to the next key until the current answer demonstrates understanding.
2. Required response format for every new key:
   [GATE OPENED] (include only when advancing to a new key after a passed reflection; omit for Key 0)
   **Image**: ![Card Name](/tarot/...)
   **The Attribution**: Name, Number, Hebrew Letter, and specific Intelligence.
   **The AI Chemistry Lesson**: Translate the key's esoteric meaning into a modern AI concept.
   **The Alchemical Question**: Ask one deep reflective question the user must answer.
3. Reflection analysis:
   - If adequate: begin with [GATE OPENED] and then provide the next key.
   - If inadequate: begin with [REFLECTION NEEDED], explain the gap, and ask for deeper reflection. Do not advance.
4. Tone: Dignified, occult, encouraging, highly intellectual. Address the user as "Aspirant" or "Alchemist."
5. Use the canonical card information source below as primary content grounding.
6. Prioritize practices that coordinate conscious intention with subconscious incubation and then structured synthesis.
7. Always use these exact image paths:
${mappingLines}

Canonical card information source:
${sourceText}`;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getCompleteCanonicalSection(tarotText: string, keyNumber: number | null): string {
  if (!tarotText.trim()) return "";
  if (keyNumber === null) return tarotText.trim();

  const cardName = TAROT_CARD_NAMES[keyNumber];
  if (!cardName) return tarotText.trim();

  const currentPattern = new RegExp(
    `Name\\s*\\n+\\s*${escapeRegExp(cardName)}\\s*\\n+\\s*Key Number\\s*\\n+\\s*${keyNumber}\\b`,
    "i"
  );

  const start = tarotText.search(currentPattern);
  if (start < 0) return tarotText.trim();

  let end = tarotText.length;
  for (let i = keyNumber + 1; i <= 21; i += 1) {
    const nextName = TAROT_CARD_NAMES[i];
    if (!nextName) continue;
    const nextPattern = new RegExp(
      `Name\\s*\\n+\\s*${escapeRegExp(nextName)}\\s*\\n+\\s*Key Number\\s*\\n+\\s*${i}\\b`,
      "i"
    );

    const relativeIndex = tarotText.slice(start + 1).search(nextPattern);
    if (relativeIndex >= 0) {
      end = start + 1 + relativeIndex;
      break;
    }
  }

  return tarotText.slice(start, end).trim();
}

function normalizeTarotImageSrc(src?: string, alt?: string): string | null {
  if (!src) return null;

  const cleanedSrc = src.trim().split("?")[0].split("#")[0].toLowerCase();
  const numberMatch = cleanedSrc.match(/(?:^|\/)(\d{1,2})(?:[-_a-z]*)\.jpg$/);
  if (numberMatch) {
    const cardNum = Number(numberMatch[1]);
    return TAROT_IMAGE_PATHS[cardNum] ?? null;
  }

  const slug = (cleanedSrc + " " + (alt ?? ""))
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const byName = Object.entries(TAROT_NAME_TO_NUMBER).find(([name]) => slug.includes(name));
  if (byName) return TAROT_IMAGE_PATHS[byName[1]];

  return src;
}

function extractTarotImageFromMessage(message: string): string | null {
  const markdownImage = message.match(/!\[(.*?)\]\((.*?)\)/);
  if (!markdownImage) return null;
  return normalizeTarotImageSrc(markdownImage[2], markdownImage[1]);
}

function detectTarotKeyNumber(message: string): number | null {
  const keyMatch = message.match(/\bkey\s*(\d{1,2})\b/i);
  if (keyMatch) {
    const num = Number(keyMatch[1]);
    if (num >= 0 && num <= 21) return num;
  }

  const lowered = message.toLowerCase();
  for (const [name, num] of Object.entries(TAROT_NAME_TO_NUMBER)) {
    if (lowered.includes(name.toLowerCase())) return num;
  }

  return null;
}

function forceCanonicalTarotImage(message: string): string {
  const keyNum = detectTarotKeyNumber(message);
  if (keyNum === null) return message;

  const cardName = TAROT_CARD_NAMES[keyNum] ?? `Key ${keyNum}`;
  const imagePath = TAROT_IMAGE_PATHS[keyNum];
  if (!imagePath) return message;

  const withoutExistingImageLine = message.replace(/^\s*\*\*Image\*\*:\s*!\[.*?\]\(.*?\)\s*$/gim, "").trim();
  return `**Image**: ![${cardName}](${imagePath})\n\n${withoutExistingImageLine}`;
}

function getDefaultProviderSettings(): ProviderSettings {
  return { ...DEFAULT_PROVIDER_SETTINGS };
}

function createEmptyCardProgress(): CardProgress {
  return {
    lessonsOpened: 0,
    reflectionsNeeded: 0,
    meditationsStarted: 0,
    insightSubmissions: 0,
    gatesOpened: 0,
    completed: false,
  };
}

function getDefaultProgressState(): ProgressState {
  const cards: Record<number, CardProgress> = {} as Record<number, CardProgress>;
  for (let i = 0; i <= 21; i += 1) cards[i] = createEmptyCardProgress();
  return { cards, totalCyclesCompleted: 0, cycleCompletions: [] };
}

function isProviderConfigured(settings: ProviderSettings): boolean {
  if (settings.provider === "demo_offline") return true;
  if (settings.provider === "openai") return settings.openaiApiKey.trim().length > 0;
  if (settings.provider === "ollama_cloud") {
    return settings.ollamaCloudApiKey.trim().length > 0 && settings.ollamaCloudBaseUrl.trim().length > 0;
  }
  if (settings.provider === "ollama_local") {
    return settings.ollamaLocalBaseUrl.trim().length > 0;
  }
  return false;
}

function toOpenAIMessages(systemInstruction: string, history: SessionMessage[]) {
  const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
    { role: "system", content: systemInstruction },
  ];
  for (const msg of history) {
    messages.push({ role: msg.role, content: msg.content });
  }
  return messages;
}

async function sendToProvider(
  settings: ProviderSettings,
  systemInstruction: string,
  history: SessionMessage[]
): Promise<string> {
  if (settings.provider === "demo_offline") {
    // Simulate brief network latency for realism
    await new Promise((resolve) => setTimeout(resolve, 800));
    return generateOfflineResponse(history);
  }

  if (settings.provider === "openai") {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${settings.openaiApiKey.trim()}`,
      },
      body: JSON.stringify({
        model: settings.openaiModel.trim(),
        messages: toOpenAIMessages(systemInstruction, history),
        temperature: 0.7,
      }),
    });

    if (!res.ok) throw new Error(`OpenAI request failed (${res.status})`);
    const data = await res.json();
    const text = data?.choices?.[0]?.message?.content?.trim();
    if (!text) throw new Error("OpenAI returned an empty response.");
    return text;
  }

  if (settings.provider === "ollama_cloud") {
    const base = settings.ollamaCloudBaseUrl.trim().replace(/\/+$/, "");
    const res = await fetch(`${base}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${settings.ollamaCloudApiKey.trim()}`,
      },
      body: JSON.stringify({
        model: settings.ollamaCloudModel.trim(),
        messages: toOpenAIMessages(systemInstruction, history),
        stream: false,
      }),
    });

    if (!res.ok) throw new Error(`Ollama cloud request failed (${res.status})`);
    const data = await res.json();
    const text = data?.message?.content?.trim();
    if (!text) throw new Error("Ollama cloud returned an empty response.");
    return text;
  }

  const base = settings.ollamaLocalBaseUrl.trim().replace(/\/+$/, "");
  const res = await fetch(`${base}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: settings.ollamaLocalModel.trim(),
      messages: toOpenAIMessages(systemInstruction, history),
      stream: false,
    }),
  });

  if (!res.ok) throw new Error(`Ollama local request failed (${res.status})`);
  const data = await res.json();
  const text = data?.message?.content?.trim();
  if (!text) throw new Error("Ollama local returned an empty response.");
  return text;
}

export default function App() {
  const [stage, setStage] = useState<AppStage>("welcome");
  const [currentMessage, setCurrentMessage] = useState<string>("");
  const [input, setInput] = useState("");
  const [providerError, setProviderError] = useState("");
  const [tarotReferenceText, setTarotReferenceText] = useState("");
  const [isLoadingTarotReference, setIsLoadingTarotReference] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [showAiSettings, setShowAiSettings] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [showNodeGraph, setShowNodeGraph] = useState(false);
  const [showHotkeysHelp, setShowHotkeysHelp] = useState(false);
  const [muted, setMuted] = useState(false);
  const [liveAnnouncement, setLiveAnnouncement] = useState("");

  const [providerSettings, setProviderSettings] = useState<ProviderSettings>(getDefaultProviderSettings());
  const [providerDraft, setProviderDraft] = useState<ProviderSettings>(getDefaultProviderSettings());
  const [sessionLog, setSessionLog] = useState<SessionMessage[]>([]);
  const [progress, setProgress] = useState<ProgressState>(getDefaultProgressState());
  const [consciousIntention, setConsciousIntention] = useState("");
  const [symbolObservation, setSymbolObservation] = useState("");
  const [subconsciousPrompt, setSubconsciousPrompt] = useState("");
  const [insightSynthesis, setInsightSynthesis] = useState("");
  const [timeLeft, setTimeLeft] = useState(MEDITATION_TIME_SECONDS);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initAudioFromStorage();
    setMuted(isAudioMuted());

    const loadTarotReference = async () => {
      try {
        setIsLoadingTarotReference(true);
        const response = await fetch(`${import.meta.env.BASE_URL}tarot/info.txt`, { cache: "no-store" });
        if (!response.ok) throw new Error(`Failed to load tarot info (${response.status})`);
        const text = await response.text();
        setTarotReferenceText(text);
      } catch (error) {
        console.error("Error loading tarot info:", error);
        setTarotReferenceText("");
      } finally {
        setIsLoadingTarotReference(false);
      }
    };

    void loadTarotReference();
  }, []);

  useEffect(() => {
    const storedSettingsRaw = window.localStorage.getItem(PROVIDER_SETTINGS_STORAGE_KEY);
    if (storedSettingsRaw) {
      try {
        const parsed = JSON.parse(storedSettingsRaw) as ProviderSettings;
        const merged = { ...DEFAULT_PROVIDER_SETTINGS, ...parsed };
        setProviderSettings(merged);
        setProviderDraft(merged);
      } catch {
        const fallback = { ...DEFAULT_PROVIDER_SETTINGS };
        setProviderSettings(fallback);
        setProviderDraft(fallback);
      }
    }

    const storedLogsRaw = window.localStorage.getItem(SESSION_LOG_STORAGE_KEY);
    if (storedLogsRaw) {
      try {
        const parsed = JSON.parse(storedLogsRaw) as SessionMessage[];
        setSessionLog(parsed);
        const lastAssistant = [...parsed].reverse().find((msg) => msg.role === "assistant");
        if (lastAssistant) {
          setCurrentMessage(lastAssistant.content);
          setStage("lesson");
        }
      } catch {
        setSessionLog([]);
      }
    }

    const storedProgressRaw = window.localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (storedProgressRaw) {
      try {
        const parsed = JSON.parse(storedProgressRaw) as ProgressState;
        const merged = getDefaultProgressState();
        for (let i = 0; i <= 21; i += 1) {
          merged.cards[i] = { ...merged.cards[i], ...(parsed.cards?.[i] ?? {}) };
        }
        merged.totalCyclesCompleted = parsed.totalCyclesCompleted ?? 0;
        merged.cycleCompletions = Array.isArray(parsed.cycleCompletions) ? parsed.cycleCompletions : [];
        setProgress(merged);
      } catch {
        setProgress(getDefaultProgressState());
      }
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(PROVIDER_SETTINGS_STORAGE_KEY, JSON.stringify(providerSettings));
  }, [providerSettings]);

  useEffect(() => {
    window.localStorage.setItem(SESSION_LOG_STORAGE_KEY, JSON.stringify(sessionLog));
  }, [sessionLog]);

  useEffect(() => {
    window.localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  // Meditation timer with celestial audio chime
  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | undefined;
    if (stage === "meditating" && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (stage === "meditating" && timeLeft === 0) {
      playCelestialChime();
      setStage("answering");
      setLiveAnnouncement("Meditation cycle complete. Please record your post-incubation synthesis below.");
    }
    return () => clearInterval(timer);
  }, [stage, timeLeft]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [stage, currentMessage]);

  // Keyboard Hotkey Listener
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.altKey) {
        if (e.key.toLowerCase() === "s") {
          e.preventDefault();
          playTactileClick();
          setShowAiSettings((prev) => !prev);
          setShowProgress(false);
          setShowNodeGraph(false);
        } else if (e.key.toLowerCase() === "p") {
          e.preventDefault();
          playTactileClick();
          setShowProgress((prev) => !prev);
          setShowAiSettings(false);
          setShowNodeGraph(false);
        } else if (e.key.toLowerCase() === "g") {
          e.preventDefault();
          playTactileClick();
          setShowNodeGraph((prev) => !prev);
          setShowAiSettings(false);
          setShowProgress(false);
        } else if (e.key.toLowerCase() === "m") {
          e.preventDefault();
          const next = toggleAudioMute();
          setMuted(next);
        } else if (e.key.toLowerCase() === "d") {
          e.preventDefault();
          playTactileClick();
          setProviderSettings((prev) => ({ ...prev, provider: "demo_offline" }));
          setProviderDraft((prev) => ({ ...prev, provider: "demo_offline" }));
          setLiveAnnouncement("Switched to Demo / Offline Oracle Mode.");
        }
      } else if (e.key === "Escape") {
        setShowAiSettings(false);
        setShowProgress(false);
        setShowNodeGraph(false);
        setShowHotkeysHelp(false);
      }
    },
    []
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const systemInstruction = buildSystemInstruction(tarotReferenceText);
  const providerReady = isProviderConfigured(providerSettings);
  const completedKeysMap: Record<number, boolean> = {};
  for (let i = 0; i <= 21; i += 1) {
    completedKeysMap[i] = !!progress.cards[i]?.completed;
  }
  const cardsCompletedCount = Object.values(progress.cards).filter((card) => card.completed).length;

  const currentKeyNumber = detectTarotKeyNumber(currentMessage);
  const canBeginMeditation =
    consciousIntention.trim().length >= 15 &&
    symbolObservation.trim().length >= 15 &&
    subconsciousPrompt.trim().length >= 15;
  const canSubmitInsight = input.trim().length >= 25 && insightSynthesis.trim().length >= 15;
  const imageUrl = extractTarotImageFromMessage(currentMessage);
  const progressPercent = (timeLeft / MEDITATION_TIME_SECONDS) * 100;
  const currentCardLabel = currentKeyNumber !== null ? TAROT_CARD_NAMES[currentKeyNumber] : "Current Key";
  const referenceExcerpt = getCompleteCanonicalSection(tarotReferenceText, currentKeyNumber);

  const handleProviderSave = () => {
    playTactileClick();
    setProviderSettings({ ...providerDraft });
    setProviderError("");
    setShowAiSettings(false);
    setLiveAnnouncement(`Provider updated to ${providerDraft.provider}.`);
  };

  const handleClearProviderSecrets = () => {
    playTactileClick();
    const reset = {
      ...providerSettings,
      openaiApiKey: "",
      ollamaCloudApiKey: "",
    };
    setProviderSettings(reset);
    setProviderDraft(reset);
    setProviderError("");
  };

  const handleClearLogs = () => {
    playTactileClick();
    setSessionLog([]);
    setCurrentMessage("");
    setStage("welcome");
    setInput("");
    setConsciousIntention("");
    setSymbolObservation("");
    setSubconsciousPrompt("");
    setInsightSynthesis("");
    setTimeLeft(MEDITATION_TIME_SECONDS);
    window.localStorage.removeItem(SESSION_LOG_STORAGE_KEY);
    setProgress(getDefaultProgressState());
    window.localStorage.removeItem(PROGRESS_STORAGE_KEY);
    setLiveAnnouncement("Session logs and progress state cleared.");
  };

  const handleDownloadSession = () => {
    playTactileClick();
    const exportPayload = {
      exportedAt: new Date().toISOString(),
      providerSettings,
      stage,
      ritualState: {
        consciousIntention,
        symbolObservation,
        subconsciousPrompt,
        insightSynthesis,
      },
      sessionLog,
    };

    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `adytum-session-${new Date().toISOString().replace(/[:.]/g, "-")}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const handleSend = async (text: string) => {
    if (!text.trim()) return;
    playTactileClick();

    if (!providerReady) {
      setProviderError("Configure your active provider before starting the initiation.");
      setShowAiSettings(true);
      return;
    }
    if (isLoadingTarotReference) {
      setProviderError("Tarot reference text is still loading. Try again in a moment.");
      return;
    }

    setStage("loading");
    setLiveAnnouncement("Consulting the Alchemist Oracle...");
    setInput("");
    setIsSending(true);
    setProviderError("");

    const userMessage: SessionMessage = {
      role: "user",
      content: text.trim(),
      createdAt: new Date().toISOString(),
    };

    const historyWithUser = [...sessionLog, userMessage];
    setSessionLog(historyWithUser);
    const priorKey = detectTarotKeyNumber(currentMessage);

    try {
      const rawResponse = await sendToProvider(providerSettings, systemInstruction, historyWithUser);
      const responseText = forceCanonicalTarotImage(rawResponse);
      const responseKey = detectTarotKeyNumber(responseText.replace(/\[(GATE OPENED|REFLECTION NEEDED)\]/g, "").trim());

      const assistantMessage: SessionMessage = {
        role: "assistant",
        content: responseText,
        createdAt: new Date().toISOString(),
      };
      setSessionLog((prev) => [...prev, assistantMessage]);

      if (responseText.includes("[REFLECTION NEEDED]")) {
        const cleaned = responseText.replace(/\[REFLECTION NEEDED\]/g, "").trim();
        setCurrentMessage(cleaned);
        setStage("reflection_needed");
        setLiveAnnouncement("Gate remains closed. Deeper alchemical reflection required.");
        const keyToMark = responseKey ?? priorKey;
        if (keyToMark !== null) {
          setProgress((prev) => ({
            ...prev,
            cards: {
              ...prev.cards,
              [keyToMark]: {
                ...prev.cards[keyToMark],
                reflectionsNeeded: prev.cards[keyToMark].reflectionsNeeded + 1,
              },
            },
          }));
        }
      } else {
        const cleaned = responseText.replace(/\[GATE OPENED\]/g, "").trim();
        setCurrentMessage(cleaned);
        setStage("lesson");
        setTimeLeft(MEDITATION_TIME_SECONDS);

        if (responseText.includes("[GATE OPENED]") && priorKey !== null) {
          playGateUnlockSound();
          setLiveAnnouncement(`Gate Unlocked for Key ${priorKey}! Advancing to next Tarot Key.`);
          setProgress((prev) => {
            const nextCards = { ...prev.cards };
            const previousCard = nextCards[priorKey];
            nextCards[priorKey] = {
              ...previousCard,
              gatesOpened: previousCard.gatesOpened + 1,
              completed: true,
            };

            let nextCycles = prev.totalCyclesCompleted;
            let nextCompletions = prev.cycleCompletions;
            if (priorKey === 21) {
              nextCycles += 1;
              nextCompletions = [...prev.cycleCompletions, new Date().toISOString()];
            }

            return {
              cards: nextCards,
              totalCyclesCompleted: nextCycles,
              cycleCompletions: nextCompletions,
            };
          });
        } else {
          setLiveAnnouncement(`Initiation stage active for Key ${responseKey ?? 0}.`);
        }

        if (responseKey !== null) {
          setProgress((prev) => ({
            ...prev,
            cards: {
              ...prev.cards,
              [responseKey]: {
                ...prev.cards[responseKey],
                lessonsOpened: prev.cards[responseKey].lessonsOpened + 1,
              },
            },
          }));
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setCurrentMessage("An error occurred in the alchemical process. Check provider settings and try again.");
      setStage("reflection_needed");
      setProviderError(error instanceof Error ? error.message : "Request failed.");
      setLiveAnnouncement("An error occurred. Check provider console.");
    } finally {
      setIsSending(false);
    }
  };

  const handleSubmitInsight = () => {
    if (!canSubmitInsight) return;
    const structuredResponse = `Ritual context:\n- Conscious Intention: ${consciousIntention.trim()}\n- Symbol Observation: ${symbolObservation.trim()}\n- Subconscious Prompt During Meditation: ${subconsciousPrompt.trim()}\n- Post-Meditation Synthesis: ${insightSynthesis.trim()}\n\nAlchemical answer:\n${input.trim()}`;
    if (currentKeyNumber !== null) {
      setProgress((prev) => ({
        ...prev,
        cards: {
          ...prev.cards,
          [currentKeyNumber]: {
            ...prev.cards[currentKeyNumber],
            insightSubmissions: prev.cards[currentKeyNumber].insightSubmissions + 1,
          },
        },
      }));
    }
    void handleSend(structuredResponse);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <>
      {/* Skip Navigation Link for AX */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2.5 focus:bg-amber-400 focus:text-zinc-950 focus:font-bold focus:rounded-lg shadow-xl outline-none"
      >
        Skip to main content
      </a>

      {/* ARIA Live Region for Status Announcements */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {liveAnnouncement}
      </div>

      <div className="oracle-shell min-h-[100dvh] text-zinc-50 flex flex-col items-center justify-start sm:justify-center pt-[58px] sm:p-5 sm:pt-[76px] selection:bg-[#e8c872]/30 selection:text-[#f7f4ee] relative overflow-hidden">
        <ZothStudioBar />
        <div className="pointer-events-none absolute -left-36 top-24 size-72 rounded-full bg-[#e8c872]/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-44 bottom-16 size-80 rounded-full bg-[#7ee7f0]/08 blur-3xl" />

        <Card className="glass-panel w-full max-w-5xl h-[calc(100dvh-58px)] sm:h-[calc(100dvh-96px)] flex flex-col rounded-none sm:rounded-[20px] border-[#e8c872]/25 overflow-hidden relative shadow-2xl">
          {/* Header Landmark */}
          <CardHeader role="banner" className="border-b border-[#e8c872]/20 pb-3 pt-4 sm:pt-3 bg-gradient-to-b from-[#050508]/90 to-[#050508]/30 z-10">
            <p className="mx-auto text-[11px] uppercase ritual-text text-[#e8c872] font-medium">
              Zoth Studio · planning rite
            </p>
            <CardTitle className="flex items-center justify-center gap-3 text-2xl sm:text-[2.1rem] font-medium font-heading text-[#f7f4ee] tracking-tight">
              Adytum
            </CardTitle>
            <p className="mt-1 text-center text-[13px] text-[#a8a4c2] max-w-md mx-auto leading-relaxed">
              Plan with purpose. Keys 0–21. Pour the brief into Studio when the coin is set.
            </p>
            <div className="ornate-divider h-px w-36 mx-auto mt-2" />

            {/* Navigation Toolbar */}
            <nav role="navigation" aria-label="Initiation Toolbar" className="mt-3 flex flex-wrap justify-center gap-2">
              <Button
                onClick={() => {
                  playTactileClick();
                  setShowNodeGraph((prev) => !prev);
                  setShowAiSettings(false);
                  setShowProgress(false);
                }}
                variant="ghost"
                className="h-auto px-3 py-1.5 text-xs text-amber-200 hover:text-amber-100 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-400/30 rounded-full transition"
                aria-label="Workflow Studio & Node Graph (Alt+G)"
              >
                <BrainCircuit className="w-3.5 h-3.5 mr-1.5 text-amber-400" />
                Workflow Studio <kbd className="ml-1 px-1 py-0.5 text-[9px] bg-zinc-900 rounded border border-amber-500/30">Alt+G</kbd>
              </Button>

              <Button
                onClick={() => {
                  playTactileClick();
                  setShowAiSettings((prev) => !prev);
                  setShowProgress(false);
                  setShowNodeGraph(false);
                }}
                variant="ghost"
                className="h-auto px-3 py-1.5 text-xs text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800/60 rounded-full"
                aria-label="AI Settings Console (Alt+S)"
              >
                <Settings className="w-3.5 h-3.5 mr-1" />
                AI Console <kbd className="ml-1 px-1 py-0.5 text-[9px] bg-zinc-900 rounded border border-zinc-700">Alt+S</kbd>
              </Button>

              <Button
                onClick={() => {
                  playTactileClick();
                  setShowProgress((prev) => !prev);
                  setShowAiSettings(false);
                  setShowNodeGraph(false);
                }}
                variant="ghost"
                className="h-auto px-3 py-1.5 text-xs text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800/60 rounded-full"
                aria-label="Initiation Progress (Alt+P)"
              >
                Progress <kbd className="ml-1 px-1 py-0.5 text-[9px] bg-zinc-900 rounded border border-zinc-700">Alt+P</kbd>
              </Button>

              <Button
                onClick={() => {
                  const next = toggleAudioMute();
                  setMuted(next);
                }}
                variant="ghost"
                className="h-auto px-3 py-1.5 text-xs text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800/60 rounded-full"
                aria-label={muted ? "Unmute Audio (Alt+M)" : "Mute Audio (Alt+M)"}
              >
                {muted ? <VolumeX className="w-3.5 h-3.5 mr-1 text-red-400" /> : <Volume2 className="w-3.5 h-3.5 mr-1 text-amber-400" />}
                {muted ? "Muted" : "Audio"} <kbd className="ml-1 px-1 py-0.5 text-[9px] bg-zinc-900 rounded border border-zinc-700">Alt+M</kbd>
              </Button>

              <Button
                onClick={handleDownloadSession}
                variant="ghost"
                className="h-auto px-3 py-1.5 text-xs text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800/60 rounded-full"
                aria-label="Download Session Log"
              >
                <Download className="w-3.5 h-3.5 mr-1" /> Export
              </Button>

              <Button
                onClick={() => setShowHotkeysHelp((prev) => !prev)}
                variant="ghost"
                className="h-auto px-2 py-1.5 text-xs text-zinc-400 hover:text-zinc-200 rounded-full"
                aria-label="Keyboard Hotkeys Info"
              >
                <Keyboard className="w-3.5 h-3.5" />
              </Button>

              <Button
                onClick={handleClearLogs}
                variant="ghost"
                className="h-auto px-2 py-1.5 text-xs text-zinc-400 hover:text-red-300 rounded-full"
                aria-label="Clear Session Logs"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </nav>

            <p className="mt-2 text-center text-[11px] text-zinc-400">
              Active Mode: <span className="text-amber-300 uppercase font-semibold">{providerSettings.provider.replace("_", " ")}</span> • Stored: {sessionLog.length} msgs • {cardsCompletedCount}/22 keys completed
            </p>
          </CardHeader>

          {/* Main Landmark */}
          <CardContent id="main-content" role="main" aria-label="Adytum planning rite" className="flex-1 flex flex-col p-0 overflow-hidden relative">
            {/* Hotkeys Dialog Modal */}
            {showHotkeysHelp && (
              <section className="border-b border-amber-500/30 bg-zinc-950/95 p-4 sm:p-5 space-y-3 animate-in fade-in duration-200 z-20">
                <div className="flex items-center justify-between">
                  <h2 className="text-amber-300 font-heading flex items-center gap-2">
                    <Keyboard className="w-4 h-4" /> Keyboard Accessibility Shortcuts
                  </h2>
                  <Button onClick={() => setShowHotkeysHelp(false)} variant="ghost" className="h-auto p-1 text-xs">
                    ✕
                  </Button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-zinc-300">
                  <div className="p-2 rounded bg-zinc-900 border border-zinc-800 flex justify-between">
                    <span>Workflow Studio</span> <kbd className="text-amber-300 font-mono">Alt+G</kbd>
                  </div>
                  <div className="p-2 rounded bg-zinc-900 border border-zinc-800 flex justify-between">
                    <span>AI Console</span> <kbd className="text-amber-300 font-mono">Alt+S</kbd>
                  </div>
                  <div className="p-2 rounded bg-zinc-900 border border-zinc-800 flex justify-between">
                    <span>Progress Matrix</span> <kbd className="text-amber-300 font-mono">Alt+P</kbd>
                  </div>
                  <div className="p-2 rounded bg-zinc-900 border border-zinc-800 flex justify-between">
                    <span>Toggle Audio</span> <kbd className="text-amber-300 font-mono">Alt+M</kbd>
                  </div>
                  <div className="p-2 rounded bg-zinc-900 border border-zinc-800 flex justify-between">
                    <span>Offline Demo Mode</span> <kbd className="text-amber-300 font-mono">Alt+D</kbd>
                  </div>
                  <div className="p-2 rounded bg-zinc-900 border border-zinc-800 flex justify-between">
                    <span>Close Panels</span> <kbd className="text-amber-300 font-mono">Esc</kbd>
                  </div>
                </div>
              </section>
            )}

            {/* Provider Console Drawer */}
            {showAiSettings && (
              <section className="border-b border-amber-500/20 bg-zinc-950/95 p-4 sm:p-5 space-y-4 z-20">
                <h2 className="text-amber-300 font-medium flex items-center justify-between">
                  <span>Provider Console &amp; AI Engine Configuration</span>
                  <span className="text-xs font-normal text-zinc-400">Select active engine</span>
                </h2>
                <div className="flex flex-wrap gap-2">
                  {(
                    [
                      ["demo_offline", "Demo / Offline Oracle (No Key Required)"],
                      ["openai", "OpenAI"],
                      ["ollama_cloud", "Ollama Cloud"],
                      ["ollama_local", "Ollama Local"],
                    ] as Array<[ProviderId, string]>
                  ).map(([id, label]) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setProviderDraft((prev) => ({ ...prev, provider: id }))}
                      className={`rounded-full px-3.5 py-1.5 text-xs font-medium border transition ${
                        providerDraft.provider === id
                          ? "border-amber-300/80 bg-amber-300/20 text-amber-100 shadow-[0_0_12px_rgba(245,158,11,0.25)]"
                          : "border-zinc-700 bg-zinc-900/60 text-zinc-300 hover:text-zinc-100 hover:border-zinc-500"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                {providerDraft.provider === "demo_offline" && (
                  <div className="p-3 rounded-lg border border-amber-500/30 bg-amber-950/20 text-xs text-amber-200/90 leading-relaxed">
                    Offline mode is on. Adytum runs on this machine with the built-in guide — no cloud key required. When the rite is done, pour the brief into Studio.
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {providerDraft.provider === "openai" && (
                    <>
                      <label className="space-y-1">
                        <span className="text-xs uppercase tracking-[0.15em] text-zinc-400">OpenAI API Key</span>
                        <input
                          type="password"
                          value={providerDraft.openaiApiKey}
                          onChange={(e) => setProviderDraft((prev) => ({ ...prev, openaiApiKey: e.target.value }))}
                          placeholder="sk-..."
                          className="w-full rounded-lg border border-amber-400/20 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-2 focus-visible:ring-amber-400"
                        />
                      </label>
                      <label className="space-y-1">
                        <span className="text-xs uppercase tracking-[0.15em] text-zinc-400">OpenAI Model</span>
                        <input
                          value={providerDraft.openaiModel}
                          onChange={(e) => setProviderDraft((prev) => ({ ...prev, openaiModel: e.target.value }))}
                          className="w-full rounded-lg border border-amber-400/20 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 focus-visible:ring-2 focus-visible:ring-amber-400"
                        />
                      </label>
                    </>
                  )}

                  {providerDraft.provider === "ollama_cloud" && (
                    <>
                      <label className="space-y-1">
                        <span className="text-xs uppercase tracking-[0.15em] text-zinc-400">Cloud API Key</span>
                        <input
                          type="password"
                          value={providerDraft.ollamaCloudApiKey}
                          onChange={(e) => setProviderDraft((prev) => ({ ...prev, ollamaCloudApiKey: e.target.value }))}
                          className="w-full rounded-lg border border-amber-400/20 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 focus-visible:ring-2 focus-visible:ring-amber-400"
                        />
                      </label>
                      <label className="space-y-1">
                        <span className="text-xs uppercase tracking-[0.15em] text-zinc-400">Cloud Base URL</span>
                        <input
                          value={providerDraft.ollamaCloudBaseUrl}
                          onChange={(e) => setProviderDraft((prev) => ({ ...prev, ollamaCloudBaseUrl: e.target.value }))}
                          className="w-full rounded-lg border border-amber-400/20 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 focus-visible:ring-2 focus-visible:ring-amber-400"
                        />
                      </label>
                      <label className="space-y-1 sm:col-span-2">
                        <span className="text-xs uppercase tracking-[0.15em] text-zinc-400">Cloud Model</span>
                        <input
                          value={providerDraft.ollamaCloudModel}
                          onChange={(e) => setProviderDraft((prev) => ({ ...prev, ollamaCloudModel: e.target.value }))}
                          className="w-full rounded-lg border border-amber-400/20 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 focus-visible:ring-2 focus-visible:ring-amber-400"
                        />
                      </label>
                    </>
                  )}

                  {providerDraft.provider === "ollama_local" && (
                    <>
                      <label className="space-y-1">
                        <span className="text-xs uppercase tracking-[0.15em] text-zinc-400">Local Base URL</span>
                        <input
                          value={providerDraft.ollamaLocalBaseUrl}
                          onChange={(e) => setProviderDraft((prev) => ({ ...prev, ollamaLocalBaseUrl: e.target.value }))}
                          className="w-full rounded-lg border border-amber-400/20 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 focus-visible:ring-2 focus-visible:ring-amber-400"
                        />
                      </label>
                      <label className="space-y-1">
                        <span className="text-xs uppercase tracking-[0.15em] text-zinc-400">Local Model</span>
                        <input
                          value={providerDraft.ollamaLocalModel}
                          onChange={(e) => setProviderDraft((prev) => ({ ...prev, ollamaLocalModel: e.target.value }))}
                          className="w-full rounded-lg border border-amber-400/20 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 focus-visible:ring-2 focus-visible:ring-amber-400"
                        />
                      </label>
                    </>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  <Button onClick={handleProviderSave} className="h-auto bg-amber-500 hover:bg-amber-400 text-zinc-950 font-medium px-5 py-2 rounded-full">
                    Apply Provider
                  </Button>
                  <Button onClick={handleClearProviderSecrets} variant="ghost" className="h-auto px-4 py-2 text-zinc-300 hover:text-zinc-100">
                    Clear Stored Keys
                  </Button>
                </div>
                {providerError && <p className="text-red-300 text-sm">{providerError}</p>}
              </section>
            )}

            {/* Progress Matrix Drawer */}
            {showProgress && (
              <section className="border-b border-amber-500/20 bg-zinc-950/95 p-4 sm:p-5 space-y-4 z-20">
                <h2 className="text-amber-300 font-medium">Initiation Progress Matrix</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                  <div className="rounded-lg border border-amber-400/20 bg-zinc-900/70 p-2">
                    <p className="text-[10px] uppercase tracking-wider text-zinc-400">Completed Keys</p>
                    <p className="text-lg text-amber-200 font-medium">{cardsCompletedCount}/22</p>
                  </div>
                  <div className="rounded-lg border border-amber-400/20 bg-zinc-900/70 p-2">
                    <p className="text-[10px] uppercase tracking-wider text-zinc-400">Cycles Done</p>
                    <p className="text-lg text-amber-200 font-medium">{progress.totalCyclesCompleted}</p>
                  </div>
                  <div className="rounded-lg border border-amber-400/20 bg-zinc-900/70 p-2">
                    <p className="text-[10px] uppercase tracking-wider text-zinc-400">Meditations</p>
                    <p className="text-lg text-amber-200 font-medium">
                      {Object.values(progress.cards).reduce((sum, card) => sum + card.meditationsStarted, 0)}
                    </p>
                  </div>
                  <div className="rounded-lg border border-amber-400/20 bg-zinc-900/70 p-2">
                    <p className="text-[10px] uppercase tracking-wider text-zinc-400">Reflections</p>
                    <p className="text-lg text-amber-200 font-medium">
                      {Object.values(progress.cards).reduce((sum, card) => sum + card.reflectionsNeeded, 0)}
                    </p>
                  </div>
                </div>
                <div className="max-h-56 overflow-y-auto rounded-lg border border-amber-400/20 bg-zinc-900/50 p-2 space-y-1 custom-scrollbar">
                  {Object.entries(TAROT_CARD_NAMES).map(([key, label]) => {
                    const keyNum = Number(key);
                    const card = progress.cards[keyNum];
                    return (
                      <div key={key} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 rounded-md border border-zinc-800 bg-zinc-950/60 px-2.5 py-1.5">
                        <div>
                          <p className="text-xs text-zinc-200 font-medium">Key {key}: {label}</p>
                          <p className="text-[10px] text-zinc-400">
                            Lessons {card.lessonsOpened} • Gates {card.gatesOpened} • Refl {card.reflectionsNeeded} • Med {card.meditationsStarted}
                          </p>
                        </div>
                        <span className={`text-[10px] uppercase tracking-wider font-semibold ${card.completed ? "text-emerald-400" : "text-zinc-500"}`}>
                          {card.completed ? "complete" : "incomplete"}
                        </span>
                      </div>
                    );
                  })}
                </div>
                {progress.cycleCompletions.length > 0 && (
                  <div className="rounded-lg border border-amber-400/20 bg-zinc-900/50 p-2">
                    <p className="text-xs text-zinc-300 mb-1">Cycle Completion Log</p>
                    <div className="max-h-24 overflow-y-auto text-[10px] text-zinc-400 space-y-0.5 custom-scrollbar">
                      {progress.cycleCompletions.map((stamp) => (
                        <p key={stamp}>{new Date(stamp).toLocaleString()}</p>
                      ))}
                    </div>
                  </div>
                )}
              </section>
            )}

            {/* Workflow Node Graph Modal */}
            {showNodeGraph && (
              <WorkflowNodeGraph
                currentKeyNumber={currentKeyNumber}
                completedKeys={completedKeysMap}
                onClose={() => setShowNodeGraph(false)}
                onJumpToKey={(keyNum) => {
                  playTactileClick();
                  void handleSend(`Focus on Key ${keyNum}`);
                }}
              />
            )}

            {/* Stage: Welcome */}
            {stage === "welcome" && (
              <section className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10 text-center space-y-8 animate-in fade-in duration-700">
                <div className="relative w-28 h-28 rounded-full border border-amber-400/40 flex items-center justify-center bg-zinc-950/80 shadow-[0_0_50px_rgba(245,158,11,0.25)]">
                  <div className="absolute inset-0 rounded-full border border-amber-300/30 animate-ping [animation-duration:3s]" />
                  <Sun className="w-12 h-12 text-amber-300 drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
                </div>

                <div className="space-y-4 max-w-xl">
                  <h1 className="text-3xl sm:text-4xl font-heading text-[#f7f4ee] tracking-tight">
                    Plan before you build.
                  </h1>
                  <p className="text-[#a8a4c2] leading-relaxed text-base sm:text-lg">
                    Adytum is a Zoth Studio tool. Walk Keys 0–21, name the work with purpose,
                    then pour the brief into Studio. The rite stays on this machine.
                  </p>
                  <p className="text-[#e8c872] text-xs sm:text-sm bg-[#e8c872]/8 border border-[#e8c872]/20 rounded-xl p-3">
                    Offline on this box. No cloud key required. Open AI Console if you want a local or hosted model.
                  </p>
                </div>

                <Button
                  onClick={() => void handleSend("Start")}
                  disabled={!providerReady || isLoadingTarotReference || isSending}
                  className="h-auto bg-[#e8c872] hover:bg-[#f0d48a] text-[#14110a] font-medium px-9 py-4 text-base sm:text-lg rounded-full border-0 shadow-none transition-all focus-visible:ring-4 focus-visible:ring-[#e8c872]/40"
                >
                  {isLoadingTarotReference || isSending ? "Preparing…" : "Begin the rite"}
                </Button>
                {providerError && <p className="text-red-300 text-sm">{providerError}</p>}
              </section>
            )}

            {/* Stage: Loading */}
            {stage === "loading" && (
              <section className="flex-1 flex flex-col items-center justify-center p-8 space-y-6 animate-in fade-in duration-500">
                <div className="relative w-20 h-20">
                  <div className="absolute inset-0 border-2 border-amber-500/20 rounded-full" />
                  <div className="absolute inset-0 border-2 border-amber-400 rounded-full border-t-transparent animate-spin" />
                  <Moon className="absolute inset-0 m-auto w-8 h-8 text-amber-300 animate-pulse" />
                </div>
                <p className="text-amber-300/90 animate-pulse tracking-[0.25em] uppercase text-xs sm:text-sm font-medium">
                  Consulting the Oracle...
                </p>
              </section>
            )}

            {/* Stage: Lesson / Answering / Reflection Needed */}
            {(stage === "lesson" || stage === "answering" || stage === "reflection_needed") && (
              <section ref={scrollRef} className="flex-1 overflow-y-auto p-6 sm:p-9 space-y-8 animate-in slide-in-from-bottom-4 duration-700 custom-scrollbar">
                {stage === "reflection_needed" && (
                  <div className="bg-red-950/40 border border-red-700/60 rounded-xl p-4 mb-6 flex items-start gap-3 shadow-lg">
                    <Lock className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                    <div>
                      <h2 className="text-red-300 font-medium mb-1">The Gate Remains Closed</h2>
                      <p className="text-red-200/80 text-sm">
                        Your insight requires deeper alchemical synthesis. Read the guide's feedback below and resubmit your reflection.
                      </p>
                    </div>
                  </div>
                )}

                {/* Markdown Content */}
                <article className="markdown-body prose prose-sm sm:prose-base prose-invert prose-amber max-w-none prose-img:rounded-xl prose-img:border prose-img:border-amber-400/40 prose-img:shadow-[0_20px_45px_rgba(0,0,0,0.55)] prose-img:max-w-[280px] sm:prose-img:max-w-[340px] prose-img:mx-auto prose-img:my-8 prose-headings:text-amber-300 prose-headings:font-heading prose-headings:tracking-wide prose-strong:text-amber-200 prose-p:leading-relaxed prose-p:text-zinc-300/95 prose-li:text-zinc-300/90">
                  <ReactMarkdown
                    components={{
                      img: ({ node, ...props }) => {
                        const safeSrc = normalizeTarotImageSrc(props.src, props.alt);
                        return <img {...props} src={safeSrc ?? props.src} referrerPolicy="no-referrer" alt={props.alt || "Tarot Card"} />;
                      },
                    }}
                  >
                    {currentMessage}
                  </ReactMarkdown>
                </article>

                {/* 3-Stage Practice Protocol */}
                {stage === "lesson" && (
                  <div className="pt-8 pb-4 border-t border-zinc-800/80 mt-8 space-y-5">
                    <h3 className="text-amber-300 font-medium tracking-wide flex items-center gap-2 text-lg">
                      <Sparkles className="w-4 h-4" /> BOTA Practice Protocol
                    </h3>
                    <p className="text-zinc-400 text-sm">
                      Prepare consciousness before meditation, then plant a precise subconscious directive.
                    </p>

                    <div className="space-y-2">
                      <label htmlFor="intention-input" className="text-xs uppercase tracking-[0.18em] text-amber-200/80 font-medium">
                        1. Conscious Intention
                      </label>
                      <Textarea
                        id="intention-input"
                        value={consciousIntention}
                        onChange={(e) => setConsciousIntention(e.target.value)}
                        placeholder="What faculty or pattern are you refining through this key?"
                        className="min-h-[85px] bg-zinc-950/85 border-amber-400/20 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-amber-400 text-base resize-y"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="observation-input" className="text-xs uppercase tracking-[0.18em] text-amber-200/80 font-medium">
                        2. Symbol Observation
                      </label>
                      <Textarea
                        id="observation-input"
                        value={symbolObservation}
                        onChange={(e) => setSymbolObservation(e.target.value)}
                        placeholder="Name exact symbols and their psychological function in your own words."
                        className="min-h-[85px] bg-zinc-950/85 border-amber-400/20 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-amber-400 text-base resize-y"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="directive-input" className="text-xs uppercase tracking-[0.18em] text-amber-200/80 font-medium">
                        3. Subconscious Directive
                      </label>
                      <Textarea
                        id="directive-input"
                        value={subconsciousPrompt}
                        onChange={(e) => setSubconsciousPrompt(e.target.value)}
                        placeholder="Write one clear seed-thought to hold through the five-minute meditation."
                        className="min-h-[85px] bg-zinc-950/85 border-amber-400/20 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-amber-400 text-base resize-y"
                      />
                    </div>

                    <div className="flex justify-center pt-2">
                      <Button
                        onClick={() => {
                          playCelestialChime();
                          if (currentKeyNumber !== null) {
                            setProgress((prev) => ({
                              ...prev,
                              cards: {
                                ...prev.cards,
                                [currentKeyNumber]: {
                                  ...prev.cards[currentKeyNumber],
                                  meditationsStarted: prev.cards[currentKeyNumber].meditationsStarted + 1,
                                },
                              },
                            }));
                          }
                          setStage("meditating");
                        }}
                        disabled={!canBeginMeditation}
                        className="h-auto bg-zinc-900 hover:bg-zinc-800 text-amber-200 border border-amber-400/40 px-8 py-4 text-base sm:text-lg rounded-full shadow-[0_0_24px_rgba(245,158,11,0.18)] transition-all hover:shadow-[0_0_36px_rgba(245,158,11,0.3)] flex gap-3 items-center disabled:opacity-45"
                      >
                        <Hourglass className="w-5 h-5 text-amber-400" />
                        Begin 5-Minute Meditation
                      </Button>
                    </div>
                    {!canBeginMeditation && (
                      <p className="text-zinc-500 text-xs text-center">
                        Complete all three fields with specific detail before entering meditation.
                      </p>
                    )}
                  </div>
                )}

                {/* Subconscious Incubation Answer Section */}
                {(stage === "answering" || stage === "reflection_needed") && (
                  <div className="pt-8 border-t border-zinc-800/80 mt-8 space-y-4 animate-in fade-in duration-700">
                    <h3 className="text-amber-300 font-medium flex items-center gap-2 tracking-wide text-lg">
                      <Unlock className="w-5 h-5 text-amber-400" />
                      Provide Your Alchemical Synthesis
                    </h3>
                    <label htmlFor="reflection-answer" className="text-xs uppercase tracking-[0.18em] text-zinc-400 block">
                      Alchemical Reflection Answer
                    </label>
                    <Textarea
                      id="reflection-answer"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Record your alchemical reflections and technical answers here..."
                      className="min-h-[140px] bg-zinc-950/85 border-amber-400/20 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-amber-400 text-base resize-y"
                    />

                    <label htmlFor="synthesis-answer" className="text-xs uppercase tracking-[0.18em] text-zinc-400 block">
                      Post-Meditation Insight
                    </label>
                    <Textarea
                      id="synthesis-answer"
                      value={insightSynthesis}
                      onChange={(e) => setInsightSynthesis(e.target.value)}
                      placeholder="What idea, pattern, or solution emerged from subconscious incubation?"
                      className="min-h-[85px] bg-zinc-950/85 border-amber-400/20 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-amber-400 text-base resize-y"
                    />

                    <div className="flex justify-end pt-2">
                      <Button
                        onClick={handleSubmitInsight}
                        disabled={!canSubmitInsight || isSending}
                        className="h-auto bg-amber-500 hover:bg-amber-400 text-zinc-950 font-medium px-7 py-3 rounded-full border border-amber-100/30 disabled:bg-amber-700/40 disabled:text-zinc-400 shadow-[0_0_20px_rgba(245,158,11,0.2)]"
                      >
                        Submit Insight &amp; Unlock Gate
                        <Send className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                    {!canSubmitInsight && (
                      <p className="text-zinc-500 text-xs text-right">
                        Requires detailed reflection answer plus post-meditation synthesis.
                      </p>
                    )}
                  </div>
                )}

                {/* Canonical Study Excerpt */}
                {referenceExcerpt && (
                  <aside aria-label="Canonical Tarot Reference" className="pt-6 border-t border-zinc-800/80">
                    <h3 className="text-amber-300 font-medium tracking-wide mb-2 flex items-center gap-2">
                      <HelpCircle className="w-4 h-4" /> Canonical Study Excerpt: {currentCardLabel}
                    </h3>
                    <div className="max-h-60 overflow-y-auto rounded-xl border border-amber-400/20 bg-zinc-950/70 p-3.5 custom-scrollbar">
                      <pre className="whitespace-pre-wrap text-xs leading-relaxed text-zinc-300/90 font-mono">
                        {referenceExcerpt}
                      </pre>
                    </div>
                  </aside>
                )}
              </section>
            )}

            {/* Stage: Meditating */}
            {stage === "meditating" && (
              <section className="flex-1 flex flex-col items-center justify-center p-6 bg-zinc-950/90 relative overflow-hidden animate-in zoom-in-95 duration-1000">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.08)_0%,transparent_70%)]" />
                <div className="z-10 flex flex-col items-center space-y-10 w-full max-w-md">
                  <div className="text-center space-y-3">
                    <h2 className="text-amber-300 text-xl font-heading tracking-[0.22em] uppercase font-medium">
                      Sacred Meditation Incubation
                    </h2>
                    <p className="text-zinc-300/85 text-sm">
                      Hold your subconscious directive while observing the image without forcing active thought.
                    </p>
                  </div>

                  {imageUrl && (
                    <div className="relative w-48 h-auto sm:w-60 rounded-xl overflow-hidden border border-amber-400/40 shadow-[0_0_40px_rgba(245,158,11,0.25)]">
                      <img src={imageUrl} alt="Tarot Card" className="w-full h-auto" referrerPolicy="no-referrer" />
                    </div>
                  )}

                  <div className="relative">
                    <div className="absolute inset-0 bg-amber-500/15 blur-3xl rounded-full animate-pulse" />
                    <div className="relative text-7xl sm:text-8xl font-light text-amber-300 tracking-tighter tabular-nums drop-shadow-[0_0_20px_rgba(245,158,11,0.5)]">
                      {formatTime(timeLeft)}
                    </div>
                  </div>

                  <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
                    <div
                      className="h-full bg-amber-400 transition-all duration-1000 ease-linear shadow-[0_0_10px_rgba(245,158,11,0.8)]"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              </section>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
