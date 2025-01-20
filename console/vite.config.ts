import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import * as path from "node:path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, 'src'),
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://10.0.0.28:4000',
        changeOrigin: true,
      },
      '/icons': {
        target: 'http://10.0.0.28:4000',
        changeOrigin: true,
      }
    }
  }
})
