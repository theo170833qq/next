import React, { useEffect, useState } from 'react';
import { LayoutGrid, TrendingUp, Sparkles, MessageSquareText, Settings, Wifi, WifiOff } from 'lucide-react';
import { checkDatabaseConnection } from '../services/supabase';
import { useCompany } from '../context/CompanyContext';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const { companyData } = useCompany();
  const { user } = useAuth();

  // Monitoramento automático de conexão
  useEffect(() => {
    const checkStatus = async () => {
      const { status } = await checkDatabaseConnection();
      setIsOnline(status === 'online');
    };

    checkStatus();
    // Verifica a cada 30 segundos
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
    { id: 'finance', label: 'Finanças', icon: TrendingUp },
    { id: 'marketing', label: 'Creator', icon: Sparkles },
    { id: 'consultant', label: 'Advisor', icon: MessageSquareText },
  ];
  
  const avatarSeed = companyData?.userName || user?.email || 'NextUser';

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-72 glass-panel border-r-0 border-r-white/5 z-50 flex-col justify-between transition-all duration-300">
        <div>
          {/* Logo Area */}
          <div className="h-32 flex items-center justify-start px-8">
            <div className="relative group cursor-pointer flex items-center">
               {/* Logo Next Customizada - Aumentada */}
               <div className="relative w-12 h-12 mr-4">
                  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-[0_0_15px_rgba(99,102,241,0.6)]">
                      <path d="M8 32V8L20 20L8 32Z" fill="url(#grad1)" />
                      <path d="M20 20V8L32 20V32L20 20Z" fill="url(#grad2)" />
                      <defs>
                          <linearGradient id="grad1" x1="8" y1="8" x2="8" y2="32" gradientUnits="userSpaceOnUse">
                              <stop stopColor="#6366F1"/>
                              <stop offset="1" stopColor="#818CF8"/>
                          </linearGradient>
                          <linearGradient id="grad2" x1="32" y1="8" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                              <stop stopColor="#F43F5E"/>
                              <stop offset="1" stopColor="#FB7185"/>
                          </linearGradient>
                      </defs>
                  </svg>
               </div>
              <span className="font-extrabold text-4xl text-white tracking-tighter">
                NEXT
              </span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="mt-4 px-4 space-y-3">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              // Ajuste de label para desktop
              const label = item.id === 'marketing' ? 'Creator Studio' : item.id === 'consultant' ? 'Next Advisor' : item.label;
              
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center p-4 rounded-2xl transition-all duration-300 group relative overflow-hidden ${
                    isActive 
                      ? 'bg-gradient-to-r from-indigo-600/20 to-purple-600/10 text-white shadow-lg shadow-indigo-900/20 border border-white/10' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {isActive && (
                    <div className="absolute left-0 top-0 h-full w-1 bg-indigo-500 rounded-r-full shadow-[0_0_10px_#6366f1]"></div>
                  )}
                  <Icon size={24} className={`transition-colors ${isActive ? 'text-indigo-400' : 'group-hover:text-indigo-300'}`} />
                  <span className="ml-4 font-semibold text-lg tracking-wide">{label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer / User Profile */}
        <div className="p-6 border-t border-white/5 mx-2 mb-2">
           {/* Status Indicator */}
           <div className="flex items-center justify-between px-2 mb-4">
              <div className="flex items-center space-x-2">
                 <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></div>
                 <span className={`text-xs font-medium ${isOnline ? 'text-emerald-400' : 'text-red-400'}`}>
                    {isOnline ? 'Sistema Online' : 'Desconectado'}
                 </span>
              </div>
              {isOnline ? <Wifi size={14} className="text-emerald-500/50"/> : <WifiOff size={14} className="text-red-500/50"/>}
           </div>

          <button 
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center p-3 rounded-xl hover:bg-white/5 transition-colors group ${activeTab === 'settings' ? 'bg-white/5' : ''}`}
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-500 to-pink-500 p-[2px]">
              <div className="w-full h-full rounded-full bg-onyx-900 flex items-center justify-center overflow-hidden">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}`} alt="User" className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="ml-3 text-left overflow-hidden">
              <p className={`text-base font-bold truncate transition-colors ${activeTab === 'settings' ? 'text-indigo-300' : 'text-white group-hover:text-indigo-300'}`}>
                  {companyData?.userName || 'Usuário'}
              </p>
              <p className="text-xs text-gray-500 font-medium truncate">
                  {companyData?.companyName || 'Configurações'}
              </p>
            </div>
            <Settings size={20} className={`ml-auto text-gray-500 group-hover:rotate-90 transition-transform ${activeTab === 'settings' ? 'text-indigo-400 rotate-90' : ''}`} />
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation - Otimizada */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 glass-panel border-t border-white/10 z-50 px-2 pb-1 pt-1 flex items-center justify-between backdrop-blur-xl bg-onyx-900/80">
         {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
               <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex flex-col items-center justify-center p-1 rounded-xl transition-all w-16 ${isActive ? 'text-indigo-400' : 'text-gray-500 hover:text-gray-300'}`}
               >
                  <div className={`p-1 rounded-full mb-0.5 transition-all ${isActive ? 'bg-indigo-500/20 translate-y-[-2px]' : 'bg-transparent'}`}>
                     <Icon size={20} className={isActive ? 'text-indigo-400' : 'text-gray-400'} />
                  </div>
                  <span className="text-[10px] font-medium tracking-tight">{item.label}</span>
               </button>
            )
         })}
         <button
            onClick={() => setActiveTab('settings')}
            className={`flex flex-col items-center justify-center p-1 rounded-xl transition-all w-16 ${activeTab === 'settings' ? 'text-indigo-400' : 'text-gray-500 hover:text-gray-300'}`}
         >
             <div className={`p-1 rounded-full mb-0.5 transition-all ${activeTab === 'settings' ? 'bg-indigo-500/20 translate-y-[-2px]' : 'bg-transparent'}`}>
                <Settings size={20} className={activeTab === 'settings' ? 'text-indigo-400' : 'text-gray-400'} />
             </div>
             <span className="text-[10px] font-medium tracking-tight">Ajustes</span>
         </button>
      </nav>
    </>
  );
};

export default Sidebar;