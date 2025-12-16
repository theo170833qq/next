import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Removemos a definição complexa de process.env.API_KEY para evitar conflitos
  // O código agora usa a constante HARDCODED_KEY diretamente no arquivo
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'recharts', 'lucide-react', '@google/genai'],
        },
      },
    },
  },
});