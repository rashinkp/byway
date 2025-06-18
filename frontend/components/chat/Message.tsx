import React from 'react';
import { Message as MessageType } from '@/types/chat';
import { Clock } from 'lucide-react';
import { EnhancedChatItem } from '@/types/chat';

interface MessageProps {
  message: MessageType;
  currentUserId: string;
  chat: EnhancedChatItem;
}

export function Message({ message, currentUserId, chat }: MessageProps) {
  const isMine = message.senderId === currentUserId;
  const displayName = isMine ? 'You' : chat.displayName;
  return (
    <div className={`flex mb-6 ${isMine ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[70%] ${isMine ? 'order-2' : 'order-1'}`}>
        <div className={`rounded-2xl px-4 py-3 ${isMine ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-900'} shadow-md`}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium">
              {displayName}
            </span>
            <span className="text-xs text-gray-400">{message.timestamp}</span>
          </div>
          <p className="text-sm leading-relaxed">{message.content}</p>
        </div>
      </div>
    </div>
  );
} 