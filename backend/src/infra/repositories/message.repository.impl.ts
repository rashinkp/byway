import { IMessageRepository } from "../../app/repositories/message.repository.interface";
import { Message } from "../../domain/entities/message.entity";
import { MessageId } from "../../domain/value-object/MessageId";
import { ChatId } from "../../domain/value-object/ChatId";
import { UserId } from "../../domain/value-object/UserId";
import { IMessageWithUserData } from "../../domain/types/message.interface";
import { MessageType as DomainMessageType, MessageType } from "../../domain/enum/Message-type.enum";
import { MessageType as PrismaMessageType, PrismaClient } from "@prisma/client";

export class MessageRepository implements IMessageRepository {
  constructor(private _prisma: PrismaClient) { }
  
  async findById(id: MessageId): Promise<Message | null> {
    const message = await this._prisma.message.findUnique({
      where: { id: id.value },
    });
    if (!message) return null;

    return Message.fromPersistence(message as unknown as {
      chatId: string;
      senderId: string;
      content: string | null;
      imageUrl: string | null;
      audioUrl: string | null;
      type: string;
      isRead: boolean;
      createdAt: Date;
      id?: string;
    });
  }

  async findByChat(chatId: ChatId): Promise<Message[]> {
    const messages = await this._prisma.message.findMany({
      where: { chatId: chatId.value },
      orderBy: { createdAt: "asc" },
    });
    return messages.map((msg) =>
      Message.fromPersistence(msg as unknown as {
        chatId: string;
        senderId: string;
        content: string | null;
        imageUrl: string | null;
        audioUrl: string | null;
        type: string;
        isRead: boolean;
        createdAt: Date;
        id?: string;
      })
    );
  }

  async findByChatWithUserData(
    chatId: ChatId,
    limit = 20,
    beforeMessageId?: string
  ): Promise<IMessageWithUserData[]> {
    let beforeDate: Date | undefined = undefined;
    if (beforeMessageId) {
      const beforeMsg = await this._prisma.message.findUnique({
        where: { id: beforeMessageId },
      });
      if (beforeMsg) beforeDate = beforeMsg.createdAt;
    }
    const messages = await this._prisma.message.findMany({
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
  ): Promise<IMessageWithUserData | null> {
    const message = await this._prisma.message.findUnique({
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
    // Use a transaction to create the message and update the chat's updatedAt
    await this._prisma.$transaction(async (tx) => {
      // Create the message
      await tx.message.create({
        data: {
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

      // Update the chat's updatedAt field to the message's createdAt time
      await tx.chat.update({
        where: { id: message.chatId.value },
        data: { updatedAt: message.createdAt.value },
      });
    });
  }

  async save(message: Message): Promise<void> {
    await this._prisma.message.update({
      where: { id: message.id?.value },
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
    await this._prisma.message.delete({ where: { id: id.value } });
  }

  async markAllAsRead(chatId: ChatId, userId: UserId): Promise<number> {
    const result = await this._prisma.message.updateMany({
      where: {
        chatId: chatId.value,
        senderId: { not: userId.value },
        isRead: false,
      },
      data: { isRead: true },
    });
    return result.count;
  }

  async getTotalUnreadCount(userId: UserId): Promise<number> {
    // Count all unread messages for this user across all chats
    const count = await this._prisma.message.count({
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

  // Conversion handled by Message.fromPersistence
}
