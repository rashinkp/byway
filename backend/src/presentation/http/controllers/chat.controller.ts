import { BaseController } from "./base.controller";
import { IHttpErrors } from "../interfaces/http-errors.interface";
import { IHttpSuccess } from "../interfaces/http-success.interface";
import { ISendMessageUseCase } from "../../../app/usecases/message/interfaces/send-message.usecase.interface";
import { ICreateChatUseCase } from "../../../app/usecases/chat/interfaces/create-chat.usecase.interface";
import { IListUserChatsUseCase } from "../../../app/usecases/chat/interfaces/list-user-chats.usecase.interface";
import { IGetChatHistoryUseCase } from "../../../app/usecases/chat/interfaces/get-chat-history.usecase.interface";
import { IGetMessagesByChatUseCase } from "../../../app/usecases/message/interfaces/get-messages-by-chat.usecase.interface";
import { IGetMessageByIdUseCase } from "../../../app/usecases/message/interfaces/get-message-by-id.usecase.interface";
import { IDeleteMessageUseCase } from "../../../app/usecases/message/interfaces/delete-message.usecase.interface";
import { IMarkReadMessagesUseCase } from "../../../app/usecases/message/interfaces/mark-read-messages.usecase.interface";
import { UserId } from "../../../domain/value-object/UserId";
import { ChatId } from "../../../domain/value-object/ChatId";
import { MessageId } from "../../../domain/value-object/MessageId";
import { IHttpRequest } from "../interfaces/http-request.interface";
import { IHttpResponse } from "../interfaces/http-response.interface";
import {
  sendMessageSocketSchema,
  createChatSchema,
  getChatHistorySchema,
  listUserChatsSchema,
  getMessagesByChatSchema,
  getMessageByIdSchema,
  deleteMessageSchema,
} from "../../validators/chat.validators";
import { IGetTotalUnreadCountUseCase } from "../../../app/usecases/message/interfaces/get-total-unread-count.usecase.interface";
import { SendMessageBodyDTO } from "../../../app/dtos/chat.dto";

interface SendMessageSocketData {
  chatId?: string;
  userId: string;
  senderId: string;
  content?: string;
  imageUrl?: string;
  audioUrl?: string;
}

interface CreateChatSocketData {
  user1Id: string;
  user2Id: string;
}

export class ChatController extends BaseController {
  constructor(
    private sendMessageUseCase: ISendMessageUseCase,
    private createChatUseCase: ICreateChatUseCase,
    private listUserChatsUseCase: IListUserChatsUseCase,
    private getChatHistoryUseCase: IGetChatHistoryUseCase,
    private getMessagesByChatUseCase: IGetMessagesByChatUseCase,
    private getMessageByIdUseCase: IGetMessageByIdUseCase,
    private deleteMessageUseCase: IDeleteMessageUseCase,
    private markReadMessagesUseCase: IMarkReadMessagesUseCase,
    private getTotalUnreadCountUseCase: IGetTotalUnreadCountUseCase,
    httpErrors: IHttpErrors,
    httpSuccess: IHttpSuccess
  ) {
    super(httpErrors, httpSuccess);
  }

  async handleNewMessage(socketData: SendMessageSocketData) {
    
    const validated = sendMessageSocketSchema.parse(socketData);
    const { content, imageUrl, audioUrl } = validated;
    const senderId = socketData.senderId;
    const userId = socketData.userId;
    
    // Prepare the input for the use case
    const useCaseInput: any = {
      userId,
      senderId,
      content,
      imageUrl,
      audioUrl,
    };
    
    // Only include chatId if it exists in validated data
    if (validated.chatId) {
      useCaseInput.chatId = validated.chatId;
    }
    
    const message = await this.sendMessageUseCase.execute(useCaseInput);
    
    return message;
  }

  async handleCreateChat(socketData: CreateChatSocketData) {
    const validated = createChatSchema.parse(socketData);
    const chat = await this.createChatUseCase.execute(
      new UserId(validated.user1Id),
      new UserId(validated.user2Id)
    );
    return chat;
  }

  // HTTP endpoint handlers
  async getChatHistory(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      const validated = getChatHistorySchema.parse(request.query);
      const chat = await this.getChatHistoryUseCase.execute(
        new UserId(validated.user1Id),
        new UserId(validated.user2Id)
      );
      return this.success_200(chat, "Chat history retrieved successfully");
    });
  }

  async listUserChats(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      const validated = listUserChatsSchema.parse(request.query);

      const page = validated.page || 1;
      const limit = validated.limit || 10;
      const search = validated.search || undefined;
      const sort = validated.sort || undefined;
      const filter = validated.filter || undefined;

      const result = await this.listUserChatsUseCase.execute(
        new UserId(validated.userId),
        page,
        limit,
        search,
        sort,
        filter
      );

      return this.success_200(result, "User chats retrieved successfully");
    });
  }

  async createChat(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      const validated = createChatSchema.parse(request.body);
      const chat = await this.createChatUseCase.execute(
        new UserId(validated.user1Id),
        new UserId(validated.user2Id)
      );
      return this.success_201(chat, "Chat created successfully");
    });
  }

  async sendMessage(
    httpRequest: IHttpRequest<SendMessageBodyDTO>
  ): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      const { chatId, userId, content } = request.body as SendMessageBodyDTO;
      const senderId = request.user?.id;
      if (!senderId) {
        return this.httpErrors.error_401("Unauthorized: No user id");
      }
      const message = await this.sendMessageUseCase.execute({
        chatId,
        userId,
        senderId,
        content,
      });
      return this.success_201(message, "Message sent successfully");
    });
  }

  async getMessagesByChat(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      const validated = getMessagesByChatSchema.parse(request.query);
      const limit = validated.limit || 20;
      const beforeMessageId = validated.beforeMessageId || undefined;
      const messages = await this.getMessagesByChatUseCase.execute(
        new ChatId(validated.chatId),
        limit,
        beforeMessageId
      );
      return this.success_200(messages, "Messages retrieved successfully");
    });
  }

  async getMessageById(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      const validated = getMessageByIdSchema.parse(request.params);
      const message = await this.getMessageByIdUseCase.execute(
        new MessageId(validated.messageId)
      );
      return this.success_200(message, "Message retrieved successfully");
    });
  }

  async deleteMessage(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      const validated = deleteMessageSchema.parse(request.params);
      await this.deleteMessageUseCase.execute(
        new MessageId(validated.messageId)
      );
      return this.success_200({}, "Message deleted successfully");
    });
  }

  async getChatBetweenUsers(senderId: string, recipientId: string) {
    return this.getChatHistoryUseCase.execute(
      new UserId(senderId),
      new UserId(recipientId)
    );
  }

  async createChatBetweenUsers(senderId: string, recipientId: string) {
    return this.createChatUseCase.execute(
      new UserId(senderId),
      new UserId(recipientId)
    );
  }

  // Efficiently get only the participants of a chat by chatId
  async getChatParticipantsById(
    chatId: string
  ): Promise<{ user1Id: string; user2Id: string } | null> {
    return this.listUserChatsUseCase.getChatParticipantsById(chatId);
  }

  async markMessagesAsRead(socketData: { chatId: string; userId: string }) {
    await this.markReadMessagesUseCase.execute(
      new ChatId(socketData.chatId),
      new UserId(socketData.userId)
    );
    return { success: true };
  }

  // Add this method to ChatController
  async getTotalUnreadCount(userId: string) {
    return this.getTotalUnreadCountUseCase.execute(new UserId(userId));
  }
}
