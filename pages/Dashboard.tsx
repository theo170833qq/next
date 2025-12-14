import React from 'react';
import { TrendingUp, Users, DollarSign, Activity, ArrowUpRight, ArrowDownRight, Target, Zap, Download } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

const data = [
  { name: 'Jan', revenue: 4000, profit: 2400, amt: 2400 },
  { name: 'Fev', revenue: 3000, profit: 1398, amt: 2210 },
  { name: 'Mar', revenue: 2000, profit: 9800, amt: 2290 },
  { name: 'Abr', revenue: 2780, profit: 3908, amt: 2000 },
  { name: 'Mai', revenue: 1890, profit: 4800, amt: 2181 },
  { name: 'Jun', revenue: 2390, profit: 3800, amt: 2500 },
  { name: 'Jul', revenue: 3490, profit: 4300, amt: 2100 },
];

const StatCard = ({ title, value, change, isPositive, icon: Icon, gradient }: any) => (
  <div className="glass-card rounded-3xl p-6 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
    <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full bg-gradient-to-br ${gradient} opacity-20 blur-xl group-hover:opacity-30 transition-opacity`}></div>
    
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-2xl bg-white/5 border border-white/10 text-white shadow-inner`}>
        <Icon size={22} />
      </div>
      <div className={`flex items-center space-x-1 px-2 py-1 rounded-lg text-xs font-bold ${isPositive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
        {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
        <span>{change}</span>
      </div>
    </div>
    
    <div>
      <p className="text-gray-400 text-sm font-medium tracking-wide">{title}</p>
      <h3 className="text-3xl font-bold text-white mt-1 tracking-tight">{value}</h3>
    </div>
  </div>
);

interface DashboardProps {
  setActiveTab: (tab: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ setActiveTab }) => {
  
  const handleExportReport = () => {
    // CSV Header
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Mes,Receita,Lucro\n";
    
    // CSV Data
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
    <div className="space-y-8 animate-slide-up">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">Visão Geral</h1>
          <p className="text-gray-400 mt-2 font-light">Análise em tempo real do ecossistema da sua empresa.</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={handleExportReport}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-medium transition-colors text-gray-300"
          >
            <Download size={16} />
            Exportar Relatório
          </button>
          <button 
            onClick={() => setActiveTab('marketing')}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-900/50 rounded-xl text-sm font-bold text-white transition-all"
          >
            + Nova Campanha
          </button>
        </div>
      </header>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Receita Mensal" value="R$ 124.5k" change="12.5%" isPositive={true} icon={DollarSign} gradient="from-indigo-500 to-purple-500" />
        <StatCard title="Novos Usuários" value="1,284" change="8.2%" isPositive={true} icon={Users} gradient="from-blue-500 to-cyan-500" />
        <StatCard title="Taxa de Churn" value="2.4%" change="0.5%" isPositive={false} icon={Activity} gradient="from-rose-500 to-orange-500" />
        <StatCard title="LTV Médio" value="R$ 890" change="5.1%" isPositive={true} icon={Zap} gradient="from-emerald-500 to-teal-500" />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Chart */}
        <div className="lg:col-span-2 glass-card rounded-3xl p-8 border border-white/5">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <TrendingUp size={20} className="text-indigo-400" />
              Crescimento Financeiro
            </h3>
            <div className="flex space-x-2">
               {['1D', '1S', '1M', '1A'].map(p => (
                   <button key={p} className="px-3 py-1 rounded-lg text-xs font-medium bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                       {p}
                   </button>
               ))}
            </div>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#F43F5E" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} opacity={0.3} />
                <XAxis dataKey="name" stroke="#64748b" axisLine={false} tickLine={false} />
                <YAxis stroke="#64748b" axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0B0F17', borderColor: '#334155', borderRadius: '12px', color: '#fff' }} 
                  itemStyle={{ color: '#e2e8f0' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#6366F1" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" name="Receita" />
                <Area type="monotone" dataKey="profit" stroke="#F43F5E" strokeWidth={3} fillOpacity={1} fill="url(#colorProfit)" name="Lucro" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Side Panel: Targets & Alerts */}
        <div className="space-y-6">
            <div className="glass-card rounded-3xl p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                    <Target className="mr-2 text-rose-400" size={20} /> Metas do Trimestre
                </h3>
                <div className="space-y-5">
                    {[
                        { label: 'Vendas Totais', val: 75, color: 'bg-indigo-500' },
                        { label: 'Novos Leads', val: 45, color: 'bg-purple-500' },
                        { label: 'Redução de Custos', val: 90, color: 'bg-emerald-500' }
                    ].map((item, idx) => (
                        <div key={idx}>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-400">{item.label}</span>
                                <span className="text-white font-bold">{item.val}%</span>
                            </div>
                            <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                                <div className={`h-full rounded-full ${item.color} shadow-[0_0_10px_rgba(255,255,255,0.3)]`} style={{ width: `${item.val}%` }}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="glass-card rounded-3xl p-6 flex flex-col justify-center items-center text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 to-transparent"></div>
                <div className="relative z-10">
                    <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 flex items-center justify-center mx-auto mb-4 text-indigo-400">
                        <Zap size={32} />
                    </div>
                    <h4 className="text-white font-bold text-lg">Next Insights</h4>
                    <p className="text-gray-400 text-sm mt-2">Você tem 3 novas oportunidades de otimização de custos identificadas pela IA.</p>
                    <button 
                        onClick={() => setActiveTab('finance')}
                        className="mt-4 text-indigo-400 hover:text-indigo-300 text-sm font-bold"
                    >
                        Ver detalhes &rarr;
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;