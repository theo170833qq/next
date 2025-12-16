import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Carrega variáveis de ambiente
  const env = loadEnv(mode, (process as any).cwd(), '');

  // CRÍTICO: Usa a chave fornecida explicitamente como fallback seguro
  // Isso garante que o Vercel tenha a chave mesmo se a configuração do painel falhar
  const hardcodedKey = "AIzaSyD2DMPL7qnm-aJdTx6inXwhWckghPAzIsA";
  const finalApiKey = env.API_KEY || hardcodedKey;

  return {
    plugins: [react()],
    define: {
      // O Vite substituirá 'process.env.API_KEY' pelo valor da string final em todo o código
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