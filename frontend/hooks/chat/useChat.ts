import { sendMessage } from "../../services/socketChat";
import { ChatMessage as Message } from "../../types/chat";

export const sendMessageSocket = (
	data: {
		chatId?: string; // Make chatId optional for new chats
		content: string;
		userId: string;
		imageUrl?: string;
		audioUrl?: string;
	},
	callback?: (message: Message) => void,
) => {
	sendMessage(data, callback);
};
