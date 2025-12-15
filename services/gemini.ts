import { GoogleGenAI, Type } from "@google/genai";

const getClient = () => {
  // 1. TENTA CHAVE DO LOCALSTORAGE (Prioridade Máxima para correções manuais)
  const localKey = localStorage.getItem('user_custom_api_key');
  if (localKey && localKey.length > 20) {
      return new GoogleGenAI({ apiKey: localKey });
  }

  // 2. CHAVE FORNECIDA PELO USUÁRIO (Hardcoded)
  // Força o uso desta chave específica ignorando process.env para evitar conflitos
  const HARDCODED_KEY = "AIzaSyBYtDLsP6BJ4LnrTc_1CEAgkFj5_jwuHGg";
  
  return new GoogleGenAI({ apiKey: HARDCODED_KEY });
};

// Sistema de Fallback em Cascata
const generateWithFallback = async (params: any) => {
    const ai = getClient();
    
    // Tenta modelos mais antigos/estáveis primeiro se o Flash falhar
    const models = [
        'gemini-2.5-flash',
        'gemini-1.5-flash',
        'gemini-1.5-flash-latest' 
    ];

    let lastError = null;

    for (const model of models) {
        try {
            console.log(`🚀 Tentando conectar com modelo: ${model}...`);
            const response = await ai.models.generateContent({
                ...params,
                model: model
            });
            console.log(`✅ Sucesso com ${model}`);
            return response;
        } catch (error: any) {
            console.warn(`⚠️ Falha no modelo ${model}: ${error.message}`);
            lastError = error;
            
            // Se for erro de chave inválida, para imediatamente e avisa o usuário
            if (error.message?.includes('API key') || error.message?.includes('403')) {
                throw new Error("API_KEY_INVALID");
            }
        }
    }

    throw lastError;
};

export const generateMarketingContent = async (topic: string, platform: string): Promise<string> => {
  try {
    const prompt = `Crie um post para o ${platform} sobre o seguinte tópico: "${topic}".
    O conteúdo deve ser engajador, profissional e visualmente descritivo.
    Inclua:
    1. Um título chamativo (Headline).
    2. O corpo do texto.
    3. 5 Hashtags relevantes.
    4. Uma descrição detalhada para uma imagem que acompanharia esse post (Prompt de imagem).
    
    Formate a resposta em Markdown.`;

    const response = await generateWithFallback({
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
    console.error("Erro no Marketing Generator:", error);
    if (error.message === "API_KEY_INVALID" || error.message?.includes("API key")) {
        return "⚠️ **Erro de Chave**: A chave de API atual é inválida. Por favor, vá em Configurações e insira uma nova chave.";
    }
    return `Erro de IA: ${error.message || "Serviço indisponível no momento."}`;
  }
};

export const analyzeFinancialData = async (dataContext: string): Promise<any> => {
  try {
    const response = await generateWithFallback({
      contents: `Analise o seguinte contexto financeiro: "${dataContext}".
      Gere uma projeção financeira fictícia para 6 meses.
      Retorne APENAS JSON válido.
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
  } catch (error: any) {
    console.error("Erro na análise financeira:", error);
    const msg = error.message === "API_KEY_INVALID" 
        ? "Chave de API inválida. Configure uma nova em Ajustes." 
        : "Não foi possível conectar à IA.";
        
    return { 
        analysis: msg, 
        data: [] 
    };
  }
};

export const getStrategicAdvice = async (query: string, history: string[]): Promise<string> => {
    try {
        const response = await generateWithFallback({
            contents: `Histórico: ${JSON.stringify(history)}\n\nUsuário: ${query}`,
            config: {
                systemInstruction: "Você é um Advisor Executivo sênior. Responda de forma estratégica, direta e visualmente organizada (Markdown)."
            }
        });

        return response.text || "Sem resposta.";
    } catch (e: any) {
        console.error("Erro no Advisor:", e);
        
        if (e.message === "API_KEY_INVALID" || e.message?.includes("API key") || e.message?.includes("403")) {
             return `API_KEY_ERROR_FLAG`; // Sinalizador para o componente renderizar o botão de correção
        }
        
        return `⚠️ **Erro de Conexão**: ${e.message ? e.message.substring(0, 100) : "Erro desconhecido"}...`;
    }
}