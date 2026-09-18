import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about/index.html'),
        gallery: resolve(__dirname, 'gallery/index.html'),
        services: resolve(__dirname, 'services/index.html'),
        'services-forestry-mulching': resolve(__dirname, 'services/forestry-mulching/index.html'),
        'services-land-clearing': resolve(__dirname, 'services/land-clearing/index.html'),
        'services-site-preparation': resolve(__dirname, 'services/site-preparation/index.html'),
        'services-demolition': resolve(__dirname, 'services/demolition/index.html'),
        contact: resolve(__dirname, 'contact/index.html'),
        privacy: resolve(__dirname, 'privacy-policy/index.html'),
        terms: resolve(__dirname, 'terms-of-service/index.html'),
        'thank-you': resolve(__dirname, 'thank-you/index.html'),
        '404': resolve(__dirname, '404.html'),
      }
    }
  }
})
