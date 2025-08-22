import socket from "@/lib/socket";
import { 
  ChatMessage, 
  Chat, 
  ChatListItem, 
  SendMessageData, 
  CreateChatData, 
  GetChatHistoryData, 
  GetMessagesData, 
  GetMessageData, 
  DeleteMessageData 
} from "@/types/chat";

export const joinChat = (chatId: string) => {
	socket.emit("joinChat", { chatId });
};

export const sendMessage = (
	data: SendMessageData,
	onSuccess?: (message: ChatMessage) => void,
	onError?: (error: { message: string }) => void,
) => {
	if (!socket.connected) {
		if (onError) onError({ message: "Socket not connected" });
		return;
	}

	socket.emit("sendMessage", data);

	if (onSuccess) {
		socket.once("messageSent", onSuccess);
	}

	if (onError) {
		socket.once("error", onError);
	}
};

export const createChat = (
	data: CreateChatData,
	callback?: (chat: Chat) => void,
) => {
	socket.emit("createChat", data);
	if (callback) {
		socket.once("chatCreated", callback);
	}
};

export const getChatHistory = (data: GetChatHistoryData, callback: (history: ChatListItem[]) => void) => {
	socket.emit("getChatHistory", data);
	socket.once("chatHistory", callback);
};

export const listUserChats = (
	data: GetChatHistoryData = {},
	callback: (result: ChatListItem[]) => void,
) => {
	if (!socket.connected) {
		return;
	}

	socket.emit("listUserChats", data);

	socket.once("userChats", (result: ChatListItem[]) => {
		callback(result);
	});
};

export const getMessagesByChat = (
	data: GetMessagesData,
	callback: (messages: ChatMessage[]) => void,
) => {
	socket.emit("getMessagesByChat", data);
	socket.once("messagesByChat", (messages: ChatMessage[]) => {
		callback(messages);
	});
};

export const getMessageById = (data: GetMessageData, callback: (message: ChatMessage) => void) => {
	socket.emit("getMessageById", data);
	socket.once("messageById", callback);
};

export const deleteMessage = (data: DeleteMessageData, callback?: (result: { success: boolean }) => void) => {
	socket.emit("deleteMessage", data);
	if (callback) {
		socket.once("messageDeleted", callback);
	}
};

export const createChatSocket = (
	data: CreateChatData,
	callback?: (chat: Chat) => void,
) => {
	socket.emit("createChat", data);
	if (callback) {
		socket.once("chatCreated", callback);
	}
};

export const markMessagesAsRead = (chatId: string, userId: string) => {
	socket.emit("markMessagesAsRead", { chatId, userId });
};
