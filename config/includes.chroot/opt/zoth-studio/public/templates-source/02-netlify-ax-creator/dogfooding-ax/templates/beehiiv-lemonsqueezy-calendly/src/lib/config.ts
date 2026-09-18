export const config = {
  brand: (import.meta as any).env?.VITE_BRAND_NAME || 'CreatorKit',
  tagline: (import.meta as any).env?.VITE_BRAND_TAGLINE || 'Turn your audience into income',
  product: (import.meta as any).env?.VITE_PRODUCT_NAME || 'CreatorKit License',
  price: (import.meta as any).env?.VITE_PRODUCT_PRICE || '$49',
  calendlyUrl: (import.meta as any).env?.VITE_CALDLY_URL || '',
};