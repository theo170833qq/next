import { GoogleGenAI, Type } from "@google/genai";

const getClient = () => {
  // Guidelines: API Key must be obtained exclusively from process.env.API_KEY
  // Assume this variable is pre-configured, valid, and accessible.
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const generateMarketingContent = async (topic: string, platform: string): Promise<string> => {
  try {
    const ai = getClient();
    const model = 'gemini-2.5-flash';
    const prompt = `Crie um post para o ${platform} sobre o seguinte tópico: "${topic}".
    O conteúdo deve ser engajador, profissional e visualmente descritivo.
    Inclua:
    1. Um título chamativo (Headline).
    2. O corpo do texto.
    3. 5 Hashtags relevantes.
    4. Uma descrição detalhada para uma imagem que acompanharia esse post (Prompt de imagem).
    
    Formate a resposta em Markdown.`;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction: "Atue como um especialista em marketing digital de classe mundial.",
      }
    });

    if (!response.text) {
      throw new Error("A IA retornou uma resposta vazia.");
    }

    return response.text;
  } catch (error: any) {
    console.error("Erro detalhado ao gerar marketing:", error);
    if (error.message?.includes("Chave de API")) return "⚠️ Erro de Configuração: Chave de API ausente ou inválida. Verifique o console.";
    return `Erro ao conectar com a IA: ${error.message || "Tente novamente."}`;
  }
};

export const analyzeFinancialData = async (dataContext: string): Promise<any> => {
  try {
    const ai = getClient();
    const model = 'gemini-2.5-flash';
    
    const response = await ai.models.generateContent({
      model,
      contents: `Analise o seguinte contexto financeiro ou cenário de negócios: "${dataContext}".
      Gere uma projeção financeira fictícia, mas realista, para os próximos 6 meses baseada nesse cenário.
      
      Retorne APENAS um objeto JSON com:
      1. 'analysis': Um resumo curto (max 2 frases) da tendência.
      2. 'data': Um array de 6 objetos, onde cada objeto tem: 'month' (nome do mês), 'revenue' (número), 'expenses' (número), 'profit' (número).
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                analysis: { type: Type.STRING },
                data: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            month: { type: Type.STRING },
                            revenue: { type: Type.NUMBER },
                            expenses: { type: Type.NUMBER },
                            profit: { type: Type.NUMBER }
                        }
                    }
                }
            }
        }
      }
    });

    const rawText = response.text || '{}';
    const jsonString = rawText.replace(/```json|```/g, '').trim();
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Erro na análise financeira:", error);
    return { 
        analysis: "Não foi possível gerar a análise. Verifique sua conexão ou chave de API.", 
        data: [] 
    };
  }
};

export const getStrategicAdvice = async (query: string, history: string[]): Promise<string> => {
    try {
        const ai = getClient();
        const model = 'gemini-2.5-flash';
        
        // Estrutura de prompt otimizada
        const response = await ai.models.generateContent({
            model,
            contents: `Histórico da conversa: ${JSON.stringify(history)}\n\nPergunta do usuário: ${query}`,
            config: {
                systemInstruction: "Você é um consultor de negócios sênior para startups e PMEs. Responda de forma direta, estratégica e encorajadora. Seja breve mas valioso. Use formatação Markdown (negrito, listas) para facilitar a leitura."
            }
        });

        return response.text || "Sem resposta da IA.";
    } catch (e: any) {
        console.error("Erro no Advisor:", e);
        const errorMsg = e.message || "Erro desconhecido";
        
        if (errorMsg.includes("API Key") || errorMsg.includes("403")) {
            return `⛔ **Erro de Permissão (403)**: Sua chave de API parece inválida ou não tem permissão para usar o modelo 'gemini-2.5-flash'. Verifique suas credenciais no Google AI Studio.`;
        }
        
        return `⚠️ **Erro de Conexão**: Não foi possível contatar a inteligência artificial. \n\nDetalhe técnico: *${errorMsg}*`;
    }
}