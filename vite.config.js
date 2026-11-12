import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Para publicar em um repositório GitHub Pages chamado "safe-on-orbit",
  // altere para base: "/safe-on-orbit/". Para domínio próprio, mantenha "/".
  base: "/",
})