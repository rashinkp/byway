import { NotificationRecord } from "../records/notification.record";

export interface NotificationRepositoryInterface {
  create(notification: NotificationRecord): Promise<NotificationRecord>;
  findById(id: string): Promise<NotificationRecord | null>;
  findByUserId(userId: string): Promise<NotificationRecord[]>;
  deleteById(id: string): Promise<void>;
  deleteExpired(): Promise<number>; // returns number of deleted
  findManyByUserId(options: {
    userId: string;
    skip?: number;
    take?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    eventType?: string;
    search?: string;
  }): Promise<{ items: NotificationRecord[]; total: number; hasMore: boolean; nextPage?: number }>;
}
