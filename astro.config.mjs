import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://work.sreejita.dev',
  adapter: vercel(),
  integrations: [sitemap(), react()],
  vite: { plugins: [tailwindcss()] },
});

