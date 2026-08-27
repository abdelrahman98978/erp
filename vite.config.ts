import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react()],
  server: {
    port: 3000,
    host: true
  },
  build: {
    copyPublicDir: false,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-i18next'],
          'vendor-charts': ['chart.js', 'react-chartjs-2'],
          'vendor-pdf': ['jspdf'],
          'vendor-xlsx': ['xlsx'],
          'vendor-icons': ['lucide-react'],
          'vendor-dates': ['date-fns'],
          'vendor-supabase': ['@supabase/supabase-js'],
          'vendor-sentry': ['@sentry/react']
        }
      }
    }
  }
})
