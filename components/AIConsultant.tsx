
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Modality, LiveServerMessage } from "@google/genai";
import { Contact, Deal, ChatLog, BrandProfile } from '../types';
import { decodeBase64, encodeAudio, decodeAudioData } from '../services/geminiService';

interface AIConsultantProps {
  contacts: Contact[];
  deals: Deal[];
  language: 'en' | 'ar';
  brand: BrandProfile;
  deductTokens: (amount: number) => Promise<boolean>;
}

const AIConsultant: React.FC<AIConsultantProps> = ({ contacts, deals, language, brand, deductTokens }) => {
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'Strategic' | 'Tactical' | 'Combat'>('Strategic');
  const [transcriptions, setTranscriptions] = useState<string[]>([]);
  const [status, setStatus] = useState<'idle' | 'connecting' | 'listening' | 'speaking'>('idle');
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const sessionPromiseRef = useRef<Promise<any> | null>(null);

  const currentInputTranscription = useRef('');
  const currentOutputTranscription = useRef('');

  const stopSession = () => {
    if (sessionPromiseRef.current) sessionPromiseRef.current.then(s => s.close());
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    setIsActive(false);
    setStatus('idle');
  };

  const startSession = async () => {
    const success = await deductTokens(15);
    if (!success) return;

    const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
    const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    audioContextRef.current = outputCtx;
    setStatus('connecting');

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const targetLang = language === 'ar' ? 'Arabic' : 'English';

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

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
             if (message.serverContent?.inputTranscription) currentInputTranscription.current += message.serverContent.inputTranscription.text;
             if (message.serverContent?.outputTranscription) currentOutputTranscription.current += message.serverContent.outputTranscription.text;

             if (message.serverContent?.turnComplete) {
               setTranscriptions(prev => [...prev.slice(-10), `User: ${currentInputTranscription.current}`, `Omni: ${currentOutputTranscription.current}`]);
               currentInputTranscription.current = '';
               currentOutputTranscription.current = '';
             }

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
          onerror: () => stopSession(),
          onclose: () => stopSession()
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Charon' } } },
          systemInstruction: `ROLE: Strategic Growth Advisor. MODE: ${mode}. LANGUAGE: ${targetLang}.`,
          inputAudioTranscription: {},
          outputAudioTranscription: {}
        }
      });
      sessionPromiseRef.current = sessionPromise;
    } catch (err) { setStatus('idle'); }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] bg-[#020617] rounded-[5rem] p-12 border border-white/5 relative overflow-hidden" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="absolute top-16 flex gap-4 z-20">
        {['Strategic', 'Tactical', 'Combat'].map(m => (
          <button key={m} onClick={() => setMode(m as any)} className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${mode === m ? 'bg-indigo-600 text-white border-indigo-500 shadow-xl' : 'text-slate-500 border-white/10 hover:border-white/30'}`}>{m}</button>
        ))}
      </div>
      
      <div className="relative z-10 text-center mb-16">
        <h2 className="text-5xl font-black text-white tracking-tighter mb-8">{language === 'ar' ? 'مستشار النمو الحي' : 'Live Strategic Advisor'}</h2>
        <div className={`w-48 h-48 rounded-full flex items-center justify-center border-4 ${status === 'speaking' ? 'border-emerald-500 shadow-[0_0_50px_rgba(16,185,129,0.3)] animate-pulse' : 'border-indigo-600 shadow-[0_0_50px_rgba(79,70,229,0.2)]'} mx-auto mb-8 transition-all duration-700`}>
           <i className={`fa-solid ${status === 'speaking' ? 'fa-waveform-lines' : 'fa-microphone'} text-5xl text-white`}></i>
        </div>
        <p className="text-indigo-400 text-xs font-black uppercase tracking-[0.5em]">{status}</p>
      </div>

      <div className="w-full max-w-4xl h-48 bg-black/30 rounded-[3rem] p-10 border border-white/5 overflow-y-auto mb-16 flex flex-col gap-4 custom-scrollbar">
         {transcriptions.map((t, i) => (
           <p key={i} className={`text-sm font-bold ${t.startsWith('Omni') ? 'text-indigo-400' : 'text-slate-400'}`}>{t}</p>
         ))}
      </div>

      <div className="relative z-10">
        {!isActive ? (
          <button onClick={startSession} className="px-20 py-10 bg-indigo-600 text-white rounded-[3rem] font-black text-3xl shadow-[0_20px_80px_rgba(79,70,229,0.4)] hover:scale-105 active:scale-95 transition-all">
            {language === 'ar' ? 'تفعيل الرابط العصبي' : 'Engage Neural Link'}
          </button>
        ) : (
          <button onClick={stopSession} className="px-20 py-10 bg-rose-600 text-white rounded-[3rem] font-black text-3xl shadow-[0_20px_80px_rgba(244,63,94,0.4)] hover:scale-105 transition-all">
            {language === 'ar' ? 'إنهاء الاتصال' : 'Terminate Link'}
          </button>
        )}
      </div>
    </div>
  );
};

export default AIConsultant;
