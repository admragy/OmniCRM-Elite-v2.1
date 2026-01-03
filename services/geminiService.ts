
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
  try {
    return JSON.parse(response.text || '{}');
  } catch (e) {
    return {};
  }
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

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `
      OBJECTIVE: SHADOW INTELLIGENCE SCAN.
      TARGET: ${brandName}
      INDUSTRY: ${industry}
      SCAN DEPTH: ${depth.toUpperCase()}
      DATA POINTS: ${dataPoints.join(', ')}
      
      Provide a strategic report in ${language === 'ar' ? 'Arabic' : 'English'}.
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

// تحليل المخاطر الجيومكانية (Global Risk Analysis)
export const analyzeGlobalRisk = async (query: string, lat: number, lng: number, language: 'en' | 'ar') => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: `Analyze spatial risks for: ${query}. Location: ${lat}, ${lng}. Language: ${language}.`,
    config: { 
      tools: [{ googleMaps: {} }, { googleSearch: {} }],
      toolConfig: {
        retrievalConfig: {
          latLng: { latitude: lat, longitude: lng }
        }
      }
    }
  });
  return {
    text: response.text || "",
    grounding: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
  };
};

// --- الأدوات المساعدة ---
export const getCommandDecision = async (stats: any, brand: any) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `STATS: ${JSON.stringify(stats)}. BRAND: ${JSON.stringify(brand)}. Command next tactical move.`,
    config: { thinkingConfig: { thinkingBudget: 4000 } }
  });
  return response.text;
};

export const getMarketIntelligence = async (industry: string, language: 'en' | 'ar') => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Scan market gaps in ${industry}. Language: ${language}.`,
    config: { tools: [{ googleSearch: {} }] }
  });
  return {
    report: response.text,
    trends: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
  };
};

// enrichment of contact data using deep web search
export const enrichContactData = async (company: string, language: 'en' | 'ar') => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Perform a deep web research on the company: ${company}. 
    Provide a strategic business profile in ${language === 'ar' ? 'Arabic' : 'English'} including their focus, strengths, and potential business needs.`,
    config: { tools: [{ googleSearch: {} }] }
  });
  return response.text;
};

// analyze CRM data and generate high-impact strategic tasks
export const getStrategicPriorities = async (contacts: Contact[], deals: Deal[], language: 'en' | 'ar') => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Based on the following CRM data, prioritize the most effective growth tasks.
    Contacts: ${JSON.stringify(contacts.slice(0, 15))}
    Deals: ${JSON.stringify(deals.slice(0, 15))}
    
    Return a JSON array of tasks where each task has a "task" description and an "impact" level (High, Medium, Low).
    Language: ${language === 'ar' ? 'Arabic' : 'English'}.`,
    config: { 
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            task: { type: Type.STRING },
            impact: { type: Type.STRING }
          },
          required: ["task", "impact"]
        }
      }
    }
  });
  try {
    return JSON.parse(response.text || '[]');
  } catch (e) {
    return [];
  }
};

// simulate a tactical discussion among specialized agents
export const runAgentSimulation = async (problem: string, brand: any, language: 'en' | 'ar') => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `PROBLEM: ${problem}
    BRAND IDENTITY: ${brand.name} (${brand.industry})
    
    Conduct a War Room simulation with three agents:
    - Tactician: Strategic maneuvers.
    - Analyst: Market and data insights.
    - Security Expert: Risk mitigation.
    
    Synthesize their debate into a final tactical recommendation in ${language === 'ar' ? 'Arabic' : 'English'}.`,
    config: { thinkingConfig: { thinkingBudget: 12000 } }
  });
  return response.text;
};

// extract viral growth strategies using market trends
export const getGrowthStrategy = async (industry: string, language: 'en' | 'ar') => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Analyze current global market trends for the ${industry} industry. 
    Find unconventional growth hacks and viral reach strategies that don't rely on traditional ad spend.
    Language: ${language === 'ar' ? 'Arabic' : 'English'}.`,
    config: { tools: [{ googleSearch: {} }] }
  });
  return {
    text: response.text,
    sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
  };
};

export const generateAdImage = async (prompt: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: { parts: [{ text: `High-end ad for: ${prompt}` }] },
    config: { imageConfig: { aspectRatio: '16:9' } }
  });
  const part = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
  return part?.inlineData ? `data:image/png;base64,${part.inlineData.data}` : null;
};

export function decodeBase64(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
  return bytes;
}

export function encodeAudio(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

export async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
  }
  return buffer;
}
