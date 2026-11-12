import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      // repo root — lets the site import the spec itself (markdown ?raw, tokens JSON)
      '@spec': fileURLToPath(new URL('..', import.meta.url)),
    },
  },
})
