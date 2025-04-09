import { defineConfig } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'

// https://vitejs.dev/config
export default defineConfig({
  build: {
    outDir: '.vite/main',
  },
  plugins: [
    viteStaticCopy({
      targets: [
        { src: './dist/translate_server.exe', dest: 'resources' },
        { src: './src/assets/packages/argos-packages.json', dest: 'resources' },
        { src: './src/assets/xx_sent_ud_sm', dest: 'resources' },
      ],
    }),
  ],
})
