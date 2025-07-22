"use client";

import React, { useEffect, useState, useCallback } from "react";
import { ChatList } from "@/components/chat/ChatList";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { Message, EnhancedChatItem } from "@/types/chat";
import { useAuthStore } from "@/stores/auth.store";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  listUserChats,
  getMessagesByChat,
  joinChat,
  sendMessage as sendMessageSocket,
  markMessagesAsRead,
} from "@/services/socketChat";
import socket from "@/lib/socket";

export default function ChatPage() {
  const user = useAuthStore((state) => state.user);
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const isLoading = useAuthStore((state) => state.isLoading);
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  const [chatItems, setChatItems] = useState<EnhancedChatItem[]>([]);
  const [selectedChat, setSelectedChat] = useState<EnhancedChatItem | null>(
    null
  );
  const [messages, setMessages] = useState<Message[]>([]);
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
    const handleConnect = () => setIsSocketConnected(true);
    const handleDisconnect = () => setIsSocketConnected(false);
    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
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
        (result: any) => {
          const chatData = result?.body?.data || result?.data || result;
          if (chatData && Array.isArray(chatData.items)) {
            setChatItems(chatData.items);
            setHasMore(chatData.hasMore || false);
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

    listUserChats({ page: currentPage + 1, limit: 10 }, (result: any) => {
      const chatData = result?.body?.data || result?.data || result;

      if (chatData && Array.isArray(chatData.items)) {
        setChatItems((prev) => [...prev, ...chatData.items]);
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
    if (selectedChat.type === "chat" && selectedChat.chatId) {
      joinChat(selectedChat.chatId);
      getMessagesByChat(
        { chatId: selectedChat.chatId, limit: 20 },
        (result: any) => {
          const msgs = result?.body?.data || result?.data || result;
          // Backend now returns ASC order (oldest first), which matches display expectations
          setMessages(Array.isArray(msgs) ? msgs : []);
        }
      );
    } else {
      setMessages([]);
    }
  }, [selectedChat]);

  // Listen for new incoming messages
  useEffect(() => {
    const handleMessage = (msg: Message) => {
      if (msg.chatId === selectedChat?.chatId) {
        setMessages((prev) =>
          prev.some((m) => m.id === msg.id) ? prev : [...prev, msg]
        );
        // Mark as read if the message is for the currently open chat and not sent by the current user
        if (user && msg.senderId !== user.id) {
          markMessagesAsRead(msg.chatId, user.id);
        }
      }
    };
    import("@/lib/socket").then(({ default: socket }) => {
      socket.on("message", handleMessage);
      socket.on("connect", () => setIsSidebarOpen(true));
      socket.on("disconnect", () => setIsSidebarOpen(false));
      return () => {
        socket.off("message", handleMessage);
        socket.off("connect");
        socket.off("disconnect");
      };
    });
  }, [selectedChat, user]);

  // Debug wrappers for pending media setters
  const debugSetPendingImageUrl = (url: string) => {
    console.log("[Debug] setPendingImageUrl called with:", url);
    setPendingImageUrl(url);
  };
  const debugSetPendingAudioUrl = (url: string) => {
    console.log("[Debug] setPendingAudioUrl called with:", url);
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
      console.log("[Debug] About to send message:", {
        pendingMessage,
        pendingImageUrl,
        pendingAudioUrl,
        chatId: selectedChat.chatId,
        userId: selectedChat.userId,
      });
      sendMessageSocket(
        {
          chatId: selectedChat.chatId,
          userId: selectedChat.userId, // recipient's userId
          content: pendingMessage || "",
          imageUrl: pendingImageUrl || undefined,
          audioUrl: pendingAudioUrl || undefined,
        },
        () => {
          getMessagesByChat({ chatId: selectedChat.chatId }, (result: any) => {
            const msgs = result?.body?.data || result?.data || result;
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
    console.log("[Debug] handleSelectChat called with:", chat);
    // Leave previous chat room if any
    if (
      previousChatIdRef.current &&
      previousChatIdRef.current !== chat.chatId
    ) {
      socket.emit("leave", previousChatIdRef.current);
    }
    // Join new chat room
    if (chat.type === "chat" && chat.chatId) {
      socket.emit("join", chat.chatId);
      previousChatIdRef.current = chat.chatId;
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
        console.error("Missing messageId or chatId for deletion");
        return;
      }

      console.log("[Frontend] Requesting message deletion:", {
        messageId,
        chatId: selectedChat.chatId,
      });

      // Emit delete message event
      socket.emit(
        "deleteMessage",
        {
          messageId,
          chatId: selectedChat.chatId,
        },
        (response: any) => {
          console.log("[Frontend] Delete message response:", response);

          if (response?.success) {
            // Remove the message locally first for immediate feedback
            setMessages((prev) => prev.filter((msg) => msg.id !== messageId));

            // Then refresh messages from server
            getMessagesByChat(
              { chatId: selectedChat.chatId },
              (result: any) => {
                const msgs = result?.body?.data || result?.data || result;
                setMessages(Array.isArray(msgs) ? msgs : []);
              }
            );

            // Refresh chat list as well
            listUserChats(
              { page: 1, limit: 10, search: searchQuery },
              (result: any) => {
                const chatData = result?.body?.data || result?.data || result;
                if (chatData && Array.isArray(chatData.items)) {
                  setChatItems(chatData.items);
                  setHasMore(chatData.hasMore || false);
                  setCurrentPage(1);
                }
              }
            );
          } else {
            console.error("[Frontend] Failed to delete message:", response);
            // You might want to show an error toast/alert here
          }
        }
      );
    },
    [selectedChat, searchQuery]
  );

  useEffect(() => {
    function handleChatListUpdated() {
      console.log(
        "[Frontend] Received chatListUpdated event, refetching chat list..."
      );
      listUserChats(
        { page: 1, limit: 10, search: searchQuery },
        (result: any) => {
          const chatData = result?.body?.data || result?.data || result;
          if (chatData && Array.isArray(chatData.items)) {
            setChatItems(chatData.items);
            setHasMore(chatData.hasMore || false);
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
      console.log("[Debug] handleSendMessage called with:", {
        content,
        imageUrl,
        audioUrl,
        selectedChat,
      });
      if (!user || !selectedChat) return;
      if (selectedChat.type === "user") {
        sendMessageSocket(
          {
            userId: selectedChat.userId,
            content,
            imageUrl,
            audioUrl,
          },
          (msg: Message) => {
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
                // Backend now returns ASC order (oldest first), which matches display expectations
                setMessages(Array.isArray(msgs) ? msgs : []);
              });
            }
          },
          (err: any) => {
            alert(err?.message || "Failed to send message");
          }
        );
        return;
      }
      // Existing chat
      const payload = {
        chatId: selectedChat.chatId!,
        content,
        imageUrl,
        audioUrl,
      };
      console.log("[Debug] Sending payload to sendMessageSocket:", payload);
      sendMessageSocket(
        payload,
        (msg: Message) => {
          setMessages((prev) =>
            prev.some((m) => m.id === msg.id) ? prev : [...prev, msg]
          );
          // Do not update chatItems here; rely on chatListUpdated event to refetch from backend
        },
        (err: any) => {
          alert(err?.message || "Failed to send message");
        }
      );
    },
    [user, selectedChat]
  );

  useEffect(() => {
    if (!user) return;
    const handleConnect = () => {
      console.log("[Frontend] Joining userId room:", user.id);
      socket.emit("join", user.id);
    };
    socket.on("connect", handleConnect);
    // If already connected, join immediately
    if (socket.connected) {
      handleConnect();
    }
    return () => {
      socket.off("connect", handleConnect);
    };
  }, [user]);

  // Responsive mobile detection
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    function handleMessagesRead({ chatId }: { chatId: string }) {
      console.log("[SocketIO] messagesRead event received:", chatId);
      if (selectedChat?.chatId === chatId) {
        console.log("[SocketIO] Refetching messages for chat:", chatId);
        getMessagesByChat({ chatId }, (result: any) => {
          const msgs = result?.body?.data || result?.data || result;
          console.log("[SocketIO] Updated messages:", msgs);
          setMessages(Array.isArray(msgs) ? msgs : []);
        });
      }
      // Always refresh chat list to update unread counts
      console.log("[SocketIO] Refetching chat list after messagesRead");
      listUserChats(
        { page: 1, limit: 10, search: searchQuery },
        (result: any) => {
          const chatData = result?.body?.data || result?.data || result;
          console.log("[SocketIO] Updated chat list:", chatData);
          if (chatData && Array.isArray(chatData.items)) {
            setChatItems(chatData.items);
            setHasMore(chatData.hasMore || false);
            setCurrentPage(1);
          }
        }
      );
    }
    socket.on("messagesRead", handleMessagesRead);
    return () => {
      socket.off("messagesRead", handleMessagesRead);
    };
  }, [selectedChat, searchQuery, user]);

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
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Main Chat Interface */}
      <div className="w-full h-[calc(100vh-4rem)] flex items-stretch">
        <div className="w-full overflow-hidden flex flex-col min-h-0">
          <div className="flex flex-1 min-h-0">
            {/* Chat List Sidebar (show on mobile only if sidebar is open and no chat selected) */}
            {((isSidebarOpen && (!selectedChat || !isMobile)) ||
              (!selectedChat && isMobile)) && (
              <div
                className={`$${
                  isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                } md:relative md:translate-x-0 z-40 ${
                  isMobile && !selectedChat ? "w-full" : "w-80 md:w-96"
                } h-full transition-transform duration-300 ease-in-out md:transition-none`}
              >
                <ChatList
                  chats={chatItems}
                  selectedChat={selectedChat}
                  onSelectChat={handleSelectChat}
                  onSearch={setSearchQuery}
                />
                {/* Load More Button */}
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
