import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Carrega as variáveis de ambiente baseadas no modo atual (development/production)
  const env = loadEnv(mode, (process as any).cwd(), '');

  return {
    plugins: [react()],
    define: {
      // Disponibiliza a API_KEY para o código de forma segura
      // Fallback adicionado para garantir que o deploy funcione mesmo sem configurar variáveis no servidor
      'process.env.API_KEY': JSON.stringify(env.API_KEY || "AIzaSyAjEtjExuQsSHbwUjrTTqgN4CtfUDSt3KE"),
    },
  };
});