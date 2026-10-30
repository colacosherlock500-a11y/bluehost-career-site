import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // `npm run dev:api` serves live Workday jobs on :8787; the site calls it as /api.
    proxy: { '/api': `http://localhost:${process.env.PORT ?? 8787}` },
  },
})
