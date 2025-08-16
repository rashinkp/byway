import { useCallback } from "react";
import socket from "@/lib/socket";
import { ChatMessage, SendMessageData, CreateChatData, GetChatHistoryData, GetMessagesData, GetMessageData, DeleteMessageData } from "@/types/chat";

export function useChatSocket() {
	// Listen for incoming messages
	const onMessage = useCallback((handler: (msg: ChatMessage) => void) => {
		socket.on("message", handler);
		return () => socket.off("message", handler);
	}, []);

	// Listen for errors
	const onError = useCallback((handler: (err: { message: string }) => void) => {
		socket.on("error", handler);
		return () => socket.off("error", handler);
	}, []);

	// Expose emitters and listeners
	return {
		joinChat: (chatId: string) => socket.emit("join", chatId),
		sendMessage: (data: SendMessageData) => socket.emit("newMessage", data),
		createChat: (data: CreateChatData) => socket.emit("createChat", data),
		getChatHistory: (data: GetChatHistoryData) => socket.emit("getChatHistory", data),
		listUserChats: (data: GetChatHistoryData) => socket.emit("listUserChats", data),
		getMessagesByChat: (data: GetMessagesData) => socket.emit("getMessagesByChat", data),
		getMessageById: (data: GetMessageData) => socket.emit("getMessageById", data),
		deleteMessage: (data: DeleteMessageData) => socket.emit("deleteMessage", data),
		onMessage,
		onError,
	};
}
