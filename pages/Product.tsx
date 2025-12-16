import React, { useState } from 'react';
import { generateProductSpec } from '../services/gemini';
import { Code2, Target, Layers, Sparkles, Copy, Loader2, ListTodo, Bot, Settings, ShieldAlert } from 'lucide-react';

interface ProductProps {
  onNavigate?: (tab: string) => void;
}

const Product: React.FC<ProductProps> = ({ onNavigate }) => {
  const [featureName, setFeatureName] = useState('');
  const [userGoal, setUserGoal] = useState('');
  const [complexity, setComplexity] = useState('Média');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!featureName || !userGoal) return;
    setLoading(true);
    const content = await generateProductSpec(featureName, userGoal, complexity);
    setResult(content);
    setLoading(false);
  };

  return (
    <div className="space-y-6 animate-slide-up pb-20">
      <header className="flex flex-col md:flex-row gap-4 justify-between items-end">
        <div>
            <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-violet-500/20 text-violet-300 border border-violet-500/30 uppercase tracking-widest">Product Forge AI</span>
            </div>
            <h1 className="text-4xl font-extrabold text-white">Engenharia de Produto</h1>
            <p className="text-gray-400 mt-1">Transforme ideias em PRDs, User Stories e Specs técnicos.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Input */}
        <div className="lg:col-span-5 space-y-6">
            <div className="glass-card p-6 rounded-3xl border border-white/5 space-y-5 bg-gradient-to-b from-violet-900/20 to-onyx-900 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 to-fuchsia-500"></div>

                <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                        <Code2 size={14} className="text-violet-400"/> Nome da Feature
                    </label>
                    <input 
                        value={featureName}
                        onChange={(e) => setFeatureName(e.target.value)}
                        placeholder="Ex: Sistema de Login Social, Dashboard de Analytics..."
                        className="w-full bg-onyx-950 border border-white/10 rounded-xl p-4 text-white focus:ring-1 focus:ring-violet-500 outline-none transition-all placeholder-gray-600"
                    />
                </div>

                <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                        <Target size={14} className="text-violet-400"/> Objetivo do Usuário (Job to be Done)
                    </label>
                    <textarea 
                        value={userGoal}
                        onChange={(e) => setUserGoal(e.target.value)}
                        placeholder="Ex: Como usuário, quero poder logar com minha conta Google para não precisar decorar mais uma senha."
                        className="w-full bg-onyx-950 border border-white/10 rounded-xl p-4 text-white focus:ring-1 focus:ring-violet-500 outline-none transition-all placeholder-gray-600 h-28 resize-none"
                    />
                </div>

                <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                        <Layers size={14} className="text-violet-400"/> Complexidade Técnica
                    </label>
                    <div className="flex bg-onyx-950 rounded-xl p-1 border border-white/10">
                        {['Baixa', 'Média', 'Alta'].map(level => (
                            <button
                                key={level}
                                onClick={() => setComplexity(level)}
                                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${complexity === level ? 'bg-violet-600 text-white' : 'text-gray-500 hover:text-white'}`}
                            >
                                {level}
                            </button>
                        ))}
                    </div>
                </div>

                <button
                    onClick={handleGenerate}
                    disabled={loading || !featureName || !userGoal}
                    className="w-full bg-violet-600 hover:bg-violet-500 text-white font-bold py-4 rounded-xl flex items-center justify-center transition-all disabled:opacity-50 shadow-lg shadow-violet-900/30 hover:scale-[1.02]"
                >
                    {loading ? <Loader2 className="animate-spin mr-2" /> : <Bot className="mr-2" size={18} />}
                    {loading ? "Processando Specs..." : "Gerar PRD"}
                </button>
            </div>
        </div>

        {/* Right: Output */}
        <div className="lg:col-span-7 h-full">
             <div className="glass-card rounded-3xl border border-white/5 h-full min-h-[600px] flex flex-col relative overflow-hidden bg-onyx-900/60">
                 
                 <div className="p-5 flex justify-between items-center border-b border-white/5 bg-black/20">
                     <div className="flex items-center gap-2">
                         <ListTodo size={18} className="text-violet-400" />
                         <span className="font-mono text-xs text-violet-200">SPEC_OUTPUT.md</span>
                     </div>
                     {result && result !== 'API_KEY_MISSING' && (
                        <button onClick={() => navigator.clipboard.writeText(result)} className="text-gray-400 hover:text-white transition-colors">
                            <Copy size={16} />
                        </button>
                     )}
                 </div>

                 <div className="p-8 overflow-y-auto custom-scrollbar flex-1 relative font-mono text-sm">
                    {!result && !loading && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-600 opacity-40">
                            <Code2 size={64} className="mb-4" />
                            <p className="text-sm font-bold">Aguardando Input...</p>
                        </div>
                    )}

                    {loading && (
                        <div className="space-y-4 animate-pulse">
                            <div className="h-4 bg-violet-500/20 rounded w-1/3 mb-6"></div>
                            <div className="space-y-2">
                                <div className="h-3 bg-white/10 rounded w-full"></div>
                                <div className="h-3 bg-white/10 rounded w-full"></div>
                                <div className="h-3 bg-white/10 rounded w-3/4"></div>
                            </div>
                            <div className="h-4 bg-violet-500/20 rounded w-1/4 mt-6 mb-4"></div>
                            <div className="space-y-2">
                                <div className="h-3 bg-white/10 rounded w-full"></div>
                                <div className="h-3 bg-white/10 rounded w-5/6"></div>
                            </div>
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
                        <div className="prose prose-invert max-w-none prose-headings:text-violet-300 prose-code:text-violet-200 prose-strong:text-white">
                             <div className="whitespace-pre-wrap leading-relaxed">
                                {result}
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

export default Product;