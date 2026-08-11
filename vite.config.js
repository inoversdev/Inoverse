import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        // Split the heavy libraries into their own chunks (2026-08-11,
        // Mat's call — the single 899kB bundle made the site feel heavy):
        //  - three: the WebGL universe. Changes rarely → caches long.
        //  - gsap: the animation engine (+ ScrollTrigger plugin).
        // The app chunk shrinks, so the browser parses and paints text
        // content faster; library chunks stay warm in cache between deploys.
        // NOTE: Vite 8 (rolldown) only accepts manualChunks as a FUNCTION
        // — the rollup object form is invalid here.
        manualChunks(id) {
          if (id.includes('node_modules/three')) return 'three'
          if (id.includes('node_modules/gsap')) return 'gsap'
        },
      },
    },
  },
})
