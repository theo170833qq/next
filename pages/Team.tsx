import React, { useState } from 'react';
import { generateHRContent } from '../services/gemini';
import { Users2, FileText, MessageSquare, Sparkles, Copy, Loader2, Heart, Briefcase, Award, Settings, ShieldAlert } from 'lucide-react';

interface TeamProps {
  onNavigate?: (tab: string) => void;
}

const Team: React.FC<TeamProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'job_desc' | 'interview'>('job_desc');
  const [role, setRole] = useState('');
  const [culture, setCulture] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!role || !culture) return;
    setLoading(true);
    const content = await generateHRContent(role, culture, activeTab);
    setResult(content);
    setLoading(false);
  };

  return (
    <div className="space-y-6 animate-slide-up pb-20">
      <header className="flex flex-col md:flex-row gap-4 justify-between items-end">
        <div>
            <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase tracking-widest">Talent & Culture AI</span>
            </div>
            <h1 className="text-4xl font-extrabold text-white">Gestão de Talentos</h1>
            <p className="text-gray-400 mt-1">Crie descrições de vagas magnéticas e roteiros de entrevista cultural.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Input */}
        <div className="lg:col-span-4 space-y-6">
            
            <div className="glass-card p-1 rounded-2xl flex bg-onyx-900/50 border border-white/5">
                <button 
                    onClick={() => {setActiveTab('job_desc'); setResult('')}}
                    className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'job_desc' ? 'bg-cyan-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                >
                    <FileText size={16} /> Job Description
                </button>
                <button 
                    onClick={() => {setActiveTab('interview'); setResult('')}}
                    className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'interview' ? 'bg-cyan-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                >
                    <MessageSquare size={16} /> Entrevista
                </button>
            </div>

            <div className="glass-card p-6 rounded-3xl border border-white/5 space-y-5 relative overflow-hidden bg-gradient-to-b from-cyan-900/10 to-onyx-900">
                
                <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                        <Briefcase size={14} className="text-cyan-400"/> Cargo / Posição
                    </label>
                    <input 
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        placeholder="Ex: Senior React Developer, Gerente de Marketing..."
                        className="w-full bg-onyx-950 border border-white/10 rounded-xl p-4 text-white focus:ring-1 focus:ring-cyan-500 outline-none transition-all placeholder-gray-600"
                    />
                </div>

                <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                        <Heart size={14} className="text-cyan-400"/> Vibe & Cultura da Empresa
                    </label>
                    <textarea 
                        value={culture}
                        onChange={(e) => setCulture(e.target.value)}
                        placeholder="Ex: Ambiente acelerado, foco em autonomia, remote-first, informal mas orientado a resultados..."
                        className="w-full bg-onyx-950 border border-white/10 rounded-xl p-4 text-white focus:ring-1 focus:ring-cyan-500 outline-none transition-all placeholder-gray-600 h-32 resize-none"
                    />
                </div>

                <button
                    onClick={handleGenerate}
                    disabled={loading || !role || !culture}
                    className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-4 rounded-xl flex items-center justify-center transition-all disabled:opacity-50 shadow-lg shadow-cyan-900/30 hover:scale-[1.02]"
                >
                    {loading ? <Loader2 className="animate-spin mr-2" /> : <Sparkles className="mr-2" size={18} />}
                    {loading ? "Gerando..." : "Criar Conteúdo de RH"}
                </button>
            </div>
            
            {/* Quick Tip */}
            <div className="glass-card p-4 rounded-2xl border border-white/5 flex gap-3 items-start">
                 <div className="p-2 bg-yellow-500/10 rounded-lg shrink-0">
                     <Award size={18} className="text-yellow-400" />
                 </div>
                 <div>
                     <h4 className="text-sm font-bold text-white">Dica Pro</h4>
                     <p className="text-xs text-gray-400 mt-1">Quanto mais detalhes sobre a cultura você der, mais alinhado será o texto com a "voz" da sua empresa.</p>
                 </div>
            </div>
        </div>

        {/* Right: Preview */}
        <div className="lg:col-span-8 h-full">
             <div className="glass-card rounded-3xl border border-white/5 h-full min-h-[600px] flex flex-col relative overflow-hidden bg-onyx-900/40">
                 
                 {/* Decorative Header */}
                 <div className="h-2 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500"></div>
                 
                 <div className="p-6 flex justify-between items-center border-b border-white/5">
                     <div className="flex gap-2">
                         <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                         <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                         <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                     </div>
                     {result && result !== 'API_KEY_MISSING' && (
                        <button onClick={() => navigator.clipboard.writeText(result)} className="text-gray-400 hover:text-white transition-colors">
                            <Copy size={18} />
                        </button>
                     )}
                 </div>

                 <div className="p-8 md:p-12 overflow-y-auto custom-scrollbar flex-1 relative">
                    {!result && !loading && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-600 opacity-40">
                            <Users2 size={64} className="mb-4" />
                            <p className="text-lg font-light">Aguardando parâmetros...</p>
                        </div>
                    )}

                    {loading && (
                        <div className="space-y-4 animate-pulse">
                            <div className="h-8 bg-white/10 rounded w-1/3 mb-8"></div>
                            <div className="h-4 bg-white/5 rounded w-full"></div>
                            <div className="h-4 bg-white/5 rounded w-full"></div>
                            <div className="h-4 bg-white/5 rounded w-3/4"></div>
                        </div>
                    )}

                    {result === 'API_KEY_MISSING' && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                            <ShieldAlert size={48} className="text-red-400 mb-4 animate-pulse" />
                            <h3 className="text-white font-bold text-lg mb-2">Configuração Necessária</h3>
                            <p className="text-gray-400 text-sm mb-6 max-w-md">
                                Para utilizar a Inteligência Artificial, você precisa conectar sua chave de API do Google Gemini.
                            </p>
                            <button 
                                onClick={() => onNavigate && onNavigate('api')}
                                className="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-red-100 border border-red-500/50 font-bold py-3 px-6 rounded-xl transition-all"
                            >
                                <Settings size={18} />
                                Configurar Chave Agora
                            </button>
                        </div>
                    )}

                    {result && result !== 'API_KEY_MISSING' && (
                        <div className="prose prose-invert max-w-none prose-headings:text-cyan-100 prose-strong:text-cyan-300">
                             <div className="whitespace-pre-wrap font-sans text-base leading-relaxed text-gray-300">
                                {result.split('\n').map((line, i) => {
                                    if (line.startsWith('#')) return <h2 key={i} className="text-2xl font-bold text-white mt-6 mb-4">{line.replace(/#/g, '')}</h2>
                                    if (line.startsWith('-')) return <li key={i} className="ml-4 mb-2">{line.replace('-', '')}</li>
                                    return <p key={i} className="mb-4">{line.replace(/\*\*/g, '')}</p>
                                })}
                             </div>
                        </div>
                    )}
                 </div>
             </div>
        </div>

      </div>
    </div>
  );
};

export default Team;