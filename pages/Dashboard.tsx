import React, { useMemo, useState, useEffect } from 'react';
import { useCompany } from '../context/CompanyContext';
import { TrendingUp, Users, DollarSign, Activity, ArrowUpRight, ArrowDownRight, Target, Zap, Download, ShieldCheck, PieChart, Wallet, AlertTriangle, Globe, BrainCircuit, Scan, Layers, Hexagon, Crosshair } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar, Legend, BarChart, Bar, ReferenceLine, ComposedChart, Line, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';

const acquisitionData = [
  { name: 'Orgânico', value: 45, fill: '#6366F1' },
  { name: 'Ads (Pago)', value: 30, fill: '#ec4899' },
  { name: 'Indicação', value: 15, fill: '#10B981' },
  { name: 'Outbound', value: 10, fill: '#F59E0B' },
];

interface DashboardProps {
  setActiveTab: (tab: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ setActiveTab }) => {
  const { companyData, formatCurrency } = useCompany();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  
  const mrr = companyData?.mrr || 0;
  const cash = companyData?.cashBalance || 0;
  const burn = companyData?.monthlyBurn || 0;
  const profit = mrr - burn;
  const runway = burn > 0 ? (cash / burn).toFixed(1) : "Infinito";
  const healthScore = Math.min(100, Math.max(0, 50 + (profit > 0 ? 30 : -20) + (Number(runway) > 6 ? 20 : -10)));

  // Mock Data Generators
  const performanceData = useMemo(() => {
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul'];
    return months.map((month, index) => {
        const factor = 0.7 + (index * 0.05);
        const simRevenue = mrr * factor;
        const simExpenses = burn * (0.9 + (Math.random() * 0.2));
        return {
            name: month,
            revenue: Math.round(simRevenue),
            expenses: Math.round(simExpenses),
            cash: Math.round(cash - (burn * (6 - index) * 0.5)),
            profit: Math.round(simRevenue - simExpenses)
        }
    });
  }, [mrr, burn, cash]);

  const ecosystemHealth = [
    { subject: 'Vendas', A: 85, fullMark: 100 },
    { subject: 'Marketing', A: 65, fullMark: 100 },
    { subject: 'Financeiro', A: profit > 0 ? 90 : 40, fullMark: 100 },
    { subject: 'Produto', A: 75, fullMark: 100 },
    { subject: 'Equipe', A: 80, fullMark: 100 },
    { subject: 'Jurídico', A: 60, fullMark: 100 },
  ];

  return (
    <div className={`space-y-6 pb-10 transition-opacity duration-700 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
      
      {/* Styles for complex visuals */}
      <style>{`
        .holo-grid {
          background-image: linear-gradient(rgba(99, 102, 241, 0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(99, 102, 241, 0.1) 1px, transparent 1px);
          background-size: 40px 40px;
        }
        .scan-line {
          width: 100%;
          height: 2px;
          background: rgba(99, 102, 241, 0.5);
          box-shadow: 0 0 10px rgba(99, 102, 241, 0.8);
          animation: scan 3s linear infinite;
        }
        @keyframes scan {
          0% { transform: translateY(-100%); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(400px); opacity: 0; }
        }
        .breathing-core {
          animation: breathe 4s ease-in-out infinite;
        }
        @keyframes breathe {
          0%, 100% { transform: scale(1); box-shadow: 0 0 30px rgba(99,102,241,0.2); }
          50% { transform: scale(1.05); box-shadow: 0 0 60px rgba(99,102,241,0.5); }
        }
      `}</style>

      {/* --- HEADER: COMMAND DECK --- */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 relative z-10">
        <div>
           <div className="flex items-center gap-2 mb-2">
               <div className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/30 rounded flex items-center gap-2">
                   <Activity size={12} className="text-indigo-400 animate-pulse" />
                   <span className="text-[10px] font-mono text-indigo-300 uppercase tracking-widest">Live System Monitor</span>
               </div>
               <span className="text-xs text-gray-500 font-mono">ID: {companyData?.companyName.toUpperCase().slice(0, 3)}-8842</span>
           </div>
           <h1 className="text-4xl md:text-5xl font-display font-bold text-white tracking-tight">
             Centro de Comando
           </h1>
        </div>
        
        <div className="flex gap-3">
            <button className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-mono text-gray-400 flex items-center gap-2 group transition-all">
                <Download size={14} className="group-hover:text-white" />
                RELATORIO_DIARIO.CSV
            </button>
            <button 
                onClick={() => setActiveTab('consultant')}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all hover:scale-105"
            >
                <BrainCircuit size={18} />
                <span className="font-mono">ATIVAR CONSULTOR IA</span>
            </button>
        </div>
      </div>

      {/* --- SECTION 1: THE CORE (Visual Health) --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* LEFT: Business DNA Radar */}
          <div className="glass-card rounded-2xl p-1 relative overflow-hidden group border border-white/10 bg-onyx-900/50">
              <div className="absolute inset-0 holo-grid opacity-20 pointer-events-none"></div>
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-indigo-500/5 to-transparent pointer-events-none"></div>
              
              <div className="p-5 h-full flex flex-col relative z-10">
                  <div className="flex justify-between items-center mb-4">
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                          <Hexagon size={16} className="text-indigo-400" />
                          DNA Empresarial
                      </h3>
                      <span className="text-[10px] text-gray-500 font-mono uppercase">Scan Ativo</span>
                  </div>

                  <div className="flex-1 min-h-[250px] relative">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={ecosystemHealth}>
                            <PolarGrid stroke="#334155" strokeOpacity={0.5} />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }} />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                            <Radar
                                name="Saúde"
                                dataKey="A"
                                stroke="#818cf8"
                                strokeWidth={2}
                                fill="#6366f1"
                                fillOpacity={0.4}
                            />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#0B0F17', borderColor: '#334155', borderRadius: '4px', color: '#fff', fontSize: '10px' }} 
                                itemStyle={{ color: '#818cf8' }}
                            />
                        </RadarChart>
                      </ResponsiveContainer>
                      
                      {/* Central Pulse */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full border border-indigo-500/20 animate-ping opacity-20 pointer-events-none"></div>
                  </div>
              </div>
          </div>

          {/* CENTER: The Main HUD (Metrics) */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
               {/* Metric 1: MRR */}
               <div className="glass-card p-6 rounded-2xl border border-white/10 relative overflow-hidden bg-gradient-to-br from-indigo-900/20 to-onyx-900 hover:border-indigo-500/30 transition-colors group">
                    <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <DollarSign size={80} className="text-white transform rotate-12" />
                    </div>
                    <div className="relative z-10">
                        <p className="text-xs font-mono text-indigo-300 mb-1">RECEITA RECORRENTE (MRR)</p>
                        <div className="flex items-baseline gap-2">
                            <h2 className="text-3xl font-bold text-white tracking-tight">{formatCurrency(mrr)}</h2>
                            <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">▲ 12%</span>
                        </div>
                        <div className="mt-4 h-1 w-full bg-gray-800 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-500 w-[75%] rounded-full shadow-[0_0_10px_#6366f1]"></div>
                        </div>
                        <p className="text-[10px] text-gray-500 mt-2 font-mono">META: {formatCurrency(mrr * 1.5)}</p>
                    </div>
               </div>

               {/* Metric 2: Profit/Burn */}
               <div className={`glass-card p-6 rounded-2xl border border-white/10 relative overflow-hidden bg-gradient-to-br ${profit > 0 ? 'from-emerald-900/20' : 'from-rose-900/20'} to-onyx-900 hover:border-white/20 transition-colors group`}>
                    <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Target size={80} className="text-white transform -rotate-12" />
                    </div>
                    <div className="relative z-10">
                        <p className={`text-xs font-mono mb-1 ${profit > 0 ? 'text-emerald-300' : 'text-rose-300'}`}>
                            {profit > 0 ? 'RESULTADO LÍQUIDO' : 'CASH BURN (QUEIMA)'}
                        </p>
                        <div className="flex items-baseline gap-2">
                            <h2 className="text-3xl font-bold text-white tracking-tight">{formatCurrency(profit)}</h2>
                            <span className="text-xs text-gray-400 font-mono">/ mês</span>
                        </div>
                        <div className="mt-4 flex items-center justify-between text-[10px] font-mono text-gray-400 border-t border-white/10 pt-2">
                            <span>Caixa: {formatCurrency(cash)}</span>
                            <span className={profit < 0 ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                                Runway: {runway} m
                            </span>
                        </div>
                    </div>
               </div>

               {/* Metric 3: AI Analysis Ticker (Full Width) */}
               <div className="md:col-span-2 glass-card p-4 rounded-2xl border border-white/10 bg-onyx-950 flex items-center gap-4 relative overflow-hidden">
                    <div className="scan-line absolute top-0 left-0 pointer-events-none opacity-20"></div>
                    <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center shrink-0 breathing-core">
                        <BrainCircuit size={20} className="text-indigo-400" />
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-xs font-bold text-indigo-300 mb-0.5">INTELIGÊNCIA ATIVA</p>
                        <p className="text-sm text-gray-300 truncate font-mono">
                            {profit < 0 
                                ? "⚠ ALERTA CRÍTICO: Runway abaixo de 6 meses. Recomendação: Iniciar módulo 'Financeiro' para corte de custos." 
                                : "✓ SISTEMA ESTÁVEL: Oportunidade de expansão detectada. Investir excedente em CAC (Marketing)."}
                        </p>
                    </div>
                    <button onClick={() => setActiveTab('finance')} className="px-3 py-1.5 rounded bg-white/5 hover:bg-white/10 text-[10px] font-bold text-white border border-white/10 transition-colors">
                        AGIR AGORA
                    </button>
               </div>
          </div>
      </div>

      {/* --- SECTION 2: DEEP DIVE ANALYTICS --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[400px]">
          
          {/* Main Chart */}
          <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-white/10 bg-onyx-900/40 relative">
               <div className="flex justify-between items-center mb-6">
                   <div>
                       <h3 className="text-white font-bold flex items-center gap-2">
                           <TrendingUp size={16} className="text-emerald-400"/>
                           Fluxo de Caixa Projetado
                       </h3>
                       <p className="text-[10px] text-gray-500 font-mono mt-1">SIMULAÇÃO DE CENÁRIO BASEADO EM DADOS REAIS</p>
                   </div>
                   <div className="flex gap-2">
                       <div className="flex items-center gap-1.5">
                           <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                           <span className="text-[10px] text-gray-400">Receita</span>
                       </div>
                       <div className="flex items-center gap-1.5">
                           <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                           <span className="text-[10px] text-gray-400">Despesa</span>
                       </div>
                   </div>
               </div>
               
               <ResponsiveContainer width="100%" height="80%">
                  <AreaChart data={performanceData}>
                      <defs>
                          <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4}/>
                              <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="gradExpense" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2}/>
                              <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                          </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} opacity={0.2} />
                      <XAxis dataKey="name" stroke="#475569" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10}} />
                      <Tooltip 
                          contentStyle={{ backgroundColor: '#020408', borderColor: '#334155', borderRadius: '4px', color: '#fff', fontSize: '12px' }}
                          formatter={(value: any) => formatCurrency(value)}
                      />
                      <Area type="monotone" dataKey="revenue" stroke="#6366F1" strokeWidth={3} fill="url(#gradRevenue)" />
                      <Area type="monotone" dataKey="expenses" stroke="#f43f5e" strokeWidth={2} fill="url(#gradExpense)" />
                  </AreaChart>
               </ResponsiveContainer>
          </div>

          {/* Acquisition Channels (Stacked List) */}
          <div className="glass-card rounded-2xl p-6 border border-white/10 flex flex-col bg-onyx-900/40">
              <h3 className="text-white font-bold mb-6 flex items-center gap-2">
                  <Scan size={16} className="text-cyan-400" />
                  Origem de Tráfego
              </h3>
              
              <div className="flex-1 flex flex-col justify-center space-y-5">
                  {acquisitionData.map((item, idx) => (
                      <div key={item.name} className="group cursor-pointer">
                          <div className="flex justify-between items-end mb-1">
                              <span className="text-xs font-mono text-gray-400 group-hover:text-white transition-colors">{item.name}</span>
                              <span className="text-sm font-bold text-white">{item.value}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                              <div 
                                className="h-full rounded-full transition-all duration-1000 ease-out group-hover:shadow-[0_0_10px_currentColor]"
                                style={{ width: `${item.value}%`, backgroundColor: item.fill, color: item.fill }}
                              ></div>
                          </div>
                      </div>
                  ))}
              </div>

              <div className="mt-6 pt-4 border-t border-white/5">
                  <p className="text-[10px] text-gray-500 text-center">
                      Custo de Aquisição (CAC) Médio: <span className="text-white font-bold">R$ 45,20</span>
                  </p>
              </div>
          </div>
      </div>

    </div>
  );
};

export default Dashboard;