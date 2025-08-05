import { MessageType } from "@prisma/client";

export interface MessageRecord {
  id: string;
  chatId: string;
  senderId: string;
  content?: string | null;
  imageUrl?: string | null;
  audioUrl?: string | null;
  isRead: boolean;
  type: MessageType;
  createdAt: Date;
} 