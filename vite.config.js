import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'

const page = (name) => fileURLToPath(new URL(`./${name}.html`, import.meta.url))

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        index: page('index'),
        services: page('services'),
        about: page('about'),
        partners: page('partners'),
        contact: page('contact'),
      },
    },
  },
})
