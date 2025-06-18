import { IChatRepository } from '../../app/repositories/chat.repository.interface';
import { Chat } from '../../domain/entities/Chat';
import { ChatId } from '../../domain/value-object/ChatId';
import { UserId } from '../../domain/value-object/UserId';
import { PaginatedChatListDTO, EnhancedChatListItemDTO } from '../../domain/dtos/chat.dto';
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

  async findEnhancedChatList(userId: UserId, page: number = 1, limit: number = 10): Promise<PaginatedChatListDTO> {
    const offset = (page - 1) * limit;
    
    // Get user's existing chats with latest messages
    const existingChats = await prisma.chat.findMany({
      where: {
        OR: [
          { user1Id: userId.value },
          { user2Id: userId.value },
        ],
      },
      include: {
        user1: {
          select: {
            id: true,
            name: true,
            role: true,
            avatar: true,
          },
        },
        user2: {
          select: {
            id: true,
            name: true,
            role: true,
            avatar: true,
          },
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: {
            sender: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    // Convert chats to enhanced format
    const chatItems: EnhancedChatListItemDTO[] = existingChats.map(chat => {
      const otherUser = chat.user1Id === userId.value ? chat.user2 : chat.user1;
      const lastMessage = chat.messages[0];
      
      return {
        id: chat.id,
        type: 'chat',
        displayName: otherUser.name,
        avatar: otherUser.avatar || undefined,
        role: otherUser.role,
        lastMessage: lastMessage?.content,
        lastMessageTime: lastMessage?.createdAt ? this.formatTime(lastMessage.createdAt) : undefined,
        unreadCount: 0, // TODO: Implement unread count
        chatId: chat.id,
        userId: otherUser.id,
        isOnline: false, // TODO: Implement online status
      };
    });

    // If we have fewer chats than the limit, fill with other users
    if (chatItems.length < limit) {
      const remainingSlots = limit - chatItems.length;
      
      // Get user IDs that are already in chats
      const existingUserIds = new Set([
        userId.value,
        ...existingChats.map(chat => 
          chat.user1Id === userId.value ? chat.user2Id : chat.user1Id
        )
      ]);

      // Get other users ordered by role (ADMIN -> INSTRUCTOR -> USER) and then alphabetically
      const otherUsers = await prisma.user.findMany({
        where: {
          id: { notIn: Array.from(existingUserIds) },
          deletedAt: null,
        },
        select: {
          id: true,
          name: true,
          role: true,
          avatar: true,
        },
        orderBy: [
          {
            role: 'asc', // ADMIN comes first, then INSTRUCTOR, then USER
          },
          {
            name: 'asc', // Then alphabetically by name
          },
        ],
        take: remainingSlots,
        skip: offset,
      });

      const userItems: EnhancedChatListItemDTO[] = otherUsers.map(user => ({
        id: `user-${user.id}`,
        type: 'user',
        displayName: user.name,
        avatar: user.avatar || undefined,
        role: user.role,
        userId: user.id,
        isOnline: false, // TODO: Implement online status
      }));

      chatItems.push(...userItems);
    }

    // Get total count for pagination
    const totalChats = await prisma.chat.count({
      where: {
        OR: [
          { user1Id: userId.value },
          { user2Id: userId.value },
        ],
      },
    });

    const totalUsers = await prisma.user.count({
      where: {
        id: { not: userId.value },
        deletedAt: null,
      },
    });

    const totalCount = totalChats + totalUsers;
    const hasMore = offset + limit < totalCount;

    return {
      items: chatItems,
      totalCount,
      hasMore,
      nextPage: hasMore ? page + 1 : undefined,
    };
  }

  async create(chat: Chat): Promise<Chat> {
    console.log('[ChatRepository] Creating chat:', chat.user1Id.value, chat.user2Id.value);
    const created = await prisma.chat.create({
      data: {
        user1Id: chat.user1Id.value,
        user2Id: chat.user2Id.value,
        createdAt: chat.createdAt.value,
        updatedAt: chat.updatedAt.value,
      },
    });
    console.log('[ChatRepository] Chat created in DB:', created.id);
    return this.toDomain(created);
  }

  async save(chat: Chat): Promise<void> {
    await prisma.chat.update({
      where: { id: chat.id.value },
      data: {
        updatedAt: chat.updatedAt.value,
      },
    });
  }

  async getChatBetweenUsers(user1Id: UserId, user2Id: UserId): Promise<Chat | null> {
    console.log('[ChatRepository] getChatBetweenUsers:', user1Id.value, user2Id.value);
    const chat = await prisma.chat.findFirst({
      where: {
        OR: [
          { user1Id: user1Id.value, user2Id: user2Id.value },
          { user1Id: user2Id.value, user2Id: user1Id.value },
        ],
      },
      include: { messages: true },
    });
    if (!chat) {
      console.log('[ChatRepository] No chat found between users');
      return null;
    }
    console.log('[ChatRepository] Found chat:', chat.id);
    return this.toDomain(chat);
  }

  private toDomain(prismaChat: any): Chat {
    return new Chat(
      new ChatId(prismaChat.id),
      new UserId(prismaChat.user1Id),
      new UserId(prismaChat.user2Id),
      prismaChat.createdAt,
      prismaChat.updatedAt,
      [] // Map messages if needed
    );
  }

  private formatTime(date: Date): string {
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInHours < 168) { // 7 days
      return `${Math.floor(diffInHours / 24)}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  }
} 