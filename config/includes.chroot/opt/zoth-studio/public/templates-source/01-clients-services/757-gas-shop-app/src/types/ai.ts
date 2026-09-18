// AI Generation Types
export interface AIGenerationRequest {
  order_id: string;
  prompt: string;
  style?: string;
  dimensions?: {
    width: number;
    height: number;
  };
}

export interface AIGeneration {
  user_id: string | null;
  id: string;
  order_id: string;
  prompt: string;
  generated_asset_url: string | null;
  status: 'pending' | 'generating' | 'completed' | 'failed';
  error_message: string | null;
  created_at: string;
  updated_at: string;
}

export interface GenerationStyle {
  id: string;
  name: string;
  description: string;
  prompt_template: string;
}

// Default generation styles
export const DEFAULT_GENERATION_STYLES: GenerationStyle[] = [
  {
    id: 'abstract',
    name: 'Abstract',
    description: 'Colorful geometric patterns and shapes',
    prompt_template: 'abstract colorful geometric patterns with {product} elements, modern art style'
  },
  {
    id: 'nature',
    name: 'Nature Inspired',
    description: 'Organic patterns with natural elements',
    prompt_template: 'nature-inspired pattern with {product} motifs, organic shapes, earthy tones'
  },
  {
    id: 'digital',
    name: 'Digital Art',
    description: 'Futuristic digital artwork',
    prompt_template: 'digital art featuring {product}, futuristic style, glowing effects'
  },
  {
    id: 'minimal',
    name: 'Minimalist',
    description: 'Clean and simple design',
    prompt_template: 'minimalist design with {product} concept, clean lines, simple colors'
  }
];

export interface AIService {
  generateAsset(request: AIGenerationRequest): Promise<AIGeneration>;
  getGenerationStatus(generationId: string): Promise<AIGeneration>;
  getOrderGenerations(orderId: string): Promise<AIGeneration[]>;
}
