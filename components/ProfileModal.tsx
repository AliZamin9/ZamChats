
import React, { useState } from 'react';
import { UserProfile } from '../types';

interface ProfileModalProps {
  user: UserProfile;
  onClose: () => void;
  onUpdate: (updated: Partial<UserProfile>) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ user, onClose, onUpdate }) => {
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio);
  const [avatar, setAvatar] = useState(user.avatar);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({ name, bio, avatar });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-[#0a0b0d] animate-in slide-in-from-bottom duration-500">
      {/* Background Decor */}
      <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-indigo-600/20 to-transparent pointer-events-none" />
      
      <div className="relative px-6 pt-12 pb-6 flex items-center justify-between z-10">
        <button onClick={onClose} className="w-12 h-12 flex items-center justify-center glass-panel rounded-2xl neo-card text-white/60">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
           </svg>
        </button>
        <h2 className="text-white font-black text-xl uppercase tracking-widest">Interface Settings</h2>
        <div className="w-12 h-12" /> {/* spacer */}
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-8 z-10 hide-scrollbar">
        <div className="flex flex-col items-center">
          <div className="relative group">
             <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-[2.5rem] glass-panel border border-white/20 neo-card overflow-hidden transition-transform active:scale-95 group shadow-2xl">
                <img src={avatar} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-indigo-900/40 opacity-0 group-active:opacity-100 flex items-center justify-center transition-opacity">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                   </svg>
                </div>
             </div>
             <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-indigo-500 rounded-2xl flex items-center justify-center text-white neo-card border border-white/20">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
               </svg>
             </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="glass-panel neo-inset rounded-[2.5rem] p-6 lg:p-10 space-y-8 border-white/5">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] px-2">Identification Code</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 text-white focus:ring-2 focus:ring-indigo-500/30 outline-none font-bold tracking-wide"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] px-2">Neural Bio-Data</label>
              <textarea 
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 text-white focus:ring-2 focus:ring-indigo-500/30 outline-none font-medium resize-none leading-relaxed"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] px-2">Avatar URL Protocol</label>
              <input 
                type="text" 
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 text-white/40 focus:text-white focus:ring-2 focus:ring-indigo-500/30 outline-none font-mono text-xs"
              />
            </div>
          </div>

          <div className="pt-4 flex flex-col space-y-4">
            <button 
              type="submit"
              className="w-full py-5 bg-indigo-600 rounded-[2rem] text-white font-black uppercase tracking-[0.3em] neo-card shadow-[0_0_40px_rgba(99,102,241,0.4)] active:scale-95 transition-all"
            >
              Sync Uplink
            </button>
            <button 
              type="button"
              onClick={onClose}
              className="w-full py-4 text-[#949ba4] font-bold uppercase tracking-widest text-sm hover:text-white transition-colors"
            >
              Discard Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
