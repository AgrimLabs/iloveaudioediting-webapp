import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  optimizeDeps: {
    // FFmpeg.wasm has worker loading issues with Vite's pre-bundling
    exclude: ['@ffmpeg/ffmpeg', '@ffmpeg/util'],
  },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'iLoveAudioEditing',
        short_name: 'iLoveAudioEditing',
        description: 'Simple, offline audio tools. No login required.',
        theme_color: '#e74c3c',
        background_color: '#f5f5f5',
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
