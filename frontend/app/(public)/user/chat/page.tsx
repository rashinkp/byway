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
} from '@/services/socketChat';

console.log('[UserChatPage] Module loaded');

export default function ChatPage() {
  console.log('[UserChatPage] Component function called');
  
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

  console.log('[UserChatPage] Component rendered, user:', user, 'isInitialized:', isInitialized, 'isLoading:', isLoading);

  // Initialize auth if not already done
  useEffect(() => {
    console.log('[UserChatPage] Checking auth initialization...');
    if (!isInitialized && !isLoading) {
      console.log('[UserChatPage] Initializing auth...');
      initializeAuth();
    }
  }, [isInitialized, isLoading, initializeAuth]);

  // Log user data
  useEffect(() => {
    console.log('[UserChatPage] User data changed:', user);
  }, [user]);

  // Fetch user chats on mount
  useEffect(() => {
    console.log('[UserChatPage] useEffect for fetching chats triggered, user:', user, 'isInitialized:', isInitialized);
    
    if (!user) {
      console.log('[UserChatPage] No user found, skipping chat fetch');
      return;
    }
    
    if (!isInitialized) {
      console.log('[UserChatPage] Auth not initialized yet, skipping chat fetch');
      return;
    }
    
    console.log('[UserChatPage] Fetching chats for current user');
    setLoading(true);
    
    try {
      listUserChats({ page: 1, limit: 10 }, (result: any) => {
        console.log('[UserChatPage] Received chat list from backend:', result);
        
        // Handle the response structure: { statusCode, body: { data: { items, hasMore, totalCount } } }
        const chatData = result?.body?.data || result?.data || result;
        
        if (chatData && Array.isArray(chatData.items)) {
          setChatItems(chatData.items);
          setHasMore(chatData.hasMore || false);
          setCurrentPage(1);
          setLoading(false);
          
          // Don't auto-select the first item, let user choose
          console.log('[UserChatPage] Chat list loaded, no auto-selection');
        } else {
          console.error('[UserChatPage] Invalid response structure:', result);
          setLoading(false);
        }
      });
    } catch (error) {
      console.error('[UserChatPage] Error fetching chats:', error);
      setLoading(false);
    }
  }, [user, isInitialized]);

  // Load more chats
  const loadMoreChats = useCallback(() => {
    if (!user || !hasMore || loading) return;
    
    console.log('[UserChatPage] Loading more chats, page:', currentPage + 1);
    setLoading(true);
    
    listUserChats({ page: currentPage + 1, limit: 10 }, (result: any) => {
      console.log('[UserChatPage] Received more chat list from backend:', result);
      
      // Handle the response structure: { statusCode, body: { data: { items, hasMore, totalCount } } }
      const chatData = result?.body?.data || result?.data || result;
      
      if (chatData && Array.isArray(chatData.items)) {
        setChatItems(prev => [...prev, ...chatData.items]);
        setHasMore(chatData.hasMore || false);
        setCurrentPage(currentPage + 1);
        setLoading(false);
      } else {
        console.error('[UserChatPage] Invalid response structure for load more:', result);
        setLoading(false);
      }
    });
  }, [user, hasMore, loading, currentPage]);

  // Fetch messages when selected chat changes
  useEffect(() => {
    console.log('[UserChatPage] useEffect for fetching messages triggered, selectedChat:', selectedChat);
    
    if (!selectedChat) {
      console.log('[UserChatPage] No selected chat, skipping message fetch');
      return;
    }
    
    if (selectedChat.type === 'chat' && selectedChat.chatId) {
      console.log('[UserChatPage] Fetching messages for chat:', selectedChat.chatId);
      joinChat(selectedChat.chatId);
      getMessagesByChat({ chatId: selectedChat.chatId }, (msgs: Message[]) => {
        console.log('[UserChatPage] Received messages from backend:', msgs);
        setMessages(msgs);
      });
    } else {
      console.log('[UserChatPage] Selected item is a user, no messages to fetch');
      setMessages([]);
    }
  }, [selectedChat]);

  // Listen for new incoming messages
  useEffect(() => {
    const handleMessage = (msg: Message) => {
      console.log('[UserChatPage] Received new message:', msg);
      if (msg.chatId === selectedChat?.chatId) {
        console.log('[UserChatPage] Adding message to current chat');
        setMessages((prev) => [...prev, msg]);
      } else {
        console.log('[UserChatPage] Message not for current chat, ignoring');
      }
    };
    
    console.log('[UserChatPage] Setting up message listener');
    import('@/lib/socket').then(({ default: socket }) => {
      socket.on('message', handleMessage);
      return () => socket.off('message', handleMessage);
    });
  }, [selectedChat]);

  // Send message handler
  const handleSendMessage = useCallback(
    (content: string) => {
      if (!user || !selectedChat) {
        console.log('[UserChatPage] Cannot send message - missing user or chat');
        return;
      }
      
      if (selectedChat.type === 'user') {
        console.log('[UserChatPage] Creating new chat with user:', selectedChat.userId);
        // TODO: Implement create chat functionality
        return;
      }
      
      console.log('[UserChatPage] Sending message:', {
        chatId: selectedChat.chatId,
        content
      });
      
      sendMessageSocket(
        {
          chatId: selectedChat.chatId!,
          content,
        },
        (msg: Message) => {
          console.log('[UserChatPage] Message sent successfully:', msg);
          setMessages((prev) => [...prev, msg]);
        }
      );
    },
    [user, selectedChat]
  );

  console.log('[UserChatPage] Rendering with chat items:', chatItems.length, 'selectedChat:', selectedChat);

  // Manual test function
  const handleTestFetchChats = useCallback(() => {
    if (!user) {
      console.log('[UserChatPage] No user available for manual test');
      return;
    }
    console.log('[UserChatPage] Manual test - fetching chats for current user');
    listUserChats({ page: 1, limit: 10 }, (result: any) => {
      console.log('[UserChatPage] Manual test - received chat list:', result);
      
      // Handle the response structure: { statusCode, body: { data: { items, hasMore, totalCount } } }
      const chatData = result?.body?.data || result?.data || result;
      
      if (chatData && Array.isArray(chatData.items)) {
        setChatItems(chatData.items);
        setHasMore(chatData.hasMore || false);
      } else {
        console.error('[UserChatPage] Invalid response structure for manual test:', result);
      }
    });
  }, [user]);

  // Test socket connection
  const handleTestSocketConnection = useCallback(() => {
    console.log('[UserChatPage] Testing socket connection...');
    import('@/lib/socket').then(({ default: socket }) => {
      console.log('[UserChatPage] Current socket status:', socket.connected);
      if (!socket.connected) {
        console.log('[UserChatPage] Connecting socket...');
        socket.connect();
      }
    });
  }, []);

  return (
    <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* Debug panel */}
      <div className="absolute top-4 right-4 z-50 bg-white p-4 rounded-lg shadow-lg border">
        <h3 className="font-semibold mb-2">Debug Info</h3>
        <p className="text-sm">User: {user ? `${user.name} (${user.id})` : 'None'}</p>
        <p className="text-sm">Initialized: {isInitialized ? 'Yes' : 'No'}</p>
        <p className="text-sm">Loading: {isLoading ? 'Yes' : 'No'}</p>
        <p className="text-sm">Chat Items: {chatItems.length}</p>
        <p className="text-sm">Has More: {hasMore ? 'Yes' : 'No'}</p>
        <p className="text-sm">Current Page: {currentPage}</p>
        <div className="flex gap-2 mt-2">
          <button 
            onClick={handleTestSocketConnection}
            className="px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600"
          >
            Test Socket
          </button>
          <button 
            onClick={handleTestFetchChats}
            className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
          >
            Test Fetch Chats
          </button>
          {hasMore && (
            <button 
              onClick={loadMoreChats}
              disabled={loading}
              className="px-3 py-1 bg-purple-500 text-white text-xs rounded hover:bg-purple-600 disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Load More'}
            </button>
          )}
        </div>
      </div>

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