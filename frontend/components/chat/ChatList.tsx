import React from 'react';
import { EnhancedChatItem } from '@/types/chat';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Clock, User, Search, Settings, MoreHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface ChatListProps {
  chats: EnhancedChatItem[];
  selectedChat: EnhancedChatItem | null;
  onSelectChat: (chat: EnhancedChatItem) => void;
}

export function ChatList({ chats, selectedChat, onSelectChat }: ChatListProps) {
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

  const getRoleBadgeColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'instructor':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'user':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStatusIndicator = (chat: EnhancedChatItem) => {
    if (chat.type === 'user') return null;
    
    return (
      <div className="flex items-center space-x-1">
        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
        <span className="text-xs text-emerald-600 font-medium">Online</span>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-slate-50 to-white border-r border-slate-200/60 backdrop-blur-xl">
      {/* Header */}
      <div className="p-6 bg-white/90 backdrop-blur-sm border-b border-slate-200/50">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Messages
            </h2>
            <p className="text-sm text-slate-500 font-medium">Stay connected with your team</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="w-9 h-9 p-0 hover:bg-slate-100">
              <Settings className="w-4 h-4 text-slate-600" />
            </Button>
            <Button variant="ghost" size="sm" className="w-9 h-9 p-0 hover:bg-slate-100">
              <MoreHorizontal className="w-4 h-4 text-slate-600" />
            </Button>
          </div>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input
            placeholder="Search conversations..."
            className="pl-10 bg-slate-50/80 border-slate-200/60 focus:bg-white focus:border-slate-300 transition-all duration-200 rounded-xl"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
        <div className="p-3 space-y-1">
          {chats.map((chat, index) => (
            <div
              key={chat.id}
              onClick={() => onSelectChat(chat)}
              className={`group relative p-4 cursor-pointer transition-all duration-300 rounded-2xl hover:shadow-lg hover:shadow-slate-200/50 ${
                selectedChat?.id === chat.id 
                  ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200/60 shadow-lg shadow-blue-200/30' 
                  : 'bg-white/60 hover:bg-white/90 border border-slate-200/40'
              } fadeInUp`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center space-x-4">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div className={`w-12 h-12 bg-gradient-to-br ${getRoleColor(chat.role)} rounded-2xl flex items-center justify-center shadow-lg ring-2 ring-white`}>
                    <span className="font-bold text-white text-sm">
                      {(chat.displayName?.charAt(0) || '?').toUpperCase()}
                    </span>
                  </div>
                  {chat.type === 'chat' && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className={`font-semibold truncate transition-colors ${
                      selectedChat?.id === chat.id ? 'text-slate-900' : 'text-slate-800 group-hover:text-slate-900'
                    }`}>
                      {chat.displayName || 'Unknown User'}
                    </h3>
                    {chat.type === 'chat' && chat.lastMessageTime && (
                      <span className="text-xs text-slate-500 font-medium ml-2 flex-shrink-0">
                        {chat.lastMessageTime}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <p className={`text-sm truncate flex-1 mr-2 ${
                      selectedChat?.id === chat.id ? 'text-slate-600' : 'text-slate-500'
                    }`}>
                      {chat.type === 'chat' ? (chat.lastMessage || 'No messages yet') : 'Start a new conversation'}
                    </p>
                    
                    {chat.type === 'chat' && chat.unreadCount && chat.unreadCount > 0 && (
                      <div className="flex-shrink-0 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs font-bold px-2 py-1 rounded-full min-w-[20px] h-5 flex items-center justify-center shadow-lg">
                        {chat.unreadCount > 99 ? '99+' : chat.unreadCount}
                      </div>
                    )}
                  </div>
                  
                  {/* Role Badge and Status */}
                  <div className="flex items-center justify-between mt-2">
                    <Badge className={`text-xs px-2 py-1 border ${getRoleBadgeColor(chat.role)} rounded-lg font-medium`}>
                      {chat.role.charAt(0).toUpperCase() + chat.role.slice(1).toLowerCase()}
                    </Badge>
                    {getStatusIndicator(chat)}
                  </div>
                </div>
              </div>
              
              {/* Hover Effect */}
              <div className={`absolute inset-0 rounded-2xl transition-opacity duration-300 ${
                selectedChat?.id === chat.id 
                  ? 'bg-gradient-to-r from-blue-500/5 to-indigo-500/5' 
                  : 'bg-gradient-to-r from-slate-500/5 to-slate-500/5 opacity-0 group-hover:opacity-100'
              }`}></div>
            </div>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {chats.length === 0 && (
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center mx-auto">
              <MessageSquare className="w-8 h-8 text-slate-400" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">No conversations yet</h3>
              <p className="text-sm text-slate-500 max-w-sm">
                Your conversations will appear here. Start connecting with your team members.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}