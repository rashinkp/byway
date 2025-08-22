export interface Notification {
  id: string;
  userId: string;
  eventType: string;
  entityType: string;
  entityId: string;
  entityName: string;
  message: string;
  link?: string;
  createdAt: string;
  expiresAt?: string;
  isRead?: boolean;
}

export interface NotificationResponse {
  items: Notification[];
  total: number;
  hasMore: boolean;
  nextPage?: number;
}

export interface GetNotificationsData {
  userId: string;
  skip?: number;
  take?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  eventType?: string;
  search?: string;
}
