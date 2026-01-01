
import { GoogleGenAI, GenerateContentResponse, Type, Modality } from "@google/genai";

const getAIClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

/**
 * تحليل أداء الإعلانات واقتراح تحسينات مستقبلية بناءً على النتائج
 */
export const getAdOptimizationInsights = async (
  adA: string, 
  adB: string, 
  metrics: { A: any; B: any }, 
  language: 'en' | 'ar'
): Promise<string> => {
  const ai = getAIClient();
  const targetLang = language === 'ar' ? 'Arabic' : 'English';
  
  const prompt = `
    CRITICAL: Respond ONLY in ${targetLang}.
    Act as a Performance Marketing Analyst.
    
    DATA TO ANALYZE:
    Variant A Copy: "${adA}"
    Variant A Metrics: CTR ${metrics.A.ctr}%, Engagement ${metrics.A.engagement}
    
    Variant B Copy: "${adB}"
    Variant B Metrics: CTR ${metrics.B.ctr}%, Engagement ${metrics.B.engagement}
    
    TASK:
    1. Determine which variant is statistically superior for its goal.
    2. Analyze WHY (tone, hook, call-to-action differences).
    3. Provide 3 specific optimizations for the NEXT campaign to beat these benchmarks.
    
    Format: Structured strategic brief.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { thinkingConfig: { thinkingBudget: 0 } }
    });
    return response.text || "Optimization analysis failed.";
  } catch (error) {
    return "Error generating optimization insights.";
  }
};

/**
 * توليد تقرير تدقيق استراتيجي شامل للنظام
 */
export const generateStrategicAuditReport = async (contacts: any[], deals: any[], brand: any, language: 'en' | 'ar'): Promise<string> => {
  const ai = getAIClient();
  const targetLang = language === 'ar' ? 'Arabic' : 'English';
  
  const systemState = {
    contactCount: contacts.length,
    dealCount: deals.length,
    industry: brand.industry,
    manualInteractions: "High (Manual Entry Detected)",
    automationLevel: "Low (Needs Lead Gen Integration)"
  };

  const prompt = `
    CRITICAL: Respond ONLY in ${targetLang}.
    Act as a Senior CRM Strategist and Market Analyst.
    ANALYZE THIS CRM SYSTEM STATE: ${JSON.stringify(systemState)}.
    
    REPORT REQUIREMENTS:
    1. MARKET FIT: Does this system meet current ${brand.industry} demands?
    2. HUMAN REDUNDANCY: Where is the user wasting time on manual tasks?
    3. STRATEGIC GAPS: What features are missing to reach 100% automation?
    4. ACTION PLAN: 3 immediate steps to improve ROI.
    
    Format: Professional Markdown Report with headers.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: { thinkingConfig: { thinkingBudget: 500 } }
    });
    return response.text || "Audit failed to generate.";
  } catch (error) {
    return "Error generating report.";
  }
};

/**
 * محرك الوعي الوجداني - يحلل سياق العمل وتفاعل العملاء في الخلفية
 */
export const runBackgroundEmpathySync = async (contacts: any[], chatLogs: any[], brandProfile: any, language: 'en' | 'ar'): Promise<any> => {
  const ai = getAIClient();
  const targetLang = language === 'ar' ? 'Arabic' : 'English';
  
  const context = {
    userStyle: brandProfile.description,
    recentHistory: chatLogs.slice(-10),
    contactNames: contacts.map(c => c.name)
  };

  const prompt = `
    LANGUAGE REQUIREMENT: You MUST respond in ${targetLang} only.
    MISSION: CONTEXTUAL AWARENESS ANALYSIS.
    Analyze the interaction style of the CRM User and these partners: ${context.contactNames.join(', ')}.
    Based on recent business flow: ${JSON.stringify(context.recentHistory)}.

    TASK:
    1. Assess the USER (Owner) focus and stress level (0-100).
    2. Understand partner personality types (Analytical, Expressive, Amiable, Driver) to improve communication.
    3. Update their "Satisfaction Status".

    Return ONLY a JSON object:
    {
      "userPsychology": { "stressLevel": number, "managementStyle": "string", "advice": "string" },
      "contactPsychology": [
        { "name": "string", "personality": "string", "satisfaction": number, "status": "string" }
      ],
      "overallHappiness": number
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { 
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Context Sync Failed", error);
    return null;
  }
};

export const getStrategicPriorities = async (contacts: any[], deals: any[], language: 'en' | 'ar'): Promise<any[]> => {
  const ai = getAIClient();
  const targetLang = language === 'ar' ? 'Arabic' : 'English';
  const summary = { contacts: contacts.length, activeDeals: deals.length, pipelineValue: deals.reduce((a,b)=>a+b.value, 0) };
  
  const prompt = `
    LANGUAGE REQUIREMENT: All content MUST be in ${targetLang}.
    Based on this CRM data: ${JSON.stringify(summary)}. 
    Generate 3 "Strategic Action Items" for the user today. 
    Make them clear, encouraging, and professional. 
    Format: JSON Array of { "task": "string", "impact": "High/Medium", "reason": "string" }.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text || '[]');
  } catch (error) {
    return [];
  }
};

export const parseGlobalCommand = async (command: string, language: 'en' | 'ar'): Promise<any> => {
  const ai = getAIClient();
  const targetLang = language === 'ar' ? 'Arabic' : 'English';
  const prompt = `
    LANGUAGE REQUIREMENT: Your message field MUST be in ${targetLang}.
    Analyze this natural language CRM command: "${command}". 
    Extract action. Even if it's casual like "add my friend sam" -> 'add_contact'.
    Actions: 'add_contact', 'add_deal', 'search', 'analyze'.
    Return ONLY JSON: { "action": "...", "data": { ... }, "message": "..." }.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    return { action: 'none', message: "Engine busy." };
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
  
  const prompt = `
    CRITICAL: You MUST write the entire response in ${targetLang} language.
    Act as a world-class strategic consultant. Analyze this CRM state: ${JSON.stringify(summary)}. 
    Provide 3 high-impact strategic growth bullet points.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt
    });
    return response.text || "Generating insights...";
  } catch (error) {
    return "Insights unavailable currently.";
  }
};

export const performMarketAnalysis = async (keywords: string, language: 'en' | 'ar'): Promise<{ intelligence: string; sources: any[] }> => {
  const ai = getAIClient();
  const targetLang = language === 'ar' ? 'Arabic' : 'English';
  const prompt = `
    CRITICAL: You MUST provide the final strategic report in ${targetLang} language.
    MISSION: COMPETITOR AD SPY & BENCHMARKING.
    TARGETS: "${keywords}".
    
    TASK:
    1. Analyze the advertising messaging (Hooks, Value Props, Tone).
    2. Identify probable targeting strategies (Demographics, Pain Points).
    3. Analyze visual elements (Color palettes, Image style, Formats).
    4. Provide a Gap Discovery: How can we beat their strategy?
    
    Use Google Search to find their current ads, landing pages, and social media presence.
    Format as a structured report with clear sections.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: { tools: [{ googleSearch: {} }] },
    });
    return { 
      intelligence: response.text || "Analysis failed.", 
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || [] 
    };
  } catch (error) {
    return { intelligence: "Error", sources: [] };
  }
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
