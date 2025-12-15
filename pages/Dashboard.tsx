import React, { useMemo } from 'react';
import { useCompany } from '../context/CompanyContext';
import { TrendingUp, Users, DollarSign, Activity, ArrowUpRight, ArrowDownRight, Target, Zap, Download, ShieldCheck, PieChart, Wallet, AlertTriangle, Globe } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar, Legend, BarChart, Bar, ReferenceLine, ComposedChart, Line } from 'recharts';

const acquisitionData = [
  { name: 'Orgânico', value: 45, fill: '#6366F1' },
  { name: 'Ads (Pago)', value: 30, fill: '#ec4899' },
  { name: 'Indicação', value: 15, fill: '#10B981' },
  { name: 'Outbound', value: 10, fill: '#F59E0B' },
];

const StatCard = ({ title, value, change, isPositive, icon: Icon, colorClass, delay, subtitle }: any) => (
  <div className={`glass-card rounded-3xl p-6 relative overflow-hidden group hover:-translate-y-2 transition-all duration-500 border border-white/5 animate-slide-up`} style={{animationDelay: delay}}>
    {/* Background Gradient Blob */}
    <div className={`absolute -right-10 -top-10 w-40 h-40 rounded-full opacity-0 group-hover:opacity-20 blur-3xl transition-opacity duration-500 ${colorClass.replace('text-', 'bg-')}`}></div>
    
    <div className="flex justify-between items-start mb-4 relative z-10">
      <div className={`p-3.5 rounded-2xl bg-white/5 border border-white/10 text-white shadow-inner group-hover:scale-110 transition-transform duration-300`}>
        <Icon size={24} className={colorClass} />
      </div>
      <div className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-bold border ${isPositive ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>
        {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
        <span>{change}</span>
      </div>
    </div>
    
    <div className="relative z-10">
      <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">{title}</p>
      <h3 className="text-3xl md:text-3xl font-extrabold text-white tracking-tight">{value}</h3>
      {subtitle && <p className="text-gray-500 text-[10px] mt-2 font-medium">{subtitle}</p>}
    </div>

    {/* Decorative line */}
    <div className={`absolute bottom-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-700 ${colorClass.replace('text-', 'bg-')}`}></div>
  </div>
);

interface DashboardProps {
  setActiveTab: (tab: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ setActiveTab }) => {
  const { companyData, formatCurrency } = useCompany();
  
  // Se por acaso estiver nulo (não deveria), usa fallback
  const mrr = companyData?.mrr || 0;
  const cash = companyData?.cashBalance || 0;
  const burn = companyData?.monthlyBurn || 0;
  const runway = burn > 0 ? (cash / burn).toFixed(1) : "Infinito";
  const arr = formatCurrency(mrr * 12);
  const profit = mrr - burn;

  // Gerar dados simulados históricos baseados nos inputs atuais para o gráfico ficar bonito
  const performanceData = useMemo(() => {
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul'];
    return months.map((month, index) => {
        // Cria uma curva de crescimento levemente aleatória simulando os meses anteriores
        const factor = 0.7 + (index * 0.05); // De 70% até 100% (mês atual)
        const simRevenue = mrr * factor;
        const simExpenses = burn * (0.9 + (Math.random() * 0.2)); // Variação de 10% no burn
        return {
            name: month,
            revenue: Math.round(simRevenue),
            expenses: Math.round(simExpenses),
            cash: Math.round(cash - (burn * (6 - index) * 0.5)), // Simula acumulação de caixa regressiva
            burn: Math.round(simRevenue - simExpenses)
        }
    });
  }, [mrr, burn, cash]);

  const handleExportReport = () => {
    // Cabeçalho do CSV
    const headers = ['Mes', 'Receita (R$)', 'Despesas (R$)', 'Resultado Operacional (R$)', 'Caixa Acumulado (R$)'];
    
    // Converte os dados para linhas CSV
    const csvRows = performanceData.map(row => [
      row.name,
      row.revenue,
      row.expenses,
      row.burn, // Profit/Loss neste contexto
      row.cash
    ].join(','));

    // Junta tudo
    const csvContent = [headers.join(','), ...csvRows].join('\n');

    // Cria o blob e o link de download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `DRE_${companyData?.companyName.replace(/\s+/g, '_') || 'Relatorio'}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 animate-slide-up pb-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
             <div className="px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 uppercase tracking-widest flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse mr-2"></span>
                Operação Ativa
             </div>
             <span className="text-gray-500 text-xs font-medium flex items-center gap-1">
                <Globe size={12} /> {companyData?.companyName || 'Sua Empresa'}
             </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-gray-400">
            Visão Executiva
          </h1>
          <p className="text-gray-400 mt-2 font-light max-w-lg text-lg">
            Monitoramento de Runway, Fluxo de Caixa e Eficiência.
          </p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={handleExportReport}
            className="flex items-center gap-2 px-5 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-sm font-medium transition-colors text-gray-300 backdrop-blur-md hover:text-white group"
          >
            <Download size={18} className="group-hover:text-indigo-400 transition-colors" />
            <span>Exportar CSV</span>
          </button>
          <button 
            onClick={() => setActiveTab('finance')}
            className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 shadow-[0_0_30px_rgba(99,102,241,0.4)] rounded-2xl text-sm font-bold text-white transition-all transform hover:scale-105 border border-white/10 flex items-center gap-2"
          >
            <Zap size={18} fill="currentColor" />
            Ações Estratégicas
          </button>
        </div>
      </header>

      {/* KPI Grid - Métricas Reais de Negócio */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
            title="Receita Mensal (MRR)" 
            value={formatCurrency(mrr)} 
            change="+5.4%" 
            isPositive={true} 
            icon={DollarSign} 
            colorClass="text-indigo-400" 
            delay="0s"
            subtitle={`Anualizado (ARR): ${arr}`}
        />
        <StatCard 
            title="Caixa Disponível" 
            value={formatCurrency(cash)} 
            change={profit > 0 ? "+ Aumentando" : "- Queimando"} 
            isPositive={profit > 0} 
            icon={Wallet} 
            colorClass="text-emerald-400" 
            delay="0.1s"
            subtitle={`Runway estimado: ${runway} meses`}
        />
        <StatCard 
            title="Resultado Líquido" 
            value={formatCurrency(profit)} 
            change={profit > 0 ? "Lucro" : "Prejuízo"} 
            isPositive={profit > 0} 
            icon={Target} 
            colorClass={profit > 0 ? "text-emerald-400" : "text-rose-400"} 
            delay="0.2s"
            subtitle="Receita - Despesas Totais"
        />
        <StatCard 
            title="Despesa Mensal (Burn)" 
            value={formatCurrency(burn)} 
            change="Estável" 
            isPositive={false} 
            icon={AlertTriangle} 
            colorClass="text-amber-400" 
            delay="0.3s"
            subtitle="Custo Fixo + Variável"
        />
      </div>

      {/* Macro Context Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
         <div>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest">Dólar PTAX</p>
            <p className="text-white font-bold font-mono">R$ 5.82 <span className="text-red-400 text-xs">▲</span></p>
         </div>
         <div>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest">Selic Meta</p>
            <p className="text-white font-bold font-mono">11.25% <span className="text-gray-500 text-xs">−</span></p>
         </div>
         <div>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest">Inflação (IPCA 12m)</p>
            <p className="text-white font-bold font-mono">4.50% <span className="text-emerald-400 text-xs">▼</span></p>
         </div>
         <div>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest">Dias Úteis (Mês)</p>
            <p className="text-white font-bold font-mono">21 Dias</p>
         </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Chart - Cash Flow & Revenue */}
        <div className="lg:col-span-2 glass-card rounded-3xl p-8 border border-white/5 relative overflow-hidden">
          <div className="flex justify-between items-center mb-8 relative z-10">
            <div>
                <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                <TrendingUp size={24} className="text-emerald-400" />
                Performance Financeira
                </h3>
                <p className="text-gray-500 text-sm mt-1">Sua evolução financeira nos últimos 7 meses (Simulado).</p>
            </div>
          </div>
          
          <div className="h-[350px] w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={performanceData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.5}/>
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} opacity={0.15} />
                <XAxis 
                    dataKey="name" 
                    stroke="#64748b" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 500}} 
                    dy={10}
                />
                <YAxis 
                    yAxisId="left"
                    stroke="#64748b" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 12}} 
                    tickFormatter={(value) => `${(value/1000).toFixed(0)}k`}
                />
                <YAxis 
                    yAxisId="right"
                    orientation="right"
                    stroke="#64748b" 
                    axisLine={false} 
                    tickLine={false} 
                    hide
                />
                <Tooltip 
                  contentStyle={{ 
                      backgroundColor: 'rgba(11, 15, 23, 0.95)', 
                      backdropFilter: 'blur(10px)',
                      borderColor: 'rgba(255,255,255,0.1)', 
                      borderRadius: '16px', 
                      color: '#fff', 
                      boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                      padding: '12px'
                  }} 
                  formatter={(value: any) => formatCurrency(value)}
                  itemStyle={{ color: '#e2e8f0', fontWeight: 600 }}
                />
                <Legend iconType="circle" />
                
                {/* Barras de Despesa */}
                <Bar yAxisId="left" dataKey="expenses" name="Despesas" fill="#334155" radius={[4, 4, 0, 0]} barSize={20} />
                
                {/* Area de Receita */}
                <Area 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="revenue" 
                    name="Receita"
                    stroke="#6366F1" 
                    strokeWidth={3} 
                    fillOpacity={1} 
                    fill="url(#colorRevenue)" 
                />
                
                {/* Linha de Caixa */}
                <Line yAxisId="right" type="monotone" dataKey="cash" name="Caixa Acumulado" stroke="#10B981" strokeWidth={2} dot={{r: 4, fill: '#10B981'}} />

              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Column Stack */}
        <div className="flex flex-col gap-6">
            
            {/* Acquisition Radar */}
            <div className="glass-card rounded-3xl p-6 flex flex-col relative overflow-hidden flex-1 border border-white/5">
                <h3 className="text-lg font-bold text-white mb-1 flex items-center z-10 relative">
                    <Users className="mr-2 text-indigo-400" size={20} /> Canais de Aquisição
                </h3>
                <p className="text-gray-400 text-xs mb-6 z-10 relative">Origem estimada dos clientes.</p>
                
                <div className="flex-1 w-full min-h-[200px] relative z-10 flex items-center justify-center">
                   <ResponsiveContainer width="100%" height="100%">
                      <RadialBarChart 
                        innerRadius="30%" 
                        outerRadius="100%" 
                        data={acquisitionData} 
                        startAngle={180} 
                        endAngle={-180}
                        barSize={15}
                      >
                        <RadialBar background={{ fill: '#334155', opacity: 0.2 }} dataKey='value' cornerRadius={10} label={{ position: 'insideStart', fill: '#fff', fontSize: '10px' }} />
                        <Legend 
                            iconSize={8} 
                            layout='vertical' 
                            verticalAlign='middle' 
                            align="right" 
                            wrapperStyle={{fontSize: '11px', fontWeight: 'bold', color: '#cbd5e1'}} 
                        />
                        <Tooltip cursor={false} contentStyle={{background: '#000', borderRadius: '8px', border: 'none'}} />
                      </RadialBarChart>
                   </ResponsiveContainer>
                </div>
            </div>

            {/* Quick Actions / Alerts */}
            <div className="glass-card rounded-3xl p-6 border border-white/5 relative overflow-hidden bg-gradient-to-br from-rose-900/10 to-onyx-900">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-bold text-sm flex items-center gap-2">
                        <Activity size={16} className="text-rose-400" />
                        Diagnóstico Rápido
                    </h3>
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                </div>
                <div className="space-y-3">
                   {profit < 0 ? (
                       <div className="flex items-start gap-3 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl">
                            <AlertTriangle size={16} className="text-rose-400 mt-0.5 shrink-0" />
                            <div>
                                <p className="text-xs font-bold text-white">Cash Burn Alert</p>
                                <p className="text-[10px] text-rose-200 mt-1">Sua operação está queimando caixa. Revise custos fixos na aba Financeiro.</p>
                            </div>
                        </div>
                   ) : (
                       <div className="flex items-start gap-3 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                            <Zap size={16} className="text-emerald-400 mt-0.5 shrink-0" />
                            <div>
                                <p className="text-xs font-bold text-white">Operação Saudável</p>
                                <p className="text-[10px] text-emerald-200 mt-1">Você está gerando lucro operacional. Considere reinvestir em Growth.</p>
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

export default Dashboard;