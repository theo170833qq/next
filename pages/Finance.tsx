import React, { useState, useMemo } from 'react';
import { analyzeFinancialData } from '../services/gemini';
import { useCompany } from '../context/CompanyContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, ReferenceLine, ComposedChart, Line, Cell } from 'recharts';
import { Loader2, TrendingUp, FileSpreadsheet, BrainCircuit, Sparkles, Sliders, DollarSign, Calculator, Scale, AlertCircle } from 'lucide-react';

const Finance: React.FC = () => {
  const { companyData, formatCurrency } = useCompany();
  const [context, setContext] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiData, setAiData] = useState<any>(null);
  
  // Simulation State
  const [priceMultiplier, setPriceMultiplier] = useState(0); 
  const [fixedCostMultiplier, setFixedCostMultiplier] = useState(0); 

  // Dados iniciais dinâmicos
  const initialChartData = useMemo(() => {
    if (!companyData) return [];
    
    const baseRevenue = companyData.mrr;
    const baseExpense = companyData.monthlyBurn;
    
    // Gerar 6 meses de projeção base
    const months = ['Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    return months.map((month, i) => {
        // Variação pequena para parecer realista
        const revFactor = 1 + (i * 0.03); // Crescimento de 3% ao mês
        const expFactor = 1 + (i * 0.01); // Inflação de custos 1% ao mês
        
        const rev = baseRevenue * revFactor;
        const exp = baseExpense * expFactor;
        
        return {
            month,
            revenue: Math.round(rev),
            fixedCost: Math.round(exp * 0.7), // 70% fixo
            variableCost: Math.round(exp * 0.3), // 30% variável
            profit: Math.round(rev - exp)
        }
    });
  }, [companyData]);

  const handleAnalysis = async () => {
    if (!context) return;
    setLoading(true);
    const result = await analyzeFinancialData(context);
    setAiData(result);
    setLoading(false);
  };

  const displayedData = useMemo(() => {
     const base = aiData ? aiData.data : initialChartData;
     return base.map((item: any) => {
         const newRev = item.revenue * (1 + priceMultiplier / 100);
         const newFixed = item.fixedCost * (1 + fixedCostMultiplier / 100);
         const totalExp = newFixed + item.variableCost; 
         
         return {
             ...item,
             revenue: Math.round(newRev),
             fixedCost: Math.round(newFixed),
             totalExpenses: Math.round(totalExp),
             profit: Math.round(newRev - totalExp)
         };
     });
  }, [aiData, initialChartData, priceMultiplier, fixedCostMultiplier]);

  const totalProjectedProfit = displayedData.reduce((acc: number, curr: any) => acc + curr.profit, 0);
  const totalRevenue = displayedData.reduce((acc: number, curr: any) => acc + curr.revenue, 0);
  const averageMargin = totalRevenue > 0 ? (totalProjectedProfit / totalRevenue) * 100 : 0;

  return (
    <div className="space-y-8 animate-slide-up max-w-7xl mx-auto pb-20">
       <header className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/5 pb-6 gap-4">
        <div>
            <h1 className="text-4xl font-extrabold text-white">Laboratório de Rentabilidade</h1>
            <p className="text-gray-400 mt-2">Simule impacto de precificação e cortes de custo na sua margem líquida.</p>
        </div>
        <div className="flex gap-3">
             <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center gap-2">
                <Scale size={16} className="text-emerald-400" />
                <span className="text-emerald-300 text-sm font-bold">Margem Média: {averageMargin.toFixed(1)}%</span>
            </div>
            <div className="px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full flex items-center gap-2">
                <Calculator size={16} className="text-indigo-400" />
                <span className="text-indigo-300 text-sm font-bold">Lucro (6m): {formatCurrency(totalProjectedProfit)}</span>
            </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Controls & AI Input */}
        <div className="lg:col-span-4 space-y-6">
             {/* Simulator Controls */}
             <div className="glass-card rounded-3xl p-6 border border-white/5 bg-gradient-to-b from-indigo-900/20 to-onyx-900">
                <h3 className="text-white font-bold mb-6 flex items-center">
                    <Sliders className="mr-2 text-emerald-400" size={20}/> Controles de Impacto
                </h3>
                
                <div className="space-y-8">
                    <div>
                        <div className="flex justify-between mb-2">
                            <span className="text-sm text-gray-400 font-medium">Reajuste de Preço/Vendas</span>
                            <span className={`text-sm font-bold ${priceMultiplier >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                {priceMultiplier > 0 ? '+' : ''}{priceMultiplier}%
                            </span>
                        </div>
                        <input 
                            type="range" 
                            min="-30" 
                            max="50" 
                            value={priceMultiplier} 
                            onChange={(e) => setPriceMultiplier(Number(e.target.value))}
                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                        />
                        <p className="text-[10px] text-gray-500 mt-2">Simula aumento na tabela de preços ou volume.</p>
                    </div>

                    <div>
                        <div className="flex justify-between mb-2">
                            <span className="text-sm text-gray-400 font-medium">Variação Custo Fixo</span>
                            <span className={`text-sm font-bold ${fixedCostMultiplier <= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                {fixedCostMultiplier > 0 ? '+' : ''}{fixedCostMultiplier}%
                            </span>
                        </div>
                        <input 
                            type="range" 
                            min="-30" 
                            max="50" 
                            value={fixedCostMultiplier} 
                            onChange={(e) => setFixedCostMultiplier(Number(e.target.value))}
                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-rose-500"
                        />
                        <p className="text-[10px] text-gray-500 mt-2">Simula renegociação de aluguel, software, equipe.</p>
                    </div>
                </div>

                <div className="mt-6 pt-6 border-t border-white/10 flex justify-between items-center">
                    <button onClick={() => {setPriceMultiplier(0); setFixedCostMultiplier(0)}} className="text-xs text-gray-400 hover:text-white underline">Resetar Padrão</button>
                    
                    {totalProjectedProfit < 0 && (
                        <div className="flex items-center text-rose-400 text-xs font-bold animate-pulse">
                            <AlertCircle size={12} className="mr-1" /> Prejuízo Projetado
                        </div>
                    )}
                </div>
             </div>

             {/* AI Input */}
             <div className="glass-card rounded-3xl p-6 border border-white/5">
                <label className="block text-indigo-300 font-bold text-sm uppercase tracking-wider mb-4 flex items-center">
                    <BrainCircuit className="mr-2" size={18}/>
                    Consultoria de Cenário
                </label>
                <div className="relative group">
                     <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl opacity-20 group-hover:opacity-40 transition duration-500 blur-sm"></div>
                    <textarea
                        value={context}
                        onChange={(e) => setContext(e.target.value)}
                        placeholder={`Ex: 'Minha empresa ${companyData?.companyName} fatura ${formatCurrency(companyData?.mrr || 0)}. Se eu investir 20k em marketing, em quanto tempo recupero o ROI?'`}
                        className="relative w-full bg-onyx-900 border border-white/10 rounded-xl p-4 text-white placeholder-gray-600 focus:ring-2 focus:ring-indigo-500/50 outline-none h-40 resize-none mb-4 text-sm"
                    />
                </div>
                <button
                    onClick={handleAnalysis}
                    disabled={loading || !context}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl flex items-center justify-center p-4 transition-all disabled:opacity-50 shadow-lg shadow-indigo-900/40"
                >
                    {loading ? <Loader2 className="animate-spin mr-2" size={20}/> : <Sparkles className="mr-2" size={20}/>}
                    {loading ? "Processando Cenário..." : "Simular com IA"}
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
                        <TrendingUp size={14} className="mr-2" /> Análise de Viabilidade
                    </h3>
                    <p className="text-white text-base leading-relaxed font-light">
                        {aiData ? aiData.analysis : 
                         priceMultiplier < -10 ? "Alerta: Redução drástica de preço pode corroer a margem de contribuição. Verifique se o volume de vendas compensa." :
                         fixedCostMultiplier > 10 ? "Alerta: Aumento de custo fixo eleva seu ponto de equilíbrio (Break-even). Você precisará vender mais apenas para empatar." :
                         `Cenário base da ${companyData?.companyName}. A empresa opera com margem de ${averageMargin.toFixed(1)}%. Utilize os sliders para testar a sensibilidade.`
                        }
                    </p>
                </div>
            </div>

            {/* Charts - Visualizing Break-even */}
            <div className="grid grid-cols-1 gap-6">
                <div className="glass-card rounded-3xl p-6 h-[420px] border border-white/5">
                    <h4 className="text-gray-400 font-medium mb-6 text-sm flex justify-between items-center">
                        <span className="flex items-center gap-2"><Scale size={16}/> Ponto de Equilíbrio (Break-even Point)</span>
                        <div className="flex gap-4">
                             <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-rose-500"></div><span className="text-xs text-gray-400">Despesa Total</span></div>
                             <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-indigo-500"></div><span className="text-xs text-gray-400">Receita</span></div>
                        </div>
                    </h4>
                    <ResponsiveContainer width="100%" height="85%">
                        <ComposedChart data={displayedData} margin={{top: 10, right: 10, bottom: 0, left: 0}}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} opacity={0.3} />
                            <XAxis dataKey="month" stroke="#64748b" axisLine={false} tickLine={false} />
                            <YAxis stroke="#64748b" axisLine={false} tickLine={false} tickFormatter={(val) => `${(val/1000).toFixed(0)}k`} />
                            <Tooltip 
                                cursor={{fill: '#ffffff', opacity: 0.05}}
                                contentStyle={{ backgroundColor: '#0B0F17', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                                formatter={(val: number) => formatCurrency(val)}
                            />
                            {/* Area de Lucro/Prejuízo visual */}
                            <Area type="monotone" dataKey="revenue" fill="url(#colorProfitZone)" stroke="none" fillOpacity={0.1} />
                            <defs>
                                <linearGradient id="colorProfitZone" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                                </linearGradient>
                            </defs>

                            <Line type="monotone" dataKey="totalExpenses" name="Despesa Total" stroke="#F43F5E" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} />
                            <Line type="monotone" dataKey="revenue" name="Receita" stroke="#6366F1" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>

                {/* Profit Bar Chart */}
                <div className="glass-card rounded-3xl p-6 h-64 border border-white/5">
                    <h4 className="text-gray-400 font-medium mb-4 text-sm">Resultado Líquido (Lucro/Prejuízo)</h4>
                    <ResponsiveContainer width="100%" height="80%">
                        <BarChart data={displayedData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} opacity={0.3} />
                            <XAxis dataKey="month" stroke="#64748b" axisLine={false} tickLine={false} />
                            <Tooltip 
                                cursor={{fill: 'transparent'}}
                                contentStyle={{ backgroundColor: '#0B0F17', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                                formatter={(val: number) => formatCurrency(val)}
                            />
                            <ReferenceLine y={0} stroke="#64748b" />
                            <Bar dataKey="profit" name="Resultado" radius={[4, 4, 4, 4]}>
                                {displayedData.map((entry: any, index: number) => (
                                    <Cell key={`cell-${index}`} fill={entry.profit >= 0 ? '#10B981' : '#F43F5E'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Finance;