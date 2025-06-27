import React, { useState, useRef, useEffect } from 'react';
import { EnhancedChatItem, Message } from '@/types/chat';
import { Message as MessageComponent } from './Message';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Send, MoreVertical, ArrowLeft, Image as ImageIcon, X } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks/auth/useAuth';
import { deleteMessage } from '@/services/socketChat';
import { Dialog, DialogContent, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertComponent } from '@/components/ui/AlertComponent';
import { Loader2 } from 'lucide-react';

interface ChatWindowProps {
  chat: EnhancedChatItem;
  messages: Message[];
  onSendMessage: (content: string) => void;
  currentUserId: string;
  onDeleteMessage?: (messageId: string) => void;
  onLoadMoreMessages?: () => void;
  loadingMoreMessages?: boolean;
  showBackButton?: boolean;
  onBack?: () => void;
}

export function ChatWindow({ chat, messages, onSendMessage, currentUserId, onDeleteMessage, onLoadMoreMessages, loadingMoreMessages, showBackButton, onBack }: ChatWindowProps) {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user: currentUser } = useAuth();
  const prevMessagesLength = useRef(messages.length);
  const prevScrollHeight = useRef<number | null>(null);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const MAX_SIZE_MB = 2;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (loadingMoreMessages) {
      if (messagesContainerRef.current) {
        prevScrollHeight.current = messagesContainerRef.current.scrollHeight;
      }
      prevMessagesLength.current = messages.length;
    }
  }, [loadingMoreMessages]);

  useEffect(() => {
    if (!loadingMoreMessages && prevMessagesLength.current < messages.length) {
      if (messagesContainerRef.current && prevScrollHeight.current !== null) {
        const container = messagesContainerRef.current;
        const newScrollHeight = container.scrollHeight;
        container.scrollTop = newScrollHeight - (prevScrollHeight.current - container.scrollTop);
      }
      prevMessagesLength.current = messages.length;
      prevScrollHeight.current = null;
      return;
    }
    if (!loadingMoreMessages) {
      scrollToBottom();
    }
  }, [messages, loadingMoreMessages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage.trim());
      setNewMessage('');
    }
  };

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
        return 'bg-red-50 text-red-700 border-red-200';
      case 'instructor':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'user':
        return 'bg-green-50 text-green-700 border-green-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  // Group messages by date
  const groupedMessages: { date: string; messages: Message[] }[] = [];
  if (Array.isArray(messages)) {
    let lastDate = '';
    messages.forEach((msg) => {
      const dateLabel = getDateLabel(msg.timestamp);
      if (!groupedMessages.length || groupedMessages[groupedMessages.length - 1].date !== dateLabel) {
        groupedMessages.push({ date: dateLabel, messages: [msg] });
      } else {
        groupedMessages[groupedMessages.length - 1].messages.push(msg);
      }
    });
  }

  function getDateLabel(dateString: string) {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const isToday = date.toDateString() === today.toDateString();
    const isYesterday = date.toDateString() === yesterday.toDateString();

    if (isToday) return 'Today';
    if (isYesterday) return 'Yesterday';
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  // Role-based profile viewing logic
  const getProfileLink = () => {
    if (!currentUser || !chat.userId) return null;
    if (currentUser.role === 'USER' && chat.role === 'INSTRUCTOR') {
      return `/instructors/${chat.userId}`;
    }
    if (currentUser.role === 'INSTRUCTOR' && chat.role === 'ADMIN') {
      return `/admin/instructors/${chat.userId}`;
    }
    if (currentUser.role === 'ADMIN') {
      if (chat.role === 'INSTRUCTOR') return `/admin/instructors/${chat.userId}`;
      if (chat.role === 'USER') return `/user/profile/${chat.userId}`;
    }
    return null;
  };
  const canViewProfile = Boolean(getProfileLink());

  const handleDeleteMessage = (messageId: string) => {
    deleteMessage({ messageId }, () => {
      if (onDeleteMessage) onDeleteMessage(messageId);
    });
  };

  // Handle file selection and validation
  const handleFileChange = (file: File | null) => {
    setImageError(null);
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setImageError('Only image files are allowed.');
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setImageError(`File size must be less than ${MAX_SIZE_MB}MB.`);
      return;
    }
    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // Handle drag and drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  // Optional: compress image (stub)
  const compressImage = async (file: File): Promise<File> => {
    // For now, just return the file. Add real compression logic if needed.
    return file;
  };

  // Handle send image (stub)
  const handleSendImage = async () => {
    if (!selectedImage) return;
    // Compress and send logic here (stub)
    setImageModalOpen(false);
    setSelectedImage(null);
    setImagePreview(null);
    setImageError(null);
  };

  const handleCloseModal = () => {
    setImageModalOpen(false);
    setSelectedImage(null);
    setImagePreview(null);
    setImageError(null);
  };

  return (
    <div className="flex flex-col h-full min-h-0 bg-white">
      {/* Header */}
      <div
        className="flex-shrink-0 flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white"
        style={{ minHeight: 64 }}
      >
        <div className="flex items-center space-x-3">
          {/* Back Button for mobile */}
          {showBackButton && (
            <button
              className="md:hidden mr-2 p-2 rounded-full hover:bg-gray-100 focus:outline-none"
              onClick={onBack}
              aria-label="Back to chat list"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
          )}
          {/* Avatar */}
          <div className="relative">
            <div
              className={`w-10 h-10 ${getRoleColor(
                chat.role
              )} rounded-full flex items-center justify-center text-white font-medium text-sm`}
            >
              {(chat.displayName?.charAt(0) || "?").toUpperCase()}
            </div>
          </div>

          {/* User Info */}
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-semibold text-gray-900">
                {chat.displayName || "Unknown User"}
              </h3>
              {chat.role !== "USER" && (
                <Badge
                  className={`text-xs px-2 py-0.5 border ${getRoleBadgeColor(
                    chat.role
                  )} rounded-md`}
                >
                  {chat.role.charAt(0).toUpperCase() +
                    chat.role.slice(1).toLowerCase()}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Header Actions */}
        <div className="relative flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-gray-100"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Chat options"
          >
            <MoreVertical className="h-4 w-4 text-gray-600" />
          </Button>
          {menuOpen && canViewProfile && (
            <div className="absolute right-0 top-10 z-20 bg-white border border-gray-200 rounded shadow-lg min-w-[160px]">
              <Link
                href={getProfileLink()!}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-t"
                onClick={() => setMenuOpen(false)}
              >
                View Profile
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div ref={messagesContainerRef} className="flex-1 min-h-0 overflow-y-auto px-4 py-4 bg-gray-50">
        {chat.type === "user" ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-4 max-w-sm">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <Send className="w-8 h-8 text-blue-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Start a conversation
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Send a message to begin your conversation with{" "}
                  <span className="font-medium">{chat.displayName}</span>.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {onLoadMoreMessages && (
              <div className="flex justify-center mb-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onLoadMoreMessages}
                  disabled={loadingMoreMessages}
                  className="text-xs"
                >
                  {loadingMoreMessages ? 'Loading...' : 'View more'}
                </Button>
              </div>
            )}
            {groupedMessages.map((group, groupIdx) => (
              <div key={group.date + "-" + groupIdx}>
                {/* Date Separator */}
                <div className="flex justify-center my-6">
                  <span className="bg-white text-gray-600 text-xs px-3 py-1 rounded-full border shadow-sm">
                    {group.date}
                  </span>
                </div>

                {/* Messages */}
                <div className="space-y-4">
                  {group.messages.map((message) => (
                    <MessageComponent
                      key={message.id}
                      message={message}
                      currentUserId={currentUserId}
                      chat={chat}
                      onDelete={() => handleDeleteMessage(message.id)}
                    />
                  ))}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div
        className="flex-shrink-0 px-4 py-3 bg-white border-t border-gray-200"
        style={{ minHeight: 64 }}
      >
        <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
          <Button
            type="button"
            variant="outline"
            className="p-2 flex items-center justify-center"
            onClick={() => setImageModalOpen(true)}
            aria-label="Add image"
          >
            <ImageIcon className="w-5 h-5 text-blue-500" />
          </Button>
          <Input
            type="text"
            placeholder={
              chat.type === "user"
                ? "Type your first message..."
                : "Type a message..."
            }
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
          <Button
            type="submit"
            disabled={!newMessage.trim()}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 px-4 py-2"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>

      {/* Image Upload Overlay (not modal) */}
      {imageModalOpen && (
        <div className="fixed inset-x-0 bottom-0 z-40 flex justify-center items-end pointer-events-none">
          <div className="w-full max-w-md bg-white border-t border-gray-200 rounded-t-lg shadow-xl p-6 mb-0 pointer-events-auto animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Add Image</h3>
              <button
                type="button"
                className="p-1 rounded-full hover:bg-gray-100"
                onClick={handleCloseModal}
                aria-label="Close image overlay"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <div
              className="flex flex-col items-center gap-4 py-2"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              {!selectedImage ? (
                <>
                  <div
                    className="w-full h-40 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer bg-gray-50 hover:bg-gray-100 transition"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <ImageIcon className="w-10 h-10 text-gray-400 mb-2" />
                    <span className="text-gray-500 text-sm">Drag & drop or click to select an image</span>
                    <span className="text-xs text-gray-400 mt-1">(Max {MAX_SIZE_MB}MB, image only)</span>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={e => handleFileChange(e.target.files?.[0] || null)}
                  />
                </>
              ) : (
                <div className="w-full flex flex-col items-center gap-3">
                  <div className="relative w-40 h-40">
                    <img
                      src={imagePreview || ''}
                      alt="Preview"
                      className="object-cover w-full h-full rounded-lg border"
                    />
                    <button
                      type="button"
                      className="absolute top-1 right-1 bg-white/80 hover:bg-white rounded-full p-1 shadow"
                      onClick={() => setSelectedImage(null)}
                    >
                      <X className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                  <div className="text-xs text-gray-500">
                    {selectedImage.name} &middot; {(selectedImage.size / 1024).toFixed(1)} KB
                  </div>
                </div>
              )}
              {imageError && <div className="text-red-500 text-xs mt-2">{imageError}</div>}
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button
                variant="outline"
                onClick={handleCloseModal}
                type="button"
              >
                Close
              </Button>
              <Button
                onClick={handleSendImage}
                disabled={!selectedImage}
                type="button"
                className="bg-blue-600 text-white"
              >
                Send Image
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}