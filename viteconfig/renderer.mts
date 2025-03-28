import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config
export default defineConfig({
  root: 'src/renderer/windows/main',
  build: {
    outDir: '../../.vite/renderer',
    rollupOptions: {
      external: ['electron'],
      input: {
        main_window: 'src/renderer/windows/main/index.html',
      },
    },
  },
  resolve: {
    alias: {
      '~shared': path.resolve(__dirname, '../src/shared'),
      '~assets': path.resolve(__dirname, '../src/assets'),
    },
  },
  plugins: [tailwindcss(), react()],
})
