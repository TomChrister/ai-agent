import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
    plugins: [
        react(),
        tailwindcss()
    ],
    // Local dev only: forward /api/* to the Express server (server.js) on :3000.
    // In production on Vercel, /api/* is served by the serverless functions in api/.
    server: {
        proxy: {
            '/api': 'http://localhost:3000',
        },
    },
})