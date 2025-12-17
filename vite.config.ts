import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Carrega as variáveis de ambiente baseadas no modo (development/production)
  // Utiliza '.' como diretório atual para evitar erro de tipagem no process.cwd()
  const env = loadEnv(mode, '.', '');

  return {
    plugins: [react()],
    // Define variáveis globais para serem substituídas durante o build
    define: {
      // O SDK @google/genai espera encontrar process.env.API_KEY.
      // Aqui injetamos o valor da variável VITE_GOOGLE_API_KEY (ou API_KEY) nesse objeto.
      'process.env.API_KEY': JSON.stringify(env.VITE_GOOGLE_API_KEY || env.API_KEY),
    },
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
  };
});