import React from 'react';
import { TrendingUp, Users, DollarSign, Activity, ArrowUpRight, ArrowDownRight, Target, Zap, Download, ShieldCheck } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar, Legend } from 'recharts';

const data = [
  { name: 'Jan', revenue: 4000, profit: 2400 },
  { name: 'Fev', revenue: 3000, profit: 1398 },
  { name: 'Mar', revenue: 2000, profit: 9800 },
  { name: 'Abr', revenue: 2780, profit: 3908 },
  { name: 'Mai', revenue: 1890, profit: 4800 },
  { name: 'Jun', revenue: 2390, profit: 3800 },
  { name: 'Jul', revenue: 3490, profit: 4300 },
];

const healthData = [
  { name: 'Financeiro', uv: 90, fill: '#6366F1' },
  { name: 'Marketing', uv: 65, fill: '#F43F5E' },
  { name: 'Operacional', uv: 80, fill: '#10B981' },
  { name: 'Equipe', uv: 95, fill: '#F59E0B' },
];

const StatCard = ({ title, value, change, isPositive, icon: Icon, gradient }: any) => (
  <div className="glass-card rounded-3xl p-6 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
    <div className={`absolute -right-6 -top-6 w-32 h-32 rounded-full bg-gradient-to-br ${gradient} opacity-10 blur-2xl group-hover:opacity-20 transition-opacity`}></div>
    
    <div className="flex justify-between items-start mb-4 relative z-10">
      <div className={`p-3 rounded-2xl bg-white/5 border border-white/10 text-white shadow-inner`}>
        <Icon size={22} />
      </div>
      <div className={`flex items-center space-x-1 px-2 py-1 rounded-lg text-xs font-bold ${isPositive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
        {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
        <span>{change}</span>
      </div>
    </div>
    
    <div className="relative z-10">
      <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">{title}</p>
      <h3 className="text-3xl font-extrabold text-white mt-1 tracking-tight">{value}</h3>
    </div>
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
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
             <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500 text-white uppercase tracking-wider">Premium</span>
             <span className="text-gray-500 text-xs font-medium">Atualizado agora</span>
          </div>
          <h1 className="text-4xl font-extrabold text-white">Visão Geral</h1>
          <p className="text-gray-400 mt-2 font-light max-w-lg">
            Monitoramento em tempo real da saúde da sua empresa. Seus indicadores vitais estão <span className="text-emerald-400 font-bold">excelentes</span>.
          </p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={handleExportReport}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-medium transition-colors text-gray-300"
          >
            <Download size={16} />
            Relatório
          </button>
          <button 
            onClick={() => setActiveTab('finance')}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.5)] rounded-xl text-sm font-bold text-white transition-all transform hover:scale-105"
          >
            Simular Cenários
          </button>
        </div>
      </header>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Receita Mensal" value="R$ 124.5k" change="12.5%" isPositive={true} icon={DollarSign} gradient="from-indigo-500 to-purple-500" />
        <StatCard title="Novos Clientes" value="1,284" change="8.2%" isPositive={true} icon={Users} gradient="from-blue-500 to-cyan-500" />
        <StatCard title="Churn Rate" value="2.4%" change="0.5%" isPositive={false} icon={Activity} gradient="from-rose-500 to-orange-500" />
        <StatCard title="LTV (Vida Útil)" value="R$ 890" change="5.1%" isPositive={true} icon={Zap} gradient="from-emerald-500 to-teal-500" />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Chart */}
        <div className="lg:col-span-2 glass-card rounded-3xl p-8 border border-white/5">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <TrendingUp size={20} className="text-indigo-400" />
              Crescimento vs. Lucro
            </h3>
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
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} opacity={0.2} />
                <XAxis dataKey="name" stroke="#64748b" axisLine={false} tickLine={false} />
                <YAxis stroke="#64748b" axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0B0F17', borderColor: '#334155', borderRadius: '12px', color: '#fff', boxShadow: '0 0 20px rgba(0,0,0,0.5)' }} 
                  itemStyle={{ color: '#e2e8f0' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#6366F1" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" name="Receita" />
                <Area type="monotone" dataKey="profit" stroke="#F43F5E" strokeWidth={3} fillOpacity={1} fill="url(#colorProfit)" name="Lucro" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Health Score Panel (New Visual) */}
        <div className="glass-card rounded-3xl p-6 flex flex-col relative overflow-hidden">
            <h3 className="text-lg font-bold text-white mb-2 flex items-center z-10">
                <ShieldCheck className="mr-2 text-emerald-400" size={20} /> Saúde do Negócio
            </h3>
            <p className="text-gray-400 text-xs mb-4 z-10">Pontuação baseada em 4 pilares estratégicos.</p>
            
            <div className="flex-1 w-full h-64 relative z-10">
               <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart 
                    innerRadius="30%" 
                    outerRadius="100%" 
                    data={healthData} 
                    startAngle={180} 
                    endAngle={0}
                  >
                    <RadialBar label={{ fill: '#fff', position: 'insideStart' }} background dataKey='uv' />
                    <Legend iconSize={10} width={120} height={140} layout='vertical' verticalAlign='middle' align="right" wrapperStyle={{fontSize: '12px', fontWeight: 'bold'}} />
                    <Tooltip contentStyle={{ backgroundColor: '#0B0F17', borderRadius: '8px', border: '1px solid #333', color: '#fff' }} cursor={false} />
                  </RadialBarChart>
               </ResponsiveContainer>
            </div>

            <div className="mt-auto bg-white/5 rounded-xl p-4 border border-white/5 z-10">
               <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white">Score Geral</span>
                  <span className="text-2xl font-extrabold text-emerald-400">92/100</span>
               </div>
               <div className="w-full bg-gray-800 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full" style={{width: '92%'}}></div>
               </div>
            </div>
            
            {/* Background Glow */}
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl"></div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;