import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Carrega as variáveis de ambiente baseadas no modo atual
  const env = loadEnv(mode, (process as any).cwd(), '');

  // Tenta encontrar a chave em várias variações comuns de nome
  const apiKey = env.API_KEY || env.VITE_API_KEY || env.GOOGLE_API_KEY || "";

  if (!apiKey) {
    console.warn("⚠️ AVISO: Nenhuma API Key do Google Gemini encontrada nas variáveis de ambiente (API_KEY, VITE_API_KEY). O app pode não funcionar corretamente.");
  } else {
    console.log("✅ API Key detectada e injetada no build.");
  }

  return {
    plugins: [react()],
    define: {
      // Injeta a chave no código cliente de forma segura
      // O JSON.stringify é crucial para que o valor seja tratado como string literal no JS
      'process.env.API_KEY': JSON.stringify(apiKey),
    },
  };
});