import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, (process as any).cwd(), '');

  // Ordem de prioridade para encontrar a chave
  // Adicionado NEXT_PUBLIC_API_KEY para compatibilidade
  const rawApiKey = 
    env.API_KEY || 
    env.VITE_API_KEY || 
    env.GOOGLE_API_KEY || 
    env.NEXT_PUBLIC_API_KEY || 
    "";

  // Limpeza da chave (remove aspas extras ou espaços que podem vir do .env)
  const apiKey = rawApiKey.replace(/["']/g, "").trim();

  if (!apiKey) {
    console.warn("⚠️ AVISO CRÍTICO: Nenhuma API Key encontrada. O app não funcionará corretamente.");
  } else {
    console.log(`✅ API Key injetada (Inicia com: ${apiKey.substring(0, 4)}...)`);
  }

  return {
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(apiKey),
    },
  };
});