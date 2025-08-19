import { Message } from "../../domain/entities/message.entity";
import { ChatId } from "../../domain/value-object/ChatId";
import { MessageId } from "../../domain/value-object/MessageId";
import { UserId } from "../../domain/value-object/UserId";
import { IMessageWithUserData } from "../../domain/types/message.interface";
import { IGenericRepository } from "./generic-repository.interface";

export interface IMessageRepository extends IGenericRepository<Message> {
  findByChat(chatId: ChatId): Promise<Message[]>;
  findByChatWithUserData(
    chatId: ChatId,
    limit?: number,
    beforeMessageId?: string
  ): Promise<IMessageWithUserData[]>;
  findByIdWithUserData(id: MessageId): Promise<IMessageWithUserData | null>;
  save(message: Message): Promise<void>;
  markAllAsRead(chatId: ChatId, userId: UserId): Promise<number>;
  getTotalUnreadCount(userId: UserId): Promise<number>;
}
