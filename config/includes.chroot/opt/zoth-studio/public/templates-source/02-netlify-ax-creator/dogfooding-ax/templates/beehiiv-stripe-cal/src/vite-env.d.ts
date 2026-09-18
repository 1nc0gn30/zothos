/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BRAND_NAME?: string;
  readonly VITE_BRAND_TAGLINE?: string;
  readonly VITE_PRODUCT_NAME?: string;
  readonly VITE_PRODUCT_PRICE?: string;
  readonly VITE_CAL_USERNAME?: string;
  readonly VITE_CALDLY_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
