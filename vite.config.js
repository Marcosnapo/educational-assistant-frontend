import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Configuración para el servidor de desarrollo (npm run dev)
  server: {
    host: '0.0.0.0', // Permite que el servidor de desarrollo escuche en todas las interfaces
    port: process.env.PORT || 5173, // Usa la variable de entorno PORT de Render, o 5173 por defecto
  },
  // Configuración para el servidor de previsualización (npm run preview)
  preview: {
    host: '0.0.0.0', // Permite que el servidor de previsualización escuche en todas las interfaces
    port: process.env.PORT || 4173, // Usa la variable de entorno PORT de Render, o 4173 por defecto
    // ¡CRUCIAL! Permite que Render acceda a tu aplicación
    allowedHosts: ['https://educational-assistant-frontend.onrender.com'],
  }
})
