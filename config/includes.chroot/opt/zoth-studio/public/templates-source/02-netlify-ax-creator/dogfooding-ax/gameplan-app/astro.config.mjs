import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://dogfooding-mission.netlify.app',
  integrations: [react()],
  output: 'static',
});
