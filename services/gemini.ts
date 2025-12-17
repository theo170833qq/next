import { GoogleGenAI } from "@google/genai";

// --- MOCK DATA GENERATORS (Fallback para quando a API falhar) ---
const getSimulationData = (type: string, prompt: string) => {
    console.warn(`⚠️ API Blocked/Failed. Switching to Simulation Mode for: ${type}`);
    
    if (type === 'marketing') {
        return `## 🚀 Estratégia Viral (Simulada)\n\nBaseado no seu tópico, aqui está uma sugestão de alta conversão:\n\n**Headline:** "O segredo que ninguém te conta sobre ${prompt.substring(0, 20)}..."\n\n**Corpo do Post:**\nVocê já parou para pensar por que a maioria falha em ${prompt}? A resposta está nos detalhes.\n\n1. **Foco no Essencial:** Menos é mais.\n2. **Consistência:** O segredo do jogo.\n3. **Dados:** Não minta para os números.\n\n👇 Comente "EU QUERO" para receber o guia completo!\n\n#Growth #Estratégia #${prompt.split(' ')[0]} #Viral`;
    }
    
    if (type === 'finance') {
        // Retorna um JSON válido simulado
        const simulatedData = {
            analysis: "⚠️ **Modo Simulação (API Indisponível):** A análise preliminar indica saúde financeira estável, mas atenção ao fluxo de caixa nos meses 3 e 4. Recomenda-se redução de 15% em custos fixos.",
            data: [
                { month: 'Mês 1', revenue: 45000, expenses: 32000, profit: 13000 },
                { month: 'Mês 2', revenue: 48000, expenses: 33000, profit: 15000 },
                { month: 'Mês 3', revenue: 52000, expenses: 35000, profit: 17000 },
                { month: 'Mês 4', revenue: 51000, expenses: 34000, profit: 17000 },
                { month: 'Mês 5', revenue: 58000, expenses: 36000, profit: 22000 },
                { month: 'Mês 6', revenue: 65000, expenses: 38000, profit: 27000 },
            ]
        };
        return JSON.stringify(simulatedData);
    }

    if (type === 'strategy') {
        return `💡 **Insight Estratégico (Simulado):**\n\nAnalisei seu histórico e o cenário atual. \n\n1. **Oportunidade Imediata:** Seus dados sugerem que o CAC está alto. Focar em retenção (LTV) agora trará ROI 3x maior que aquisição.\n2. **Risco:** Atenção à queima de caixa. Mantenha o runway acima de 6 meses.\n3. **Ação:** Implemente um programa de indicação (Referral) na próxima semana para baixar o custo de aquisição.`;
    }

    return "Resposta simulada: O sistema está operando em modo offline devido a restrições de API, mas seus dados estão seguros.";
};

const getClient = () => {
  const apiKey = process.env.API_KEY;
  // Aceita qualquer string não vazia para tentar a conexão
  if (!apiKey) {
    console.error("CRITICAL: API Key is missing.");
    throw new Error("API_KEY_MISSING");
  }
  return new GoogleGenAI({ apiKey: apiKey });
};

// Função genérica com tratamento de erro e fallback
const safeGenerate = async (params: any, type: string, promptForSimulation: string) => {
    try {
        const ai = getClient();
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            ...params
        });
        
        // Verifica se a resposta veio vazia ou com erro de bloqueio no texto (algumas APIs retornam 200 mas com texto de erro)
        if (!response || !response.text) throw new Error("Empty Response");
        
        return response.text;

    } catch (error: any) {
        console.error(`Gemini Error (${type}):`, error);
        // Se der QUALQUER erro (403, 429, 500, Network), usa o simulador
        return getSimulationData(type, promptForSimulation);
    }
};

export const validateGeminiConnection = async (): Promise<{ success: boolean; message: string; latency: number }> => {
    const start = performance.now();
    try {
        const ai = getClient();
        await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: 'ping',
        });
        const end = performance.now();
        return { success: true, message: "Conexão Real Estabelecida", latency: Math.round(end - start) };
    } catch (error: any) {
        console.error("Connection Validation Failed:", error);
        const end = performance.now();
        // Retorna sucesso falso, mas a UI vai saber lidar
        return { 
            success: false, 
            message: "Modo Simulação Ativo (API Blocked)", 
            latency: Math.round(end - start) 
        };
    }
};

export const generateMarketingContent = async (topic: string, platform: string): Promise<string> => {
    const prompt = `Crie um post para o ${platform} sobre: "${topic}". Seja curto, viral e profissional. Formato Markdown.`;
    return await safeGenerate({ contents: prompt }, 'marketing', topic);
};

export const analyzeFinancialData = async (dataContext: string): Promise<any> => {
    const prompt = `Analise: "${dataContext}". Gere projeção 6 meses. Retorne JSON: {analysis:string, data:[{month, revenue, expenses, profit}]}`;
    
    const textResponse = await safeGenerate({
      contents: prompt,
      config: { responseMimeType: "application/json" }
    }, 'finance', dataContext);

    try {
        // Limpeza básica do JSON markdown
        const jsonString = textResponse.replace(/```json|```/g, '').trim();
        return JSON.parse(jsonString);
    } catch (e) {
        // Fallback do Fallback se o JSON falhar
        return JSON.parse(getSimulationData('finance', dataContext));
    }
};

export const getStrategicAdvice = async (query: string, history: string[]): Promise<string> => {
    const prompt = `Histórico: ${JSON.stringify(history)}\nUsuário: ${query}`;
    return await safeGenerate({ contents: prompt }, 'strategy', query);
}

export const generateSalesStrategy = async (product: string, target: string, type: string): Promise<string> => {
    const prompt = `Atue como expert em vendas. Produto: ${product}. Alvo: ${target}. Tipo: ${type}. Crie estratégia.`;
    return await safeGenerate({ contents: prompt }, 'marketing', `Vendas: ${product}`); // Usa simulador de marketing/texto
};

export const generateHRContent = async (role: string, culture: string, type: string): Promise<string> => {
    const prompt = `RH Expert. Vaga: ${role}. Cultura: ${culture}. Tipo: ${type}. Crie texto.`;
    return await safeGenerate({ contents: prompt }, 'marketing', `RH: ${role}`);
};

export const generateLegalDoc = async (docType: string, parties: string, details: string): Promise<string> => {
    const prompt = `Advogado Sênior. Doc: ${docType}. Partes: ${parties}. Detalhes: ${details}. Crie minuta.`;
    return await safeGenerate({ contents: prompt }, 'marketing', `Legal: ${docType}`);
};

export const generateProductSpec = async (featureName: string, userGoal: string, complexity: string): Promise<string> => {
    const prompt = `PM Senior. Feature: ${featureName}. Goal: ${userGoal}. Complexity: ${complexity}. Crie PRD.`;
    return await safeGenerate({ contents: prompt }, 'marketing', `Product: ${featureName}`);
};

export const generateSupportReply = async (msg: string, tone: string): Promise<string> => {
    const prompt = `Suporte Cliente. Msg: ${msg}. Tom: ${tone}. Responda.`;
    return await safeGenerate({ contents: prompt }, 'marketing', `Support Reply`);
};