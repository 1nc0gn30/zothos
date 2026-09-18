const env = (import.meta as any).env || {};

export const config = {
  brandName: env.VITE_BRAND_NAME || 'Kitchen Kit',
  brandTagline: env.VITE_BRAND_TAGLINE || 'Digital recipe kits from a working chef',
  productName: env.VITE_PRODUCT_NAME || 'Recipe Kit Pack',
  productPrice: env.VITE_PRODUCT_PRICE || '$29',
  calUsername: env.VITE_CAL_USERNAME || 'yourname',
  chefName: env.VITE_CHEF_NAME || 'Chef',
  cuisine: env.VITE_CUISINE || 'modern American',
};