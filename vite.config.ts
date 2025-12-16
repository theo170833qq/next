import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, (process as any).cwd(), '');

  // Ordem de prioridade para capturar a chave de API do ambiente de Deploy
  const rawApiKey = 
    env.API_KEY || 
    env.VITE_API_KEY || 
    env.GOOGLE_API_KEY || 
    env.NEXT_PUBLIC_API_KEY || 
    ""; // Fallback vazio para evitar erro de build se não houver chave

  // Limpeza da chave
  const apiKey = rawApiKey.replace(/["']/g, "").trim();

  return {
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(apiKey),
    },
  };
});