export type ProjectType = 'residential' | 'commercial';
export type QualityTier = 'standard' | 'premium' | 'luxury';

export interface EstimateRequest {
  projectType: ProjectType;
  description: string;
  location: string;
  budget?: number;
  squareFootage?: number;
  customPrompt?: string;
  qualityTier?: QualityTier;
  contingencyPercent?: number;
}

export interface CostItem {
  category: string;
  amount: number;
  percentage: number;
}

export interface ROIItem {
  year: number;
  value: number;
}

export interface EstimateResponse {
  totalEstimate: number;
  breakdown: CostItem[];
  roiData: ROIItem[];
  timelineWeeks: number;
  pros: string[];
  cons: string[];
  hacks: string[];
  detailedAnalysis: string;
  source?: 'gemini' | 'offline';
  sourceMessage?: string;
}
