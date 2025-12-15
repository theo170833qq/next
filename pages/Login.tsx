import React, { useState, useEffect } from 'react';
import { supabase, checkDatabaseConnection } from '../services/supabase';
import { Mail, Lock, Loader2, ArrowRight, ShieldCheck, Sparkles, AlertCircle, Wifi, BarChart3, Globe, Zap } from 'lucide-react';

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
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden font-sans bg-[#020408]">
      
      {/* --- Dynamic Background --- */}
      <div className="absolute inset-0 z-0">
          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
          
          {/* Animated Orbs */}
          <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-indigo-600/30 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '8s' }}></div>
          <div className="absolute bottom-[-10%] right-[10%] w-[600px] h-[600px] bg-fuchsia-600/20 rounded-full blur-[128px] animate-float"></div>
          <div className="absolute top-[40%] left-[-10%] w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px]"></div>
      </div>

      {/* --- System Status (Floating Pill) --- */}
      <div className="absolute top-6 right-6 z-50 animate-fade-in">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full border backdrop-blur-xl transition-all duration-500 ${dbStatus === 'online' ? 'bg-emerald-500/5 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'bg-red-500/5 border-red-500/20'}`}>
              <div className="relative">
                 <div className={`w-2 h-2 rounded-full ${dbStatus === 'online' ? 'bg-emerald-400' : 'bg-red-400'}`}></div>
                 {dbStatus === 'online' && <div className="absolute inset-0 w-2 h-2 bg-emerald-400 rounded-full animate-ping opacity-75"></div>}
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-widest ${dbStatus === 'online' ? 'text-emerald-400' : 'text-red-400'}`}>
                  {dbStatus === 'online' ? 'Systems Online' : 'Connecting...'}
              </span>
          </div>
      </div>

      {/* --- Main Card --- */}
      <div className="w-full max-w-[1100px] min-h-[600px] grid grid-cols-1 md:grid-cols-2 gap-0 bg-onyx-900/40 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden relative z-10 animate-slide-up group">
        
        {/* Glow Effects inside card */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50"></div>

        {/* --- Left Side: Brand Experience --- */}
        <div className="hidden md:flex flex-col justify-between p-12 lg:p-16 relative overflow-hidden">
          {/* Decorative Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-purple-900/10 to-onyx-950/80 z-0"></div>
          
          {/* Content */}
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-gradient-to-tr from-white to-gray-400 rounded-xl flex items-center justify-center shadow-lg">
                        <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-onyx-950" stroke="currentColor" strokeWidth="3">
                            <path d="M12 2L2 7L12 12L22 7L12 2Z" />
                            <path d="M2 17L12 22L22 17" />
                            <path d="M2 12L12 17L22 12" />
                        </svg>
                    </div>
                    <span className="font-display font-bold text-2xl text-white tracking-tight">NEXT.AI</span>
                </div>

                <h1 className="text-4xl lg:text-5xl font-display font-bold text-white leading-[1.1] mb-6">
                  Inteligência <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">que escala</span> <br/>
                  seu negócio.
                </h1>
                <p className="text-gray-400 text-lg font-light leading-relaxed max-w-sm">
                  Dashboards financeiros, marketing generativo e consultoria executiva em uma única plataforma.
                </p>
            </div>

            {/* Floating Live Insight Card */}
            <div className="relative mt-8">
                 <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl opacity-30 blur"></div>
                 <div className="relative bg-onyx-900/90 border border-white/10 p-5 rounded-2xl shadow-xl backdrop-blur-md">
                     <div className="flex items-center justify-between mb-3">
                         <div className="flex items-center gap-2">
                             <div className="p-1.5 bg-indigo-500/20 rounded-lg">
                                 <Sparkles size={14} className="text-indigo-400" />
                             </div>
                             <span className="text-xs font-bold text-indigo-200">Insight Gerado Agora</span>
                         </div>
                         <span className="text-[10px] text-gray-500">12s atrás</span>
                     </div>
                     <p className="text-sm text-gray-300 font-medium leading-relaxed">
                        "Sua margem aumentou <span className="text-emerald-400 font-bold">+12%</span> após a otimização de custos fixos sugerida pela IA."
                     </p>
                 </div>
                 
                 {/* Decorative background elements behind card */}
                 <div className="absolute -z-10 top-[-20px] right-[-20px] w-24 h-24 bg-indigo-500/20 rounded-full blur-2xl"></div>
            </div>

            <div className="flex items-center gap-6 mt-8">
               <div className="flex -space-x-3">
                   {[1,2,3].map(i => (
                       <div key={i} className="w-8 h-8 rounded-full border-2 border-onyx-900 bg-gray-700 overflow-hidden">
                           <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i*34}`} alt="User" />
                       </div>
                   ))}
               </div>
               <div className="text-xs text-gray-400 font-medium">
                   Junte-se a <span className="text-white font-bold">2.400+</span> líderes.
               </div>
            </div>
          </div>
        </div>

        {/* --- Right Side: Login Form --- */}
        <div className="p-8 md:p-16 flex flex-col justify-center bg-black/20 relative">
            <div className="max-w-md mx-auto w-full">
                
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-white mb-2">
                        {isSignUp ? "Criar conta" : "Login"}
                    </h2>
                    <p className="text-gray-400 text-sm">
                        {isSignUp ? "Comece seu teste gratuito de 14 dias." : "Bem-vindo de volta ao cockpit."}
                    </p>
                </div>

                <form onSubmit={handleAuth} className="space-y-5">
                    
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider ml-1">Email Corporativo</label>
                        <div className="relative group">
                            <div className="absolute inset-0 bg-indigo-500/20 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-500"></div>
                            <div className="relative bg-white/5 border border-white/10 rounded-xl flex items-center transition-colors group-focus-within:border-indigo-500/50 group-focus-within:bg-white/10">
                                <Mail className="ml-4 text-gray-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
                                <input 
                                    type="email" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder="voce@empresa.com"
                                    className="w-full bg-transparent border-none p-4 text-white placeholder-gray-600 focus:ring-0 outline-none text-sm"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider ml-1">Senha</label>
                        <div className="relative group">
                            <div className="absolute inset-0 bg-indigo-500/20 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-500"></div>
                             <div className="relative bg-white/5 border border-white/10 rounded-xl flex items-center transition-colors group-focus-within:border-indigo-500/50 group-focus-within:bg-white/10">
                                <Lock className="ml-4 text-gray-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
                                <input 
                                    type="password" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    placeholder="••••••••"
                                    className="w-full bg-transparent border-none p-4 text-white placeholder-gray-600 focus:ring-0 outline-none text-sm"
                                />
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 animate-fade-in">
                            <AlertCircle className="text-red-400 shrink-0" size={16} />
                            <p className="text-red-200 text-xs font-medium">{error}</p>
                        </div>
                    )}
                    
                    {message && (
                        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center gap-3 animate-fade-in">
                            <ShieldCheck className="text-emerald-400 shrink-0" size={16} />
                            <p className="text-emerald-200 text-xs font-medium">{message}</p>
                        </div>
                    )}

                    <button 
                        type="submit"
                        disabled={loading}
                        className="w-full relative group overflow-hidden bg-white text-onyx-950 font-bold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                    >
                        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <span className="relative z-10 flex items-center group-hover:text-white transition-colors duration-300">
                             {loading ? <Loader2 className="animate-spin mr-2" size={18} /> : null}
                             {isSignUp ? "Criar Conta" : "Acessar Plataforma"}
                             {!loading && <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />}
                        </span>
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <button 
                        onClick={() => {
                            setIsSignUp(!isSignUp);
                            setError(null);
                            setMessage(null);
                        }}
                        className="text-xs text-gray-500 hover:text-white transition-colors"
                    >
                        {isSignUp ? "Já possui uma conta?" : "Ainda não tem acesso?"} <span className="text-indigo-400 font-bold ml-1">{isSignUp ? "Fazer Login" : "Cadastre-se"}</span>
                    </button>
                </div>
                
                {/* Footer decorations */}
                <div className="mt-12 flex justify-center gap-4 opacity-30 grayscale hover:grayscale-0 transition-all duration-500">
                     <Globe size={16} />
                     <ShieldCheck size={16} />
                     <Zap size={16} />
                </div>
            </div>
        </div>

      </div>
      
      {/* Footer Text */}
      <div className="absolute bottom-4 left-0 w-full text-center text-[10px] text-gray-600">
         &copy; 2024 Next Intelligence. Powered by Google Gemini.
      </div>
    </div>
  );
};

export default Login;
