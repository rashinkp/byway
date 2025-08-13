import { Notification } from "../../domain/entities/notification.entity";
import { PaginatedNotificationList } from "../../domain/types/notification.interface";

export interface NotificationRepositoryInterface {
	create(notification: Notification): Promise<Notification>;
	findById(id: string): Promise<Notification | null>;
	findByUserId(userId: string): Promise<Notification[]>;
	deleteById(id: string): Promise<void>;
	deleteExpired(): Promise<number>; // returns number of deleted
	// Add more query methods as needed
	findManyByUserId(options: {
		userId: string;
		skip?: number;
		take?: number;
		sortBy?: string;
		sortOrder?: "asc" | "desc";
		eventType?: string;
		search?: string;
	}): Promise<PaginatedNotificationList>;
}
