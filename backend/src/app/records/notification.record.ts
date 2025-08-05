export interface NotificationRecord {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "COURSE_APPROVAL" | "COURSE_DECLINE" | "COURSE_ENABLE" | "COURSE_DISABLE" | "COURSE_PURCHASE" | "REVENUE" | "GENERAL";
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
} 