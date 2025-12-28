
export interface UserProfile {
  id: string;
  name: string;
  bio: string;
  avatar: string;
  status: 'online' | 'idle' | 'dnd' | 'offline';
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'image' | 'video';
  mediaUrl?: string;
}

export interface Channel {
  id: string;
  name: string;
  type: 'text' | 'voice';
  description?: string;
}

export interface Server {
  id: string;
  name: string;
  icon: string;
  channels: Channel[];
}
