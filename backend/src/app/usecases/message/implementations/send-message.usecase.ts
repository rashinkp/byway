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
    console.log(`🔍 [UseCase] execute called with:`, {
      chatId: input.chatId,
      userId: input.userId,
      senderId: input.senderId,
      content: input.content?.substring(0, 50) + '...',
      timestamp: new Date().toISOString(),
    });
    
    let chatId: ChatId | undefined;
    if (input.chatId) {
      console.log(`🔍 [UseCase] Using provided chatId: ${input.chatId}`);
      chatId = new ChatId(input.chatId);
    } else if (input.userId) {
      console.log(`🔍 [UseCase] No chatId provided, creating/finding chat for userId: ${input.userId}`);
              const senderId = new UserId(input.senderId);
        const recipientId = new UserId(input.userId);
        console.log(`🔍 [UseCase] Looking for existing chat between users:`, {
          senderId: senderId.value,
          recipientId: recipientId.value,
          timestamp: new Date().toISOString(),
        });
        
        let chat = await this._chatRepository.getChatBetweenUsers(
          senderId,
          recipientId
        );
        
                 if (!chat) {
           console.log(`🔍 [UseCase] No existing chat found, creating new chat`);
           try {
             const newChat = new Chat(
               senderId,
               recipientId,
               new Timestamp(new Date()),
               new Timestamp(new Date()),
               []
             );
             console.log(`🔍 [UseCase] Chat object created, attempting to save to repository`);
             chat = await this._chatRepository.create(newChat);
             console.log(`🔍 [UseCase] Repository create result:`, {
               hasChat: !!chat,
               chatId: chat?.id?.value,
               timestamp: new Date().toISOString(),
             });
             
             if (!chat) {
               console.log(`❌ [UseCase] Failed to create chat - repository returned null/undefined`);
               throw new Error("Failed to create chat - repository returned null");
             }
             console.log(`✅ [UseCase] New chat created with ID: ${chat.id?.value || 'unknown'}`);
           } catch (error) {
             console.log(`❌ [UseCase] Error creating chat:`, error);
             throw new Error(`Failed to create chat: ${error}`);
           }
         } else {
           console.log(`✅ [UseCase] Found existing chat with ID: ${chat.id?.value || 'unknown'}`);
         }
         chatId = chat.id;
         console.log(`🔍 [UseCase] Final chatId set to: ${chatId?.value || 'unknown'}`);
         
         if (!chatId) {
           console.log(`❌ [UseCase] Chat ID is null/undefined after chat creation`);
           throw new Error("Chat ID is null/undefined after chat creation");
         }
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

         console.log(`🔍 [UseCase] Creating message with chatId: ${chatId?.value || 'unknown'}`);
     
     if (!chatId) {
       console.log(`❌ [UseCase] Cannot create message - chatId is null/undefined`);
       throw new Error("Cannot create message - chatId is null/undefined");
     }
     
           let message = new Message(
        chatId,
        new UserId(input.senderId),
        input.content ? new MessageContent(input.content) : null,
        input.imageUrl || null,
        input.audioUrl || null,
        messageType,
        false, // isRead
        new Timestamp(new Date())
      );
     
           console.log(`🔍 [UseCase] Message created, attempting to save to repository`);
      try {
        const savedMessage = await this._messageRepository.create(message);
        console.log(`✅ [UseCase] Message saved successfully with ID: ${savedMessage.id?.value || 'unknown'}`);
        // Update the message object with the saved message that has the generated ID
        message = savedMessage;
        console.log(`🔍 [UseCase] Message object updated with saved message:`, {
          hasMessage: !!message,
          messageId: message?.id?.value,
          chatId: message?.chatId?.value,
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        console.log(`❌ [UseCase] Failed to save message:`, error);
        throw new Error("Failed to create message");
      }
    
         console.log(`🔍 [UseCase] About to update chat, chatId: ${chatId?.value || 'unknown'}`);
     if (chatId && (input.chatId || input.userId)) {
       try {
         let chat = input.chatId
           ? await this._chatRepository.findById(chatId)
           : null;
         if (!chat) {
           console.log(`🔍 [UseCase] Chat not found by ID, looking up by users`);
           chat = await this._chatRepository.getChatBetweenUsers(
             new UserId(input.senderId),
             new UserId(input.userId!)
           );
         }
         if (chat) {
           console.log(`🔍 [UseCase] Updating chat with new timestamp`);
           const updatedChat = new Chat(
             chat.user1Id,
             chat.user2Id,
             chat.createdAt,
             new Timestamp(new Date()),
             chat.messages
           );
           await this._chatRepository.save(updatedChat);
           console.log(`✅ [UseCase] Chat updated successfully`);
         } else {
           console.log(`⚠️ [UseCase] No chat found to update`);
         }
       } catch (error) {
         console.log(`⚠️ [UseCase] Error updating chat:`, error);
         // Continue with message processing even if chat update fails
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
       console.log(`🔍 [UseCase] Attempting to get enriched message data for ID: ${message.id?.value || 'unknown'}`);
       if (!message.id) {
         console.log(`❌ [UseCase] Message ID is null/undefined, cannot get enriched data`);
         throw new Error("Message ID is required to send a message");
       }

       enrichedMessage = await this._messageRepository.findByIdWithUserData(
         message.id
       );
       console.log(`🔍 [UseCase] Enriched message result:`, {
         hasEnrichedMessage: !!enrichedMessage,
         enrichedMessageId: enrichedMessage?.id,
         timestamp: new Date().toISOString(),
       });
           } catch (error) {
        console.log(`⚠️ [UseCase] Error getting enriched message data:`, error);
        console.log(`🔍 [UseCase] Error details:`, {
          errorMessage: error instanceof Error ? error.message : String(error),
          errorType: typeof error,
          errorStack: error instanceof Error ? error.stack : 'No stack trace',
          timestamp: new Date().toISOString(),
        });
        // Handle error silently and use basic message data
      }
    
         if (!enrichedMessage) {
       console.log(`⚠️ [UseCase] Enriched message not available, using fallback`);
       console.log(`🔍 [UseCase] Message object details:`, {
         hasMessage: !!message,
         messageId: message?.id?.value,
         chatId: message?.chatId?.value,
         senderId: message?.senderId?.value,
         content: message?.content?.value,
         timestamp: new Date().toISOString(),
       });
       
       // Map domain entity to DTO when enriched data is not available
       const fallbackResult = {
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
       
               console.log(`✅ [UseCase] Returning fallback message:`, {
          id: fallbackResult.id,
          chatId: fallbackResult.chatId,
          senderId: fallbackResult.senderId,
          receiverId: fallbackResult.receiverId,
          timestamp: new Date().toISOString(),
        });
        
        console.log(`🔍 [UseCase] Final fallback result object:`, fallbackResult);
        console.log(`🔍 [UseCase] About to return fallback result, type:`, typeof fallbackResult);
        return fallbackResult;
     }
    
         const chat = await this._chatRepository.findById(chatId);
     if (!chat) {
       console.log(`⚠️ [UseCase] Chat not found for chatId: ${chatId?.value || 'unknown'}`);
       // Map enriched message to DTO
       const noChatResult = {
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
       
               console.log(`✅ [UseCase] Returning message without chat:`, {
          id: noChatResult.id,
          chatId: noChatResult.chatId,
          senderId: noChatResult.senderId,
          receiverId: noChatResult.receiverId,
          timestamp: new Date().toISOString(),
        });
        
        console.log(`🔍 [UseCase] About to return noChatResult, type:`, typeof noChatResult);
        return noChatResult;
     }
    
    const receiverId =
      chat.user1Id.value === enrichedMessage.senderId
        ? chat.user2Id.value
        : chat.user1Id.value;

         // Map enriched message to DTO
     const result = {
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
     
             console.log(`✅ [UseCase] Returning enriched message:`, {
          id: result.id,
          chatId: result.chatId,
          senderId: result.senderId,
          receiverId: result.receiverId,
          timestamp: new Date().toISOString(),
        });
        
        console.log(`🔍 [UseCase] About to return enriched result, type:`, typeof result);
        return result;
  }
}
