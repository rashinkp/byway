'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { ChatList } from '@/components/chat/ChatList';
import { ChatWindow } from '@/components/chat/ChatWindow';
import { Chat, Message, EnhancedChatItem, PaginatedChatList } from '@/types/chat';
import { useAuthStore } from '@/stores/auth.store';
import { Button } from '@/components/ui/button';
import { 
  MessageSquare, 
  Users, 
  Settings, 
  Search,
  Bell,
  Menu,
  X,
  Loader2,
  Wifi,
  WifiOff,
  Badge
} from 'lucide-react';
import {
  listUserChats,
  getMessagesByChat,
  joinChat,
  sendMessage as sendMessageSocket,
  createChat as createChatSocket,
} from '@/services/socketChat';

export default function ChatPage() {
  const user = useAuthStore((state) => state.user);
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const isLoading = useAuthStore((state) => state.isLoading);
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  
  const [chatItems, setChatItems] = useState<EnhancedChatItem[]>([]);
  const [selectedChat, setSelectedChat] = useState<EnhancedChatItem | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pendingMessage, setPendingMessage] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isConnected, setIsConnected] = useState(true);

  // Initialize auth if not already done
  useEffect(() => {
    if (!isInitialized && !isLoading) {
      initializeAuth();
    }
  }, [isInitialized, isLoading, initializeAuth]);

  // Fetch user chats on mount
  useEffect(() => {
    if (!user) return;
    if (!isInitialized) return;
    setLoading(true);
    try {
      listUserChats({ page: 1, limit: 10 }, (result: any) => {
        const chatData = result?.body?.data || result?.data || result;
        if (chatData && Array.isArray(chatData.items)) {
          setChatItems(chatData.items);
          setHasMore(chatData.hasMore || false);
          setCurrentPage(1);
          setLoading(false);
        } else {
          setLoading(false);
        }
      });
    } catch (error) {
      setLoading(false);
    }
  }, [user, isInitialized]);

  // Load more chats
  const loadMoreChats = useCallback(() => {
    if (!user || !hasMore || loading) return;
    
    setLoading(true);
    
    listUserChats({ page: currentPage + 1, limit: 10 }, (result: any) => {
      const chatData = result?.body?.data || result?.data || result;
      
      if (chatData && Array.isArray(chatData.items)) {
        setChatItems(prev => [...prev, ...chatData.items]);
        setHasMore(chatData.hasMore || false);
        setCurrentPage(currentPage + 1);
        setLoading(false);
      } else {
        setLoading(false);
      }
    });
  }, [user, hasMore, loading, currentPage]);

  // Fetch messages when selected chat changes
  useEffect(() => {
    if (!selectedChat) return;
    if (selectedChat.type === 'chat' && selectedChat.chatId) {
      joinChat(selectedChat.chatId);
      getMessagesByChat({ chatId: selectedChat.chatId }, (result: any) => {
        const msgs = result?.body?.data || result?.data || result;
        setMessages(Array.isArray(msgs) ? msgs : []);
      });
    } else {
      setMessages([]);
    }
  }, [selectedChat]);

  // Listen for new incoming messages
  useEffect(() => {
    const handleMessage = (msg: Message) => {
      if (msg.chatId === selectedChat?.chatId) {
        setMessages((prev) => prev.some(m => m.id === msg.id) ? prev : [...prev, msg]);
      };
    };
    import('@/lib/socket').then(({ default: socket }) => {
      socket.on('message', handleMessage);
      socket.on('connect', () => setIsConnected(true));
      socket.on('disconnect', () => setIsConnected(false));
      return () => {
        socket.off('message', handleMessage);
        socket.off('connect');
        socket.off('disconnect');
      };
    });
  }, [selectedChat]);

  // Send message handler
  const handleSendMessage = useCallback(
    (content: string) => {
      if (!user || !selectedChat) return;
      if (selectedChat.type === 'user') {
        // No chat exists, send message with userId (recipient)
        sendMessageSocket(
          {
            userId: selectedChat.userId, // recipient's userId
            content,
          },
          (msg: Message) => {
            // After first message, join the new chat room and update selectedChat
            if (msg.chatId) {
              joinChat(msg.chatId);
              // Update selectedChat to new chat type
              setSelectedChat((prev) => prev && prev.userId === msg.receiverId ? {
                ...prev,
                type: 'chat',
                chatId: msg.chatId,
                id: msg.chatId,
              } : prev);
              // Update chatItems to reflect the new chat type and chatId
              setChatItems((prev) => prev.map(item =>
                item.userId === msg.receiverId && item.type === 'user'
                  ? { ...item, type: 'chat', chatId: msg.chatId, id: msg.chatId }
                  : item
              ));
              // Re-fetch chat list and messages from backend for stability
              listUserChats({ page: 1, limit: 10 }, (result: any) => {
                const chatData = result?.body?.data || result?.data || result;
                if (chatData && Array.isArray(chatData.items)) {
                  setChatItems(chatData.items);
                  setHasMore(chatData.hasMore || false);
                  setCurrentPage(1);
                }
              });
              getMessagesByChat({ chatId: msg.chatId }, (result: any) => {
                const msgs = result?.body?.data || result?.data || result;
                setMessages(Array.isArray(msgs) ? msgs : []);
              });
            }
          },
          (err: any) => {
            alert(err?.message || 'Failed to send message');
          }
        );
        return;
      }
      // Existing chat
      sendMessageSocket(
        {
          chatId: selectedChat.chatId!,
          content,
        },
        (msg: Message) => {
          setMessages((prev) => prev.some(m => m.id === msg.id) ? prev : [...prev, msg]);
        },
        (err: any) => {
          alert(err?.message || 'Failed to send message');
        }
      );
    },
    [user, selectedChat]
  );

  // useEffect to send pending message after new chat is selected
  useEffect(() => {
    if (pendingMessage && selectedChat && selectedChat.type === 'chat' && selectedChat.chatId) {
      sendMessageSocket(
        {
          chatId: selectedChat.chatId,
          userId: selectedChat.userId, // recipient's userId
          content: pendingMessage,
        },
        (msg: Message) => {
          getMessagesByChat({ chatId: selectedChat.chatId }, (result: any) => {
            const msgs = result?.body?.data || result?.data || result;
            setMessages(Array.isArray(msgs) ? msgs : []);
          });
        },
        (err: any) => {
          alert(err?.message || 'Failed to send message');
        }
      );
      setPendingMessage(null);
    }
  }, [pendingMessage, selectedChat]);

  const handleSelectChat = (chat: EnhancedChatItem) => {
    setSelectedChat(chat);
    // Auto-close sidebar on mobile when chat is selected
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  if (!isInitialized || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto animate-pulse">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Loading Chat</h3>
            <p className="text-slate-600">Please wait while we set up your conversations...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 overflow-hidden">

      {/* Main Chat Interface */}
      <div className="w-full h-full flex items-stretch">
        <div className="w-full h-full bg-white/60 backdrop-blur-xl border border-slate-200/60 shadow-2xl shadow-slate-200/50 rounded-3xl overflow-hidden flex flex-col min-h-0">
          <div className="flex flex-1 min-h-0">
            {/* Chat List Sidebar */}
            <div className={`${
              isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            } md:relative md:translate-x-0 z-40 w-80 md:w-96 h-full transition-transform duration-300 ease-in-out md:transition-none`}>
              <ChatList 
                chats={chatItems}
                selectedChat={selectedChat}
                onSelectChat={handleSelectChat}
              />
              
              {/* Load More Button */}
              {hasMore && (
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white via-white to-transparent">
                  <Button 
                    onClick={loadMoreChats}
                    disabled={loading}
                    variant="outline"
                    className="w-full rounded-xl border-slate-200/60 hover:bg-slate-50 transition-all duration-200"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      'Load more conversations'
                    )}
                  </Button>
                </div>
              )}
            </div>
            
            {/* Mobile Overlay */}
            {isSidebarOpen && (
              <div 
                className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 md:hidden"
                onClick={() => setIsSidebarOpen(false)}
              />
            )}
            
            {/* Chat Window */}
            <div className="flex-1 flex flex-col h-full min-h-0">
              {selectedChat ? (
                <ChatWindow
                  chat={selectedChat}
                  messages={messages}
                  onSendMessage={handleSendMessage}
                  currentUserId={user?.id || ''}
                />
              ) : (
                <div className="flex-1 flex flex-col min-h-0">
                  <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-slate-50 to-white min-h-0">
                    <div className="text-center space-y-8 max-w-md px-8">
                      <div className="relative">
                        <div className="w-32 h-32 bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto shadow-2xl">
                          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                            <MessageSquare className="w-10 h-10 text-white" />
                          </div>
                        </div>
                        <div className="absolute -top-2 -right-2 w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center shadow-lg">
                          <Users className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h3 className="text-2xl font-bold text-slate-900">
                          Welcome to Chat
                        </h3>
                        <p className="text-slate-600 leading-relaxed text-lg">
                          Select a conversation from the sidebar to start chatting with your team members.
                        </p>
                        <div className="flex flex-wrap gap-2 justify-center pt-4">
                          <Badge className="bg-blue-100 text-blue-700 border-blue-200 px-3 py-1">
                            Real-time messaging
                          </Badge>
                          <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 px-3 py-1">
                            Secure & private
                          </Badge>
                          <Badge className="bg-purple-100 text-purple-700 border-purple-200 px-3 py-1">
                            Team collaboration
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}