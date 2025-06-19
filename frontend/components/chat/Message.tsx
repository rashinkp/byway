import React from 'react';
import { Message as MessageType } from '@/types/chat';
import { EnhancedChatItem } from '@/types/chat';

interface MessageProps {
  message: MessageType;
  currentUserId: string;
  chat: EnhancedChatItem;
}

export function Message({ message, currentUserId, chat }: MessageProps) {
  const isMine = message.senderId === currentUserId;
  
  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'bg-red-500';
      case 'instructor':
        return 'bg-blue-500';
      case 'user':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  function formatTime(dateString: string) {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  }

  return (
    <div className={`flex items-start space-x-2 ${isMine ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}>
      {/* Avatar - only show for other users */}
      {!isMine && (
        <div className="flex-shrink-0">
          <div className={`w-8 h-8 ${getRoleColor(chat.role)} rounded-full flex items-center justify-center text-white font-medium text-xs`}>
            {(chat.displayName?.charAt(0) || '?').toUpperCase()}
          </div>
        </div>
      )}
      
      {/* Message Content */}
      <div className={`max-w-[70%] ${isMine ? 'items-end' : 'items-start'} flex flex-col`}>
        {/* Sender Name - only show for other users */}
        {!isMine && (
          <div className="mb-1 px-1">
            <span className="text-xs font-medium text-gray-700">
              {chat.displayName || 'Unknown User'}
            </span>
          </div>
        )}
        
        {/* Message Bubble */}
        <div className={`px-4 py-2 rounded-2xl max-w-full ${
          isMine 
            ? 'bg-blue-500 text-white rounded-br-md' 
            : 'bg-white border border-gray-200 text-gray-900 rounded-bl-md'
        }`}>
          <p className="text-sm whitespace-pre-wrap break-words">
            {message.content}
          </p>
          
          {/* Timestamp */}
          <div className={`text-xs mt-1 ${
            isMine ? 'text-blue-100' : 'text-gray-500'
          }`}>
            {formatTime(message.timestamp)}
          </div>
        </div>
      </div>
    </div>
  );
}