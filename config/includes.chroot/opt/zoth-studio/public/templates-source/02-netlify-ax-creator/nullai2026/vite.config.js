import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Null AI',
        short_name: 'NullAI',
        description: 'NullAI — creator of Zoth Studio. Ghost Byte is the mark.',
        theme_color: '#00ff41',
        background_color: '#000000',
        display: 'standalone',
        icons: [
          {
            src: '/NullAI-Logo-NoBG.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:9000',
        changeOrigin: true,
      },
    },
  },
});
