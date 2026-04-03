import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: true,
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('@mui') || id.includes('@emotion')) return 'ui';
            if (id.includes('firebase') || id.includes('@supabase')) return 'data';
            if (id.includes('framer-motion')) return 'animations';
            if (id.includes('@sentry')) return 'monitoring';
            return 'vendor';
          }
        }
      }
    }
  }
})
