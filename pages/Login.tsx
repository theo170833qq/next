import React, { useState, useEffect } from 'react';
import { supabase, checkDatabaseConnection } from '../services/supabase';
import { Mail, Lock, Loader2, ArrowRight, ShieldCheck, Sparkles, AlertCircle, Wifi } from 'lucide-react';

const Login: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [dbStatus, setDbStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  useEffect(() => {
    checkDatabaseConnection().then(({ status }) => setDbStatus(status));
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        setMessage("Cadastro realizado! Verifique seu email para confirmar a conta.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }
    } catch (err: any) {
      setError(err.message || "Ocorreu um erro na autenticação.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="fixed inset-0 bg-onyx-950 z-[-1]"></div>
      <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-pink-600/10 rounded-full blur-[100px]" />

      {/* System Status Badge (Top Right) */}
      <div className="absolute top-4 right-4 md:top-8 md:right-8 z-50">
          <div className={`flex items-center space-x-2 px-4 py-2 rounded-full border backdrop-blur-md ${dbStatus === 'online' ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
              <div className={`w-2 h-2 rounded-full ${dbStatus === 'online' ? 'bg-emerald-500 animate-pulse' : dbStatus === 'checking' ? 'bg-yellow-500 animate-bounce' : 'bg-red-500'}`}></div>
              <span className={`text-xs font-bold ${dbStatus === 'online' ? 'text-emerald-400' : 'text-gray-400'}`}>
                  {dbStatus === 'online' ? 'Banco de Dados Conectado' : dbStatus === 'checking' ? 'Conectando...' : 'Erro de Conexão'}
              </span>
              {dbStatus === 'online' && <Wifi size={14} className="text-emerald-500 ml-2" />}
          </div>
      </div>

      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 glass-card rounded-3xl border border-white/10 overflow-hidden shadow-2xl animate-slide-up">
        
        {/* Left Side: Branding */}
        <div className="hidden md:flex flex-col justify-between p-12 bg-gradient-to-br from-indigo-900/50 to-onyx-900/50 relative">
          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-8">
               <div className="relative w-10 h-10">
                  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                      <path d="M8 32V8L20 20L8 32Z" fill="#6366F1" />
                      <path d="M20 20V8L32 20V32L20 20Z" fill="#F43F5E" />
                  </svg>
               </div>
               <span className="font-extrabold text-2xl text-white tracking-tighter">NEXT</span>
            </div>
            
            <h2 className="text-4xl font-extrabold text-white leading-tight mb-6">
              Inteligência Artificial para <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-400">negócios do futuro.</span>
            </h2>
            <p className="text-indigo-200 text-lg leading-relaxed">
              Tenha acesso a dashboards financeiros, consultoria estratégica via IA e criação de conteúdo em uma única plataforma enterprise.
            </p>
          </div>

          <div className="relative z-10 space-y-4">
             <div className="flex items-center text-sm text-gray-400">
                <ShieldCheck className="mr-2 text-emerald-400" size={18} />
                <span>Dados criptografados de ponta a ponta</span>
             </div>
             <div className="flex items-center text-sm text-gray-400">
                <Sparkles className="mr-2 text-yellow-400" size={18} />
                <span>Powered by Gemini 2.5 Flash</span>
             </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="p-8 md:p-12 flex flex-col justify-center bg-onyx-900/80 backdrop-blur-sm">
          <div className="mb-8 text-center md:text-left">
            <h3 className="text-2xl font-bold text-white mb-2">
              {isSignUp ? "Crie sua conta corporativa" : "Bem-vindo de volta"}
            </h3>
            <p className="text-gray-400 text-sm">
              {isSignUp ? "Junte-se a milhares de empreendedores inovadores." : "Acesse seu painel de controle e insights."}
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email Corporativo</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-3.5 text-gray-500 group-focus-within:text-indigo-400 transition-colors" size={20} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="nome@empresa.com"
                  className="w-full bg-black/40 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-600 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Senha</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-3.5 text-gray-500 group-focus-within:text-indigo-400 transition-colors" size={20} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full bg-black/40 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-600 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 outline-none transition-all"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start">
                <AlertCircle className="text-red-400 mr-2 mt-0.5" size={16} />
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}
            
            {message && (
              <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-xl flex items-start">
                 <ShieldCheck className="text-green-400 mr-2 mt-0.5" size={16} />
                 <p className="text-green-300 text-sm">{message}</p>
              </div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-white hover:bg-gray-200 text-onyx-950 font-bold py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] flex items-center justify-center group disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  {isSignUp ? "Criar Conta Gratuita" : "Acessar Plataforma"}
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-gray-400 text-sm">
              {isSignUp ? "Já tem uma conta?" : "Ainda não tem acesso?"}
              <button 
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError(null);
                  setMessage(null);
                }}
                className="ml-2 text-indigo-400 hover:text-indigo-300 font-bold transition-colors"
              >
                {isSignUp ? "Fazer Login" : "Criar conta"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;