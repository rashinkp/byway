'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { ChatList } from '@/components/chat/ChatList';
import { ChatWindow } from '@/components/chat/ChatWindow';
import { Chat, Message, EnhancedChatItem, PaginatedChatList } from '@/types/chat';
import { useAuthStore } from '@/stores/auth.store';
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
      return () => socket.off('message', handleMessage);
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
            }
            setMessages((prev) => prev.some(m => m.id === msg.id) ? prev : [...prev, msg]);
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

  // Manual test function
  const handleTestFetchChats = useCallback(() => {
    if (!user) {
      return;
    }
    listUserChats({ page: 1, limit: 10 }, (result: any) => {
      const chatData = result?.body?.data || result?.data || result;
      
      if (chatData && Array.isArray(chatData.items)) {
        setChatItems(chatData.items);
        setHasMore(chatData.hasMore || false);
      } else {
      }
    });
  }, [user]);

  // Test socket connection
  const handleTestSocketConnection = useCallback(() => {
    import('@/lib/socket').then(({ default: socket }) => {
      if (!socket.connected) {
        socket.connect();
      }
    });
  }, []);

  return (
    <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm rounded-xl overflow-hidden">
        <div className="flex h-[600px]">
          {/* Chat List Sidebar */}
          <div className="w-1/3 border-r border-gray-200 bg-gray-50/50">
            <ChatList 
              chats={chatItems}
              selectedChat={selectedChat}
              onSelectChat={setSelectedChat}
            />
            {hasMore && (
              <div className="p-3 border-t border-gray-200">
                <button 
                  onClick={loadMoreChats}
                  disabled={loading}
                  className="w-full px-3 py-1.5 text-xs text-gray-600 hover:text-gray-800 disabled:opacity-50"
                >
                  {loading ? 'Loading more...' : 'Show more'}
                </button>
              </div>
            )}
          </div>
          
          {/* Chat Window */}
          <div className="flex-1 flex flex-col">
            {selectedChat ? (
              <ChatWindow
                chat={selectedChat}
                messages={messages}
                onSendMessage={handleSendMessage}
                currentUserId={user?.id || ''}
              />
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a conversation</h3>
                  <p className="text-gray-500">Choose a chat from the list to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 