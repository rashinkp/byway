export interface MessageRecord {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  messageType: "TEXT" | "IMAGE" | "FILE";
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
} 