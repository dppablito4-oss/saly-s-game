import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Dominio personalizado: love.sypablitodp.site → base es '/'
export default defineConfig({
  plugins: [react()],
  base: '/',
})
