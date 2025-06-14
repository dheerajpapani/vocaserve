import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/vocaserve/',
  plugins: [react()],
    server: {
    proxy: {
      '/vocabularies': 'https://vocaserve-backend.onrender.com'
    }
  }
})
