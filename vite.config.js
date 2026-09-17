import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  // Dev server: bind to all interfaces so it works behind containers/proxies.
  server: {
    host: true,
    port: Number(process.env.PORT) || 5173,
    allowedHosts: true,
  },
  // `vite preview`: used only if the app is deployed as a Web Service.
  // Not recommended for production (no compression/caching like a static host).
  preview: {
    host: true,
    port: Number(process.env.PORT) || 4173,
    allowedHosts: true,
  },
});
