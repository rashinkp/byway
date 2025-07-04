import React, { useState } from "react";
import { EnhancedChatItem } from "@/types/chat";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	MessageSquare,
	Search,
	ChevronLeft,
	Image as ImageIcon,
	Mic,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/auth/useAuth";

interface ChatListProps {
	chats: EnhancedChatItem[];
	selectedChat: EnhancedChatItem | null;
	onSelectChat: (chat: EnhancedChatItem) => void;
	onSearch?: (query: string) => void;
}

export function ChatList({
	chats,
	selectedChat,
	onSelectChat,
	onSearch,
}: ChatListProps) {
	const [searchQuery, setSearchQuery] = useState("");
	const router = useRouter();
	const { user } = useAuth();

	// Separate new chats (type === 'user') and existing chats (type === 'chat')
	const newChats = chats.filter((chat) => chat.type === "user");
	const existingChats = chats.filter((chat) => chat.type === "chat");

	// Determine home path based on user role
	const getHomePath = () => {
		if (!user) return "/";
		if (user.role === "ADMIN") return "/admin";
		if (user.role === "INSTRUCTOR") return "/instructor";
		return "/";
	};

	return (
		<div className="flex flex-col h-full min-h-0 bg-[var(--color-surface)] border-r border-[var(--color-primary-light)]/20">
			{/* Header */}
			<div className="p-4 border-b border-[var(--color-primary-light)]/20">
				<div className="flex items-center justify-between mb-4">
					<div className="flex items-center space-x-2">
						<Button
							variant="ghost"
							size="sm"
							className="h-8 w-8 p-0 mr-1 rounded-full hover:bg-[var(--color-primary-light)]/10"
							onClick={() => router.back()}
							aria-label="Go back"
						>
							<ChevronLeft className="h-5 w-5 text-[var(--color-muted)]" />
						</Button>
						<h2 className="text-lg font-semibold text-[var(--color-primary-dark)] flex items-center gap-2">
							Messages
							<Link
								href={getHomePath()}
								className="text-[var(--color-primary-light)] font-bold text-base ml-2 px-2 py-0.5 hover:text-[var(--color-primary-dark)] transition-colors"
								style={{ letterSpacing: "0.5px" }}
							>
								Byway
							</Link>
						</h2>
					</div>
				</div>

				{/* Search */}
				<div className="relative">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--color-muted)] h-4 w-4" />
					<Input
						placeholder="Search conversations..."
						value={searchQuery}
						onChange={(e) => {
							setSearchQuery(e.target.value);
							if (onSearch) onSearch(e.target.value);
						}}
						className="pl-10 border-[var(--color-primary-light)]/30 focus:border-[var(--color-primary-light)] focus:ring-[var(--color-primary-light)]"
					/>
				</div>
			</div>

			{/* Chat List */}
			<div className="flex-1 overflow-y-auto">
				{chats.length === 0 ? (
					<div className="flex-1 flex items-center justify-center p-8">
						<div className="text-center space-y-3">
							<div className="w-12 h-12 bg-[var(--color-background)] rounded-full flex items-center justify-center mx-auto">
								<MessageSquare className="w-6 h-6 text-[var(--color-muted)]" />
							</div>
							<div>
								<h3 className="font-medium text-[var(--color-primary-dark)] mb-1">
									No conversations
								</h3>
								<p className="text-sm text-[var(--color-muted)]">
									{searchQuery
										? "No conversations match your search."
										: "Your conversations will appear here."}
								</p>
							</div>
						</div>
					</div>
				) : (
					<div className="p-2 space-y-6">
						{/* Existing Chats Section */}
						{existingChats.length > 0 && (
							<div>
								<div className="text-xs font-semibold text-[var(--color-muted)] uppercase mb-2 pl-1">
									Conversations
								</div>
								<div className="space-y-1">
									{existingChats.map((chat) => (
										<div
											key={chat.id}
											onClick={() => onSelectChat(chat)}
											className={`group relative p-3 cursor-pointer transition-colors duration-200 rounded-lg mb-1 ${
												selectedChat?.id === chat.id
													? "bg-[var(--color-primary-light)]/10 border border-[var(--color-primary-light)]/40"
													: "hover:bg-[var(--color-background)]"
											}`}
										>
											<div className="flex items-center space-x-3">
												{/* Avatar */}
												<div className="relative flex-shrink-0">
													<div
														className={`w-10 h-10 bg-[var(--color-primary-light)] rounded-full flex items-center justify-center text-[var(--color-surface)] font-medium text-sm`}
													>
														{(chat.displayName?.charAt(0) || "?").toUpperCase()}
													</div>
												</div>
												{/* Content */}
												<div className="flex-1 min-w-0">
													<div className="flex items-center justify-between mb-1">
														<h3 className="font-medium text-[var(--color-primary-dark)] truncate text-sm">
															{chat.displayName || "Unknown User"}
														</h3>
														{chat.lastMessageTime && (
															<span className="text-xs text-[var(--color-muted)] ml-2 flex-shrink-0">
																{chat.lastMessageTime}
															</span>
														)}
													</div>
													<div className="flex items-center justify-between">
														<p className="text-sm text-[var(--color-muted)] truncate flex-1 mr-2">
															{chat.lastMessage?.imageUrl ? (
																<span className="flex items-center gap-1 text-[var(--color-primary-light)]">
																	<ImageIcon className="w-4 h-4 inline" /> Photo
																</span>
															) : chat.lastMessage?.audioUrl ? (
																<span className="flex items-center gap-1 text-[var(--color-primary-dark)]">
																	<Mic className="w-4 h-4 inline" /> Audio
																</span>
															) : chat.lastMessage?.content ? (
																chat.lastMessage.content
															) : (
																"No messages yet"
															)}
														</p>
														{(chat.unreadCount ?? 0) > 0 && (
															<span className="ml-2 bg-[var(--color-primary-light)] text-[var(--color-surface)] rounded-full px-2 py-0.5 text-xs">
																{chat.unreadCount}
															</span>
														)}
													</div>
													{/* Role Badge (hide for 'user') */}
													{chat.role !== "USER" && (
														<div className="mt-2">
															<Badge
																className={`text-xs px-2 py-0.5 bg-[var(--color-primary-light)]/10 text-[var(--color-primary-light)] rounded-md`}
															>
																{chat.role.charAt(0).toUpperCase() +
																	chat.role.slice(1).toLowerCase()}
															</Badge>
														</div>
													)}
												</div>
											</div>
										</div>
									))}
								</div>
							</div>
						)}
						{/* New Chats Section */}
						{newChats.length > 0 && (
							<div>
								<div className="text-xs font-semibold text-[var(--color-muted)] uppercase mb-2 pl-1">
									Start New Chat
								</div>
								<div className="space-y-1">
									{newChats.map((chat) => (
										<div
											key={chat.id}
											onClick={() => onSelectChat(chat)}
											className={`group relative p-3 cursor-pointer transition-colors duration-200 rounded-lg mb-1  hover:bg-[var(--color-background)]`}
										>
											<div className="flex items-center space-x-3">
												{/* Avatar */}
												<div className="relative flex-shrink-0">
													<div
														className={`w-10 h-10 bg-[var(--color-primary-light)] rounded-full flex items-center justify-center text-[var(--color-surface)] font-medium text-sm`}
													>
														{(chat.displayName?.charAt(0) || "?").toUpperCase()}
													</div>
												</div>
												{/* Content */}
												<div className="flex-1 min-w-0">
													<div className="flex items-center justify-between mb-1">
														<h3 className="font-medium text-[var(--color-primary-dark)] truncate text-sm">
															{chat.displayName || "Unknown User"}
														</h3>
													</div>
													<p className="text-sm text-[var(--color-muted)] truncate flex-1 mr-2">
														Start a new conversation
													</p>
													{/* Role Badge (hide for 'user') */}
													{chat.role !== "USER" && (
														<div className="mt-2">
															<Badge
																className={`text-xs px-2 py-0.5 bg-[var(--color-primary-light)]/10 text-[var(--color-primary-light)] rounded-md`}
															>
																{chat.role.charAt(0).toUpperCase() +
																	chat.role.slice(1).toLowerCase()}
															</Badge>
														</div>
													)}
												</div>
											</div>
										</div>
									))}
								</div>
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
}
