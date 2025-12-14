import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.API_KEY || '';
// Initialize Gemini
// Note: We create a new instance per call in complex apps to handle key rotation or checking, 
// but here a singleton is fine if the key is static.
const ai = new GoogleGenAI({ apiKey });

export const generateMarketingContent = async (topic: string, platform: string): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    const prompt = `Atue como um especialista em marketing digital de classe mundial.
    Crie um post para o ${platform} sobre o seguinte tópico: "${topic}".
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
    });

    return response.text || "Não foi possível gerar o conteúdo.";
  } catch (error) {
    console.error("Erro ao gerar marketing:", error);
    return "Erro ao conectar com a IA. Verifique sua chave API.";
  }
};

export const analyzeFinancialData = async (dataContext: string): Promise<any> => {
  try {
    const model = 'gemini-2.5-flash';
    
    // We want structured JSON output for Recharts
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
    // Sanitize markdown code blocks if present
    const jsonString = rawText.replace(/```json|```/g, '').trim();
    
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Erro na análise financeira:", error);
    return null;
  }
};

export const getStrategicAdvice = async (query: string, history: string[]): Promise<string> => {
    try {
        const model = 'gemini-2.5-flash';
        const contents = [
            { role: 'user', parts: [{ text: `Histórico da conversa: ${JSON.stringify(history)}` }] },
            { role: 'user', parts: [{ text: query }] }
        ];

        const response = await ai.models.generateContent({
            model,
            contents: `Você é um consultor de negócios sênior para startups e PMEs. 
            Responda de forma direta, estratégica e encorajadora. 
            Seja breve mas valioso. Use formatação Markdown (negrito, listas) para facilitar a leitura.
            Pergunta do usuário: ${query}`
        });

        return response.text || "Sem resposta.";
    } catch (e) {
        console.error(e);
        return "Erro ao obter conselho.";
    }
}