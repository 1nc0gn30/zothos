import { GoogleGenAI, Type } from '@google/genai';
import { EstimateRequest, EstimateResponse } from '../types';

export async function generateEstimate(request: EstimateRequest, apiKeyOverride: string): Promise<EstimateResponse> {
  const ai = new GoogleGenAI({ apiKey: apiKeyOverride });

  const systemInstruction = `You are an expert construction estimator and project manager with 30 years of experience in both residential and commercial sectors.
Your goal is to provide highly accurate, professional, and data-driven construction estimates.
Always return the response in valid JSON format matching the specified schema.
Include realistic cost breakdowns, ROI projections over 5 years, and practical "hacks" for efficiency.`;

  const prompt = `
    Project Type: ${request.projectType}
    Location: ${request.location}
    Description: ${request.description}
    Budget: ${request.budget ? `$${request.budget}` : 'Not specified'}
    Square Footage: ${request.squareFootage ? `${request.squareFootage} sq ft` : 'Not specified'}

    User Custom Instructions: ${request.customPrompt || 'None'}

    Please provide:
    1. A total estimated cost.
    2. A detailed breakdown of costs (Labor, Materials, Permits, Overhead, Profit).
    3. ROI data for the next 5 years (projected value increase or savings).
    4. Estimated timeline in weeks.
    5. A list of pros and cons for this specific project.
    6. Professional "hacks" or efficiency tips.
    7. A detailed textual analysis.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      systemInstruction,
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          totalEstimate: { type: Type.NUMBER },
          breakdown: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                category: { type: Type.STRING },
                amount: { type: Type.NUMBER },
                percentage: { type: Type.NUMBER }
              },
              required: ['category', 'amount', 'percentage']
            }
          },
          roiData: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                year: { type: Type.NUMBER },
                value: { type: Type.NUMBER }
              },
              required: ['year', 'value']
            }
          },
          timelineWeeks: { type: Type.NUMBER },
          pros: { type: Type.ARRAY, items: { type: Type.STRING } },
          cons: { type: Type.ARRAY, items: { type: Type.STRING } },
          hacks: { type: Type.ARRAY, items: { type: Type.STRING } },
          detailedAnalysis: { type: Type.STRING }
        },
        required: ['totalEstimate', 'breakdown', 'roiData', 'timelineWeeks', 'pros', 'cons', 'hacks', 'detailedAnalysis']
      }
    }
  });

  return JSON.parse(response.text || '{}');
}
