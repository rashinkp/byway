import { sendMessage } from '../../services/socketChat';
import { Message } from '../../types/chat';

export const sendMessageSocket = (
  data: { chatId: string; content: string },
  callback?: (message: Message) => void
) => {
  sendMessage(data, callback);
}; 