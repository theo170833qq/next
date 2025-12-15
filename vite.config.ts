import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, (process as any).cwd(), '');

  // Chave Fixa para garantir deploy no Vercel sem configuração extra
  const fixedApiKey = "AIzaSyBYtDLsP6BJ4LnrTc_1CEAgkFj5_jwuHGg";

  // Ordem de prioridade
  const rawApiKey = 
    env.API_KEY || 
    env.VITE_API_KEY || 
    env.GOOGLE_API_KEY || 
    env.NEXT_PUBLIC_API_KEY || 
    fixedApiKey;

  // Limpeza da chave
  const apiKey = rawApiKey.replace(/["']/g, "").trim();

  return {
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(apiKey),
    },
  };
});