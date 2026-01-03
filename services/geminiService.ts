
import { GoogleGenAI, Type } from "@google/genai";
import { Contact, Deal } from "../types";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

// محرك التحليل النفسي (Neuro-Sales Engine)
export const runNeuroAnalysis = async (chatHistory: string, industry: string, language: 'en' | 'ar') => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    config: { 
      responseMimeType: "application/json",
      thinkingConfig: { thinkingBudget: 4000 }
    },
    contents: `Analyze this chat history for a business in ${industry}. 
    Classify the customer into: Scrooge (price sensitive), Hesitant, VIP, Urgent, or Researcher.
    Provide a psychological profile and a KILLER closing script in ${language === 'ar' ? 'Arabic' : 'English'}.
    JSON format: {
      "archetype": "...",
      "sentiment": 0-100,
      "probability": 0-100,
      "recommendedTone": "...",
      "hiddenObjections": ["...", "..."],
      "closingScript": "..."
    }
    CHAT: ${chatHistory}`,
  });
  return JSON.parse(response.text || '{}');
};

// رادار التجسس (Shadow Intel)
export const scanCompetitors = async (
  brandName: string, 
  industry: string, 
  language: 'en' | 'ar',
  depth: 'shallow' | 'standard' | 'deep' = 'standard',
  dataPoints: string[] = ['pricing', 'offers']
) => {
  const ai = getAI();
  const thinkingBudgetMap = {
    shallow: 2000,
    standard: 5000,
    deep: 15000
  };

  const depthContext = {
    shallow: "Perform a quick scan of the primary website and major social profiles.",
    standard: "Conduct a comprehensive scan of the website, recent news articles, and active ad campaigns.",
    deep: "Execute an exhaustive intelligence gathering mission including historical pricing trends, employee sentiment, full social media footprint, and deep market comparisons."
  }[depth];

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `
      OBJECTIVE: SHADOW INTELLIGENCE SCAN.
      TARGET: ${brandName}
      INDUSTRY: ${industry}
      SCAN DEPTH: ${depth.toUpperCase()}
      DEPTH CONTEXT: ${depthContext}
      DATA POINTS TO EXTRACT: ${dataPoints.join(', ')}
      
      Provide a highly strategic report in ${language === 'ar' ? 'Arabic' : 'English'}. 
      Focus on revealing tactical weaknesses, pricing gaps, and specific counter-strategies.
    `,
    config: { 
      tools: [{ googleSearch: {} }],
      thinkingConfig: { thinkingBudget: thinkingBudgetMap[depth] }
    }
  });
  return {
    analysis: response.text,
    sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
  };
};

// مكنسة البيانات (Data Vacuum)
export const vacuumData = async (rawInput: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    config: { responseMimeType: "application/json" },
    contents: `Extract all entities (Names, Emails, Phones, Order Details, Values) from this raw text and format as structured data for CRM injection: ${rawInput}`,
  });
  return JSON.parse(response.text || '[]');
};

// مستشار القيادة (The Oracle)
export const getCommandDecision = async (stats: any, brand: any) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `CRITICAL STATS: ${JSON.stringify(stats)}. AUTO-PILOT SETTINGS: ${JSON.stringify(brand.autoPilot)}. 
    As the Strategic Commander, what is your next tactical move? Should we scale ads, pivot offers, or cut losses?`,
    config: { thinkingConfig: { thinkingBudget: 8000 } }
  });
  return response.text;
};

// إثراء بيانات جهات الاتصال (Deep Web Enrichment)
export const enrichContactData = async (companyName: string, language: 'en' | 'ar') => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Perform a deep research on the company "${companyName}". Find their main products, target market, recent news, and potential business needs in ${language === 'ar' ? 'Arabic' : 'English'}.`,
    config: { tools: [{ googleSearch: {} }] }
  });
  return response.text;
};

// نبض السوق (Market Intelligence)
export const getMarketIntelligence = async (industry: string, language: 'en' | 'ar') => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Analyze current global market trends and gaps in the ${industry} industry. Provide a detailed report and list specific opportunities in ${language === 'ar' ? 'Arabic' : 'English'}.`,
    config: { tools: [{ googleSearch: {} }] }
  });
  return {
    report: response.text,
    trends: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
  };
};

// تحديد الأولويات الاستراتيجية (Strategic Priorities)
export const getStrategicPriorities = async (contacts: Contact[], deals: Deal[], language: 'en' | 'ar') => {
  const ai = getAI();
  const stats = {
    totalLeads: contacts.length,
    dealVolume: deals.reduce((acc, d) => acc + d.value, 0),
    topDeals: deals.sort((a, b) => b.value - a.value).slice(0, 3)
  };
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            task: { type: Type.STRING },
            impact: { type: Type.STRING, enum: ['High', 'Medium', 'Low'] }
          },
          required: ['task', 'impact']
        }
      }
    },
    contents: `Given these CRM stats: ${JSON.stringify(stats)}, generate a list of 5 high-impact strategic tasks to grow revenue. Language: ${language}.`
  });
  try {
    return JSON.parse(response.text || '[]');
  } catch {
    return [];
  }
};

// تحليل المخاطر الجيومكانية (Global Risk Analysis)
export const analyzeGlobalRisk = async (query: string, lat: number, lng: number, language: 'en' | 'ar') => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: `Analyze spatial risks and market grounding for: ${query}. Use current location context: ${lat}, ${lng}. Language: ${language}.`,
    config: { 
      tools: [{ googleMaps: {} }, { googleSearch: {} }],
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
    text: response.text || "",
    grounding: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
  };
};

// محاكاة الوكلاء (Agent Simulation)
export const runAgentSimulation = async (problem: string, brand: any, language: 'en' | 'ar') => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    config: { thinkingConfig: { thinkingBudget: 15000 } },
    contents: `Act as a War Room of 3 experts: a Strategist, an Analyst, and a Security Expert. Debate and provide a unified solution for this business problem: "${problem}". 
    Brand Context: ${JSON.stringify(brand)}. Language: ${language}.`
  });
  return response.text;
};

// استراتيجية النمو (Growth Strategy)
export const getGrowthStrategy = async (industry: string, language: 'en' | 'ar') => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Develop a guerrilla growth marketing strategy for a company in ${industry}. Focus on viral hooks and community reach in ${language === 'ar' ? 'Arabic' : 'English'}.`,
    config: { tools: [{ googleSearch: {} }] }
  });
  return {
    text: response.text,
    sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
  };
};

// توليد الصور الإعلانية (Ad Image Synthesis)
export const generateAdImage = async (prompt: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: { parts: [{ text: `Professional high-converting ad visual for: ${prompt}. Cinematic lighting, minimalist, premium brand style.` }] },
    config: { imageConfig: { aspectRatio: '16:9' } }
  });
  const part = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
  return part?.inlineData ? `data:image/png;base64,${part.inlineData.data}` : null;
};

// --- Audio & Base64 Helpers for Live API ---

export function decodeBase64(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export function encodeAudio(bytes: Uint8Array): string {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
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
