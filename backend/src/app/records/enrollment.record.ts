import { AccessStatus } from "@prisma/client";

export interface EnrollmentRecord {
  userId: string;
  courseId: string;
  orderItemId?: string | null;
  enrolledAt: Date;
  accessStatus: AccessStatus;
} 