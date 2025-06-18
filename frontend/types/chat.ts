export interface Chat {
  id: string;
  userName: string;
  userRole: 'user' | 'instructor' | 'admin';
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  avatar: string;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'user' | 'instructor' | 'admin';
  content: string;
  timestamp: string;
  isInstructor: boolean;
} 