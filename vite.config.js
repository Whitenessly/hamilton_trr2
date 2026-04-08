import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3001,
<<<<<<< HEAD
    host: true,
    allowedHosts: [
      'trr2.alithw.qzz.io', 
    ]
=======
    allowedHosts: trr2.alithw.qzz.io,
>>>>>>> acf462ddce5b3d43978c71a4c0df256bef8bdb5c
  },
})