import React from 'react';
import { Chat } from '@/types/chat';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Clock } from 'lucide-react';

interface ChatListProps {
  chats: Chat[];
  selectedChat: Chat | null;
  onSelectChat: (chat: Chat) => void;
}

export function ChatList({ chats, selectedChat, onSelectChat }: ChatListProps) {
  const getRoleColor = (role: string) => {
    switch (role) {
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
    switch (role) {
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
      <div className="p-6 bg-white border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">Messages</h2>
        <p className="text-sm text-gray-500 mt-1">Chat with users</p>
      </div>

      <div className="flex-1 overflow-y-auto">
        {chats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => onSelectChat(chat)}
            className={`p-4 cursor-pointer transition-all duration-200 hover:bg-white border-b border-gray-100 ${
              selectedChat?.id === chat.id 
                ? 'bg-white border-l-4 border-l-blue-500 shadow-sm' 
                : 'bg-gray-50'
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className={`w-12 h-12 bg-gradient-to-br rounded-full flex items-center justify-center ${getRoleColor(chat.userRole)}`}>
                  <span className="font-semibold text-sm">
                    {(chat.userName?.charAt(0) || '?').toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-semibold text-gray-900 truncate">
                    {chat.userName || 'Unknown'}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-500">{chat.lastMessageTime}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 mb-2">
                  <Badge className={`text-xs px-2 py-1 ${getRoleBadgeColor(chat.userRole)}`}>
                    {chat.userRole
                      ? chat.userRole.charAt(0).toUpperCase() + chat.userRole.slice(1)
                      : 'Unknown'}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-700 truncate flex-1">
                    {chat.lastMessage}
                  </p>
                  
                  {chat.unreadCount > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="ml-2 flex-shrink-0 text-xs px-2 py-1 bg-red-500 hover:bg-red-600"
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
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-sm font-medium text-gray-900 mb-2">No conversations yet</h3>
            <p className="text-xs text-gray-500">
              Start a conversation with users
            </p>
          </div>
        </div>
      )}
    </div>
  );
} 