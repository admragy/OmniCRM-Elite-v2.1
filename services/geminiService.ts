
import { GoogleGenAI, GenerateContentResponse, Type, Modality } from "@google/genai";

const getAIClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

// Fix: Maps grounding is only supported in Gemini 2.5 series models.
export const analyzeGlobalRisk = async (query: string, lat: number, lng: number, language: 'en' | 'ar') => {
  const ai = getAIClient();
  const targetLang = language === 'ar' ? 'Arabic' : 'English';
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Perform a strategic global risk/opportunity analysis for: "${query}". Respond in ${targetLang}.`,
      config: {
        tools: [{ googleMaps: {} }, { googleSearch: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: { latitude: lat, longitude: lng }
          }
        }
      },
    });
    
    return {
      text: response.text || "",
      grounding: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  } catch (err) {
    console.error(err);
    return { text: "Analysis failed.", grounding: [] };
  }
};

export const runAgentSimulation = async (problem: string, brand: any, language: 'en' | 'ar') => {
  const ai = getAIClient();
  const targetLang = language === 'ar' ? 'Arabic' : 'English';
  
  const systemInstruction = `
    You are an Autonomous Agent Orchestrator. 
    Simulate a conversation between 3 specialist agents: 
    1. StrategyAgent (Visionary) 
    2. TacticalAgent (Execution) 
    3. RiskAgent (Defensive). 
    The goal is to solve: "${problem}" for the brand "${brand.name}" in the "${brand.industry}" industry.
    Format the output as a dramatic tactical dialogue in ${targetLang}.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: "Start the tactical simulation.",
      config: { 
        systemInstruction,
        thinkingConfig: { thinkingBudget: 1024 }
      }
    });
    return response.text || "";
  } catch (err) {
    return "Simulation failed.";
  }
};

export const getSmartInsights = async (contacts: any[], deals: any[], language: 'en' | 'ar'): Promise<string> => {
  const ai = getAIClient();
  const targetLang = language === 'ar' ? 'Arabic' : 'English';
  const summary = {
    totalContacts: contacts.length,
    totalDeals: deals.length,
    totalValue: deals.reduce((acc, d) => acc + d.value, 0)
  };
  const prompt = `CRITICAL: You MUST write in ${targetLang}. Act as a strategic business analyst. Provide 3 high-impact growth insights based on this data: ${JSON.stringify(summary)}. Keep it visionary.`;
  try {
    const response = await ai.models.generateContent({ 
      model: 'gemini-3-flash-preview', 
      contents: prompt,
      config: { temperature: 0.7 }
    });
    return response.text || "";
  } catch (error) { return ""; }
};

export const getStrategicPriorities = async (contacts: any[], deals: any[], language: 'en' | 'ar'): Promise<any[]> => {
  const ai = getAIClient();
  const targetLang = language === 'ar' ? 'Arabic' : 'English';
  const summary = { contacts: contacts.length, activeDeals: deals.length };
  const prompt = `LANGUAGE: ${targetLang}. Generate 3 Strategic Priority Tasks to maximize revenue. Return ONLY a JSON Array like this: [{ "task": "Task Name", "impact": "High/Medium", "reason": "Short Strategic Reason" }]. Data: ${JSON.stringify(summary)}`;
  try {
    const response = await ai.models.generateContent({ 
      model: 'gemini-3-flash-preview', 
      contents: prompt, 
      config: { responseMimeType: "application/json" } 
    });
    return JSON.parse(response.text || '[]');
  } catch (error) { return []; }
};

export const generateStrategicAuditReport = async (contacts: any[], deals: any[], brand: any, language: 'en' | 'ar'): Promise<string> => {
  const ai = getAIClient();
  const targetLang = language === 'ar' ? 'Arabic' : 'English';
  const prompt = `CRITICAL: Respond ONLY in ${targetLang}. Perform a Comprehensive Strategic Audit for the brand in ${brand.industry}. 
  Data Context: ${contacts.length} Partners, ${deals.length} active deals. 
  Structure: 1. Current Velocity 2. Risk Mitigation 3. Exponential Opportunities. 
  Use professional Markdown.`;
  try {
    const response = await ai.models.generateContent({ 
      model: 'gemini-3-pro-preview', 
      contents: prompt, 
      config: { thinkingConfig: { thinkingBudget: 1024 } } 
    });
    return response.text || "";
  } catch (error) { return "Audit failed. Please try again."; }
};

// Added enrichContactData to research company information using search grounding
export const enrichContactData = async (company: string, language: 'en' | 'ar'): Promise<string> => {
  const ai = getAIClient();
  const targetLang = language === 'ar' ? 'Arabic' : 'English';
  const prompt = `Research and provide a strategic summary of the company: ${company}. Focus on their market position, leadership, and recent strategic news. Respond in ${targetLang}.`;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { tools: [{ googleSearch: {} }] }
    });
    return response.text || "No data found.";
  } catch (error) {
    console.error(error);
    return "Enrichment failed.";
  }
};

// Added performMarketAnalysis for competitor benchmarking
export const performMarketAnalysis = async (competitors: string, language: 'en' | 'ar') => {
  const ai = getAIClient();
  const targetLang = language === 'ar' ? 'Arabic' : 'English';
  const prompt = `Perform a deep dive market analysis on these competitors: ${competitors}. Identify their strengths, potential weaknesses, and recent marketing moves. Respond in ${targetLang}.`;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: { 
        tools: [{ googleSearch: {} }],
        thinkingConfig: { thinkingBudget: 1024 }
      }
    });
    return {
      intelligence: response.text || "",
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  } catch (error) {
    console.error(error);
    return { intelligence: "Analysis failed.", sources: [] };
  }
};

// Added getAdOptimizationInsights to analyze performance of different ad variants
export const getAdOptimizationInsights = async (adCopyA: string, adCopyB: string, metrics: any, language: 'en' | 'ar'): Promise<string> => {
  const ai = getAIClient();
  const targetLang = language === 'ar' ? 'Arabic' : 'English';
  const prompt = `Analyze these two ad variants for a marketing campaign. 
  Variant A: ${adCopyA} (Predicted Metrics: CTR ${metrics.A.ctr.toFixed(2)}%, Engagement ${metrics.A.engagement})
  Variant B: ${adCopyB} (Predicted Metrics: CTR ${metrics.B.ctr.toFixed(2)}%, Engagement ${metrics.B.engagement})
  Provide strategic optimization advice to improve future campaigns based on this data. Respond in ${targetLang}.`;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt
    });
    return response.text || "";
  } catch (error) {
    console.error(error);
    return "Optimization analysis failed.";
  }
};

// Added getMarketIntelligence for scanning global industry news and gaps
export const getMarketIntelligence = async (industry: string, language: 'en' | 'ar') => {
  const ai = getAIClient();
  const targetLang = language === 'ar' ? 'Arabic' : 'English';
  const prompt = `Scan global trends and news for the ${industry} industry. Identify 3 key strategic opportunities and 2 potential emerging threats. Respond in ${targetLang}.`;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { tools: [{ googleSearch: {} }] }
    });
    return {
      report: response.text || "",
      trends: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  } catch (error) {
    console.error(error);
    return { report: "Failed to scan market intelligence.", trends: [] };
  }
};

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
    for (let i = 0; i < frameCount; i++) channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
  }
  return buffer;
}
