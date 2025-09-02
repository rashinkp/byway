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

// Normalize API-wrapped socket payloads
function unwrapArray<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) return payload as T[];
  if (payload && typeof payload === "object") {
    const obj = payload as any;
    if (Array.isArray(obj.items)) return obj.items as T[];
    if (obj.body) {
      if (Array.isArray(obj.body)) return obj.body as T[];
      if (Array.isArray(obj.body.items)) return obj.body.items as T[];
      if (obj.body.data) {
        if (Array.isArray(obj.body.data)) return obj.body.data as T[];
        if (Array.isArray(obj.body.data.items)) return obj.body.data.items as T[];
      }
    }
    if (obj.data) {
      if (Array.isArray(obj.data)) return obj.data as T[];
      if (Array.isArray(obj.data.items)) return obj.data.items as T[];
    }
  }
  return [] as T[];
}

function unwrapObject<T>(payload: unknown): T | null {
  if (payload && typeof payload === "object") {
    const obj = payload as any;
    if (obj.body && typeof obj.body === "object") {
      if (obj.body.data && typeof obj.body.data === "object") return obj.body.data as T;
      return obj.body as T;
    }
    if (obj.data && typeof obj.data === "object") return obj.data as T;
    return obj as T;
  }
  return null;
}

export const joinChat = (chatId: string) => {
	console.debug("[chat][out] joinChat", { chatId });
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

	console.debug("[chat][out] sendMessage", data);
	socket.emit("sendMessage", data);

	if (onSuccess) {
		socket.once("messageSent", (payload: ChatMessage) => {
			console.debug("[chat][in] messageSent", payload);
			onSuccess(payload);
		});
	}

	if (onError) {
		socket.once("error", (err: { message: string }) => {
			console.debug("[chat][in] error", err);
			onError(err);
		});
	}
};

export const createChat = (
	data: CreateChatData,
	callback?: (chat: Chat) => void,
) => {
	console.debug("[chat][out] createChat", data);
	socket.emit("createChat", data);
	if (callback) {
		socket.once("chatCreated", (chat: Chat) => {
			console.debug("[chat][in] chatCreated", chat);
			callback(chat);
		});
	}
};

export const getChatHistory = (data: GetChatHistoryData, callback: (history: ChatListItem[]) => void) => {
	console.debug("[chat][out] getChatHistory", data);
	socket.emit("getChatHistory", data);
	socket.once("chatHistory", (history: unknown) => {
		console.debug("[chat][in] chatHistory", history);
		const normalized = unwrapArray<ChatListItem>(history);
		callback(normalized);
	});
};

export const listUserChats = (
	data: GetChatHistoryData = {},
	callback: (result: ChatListItem[]) => void,
) => {
	if (!socket.connected) {
		return;
	}

	console.debug("[chat][out] listUserChats", data);
	socket.emit("listUserChats", data);

	socket.once("userChats", (result: unknown) => {
		console.debug("[chat][in] userChats", result);
		const normalized = unwrapArray<ChatListItem>(result);
		callback(normalized);
	});
};

export const getMessagesByChat = (
	data: GetMessagesData,
	callback: (messages: ChatMessage[]) => void,
) => {
	console.debug("[chat][out] getMessagesByChat", data);
	socket.emit("getMessagesByChat", data);
	socket.once("messagesByChat", (messages: unknown) => {
		console.debug("[chat][in] messagesByChat", messages);
		const normalized = unwrapArray<ChatMessage>(messages);
		callback(normalized);
	});
};

export const getMessageById = (data: GetMessageData, callback: (message: ChatMessage) => void) => {
	console.debug("[chat][out] getMessageById", data);
	socket.emit("getMessageById", data);
	socket.once("messageById", (message: unknown) => {
		console.debug("[chat][in] messageById", message);
		const normalized = unwrapObject<ChatMessage>(message);
		if (normalized) callback(normalized);
	});
};

export const deleteMessage = (data: DeleteMessageData, callback?: (result: { success: boolean }) => void) => {
	console.debug("[chat][out] deleteMessage", data);
	socket.emit("deleteMessage", data);
	if (callback) {
		socket.once("messageDeleted", (result: { success: boolean }) => {
			console.debug("[chat][in] messageDeleted", result);
			callback(result);
		});
	}
};

export const createChatSocket = (
	data: CreateChatData,
	callback?: (chat: Chat) => void,
) => {
	console.debug("[chat][out] createChatSocket", data);
	socket.emit("createChat", data);
	if (callback) {
		socket.once("chatCreated", (chat: Chat) => {
			console.debug("[chat][in] chatCreated", chat);
			callback(chat);
		});
	}
};

export const markMessagesAsRead = (chatId: string, userId: string) => {
	console.debug("[chat][out] markMessagesAsRead", { chatId, userId });
	socket.emit("markMessagesAsRead", { chatId, userId });
};
