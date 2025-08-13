import { Notification } from "../entities/notification.entity";

export interface PaginatedNotificationList {
	items: Notification[];
	total: number;
	hasMore: boolean;
	nextPage?: number;
}
