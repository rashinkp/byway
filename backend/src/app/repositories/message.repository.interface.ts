
import { Message } from "../../domain/entities/message.entity";
import { ChatId } from "../../domain/value-object/ChatId";
import { MessageId } from "../../domain/value-object/MessageId";
import { UserId } from "../../domain/value-object/UserId";
import { IMessageWithUserData } from "../../domain/types/message.interface";

export interface IMessageRepository {
  findById(id: MessageId): Promise<Message | null>;
  findByChat(chatId: ChatId): Promise<Message[]>;
  findByChatWithUserData(
    chatId: ChatId,
    limit?: number,
    beforeMessageId?: string
  ): Promise<IMessageWithUserData[]>;
  findByIdWithUserData(id: MessageId): Promise<IMessageWithUserData | null>;
  create(message: Message): Promise<Message>;
  save(message: Message): Promise<void>;
  delete(id: MessageId): Promise<void>;
  markAllAsRead(chatId: ChatId, userId: UserId): Promise<number>;
  getTotalUnreadCount(userId: UserId): Promise<number>;
}
