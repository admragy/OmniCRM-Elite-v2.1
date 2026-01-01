
import { GoogleGenAI, GenerateContentResponse, Type, Modality } from "@google/genai";

const getAIClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
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

// Fix: Implement missing parseGlobalCommand function
export const parseGlobalCommand = async (command: string, contacts: any[], deals: any[], tasks: any[], language: 'en' | 'ar') => {
  const ai = getAIClient();
  const targetLang = language === 'ar' ? 'Arabic' : 'English';
  const prompt = `System Command Parsing. Respond in ${targetLang}. Context: ${contacts.length} contacts, ${deals.length} deals, ${tasks.length} tasks. Command: "${command}". Explain what action would be taken based on this command in a strategic tone.`;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt
    });
    return response.text || "";
  } catch (err) { return "Error parsing command."; }
};

// Fix: Implement missing enrichContactData function with Search Grounding
export const enrichContactData = async (company: string, language: 'en' | 'ar'): Promise<string> => {
  const ai = getAIClient();
  const targetLang = language === 'ar' ? 'Arabic' : 'English';
  const prompt = `Perform a deep strategic scan for the company: ${company}. Provide key insights, market position, and potential challenges. Language: ${targetLang}.`;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }]
      }
    });
    return response.text || "";
  } catch (error) { return "Enrichment failed."; }
};

// Fix: Implement missing performMarketAnalysis function with Search Grounding
export const performMarketAnalysis = async (competitors: string, language: 'en' | 'ar'): Promise<{ intelligence: string; sources: any[] }> => {
  const ai = getAIClient();
  const targetLang = language === 'ar' ? 'Arabic' : 'English';
  const prompt = `Strategic market analysis of competitors: ${competitors}. Identify their ad strategies, strengths, and weaknesses. Language: ${targetLang}.`;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }]
      }
    });
    return {
      intelligence: response.text || "",
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  } catch (error) { return { intelligence: "Analysis failed.", sources: [] }; }
};

// Fix: Implement missing getAdOptimizationInsights function
export const getAdOptimizationInsights = async (copyA: string, copyB: string, metrics: any, language: 'en' | 'ar'): Promise<string> => {
  const ai = getAIClient();
  const targetLang = language === 'ar' ? 'Arabic' : 'English';
  const prompt = `Analyze two ad variants. Variant A: ${copyA}, Metrics: ${JSON.stringify(metrics.A)}. Variant B: ${copyB}, Metrics: ${JSON.stringify(metrics.B)}. Provide optimization strategies for the next campaign. Language: ${targetLang}.`;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt
    });
    return response.text || "";
  } catch (error) { return ""; }
};

// Fix: Implement missing getMarketIntelligence function with Search Grounding
export const getMarketIntelligence = async (industry: string, language: 'en' | 'ar'): Promise<{ report: string; trends: any[] }> => {
  const ai = getAIClient();
  const targetLang = language === 'ar' ? 'Arabic' : 'English';
  const prompt = `Generate a strategic market pulse report for the ${industry} industry. Focus on current global trends and untapped opportunities. Language: ${targetLang}.`;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }]
      }
    });
    return {
      report: response.text || "",
      trends: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  } catch (error) { return { report: "Scan failed.", trends: [] }; }
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
