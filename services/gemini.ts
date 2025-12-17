import { GoogleGenAI } from "@google/genai";

// --- CONFIGURAÇÃO DA API ---
// Chave fixada diretamente para evitar falhas de injeção de ambiente no Vercel/Vite
const API_KEY = "AIzaSyD2DMPL7qnm-aJdTx6inXwhWckghPAzIsA";

const getClient = () => {
  // Verificação de segurança simples
  if (!API_KEY || API_KEY.length < 10) {
    console.error("FATAL: API Key inválida ou curta demais.");
    throw new Error("API Key inválida.");
  }
  return new GoogleGenAI({ apiKey: API_KEY });
};

// --- FUNÇÕES REAIS ---

export const validateGeminiConnection = async (): Promise<{ success: boolean; message: string; latency: number }> => {
    const start = performance.now();
    try {
        const ai = getClient();
        await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: 'ping',
        });
        const end = performance.now();
        return { success: true, message: "Conexão Estabelecida (Hardcoded Key)", latency: Math.round(end - start) };
    } catch (error: any) {
        console.error("Erro de Conexão Gemini:", error);
        
        // Tratamento de mensagens de erro comuns para feedback visual
        let msg = error.message || "Erro desconhecido";
        if (msg.includes("403")) msg = "Erro 403: Chave bloqueada ou domínio não permitido.";
        if (msg.includes("429")) msg = "Erro 429: Quota excedida (Muitos requests).";
        
        return { 
            success: false, 
            message: msg, 
            latency: 0 
        };
    }
};

export const generateMarketingContent = async (topic: string, platform: string): Promise<string> => {
    try {
        const ai = getClient();
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Atue como um especialista em Marketing Digital. Crie um post para o ${platform} sobre: "${topic}". 
            O tom deve ser viral, engajador e profissional. 
            Use formatação Markdown.`,
        });
        return response.text || "Erro: A IA não retornou texto.";
    } catch (e: any) {
        console.error("Erro Marketing:", e);
        return `Erro ao gerar conteúdo: ${e.message}`;
    }
};

export const analyzeFinancialData = async (dataContext: string): Promise<any> => {
    try {
        const ai = getClient();
        const prompt = `Analise os seguintes dados financeiros ou cenário: "${dataContext}". 
        Gere uma projeção de 6 meses baseada nisso.
        Retorne APENAS um JSON válido (sem markdown) no seguinte formato:
        {
            "analysis": "Texto explicativo da análise...",
            "data": [
                {"month": "Mês 1", "revenue": 0, "fixedCost": 0, "variableCost": 0, "profit": 0},
                ... (6 meses)
            ]
        }`;
        
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: { responseMimeType: "application/json" }
        });

        const text = response.text || "{}";
        const cleanJson = text.replace(/```json|```/g, '').trim();
        return JSON.parse(cleanJson);
    } catch (e: any) {
        console.error("Erro Financeiro:", e);
        // Retorna um fallback vazio para não quebrar a tela
        return {
            analysis: `Erro na análise de dados: ${e.message}. Verifique a conexão.`,
            data: []
        };
    }
};

export const getStrategicAdvice = async (query: string, history: string[]): Promise<string> => {
    try {
        const ai = getClient();
        const prompt = `Você é um Consultor Executivo de Elite (Advisor AI).
        Histórico da conversa recente: ${JSON.stringify(history)}
        
        Pergunta do CEO (Usuário): "${query}"
        
        Responda com insights estratégicos, dados de mercado (se souber) e diretrizes acionáveis.`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt
        });
        return response.text || "Sem resposta.";
    } catch (e: any) {
        console.error("Erro Advisor:", e);
        return `Erro ao consultar advisor: ${e.message}`;
    }
}

export const generateSalesStrategy = async (product: string, target: string, type: string): Promise<string> => {
    try {
        const ai = getClient();
        let promptType = "";
        if (type === 'cold_mail') promptType = "um Cold Email B2B curto e persuasivo";
        if (type === 'script') promptType = "um roteiro de ligação (Script de Vendas)";
        if (type === 'objection') promptType = "argumentos para quebrar objeções";

        const prompt = `Atue como um VP de Vendas Sênior.
        Produto: ${product}
        Público Alvo/Contexto: ${target}
        
        Tarefa: Crie ${promptType} focado em alta conversão. Use técnicas de neuromarketing.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt
        });
        return response.text || "";
    } catch (e: any) {
        console.error("Erro Sales:", e);
        return `Erro de vendas: ${e.message}`;
    }
};

export const generateHRContent = async (role: string, culture: string, type: string): Promise<string> => {
    try {
        const ai = getClient();
        const prompt = `Atue como Head de RH (People & Culture).
        Cargo: ${role}
        Cultura da Empresa: ${culture}
        
        Tarefa: Crie ${type === 'job_desc' ? 'uma Job Description atraente' : 'um roteiro de entrevista cultural'} para esta posição.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt
        });
        return response.text || "";
    } catch (e: any) {
         console.error("Erro HR:", e);
         return `Erro RH: ${e.message}`;
    }
};

export const generateLegalDoc = async (docType: string, parties: string, details: string): Promise<string> => {
    try {
        const ai = getClient();
        const prompt = `Atue como Advogado Empresarial Sênior.
        Documento: ${docType}
        Partes: ${parties}
        Detalhes: ${details}
        
        Tarefa: Redija uma minuta formal para este documento. Inclua cláusulas padrão de proteção.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt
        });
        return response.text || "";
    } catch (e: any) {
        console.error("Erro Legal:", e);
        return `Erro Jurídico: ${e.message}`;
    }
};

export const generateProductSpec = async (featureName: string, userGoal: string, complexity: string): Promise<string> => {
    try {
        const ai = getClient();
        const prompt = `Atue como Product Manager Sênior.
        Feature: ${featureName}
        Objetivo do Usuário: ${userGoal}
        Complexidade Estimada: ${complexity}
        
        Tarefa: Escreva um PRD (Product Requirements Document) conciso contendo: User Stories, Critérios de Aceite e Requisitos Técnicos.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt
        });
        return response.text || "";
    } catch (e: any) {
        console.error("Erro Product:", e);
        return `Erro Produto: ${e.message}`;
    }
};

export const generateSupportReply = async (msg: string, tone: string): Promise<string> => {
    try {
        const ai = getClient();
        const prompt = `Atue como Especialista em Customer Success.
        Mensagem do Cliente: "${msg}"
        Tom desejado: ${tone}
        
        Tarefa: Escreva uma resposta e classifique o sentimento da mensagem original (Positivo/Neutro/Negativo) no início.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt
        });
        return response.text || "";
    } catch (e: any) {
        console.error("Erro Support:", e);
        return `Erro Suporte: ${e.message}`;
    }
};