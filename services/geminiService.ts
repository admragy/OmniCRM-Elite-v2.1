
import { GoogleGenAI, Type, Modality } from "@google/genai";

const getAIClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

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

export const generateAdImage = async (prompt: string) => {
  const ai = getAIClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: { 
        parts: [{ 
          text: `ULTRA-PREMIUM ADVERTISEMENT PHOTOGRAPHY: ${prompt}. Studio lighting, 8k resolution, award-winning composition, professional color grading.` 
        }] 
      },
      config: { imageConfig: { aspectRatio: "1:1", imageSize: "1K" } }
    });
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
    }
  } catch (err) {
    console.error("Ad Synthesis Error:", err);
  }
  return null;
};

export const getSmartInsights = async (contacts: any[], deals: any[], language: 'en' | 'ar', kb?: string) => {
  const ai = getAIClient();
  const targetLang = language === 'ar' ? 'Arabic' : 'English';
  const pipelineValue = deals.reduce((s, d) => s + d.value, 0);

  const prompt = `
    IDENTITY: Universal Strategic Commander.
    KNOWLEDGE_BASE: "${kb || 'General Strategy'}".
    CONTEXT: Pipeline $${pipelineValue}, Partners: ${contacts.length}.
    TASK: Provide a high-level strategic "Order of the Day" in ${targetLang}. 
    Focus on market dominance. Tone: Direct, Elite, Visionary.
  `;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: { tools: [{ googleSearch: {} }], thinkingConfig: { thinkingBudget: 2000 } }
    });
    return response.text || "Neural link synchronized.";
  } catch (e) {
    return "Strategic link stable. Ready for commands.";
  }
};

export const getStrategicPriorities = async (contacts: any[], deals: any[], language: 'en' | 'ar'): Promise<any[]> => {
  const ai = getAIClient();
  const langTag = language === 'ar' ? 'Arabic' : 'English';
  try {
    const response = await ai.models.generateContent({ 
      model: 'gemini-3-flash-preview', 
      contents: `CRM Analytics Summary: ${contacts.length} partners, $${deals.reduce((s, d) => s + d.value, 0)} value. Generate 3 strategic tasks in ${langTag}. Respond ONLY with JSON: [{ "task": "...", "impact": "High/Medium", "reason": "..." }]`, 
      config: { responseMimeType: "application/json" } 
    });
    return JSON.parse(response.text || '[]');
  } catch (error) {
    return [];
  }
};

export const getMarketIntelligence = async (industry: string, language: 'en' | 'ar') => {
  const ai = getAIClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `DEEP SCAN INDUSTRY: ${industry}. Latest 2025 business trends, news, and untapped gaps. Language: ${language === 'ar' ? 'Arabic' : 'English'}.`,
      config: { tools: [{ googleSearch: {} }] }
    });
    return { 
      report: response.text || "", 
      trends: response.candidates?.[0]?.groundingMetadata?.groundingChunks || [] 
    };
  } catch (error) {
    return { report: "Neural scan offline.", trends: [] };
  }
};

export const analyzeBehavior = async (input: string, industry: string, language: 'en' | 'ar') => {
  const ai = getAIClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      config: { responseMimeType: "application/json" },
      contents: `Analyze psychology of: "${input}". Industry: ${industry}. Language: ${language === 'ar' ? 'Arabic' : 'English'}. JSON: {"trait": "...", "mood": "...", "psychology": "...", "strategy": "..."}`,
    });
    return JSON.parse(response.text || '{}');
  } catch (e) {
    return null;
  }
};

export const runAgentSimulation = async (problem: string, brand: any, language: 'en' | 'ar') => {
  const ai = getAIClient();
  const targetLang = language === 'ar' ? 'Arabic' : 'English';
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `
        SIMULATE TACTICAL WAR ROOM.
        PROBLEM: "${problem}".
        CLIENT_CONTEXT: "${brand.name}", INDUSTRY: "${brand.industry}".
        PARTICIPANTS: 
        1. General Strategist (Vision & Scale)
        2. Data Analyst (Risk & Numbers)
        3. Execution Officer (Speed & Tactics)
        Output a detailed transcript of their debate and final decision in ${targetLang}. 
        Format as a professional field report.
      `,
      config: { thinkingConfig: { thinkingBudget: 8000 } }
    });
    return response.text || "Simulation concluded.";
  } catch (e) {
    return "Neural synchronization failed for agent fleet.";
  }
};

export const getGrowthStrategy = async (industry: string, language: 'en' | 'ar') => {
  const ai = getAIClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `GUERRILLA GROWTH PLAN 2025: ${industry}. Non-traditional reach hacks. Language: ${language === 'ar' ? 'Arabic' : 'English'}.`,
      config: { tools: [{ googleSearch: {} }] }
    });
    return {
      text: response.text || "Growth strategy synthesized.",
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  } catch (e) {
    return { text: "Strategy engineering failed.", sources: [] };
  }
};

export const enrichContactData = async (company: string, language: 'en' | 'ar') => {
  const ai = getAIClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Search for strategic data about "${company}". Focus on key people, market cap, and competitors. Language: ${language === 'ar' ? 'Arabic' : 'English'}.`,
      config: { tools: [{ googleSearch: {} }] }
    });
    return response.text || "No intelligence found.";
  } catch (e) {
    return "Deep scan interrupted.";
  }
};

export const analyzeGlobalRisk = async (query: string, lat: number, lng: number, language: 'en' | 'ar') => {
  const ai = getAIClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `SPATIAL RISK ANALYSIS for "${query}" near coordinates [${lat}, ${lng}]. Evaluate business continuity, local news, and geographical threats. Language: ${language === 'ar' ? 'Arabic' : 'English'}.`,
      config: {
        tools: [{ googleMaps: {} }, { googleSearch: {} }],
        toolConfig: { retrievalConfig: { latLng: { latitude: lat, longitude: lng } } }
      }
    });
    return {
      text: response.text || "Risk analysis nominal.",
      grounding: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  } catch (e) {
    return { text: "Scan failed.", grounding: [] };
  }
};
