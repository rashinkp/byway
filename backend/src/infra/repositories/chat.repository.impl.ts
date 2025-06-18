import { IChatRepository } from '../../app/repositories/chat.repository.interface';
import { Chat } from '../../domain/entities/Chat';
import { ChatId } from '../../domain/value-object/ChatId';
import { UserId } from '../../domain/value-object/UserId';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ChatRepository implements IChatRepository {
  async findById(id: ChatId): Promise<Chat | null> {
    const chat = await prisma.chat.findUnique({
      where: { id: id.value },
      include: { messages: true },
    });
    if (!chat) return null;
    return this.toDomain(chat);
  }

  async findByUser(userId: UserId): Promise<Chat[]> {
    const chats = await prisma.chat.findMany({
      where: {
        OR: [
          { user1Id: userId.value },
          { user2Id: userId.value },
        ],
      },
      include: { messages: true },
    });
    return chats.map(this.toDomain);
  }

  async create(chat: Chat): Promise<void> {
    await prisma.chat.create({
      data: {
        id: chat.id.value,
        user1Id: chat.user1Id.value,
        user2Id: chat.user2Id.value,
        createdAt: chat.createdAt.value,
        updatedAt: chat.updatedAt.value,
      },
    });
  }

  async save(chat: Chat): Promise<void> {
    await prisma.chat.update({
      where: { id: chat.id.value },
      data: {
        user1Id: chat.user1Id.value,
        user2Id: chat.user2Id.value,
        updatedAt: chat.updatedAt.value,
      },
    });
  }

  async getChatBetweenUsers(user1Id: UserId, user2Id: UserId): Promise<Chat | null> {
    const chat = await prisma.chat.findFirst({
      where: {
        OR: [
          { user1Id: user1Id.value, user2Id: user2Id.value },
          { user1Id: user2Id.value, user2Id: user1Id.value },
        ],
      },
      include: { messages: true },
    });
    if (!chat) return null;
    return this.toDomain(chat);
  }

  private toDomain(prismaChat: any): Chat {
    // You may want to map messages as well
    return new Chat(
      new ChatId(prismaChat.id),
      new UserId(prismaChat.user1Id),
      new UserId(prismaChat.user2Id),
      prismaChat.createdAt,
      prismaChat.updatedAt,
      [] // Map messages if needed
    );
  }
} 