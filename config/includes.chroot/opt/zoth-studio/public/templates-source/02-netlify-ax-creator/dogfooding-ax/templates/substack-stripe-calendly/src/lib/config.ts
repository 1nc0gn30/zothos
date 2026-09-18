export const config = {
  brand: (import.meta as any).env?.VITE_BRAND_NAME || 'The Minimalist Writer',
  tagline: (import.meta as any).env?.VITE_BRAND_TAGLINE || 'Write. Publish. Get paid.',
  product: (import.meta as any).env?.VITE_PRODUCT_NAME || 'The Minimalist Writing Guide',
  price: (import.meta as any).env?.VITE_PRODUCT_PRICE || '$19',
  calendlyUrl: (import.meta as any).env?.VITE_CALDLY_URL || '',
};