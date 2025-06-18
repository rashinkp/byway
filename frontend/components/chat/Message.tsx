import React from 'react';
import { Message as MessageType } from '@/types/chat';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';

interface MessageProps {
  message: MessageType;
}

export function Message({ message }: MessageProps) {
  const isInstructor = message.isInstructor;

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-600';
      case 'instructor':
        return 'bg-blue-100 text-blue-600';
      case 'user':
        return 'bg-green-100 text-green-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
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
    <div className={`flex ${isInstructor ? 'justify-start' : 'justify-end'} mb-6`}>
    <div className={`max-w-[70%] ${isInstructor ? 'order-1' : 'order-2'}`}>
      <div
        className={`rounded-2xl px-4 py-3 ${
          isInstructor
            ? 'bg-white border border-gray-200 shadow-sm'
            : 'bg-blue-600 text-white shadow-md'
        }`}
      >
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center space-x-2">
            <span className={`text-xs font-medium ${
              isInstructor ? 'text-gray-600' : 'text-blue-100'
            }`}>
              {message.senderName}
            </span>
            <Badge className={`text-xs px-2 py-0.5 ${getRoleBadgeColor(message.senderRole)}`}>
              {message.senderRole.charAt(0).toUpperCase() + message.senderRole.slice(1)}
            </Badge>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-3 h-3 text-gray-400" />
            <span className={`text-xs ${
              isInstructor ? 'text-gray-400' : 'text-blue-200'
            }`}>
              {message.timestamp}
            </span>
          </div>
        </div>
        <p className={`text-sm leading-relaxed ${
          isInstructor ? 'text-gray-900' : 'text-white'
        }`}>
          {message.content}
        </p>
      </div>
    </div>

    <div className={`flex-shrink-0 ${isInstructor ? 'order-2 ml-3' : 'order-1 mr-3'}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getRoleColor(message.senderRole)}`}>
        <span className="text-xs font-semibold">
          {message.senderName.charAt(0).toUpperCase()}
        </span>
      </div>
    </div>
  </div>
  );
} 