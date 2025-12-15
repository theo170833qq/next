import React from 'react';
import { TrendingUp, Users, DollarSign, Activity, ArrowUpRight, ArrowDownRight, Target, Zap, Download, ShieldCheck, PieChart, BarChart3 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar, Legend, BarChart, Bar, Cell } from 'recharts';

const data = [
  { name: 'Jan', revenue: 4000, profit: 2400, amt: 2400 },
  { name: 'Fev', revenue: 3000, profit: 1398, amt: 2210 },
  { name: 'Mar', revenue: 2000, profit: 9800, amt: 2290 },
  { name: 'Abr', revenue: 2780, profit: 3908, amt: 2000 },
  { name: 'Mai', revenue: 1890, profit: 4800, amt: 2181 },
  { name: 'Jun', revenue: 2390, profit: 3800, amt: 2500 },
  { name: 'Jul', revenue: 3490, profit: 4300, amt: 2100 },
];

const healthData = [
  { name: 'Financeiro', uv: 90, fill: '#6366F1' },
  { name: 'Mkt & Vendas', uv: 65, fill: '#ec4899' }, // Pink
  { name: 'Operações', uv: 80, fill: '#10B981' }, // Emerald
  { name: 'Equipe', uv: 95, fill: '#F59E0B' }, // Amber
];

const StatCard = ({ title, value, change, isPositive, icon: Icon, colorClass, delay }: any) => (
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
      <h3 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">{value}</h3>
    </div>

    {/* Decorative line */}
    <div className={`absolute bottom-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-700 ${colorClass.replace('text-', 'bg-')}`}></div>
  </div>
);

interface DashboardProps {
  setActiveTab: (tab: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ setActiveTab }) => {
  
  const handleExportReport = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Mes,Receita,Lucro\n";
    data.forEach(function(row) {
      csvContent += `${row.name},${row.revenue},${row.profit}\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "next_intelligence_relatorio.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 animate-slide-up pb-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
             <div className="px-3 py-1 rounded-full text-[10px] font-bold bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 uppercase tracking-widest flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse mr-2"></span>
                Tempo Real
             </div>
             <span className="text-gray-500 text-xs font-medium">Última atualização: Agora</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-gray-400">
            Centro de Comando
          </h1>
          <p className="text-gray-400 mt-2 font-light max-w-lg text-lg">
            Sua empresa em uma visão panorâmica 360°.
          </p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={handleExportReport}
            className="flex items-center gap-2 px-5 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-sm font-medium transition-colors text-gray-300 backdrop-blur-md"
          >
            <Download size={18} />
            <span>Relatório</span>
          </button>
          <button 
            onClick={() => setActiveTab('finance')}
            className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 shadow-[0_0_30px_rgba(99,102,241,0.4)] rounded-2xl text-sm font-bold text-white transition-all transform hover:scale-105 border border-white/10 flex items-center gap-2"
          >
            <Zap size={18} fill="currentColor" />
            Simular Cenários
          </button>
        </div>
      </header>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Receita Mensal" value="R$ 124.5k" change="12.5%" isPositive={true} icon={DollarSign} colorClass="text-indigo-400" delay="0s" />
        <StatCard title="Novos Clientes" value="1,284" change="8.2%" isPositive={true} icon={Users} colorClass="text-blue-400" delay="0.1s" />
        <StatCard title="Churn Rate" value="2.4%" change="0.5%" isPositive={false} icon={Activity} colorClass="text-rose-400" delay="0.2s" />
        <StatCard title="LTV (Vida Útil)" value="R$ 890" change="5.1%" isPositive={true} icon={Target} colorClass="text-amber-400" delay="0.3s" />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Chart - Enhanced */}
        <div className="lg:col-span-2 glass-card rounded-3xl p-8 border border-white/5 relative overflow-hidden">
          {/* Background Grid Pattern */}
          <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`, backgroundSize: '40px 40px' }}></div>
          
          <div className="flex justify-between items-center mb-8 relative z-10">
            <div>
                <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                <TrendingUp size={24} className="text-indigo-400" />
                Performance Financeira
                </h3>
                <p className="text-gray-500 text-sm mt-1">Comparativo Receita vs. Lucro Líquido</p>
            </div>
            <div className="flex gap-2">
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20">
                    <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                    <span className="text-xs text-indigo-300 font-bold">Receita</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20">
                    <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                    <span className="text-xs text-rose-300 font-bold">Lucro</span>
                </div>
            </div>
          </div>
          
          <div className="h-[350px] w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.5}/>
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.5}/>
                    <stop offset="95%" stopColor="#F43F5E" stopOpacity={0}/>
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
                    stroke="#64748b" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 12}} 
                    tickFormatter={(value) => `R$${value/1000}k`}
                />
                <Tooltip 
                  contentStyle={{ 
                      backgroundColor: 'rgba(11, 15, 23, 0.9)', 
                      backdropFilter: 'blur(10px)',
                      borderColor: 'rgba(255,255,255,0.1)', 
                      borderRadius: '16px', 
                      color: '#fff', 
                      boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                      padding: '12px'
                  }} 
                  itemStyle={{ color: '#e2e8f0', fontWeight: 600 }}
                  cursor={{stroke: '#fff', strokeWidth: 1, strokeDasharray: '4 4', opacity: 0.3}}
                />
                <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#6366F1" 
                    strokeWidth={4} 
                    fillOpacity={1} 
                    fill="url(#colorRevenue)" 
                    activeDot={{r: 8, strokeWidth: 0, fill: '#fff', shadow: '0 0 20px #6366F1'}} 
                />
                <Area 
                    type="monotone" 
                    dataKey="profit" 
                    stroke="#F43F5E" 
                    strokeWidth={4} 
                    fillOpacity={1} 
                    fill="url(#colorProfit)" 
                    activeDot={{r: 8, strokeWidth: 0, fill: '#fff'}}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Column Stack */}
        <div className="flex flex-col gap-6">
            
            {/* Health Score Panel (New Visual) */}
            <div className="glass-card rounded-3xl p-6 flex flex-col relative overflow-hidden flex-1 border border-white/5 bg-gradient-to-b from-white/5 to-transparent">
                <div className="absolute top-0 right-0 p-4 opacity-20">
                    <ShieldCheck size={100} className="text-white" />
                </div>
                
                <h3 className="text-lg font-bold text-white mb-1 flex items-center z-10 relative">
                    <Activity className="mr-2 text-emerald-400" size={20} /> Saúde do Negócio
                </h3>
                <p className="text-gray-400 text-xs mb-6 z-10 relative">Indicador composto de estabilidade.</p>
                
                <div className="flex-1 w-full min-h-[200px] relative z-10 flex items-center justify-center">
                   <ResponsiveContainer width="100%" height="100%">
                      <RadialBarChart 
                        innerRadius="40%" 
                        outerRadius="100%" 
                        data={healthData} 
                        startAngle={180} 
                        endAngle={-180}
                        barSize={15}
                      >
                        <RadialBar background={{ fill: '#334155', opacity: 0.2 }} dataKey='uv' cornerRadius={10} />
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
                   
                   {/* Center Score */}
                   <div className="absolute inset-0 flex items-center justify-center pointer-events-none pr-24">
                        <div className="text-center">
                            <span className="text-4xl font-black text-white block">92</span>
                            <span className="text-[10px] text-gray-400 uppercase tracking-widest">Score</span>
                        </div>
                   </div>
                </div>

                <div className="mt-4 bg-emerald-500/10 rounded-xl p-3 border border-emerald-500/20 z-10">
                   <p className="text-xs text-emerald-300 font-medium flex items-center">
                      <ShieldCheck size={14} className="mr-1.5" />
                      Sua empresa está blindada e crescendo.
                   </p>
                </div>
            </div>

            {/* Quick Actions / Mini Metrics */}
            <div className="glass-card rounded-3xl p-6 border border-white/5 relative overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-bold text-sm">Distribuição de Receita</h3>
                    <PieChart size={16} className="text-gray-400" />
                </div>
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">Serviços</span>
                        <div className="flex-1 mx-3 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-500 rounded-full" style={{width: '65%'}}></div>
                        </div>
                        <span className="text-xs font-bold text-white">65%</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">Produtos</span>
                        <div className="flex-1 mx-3 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                            <div className="h-full bg-pink-500 rounded-full" style={{width: '25%'}}></div>
                        </div>
                        <span className="text-xs font-bold text-white">25%</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">Outros</span>
                        <div className="flex-1 mx-3 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                            <div className="h-full bg-cyan-500 rounded-full" style={{width: '10%'}}></div>
                        </div>
                        <span className="text-xs font-bold text-white">10%</span>
                    </div>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;