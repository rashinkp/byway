import { ISendMessageUseCase } from '../interfaces/send-message.usecase.interface';
import { IChatRepository } from '../../../repositories/chat.repository.interface';
import { IMessageRepository } from '../../../repositories/message.repository.interface';
import { ChatId } from '../../../../domain/value-object/ChatId';
import { UserId } from '../../../../domain/value-object/UserId';
import { MessageContent } from '../../../../domain/value-object/MessageContent';
import { Message } from '../../../../domain/entities/Message';
import { MessageId } from '../../../../domain/value-object/MessageId';
import { Timestamp } from '../../../../domain/value-object/Timestamp';

export class SendMessageUseCase implements ISendMessageUseCase {
  constructor(
    private readonly chatRepository: IChatRepository,
    private readonly messageRepository: IMessageRepository
  ) {}

  async execute(chatId: ChatId, senderId: UserId, content: MessageContent): Promise<Message> {
    const chat = await this.chatRepository.findById(chatId);
    if (!chat) throw new Error('Chat not found');
    const message = new Message(
      Math.random().toString(36).substring(2, 15) as unknown as MessageId,
      chatId,
      senderId,
      content,
      new Timestamp(new Date())
    );
    chat.addMessage(message);
    await this.messageRepository.create(message);
    await this.chatRepository.save(chat);
    return message;
  }
} 