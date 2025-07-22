import React, { useState } from 'react';
import { EnhancedChatItem } from '@/types/chat';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { MessageSquare, Search, Image as ImageIcon, Mic } from 'lucide-react';

interface ChatListProps {
  chats: EnhancedChatItem[];
  selectedChat: EnhancedChatItem | null;
  onSelectChat: (chat: EnhancedChatItem) => void;
  onSearch?: (query: string) => void;
}

export function ChatList({ chats, selectedChat, onSelectChat, onSearch }: ChatListProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Separate new chats (type === 'user') and existing chats (type === 'chat')
  const newChats = chats.filter(chat => chat.type === 'user');
  const existingChats = chats.filter(chat => chat.type === 'chat');

  return (
    <div className="flex max-h-[calc(100vh-4rem)] flex-col h-full min-h-0 border-r border-gray-200 dark:border-white/10 bg-white dark:bg-[#18181b] transition-colors duration-300">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-white/10">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (onSearch) onSearch(e.target.value);
            }}
            className="pl-10 bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-[#facc15]/20 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#facc15] focus:border-[#facc15] rounded-lg transition-all duration-200"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {chats.length === 0 ? (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-[#facc15]/10 rounded-full flex items-center justify-center mx-auto">
                <MessageSquare className="w-6 h-6 text-[#facc15]" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-[#facc15] mb-1">
                  No conversations
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {searchQuery
                    ? "No conversations match your search."
                    : "Your conversations will appear here."}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-3 space-y-6">
            {/* Existing Chats Section */}
            {existingChats.length > 0 && (
              <div>
                <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-3 pl-2 tracking-wide">
                  Conversations
                </div>
                <div className="space-y-1">
                  {existingChats.map((chat) => (
                    <div
                      key={chat.id}
                      onClick={() => onSelectChat(chat)}
                      className={`group relative p-3 cursor-pointer transition-all duration-200 rounded-xl hover:bg-gray-100 dark:hover:bg-[#facc15]/5 ${
                        selectedChat?.id === chat.id
                          ? "bg-[#facc15]/10 dark:bg-[#facc15]/10 border-l-4 border-[#facc15]"
                          : "border-l-4 border-transparent"
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        {/* Avatar */}
                        <div className="relative flex-shrink-0">
                          <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center font-medium text-sm text-gray-700 dark:text-gray-200 shadow-sm">
                            {(chat.displayName?.charAt(0) || "?").toUpperCase()}
                          </div>
                          <div
                            className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-[#18181b] ${
                              chat.isOnline ? "bg-green-400" : "bg-gray-400"
                            }`}
                          />
                        </div>
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                              {chat.displayName || "Unknown User"}
                            </h3>
                            {chat.lastMessageTime && (
                              <span className="text-xs text-gray-500 dark:text-gray-400 ml-2 flex-shrink-0">
                                {chat.lastMessageTime}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-600 dark:text-gray-300 truncate flex-1 mr-2">
                              {chat.lastMessage?.imageUrl ? (
                                <span className="flex items-center gap-1">
                                  <ImageIcon className="w-4 h-4 inline text-[#facc15]" />{" "}
                                  Photo
                                </span>
                              ) : chat.lastMessage?.audioUrl ? (
                                <span className="flex items-center gap-1">
                                  <Mic className="w-4 h-4 inline text-[#facc15]" />{" "}
                                  Audio
                                </span>
                              ) : chat.lastMessage?.content ? (
                                chat.lastMessage.content
                              ) : (
                                "No messages yet"
                              )}
                            </p>
                            {(chat.unreadCount ?? 0) > 0 && (
                              <span className="ml-2 bg-[#facc15] text-black rounded-full px-2 py-0.5 text-xs font-medium">
                                {chat.unreadCount}
                              </span>
                            )}
                          </div>
                          {/* Role Badge (hide for 'user') */}
                          {chat.role !== "USER" && (
                            <div className="mt-2">
                              <Badge className="text-xs px-2 py-0.5 bg-[#facc15]/10 text-[#facc15] rounded-md">
                                {chat.role.charAt(0).toUpperCase() +
                                  chat.role.slice(1).toLowerCase()}
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
                <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-3 pl-2 tracking-wide">
                  Start New Chat
                </div>
                <div className="space-y-1">
                  {newChats.map((chat) => (
                    <div
                      key={chat.id}
                      onClick={() => onSelectChat(chat)}
                      className="group relative p-3 cursor-pointer transition-all duration-200 rounded-xl hover:bg-gray-100 dark:hover:bg-[#facc15]/5 border-l-4 border-transparent"
                    >
                      <div className="flex items-center space-x-4">
                        {/* Avatar */}
                        <div className="relative flex-shrink-0">
                          <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center font-medium text-sm text-gray-700 dark:text-gray-200 shadow-sm">
                            {(chat.displayName?.charAt(0) || "?").toUpperCase()}
                          </div>
                          <div
                            className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-[#18181b] ${
                              chat.isOnline ? "bg-green-400" : "bg-gray-400"
                            }`}
                          />
                        </div>
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                              {chat.displayName || "Unknown User"}
                            </h3>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-300 truncate flex-1 mr-2">
                            Start a new conversation
                          </p>
                          {/* Role Badge (hide for 'user') */}
                          {chat.role !== "USER" && (
                            <div className="mt-2">
                              <Badge className="text-xs px-2 py-0.5 bg-[#facc15]/10 text-[#facc15] rounded-md">
                                {chat.role.charAt(0).toUpperCase() +
                                  chat.role.slice(1).toLowerCase()}
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