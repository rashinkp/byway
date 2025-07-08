import { MessageId } from "@/domain/value-object/MessageId";
import { Message } from "../../domain/entities/Message";
import { ChatId } from "@/domain/value-object/ChatId";
import { EnrichedMessageDTO } from "../../domain/dtos/message.dto";
import { UserId } from "@/domain/value-object/UserId";

export interface IMessageRepository {
  findById(id: MessageId): Promise<Message | null>;
  findByChat(chatId: ChatId): Promise<Message[]>;
  findByChatWithUserData(
    chatId: ChatId,
    limit?: number,
    beforeMessageId?: string
  ): Promise<EnrichedMessageDTO[]>;
  findByIdWithUserData(id: MessageId): Promise<EnrichedMessageDTO | null>;
  create(message: Message): Promise<void>;
  save(message: Message): Promise<void>;
  delete(id: MessageId): Promise<void>;
  markAllAsRead(chatId: ChatId, userId: UserId): Promise<void>;
  getTotalUnreadCount(userId: UserId): Promise<number>;
}
