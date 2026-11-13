import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://sreejita.dev',
  integrations: [sitemap(), react()],
  vite: { plugins: [tailwindcss()] },
});
