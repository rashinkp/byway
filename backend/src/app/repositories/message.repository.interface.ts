import { MessageId } from '@/domain/value-object/MessageId';
import { Message } from '../../domain/entities/Message';
import { ChatId } from '@/domain/value-object/ChatId';

export interface IMessageRepository {
  findById(id: MessageId): Promise<Message | null>;
  findByChat(chatId: ChatId): Promise<Message[]>;
  create(message: Message): Promise<void>;
  save(message: Message): Promise<void>;
  delete(id: MessageId): Promise<void>;
} 