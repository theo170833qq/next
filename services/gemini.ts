import { GoogleGenAI } from "@google/genai";

// Inicializa o cliente com a chave forçada no vite.config.ts
const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key não encontrada.");
  }
  return new GoogleGenAI({ apiKey: apiKey });
};

// --- FUNÇÕES REAIS (SEM SIMULAÇÃO) ---

export const validateGeminiConnection = async (): Promise<{ success: boolean; message: string; latency: number }> => {
    const start = performance.now();
    try {
        const ai = getClient();
        await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: 'ping',
        });
        const end = performance.now();
        return { success: true, message: "Conexão Real: OK", latency: Math.round(end - start) };
    } catch (error: any) {
        console.error("Erro de Conexão Real:", error);
        return { 
            success: false, 
            message: error.message || "Erro ao conectar com Google API", 
            latency: 0 
        };
    }
};

export const generateMarketingContent = async (topic: string, platform: string): Promise<string> => {
    const ai = getClient();
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Atue como um especialista em Marketing Digital. Crie um post para o ${platform} sobre: "${topic}". 
        O tom deve ser viral, engajador e profissional. 
        Use formatação Markdown.`,
    });
    return response.text || "Erro: Resposta vazia da API.";
};

export const analyzeFinancialData = async (dataContext: string): Promise<any> => {
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

    try {
        const text = response.text || "{}";
        // Remove markdown caso a API teime em mandar ```json
        const cleanJson = text.replace(/```json|```/g, '').trim();
        return JSON.parse(cleanJson);
    } catch (e) {
        console.error("Erro ao fazer parse do JSON financeiro", e);
        throw new Error("A IA não retornou um JSON válido.");
    }
};

export const getStrategicAdvice = async (query: string, history: string[]): Promise<string> => {
    const ai = getClient();
    const prompt = `Você é um Consultor Executivo de Elite (Advisor AI).
    Histórico da conversa recente: ${JSON.stringify(history)}
    
    Pergunta do CEO (Usuário): "${query}"
    
    Responda com insights estratégicos, dados de mercado (se souber) e diretrizes acionáveis.`;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
    });
    return response.text || "";
}

export const generateSalesStrategy = async (product: string, target: string, type: string): Promise<string> => {
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
};

export const generateHRContent = async (role: string, culture: string, type: string): Promise<string> => {
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
};

export const generateLegalDoc = async (docType: string, parties: string, details: string): Promise<string> => {
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
};

export const generateProductSpec = async (featureName: string, userGoal: string, complexity: string): Promise<string> => {
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
};

export const generateSupportReply = async (msg: string, tone: string): Promise<string> => {
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
};