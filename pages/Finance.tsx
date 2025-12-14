import React, { useState } from 'react';
import { analyzeFinancialData } from '../services/gemini';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import { Loader2, TrendingUp, PieChart, FileSpreadsheet, ArrowRight, BrainCircuit, Sparkles } from 'lucide-react';

const Finance: React.FC = () => {
  const [context, setContext] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);

  const handleAnalysis = async () => {
    if (!context) return;
    setLoading(true);
    const result = await analyzeFinancialData(context);
    setData(result);
    setLoading(false);
  };

  return (
    <div className="space-y-8 animate-slide-up max-w-7xl mx-auto">
       <header className="flex items-end justify-between border-b border-white/5 pb-6">
        <div>
            <h1 className="text-4xl font-extrabold text-white">Inteligência Financeira</h1>
            <p className="text-gray-400 mt-2">Simulação de cenários e projeção de crescimento baseados em IA.</p>
        </div>
      </header>

      {/* Input Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-4">
             <div className="glass-card rounded-3xl p-6 border border-white/5">
                <label className="block text-indigo-300 font-bold text-sm uppercase tracking-wider mb-4 flex items-center">
                    <BrainCircuit className="mr-2" size={18}/>
                    Input de Dados
                </label>
                <p className="text-xs text-gray-500 mb-4">
                    Insira seus dados brutos, contexto de mercado ou dúvidas específicas. A IA estruturará uma projeção.
                </p>
                <textarea
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                    placeholder="Ex: Faturamos 50k/mês com margem de 20%. Queremos dobrar o investimento em ads (de 5k para 10k). Qual o impacto no lucro líquido em 6 meses considerando um CAC de R$ 50?"
                    className="w-full bg-onyx-900 border border-white/10 rounded-xl p-4 text-white placeholder-gray-600 focus:ring-2 focus:ring-indigo-500/50 outline-none h-64 resize-none mb-4"
                />
                <button
                    onClick={handleAnalysis}
                    disabled={loading || !context}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl flex items-center justify-center p-4 transition-all disabled:opacity-50 shadow-lg shadow-indigo-900/40"
                >
                    {loading ? <Loader2 className="animate-spin mr-2" size={20}/> : <TrendingUp className="mr-2" size={20}/>}
                    {loading ? "Processando Cenários..." : "Gerar Projeção"}
                </button>
            </div>
        </div>

        {/* Visualization Area */}
        <div className="lg:col-span-2 space-y-6">
            {!data ? (
                <div className="h-full glass-card rounded-3xl border border-white/5 border-dashed flex flex-col items-center justify-center text-gray-600 p-12">
                    <FileSpreadsheet size={64} className="mb-6 opacity-20" />
                    <p className="text-lg font-medium">Aguardando dados para análise...</p>
                    <p className="text-sm opacity-60 max-w-md text-center mt-2">Utilize o painel à esquerda para descrever a situação financeira da sua empresa.</p>
                </div>
            ) : (
                <div className="space-y-6 animate-fade-in">
                    
                    {/* AI Insight Header */}
                    <div className="glass-card rounded-3xl p-8 bg-gradient-to-r from-indigo-900/40 to-onyx-900 border border-indigo-500/30 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                        <h3 className="text-indigo-300 font-bold text-sm uppercase tracking-widest mb-3 flex items-center">
                            <Sparkles size={16} className="mr-2" /> Análise Executiva
                        </h3>
                        <p className="text-white text-lg leading-relaxed font-light">{data.analysis}</p>
                    </div>

                    {/* Chart Grid */}
                    <div className="grid grid-cols-1 gap-6">
                        <div className="glass-card rounded-3xl p-6 h-80 border border-white/5">
                            <h4 className="text-gray-400 font-medium mb-6 text-sm flex justify-between">
                                <span>Fluxo de Caixa Projetado</span>
                                <span className="text-indigo-400">Próximos 6 Meses</span>
                            </h4>
                            <ResponsiveContainer width="100%" height="85%">
                                <BarChart data={data.data} barSize={40}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} opacity={0.3} />
                                    <XAxis dataKey="month" stroke="#64748b" axisLine={false} tickLine={false} />
                                    <YAxis stroke="#64748b" axisLine={false} tickLine={false} />
                                    <Tooltip 
                                        cursor={{fill: '#ffffff', opacity: 0.05}}
                                        contentStyle={{ backgroundColor: '#0B0F17', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                                    />
                                    <Legend wrapperStyle={{paddingTop: '10px'}} />
                                    <Bar dataKey="revenue" name="Receita" fill="#6366F1" radius={[6, 6, 0, 0]} />
                                    <Bar dataKey="expenses" name="Despesas" fill="#F43F5E" radius={[6, 6, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                         <div className="glass-card rounded-3xl p-6 h-80 border border-white/5">
                            <h4 className="text-gray-400 font-medium mb-6 text-sm">Tendência de Lucratividade</h4>
                            <ResponsiveContainer width="100%" height="85%">
                                <AreaChart data={data.data}>
                                    <defs>
                                    <linearGradient id="colorProfitFin" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                    </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} opacity={0.3} />
                                    <XAxis dataKey="month" stroke="#64748b" axisLine={false} tickLine={false} />
                                    <YAxis stroke="#64748b" axisLine={false} tickLine={false} />
                                    <Tooltip contentStyle={{ backgroundColor: '#0B0F17', borderColor: '#334155', borderRadius: '12px', color: '#fff' }} />
                                    <Area type="monotone" dataKey="profit" name="Lucro Líquido" stroke="#10b981" strokeWidth={3} fill="url(#colorProfitFin)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Finance;