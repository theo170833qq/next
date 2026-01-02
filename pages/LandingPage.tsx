import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, CheckCircle, Shield, Zap, BarChart3, Bot, Globe, ChevronRight, Lock, Play, Star } from 'lucide-react';

interface LandingPageProps {
  onLoginClick: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLoginClick }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Efeito de Cursor Spotlight Global
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
      
      // Atualiza variáveis CSS para efeitos de cards
      const cards = document.getElementsByClassName('spotlight-card');
      for (const card of cards) {
        const rect = (card as HTMLElement).getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        (card as HTMLElement).style.setProperty('--mouse-x', `${x}px`);
        (card as HTMLElement).style.setProperty('--mouse-y', `${y}px`);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-[#020408] font-sans text-white overflow-x-hidden selection:bg-indigo-500/30">
      
      {/* --- Cursor Glow Effect Background --- */}
      <div 
        className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(99, 102, 241, 0.15), transparent 40%)`
        }}
      />

      {/* --- Navbar --- */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#020408]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="relative w-8 h-8">
                  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-[0_0_10px_rgba(99,102,241,0.5)]">
                      <path d="M8 32V8L20 20L8 32Z" fill="url(#grad1_land)" />
                      <path d="M20 20V8L32 20V32L20 20Z" fill="url(#grad2_land)" />
                      <defs>
                          <linearGradient id="grad1_land" x1="8" y1="8" x2="8" y2="32" gradientUnits="userSpaceOnUse">
                              <stop stopColor="#6366F1"/>
                              <stop offset="1" stopColor="#818CF8"/>
                          </linearGradient>
                          <linearGradient id="grad2_land" x1="32" y1="8" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                              <stop stopColor="#F43F5E"/>
                              <stop offset="1" stopColor="#FB7185"/>
                          </linearGradient>
                      </defs>
                  </svg>
             </div>
             <span className="font-display font-bold text-xl tracking-tight">NEXT<span className="text-indigo-500">.AI</span></span>
          </div>
          
          <div className="flex items-center gap-6">
             <button onClick={onLoginClick} className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                Login
             </button>
             <button 
                onClick={onLoginClick}
                className="hidden md:flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-full text-sm font-bold hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.2)]"
             >
                Acessar Plataforma <ArrowRight size={14} />
             </button>
          </div>
        </div>
      </nav>

      {/* --- Hero Section --- */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              
              <div className="relative z-10 animate-slide-up">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-6">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                      </span>
                      <span className="text-xs font-bold text-indigo-300 tracking-wider uppercase">Nova Engine Gemini 2.5 Integrada</span>
                  </div>
                  
                  <h1 className="text-5xl lg:text-7xl font-display font-bold leading-[1.1] mb-6">
                      Transforme Dados em <br/>
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                          Decisões Milionárias
                      </span>
                  </h1>
                  
                  <p className="text-lg text-gray-400 mb-8 max-w-lg leading-relaxed">
                      Pare de adivinhar. O <strong>Next Intelligence</strong> usa IA generativa de elite para auditar seu financeiro, criar campanhas virais e treinar sua equipe. Tudo em um único comando.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                      <button 
                        onClick={onLoginClick}
                        className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all hover:scale-[1.02] shadow-[0_10px_40px_rgba(79,70,229,0.4)]"
                      >
                          <Zap fill="currentColor" size={20} />
                          Começar Agora
                      </button>
                      <button className="px-8 py-4 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all backdrop-blur-sm">
                          <Play fill="currentColor" size={16} />
                          Ver Demo
                      </button>
                  </div>
                  
                  <div className="mt-10 flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex -space-x-3">
                          {[1,2,3,4].map(i => (
                              <div key={i} className="w-8 h-8 rounded-full border-2 border-[#020408] bg-gray-800 overflow-hidden">
                                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i+10}`} alt="User" />
                              </div>
                          ))}
                      </div>
                      <p>Usado por +1.200 fundadores visionários.</p>
                  </div>
              </div>

              {/* 3D Visual Element */}
              <div className="relative lg:h-[600px] flex items-center justify-center perspective-1000">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse"></div>
                  
                  {/* Floating Card Stack (CSS 3D) */}
                  <div className="relative w-full max-w-md aspect-[4/5] animate-float-card rotate-y-12 rotate-x-6 transform-style-3d">
                      
                      {/* Back Card (Context) */}
                      <div className="absolute inset-0 bg-onyx-900 border border-white/5 rounded-3xl transform translate-z-[-40px] translate-x-[20px] translate-y-[20px] opacity-60"></div>
                      
                      {/* Main Card */}
                      <div className="absolute inset-0 bg-[#0B0F17]/90 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-6 flex flex-col justify-between overflow-hidden">
                          {/* Grid Pattern */}
                          <div className="absolute inset-0 opacity-20" style={{backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>

                          <div className="relative z-10">
                              <div className="flex justify-between items-center mb-6">
                                  <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center">
                                      <Bot className="text-indigo-400" />
                                  </div>
                                  <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
                                      Lucro: +24%
                                  </div>
                              </div>
                              <div className="space-y-4">
                                  <div className="h-2 bg-white/10 rounded-full w-3/4"></div>
                                  <div className="h-2 bg-white/10 rounded-full w-1/2"></div>
                                  <div className="h-32 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-xl border border-white/5 mt-4 flex items-end p-4 gap-2">
                                      <div className="w-1/5 bg-indigo-500/30 rounded-t h-[40%]"></div>
                                      <div className="w-1/5 bg-indigo-500/50 rounded-t h-[60%]"></div>
                                      <div className="w-1/5 bg-indigo-500/70 rounded-t h-[80%]"></div>
                                      <div className="w-1/5 bg-indigo-500 rounded-t h-[50%]"></div>
                                      <div className="w-1/5 bg-white rounded-t h-[90%] shadow-[0_0_15px_rgba(255,255,255,0.5)]"></div>
                                  </div>
                              </div>
                          </div>

                          <div className="relative z-10 bg-white/5 rounded-xl p-4 border border-white/5">
                              <div className="flex gap-3">
                                   <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center shrink-0">
                                       <Zap size={14} fill="white" className="text-white" />
                                   </div>
                                   <div>
                                       <p className="text-xs text-indigo-300 font-bold mb-1">INSIGHT GERADO</p>
                                       <p className="text-xs text-gray-300 leading-relaxed">
                                           "Reduza o CAC em 15% focando em canais orgânicos. Sua retenção aumentou, permitindo menor dependência de Ads."
                                       </p>
                                   </div>
                              </div>
                          </div>
                      </div>

                      {/* Floating Element */}
                      <div className="absolute -right-8 top-20 bg-onyx-900 border border-white/10 p-4 rounded-2xl shadow-xl transform translate-z-[50px] animate-float">
                          <BarChart3 className="text-pink-500 mb-2" />
                          <div className="text-xs font-bold text-white">MRR Growth</div>
                          <div className="text-lg font-bold text-pink-400">R$ 142k</div>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      {/* --- Features Section (Spotlight Cards) --- */}
      <section className="py-20 bg-[#05060a]">
          <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-16">
                  <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">Um Ecossistema Completo</h2>
                  <p className="text-gray-400 max-w-2xl mx-auto">
                      Não é apenas um dashboard. É uma equipe inteira de especialistas (CFO, CMO, CTO) condensada em algoritmos de inteligência artificial.
                  </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                      { icon: Bot, title: "Consultor IA 24/7", desc: "Tire dúvidas estratégicas sobre seu negócio e receba planos de ação baseados em dados reais.", color: "text-indigo-400" },
                      { icon: Zap, title: "Marketing Viral", desc: "Gere posts, scripts de vídeo e copys de vendas que engajam, calibrados para cada rede social.", color: "text-pink-400" },
                      { icon: BarChart3, title: "Auditoria Financeira", desc: "Simule cenários de crise, projete fluxo de caixa e descubra onde você está perdendo dinheiro.", color: "text-emerald-400" },
                      { icon: Globe, title: "Expansão Global", desc: "Ferramentas para internacionalização, tradução de contratos e análise de novos mercados.", color: "text-blue-400" },
                      { icon: Shield, title: "Jurídico Automático", desc: "Gere NDAs, contratos de serviço e termos de uso em segundos com base na legislação vigente.", color: "text-slate-400" },
                      { icon: Star, title: "Gestão de Talentos", desc: "Crie job descriptions perfeitos e roteiros de entrevista cultural para contratar os melhores.", color: "text-yellow-400" }
                  ].map((feature, i) => (
                      <div 
                        key={i}
                        className="spotlight-card group relative h-full bg-onyx-900 border border-white/5 rounded-3xl p-8 overflow-hidden transition-all hover:-translate-y-1"
                      >
                          {/* Spotlight Effect Div */}
                          <div 
                            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                            style={{
                                background: `radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(255,255,255,0.06), transparent 40%)`
                            }}
                          ></div>
                          
                          <div className="relative z-10">
                              <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 ${feature.color}`}>
                                  <feature.icon size={24} />
                              </div>
                              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                              <p className="text-sm text-gray-400 leading-relaxed">
                                  {feature.desc}
                              </p>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </section>

      {/* --- Social Proof / Trust --- */}
      <section className="py-20 border-y border-white/5 relative overflow-hidden">
          <div className="absolute inset-0 bg-indigo-900/5"></div>
          <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
               <div className="flex justify-center mb-8">
                   <div className="flex gap-1">
                       {[1,2,3,4,5].map(i => <Star key={i} size={20} className="text-yellow-400 fill-yellow-400" />)}
                   </div>
               </div>
               <h2 className="text-3xl md:text-4xl font-display font-bold mb-8">
                   "O Next Intelligence substituiu 4 ferramentas caras que usávamos. A precisão das projeções financeiras salvou nosso Q4."
               </h2>
               <div className="flex items-center justify-center gap-4">
                   <div className="w-12 h-12 rounded-full bg-gray-700 overflow-hidden border-2 border-white/10">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=CEO" alt="CEO" />
                   </div>
                   <div className="text-left">
                       <p className="text-white font-bold">Ricardo S.</p>
                       <p className="text-indigo-400 text-sm">CEO @ TechFlow</p>
                   </div>
               </div>
          </div>
      </section>

      {/* --- Pricing CTA --- */}
      <section className="py-32 px-6">
          <div className="max-w-5xl mx-auto bg-gradient-to-br from-indigo-900/40 to-onyx-900 rounded-[3rem] p-12 md:p-20 border border-white/10 text-center relative overflow-hidden">
              {/* Background Glows */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-500/20 rounded-full blur-[100px] pointer-events-none"></div>
              
              <div className="relative z-10">
                  <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
                      Pronto para escalar seu negócio?
                  </h2>
                  <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
                      Junte-se a elite empresarial que toma decisões baseadas em dados, não em intuição.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row justify-center gap-4">
                      <button 
                        onClick={onLoginClick}
                        className="px-10 py-5 bg-white text-black rounded-xl font-bold text-lg hover:bg-gray-200 transition-all hover:scale-105 shadow-[0_0_30px_rgba(255,255,255,0.3)] flex items-center justify-center gap-2"
                      >
                          Garantir Acesso Antecipado <ChevronRight />
                      </button>
                  </div>
                  
                  <p className="mt-6 text-sm text-gray-500 flex items-center justify-center gap-2">
                      <Lock size={14} /> Dados criptografados e seguros. Cancele a qualquer momento.
                  </p>
              </div>
          </div>
      </section>

      {/* --- Footer --- */}
      <footer className="border-t border-white/5 py-12 bg-[#020408]">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-2">
                 <div className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-pink-500 rounded-md"></div>
                 <span className="font-bold tracking-tight">NEXT.AI</span>
              </div>
              <div className="text-gray-500 text-sm">
                  &copy; 2024 Next Intelligence. Todos os direitos reservados.
              </div>
              <div className="flex gap-6 text-sm text-gray-400">
                  <a href="#" className="hover:text-white transition-colors">Termos</a>
                  <a href="#" className="hover:text-white transition-colors">Privacidade</a>
                  <a href="#" className="hover:text-white transition-colors">Suporte</a>
              </div>
          </div>
      </footer>
      
      <style>{`
        .transform-style-3d {
            transform-style: preserve-3d;
        }
        .perspective-1000 {
            perspective: 1000px;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;