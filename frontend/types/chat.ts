export interface Chat {
	id: string;
	userName: string;
	userRole: "user" | "instructor" | "admin";
	lastMessage: string;
	lastMessageTime: string;
	unreadCount: number;
	avatar: string;
}

// Enhanced chat list item for the new structure
export interface EnhancedChatItem {
	id: string;
	type: "chat" | "user"; // 'chat' for existing chats, 'user' for other users
	displayName: string;
	avatar?: string;
	role: string;
	lastMessage?: {
		content?: string;
		imageUrl?: string;
		audioUrl?: string;
		type: "text" | "image" | "audio";
	};
	lastMessageTime?: string;
	unreadCount?: number;
	userId?: string; // For user items, this is the other user's ID
	chatId?: string; // For chat items, this is the chat ID
	isOnline?: boolean;
}

// Paginated chat list response
export interface PaginatedChatList {
	items: EnhancedChatItem[];
	totalCount: number;
	hasMore: boolean;
	nextPage?: number;
}

export interface Message {
	id: string;
	chatId: string;
	senderId: string;
	receiverId: string;
	content?: string;
	imageUrl?: string;
	audioUrl?: string;
	isRead: boolean;
	timestamp: string;
}
