
import React, { useState, useRef, useCallback } from 'react';
import { GoogleGenAI, Modality, LiveServerMessage } from "@google/genai";
import { Contact, Deal, BrandProfile } from '../types';
import { decodeBase64, encodeAudio, decodeAudioData } from '../services/geminiService';

interface AIConsultantProps {
  contacts: Contact[];
  deals: Deal[];
  language: 'en' | 'ar';
  brand: BrandProfile;
  deductTokens: (amount: number) => Promise<boolean>;
}

const AIConsultant: React.FC<AIConsultantProps> = ({ language, deductTokens }) => {
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'Strategic' | 'Tactical' | 'Combat'>('Strategic');
  const [transcriptions, setTranscriptions] = useState<string[]>([]);
  const [status, setStatus] = useState<'idle' | 'connecting' | 'listening' | 'speaking'>('idle');
  
  const streamRef = useRef<MediaStream | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const sessionPromiseRef = useRef<Promise<any> | null>(null);

  const stopSession = useCallback(() => {
    if (sessionPromiseRef.current) sessionPromiseRef.current.then(s => s.close());
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    setIsActive(false);
    setStatus('idle');
    setTranscriptions(prev => [...prev, "--- End of Session ---"]);
  }, []);

  const startSession = async () => {
    const success = await deductTokens(25);
    if (!success) return;

    setStatus('connecting');
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const targetLang = language === 'ar' ? 'Arabic' : 'English';

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            setStatus('listening');
            setIsActive(true);
            const source = inputCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const int16 = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) int16[i] = inputData[i] * 32768;
              sessionPromise.then(s => s.sendRealtimeInput({ 
                media: { data: encodeAudio(new Uint8Array(int16.buffer)), mimeType: 'audio/pcm;rate=16000' } 
              }));
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
             const audioData = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
             if (audioData) {
               setStatus('speaking');
               const buffer = await decodeAudioData(decodeBase64(audioData), outputCtx, 24000, 1);
               const source = outputCtx.createBufferSource();
               source.buffer = buffer;
               source.connect(outputCtx.destination);
               const playTime = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
               source.start(playTime);
               nextStartTimeRef.current = playTime + buffer.duration;
               sourcesRef.current.add(source);
               source.onended = () => { 
                 sourcesRef.current.delete(source);
                 if (sourcesRef.current.size === 0) setStatus('listening');
               };
             }
          },
          onerror: (e) => { console.error(e); stopSession(); },
          onclose: () => stopSession()
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Charon' } } },
          systemInstruction: `You are the Omni Oracle. Mode: ${mode}. Language: ${targetLang}. Help with strategic growth.`,
        }
      });
      sessionPromiseRef.current = sessionPromise;
    } catch (err) { 
      console.error(err);
      setStatus('idle');
      alert("Mic access denied.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] bg-slate-900/40 rounded-[4rem] p-12 border border-white/5 relative overflow-hidden" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="flex gap-4 mb-16">
        {['Strategic', 'Tactical', 'Combat'].map(m => (
          <button key={m} onClick={() => setMode(m as any)} className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${mode === m ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg' : 'text-slate-500 border-white/10'}`}>{m}</button>
        ))}
      </div>
      
      <div className="text-center mb-16">
        <h2 className="text-4xl font-black text-white tracking-tighter mb-8">{language === 'ar' ? 'الأوراكل الحي' : 'Live Oracle'}</h2>
        <div className={`w-40 h-40 rounded-full flex items-center justify-center border-2 ${status === 'speaking' ? 'border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.2)] animate-pulse' : 'border-indigo-600'} mx-auto mb-6 transition-all`}>
           <i className={`fa-solid ${status === 'speaking' ? 'fa-waveform-lines' : 'fa-microphone'} text-4xl text-white`}></i>
        </div>
        <p className="text-indigo-400 text-[9px] font-black uppercase tracking-widest">{status}</p>
      </div>

      <div className="flex gap-4">
        {!isActive ? (
          <button onClick={startSession} className="px-12 py-5 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:scale-105 transition-all">
            {language === 'ar' ? 'بدء الاتصال' : 'Engage Link'}
          </button>
        ) : (
          <button onClick={stopSession} className="px-12 py-5 bg-rose-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:scale-105 transition-all">
            {language === 'ar' ? 'إنهاء الجلسة' : 'Terminate'}
          </button>
        )}
      </div>
    </div>
  );
};

export default AIConsultant;
