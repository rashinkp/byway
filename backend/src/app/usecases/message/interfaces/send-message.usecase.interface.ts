import { MessageResponseDTO } from "@/app/dtos/chat.dto";

export interface SendMessageInput {
  chatId?: string;
  userId?: string; // recipient
  senderId: string;
  content?: string;
  imageUrl?: string;
  audioUrl?: string;
}

export interface ISendMessageUseCase {
  execute(input: SendMessageInput): Promise<MessageResponseDTO>;
}
