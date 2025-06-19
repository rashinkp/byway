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
import { UserId } from "../../../domain/value-object/UserId";
import { ChatId } from "../../../domain/value-object/ChatId";
import { MessageContent } from "../../../domain/value-object/MessageContent";
import { MessageId } from "../../../domain/value-object/MessageId";
import { IHttpRequest } from "../interfaces/http-request.interface";
import { IHttpResponse } from "../interfaces/http-response.interface";
import {
  sendMessageSchema,
  sendMessageSocketSchema,
  createChatSchema,
  getChatHistorySchema,
  listUserChatsSchema,
  getMessagesByChatSchema,
  getMessageByIdSchema,
  deleteMessageSchema,
} from "../../validators/chat.validators";

export class ChatController extends BaseController {
  constructor(
    private sendMessageUseCase: ISendMessageUseCase,
    private createChatUseCase: ICreateChatUseCase,
    private listUserChatsUseCase: IListUserChatsUseCase,
    private getChatHistoryUseCase: IGetChatHistoryUseCase,
    private getMessagesByChatUseCase: IGetMessagesByChatUseCase,
    private getMessageByIdUseCase: IGetMessageByIdUseCase,
    private deleteMessageUseCase: IDeleteMessageUseCase,
    httpErrors: IHttpErrors,
    httpSuccess: IHttpSuccess
  ) {
    super(httpErrors, httpSuccess);
  }

  async handleNewMessage(socketData: any) {
    console.log('[ChatController] handleNewMessage - raw socketData:', socketData);
    const validated = sendMessageSocketSchema.parse(socketData);
    console.log('[ChatController] handleNewMessage - validated:', validated);
    const { chatId, content } = validated;
    const senderId = socketData.senderId;
    const userId = socketData.userId;
    console.log('[ChatController] handleNewMessage - chatId:', chatId, 'userId:', userId, 'senderId:', senderId, 'content:', content);
    const message = await this.sendMessageUseCase.execute({ chatId, userId, senderId, content });
    return message;
  }

  async handleCreateChat(socketData: any) {
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
      console.log('[ChatController] listUserChats - validated data:', validated);
      
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
      console.log('[ChatController] listUserChats - result:', result);
      
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

  async sendMessage(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      const { chatId, userId, content } = request.body;
      const senderId = request.user?.id;
      if (!senderId) {
        return this.httpErrors.error_401('Unauthorized: No user id');
      }
      const message = await this.sendMessageUseCase.execute({ chatId, userId, senderId, content });
      return this.success_201(message, "Message sent successfully");
    });
  }

  async getMessagesByChat(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      const validated = getMessagesByChatSchema.parse(request.query);
      console.log('[ChatController] getMessagesByChat - validated data:', validated);
      
      const messages = await this.getMessagesByChatUseCase.execute(new ChatId(validated.chatId));
      console.log('[ChatController] getMessagesByChat - result:', messages);
      
      return this.success_200(messages, "Messages retrieved successfully");
    });
  }

  async getMessageById(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      const validated = getMessageByIdSchema.parse(request.params);
      const message = await this.getMessageByIdUseCase.execute(new MessageId(validated.messageId));
      return this.success_200(message, "Message retrieved successfully");
    });
  }

  async deleteMessage(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      const validated = deleteMessageSchema.parse(request.params);
      await this.deleteMessageUseCase.execute(new MessageId(validated.messageId));
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
} 