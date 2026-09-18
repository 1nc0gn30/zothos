import { GoogleGenAI } from '@google/genai';

export type PromptCategory = 'truth' | 'dare' | 'deep' | 'wild' | 'ai';

export interface PromptItem {
  id: string;
  category: PromptCategory;
  text: string;
  intensity: 'light' | 'spicy' | 'epic';
}

const OFFLINE_PROMPTS: Record<Exclude<PromptCategory, 'ai'>, PromptItem[]> = {
  truth: [
    { id: 't1', category: 'truth', text: "What's the most embarrassing mystery on your phone right now?", intensity: 'light' },
    { id: 't2', category: 'truth', text: "If you could swap lives with anyone in this room for 24 hours, who would it be and why?", intensity: 'light' },
    { id: 't3', category: 'truth', text: "What's a secret habit you have that nobody else knows about?", intensity: 'light' },
    { id: 't4', category: 'truth', text: "What's the worst advice you've ever actually followed?", intensity: 'spicy' },
    { id: 't5', category: 'truth', text: "Have you ever told a white lie to get out of hanging out with someone here?", intensity: 'spicy' },
    { id: 't6', category: 'truth', text: "What is your biggest irrational fear?", intensity: 'light' },
    { id: 't7', category: 'truth', text: "What was your first impression of the person who spun the bottle?", intensity: 'spicy' },
    { id: 't8', category: 'truth', text: "What is one thing you wish you could undo from the past year?", intensity: 'spicy' },
    { id: 't9', category: 'truth', text: "What's the most ridiculous impulse purchase you've ever made?", intensity: 'light' },
    { id: 't10', category: 'truth', text: "What song do you secretly sing at the top of your lungs when you're alone?", intensity: 'light' }
  ],
  dare: [
    { id: 'd1', category: 'dare', text: "Do your best dramatic impression of the person who spun the bottle.", intensity: 'light' },
    { id: 'd2', category: 'dare', text: "Let the person to your left rewrite your social media status or send a funny text to your top contact.", intensity: 'spicy' },
    { id: 'd3', category: 'dare', text: "Speak with a fake accent of the group's choice for the next 3 rounds.", intensity: 'light' },
    { id: 'd4', category: 'dare', text: "Show the last photo in your camera roll and explain the context.", intensity: 'spicy' },
    { id: 'd5', category: 'dare', text: "Attempt to spin on one foot while singing a chorus of a pop song.", intensity: 'light' },
    { id: 'd6', category: 'dare', text: "Give a 60-second passionate speech about why pineapple belongs (or doesn't belong) on pizza.", intensity: 'light' },
    { id: 'd7', category: 'dare', text: "Do 15 rapid pushups or high knees while making eye contact with the bottle.", intensity: 'spicy' },
    { id: 'd8', category: 'dare', text: "Allow the group to pick a nickname for you for the remainder of the session.", intensity: 'light' }
  ],
  deep: [
    { id: 'dp1', category: 'deep', text: "What is a life lesson you had to learn the hard way?", intensity: 'spicy' },
    { id: 'dp2', category: 'deep', text: "What is one dream or aspiration you haven't told many people about?", intensity: 'spicy' },
    { id: 'dp3', category: 'deep', text: "What quality do you admire most in your best friend?", intensity: 'light' },
    { id: 'dp4', category: 'deep', text: "How have your priorities changed the most over the last 3 years?", intensity: 'spicy' },
    { id: 'dp5', category: 'deep', text: "What defines a truly successful life to you?", intensity: 'spicy' },
    { id: 'dp6', category: 'deep', text: "When was the last time you felt genuinely surprised by someone's kindness?", intensity: 'light' }
  ],
  wild: [
    { id: 'w1', category: 'wild', text: "Invent a new dance move right now and teach it to the rest of the room.", intensity: 'epic' },
    { id: 'w2', category: 'wild', text: "Create a 30-second rap about the item directly to your right.", intensity: 'epic' },
    { id: 'w3', category: 'wild', text: "Trade one shoe with the person who spun the bottle until the next round.", intensity: 'spicy' },
    { id: 'w4', category: 'wild', text: "Tell a completely made-up story with 100% confidence. The group must guess if it's real.", intensity: 'spicy' },
    { id: 'w5', category: 'wild', text: "Act out a movie scene using only gestures—no speaking allowed!", intensity: 'epic' }
  ]
};

export async function generatePartyPrompt(
  category: PromptCategory,
  targetPlayer: string,
  spinnerPlayer?: string
): Promise<string> {
  const envMeta = (import.meta as unknown as { env?: { VITE_GEMINI_API_KEY?: string } }).env;
  const apiKey = envMeta?.VITE_GEMINI_API_KEY || '';

  if (category === 'ai' && apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Generate a fun, hilarious, and friendly spin-the-bottle party challenge for player "${targetPlayer}" ${
          spinnerPlayer ? `spun by "${spinnerPlayer}"` : ''
        }. Keep it safe, creative, under 25 words, and ultra-engaging for a group party.`
      });
      if (response && response.text) {
        return response.text.trim();
      }
    } catch {
      // Fallback to offline generator if API key is invalid or network fails
    }
  }

  // Offline Fallback Selector
  const effectiveCat: Exclude<PromptCategory, 'ai'> = category === 'ai' ? 'wild' : category;
  const list = OFFLINE_PROMPTS[effectiveCat] || OFFLINE_PROMPTS.truth;
  const item = list[Math.floor(Math.random() * list.length)];
  return item.text;
}
