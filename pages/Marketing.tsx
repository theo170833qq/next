import React, { useState, useEffect } from 'react';
import { generateMarketingContent } from '../services/gemini';
import { Send, Copy, Loader2, Instagram, Linkedin, Twitter, Sparkles, Image as ImageIcon, Heart, MessageCircle, Share2, Bookmark, Music, Zap, TrendingUp, Activity, BarChart2 } from 'lucide-react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from 'recharts';

const Marketing: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState('Instagram');
  const [generatedContent, setGeneratedContent] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Dados simulados para a análise visual de "DNA Viral"
  const [viralMetrics, setViralMetrics] = useState([
    { subject: 'Emoção', A: 0, fullMark: 100 },
    { subject: 'Storytelling', A: 0, fullMark: 100 },
    { subject: 'Hook (Gancho)', A: 0, fullMark: 100 },
    { subject: 'Valor Prático', A: 0, fullMark: 100 },
    { subject: 'Call to Action', A: 0, fullMark: 100 },
  ]);

  const handleGenerate = async () => {
    if (!topic) return;
    setLoading(true);
    
    // Animação dos gráficos durante o carregamento
    const interval = setInterval(() => {
        setViralMetrics(prev => prev.map(m => ({ ...m, A: Math.floor(Math.random() * 80) + 20 })));
    }, 150);

    const content = await generateMarketingContent(topic, platform);
    
    clearInterval(interval);
    setLoading(false);
    setGeneratedContent(content);
    
    // Definir métricas finais "reais" baseadas no sucesso da geração (simulado para visual)
    setViralMetrics([
        { subject: 'Emoção', A: 85, fullMark: 100 },
        { subject: 'Storytelling', A: 92, fullMark: 100 },
        { subject: 'Hook (Gancho)', A: 98, fullMark: 100 },
        { subject: 'Valor Prático', A: 75, fullMark: 100 },
        { subject: 'Call to Action', A: 88, fullMark: 100 },
    ]);
  };

  const platforms = [
    { name: 'Instagram', icon: Instagram, color: 'text-pink-500', bg: 'bg-pink-500/10 border-pink-500/20', gradient: 'from-purple-500 to-orange-500' },
    { name: 'TikTok', icon: Music, color: 'text-cyan-400', bg: 'bg-cyan-400/10 border-cyan-400/20', gradient: 'from-cyan-400 to-pink-500' },
    { name: 'LinkedIn', icon: Linkedin, color: 'text-blue-500', bg: 'bg-blue-500/10 border-blue-500/20', gradient: 'from-blue-600 to-blue-400' },
    { name: 'Twitter', icon: Twitter, color: 'text-sky-400', bg: 'bg-sky-400/10 border-sky-400/20', gradient: 'from-sky-400 to-blue-500' },
  ];

  const activePlatformData = platforms.find(p => p.name === platform);

  return (
    <div className="h-full space-y-6 animate-slide-up pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-pink-500/20 text-pink-300 border border-pink-500/30 uppercase tracking-widest">IA Generativa v2.5</span>
            </div>
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400">
                Creator Studio
            </h1>
            <p className="text-gray-400 mt-1">Engenharia reversa de conteúdo viral.</p>
        </div>
        
        {generatedContent && (
             <div className="flex items-center gap-4 bg-emerald-500/5 border border-emerald-500/20 px-4 py-2 rounded-xl">
                <div className="text-right">
                    <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Potencial Viral</p>
                    <p className="text-xl font-black text-white">94<span className="text-sm text-emerald-500">%</span></p>
                </div>
                <div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <TrendingUp className="text-emerald-400" size={20} />
                </div>
             </div>
        )}
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
        
        {/* Left Column: Input & Controls */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card p-1 rounded-3xl border border-white/5 relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition duration-700"></div>
            
            <div className="bg-onyx-900/90 backdrop-blur-xl rounded-[22px] p-6 relative z-10 space-y-6">
                
                {/* Platform Selector */}
                <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 block flex items-center gap-2">
                        <Zap size={14} className="text-yellow-400" /> Canal de Distribuição
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                    {platforms.map((p) => {
                        const Icon = p.icon;
                        const isActive = platform === p.name;
                        return (
                        <button
                            key={p.name}
                            onClick={() => setPlatform(p.name)}
                            className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-300 relative overflow-hidden ${
                            isActive 
                            ? `border-${p.color.split('-')[1]}-500/50 bg-${p.color.split('-')[1]}-500/10` 
                            : 'bg-white/5 border-white/5 hover:bg-white/10'
                            }`}
                        >
                            {isActive && <div className={`absolute inset-0 bg-gradient-to-b ${p.gradient} opacity-10`}></div>}
                            <Icon size={20} className={isActive ? 'text-white' : 'text-gray-500'} />
                            <span className={`text-[10px] font-bold mt-2 ${isActive ? 'text-white' : 'text-gray-500'}`}>{p.name}</span>
                        </button>
                        )
                    })}
                    </div>
                </div>

                {/* Text Input */}
                <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 block flex items-center gap-2">
                        <Sparkles size={14} className="text-indigo-400" /> Prompt Criativo
                    </label>
                    <div className="relative group/input">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-pink-500 rounded-xl opacity-20 group-hover/input:opacity-50 transition duration-500 blur-sm"></div>
                        <textarea
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        className="relative w-full bg-onyx-950 border border-white/10 rounded-xl p-5 text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 h-40 resize-none transition-all"
                        placeholder="Ex: Crie um post provocativo sobre erros financeiros que empreendedores cometem no primeiro ano..."
                        />
                    </div>
                </div>

                {/* Generate Button */}
                <button
                onClick={handleGenerate}
                disabled={loading || !topic}
                className="w-full relative overflow-hidden group bg-white text-onyx-950 font-extrabold py-4 px-6 rounded-xl flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
                >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10 flex items-center group-hover:text-white transition-colors">
                    {loading ? <Loader2 className="animate-spin mr-2" /> : <Sparkles className="mr-2" size={18} />}
                    {loading ? "Processando..." : "Gerar Conteúdo"}
                </span>
                </button>
            </div>
          </div>

            {/* Viral DNA Chart (Only shows when loading or generated) */}
            {(loading || generatedContent) && (
                <div className="glass-card rounded-3xl p-6 border border-white/5 animate-slide-up">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center">
                        <Activity className="mr-2 text-pink-500" size={14} /> Análise de DNA Viral
                    </h3>
                    <div className="h-48 w-full -ml-4 relative">
                         {/* Centered Score */}
                         <div className="absolute inset-0 flex items-center justify-center pointer-events-none pl-4 pb-2 z-0">
                            <div className="w-16 h-16 rounded-full bg-indigo-500/10 flex items-center justify-center animate-pulse-slow">
                                <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                            </div>
                         </div>
                         
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={viralMetrics}>
                                <PolarGrid stroke="#334155" strokeOpacity={0.3} />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }} />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                <Radar
                                    name="Score"
                                    dataKey="A"
                                    stroke="#ec4899"
                                    strokeWidth={2}
                                    fill="#ec4899"
                                    fillOpacity={0.3}
                                />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}
        </div>

        {/* Right Column: Preview & Output */}
        <div className="lg:col-span-7 flex flex-col gap-6">
            
            {/* The Phone Mockup for Preview */}
            <div className="glass-card rounded-[2.5rem] p-8 border border-white/5 flex-1 relative min-h-[600px] flex items-center justify-center bg-black/40 shadow-2xl overflow-hidden">
                {/* Decorative Background Elements behind phone */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-indigo-500/10 via-transparent to-pink-500/10 blur-3xl pointer-events-none"></div>
                
                {!generatedContent && !loading && (
                    <div className="text-center text-gray-500 z-10">
                        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/5 group hover:border-indigo-500/30 transition-colors duration-500">
                            <ImageIcon size={32} className="group-hover:text-indigo-400 transition-colors" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Aguardando Input</h3>
                        <p className="font-light text-sm max-w-xs mx-auto">Configure a plataforma e o tópico para visualizar o preview em tempo real.</p>
                    </div>
                )}
                
                {loading && (
                    <div className="text-center z-10">
                        <div className="relative w-32 h-32 mx-auto mb-6">
                            <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full"></div>
                            <div className="absolute inset-0 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                            <div className="absolute inset-4 border-4 border-pink-500/20 rounded-full"></div>
                            <div className="absolute inset-4 border-4 border-pink-500 border-b-transparent rounded-full animate-spin direction-reverse duration-700"></div>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-1 animate-pulse">Criando...</h3>
                        <p className="text-indigo-300 text-xs font-mono">NEURAL_ENGINE_PROCESSING</p>
                    </div>
                )}

                {generatedContent && !loading && (
                     <div className="w-[320px] bg-white text-black rounded-[2rem] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] animate-slide-up relative z-10 border-4 border-onyx-900">
                        {/* Status Bar Mockup */}
                        <div className="h-6 bg-white flex justify-between items-center px-6 pt-2">
                             <span className="text-[10px] font-bold">9:41</span>
                             <div className="flex gap-1">
                                <div className="w-3 h-3 bg-black rounded-full"></div>
                                <div className="w-3 h-3 bg-transparent border border-black rounded-full"></div>
                             </div>
                        </div>

                        {/* Social Header */}
                        <div className="p-4 flex items-center border-b border-gray-100">
                            <div className={`w-9 h-9 rounded-full bg-gradient-to-tr ${activePlatformData?.gradient} p-[2px]`}>
                                <div className="w-full h-full bg-white rounded-full p-0.5 overflow-hidden">
                                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=NextUser" className="w-full h-full object-cover" alt="avatar" />
                                </div>
                            </div>
                            <div className="ml-3">
                                <span className="block font-bold text-sm leading-none mb-0.5">sua_empresa</span>
                                <span className="block text-[10px] text-gray-400 leading-none">Original Audio</span>
                            </div>
                            <span className="ml-auto text-gray-400">•••</span>
                        </div>

                        {/* Image Placeholder */}
                        <div className="aspect-[4/5] bg-gray-100 flex items-center justify-center relative overflow-hidden group">
                             <div className={`absolute inset-0 bg-gradient-to-br ${activePlatformData?.gradient} opacity-5 group-hover:opacity-10 transition-opacity`}></div>
                             <div className="text-center p-8 z-10">
                                <ImageIcon className="mx-auto text-gray-300 mb-3" size={40} />
                                <div className="bg-white/80 backdrop-blur-sm p-3 rounded-lg border border-gray-200 shadow-sm">
                                    <p className="text-[10px] text-gray-500 font-bold uppercase mb-1 text-left">Sugestão Visual IA:</p>
                                    <p className="text-xs text-gray-800 italic text-left leading-relaxed">
                                        "Imagem minimalista com alto contraste, fundo escuro, destacando o produto principal com iluminação neon..."
                                    </p>
                                </div>
                             </div>
                             
                             {/* Floating Reaction Bubbles (Decoration) */}
                             <div className="absolute bottom-4 right-4 flex flex-col gap-2 opacity-50">
                                 <Heart size={20} className="text-white fill-white drop-shadow-md" />
                                 <MessageCircle size={20} className="text-white drop-shadow-md" />
                                 <Share2 size={20} className="text-white drop-shadow-md" />
                             </div>
                        </div>

                        {/* Actions Bar */}
                        <div className="px-4 py-3 flex justify-between text-gray-800">
                            <div className="flex space-x-4">
                                <Heart size={24} className="cursor-pointer hover:text-red-500 transition-colors hover:scale-110 duration-200" />
                                <MessageCircle size={24} className="cursor-pointer hover:text-blue-500 transition-colors hover:scale-110 duration-200" />
                                <Share2 size={24} className="cursor-pointer hover:text-green-500 transition-colors hover:scale-110 duration-200" />
                            </div>
                            <Bookmark size={24} className="cursor-pointer hover:text-yellow-500 transition-colors" />
                        </div>

                        {/* Caption Area */}
                        <div className="px-4 pb-6">
                            <p className="text-sm font-bold mb-1">10.428 curtidas</p>
                            <div className="text-sm text-gray-800 space-y-1 max-h-40 overflow-y-auto custom-scrollbar-light pr-1">
                                <span className="font-bold mr-1">sua_empresa</span>
                                {/* Parser */}
                                {generatedContent.split('\n').map((line, i) => {
                                    if(line.trim() === '') return <br key={i}/>;
                                    // Hashtags
                                    if(line.includes('#')) {
                                        return line.split(' ').map((word, w) => 
                                            word.startsWith('#') ? <span key={w} className="text-blue-600 font-medium mr-1 cursor-pointer hover:underline">{word}</span> : word + ' '
                                        )
                                    }
                                    // Bolding
                                    const parts = line.split('**');
                                    if(parts.length > 1) {
                                        return (
                                            <span key={i} className="block mt-1">
                                                {parts.map((part, p) => p % 2 === 1 ? <span key={p} className="font-bold">{part}</span> : part)}
                                            </span>
                                        )
                                    }
                                    return <span key={i} className="block mt-1">{line}</span>
                                })}
                            </div>
                             <p className="text-[10px] text-gray-400 mt-2 uppercase tracking-wide">Ver todos os 342 comentários</p>
                             <p className="text-[10px] text-gray-400 uppercase tracking-wide">HÁ 2 HORAS</p>
                        </div>
                     </div>
                )}
            </div>
            
            {generatedContent && (
                <div className="flex justify-end gap-3 animate-fade-in">
                     <button className="flex items-center space-x-2 px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-gray-300 font-medium transition-colors border border-white/5">
                        <BarChart2 size={18} />
                        <span>Ver Analytics Previsto</span>
                    </button>
                    <button 
                        onClick={() => navigator.clipboard.writeText(generatedContent)}
                        className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-white font-bold transition-all shadow-lg shadow-indigo-900/40 hover:scale-105 active:scale-95"
                    >
                        <Copy size={18} />
                        <span>Copiar Legenda</span>
                    </button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Marketing;