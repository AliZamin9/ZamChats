
import React, { useState, useRef, useEffect } from 'react';
import { Message, UserProfile, Channel } from '../types';
import { GoogleGenAI } from '@google/genai';

interface ChatAreaProps {
  channel: Channel;
  user: UserProfile;
}

export const ChatArea: React.FC<ChatAreaProps> = ({ channel, user }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      senderId: 'ai-1',
      senderName: 'NexusBot',
      content: `Welcome to #${channel.name}! Synchronized and ready.`,
      timestamp: new Date(),
      type: 'text'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      senderId: user.id,
      senderName: user.name,
      content: input,
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: input,
        config: {
          systemInstruction: 'You are an energetic AI companion in a mobile gaming chat. Use emojis, short phrases, and keep the vibe high. You are inside a sleek glass UI hub.'
        }
      });

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        senderId: 'ai-1',
        senderName: 'NexusBot',
        content: response.text || "Connection glitch. Try again?",
        timestamp: new Date(),
        type: 'text'
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const mediaUrl = event.target?.result as string;
      const type = file.type.startsWith('image/') ? 'image' : 'video';
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        senderId: user.id,
        senderName: user.name,
        content: `Uploaded ${type}`,
        timestamp: new Date(),
        type: type,
        mediaUrl: mediaUrl
      }]);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex-1 flex flex-col h-screen relative bg-transparent overflow-hidden">
      {/* Dynamic Header */}
      <div className="h-20 lg:h-16 px-6 pt-4 lg:pt-0 flex items-center glass-panel border-t-0 border-x-0 shrink-0 z-10">
        <div className="hidden lg:flex p-2 rounded-xl bg-indigo-500/10 mr-3 text-indigo-400 border border-indigo-500/20">
           <span className="text-xl font-bold">#</span>
        </div>
        <div className="ml-10 lg:ml-0">
          <h1 className="font-black text-white text-lg tracking-tight leading-none">{channel.name}</h1>
          <p className="text-[10px] text-indigo-400 font-black uppercase tracking-[0.2em] mt-1.5 opacity-80">Sync Level: Optimal</p>
        </div>
        
        <div className="ml-auto flex items-center space-x-2">
           <button className="w-10 h-10 flex items-center justify-center rounded-2xl glass-panel neo-float text-white/60 hover:text-white transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
           </button>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-6 z-10 scroll-smooth hide-scrollbar">
        {messages.map((msg, i) => {
          const isMe = msg.senderId === user.id;
          return (
            <div key={msg.id} className={`flex animate-in slide-in-from-bottom-4 duration-500 ${isMe ? 'flex-row-reverse' : ''}`}>
              <div className={`w-10 h-10 rounded-2xl glass-panel border border-white/10 neo-card overflow-hidden shrink-0 transition-transform ${isMe ? 'ml-3' : 'mr-3'} mt-auto mb-1`}>
                <img src={msg.senderId === 'ai-1' ? 'https://picsum.photos/seed/ai-nexus/100' : user.avatar} alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <div className={`flex flex-col max-w-[85%] lg:max-w-[70%] ${isMe ? 'items-end' : 'items-start'}`}>
                <div className={`p-4 rounded-[2rem] glass-panel neo-card text-[#dbdee1] text-sm lg:text-base leading-relaxed border border-white/5 ${
                  isMe ? 'rounded-br-none bg-indigo-500/10 border-indigo-500/30' : 'rounded-bl-none'
                }`}>
                  {msg.type === 'text' ? (
                    msg.content
                  ) : msg.type === 'image' ? (
                    <img src={msg.mediaUrl} className="rounded-2xl max-h-80 w-auto border border-white/10 neo-card" />
                  ) : (
                    <video src={msg.mediaUrl} controls className="rounded-2xl max-h-80 w-full border border-white/10 neo-card" />
                  )}
                </div>
                <div className={`flex items-center mt-2 px-2 text-[9px] font-bold text-[#949ba4] uppercase tracking-widest ${isMe ? 'flex-row-reverse' : ''}`}>
                   <span className={isMe ? 'ml-2' : 'mr-2'}>{msg.senderName}</span>
                   <span className="opacity-40">{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            </div>
          );
        })}
        {isTyping && (
          <div className="flex items-center space-x-3 pl-14">
            <div className="flex space-x-1.5 p-2 px-3 glass-panel rounded-2xl neo-inset border-white/5">
               <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-duration:0.6s]"></div>
               <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-duration:0.6s] [animation-delay:0.2s]"></div>
               <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-duration:0.6s] [animation-delay:0.4s]"></div>
            </div>
            <span className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.2em]">Processing Stream</span>
          </div>
        )}
      </div>

      {/* Input Module */}
      <div className="px-4 lg:px-8 pb-10 pt-4 shrink-0 z-10">
        <form onSubmit={handleSend} className="glass-panel neo-card rounded-3xl flex items-center p-2 border border-white/10 shadow-2xl backdrop-blur-3xl">
          <button 
            type="button" 
            onClick={() => fileInputRef.current?.click()}
            className="w-12 h-12 flex items-center justify-center rounded-2xl hover:bg-white/10 text-indigo-400 transition-all mr-1 active:scale-90"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*,video/*"
            onChange={handleFileUpload}
          />
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your transmission..."
            className="bg-transparent border-none focus:outline-none flex-1 text-[#dbdee1] placeholder-white/20 py-3 px-2 font-medium"
          />
          <button 
            type="submit" 
            disabled={!input.trim()}
            className="w-12 h-12 flex items-center justify-center rounded-2xl bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-20 transition-all ml-1 neo-card isometric-3d active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};
