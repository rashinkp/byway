import React from 'react';
import { Message as MessageType } from '@/types/chat';
import { Clock, Check, CheckCheck } from 'lucide-react';
import { EnhancedChatItem } from '@/types/chat';

interface MessageProps {
  message: MessageType;
  currentUserId: string;
  chat: EnhancedChatItem;
}

export function Message({ message, currentUserId, chat }: MessageProps) {
  const isMine = message.senderId === currentUserId;
  const displayName = isMine ? 'You' : chat.displayName;
  
  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'from-rose-500 to-pink-600';
      case 'instructor':
        return 'from-blue-500 to-indigo-600';
      case 'user':
        return 'from-emerald-500 to-teal-600';
      default:
        return 'from-slate-400 to-slate-500';
    }
  };

  return (
    <div className={`flex items-end space-x-3 mb-6 group ${isMine ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}>
      {/* Avatar - only show for other users */}
      {!isMine && (
        <div className="flex-shrink-0 mb-1">
          <div className={`w-8 h-8 bg-gradient-to-br ${getRoleColor(chat.role)} rounded-full flex items-center justify-center shadow-md ring-2 ring-white`}>
            <span className="font-bold text-white text-xs">
              {(chat.displayName?.charAt(0) || '?').toUpperCase()}
            </span>
          </div>
        </div>
      )}
      
      {/* Message Content */}
      <div className={`max-w-[70%] ${isMine ? 'items-end' : 'items-start'} flex flex-col`}>
        {/* Sender Name - only show for other users */}
        {!isMine && (
          <div className="mb-1 px-1">
            <span className="text-xs font-semibold text-slate-700">
              {displayName}
            </span>
          </div>
        )}
        
        {/* Message Bubble */}
        <div className={`relative rounded-2xl px-5 py-3 shadow-lg backdrop-blur-sm ${
          isMine 
            ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-br-md' 
            : 'bg-white/95 text-slate-900 border border-slate-200/60 rounded-bl-md'
        }`}>
          {/* Message Content */}
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>
          
          {/* Message Meta */}
          <div className={`flex items-center justify-end mt-2 pt-1 space-x-1 ${
            isMine ? 'text-blue-100' : 'text-slate-500'
          }`}>
            <Clock className="w-3 h-3" />
            <span className="text-xs font-medium">
              {message.timestamp}
            </span>
            
            {/* Read Status - only for sent messages */}
            {isMine && (
              <div className="ml-1">
                {/* {message?.status === 'read' ? (
                  <CheckCheck className="w-3 h-3 text-blue-200" />
                ) : (
                  <Check className="w-3 h-3 text-blue-300" />
                )} */}
              </div>
            )}
          </div>
          
          {/* Message Tail */}
          <div className={`absolute bottom-0 w-4 h-4 ${
            isMine 
              ? '-right-1 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-bl-full' 
              : '-left-1 bg-white/95 border-l border-b border-slate-200/60 rounded-br-full'
          }`}></div>
        </div>
        
        {/* Hover Actions */}
        <div className={`opacity-0 group-hover:opacity-100 transition-opacity duration-200 mt-1 flex items-center space-x-2 ${
          isMine ? 'flex-row-reverse space-x-reverse' : 'flex-row'
        }`}>
          <button className="text-xs text-slate-400 hover:text-slate-600 transition-colors duration-200 px-2 py-1 rounded-full hover:bg-slate-100">
            Reply
          </button>
          <button className="text-xs text-slate-400 hover:text-slate-600 transition-colors duration-200 px-2 py-1 rounded-full hover:bg-slate-100">
            React
          </button>
          {isMine && (
            <button className="text-xs text-slate-400 hover:text-slate-600 transition-colors duration-200 px-2 py-1 rounded-full hover:bg-slate-100">
              Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
}