import socket from "@/lib/socket";
import { ChatMessage, SendMessageData, CreateChatData, GetChatHistoryData, GetMessagesData, GetMessageData, DeleteMessageData } from "@/types/chat";

// Create a logger for the chat service
const createLogger = (prefix: string) => ({
  info: (message: string, data?: any) => {
    console.log(`💬 [${prefix}] ${message}`, data || '');
  },
  warn: (message: string, data?: any) => {
    console.warn(`⚠️ [${prefix}] ${message}`, data || '');
  },
  error: (message: string, data?: any) => {
    console.error(`❌ [${prefix}] ${message}`, data || '');
  },
  debug: (message: string, data?: any) => {
    console.debug(`🔍 [${prefix}] ${message}`, data || '');
  }
});

const logger = createLogger('SocketChat');

export const joinChat = (chatId: string) => {
	logger.info('Joining chat room', {
		chatId,
		socketConnected: socket.connected,
		socketId: socket.id,
		timestamp: new Date().toISOString(),
	});
	
	if (!socket.connected) {
		logger.warn('Cannot join chat room - socket not connected', {
			chatId,
			socketConnected: socket.connected,
			timestamp: new Date().toISOString(),
		});
		return;
	}
	
	socket.emit("joinChat", { chatId });
	logger.info('JoinChat event emitted', {
		chatId,
		socketId: socket.id,
		timestamp: new Date().toISOString(),
	});
	
	// Add a callback to confirm room join
	socket.once("messagesRead", (data: { chatId: string; userId: string }) => {
		if (data.chatId === chatId) {
			logger.info('✅ Successfully joined chat room', {
				chatId,
				socketId: socket.id,
				timestamp: new Date().toISOString(),
			});
		}
	});
};

export const sendMessage = (
	data: SendMessageData,
	onSuccess?: (message: ChatMessage) => void,
	onError?: (error: { message: string }) => void,
) => {
	logger.info('Attempting to send message', {
		chatId: data.chatId,
		userId: data.userId,
		contentLength: data.content?.length || 0,
		socketConnected: socket.connected,
		socketId: socket.id,
		timestamp: new Date().toISOString(),
	});

	if (!socket.connected) {
		const errorMsg = "Socket not connected";
		logger.error('Failed to send message - socket not connected', {
			chatId: data.chatId,
			userId: data.userId,
			timestamp: new Date().toISOString(),
		});
		if (onError) onError({ message: errorMsg });
		return;
	}

	socket.emit("sendMessage", data);

	if (onSuccess) {
		logger.debug('Setting up success callback for message send', {
			chatId: data.chatId,
			userId: data.userId,
			timestamp: new Date().toISOString(),
		});
		
		// Create a specific success handler for this message send operation
		const successHandler = (message: ChatMessage) => {
			logger.info('Message sent successfully', {
				chatId: data.chatId,
				userId: data.userId,
				messageId: message.id,
				timestamp: new Date().toISOString(),
			});
			onSuccess(message);
			// Remove the success listener to prevent it from being called again
			socket.off("messageSent", successHandler);
		};
		
		socket.on("messageSent", successHandler);
		
		// Set a timeout to clean up the success listener if no success occurs
		setTimeout(() => {
			socket.off("messageSent", successHandler);
		}, 5000); // 5 second timeout
	}

	if (onError) {
		logger.debug('Setting up error callback for message send', {
			chatId: data.chatId,
			userId: data.userId,
			timestamp: new Date().toISOString(),
		});
		
		// Create a specific error handler for this message send operation
		const errorHandler = (error: { message: string }) => {
			logger.error('Message send failed', {
				chatId: data.chatId,
				userId: data.userId,
				error: error.message,
				timestamp: new Date().toISOString(),
			});
			logger.debug('Error handler triggered for message send', {
				chatId: data.chatId,
				userId: data.userId,
				errorMessage: error.message,
				timestamp: new Date().toISOString(),
			});
			onError(error);
			// Remove the error listener to prevent it from being called again
			socket.off("error", errorHandler);
		};
		
		socket.on("error", errorHandler);
		
		// Set a timeout to clean up the error listener if no error occurs
		setTimeout(() => {
			socket.off("error", errorHandler);
		}, 5000); // 5 second timeout
	}
};

export const createChat = (
	data: CreateChatData,
	callback?: (chat: any) => void,
) => {
	logger.info('Attempting to create chat', {
		user1Id: data.user1Id,
		user2Id: data.user2Id,
		socketConnected: socket.connected,
		socketId: socket.id,
		timestamp: new Date().toISOString(),
	});

	if (!socket.connected) {
		logger.error('Failed to create chat - socket not connected', {
			user1Id: data.user1Id,
			user2Id: data.user2Id,
			timestamp: new Date().toISOString(),
		});
		return;
	}

	socket.emit("createChat", data);

	if (callback) {
		logger.debug('Setting up callback for chat creation', {
			user1Id: data.user1Id,
			user2Id: data.user2Id,
			timestamp: new Date().toISOString(),
		});
		socket.once("chatCreated", (chat: any) => {
			logger.info('Chat created successfully', {
				chatId: chat.id,
				user1Id: data.user1Id,
				user2Id: data.user2Id,
				timestamp: new Date().toISOString(),
			});
			callback(chat);
		});
	}
};

export const getChatHistory = (
	data: GetChatHistoryData,
	callback?: (chats: any[]) => void,
) => {
	logger.info('Requesting chat history', {
		page: data.page,
		limit: data.limit,
		search: data.search,
		socketConnected: socket.connected,
		socketId: socket.id,
		timestamp: new Date().toISOString(),
	});

	if (!socket.connected) {
		logger.error('Failed to get chat history - socket not connected', {
			timestamp: new Date().toISOString(),
		});
		return;
	}

	socket.emit("getChatHistory", data);

	if (callback) {
		logger.debug('Setting up callback for chat history', {
			timestamp: new Date().toISOString(),
		});
		socket.once("chatHistory", (chats: any[]) => {
			logger.info('Chat history received', {
				chatCount: chats.length,
				timestamp: new Date().toISOString(),
			});
			callback(chats);
		});
	}
};

export const getMessagesByChat = (
	data: GetMessagesData,
	callback?: (messages: ChatMessage[]) => void,
) => {
	logger.info('Requesting messages by chat', {
		chatId: data.chatId,
		limit: data.limit,
		beforeMessageId: data.beforeMessageId,
		socketConnected: socket.connected,
		socketId: socket.id,
		timestamp: new Date().toISOString(),
	});

	if (!socket.connected) {
		logger.error('Failed to get messages - socket not connected', {
			chatId: data.chatId,
			timestamp: new Date().toISOString(),
		});
		return;
	}

	socket.emit("getMessagesByChat", data);

	if (callback) {
		logger.debug('Setting up callback for messages', {
			chatId: data.chatId,
			timestamp: new Date().toISOString(),
		});
		socket.once("messagesByChat", (messages: ChatMessage[]) => {
			logger.info('Messages received', {
				chatId: data.chatId,
				messageCount: messages.length,
				timestamp: new Date().toISOString(),
			});
			callback(messages);
		});
	}
};

export const getMessageById = (
	data: GetMessageData,
	callback?: (message: ChatMessage) => void,
) => {
	logger.info('Requesting message by ID', {
		messageId: data.messageId,
		socketConnected: socket.connected,
		socketId: socket.id,
		timestamp: new Date().toISOString(),
	});

	if (!socket.connected) {
		logger.error('Failed to get message - socket not connected', {
			messageId: data.messageId,
			timestamp: new Date().toISOString(),
		});
		return;
	}

	socket.emit("getMessageById", data);

	if (callback) {
		logger.debug('Setting up callback for message', {
			messageId: data.messageId,
			timestamp: new Date().toISOString(),
		});
		socket.once("messageById", (message: ChatMessage) => {
			logger.info('Message received', {
				messageId: data.messageId,
				chatId: message.chatId,
				timestamp: new Date().toISOString(),
			});
			callback(message);
		});
	}
};

export const deleteMessage = (
	data: DeleteMessageData,
	callback?: (success: boolean) => void,
) => {
	logger.info('Attempting to delete message', {
		messageId: data.messageId,
		chatId: data.chatId,
		socketConnected: socket.connected,
		socketId: socket.id,
		timestamp: new Date().toISOString(),
	});

	if (!socket.connected) {
		logger.error('Failed to delete message - socket not connected', {
			messageId: data.messageId,
			timestamp: new Date().toISOString(),
		});
		return;
	}

	socket.emit("deleteMessage", data);

	if (callback) {
		logger.debug('Setting up callback for message deletion', {
			messageId: data.messageId,
			timestamp: new Date().toISOString(),
		});
		socket.once("messageDeleted", (success: boolean) => {
			logger.info('Message deletion result', {
				messageId: data.messageId,
				success,
				timestamp: new Date().toISOString(),
			});
			callback(success);
		});
	}
};

export const createChatSocket = (
	data: CreateChatData,
	callback?: (chat: any) => void,
) => {
	socket.emit("createChat", data);
	if (callback) {
		socket.once("chatCreated", callback);
	}
};

export const markMessagesAsRead = (chatId: string, userId: string) => {
	socket.emit("markMessagesAsRead", { chatId, userId });
};

export const listUserChats = (
	data: GetChatHistoryData = {},
	callback: (result: any[]) => void,
) => {
	logger.info('Requesting user chats', {
		page: data.page,
		limit: data.limit,
		search: data.search,
		socketConnected: socket.connected,
		socketId: socket.id,
		timestamp: new Date().toISOString(),
	});

	if (!socket.connected) {
		logger.error('Failed to get user chats - socket not connected', {
			timestamp: new Date().toISOString(),
		});
		return;
	}

	socket.emit("listUserChats", data);

	socket.once("userChats", (result: any[]) => {
		logger.info('User chats received', {
			chatCount: result?.length || 0,
			resultType: typeof result,
			isArray: Array.isArray(result),
			timestamp: new Date().toISOString(),
		});
		callback(result || []);
	});
};
