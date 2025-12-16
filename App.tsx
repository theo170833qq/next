import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Marketing from './pages/Marketing';
import Finance from './pages/Finance';
import Consultant from './pages/Consultant';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Onboarding from './pages/Onboarding';
import Sales from './pages/Sales';
import Team from './pages/Team';
import Legal from './pages/Legal';
import Product from './pages/Product';
import Support from './pages/Support';
import { useAuth } from './context/AuthContext';
import { useCompany } from './context/CompanyContext';
import { Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { user, loading } = useAuth();
  const { companyData } = useCompany();

  // Timestamp de Build para verificar atualização
  const BUILD_VERSION = "v1.2 (Hardcoded Key Fix)";

  // Tela de Loading Inicial da Aplicação
  if (loading) {
    return (
      <div className="min-h-screen bg-onyx-950 flex items-center justify-center">
        <div className="flex flex-col items-center">
           <div className="w-16 h-16 relative">
              <div className="absolute inset-0 border-4 border-indigo-500/30 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
           </div>
           <p className="text-indigo-400 mt-4 font-medium animate-pulse">Carregando Next Intelligence...</p>
        </div>
      </div>
    );
  }

  // Se não houver usuário, mostra Login
  if (!user) {
    return <Login />;
  }

  // Se houver usuário mas não houver dados da empresa, mostra Onboarding
  if (!companyData) {
    return <Onboarding />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard setActiveTab={setActiveTab} />;
      case 'marketing':
        return <Marketing />;
      case 'finance':
        return <Finance />;
      case 'sales':
        return <Sales onNavigate={setActiveTab} />;
      case 'product':
        return <Product onNavigate={setActiveTab} />;
      case 'support':
        return <Support onNavigate={setActiveTab} />;
      case 'team':
        return <Team onNavigate={setActiveTab} />;
      case 'legal':
        return <Legal onNavigate={setActiveTab} />;
      case 'consultant':
        return <Consultant onNavigate={setActiveTab} />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="flex min-h-screen font-sans text-gray-100 selection:bg-indigo-500/30 overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 ml-0 md:ml-72 p-4 md:p-8 relative h-screen overflow-y-auto overflow-x-hidden">
        
        {/* Atmospheric Backgrounds */}
        <div className="fixed inset-0 pointer-events-none z-[-1]">
             {/* Deep base */}
            <div className="absolute inset-0 bg-onyx-950"></div>
            
            {/* Mesh Gradients */}
            <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse" style={{animationDuration: '8s'}}></div>
            <div className="absolute bottom-[-20%] right-[-5%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[100px] animate-float"></div>
            
            {/* Grain overlay for texture */}
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
        </div>

        <div className="relative z-10 max-w-[1600px] mx-auto pb-20 md:pb-10">
            {renderContent()}
        </div>

        {/* Version Indicator for Debugging Vercel Updates */}
        <div className="fixed bottom-2 right-2 z-50 text-[10px] text-gray-700 bg-white/5 px-2 py-1 rounded pointer-events-none">
            Build: {BUILD_VERSION}
        </div>
      </main>
    </div>
  );
};

export default App;