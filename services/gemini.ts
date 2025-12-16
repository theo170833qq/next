import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  // O Vite injeta a chave aqui durante o build (definido no vite.config.ts)
  const apiKey = process.env.API_KEY;
  
  // Verificação de segurança simplificada
  if (!apiKey || apiKey.length < 10) {
    console.error("CRITICAL: API Key is invalid or missing.");
    throw new Error("API_KEY_MISSING");
  }
  
  return new GoogleGenAI({ apiKey: apiKey });
};

// Função de Teste de Conexão (Chamada no Settings)
export const validateGeminiConnection = async (): Promise<{ success: boolean; message: string; latency: number }> => {
    const start = performance.now();
    try {
        const ai = getClient();
        await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: 'ping',
        });
        const end = performance.now();
        return { success: true, message: "Conexão Estabelecida", latency: Math.round(end - start) };
    } catch (error: any) {
        console.error("Gemini Validation Error:", error);
        
        let msg = "Erro desconhecido";
        const errString = error.toString().toLowerCase();

        if (errString.includes("403") || errString.includes("permission denied")) {
            msg = "ERRO 403: Chave bloqueada ou restrição de domínio.";
        } else if (errString.includes("key") || errString.includes("api key") || errString.includes("missing")) {
            msg = "Chave de API Inválida.";
        } else if (errString.includes("429")) {
            msg = "Limite de Quota Excedido.";
        } else {
            msg = `Erro: ${error.message || error.toString()}`;
        }
        
        return { success: false, message: msg, latency: 0 };
    }
};

const generateWithFallback = async (params: any) => {
    try {
        const ai = getClient();
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            ...params
        });
        return response;

    } catch (error: any) {
        console.error("Gemini Generate Error:", error);
        const errStr = error.toString();
        
        // Retorna strings de erro específicas para tratamento na UI
        if (errStr.includes("403")) return { text: "ERRO_403_RESTRICTION" };
        if (errStr.includes("API key") || errStr.includes("MISSING")) return { text: "API_KEY_INVALID" };
        
        throw error;
    }
};

export const generateMarketingContent = async (topic: string, platform: string): Promise<string> => {
  try {
    const prompt = `Crie um post para o ${platform} sobre: "${topic}". Seja curto, viral e profissional. Formato Markdown.`;
    const response = await generateWithFallback({ contents: prompt });

    if (response.text === "ERRO_403_RESTRICTION") return "⚠️ Erro 403: Chave bloqueada. Verifique restrições.";
    if (response.text === "API_KEY_INVALID") return "⚠️ Erro de Configuração: API Key inválida.";
    if (!response.text) throw new Error("Resposta vazia da IA.");

    return response.text;
  } catch (error: any) {
    return `Erro ao gerar: ${error.message}`;
  }
};

export const analyzeFinancialData = async (dataContext: string): Promise<any> => {
  try {
    const response = await generateWithFallback({
      contents: `Analise: "${dataContext}". Gere projeção 6 meses. Retorne JSON: {analysis:string, data:[{month, revenue, expenses, profit}]}`,
      config: { responseMimeType: "application/json" }
    });

    if (response.text === "ERRO_403_RESTRICTION") return { analysis: "⚠️ Erro 403: Chave bloqueada.", data: [] };
    if (response.text === "API_KEY_INVALID") return { analysis: "⚠️ Chave Inválida.", data: [] };

    const jsonString = (response.text || '{}').replace(/```json|```/g, '').trim();
    return JSON.parse(jsonString);
  } catch (error: any) {
    return { analysis: `Erro: ${error.message}`, data: [] };
  }
};

export const getStrategicAdvice = async (query: string, history: string[]): Promise<string> => {
    try {
        const response = await generateWithFallback({
            contents: `Histórico: ${JSON.stringify(history)}\nUsuário: ${query}`,
        });
        
        if (response.text === "ERRO_403_RESTRICTION") return "⚠️ **ERRO 403**: Chave de API bloqueada.";
        if (response.text === "API_KEY_INVALID") return "API_KEY_ERROR_FLAG";

        return response.text || "Sem resposta.";
    } catch (e: any) {
        return `Erro de conexão: ${e.message}`;
    }
}

export const generateSalesStrategy = async (product: string, target: string, type: string): Promise<string> => {
    try {
        const prompt = `Atue como expert em vendas. Produto: ${product}. Alvo: ${target}. Tipo: ${type}. Crie estratégia.`;
        const response = await generateWithFallback({ contents: prompt });
        
        if (response.text === "ERRO_403_RESTRICTION") return "⚠️ Erro 403: Chave bloqueada.";
        if (response.text === "API_KEY_INVALID") return "API_KEY_MISSING";
        return response.text || "Sem resposta.";
    } catch (error: any) {
        return `Erro: ${error.message}`;
    }
};

export const generateHRContent = async (role: string, culture: string, type: string): Promise<string> => {
    try {
        const prompt = `RH Expert. Vaga: ${role}. Cultura: ${culture}. Tipo: ${type}. Crie texto.`;
        const response = await generateWithFallback({ contents: prompt });
        if (response.text === "ERRO_403_RESTRICTION") return "⚠️ Erro 403: Chave bloqueada.";
        if (response.text === "API_KEY_INVALID") return "API_KEY_MISSING";
        return response.text || "Sem resposta.";
    } catch (error: any) {
        return `Erro: ${error.message}`;
    }
};

export const generateLegalDoc = async (docType: string, parties: string, details: string): Promise<string> => {
    try {
        const prompt = `Advogado Sênior. Doc: ${docType}. Partes: ${parties}. Detalhes: ${details}. Crie minuta.`;
        const response = await generateWithFallback({ contents: prompt });
        if (response.text === "ERRO_403_RESTRICTION") return "⚠️ Erro 403: Chave bloqueada.";
        if (response.text === "API_KEY_INVALID") return "API_KEY_MISSING";
        return response.text || "Sem resposta.";
    } catch (error: any) {
        return `Erro: ${error.message}`;
    }
};

export const generateProductSpec = async (featureName: string, userGoal: string, complexity: string): Promise<string> => {
    try {
        const prompt = `PM Senior. Feature: ${featureName}. Goal: ${userGoal}. Complexity: ${complexity}. Crie PRD.`;
        const response = await generateWithFallback({ contents: prompt });
        if (response.text === "ERRO_403_RESTRICTION") return "⚠️ Erro 403: Chave bloqueada.";
        if (response.text === "API_KEY_INVALID") return "API_KEY_MISSING";
        return response.text || "Sem resposta.";
    } catch (error: any) {
        return `Erro: ${error.message}`;
    }
};

export const generateSupportReply = async (msg: string, tone: string): Promise<string> => {
    try {
        const prompt = `Suporte Cliente. Msg: ${msg}. Tom: ${tone}. Responda.`;
        const response = await generateWithFallback({ contents: prompt });
        if (response.text === "ERRO_403_RESTRICTION") return "⚠️ Erro 403: Chave bloqueada.";
        if (response.text === "API_KEY_INVALID") return "API_KEY_MISSING";
        return response.text || "Sem resposta.";
    } catch (error: any) {
        return `Erro: ${error.message}`;
    }
};