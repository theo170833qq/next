import React, { useState, useMemo } from 'react';
import { analyzeFinancialData } from '../services/gemini';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Loader2, TrendingUp, FileSpreadsheet, BrainCircuit, Sparkles, Sliders, DollarSign, Calculator } from 'lucide-react';

// Mock Data for Initial State (To show visual immediately)
const initialChartData = [
    { month: 'Jul', revenue: 45000, expenses: 32000, profit: 13000 },
    { month: 'Ago', revenue: 48000, expenses: 34000, profit: 14000 },
    { month: 'Set', revenue: 52000, expenses: 35000, profit: 17000 },
    { month: 'Out', revenue: 51000, expenses: 36000, profit: 15000 },
    { month: 'Nov', revenue: 58000, expenses: 38000, profit: 20000 },
    { month: 'Dez', revenue: 65000, expenses: 42000, profit: 23000 },
];

const Finance: React.FC = () => {
  const [context, setContext] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiData, setAiData] = useState<any>(null);
  
  // Simulation State
  const [revMultiplier, setRevMultiplier] = useState(0); // Percentage change
  const [costMultiplier, setCostMultiplier] = useState(0); // Percentage change

  const handleAnalysis = async () => {
    if (!context) return;
    setLoading(true);
    const result = await analyzeFinancialData(context);
    setAiData(result);
    setLoading(false);
  };

  // Real-time calculation for simulation
  const displayedData = useMemo(() => {
     const base = aiData ? aiData.data : initialChartData;
     return base.map((item: any) => {
         const newRev = item.revenue * (1 + revMultiplier / 100);
         const newExp = item.expenses * (1 + costMultiplier / 100);
         return {
             ...item,
             revenue: Math.round(newRev),
             expenses: Math.round(newExp),
             profit: Math.round(newRev - newExp)
         };
     });
  }, [aiData, revMultiplier, costMultiplier]);

  const totalProjectedProfit = displayedData.reduce((acc: number, curr: any) => acc + curr.profit, 0);

  return (
    <div className="space-y-8 animate-slide-up max-w-7xl mx-auto pb-20">
       <header className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/5 pb-6 gap-4">
        <div>
            <h1 className="text-4xl font-extrabold text-white">Laboratório Financeiro</h1>
            <p className="text-gray-400 mt-2">Simule cenários arrastando os controles ou peça uma análise profunda para a IA.</p>
        </div>
        <div className="px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full flex items-center gap-2">
            <Calculator size={16} className="text-indigo-400" />
            <span className="text-indigo-300 text-sm font-bold">Lucro Projetado (6m): R$ {(totalProjectedProfit / 1000).toFixed(1)}k</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Controls & AI Input */}
        <div className="lg:col-span-4 space-y-6">
             {/* Simulator Controls */}
             <div className="glass-card rounded-3xl p-6 border border-white/5 bg-gradient-to-b from-indigo-900/20 to-onyx-900">
                <h3 className="text-white font-bold mb-6 flex items-center">
                    <Sliders className="mr-2 text-emerald-400" size={20}/> Simulador de Impacto
                </h3>
                
                <div className="space-y-8">
                    <div>
                        <div className="flex justify-between mb-2">
                            <span className="text-sm text-gray-400 font-medium">Ajuste de Receita</span>
                            <span className={`text-sm font-bold ${revMultiplier >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                {revMultiplier > 0 ? '+' : ''}{revMultiplier}%
                            </span>
                        </div>
                        <input 
                            type="range" 
                            min="-50" 
                            max="50" 
                            value={revMultiplier} 
                            onChange={(e) => setRevMultiplier(Number(e.target.value))}
                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                        />
                        <p className="text-xs text-gray-500 mt-2">Simule aumento de preços ou volume de vendas.</p>
                    </div>

                    <div>
                        <div className="flex justify-between mb-2">
                            <span className="text-sm text-gray-400 font-medium">Ajuste de Custos</span>
                            <span className={`text-sm font-bold ${costMultiplier <= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                {costMultiplier > 0 ? '+' : ''}{costMultiplier}%
                            </span>
                        </div>
                        <input 
                            type="range" 
                            min="-50" 
                            max="50" 
                            value={costMultiplier} 
                            onChange={(e) => setCostMultiplier(Number(e.target.value))}
                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-rose-500"
                        />
                        <p className="text-xs text-gray-500 mt-2">Simule corte de gastos ou novos investimentos.</p>
                    </div>
                </div>

                <div className="mt-6 pt-6 border-t border-white/10 flex justify-between items-center">
                    <button onClick={() => {setRevMultiplier(0); setCostMultiplier(0)}} className="text-xs text-gray-400 hover:text-white underline">Resetar</button>
                    <div className="text-right">
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest">Lucro Resultante</p>
                        <p className="text-xl font-bold text-white">R$ {(displayedData[displayedData.length-1].profit).toLocaleString()}</p>
                    </div>
                </div>
             </div>

             {/* AI Input */}
             <div className="glass-card rounded-3xl p-6 border border-white/5">
                <label className="block text-indigo-300 font-bold text-sm uppercase tracking-wider mb-4 flex items-center">
                    <BrainCircuit className="mr-2" size={18}/>
                    Consultar IA
                </label>
                <textarea
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                    placeholder="Descreva um cenário complexo: 'Se eu contratar 2 vendedores (custo 10k) e isso aumentar vendas em 15%, como fica meu fluxo de caixa?'"
                    className="w-full bg-onyx-900 border border-white/10 rounded-xl p-4 text-white placeholder-gray-600 focus:ring-2 focus:ring-indigo-500/50 outline-none h-40 resize-none mb-4 text-sm"
                />
                <button
                    onClick={handleAnalysis}
                    disabled={loading || !context}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl flex items-center justify-center p-4 transition-all disabled:opacity-50 shadow-lg shadow-indigo-900/40"
                >
                    {loading ? <Loader2 className="animate-spin mr-2" size={20}/> : <Sparkles className="mr-2" size={20}/>}
                    {loading ? "Calculando..." : "Gerar Novo Cenário"}
                </button>
            </div>
        </div>

        {/* Right Column: Visualization */}
        <div className="lg:col-span-8 space-y-6">
            
             {/* Dynamic Analysis Text */}
             <div className="glass-card rounded-3xl p-6 bg-gradient-to-r from-indigo-900/40 to-onyx-900 border border-indigo-500/30 relative overflow-hidden min-h-[120px] flex items-center">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                <div>
                    <h3 className="text-indigo-300 font-bold text-xs uppercase tracking-widest mb-2 flex items-center">
                        <TrendingUp size={14} className="mr-2" /> Análise do Cenário Atual
                    </h3>
                    <p className="text-white text-base leading-relaxed font-light">
                        {aiData ? aiData.analysis : 
                         revMultiplier > 10 ? "Projeção agressiva de crescimento. Certifique-se de que a estrutura operacional suporta esse volume de vendas." :
                         costMultiplier < -10 ? "Estratégia de eficiência de custos. Atenção para não impactar a qualidade do produto com cortes bruscos." :
                         "Cenário base estável. Utilize os controles à esquerda para simular novos investimentos ou estratégias de venda."
                        }
                    </p>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 gap-6">
                <div className="glass-card rounded-3xl p-6 h-96 border border-white/5">
                    <h4 className="text-gray-400 font-medium mb-6 text-sm flex justify-between items-center">
                        <span className="flex items-center gap-2"><DollarSign size={16}/> Fluxo de Caixa (Simulado)</span>
                        <span className="text-indigo-400 text-xs px-2 py-1 bg-indigo-500/10 rounded">Interativo</span>
                    </h4>
                    <ResponsiveContainer width="100%" height="85%">
                        <BarChart data={displayedData} barSize={32}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} opacity={0.3} />
                            <XAxis dataKey="month" stroke="#64748b" axisLine={false} tickLine={false} />
                            <YAxis stroke="#64748b" axisLine={false} tickLine={false} />
                            <Tooltip 
                                cursor={{fill: '#ffffff', opacity: 0.05}}
                                contentStyle={{ backgroundColor: '#0B0F17', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                            />
                            <Legend wrapperStyle={{paddingTop: '20px'}} />
                            <Bar dataKey="revenue" name="Receita" fill="#6366F1" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="expenses" name="Despesas" fill="#F43F5E" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="profit" name="Lucro" fill="#10B981" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                    <div className="glass-card rounded-3xl p-6 h-80 border border-white/5">
                    <h4 className="text-gray-400 font-medium mb-6 text-sm">Tendência de Lucratividade Acumulada</h4>
                    <ResponsiveContainer width="100%" height="85%">
                        <AreaChart data={displayedData}>
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
      </div>
    </div>
  );
};

export default Finance;