export interface EnrollmentRecord {
  userId: string;
  courseId: string;
  orderItemId?: string | null;
  enrolledAt: Date;
  accessStatus: "ACTIVE" | "INACTIVE" | "SUSPENDED";
} 