export interface IEnrollment {
  userId: string;
  courseId: string;
  enrolledAt: Date;
  accessStatus: "ACTIVE" | "BLOCKED" | "EXPIRED";
  orderId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
