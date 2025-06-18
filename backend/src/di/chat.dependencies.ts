import { createSharedDependencies } from "./shared.dependencies";
import { ChatRepository } from "../infra/repositories/chat.repository.impl";
import { MessageRepository } from "../infra/repositories/message.repository.impl";
import { SendMessageUseCase } from "../app/usecases/message/implementations/send-message.usecase";
import { CreateChatUseCase } from "../app/usecases/chat/implementations/create-chat.usecase";
import { ListUserChatsUseCase } from "../app/usecases/chat/implementations/list-user-chats.usecase";
import { GetChatHistoryUseCase } from "../app/usecases/chat/implementations/get-chat-history.usecase";
import { GetMessagesByChatUseCase } from "../app/usecases/message/implementations/get-messages-by-chat.usecase";
import { GetMessageByIdUseCase } from "../app/usecases/message/implementations/get-message-by-id.usecase";
import { ChatController } from "../presentation/http/controllers/chat.controller";
import { DeleteMessageUseCase } from "../app/usecases/message/implementations/delete-message.usecase";

export function createChatDependencies(sharedDeps?: ReturnType<typeof createSharedDependencies>) {
  const deps = sharedDeps || createSharedDependencies();
  const chatRepository = new ChatRepository();
  const messageRepository = new MessageRepository();
  const sendMessageUseCase = new SendMessageUseCase(chatRepository, messageRepository);
  const createChatUseCase = new CreateChatUseCase(chatRepository);
  const listUserChatsUseCase = new ListUserChatsUseCase(chatRepository);
  const getChatHistoryUseCase = new GetChatHistoryUseCase(chatRepository);
  const getMessagesByChatUseCase = new GetMessagesByChatUseCase(messageRepository, chatRepository);
  const getMessageByIdUseCase = new GetMessageByIdUseCase(messageRepository);
  const deleteMessageUseCase = new DeleteMessageUseCase(messageRepository);
  const chatController = new ChatController(
    sendMessageUseCase,
    createChatUseCase,
    listUserChatsUseCase,
    getChatHistoryUseCase,
    getMessagesByChatUseCase,
    getMessageByIdUseCase,
    deleteMessageUseCase,
    deps.httpErrors,
    deps.httpSuccess
  );
  return {
    chatController,
    sendMessageUseCase,
    createChatUseCase,
    listUserChatsUseCase,
    getChatHistoryUseCase,
    getMessagesByChatUseCase,
    getMessageByIdUseCase,
    deleteMessageUseCase,
    chatRepository,
    messageRepository,
  };
} 