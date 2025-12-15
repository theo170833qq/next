import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, (process as any).cwd(), '');

  // Chave fornecida explicitamente para correção imediata
  // Nota: Em produção, recomenda-se mover isso para o arquivo .env
  const fixedApiKey = "AIzaSyBYtDLsP6BJ4LnrTc_1CEAgkFj5_jwuHGg";

  // Ordem de prioridade para encontrar a chave
  const rawApiKey = 
    env.API_KEY || 
    env.VITE_API_KEY || 
    env.GOOGLE_API_KEY || 
    env.NEXT_PUBLIC_API_KEY || 
    fixedApiKey;

  // Limpeza da chave (remove aspas extras ou espaços que podem vir do .env)
  const apiKey = rawApiKey.replace(/["']/g, "").trim();

  if (!apiKey) {
    console.warn("⚠️ AVISO CRÍTICO: Nenhuma API Key encontrada. O app não funcionará corretamente.");
  } else {
    // Mascara a chave nos logs para segurança básica
    const masked = apiKey.length > 10 
      ? `${apiKey.substring(0, 4)}...${apiKey.substring(apiKey.length - 4)}` 
      : '***';
    console.log(`✅ API Key injetada no build: ${masked}`);
  }

  return {
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(apiKey),
    },
  };
});