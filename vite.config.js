import { defineConfig } from 'vite'
import { resolve } from 'path'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        demo01: resolve(__dirname, 'demos/01-svg-gsap/index.html'),
        demo02: resolve(__dirname, 'demos/02-canvas/index.html'),
      }
    }
  }
})
