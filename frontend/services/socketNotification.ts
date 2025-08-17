import socket from "@/lib/socket";
import {  NotificationResponse, GetNotificationsData } from "@/types/notification";

export const getUserNotificationsSocket = (
	data: GetNotificationsData,
	callback: (result: NotificationResponse) => void,
) => {
	// Remove any previous listener before adding a new one
	socket.off("userNotifications");
	socket.emit("getUserNotifications", data);
	socket.once(
		"userNotifications",
		(result: NotificationResponse) => {
			callback(result);
		},
	);
};
