import { IChatRepository } from "../../app/repositories/chat.repository.interface";
import { Chat } from "../../domain/entities/chat.entity";
import { ChatId } from "../../domain/value-object/ChatId";
import { UserId } from "../../domain/value-object/UserId";
import {
  PaginatedChatListDTO,
  EnhancedChatListItemDTO,
} from "../../domain/dtos/chat.dto";
import { PrismaClient } from "@prisma/client";
import { Role } from "../../domain/enum/role.enum";

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
        OR: [{ user1Id: userId.value }, { user2Id: userId.value }],
      },
      include: { messages: true },
    });
    return chats.map(this.toDomain);
  }

  async findEnhancedChatList(
    userId: UserId,
    page: number = 1,
    limit: number = 10,
    search?: string,
    sort?: string
  ): Promise<PaginatedChatListDTO> {
    const offset = (page - 1) * limit;

    let chatItems: EnhancedChatListItemDTO[] = [];
    if (search) {
      const normalizedSearch = search.trim().toLowerCase();
      const roleMap: Record<string, Role> = {
        admin: Role.ADMIN,
        instructor: Role.INSTRUCTOR,
        user: Role.USER,
      };
      const roleSearch = roleMap[normalizedSearch] || undefined;

      // Find chats where the other user's name or role matches
      const nameOrRoleMatchChats = await prisma.chat.findMany({
        where: {
          OR: [
            {
              AND: [
                { user1Id: userId.value },
                {
                  OR: [
                    {
                      user2: {
                        name: { contains: search, mode: "insensitive" },
                      },
                    },
                    ...(roleSearch
                      ? [{ user2: { role: roleSearch as Role } }]
                      : []),
                  ],
                },
              ],
            },
            {
              AND: [
                { user2Id: userId.value },
                {
                  OR: [
                    {
                      user1: {
                        name: { contains: search, mode: "insensitive" },
                      },
                    },
                    ...(roleSearch
                      ? [{ user1: { role: roleSearch as Role } }]
                      : []),
                  ],
                },
              ],
            },
          ],
        },
        include: {
          user1: { select: { id: true, name: true, role: true, avatar: true } },
          user2: { select: { id: true, name: true, role: true, avatar: true } },
          messages: {
            orderBy: { createdAt: "desc" },
            take: 1,
            include: { sender: { select: { name: true } } },
          },
        },
        orderBy: { updatedAt: "desc" },
        skip: offset,
        take: limit,
      });

      // Find chats where the last message matches (but not already in nameOrRoleMatchChats)
      const nameOrRoleMatchIds = new Set(
        nameOrRoleMatchChats.map((chat) => chat.id)
      );
      const messageMatchChats = await prisma.chat.findMany({
        where: {
          OR: [{ user1Id: userId.value }, { user2Id: userId.value }],
          messages: {
            some: {
              content: { contains: search, mode: "insensitive" },
            },
          },
          NOT: {
            id: { in: Array.from(nameOrRoleMatchIds) },
          },
        },
        include: {
          user1: { select: { id: true, name: true, role: true, avatar: true } },
          user2: { select: { id: true, name: true, role: true, avatar: true } },
          messages: {
            orderBy: { createdAt: "desc" },
            take: 1,
            include: { sender: { select: { name: true } } },
          },
        },
        orderBy: { updatedAt: "desc" },
        skip: 0,
        take: limit,
      });

      // Merge, name/role matches first, then message matches
      const allChats = [...nameOrRoleMatchChats, ...messageMatchChats];

      // Convert to enhanced format as before
      chatItems = await Promise.all(
        allChats.map(async (chat) => {
          const otherUser = chat.user1
            ? chat.user1Id === userId.value
              ? chat.user2
              : chat.user1
            : undefined;
          const lastMessage = chat.messages && chat.messages[0];
          // Count unread messages for this user in this chat
          const unreadCount = await prisma.message.count({
            where: {
              chatId: chat.id,
              senderId: { not: userId.value },
              isRead: false,
            },
          });
          return {
            id: chat.id,
            type: "chat",
            displayName: otherUser?.name || "",
            avatar: otherUser?.avatar || undefined,
            role: otherUser?.role || "",
            lastMessage: lastMessage
              ? {
                  content: lastMessage.content || undefined,
                  imageUrl: lastMessage.imageUrl || undefined,
                  audioUrl: lastMessage.audioUrl || undefined,
                  type: lastMessage.type?.toLowerCase() as
                    | "text"
                    | "image"
                    | "audio",
                }
              : undefined,
            lastMessageTime: lastMessage?.createdAt
              ? this.formatTime(lastMessage.createdAt)
              : undefined,
            unreadCount,
            chatId: chat.id,
            userId: otherUser?.id,
            isOnline: false,
          };
        })
      );
    } else {
      // Default: get user's existing chats with latest messages
      const existingChats = await prisma.chat.findMany({
        where: {
          OR: [{ user1Id: userId.value }, { user2Id: userId.value }],
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
            orderBy: { createdAt: "desc" },
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
        orderBy: { updatedAt: "desc" },
        skip: offset,
        take: limit,
      });
      chatItems = await Promise.all(
        existingChats.map(async (chat) => {
          const otherUser = chat.user1
            ? chat.user1Id === userId.value
              ? chat.user2
              : chat.user1
            : undefined;
          const lastMessage = chat.messages && chat.messages[0];
          // Count unread messages for this user in this chat
          const unreadCount = await prisma.message.count({
            where: {
              chatId: chat.id,
              senderId: { not: userId.value },
              isRead: false,
            },
          });
          return {
            id: chat.id,
            type: "chat",
            displayName: otherUser?.name || "",
            avatar: otherUser?.avatar || undefined,
            role: otherUser?.role || "",
            lastMessage: lastMessage
              ? {
                  content: lastMessage.content || undefined,
                  imageUrl: lastMessage.imageUrl || undefined,
                  audioUrl: lastMessage.audioUrl || undefined,
                  type: lastMessage.type?.toLowerCase() as
                    | "text"
                    | "image"
                    | "audio",
                }
              : undefined,
            lastMessageTime: lastMessage?.createdAt
              ? this.formatTime(lastMessage.createdAt)
              : undefined,
            unreadCount,
            chatId: chat.id,
            userId: otherUser?.id,
            isOnline: false,
          };
        })
      );
    }

    // If we have fewer chats than the limit, fill with other users
    let userItems: EnhancedChatListItemDTO[] = [];
    if (chatItems.length < limit) {
      const remainingSlots = limit - chatItems.length;
      const existingUserIds = new Set([
        userId.value,
        ...chatItems.map((chat: any) => chat.userId),
      ]);
      // Build user where clause for search
      const userWhere: any = {
        id: { notIn: Array.from(existingUserIds) },
        deletedAt: null,
      };
      const normalizedSearch = search ? search.trim().toLowerCase() : "";
      const roleMap: Record<string, Role> = {
        admin: Role.ADMIN,
        instructor: Role.INSTRUCTOR,
        user: Role.USER,
      };
      const roleSearch = roleMap[normalizedSearch] || undefined;
      if (search) {
        userWhere.OR = [
          { name: { contains: search, mode: "insensitive" } },
          ...(roleSearch ? [{ role: roleSearch as Role }] : []),
        ];
      }
      const otherUsers = await prisma.user.findMany({
        where: userWhere,
        select: {
          id: true,
          name: true,
          role: true,
          avatar: true,
        },
        orderBy: [
          sort === "name" ? { name: "asc" } : { role: "asc" },
          { name: "asc" },
        ],
        take: remainingSlots,
        skip: offset,
      });
      userItems = otherUsers.map((user) => ({
        id: `user-${user.id}`,
        type: "user",
        displayName: user.name,
        avatar: user.avatar || undefined,
        role: user.role,
        userId: user.id,
        isOnline: false,
      }));
      chatItems.push(...userItems);
    }

    // Get total count for pagination
    const totalChats = await prisma.chat.count({
      where: {
        OR: [{ user1Id: userId.value }, { user2Id: userId.value }],
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
    console.log(
      "[ChatRepository] Creating chat:",
      chat.user1Id.value,
      chat.user2Id.value
    );
    const created = await prisma.chat.create({
      data: {
        user1Id: chat.user1Id.value,
        user2Id: chat.user2Id.value,
        createdAt: chat.createdAt.value,
        updatedAt: chat.updatedAt.value,
      },
    });
    console.log("[ChatRepository] Chat created in DB:", created.id);
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

  async getChatBetweenUsers(
    user1Id: UserId,
    user2Id: UserId
  ): Promise<Chat | null> {
    console.log(
      "[ChatRepository] getChatBetweenUsers:",
      user1Id.value,
      user2Id.value
    );
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
      console.log("[ChatRepository] No chat found between users");
      return null;
    }
    console.log("[ChatRepository] Found chat:", chat.id);
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
      return "Just now";
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInHours < 168) {
      // 7 days
      return `${Math.floor(diffInHours / 24)}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  }
}
