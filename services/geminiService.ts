
import { GoogleGenAI, GenerateContentResponse, Type, Modality } from "@google/genai";

const getAIClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

/**
 * جلب آخر أخبار واتجاهات السوق بناءً على مجال عمل المستخدم
 */
export const getMarketIntelligence = async (industry: string, language: 'en' | 'ar'): Promise<{ report: string; trends: any[] }> => {
  const ai = getAIClient();
  const targetLang = language === 'ar' ? 'Arabic' : 'English';
  
  const prompt = `
    CRITICAL: Respond ONLY in ${targetLang}.
    As a Market Intelligence Analyst, search for the latest news, shifts, and emerging trends in the ${industry} industry for this week.
    Identify 3 major opportunities and 2 potential threats.
    Format: Professional Strategic Brief.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: { tools: [{ googleSearch: {} }] },
    });
    return { 
      report: response.text || "No intelligence found.", 
      trends: response.candidates?.[0]?.groundingMetadata?.groundingChunks || [] 
    };
  } catch (error) {
    return { report: "Search engine busy.", trends: [] };
  }
};

/**
 * إثراء بيانات العميل عبر البحث في الويب
 */
export const enrichContactData = async (companyName: string, language: 'en' | 'ar'): Promise<string> => {
  const ai = getAIClient();
  const targetLang = language === 'ar' ? 'Arabic' : 'English';
  
  const prompt = `
    CRITICAL: Respond ONLY in ${targetLang}.
    Perform a deep search for the company "${companyName}". 
    Find:
    1. Recent news or press releases.
    2. Key stakeholders if public.
    3. Their current strategic focus.
    Provide a "Cold Call Insight" - something specific to mention to build rapport.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: { tools: [{ googleSearch: {} }] },
    });
    return response.text || "Could not find recent data.";
  } catch (error) {
    return "Enrichment failed.";
  }
};

// Added missing performMarketAnalysis function
/**
 * تحليل إعلانات المنافسين بناءً على الروابط أو الملفات الشخصية
 */
export const performMarketAnalysis = async (competitors: string, language: 'en' | 'ar'): Promise<{ intelligence: string; sources: any[] }> => {
  const ai = getAIClient();
  const targetLang = language === 'ar' ? 'Arabic' : 'English';
  const prompt = `
    Perform a competitive ad intelligence scan for the following competitors: ${competitors}. 
    Identify their current marketing strategy, primary messaging tone, and visual style.
    Use Google Search to find recent campaigns or social media mentions.
    Respond ONLY in ${targetLang}.
  `;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { tools: [{ googleSearch: {} }] },
    });
    return {
      intelligence: response.text || "No intelligence found.",
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  } catch (error) {
    return { intelligence: "Intelligence scan failed.", sources: [] };
  }
};

// Added missing getAdOptimizationInsights function
/**
 * الحصول على رؤى تحسين للإعلانات بناءً على نتائج اختبار A/B
 */
export const getAdOptimizationInsights = async (copyA: string, copyB: string, metrics: any, language: 'en' | 'ar'): Promise<string> => {
  const ai = getAIClient();
  const targetLang = language === 'ar' ? 'Arabic' : 'English';
  const prompt = `
    Act as a growth marketing scientist. Compare these two ad variants:
    Variant A: ${copyA}
    Variant B: ${copyB}
    Performance Metrics: ${JSON.stringify(metrics)}
    
    Analyze which variant is likely more effective based on the data and provide one clear strategic insight for optimizing future campaigns.
    Respond ONLY in ${targetLang}.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt
    });
    return response.text || "No insights available.";
  } catch (error) {
    return "Optimization analysis unavailable.";
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
  const prompt = `CRITICAL: You MUST write in ${targetLang}. Act as a strategic consultant. Analyze: ${JSON.stringify(summary)}. 3 high-impact bullet points.`;
  try {
    const response = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: prompt });
    return response.text || "";
  } catch (error) { return ""; }
};

export const getStrategicPriorities = async (contacts: any[], deals: any[], language: 'en' | 'ar'): Promise<any[]> => {
  const ai = getAIClient();
  const targetLang = language === 'ar' ? 'Arabic' : 'English';
  const summary = { contacts: contacts.length, activeDeals: deals.length };
  const prompt = `LANGUAGE: ${targetLang}. Generate 3 Strategic Action Items. JSON Array: [{ "task": "string", "impact": "High/Medium", "reason": "string" }]. Data: ${JSON.stringify(summary)}`;
  try {
    const response = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: prompt, config: { responseMimeType: "application/json" } });
    return JSON.parse(response.text || '[]');
  } catch (error) { return []; }
};

export const generateStrategicAuditReport = async (contacts: any[], deals: any[], brand: any, language: 'en' | 'ar'): Promise<string> => {
  const ai = getAIClient();
  const targetLang = language === 'ar' ? 'Arabic' : 'English';
  const prompt = `CRITICAL: Respond ONLY in ${targetLang}. Strategic CRM Audit for ${brand.industry}. Contacts: ${contacts.length}, Deals: ${deals.length}. Markdown format.`;
  try {
    const response = await ai.models.generateContent({ model: 'gemini-3-pro-preview', contents: prompt, config: { thinkingConfig: { thinkingBudget: 500 } } });
    return response.text || "";
  } catch (error) { return ""; }
};

export const runBackgroundEmpathySync = async (contacts: any[], chatLogs: any[], brandProfile: any, language: 'en' | 'ar'): Promise<any> => {
  const ai = getAIClient();
  const targetLang = language === 'ar' ? 'Arabic' : 'English';
  const prompt = `LANGUAGE: ${targetLang}. MISSION: CONTEXTUAL AWARENESS. Update psychology JSON. Data: ${JSON.stringify({ contacts: contacts.map(c=>c.name), logs: chatLogs.slice(-5) })}`;
  try {
    const response = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: prompt, config: { responseMimeType: "application/json" } });
    return JSON.parse(response.text || '{}');
  } catch (error) { return null; }
};

export const parseGlobalCommand = async (command: string, language: 'en' | 'ar'): Promise<any> => {
  const ai = getAIClient();
  const targetLang = language === 'ar' ? 'Arabic' : 'English';
  const prompt = `LANGUAGE: ${targetLang}. Parse: "${command}". Return JSON: { "action": "add_contact|add_deal|search", "data": {}, "message": "" }`;
  try {
    const response = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: prompt, config: { responseMimeType: "application/json" } });
    return JSON.parse(response.text || '{}');
  } catch (error) { return { action: 'none' }; }
};

export const decodeBase64 = (base64: string) => {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

export const encodeAudio = (bytes: Uint8Array) => {
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
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
