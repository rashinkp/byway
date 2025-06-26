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
import socket from '@/lib/socket';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingMoreMessages, setLoadingMoreMessages] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Track previous chatId for leave logic
  const previousChatIdRef = React.useRef<string | null>(null);

  // Initialize auth if not already done
  useEffect(() => {
    if (!isInitialized && !isLoading) {
      initializeAuth();
    }
  }, [isInitialized, isLoading, initializeAuth]);

  // Fetch user chats on mount and when searchQuery changes
  useEffect(() => {
    if (!user) return;
    if (!isInitialized) return;
    setLoading(true);
    try {
      listUserChats({ page: 1, limit: 10, search: searchQuery }, (result: any) => {
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
  }, [user, isInitialized, searchQuery]);

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

  // Fetch messages when selected chat changes (paginated)
  useEffect(() => {
    if (!selectedChat) return;
    if (selectedChat.type === 'chat' && selectedChat.chatId) {
      joinChat(selectedChat.chatId);
      getMessagesByChat({ chatId: selectedChat.chatId, limit: 20 }, (result: any) => {
        const msgs = result?.body?.data || result?.data || result;
        setMessages(Array.isArray(msgs) ? msgs.slice().reverse() : []);
        setHasMoreMessages(Array.isArray(msgs) && msgs.length === 20);
      });
    } else {
      setMessages([]);
      setHasMoreMessages(false);
    }
  }, [selectedChat]);

  // Load more (older) messages
  const handleLoadMoreMessages = useCallback(() => {
    if (!selectedChat || !selectedChat.chatId || loadingMoreMessages || !messages.length) return;
    setLoadingMoreMessages(true);
    const oldestMessageId = messages[0]?.id;
    getMessagesByChat({ chatId: selectedChat.chatId, limit: 20, beforeMessageId: oldestMessageId }, (result: any) => {
      const msgs = result?.body?.data || result?.data || result;
      if (Array.isArray(msgs) && msgs.length > 0) {
        setMessages(prev => {
          const newMsgs = msgs.reverse();
          const existingIds = new Set(prev.map(m => m.id));
          const uniqueNewMsgs = newMsgs.filter(m => !existingIds.has(m.id));
          return [...uniqueNewMsgs, ...prev];
        });
        setHasMoreMessages(msgs.length === 20);
      } else {
        setHasMoreMessages(false);
      }
      setLoadingMoreMessages(false);
    });
  }, [selectedChat, messages, loadingMoreMessages]);

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
    // Leave previous chat room if any
    if (previousChatIdRef.current && previousChatIdRef.current !== chat.chatId) {
      socket.emit('leave', previousChatIdRef.current);
    }
    // Join new chat room
    if (chat.type === 'chat' && chat.chatId) {
      socket.emit('join', chat.chatId);
      previousChatIdRef.current = chat.chatId;
    }
    setSelectedChat(chat);
    // Auto-close sidebar on mobile when chat is selected
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  const handleDeleteMessage = useCallback((messageId: string) => {
    if (selectedChat && selectedChat.type === 'chat' && selectedChat.chatId) {
      getMessagesByChat({ chatId: selectedChat.chatId }, (result: any) => {
        const msgs = result?.body?.data || result?.data || result;
        setMessages(Array.isArray(msgs) ? msgs : []);
      });
      // Refresh chat list as well
      listUserChats({ page: 1, limit: 10, search: searchQuery }, (result: any) => {
        const chatData = result?.body?.data || result?.data || result;
        if (chatData && Array.isArray(chatData.items)) {
          setChatItems(chatData.items);
          setHasMore(chatData.hasMore || false);
          setCurrentPage(1);
        }
      });
    }
  }, [selectedChat, searchQuery]);

  useEffect(() => {
    function handleChatListUpdated() {
      console.log('[Frontend] Received chatListUpdated event, refetching chat list...');
      listUserChats({ page: 1, limit: 10, search: searchQuery }, (result: any) => {
        const chatData = result?.body?.data || result?.data || result;
        if (chatData && Array.isArray(chatData.items)) {
          setChatItems(chatData.items);
          setHasMore(chatData.hasMore || false);
          setCurrentPage(1);
        }
      });
    }
    socket.on('chatListUpdated', handleChatListUpdated);
    return () => {
      socket.off('chatListUpdated', handleChatListUpdated);
    };
  }, [searchQuery]);

  // Restore handleSendMessage function
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
          // Do not update chatItems here; rely on chatListUpdated event to refetch from backend
        },
        (err: any) => {
          alert(err?.message || 'Failed to send message');
        }
      );
    },
    [user, selectedChat]
  );

  useEffect(() => {
    if (!user) return;
    const handleConnect = () => {
      console.log('[Frontend] Joining userId room:', user.id);
      socket.emit('join', user.id);
    };
    socket.on('connect', handleConnect);
    // If already connected, join immediately
    if (socket.connected) {
      handleConnect();
    }
    return () => {
      socket.off('connect', handleConnect);
    };
  }, [user]);

  // Responsive mobile detection
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
            {/* Chat List Sidebar (show on mobile only if sidebar is open and no chat selected) */}
            {((isSidebarOpen && (!selectedChat || !isMobile)) || (!selectedChat && isMobile)) && (
              <div className={`$${
                isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
              } md:relative md:translate-x-0 z-40 ${isMobile && !selectedChat ? 'w-full' : 'w-80 md:w-96'} h-full transition-transform duration-300 ease-in-out md:transition-none`}>
                <ChatList 
                  chats={chatItems}
                  selectedChat={selectedChat}
                  onSelectChat={handleSelectChat}
                  onSearch={setSearchQuery}
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
            )}
            {/* Mobile Overlay */}
            {isSidebarOpen && !selectedChat && (
              <div 
                className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 md:hidden"
                onClick={() => setIsSidebarOpen(false)}
              />
            )}
            {/* Chat Window (show on mobile only if a chat is selected) */}
            {selectedChat && (!isMobile || (isMobile && !isSidebarOpen)) && (
              <div className="flex-1 flex flex-col h-full min-h-0">
                <ChatWindow
                  chat={selectedChat}
                  messages={messages}
                  onSendMessage={handleSendMessage}
                  currentUserId={user?.id || ''}
                  onDeleteMessage={handleDeleteMessage}
                  onLoadMoreMessages={hasMoreMessages ? handleLoadMoreMessages : undefined}
                  loadingMoreMessages={loadingMoreMessages}
                  showBackButton={isMobile}
                  onBack={() => {
                    setIsSidebarOpen(true);
                    setSelectedChat(null);
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}