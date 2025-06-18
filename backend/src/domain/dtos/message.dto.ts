import { Role } from '../enum/role.enum';

// Basic message DTO for internal operations
export class MessageDTO {
  id!: string;
  chatId!: string;
  senderId!: string;
  content!: string;
  createdAt!: Date;
}

// Enriched message DTO that matches Prisma structure
export class EnrichedMessageDTO {
  id!: string;
  chatId!: string;
  senderId!: string;
  content!: string;
  createdAt!: Date;
  sender!: {
    id: string;
    name: string;
    role: string;
  };
}

// DTO for creating new messages
export class CreateMessageDTO {
  chatId!: string;
  senderId!: string;
  content!: string;
} 