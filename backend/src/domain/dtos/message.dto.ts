import { Role } from '../enum/role.enum';

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