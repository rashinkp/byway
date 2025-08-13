import { MessageType } from "../enum/Message-type.enum";

// Domain interfaces for repositories (not DTOs)
export interface IMessageWithUserData {
  id: string;
  chatId: string;
  senderId: string;
  content?: string;
  imageUrl?: string;
  audioUrl?: string;
  isRead: boolean;
  type: MessageType;
  createdAt: Date;
  sender: {
    id: string;
    name: string;
    role: string;
  };
}

// Input DTO for sending messages
export interface SendMessageInputDTO {
  chatId?: string;
  userId?: string; // recipient
  senderId: string;
  content?: string;
  imageUrl?: string;
  audioUrl?: string;
}

// Output DTO for message responses
export interface MessageResponseDTO {
  id: string;
  chatId: string;
  senderId: string;
  receiverId: string; // The other user in the one-to-one chat
  content?: string; // Optional, as messages may only contain media
  imageUrl?: string; // S3 link for image
  audioUrl?: string; // S3 link for audio
  isRead: boolean; // Whether the message has been read
  type: MessageType;
  timestamp: string; // ISO string for createdAt
}

// DTO for single message by ID
export interface MessageByIdResponseDTO {
  id: string;
  chatId: string;
  senderId: string;
  content?: string;
  imageUrl?: string;
  audioUrl?: string;
  isRead: boolean;
  type: MessageType;
  createdAt: string;
  sender: {
    id: string;
    name: string;
    role: string;
  };
}

// DTO for unread count response
export interface UnreadCountResponseDTO {
  count: number;
}

// DTO for mark read response
export interface MarkReadResponseDTO {
  success: boolean;
  updatedCount: number;
}

// DTO for delete message response
export interface DeleteMessageResponseDTO {
  success: boolean;
  messageId: string;
}

// Enriched message DTO that matches Prisma structure (keeping for backward compatibility)
export class EnrichedMessageDTO {
  id!: string;
  chatId!: string;
  senderId!: string;
  content?: string; // Optional, as messages may only contain media
  imageUrl?: string; // S3 link for image
  audioUrl?: string; // S3 link for audio
  isRead!: boolean; // Whether the message has been read
  type!: MessageType;
  createdAt!: Date;
  sender!: {
    id: string;
    name: string;
    role: string;
  };
}

