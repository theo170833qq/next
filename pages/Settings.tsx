import React, { useState, useEffect } from 'react';
import { User, Bell, Shield, Key, Save, Loader2, LogOut, CreditCard, Mail, Server, Wifi, CheckCircle2, XCircle, RefreshCw, Trash2 } from 'lucide-react';
import { checkDatabaseConnection } from '../services/supabase';
import { useAuth } from '../context/AuthContext';
import { useCompany } from '../context/CompanyContext';

const Settings: React.FC = () => {
  const { signOut, user } = useAuth();
  const { companyData, clearCompanyData } = useCompany();
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState('profile');
  const [dbStatus, setDbStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [latency, setLatency] = useState(0);
  
  const [notificationState, setNotificationState] = useState({
    email: true,
    push: false,
    marketing: true
  });

  useEffect(() => {
    if (activeSection === 'api') {
      runSystemCheck();
    }
  }, [activeSection]);

  const runSystemCheck = async () => {
    setDbStatus('checking');
    const result = await checkDatabaseConnection();
    // Simula um delay pequeno para visualização se for muito rápido
    setTimeout(() => {
        setDbStatus(result.status);
        setLatency(result.latency);
    }, 800);
  };

  const handleSave = () => {
    setLoading(true);
    // Simulating API call
    setTimeout(() => {
      setLoading(false);
      alert("Configurações salvas com sucesso!");
    }, 1500);
  };

  const handleLogout = async () => {
    await signOut();
  };
  
  const handleResetData = () => {
      if(confirm("Tem certeza? Isso apagará os dados da empresa (Faturamento, Nome, etc) e reiniciará o Onboarding.")){
          clearCompanyData();
          window.location.reload();
      }
  }

  const sections = [
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'notifications', label: 'Notificações', icon: Bell },
    { id: 'security', label: 'Segurança', icon: Shield },
    { id: 'api', label: 'Sistema & API', icon: Server },
    { id: 'billing', label: 'Assinatura', icon: CreditCard },
  ];

  const avatarSeed = companyData?.userName || user?.email || 'NextUser';

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-slide-up pb-10">
      <header className="border-b border-white/5 pb-6">
        <h1 className="text-3xl md:text-4xl font-extrabold text-white">Configurações</h1>
        <p className="text-gray-400 mt-2 text-sm md:text-base">Gerencie sua conta, preferências e chaves de acesso.</p>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column - Navigation/Summary */}
        <div className="space-y-6">
           {/* Profile Summary Card */}
           <div className="glass-card rounded-3xl p-6 text-center border border-white/5 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 to-transparent pointer-events-none"></div>
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-500 to-pink-500 p-[3px] mx-auto mb-4 relative z-10">
                  <div className="w-full h-full rounded-full bg-onyx-900 flex items-center justify-center overflow-hidden">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}`} alt="User" className="w-full h-full object-cover" />
                  </div>
              </div>
              <h3 className="text-xl font-bold text-white">{companyData?.userName || 'Usuário'}</h3>
              <p className="text-indigo-400 text-sm font-medium mb-4">Plano Enterprise</p>
              
              <div className="flex justify-center gap-2">
                 <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">Ativo</span>
                 <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold border border-blue-500/20">Verificado</span>
              </div>
           </div>

           {/* Quick Actions / Navigation */}
           <div className="glass-card rounded-3xl p-2 border border-white/5 overflow-x-auto flex lg:block no-scrollbar gap-2 lg:gap-0">
              {sections.map((item) => (
                  <button 
                    key={item.id} 
                    onClick={() => setActiveSection(item.id)}
                    className={`flex-shrink-0 lg:w-full flex items-center p-3 rounded-xl transition-colors whitespace-nowrap ${activeSection === item.id ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                  >
                      <item.icon size={18} className="mr-3" />
                      <span className="text-sm font-medium">{item.label}</span>
                  </button>
              ))}
           </div>
           
           <button 
                onClick={handleLogout}
                className="hidden lg:flex w-full p-4 rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-colors items-center justify-center font-medium"
           >
               <LogOut size={18} className="mr-2" />
               Sair da Conta
           </button>
        </div>

        {/* Right Column - Forms - Conditionally rendered based on section */}
        <div className="lg:col-span-2 space-y-6">
            
            {/* Personal Info */}
            {activeSection === 'profile' && (
                <div className="glass-card rounded-3xl p-6 md:p-8 border border-white/5 animate-fade-in">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-white flex items-center">
                            <User className="mr-2 text-indigo-400" size={20}/> Informações Pessoais
                        </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Nome Completo</label>
                            <input type="text" defaultValue={companyData?.userName} className="w-full bg-onyx-900 border border-white/10 rounded-xl p-3 text-white focus:ring-1 focus:ring-indigo-500 outline-none transition-all" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Empresa</label>
                            <input type="text" defaultValue={companyData?.companyName} className="w-full bg-onyx-900 border border-white/10 rounded-xl p-3 text-white focus:ring-1 focus:ring-indigo-500 outline-none transition-all" />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email Corporativo</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3.5 text-gray-500" size={18} />
                                <input 
                                    type="email" 
                                    defaultValue={user?.email || ''} 
                                    disabled
                                    className="w-full bg-onyx-900/50 border border-white/10 rounded-xl pl-10 pr-3 py-3 text-gray-400 cursor-not-allowed outline-none" 
                                />
                            </div>
                            <p className="text-[10px] text-gray-500">Para alterar seu email, entre em contato com o suporte.</p>
                        </div>
                    </div>

                    <div className="mt-8 pt-8 border-t border-white/5">
                        <h4 className="text-sm font-bold text-gray-400 mb-4">Zona de Perigo</h4>
                        <button 
                            onClick={handleResetData}
                            className="flex items-center text-red-400 hover:text-red-300 text-sm font-bold"
                        >
                            <Trash2 size={16} className="mr-2" />
                            Resetar Dados da Empresa (Voltar ao Onboarding)
                        </button>
                    </div>
                </div>
            )}

            {/* Notifications */}
            {activeSection === 'notifications' && (
                <div className="glass-card rounded-3xl p-6 md:p-8 border border-white/5 animate-fade-in">
                    <h3 className="text-lg font-bold text-white flex items-center mb-6">
                        <Bell className="mr-2 text-pink-400" size={20}/> Preferências de Notificação
                    </h3>
                    <div className="space-y-4">
                        {[
                            { key: 'email', label: 'Resumo Semanal por Email', desc: 'Receba insights de performance toda segunda-feira.' },
                            { key: 'push', label: 'Notificações Push no Navegador', desc: 'Alertas em tempo real sobre metas atingidas.' },
                            { key: 'marketing', label: 'Novidades de Produto', desc: 'Seja o primeiro a saber sobre novas features da IA.' }
                        ].map((item: any) => (
                            <div key={item.key} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                                <div className="pr-4">
                                    <h4 className="text-white font-medium text-sm">{item.label}</h4>
                                    <p className="text-gray-500 text-xs mt-1">{item.desc}</p>
                                </div>
                                <button 
                                    onClick={() => setNotificationState({...notificationState, [item.key]: !notificationState[item.key as keyof typeof notificationState]})}
                                    className={`w-12 h-6 rounded-full p-1 shrink-0 transition-colors duration-300 ${notificationState[item.key as keyof typeof notificationState] ? 'bg-indigo-500' : 'bg-gray-700'}`}
                                >
                                    <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-300 ${notificationState[item.key as keyof typeof notificationState] ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* System Status & API Keys */}
            {(activeSection === 'api' || activeSection === 'security' || activeSection === 'billing') && (
                <div className="space-y-6 animate-fade-in">
                    {/* Database Status Card */}
                    <div className="glass-card rounded-3xl p-6 md:p-8 border border-white/5">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-white flex items-center">
                                <Server className="mr-2 text-emerald-400" size={20}/> Status do Sistema
                            </h3>
                            <button 
                                onClick={runSystemCheck} 
                                className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
                                title="Executar diagnóstico"
                            >
                                <RefreshCw size={16} className={dbStatus === 'checking' ? 'animate-spin' : ''} />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Connection Widget */}
                            <div className="p-4 rounded-xl bg-onyx-950 border border-white/5 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${dbStatus === 'online' ? 'bg-emerald-500/10' : dbStatus === 'offline' ? 'bg-red-500/10' : 'bg-gray-500/10'}`}>
                                        <Wifi size={18} className={dbStatus === 'online' ? 'text-emerald-400' : dbStatus === 'offline' ? 'text-red-400' : 'text-gray-400'} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-white">Banco de Dados</p>
                                        <p className="text-xs text-gray-500">Supabase Postgres</p>
                                    </div>
                                </div>
                                
                                <div className="flex flex-col items-end">
                                    {dbStatus === 'checking' && <span className="text-xs text-yellow-400 flex items-center"><Loader2 size={12} className="animate-spin mr-1"/> Verificando...</span>}
                                    {dbStatus === 'online' && <span className="text-xs text-emerald-400 flex items-center font-bold"><CheckCircle2 size={12} className="mr-1"/> Operacional</span>}
                                    {dbStatus === 'offline' && <span className="text-xs text-red-400 flex items-center font-bold"><XCircle size={12} className="mr-1"/> Erro de Conexão</span>}
                                    
                                    {dbStatus === 'online' && <span className="text-[10px] text-gray-600 mt-1">{latency}ms latência</span>}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* API Keys */}
                    <div className="glass-card rounded-3xl p-6 md:p-8 border border-white/5">
                        <h3 className="text-lg font-bold text-white flex items-center mb-6">
                            <Key className="mr-2 text-yellow-400" size={20}/> Chaves de API
                        </h3>
                        <div className="p-4 rounded-xl bg-onyx-950 border border-dashed border-gray-700">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-bold text-gray-500">PUBLIC SUPABASE URL</span>
                                <span className="text-xs text-green-400 bg-green-400/10 px-2 py-0.5 rounded border border-green-400/20">Configurado</span>
                            </div>
                            <code className="text-gray-300 font-mono text-sm block bg-black/30 p-2 rounded truncate">
                                https://ffgoqeturuyhaqtxztga.supabase.co
                            </code>
                            <p className="text-xs text-gray-500 mt-2">Conectado ao projeto principal.</p>
                        </div>
                        
                        {activeSection !== 'api' && (
                            <p className="mt-6 text-sm text-gray-400 text-center italic">
                                Seções de Segurança e Assinatura em desenvolvimento para o plano Enterprise.
                            </p>
                        )}
                    </div>
                </div>
            )}

            <div className="flex justify-end pt-4 pb-12 lg:pb-0">
                <button 
                    onClick={handleSave}
                    disabled={loading}
                    className="w-full md:w-auto px-8 py-3 bg-white text-onyx-950 font-bold rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center disabled:opacity-70"
                >
                    {loading ? <Loader2 className="animate-spin mr-2" size={18} /> : <Save className="mr-2" size={18} />}
                    {loading ? 'Salvando...' : 'Salvar Alterações'}
                </button>
            </div>

        </div>
      </div>
    </div>
  );
};

export default Settings;