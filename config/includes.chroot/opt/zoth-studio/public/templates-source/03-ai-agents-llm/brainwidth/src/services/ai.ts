import { TaskCategory, RecurrenceType } from "../types";
import { GoogleGenAI, Type } from "@google/genai";

export interface AIRateLimitError extends Error {
  limitReached?: boolean;
}

const USER_API_KEY_STORAGE_KEY = 'user-gemini-api-key';

function getUserAI() {
  const apiKey = typeof window !== 'undefined' ? localStorage.getItem(USER_API_KEY_STORAGE_KEY) : null;
  if (!apiKey || !apiKey.trim()) return null;
  try {
    return new GoogleGenAI({ apiKey });
  } catch (err) {
    console.warn("Failed to initialize GoogleGenAI with custom key", err);
    return null;
  }
}

export async function parseVoiceTask(transcript: string): Promise<{
  title: string;
  description: string;
  category: TaskCategory;
  duration: number;
  recurrence: RecurrenceType;
  bandwidthScore: number;
}> {
  if (!transcript || !transcript.trim()) {
    return localHeuristicParse("Quick Task");
  }

  const ai = getUserAI();
  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Parse the following task description into a structured JSON object.
        Transcript: "${transcript}"
        
        Rules:
        - title: Short, concise title.
        - description: Brief context if any.
        - category: One of: "Deep Work", "Shallow Work", "Meetings", "Learning", "Personal", "Admin".
        - duration: Estimated minutes (number).
        - recurrence: One of: "none", "daily", "weekly", "monthly".`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              category: { type: Type.STRING, enum: ["Deep Work", "Shallow Work", "Meetings", "Learning", "Personal", "Admin"] },
              duration: { type: Type.NUMBER },
              recurrence: { type: Type.STRING, enum: ["none", "daily", "weekly", "monthly"] },
            },
            required: ["title", "description", "category", "duration", "recurrence"]
          }
        }
      });
      
      const result = JSON.parse(response.text || '{}');
      return {
        ...result,
        bandwidthScore: estimateBandwidth(result.title, result.description, result.category, result.duration)
      };
    } catch (error) {
      console.warn("User AI parse failed, switching to server/local fallback", error);
    }
  }

  try {
    const response = await fetch("/api/ai/parse-voice", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transcript }),
    });

    if (response.status === 429) {
      const error: AIRateLimitError = new Error("Rate limit exceeded");
      error.limitReached = true;
      throw error;
    }

    if (!response.ok) throw new Error("Failed to parse voice task");
    const data = await response.json();
    return {
      ...data,
      bandwidthScore: data.bandwidthScore || estimateBandwidth(data.title, data.description, data.category, data.duration)
    };
  } catch (error) {
    if ((error as AIRateLimitError).limitReached) throw error;
    
    console.warn("AI Endpoint unreachable, using local heuristic parse engine", error);
    return localHeuristicParse(transcript);
  }
}

export async function getDailyInsights(tasks: any[]): Promise<string> {
  if (!tasks || tasks.length === 0) return "No tasks scheduled for today. Add tasks to calculate your cognitive load and get tailored energy management recommendations.";

  const ai = getUserAI();
  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Analyze these tasks and provide a brief (2-3 sentences) cognitive load insight for the day.
        Tasks: ${JSON.stringify(tasks)}`,
      });
      if (response.text && response.text.trim()) {
        return response.text;
      }
    } catch (error) {
      console.warn("User AI insights failed", error);
    }
  }

  try {
    const response = await fetch("/api/ai/insights", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tasks }),
    });

    if (response.status === 429) {
      return "Daily AI request limit reached. Join our waitlist for unlimited access, or use your personal Gemini key in Settings!";
    }

    if (!response.ok) throw new Error("Failed to get insights");
    const data = await response.json();
    return data.text;
  } catch (error) {
    console.warn("AI Proxy failed, falling back to local insights engine", error);
    return localHeuristicInsights(tasks);
  }
}

export async function getOptimizationSuggestions(tasks: any[]): Promise<string> {
  if (!tasks || tasks.length === 0) return "Add tasks to your schedule to unlock AI optimization suggestions.";

  const ai = getUserAI();
  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Suggest 3 concise, actionable ways to optimize this schedule for better cognitive performance.
        Tasks: ${JSON.stringify(tasks)}`,
      });
      if (response.text && response.text.trim()) {
        return response.text;
      }
    } catch (error) {
      console.warn("User AI optimization failed", error);
    }
  }

  try {
    const response = await fetch("/api/ai/optimize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tasks }),
    });

    if (response.status === 429) {
      return "Daily AI limit reached. Join our waitlist or add a personal Gemini API Key in Settings to run unlimited optimizations.";
    }

    if (!response.ok) throw new Error("Failed to get optimization suggestions");
    const data = await response.json();
    return data.text;
  } catch (error) {
    console.warn("AI Proxy failed, falling back to local suggestions engine", error);
    return localHeuristicSuggestions(tasks);
  }
}

// Local Heuristic Fallbacks Engine
function localHeuristicParse(transcript: string) {
  const lowerTranscript = transcript.toLowerCase();
  let category: TaskCategory = 'Shallow Work';
  if (lowerTranscript.includes('deep work') || lowerTranscript.includes('focus') || lowerTranscript.includes('code') || lowerTranscript.includes('write') || lowerTranscript.includes('refactor') || lowerTranscript.includes('architect')) {
    category = 'Deep Work';
  } else if (lowerTranscript.includes('meeting') || lowerTranscript.includes('call') || lowerTranscript.includes('sync') || lowerTranscript.includes('retro') || lowerTranscript.includes('standup')) {
    category = 'Meetings';
  } else if (lowerTranscript.includes('learn') || lowerTranscript.includes('read') || lowerTranscript.includes('study') || lowerTranscript.includes('course') || lowerTranscript.includes('research')) {
    category = 'Learning';
  } else if (lowerTranscript.includes('admin') || lowerTranscript.includes('email') || lowerTranscript.includes('organize') || lowerTranscript.includes('receipt') || lowerTranscript.includes('expense')) {
    category = 'Admin';
  } else if (lowerTranscript.includes('personal') || lowerTranscript.includes('break') || lowerTranscript.includes('lunch') || lowerTranscript.includes('walk') || lowerTranscript.includes('gym')) {
    category = 'Personal';
  }

  let recurrence: RecurrenceType = 'none';
  if (lowerTranscript.includes('every day') || lowerTranscript.includes('daily')) recurrence = 'daily';
  else if (lowerTranscript.includes('every week') || lowerTranscript.includes('weekly')) recurrence = 'weekly';
  else if (lowerTranscript.includes('every month') || lowerTranscript.includes('monthly')) recurrence = 'monthly';

  let duration = 60;
  const minMatch = lowerTranscript.match(/(\d+)\s*(min|minute|minutes)/);
  const hourMatch = lowerTranscript.match(/(\d+)\s*(hour|hours|hr|hrs)/);
  if (minMatch) duration = parseInt(minMatch[1], 10);
  else if (hourMatch) duration = parseInt(hourMatch[1], 10) * 60;

  let title = transcript
    .replace(/\b(every day|daily|every week|weekly|every month|monthly)\b/gi, '')
    .replace(/\b(\d+)\s*(min|minute|minutes|hour|hours|hr|hrs)\b/gi, '')
    .replace(/\b(for|a|an|the|at|on|tomorrow|today)\b/gi, '')
    .trim();
  
  title = title.charAt(0).toUpperCase() + title.slice(1);
  if (!title) title = "New Scheduled Task";

  return {
    title,
    description: `Extracted via intelligent heuristic parser: "${transcript}"`,
    category,
    duration,
    recurrence,
    bandwidthScore: estimateBandwidth(title, transcript, category, duration)
  };
}

function localHeuristicInsights(tasks: any[]) {
  const totalBandwidth = tasks.reduce((sum, t) => sum + (t.bandwidthScore || 0), 0);
  const deepWorkCount = tasks.filter(t => t.category === 'Deep Work').length;
  const meetingCount = tasks.filter(t => t.category === 'Meetings').length;

  let insight = `You have ${tasks.length} task${tasks.length === 1 ? '' : 's'} scheduled totaling ${totalBandwidth} bandwidth points. `;
  if (totalBandwidth > 35) {
    insight += `With ${deepWorkCount} deep work blocks and ${meetingCount} meetings, your cognitive load is severe. Plan at least 30 minutes of physical recovery time.`;
  } else if (totalBandwidth < 15) {
    insight += "Your mental bandwidth load is light today—an ideal opportunity to tackle challenging creative tasks or high-yield learning.";
  } else {
    insight += "Your daily cognitive load is well-balanced across high and low intensity tasks, promoting steady focus without exhaustion.";
  }
  return insight;
}

function localHeuristicSuggestions(tasks: any[]) {
  const suggestions: string[] = [];
  const totalBandwidth = tasks.reduce((sum, t) => sum + (t.bandwidthScore || 0), 0);
  const deepWorkTasks = tasks.filter(t => t.category === 'Deep Work');
  const meetingTasks = tasks.filter(t => t.category === 'Meetings');

  if (totalBandwidth > 30) {
    suggestions.push("1. High Peak Load Alert: Defer or break up high-bandwidth tasks over 90 minutes into shorter focus intervals.");
  } else {
    suggestions.push("1. Optimal Bandwidth: Front-load your highest score Deep Work session into your peak morning focus window.");
  }

  if (meetingTasks.length > 2) {
    suggestions.push("2. Meeting Concentration: Batch back-to-back meetings into a single afternoon block to protect uninterrupted focus morning hours.");
  } else {
    suggestions.push("2. Interleaved Breaks: Insert a 10-15 minute low-stimulus break after every 60 minutes of intensive cognitive work.");
  }

  if (deepWorkTasks.length > 0) {
    suggestions.push("3. Context Switch Shield: Turn off notifications and close non-essential tabs during your active Deep Work sessions.");
  } else {
    suggestions.push("3. Energy Re-investment: Allocate 30 minutes to exploratory learning or system optimization.");
  }

  return suggestions.join('\n\n');
}

export function estimateBandwidth(title: string, description: string, category: TaskCategory, durationMinutes: number): number {
  let baseScore = 5;
  switch (category) {
    case 'Deep Work': baseScore = 8; break;
    case 'Learning': baseScore = 7; break;
    case 'Meetings': baseScore = 5; break;
    case 'Shallow Work': baseScore = 3; break;
    case 'Admin': baseScore = 3; break;
    case 'Personal': baseScore = 1; break;
  }
  if (durationMinutes > 90) baseScore += 2;
  else if (durationMinutes > 60) baseScore += 1;
  else if (durationMinutes < 30) baseScore -= 1;
  const text = (title + " " + description).toLowerCase();
  if (text.includes('complex') || text.includes('hard') || text.includes('architecture') || text.includes('refactor') || text.includes('audit')) baseScore += 2;
  if (text.includes('quick') || text.includes('easy') || text.includes('simple') || text.includes('scan')) baseScore -= 1;
  return Math.min(Math.max(baseScore, 1), 10);
}
