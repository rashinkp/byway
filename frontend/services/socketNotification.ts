import socket from "@/lib/socket";

export const getUserNotificationsSocket = (
	data: {
		userId: string;
		skip?: number;
		take?: number;
		sortBy?: string;
		sortOrder?: "asc" | "desc";
		eventType?: string;
		search?: string;
	},
	callback: (result: {
		items: any[];
		total: number;
		hasMore: boolean;
		nextPage?: number;
	}) => void,
) => {
	// Remove any previous listener before adding a new one
	socket.off("userNotifications");
	socket.emit("getUserNotifications", data);
	socket.once(
		"userNotifications",
		(result: {
			items: any[];
			total: number;
			hasMore: boolean;
			nextPage?: number;
		}) => {
			callback(result);
		},
	);
};
