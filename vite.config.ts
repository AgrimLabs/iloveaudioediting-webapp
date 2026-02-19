import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'iLoveAudio',
        short_name: 'iLoveAudio',
        description: 'Simple, offline audio tools. No login required.',
        theme_color: '#2563eb',
        background_color: '#f9fafb',
      },
      workbox: {
        // Cache FFmpeg.wasm from CDN for offline use
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/cdn\.jsdelivr\.net\/npm\/@ffmpeg\/core.*/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'ffmpeg-cache',
              expiration: { maxEntries: 1, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
        ],
      },
    }),
  ],
})
