import { GoogleGenAI, Type } from "@google/genai";

// --- CONFIGURAÇÃO CRÍTICA ---
// A chave está inserida diretamente aqui para ignorar falhas de variáveis de ambiente no Vercel.
const HARDCODED_KEY = "AIzaSyDGTmixEnDHms2t-vXUuM3BwUn_ZYvPrFw"; 

const getClient = () => {
  // Ignora process.env e usa a chave direta para garantir funcionamento
  const apiKey = HARDCODED_KEY;
  
  if (!apiKey || apiKey.includes("undefined")) {
    console.error("CRITICAL: API Key is missing/undefined in getClient");
    throw new Error("API_KEY_MISSING");
  }
  
  return new GoogleGenAI({ apiKey: apiKey });
};

// Função de Teste de Conexão (Chamada no Settings)
export const validateGeminiConnection = async (): Promise<{ success: boolean; message: string; latency: number }> => {
    const start = performance.now();
    try {
        const ai = getClient();
        console.log("Validating Gemini connection with key ending in...", HARDCODED_KEY.slice(-4));
        
        await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: 'ping',
        });
        const end = performance.now();
        return { success: true, message: "Conexão Estabelecida (Chave Válida)", latency: Math.round(end - start) };
    } catch (error: any) {
        console.error("Gemini Validation Error Full:", error);
        
        let msg = "Erro desconhecido";
        const errString = error.toString().toLowerCase();

        if (errString.includes("403") || errString.includes("permission denied")) {
            msg = "ERRO 403: Chave bloqueada ou restrita a IPs/Domínios incorretos no Google Cloud.";
        } else if (errString.includes("key") || errString.includes("api key")) {
            msg = "Chave de API Inválida/Não encontrada.";
        } else if (errString.includes("429") || errString.includes("quota")) {
            msg = "Limite de Quota Excedido (Erro 429).";
        } else if (errString.includes("fetch") || errString.includes("network")) {
            msg = "Erro de Rede/Conexão (Vercel Firewall?).";
        } else {
            msg = `Erro: ${error.message || error.toString()}`;
        }
        
        return { success: false, message: msg, latency: 0 };
    }
};

const generateWithFallback = async (params: any) => {
    try {
        const ai = getClient();
        // Lista de modelos simplificada para evitar erros de roteamento
        const models = ['gemini-2.5-flash', 'gemini-1.5-flash'];

        let lastError = null;

        for (const model of models) {
            try {
                const response = await ai.models.generateContent({
                    ...params,
                    model: model
                });
                return response;
            } catch (error: any) {
                console.warn(`Tentativa falhou no modelo ${model}:`, error);
                lastError = error;
                // Se o erro for de autenticação, não adianta tentar outro modelo
                if (error.toString().includes('403') || error.toString().toLowerCase().includes('key')) {
                    throw error;
                }
            }
        }
        throw lastError;

    } catch (error: any) {
        // Log para debug no console do navegador
        console.error("Gemini Generate Error:", error);
        
        // Retorna erro formatado para a UI não quebrar
        const errStr = error.toString();
        if (errStr.includes("403")) return { text: "ERRO_403_RESTRICTION" };
        if (errStr.includes("API key")) return { text: "API_KEY_INVALID" };
        
        throw error;
    }
};

export const generateMarketingContent = async (topic: string, platform: string): Promise<string> => {
  try {
    const prompt = `Crie um post para o ${platform} sobre: "${topic}". Seja curto, viral e profissional. Formato Markdown.`;
    const response = await generateWithFallback({ contents: prompt });

    if (response.text === "ERRO_403_RESTRICTION") return "⚠️ Erro 403: Sua chave API tem restrições (Referrer/IP) que bloqueiam o Vercel. Verifique o Google Cloud Console.";
    if (response.text === "API_KEY_INVALID") return "⚠️ Erro de Chave: A chave configurada é inválida.";
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

    if (response.text === "ERRO_403_RESTRICTION") return { analysis: "⚠️ Erro 403: Chave bloqueada pelo Google.", data: [] };
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
        
        if (response.text === "ERRO_403_RESTRICTION") return "⚠️ **ERRO CRÍTICO (403)**: A chave de API foi rejeitada pelo Google. Isso geralmente acontece quando a chave tem restrições de 'Application restrictions' (HTTP Referrers) que não incluem o domínio atual do Vercel, ou restrições de API.";
        if (response.text === "API_KEY_INVALID") return "⚠️ Chave de API Inválida.";

        return response.text || "Sem resposta.";
    } catch (e: any) {
        return `Erro de conexão: ${e.message}`;
    }
}

export const generateSalesStrategy = async (product: string, target: string, type: string): Promise<string> => {
    try {
        const prompt = `Atue como expert em vendas. Produto: ${product}. Alvo: ${target}. Tipo: ${type}. Crie estratégia.`;
        const response = await generateWithFallback({ contents: prompt });
        
        if (response.text === "ERRO_403_RESTRICTION") return "⚠️ Erro 403: Chave bloqueada. Verifique restrições no Google Cloud.";
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
        return response.text || "Sem resposta.";
    } catch (error: any) {
        return `Erro: ${error.message}`;
    }
};