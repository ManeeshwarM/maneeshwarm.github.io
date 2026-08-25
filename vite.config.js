import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages serves project sites from /<repo-name>/, so every asset
  // path needs that prefix baked in at build time. Replace REPO_NAME below
  // with your actual repository name (case-sensitive, exactly as it
  // appears in the GitHub URL). Leave this as '/' only if you're deploying
  // to a <username>.github.io repo (a "user site", not a project site).
  base: '/',
})
