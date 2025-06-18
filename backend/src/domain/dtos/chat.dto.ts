import { MessageDTO } from './message.dto';

export class ChatDTO {
  id!: string;
  user1Id!: string;
  user2Id!: string;
  createdAt!: Date;
  updatedAt!: Date;
  messages!: MessageDTO[];
} 