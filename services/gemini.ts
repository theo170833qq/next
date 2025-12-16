import { GoogleGenAI, Type } from "@google/genai";

const getClient = () => {
  // Obtém a chave exclusivamente via process.env.API_KEY conforme diretrizes.
  // A variável é injetada pelo vite.config.ts.
  
  const apiKey = process.env.API_KEY;
  
  if (apiKey && apiKey.length > 20 && !apiKey.includes("undefined")) {
    return new GoogleGenAI({ apiKey: apiKey });
  }
  
  console.error("CRITICAL: API Key not found or invalid.");
  throw new Error("API_KEY_MISSING");
};

// Sistema de Fallback em Cascata
const generateWithFallback = async (params: any) => {
    try {
        const ai = getClient();
        
        // Modelos em ordem de preferência/estabilidade
        // Removidos modelos depreciados conforme diretrizes
        const models = [
            'gemini-2.5-flash',
            'gemini-flash-latest'
        ];

        let lastError = null;

        for (const model of models) {
            try {
                const response = await ai.models.generateContent({
                    ...params,
                    model: model
                });
                return response;
            } catch (error: any) {
                console.warn(`⚠️ Falha no modelo ${model}: ${error.message}`);
                lastError = error;
                
                // Erros fatais de autenticação interrompem o loop
                if (error.message?.includes('API key') || error.message?.includes('403')) {
                    throw new Error("API_KEY_INVALID");
                }
            }
        }
        throw lastError;

    } catch (error: any) {
        // Normaliza o erro para a UI
        if (error.message === "API_KEY_MISSING" || error.message === "API_KEY_INVALID" || error.message?.includes("API key")) {
             return { text: "API_KEY_MISSING" }; // Retorna objeto seguro em vez de throw para evitar crash total
        }
        throw error;
    }
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

    if (response.text === "API_KEY_MISSING") throw new Error("API_KEY_MISSING");
    if (!response.text) throw new Error("A IA retornou uma resposta vazia.");

    return response.text;
  } catch (error: any) {
    if (error.message === "API_KEY_MISSING") return "Erro de Configuração: Chave de API inválida.";
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

    if (response.text === "API_KEY_MISSING") throw new Error("API_KEY_MISSING");

    const rawText = response.text || '{}';
    const jsonString = rawText.replace(/```json|```/g, '').trim();
    return JSON.parse(jsonString);
  } catch (error: any) {
    const msg = error.message === "API_KEY_MISSING" 
        ? "Erro de API Key." 
        : "Não foi possível conectar à IA.";
    return { analysis: msg, data: [] };
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

        if (response.text === "API_KEY_MISSING") return "API_KEY_ERROR_FLAG";
        return response.text || "Sem resposta.";
    } catch (e: any) {
        if (e.message === "API_KEY_MISSING") return `Erro: Chave de API inválida no sistema.`;
        return `⚠️ **Erro de Conexão**: ${e.message ? e.message.substring(0, 100) : "Erro desconhecido"}...`;
    }
}

// --- MÓDULO DE VENDAS ---
export const generateSalesStrategy = async (product: string, target: string, type: 'cold_mail' | 'objection' | 'script'): Promise<string> => {
    try {
        let prompt = "";
        if (type === 'cold_mail') {
            prompt = `Escreva um Cold Email B2B altamente persuasivo para vender "${product}" para "${target}". Use a estrutura AIDA (Atenção, Interesse, Desejo, Ação). Seja breve e profissional.`;
        } else if (type === 'objection') {
            prompt = `O cliente ("${target}") disse que "${product}" está muito caro. Gere 3 scripts de resposta para contornar essa objeção de preço focando em ROI e valor.`;
        } else {
            prompt = `Crie um roteiro de vendas (Sales Script) telefônico de 2 minutos para oferecer "${product}" para "${target}". Inclua introdução, perguntas de qualificação e fechamento.`;
        }

        const response = await generateWithFallback({
            contents: prompt,
            config: {
                systemInstruction: "Você é um especialista em Vendas B2B, treinado em metodologias como Spin Selling e Sandler.",
            }
        });
        
        if (response.text === "API_KEY_MISSING") throw new Error("API_KEY_MISSING");
        return response.text || "Sem resposta.";
    } catch (error: any) {
        if (error.message === "API_KEY_MISSING") return "API_KEY_MISSING";
        return `Erro: ${error.message}`;
    }
};

// --- MÓDULO DE RH ---
export const generateHRContent = async (role: string, culture: string, type: 'job_desc' | 'interview'): Promise<string> => {
    try {
        let prompt = "";
        if (type === 'job_desc') {
            prompt = `Crie uma Job Description (Descrição de Vaga) atraente e moderna para o cargo de "${role}". A cultura da empresa é: "${culture}". Inclua responsabilidades, requisitos e benefícios. Use formatação Markdown.`;
        } else {
            prompt = `Gere 5 perguntas de entrevista comportamental e técnica para um candidato a "${role}", focando em avaliar se ele se encaixa numa cultura "${culture}". Inclua o que esperar de uma boa resposta.`;
        }

        const response = await generateWithFallback({
            contents: prompt,
            config: {
                systemInstruction: "Você é um Head de RH (Recursos Humanos) sênior especializado em Tech e Startups.",
            }
        });
        
        if (response.text === "API_KEY_MISSING") throw new Error("API_KEY_MISSING");
        return response.text || "Sem resposta.";
    } catch (error: any) {
        if (error.message === "API_KEY_MISSING") return "API_KEY_MISSING";
        return `Erro: ${error.message}`;
    }
};

// --- MÓDULO JURÍDICO ---
export const generateLegalDoc = async (docType: string, parties: string, details: string): Promise<string> => {
    try {
        const prompt = `Atue como um advogado corporativo sênior. Redija um esboço de documento do tipo: "${docType}".
        Partes envolvidas: ${parties}.
        Detalhes específicos e cláusulas importantes: ${details}.
        O documento deve ser formal, usar terminologia jurídica correta (em Português) e ser formatado em Markdown claro.`;

        const response = await generateWithFallback({
            contents: prompt,
            config: {
                systemInstruction: "Você é uma IA de assistência jurídica precisa e formal. Sempre inclua um aviso de que o documento deve ser revisado por um advogado humano.",
            }
        });
        
        if (response.text === "API_KEY_MISSING") throw new Error("API_KEY_MISSING");
        return response.text || "Sem resposta.";
    } catch (error: any) {
        if (error.message === "API_KEY_MISSING") return "API_KEY_MISSING";
        return `Erro: ${error.message}`;
    }
};

// --- MÓDULO PRODUTO ---
export const generateProductSpec = async (featureName: string, userGoal: string, complexity: string): Promise<string> => {
    try {
        const prompt = `Atue como um Product Manager (PM) de uma empresa de tecnologia.
        Crie uma especificação de feature (PRD - Product Requirement Document) para: "${featureName}".
        Objetivo do Usuário: "${userGoal}".
        Complexidade Técnica estimada: "${complexity}".
        
        Inclua:
        1. User Stories (Formato: Como um... Quero... Para que...)
        2. Critérios de Aceitação
        3. Casos de Uso (Happy Path e Edge Cases)
        
        Formate em Markdown.`;

        const response = await generateWithFallback({
            contents: prompt,
            config: {
                systemInstruction: "Você é um PM experiente focado em metodologias Ágeis e Scrum.",
            }
        });
        
        if (response.text === "API_KEY_MISSING") throw new Error("API_KEY_MISSING");
        return response.text || "Sem resposta.";
    } catch (error: any) {
        if (error.message === "API_KEY_MISSING") return "API_KEY_MISSING";
        return `Erro: ${error.message}`;
    }
};

// --- MÓDULO SUPORTE ---
export const generateSupportReply = async (customerMessage: string, tone: string): Promise<string> => {
    try {
        const prompt = `Analise a mensagem deste cliente: "${customerMessage}".
        
        1. Primeiro, identifique o Sentimento (Positivo, Neutro, Negativo, Furioso).
        2. Gere uma resposta de suporte ao cliente com o tom: "${tone}".
        A resposta deve ser empática, resolver o problema ou dar os próximos passos claros.
        
        Formate a saída com o Sentimento em negrito no topo, seguido pela resposta sugerida.`;

        const response = await generateWithFallback({
            contents: prompt,
            config: {
                systemInstruction: "Você é um especialista em Customer Success e Suporte.",
            }
        });
        
        if (response.text === "API_KEY_MISSING") throw new Error("API_KEY_MISSING");
        return response.text || "Sem resposta.";
    } catch (error: any) {
        if (error.message === "API_KEY_MISSING") return "API_KEY_MISSING";
        return `Erro: ${error.message}`;
    }
};