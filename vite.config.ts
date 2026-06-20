import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { imagetools } from 'vite-imagetools';
import path from 'path';

export default defineConfig({
  // Honor the PORT env var (preview/hosting platforms assign one); fall back to 5173.
  server: {
    port: process.env.PORT ? Number(process.env.PORT) : 5173,
  },
  plugins: [
    react(),
    // Responsive image generation: append ?product or ?thumb to an import to get
    // a <picture> with AVIF/WebP/jpg srcsets. Used once real photography lands.
    imagetools({
      defaultDirectives: (url) => {
        if (url.searchParams.has('product')) {
          return new URLSearchParams('w=400;800;1200&format=avif;webp;jpg&as=picture');
        }
        if (url.searchParams.has('thumb')) {
          return new URLSearchParams('w=200;400&format=webp;jpg&as=picture');
        }
        return new URLSearchParams();
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
