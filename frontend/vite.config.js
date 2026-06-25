import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: process.env.VITE_VP_BASE || '/',
  plugins: [react()],
  server: {
    host: true,
    port: 5177,
    proxy: {
      '/api': 'http://localhost:8003',
    },
  },
})
