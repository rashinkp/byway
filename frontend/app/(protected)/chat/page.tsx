"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { ChatList } from "@/components/chat/ChatList";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { ChatMessage, EnhancedChatItem, ChatListItem } from "@/types/chat";
import { useAuthStore } from "@/stores/auth.store";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { ChevronLeft } from "lucide-react";
import {
  getMessagesByChat,
  joinChat,
  sendMessage as sendMessageSocket,
  markMessagesAsRead,
  listUserChats,
} from "@/services/socketChat";
import socket from "@/lib/socket";
import { useRouter } from "next/navigation";

export default function ChatPage() {
  const user = useAuthStore((state) => state.user);
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const isLoading = useAuthStore((state) => state.isLoading);
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const router = useRouter();

  const [chatItems, setChatItems] = useState<EnhancedChatItem[]>([]);
  const [selectedChat, setSelectedChat] = useState<EnhancedChatItem | null>(
    null
  );
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pendingMessage, setPendingMessage] = useState<string | null>(null);
  const [pendingImageUrl, setPendingImageUrl] = useState<string | null>(null);
  const [pendingAudioUrl, setPendingAudioUrl] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [isSocketConnected, setIsSocketConnected] = useState(socket.connected);
  const chatWindowRef = useRef<{ scrollToBottom: () => void } | null>(null);

  // Track previous chatId for leave logic
  const previousChatIdRef = React.useRef<string | null>(null);

  // Initialize auth if not already done
  useEffect(() => {
    if (!isInitialized && !isLoading) {
      initializeAuth();
    }
  }, [isInitialized, isLoading, initializeAuth]);

  // Track socket connection state
  useEffect(() => {
    const handleConnect = () => {
      console.log('🔌 [Chat] Socket connected in chat page', {
        socketId: socket.id,
        userId: user?.id,
        timestamp: new Date().toISOString(),
      });
      setIsSocketConnected(true);
    };
    const handleDisconnect = (reason: string) => {
      console.log('🔌 [Chat] Socket disconnected in chat page', {
        reason,
        userId: user?.id,
        timestamp: new Date().toISOString(),
      });
      setIsSocketConnected(false);
    };
    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    
    // Check initial connection state
    console.log('🔌 [Chat] Initial socket state:', {
      connected: socket.connected,
      socketId: socket.id,
      userId: user?.id,
      timestamp: new Date().toISOString(),
    });
    
    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
    };
  }, [user?.id]);

  // Global message listener for debugging
  useEffect(() => {
    const handleGlobalMessage = (msg: any) => {
      console.log('🌍 [Chat] Global message received:', {
        event: 'message',
        messageId: msg?.id,
        chatId: msg?.chatId,
        senderId: msg?.senderId,
        content: msg?.content?.substring(0, 50) + '...',
        timestamp: new Date().toISOString(),
      });
    };
    
    socket.on("message", handleGlobalMessage);
    
    return () => {
      socket.off("message", handleGlobalMessage);
    };
  }, []);

  // Fetch user chats on mount and when searchQuery or socket connection changes
  useEffect(() => {
    if (!user) return;
    if (!isInitialized) return;
    if (!isSocketConnected) return;
    setLoading(true);
    try {
      listUserChats(
        { page: 1, limit: 10, search: searchQuery },
        (result: ChatListItem[]) => {
          const chatData = result;
          if (chatData && Array.isArray(chatData)) {
            setChatItems(chatData);
            setHasMore(chatData.length === 10); // Assuming 10 is the limit
            setCurrentPage(1);
            setLoading(false);
          } else {
            setLoading(false);
          }
        }
      );
    } catch {
      setLoading(false);
    }
  }, [user, isInitialized, searchQuery, isSocketConnected]);

  // Load more chats
  const loadMoreChats = useCallback(() => {
    if (!user || !hasMore || loading) return;

    setLoading(true);

    listUserChats({ page: currentPage + 1, limit: 10 }, (result: ChatListItem[]) => {
      const chatData = result;

      if (chatData && Array.isArray(chatData)) {
        setChatItems((prev) => [...prev, ...chatData]);
        setHasMore(chatData.length === 10);
        setCurrentPage(currentPage + 1);
        setLoading(false);
      } else {
        setLoading(false);
      }
    });
  }, [user, hasMore, loading, currentPage]);

  // Fetch messages when selected chat changes (paginated)
  useEffect(() => {
    if (!selectedChat) {
      console.log('🗑️ [Chat] No chat selected, clearing messages');
      setMessages([]);
      setCurrentPage(1);
      setHasMore(false);
      return;
    }
    
    if (selectedChat.type === "chat" && selectedChat.chatId) {
      console.log('📚 [Chat] Loading messages for selected chat:', selectedChat.chatId);
      setLoading(true);
      getMessagesByChat(
        { chatId: selectedChat.chatId, limit: 20 },
        (result: ChatMessage[]) => {
          const msgs = result;
          console.log('📚 [Chat] Messages loaded from useEffect:', {
            chatId: selectedChat.chatId,
            messageCount: Array.isArray(msgs) ? msgs.length : 0,
            isArray: Array.isArray(msgs),
            timestamp: new Date().toISOString(),
          });
          // Backend now returns ASC order (oldest first), which matches display expectations
          setMessages(Array.isArray(msgs) ? msgs : []);
          setLoading(false);
          
          // Mark messages as read for this chat
          if (user?.id && selectedChat.chatId) {
            markMessagesAsRead(selectedChat.chatId, user.id);
          }
          
          // Scroll to bottom after messages are loaded
          setTimeout(() => {
            if (chatWindowRef.current?.scrollToBottom) {
              chatWindowRef.current.scrollToBottom();
            }
          }, 100);
        }
      );
    } else {
      setMessages([]);
    }
  }, [selectedChat, user?.id]);

  // Listen for new incoming messages
		useEffect(() => {
			const handleMessage = (msg: ChatMessage) => {
				console.log('💬 [Chat] Received message event:', {
					messageId: msg.id,
					chatId: msg.chatId,
					selectedChatId: selectedChat?.chatId,
					senderId: msg.senderId,
					userId: user?.id,
					content: msg.content?.substring(0, 50) + '...',
					timestamp: new Date().toISOString(),
				});
				
				if (msg.chatId === selectedChat?.chatId) {
					console.log('✅ [Chat] Message matches selected chat, adding to messages');
					setMessages((prev) =>
						prev.some((m) => m.id === msg.id) ? prev : [...prev, msg]
					);
					if (user && msg.senderId !== user.id) {
						console.log('📖 [Chat] Marking message as read');
						markMessagesAsRead(msg.chatId, user.id);
					}
				} else {
					console.log('❌ [Chat] Message does not match selected chat', {
						messageChatId: msg.chatId,
						selectedChatId: selectedChat?.chatId,
					});
				}
			};
			
			console.log('🎧 [Chat] Setting up message listener for chat:', selectedChat?.chatId);
			socket.on("message", handleMessage);
			socket.on("connect", () => {
				console.log('🔌 [Chat] Socket connected');
				setIsSidebarOpen(true);
			});
			socket.on("disconnect", () => {
				console.log('🔌 [Chat] Socket disconnected');
				setIsSidebarOpen(false);
			});
			
			return () => {
				console.log('🧹 [Chat] Cleaning up message listener for chat:', selectedChat?.chatId);
				socket.off("message", handleMessage);
				socket.off("connect");
				socket.off("disconnect");
			};
		}, [selectedChat?.chatId, user?.id]); // More stable dependencies

  // Debug wrappers for pending media setters
  const debugSetPendingImageUrl = (url: string) => {
    setPendingImageUrl(url);
  };
  const debugSetPendingAudioUrl = (url: string) => {
    setPendingAudioUrl(url);
	};
	


  // useEffect to send pending message after new chat is selected
  useEffect(() => {
    if (
      (pendingMessage || pendingImageUrl || pendingAudioUrl) &&
      selectedChat &&
      selectedChat.type === "chat" &&
      selectedChat.chatId
    ) {
     
      sendMessageSocket(
        {
          chatId: selectedChat.chatId!,
          userId: selectedChat.userId!, // recipient's userId - required by backend
          content: pendingMessage || "",
          imageUrl: pendingImageUrl || undefined,
          audioUrl: pendingAudioUrl || undefined,
        },
        () => {
          getMessagesByChat({ chatId: selectedChat.chatId! }, (result: ChatMessage[]) => {
            const msgs = result;
            // Backend now returns ASC order (oldest first), which matches display expectations
            setMessages(Array.isArray(msgs) ? msgs : []);
          });
        }
      );
      setPendingMessage(null);
      setPendingImageUrl(null);
      setPendingAudioUrl(null);
    }
  }, [pendingMessage, pendingImageUrl, pendingAudioUrl, selectedChat, user]);

  const handleSelectChat = (chat: EnhancedChatItem) => {
    console.log('🎯 [Chat] Selecting chat:', {
      chatId: chat.chatId,
      chatType: chat.type,
      displayName: chat.displayName,
      previousChatId: previousChatIdRef.current,
      timestamp: new Date().toISOString(),
    });
  
    if (
      previousChatIdRef.current &&
      previousChatIdRef.current !== chat.chatId
    ) {
      console.log('🚪 [Chat] Leaving previous chat room:', previousChatIdRef.current);
      socket.emit("leave", previousChatIdRef.current);
    }
    
    // Join new chat room using the service function
    if (chat.type === "chat" && chat.chatId) {
      const chatId = chat.chatId; // Extract to avoid TypeScript issues
      console.log('🚪 [Chat] Joining new chat room:', chatId);
      joinChat(chatId);
      previousChatIdRef.current = chatId;
      

    }
    
    setSelectedChat(chat);
    // Auto-close sidebar on mobile when chat is selected
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  const handleDeleteMessage = useCallback(
    (messageId: string) => {
      if (!messageId || !selectedChat?.chatId) {
        return;
      }

     

      // Emit delete message event
      socket.emit(
        "deleteMessage",
        {
          messageId,
          chatId: selectedChat.chatId,
        },
        (response: { success?: boolean }) => {
        

          if (response?.success) {
            // Remove the message locally first for immediate feedback
            setMessages((prev) => prev.filter((msg) => msg.id !== messageId));

            // Then refresh messages from server
            getMessagesByChat(
              { chatId: selectedChat.chatId! },
              (result: ChatMessage[]) => {
                const msgs = result;
                setMessages(Array.isArray(msgs) ? msgs : []);
              }
            );

            // Refresh chat list as well
            listUserChats(
              { page: 1, limit: 10, search: searchQuery },
              (result: ChatListItem[]) => {
                const chatData = result;
                if (chatData && Array.isArray(chatData)) {
                  setChatItems(chatData);
                  setHasMore(chatData.length === 10);
                  setCurrentPage(1);
                }
              }
            );
          } 
        }
      );
    },
    [selectedChat, searchQuery]
  );

  useEffect(() => {
    function handleChatListUpdated() {
    
      listUserChats(
        { page: 1, limit: 10, search: searchQuery },
        (result: ChatListItem[]) => {
          const chatData = result;
          if (chatData && Array.isArray(chatData)) {
            setChatItems(chatData);
            setHasMore(chatData.length === 10);
            setCurrentPage(1);
          }
        }
      );
    }
    socket.on("chatListUpdated", handleChatListUpdated);
    return () => {
      socket.off("chatListUpdated", handleChatListUpdated);
    };
  }, [searchQuery]);

  // Restore handleSendMessage function
  const handleSendMessage = useCallback(
    (content: string, imageUrl?: string, audioUrl?: string) => {
      console.log('📤 [Chat] handleSendMessage called:', {
        content: content?.substring(0, 50) + '...',
        selectedChatType: selectedChat?.type,
        selectedChatId: selectedChat?.chatId,
        selectedUserId: selectedChat?.userId,
        timestamp: new Date().toISOString(),
      });
    
      if (!user || !selectedChat) {
        console.log('❌ [Chat] Cannot send message - missing user or selectedChat');
        return;
      }
      
      if (selectedChat.type === "user") {
        // For new chats, chatId might not exist yet
        console.log('📤 [Chat] Sending message for new chat:', {
          chatId: selectedChat.chatId,
          userId: selectedChat.userId,
          content: content?.substring(0, 50) + '...',
        });
        
        const messageData: any = {
          userId: selectedChat.userId!, // Required by backend
          content,  
          imageUrl,
          audioUrl,
        };
        
        // Only include chatId if it exists
        if (selectedChat.chatId) {
          messageData.chatId = selectedChat.chatId;
        }
        
        console.log('📤 [Chat] Final messageData being sent:', messageData);
        
        sendMessageSocket(
          messageData,
                  (msg: ChatMessage) => {
          // After first message, join the new chat room and update selectedChat
          if (msg.chatId) {
            joinChat(msg.chatId);
            // Update selectedChat to new chat type
            setSelectedChat((prev) =>
              prev && prev.userId === msg.receiverId
                ? {
                    ...prev,
                    type: "chat",
                    chatId: msg.chatId,
                    id: msg.chatId,
                  }
                : prev
            );
            // Update chatItems to reflect the new chat type and chatId
            setChatItems((prev) =>
              prev.map((item) =>
                item.userId === msg.receiverId && item.type === "user"
                  ? {
                      ...item,
                      type: "chat",
                      chatId: msg.chatId,
                      id: msg.chatId,
                    }
                  : item
              )
            );
            // Re-fetch chat list and messages from backend for stability
            listUserChats({ page: 1, limit: 10 }, (result: ChatListItem[]) => {
              const chatData = result;
              if (chatData && Array.isArray(chatData)) {
                setChatItems(chatData);
                setHasMore(chatData.length === 10);
                setCurrentPage(1);
              }
            });
            getMessagesByChat({ chatId: msg.chatId }, (result: ChatMessage[]) => {
              const msgs = result;
              if (Array.isArray(msgs)) {
                setMessages(msgs);
              }
            });
          }
        },
          (err: { message?: string }) => {
            alert(err?.message || "Failed to send message");
          }
        );
        return;
      }
      // Existing chat
      console.log('📤 [Chat] Sending message for existing chat:', {
        chatId: selectedChat.chatId,
        userId: selectedChat.userId,
        content: content?.substring(0, 50) + '...',
      });
      
      const payload = {
        chatId: selectedChat.chatId!,
        userId: selectedChat.userId!, // Required by backend
        content,
        imageUrl,
        audioUrl,
      };
      
      console.log('📤 [Chat] Final payload being sent for existing chat:', payload);
     
      sendMessageSocket(
        payload,
        (msg: ChatMessage) => {
          setMessages((prev) =>
            prev.some((m) => m.id === msg.id) ? prev : [...prev, msg]
          );
          // Do not update chatItems here; rely on chatListUpdated event to refetch from backend
        },
        (err: { message?: string }) => {
          alert(err?.message || "Failed to send message");
        }
      );
    },
    [user, selectedChat]
  );

  // Note: Backend automatically joins user to their personal room on connection
  // No need to manually emit "join" event for user's personal room

  // Responsive mobile detection
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Scroll to bottom on chat open (mobile only)
  useEffect(() => {
    if (isMobile && selectedChat && chatWindowRef.current && chatWindowRef.current.scrollToBottom) {
      setTimeout(() => {
        chatWindowRef.current?.scrollToBottom();
      }, 100); // slight delay to ensure messages are rendered
    }
  }, [selectedChat, isMobile]);

  useEffect(() => {
    function handleMessagesRead({ chatId }: { chatId: string }) {
      console.log('📖 [Chat] Received messagesRead event:', {
        chatId,
        selectedChatId: selectedChat?.chatId,
        timestamp: new Date().toISOString(),
      });
     
      if (selectedChat?.chatId === chatId) {
        console.log('📖 [Chat] Refreshing messages for selected chat');
        getMessagesByChat({ chatId }, (result: ChatMessage[]) => {
          const msgs = result;
          setMessages(Array.isArray(msgs) ? msgs : []);
        });
      }
   
      // Always refresh chat list when messages are read
      listUserChats(
        { page: 1, limit: 10, search: searchQuery },
        (result: ChatListItem[]) => {
          const chatData = result;
         
          if (chatData && Array.isArray(chatData)) {
            setChatItems(chatData);
            setHasMore(chatData.length === 10);
            setCurrentPage(1);
          }
        }
      );
    }
    
    console.log('📖 [Chat] Setting up messagesRead listener');
    socket.on("messagesRead", handleMessagesRead);
    return () => {
      console.log('📖 [Chat] Cleaning up messagesRead listener');
      socket.off("messagesRead", handleMessagesRead);
    };
  }, [selectedChat?.chatId, searchQuery, user?.id]); // More stable dependencies

  useEffect(() => {
    function handleMessageDeleted({ messageId, chatId }: { messageId: string; chatId: string }) {
      if (selectedChat?.chatId === chatId) {
        setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
      }
    }
    socket.on("messageDeleted", handleMessageDeleted);
    return () => {
      socket.off("messageDeleted", handleMessageDeleted);
    };
  }, [selectedChat]);

  if (!isInitialized || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#18181b] transition-colors duration-300">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-[#facc15]/20 rounded-2xl flex items-center justify-center mx-auto animate-pulse">
            <Loader2 className="w-8 h-8 text-[#facc15] animate-spin" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-[#facc15]">
              Loading Chat
            </h3>
            <p className="text-gray-500 dark:text-gray-300">
              Please wait while we set up your conversations...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[100dvh] flex flex-col overflow-hidden">
      <div className="w-full h-full min-h-0 flex items-stretch">
        <div className="w-full overflow-hidden flex flex-col min-h-0">
          <div className="flex flex-1 min-h-0">
            {((isSidebarOpen && (!selectedChat || !isMobile)) ||
              (!selectedChat && isMobile)) && (
              <div
                className={`relative ${
                  isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                } md:relative md:translate-x-0 z-40 ${
                  isMobile && !selectedChat ? "w-full" : "w-80 md:w-96"
                } h-full transition-transform duration-300 ease-in-out md:transition-none`}
              >
                {user?.role !== "USER" && (
                  <div className="flex items-center gap-2 p-3 pt-5 border-b border-gray-200 dark:border-gray-700 dark:bg-[#18181b]">
                    <button
                      onClick={() => router.back()}
                      className="flex items-center gap-1 text-black dark:text-[#facc15] hover:text-[#facc15] dark:hover:text-white px-2 py-1 rounded-md"
                      aria-label="Back"
                    >
                      <ChevronLeft className="w-5 h-5" />
                      <span className="text-sm font-medium">Back</span>
                    </button>
                    <span className="ml-2 font-bold text-[#facc15] dark:text-[#facc15] text-lg">Byway</span>
                  </div>
                )}
                <ChatList
                  chats={chatItems}
                  selectedChat={selectedChat}
                  onSelectChat={handleSelectChat}
                  onSearch={setSearchQuery}
                />
                
                {hasMore && (
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <Button
                      onClick={loadMoreChats}
                      disabled={loading}
                      variant="default"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Loading...
                        </>
                      ) : (
                        "Load more conversations"
                      )}
                    </Button>
                  </div>
                )}
              </div>
            )}
            {/* Mobile Overlay */}
            {isSidebarOpen && !selectedChat && (
              <div
                className="fixed inset-0 backdrop-blur-sm z-30 md:hidden"
                onClick={() => setIsSidebarOpen(false)}
              />
            )}
            {/* Chat Window (show on mobile only if a chat is selected) */}
            {selectedChat && (!isMobile || (isMobile && !isSidebarOpen)) && (
              <div className="flex-1 flex flex-col h-full min-h-0">
                <ChatWindow
                  ref={chatWindowRef}
                  chat={selectedChat}
                  messages={messages}
                  onSendMessage={handleSendMessage}
                  currentUserId={user?.id || ""}
                  onDeleteMessage={handleDeleteMessage} // This function now expects a messageId parameter
                  showBackButton={isMobile}
                  onBack={() => {
                    setIsSidebarOpen(true);
                    setSelectedChat(null);
                  }}
                  setPendingImageUrl={debugSetPendingImageUrl}
                  setPendingAudioUrl={debugSetPendingAudioUrl}
                  loadingMoreMessages={loading}
                />
              </div>
            )}
            {/* Fallback UI when no chat is selected */}
            {!selectedChat && (!isMobile || (isMobile && !isSidebarOpen)) && (
              <div className="flex-1 flex flex-col items-center justify-center h-full min-h-0  select-none">
                <div className="mb-4">
                  <svg
                    width="48"
                    height="48"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="mx-auto mb-2 "
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M7 8h10M7 12h6m-6 4h8m-2 4.5V21a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h12a2 2 0 012 2v7"
                    />
                  </svg>
                  <h2 className="text-lg font-semibold">
                    Select any chat to start conversation
                  </h2>
                  <p className="text-sm ">
                    Choose a chat from the list or start a new one to begin
                    messaging.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
