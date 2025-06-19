import React, { useState, useRef, useEffect } from 'react';
import { EnhancedChatItem, Message } from '@/types/chat';
import { Message as MessageComponent } from './Message';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Send, MoreVertical, Phone, Video, Info } from 'lucide-react';

interface ChatWindowProps {
  chat: EnhancedChatItem;
  messages: Message[];
  onSendMessage: (content: string) => void;
  currentUserId: string;
}

export function ChatWindow({ chat, messages, onSendMessage, currentUserId }: ChatWindowProps) {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white">
        <div className="flex items-center space-x-3">
          {/* Avatar */}
          <div className="relative">
            <div className={`w-10 h-10 ${getRoleColor(chat.role)} rounded-full flex items-center justify-center text-white font-medium text-sm`}>
              {(chat.displayName?.charAt(0) || '?').toUpperCase()}
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
          
          {/* User Info */}
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-semibold text-gray-900">
                {chat.displayName || 'Unknown User'}
              </h3>
              <Badge className={`text-xs px-2 py-0.5 border ${getRoleBadgeColor(chat.role)} rounded-md`}>
                {chat.role.charAt(0).toUpperCase() + chat.role.slice(1).toLowerCase()}
              </Badge>
            </div>
            <p className="text-xs text-green-600">Active now</p>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100">
            <Phone className="h-4 w-4 text-gray-600" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100">
            <Video className="h-4 w-4 text-gray-600" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100">
            <Info className="h-4 w-4 text-gray-600" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100">
            <MoreVertical className="h-4 w-4 text-gray-600" />
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 bg-gray-50">
        {chat.type === 'user' ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-4 max-w-sm">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <Send className="w-8 h-8 text-blue-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Start a conversation</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Send a message to begin your conversation with <span className="font-medium">{chat.displayName}</span>.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {groupedMessages.map((group, groupIdx) => (
              <div key={group.date + '-' + groupIdx}>
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
      <div className="px-4 py-3 bg-white border-t border-gray-200">
        <form onSubmit={handleSendMessage}>
          <div className="flex items-center space-x-2">
            <Input
              type="text"
              placeholder={chat.type === 'user' ? "Type your first message..." : "Type a message..."}
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
          </div>
        </form>
      </div>
    </div>
  );
}