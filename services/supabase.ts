import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase com as credenciais fornecidas
const supabaseUrl = 'https://ffgoqeturuyhaqtxztga.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZmZ29xZXR1cnV5aGFxdHh6dGdhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU3Mzc5NjEsImV4cCI6MjA4MTMxMzk2MX0.SQOvk1uJzdazQjObBbwLhZxBCOYtMmsZjnWcMBxd3gI';

// Cria o cliente Supabase
export const supabase = createClient(supabaseUrl, supabaseKey);

export const isSupabaseConfigured = (): boolean => {
  return !!supabase;
};

// Testa a conexão real com o Supabase
export const checkDatabaseConnection = async (): Promise<{ status: 'online' | 'offline', latency: number }> => {
  const start = performance.now();
  try {
    // Tenta uma operação leve (verificar sessão) para validar a conexão com a API Gateway
    const { error } = await supabase.auth.getSession();
    const end = performance.now();
    
    if (error) throw error;
    
    return { status: 'online', latency: Math.round(end - start) };
  } catch (error) {
    console.error("Supabase connection check failed:", error);
    return { status: 'offline', latency: 0 };
  }
};

// Função auxiliar para salvar métricas (exemplo de uso do DB)
export const saveBusinessMetric = async (metric: any) => {
  if (!supabase) return { error: "Supabase not configured" };
  
  // Exemplo de insert seguro
  // Certifique-se de criar a tabela 'business_metrics' no seu painel do Supabase
  return await supabase.from('business_metrics').insert(metric);
};