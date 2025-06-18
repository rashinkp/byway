import React, { useState, useRef, useEffect } from 'react';
import { EnhancedChatItem, Message } from '@/types/chat';
import { Message as MessageComponent } from './Message';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Send, MoreVertical, Phone, Video, Info, Smile, Paperclip, Mic, Image } from 'lucide-react';

interface ChatWindowProps {
  chat: EnhancedChatItem;
  messages: Message[];
  onSendMessage: (content: string) => void;
  currentUserId: string;
}

export function ChatWindow({ chat, messages, onSendMessage, currentUserId }: ChatWindowProps) {
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
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
        return 'from-rose-500 to-pink-600';
      case 'instructor':
        return 'from-blue-500 to-indigo-600';
      case 'user':
        return 'from-emerald-500 to-teal-600';
      default:
        return 'from-slate-400 to-slate-500';
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'instructor':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'user':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Header */}
      <div className="relative p-6 bg-white/95 backdrop-blur-xl border-b border-slate-200/60 shadow-sm">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5"></div>
        <div className="relative flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Avatar */}
            <div className="relative">
              <div className={`w-12 h-12 bg-gradient-to-br ${getRoleColor(chat.role)} rounded-2xl flex items-center justify-center shadow-lg ring-2 ring-white`}>
                <span className="font-bold text-white text-sm">
                  {(chat.displayName?.charAt(0) || '?').toUpperCase()}
                </span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
            </div>
            
            {/* User Info */}
            <div className="flex-1">
              <div className="flex items-center space-x-3">
                <h3 className="text-lg font-semibold text-slate-900">
                  {chat.displayName || 'Unknown User'}
                </h3>
                <Badge className={`text-xs px-3 py-1 border ${getRoleBadgeColor(chat.role)} rounded-full font-medium`}>
                  {chat.role.charAt(0).toUpperCase() + chat.role.slice(1).toLowerCase()}
                </Badge>
              </div>
              <div className="flex items-center space-x-2 mt-1">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-emerald-600 font-medium">Active now</span>
                {chat.type === 'user' && (
                  <Badge className="text-xs px-2 py-1 bg-amber-100 text-amber-700 border-amber-200 rounded-full">
                    New Chat
                  </Badge>
                )}
              </div>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="w-10 h-10 p-0 hover:bg-slate-100 rounded-xl">
              <Phone className="w-5 h-5 text-slate-600" />
            </Button>
            <Button variant="ghost" size="sm" className="w-10 h-10 p-0 hover:bg-slate-100 rounded-xl">
              <Video className="w-5 h-5 text-slate-600" />
            </Button>
            <Button variant="ghost" size="sm" className="w-10 h-10 p-0 hover:bg-slate-100 rounded-xl">
              <Info className="w-5 h-5 text-slate-600" />
            </Button>
            <Button variant="ghost" size="sm" className="w-10 h-10 p-0 hover:bg-slate-100 rounded-xl">
              <MoreVertical className="w-5 h-5 text-slate-600" />
            </Button>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
        {chat.type === 'user' ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-6 max-w-md">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-3xl flex items-center justify-center mx-auto shadow-lg">
                  <Send className="w-12 h-12 text-blue-500" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">✨</span>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Start a conversation</h3>
                <p className="text-slate-600 leading-relaxed">
                  Send a message to begin your conversation with <span className="font-semibold text-slate-900">{chat.displayName}</span>. 
                  They'll be notified when you send your first message.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <>
            {Array.isArray(messages) ? messages.map((message, index) => (
              <div
                key={message.id}
                className="messageSlideIn"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <MessageComponent
                  message={message}
                  currentUserId={currentUserId}
                  chat={chat}
                />
              </div>
            )) : null}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center space-x-2 px-4 py-2">
                <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
                  <span className="text-xs text-slate-600">💬</span>
                </div>
                <div className="bg-slate-100 rounded-2xl px-4 py-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Area */}
      <div className="relative p-6 bg-white/95 backdrop-blur-xl border-t border-slate-200/60">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-50/50 to-white/50"></div>
        <form onSubmit={handleSendMessage} className="relative">
          <div className="flex items-end space-x-4">
            {/* Attachment Button */}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="w-10 h-10 p-0 hover:bg-slate-100 rounded-xl flex-shrink-0"
            >
              <Paperclip className="w-5 h-5 text-slate-600" />
            </Button>
            
            {/* Message Input */}
            <div className="flex-1 relative">
              <Input
                type="text"
                placeholder={chat.type === 'user' ? "Type your first message..." : "Type a message..."}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage(e)}
                className="pr-24 py-3 border-slate-200/60 focus:border-blue-300 focus:ring-2 focus:ring-blue-500/20 rounded-2xl bg-slate-50/80 focus:bg-white transition-all duration-200 text-sm"
              />
              
              {/* Inline Actions */}
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="w-8 h-8 p-0 hover:bg-slate-200 rounded-lg"
                >
                  <Smile className="w-4 h-4 text-slate-500" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="w-8 h-8 p-0 hover:bg-slate-200 rounded-lg"
                >
                  <Image className="w-4 h-4 text-slate-500" />
                </Button>
              </div>
            </div>
            
            {/* Voice/Send Button */}
            {newMessage.trim() ? (
              <Button 
                type="submit"
                className="w-12 h-12 p-0 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 flex-shrink-0"
              >
                <Send className="w-5 h-5" />
              </Button>
            ) : (
              <Button
                type="button"
                variant="ghost"
                className="w-12 h-12 p-0 hover:bg-slate-100 rounded-2xl flex-shrink-0"
              >
                <Mic className="w-5 h-5 text-slate-600" />
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}