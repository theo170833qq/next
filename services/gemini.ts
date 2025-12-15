import { GoogleGenAI, Type } from "@google/genai";

const getClient = () => {
  // --- CONFIGURAÇÃO MANUAL PARA VERCEL ---
  // Chave inserida diretamente para dispensar variáveis de ambiente
  const HARDCODED_KEY = "AIzaSyBYtDLsP6BJ4LnrTc_1CEAgkFj5_jwuHGg";
  
  // Tenta pegar do ambiente, se falhar, usa a chave fixa
  let apiKey = process.env.API_KEY;
  
  if (!apiKey || apiKey === "undefined" || apiKey === "" || apiKey.includes("undefined")) {
      console.log("⚠️ Usando chave Hardcoded de fallback");
      apiKey = HARDCODED_KEY;
  }
  
  // Sanitização de emergência
  apiKey = apiKey.replace(/["']/g, "").trim();

  return new GoogleGenAI({ apiKey });
};

// Sistema de Fallback em Cascata
// Tenta 2.5 -> 2.0 -> Flash Latest
const generateWithFallback = async (params: any) => {
    const ai = getClient();
    
    // Lista de prioridade de modelos
    const models = [
        'gemini-2.5-flash',       // Principal (Melhor raciocínio)
        'gemini-2.0-flash-exp',   // Secundário (Experimental, alta disponibilidade)
        'gemini-1.5-flash-latest' // Último recurso (Estável, compatível com contas Free)
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
            
            // Se o erro for de autenticação pura (chave inválida), não adianta tentar outros modelos
            if (error.message?.includes('API key not valid') || error.message?.includes('key expired')) {
                throw error;
            }
            // Continua para o próximo modelo no loop...
        }
    }

    // Se chegou aqui, todos falharam
    console.error("❌ Todos os modelos de fallback falharam.");
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
    if (error.message?.includes("API Key")) return "⚠️ Erro de Configuração: Chave de API inválida.";
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
  } catch (error) {
    console.error("Erro na análise financeira:", error);
    return { 
        analysis: "Não foi possível conectar à IA. Verifique sua chave de API.", 
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
        const errorMsg = e.message || "";
        
        if (errorMsg.includes("403") || errorMsg.includes("permission")) {
            return `⛔ **Acesso Negado (403)**: A chave de API não tem permissão. Verifique se a API 'Generative AI' está habilitada no Google Cloud.`;
        }
        
        if (errorMsg.includes("API key")) {
             return `🔑 **Erro de Chave**: Chave inválida.`;
        }
        
        return `⚠️ **Erro de Conexão**: ${errorMsg.substring(0, 100)}...`;
    }
}