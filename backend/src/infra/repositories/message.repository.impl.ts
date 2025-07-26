import { IMessageRepository } from "../../app/repositories/message.repository.interface";
import { Message } from "../../domain/entities/message.entity";
import { MessageId } from "../../domain/value-object/MessageId";
import { ChatId } from "../../domain/value-object/ChatId";
import { UserId } from "../../domain/value-object/UserId";
import { MessageContent } from "../../domain/value-object/MessageContent";
import { Timestamp } from "../../domain/value-object/Timestamp";
import { EnrichedMessageDTO } from "../../domain/dtos/message.dto";
import { MessageType as DomainMessageType } from "../../domain/enum/Message-type.enum";
import { MessageType as PrismaMessageType, PrismaClient } from "@prisma/client";

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
      orderBy: { createdAt: "asc" },
    });
    return messages.map((msg) => this.toDomain(msg));
  }

  async findByChatWithUserData(
    chatId: ChatId,
    limit = 20,
    beforeMessageId?: string
  ): Promise<EnrichedMessageDTO[]> {
    let beforeDate: Date | undefined = undefined;
    if (beforeMessageId) {
      const beforeMsg = await prisma.message.findUnique({
        where: { id: beforeMessageId },
      });
      if (beforeMsg) beforeDate = beforeMsg.createdAt;
    }
    const messages = await prisma.message.findMany({
      where: {
        chatId: chatId.value,
        ...(beforeDate ? { createdAt: { lt: beforeDate } } : {}),
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    // Reverse the messages to get chronological order (oldest first)
    const chronologicalMessages = [...messages].reverse();

    return chronologicalMessages.map((msg) => ({
      id: msg.id,
      chatId: msg.chatId,
      senderId: msg.senderId,
      content: msg.content || undefined,
      imageUrl: msg.imageUrl || undefined,
      audioUrl: msg.audioUrl || undefined,
      type: DomainMessageType[msg.type as keyof typeof DomainMessageType],
      isRead: msg.isRead,
      createdAt: msg.createdAt,
      sender: {
        id: msg.sender.id,
        name: msg.sender.name,
        role: msg.sender.role,
      },
    }));
  }

  async findByIdWithUserData(
    id: MessageId
  ): Promise<EnrichedMessageDTO | null> {
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

    if (!message) return null;

    return {
      id: message.id,
      chatId: message.chatId,
      senderId: message.senderId,
      content: message.content || undefined,
      imageUrl: message.imageUrl || undefined,
      audioUrl: message.audioUrl || undefined,
      type: DomainMessageType[message.type as keyof typeof DomainMessageType],
      isRead: message.isRead,
      createdAt: message.createdAt,
      sender: {
        id: message.sender.id,
        name: message.sender.name,
        role: message.sender.role,
      },
    };
  }

  async create(message: Message): Promise<void> {
    await prisma.message.create({
      data: {
        id: message.id.value,
        chatId: message.chatId.value,
        senderId: message.senderId.value,
        content: message.content?.value || null,
        imageUrl: message.imageUrl?.toString() || null,
        audioUrl: message.audioUrl?.toString() || null,
        type: message.type as PrismaMessageType,
        isRead: message.isRead,
        createdAt: message.createdAt.value,
      },
    });
  }

  async save(message: Message): Promise<void> {
    await prisma.message.update({
      where: { id: message.id.value },
      data: {
        content: message.content?.value || null,
        imageUrl: message.imageUrl?.toString() || null,
        audioUrl: message.audioUrl?.toString() || null,
        type: message.type as PrismaMessageType,
        isRead: message.isRead,
      },
    });
  }

  async delete(id: MessageId): Promise<void> {
    await prisma.message.delete({ where: { id: id.value } });
  }

  async markAllAsRead(chatId: ChatId, userId: UserId): Promise<void> {
    await prisma.message.updateMany({
      where: {
        chatId: chatId.value,
        senderId: { not: userId.value },
        isRead: false,
      },
      data: { isRead: true },
    });
  }

  async getTotalUnreadCount(userId: UserId): Promise<number> {
    // Count all unread messages for this user across all chats
    const count = await prisma.message.count({
      where: {
        isRead: false,
        senderId: { not: userId.value },
        chat: {
          OR: [{ user1Id: userId.value }, { user2Id: userId.value }],
        },
      },
    });
    return count;
  }

  private toDomain(prismaMessage: any): Message {
    return new Message(
      new MessageId(prismaMessage.id),
      new ChatId(prismaMessage.chatId),
      new UserId(prismaMessage.senderId),
      prismaMessage.content ? new MessageContent(prismaMessage.content) : null,
      prismaMessage.imageUrl ? prismaMessage.imageUrl : null,
      prismaMessage.audioUrl ? prismaMessage.audioUrl : null,
      prismaMessage.type,
      prismaMessage.isRead,
      new Timestamp(prismaMessage.createdAt)
    );
  }
}
