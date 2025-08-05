import { MessageRecord } from "../records/message.record";

export interface IMessageRepository {
  findById(id: string): Promise<MessageRecord | null>;
  findByChat(chatId: string): Promise<MessageRecord[]>;
  create(message: MessageRecord): Promise<MessageRecord>;
  save(message: MessageRecord): Promise<MessageRecord>;
  findByIdWithUserData(id: string): Promise<MessageRecord | null>;
  findByChatWithUserData(chatId: string): Promise<MessageRecord[]>;
  getTotalUnreadCount(userId: string): Promise<number>;
}
