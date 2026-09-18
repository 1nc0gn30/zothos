import { EstimateRequest, EstimateResponse } from '../types';
import { generateEstimate as generateGeminiEstimate } from './gemini';
import { generateMockEstimate } from './mockEngine';

const STORAGE_KEY = 'buildestimate_usage_count';
const API_KEY_STORAGE_KEY = 'buildestimate_custom_api_key';

export function getUsageCount(): number {
  const count = localStorage.getItem(STORAGE_KEY);
  return count ? parseInt(count, 10) : 0;
}

export function incrementUsageCount() {
  const count = getUsageCount();
  localStorage.setItem(STORAGE_KEY, (count + 1).toString());
}

export function getCustomApiKey(): string | null {
  return localStorage.getItem(API_KEY_STORAGE_KEY);
}

export function hasCustomApiKey(): boolean {
  return Boolean(getCustomApiKey() && getCustomApiKey()?.trim().length! > 5);
}

export function setCustomApiKey(key: string) {
  localStorage.setItem(API_KEY_STORAGE_KEY, key);
}

export function clearCustomApiKey() {
  localStorage.removeItem(API_KEY_STORAGE_KEY);
}

export async function executeEstimate(request: EstimateRequest): Promise<EstimateResponse> {
  const customKey = getCustomApiKey();

  if (customKey) {
    try {
      const geminiResult = await generateGeminiEstimate(request, customKey);
      incrementUsageCount();
      return {
        ...geminiResult,
        source: 'gemini',
        sourceMessage: 'Gemini 2.4 AI Live Engine'
      };
    } catch (err: any) {
      console.warn('Gemini API call failed, falling back to offline engine:', err);
      const fallbackResult = generateMockEstimate(request);
      incrementUsageCount();
      return {
        ...fallbackResult,
        source: 'offline',
        sourceMessage: `Offline Engine (Gemini fallback: ${err.message || 'API key issue'})`
      };
    }
  }

  // No custom key provided: use calibrated high-fidelity offline engine directly
  const offlineResult = generateMockEstimate(request);
  incrementUsageCount();
  return offlineResult;
}
