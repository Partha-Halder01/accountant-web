import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import compression from 'vite-plugin-compression'

export default defineConfig({
  plugins: [
    react(),
    compression({ algorithm: 'gzip', ext: '.gz', threshold: 1024 }),
    compression({ algorithm: 'brotliCompress', ext: '.br', threshold: 1024 }),
  ],
  base: '/',
  server: {
    port: 5173,
    allowedHosts: true,
  },
  build: {
    target: 'es2018',
    cssCodeSplit: true,
    sourcemap: false,
    assetsInlineLimit: 4096,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react-router')) return 'router'
            if (id.includes('lucide-react')) return 'icons'
            if (id.includes('react-helmet-async')) return 'helmet'
            if (id.includes('react')) return 'react'
            return 'vendor'
          }
        },
      },
    },
  },
})
