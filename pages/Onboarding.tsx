import React, { useState } from 'react';
import { useCompany, CompanyData } from '../context/CompanyContext';
import { Building2, User, DollarSign, Wallet, Flame, ArrowRight, Activity, TrendingUp } from 'lucide-react';

const Onboarding: React.FC = () => {
  const { saveCompanyData } = useCompany();
  const [step, setStep] = useState(1);
  
  const [formData, setFormData] = useState<CompanyData>({
    companyName: '',
    userName: '',
    mrr: 0,
    cashBalance: 0,
    monthlyBurn: 0,
    sector: 'SaaS',
    currency: 'BRL'
  });

  const handleChange = (field: keyof CompanyData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 2) {
        setStep(step + 1);
    } else {
        saveCompanyData(formData);
    }
  };

  return (
    <div className="min-h-screen bg-onyx-950 flex items-center justify-center p-4 font-sans relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[100px]"></div>

        <div className="w-full max-w-2xl glass-card rounded-3xl p-8 md:p-12 border border-white/10 animate-slide-up relative z-10">
            
            <div className="mb-10 text-center">
                <div className="w-16 h-16 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(99,102,241,0.3)]">
                    {step === 1 ? <Building2 className="text-white" size={32} /> : <Activity className="text-white" size={32} />}
                </div>
                <h2 className="text-3xl font-display font-bold text-white mb-2">
                    {step === 1 ? 'Configure seu Quartel General' : 'Calibrando Métricas'}
                </h2>
                <p className="text-gray-400">
                    {step === 1 ? 'Vamos personalizar o Next Intelligence para o seu negócio.' : 'Insira seus números reais para gerar insights precisos.'}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                
                {step === 1 && (
                    <div className="space-y-4 animate-fade-in">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-2">
                                <User size={14}/> Como devemos te chamar?
                            </label>
                            <input 
                                type="text" 
                                required
                                value={formData.userName}
                                onChange={(e) => handleChange('userName', e.target.value)}
                                placeholder="Seu nome ou apelido"
                                className="w-full bg-onyx-900 border border-white/10 rounded-xl p-4 text-white text-lg placeholder-gray-600 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-2">
                                <Building2 size={14}/> Nome da Empresa
                            </label>
                            <input 
                                type="text" 
                                required
                                value={formData.companyName}
                                onChange={(e) => handleChange('companyName', e.target.value)}
                                placeholder="Ex: Acme Corp, Minha Startup..."
                                className="w-full bg-onyx-900 border border-white/10 rounded-xl p-4 text-white text-lg placeholder-gray-600 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-indigo-300 uppercase tracking-wider">Setor de Atuação</label>
                            <select 
                                value={formData.sector}
                                onChange={(e) => handleChange('sector', e.target.value)}
                                className="w-full bg-onyx-900 border border-white/10 rounded-xl p-4 text-white text-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all appearance-none"
                            >
                                <option value="SaaS">Tecnologia / SaaS</option>
                                <option value="Ecommerce">E-commerce / Varejo</option>
                                <option value="Services">Serviços / Consultoria</option>
                                <option value="Industry">Indústria</option>
                                <option value="Other">Outro</option>
                            </select>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-4 animate-fade-in">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                                <TrendingUp size={14}/> Faturamento Médio Mensal (Receita)
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-4 text-gray-500 font-bold">R$</span>
                                <input 
                                    type="number" 
                                    required
                                    min="0"
                                    value={formData.mrr || ''}
                                    onChange={(e) => handleChange('mrr', parseFloat(e.target.value))}
                                    placeholder="0.00"
                                    className="w-full bg-onyx-900 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white text-lg placeholder-gray-600 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-2">
                                    <Wallet size={14}/> Caixa Disponível
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-4 text-gray-500 font-bold">R$</span>
                                    <input 
                                        type="number" 
                                        required
                                        min="0"
                                        value={formData.cashBalance || ''}
                                        onChange={(e) => handleChange('cashBalance', parseFloat(e.target.value))}
                                        placeholder="0.00"
                                        className="w-full bg-onyx-900 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white text-lg placeholder-gray-600 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-2">
                                    <Flame size={14}/> Despesa Mensal (Burn)
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-4 text-gray-500 font-bold">R$</span>
                                    <input 
                                        type="number" 
                                        required
                                        min="0"
                                        value={formData.monthlyBurn || ''}
                                        onChange={(e) => handleChange('monthlyBurn', parseFloat(e.target.value))}
                                        placeholder="0.00"
                                        className="w-full bg-onyx-900 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white text-lg placeholder-gray-600 focus:ring-2 focus:ring-rose-500/50 outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="pt-4 flex items-center justify-between">
                     {step === 2 && (
                         <button 
                            type="button"
                            onClick={() => setStep(1)}
                            className="text-gray-400 hover:text-white text-sm font-bold px-4 py-2"
                         >
                             Voltar
                         </button>
                     )}
                     <div className="flex-1"></div>
                    <button 
                        type="submit"
                        className="bg-white text-onyx-950 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] flex items-center gap-2 group"
                    >
                        {step === 1 ? 'Próximo' : 'Inicializar Dashboard'}
                        <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                    </button>
                </div>

                <div className="flex justify-center gap-2 mt-6">
                    <div className={`w-2 h-2 rounded-full transition-colors ${step >= 1 ? 'bg-indigo-500' : 'bg-gray-700'}`}></div>
                    <div className={`w-2 h-2 rounded-full transition-colors ${step >= 2 ? 'bg-indigo-500' : 'bg-gray-700'}`}></div>
                </div>

            </form>
        </div>
    </div>
  );
};

export default Onboarding;
