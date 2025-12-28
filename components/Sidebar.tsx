
import React from 'react';
import { Server, UserProfile } from '../types';

interface SidebarProps {
  servers: Server[];
  activeServerId: string;
  onServerSelect: (id: string) => void;
  user: UserProfile;
  onOpenProfile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  servers, 
  activeServerId, 
  onServerSelect, 
  user,
  onOpenProfile 
}) => {
  return (
    <div className="w-[72px] lg:w-[84px] glass-panel flex flex-col items-center py-6 space-y-4 shrink-0 h-screen border-r border-white/5">
      <div 
        className={`w-12 h-12 lg:w-14 lg:h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white cursor-pointer group isometric-3d neo-card ${activeServerId === 'home' ? 'glow-indigo' : ''}`}
        onClick={() => onServerSelect('home')}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 lg:h-8" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
      </div>

      <div className="w-8 h-[1px] bg-white/10 rounded-full" />

      <div className="flex-1 space-y-4 overflow-y-auto hide-scrollbar w-full flex flex-col items-center py-2">
        {servers.map((server) => (
          <div 
            key={server.id}
            className={`relative group cursor-pointer transition-transform active:scale-95`}
            onClick={() => onServerSelect(server.id)}
          >
            <div className={`absolute -left-2 top-1/2 -translate-y-1/2 w-1.5 bg-indigo-500 rounded-r-full transition-all duration-300 ${
              activeServerId === server.id ? 'h-8 opacity-100' : 'h-0 opacity-0 group-hover:h-3'
            }`} />
            <div className={`w-12 h-12 lg:w-14 lg:h-14 flex items-center justify-center text-xl lg:text-2xl transition-all duration-300 glass-panel neo-card ${
              activeServerId === server.id ? 'rounded-xl border-indigo-500/50 bg-indigo-500/20 text-white glow-indigo' : 'rounded-[2rem] hover:rounded-xl hover:bg-white/10'
            }`}>
              {server.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="pb-4">
        <div 
          className="w-12 h-12 lg:w-14 lg:h-14 rounded-2xl p-0.5 glass-panel neo-card cursor-pointer hover:scale-105 active:scale-90 transition-all group relative"
          onClick={onOpenProfile}
        >
          <img src={user.avatar} alt="Profile" className="w-full h-full object-cover rounded-[inherit]" />
          <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-[#0a0b0d] shadow-lg" />
        </div>
      </div>
    </div>
  );
};
