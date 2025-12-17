import React, { useState, useEffect } from 'react';
import { supabase, checkDatabaseConnection } from '../services/supabase';
import { validateGeminiConnection } from '../services/gemini';
import { Mail, Lock, Loader2, ArrowRight, Zap, Hexagon, Activity, Database, ShieldCheck, Globe, Bot } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dbStatus, setDbStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [aiStatus, setAiStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [focusedField, setFocusedField] = useState<string | null>(null);

  useEffect(() => {
    checkDatabaseConnection().then(({ status }) => setDbStatus(status));
    validateGeminiConnection().then(({ success }) => setAiStatus(success ? 'online' : 'offline'));
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
    } catch (err: any) {
      if (err.message.includes("Invalid login credentials")) {
        setError("Credenciais incorretas.");
      } else {
        setError("Falha na autenticação.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden font-sans bg-[#020205] selection:bg-cyan-500/30 selection:text-white">
      
      {/* --- 1. Deep Space Background --- */}
      <div className="absolute inset-0 z-0 bg-[#020205]">
          {/* Volumetric Lights */}
          <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-indigo-900/20 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-cyan-900/10 rounded-full blur-[120px]"></div>
          
          {/* Infinite Grid Floor */}
          <div className="absolute bottom-[-30%] left-[-50%] right-[-50%] h-[100%] z-0 animate-move-grid"
               style={{
                   backgroundImage: 'linear-gradient(rgba(99, 102, 241, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(99, 102, 241, 0.3) 1px, transparent 1px)',
                   backgroundSize: '60px 60px',
                   maskImage: 'linear-gradient(to bottom, transparent 0%, black 40%, black 100%)',
                   WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 40%, black 100%)'
               }}>
          </div>
          
          {/* Floating Dust Particles - URL externa opcional, se falhar não quebra o app */}
          <div className="absolute inset-0 opacity-[0.03]"></div>
      </div>

      {/* --- 2. System Status Badge --- */}
      <div className="absolute top-8 right-8 z-50 animate-fade-in flex flex-col gap-2 items-end">
          {/* DB Status */}
          <div className={`flex items-center gap-3 px-4 py-2 rounded-full border backdrop-blur-md transition-all duration-500 ${dbStatus === 'online' ? 'bg-black/40 border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.15)]' : 'bg-red-900/20 border-red-500/30'}`}>
              <div className="relative flex h-2 w-2">
                {dbStatus === 'online' && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>}
                <span className={`relative inline-flex rounded-full h-2 w-2 ${dbStatus === 'online' ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
              </div>
              <span className={`text-[10px] font-bold tracking-widest uppercase ${dbStatus === 'online' ? 'text-emerald-400' : 'text-red-400'}`}>
                  {dbStatus === 'online' ? 'System Online' : 'Offline'}
              </span>
          </div>

          {/* AI Status */}
          <div className={`flex items-center gap-3 px-4 py-2 rounded-full border backdrop-blur-md transition-all duration-500 ${aiStatus === 'online' ? 'bg-black/40 border-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.15)]' : 'bg-orange-900/20 border-orange-500/30'}`}>
              <Bot size={12} className={aiStatus === 'online' ? 'text-blue-400' : 'text-orange-400'} />
              <span className={`text-[10px] font-bold tracking-widest uppercase ${aiStatus === 'online' ? 'text-blue-400' : 'text-orange-400'}`}>
                  {aiStatus === 'checking' ? 'Checking AI...' : aiStatus === 'online' ? 'AI Ready' : 'AI Config Missing'}
              </span>
          </div>
      </div>

      {/* --- 3. Main Crystal Card --- */}
      <div 
        className="w-full max-w-[1150px] min-h-[700px] grid grid-cols-1 lg:grid-cols-2 bg-[#090b12]/70 backdrop-blur-2xl rounded-[3rem] border border-white/10 relative z-10 shadow-[0_30px_80px_rgba(0,0,0,0.8)] overflow-hidden animate-slide-up lg:animate-float-card"
      >
        {/* Internal Glow Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50"></div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>

        {/* --- LEFT PANEL: 3D Visualization --- */}
        <div className="hidden lg:flex flex-col justify-between p-16 relative overflow-hidden bg-gradient-to-br from-[#0f111a] to-[#050608]">
            {/* Background Mesh */}
            <div className="absolute inset-0 opacity-20" style={{backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '30px 30px'}}></div>

            {/* --- THE REACTOR (CSS 3D) --- */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="relative w-[400px] h-[400px]">
                    
                    {/* Core Light */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100px] h-[100px] bg-indigo-600 rounded-full blur-[80px] animate-pulse"></div>

                    {/* Ring 1 - Vertical Spin */}
                    <div className="absolute inset-0 rounded-full border border-indigo-500/20 animate-spin-slow">
                        <div className="absolute top-0 left-1/2 w-3 h-3 bg-indigo-400 rounded-full blur-[2px] shadow-[0_0_15px_#818cf8]"></div>
                    </div>

                    {/* Ring 2 - Reverse Horizontal */}
                    <div className="absolute inset-10 rounded-full border border-cyan-500/20 animate-spin-reverse">
                        <div className="absolute bottom-0 left-1/2 w-2 h-2 bg-cyan-400 rounded-full blur-[1px] shadow-[0_0_10px_#22d3ee]"></div>
                    </div>

                    {/* Ring 3 - Tilted */}
                    <div className="absolute inset-20 rounded-full border border-fuchsia-500/10 border-dashed animate-spin-slow"></div>

                    {/* Center Core */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-gradient-to-br from-indigo-900 to-black rounded-full border border-white/10 flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.3)] z-10 backdrop-blur-md">
                        <Hexagon size={40} className="text-white fill-indigo-500/20 animate-pulse" strokeWidth={1.5} />
                    </div>

                    {/* Floating Data Widgets (Static 3D placement) */}
                    <div className="absolute top-10 right-10 bg-black/60 backdrop-blur-md border border-white/10 p-3 rounded-xl shadow-2xl flex items-center gap-3 animate-float" style={{animationDelay: '1s'}}>
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                            <Activity size={16} className="text-emerald-400"/>
                        </div>
                        <div>
                            <div className="h-1.5 w-12 bg-white/20 rounded-full mb-1"></div>
                            <div className="h-1.5 w-8 bg-white/10 rounded-full"></div>
                        </div>
                    </div>

                    <div className="absolute bottom-20 left-10 bg-black/60 backdrop-blur-md border border-white/10 p-3 rounded-xl shadow-2xl flex items-center gap-3 animate-float" style={{animationDelay: '2s'}}>
                        <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                            <Database size={16} className="text-indigo-400"/>
                        </div>
                        <span className="text-[10px] font-mono text-indigo-300">DATA_SYNC_OK</span>
                    </div>

                </div>
            </div>

            {/* Content Overlay */}
            <div className="relative z-20 h-full flex flex-col justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/10 border border-white/10 rounded-xl flex items-center justify-center backdrop-blur-md">
                         <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <span className="text-2xl font-display font-bold text-white tracking-tight">NEXT<span className="text-indigo-400">.AI</span></span>
                </div>

                <div className="pl-4 border-l-2 border-indigo-500/50">
                     <h2 className="text-4xl font-bold text-white mb-2 leading-tight">
                        Inteligência <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Preditiva</span>
                     </h2>
                     <p className="text-gray-400 text-sm max-w-xs leading-relaxed">
                        Transforme dados complexos em decisões estratégicas com nossa IA proprietária.
                     </p>
                </div>
            </div>
        </div>

        {/* --- RIGHT PANEL: Form --- */}
        <div className="p-10 md:p-20 flex flex-col justify-center relative bg-black/20">
            {/* Background Highlights */}
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="max-w-md mx-auto w-full relative z-10">
                <div className="mb-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-sm">
                         <ShieldCheck size={12} className="text-emerald-400" />
                         <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Acesso Corporativo</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-3">Bem-vindo</h2>
                    <p className="text-gray-400">Faça login para acessar seu dashboard.</p>
                </div>

                <form onSubmit={handleAuth} className="space-y-5">
                    
                    {/* Input Email - "Volumetric" Look */}
                    <div className="group">
                        <label className={`text-[10px] font-bold uppercase tracking-widest mb-1.5 block transition-colors ${focusedField === 'email' ? 'text-indigo-400' : 'text-gray-500'}`}>Email Corporativo</label>
                        <div className={`relative flex items-center bg-[#0d0f14] rounded-xl border transition-all duration-300 group-hover:border-white/20 ${focusedField === 'email' ? 'border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.15)] bg-[#12141c]' : 'border-white/10'}`}>
                            <div className="pl-4 pr-3">
                                <Mail size={18} className={`transition-colors ${focusedField === 'email' ? 'text-indigo-400' : 'text-gray-600'}`} />
                            </div>
                            <input 
                                type="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onFocus={() => setFocusedField('email')}
                                onBlur={() => setFocusedField(null)}
                                required
                                placeholder="usuario@empresa.com"
                                className="w-full bg-transparent border-none py-4 px-0 text-white placeholder-gray-700 focus:ring-0 outline-none text-sm font-medium"
                            />
                             {/* Status Indicator */}
                             {email.includes('@') && (
                                <div className="pr-4 animate-fade-in">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_#10b981]"></div>
                                </div>
                             )}
                        </div>
                    </div>

                    {/* Input Password */}
                    <div className="group">
                         <div className="flex justify-between items-center mb-1.5">
                            <label className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${focusedField === 'password' ? 'text-indigo-400' : 'text-gray-500'}`}>Senha</label>
                            <a href="#" className="text-[10px] text-gray-600 hover:text-white transition-colors">Esqueceu?</a>
                        </div>
                        <div className={`relative flex items-center bg-[#0d0f14] rounded-xl border transition-all duration-300 group-hover:border-white/20 ${focusedField === 'password' ? 'border-cyan-500 shadow-[0_0_15px_rgba(34,211,238,0.15)] bg-[#12141c]' : 'border-white/10'}`}>
                            <div className="pl-4 pr-3">
                                <Lock size={18} className={`transition-colors ${focusedField === 'password' ? 'text-cyan-400' : 'text-gray-600'}`} />
                            </div>
                            <input 
                                type="password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onFocus={() => setFocusedField('password')}
                                onBlur={() => setFocusedField(null)}
                                required
                                placeholder="••••••••"
                                className="w-full bg-transparent border-none py-4 px-0 text-white placeholder-gray-700 focus:ring-0 outline-none text-sm font-medium"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 animate-fade-in">
                            <Zap size={16} className="text-red-400 fill-red-400/20" />
                            <span className="text-red-200 text-xs font-bold">{error}</span>
                        </div>
                    )}

                    <button 
                        type="submit"
                        disabled={loading}
                        className="w-full relative overflow-hidden bg-white text-black font-bold py-4 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_0_30px_rgba(255,255,255,0.15)] mt-4 group"
                    >
                         <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-100 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                        <span className="relative z-10 flex items-center justify-center gap-2">
                             {loading ? <Loader2 className="animate-spin" size={20} /> : "Entrar na Plataforma"}
                             {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                        </span>
                    </button>
                </form>

                <div className="mt-10 flex items-center justify-center gap-2 opacity-40 hover:opacity-100 transition-opacity">
                    <Globe size={12} className="text-gray-400" />
                    <span className="text-[10px] text-gray-400 font-mono">ENCRYPTED_SESSION_ID: 0x8F2A...</span>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default Login;