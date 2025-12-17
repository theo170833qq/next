import React, { createContext, useState, useEffect, useContext, PropsWithChildren } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabase';
import { Session, User } from '@supabase/supabase-js';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: true,
  signOut: async () => {},
});

export const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Se não houver configuração, não tenta conectar para evitar erro de rede
    if (!isSupabaseConfigured()) {
      console.warn("Supabase não configurado. Modo offline/demo ativado.");
      setLoading(false);
      return;
    }

    // Busca a sessão inicial com tratamento de erro
    supabase.auth.getSession().then(({ data, error }) => {
      if (!error && data) {
        setSession(data.session);
        setUser(data.session?.user ?? null);
      }
      setLoading(false);
    }).catch(err => {
      console.error("Erro fatal ao inicializar Auth:", err);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    if (isSupabaseConfigured()) {
        await supabase.auth.signOut();
    }
    setUser(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ session, user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};