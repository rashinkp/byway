import React from 'react';
import { EnhancedChatItem } from '@/types/chat';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Clock, User } from 'lucide-react';

interface ChatListProps {
  chats: EnhancedChatItem[];
  selectedChat: EnhancedChatItem | null;
  onSelectChat: (chat: EnhancedChatItem) => void;
}

export function ChatList({ chats, selectedChat, onSelectChat }: ChatListProps) {
  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'from-red-100 to-red-200 text-red-600';
      case 'instructor':
        return 'from-blue-100 to-blue-200 text-blue-600';
      case 'user':
        return 'from-green-100 to-green-200 text-green-600';
      default:
        return 'from-gray-100 to-gray-200 text-gray-600';
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'instructor':
        return 'bg-blue-100 text-blue-800';
      case 'user':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="p-4 bg-white border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
        <p className="text-xs text-gray-500 mt-1">Chat with users</p>
      </div>

      <div className="flex-1 overflow-y-auto">
        {chats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => onSelectChat(chat)}
            className={`p-3 cursor-pointer transition-all duration-200 hover:bg-white border-b border-gray-100 ${
              selectedChat?.id === chat.id 
                ? 'bg-white border-l-4 border-l-blue-500 shadow-sm' 
                : 'bg-gray-50'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className={`w-10 h-10 bg-gradient-to-br rounded-full flex items-center justify-center ${getRoleColor(chat.role)}`}>
                  <span className="font-semibold text-sm">
                    {(chat.displayName?.charAt(0) || '?').toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-semibold text-gray-900 truncate">
                    {chat.displayName || 'Unknown'}
                  </h3>
                  <div className="flex items-center space-x-2">
                    {chat.type === 'chat' && chat.lastMessageTime && (
                      <>
                        <Clock className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-500">{chat.lastMessageTime}</span>
                      </>
                    )}
                    {chat.type === 'user' && (
                      <User className="w-3 h-3 text-gray-400" />
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2 mb-1">
                  <Badge className={`text-xs px-2 py-0.5 ${getRoleBadgeColor(chat.role)}`}>
                    {chat.role.charAt(0).toUpperCase() + chat.role.slice(1).toLowerCase()}
                  </Badge>
                  {chat.type === 'user' && (
                    <Badge className="text-xs px-2 py-0.5 bg-gray-100 text-gray-800">
                      New Chat
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-700 truncate flex-1">
                    {chat.type === 'chat' ? (chat.lastMessage || 'No messages yet') : 'Click to start a conversation'}
                  </p>
                  
                  {chat.type === 'chat' && chat.unreadCount && chat.unreadCount > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="ml-2 flex-shrink-0 text-xs px-1.5 py-0.5 bg-red-500 hover:bg-red-600"
                    >
                      {chat.unreadCount}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {chats.length === 0 && (
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <MessageSquare className="w-10 h-10 text-gray-400 mx-auto mb-3" />
            <h3 className="text-sm font-medium text-gray-900 mb-1">No conversations yet</h3>
            <p className="text-xs text-gray-500">
              Start a conversation with users
            </p>
          </div>
        </div>
      )}
    </div>
  );
} 