import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    chunkSizeWarningLimit: 2500, // Supress the 500kb warnings for PDF processing tools
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('client/node_modules/pdf-lib') || id.includes('pdf-lib') || id.includes('pdfjs-dist')) return 'pdf-engine';
          if (id.includes('docx')) return 'docx-engine';
          if (id.includes('react') || id.includes('react-dom')) return 'react-vendor';
        }
      }
    }
  }
})
