import React, { useState } from 'react';
import { generateMarketingContent } from '../services/gemini';
import { Copy, Loader2, Instagram, Linkedin, Twitter, Sparkles, Image as ImageIcon, Heart, MessageCircle, Share2, Bookmark, Music, Zap, TrendingUp, Activity, BarChart2, Hash, Wand2, Battery, Wifi, Signal, PlusSquare, Search, User, Home } from 'lucide-react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

const Marketing: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState('Instagram');
  const [generatedContent, setGeneratedContent] = useState('');
  const [loading, setLoading] = useState(false);
  
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
    
    const interval = setInterval(() => {
        setViralMetrics(prev => prev.map(m => ({ ...m, A: Math.floor(Math.random() * 80) + 20 })));
    }, 150);

    const content = await generateMarketingContent(topic, platform);
    
    clearInterval(interval);
    setLoading(false);
    setGeneratedContent(content);
    
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

  const quickPrompts = [
      "Lançamento de produto: SaaS financeiro",
      "Bastidores: Um dia na vida do CEO",
      "Case de sucesso: Cliente economizou 30%",
      "Polêmica: Por que o modelo tradicional morreu"
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
                        <Sparkles size={14} className="text-indigo-400" /> Ideia ou Tópico
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
                    {/* Quick Prompts */}
                    <div className="mt-3 flex flex-wrap gap-2">
                        {quickPrompts.map((p, i) => (
                            <button 
                                key={i}
                                onClick={() => setTopic(p)} 
                                className="text-[10px] px-2 py-1 bg-white/5 hover:bg-white/10 border border-white/5 rounded-md text-gray-400 hover:text-indigo-300 transition-colors"
                            >
                                {p}
                            </button>
                        ))}
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
                    {loading ? <Loader2 className="animate-spin mr-2" /> : <Wand2 className="mr-2" size={18} />}
                    {loading ? "Processando..." : "Gerar Conteúdo"}
                </span>
                </button>
            </div>
          </div>

            {/* Viral DNA Chart (Only shows when loading or generated) */}
            {(loading || generatedContent) && (
                <div className="glass-card rounded-3xl p-6 border border-white/5 animate-slide-up">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center">
                        <Activity className="mr-2 text-pink-500" size={14} /> Score de Viralidade
                    </h3>
                    <div className="h-48 w-full -ml-4 relative">
                         <div className="absolute inset-0 flex items-center justify-center pointer-events-none pl-4 pb-2 z-0">
                            <div className="w-16 h-16 rounded-full bg-indigo-500/10 flex items-center justify-center animate-pulse-slow">
                                <div className="text-xl font-bold text-white">98</div>
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
            <div className="glass-card rounded-[3.5rem] p-4 border border-white/5 flex-1 relative min-h-[600px] flex items-center justify-center bg-[#050505] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden ring-[12px] ring-[#1a1d26] z-10">
                
                {/* Phone Notch/Dynamic Island */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[26px] bg-black rounded-b-3xl z-50 flex items-center justify-center">
                    <div className="w-16 h-2 bg-gray-900 rounded-full"></div>
                </div>

                {/* Status Bar Mock */}
                <div className="absolute top-2 w-full px-8 flex justify-between text-[10px] text-white/50 font-bold z-40">
                    <span>9:41</span>
                    <div className="flex gap-1.5 items-center">
                         <Signal size={10} />
                         <Wifi size={10} />
                         <Battery size={10} />
                    </div>
                </div>

                {/* Empty State / Loading State (SKELETON UI) */}
                {!generatedContent && (
                    <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden relative flex flex-col pt-8 animate-fade-in">
                        {/* Mock App Header */}
                        <div className="px-4 py-3 flex justify-between items-center border-b border-gray-100">
                             <div className="w-24 h-6 bg-gray-200 rounded animate-pulse"></div>
                             <div className="flex gap-3">
                                 <div className="w-6 h-6 bg-gray-200 rounded-full animate-pulse"></div>
                                 <div className="w-6 h-6 bg-gray-200 rounded-full animate-pulse"></div>
                             </div>
                        </div>

                        {/* Stories Skeleton */}
                        <div className="flex gap-3 px-4 py-3 overflow-hidden border-b border-gray-50">
                            {[1,2,3,4].map(i => (
                                <div key={i} className="flex flex-col items-center gap-1">
                                    <div className="w-14 h-14 rounded-full bg-gray-200 border-2 border-white ring-2 ring-gray-100 animate-pulse"></div>
                                    <div className="w-10 h-2 bg-gray-100 rounded animate-pulse"></div>
                                </div>
                            ))}
                        </div>

                        {/* Feed Post Skeleton */}
                        <div className="flex-1 p-0 space-y-4">
                            {/* Post Header */}
                            <div className="px-4 py-3 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
                                <div className="space-y-1">
                                    <div className="w-20 h-3 bg-gray-200 rounded animate-pulse"></div>
                                    <div className="w-12 h-2 bg-gray-100 rounded animate-pulse"></div>
                                </div>
                            </div>
                            
                            {/* Post Image Placeholder */}
                            <div className="aspect-[4/5] bg-gray-100 relative flex items-center justify-center">
                                {loading ? (
                                    <div className="text-center">
                                         <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4"></div>
                                         <p className="text-xs font-bold text-indigo-500 animate-pulse">CRIANDO VISUAL...</p>
                                    </div>
                                ) : (
                                    <div className="text-center text-gray-300">
                                        <ImageIcon size={48} className="mx-auto mb-2 opacity-50"/>
                                        <p className="text-xs font-medium uppercase tracking-widest">Aguardando Prompt</p>
                                    </div>
                                )}
                            </div>

                            {/* Post Actions & Text */}
                            <div className="px-4 space-y-3 pb-8">
                                <div className="flex justify-between">
                                    <div className="flex gap-3">
                                        <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
                                        <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
                                        <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
                                    </div>
                                    <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
                                </div>
                                <div className="w-32 h-3 bg-gray-200 rounded animate-pulse"></div>
                                <div className="space-y-1">
                                    <div className="w-full h-3 bg-gray-100 rounded animate-pulse"></div>
                                    <div className="w-full h-3 bg-gray-100 rounded animate-pulse"></div>
                                    <div className="w-2/3 h-3 bg-gray-100 rounded animate-pulse"></div>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Nav Mock */}
                        <div className="absolute bottom-0 w-full h-16 bg-white border-t border-gray-100 flex justify-around items-center px-4 pb-2">
                             <Home size={24} className="text-gray-300" />
                             <Search size={24} className="text-gray-300" />
                             <PlusSquare size={24} className="text-gray-300" />
                             <Heart size={24} className="text-gray-300" />
                             <User size={24} className="text-gray-300" />
                        </div>
                    </div>
                )}
                
                {/* Generated Content View */}
                {generatedContent && !loading && (
                     <div className="w-full h-full bg-white text-black rounded-[2.5rem] overflow-hidden shadow-2xl animate-slide-up relative z-10 flex flex-col pt-8">
                        
                        {/* Social App Header */}
                        <div className="p-3 flex items-center border-b border-gray-100 shrink-0 bg-white z-20 relative">
                            <div className={`w-8 h-8 rounded-full bg-gradient-to-tr ${activePlatformData?.gradient} p-[2px]`}>
                                <div className="w-full h-full bg-white rounded-full p-0.5 overflow-hidden">
                                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=NextUser" className="w-full h-full object-cover" alt="avatar" />
                                </div>
                            </div>
                            <div className="ml-2">
                                <span className="block font-bold text-xs leading-none mb-0.5">sua_marca</span>
                                <span className="block text-[9px] text-gray-400 leading-none">Patrocinado</span>
                            </div>
                            <span className="ml-auto text-gray-400 text-xs">•••</span>
                        </div>

                        {/* Scrollable Content */}
                        <div className="overflow-y-auto no-scrollbar pb-10 bg-white flex-1">
                            {/* Image Placeholder */}
                            <div className="aspect-[4/5] bg-gray-50 flex items-center justify-center relative group overflow-hidden">
                                <div className={`absolute inset-0 bg-gradient-to-br ${activePlatformData?.gradient} opacity-5`}></div>
                                <div className="p-6 text-center">
                                    <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-3">
                                        <ImageIcon className="text-gray-300" size={24} />
                                    </div>
                                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-2">Sugestão de Imagem</p>
                                    <p className="text-[12px] text-gray-600 italic leading-tight px-4 font-serif">
                                        "Uma imagem cinematográfica, iluminação de estúdio..."
                                    </p>
                                </div>
                            </div>

                            {/* Actions Bar */}
                            <div className="px-3 py-3 flex justify-between text-gray-800 bg-white">
                                <div className="flex space-x-4">
                                    <Heart size={22} className="hover:fill-red-500 hover:text-red-500 transition-colors cursor-pointer" />
                                    <MessageCircle size={22} className="cursor-pointer hover:text-gray-600"/>
                                    <Share2 size={22} className="cursor-pointer hover:text-gray-600"/>
                                </div>
                                <Bookmark size={22} className="cursor-pointer hover:text-gray-600"/>
                            </div>

                            {/* Caption Area */}
                            <div className="px-3 pb-8 bg-white">
                                <p className="text-xs font-bold mb-2">2.492 curtidas</p>
                                <div className="text-xs text-gray-800 space-y-1">
                                    <span className="font-bold mr-2">sua_marca</span>
                                    {generatedContent.split('\n').map((line, i) => {
                                        if(line.trim() === '') return <br key={i}/>;
                                        if(line.includes('#')) {
                                            return <span key={i} className="text-blue-900 block mt-2 font-medium">{line}</span>
                                        }
                                        return <span key={i} className="inline">{line.replace(/\*\*/g, '')} </span>
                                    })}
                                </div>
                                <p className="text-[10px] text-gray-400 mt-3 uppercase font-medium">Ver todos os 48 comentários</p>
                                <p className="text-[9px] text-gray-400 uppercase mt-1">Há 2 horas</p>
                            </div>
                        </div>

                         {/* Bottom Nav Mock (Always visible) */}
                        <div className="w-full h-16 bg-white border-t border-gray-100 flex justify-around items-center px-4 pb-2 shrink-0">
                             <Home size={24} className="text-black" />
                             <Search size={24} className="text-gray-300" />
                             <PlusSquare size={24} className="text-gray-300" />
                             <Heart size={24} className="text-gray-300" />
                             <User size={24} className="text-gray-300" />
                        </div>
                     </div>
                )}
            </div>
            
            {generatedContent && (
                <div className="flex justify-end gap-3 animate-fade-in">
                    <button 
                        onClick={() => navigator.clipboard.writeText(generatedContent)}
                        className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-white font-bold transition-all shadow-lg shadow-indigo-900/40 hover:scale-105 active:scale-95"
                    >
                        <Copy size={18} />
                        <span>Copiar Tudo</span>
                    </button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Marketing;