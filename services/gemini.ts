import { GoogleGenAI } from "@google/genai";

// --- CONFIGURAÇÃO DA API ---
// A chave deve ser carregada de process.env.API_KEY conforme guidelines @google/genai
const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey || apiKey.length < 10) {
    console.error("CRÍTICO: Variável de ambiente 'API_KEY' não encontrada ou inválida.");
    throw new Error("API_KEY_MISSING");
  }
  return new GoogleGenAI({ apiKey });
};

// Tratamento centralizado de erros
const handleGeminiError = (error: any): string => {
    console.error("Gemini API Error:", error);
    const msg = error.message || error.toString();
    
    // Erro específico para quando a env var não existe
    if (msg.includes("API_KEY_MISSING")) {
        return "API_KEY_MISSING";
    }

    // Detecção de erros da API do Google
    if (msg.includes("leaked") || msg.includes("PERMISSION_DENIED") || msg.includes("API key not valid")) {
        return "FATAL: Chave de API inválida ou bloqueada. Verifique suas configurações.";
    }
    if (msg.includes("403")) return "Erro 403: Acesso negado. A chave pode estar expirada.";
    if (msg.includes("429")) return "Erro 429: Muitos pedidos (Quota excedida).";
    if (msg.includes("404")) return "Erro 404: Modelo não encontrado.";
    
    return `Erro na IA: ${msg}`;
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
        return { success: true, message: "Conectado: Variável de Ambiente Configurada", latency: Math.round(end - start) };
    } catch (error: any) {
        let errorMsg = handleGeminiError(error);
        
        if (errorMsg === 'API_KEY_MISSING') {
             return { success: false, message: "Variável API_KEY não encontrada", latency: 0 };
        }

        return { 
            success: false, 
            message: errorMsg, 
            latency: 0 
        };
    }
};

export const generateMarketingContent = async (topic: string, platform: string): Promise<string> => {
    try {
        const ai = getClient();
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Atue como um especialista em Marketing Digital Sênior.
            Tarefa: Crie um post para o ${platform} sobre: "${topic}". 
            Requisitos:
            - Tom viral, engajador e extremamente profissional.
            - Use formatação Markdown (negrito, listas).
            - Inclua hashtags estratégicas no final.`,
        });
        return response.text || "⚠️ A IA não retornou texto.";
    } catch (e: any) {
        return handleGeminiError(e);
    }
};

export const analyzeFinancialData = async (dataContext: string): Promise<any> => {
    try {
        const ai = getClient();
        const prompt = `Atue como CFO (Diretor Financeiro).
        Analise os seguintes dados/cenário: "${dataContext}". 
        
        Gere uma projeção de 6 meses.
        IMPORTANTE: Retorne APENAS um JSON válido (sem markdown, sem \`\`\`) no seguinte formato estrito:
        {
            "analysis": "Texto explicativo da análise financeira...",
            "data": [
                {"month": "Mês 1", "revenue": 1000, "fixedCost": 500, "variableCost": 200, "profit": 300},
                ... (preencha 6 meses)
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
        const errMsg = handleGeminiError(e);
        return {
            analysis: errMsg === 'API_KEY_MISSING' ? "API_KEY_MISSING" : `⚠️ Não foi possível processar: ${errMsg}`,
            data: []
        };
    }
};

export const getStrategicAdvice = async (query: string, history: string[]): Promise<string> => {
    try {
        const ai = getClient();
        const prompt = `Você é um Consultor Executivo de Elite (Advisor AI) para empresas Enterprise.
        Histórico recente: ${JSON.stringify(history)}
        
        Pergunta do CEO: "${query}"
        
        Responda com insights estratégicos profundos, numéricos se possível, e diretrizes acionáveis.`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt
        });
        return response.text || "⚠️ Sem resposta da IA.";
    } catch (e: any) {
        return handleGeminiError(e);
    }
}

export const generateSalesStrategy = async (product: string, target: string, type: string): Promise<string> => {
    try {
        const ai = getClient();
        let promptType = "";
        if (type === 'cold_mail') promptType = "um Cold Email B2B curto, direto e persuasivo";
        if (type === 'script') promptType = "um roteiro de ligação (Script de Vendas) passo-a-passo";
        if (type === 'objection') promptType = "3 argumentos matadores para quebrar objeções";

        const prompt = `Atue como um VP de Vendas Global.
        Produto: ${product}
        Público Alvo: ${target}
        
        Tarefa: Crie ${promptType}. Use gatilhos mentais e PNL.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt
        });
        return response.text || "";
    } catch (e: any) {
        return handleGeminiError(e);
    }
};

export const generateHRContent = async (role: string, culture: string, type: string): Promise<string> => {
    try {
        const ai = getClient();
        const prompt = `Atue como Head de Cultura e Pessoas.
        Cargo: ${role}
        Cultura da Empresa: ${culture}
        
        Tarefa: Crie ${type === 'job_desc' ? 'uma Job Description irresistível' : 'um roteiro de entrevista cultural estruturado'} para esta posição.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt
        });
        return response.text || "";
    } catch (e: any) {
         return handleGeminiError(e);
    }
};

export const generateLegalDoc = async (docType: string, parties: string, details: string): Promise<string> => {
    try {
        const ai = getClient();
        const prompt = `Atue como Advogado Empresarial Sênior (Corporate Law).
        Documento: ${docType}
        Partes Envolvidas: ${parties}
        Detalhes do Acordo: ${details}
        
        Tarefa: Redija uma minuta formal e completa para este documento. Use linguagem jurídica adequada, mas clara.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt
        });
        return response.text || "";
    } catch (e: any) {
        return handleGeminiError(e);
    }
};

export const generateProductSpec = async (featureName: string, userGoal: string, complexity: string): Promise<string> => {
    try {
        const ai = getClient();
        const prompt = `Atue como Product Manager (PM) Sênior em uma Tech Company.
        Feature: ${featureName}
        Objetivo do Usuário: ${userGoal}
        Complexidade: ${complexity}
        
        Tarefa: Escreva um PRD (Product Requirements Document) profissional.
        Estrutura: 
        1. Contexto
        2. User Stories
        3. Critérios de Aceite (Gherkin syntax se possível)
        4. Requisitos Técnicos`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt
        });
        return response.text || "";
    } catch (e: any) {
        return handleGeminiError(e);
    }
};

export const generateSupportReply = async (msg: string, tone: string): Promise<string> => {
    try {
        const ai = getClient();
        const prompt = `Atue como Especialista em Customer Success.
        Mensagem do Cliente: "${msg}"
        Tom desejado: ${tone}
        
        Tarefa:
        1. Analise o sentimento (Positivo/Neutro/Negativo/Furioso).
        2. Escreva uma resposta perfeita para resolver o problema e encantar o cliente.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt
        });
        return response.text || "";
    } catch (e: any) {
        return handleGeminiError(e);
    }
};