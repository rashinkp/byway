import { IMessageRepository } from '../../app/repositories/message.repository.interface';
import { Message } from '../../domain/entities/Message';
import { MessageId } from '../../domain/value-object/MessageId';
import { ChatId } from '../../domain/value-object/ChatId';
import { UserId } from '../../domain/value-object/UserId';
import { MessageContent } from '../../domain/value-object/MessageContent';
import { Timestamp } from '../../domain/value-object/Timestamp';
import { EnrichedMessageDTO } from '../../domain/dtos/message.dto';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class MessageRepository implements IMessageRepository {
  async findById(id: MessageId): Promise<Message | null> {
    const message = await prisma.message.findUnique({
      where: { id: id.value },
    });
    if (!message) return null;
    return this.toDomain(message);
  }

  async findByChat(chatId: ChatId): Promise<Message[]> {
    const messages = await prisma.message.findMany({
      where: { chatId: chatId.value },
      orderBy: { createdAt: 'asc' },
    });
    return messages.map(this.toDomain);
  }

  async findByChatWithUserData(chatId: ChatId): Promise<EnrichedMessageDTO[]> {
    const messages = await prisma.message.findMany({
      where: { chatId: chatId.value },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
    
    return messages as EnrichedMessageDTO[];
  }

  async findByIdWithUserData(id: MessageId): Promise<EnrichedMessageDTO | null> {
    const message = await prisma.message.findUnique({
      where: { id: id.value },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
      },
    });
    
    return message as EnrichedMessageDTO | null;
  }

  async create(message: Message): Promise<void> {
    await prisma.message.create({
      data: {
        id: message.id.value,
        chatId: message.chatId.value,
        senderId: message.senderId.value,
        content: message.content.value,
        createdAt: message.createdAt.value,
      },
    });
  }

  async save(message: Message): Promise<void> {
    await prisma.message.update({
      where: { id: message.id.value },
      data: {
        content: message.content.value,
      },
    });
  }

  async delete(id: MessageId): Promise<void> {
    await prisma.message.delete({ where: { id: id.value } });
  }

  private toDomain(prismaMessage: any): Message {
    return new Message(
      new MessageId(prismaMessage.id),
      new ChatId(prismaMessage.chatId),
      new UserId(prismaMessage.senderId),
      new MessageContent(prismaMessage.content),
      new Timestamp(prismaMessage.createdAt)
    );
  }
} 