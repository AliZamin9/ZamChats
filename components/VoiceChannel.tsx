
import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, Channel } from '../types';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { decode, decodeAudioData, createBlob } from '../services/audioUtils';

interface VoiceChannelProps {
  channel: Channel;
  user: UserProfile;
  onLeave: () => void;
}

export const VoiceChannel: React.FC<VoiceChannelProps> = ({ channel, user, onLeave }) => {
  const [status, setStatus] = useState<'connecting' | 'connected' | 'error'>('connecting');
  const [isMuted, setIsMuted] = useState(false);
  const [isAiTalking, setIsAiTalking] = useState(false);
  const sessionRef = useRef<any>(null);
  const nextStartTimeRef = useRef(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  useEffect(() => {
    const startSession = async () => {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
        outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });

        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

        const sessionPromise = ai.live.connect({
          model: 'gemini-2.5-flash-native-audio-preview-09-2025',
          callbacks: {
            onopen: () => {
              setStatus('connected');
              const source = audioContextRef.current!.createMediaStreamSource(stream);
              const scriptProcessor = audioContextRef.current!.createScriptProcessor(4096, 1, 1);
              scriptProcessor.onaudioprocess = (e) => {
                if (isMuted) return;
                sessionPromise.then(s => s.sendRealtimeInput({ media: createBlob(e.inputBuffer.getChannelData(0)) }));
              };
              source.connect(scriptProcessor);
              scriptProcessor.connect(audioContextRef.current!.destination);
            },
            onmessage: async (m: LiveServerMessage) => {
              const data = m.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
              if (data) {
                setIsAiTalking(true);
                const ctx = outputAudioContextRef.current!;
                nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
                const buffer = await decodeAudioData(decode(data), ctx, 24000, 1);
                const src = ctx.createBufferSource();
                src.buffer = buffer;
                src.connect(ctx.destination);
                src.addEventListener('ended', () => {
                  sourcesRef.current.delete(src);
                  if (sourcesRef.current.size === 0) setIsAiTalking(false);
                });
                src.start(nextStartTimeRef.current);
                nextStartTimeRef.current += buffer.duration;
                sourcesRef.current.add(src);
              }
              if (m.serverContent?.interrupted) {
                sourcesRef.current.forEach(s => s.stop());
                sourcesRef.current.clear();
                nextStartTimeRef.current = 0;
                setIsAiTalking(false);
              }
            },
            onerror: () => setStatus('error'),
            onclose: () => setStatus('connecting')
          },
          config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
            systemInstruction: 'You are an energetic gaming friend on voice. Be cool, use short sentences, and encourage the player.'
          }
        });
        sessionRef.current = await sessionPromise;
      } catch (e) { setStatus('error'); }
    };
    startSession();
    return () => { sessionRef.current?.close(); audioContextRef.current?.close(); outputAudioContextRef.current?.close(); };
  }, []);

  return (
    <div className="flex-1 flex flex-col h-screen relative bg-transparent p-6 overflow-hidden">
      <div className="mt-20 flex flex-col items-center space-y-4">
        <h2 className="text-2xl font-black text-white tracking-tighter uppercase">{channel.name}</h2>
        <div className="px-4 py-1 glass-panel rounded-full border-indigo-500/20 flex items-center">
           <div className={`w-2 h-2 rounded-full mr-3 ${status === 'connected' ? 'bg-green-500 animate-pulse' : 'bg-orange-500'}`} />
           <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">
             {status === 'connected' ? 'Link Established' : 'Syncing Link...'}
           </span>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center space-y-8">
        <div className="relative w-full max-w-sm flex justify-center">
          {/* AI Avatar */}
          <div className={`w-48 h-48 lg:w-64 lg:h-64 rounded-[3rem] glass-panel neo-card border-2 overflow-hidden transition-all duration-500 z-10 ${
            isAiTalking ? 'border-indigo-500 scale-105 shadow-[0_0_40px_rgba(99,102,241,0.4)]' : 'border-white/10'
          }`}>
             <img src="https://picsum.photos/seed/cyber-nexus/300" className="w-full h-full object-cover opacity-80" />
             <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/60 to-transparent flex items-end justify-center pb-6">
                <span className="text-white font-black text-xs uppercase tracking-widest">Nexus Interface</span>
             </div>
             {isAiTalking && (
               <div className="absolute top-4 right-4 flex space-x-1">
                 {[1,2,3].map(i => <div key={i} className="w-1 bg-white/60 h-4 rounded-full animate-bounce" style={{animationDelay: `${i*0.1}s`}} />)}
               </div>
             )}
          </div>
          
          {/* User Avatar - Floating Sidekick */}
          <div className="absolute -bottom-10 -right-4 w-28 h-28 rounded-3xl glass-panel neo-card border-white/20 overflow-hidden shadow-2xl z-20 isometric-3d">
             <img src={user.avatar} className="w-full h-full object-cover" />
             {!isMuted && <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-green-500 animate-pulse" />}
          </div>
        </div>
      </div>

      <div className="pb-12 flex justify-center items-center space-x-6">
        <button 
          onClick={() => setIsMuted(!isMuted)}
          className={`w-16 h-16 rounded-[2rem] flex items-center justify-center transition-all neo-card ${isMuted ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'glass-panel text-white/80 border-white/10 active:scale-90'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            {isMuted && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 6l12 12" />}
          </svg>
        </button>

        <button 
          onClick={onLeave}
          className="w-20 h-20 rounded-[2.5rem] bg-red-600 text-white flex items-center justify-center neo-card shadow-[0_0_30px_rgba(220,38,38,0.4)] active:scale-95 transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.209.388l-2.235 2.235a13.213 13.213 0 01-5.455-5.455l2.235-2.235a1 1 0 00.388-1.209L7.228 3.684A1 1 0 006.28 3H5z" />
          </svg>
        </button>

        <button className="w-16 h-16 rounded-[2rem] glass-panel border border-white/10 flex items-center justify-center text-white/80 neo-card active:scale-90">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
        </button>
      </div>
    </div>
  );
};
