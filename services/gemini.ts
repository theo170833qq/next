import { GoogleGenAI } from "@google/genai";

// --- CONFIGURAÇÃO DA API ---
// Chave fixada e limpa de espaços vazios para garantir conexão
const RAW_KEY = "AIzaSyD2DMPL7qnm-aJdTx6inXwhWckghPAzIsA";
const API_KEY = RAW_KEY.trim();

const getClient = () => {
  if (!API_KEY || API_KEY.length < 10) {
    console.error("CRÍTICO: Chave de API inválida no código.");
    throw new Error("Chave de API não configurada corretamente.");
  }
  return new GoogleGenAI({ apiKey: API_KEY });
};

// --- FUNÇÕES REAIS ---

export const validateGeminiConnection = async (): Promise<{ success: boolean; message: string; latency: number }> => {
    const start = performance.now();
    try {
        const ai = getClient();
        // Teste simples de ping
        await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: 'ping',
        });
        const end = performance.now();
        return { success: true, message: "Conectado: API Google Gemini Ativa", latency: Math.round(end - start) };
    } catch (error: any) {
        console.error("Erro de Conexão Gemini:", error);
        
        let msg = error.message || "Erro desconhecido";
        // Tradução de erros comuns para facilitar debug
        if (msg.includes("403")) msg = "Erro 403: Chave bloqueada ou sem permissão.";
        if (msg.includes("429")) msg = "Erro 429: Limite de requisições excedido (Quota).";
        if (msg.includes("404")) msg = "Erro 404: Modelo gemini-2.5-flash não encontrado para esta chave.";
        if (msg.includes("key")) msg = "Erro na Chave de API.";
        
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
            contents: `Atue como um especialista em Marketing Digital Sênior.
            Tarefa: Crie um post para o ${platform} sobre: "${topic}". 
            Requisitos:
            - Tom viral, engajador e extremamente profissional.
            - Use formatação Markdown (negrito, listas).
            - Inclua hashtags estratégicas no final.`,
        });
        return response.text || "⚠️ A IA não retornou texto. Tente novamente.";
    } catch (e: any) {
        console.error("Erro Marketing:", e);
        return `❌ Erro na API: ${e.message}. Verifique a conexão nas Configurações.`;
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
        // Limpeza agressiva para garantir JSON
        const cleanJson = text.replace(/```json|```/g, '').trim();
        return JSON.parse(cleanJson);
    } catch (e: any) {
        console.error("Erro Financeiro:", e);
        // Fallback elegante para não quebrar a tela de gráficos
        return {
            analysis: `⚠️ Não foi possível processar a análise com a IA no momento. Erro: ${e.message}`,
            data: [] // Retorna array vazio para não quebrar os gráficos
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
        console.error("Erro Advisor:", e);
        return `❌ Erro de conexão com Consultor IA: ${e.message}`;
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
        console.error("Erro Sales:", e);
        return `❌ Erro ao gerar estratégia: ${e.message}`;
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
         console.error("Erro HR:", e);
         return `❌ Erro RH: ${e.message}`;
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
        console.error("Erro Legal:", e);
        return `❌ Erro Jurídico: ${e.message}`;
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
        console.error("Erro Product:", e);
        return `❌ Erro de Produto: ${e.message}`;
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
        console.error("Erro Support:", e);
        return `❌ Erro de Suporte: ${e.message}`;
    }
};