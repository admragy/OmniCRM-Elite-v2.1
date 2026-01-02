
import { GoogleGenAI, Type, Modality } from "@google/genai";

const getAIClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

// مرافق الصوت والترميز
export const decodeBase64 = (base64: string) => {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
  return bytes;
};

export const encodeAudio = (bytes: Uint8Array) => {
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
};

export async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

// توليد الصور الإعلانية (Elite Edition)
export const generateAdImage = async (prompt: string) => {
  const ai = getAIClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { 
        parts: [{ 
          text: `High-end commercial advertisement photography for: ${prompt}. Professional studio lighting, 8k resolution, cinematic composition, minimalist aesthetic.` 
        }] 
      },
      config: { 
        imageConfig: { aspectRatio: "1:1" } 
      }
    });
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
    }
  } catch (err) {
    console.error("Image Gen Error:", err);
  }
  return null;
};

// رؤى الأوراكل الاستراتيجية - تحليل البيانات الحقيقية
export const getSmartInsights = async (contacts: any[], deals: any[], language: 'en' | 'ar', kb?: string) => {
  const ai = getAIClient();
  const targetLang = language === 'ar' ? 'Arabic' : 'English';
  
  const totalValue = deals.reduce((sum, d) => sum + d.value, 0);
  const totalCollected = deals.reduce((acc, d) => {
    const paid = d.payments?.filter((p: any) => p.status === 'Paid').reduce((sum: number, p: any) => sum + p.amount, 0) || 0;
    return acc + paid;
  }, 0);
  const efficiency = totalValue > 0 ? (totalCollected / totalValue) * 100 : 0;

  const prompt = `
    ROLE: Senior Strategic Commander.
    COMPANY_CONTEXT: "${kb || 'Professional Services'}"
    CURRENT_METRICS:
    - Pipeline: $${totalValue}
    - Collected: $${totalCollected}
    - Efficiency: ${efficiency.toFixed(1)}%
    - Active Leads: ${contacts.length}

    TASK: Provide one visionary, aggressive business insight to the CEO in ${targetLang}. 
    Focus on strategic growth, cash flow optimization, or market dominance. 
    Tone: Elite, professional, and tactical. No introduction.
  `;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { thinkingConfig: { thinkingBudget: 0 } }
    });
    return response.text?.trim() || "System Synchronized. Awaiting orders.";
  } catch (e) {
    return "Ready for deployment.";
  }
};

// أولويات النمو - تحويل الأرقام لمهام تنفيذية
export const getStrategicPriorities = async (contacts: any[], deals: any[], language: 'en' | 'ar'): Promise<any[]> => {
  const ai = getAIClient();
  const summary = { 
    leads: contacts.length, 
    total_val: deals.reduce((s,d) => s+d.value, 0),
    uncollected: deals.reduce((s,d) => s + (d.value - (d.payments?.reduce((ps:any, p:any) => ps + p.amount, 0) || 0)), 0)
  };

  try {
    const response = await ai.models.generateContent({ 
      model: 'gemini-3-flash-preview', 
      contents: `Based on this business state: ${JSON.stringify(summary)}, generate 3 high-impact tasks as JSON array: [{ "task": "string", "impact": "High/Medium", "reason": "string" }]. Language: ${language === 'ar' ? 'Arabic' : 'English'}. Focus on ROI and speed.`, 
      config: { responseMimeType: "application/json" } 
    });
    return JSON.parse(response.text || '[]');
  } catch (error) {
    return [];
  }
};

// استخبارات السوق - استخدام البحث المباشر
export const getMarketIntelligence = async (industry: string, language: 'en' | 'ar') => {
  const ai = getAIClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Search for the latest 2024/2025 business trends, news, and market gaps in the ${industry} industry. Focus on opportunities for growth. Language: ${language === 'ar' ? 'Arabic' : 'English'}.`,
      config: { tools: [{ googleSearch: {} }] }
    });
    return { 
      report: response.text || "", 
      trends: response.candidates?.[0]?.groundingMetadata?.groundingChunks || [] 
    };
  } catch (error) {
    return { report: "Sync error.", trends: [] };
  }
};

// خبير السلوك - تحليل سيكولوجي عميق
export const analyzeBehavior = async (input: string, industry: string, language: 'en' | 'ar') => {
  const ai = getAIClient();
  const targetLang = language === 'ar' ? 'Arabic' : 'English';
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      config: { responseMimeType: "application/json" },
      contents: `Analyze client psychology: "${input}". Industry: ${industry}. Language: ${targetLang}. Return JSON: {"trait": "string", "mood": "string", "psychology": "string", "strategy": "string"}`,
    });
    return JSON.parse(response.text || '{}');
  } catch (e) {
    return null;
  }
};

// Fix: Added missing export enrichContactData
export const enrichContactData = async (company: string, language: 'en' | 'ar') => {
  const ai = getAIClient();
  const targetLang = language === 'ar' ? 'Arabic' : 'English';
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Conduct a deep web scan for intelligence about the company "${company}". Summarize their market position, key offerings, and recent corporate updates. Language: ${targetLang}.`,
      config: { tools: [{ googleSearch: {} }] }
    });
    return response.text || "No specific intelligence found for this entity.";
  } catch (e) {
    console.error("Enrichment error:", e);
    return "Intelligence acquisition failed. Connection unstable.";
  }
};

// Fix: Added missing export analyzeGlobalRisk
export const analyzeGlobalRisk = async (query: string, lat: number, lng: number, language: 'en' | 'ar') => {
  const ai = getAIClient();
  const targetLang = language === 'ar' ? 'Arabic' : 'English';
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Assess tactical and spatial risks related to: "${query}". Provide a high-level strategic report based on current geographic context. Language: ${targetLang}.`,
      config: {
        tools: [{ googleSearch: {} }, { googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: lat,
              longitude: lng
            }
          }
        }
      }
    });
    return {
      text: response.text || "Risk analysis completed with no major alerts.",
      grounding: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  } catch (e) {
    console.error("War Room Error:", e);
    return { text: "Strategic scan failed to initialize.", grounding: [] };
  }
};

// Fix: Added missing export runAgentSimulation
export const runAgentSimulation = async (problem: string, brand: any, language: 'en' | 'ar') => {
  const ai = getAIClient();
  const targetLang = language === 'ar' ? 'Arabic' : 'English';
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `
        SYSTEM: Multi-Agent Tactical Simulation.
        PROBLEM: "${problem}"
        CONTEXT: Business Industry: ${brand.industry}, Brand: ${brand.name}.
        TASK: Simulate a collaborative session between three specialized AI agents: a Strategic Architect, a Tactical Operator, and a Risk Mitigator. Develop a unified solution.
        OUTPUT: Professional simulation transcript.
        LANGUAGE: ${targetLang}.
      `,
      config: { thinkingConfig: { thinkingBudget: 4000 } }
    });
    return response.text || "Simulation concluded without output.";
  } catch (e) {
    console.error("Simulation error:", e);
    return "Agent fleet synchronization failed.";
  }
};

// Fix: Added missing export getGrowthStrategy
export const getGrowthStrategy = async (industry: string, language: 'en' | 'ar') => {
  const ai = getAIClient();
  const targetLang = language === 'ar' ? 'Arabic' : 'English';
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze viral growth patterns and non-traditional marketing opportunities for the ${industry} sector in 2025. Provide a guerrilla strategy. Language: ${targetLang}.`,
      config: { tools: [{ googleSearch: {} }] }
    });
    return {
      text: response.text || "Growth strategy synthesized.",
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  } catch (e) {
    console.error("Growth Lab Error:", e);
    return { text: "Growth engineering logic failed.", sources: [] };
  }
};
