import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/personal_website/', // Set to '/repo-name/' if deploying to https://<USERNAME>.github.io/<REPO>/
})
