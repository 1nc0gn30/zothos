export const config = {
  brand: (import.meta as any).env?.VITE_BRAND_NAME || 'IndieKit',
  tagline:
    (import.meta as any).env?.VITE_BRAND_TAGLINE ||
    'Build in public. Sell for life.',
  product: (import.meta as any).env?.VITE_PRODUCT_NAME || 'Lifetime Deal',
  price: (import.meta as any).env?.VITE_PRODUCT_PRICE || '$79',
  calUsername: (import.meta as any).env?.VITE_CAL_USERNAME || '',
  // URL of the deployed CreatorKit boilerplate that serves the AX API
  axApiUrl: (import.meta as any).env?.VITE_AX_API_URL || '',
  // Build-in-public log URL (blog, changelog, Twitter thread, etc.)
  buildLogUrl: (import.meta as any).env?.VITE_BUILD_LOG_URL || '',
};