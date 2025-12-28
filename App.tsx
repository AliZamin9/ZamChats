
import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { ChannelList } from './components/ChannelList';
import { ChatArea } from './components/ChatArea';
import { VoiceChannel } from './components/VoiceChannel';
import { ProfileModal } from './components/ProfileModal';
import { MOCK_SERVERS, INITIAL_USER } from './constants';
import { Server, UserProfile, Channel } from './types';

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [activeServerId, setActiveServerId] = useState<string>(MOCK_SERVERS[0].id);
  const [activeChannelId, setActiveChannelId] = useState<string>(MOCK_SERVERS[0].channels[0].id);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  // Mobile UI States
  const [navOpen, setNavOpen] = useState(false); // Controls Sidebar + ChannelList drawer

  const activeServer = MOCK_SERVERS.find(s => s.id === activeServerId) || MOCK_SERVERS[0];
  const activeChannel = activeServer.channels.find(c => c.id === activeChannelId) || activeServer.channels[0];

  const handleServerSelect = (id: string) => {
    setActiveServerId(id);
    const server = MOCK_SERVERS.find(s => s.id === id);
    if (server) setActiveChannelId(server.channels[0].id);
  };

  const handleChannelSelect = (id: string) => {
    setActiveChannelId(id);
    setNavOpen(false); // Close drawer on selection
  };

  const handleUpdateProfile = (updated: Partial<UserProfile>) => {
    setUser(prev => ({ ...prev, ...updated }));
  };

  return (
    <div className="flex h-screen bg-[#0a0b0d] select-none overflow-hidden relative">
      {/* Decorative background shapes (3D Isometric effect) */}
      <div className="absolute top-[-5%] left-[-10%] w-64 h-64 bg-indigo-500/10 blur-[100px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-80 h-80 bg-pink-500/10 blur-[120px] rounded-full animate-pulse [animation-delay:2s]" />

      {/* Mobile Drawer Backdrop */}
      {navOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 lg:hidden transition-opacity duration-300"
          onClick={() => setNavOpen(false)}
        />
      )}

      {/* Navigation Layer (Sidebar + ChannelList) */}
      <div className={`fixed inset-y-0 left-0 flex z-40 transition-transform duration-500 ease-out lg:relative lg:translate-x-0 ${
        navOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <Sidebar 
          servers={MOCK_SERVERS} 
          activeServerId={activeServerId} 
          onServerSelect={handleServerSelect}
          user={user}
          onOpenProfile={() => setIsProfileOpen(true)}
        />
        <ChannelList 
          server={activeServer} 
          activeChannelId={activeChannelId}
          onChannelSelect={handleChannelSelect}
        />
      </div>
      
      {/* Content Layer */}
      <div className="flex-1 flex flex-col h-screen relative z-0">
        {/* Mobile Header Toggle */}
        <div className="lg:hidden absolute top-0 left-0 right-0 h-16 px-4 flex items-center z-20 pointer-events-none">
           <button 
             onClick={() => setNavOpen(true)}
             className="w-10 h-10 flex items-center justify-center glass-panel rounded-xl neo-float pointer-events-auto active:scale-90 transition-transform"
           >
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
             </svg>
           </button>
        </div>

        {activeChannel.type === 'text' ? (
          <ChatArea channel={activeChannel} user={user} />
        ) : (
          <VoiceChannel 
            channel={activeChannel} 
            user={user} 
            onLeave={() => setActiveChannelId(activeServer.channels.find(c => c.type === 'text')?.id || '')} 
          />
        )}
      </div>

      {isProfileOpen && (
        <ProfileModal 
          user={user} 
          onClose={() => setIsProfileOpen(false)} 
          onUpdate={handleUpdateProfile} 
        />
      )}
    </div>
  );
};

export default App;
