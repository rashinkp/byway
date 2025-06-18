import { MessageId } from '@/domain/value-object/MessageId';
import { Message } from '../../domain/entities/Message';
import { ChatId } from '@/domain/value-object/ChatId';
import { EnrichedMessageDTO } from '../../domain/dtos/message.dto';

export interface IMessageRepository {
  findById(id: MessageId): Promise<Message | null>;
  findByIdWithUserData(id: MessageId): Promise<EnrichedMessageDTO | null>;
  findByChat(chatId: ChatId): Promise<Message[]>;
  findByChatWithUserData(chatId: ChatId): Promise<EnrichedMessageDTO[]>;
  create(message: Message): Promise<void>;
  save(message: Message): Promise<void>;
  delete(id: MessageId): Promise<void>;
} 