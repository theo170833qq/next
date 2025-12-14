import React, { useState } from 'react';
import { generateMarketingContent } from '../services/gemini';
import { Send, Copy, Loader2, Instagram, Linkedin, Twitter, Sparkles, Image as ImageIcon, Heart, MessageCircle, Share2, Bookmark, Music } from 'lucide-react';

const Marketing: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState('Instagram');
  const [generatedContent, setGeneratedContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!topic) return;
    setLoading(true);
    const content = await generateMarketingContent(topic, platform);
    setGeneratedContent(content);
    setLoading(false);
  };

  const platforms = [
    { name: 'Instagram', icon: Instagram, color: 'text-pink-500', bg: 'bg-pink-500/10 border-pink-500/20' },
    { name: 'TikTok', icon: Music, color: 'text-cyan-400', bg: 'bg-cyan-400/10 border-cyan-400/20' },
    { name: 'LinkedIn', icon: Linkedin, color: 'text-blue-500', bg: 'bg-blue-500/10 border-blue-500/20' },
    { name: 'Twitter', icon: Twitter, color: 'text-sky-400', bg: 'bg-sky-400/10 border-sky-400/20' },
  ];

  return (
    <div className="h-full space-y-6 animate-slide-up">
      <header className="flex items-center justify-between">
        <div>
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-indigo-400">Creator Studio</h1>
            <p className="text-gray-400 mt-2">Geração de conteúdo viral potencializada por IA.</p>
        </div>
        <div className="hidden md:flex items-center space-x-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-300 text-sm font-medium">
            <Sparkles size={16} />
            <span>Modelo Gemini 2.5 Flash Ativo</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
        {/* Input Control Panel */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card p-6 rounded-3xl border border-white/5 space-y-6">
            <div>
                <label className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-4 block">Canal de Destino</label>
                <div className="grid grid-cols-2 gap-3">
                {platforms.map((p) => {
                    const Icon = p.icon;
                    const isActive = platform === p.name;
                    return (
                    <button
                        key={p.name}
                        onClick={() => setPlatform(p.name)}
                        className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-300 ${
                        isActive 
                        ? `${p.bg} ring-2 ring-offset-2 ring-offset-onyx-900 ring-${p.color.split('-')[1]}-500` 
                        : 'bg-white/5 border-white/5 hover:bg-white/10'
                        }`}
                    >
                        <Icon size={24} className={p.color} />
                        <span className="text-xs font-medium text-gray-300 mt-2">{p.name}</span>
                    </button>
                    )
                })}
                </div>
            </div>

            <div>
                <label className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-4 block">Prompt Criativo</label>
                <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-pink-500 rounded-2xl opacity-20 group-hover:opacity-40 transition duration-500 blur"></div>
                    <textarea
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="relative w-full bg-onyx-900 border border-white/10 rounded-xl p-5 text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 h-48 resize-none transition-all shadow-inner"
                    placeholder="Descreva sua ideia, produto ou tema. Ex: 'Um vídeo curto com dicas rápidas sobre produtividade para empreendedores...'"
                    />
                </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading || !topic}
              className="w-full relative overflow-hidden group bg-white text-onyx-950 font-extrabold py-4 px-6 rounded-xl flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10 flex items-center">
                  {loading ? <Loader2 className="animate-spin mr-2" /> : <Sparkles className="mr-2" size={18} />}
                  {loading ? "Criando Magia..." : "Gerar Conteúdo"}
              </span>
            </button>
          </div>
        </div>

        {/* Live Preview & Result */}
        <div className="lg:col-span-7 flex flex-col gap-6">
            
            {/* The Phone Mockup for Preview */}
            <div className="glass-card rounded-3xl p-1 border border-white/5 flex-1 relative min-h-[500px] flex items-center justify-center bg-black/20">
                {!generatedContent && !loading && (
                    <div className="text-center text-gray-500">
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                            <ImageIcon size={32} />
                        </div>
                        <p className="font-medium">O preview aparecerá aqui</p>
                    </div>
                )}
                
                {loading && (
                    <div className="text-center">
                        <div className="relative w-24 h-24 mx-auto mb-4">
                            <div className="absolute inset-0 border-4 border-indigo-500/30 rounded-full"></div>
                            <div className="absolute inset-0 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                        <p className="text-indigo-400 font-medium animate-pulse">A IA está escrevendo...</p>
                    </div>
                )}

                {generatedContent && !loading && (
                     <div className="w-full max-w-md bg-white text-black rounded-xl overflow-hidden shadow-2xl animate-slide-up mx-auto">
                        {/* Mock Social Header */}
                        <div className="p-3 flex items-center border-b border-gray-100">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 to-pink-600 p-[2px]">
                                <div className="w-full h-full bg-white rounded-full p-0.5">
                                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=NextUser" className="w-full h-full rounded-full" alt="avatar" />
                                </div>
                            </div>
                            <span className="ml-2 font-semibold text-sm">sua_marca_oficial</span>
                            <span className="ml-auto text-gray-400">...</span>
                        </div>

                        {/* Mock Image Placeholder */}
                        <div className="aspect-square bg-gray-100 flex items-center justify-center relative overflow-hidden group">
                             <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 to-pink-100 opacity-50"></div>
                             <div className="text-center p-8 z-10">
                                <ImageIcon className="mx-auto text-gray-400 mb-2" size={32} />
                                <p className="text-xs text-gray-500 font-medium px-4">
                                    Prompt Sugerido: <br/>
                                    <span className="italic text-indigo-600">"Visualize tech aesthetic..."</span>
                                </p>
                             </div>
                        </div>

                        {/* Actions */}
                        <div className="p-3 flex justify-between text-gray-800">
                            <div className="flex space-x-4">
                                <Heart size={24} className="hover:text-red-500 cursor-pointer transition-colors" />
                                <MessageCircle size={24} />
                                <Share2 size={24} />
                            </div>
                            <Bookmark size={24} />
                        </div>

                        {/* Caption Area */}
                        <div className="px-3 pb-4">
                            <p className="text-sm font-semibold mb-1">1,234 curtidas</p>
                            <div className="text-sm text-gray-800 space-y-1 max-h-60 overflow-y-auto custom-scrollbar-light">
                                 {/* Simple parser for bolding text */}
                                {generatedContent.split('\n').map((line, i) => {
                                    if(line.trim() === '') return <br key={i}/>
                                    if(line.includes('#')) return <span key={i} className="text-indigo-600 block mt-1">{line}</span>
                                    if(line.startsWith('**')) return <span key={i} className="font-bold block mt-2">{line.replace(/\*\*/g, '')}</span>
                                    return <span key={i} className="block">{line}</span>
                                })}
                            </div>
                             <p className="text-xs text-gray-400 mt-2 uppercase">HÁ 2 MINUTOS</p>
                        </div>
                     </div>
                )}
            </div>
            
            {generatedContent && (
                <div className="flex justify-end">
                    <button 
                        onClick={() => navigator.clipboard.writeText(generatedContent)}
                        className="flex items-center space-x-2 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-white font-medium transition-colors"
                    >
                        <Copy size={18} />
                        <span>Copiar Texto Completo</span>
                    </button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Marketing;