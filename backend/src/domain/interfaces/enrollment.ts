export interface EnrollmentProps {
  id: string;
  userId: string;
  courseId: string;
  enrolledAt: Date;
  orderItemId?: string | null;
  accessStatus: "ACTIVE" | "BLOCKED" | "EXPIRED";
  updatedAt: Date;
  deletedAt?: Date | null;
}
