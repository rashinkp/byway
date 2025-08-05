import { NotificationRecord } from "../records/notification.record";

export interface NotificationRepositoryInterface {
  create(notification: NotificationRecord): Promise<NotificationRecord>;
  findById(id: string): Promise<NotificationRecord | null>;
  findByUserId(userId: string): Promise<NotificationRecord[]>;
  update(notification: NotificationRecord): Promise<NotificationRecord>;
  delete(id: string): Promise<void>;
  markAsRead(id: string): Promise<NotificationRecord>;
  markAllAsRead(userId: string): Promise<void>;
  findPaginated(options: {
    userId: string;
    page?: number;
    limit?: number;
    isRead?: boolean;
  }): Promise<{ items: NotificationRecord[]; total: number; hasMore: boolean; nextPage?: number }>;
}
