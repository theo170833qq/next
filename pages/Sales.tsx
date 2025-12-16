import React, { useState } from 'react';
import { generateSalesStrategy } from '../services/gemini';
import { PhoneCall, Mail, ShieldAlert, Sparkles, Copy, Loader2, ArrowRight, Target, Briefcase, Settings } from 'lucide-react';

interface SalesProps {
  onNavigate?: (tab: string) => void;
}

const Sales: React.FC<SalesProps> = ({ onNavigate }) => {
  const [mode, setMode] = useState<'cold_mail' | 'objection' | 'script'>('cold_mail');
  const [product, setProduct] = useState('');
  const [target, setTarget] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!product || !target) return;
    setLoading(true);
    const content = await generateSalesStrategy(product, target, mode);
    setResult(content);
    setLoading(false);
  };

  const modes = [
    { id: 'cold_mail', label: 'Cold Email B2B', icon: Mail, desc: 'E-mails de prospecção fria que convertem.' },
    { id: 'script', label: 'Roteiro de Ligação', icon: PhoneCall, desc: 'Script telefônico passo-a-passo.' },
    { id: 'objection', label: 'Quebra de Objeção', icon: ShieldAlert, desc: 'Respostas para "está caro" ou "não preciso".' },
  ];

  return (
    <div className="space-y-6 animate-slide-up pb-20">
      <header className="flex flex-col md:flex-row gap-4 justify-between items-end">
        <div>
            <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-500/20 text-orange-300 border border-orange-500/30 uppercase tracking-widest">Sales Master AI</span>
            </div>
            <h1 className="text-4xl font-extrabold text-white">Máquina de Vendas</h1>
            <p className="text-gray-400 mt-1">Gere scripts persuasivos, cold emails e contorne objeções instantaneamente.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Configuration */}
        <div className="lg:col-span-5 space-y-6">
            
            {/* Mode Selector */}
            <div className="grid grid-cols-1 gap-3">
                {modes.map((m) => {
                    const Icon = m.icon;
                    const isActive = mode === m.id;
                    return (
                        <button
                            key={m.id}
                            onClick={() => { setMode(m.id as any); setResult(''); }}
                            className={`flex items-center p-4 rounded-xl border transition-all text-left ${
                                isActive 
                                ? 'bg-orange-500/10 border-orange-500/40 text-white shadow-[0_0_15px_rgba(249,115,22,0.1)]' 
                                : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10'
                            }`}
                        >
                            <div className={`p-3 rounded-lg mr-4 ${isActive ? 'bg-orange-500 text-white' : 'bg-white/5'}`}>
                                <Icon size={20} />
                            </div>
                            <div>
                                <h3 className={`font-bold text-sm ${isActive ? 'text-white' : 'text-gray-300'}`}>{m.label}</h3>
                                <p className="text-xs text-gray-500 mt-0.5">{m.desc}</p>
                            </div>
                        </button>
                    )
                })}
            </div>

            {/* Inputs */}
            <div className="glass-card p-6 rounded-3xl border border-white/5 space-y-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>

                <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                        <Briefcase size={14} className="text-orange-400"/> O que você vende?
                    </label>
                    <input 
                        value={product}
                        onChange={(e) => setProduct(e.target.value)}
                        placeholder="Ex: Software de Gestão para Clínicas, Consultoria de SEO..."
                        className="w-full bg-onyx-950 border border-white/10 rounded-xl p-4 text-white focus:ring-1 focus:ring-orange-500 outline-none transition-all placeholder-gray-600"
                    />
                </div>

                <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                        <Target size={14} className="text-orange-400"/> Quem é o cliente (ou objeção)?
                    </label>
                    <textarea 
                        value={target}
                        onChange={(e) => setTarget(e.target.value)}
                        placeholder={mode === 'objection' ? 'Ex: Disse que o preço está acima do orçamento.' : 'Ex: Diretores Médicos de grandes hospitais.'}
                        className="w-full bg-onyx-950 border border-white/10 rounded-xl p-4 text-white focus:ring-1 focus:ring-orange-500 outline-none transition-all placeholder-gray-600 h-24 resize-none"
                    />
                </div>

                <button
                    onClick={handleGenerate}
                    disabled={loading || !product || !target}
                    className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-bold py-4 rounded-xl flex items-center justify-center transition-all disabled:opacity-50 shadow-lg shadow-orange-900/30 hover:scale-[1.02]"
                >
                    {loading ? <Loader2 className="animate-spin mr-2" /> : <Sparkles className="mr-2" size={18} />}
                    {loading ? "Gerando Estratégia..." : "Gerar Material de Vendas"}
                </button>
            </div>
        </div>

        {/* Right: Output */}
        <div className="lg:col-span-7 h-full flex flex-col">
            <div className="glass-card rounded-3xl border border-white/5 flex-1 flex flex-col relative overflow-hidden min-h-[500px]">
                
                {/* Header Output */}
                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-black/20">
                    <h3 className="font-bold text-white flex items-center gap-2">
                        <ArrowRight size={16} className="text-orange-500" /> Resultado Gerado
                    </h3>
                    {result && result !== 'API_KEY_MISSING' && (
                        <button 
                            onClick={() => navigator.clipboard.writeText(result)}
                            className="text-xs flex items-center gap-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg transition-colors"
                        >
                            <Copy size={12} /> Copiar
                        </button>
                    )}
                </div>

                {/* Content Area */}
                <div className="p-8 overflow-y-auto custom-scrollbar flex-1 relative">
                    {!result && !loading && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-600 p-8 text-center opacity-50">
                            <PhoneCall size={48} className="mb-4 text-gray-700" />
                            <p className="text-sm max-w-xs">Preencha os dados do seu produto e cliente para gerar scripts de alta conversão.</p>
                        </div>
                    )}

                    {loading && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <div className="w-16 h-16 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin mb-4"></div>
                            <p className="text-orange-400 font-mono text-xs animate-pulse">CRIANDO_ARGUMENTOS_PERSUASIVOS...</p>
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
                        <div className="prose prose-invert max-w-none prose-p:text-gray-300 prose-headings:text-white prose-strong:text-orange-200 prose-a:text-orange-400">
                             <div className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                                {result.split('\n').map((line, i) => (
                                    <p key={i} className="mb-3">{line.replace(/\*\*/g, '')}</p>
                                ))}
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

export default Sales;