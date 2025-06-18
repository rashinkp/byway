'use client';

import React, { useState } from 'react';
import { ChatList } from '@/components/chat/ChatList';
import { ChatWindow } from '@/components/chat/ChatWindow';
import { Chat } from '@/types/chat';
import { MessageSquare } from 'lucide-react';

// Dummy data for demonstration
const dummyChats: Chat[] = [
  {
    id: '1',
    userName: 'Sarah Johnson',
    userRole: 'instructor',
    lastMessage: 'Thank you for the clarification! The course material is very helpful.',
    lastMessageTime: '2 hours ago',
    unreadCount: 2,
    avatar: '/api/placeholder/40/40',
  },
  {
    id: '2',
    userName: 'Michael Chen',
    userRole: 'user',
    lastMessage: 'I have a question about the pandas library usage in module 3.',
    lastMessageTime: '1 day ago',
    unreadCount: 0,
    avatar: '/api/placeholder/40/40',
  },
  {
    id: '3',
    userName: 'Emily Rodriguez',
    userRole: 'instructor',
    lastMessage: 'The design principles you explained really helped me understand the concept better.',
    lastMessageTime: '3 days ago',
    unreadCount: 1,
    avatar: '/api/placeholder/40/40',
  },
  {
    id: '4',
    userName: 'David Thompson',
    userRole: 'admin',
    lastMessage: 'Can you recommend some additional resources for understanding neural networks?',
    lastMessageTime: '1 week ago',
    unreadCount: 0,
    avatar: '/api/placeholder/40/40',
  },
];

const dummyMessages = [
  {
    id: '1',
    senderId: 'instructor',
    senderName: 'Sarah Johnson',
    senderRole: 'instructor' as const,
    content: 'Hello! How can I help you with the React course today?',
    timestamp: '10:30 AM',
    isInstructor: true,
  },
  {
    id: '2',
    senderId: 'user',
    senderName: 'You',
    senderRole: 'user' as const,
    content: 'Hi Sarah! I have a question about the useState hook implementation.',
    timestamp: '10:32 AM',
    isInstructor: false,
  },
  {
    id: '3',
    senderId: 'instructor',
    senderName: 'Sarah Johnson',
    senderRole: 'instructor' as const,
    content: 'Of course! The useState hook is fundamental in React. What specific part are you having trouble with?',
    timestamp: '10:35 AM',
    isInstructor: true,
  },
  {
    id: '4',
    senderId: 'user',
    senderName: 'You',
    senderRole: 'user' as const,
    content: 'I\'m not sure how to properly update the state when dealing with objects.',
    timestamp: '10:37 AM',
    isInstructor: false,
  },
  {
    id: '5',
    senderId: 'instructor',
    senderName: 'Sarah Johnson',
    senderRole: 'instructor' as const,
    content: 'Great question! When updating objects in state, you need to create a new object reference. Here\'s an example: setUser(prevUser => ({ ...prevUser, name: "New Name" })). This ensures React detects the change and re-renders the component.',
    timestamp: '10:40 AM',
    isInstructor: true,
  },
];

export default function ChatPage() {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(dummyChats[0]);
  const [messages, setMessages] = useState(dummyMessages);

  const handleSendMessage = (content: string) => {
    const newMessage = {
      id: Date.now().toString(),
      senderId: 'user',
      senderName: 'You',
      senderRole: 'user' as const,
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isInstructor: false,
    };
    setMessages([...messages, newMessage]);
  };

  return (
    <div className="flex h-screen w-full">
      <div className="w-80 border-r border-gray-200">
        <ChatList 
          chats={dummyChats}
          selectedChat={selectedChat}
          onSelectChat={setSelectedChat}
        />
      </div>
      
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <ChatWindow
            chat={selectedChat}
            messages={messages}
            onSendMessage={handleSendMessage}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a conversation</h3>
              <p className="text-gray-500">Choose a chat from the list to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 