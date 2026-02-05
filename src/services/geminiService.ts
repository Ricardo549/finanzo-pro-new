
import { GoogleGenAI, Type } from "@google/genai";

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
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
    return "⚠️ Configuração Pendente: Adicione sua API Key do Google Gemini no arquivo .env.local";
  }
  const ai = new GoogleGenAI({ apiKey });

  // Para SCAN com imagem, o flash-preview é excelente e rápido
  // Default model configuration
  const model = "gemini-1.5-flash";
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
    const response = await ai.models.generateContent({
      model: model,
      contents: [{ role: 'user', parts: parts }],
      config: config,
    });

    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Erro ao processar solicitação com Finanzo AI.";
  }
};
