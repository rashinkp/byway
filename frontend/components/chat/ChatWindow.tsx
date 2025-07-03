import React, { useState, useRef, useEffect } from 'react';
import { EnhancedChatItem, Message } from '@/types/chat';
import { Message as MessageComponent } from './Message';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Send, MoreVertical, ArrowLeft, Image as ImageIcon, X, Mic, StopCircle } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks/auth/useAuth';
import { deleteMessage } from '@/services/socketChat';
import { ModernChatInput } from './ChatInput';

interface ChatWindowProps {
  chat: EnhancedChatItem;
  messages: Message[];
  onSendMessage: (content: string, imageUrl?: string, audioUrl?: string) => void;
  currentUserId: string;
  onDeleteMessage?: (messageId: string) => void;
  onLoadMoreMessages?: () => void;
  loadingMoreMessages?: boolean;
  showBackButton?: boolean;
  onBack?: () => void;
}

export function ChatWindow({ chat, messages, onSendMessage, currentUserId, onDeleteMessage, onLoadMoreMessages, loadingMoreMessages, showBackButton, onBack, ...props }: ChatWindowProps & { setPendingImageUrl?: (url: string) => void, setPendingAudioUrl?: (url: string) => void, isNewChat?: boolean }) {
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
  const [showAudioRecorder, setShowAudioRecorder] = useState(false);

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

  // Dummy send audio handler for AudioRecorder
  const handleSendRecordedAudio = (audioUrl: string, duration: number) => {
    onSendMessage('', undefined, audioUrl);
    setShowAudioRecorder(false);
  };

  return (
    <div className="flex flex-col h-full bg-[var(--color-surface)]">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-primary-light)]/20 bg-[var(--color-background)]">
        {showBackButton && (
          <Button variant="ghost" size="sm" className="mr-2" onClick={onBack}>
            <ArrowLeft className="w-5 h-5 text-[var(--color-muted)]" />
          </Button>
        )}
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 bg-[var(--color-primary-light)] rounded-full flex items-center justify-center text-[var(--color-surface)] font-medium text-lg`}>
            {(chat.displayName?.charAt(0) || '?').toUpperCase()}
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-[var(--color-primary-dark)] text-base">{chat.displayName}</span>
            {chat.role !== 'USER' && (
              <Badge className="text-xs px-2 py-0.5 bg-[var(--color-primary-light)]/10 text-[var(--color-primary-light)] rounded-md w-fit">
                {chat.role.charAt(0).toUpperCase() + chat.role.slice(1).toLowerCase()}
              </Badge>
            )}
          </div>
        </div>
        {canViewProfile && (
          <Link href={getProfileLink()!} className="ml-4 text-[var(--color-primary-light)] hover:text-[var(--color-primary-dark)] underline text-sm font-medium transition-colors">View Profile</Link>
        )}
        <div className="flex-1" />
        <div className="relative">
          <Button variant="ghost" size="icon" className="rounded-full">
            <MoreVertical className="w-5 h-5 text-[var(--color-muted)]" />
          </Button>
        </div>
      </div>
      {/* Messages Area */}
      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto px-6 py-4 space-y-6 bg-[var(--color-surface)]" onDrop={handleDrop} onDragOver={handleDragOver}>
        {groupedMessages.map((group, idx) => (
          <div key={idx} className="space-y-4">
            <div className="text-center text-xs text-[var(--color-muted)] mb-2">{group.date}</div>
            {group.messages.map((msg) => (
              <MessageComponent
                key={msg.id}
                message={msg}
                currentUserId={currentUserId}
                chat={chat}
                onDelete={onDeleteMessage ? () => onDeleteMessage(msg.id) : undefined}
              />
            ))}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      {/* Chat Input */}
      <ModernChatInput
        onSendMessage={onSendMessage}
        disabled={false}
        isNewChat={chat.type === 'user'}
        setPendingImageUrl={props.setPendingImageUrl}
        setPendingAudioUrl={props.setPendingAudioUrl}
      />
    </div>
  );
}