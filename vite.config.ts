import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgrPlugin from 'vite-plugin-svgr'
import { VitePWA } from 'vite-plugin-pwa'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3001,
  },
  plugins: [
    react(),
    svgrPlugin(),
    tsconfigPaths(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['/assets/**/*.svg', '/assets/**/*.png', '/assets/**/*.ttf'],
      manifest: {
        name: 'Weekly Planner',
        short_name: 'Weekly Planner',
        icons: [
          {
            src: './assets/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: './assets/pwa-256x256.png',
            sizes: '256x256',
            type: 'image/png',
          },
        ],
        theme_color: '#5AC596',
        background_color: '#ffffff',
        display: 'standalone',
        description: 'Weekly Planner',
        screenshots: [
          {
            src: './assets/screenshots/1.png',
            sizes: '375x712',
            type: 'image/png',
          },
          {
            src: './assets/screenshots/2.png',
            sizes: '375x712',
            type: 'image/png',
          },
          {
            src: './assets/screenshots/3.png',
            sizes: '375x712',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
})
