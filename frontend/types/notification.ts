export interface Notification {
  id: string;
  userId: string;
  eventType: 'ENROLLMENT' | 'COURSE_CREATION' | 'CHAT_UPDATE' | 'NEW_MESSAGE' | 'ASSIGNMENT' | 'SYSTEM' | 'PAYMENT' | 'FEEDBACK' | 'ANNOUNCEMENT' | 'COURSE_APPROVED' | 'COURSE_DECLINED' | 'COURSE_ENABLED' | 'COURSE_DISABLED' | 'COURSE_PURCHASED' | 'REVENUE_EARNED' | 'INSTRUCTOR_APPROVED' | 'INSTRUCTOR_DECLINED' | 'USER_DISABLED' | 'USER_ENABLED';
  entityType: 'COURSE' | 'CHAT' | 'USER' | 'ASSIGNMENT' | 'GENERAL' | 'PAYMENT' | 'REVIEW' | 'INSTRUCTOR';
  entityId: string;
  entityName: string;
  message: string;
  link?: string;
  createdAt: string;
  expiresAt: string;
  // Note: isRead field is not present in backend Notification entity
}

export interface NotificationResponse {
  items: Notification[];
  totalCount: number; // Changed from 'total' to match backend DTO
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
