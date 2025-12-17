import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Verificação de segurança para evitar crash na inicialização
const isValidUrl = (url: string | undefined) => {
  try {
    return url && new URL(url);
  } catch (_) {
    return false;
  }
};

// Usa valores fallback seguros se as envs não existirem
const finalUrl = isValidUrl(supabaseUrl) ? supabaseUrl : 'https://placeholder.supabase.co';
const finalKey = supabaseKey || 'placeholder-key';

export const supabase = createClient(finalUrl, finalKey);

export const isSupabaseConfigured = (): boolean => {
  return isValidUrl(supabaseUrl) && !!supabaseKey && supabaseUrl !== 'https://placeholder.supabase.co';
};

export const checkDatabaseConnection = async (): Promise<{ status: 'online' | 'offline', latency: number }> => {
  if (!isSupabaseConfigured()) {
     return { status: 'offline', latency: 0 };
  }

  const start = performance.now();
  try {
    const { error } = await supabase.auth.getSession();
    const end = performance.now();
    
    if (error) throw error;
    
    return { status: 'online', latency: Math.round(end - start) };
  } catch (error) {
    console.error("Supabase connection check failed:", error);
    return { status: 'offline', latency: 0 };
  }
};

export const saveBusinessMetric = async (metric: any) => {
  if (!isSupabaseConfigured()) return { error: "Supabase not configured" };
  return await supabase.from('business_metrics').insert(metric);
};