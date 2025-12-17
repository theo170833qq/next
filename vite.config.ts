import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Carrega variáveis de ambiente
  const env = loadEnv(mode, (process as any).cwd(), '');

  // Chave fornecida pelo usuário como fallback prioritário
  const hardcodedKey = "AIzaSyD2DMPL7qnm-aJdTx6inXwhWckghPAzIsA";
  
  // Lógica: Usa a do Vercel (env) se existir, senão usa a hardcoded
  const finalApiKey = env.API_KEY || hardcodedKey;

  return {
    plugins: [react()],
    define: {
      // Injeção segura da variável para o client-side
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