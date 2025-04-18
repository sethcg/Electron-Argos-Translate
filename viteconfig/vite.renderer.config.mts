import path from 'node:path'
import { defineConfig } from 'vite'
import react from "@vitejs/plugin-react-swc"
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config
export default defineConfig({
  root:'src/renderer',
  build: {
    rollupOptions: {
      input: {
        'windows/main': 'src/renderer/windows/main/index.html',
        'windows/splash': 'src/renderer/windows/splash/index.html',
      },
      output: {
        dir: '.vite/renderer'
      }
    },
  },
  resolve: {
    alias: {
      '~shared': path.resolve(__dirname, '../src/shared'),
      '~assets': path.resolve(__dirname, '../src/assets'),
      '~components': path.resolve(__dirname, '../src/renderer/components')
    },
  },
  plugins: [tailwindcss(), react()],
})
