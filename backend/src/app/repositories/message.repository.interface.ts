import { MessageId } from "@/domain/value-object/MessageId";
import { MessageRecord } from "../records/message.record";
import { ChatId } from "@/domain/value-object/ChatId";
import { UserId } from "@/domain/value-object/UserId";

export interface IMessageRepository {
  findById(id: MessageId): Promise<MessageRecord | null>;
  findByChat(chatId: ChatId): Promise<MessageRecord[]>;
  findByChatWithUserData(options: {
    chatId: ChatId;
    limit?: number;
    beforeMessageId?: string;
  }): Promise<MessageRecord[]>;
  findByIdWithUserData(id: MessageId): Promise<MessageRecord | null>;
  create(message: MessageRecord): Promise<void>;
  save(message: MessageRecord): Promise<void>;
  delete(id: MessageId): Promise<void>;
  markAllAsRead(chatId: ChatId, userId: UserId): Promise<void>;
  getTotalUnreadCount(userId: UserId): Promise<number>;
}
