
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
    for (let i = 0; i < frameCount; i++) channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
  }
  return buffer;
}

// توليد الصور الإعلانية
export const generateAdImage = async (prompt: string) => {
  const ai = getAIClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: `Professional high-quality commercial advertisement photography for: ${prompt}. Cinematic lighting, 4k, studio quality.` }] },
      config: { imageConfig: { aspectRatio: "1:1" } }
    });
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
  } catch (err) {
    console.error("Image generation failed:", err);
  }
  return null;
};

// رؤى الأوراكل الاستراتيجية
export const getSmartInsights = async (contacts: any[], deals: any[], language: 'en' | 'ar') => {
  const ai = getAIClient();
  const targetLang = language === 'ar' ? 'Arabic' : 'English';
  const summary = `Partners: ${contacts.length}, Total Deals: ${deals.length}, Revenue: $${deals.reduce((a, b) => a + b.value, 0)}`;
  const prompt = `Based on this data: ${summary}, provide a visionary, high-level strategic insight for the business owner. Be inspiring and tactical. Respond in ${targetLang}.`;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt
    });
    return response.text || "";
  } catch (e) { return ""; }
};

// هندسة النمو الفيروسي
export const getGrowthStrategy = async (industry: string, language: 'en' | 'ar') => {
  const ai = getAIClient();
  const targetLang = language === 'ar' ? 'Arabic' : 'English';
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Viral marketing trends for ${industry}. Focus on organic reach. Respond in ${targetLang}.`,
      config: { tools: [{ googleSearch: {} }] },
    });
    return { text: response.text || "", sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || [] };
  } catch (err) { return { text: "Strategy failed.", sources: [] }; }
};

// غرفة العمليات (Maps + Search)
export const analyzeGlobalRisk = async (query: string, lat: number, lng: number, language: 'en' | 'ar') => {
  const ai = getAIClient();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: query,
      config: {
        tools: [{ googleMaps: {} }, { googleSearch: {} }],
        toolConfig: { retrievalConfig: { latLng: { latitude: lat, longitude: lng } } }
      },
    });
    return { text: response.text || "", grounding: response.candidates?.[0]?.groundingMetadata?.groundingChunks || [] };
  } catch (err) { return { text: "Analysis failed.", grounding: [] }; }
};

// أولويات النمو
export const getStrategicPriorities = async (contacts: any[], deals: any[], language: 'en' | 'ar'): Promise<any[]> => {
  const ai = getAIClient();
  const summary = { contacts: contacts.length, deals: deals.length };
  try {
    const response = await ai.models.generateContent({ 
      model: 'gemini-3-flash-preview', 
      contents: `Generate 3 growth tasks as JSON: [{ "task": "string", "impact": "High/Medium", "reason": "string" }] based on ${JSON.stringify(summary)}`, 
      config: { responseMimeType: "application/json" } 
    });
    return JSON.parse(response.text || '[]');
  } catch (error) { return []; }
};

// إثراء بيانات جهات الاتصال (Deep Scan)
export const enrichContactData = async (company: string, language: 'en' | 'ar') => {
  const ai = getAIClient();
  const targetLang = language === 'ar' ? 'Arabic' : 'English';
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Deep scan and enrichment for company: "${company}". Provide business model and recent news. Respond in ${targetLang}.`,
      config: { tools: [{ googleSearch: {} }] }
    });
    return response.text || "";
  } catch (err) { return "Enrichment failed."; }
};

// محاكاة الوكلاء
export const runAgentSimulation = async (problem: string, brand: any, language: 'en' | 'ar') => {
  const ai = getAIClient();
  const systemInstruction = `Autonomous Agent Orchestrator. Simulate 3 specialist agents. Solve: ${problem}. 
  Company Info: ${brand.knowledgeBase || brand.description}`;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: "Run tactical simulation.",
      config: { systemInstruction, thinkingConfig: { thinkingBudget: 1024 } }
    });
    return response.text || "";
  } catch (err) { return "Simulation failed."; }
};

// استخبارات السوق
export const getMarketIntelligence = async (industry: string, language: 'en' | 'ar') => {
  const ai = getAIClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Latest market news for ${industry}.`,
      config: { tools: [{ googleSearch: {} }] }
    });
    return { report: response.text || "", trends: response.candidates?.[0]?.groundingMetadata?.groundingChunks || [] };
  } catch (error) { return { report: "", trends: [] }; }
};
