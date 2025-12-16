import React, { useState } from 'react';
import { generateLegalDoc } from '../services/gemini';
import { Scale, FileText, Shield, Copy, Loader2, Feather, Stamp } from 'lucide-react';

const Legal: React.FC = () => {
  const [docType, setDocType] = useState('NDA');
  const [parties, setParties] = useState('');
  const [details, setDetails] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!parties || !details) return;
    setLoading(true);
    const content = await generateLegalDoc(docType, parties, details);
    setResult(content);
    setLoading(false);
  };

  const docTypes = [
      { id: 'NDA', label: 'Acordo de Confidencialidade (NDA)' },
      { id: 'ServiceContract', label: 'Contrato de Prestação de Serviços' },
      { id: 'PrivacyPolicy', label: 'Política de Privacidade' },
      { id: 'TermsOfUse', label: 'Termos de Uso (SaaS)' },
      { id: 'Partnership', label: 'Memorando de Parceria' }
  ];

  return (
    <div className="space-y-6 animate-slide-up pb-20">
      <header className="flex flex-col md:flex-row gap-4 justify-between items-end">
        <div>
            <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-500/20 text-slate-300 border border-slate-500/30 uppercase tracking-widest">Legal Eagle AI</span>
            </div>
            <h1 className="text-4xl font-extrabold text-white">Departamento Jurídico</h1>
            <p className="text-gray-400 mt-1">Geração automática de minutas contratuais e documentos legais.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Input */}
        <div className="lg:col-span-4 space-y-6">
            <div className="glass-card p-6 rounded-3xl border border-white/5 space-y-5 bg-gradient-to-b from-slate-900/40 to-onyx-900">
                
                <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                        <FileText size={14} className="text-slate-400"/> Tipo de Documento
                    </label>
                    <select 
                        value={docType}
                        onChange={(e) => setDocType(e.target.value)}
                        className="w-full bg-onyx-950 border border-white/10 rounded-xl p-4 text-white focus:ring-1 focus:ring-slate-500 outline-none transition-all appearance-none"
                    >
                        {docTypes.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                    </select>
                </div>

                <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                        <Feather size={14} className="text-slate-400"/> Partes Envolvidas
                    </label>
                    <input 
                        value={parties}
                        onChange={(e) => setParties(e.target.value)}
                        placeholder="Ex: Minha Empresa Ltda (Contratante) e João da Silva (Contratado)..."
                        className="w-full bg-onyx-950 border border-white/10 rounded-xl p-4 text-white focus:ring-1 focus:ring-slate-500 outline-none transition-all placeholder-gray-600"
                    />
                </div>

                <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                        <Scale size={14} className="text-slate-400"/> Detalhes & Cláusulas
                    </label>
                    <textarea 
                        value={details}
                        onChange={(e) => setDetails(e.target.value)}
                        placeholder="Ex: Valor de R$ 5.000,00, prazo de 12 meses, multa rescisória de 10%, foro da comarca de São Paulo..."
                        className="w-full bg-onyx-950 border border-white/10 rounded-xl p-4 text-white focus:ring-1 focus:ring-slate-500 outline-none transition-all placeholder-gray-600 h-32 resize-none"
                    />
                </div>

                <button
                    onClick={handleGenerate}
                    disabled={loading || !parties || !details}
                    className="w-full bg-slate-600 hover:bg-slate-500 text-white font-bold py-4 rounded-xl flex items-center justify-center transition-all disabled:opacity-50 shadow-lg shadow-slate-900/30 hover:scale-[1.02]"
                >
                    {loading ? <Loader2 className="animate-spin mr-2" /> : <Stamp className="mr-2" size={18} />}
                    {loading ? "Redigindo..." : "Gerar Minuta"}
                </button>
            </div>
            
            <div className="p-4 rounded-2xl border border-yellow-500/20 bg-yellow-500/5 flex gap-3 items-start">
                 <Shield size={18} className="text-yellow-500 shrink-0 mt-0.5" />
                 <p className="text-xs text-yellow-200/80">
                    <strong>Aviso Legal:</strong> A IA gera esboços (drafts). Todos os documentos devem ser revisados por um advogado qualificado antes da assinatura.
                 </p>
            </div>
        </div>

        {/* Right: Preview */}
        <div className="lg:col-span-8 h-full">
             <div className="glass-card rounded-3xl border border-white/5 h-full min-h-[600px] flex flex-col relative overflow-hidden bg-white/5">
                 
                 <div className="p-6 flex justify-between items-center border-b border-white/5 bg-onyx-900/50">
                     <h3 className="font-serif italic text-xl text-slate-300">Minuta do Documento</h3>
                     {result && (
                        <button onClick={() => navigator.clipboard.writeText(result)} className="text-xs flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors text-white">
                            <Copy size={14} /> Copiar Texto
                        </button>
                     )}
                 </div>

                 <div className="p-10 overflow-y-auto custom-scrollbar flex-1 relative bg-onyx-950">
                    {!result && !loading && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-700 opacity-50">
                            <Scale size={64} className="mb-4" strokeWidth={1} />
                            <p className="text-lg font-light font-serif">Aguardando dados...</p>
                        </div>
                    )}

                    {loading && (
                        <div className="space-y-6 animate-pulse px-4">
                            {[1,2,3,4,5].map(i => (
                                <div key={i} className="space-y-2">
                                    <div className="h-4 bg-slate-800 rounded w-1/4"></div>
                                    <div className="h-3 bg-slate-900 rounded w-full"></div>
                                    <div className="h-3 bg-slate-900 rounded w-full"></div>
                                    <div className="h-3 bg-slate-900 rounded w-3/4"></div>
                                </div>
                            ))}
                        </div>
                    )}

                    {result && (
                        <div className="prose prose-invert max-w-none prose-headings:font-serif prose-headings:text-slate-200 prose-p:text-slate-300 prose-strong:text-white">
                             <div className="whitespace-pre-wrap font-serif text-sm leading-relaxed tracking-wide">
                                {result.split('\n').map((line, i) => (
                                    <p key={i} className="mb-4">{line.replace(/\*\*/g, '')}</p>
                                ))}
                             </div>
                        </div>
                    )}
                 </div>
             </div>
        </div>

      </div>
    </div>
  );
};

export default Legal;