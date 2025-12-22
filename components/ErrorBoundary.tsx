import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Terminal } from "lucide-react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#020408] flex items-center justify-center p-6 font-sans text-gray-200">
          <div className="max-w-lg w-full bg-[#0B0F17] border border-red-900/30 rounded-3xl p-8 shadow-[0_0_50px_rgba(220,38,38,0.1)] relative overflow-hidden">
             
             {/* Background pulse */}
             <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-red-900/5 rounded-full blur-3xl pointer-events-none animate-pulse"></div>

             <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mb-6 border border-red-500/20">
                    <AlertTriangle size={40} className="text-red-500" />
                </div>
                
                <h1 className="text-2xl font-bold text-white mb-2">Sistema Interrompido</h1>
                <p className="text-gray-400 mb-6 text-sm leading-relaxed">
                  Ocorreu um erro crítico de execução. Isso geralmente acontece devido a falhas de configuração de ambiente ou conexão.
                </p>

                <div className="w-full bg-black/40 rounded-xl p-4 mb-6 border border-white/5 text-left overflow-hidden">
                    <div className="flex items-center gap-2 mb-2 border-b border-white/5 pb-2">
                        <Terminal size={12} className="text-gray-500" />
                        <span className="text-[10px] uppercase font-bold text-gray-500">Log de Erro</span>
                    </div>
                    <code className="text-xs font-mono text-red-300 break-words block">
                        {this.state.error?.message || "Erro desconhecido"}
                    </code>
                </div>

                <div className="flex gap-3 w-full">
                    <button 
                        onClick={() => window.location.reload()}
                        className="flex-1 bg-white text-black font-bold py-3 rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
                    >
                        <RefreshCw size={16} /> Reiniciar Sistema
                    </button>
                </div>
                
                <p className="mt-6 text-[10px] text-gray-600">
                    Se o problema persistir, verifique as Variáveis de Ambiente na Vercel.
                </p>
             </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;