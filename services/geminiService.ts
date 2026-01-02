
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
      contents: { parts: [{ text: `Professional advertisement photography for: ${prompt}. High-end commercial style.` }] },
      config: { imageConfig: { aspectRatio: "1:1" } }
    });
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
    }
  } catch (err) { console.error(err); }
  return null;
};

// رؤى الأوراكل الاستراتيجية (تم التحديث لدمج المعرفة)
export const getSmartInsights = async (contacts: any[], deals: any[], language: 'en' | 'ar', kb?: string) => {
  const ai = getAIClient();
  const targetLang = language === 'ar' ? 'Arabic' : 'English';
  const totalValue = deals.reduce((sum, d) => sum + d.value, 0);
  const totalCollected = deals.reduce((acc, d) => acc + (d.payments?.filter((p: any) => p.status === 'Paid').reduce((s: any, p: any) => s + p.amount, 0) || 0), 0);
  
  const summary = `Stats: ${contacts.length} partners, $${totalValue} Pipeline, $${totalCollected} Collected.`;
  const prompt = `
    Based on this data: ${summary}, and this company knowledge base: "${kb || 'No specific KB'}", 
    provide one powerful, visionary, and tactical strategic insight for the business owner. 
    Focus on increasing the collection rate and scaling the pipeline. 
    Respond in ${targetLang}. Keep it punchy and high-level.
  `;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt
    });
    return response.text || "";
  } catch (e) { return "Ready for tactical deployment."; }
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
      contents: `Deep scan and enrichment for company: "${company}". Respond in ${targetLang}.`,
      config: { tools: [{ googleSearch: {} }] }
    });
    return response.text || "";
  } catch (err) { return "Enrichment failed."; }
};

// محاكاة الوكلاء
export const runAgentSimulation = async (problem: string, brand: any, language: 'en' | 'ar') => {
  const ai = getAIClient();
  const systemInstruction = `Autonomous Agent Orchestrator. Solve: ${problem}. KB: ${brand.knowledgeBase}`;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: "Run simulation.",
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
