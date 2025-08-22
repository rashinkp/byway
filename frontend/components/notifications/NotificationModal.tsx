import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import NotificationList, { Notification as NotificationListType } from "./NotificationList";
import { useNotificationSocket } from "@/hooks/notification/useNotificationSocket";
import { Notification as ApiNotification } from "@/types/notification";
import React, { useRef, useEffect } from "react";

interface NotificationModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

const NotificationModal: React.FC<NotificationModalProps> = ({
	open,
	onOpenChange,
}) => {
	const {
		notifications,
		loading,
		hasMore,
		total,
		page,
		setSearch,
		search,
		setSortBy,
		sortBy,
		setSortOrder,
		sortOrder,
		setEventType,
		eventType,
		loadMore,
		refetch,
	} = useNotificationSocket();

	// Convert API notifications to component notifications
	const convertedNotifications: NotificationListType[] = notifications.map((notification: ApiNotification) => ({
		id: notification.id,
		title: notification.entityName,
		message: notification.message,
		date: notification.createdAt,
		eventType: notification.eventType,
	}));

	// Only call refetch when modal transitions from closed to open
	const prevOpen = useRef(open);
	useEffect(() => {
		if (!prevOpen.current && open) {
			refetch();
		}
		prevOpen.current = open;
	}, [open, refetch]);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogOverlay className="bg-black/50 backdrop-blur-sm" />
			<DialogContent className="max-w-2xl w-[95vw] h-[85vh] max-h-[700px] p-0 bg-white dark:bg-[#18181b] rounded-2xl shadow-2xl border-none overflow-hidden flex flex-col">
				<DialogTitle className="sr-only">Notifications Center</DialogTitle>


				{/* Modal content with full height */}
				<div className="flex flex-col h-full">
					<NotificationList
						notifications={convertedNotifications}
						loading={loading}
						hasMore={hasMore}
						total={total}
						page={page}
						setSearch={setSearch}
						search={search}
						setSortBy={setSortBy}
						sortBy={sortBy}
						setSortOrder={setSortOrder}
						sortOrder={sortOrder}
						setEventType={setEventType}
						eventType={eventType}
						loadMore={loadMore}
						onNotificationClick={() => onOpenChange(false)}
					/>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default NotificationModal;
