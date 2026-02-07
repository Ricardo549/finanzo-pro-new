import { Type } from "@google/genai";
import { supabase } from "./supabase";

const SYSTEM_INSTRUCTION = `
# ROLE
Você é o motor lógico e cérebro do aplicativo "Finanzo Pro". Sua função é atuar como um Consultor Financeiro Sênior com personalidade de "Brother": papo reto, descontraído, motivador e focado em transformar gastos supérfluos em riqueza.

# MODOS DE OPERAÇÃO
1. SCANNER DE DADOS: Extraia [Estabelecimento, Valor, Data, Categoria (Essencial, Estilo de Vida, Investimento, Extra)] de textos ou imagens de cupons fiscais/notas. Retorne JSON válido.
2. TUTOR DE SIMULAÇÕES: Compare SAC vs PRICE. Use linguagem de "mano".
3. MISSÃO DIÁRIA: Sugira trocar um gasto supérfluo por investimento.
4. CONSULTORIA: Foco em "Dinheiro no Bolso".

# TOM DE VOZ
Brasileiro, gírias leves (bora, mano, se liga). Markdown para valores.
`;

export const callFinanzoAI = async (
  mode: 'SCAN' | 'SIMULATE' | 'MISSION' | 'CHAT',
  input: string,
  imageBlob?: { data: string; mimeType: string }
) => {
  if (!supabase) return "⚠️ Erro: Supabase não inicializado.";

  // Default model configuration
  const config: any = {
    systemInstruction: SYSTEM_INSTRUCTION
  };

  if (mode === 'SCAN') {
    config.responseMimeType = "application/json";
    config.responseSchema = {
      type: Type.OBJECT,
      properties: {
        establishment: { type: Type.STRING, description: "O nome do estabelecimento" },
        valor: { type: Type.NUMBER, description: "O valor total da transação" },
        categoria: { type: Type.STRING, description: "A categoria (Essencial, Estilo de Vida, Investimento, Extra)" },
        data: { type: Type.STRING, description: "Data da transação formatada" }
      },
      required: ["establishment", "valor", "categoria"],
      propertyOrdering: ["establishment", "valor", "categoria", "data"]
    };
  }

  const parts: any[] = [];

  if (imageBlob) {
    parts.push({
      inlineData: {
        data: imageBlob.data,
        mimeType: imageBlob.mimeType
      }
    });
  }

  parts.push({ text: input || (imageBlob ? "Analise este cupom fiscal e extraia os dados." : "") });

  try {
    const { data, error } = await supabase.functions.invoke('ask-gemini', {
      body: {
        model: "gemini-1.5-flash",
        contents: [{ role: 'user', parts: parts }],
        config: config
      }
    });

    if (error) {
      console.error("Gemini Edge Function Error:", error);
      return "Erro ao processar solicitação com Finanzo AI (Edge).";
    }

    // The Gemini API response structure might vary slightly or be wrapped. 
    // Usually it returns a Candidate object. 
    // My edge function returns the raw data from Gemini API.
    // data.candidates[0].content.parts[0].text
    if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      return data.candidates[0].content.parts[0].text;
    }

    return "Resposta vazia da IA.";

  } catch (error) {
    console.error("Gemini Service Error:", error);
    return "Erro crítico ao chamar IA.";
  }
};
