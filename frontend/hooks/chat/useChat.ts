import { sendMessage } from "../../services/socketChat";
import { Message } from "../../types/chat";

export const sendMessageSocket = (
	data: {
		chatId?: string;
		content: string;
		userId?: string;
		imageUrl?: string;
		audioUrl?: string;
	},
	callback?: (message: Message) => void,
) => {
	sendMessage(data, callback);
};
