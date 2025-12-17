import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Carrega variáveis de ambiente
  const env = loadEnv(mode, (process as any).cwd(), '');

  // CHAVE REAL FORNECIDA PELO USUÁRIO
  const finalApiKey = "AIzaSyD2DMPL7qnm-aJdTx6inXwhWckghPAzIsA";

  return {
    plugins: [react()],
    define: {
      // Injeção direta da chave
      'process.env.API_KEY': JSON.stringify(finalApiKey),
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