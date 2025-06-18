import React, { useState, useRef, useEffect } from 'react';
import { EnhancedChatItem, Message } from '@/types/chat';
import { Message as MessageComponent } from './Message';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Send, MoreVertical } from 'lucide-react';

interface ChatWindowProps {
  chat: EnhancedChatItem;
  messages: Message[];
  onSendMessage: (content: string) => void;
}

export function ChatWindow({ chat, messages, onSendMessage }: ChatWindowProps) {
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
        return 'from-red-100 to-red-200 text-red-600';
      case 'instructor':
        return 'from-blue-100 to-blue-200 text-blue-600';
      case 'user':
        return 'from-green-100 to-green-200 text-green-600';
      default:
        return 'from-gray-100 to-gray-200 text-gray-600';
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'instructor':
        return 'bg-blue-100 text-blue-800';
      case 'user':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-gray-50 to-gray-100">
    <div className="p-4 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 bg-gradient-to-br rounded-full flex items-center justify-center ${getRoleColor(chat.role)}`}>
            <span className="font-semibold text-sm">
              {(chat.displayName?.charAt(0) || '?').toUpperCase()}
            </span>
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900">
              {chat.displayName || 'Unknown'}
            </h3>
            <div className="flex items-center space-x-2">
              <Badge className={`text-xs px-2 py-0.5 ${getRoleBadgeColor(chat.role)}`}>
                {chat.role.charAt(0).toUpperCase() + chat.role.slice(1).toLowerCase()}
              </Badge>
              {chat.type === 'user' && (
                <Badge className="text-xs px-2 py-0.5 bg-gray-100 text-gray-800">
                  New Chat
                </Badge>
              )}
            </div>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600 hover:bg-gray-100">
          <MoreVertical className="w-4 h-4" />
        </Button>
      </div>
    </div>

    <div className="flex-1 overflow-y-auto p-6">
      {chat.type === 'user' ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Send className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Start a conversation</h3>
            <p className="text-gray-500">Send a message to begin chatting with {chat.displayName}</p>
          </div>
        </div>
      ) : (
        <>
          {messages.map((message) => (
            <MessageComponent
              key={message.id}
              message={message}
            />
          ))}
          <div ref={messagesEndRef} />
        </>
      )}
    </div>

    <div className="p-6 bg-white border-t border-gray-200">
      <div className="flex space-x-4">
        <Input
          type="text"
          placeholder={chat.type === 'user' ? "Type your first message..." : "Type your message..."}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(e)}
          className="flex-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
        />
        <Button 
          onClick={handleSendMessage}
          size="default"
          disabled={!newMessage.trim()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-lg shadow-sm"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  </div>
  );
} 