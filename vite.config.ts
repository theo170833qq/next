import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, (process as any).cwd(), '');

  // A chave é definida aqui para ser "embutida" no build do Vercel
  // Isso remove a necessidade de configurar no painel do Vercel manualmente
  const hardcodedKey = "AIzaSyDGTmixEnDHms2t-vXUuM3BwUn_ZYvPrFw";
  
  const rawApiKey = 
    env.API_KEY || 
    env.VITE_API_KEY || 
    env.GOOGLE_API_KEY || 
    env.NEXT_PUBLIC_API_KEY || 
    hardcodedKey;

  const apiKey = rawApiKey.replace(/["']/g, "").trim();

  return {
    plugins: [react()],
    // Define variáveis globais para substituir no código cliente durante o build
    define: {
      'process.env.API_KEY': JSON.stringify(apiKey),
      'import.meta.env.VITE_API_KEY': JSON.stringify(apiKey),
    },
    // Configurações para garantir compatibilidade de build no Vercel
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