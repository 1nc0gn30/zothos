import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

const manualChunks = (id: string) => {
  if (!id.includes('node_modules')) return undefined;
  if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) return 'react-vendor';
  if (id.includes('@google/genai')) return 'ai-vendor';
  if (id.includes('recharts') || id.includes('d3')) return 'viz-vendor';
  if (id.includes('motion')) return 'motion-vendor';
  return undefined;
};

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks,
      },
    },
  },
  server: {
    // HMR is disabled in AI Studio via DISABLE_HMR env var.
    // Do not modify-file watching is disabled to prevent flickering during agent edits.
    hmr: process.env.DISABLE_HMR !== 'true',
  },
});
