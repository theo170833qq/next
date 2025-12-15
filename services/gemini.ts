import { GoogleGenAI, Type } from "@google/genai";

const getClient = () => {
  // 1. TENTA CHAVE SALVA MANUALMENTE PELO USUÁRIO (LocalStorage)
  // Isso permite que você corrija o erro direto na tela de Configurações
  const localKey = localStorage.getItem('user_custom_api_key');
  if (localKey && localKey.length > 10) {
      return new GoogleGenAI({ apiKey: localKey });
  }

  // 2. CHAVE HARDCODED DE FALLBACK (A que você forneceu)
  // Se esta chave estiver inválida, o usuário deve usar a opção manual nas Configurações
  const HARDCODED_KEY = "AIzaSyBYtDLsP6BJ4LnrTc_1CEAgkFj5_jwuHGg";
  
  let apiKey = process.env.API_KEY;
  
  if (!apiKey || apiKey === "undefined" || apiKey === "" || apiKey.includes("undefined")) {
      apiKey = HARDCODED_KEY;
  }
  
  apiKey = apiKey.replace(/["']/g, "").trim();

  return new GoogleGenAI({ apiKey });
};

// Sistema de Fallback em Cascata
const generateWithFallback = async (params: any) => {
    const ai = getClient();
    
    // Tenta modelos mais antigos se o Flash 2.5 falhar (comum em chaves da camada gratuita)
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
            
            // Se o erro for explícito de chave inválida, não adianta tentar outros modelos
            if (error.message?.includes('API key not valid') || error.message?.includes('key expired')) {
                throw new Error("A Chave de API é inválida ou expirou. Por favor, atualize-a nas Configurações.");
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
    if (error.message?.includes("API key")) return "⚠️ A Chave de API informada é inválida. Vá em 'Ajustes' > 'Sistema & API' e insira uma chave válida.";
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
        analysis: "Não foi possível conectar à IA. Verifique sua chave de API nas Configurações.", 
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
            return `⛔ **Acesso Negado**: A chave atual não tem permissão para usar este modelo. Tente gerar uma nova chave no Google AI Studio e insira nas Configurações.`;
        }
        
        if (errorMsg.includes("API key")) {
             return `🔑 **Chave Inválida**: A chave configurada não está funcionando. Vá em 'Configurações' > 'Sistema & API' e insira uma nova chave.`;
        }
        
        return `⚠️ **Erro de Conexão**: ${errorMsg.substring(0, 100)}...`;
    }
}