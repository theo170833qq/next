import React, { useState, useRef, useEffect } from 'react';
import { getStrategicAdvice } from '../services/gemini';
import { Send, User, Bot, Sparkles, MoreHorizontal, Paperclip } from 'lucide-react';

const Consultant: React.FC = () => {
  const [messages, setMessages] = useState<{role: 'user' | 'model', text: string}[]>([
    { role: 'model', text: 'Bem-vindo ao Next. Estou conectado à base de conhecimento global de negócios. Como posso acelerar sua empresa hoje?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    const history = messages.slice(-5).map(m => m.text);
    const response = await getStrategicAdvice(userMsg, history);
    
    setMessages(prev => [...prev, { role: 'model', text: response }]);
    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
    }
  }

  const suggestionChips = [
      "Criar uma estratégia de lançamento",
      "Análise SWOT rápida",
      "Melhorar retenção de clientes",
      "Ideias para reduzir CAC"
  ];

  return (
    // Height adjustments: 
    // Mobile: Use 85dvh (dynamic viewport height) to account for browser bars nicely, minus header/padding.
    // Desktop: h-[calc(100vh-6rem)] remains good.
    <div className="h-[75vh] md:h-[calc(100vh-6rem)] flex flex-col max-w-5xl mx-auto animate-slide-up">
        {/* Chat Header */}
        <div className="flex items-center justify-between mb-4 md:mb-6 glass-card p-4 rounded-2xl border border-white/5 shrink-0">
            <div className="flex items-center">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                    <Bot size={20} className="text-white md:w-6 md:h-6" />
                </div>
                <div className="ml-3 md:ml-4">
                    <h2 className="text-lg md:text-xl font-bold text-white">Next AI</h2>
                    <div className="flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                        <p className="text-xs text-indigo-300 font-medium">Online & Inteligente</p>
                    </div>
                </div>
            </div>
            <button className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400">
                <MoreHorizontal size={20} />
            </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 glass-panel border border-white/5 rounded-3xl overflow-hidden flex flex-col relative bg-onyx-900/50 min-h-0">
            {/* Background decoration */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-indigo-600/5 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 md:space-y-8 custom-scrollbar relative z-10">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} group`}>
                        <div className={`flex max-w-[95%] md:max-w-[70%] items-end ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                            
                            {/* Avatar */}
                            <div className={`hidden md:flex flex-shrink-0 h-8 w-8 rounded-full items-center justify-center mb-1 shadow-md ${msg.role === 'user' ? 'bg-gradient-to-r from-pink-500 to-rose-500 ml-3' : 'bg-indigo-600 mr-3'}`}>
                                {msg.role === 'user' ? <User size={14} className="text-white" /> : <Sparkles size={14} className="text-white" />}
                            </div>
                            
                            {/* Bubble */}
                            <div className={`p-4 md:p-5 rounded-2xl text-sm leading-relaxed shadow-lg backdrop-blur-sm ${
                                msg.role === 'user' 
                                ? 'bg-indigo-600 text-white rounded-br-none' 
                                : 'bg-white/10 text-gray-100 border border-white/5 rounded-bl-none'
                            }`}>
                                <div className="whitespace-pre-wrap font-sans text-[14px] md:text-[15px]">
                                    {msg.text.split('\n').map((line, i) => {
                                        // Basic formatting for Markdown-like bold
                                        const parts = line.split(/(\*\*.*?\*\*)/g);
                                        return (
                                            <p key={i} className="mb-2 last:mb-0">
                                                {parts.map((part, j) => {
                                                    if (part.startsWith('**') && part.endsWith('**')) {
                                                        return <strong key={j} className="font-bold text-white">{part.replace(/\*\*/g, '')}</strong>;
                                                    }
                                                    return part;
                                                })}
                                            </p>
                                        );
                                    })}
                                </div>
                                <span className="text-[10px] opacity-50 mt-2 block text-right">{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                            </div>
                        </div>
                    </div>
                ))}
                
                {loading && (
                    <div className="flex justify-start">
                         <div className="flex items-end">
                            <div className="hidden md:flex flex-shrink-0 h-8 w-8 rounded-full bg-indigo-600 mr-3 items-center justify-center">
                                <Sparkles size={14} className="text-white" />
                            </div>
                            <div className="bg-white/5 border border-white/5 rounded-2xl rounded-bl-none p-4 flex space-x-2 items-center">
                                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-75"></div>
                                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-150"></div>
                            </div>
                         </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 md:p-4 glass-panel border-t border-white/5 shrink-0">
                {/* Suggestions */}
                {messages.length < 3 && (
                    <div className="flex space-x-2 mb-4 overflow-x-auto pb-2 no-scrollbar">
                        {suggestionChips.map((chip, idx) => (
                            <button 
                                key={idx} 
                                onClick={() => setInput(chip)}
                                className="flex-shrink-0 px-3 py-1.5 md:px-4 md:py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-xs text-indigo-300 transition-colors whitespace-nowrap"
                            >
                                {chip}
                            </button>
                        ))}
                    </div>
                )}

                <div className="relative flex items-center gap-2">
                    <button className="p-2 md:p-3 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/5 hidden md:block">
                        <Paperclip size={20} />
                    </button>
                    <div className="flex-1 relative">
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Digite sua pergunta..."
                            className="w-full bg-black/40 border border-white/10 rounded-2xl pl-4 pr-4 py-3 md:py-4 text-white placeholder-gray-500 focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/50 outline-none transition-all text-sm md:text-base"
                        />
                    </div>
                    <button 
                        onClick={handleSend}
                        disabled={!input.trim() || loading}
                        className="p-3 md:p-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl transition-all disabled:opacity-50 disabled:bg-gray-800 shadow-lg shadow-indigo-900/40 hover:scale-105 active:scale-95 flex items-center justify-center"
                    >
                        <Send size={18} className="md:w-5 md:h-5" fill="currentColor" />
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
};

export default Consultant;