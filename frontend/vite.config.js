import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    proxy: {
      // tutte le chiamate che iniziano con /api saranno inoltrate a localhost:3000
      '/api': {
        target: 'http://localhost:30000',
        changeOrigin: true,
        secure: false,
        // pathRewrite: { '^/api': '' } // Se il server non ha bisogno di /api
      }
    }
  }
})
