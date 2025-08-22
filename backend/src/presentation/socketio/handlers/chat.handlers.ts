import { Socket, Server as SocketIOServer } from 'socket.io';
import { socketHandler } from '../socket.utils';
import { ChatController } from '../../http/controllers/chat.controller';
import { ChatData } from '../types/socket-data.types';

interface CreateChatData {
  user1Id: string;
  user2Id: string;
}


interface GetChatHistoryData {
  user1Id: string;
  user2Id: string;
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  filter?: string;

  [key: string]: string | number | boolean | undefined;
}


interface ListUserChatsData {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  filter?: string;
}

export function registerChatHandlers(socket: Socket, io: SocketIOServer, chatController: ChatController) {
  socket.on(
    "createChat",
    socketHandler<CreateChatData>(async (data) => {
      const chat = await chatController.handleCreateChat(data);
      return chat;
    }, "chatCreated")
  );

  socket.on(
    "getChatHistory",
    socketHandler<GetChatHistoryData>(async (data) => {
      const query: Record<string, string | number | boolean> = {
        user1Id: data.user1Id,
        user2Id: data.user2Id,
      };
      if (data.page !== undefined) query.page = data.page;
      if (data.limit !== undefined) query.limit = data.limit;
      if (data.search) query.search = data.search;
      if (data.sort) query.sort = data.sort;
      if (data.filter) query.filter = data.filter;

      const chat = await chatController.getChatHistory({ query });
      return chat;
    }, "chatHistory")
  );

  socket.on(
    "listUserChats",
    socketHandler<ListUserChatsData>(async (data, socket) => {
      if (!socket.data.user) {
        socket.emit("error", {
          message: "Authentication required to list chats.",
        });
        return;
      }
      const userId = socket.data.user.id;
      const page = data.page || 1;
      const limit = data.limit || 10;
      const search = data.search || undefined;
      const sort = data.sort || undefined;
      const filter = data.filter || undefined;

      const query: Record<string, string | number | boolean> = {
        userId,
        page,
        limit,
      };

      if (search !== undefined) query.search = search;
      if (sort !== undefined) query.sort = sort;
      if (filter !== undefined) query.filter = filter;

      const result = await chatController.listUserChats({ query, params: {} });
      return result;
    }, "userChats")
  );

  socket.on(
    "getMessagesByChat",
    socketHandler<ChatData>(async (data) => {
      const chatId = data.chatId;
      const limit = data.limit || 20;
      const query: Record<string, string | number | boolean> = {
        chatId,
        limit,
      };

      if (data.beforeMessageId !== undefined) {
        query.beforeMessageId = data.beforeMessageId;
      }

      const messages = await chatController.getMessagesByChat({
        query,
        params: {},
      });

      return messages;
    }, "messagesByChat")
  );
} 