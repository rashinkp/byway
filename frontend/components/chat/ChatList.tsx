import React, { useState } from 'react';
import { EnhancedChatItem } from '@/types/chat';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MessageSquare, Search, ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/auth/useAuth';

interface ChatListProps {
  chats: EnhancedChatItem[];
  selectedChat: EnhancedChatItem | null;
  onSelectChat: (chat: EnhancedChatItem) => void;
  onSearch?: (query: string) => void;
}

export function ChatList({ chats, selectedChat, onSelectChat, onSearch }: ChatListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const { user } = useAuth();

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

  const getRoleBadgeColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'bg-red-50 text-red-700';
      case 'instructor':
        return 'bg-blue-50 text-blue-700';
      case 'user':
        return 'bg-green-50 text-green-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  // Separate new chats (type === 'user') and existing chats (type === 'chat')
  const newChats = chats.filter(chat => chat.type === 'user');
  const existingChats = chats.filter(chat => chat.type === 'chat');

  // Determine home path based on user role
  const getHomePath = () => {
    if (!user) return '/';
    if (user.role === 'ADMIN') return '/admin';
    if (user.role === 'INSTRUCTOR') return '/instructor';
    return '/';
  };

  return (
    <div className="flex flex-col h-full min-h-0 bg-white border-r border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 mr-1 rounded-full hover:bg-gray-100"
              onClick={() => router.back()}
              aria-label="Go back"
            >
              <ChevronLeft className="h-5 w-5 text-gray-700" />
            </Button>
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              Messages
              <Link
                href={getHomePath()}
                className="text-blue-600 font-bold text-base ml-2 px-2 py-0.5 hover:text-blue-700 transition-colors"
                style={{ letterSpacing: '0.5px' }}
              >
                Byway
              </Link>
            </h2>
          </div>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (onSearch) onSearch(e.target.value);
            }}
            className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {chats.length === 0 ? (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                <MessageSquare className="w-6 h-6 text-gray-400" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-1">No conversations</h3>
                <p className="text-sm text-gray-500">
                  {searchQuery ? 'No conversations match your search.' : 'Your conversations will appear here.'}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-2 space-y-6">
            {/* Existing Chats Section */}
            {existingChats.length > 0 && (
              <div>
                <div className="text-xs font-semibold text-gray-500 uppercase mb-2 pl-1">Conversations</div>
                <div className="space-y-1">
                  {existingChats.map((chat) => (
                    <div
                      key={chat.id}
                      onClick={() => onSelectChat(chat)}
                      className={`group relative p-3 cursor-pointer transition-colors duration-200 rounded-lg mb-1 ${
                        selectedChat?.id === chat.id 
                          ? 'bg-blue-50 border border-blue-200' 
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        {/* Avatar */}
                        <div className="relative flex-shrink-0">
                          <div className={`w-10 h-10 ${getRoleColor(chat.role)} rounded-full flex items-center justify-center text-white font-medium text-sm`}>
                            {(chat.displayName?.charAt(0) || '?').toUpperCase()}
                          </div>
                          {chat.type === 'chat' && (
                            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                          )}
                        </div>
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-medium text-gray-900 truncate text-sm">
                              {chat.displayName || 'Unknown User'}
                            </h3>
                            {chat.lastMessageTime && (
                              <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                                {chat.lastMessageTime}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-600 truncate flex-1 mr-2">
                              {chat.lastMessage || 'No messages yet'}
                            </p>
                            {typeof chat.unreadCount === 'number' && chat.unreadCount > 0 && (
                              <div className="flex-shrink-0 bg-blue-500 text-white text-xs font-medium px-2 py-0.5 rounded-full min-w-[18px] h-5 flex items-center justify-center">
                                {chat.unreadCount > 99 ? '99+' : chat.unreadCount}
                              </div>
                            )}
                          </div>
                          {/* Role Badge (hide for 'user') */}
                          {chat.role !== 'USER' && (
                            <div className="mt-2">
                              <Badge className={`text-xs px-2 py-0.5 ${getRoleBadgeColor(chat.role)} rounded-md`}>
                                {chat.role.charAt(0).toUpperCase() + chat.role.slice(1).toLowerCase()}
                              </Badge>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* New Chats Section */}
            {newChats.length > 0 && (
              <div>
                <div className="text-xs font-semibold text-gray-500 uppercase mb-2 pl-1">Start New Chat</div>
                <div className="space-y-1">
                  {newChats.map((chat) => (
                    <div
                      key={chat.id}
                      onClick={() => onSelectChat(chat)}
                      className={`group relative p-3 cursor-pointer transition-colors duration-200 rounded-lg mb-1  hover:bg-gray-50`}
                    >
                      <div className="flex items-center space-x-3">
                        {/* Avatar */}
                        <div className="relative flex-shrink-0">
                          <div className={`w-10 h-10 ${getRoleColor(chat.role)} rounded-full flex items-center justify-center text-white font-medium text-sm`}>
                            {(chat.displayName?.charAt(0) || '?').toUpperCase()}  
                          </div>
                        </div>
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-medium text-gray-900 truncate text-sm">
                              {chat.displayName || 'Unknown User'}
                            </h3>
                          </div>
                          <p className="text-sm text-gray-600 truncate flex-1 mr-2">Start a new conversation</p>
                          {/* Role Badge (hide for 'user') */}
                          {chat.role !== 'USER' && (
                            <div className="mt-2">
                              <Badge className={`text-xs px-2 py-0.5 ${getRoleBadgeColor(chat.role)} rounded-md`}>
                                {chat.role.charAt(0).toUpperCase() + chat.role.slice(1).toLowerCase()}
                              </Badge>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}