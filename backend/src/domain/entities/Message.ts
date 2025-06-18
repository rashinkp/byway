import { MessageId } from '../value-object/MessageId';
import { ChatId } from '../value-object/ChatId';
import { UserId } from '../value-object/UserId';
import { MessageContent } from '../value-object/MessageContent';
import { Timestamp } from '../value-object/Timestamp';

export class Message {
  constructor(
    public readonly id: MessageId,
    public readonly chatId: ChatId,
    public readonly senderId: UserId,
    public readonly content: MessageContent,
    public readonly createdAt: Timestamp
  ) {}

  // Business logic: Check if the message is from a specific user
  isFromUser(userId: UserId): boolean {
    return this.senderId.value === userId.value;
  }
} 