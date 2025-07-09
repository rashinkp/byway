"use client";
import { useEffect } from "react";
import { toast } from "sonner";
import socket, { getToken, safeSocketConnect } from "../lib/socket";
import { useAuth } from "@/hooks/auth/useAuth";
import { Bell } from "lucide-react";

interface SocketNotification {
	message: string;
	type?: string;
	eventType?: string;
	courseId?: string;
	courseTitle?: string;
	amount?: number;
	chatId?: string;
	messageId?: string;
	senderId?: string;
	receiverId?: string;
	timestamp?: string;
}

export default function SocketProvider() {
	const { user } = useAuth();

	useEffect(() => {
		// Reference socket to ensure it's not tree-shaken
		if (socket) {
			console.log("[SocketProvider] Socket instance:", socket);
		}
	}, []);

	useEffect(() => {
		if (user?.id) {
			socket.auth = { token: getToken() };
			safeSocketConnect();
		}
	}, [user?.id]);

	useEffect(() => {
		if (!user?.id) return;

		const handleNewNotification = (notification: SocketNotification) => {
			// Get the notification type from either 'type' or 'eventType' field
			const notificationType = notification.type || notification.eventType;

			// Skip if no type is provided
			if (!notificationType) {
				console.warn(
					"[SocketProvider] Received notification without type:",
					notification,
				);
				return;
			}

			// Create custom toast that matches notification modal design
			const toastContent = (
				<div className="flex gap-4 p-4">
					{/* Avatar */}
					<div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
						<Bell className="w-4 h-4 text-white" />
					</div>

					{/* Content */}
					<div className="flex-1 min-w-0">
						<div className="flex items-start justify-between gap-3 mb-2">
							<h4 className="font-semibold text-gray-900 text-sm line-clamp-1">
								{getNotificationTitle(notificationType)}
							</h4>
							<span className="text-xs text-gray-500 whitespace-nowrap font-medium">
								Just now
							</span>
						</div>

						<p className="text-gray-600 text-xs leading-relaxed line-clamp-2 mb-2">
							{notification.message}
						</p>

						{/* Badge */}
					</div>
				</div>
			);

			// Show toast with custom content
			toast.custom(
				() => (
					<div
						className="bg-white border border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer max-w-sm"
						onClick={() => {
							// Navigate based on notification type and user role
							handleNotificationClick(notification, user.role);
						}}
					>
						{toastContent}
					</div>
				),
				{
					duration: 6000,
					position: "top-right",
				},
			);
		};

		// Listen for new notifications
		socket.on("newNotification", handleNewNotification);

		// Cleanup
		return () => {
			socket.off("newNotification", handleNewNotification);
		};
	}, [user?.id, user?.role]);

	return <div style={{ display: "none" }} id="socket-provider" />;
}

// Helper function to get notification title
function getNotificationTitle(type: string): string {
	switch (type) {
		case "REVENUE_EARNED":
			return "Revenue Earned";
		case "COURSE_PURCHASED":
			return "Course Purchased";
		case "COURSE_APPROVED":
			return "Course Approved";
		case "COURSE_DECLINED":
			return "Course Declined";
		case "COURSE_ENABLED":
			return "Course Enabled";
		case "COURSE_DISABLED":
			return "Course Disabled";
		case "COURSE_CREATION":
			return "New Course Created";
		case "NEW_MESSAGE":
			return "New Message";
		case "INSTRUCTOR_APPROVED":
			return "Instructor Approved";
		case "INSTRUCTOR_DECLINED":
			return "Instructor Declined";
		case "USER_DISABLED":
			return "Account Disabled";
		case "USER_ENABLED":
			return "Account Enabled";
		default:
			return "New Notification";
	}
}

// Helper function to handle notification clicks
function handleNotificationClick(
	notification: SocketNotification,
	userRole: string,
) {
	const notificationType = notification.type || notification.eventType;

	if (!notificationType) {
		console.warn(
			"[SocketProvider] Cannot handle notification click - no type found",
		);
		return;
	}

	switch (notificationType) {
		case "REVENUE_EARNED":
			if (userRole === "ADMIN") {
				window.location.href = "/admin/wallet";
			} else if (userRole === "INSTRUCTOR") {
				window.location.href = "/instructor/wallet";
			} else {
				window.location.href = "/user/profile?section=wallet";
			}
			break;
		case "COURSE_PURCHASED":
			window.location.href = "/user/profile?section=courses";
			break;
		case "COURSE_APPROVED":
		case "COURSE_DECLINED":
			if (notification.courseId) {
				window.location.href = `/instructor/courses/${notification.courseId}`;
			}
			break;
		case "COURSE_ENABLED":
		case "COURSE_DISABLED":
			if (notification.courseId) {
				const coursePath =
					userRole === "ADMIN"
						? `/admin/courses/${notification.courseId}`
						: `/instructor/courses/${notification.courseId}`;
				window.location.href = coursePath;
			}
			break;
		case "COURSE_CREATION":
			if (notification.courseId) {
				window.location.href = `/admin/courses/${notification.courseId}`;
			}
			break;
		case "NEW_MESSAGE":
			if (notification.chatId) {
				window.location.href = `/chat`;
			}
			break;
		case "INSTRUCTOR_APPROVED":
			window.location.href = "/instructor/dashboard";
			break;
		case "INSTRUCTOR_DECLINED":
			window.location.href = "/instructor/apply";
			break;
		case "USER_DISABLED":
			window.location.href = "/login";
			break;
		case "USER_ENABLED":
			window.location.href = "/login";
			break;
	}
}
