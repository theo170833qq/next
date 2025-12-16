import React, { useState } from 'react';
import { generateSupportReply } from '../services/gemini';
import { LifeBuoy, MessageCircle, Heart, Copy, Loader2, Smile, Frown, Meh, Zap } from 'lucide-react';

const Support: React.FC = () => {
  const [message, setMessage] = useState('');
  const [tone, setTone] = useState('Empático e Profissional');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!message) return;
    setLoading(true);
    const content = await generateSupportReply(message, tone);
    setResult(content);
    setLoading(false);
  };

  return (
    <div className="space-y-6 animate-slide-up pb-20">
      <header className="flex flex-col md:flex-row gap-4 justify-between items-end">
        <div>
            <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30 uppercase tracking-widest">Customer Hero AI</span>
            </div>
            <h1 className="text-4xl font-extrabold text-white">Suporte Inteligente</h1>
            <p className="text-gray-400 mt-1">Análise de sentimento e respostas rápidas para seus clientes.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Input */}
        <div className="lg:col-span-5 space-y-6">
            <div className="glass-card p-6 rounded-3xl border border-white/5 space-y-5 bg-gradient-to-b from-teal-900/20 to-onyx-900">
                
                <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                        <MessageCircle size={14} className="text-teal-400"/> Mensagem do Cliente
                    </label>
                    <div className="relative group">
                        <textarea 
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Cole aqui o e-mail ou ticket do cliente..."
                            className="w-full bg-onyx-950 border border-white/10 rounded-xl p-4 text-white focus:ring-1 focus:ring-teal-500 outline-none transition-all placeholder-gray-600 h-40 resize-none"
                        />
                         {/* Quick Actions Overlay */}
                         {message && (
                             <div className="absolute bottom-3 right-3 flex gap-2">
                                <span className="px-2 py-1 bg-white/10 rounded text-[10px] text-gray-400">{message.length} chars</span>
                             </div>
                         )}
                    </div>
                </div>

                <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                        <Heart size={14} className="text-teal-400"/> Tom da Resposta
                    </label>
                    <select 
                        value={tone}
                        onChange={(e) => setTone(e.target.value)}
                        className="w-full bg-onyx-950 border border-white/10 rounded-xl p-4 text-white focus:ring-1 focus:ring-teal-500 outline-none transition-all appearance-none"
                    >
                        <option>Empático e Profissional</option>
                        <option>Direto e Técnico</option>
                        <option>Descontraído e Amigável</option>
                        <option>Formal e Pedindo Desculpas</option>
                    </select>
                </div>

                <button
                    onClick={handleGenerate}
                    disabled={loading || !message}
                    className="w-full bg-teal-600 hover:bg-teal-500 text-white font-bold py-4 rounded-xl flex items-center justify-center transition-all disabled:opacity-50 shadow-lg shadow-teal-900/30 hover:scale-[1.02]"
                >
                    {loading ? <Loader2 className="animate-spin mr-2" /> : <Zap className="mr-2" size={18} />}
                    {loading ? "Analisando..." : "Gerar Resposta"}
                </button>
            </div>
        </div>

        {/* Right: Output */}
        <div className="lg:col-span-7 h-full">
             <div className="glass-card rounded-3xl border border-white/5 h-full min-h-[500px] flex flex-col relative overflow-hidden bg-onyx-900/60">
                 
                 <div className="p-6 flex justify-between items-center border-b border-white/5">
                     <h3 className="font-bold text-white flex items-center gap-2">
                        <LifeBuoy size={18} className="text-teal-400" /> Resposta Sugerida
                     </h3>
                     {result && (
                        <button onClick={() => navigator.clipboard.writeText(result)} className="text-gray-400 hover:text-white transition-colors">
                            <Copy size={18} />
                        </button>
                     )}
                 </div>

                 <div className="p-8 overflow-y-auto custom-scrollbar flex-1 relative">
                    {!result && !loading && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-600 opacity-40">
                            <div className="flex gap-4 mb-4">
                                <Smile size={32} />
                                <Meh size={32} />
                                <Frown size={32} />
                            </div>
                            <p className="text-sm font-bold">Cole uma mensagem para começar</p>
                        </div>
                    )}

                    {loading && (
                        <div className="flex flex-col items-center justify-center h-full">
                            <div className="w-16 h-16 border-4 border-teal-500/20 border-t-teal-500 rounded-full animate-spin mb-4"></div>
                            <p className="text-teal-400 font-mono text-xs animate-pulse">DETECTANDO_SENTIMENTO...</p>
                        </div>
                    )}

                    {result && (
                        <div className="prose prose-invert max-w-none">
                             <div className="whitespace-pre-wrap font-sans text-base leading-relaxed text-gray-200">
                                {result.split('\n').map((line, i) => {
                                    if (line.includes('Positivo')) return <span key={i} className="inline-block px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs font-bold mb-4">{line}</span>
                                    if (line.includes('Negativo') || line.includes('Furioso')) return <span key={i} className="inline-block px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs font-bold mb-4">{line}</span>
                                    if (line.includes('Neutro')) return <span key={i} className="inline-block px-2 py-1 bg-gray-500/20 text-gray-400 rounded text-xs font-bold mb-4">{line}</span>
                                    return <p key={i} className="mb-3">{line.replace(/\*\*/g, '')}</p>
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

export default Support;