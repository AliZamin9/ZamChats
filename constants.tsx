
import React from 'react';
import { Server, UserProfile } from './types';

export const INITIAL_USER: UserProfile = {
  id: 'user-1',
  name: 'PlayerOne',
  bio: 'Just a casual gamer looking for teammates.',
  avatar: 'https://picsum.photos/seed/player1/200',
  status: 'online'
};

export const MOCK_SERVERS: Server[] = [
  {
    id: 'server-1',
    name: 'Nexus Prime',
    icon: '🚀',
    channels: [
      { id: 'c1', name: 'general', type: 'text', description: 'General gaming talk' },
      { id: 'c2', name: 'voice-lounge', type: 'voice' },
      { id: 'c3', name: 'announcements', type: 'text' }
    ]
  },
  {
    id: 'server-2',
    name: 'RPG Guild',
    icon: '⚔️',
    channels: [
      { id: 'c4', name: 'quest-log', type: 'text' },
      { id: 'c5', name: 'raid-comms', type: 'voice' }
    ]
  }
];

export const MOCK_MESSAGES = [
  {
    id: 'm1',
    senderId: 'ai-1',
    senderName: 'NexusBot',
    content: 'Welcome to Nexus Gaming Hub! Ready to start a match?',
    timestamp: new Date(),
    type: 'text' as const
  }
];
