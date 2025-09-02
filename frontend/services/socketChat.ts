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
	socket.emit("join", chatId);
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

	// emit sendMessage

	let settled = false;

	// Prepare a scoped error handler so we can remove it after success
	const handleSendError = (errPayload: any) => {
		if (settled) return;
		const message =
			errPayload?.message ||
			errPayload?.body?.message ||
			errPayload?.body?.error ||
			errPayload?.error ||
			"Failed to send message.";
		// ignore noisy global error
		onError?.({ message });
		cleanup();
	};

	const handleSuccess = (label: string) => (payload: unknown) => {
		if (settled) return;
		// handle success event
		const normalized = unwrapObject<ChatMessage>(payload);
		if (normalized) {
			settled = true;
			onSuccess?.(normalized);
			cleanup();
		}
	};

	const cleanup = () => {
		socket.off("sendMessageError", handleSendError);
		socket.off("messageSent", onMessageSent);
		socket.off("message", onMessageGeneric);
		socket.off("newMessage", onNewMessage);
		socket.off("messageCreated", onMessageCreated);
	};

	const onMessageSent = handleSuccess("messageSent");
	const onMessageGeneric = handleSuccess("message");
	const onNewMessage = handleSuccess("newMessage");
	const onMessageCreated = handleSuccess("messageCreated");

	// Register listeners before emit
	socket.once("sendMessageError", handleSendError);
	socket.once("messageSent", onMessageSent);
	socket.once("message", onMessageGeneric);
	socket.once("newMessage", onNewMessage);
	socket.once("messageCreated", onMessageCreated);

	// Emit after listeners are in place with optional ack
	socket.emit("sendMessage", data, (ack: unknown) => {
		console.log("[chat][in] sendMessage ack", ack);
		if (!settled) {
			const normalized = unwrapObject<ChatMessage>(ack);
			if (normalized) {
				settled = true;
				onSuccess?.(normalized);
				cleanup();
			}
		}
	});
};

export const createChat = (
	data: CreateChatData,
	callback?: (chat: Chat) => void,
) => {
	socket.emit("createChat", data);
	if (callback) {
		socket.once("chatCreated", (chat: Chat) => {
			console.debug("[chat][in] chatCreated", chat);
			callback(chat);
		});
	}
};

export const getChatHistory = (data: GetChatHistoryData, callback: (history: ChatListItem[]) => void) => {
	socket.emit("getChatHistory", data);
	socket.once("chatHistory", (history: unknown) => {
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

	socket.emit("listUserChats", data);

	socket.once("userChats", (result: unknown) => {
		const normalized = unwrapArray<ChatListItem>(result);
		callback(normalized);
	});
};

export const getMessagesByChat = (
	data: GetMessagesData,
	callback: (messages: ChatMessage[]) => void,
) => {
	socket.emit("getMessagesByChat", data);
	socket.once("messagesByChat", (messages: unknown) => {
		const normalized = unwrapArray<ChatMessage>(messages);
		callback(normalized);
	});
};

export const getMessageById = (data: GetMessageData, callback: (message: ChatMessage) => void) => {
	socket.emit("getMessageById", data);
	socket.once("messageById", (message: unknown) => {
		const normalized = unwrapObject<ChatMessage>(message);
		if (normalized) callback(normalized);
	});
};

export const deleteMessage = (data: DeleteMessageData, callback?: (result: { success: boolean }) => void) => {
	socket.emit("deleteMessage", data);
	if (callback) {
		socket.once("messageDeleted", (result: { success: boolean }) => {
			callback(result);
		});
	}
};

export const createChatSocket = (
	data: CreateChatData,
	callback?: (chat: Chat) => void,
) => {
	socket.emit("createChat", data);
	if (callback) {
		socket.once("chatCreated", (chat: Chat) => {
			callback(chat);
		});
	}
};

export const markMessagesAsRead = (chatId: string, userId: string) => {
	socket.emit("markMessagesAsRead", { chatId, userId });
};
