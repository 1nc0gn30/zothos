import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      port: 5173,
      strictPort: true, // Prevents Vite from hopping to 5174
      host: true,       // Helpful for Parrot OS/Linux networking
      hmr: {
        clientPort: 8888, // Tells Vite HMR to connect through the Netlify port
      },
    },
    html: {
      cspNonce: '757gas-nonce',
    },
  };
});
