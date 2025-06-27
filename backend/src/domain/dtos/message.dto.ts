import { MessageType } from "../enum/Message-type.enum";


// Enriched message DTO that matches Prisma structure
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