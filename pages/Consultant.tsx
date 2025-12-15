import React, { useState, useRef, useEffect } from 'react';
import { getStrategicAdvice } from '../services/gemini';
import { Send, User, Bot, Sparkles, Target, Activity, BrainCircuit, BarChart3, Briefcase, AlertTriangle, Settings, ChevronRight } from 'lucide-react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from 'recharts';

interface ConsultantProps {
  onNavigate?: (tab: string) => void;
}

const Consultant: React.FC<ConsultantProps> = ({ onNavigate }) => {
  const [messages, setMessages] = useState<{role: 'user' | 'model', text: string, isError?: boolean, isApiKeyError?: boolean}[]>([
    { role: 'model', text: 'Olá, CEO. Sou seu Advisor Executivo. Estou conectado aos dados de mercado. Posso ajudar a reavaliar seu Pricing, analisar riscos de expansão ou auditar sua eficiência operacional. Qual o foco de hoje?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [analysisData, setAnalysisData] = useState([
    { subject: 'Vendas', A: 80, fullMark: 150 },
    { subject: 'Marketing', A: 90, fullMark: 150 },
    { subject: 'Produto', A: 60, fullMark: 150 },
    { subject: 'Equipe', A: 70, fullMark: 150 },
    { subject: 'Finanças', A: 85, fullMark: 150 },
    { subject: 'Inovação', A: 65, fullMark: 150 },
  ]);

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

    const interval = setInterval(() => {
        setAnalysisData(prev => prev.map(item => ({
            ...item,
            A: Math.min(140, Math.max(20, item.A + (Math.random() * 40 - 20)))
        })));
    }, 200);

    try {
        const history = messages.slice(-5).map(m => m.text);
        const response = await getStrategicAdvice(userMsg, history);
        
        clearInterval(interval);
        
        if (response === 'API_KEY_ERROR_FLAG') {
            setMessages(prev => [...prev, { 
                role: 'model', 
                text: "A chave de API configurada é inválida ou expirou.", 
                isError: true,
                isApiKeyError: true 
            }]);
        } else {
             // Verifica se a resposta parece um erro genérico
            const isError = response.startsWith('⛔') || response.startsWith('⚠️');
            setMessages(prev => [...prev, { role: 'model', text: response, isError }]);
        }
        
    } catch (error) {
        clearInterval(interval);
        setMessages(prev => [...prev, { 
            role: 'model', 
            text: "Falha crítica ao conectar com o serviço de IA.", 
            isError: true 
        }]);
    } finally {
        setLoading(false);
    }
  };

  const handleExportPlan = () => {
    if(messages.length <= 1) return;

    const content = messages.map(m => `[${m.role === 'model' ? 'ADVISOR AI' : 'VOCÊ'}]:\n${m.text}\n-------------------`).join('\n\n');
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Plano_Estrategico_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
    }
  }

  const suggestionChips = [
      "Auditoria de Pricing (SaaS)",
      "Estratégia de Retenção de Clientes",
      "Análise de Risco: Expansão Internacional",
      "Otimização de Cash Burn"
  ];

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col lg:flex-row gap-6 animate-slide-up max-w-[1600px] mx-auto">
        
        {/* Left Panel: Chat Interface */}
        <div className="flex-1 flex flex-col h-full min-h-0">
             {/* Header */}
            <div className="flex items-center justify-between mb-4 glass-card p-4 rounded-2xl border border-white/5 shrink-0">
                <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(79,70,229,0.5)]">
                        <Bot size={20} className="text-white" />
                    </div>
                    <div className="ml-3">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                            Advisor Board AI
                        </h2>
                        <div className="flex items-center">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2 animate-pulse"></span>
                            <p className="text-xs text-gray-400 font-medium">Modo Estratégico Ativo</p>
                        </div>
                    </div>
                </div>
                <Briefcase className="text-gray-500 opacity-50" />
            </div>

            {/* Messages Area */}
            <div className="flex-1 glass-panel border border-white/5 rounded-3xl overflow-hidden flex flex-col relative bg-onyx-900/50">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-onyx-950/0 to-onyx-950/0 pointer-events-none"></div>
                
                <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 custom-scrollbar relative z-10">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} group animate-fade-in`}>
                            <div className={`flex max-w-[90%] md:max-w-[75%] items-end ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                
                                <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center mb-1 shadow-md ${
                                    msg.role === 'user' ? 'bg-white/10 ml-3' : 
                                    msg.isError ? 'bg-red-500/20 mr-3 border border-red-500/50' : 'bg-indigo-600 mr-3'
                                }`}>
                                    {msg.role === 'user' ? <User size={14} className="text-white" /> : 
                                     msg.isError ? <AlertTriangle size={14} className="text-red-400" /> : <Sparkles size={14} className="text-white" />}
                                </div>
                                
                                <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-lg backdrop-blur-md border ${
                                    msg.role === 'user' 
                                    ? 'bg-gradient-to-br from-indigo-600/80 to-indigo-800/80 text-white rounded-br-none border-indigo-500/30' 
                                    : msg.isError 
                                        ? 'bg-red-900/20 text-red-100 border-red-500/30 rounded-bl-none'
                                        : 'bg-white/5 text-gray-100 rounded-bl-none border-white/5'
                                }`}>
                                    <div className="whitespace-pre-wrap font-sans text-[14px] md:text-[15px]">
                                        {msg.text.split('\n').map((line, i) => {
                                            const parts = line.split(/(\*\*.*?\*\*)/g);
                                            return (
                                                <p key={i} className="mb-2 last:mb-0">
                                                    {parts.map((part, j) => {
                                                        if (part.startsWith('**') && part.endsWith('**')) {
                                                            return <strong key={j} className="font-bold shadow-purple-500/20 drop-shadow-sm">{part.replace(/\*\*/g, '')}</strong>;
                                                        }
                                                        return part;
                                                    })}
                                                </p>
                                            );
                                        })}
                                        
                                        {/* Botão de Correção de API Key */}
                                        {msg.isApiKeyError && (
                                            <div className="mt-4 pt-3 border-t border-red-500/30">
                                                <p className="text-xs text-red-200 mb-2 font-medium">Você precisa inserir uma chave válida.</p>
                                                <button 
                                                    onClick={() => onNavigate && onNavigate('api')}
                                                    className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded-lg text-red-100 text-xs font-bold transition-all hover:scale-105"
                                                >
                                                    <Settings size={14} />
                                                    Corrigir nas Configurações
                                                    <ChevronRight size={14} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    {loading && (
                        <div className="flex justify-start animate-fade-in">
                             <div className="flex items-end">
                                <div className="h-8 w-8 rounded-full bg-indigo-600 mr-3 flex items-center justify-center">
                                    <Sparkles size={14} className="text-white" />
                                </div>
                                <div className="bg-white/5 border border-white/5 rounded-2xl rounded-bl-none p-4 flex items-center space-x-3">
                                    <span className="text-xs text-indigo-300 font-medium">Processando cenário complexo...</span>
                                    <div className="flex space-x-1">
                                        <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></div>
                                        <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce delay-75"></div>
                                        <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce delay-150"></div>
                                    </div>
                                </div>
                             </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-3 md:p-4 glass-panel border-t border-white/5 shrink-0 bg-onyx-900/80">
                    {messages.length < 3 && (
                        <div className="flex space-x-2 mb-3 overflow-x-auto pb-1 no-scrollbar">
                            {suggestionChips.map((chip, idx) => (
                                <button 
                                    key={idx} 
                                    onClick={() => setInput(chip)}
                                    className="flex-shrink-0 px-3 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 rounded-full text-xs text-indigo-300 transition-all hover:scale-105 whitespace-nowrap"
                                >
                                    {chip}
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="relative flex items-center gap-2">
                        <div className="flex-1 relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-pink-500 rounded-2xl opacity-0 group-hover:opacity-30 transition duration-500 blur"></div>
                            <input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Ex: Analise meus custos fixos versus projeção de receita..."
                                className="relative w-full bg-onyx-950 border border-white/10 rounded-2xl pl-5 pr-4 py-4 text-white placeholder-gray-500 focus:ring-1 focus:ring-indigo-500/50 outline-none transition-all shadow-inner"
                            />
                        </div>
                        <button 
                            onClick={handleSend}
                            disabled={!input.trim() || loading}
                            className="p-4 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white rounded-2xl transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:scale-105 active:scale-95"
                        >
                            <Send size={20} fill="currentColor" />
                        </button>
                    </div>
                </div>
            </div>
        </div>

        {/* Right Panel: Strategic Vizualization (Hidden on mobile, visible on LG) */}
        <div className="hidden lg:flex w-80 xl:w-96 flex-col gap-6 h-full overflow-y-auto custom-scrollbar">
            
            {/* Radar Chart Card */}
            <div className="glass-card rounded-3xl p-6 border border-white/5 relative overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                     <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <Target size={16} className="text-pink-500" />
                        Radar de Performance
                     </h3>
                     <span className="text-[10px] text-gray-500 uppercase tracking-widest">Live</span>
                </div>
                <div className="h-64 w-full relative z-10 -ml-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={analysisData}>
                            <PolarGrid stroke="#334155" strokeOpacity={0.5} />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }} />
                            <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                            <Radar
                                name="Impacto"
                                dataKey="A"
                                stroke="#818cf8"
                                strokeWidth={2}
                                fill="#6366f1"
                                fillOpacity={0.4}
                            />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#0B0F17', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }} 
                                itemStyle={{ color: '#818cf8' }}
                            />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Metrics & Context */}
            <div className="glass-card rounded-3xl p-6 border border-white/5 space-y-4">
                 <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
                    <Activity size={16} className="text-emerald-500" />
                    Diagnóstico em Tempo Real
                 </h3>

                 <div className="space-y-4">
                    <div>
                        <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-400">Clareza Estratégica</span>
                            <span className="text-emerald-400 font-bold">98%</span>
                        </div>
                        <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 rounded-full" style={{width: '98%'}}></div>
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-400">Risco de Execução</span>
                            <span className="text-yellow-400 font-bold">Moderado</span>
                        </div>
                        <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                            <div className="h-full bg-yellow-500 rounded-full" style={{width: '45%'}}></div>
                        </div>
                    </div>
                 </div>
            </div>

            {/* AI Action Card */}
            <div className="glass-card rounded-3xl p-6 border border-white/5 bg-gradient-to-b from-white/5 to-transparent relative overflow-hidden group">
                 <div className="absolute -right-6 -top-6 w-24 h-24 bg-purple-500/20 rounded-full blur-2xl group-hover:bg-purple-500/30 transition-all"></div>
                 
                 <BrainCircuit size={32} className="text-white mb-4" />
                 <h3 className="text-lg font-bold text-white leading-tight mb-2">
                    Insights Gerados
                 </h3>
                 <p className="text-xs text-gray-400 leading-relaxed mb-4">
                    Baseado no contexto da conversa, recomendamos focar na redução do CAC antes de escalar o time de vendas.
                 </p>
                 <button 
                    onClick={handleExportPlan}
                    disabled={messages.length <= 1}
                    className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-white transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                 >
                    <BarChart3 size={14} />
                    Exportar Plano de Ação
                 </button>
            </div>

        </div>
    </div>
  );
};

export default Consultant;