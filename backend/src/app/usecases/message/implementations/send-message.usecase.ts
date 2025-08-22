import { ISendMessageUseCase } from "../interfaces/send-message.usecase.interface";
import { IChatRepository } from "../../../repositories/chat.repository.interface";
import { IMessageRepository } from "../../../repositories/message.repository.interface";
import { ChatId } from "../../../../domain/value-object/ChatId";
import { UserId } from "../../../../domain/value-object/UserId";
import { MessageContent } from "../../../../domain/value-object/MessageContent";
import { Message } from "../../../../domain/entities/message.entity";
import { Timestamp } from "../../../../domain/value-object/Timestamp";
import { MessageResponseDTO, SendMessageInputDTO } from "../../../dtos/message.dto";
import { Chat } from "../../../../domain/entities/chat.entity";
import { MessageType } from "../../../../domain/enum/Message-type.enum";

export class SendMessageUseCase implements ISendMessageUseCase {
  constructor(
    private readonly _chatRepository: IChatRepository,
    private readonly _messageRepository: IMessageRepository
  ) {}

  async execute(input: SendMessageInputDTO): Promise<MessageResponseDTO> {
    let chatId: ChatId | undefined;
    if (input.chatId) {
      chatId = new ChatId(input.chatId);
    } else if (input.userId) {
      const senderId = new UserId(input.senderId);
      const recipientId = new UserId(input.userId);
      let chat = await this._chatRepository.getChatBetweenUsers(
        senderId,
        recipientId
      );
      if (!chat) {
        chat = await this._chatRepository.create(
          new Chat(
            senderId,
            recipientId,
            new Timestamp(new Date()),
            new Timestamp(new Date()),
            []
          )
        );
        if (!chat) {
          throw new Error("Failed to create chat");
        }
      }
      chatId = chat.id;
    } else {
      throw new Error("Either chatId or userId must be provided");
    }
    
    // Determine message type
    let messageType: MessageType;
    if (input.imageUrl) {
      messageType = MessageType.IMAGE;
    } else if (input.audioUrl) {
      messageType = MessageType.AUDIO;
    } else {
      messageType = MessageType.TEXT;
    }

    if (!chatId) {
      throw new Error("Chat ID is required to send a message");
    }

    const message = new Message(
      chatId,
      new UserId(input.senderId),
      input.content ? new MessageContent(input.content) : null,
      input.imageUrl || null,
      input.audioUrl || null,
      messageType,
      false, // isRead
      new Timestamp(new Date())
    );
    
    try {
      await this._messageRepository.create(message);
    } catch {
      throw new Error("Failed to create message");
    }
    
    if (chatId && (input.chatId || input.userId)) {
      let chat = input.chatId
        ? await this._chatRepository.findById(chatId)
        : null;
      if (!chat) {
        chat = await this._chatRepository.getChatBetweenUsers(
          new UserId(input.senderId),
          new UserId(input.userId!)
        );
      }
      if (chat) {
        const updatedChat = new Chat(
          chat.user1Id,
          chat.user2Id,
          chat.createdAt,
          new Timestamp(new Date()),
          chat.messages
        );
        await this._chatRepository.save(updatedChat);
      }
    }
    
    let enrichedMessage: { 
      id: string; 
      chatId: string; 
      senderId: string; 
      content?: string; 
      imageUrl?: string; 
      audioUrl?: string; 
      type: string; 
      createdAt: Date; 
    } | null = null;
    try {
      if (!message.id) {
        throw new Error("Message ID is required to send a message");
      }

      enrichedMessage = await this._messageRepository.findByIdWithUserData(
        message.id
      );
    } catch {
      // Handle error silently and use basic message data
    }
    
    if (!enrichedMessage) {
      // Map domain entity to DTO when enriched data is not available
      return {
        id: message?.id?.value || "",
        chatId: message.chatId.value,
        senderId: message.senderId.value,
        receiverId: input.userId || "",
        content: message.content?.value || undefined,
        imageUrl: message.imageUrl || undefined,
        audioUrl: message.audioUrl || undefined,
        isRead: false,
        type: message.type,
        timestamp: message.createdAt.value
          ? new Date(message.createdAt.value).toISOString()
          : "",
      };
    }
    
    const chat = await this._chatRepository.findById(chatId);
    if (!chat) {
      // Map enriched message to DTO
      return {
        id: enrichedMessage.id,
        chatId: enrichedMessage.chatId,
        senderId: enrichedMessage.senderId,
        receiverId: input.userId || "",
        content: enrichedMessage.content || undefined,
        imageUrl: enrichedMessage.imageUrl || undefined,
        audioUrl: enrichedMessage.audioUrl || undefined,
        isRead: false,
        type: enrichedMessage.type as MessageType,
        timestamp: enrichedMessage.createdAt
          ? new Date(enrichedMessage.createdAt).toISOString()
          : "",
      };
    }
    
    const receiverId =
      chat.user1Id.value === enrichedMessage.senderId
        ? chat.user2Id.value
        : chat.user1Id.value;

    // Map enriched message to DTO
    return {
      id: enrichedMessage.id,
      chatId: enrichedMessage.chatId,
      senderId: enrichedMessage.senderId,
      receiverId,
      content: enrichedMessage.content || undefined,
      imageUrl: enrichedMessage.imageUrl || undefined,
      audioUrl: enrichedMessage.audioUrl || undefined,
      isRead: false,
      type: enrichedMessage.type as MessageType,
      timestamp: enrichedMessage.createdAt
        ? new Date(enrichedMessage.createdAt).toISOString()
        : "",
    };
  }
}
