
import React from 'react';
import { Server, Channel } from '../types';

interface ChannelListProps {
  server: Server;
  activeChannelId: string;
  onChannelSelect: (id: string) => void;
}

export const ChannelList: React.FC<ChannelListProps> = ({ 
  server, 
  activeChannelId, 
  onChannelSelect 
}) => {
  const textChannels = server.channels.filter(c => c.type === 'text');
  const voiceChannels = server.channels.filter(c => c.type === 'voice');

  return (
    <div className="w-72 lg:w-64 glass-panel border-r-0 h-screen shrink-0 flex flex-col shadow-2xl">
      <div className="h-20 lg:h-16 px-6 flex flex-col justify-center border-b border-white/5">
        <span className="text-white font-bold text-lg tracking-wide truncate">{server.name}</span>
        <div className="flex items-center text-[9px] font-bold text-indigo-400 uppercase tracking-widest mt-0.5">
           <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-2 animate-pulse" />
           Operational Node
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8 hide-scrollbar">
        <div className="space-y-4">
          <div className="px-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#949ba4] flex items-center">
            Comms (Text)
            <div className="ml-auto w-4 h-4 rounded bg-white/5 flex items-center justify-center text-xs">+</div>
          </div>
          <div className="space-y-2">
            {textChannels.map(channel => (
              <button
                key={channel.id}
                onClick={() => onChannelSelect(channel.id)}
                className={`w-full flex items-center px-4 py-3.5 rounded-2xl transition-all group relative border ${
                  activeChannelId === channel.id 
                    ? 'bg-indigo-500/10 text-white border-indigo-500/20 neo-inset' 
                    : 'text-[#949ba4] border-transparent hover:bg-white/5'
                }`}
              >
                <span className={`mr-3 text-lg ${activeChannelId === channel.id ? 'text-indigo-400' : 'text-[#80848e]'}`}>#</span>
                <span className="truncate font-semibold text-sm">{channel.name}</span>
                {activeChannelId === channel.id && (
                  <div className="absolute right-4 w-1 h-1 rounded-full bg-indigo-500 shadow-[0_0_8px_#6366f1]" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="px-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#949ba4]">
            Hologram (Voice)
          </div>
          <div className="grid grid-cols-1 gap-2">
            {voiceChannels.map(channel => (
              <button
                key={channel.id}
                onClick={() => onChannelSelect(channel.id)}
                className={`w-full flex items-center px-4 py-4 rounded-2xl transition-all border ${
                  activeChannelId === channel.id 
                    ? 'bg-indigo-500/10 text-white border-indigo-500/20 neo-inset' 
                    : 'text-[#949ba4] border-white/5 bg-white/[0.02] hover:bg-white/5'
                }`}
              >
                <div className={`p-1.5 rounded-xl mr-3 ${activeChannelId === channel.id ? 'bg-indigo-500 text-white' : 'bg-white/10 text-white/50'}`}>
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                   </svg>
                </div>
                <span className="truncate font-bold text-sm">{channel.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 bg-white/[0.01] border-t border-white/5">
        <div className="p-3 rounded-2xl glass-panel neo-card border-white/10 flex items-center">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0012 18.75c-1.03 0-1.9-.4-2.524-1.053l-.548-.547z" />
             </svg>
          </div>
          <div className="ml-3">
             <div className="text-[10px] font-black text-white/40 uppercase tracking-tighter leading-none mb-1">System Status</div>
             <div className="text-xs font-bold text-white tracking-wide">AI Interface Online</div>
          </div>
        </div>
      </div>
    </div>
  );
};
