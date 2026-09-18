export const config = {
  brand: (import.meta as any).env?.VITE_BRAND_NAME || 'AX Creator Flow',
  tagline: (import.meta as any).env?.VITE_BRAND_TAGLINE || 'Self-documenting creator business powered by AX',
  // URL of the deployed CreatorKit boilerplate that serves the AX API
  axApiUrl: (import.meta as any).env?.VITE_AX_API_URL || '',
  calUsername: (import.meta as any).env?.VITE_CAL_USERNAME || '',
  calendlyUrl: (import.meta as any).env?.VITE_CALDLY_URL || '',
};