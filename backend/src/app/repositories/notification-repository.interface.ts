import { Notification } from "../../domain/entities/notification.entity";
import { NotificationDTO } from "../dtos/notification.dto";

export interface NotificationRepositoryInterface {
  create(notification: Notification): Promise<NotificationDTO>;
  findById(id: string): Promise<NotificationDTO | null>;
  findByUserId(userId: string): Promise<NotificationDTO[]>;
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
  }): Promise<{
    items: NotificationDTO[];
    total: number;
    hasMore: boolean;
    nextPage?: number;
  }>;
}
