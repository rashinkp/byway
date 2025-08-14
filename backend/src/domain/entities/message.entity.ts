import { MessageId } from '../value-object/MessageId';
import { ChatId } from '../value-object/ChatId';
import { UserId } from '../value-object/UserId';
import { MessageContent } from '../value-object/MessageContent';
import { Timestamp } from '../value-object/Timestamp';
import { MessageType } from '../enum/Message-type.enum';

export class Message {
  constructor(
    public readonly chatId: ChatId,
    public readonly senderId: UserId,
    public readonly content: MessageContent | null,
    public readonly imageUrl: string | null,
    public readonly audioUrl: string | null,
    public readonly type: MessageType,
    public readonly isRead: boolean,
    public readonly createdAt: Timestamp,
    public readonly id?: MessageId,
  ) {}

  isFromUser(userId: UserId): boolean {
    return this.senderId.value === userId.value;
  }

  hasMedia(): boolean {
    return this.imageUrl !== null || this.audioUrl !== null;
  }

  markAsRead(): Message {
    return new Message(
      this.chatId,
      this.senderId,
      this.content,
      this.imageUrl,
      this.audioUrl,
      this.type,
      true,
      this.createdAt
    );
  }

  isTextOnly(): boolean {
    return this.type === MessageType.TEXT && this.content !== null;
  }
} 