import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      includeAssets: ['favicon.svg', 'pwa-192x192.png', 'pwa-512x512.png'],
      manifest: {
        name: 'Lemar Date Converter',
        short_name: 'Lemar',
        description: 'Professional Miladi, Shamsi, and Qamari date converter with premium glassmorphic UI.',
        theme_color: '#eef2ff',
        background_color: '#eef2ff',
        display: 'standalone',
        display_override: ['window-controls-overlay', 'standalone', 'minimal-ui'],
        orientation: 'portrait-primary',
        categories: ['utilities', 'productivity'],
        shortcuts: [
          {
            name: 'Solar Hijri (Shamsi)',
            short_name: 'Shamsi',
            description: 'Convert dates to Solar Hijri',
            url: '/?view=shamsi',
            icons: [{ src: 'pwa-192x192.png', sizes: '192x192' }]
          },
          {
            name: 'Lunar Hijri (Qamari)',
            short_name: 'Qamari',
            description: 'Convert dates to Lunar Hijri',
            url: '/?view=qamari',
            icons: [{ src: 'pwa-192x192.png', sizes: '192x192' }]
          },
          {
            name: 'Gregorian (Miladi)',
            short_name: 'Miladi',
            description: 'Convert dates to Gregorian',
            url: '/?view=miladi',
            icons: [{ src: 'pwa-192x192.png', sizes: '192x192' }]
          }
        ],
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json}'],
        maximumFileSizeToCacheInBytes: 5242880, // Allow assets up to 5MiB (fixes 2.73MB profile pic error)
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    })
  ],
})
