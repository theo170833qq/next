import React, { useState, useEffect } from 'react';
import { User, Bell, Shield, Key, Save, Loader2, LogOut, CreditCard, Mail, Server, Wifi, CheckCircle2, XCircle, RefreshCw, Trash2, Eye, EyeOff, AlertTriangle } from 'lucide-react';
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
  
  // Custom API Key State
  const [customKey, setCustomKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  
  const [notificationState, setNotificationState] = useState({
    email: true,
    push: false,
    marketing: true
  });

  useEffect(() => {
    if (activeSection === 'api') {
      runSystemCheck();
      const savedKey = localStorage.getItem('user_custom_api_key');
      if (savedKey) setCustomKey(savedKey);
    }
  }, [activeSection]);

  const runSystemCheck = async () => {
    setDbStatus('checking');
    const result = await checkDatabaseConnection();
    setTimeout(() => {
        setDbStatus(result.status);
        setLatency(result.latency);
    }, 800);
  };

  const handleSave = () => {
    setLoading(true);
    
    // Salva a chave customizada se houver
    if (activeSection === 'api' && customKey) {
        localStorage.setItem('user_custom_api_key', customKey.trim());
    } else if (activeSection === 'api' && !customKey) {
        localStorage.removeItem('user_custom_api_key');
    }

    setTimeout(() => {
      setLoading(false);
      alert("Configurações salvas e aplicadas com sucesso!");
    }, 1000);
  };

  const handleLogout = async () => {
    await signOut();
  };
  
  const handleResetData = () => {
      if(confirm("Tem certeza? Isso apagará os dados da empresa e reiniciará o Onboarding.")){
          clearCompanyData();
          window.location.reload();
      }
  }

  const sections = [
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'notifications', label: 'Notificações', icon: Bell },
    { id: 'api', label: 'Sistema & API', icon: Server },
    { id: 'security', label: 'Segurança', icon: Shield },
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

        {/* Right Column - Forms */}
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
                    </div>

                    <div className="mt-8 pt-8 border-t border-white/5">
                        <h4 className="text-sm font-bold text-gray-400 mb-4">Zona de Perigo</h4>
                        <button 
                            onClick={handleResetData}
                            className="flex items-center text-red-400 hover:text-red-300 text-sm font-bold"
                        >
                            <Trash2 size={16} className="mr-2" />
                            Resetar Dados da Empresa
                        </button>
                    </div>
                </div>
            )}

            {/* API Keys Configuration */}
            {activeSection === 'api' && (
                <div className="space-y-6 animate-fade-in">
                    
                    {/* Manual API Key Input */}
                    <div className="glass-card rounded-3xl p-6 md:p-8 border border-white/5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                        
                        <h3 className="text-lg font-bold text-white flex items-center mb-4 relative z-10">
                            <Key className="mr-2 text-yellow-400" size={20}/> Configuração de IA (Gemini)
                        </h3>
                        
                        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 mb-6 flex items-start gap-3">
                            <AlertTriangle className="text-yellow-400 shrink-0 mt-0.5" size={16} />
                            <div>
                                <p className="text-yellow-200 text-xs font-bold">Correção de Chave Inválida</p>
                                <p className="text-yellow-200/70 text-[11px] mt-1">
                                    Se você está vendo erros de "API Key Inválida", insira sua própria chave abaixo. Ela terá prioridade sobre a configuração do sistema.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-3 relative z-10">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Sua Chave de API Google (Gemini)</label>
                            <div className="relative group">
                                <div className="absolute inset-0 bg-indigo-500/10 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-500"></div>
                                <div className="relative flex items-center">
                                    <Key className="absolute left-4 text-gray-500" size={18} />
                                    <input 
                                        type={showKey ? "text" : "password"}
                                        value={customKey}
                                        onChange={(e) => setCustomKey(e.target.value)}
                                        placeholder="Cole sua chave aqui (começa com AIza...)"
                                        className="w-full bg-onyx-950 border border-white/10 rounded-xl pl-12 pr-12 py-4 text-white placeholder-gray-600 focus:ring-1 focus:ring-indigo-500 outline-none transition-all font-mono text-sm"
                                    />
                                    <button 
                                        onClick={() => setShowKey(!showKey)}
                                        className="absolute right-4 text-gray-500 hover:text-white transition-colors"
                                    >
                                        {showKey ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>
                            <p className="text-[10px] text-gray-500 pl-1">
                                Não tem uma chave? <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline">Gere uma gratuitamente no Google AI Studio</a>.
                            </p>
                        </div>
                    </div>

                    {/* Database Status */}
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
            )}

            {/* Other Sections Placeholders */}
            {(activeSection === 'notifications' || activeSection === 'security' || activeSection === 'billing') && (
                <div className="glass-card rounded-3xl p-6 md:p-8 border border-white/5 animate-fade-in text-center py-20">
                    <Shield className="mx-auto text-gray-600 mb-4" size={48} />
                    <h3 className="text-xl font-bold text-white mb-2">Em Desenvolvimento</h3>
                    <p className="text-gray-500 text-sm max-w-md mx-auto">
                        Esta funcionalidade estará disponível na próxima atualização do sistema Enterprise.
                    </p>
                </div>
            )}

            <div className="flex justify-end pt-4 pb-12 lg:pb-0">
                <button 
                    onClick={handleSave}
                    disabled={loading}
                    className="w-full md:w-auto px-8 py-3 bg-white text-onyx-950 font-bold rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center disabled:opacity-70 shadow-[0_0_20px_rgba(255,255,255,0.15)]"
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